/**
 * E2E: vendored blog-face install must actually resolve and compile.
 *
 * `greater add review` shipped a checksum-valid but broken install: the registry
 * enumerated the Review files correctly and their checksums verified, but
 * `Review` was missing from `transform.ts:BLOG_COMPONENT_ROOTS`, so the vendored
 * components kept `../../types.js` imports while `blog-types` installs as
 * `lib/blog-types.ts`. Nothing in the suite noticed, because every existing
 * check stopped at "the right bytes arrived".
 *
 * These tests run the real pipeline — real catalog entry, real source files,
 * real `getInstallTarget`, real `transformImports` — into a temp consumer, and
 * then check the two things bytes-level verification cannot:
 *
 *   1. every relative import in the vendored tree resolves to a file that was
 *      actually installed, and
 *   2. the vendored TypeScript compiles.
 *
 * The resolution sweep runs over *every* blog-face component in the catalog, so
 * a future component added without its `BLOG_COMPONENT_ROOTS` entry fails here
 * rather than in a consumer's build.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { componentRegistry } from '../../src/registry/index.js';
import type { ComponentConfig } from '../../src/utils/config.js';
import { getInstallTarget } from '../../src/utils/install-path.js';
import { transformImports } from '../../src/utils/transform.js';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');

/**
 * A fully-vendored SvelteKit consumer, matching what `greater init` writes for
 * `installMode: 'vendored'`.
 */
const CONFIG: ComponentConfig = {
	$schema: 'https://greater-components.pages.dev/schema.json',
	style: 'default',
	typescript: true,
	installMode: 'vendored',
	tailwind: { config: '', css: 'src/app.css', baseColor: 'slate', cssVariables: true },
	aliases: {
		components: '$lib/components',
		utils: '$lib/utils',
		ui: '$lib/components/ui',
		hooks: '$lib/primitives',
		lib: '$lib',
		greater: '$lib/greater',
	},
} as ComponentConfig;

/**
 * Mirrors `fetch.ts`'s virtual-path → monorepo-source resolution for the blog
 * face. Deliberately narrow: this test is about the blog install layout.
 */
function resolveSource(virtualPath: string): string {
	const normalized = virtualPath.replace(/\\/g, '/');

	if (normalized === 'lib/blog-types.ts') {
		return path.join(repoRoot, 'packages/faces/blog/src/types.ts');
	}
	if (normalized === 'lib/blog-share.ts') {
		return path.join(repoRoot, 'packages/faces/blog/src/share.ts');
	}
	if (normalized.startsWith('lib/components/')) {
		const rest = normalized.slice('lib/components/'.length);
		return path.join(repoRoot, 'packages/faces/blog/src/components', rest);
	}

	throw new Error(`No blog-face source mapping for virtual path: ${virtualPath}`);
}

/** Every catalog entry belonging to the blog face. */
function blogCatalogEntries() {
	return Object.entries(componentRegistry).filter(
		([, entry]) => (entry as { domain?: string }).domain === 'blog'
	);
}

/**
 * Installs a set of catalog entries into `root` exactly as `add` would:
 * `getInstallTarget` for the destination, `transformImports` keyed on the
 * install-relative path (add.ts maps the path *before* transforming).
 */
function vendorEntries(root: string, entryNames: string[]): string[] {
	const written: string[] = [];

	for (const name of entryNames) {
		const entry = componentRegistry[name];
		if (!entry) throw new Error(`catalog entry '${name}' is missing`);

		for (const file of entry.files) {
			const source = resolveSource(file.path);
			expect(
				fs.existsSync(source),
				`catalog entry '${name}' points at a non-existent source: ${file.path}`
			).toBe(true);

			const target = getInstallTarget(file.path, CONFIG, root);
			const destination = path.join(target.targetDir, target.relativePath);

			const transformed = transformImports(
				fs.readFileSync(source, 'utf8'),
				CONFIG,
				// add.ts remaps file.path to the install-relative path first.
				target.relativePath
			);

			fs.mkdirSync(path.dirname(destination), { recursive: true });
			fs.writeFileSync(destination, transformed.content);
			written.push(destination);
		}
	}

	return written;
}

