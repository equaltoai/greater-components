import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
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
			entry: {
				index: resolve(__dirname, 'src/index.ts'),
				'primitives/button': resolve(__dirname, 'src/primitives/button.ts'),
				'primitives/modal': resolve(__dirname, 'src/primitives/modal.ts'),
				'primitives/menu': resolve(__dirname, 'src/primitives/menu.ts'),
				'primitives/tooltip': resolve(__dirname, 'src/primitives/tooltip.ts'),
				'primitives/tabs': resolve(__dirname, 'src/primitives/tabs.ts'),
				// Behaviors - Framework-agnostic utilities
				'behaviors/index': resolve(__dirname, 'src/behaviors/index.ts'),
				'behaviors/focus-trap': resolve(__dirname, 'src/behaviors/focus-trap.ts'),
				'behaviors/roving-tabindex': resolve(__dirname, 'src/behaviors/roving-tabindex.ts'),
				'behaviors/typeahead': resolve(__dirname, 'src/behaviors/typeahead.ts'),
				'behaviors/popover': resolve(__dirname, 'src/behaviors/popover.ts'),
				'behaviors/dismissable': resolve(__dirname, 'src/behaviors/dismissable.ts'),
				'behaviors/live-region': resolve(__dirname, 'src/behaviors/live-region.ts'),
			},
			name: 'GreaterHeadless',
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
		outDir: 'dist',
		emptyOutDir: true,
		sourcemap: true,
	},
});
