import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const exampleDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(exampleDir, '../..');
const agentFaceRequire = createRequire(resolve(repoRoot, 'packages/faces/agent/package.json'));
const { svelte } = await import(agentFaceRequire.resolve('@sveltejs/vite-plugin-svelte'));

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
		.filter(
			([key]) =>
				key !== '@equaltoai/greater-components' && key !== '@equaltoai/greater-components/*'
		)
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

const forceEsbuildCssMinify = () => ({
	name: 'agent-face-example-force-esbuild-css-minify',
	config() {
		return {
			build: {
				cssMinify: 'esbuild',
			},
		};
	},
});

export default defineConfig({
	root: exampleDir,
	publicDir: false,
	plugins: [
		forceEsbuildCssMinify(),
		svelte({
			compilerOptions: {
				runes: true,
			},
		}),
	],
	resolve: {
		conditions: ['svelte', 'browser', 'module', 'import', 'default'],
		dedupe: ['svelte'],
		alias: [
			{
				find: /^@equaltoai\/greater-components\/faces\/agent\/style\.css$/,
				replacement: resolve(repoRoot, 'packages/faces/agent/src/theme.css'),
			},
			{
				find: /^@equaltoai\/greater-components\/faces\/agent$/,
				replacement: resolve(repoRoot, 'packages/faces/agent/src/index.ts'),
			},
			{
				find: /^@equaltoai\/greater-components\/primitives\/style\.css$/,
				replacement: resolve(repoRoot, 'packages/primitives/dist/style.css'),
			},
			{
				find: /^@equaltoai\/greater-components\/primitives$/,
				replacement: resolve(repoRoot, 'packages/primitives/src/index.ts'),
			},
			{
				find: /^@equaltoai\/greater-components\/tokens\/theme\.css$/,
				replacement: resolve(repoRoot, 'packages/tokens/dist/theme.css'),
			},
			...createWorkspaceAliases(),
		],
	},
	build: {
		outDir: resolve(exampleDir, 'dist'),
		emptyOutDir: true,
	},
});
