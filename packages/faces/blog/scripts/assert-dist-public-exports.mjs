#!/usr/bin/env node
/**
 * Post-build public-export parity assertion for the Blog face.
 *
 * Issue #1055's security invariant requires proof that the *built package*
 * carries the pinned stale-approval wording and review-state qualifier —
 * proof that survives the gap between source and publishable artifact. This
 * script is that proof and runs at the end of the package `build` chain, so a
 * future build whose dist surface drops any required export fails the
 * canonical `pnpm build` / CI "Build packages" path.
 *
 * What it asserts:
 *
 * 1. `package.json` `exports["."]` keeps the `types` / `svelte` / `import`
 *    conditions pointed at `./dist/index.d.ts`, `./src/index.ts`, and
 *    `./dist/index.js` respectively — i.e. plain Node and bundler consumers
 *    genuinely route to the built surface, not only to the source alias.
 * 2. Both `dist/index.js` and `dist/index.d.ts` exist.
 * 3. The export surface of each entry file names every export in
 *    {@link REQUIRED_PUBLIC_EXPORTS}. `export *` re-exports are followed
 *    within `dist/` so a star re-export still counts — but only re-exports
 *    that resolve to a file actually carrying the name satisfy the check.
 *
 * Why static inspection instead of `await import(...)`:
 *
 * The built graph is not Node-loadable. `dist/index.js` transitively imports
 * raw `.svelte` modules (for example the primitives face re-exports
 * `Button.svelte`), and plain Node rejects them with
 * `ERR_UNKNOWN_FILE_EXTENSION` — consuming that graph requires a bundler with
 * the package's `svelte` condition. The boundary is asserted in the sibling
 * `assert-dist-public-exports.test.mjs`, so this script deliberately inspects
 * the emitted export statements deterministically instead of executing them.
 *
 * Note what this is NOT: it is not the Vitest `public-api-exports` test. That
 * test imports `@equaltoai/greater-components-blog` through the vitest alias
 * onto `src/`, so it proves source-entry reachability only; this script reads
 * the built dist files from disk and cannot be satisfied by that alias.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

/**
 * The exports the #1055 contract promises to consumers of the built package
 * (docs/faces/blog/review-workflow.md, the #1055 semver note). The wording
 * constants must stay importable from the package root after release/install,
 * or consumers silently fall back to paraphrased stale-approval text.
 */
export const REQUIRED_PUBLIC_EXPORTS = [
	'REVIEW_STALE_APPROVAL_LABEL',
	'REVIEW_STALE_APPROVAL_DETAIL',
	'REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL',
	'REVIEW_STATE_QUALIFIER',
];

/**
 * The `exports["."]` conditions the built package must keep: consumers
 * resolving `types`, bundlers resolving `svelte`, and plain `import` must all
 * land on the entries this script inspects.
 */
export const REQUIRED_ROOT_CONDITIONS = {
	types: './dist/index.d.ts',
	svelte: './src/index.ts',
	import: './dist/index.js',
};

/**
 * Removes block and line comments without touching string literals.
 *
 * @param {string} source
 * @returns {string}
 */
