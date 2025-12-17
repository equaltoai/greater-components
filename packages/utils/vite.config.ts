import { defineConfig } from 'vite';
import { resolve } from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { computeExternal } from '../../scripts/vite/external';

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
			name: 'GreaterUtils',
			formats: ['es'],
		},
		rollupOptions: {
			external: computeExternal(__dirname),
			output: {
				preserveModules: true,
				preserveModulesRoot: 'src',
				exports: 'named',
				entryFileNames: '[name].js',
			},
		},
		sourcemap: true,
		outDir: 'dist',
		emptyOutDir: true,
	},
});
