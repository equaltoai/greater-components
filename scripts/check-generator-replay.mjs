#!/usr/bin/env node
/**
 * Deterministic generator-replay gate (fail-safe).
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
 * verifies the override exists for each package and that every resolved
 * lockfile version is v5, matching each package's own lockfile entries
 * independently (a `typescript` v6 entry cannot pass on a `typescript-operations`
 * v5 entry or vice versa). Once upstream fixes the double emission, the
 * override and this check can be lifted together.
 *
 * Safety contract (replay must never destroy developer WIP):
 *
 *   1. **Refuse before mutation.** If any pre-existing tracked or untracked
 *      change exists under the generated roots (the trees the generators
 *      rewrite and this gate restores), the gate refuses to run and exits
 *      non-zero without touching the working tree. No generator runs, so WIP
 *      can never be overwritten or deleted.
 *   2. **Restore only replay-created changes.** Because (1) guarantees the
 *      roots were clean when the replay started, every change observed after
 *      the replay is replay-created: tracked modifications are restored with
 *      `git restore`, and replay-created untracked files *and directories* are
 *      removed with a roots-scoped `git clean -fd`. Cleanup exit codes are
 *      checked and a final `git status` must come back clean; any cleanup
 *      failure is reported and fails the gate loudly.
 *   3. **Explicit platform gate.** Only POSIX platforms (linux/darwin) are
 *      supported; on any other platform the gate refuses with a clear message
 *      before doing anything. `git` and `pnpm` must be on PATH, otherwise the
 *      gate fails with a diagnostic instead of a half-run.
 *
 * The tree is restored even when a generator itself fails mid-write, so a
 * failed local run leaves no generated clutter.
 */

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

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

const CODEGEN_PACKAGES = ['@graphql-codegen/typescript', '@graphql-codegen/typescript-operations'];

const UPSTREAM_ISSUE = 'dotansimha/graphql-code-generator#10782';

// POSIX only: the gate spawns git + pnpm and rewrites files under
// GENERATED_ROOTS. Windows is not a supported CI/dev target; the fail-safe
// result is a clear refusal before anything mutates.
const SUPPORTED_PLATFORMS = ['linux', 'darwin'];

const PREREQUISITES = [
	['git', ['--version']],
	['pnpm', ['--version']],
];

export function run(command, args, { cwd = ROOT, env = {} } = {}) {
	const result = spawnSync(command, args, {
		cwd,
		encoding: 'utf8',
		maxBuffer: MAX_BUFFER,
		env: { ...process.env, CI: '1', GIT_TERMINAL_PROMPT: '0', ...env },
		stdio: ['ignore', 'pipe', 'pipe'],
	});
	return {
		status: result.status,
		stdout: String(result.stdout ?? ''),
		stderr: String(result.stderr ?? ''),
		error: result.error,
	};
}

export function git(args, opts = {}) {
	return run('git', args, opts);
}

function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function checkPlatform() {
	const platform = process.platform;
	if (!SUPPORTED_PLATFORMS.includes(platform)) {
		return [
			`unsupported platform "${platform}"; supported platforms: ${SUPPORTED_PLATFORMS.join(', ')}`,
		];
	}
	return [];
}

export function checkPrerequisites() {
	const errors = [];
	for (const [command, args] of PREREQUISITES) {
		const result = run(command, args);
		if (result.error) {
			errors.push(`${command} is not executable: ${result.error.message}`);
		} else if (result.status !== 0) {
			errors.push(`${command} is not on PATH or failed to run (exit ${result.status})`);
		}
	}
	return errors;
}

