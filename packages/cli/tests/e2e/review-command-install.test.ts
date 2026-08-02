/**
 * E2E: `greater add review` — the real command path.
 *
 * `vendored-blog-install.test.ts` reconstructs the install from the catalog with
 * a test-local helper. That pins down the transform and install-layout maths,
 * but it never runs the command a consumer actually runs, so a regression in
 * `add`'s dependency resolution, fetch, or write ordering would not surface
 * there.
 *
 * This test drives the built CLI binary the way `smoke.test.ts` does — real
 * `greater init`, then real `greater add review` — against a scratch SvelteKit
 * project, and then checks the three things the F3 regression broke:
 *
 *   1. `add review` resolves and installs the dependency closure (`review` plus
 *      `blog-types`, which carries the types the Review modules import),
 *   2. every vendored Review module imports `../../blog-types.js` rather than
 *      the source tree's `../../types.js`, and
 *   3. the installed tree type-checks in its installed layout.
 *
 * Hermetic: the CLI resolves everything from this checkout via
 * `GREATER_CLI_LOCAL_REPO_ROOT`, so nothing is fetched over the network, and
 * `svelte` is already declared in the fixture's package.json so `add` has no
 * missing npm dependency to install. The scratch project lives under
 * `tests/.tmp` (gitignored) so workspace `node_modules` resolve by walking up,
 * matching `smoke.test.ts`, and is removed in a `finally`.
 */

import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import { componentRegistry } from '../../src/registry/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI_ROOT = path.resolve(__dirname, '../../');
const CLI_BIN = path.join(CLI_ROOT, 'dist/index.js');
const FIXTURE_TEMPLATE_ROOT = path.resolve(__dirname, '../fixtures/cli-fixture');
const TMP_ROOT = path.resolve(__dirname, '../.tmp');
const REPO_ROOT = path.resolve(CLI_ROOT, '../../');
const TSC_BIN = path.join(REPO_ROOT, 'node_modules/.bin/tsc');
const SVELTE_KIT_BIN = path.join(CLI_ROOT, 'node_modules/.bin/svelte-kit');
const VITE_BIN = path.join(CLI_ROOT, 'node_modules/.bin/vite');

/** Runs the CLI against this checkout instead of the network. */
const CLI_ENV = { ...process.env, GREATER_CLI_LOCAL_REPO_ROOT: REPO_ROOT };

/**
 * Third-party packages the vendored core pulls in. The fixture installs nothing,
 * so link them from the workspace exactly as `smoke.test.ts` does — otherwise
 * `tsc` reports unresolved bare specifiers that have nothing to do with the
 * install layout under test.
 */
const WORKSPACE_LINKS = [
	['packages/content/node_modules', 'hast-util-sanitize'],
	['packages/content/node_modules', 'rehype-sanitize'],
	['packages/content/node_modules', 'rehype-stringify'],
	['packages/content/node_modules', 'remark-gfm'],
	['packages/content/node_modules', 'remark-parse'],
	['packages/content/node_modules', 'remark-rehype'],
	['packages/content/node_modules', 'shiki'],
	['packages/content/node_modules', 'unified'],
	['packages/headless/node_modules', 'focus-trap'],
	['packages/headless/node_modules', 'tabbable'],
] as const;

/**
 * The Review modules that import the blog types. `index.ts` is the fifth
 * catalog file and only re-exports, so it has no type import to rewrite.
 */
const REVIEW_TYPE_IMPORTERS = [
	'QueueCard.svelte',
	'AttributionStrip.svelte',
	'VerdictActions.svelte',
	'state.ts',
] as const;

beforeAll(async () => {
	// This test executes dist/index.js, so always compile the source under test.
	await execa('pnpm', ['build'], { cwd: CLI_ROOT });
}, 300_000);

