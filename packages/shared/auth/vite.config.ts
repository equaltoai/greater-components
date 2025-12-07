import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
	plugins: [
		svelte({
			compilerOptions: {
				runes: true,
			},
		}),
	],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			formats: ['es'],
			fileName: 'index',
		},
		rollupOptions: {
			external: [
				'svelte',
				/^svelte\//,
				'@equaltoai/greater-components-headless',
				/^@equaltoai\/greater-components-headless\//,
				'@equaltoai/greater-components-primitives',
				/^@equaltoai\/greater-components-primitives\//,
				'@equaltoai/greater-components-icons',
				/^@equaltoai\/greater-components-icons\//,
				'@equaltoai/greater-components-tokens',
				/^@equaltoai\/greater-components-tokens\//,
				'@equaltoai/greater-components-utils',
				/^@equaltoai\/greater-components-utils\//,
			],
		},
	},
});