export function checkCodegenConstraint({ packageJson, lockfile } = {}) {
	const pkg = JSON.parse(packageJson ?? readFileSync(join(ROOT, 'package.json'), 'utf8'));
	const lockfileText = lockfile ?? readFileSync(join(ROOT, 'pnpm-lock.yaml'), 'utf8');
	const overrides = pkg.pnpm?.overrides ?? {};
	const errors = [];

	for (const name of CODEGEN_PACKAGES) {
		const override = overrides[name];
		if (typeof override !== 'string' || !/^<6(\.|$)/.test(override.trim())) {
			errors.push(
				`${name} must be overridden to <6.0.0 in package.json pnpm.overrides (found ${JSON.stringify(override)}) while ${UPSTREAM_ISSUE} is open`
			);
		}
	}

	// Match each plugin's own lockfile entries only: the pattern is anchored on
	// the exact package name followed by '@', so `@graphql-codegen/typescript`
	// never matches `@graphql-codegen/typescript-operations@…` entries and vice
	// versa — each plugin is proven independently.
	for (const name of CODEGEN_PACKAGES) {
		const resolved = new Set(
			[...lockfileText.matchAll(new RegExp(`${escapeRegExp(name)}@(\\d+)\\.`, 'g'))].map((match) =>
				Number(match[1])
			)
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

export function collectDirt({ cwd = ROOT, roots = GENERATED_ROOTS, gitFn = git } = {}) {
	const porcelain = gitFn(['status', '--porcelain', '--untracked-files=all', '--', ...roots], {
		cwd,
	});
	if (porcelain.status !== 0 || porcelain.error) {
		return { error: `git status failed: ${porcelain.stderr || porcelain.error?.message}` };
	}
	const entries = porcelain.stdout
		.split('\n')
		.filter(Boolean)
		.map((line) => ({ code: line.slice(0, 2), path: line.slice(3).trim() }))
		.filter((entry) => entry.path.length > 0);
	return { entries };
}

function replayGenerators() {
	const failures = [];
	for (const [command, args] of GENERATOR_STEPS) {
		const label = `${command} ${args.join(' ')}`;
		const result = run(command, args);
		if (result.error) {
			failures.push(`${label} failed to start: ${result.error.message}`);
		} else if (result.status !== 0) {
			failures.push(
				`${label} exited ${result.status}:\n${result.stdout}\n${result.stderr}`.trimEnd()
			);
		}
	}
	return failures;
}

export function diffAfterReplay({ cwd = ROOT, roots = GENERATED_ROOTS, gitFn = git } = {}) {
	const names = gitFn(['diff', '--name-only', '--', ...roots], { cwd });
	const porcelain = gitFn(['status', '--porcelain', '--untracked-files=all', '--', ...roots], {
		cwd,
	});
	if (names.status !== 0 || porcelain.status !== 0) {
		return {
			error: `git diff/status failed: ${names.stderr}${porcelain.stderr}`,
		};
	}

	const changed = names.stdout
		.split('\n')
		.filter(Boolean)
		.filter((name) => name.length > 0);
	const untracked = porcelain.stdout
		.split('\n')
		.filter((line) => line.startsWith('?? '))
		.map((line) => line.slice(3).trim())
		.filter(Boolean);
	const changedList = [...new Set([...changed, ...untracked])];

	if (changedList.length === 0) return { changed: [], diff: '' };

	const diff = gitFn(['diff', '--stat', '--', ...changed], { cwd });
	const fullDiff = gitFn(['diff', '--', ...changed], { cwd });
	const detail = [diff.stdout, fullDiff.stdout].filter(Boolean).join('\n');

	return { changed: changedList, diff: detail };
}

/**
 * Restore only replay-created changes under the generated roots. Because the
 * gate refuses to run when the roots were dirty before the replay, every
 * change observed here is replay-created. Tracked modifications are restored
 * to HEAD; replay-created untracked files and directories are removed with a
 * roots-scoped `git clean -fd`. All cleanup errors are surfaced, and a final
 * status check must be clean — otherwise the gate fails loudly.
 */
export function restoreReplayDirt({ cwd = ROOT, roots = GENERATED_ROOTS, gitFn = git } = {}) {
	const errors = [];
	const status = gitFn(['status', '--porcelain', '--untracked-files=all', '--', ...roots], {
		cwd,
	});
	if (status.status !== 0 || status.error) {
		return [`cannot inspect replay dirt for cleanup: ${status.stderr || status.error?.message}`];
	}

	const tracked = [];
	const untracked = [];
	for (const line of status.stdout.split('\n').filter(Boolean)) {
		const code = line.slice(0, 2);
		const path = line.slice(3).trim();
		if (!path) continue;
		if (code.trim() === '??') untracked.push(path);
		else tracked.push(path);
	}

	if (tracked.length > 0) {
		const restored = gitFn(['restore', '--source=HEAD', '--', ...tracked], { cwd });
		if (restored.status !== 0 || restored.error) {
			errors.push(
				`failed to restore replay-created tracked changes (${tracked.join(', ')}): ${
					restored.stderr || restored.error?.message
				}`
			);
		}
	}

	if (untracked.length > 0) {
		// `git clean -fd` removes replay-created untracked files and directories
		// (incl. nested) under the roots; scoping with `--` keeps it exact. Only
		// non-ignored untracked entries are removed, and refusal guaranteed none
		// of them pre-existed the replay.
		const cleaned = gitFn(['clean', '-fd', '--', ...roots], { cwd });
		if (cleaned.status !== 0 || cleaned.error) {
			errors.push(
				`failed to remove replay-created untracked files/directories: ${
					cleaned.stderr || cleaned.error?.message
				}`
			);
		}
	}

	const after = gitFn(['status', '--porcelain', '--untracked-files=all', '--', ...roots], { cwd });
	if (after.status !== 0 || after.error) {
		errors.push(`cannot verify cleanup: ${after.stderr || after.error?.message}`);
	} else if (after.stdout.trim().length > 0) {
		errors.push(`cleanup left dirt under the generated roots:\n${after.stdout.trim()}`);
	}

	return errors;
}

function main() {
	const problems = [
		...checkPlatform().map((e) => `Platform: ${e}`),
		...checkPrerequisites().map((e) => `Prerequisites: ${e}`),
		...checkCodegenConstraint().map((e) => `Codegen dependency constraint: ${e}`),
	];

	// Platform, prerequisite, and dependency-constraint problems are fail-safe
	// and must stop the gate before any generator mutates the tree.
	if (problems.length > 0) printAndExit(problems);

	const dirt = collectDirt();
	if (dirt.error) {
		problems.push(`Cannot inspect working tree before replay: ${dirt.error}`);
		printAndExit(problems);
	}
	if (dirt.entries.length > 0) {
		console.error(
			'check-generator-replay REFUSED\n\n' +
				'Refusing to run generator replay: pre-existing working-tree changes under the ' +
				'generated roots would be overwritten by the generators and must never be destroyed:\n' +
				dirt.entries.map((entry) => `  ${entry.code} ${entry.path}`).join('\n') +
				'\n\nStash, commit, or move these changes out of the generated roots, then re-run.'
		);
		process.exit(1);
	}

	const replayErrors = replayGenerators();
	problems.push(...replayErrors.map((e) => `Generator replay failed: ${e}`));

	const replayDiff = diffAfterReplay();
	if (replayDiff.error) {
		problems.push(`Cannot diff after replay: ${replayDiff.error}`);
	} else if (replayDiff.changed.length > 0) {
		problems.push(
			`Generator replay left ${replayDiff.changed.length} file(s) different from the committed artifacts:`,
			replayDiff.diff
		);
	}

	// Always restore (even when a generator failed mid-write) so a failed local
	// run leaves no generated clutter; cleanup failures fail the gate loudly.
	problems.push(...restoreReplayDirt().map((e) => `Cleanup after replay failed: ${e}`));

	printAndExit(problems);
}

function printAndExit(problems) {
	if (problems.length > 0) {
		console.error(`check-generator-replay FAILED\n\n${problems.join('\n')}`);
		process.exit(1);
	}
	console.log(
		'Generator replay clean: codegen, openapi, lesser-host openapi, and adapter declarations regenerate byte-identically; ' +
			`codegen plugins constrained to v5 (${UPSTREAM_ISSUE}).`
	);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
	main();
}