/** Copies the fixture template, dropping the generated state `init` recreates. */
async function createScratchProject(): Promise<string> {
	await fs.ensureDir(TMP_ROOT);
	const root = await fs.mkdtemp(path.join(TMP_ROOT, 'review-command-'));

	await fs.copy(FIXTURE_TEMPLATE_ROOT, root, {
		filter: (src) => {
			const relative = path.relative(FIXTURE_TEMPLATE_ROOT, src);
			if (!relative || relative === '.') return true;

			const normalized = relative.replace(/\\/g, '/');
			return ![
				'.svelte-kit',
				'node_modules',
				'.vite',
				'build',
				'dist',
				'components.json',
				'src/lib',
				'src/greater',
				'styles',
				'pnpm-lock.yaml',
				'package-lock.json',
				'yarn.lock',
			].some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`));
		},
	});

	return root;
}

async function linkWorkspaceDependencies(root: string): Promise<void> {
	for (const [fromDir, packageName] of WORKSPACE_LINKS) {
		const target = path.join(root, 'node_modules', packageName);
		if (await fs.pathExists(target)) continue;

		const source = path.join(REPO_ROOT, fromDir, packageName);
		if (!(await fs.pathExists(source))) continue;

		await fs.ensureDir(path.dirname(target));
		await fs.symlink(source, target, process.platform === 'win32' ? 'junction' : 'dir');
	}
}

async function getFilesRecursively(dir: string): Promise<string[]> {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	const files: string[] = [];
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) files.push(...(await getFilesRecursively(fullPath)));
		else files.push(fullPath);
	}
	return files;
}

function importSpecifiers(content: string): string[] {
	const specifiers: string[] = [];
	const executableContent = content
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/^\s*\/\/.*$/gm, '')
		.replace(/<!--[\s\S]*?-->/g, '');
	for (const pattern of [
		/(?:^|[;\n\r])\s*import\s+[^'"]+?from\s*(['"])([^'"]+)\1/g,
		/(?:^|[;\n\r])\s*import\s*(['"])([^'"]+)\1/g,
		/(?:^|[;\n\r])\s*export\s+[^'"]+?from\s*(['"])([^'"]+)\1/g,
		/(?<![\w$])import\s*\(\s*(['"])([^'"]+)\1\s*\)/g,
		/@import\s+(?:url\s*\(\s*)?(['"])([^'"]+)\1(?:\s*\))?/g,
	]) {
		let match: RegExpExecArray | null;
		while ((match = pattern.exec(executableContent)) !== null) {
			if (match[2]) specifiers.push(match[2]);
		}
	}
	return specifiers;
}

function resolvesOnDisk(fromFile: string, specifier: string): boolean {
	const cleanSpecifier = specifier.replace(/[?#].*$/, '');
	const base = path.resolve(path.dirname(fromFile), cleanSpecifier);
	const withoutExt = base.replace(/\.(?:[cm]?[jt]s|svelte|css)$/, '');
	return [
		base,
		`${withoutExt}.ts`,
		`${withoutExt}.js`,
		`${withoutExt}.svelte`,
		`${withoutExt}.svelte.ts`,
		`${withoutExt}.css`,
		path.join(base, 'index.ts'),
		path.join(base, 'index.js'),
		path.join(base, 'index.svelte'),
	].some((candidate) => fs.existsSync(candidate));
}

describe('greater add review (real command)', () => {
	it('preserves pins and installs a relative-import tree that type-checks and builds', async () => {
		const root = await createScratchProject();

		try {
			// 1. Real `greater init` — writes components.json in vendored mode.
			await execa('node', [CLI_BIN, 'init', '--yes', '--face', 'blog', '--cwd', root], {
				env: CLI_ENV,
			});
			expect(await fs.pathExists(path.join(root, 'components.json'))).toBe(true);
			const packageJsonPath = path.join(root, 'package.json');
			const manifestBeforeAdd = await fs.readFile(packageJsonPath, 'utf8');
			expect(JSON.parse(manifestBeforeAdd).devDependencies.viem).toBe('^2.47.14');

			// 2. The command under test. No `--all`: the closure below is what
			//    `review`'s own registryDependencies must pull in on their own.
			const addResult = await execa('node', [CLI_BIN, 'add', '--yes', 'review', '--cwd', root], {
				env: CLI_ENV,
			});

			// Consumer-owned declarations are never package-manager rewrite targets.
			// The adapters core requires viem ^2.55.10, while this fixture intentionally
			// pins an older range. The complete manifest bytes must survive `add`.
			expect(await fs.readFile(packageJsonPath, 'utf8')).toBe(manifestBeforeAdd);
			expect(`${addResult.stdout}\n${addResult.stderr}`).toContain(
				'viem: manifest ^2.47.14; Greater requires ^2.55.10'
			);

			// (a) Dependency closure: `blog-types` is not requested on the command
			//     line, it is reached through `review`'s registryDependencies.
			const componentsJson = await fs.readJson(path.join(root, 'components.json'));
			const installed = componentsJson.installed.map((entry: { name: string }) => entry.name);
			expect(installed).toContain('review');
			expect(installed).toContain('blog-types');

			const libDir = path.join(root, 'src/lib');
			expect(await fs.pathExists(path.join(libDir, 'blog-types.ts'))).toBe(true);

			// Every Greater-internal specifier emitted by the real add pipeline is
			// relative and resolves in the installed tree. No tsconfig/vite alias is
			// added for Greater internals; the stock SvelteKit fixture stays untouched.
			const unresolved: string[] = [];
			const bareAliasTargets: string[] = [];
			for (const file of await getFilesRecursively(libDir)) {
				if (!/\.(?:svelte|[cm]?[jt]s|css)$/.test(file)) continue;
				for (const specifier of importSpecifiers(await fs.readFile(file, 'utf8'))) {
					if (specifier.startsWith('.') && !resolvesOnDisk(file, specifier)) {
						unresolved.push(`${path.relative(root, file)} → ${specifier}`);
					}
					if (/^(?:src\/lib|\$lib)\/(?:greater|components)(?:\/|$)/.test(specifier)) {
						bareAliasTargets.push(`${path.relative(root, file)} → ${specifier}`);
					}
				}
			}
			expect(unresolved).toEqual([]);
			expect(bareAliasTargets).toEqual([]);

			// Every file the catalog claims for `review` has to land, so a catalog
			// entry that stops installing fails here rather than in a consumer.
			const reviewDir = path.join(libDir, 'components/Review');
			const catalogFiles = (componentRegistry['review']?.files ?? []).map((file) =>
				path.basename(file.path)
			);
			expect(catalogFiles.length).toBeGreaterThan(0);
			expect((await fs.readdir(reviewDir)).sort()).toEqual([...catalogFiles].sort());

			// (b) The F3 rewrite: source `../../types.js` (packages/faces/blog/src/types.ts)
			//     has to become `../../blog-types.js`, because `blog-types` installs
			//     as `src/lib/blog-types.ts`.
			for (const file of REVIEW_TYPE_IMPORTERS) {
				const installedPath = path.join(reviewDir, file);
				expect(await fs.pathExists(installedPath), `${file} was not installed`).toBe(true);

				const content = await fs.readFile(installedPath, 'utf-8');
				expect(content, file).not.toContain("'../../types.js'");
				expect(content, file).toContain("'../../blog-types.js'");
			}

			// (c) The installed tree type-checks. `$lib/greater/*` is left to
			//     resolve against the real vendored core the same `add` run wrote;
			//     only `*.svelte` is shimmed, because tsc cannot parse components.
			//     Relative `.svelte` specifiers are covered by the directory
			//     listing above and by `vendored-blog-install.test.ts`.
			await linkWorkspaceDependencies(root);
			await fs.writeFile(
				path.join(root, 'src/routes/+page.svelte'),
				[
					'<script lang="ts">',
					"\timport QueueCard from '$lib/components/Review/QueueCard.svelte';",
					"\timport * as greaterUtils from '$lib/greater/utils';",
					'\tconst installedComponent = QueueCard;',
					"\tconst className = Object.keys(greaterUtils).length ? 'greater-resolution-proof' : '';",
					'</script>',
					'',
					"<p class={className}>{installedComponent ? 'vendored imports resolve' : 'missing'}</p>",
					'',
				].join('\n')
			);

			await fs.writeFile(
				path.join(libDir, 'review-shims.d.ts'),
				[
					"declare module '*.svelte' {",
					'\tconst component: unknown;',
					'\texport default component;',
					'}',
					'',
				].join('\n')
			);

			const tsconfigPath = path.join(root, 'tsconfig.review.json');
			await fs.writeJson(
				tsconfigPath,
				{
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
					include: [
						'src/lib/components/Review/**/*.ts',
						'src/lib/blog-types.ts',
						'src/lib/review-shims.d.ts',
					],
				},
				{ spaces: 2 }
			);

			const typecheck = await execa(TSC_BIN, ['--noEmit', '--project', tsconfigPath], {
				reject: false,
			});
			const output = `${typecheck.stdout ?? ''}${typecheck.stderr ?? ''}`;

			// TS2307 on a relative specifier is exactly the F3 failure: a file
			// installed under a name its neighbours do not import it by.
			const unresolvedRelative = output
				.split('\n')
				.filter((line) => /error TS2307/.test(line) && /Cannot find module '\.\.?\//.test(line));

			expect(unresolvedRelative).toEqual([]);
			expect(output, 'the installed Review tree failed to type-check').toBe('');

			// Standard SvelteKit + Vite build, using only the configuration `init`
			// scaffolded in the fresh fixture.
			await execa(SVELTE_KIT_BIN, ['sync'], { cwd: root });
			const build = await execa(VITE_BIN, ['build'], { cwd: root, reject: false });
			expect(build.exitCode, `fresh consumer build failed:\n${build.stdout}\n${build.stderr}`).toBe(
				0
			);
		} finally {
			await fs.remove(root);
		}
	}, 300_000);
});
