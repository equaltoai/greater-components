/**
 * Unit tests for the post-build dist public-export parity assertion.
 *
 * The script's job is to fail a build whose built package root stops carrying
 * the pinned #1055 review exports — or carries them with altered values.
 * These tests pin the script's own logic: the export-statement parser (both
 * spaced and compact/minified emission forms, with no false-pass path for
 * export-shaped text inside identifiers, strings, or comments), the value
 * resolver that walks built module graphs to each constant's initializer,
 * the authoritative expected-value map, the `export *` follower, the
 * exports-map condition check, and the Node-import boundary that makes static
 * inspection the right mechanism — so a parser regression cannot silently
 * weaken the gate. Run via `pnpm test:scripts:blog-dist-exports` (wired into
 * `pnpm test:scripts`, which CI runs after "Build packages").
 */

import assert from 'node:assert/strict';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';

import {
	EXPECTED_PINNED_VALUES,
	REQUIRED_PUBLIC_EXPORTS,
	auditPinnedValues,
	collectModuleExports,
	mismatchedRootConditions,
	missingRequiredExports,
	parseSpecifier,
	resolveExportedStringValue,
	resolveExportSurface,
	stripComments,
} from './assert-dist-public-exports.mjs';

/**
 * @template T
 * @param {(dir: string) => T} run
 * @returns {T}
 */