export function stripComments(source) {
	const noBlock = source.replace(/\/\*[\s\S]*?\*\//g, '');
	return noBlock.replace(/(^|[^:"'\\])\/\/[^\n\r]*/g, '$1');
}

/**
 * @param {string} specifierList
 * @returns {string[]}
 */
function parseSpecifierNames(specifierList) {
	return specifierList
		.split(',')
		.map((specifier) => specifier.trim())
		.filter((specifier) => specifier.length > 0)
		.map((specifier) => {
			const renamed = /\bas\s+([A-Za-z_$][\w$]*)/.exec(specifier);
			return renamed?.[1] ?? specifier;
		});
}

/**
 * Collects the names a single module exports, as far as static inspection can
 * see them: named export statements (with or without a `from` clause, including
 * `export type { ... }`), local declarations, and `export * as ns` namespaces.
 * Plain `export *` re-exports are returned separately in `starFrom` so the
 * caller can follow them into the re-exported files.
 *
 * @param {string} source
 * @returns {{ names: Set<string>, starFrom: string[] }}
 */
export function collectModuleExports(source) {
	const text = stripComments(source);
	const names = new Set();
	const starFrom = [];

	for (const match of text.matchAll(/export\s+(?:type\s+)?\{([^}]*)\}/g)) {
		for (const name of parseSpecifierNames(match[1] ?? '')) names.add(name);
	}

	for (const match of text.matchAll(
		/export\s+(?:declare\s+)?(?:const|let|var|function|class|interface|enum)\s+([A-Za-z_$][\w$]*)/g
	)) {
		names.add(match[1]);
	}

	for (const match of text.matchAll(/export\s+type\s+([A-Za-z_$][\w$]*)/g)) {
		names.add(match[1]);
	}

	for (const match of text.matchAll(
		/export\s*\*\s*as\s+([A-Za-z_$][\w$]*)\s+from\s*['"][^'"]+['"]/g
	)) {
		names.add(match[1]);
	}

	for (const match of text.matchAll(/export\s*\*\s*from\s*['"]([^'"]+)['"]/g)) {
		if (match[1] !== undefined) starFrom.push(match[1]);
	}

	return { names, starFrom };
}

/**
 * Resolves the complete export surface of an entry module by following
 * relative `export *` re-exports (cycle-safe). Non-relative star targets are
 * external packages and contribute nothing this script can verify.
 *
 * @param {string} entryPath
 * @returns {Set<string>}
 */
export function resolveExportSurface(entryPath) {
	const names = new Set();
	const seen = new Set();
	const queue = [entryPath];

	while (queue.length > 0) {
		const current = queue.shift();
		if (current === undefined) continue;
		const canonical = path.resolve(current);
		if (seen.has(canonical)) continue;
		seen.add(canonical);

		const { names: own, starFrom } = collectModuleExports(fs.readFileSync(canonical, 'utf8'));
		for (const name of own) names.add(name);

		for (const target of starFrom) {
			if (!target.startsWith('.')) continue;
			queue.push(path.resolve(path.dirname(canonical), target));
		}
	}

	return names;
}

/**
 * Returns the required names missing from an export surface.
 *
 * @param {Set<string>} surface
 * @param {string[]} [required]
 * @returns {string[]}
 */
export function missingRequiredExports(surface, required = REQUIRED_PUBLIC_EXPORTS) {
	return required.filter((name) => !surface.has(name));
}

/**
 * Returns every root condition whose value differs from the required map.
 *
 * @param {{ [key: string]: unknown } | null | undefined} exportsField
 * @param {{ [condition: string]: string }} [required]
 * @returns {Array<{ condition: string, expected: string, actual: unknown }>}
 */
export function mismatchedRootConditions(exportsField, required = REQUIRED_ROOT_CONDITIONS) {
	const root =
		exportsField && typeof exportsField['.'] === 'object' && exportsField['.'] !== null
			? /** @type {{ [condition: string]: unknown }} */ (exportsField['.'])
			: undefined;
	return Object.entries(required)
		.filter(([condition, expected]) => root?.[condition] !== expected)
		.map(([condition, expected]) => ({
			condition,
			expected,
			actual: root?.[condition] ?? '(absent)',
		}));
}

/**
 * @param {string[]} messages
 * @returns {never}
 */
function fail(messages) {
	for (const message of messages) {
		console.error(`dist public-export parity: ${message}`);
	}
	process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
	const pkg = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8'));
	const errors = [];

	const mismatches = mismatchedRootConditions(pkg.exports);
	for (const { condition, expected, actual } of mismatches) {
		errors.push(
			`package.json exports["."].${condition} is ${actual}; expected ${expected} so consumers resolve the built surface`
		);
	}

	const jsEntry = path.join(packageDir, 'dist', 'index.js');
	const dtsEntry = path.join(packageDir, 'dist', 'index.d.ts');
	for (const entry of [jsEntry, dtsEntry]) {
		if (!fs.existsSync(entry)) {
			errors.push(`${path.relative(packageDir, entry)} is missing; run pnpm build first`);
		}
	}

	if (errors.length === 0) {
		for (const entry of [jsEntry, dtsEntry]) {
			const surface = resolveExportSurface(entry);
			const missing = missingRequiredExports(surface);
			if (missing.length > 0) {
				errors.push(
					`${path.relative(packageDir, entry)} does not export ${missing.join(', ')} — ` +
						'the built package root must carry the pinned #1055 review exports'
				);
			}
		}
	}

	if (errors.length > 0) fail(errors);

	console.log(
		`dist public-export parity holds: exports["."] conditions route to the built surface and ` +
			`dist/index.js + dist/index.d.ts export ${REQUIRED_PUBLIC_EXPORTS.join(', ')}.`
	);
}
