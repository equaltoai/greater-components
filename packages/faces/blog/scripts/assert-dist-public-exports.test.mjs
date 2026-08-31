import assert from 'node:assert/strict';
import {
	chmodSync,
	copyFileSync,
	existsSync,
	mkdirSync,
	mkdtempSync,
	rmSync,
	symlinkSync,
	writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
	EXPECTED_PINNED_VALUES,
	REQUIRED_PUBLIC_EXPORTS,
	auditPinnedValues,
	extraRootConditions,
	mismatchedRootConditions,
	missingRequiredExports,
	resolveExportedStringValue,
	resolveExportSurface,
} from './assert-dist-public-exports.mjs';

/** Directory of this test file: packages/faces/blog/scripts. */
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
/** Repository root, four levels above the scripts directory. */
const REPO_ROOT = resolve(SCRIPT_DIR, '..', '..', '..', '..');

/** @template T @param {(dir: string) => T} run @returns {T} */
function withTempDir(run) {
	const dir = join(tmpdir(), `blog-dist-exports-test-${Date.now()}-${Math.random()}`);
	mkdirSync(dir, { recursive: true });
	try {
		return run(dir);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
}

/**
 * Build an isolated CLI fixture entirely under the OS temp dir — never inside
 * the repository — so an abrupt interruption cannot leave a repo-local
 * untracked directory behind. The gate's one direct dependency (`typescript`)
 * is provided through a fixture-local `node_modules` symlink into the repo's
 * pinned install; normal ESM resolution then finds the exact parser the real
 * build uses, without accepting any arbitrary package root.
 */
function createCliFixture() {
	const fixture = mkdtempSync(join(tmpdir(), '.dist-gate-cli-'));
	mkdirSync(join(fixture, 'scripts'));
	mkdirSync(join(fixture, 'node_modules'));
	copyFileSync(
		fileURLToPath(new URL('./assert-dist-public-exports.mjs', import.meta.url)),
		join(fixture, 'scripts', 'gate.mjs')
	);
	symlinkSync(
		join(REPO_ROOT, 'node_modules', 'typescript'),
		join(fixture, 'node_modules', 'typescript'),
		'dir'
	);
	return fixture;
}

/** @param {string} fixture Exact valid package-root condition map for a fixture package. */
function writeValidPackageJson(fixture) {
	writeFileSync(
		join(fixture, 'package.json'),
		JSON.stringify({
			name: 'fixture-blog',
			exports: {
				'.': {
					types: './dist/index.d.ts',
					svelte: './src/index.ts',
					import: './dist/index.js',
				},
			},
		})
	);
}

/** @param {string} fixture Run the copied gate CLI against a fixture and return the spawned result. */
function runCli(fixture) {
	return spawnSync(process.execPath, [join(fixture, 'scripts', 'gate.mjs')], {
		encoding: 'utf8',
	});
}

/**
 * `git status --short` at the repository root.
 *
 * Git execution failures fail loudly: a nonzero exit or an unstartable git
 * process throws instead of degrading into a scanned string, so the no-leak
 * assertion can never treat a broken evidence source as a passing proof.
 *
 * @param {{ env?: NodeJS.ProcessEnv, command?: string }} [options]
 * @returns {string}
 */
function gitStatusShort({ env = process.env, command = 'git' } = {}) {
	const result = spawnSync(command, ['status', '--short'], {
		cwd: REPO_ROOT,
		env,
		encoding: 'utf8',
	});
	if (result.status !== 0) {
		const reason =
			result.error && 'code' in result.error ? String(result.error.code) : `exit ${result.status}`;
		const stderr = String(result.stderr ?? '').trim();
		throw new Error(`git status --short failed (${reason})${stderr ? `: ${stderr}` : ''}`);
	}
	return result.stdout;
}

/**
 * Prove a CLI run left no repo-local fixture artifact: no `.dist-gate-cli-*`
 * entry may appear anywhere in the tree, and no untracked file may be added.
 * (Pre-existing tracked-file modifications, such as the very files under
 * development, are not the CLI run's doing and do not fail the proof.)
 *
 * @param {{ env?: NodeJS.ProcessEnv, command?: string }} [options] Passed to
 *   `gitStatusShort` so tests can inject a bounded failing git process.
 */
function assertNoRepoFixtureLeak({ env = process.env, command = 'git' } = {}) {
	const status = gitStatusShort({ env, command });
	assert.ok(
		!status.includes('.dist-gate-cli'),
		`CLI fixture must never appear in the repo working tree: ${JSON.stringify(status)}`
	);
	for (const line of status.split('\n')) {
		if (line.trim() === '') continue;
		assert.ok(
			!line.startsWith('??'),
			`CLI runs must not add untracked repo-local files: ${JSON.stringify(status)}`
		);
	}
}

/** @type {string[]} */
const NAMES = [...REQUIRED_PUBLIC_EXPORTS];
/** @type {Readonly<Record<string, string>>} */
const VALUES = EXPECTED_PINNED_VALUES;

/** @param {string} dist */
function writeBuiltGraph(dist) {
	mkdirSync(join(dist, 'review'), { recursive: true });
	writeFileSync(
		join(dist, 'index.js'),
		`export { ${NAMES.join(', ')} } from "./review/state.js";\n`
	);
	writeFileSync(
		join(dist, 'review', 'state.js'),
		`var ${NAMES.map((name) => `${name}=${JSON.stringify(VALUES[name])}`).join(',')};export{${NAMES.join(',')}};`
	);
	writeFileSync(join(dist, 'index.d.ts'), `export * from "./review/state.js";\n`);
	writeFileSync(
		join(dist, 'review', 'state.d.ts'),
		NAMES.map((name) => `export declare const ${name} = ${JSON.stringify(VALUES[name])};`).join(
			'\n'
		)
	);
}

test('expected map pins exactly the four #1055 values', () => {
	assert.deepEqual(EXPECTED_PINNED_VALUES, {
		REVIEW_STALE_APPROVAL_LABEL: 'Latest verdict: Approved (superseded)',
		REVIEW_STALE_APPROVAL_DETAIL:
			'This approval no longer counts. Approval for the current revision is outstanding.',
		REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL:
			'This approval no longer counts. Principal approval for the current revision is outstanding.',
		REVIEW_STATE_QUALIFIER: 'latest activity, not publication state',
	});
	assert.deepEqual(Object.keys(EXPECTED_PINNED_VALUES).sort(), [...REQUIRED_PUBLIC_EXPORTS].sort());
	assert.ok(Object.isFrozen(EXPECTED_PINNED_VALUES));
});

test('AST graph accepts compact exports and multi-declarator variables', () =>
	withTempDir((dist) => {
		writeBuiltGraph(dist);
		assert.deepEqual(auditPinnedValues(join(dist, 'index.js'), join(dist, 'index.d.ts')), []);
		assert.deepEqual(resolveExportedStringValue(join(dist, 'index.js'), 'REVIEW_STATE_QUALIFIER'), {
			ok: true,
			value: VALUES['REVIEW_STATE_QUALIFIER'],
		});
	}));

test('AST ignores export phantoms in regex, comments, strings, and templates', () =>
	withTempDir((dist) => {
		writeFileSync(
			join(dist, 'index.js'),
			[
				'const regex = /export { REVIEW_STATE_QUALIFIER } from "fake"/;',
				'const string = "export { REVIEW_STALE_APPROVAL_LABEL }";',
				'const template = `export * from "./fake.js"`;',
				'/* export const REVIEW_STALE_APPROVAL_DETAIL = "fake"; */',
				'// export const REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL = "fake";',
			].join('\n')
		);
		const surface = resolveExportSurface(join(dist, 'index.js'));
		assert.deepEqual([...surface], []);
		assert.deepEqual(missingRequiredExports(surface), NAMES);
	}));

test('runtime and declaration value mutations both fail independently', () =>
	withTempDir((dist) => {
		writeBuiltGraph(dist);
		writeFileSync(
			join(dist, 'review', 'state.js'),
			`export const REVIEW_STATE_QUALIFIER="runtime mutation";export{${NAMES.filter((name) => name !== 'REVIEW_STATE_QUALIFIER').join(',')}};`
		);
		let problems = auditPinnedValues(join(dist, 'index.js'), join(dist, 'index.d.ts'));
		assert.ok(problems.some((problem) => /dist\/index\.js value mutation detected/.test(problem)));
		assert.ok(
			!problems.some((problem) => /dist\/index\.d\.ts value mutation detected/.test(problem))
		);

		writeBuiltGraph(dist);
		writeFileSync(
			join(dist, 'review', 'state.d.ts'),
			NAMES.map(
				(name) =>
					`export declare const ${name} = ${JSON.stringify(name === 'REVIEW_STATE_QUALIFIER' ? 'types mutation' : VALUES[name])};`
			).join('\n')
		);
		problems = auditPinnedValues(join(dist, 'index.js'), join(dist, 'index.d.ts'));
		assert.ok(!problems.some((problem) => /dist\/index\.js value mutation detected/.test(problem)));
		assert.ok(
			problems.some((problem) => /dist\/index\.d\.ts value mutation detected/.test(problem))
		);
	}));

test('every one of the four pinned values fails on mutation in JS and declarations', () =>
	withTempDir((dist) => {
		for (const mutated of NAMES) {
			writeBuiltGraph(dist);
			writeFileSync(
				join(dist, 'review', 'state.js'),
				`var ${NAMES.map((name) => `${name}=${JSON.stringify(name === mutated ? 'mutated runtime value' : VALUES[name])}`).join(',')};export{${NAMES.join(',')}};`
			);
			let problems = auditPinnedValues(join(dist, 'index.js'), join(dist, 'index.d.ts'));
			assert.equal(
				problems.length,
				1,
				`JS mutation of ${mutated} must produce exactly one problem`
			);
			const runtimeProblem = problems[0];
			assert.ok(runtimeProblem !== undefined);
			assert.match(
				runtimeProblem,
				new RegExp(`dist/index\\.js value mutation detected: ${mutated} resolves`)
			);

			writeBuiltGraph(dist);
			writeFileSync(
				join(dist, 'review', 'state.d.ts'),
				NAMES.map(
					(name) =>
						`export declare const ${name} = ${JSON.stringify(name === mutated ? 'mutated declaration value' : VALUES[name])};`
				).join('\n')
			);
			problems = auditPinnedValues(join(dist, 'index.js'), join(dist, 'index.d.ts'));
			assert.equal(
				problems.length,
				1,
				`d.ts mutation of ${mutated} must produce exactly one problem`
			);
			const declarationProblem = problems[0];
			assert.ok(declarationProblem !== undefined);
			assert.match(
				declarationProblem,
				new RegExp(`dist/index\\.d\\.ts value mutation detected: ${mutated} resolves`)
			);
		}
	}));

test('outside files cannot satisfy runtime or declaration graphs', () =>
	withTempDir((root) => {
		const dist = join(root, 'dist');
		mkdirSync(dist);
		writeFileSync(join(dist, 'index.js'), `export { ${NAMES.join(',')} } from "../outside.js";`);
		writeFileSync(join(dist, 'index.d.ts'), `export { ${NAMES.join(',')} } from "../outside.js";`);
		writeFileSync(
			join(root, 'outside.js'),
			NAMES.map((name) => `export const ${name}=${JSON.stringify(VALUES[name])};`).join('\n')
		);
		writeFileSync(
			join(root, 'outside.d.ts'),
			NAMES.map((name) => `export declare const ${name}=${JSON.stringify(VALUES[name])};`).join(
				'\n'
			)
		);
		const problems = auditPinnedValues(join(dist, 'index.js'), join(dist, 'index.d.ts'));
		assert.equal(problems.length, NAMES.length * 2);
		assert.ok(problems.every((problem) => problem.includes('forbidden .. segment')));
	}));

test('canonical real paths reject symlink escapes', () =>
	withTempDir((root) => {
		const dist = join(root, 'dist');
		mkdirSync(dist);
		writeFileSync(
			join(root, 'outside.js'),
			`export const REVIEW_STATE_QUALIFIER=${JSON.stringify(VALUES['REVIEW_STATE_QUALIFIER'])};`
		);
		writeFileSync(
			join(root, 'outside.d.ts'),
			`export declare const REVIEW_STATE_QUALIFIER=${JSON.stringify(VALUES['REVIEW_STATE_QUALIFIER'])};`
		);
		symlinkSync(join(root, 'outside.js'), join(dist, 'linked.js'));
		symlinkSync(join(root, 'outside.d.ts'), join(dist, 'linked.d.ts'));
		writeFileSync(join(dist, 'index.js'), 'export * from "./linked.js";');
		writeFileSync(join(dist, 'index.d.ts'), 'export * from "./linked.js";');
		const runtime = resolveExportedStringValue(join(dist, 'index.js'), 'REVIEW_STATE_QUALIFIER');
		assert.equal(runtime.ok, false);
		assert.match(runtime.reason, /outside this package's dist root/);
		const declaration = resolveExportedStringValue(
			join(dist, 'index.d.ts'),
			'REVIEW_STATE_QUALIFIER',
			{
				declarationFiles: true,
				distRoot: dist,
			}
		);
		assert.equal(declaration.ok, false);
		assert.match(declaration.reason, /outside this package's dist root/);
	}));

test('absolute, external, and missing targets fail closed concisely', () =>
	withTempDir((dist) => {
		/** @type {Array<[string, string, RegExp]>} */
		const cases = [
			[
				'absolute.js',
				'export { REVIEW_STATE_QUALIFIER } from "/tmp/value.js";',
				/external or absolute/,
			],
			[
				'external.js',
				'export { REVIEW_STATE_QUALIFIER } from "dependency";',
				/external or absolute/,
			],
			['missing.js', 'export { REVIEW_STATE_QUALIFIER } from "./absent.js";', /does not exist/],
		];
		for (const [file, source, expected] of cases) {
			writeFileSync(join(dist, file), source);
			const result = resolveExportedStringValue(join(dist, file), 'REVIEW_STATE_QUALIFIER');
			assert.equal(result.ok, false);
			assert.match(result.reason, expected);
			assert.ok(!result.reason.includes('\n    at '));
			assert.ok(result.reason.length < 300);
		}
	}));

test('malformed syntax and malformed literals produce bounded diagnostics', () =>
	withTempDir((dist) => {
		/** @type {Array<[string, string]>} */
		const cases = [
			['syntax.js', 'export { REVIEW_STATE_QUALIFIER from "./state.js";'],
			['literal.js', 'export const REVIEW_STATE_QUALIFIER = "\\xZZ";'],
		];
		for (const [file, source] of cases) {
			writeFileSync(join(dist, file), source);
			const result = resolveExportedStringValue(join(dist, file), 'REVIEW_STATE_QUALIFIER');
			assert.equal(result.ok, false);
			assert.match(result.reason, /invalid syntax/);
			assert.ok(!result.reason.includes('\n    at '));
			assert.ok(result.reason.length < 500);
		}
	}));

test('CLI exits nonzero with bounded malformed-source output', () => {
	const fixture = createCliFixture();
	try {
		writeValidPackageJson(fixture);
		mkdirSync(join(fixture, 'dist'));
		writeFileSync(
			join(fixture, 'dist', 'index.js'),
			'export { REVIEW_STATE_QUALIFIER from "./state.js";'
		);
		writeFileSync(join(fixture, 'dist', 'index.d.ts'), 'export declare const UNRELATED: boolean;');
		const result = runCli(fixture);
		assert.notEqual(result.status, 0);
		assert.match(result.stderr, /dist public-export parity: index\.js has invalid syntax/);
		assert.ok(!result.stderr.includes('\n    at '));
		assert.ok(result.stderr.length < 1000);
	} finally {
		rmSync(fixture, { recursive: true, force: true });
	}
});

test('CLI passes when the root condition map is exact and the dist graph is valid', () => {
	const fixture = createCliFixture();
	try {
		writeValidPackageJson(fixture);
		writeBuiltGraph(join(fixture, 'dist'));
		const result = runCli(fixture);
		assert.equal(result.status, 0, result.stderr);
		assert.match(result.stdout, /dist public-export parity holds/);
	} finally {
		rmSync(fixture, { recursive: true, force: true });
	}
});

test('every extra root condition fails closed with bounded CLI diagnostics', () => {
	/** @type {Array<[string, unknown]>} */
	const extras = [
		['default', './dist/index.js'],
		['require', './dist/index.cjs'],
		['node', { types: './dist/index.d.ts', import: './dist/index.js' }],
		['browser', './dist/index.js'],
		['react-server', { default: './dist/index.js' }],
	];
	for (const [extra, value] of extras) {
		const fixture = createCliFixture();
		try {
			writeFileSync(
				join(fixture, 'package.json'),
				JSON.stringify({
					name: 'fixture-blog',
					exports: {
						'.': {
							types: './dist/index.d.ts',
							svelte: './src/index.ts',
							import: './dist/index.js',
							[extra]: value,
						},
					},
				})
			);
			writeBuiltGraph(join(fixture, 'dist'));
			const result = runCli(fixture);
			assert.notEqual(result.status, 0, `extra condition ${extra} must fail the CLI`);
			assert.match(result.stderr, new RegExp(`extra condition ${JSON.stringify(extra)}`));
			assert.match(result.stderr, /allowed conditions are exactly types, svelte, import/);
			assert.ok(!result.stderr.includes('\n    at '));
			assert.ok(result.stderr.length < 1000, `diagnostics for ${extra} must be bounded`);
		} finally {
			rmSync(fixture, { recursive: true, force: true });
		}
	}
});

test('normal and failing CLI runs clean up and leave the repo clean', () => {
	const failing = createCliFixture();
	try {
		writeValidPackageJson(failing);
		mkdirSync(join(failing, 'dist'));
		writeFileSync(join(failing, 'dist', 'index.js'), 'export { broken');
		writeFileSync(join(failing, 'dist', 'index.d.ts'), 'export declare const UNRELATED: boolean;');
		const result = runCli(failing);
		assert.notEqual(result.status, 0);
	} finally {
		rmSync(failing, { recursive: true, force: true });
	}
	assert.equal(existsSync(failing), false, 'failing run must remove its fixture');
	assertNoRepoFixtureLeak();

	const passing = createCliFixture();
	try {
		writeValidPackageJson(passing);
		writeBuiltGraph(join(passing, 'dist'));
		const result = runCli(passing);
		assert.equal(result.status, 0, result.stderr);
	} finally {
		rmSync(passing, { recursive: true, force: true });
	}
	assert.equal(existsSync(passing), false, 'passing run must remove its fixture');
	assertNoRepoFixtureLeak();
});

test('abruptly interrupted CLI fixture runs cannot leak into the repo', () => {
	const fixture = join(tmpdir(), `.dist-gate-cli-abrupt-${process.pid}-${Date.now()}`);
	assert.ok(fixture.startsWith(tmpdir()), 'fixture must live under the OS temp dir');
	assert.ok(!fixture.startsWith(`${REPO_ROOT}/`), 'fixture must live outside the repository');
	// A child creates the same fixture shape and is hard-killed before any
	// cleanup, simulating an abrupt interruption of a CLI run.
	const child = spawnSync(
		process.execPath,
		[
			'-e',
			[
				"const { mkdirSync, writeFileSync } = require('node:fs');",
				"const { join } = require('node:path');",
				'const fixture = process.argv[1];',
				"mkdirSync(join(fixture, 'scripts'), { recursive: true });",
				"writeFileSync(join(fixture, 'package.json'), '{}');",
				"process.kill(process.pid, 'SIGKILL');",
			].join('\n'),
			fixture,
		],
		{ encoding: 'utf8' }
	);
	assert.equal(child.signal, 'SIGKILL', 'child must die before any cleanup');
	assert.equal(existsSync(join(fixture, 'package.json')), true, 'fixture existed at kill time');
	assertNoRepoFixtureLeak();
	// The leak stayed in the OS temp dir by construction; remove it as hygiene.
	rmSync(fixture, { recursive: true, force: true });
});

test('a failing git process fails the no-leak assertion loudly instead of passing', () => {
	withTempDir((fakeBin) => {
		// A bounded fake `git` binary that always fails, injected through PATH:
		// the spawned process really fails, the real repository git state is
		// never touched, and the fake lives only inside the OS temp dir.
		const fakeGit = join(fakeBin, 'git');
		writeFileSync(fakeGit, '#!/bin/sh\necho "simulated git failure" >&2\nexit 2\n');
		chmodSync(fakeGit, 0o755);
		const env = { ...process.env, PATH: `${fakeBin}${delimiter}${process.env['PATH']}` };
		assert.throws(
			() => gitStatusShort({ env }),
			/git status --short failed \(exit 2\): simulated git failure/
		);
		// The hygiene assertion propagates the failure instead of scanning a
		// degraded error string — a broken evidence source can never pass.
		assert.throws(() => assertNoRepoFixtureLeak({ env }), /git status --short failed/);
	});
	// An unstartable git (no such binary) fails the same way, loudly.
	assert.throws(
		() => gitStatusShort({ command: 'no-such-git-binary-12345' }),
		/git status --short failed \(ENOENT\)/
	);
});

test('non-literal initializers and substitutions cannot satisfy a pinned value', () =>
	withTempDir((dist) => {
		/** @type {Array<[string, string]>} */
		const cases = [
			['concat.js', '"latest activity" + ", not publication state"'],
			['template.js', '`${value} activity`'],
			['call.js', 'String("latest activity, not publication state")'],
		];
		for (const [file, initializer] of cases) {
			writeFileSync(
				join(dist, file),
				`const value="latest";export const REVIEW_STATE_QUALIFIER=${initializer};`
			);
			const result = resolveExportedStringValue(join(dist, file), 'REVIEW_STATE_QUALIFIER');
			assert.equal(result.ok, false);
			assert.match(result.reason, /not one string literal/);
		}
	}));

test('cycles and ambiguous exports fail closed', () =>
	withTempDir((dist) => {
		writeFileSync(join(dist, 'a.js'), 'export { REVIEW_STATE_QUALIFIER } from "./b.js";');
		writeFileSync(join(dist, 'b.js'), 'export { REVIEW_STATE_QUALIFIER } from "./a.js";');
		let result = resolveExportedStringValue(join(dist, 'a.js'), 'REVIEW_STATE_QUALIFIER');
		assert.equal(result.ok, false);
		assert.match(result.reason, /circular export chain/);

		writeFileSync(
			join(dist, 'duplicate.js'),
			'const a="a",b="b";export{a as REVIEW_STATE_QUALIFIER,b as REVIEW_STATE_QUALIFIER};'
		);
		result = resolveExportedStringValue(join(dist, 'duplicate.js'), 'REVIEW_STATE_QUALIFIER');
		assert.equal(result.ok, false);
		assert.match(result.reason, /ambiguous duplicate export/);

		writeFileSync(join(dist, 'stars.js'), 'export*from"./one.js";export*from"./two.js";');
		writeFileSync(join(dist, 'one.js'), 'export const REVIEW_STATE_QUALIFIER="one";');
		writeFileSync(join(dist, 'two.js'), 'export const REVIEW_STATE_QUALIFIER="two";');
		result = resolveExportedStringValue(join(dist, 'stars.js'), 'REVIEW_STATE_QUALIFIER');
		assert.equal(result.ok, false);
		assert.match(result.reason, /multiple star exports/);
	}));

test('star-surface cycles and escaping star targets are rejected', () =>
	withTempDir((root) => {
		const dist = join(root, 'dist');
		mkdirSync(dist);
		writeFileSync(join(dist, 'a.js'), 'export * from "./b.js";');
		writeFileSync(join(dist, 'b.js'), 'export * from "./a.js";');
		assert.throws(() => resolveExportSurface(join(dist, 'a.js')), /circular star export/);

		writeFileSync(join(root, 'outside.js'), 'export const SAFE="not safe";');
		writeFileSync(join(dist, 'escape.js'), 'export * from "../outside.js";');
		assert.throws(() => resolveExportSurface(join(dist, 'escape.js')), /forbidden \.\./);
	}));

test('root export conditions remain exact', () => {
	const exact = {
		'.': {
			types: './dist/index.d.ts',
			svelte: './src/index.ts',
			import: './dist/index.js',
		},
	};
	assert.deepEqual(mismatchedRootConditions(exact), []);
	assert.deepEqual(extraRootConditions(exact), []);
	assert.deepEqual(
		mismatchedRootConditions({ '.': {} }).map(({ condition }) => condition),
		['types', 'svelte', 'import']
	);
	assert.deepEqual(extraRootConditions({ '.': {} }), []);
});

test('every shadowing or nested extra condition fails closed in any property order', () => {
	/** @type {Array<[string, unknown]>} */
	const extras = [
		['default', './dist/index.js'],
		['require', './dist/index.cjs'],
		['node', { types: './dist/index.d.ts', import: './dist/index.js' }],
		['browser', './dist/index.js'],
		['react-server', { default: './dist/index.js' }],
	];
	const valid = {
		types: './dist/index.d.ts',
		svelte: './src/index.ts',
		import: './dist/index.js',
	};
	for (const [extra, value] of extras) {
		assert.deepEqual(
			extraRootConditions({ '.': { ...valid, [extra]: value } }),
			[extra],
			`${extra} after the pinned conditions`
		);
		assert.deepEqual(
			extraRootConditions({ '.': { [extra]: value, ...valid } }),
			[extra],
			`${extra} before the pinned conditions`
		);
		// The required values must still be reported as exact when only the
		// extra key is added.
		assert.deepEqual(mismatchedRootConditions({ '.': { ...valid, [extra]: value } }), []);
	}
	// Multiple extras are reported together, deterministically sorted.
	assert.deepEqual(
		extraRootConditions({
			'.': { ...valid, require: './dist/index.cjs', default: './dist/index.js' },
		}),
		['default', 'require']
	);
});

test('plain Node cannot import the built-style .svelte graph', async () =>
	withTempDir(async (dir) => {
		writeFileSync(join(dir, 'widget.svelte'), '<p>widget</p>\n');
		writeFileSync(join(dir, 'entry.js'), 'import "./widget.svelte";\nexport const ok=true;\n');
		await assert.rejects(() => import(pathToFileURL(join(dir, 'entry.js')).href), {
			code: 'ERR_UNKNOWN_FILE_EXTENSION',
		});
	}));