function withTempDir(run) {
	const dir = join(tmpdir(), `blog-dist-exports-test-${Date.now()}-${Math.random()}`);
	mkdirSync(dir, { recursive: true });
	try {
		return run(dir);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
}

test('collectModuleExports reads named, aliased, typed, and local exports', () => {
	const { names, starFrom } = collectModuleExports(
		[
			'export { REVIEW_STATE_QUALIFIER } from "./components/Review/state.js";',
			'export { Card as ArticleCard } from "./components/Article/index.js";',
			'export type { ReviewStateTone } from "./types.js";',
			'export const REVIEW_STALE_APPROVAL_LABEL = "Latest verdict: Approved (superseded)";',
			'export * from "./patterns/index.js";',
			'export * as helpers from "./helpers.js";',
		].join('\n')
	);

	assert.deepEqual(
		[...names].sort(),
		[
			'ArticleCard',
			'REVIEW_STALE_APPROVAL_LABEL',
			'REVIEW_STATE_QUALIFIER',
			'ReviewStateTone',
			'helpers',
		].sort()
	);
	assert.deepEqual(starFrom, ['./patterns/index.js']);
});

test('stripComments removes comments without touching module specifiers', () => {
	const stripped = stripComments(
		[
			'/** block comment mentioning export { FAKE } */',
			'// line comment mentioning export { ALSO_FAKE }',
			'export { REAL } from "./real.js"; // trailing',
		].join('\n')
	);

	const { names } = collectModuleExports(stripped);
	assert.deepEqual([...names], ['REAL']);
});

test('resolveExportSurface follows relative star re-exports within dist', () =>
	withTempDir((dir) => {
		writeFileSync(
			join(dir, 'index.js'),
			['export { REVIEW_STATE_QUALIFIER } from "./state.js";', 'export * from "./extra.js";'].join(
				'\n'
			)
		);
		writeFileSync(join(dir, 'state.js'), 'export const REVIEW_STATE_QUALIFIER = "q";');
		writeFileSync(
			join(dir, 'extra.js'),
			'export { REVIEW_STALE_APPROVAL_LABEL } from "./labels.js";'
		);
		writeFileSync(join(dir, 'labels.js'), 'export const REVIEW_STALE_APPROVAL_LABEL = "l";');

		const surface = resolveExportSurface(join(dir, 'index.js'));
		assert.ok(surface.has('REVIEW_STATE_QUALIFIER'));
		assert.ok(surface.has('REVIEW_STALE_APPROVAL_LABEL'));
		assert.deepEqual(missingRequiredExports(surface), [
			'REVIEW_STALE_APPROVAL_DETAIL',
			'REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL',
		]);
	}));

test('missingRequiredExports names every absent pinned export', () => {
	const surface = new Set(['REVIEW_STATE_QUALIFIER']);
	assert.deepEqual(missingRequiredExports(surface), [
		'REVIEW_STALE_APPROVAL_LABEL',
		'REVIEW_STALE_APPROVAL_DETAIL',
		'REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL',
	]);
	assert.deepEqual(missingRequiredExports(new Set(REQUIRED_PUBLIC_EXPORTS)), []);
});

test('mismatchedRootConditions flags drifted or absent exports["."] conditions', () => {
	const good = {
		'.': {
			types: './dist/index.d.ts',
			svelte: './src/index.ts',
			import: './dist/index.js',
		},
	};
	assert.deepEqual(mismatchedRootConditions(good), []);

	const drifted = {
		'.': { types: './dist/index.d.ts', svelte: './src/index.ts', import: './src/index.ts' },
	};
	assert.deepEqual(mismatchedRootConditions(drifted), [
		{ condition: 'import', expected: './dist/index.js', actual: './src/index.ts' },
	]);

	assert.deepEqual(mismatchedRootConditions(undefined), [
		{ condition: 'types', expected: './dist/index.d.ts', actual: '(absent)' },
		{ condition: 'svelte', expected: './src/index.ts', actual: '(absent)' },
		{ condition: 'import', expected: './dist/index.js', actual: '(absent)' },
	]);
});

test('plain Node cannot import a graph containing .svelte modules (the static-inspection boundary)', async () =>
	withTempDir(async (dir) => {
		// The built blog dist transitively imports raw .svelte modules (the
		// primitives face re-exports them); only a bundler honouring the
		// package's `svelte` condition can consume that graph. Reproduce the
		// boundary with the minimal shape so the assertion script's choice of
		// static export-surface inspection stays justified and tested.
		writeFileSync(join(dir, 'widget.svelte'), '<p>widget</p>\n');
		writeFileSync(join(dir, 'entry.js'), 'import "./widget.svelte";\nexport const ok = true;\n');

		await assert.rejects(
			() => import(pathToFileURL(join(dir, 'entry.js')).href),
			(/** @type {NodeJS.ErrnoException} */ error) => {
				assert.equal(error.code, 'ERR_UNKNOWN_FILE_EXTENSION');
				assert.match(String(error.message), /\.svelte/);
				return true;
			}
		);
	}));

test('collectModuleExports accepts compact export forms a minifier may emit', () => {
	const { names, starFrom } = collectModuleExports(
		'var a="Latest verdict: Approved (superseded)";' +
			'export{a as REVIEW_STALE_APPROVAL_LABEL};' +
			'export{REVIEW_STATE_QUALIFIER}from"./state.js";' +
			'export type{ReviewStateTone}from"./types.js";' +
			'export*from"./extra.js";'
	);

	assert.deepEqual(
		[...names].sort(),
		['REVIEW_STALE_APPROVAL_LABEL', 'REVIEW_STATE_QUALIFIER', 'ReviewStateTone'].sort()
	);
	assert.deepEqual(starFrom, ['./extra.js']);
});

test('collectModuleExports never matches export-shaped text inside identifiers, strings, or comments', () => {
	const { names } = collectModuleExports(
		[
			'var reexport = { REVIEW_STALE_APPROVAL_LABEL: "fake" };',
			'var doc = "export { REVIEW_STATE_QUALIFIER } from \\"./fake.js\\"";',
			'/* export { BLOCK_FAKE } */',
			'// export { LINE_FAKE }',
			'export{REAL};',
		].join('\n')
	);

	assert.deepEqual([...names], ['REAL']);
});

test('the scanner survives regex literals that contain quote characters', () => {
	const { names } = collectModuleExports(
		['var quoteRe = /["\'`]/;', 'export { REVIEW_STATE_QUALIFIER } from "./state.js";'].join('\n')
	);

	assert.deepEqual([...names], ['REVIEW_STATE_QUALIFIER']);
});

test('parseSpecifier accepts identifier pairs and rejects everything else', () => {
	assert.deepEqual(parseSpecifier('REVIEW_STATE_QUALIFIER'), {
		local: 'REVIEW_STATE_QUALIFIER',
		exported: 'REVIEW_STATE_QUALIFIER',
	});
	assert.deepEqual(parseSpecifier('a as REVIEW_STATE_QUALIFIER'), {
		local: 'a',
		exported: 'REVIEW_STATE_QUALIFIER',
	});
	assert.deepEqual(parseSpecifier(' type Foo as Bar '), { local: 'Foo', exported: 'Bar' });
	assert.equal(parseSpecifier('"string name" as Bar'), null);
	assert.equal(parseSpecifier(''), null);
	assert.equal(parseSpecifier('A as'), null);
});

test('EXPECTED_PINNED_VALUES is the exact pinned #1055 wording and nothing else', () => {
	assert.deepEqual(EXPECTED_PINNED_VALUES, {
		REVIEW_STALE_APPROVAL_LABEL: 'Latest verdict: Approved (superseded)',
		REVIEW_STALE_APPROVAL_DETAIL:
			'This approval no longer counts. Approval for the current revision is outstanding.',
		REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL:
			'This approval no longer counts. Principal approval for the current revision is outstanding.',
		REVIEW_STATE_QUALIFIER: 'latest activity, not publication state',
	});
	assert.deepEqual(
		[...Object.keys(EXPECTED_PINNED_VALUES)].sort(),
		[...REQUIRED_PUBLIC_EXPORTS].sort()
	);
	assert.ok(Object.isFrozen(EXPECTED_PINNED_VALUES));
});

/**
 * Writes a fixture that mirrors the real built graph: an entry that imports
 * the pinned constants and re-exports them bare, a leaf module carrying the
 * `var NAME = "…"` declarations plus a trailing `export { … }`, and the
 * matching `.d.ts` graph with `export declare const NAME = "…"` literal
 * declarations behind `.js` specifiers.
 *
 * @param {string} dir
 * @param {{ label: string, detail: string, detailPrincipal: string, qualifier: string }} values
 */
function writeBuiltGraph(dir, values) {
	mkdirSync(join(dir, 'components', 'Review'), { recursive: true });
	const names = [
		'REVIEW_STALE_APPROVAL_LABEL',
		'REVIEW_STALE_APPROVAL_DETAIL',
		'REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL',
		'REVIEW_STATE_QUALIFIER',
	];
	/** @type {Record<string, string>} */
	const byName = {
		REVIEW_STALE_APPROVAL_LABEL: values.label,
		REVIEW_STALE_APPROVAL_DETAIL: values.detail,
		REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL: values.detailPrincipal,
		REVIEW_STATE_QUALIFIER: values.qualifier,
	};

	writeFileSync(
		join(dir, 'index.js'),
		[
			`import { ${names.join(', ')} } from "./components/Review/state.js";`,
			`export { ${names.join(', ')} };`,
		].join('\n')
	);
	writeFileSync(
		join(dir, 'components', 'Review', 'state.js'),
		[
			...names.map((name) => `var ${name} = ${JSON.stringify(byName[name])};`),
			`export { ${names.join(', ')} };`,
		].join('\n')
	);

	writeFileSync(
		join(dir, 'index.d.ts'),
		`export { ${names.join(', ')} } from "./components/Review/index.js";`
	);
	writeFileSync(
		join(dir, 'components', 'Review', 'index.d.ts'),
		`export { ${names.join(', ')} } from "./state.js";`
	);
	writeFileSync(
		join(dir, 'components', 'Review', 'state.d.ts'),
		names
			.map((name) => `export declare const ${name} = ${JSON.stringify(byName[name])};`)
			.join('\n')
	);
}

const PINNED_GRAPHS_VALUES = {
	label: EXPECTED_PINNED_VALUES.REVIEW_STALE_APPROVAL_LABEL,
	detail: EXPECTED_PINNED_VALUES.REVIEW_STALE_APPROVAL_DETAIL,
	detailPrincipal: EXPECTED_PINNED_VALUES.REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL,
	qualifier: EXPECTED_PINNED_VALUES.REVIEW_STATE_QUALIFIER,
};

test('auditPinnedValues passes a built graph carrying the exact pinned wording', () =>
	withTempDir((dir) => {
		writeBuiltGraph(dir, PINNED_GRAPHS_VALUES);
		assert.deepEqual(auditPinnedValues(join(dir, 'index.js'), join(dir, 'index.d.ts')), []);
	}));

test('auditPinnedValues fails a mutated value in the runtime graph', () =>
	withTempDir((dir) => {
		writeBuiltGraph(dir, {
			...PINNED_GRAPHS_VALUES,
			label: 'Latest verdict: Approved',
		});
		const problems = auditPinnedValues(join(dir, 'index.js'), join(dir, 'index.d.ts'));
		assert.equal(problems.length, 2);
		for (const problem of problems) {
			assert.match(problem, /dist\/index\.(js|d\.ts) value mutation detected/);
			assert.match(problem, /REVIEW_STALE_APPROVAL_LABEL/);
		}
	}));

test('auditPinnedValues fails a mutation in only the declaration graph too', () =>
	withTempDir((dir) => {
		writeBuiltGraph(dir, PINNED_GRAPHS_VALUES);
		// Mutate only the .d.ts leaf: the runtime value stays correct, so exactly
		// one problem must surface — from the types graph. This also pins that the
		// declaration walk never falls back to the runtime .js files, which would
		// re-prove the runtime graph and hide the mutation.
		const dtsLeaf = join(dir, 'components', 'Review', 'state.d.ts');
		writeFileSync(
			dtsLeaf,
			[
				`export declare const REVIEW_STALE_APPROVAL_LABEL = ${JSON.stringify(PINNED_GRAPHS_VALUES.label)};`,
				`export declare const REVIEW_STALE_APPROVAL_DETAIL = ${JSON.stringify(PINNED_GRAPHS_VALUES.detail)};`,
				`export declare const REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL = ${JSON.stringify(PINNED_GRAPHS_VALUES.detailPrincipal)};`,
				'export declare const REVIEW_STATE_QUALIFIER = "latest activity";',
			].join('\n')
		);
		const problems = auditPinnedValues(join(dir, 'index.js'), join(dir, 'index.d.ts'));
		assert.deepEqual(problems, [
			'dist/index.d.ts value mutation detected: REVIEW_STATE_QUALIFIER resolves to ' +
				'"latest activity"; the pinned #1055 wording is ' +
				'"latest activity, not publication state"',
		]);
	}));

test('resolveExportedStringValue accepts compact minified graphs end to end', () =>
	withTempDir((dir) => {
		writeFileSync(join(dir, 'index.js'), 'export{REVIEW_STATE_QUALIFIER}from"./state.js";');
		writeFileSync(
			join(dir, 'state.js'),
			'var a="latest activity, not publication state";export{a as REVIEW_STATE_QUALIFIER};'
		);

		assert.deepEqual(resolveExportedStringValue(join(dir, 'index.js'), 'REVIEW_STATE_QUALIFIER'), {
			ok: true,
			value: 'latest activity, not publication state',
		});
	}));

test('resolveExportedStringValue follows a single star re-export', () =>
	withTempDir((dir) => {
		writeFileSync(join(dir, 'index.js'), 'export * from "./leaf.js";');
		writeFileSync(
			join(dir, 'leaf.js'),
			'var REVIEW_STATE_QUALIFIER = "latest activity, not publication state";\nexport { REVIEW_STATE_QUALIFIER };'
		);

		assert.deepEqual(resolveExportedStringValue(join(dir, 'index.js'), 'REVIEW_STATE_QUALIFIER'), {
			ok: true,
			value: 'latest activity, not publication state',
		});
	}));

test('resolveExportedStringValue fails closed on unresolvable or ambiguous chains', () =>
	withTempDir((dir) => {
		// External source: the value lives outside the package dist.
		writeFileSync(
			join(dir, 'external.js'),
			'export { REVIEW_STATE_QUALIFIER } from "some-external-package";'
		);
		assert.equal(
			resolveExportedStringValue(join(dir, 'external.js'), 'REVIEW_STATE_QUALIFIER').ok,
			false
		);

		// Circular re-export chain.
		writeFileSync(join(dir, 'loop-a.js'), 'export { REVIEW_STATE_QUALIFIER } from "./loop-b.js";');
		writeFileSync(join(dir, 'loop-b.js'), 'export { REVIEW_STATE_QUALIFIER } from "./loop-a.js";');
		assert.equal(
			resolveExportedStringValue(join(dir, 'loop-a.js'), 'REVIEW_STATE_QUALIFIER').ok,
			false
		);

		// Duplicate declarations: runtime ambiguity must not resolve.
		writeFileSync(
			join(dir, 'dup.js'),
			'var REVIEW_STATE_QUALIFIER = "a";\nvar REVIEW_STATE_QUALIFIER = "b";\nexport { REVIEW_STATE_QUALIFIER };'
		);
		assert.equal(
			resolveExportedStringValue(join(dir, 'dup.js'), 'REVIEW_STATE_QUALIFIER').ok,
			false
		);

		// Concatenated initializer: not exactly one literal.
		writeFileSync(
			join(dir, 'concat.js'),
			'var REVIEW_STATE_QUALIFIER = "latest activity" + ", not publication state";\nexport { REVIEW_STATE_QUALIFIER };'
		);
		assert.equal(
			resolveExportedStringValue(join(dir, 'concat.js'), 'REVIEW_STATE_QUALIFIER').ok,
			false
		);

		// Template literal with a substitution: not static.
		writeFileSync(
			join(dir, 'template.js'),
			'var x = "latest";\nvar REVIEW_STATE_QUALIFIER = `${x} activity`;\nexport { REVIEW_STATE_QUALIFIER };'
		);
		assert.equal(
			resolveExportedStringValue(join(dir, 'template.js'), 'REVIEW_STATE_QUALIFIER').ok,
			false
		);

		// Name exported by two star re-exports: ambiguous.
		writeFileSync(
			join(dir, 'star-entry.js'),
			'export * from "./star-a.js";\nexport * from "./star-b.js";'
		);
		writeFileSync(
			join(dir, 'star-a.js'),
			'var REVIEW_STATE_QUALIFIER = "a";\nexport { REVIEW_STATE_QUALIFIER };'
		);
		writeFileSync(
			join(dir, 'star-b.js'),
			'var REVIEW_STATE_QUALIFIER = "b";\nexport { REVIEW_STATE_QUALIFIER };'
		);
		assert.equal(
			resolveExportedStringValue(join(dir, 'star-entry.js'), 'REVIEW_STATE_QUALIFIER').ok,
			false
		);

		// Missing file in the chain.
		writeFileSync(
			join(dir, 'dangling.js'),
			'export { REVIEW_STATE_QUALIFIER } from "./missing.js";'
		);
		assert.equal(
			resolveExportedStringValue(join(dir, 'dangling.js'), 'REVIEW_STATE_QUALIFIER').ok,
			false
		);
	}));

test('auditPinnedValues fails closed when a graph cannot be resolved at all', () =>
	withTempDir((dir) => {
		writeFileSync(join(dir, 'index.js'), 'export const UNRELATED = true;\n');
		writeFileSync(join(dir, 'index.d.ts'), 'export declare const UNRELATED: boolean;\n');
		const problems = auditPinnedValues(join(dir, 'index.js'), join(dir, 'index.d.ts'));
		assert.equal(problems.length, Object.keys(EXPECTED_PINNED_VALUES).length * 2);
		for (const problem of problems) {
			assert.match(problem, /cannot prove the pinned value of REVIEW_/);
		}
	}));
