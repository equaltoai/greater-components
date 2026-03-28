import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const exampleDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(exampleDir, '../..');
const communityRequire = createRequire(resolve(repoRoot, 'packages/faces/community/package.json'));
const { svelte } = await import(communityRequire.resolve('@sveltejs/vite-plugin-svelte'));

interface TsConfigPaths {
	compilerOptions?: {
		paths?: Record<string, string[]>;
	};
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function createWorkspaceAliases() {
	const tsconfig = JSON.parse(
		readFileSync(resolve(repoRoot, 'tsconfig.base.json'), 'utf8')
	) as TsConfigPaths;
	const paths = tsconfig.compilerOptions?.paths ?? {};

	return Object.entries(paths)
		.filter(([key]) => key.startsWith('@equaltoai/greater-components'))
		.map(([key, targets]) => {
			const [target] = targets;

			if (!target) {
				throw new Error(`Missing target for tsconfig path alias ${key}`);
			}

			const normalizedTarget = target.replace(/^\.\//, '');

			if (key.endsWith('/*')) {
				const prefix = key.slice(0, -2);
				return {
					find: new RegExp(`^${escapeRegExp(prefix)}/(.*)$`),
					replacement: resolve(repoRoot, normalizedTarget.replace(/\*$/, '$1')),
				};
			}

			return {
				find: new RegExp(`^${escapeRegExp(key)}$`),
				replacement: resolve(repoRoot, normalizedTarget),
			};
		});
}

export default defineConfig({
	root: exampleDir,
	publicDir: false,
	plugins: [svelte()],
	resolve: {
		alias: createWorkspaceAliases(),
		conditions: ['svelte', 'browser', 'module', 'import', 'default'],
		dedupe: ['svelte'],
	},
	build: {
		manifest: true,
		outDir: resolve(exampleDir, 'dist/client'),
		emptyOutDir: true,
		assetsInlineLimit: 0,
		rollupOptions: {
			input: resolve(exampleDir, 'src/client/home.ts'),
			output: {
				entryFileNames: 'facetheory/[name]-[hash].js',
				chunkFileNames: 'facetheory/[name]-[hash].js',
				assetFileNames: 'facetheory/[name]-[hash][extname]',
			},
		},
	},
});
