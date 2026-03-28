import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(projectDir, '..', '..');

const forceEsbuildCssMinify = () => ({
	name: 'playground-force-esbuild-css-minify',
	config() {
		return {
			build: {
				cssMinify: 'esbuild' as const,
			},
		};
	},
});

export default defineConfig({
	envPrefix: ['VITE_', 'PLAYGROUND_'],
	plugins: [sveltekit(), forceEsbuildCssMinify()],
	server: {
		port: 5173,
		host: true,
	},
	// Avoid bundling heavy jsdom stack; rollup fails parsing cssstyle when included in SSR bundle.
	ssr: {
		external: ['jsdom', 'cssstyle', 'symbol-tree'],
	},
	resolve: {
		dedupe: ['svelte'],
		alias: [
			{
				find: /^@equaltoai\/greater-components\/faces\/agent\/style\.css$/,
				replacement: path.resolve(workspaceRoot, 'packages/faces/agent/src/theme.css'),
			},
			{
				find: /^@equaltoai\/greater-components\/faces\/agent$/,
				replacement: path.resolve(workspaceRoot, 'packages/faces/agent/src/index.ts'),
			},
			{
				find: /^@equaltoai\/greater-components\/primitives\/style\.css$/,
				replacement: path.resolve(workspaceRoot, 'packages/primitives/dist/style.css'),
			},
			{
				find: /^@equaltoai\/greater-components\/primitives$/,
				replacement: path.resolve(workspaceRoot, 'packages/primitives/src/index.ts'),
			},
			{
				find: /^@equaltoai\/greater-components\/tokens\/theme\.css$/,
				replacement: path.resolve(workspaceRoot, 'packages/tokens/dist/theme.css'),
			},
			{
				find: '$lib',
				replacement: path.resolve(projectDir, 'src/lib'),
			},
		],
	},
	optimizeDeps: {
		exclude: ['@equaltoai/greater-components-icons'],
	},
	test: {
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.{js,ts}'],
		globals: true,
	},
});
