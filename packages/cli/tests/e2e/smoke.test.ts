import { test, expect, beforeAll } from 'vitest';
import { execa } from 'execa';
import path from 'node:path';
import fs from 'fs-extra';
import { fileURLToPath } from 'node:url';
import { hasGreaterImports } from '../../src/utils/transform.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI_ROOT = path.resolve(__dirname, '../../');
const CLI_BIN = path.join(CLI_ROOT, 'dist/index.js');
const FIXTURE_TEMPLATE_ROOT = path.resolve(__dirname, '../fixtures/cli-fixture');
const TMP_ROOT = path.resolve(__dirname, '../.tmp');
const REPO_ROOT = path.resolve(CLI_ROOT, '../../');
const CONTENT_NODE_MODULES = path.join(REPO_ROOT, 'packages/content/node_modules');
const CONTENT_DEPENDENCIES = [
	'hast-util-sanitize',
	'rehype-sanitize',
	'rehype-stringify',
	'remark-gfm',
	'remark-parse',
	'remark-rehype',
	'shiki',
	'unified',
] as const;

const FACE_CASES = [
	{
		face: 'social',
		componentFile: 'src/lib/components/Status/Root.svelte',
		componentImport: '$lib/components/Status/Root.svelte',
		componentName: 'StatusRoot',
		extraChecks: async (fixtureRoot: string) => {
			expect(await fs.pathExists(path.join(fixtureRoot, 'src/lib/generics/index.ts'))).toBe(true);
		},
	},
	{
		face: 'blog',
		componentFile: 'src/lib/components/Article/Root.svelte',
		componentImport: '$lib/components/Article/Root.svelte',
		componentName: 'ArticleRoot',
		extraChecks: async () => {},
	},
	{
		face: 'community',
		componentFile: 'src/lib/components/Thread/Root.svelte',
		componentImport: '$lib/components/Thread/Root.svelte',
		componentName: 'ThreadRoot',
		extraChecks: async () => {},
	},
	{
		face: 'artist',
		componentFile: 'src/lib/components/Artwork/Root.svelte',
		componentImport: '$lib/components/Artwork/Root.svelte',
		componentName: 'ArtworkRoot',
		extraChecks: async () => {},
	},
] as const;

beforeAll(async () => {
	// Build CLI
	console.log('Building CLI...');
	await execa('pnpm', ['build'], { cwd: CLI_ROOT });
});

test.each(FACE_CASES)(
	'CLI Smoke Test: Init, Add, Build ($face face)',
	async ({ face, componentFile, componentImport, componentName, extraChecks }) => {
		await fs.ensureDir(TMP_ROOT);
		const fixtureRoot = await fs.mkdtemp(path.join(TMP_ROOT, 'cli-fixture-'));

		await fs.copy(FIXTURE_TEMPLATE_ROOT, fixtureRoot, {
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

		try {
			console.log(`Running init (${face})...`);
			// 1. Init
			await execa('node', [CLI_BIN, 'init', '--yes', '--face', face, '--cwd', fixtureRoot], {
				env: { ...process.env, GREATER_CLI_LOCAL_REPO_ROOT: REPO_ROOT },
			});
			expect(await fs.pathExists(path.join(fixtureRoot, 'components.json'))).toBe(true);

			console.log(`Running add faces/${face}...`);
			// 2. Add Face
			await execa('node', [CLI_BIN, 'add', '--yes', `faces/${face}`, '--cwd', fixtureRoot], {
				env: { ...process.env, GREATER_CLI_LOCAL_REPO_ROOT: REPO_ROOT },
			});

			// Ensure we actually bundle installed code
			await fs.writeFile(
				path.join(fixtureRoot, 'src/routes/+page.svelte'),
				`<script lang="ts">
\timport ${componentName} from '${componentImport}';
\timport { createButton } from '$lib/greater/headless/button';

\tconst button = createButton();
</script>

<h1>Greater CLI Smoke (${face})</h1>

<button use:button.actions.button>Click</button>

<${componentName} />\n`
			);

			// The fixture does not install dependencies from the network.
			// Provide required third-party deps by linking from the monorepo workspace.
			for (const dep of CONTENT_DEPENDENCIES) {
				await ensureNodeModuleLink(fixtureRoot, dep, path.join(CONTENT_NODE_MODULES, dep));
			}

			// Verify key files exist
			expect(await fs.pathExists(path.join(fixtureRoot, componentFile))).toBe(true);
			expect(await fs.pathExists(path.join(fixtureRoot, 'src/lib/greater/headless/button.ts'))).toBe(
				true
			);
			await extraChecks(fixtureRoot);

			console.log(`Running svelte-kit sync (${face})...`);
			// 3. SvelteKit sync
			await execa(path.join(CLI_ROOT, 'node_modules/.bin/svelte-kit'), ['sync'], {
				cwd: fixtureRoot,
				stdio: 'inherit',
			});

			console.log(`Running build (${face})...`);
			// 4. Build (bundles installed components via routes)
			await execa(path.join(CLI_ROOT, 'node_modules/.bin/vite'), ['build'], {
				cwd: fixtureRoot,
				stdio: 'inherit',
			});

			// 5. Verify no @equaltoai/greater-components runtime imports in vendored files
			console.log('Verifying imports...');
			const srcDir = path.join(fixtureRoot, 'src');
			const files = await getFilesRecursively(srcDir);

			for (const file of files) {
				if (
					file.endsWith('.svelte') ||
					file.endsWith('.ts') ||
					file.endsWith('.js') ||
					file.endsWith('.d.ts')
				) {
					const content = await fs.readFile(file, 'utf-8');
					expect(hasGreaterImports(content), `File ${file} contains forbidden import`).toBe(false);
				}
			}
		} finally {
			await fs.remove(fixtureRoot);
		}
	},
	300000
);

async function getFilesRecursively(dir: string): Promise<string[]> {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	const files: string[] = [];
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await getFilesRecursively(fullPath)));
		} else {
			files.push(fullPath);
		}
	}
	return files;
}

async function ensureNodeModuleLink(
	fixtureRoot: string,
	packageName: string,
	workspacePackagePath: string
): Promise<void> {
	const targetPath = path.join(fixtureRoot, 'node_modules', packageName);
	if (await fs.pathExists(targetPath)) return;
	if (!(await fs.pathExists(workspacePackagePath))) return;

	await fs.ensureDir(path.dirname(targetPath));
	await fs.symlink(workspacePackagePath, targetPath, process.platform === 'win32' ? 'junction' : 'dir');
}
