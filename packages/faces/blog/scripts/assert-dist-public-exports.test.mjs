import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
	EXPECTED_PINNED_VALUES,
	REQUIRED_PUBLIC_EXPORTS,
	auditPinnedValues,
	mismatchedRootConditions,
	missingRequiredExports,
	resolveExportedStringValue,
	resolveExportSurface,
} from './assert-dist-public-exports.mjs';

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
	const fixture = mkdtempSync(join(dirname(fileURLToPath(import.meta.url)), '.dist-gate-cli-'));
	try {
		const scripts = join(fixture, 'scripts');
		const dist = join(fixture, 'dist');
		mkdirSync(scripts);
		mkdirSync(dist);
		copyFileSync(
			fileURLToPath(new URL('./assert-dist-public-exports.mjs', import.meta.url)),
			join(scripts, 'gate.mjs')
		);
		writeFileSync(
			join(fixture, 'package.json'),
			JSON.stringify({
				exports: {
					'.': {
						types: './dist/index.d.ts',
						svelte: './src/index.ts',
						import: './dist/index.js',
					},
				},
			})
		);
		writeFileSync(join(dist, 'index.js'), 'export { REVIEW_STATE_QUALIFIER from "./state.js";');
		writeFileSync(join(dist, 'index.d.ts'), 'export declare const UNRELATED: boolean;');
		const result = spawnSync(process.execPath, [join(scripts, 'gate.mjs')], { encoding: 'utf8' });
		assert.notEqual(result.status, 0);
		assert.match(result.stderr, /dist public-export parity: index\.js has invalid syntax/);
		assert.ok(!result.stderr.includes('\n    at '));
		assert.ok(result.stderr.length < 1000);
	} finally {
		rmSync(fixture, { recursive: true, force: true });
	}
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
	assert.deepEqual(
		mismatchedRootConditions({
			'.': {
				types: './dist/index.d.ts',
				svelte: './src/index.ts',
				import: './dist/index.js',
			},
		}),
		[]
	);
	assert.deepEqual(
		mismatchedRootConditions({ '.': {} }).map(({ condition }) => condition),
		['types', 'svelte', 'import']
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
