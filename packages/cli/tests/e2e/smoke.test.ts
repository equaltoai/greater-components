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

beforeAll(async () => {
	// Build CLI
	console.log('Building CLI...');
	await execa('pnpm', ['build'], { cwd: CLI_ROOT });
});

test(
	'CLI Smoke Test: Init, Add, Build',
	async () => {
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

		console.log('Running init...');
		try {
			// 1. Init
			await execa('node', [CLI_BIN, 'init', '--yes', '--cwd', fixtureRoot], {
				env: { ...process.env, GREATER_CLI_LOCAL_REPO_ROOT: REPO_ROOT },
			});
			expect(await fs.pathExists(path.join(fixtureRoot, 'components.json'))).toBe(true);

			console.log('Running add faces/social...');
			// 2. Add Social Face
			await execa('node', [CLI_BIN, 'add', '--yes', 'faces/social', '--cwd', fixtureRoot], {
				env: { ...process.env, GREATER_CLI_LOCAL_REPO_ROOT: REPO_ROOT },
			});

			// Verify key files exist
			expect(await fs.pathExists(path.join(fixtureRoot, 'src/lib/components/Status/Root.svelte'))).toBe(
				true
			);
			expect(await fs.pathExists(path.join(fixtureRoot, 'src/lib/generics/index.ts'))).toBe(true);
			expect(await fs.pathExists(path.join(fixtureRoot, 'src/lib/greater/headless/button.ts'))).toBe(
				true
			);

			console.log('Running svelte-kit sync...');
			// 3. SvelteKit sync
			await execa(path.join(CLI_ROOT, 'node_modules/.bin/svelte-kit'), ['sync'], {
				cwd: fixtureRoot,
				stdio: 'inherit',
			});

			console.log('Running build...');
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