/** Extracts the specifier of every import/export-from in a file. */
function importSpecifiers(content: string): string[] {
	const specifiers: string[] = [];
	const patterns = [
		/(?:^|[;\n\r])\s*import\s+[^'"]+?from\s*(['"])([^'"]+)\1/g,
		/(?:^|[;\n\r])\s*import\s*(['"])([^'"]+)\1/g,
		/(?:^|[;\n\r])\s*export\s+[^'"]+?from\s*(['"])([^'"]+)\1/g,
		/(?<![\w$])import\s*\(\s*(['"])([^'"]+)\1\s*\)/g,
	];

	for (const pattern of patterns) {
		let match: RegExpExecArray | null;
		while ((match = pattern.exec(content)) !== null) {
			if (match[2]) specifiers.push(match[2]);
		}
	}

	return specifiers;
}

/**
 * Resolves a relative specifier against the installed tree, accepting the
 * TS/Svelte extension substitutions a bundler would make.
 */
function resolvesOnDisk(fromFile: string, specifier: string): boolean {
	const base = path.resolve(path.dirname(fromFile), specifier);
	const withoutExt = base.replace(/\.(js|ts|svelte)$/, '');

	const candidates = [
		base,
		`${withoutExt}.ts`,
		`${withoutExt}.js`,
		`${withoutExt}.svelte`,
		path.join(base, 'index.ts'),
		path.join(base, 'index.js'),
	];

	return candidates.some((candidate) => fs.existsSync(candidate));
}

describe('vendored blog-face install', () => {
	let root: string;

	beforeAll(() => {
		root = fs.mkdtempSync(path.join(os.tmpdir(), 'greater-vendored-blog-'));
	});

	afterAll(() => {
		fs.rmSync(root, { recursive: true, force: true });
	});

	it('resolves every relative import across the whole blog face', () => {
		// Install every blog entry together, which is what a consumer taking the
		// face ends up with, and what makes cross-component imports checkable.
		const names = blogCatalogEntries().map(([name]) => name);
		expect(names).toContain('review');

		const target = path.join(root, 'all');
		const written = vendorEntries(target, names);

		const unresolved: string[] = [];
		for (const file of written) {
			const content = fs.readFileSync(file, 'utf8');
			for (const specifier of importSpecifiers(content)) {
				if (!specifier.startsWith('.')) continue;
				if (!resolvesOnDisk(file, specifier)) {
					unresolved.push(`${path.relative(target, file)} → ${specifier}`);
				}
			}
		}

		expect(unresolved).toEqual([]);
	});

	it('installs review alongside blog-types with rewritten type imports', () => {
		const target = path.join(root, 'review');
		vendorEntries(target, ['review', 'blog-types']);

		const libDir = path.join(target, 'src/lib');
		expect(fs.existsSync(path.join(libDir, 'blog-types.ts'))).toBe(true);

		for (const file of ['QueueCard.svelte', 'AttributionStrip.svelte', 'VerdictActions.svelte']) {
			const installed = path.join(libDir, 'components/Review', file);
			expect(fs.existsSync(installed), `${file} was not installed`).toBe(true);

			const content = fs.readFileSync(installed, 'utf8');
			// The install-layout rewrite: source `../../types.js` (packages/faces/blog/src/types.ts)
			// becomes `../../blog-types.js` (lib/blog-types.ts).
			expect(content, file).not.toContain("from '../../types.js'");
			expect(content, file).toContain("from '../../blog-types.js'");
		}

		const state = fs.readFileSync(path.join(libDir, 'components/Review/state.ts'), 'utf8');
		expect(state).toContain("from '../../blog-types.js'");
		expect(state).not.toContain("from '../../types.js'");
	});

	it('compiles the vendored TypeScript', () => {
		const target = path.join(root, 'compile');
		vendorEntries(target, ['review', 'blog-types']);

		const libDir = path.join(target, 'src/lib');

		// Two things a real consumer supplies that are out of scope here:
		//
		//   * the core packages behind the `$lib/greater/*` alias, which it resolves
		//     to its own vendored copies, and
		//   * `.svelte` module typing, which comes from the Svelte toolchain.
		//
		// Both are declared ambiently so this run checks what it is actually for:
		// that the vendored *TypeScript* type-checks in its installed layout. The
		// `*.svelte` wildcard means tsc cannot report a missing component file, so
		// the "resolves every relative import" test above — which checks .svelte
		// specifiers against the real filesystem — is what covers that half.
		fs.writeFileSync(
			path.join(libDir, 'greater-shims.d.ts'),
			[
				"declare module '$lib/greater/utils' {",
				'\texport function formatDateTime(value: string | Date): { absolute: string; iso: string };',
				'\texport const __greaterUtils: unknown;',
				'}',
				"declare module '$lib/greater/primitives';",
				"declare module '$lib/greater/icons';",
				"declare module '*.svelte' {",
				'\tconst component: unknown;',
				'\texport default component;',
				'}',
				'',
			].join('\n')
		);

		const tsconfig = {
			compilerOptions: {
				target: 'ES2022',
				module: 'ESNext',
				moduleResolution: 'bundler',
				strict: true,
				noEmit: true,
				skipLibCheck: true,
				allowImportingTsExtensions: true,
				types: [],
				paths: { '$lib/*': ['./src/lib/*'] },
			},
			include: ['src/lib/**/*.ts', 'src/lib/**/*.d.ts'],
		};
		fs.writeFileSync(path.join(target, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));

		const tsc = path.join(repoRoot, 'node_modules/.bin/tsc');
		let output = '';
		try {
			execFileSync(tsc, ['--noEmit', '--project', path.join(target, 'tsconfig.json')], {
				encoding: 'utf8',
				stdio: ['ignore', 'pipe', 'pipe'],
			});
		} catch (error) {
			const failure = error as { stdout?: string; stderr?: string };
			output = `${failure.stdout ?? ''}${failure.stderr ?? ''}`;
		}

		// TS2307 on a relative specifier is exactly the F3 failure: a file was
		// installed under a name its neighbours do not import it by.
		const unresolvedRelative = output
			.split('\n')
			.filter((line) => /error TS2307/.test(line) && /Cannot find module '\.\.?\//.test(line));

		expect(unresolvedRelative).toEqual([]);
		expect(output, 'vendored blog TypeScript failed to compile').toBe('');
	}, 120_000);
});
