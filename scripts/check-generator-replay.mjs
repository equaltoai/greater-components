#!/usr/bin/env node
/**
 * Deterministic generator-replay gate.
 *
 * Replays every generator that produces committed artifacts and fails when the
 * replay leaves a diff, so committed generated output is always reproducible
 * generator output rather than a hand-edit. The scope is the derived adapters:
 *
 *   - `generate:graphql`  — codegen (types.ts, introspection, possible-types)
 *   - `generate:openapi`  — openapi-typescript REST client (Lesser)
 *   - `generate:openapi:lesser-host` — Lesser Host REST client
 *   - `generate:adapter-declarations` — committed `.d.ts` / `.d.ts.map` files
 *
 * The registry index is intentionally excluded: it is timestamped and has its
 * own freshness gate (`generate-registry-index.js --check` via
 * `pnpm validate:registry`).
 *
 * The gate also enforces the codegen dependency constraint: the v6 range of
 * `@graphql-codegen/typescript` / `typescript-operations` re-emits enum/input
 * types into the same output file as the `typescript` plugin, producing
 * TS2300 duplicate identifiers on every regeneration
 * (dotansimha/graphql-code-generator#10782, open upstream). Both packages are
 * overridden to `<6.0.0` in root `package.json` `pnpm.overrides`; this script
 * verifies the override exists and that every resolved lockfile version is v5.
 * Once upstream fixes the double emission, the override and this check can be
 * lifted together.
 *
 * The working tree is restored afterwards (tracked changes via `git restore`,
 * replay-created untracked files removed) so a failing local run leaves no
 * clutter; the diff is printed first so the failure is actionable.
 */

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MAX_BUFFER = 128 * 1024 * 1024;

const GENERATED_ROOTS = [
	'packages/adapters/src',
	'packages/faces/social/src/adapters/graphql/generated',
];

const GENERATOR_STEPS = [
	['pnpm', ['generate:graphql']],
	['pnpm', ['generate:openapi']],
	['pnpm', ['generate:openapi:lesser-host']],
	['pnpm', ['generate:adapter-declarations']],
];

const CODENGE_PACKAGES = ['@graphql-codegen/typescript', '@graphql-codegen/typescript-operations'];

const UPSTREAM_ISSUE = 'dotansimha/graphql-code-generator#10782';

function run(command, args) {
	const result = spawnSync(command, args, {
		cwd: ROOT,
		encoding: 'utf8',
		maxBuffer: MAX_BUFFER,
		env: { ...process.env, CI: '1', GIT_TERMINAL_PROMPT: '0' },
		stdio: ['ignore', 'pipe', 'pipe'],
	});
	return {
		status: result.status,
		stdout: String(result.stdout ?? ''),
		stderr: String(result.stderr ?? ''),
		error: result.error,
	};
}

function git(args) {
	return run('git', args);
}

function checkCodegenConstraint() {
	const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
	const overrides = pkg.pnpm?.overrides ?? {};
	const errors = [];

	for (const name of CODENGE_PACKAGES) {
		const override = overrides[name];
		if (typeof override !== 'string' || !/^<6(\.|$)/.test(override.trim())) {
			errors.push(
				`${name} must be overridden to <6.0.0 in package.json pnpm.overrides (found ${JSON.stringify(override)}) while ${UPSTREAM_ISSUE} is open`
			);
		}
	}

	const lockfile = readFileSync(join(ROOT, 'pnpm-lock.yaml'), 'utf8');
	for (const name of CODENGE_PACKAGES) {
		const resolved = new Set(
			[
				...lockfile.matchAll(
					new RegExp(`@graphql-codegen/(typescript|typescript-operations)@(\\d+)\\.`, 'gm')
				),
			].map((match) => Number(match[2]))
		);
		const majors = [...resolved].sort((a, b) => a - b);
		if (majors.length === 0) {
			errors.push(`${name} has no resolved version in pnpm-lock.yaml`);
		} else if (majors.some((major) => major >= 6)) {
			errors.push(
				`${name} resolves to a v${majors.filter((major) => major >= 6).join(', v')} in pnpm-lock.yaml; the v6 range is rejected while ${UPSTREAM_ISSUE} is open (resolved majors: ${majors.join(', ')})`
			);
		}
	}

	return errors;
}

function replayGenerators() {
	const failures = [];
	for (const [command, args] of GENERATOR_STEPS) {
		const label = `${command} ${args.join(' ')}`;
		const result = run(command, args);
		if (result.error) {
			failures.push(`${label} failed to start: ${result.error.message}`);
		} else if (result.status !== 0) {
			failures.push(`${label} exited ${result.status}`);
		}
	}
	return failures;
}

function diffAfterReplay() {
	const names = git(['diff', '--name-only', '--', ...GENERATED_ROOTS]);
	const porcelain = git(['status', '--porcelain', '--', ...GENERATED_ROOTS]);
	const untracked = porcelain.stdout
		.split('\n')
		.filter((line) => line.startsWith('?? '))
		.map((line) => line.slice(3).trim())
		.filter(Boolean);

	if (names.status !== 0 || porcelain.status !== 0) return null;

	const changed = names.stdout
		.split('\n')
		.filter(Boolean)
		.filter((name) => name.length > 0);
	const changedList = [...new Set([...changed, ...untracked])];

	if (changedList.length === 0) return { changed: [], diff: '' };

	const diff = git(['diff', '--stat', '--', ...changed]);
	const fullDiff = git(['diff', '--', ...changed]);
	const detail = [diff.stdout, fullDiff.stdout].filter(Boolean).join('\n');

	// Restore the tree so a failed local run leaves no generated clutter.
	git(['restore', '--source=HEAD', '--', ...changed]);
	for (const file of untracked) {
		run('rm', ['-f', join(ROOT, file)]);
	}

	return { changed: changedList, diff: detail };
}

const codegenErrors = checkCodegenConstraint();
const replayErrors = replayGenerators();
const replayDiff = diffAfterReplay();

const problems = [
	...(codegenErrors.length > 0
		? ['Codegen dependency constraint:', ...codegenErrors.map((e) => `  - ${e}`)]
		: []),
	...(replayErrors.length > 0
		? ['Generator replay failed:', ...replayErrors.map((e) => `  - ${e}`)]
		: []),
	...(replayDiff && replayDiff.changed.length > 0
		? [
				`Generator replay left ${replayDiff.changed.length} file(s) different from the committed artifacts:`,
				replayDiff.diff,
			]
		: []),
];

if (problems.length > 0) {
	console.error(`check-generator-replay FAILED\n\n${problems.join('\n')}`);
	process.exit(1);
}

console.log(
	'Generator replay clean: codegen, openapi, lesser-host openapi, and adapter declarations regenerate byte-identically; ' +
		`codegen plugins constrained to v5 (${UPSTREAM_ISSUE}).`
);
