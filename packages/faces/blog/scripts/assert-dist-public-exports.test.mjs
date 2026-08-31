/**
 * Unit tests for the post-build dist public-export parity assertion.
 *
 * The script's job is to fail a build whose built package root stops carrying
 * the pinned #1055 review exports. These tests pin the script's own logic —
 * the export-statement parser, the `export *` follower, the exports-map
 * condition check, and the Node-import boundary that makes static inspection
 * the right mechanism — so a parser regression cannot silently weaken the
 * gate. Run via `pnpm test:scripts:blog-dist-exports` (wired into
 * `pnpm test:scripts`, which CI runs after "Build packages").
 */

import assert from 'node:assert/strict';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';

import {
	REQUIRED_PUBLIC_EXPORTS,
	collectModuleExports,
	mismatchedRootConditions,
	missingRequiredExports,
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
