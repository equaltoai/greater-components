import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

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
				index: path.resolve(__dirname, 'src/index.ts'),
				'primitives/button': path.resolve(__dirname, 'src/primitives/button.ts'),
				'primitives/modal': path.resolve(__dirname, 'src/primitives/modal.ts'),
				'primitives/menu': path.resolve(__dirname, 'src/primitives/menu.ts'),
				'primitives/tooltip': path.resolve(__dirname, 'src/primitives/tooltip.ts'),
				'primitives/tabs': path.resolve(__dirname, 'src/primitives/tabs.ts'),
				// Behaviors - Framework-agnostic utilities
				'behaviors/index': path.resolve(__dirname, 'src/behaviors/index.ts'),
				'behaviors/focus-trap': path.resolve(__dirname, 'src/behaviors/focus-trap.ts'),
				'behaviors/roving-tabindex': path.resolve(__dirname, 'src/behaviors/roving-tabindex.ts'),
				'behaviors/typeahead': path.resolve(__dirname, 'src/behaviors/typeahead.ts'),
				'behaviors/popover': path.resolve(__dirname, 'src/behaviors/popover.ts'),
				'behaviors/dismissable': path.resolve(__dirname, 'src/behaviors/dismissable.ts'),
				'behaviors/live-region': path.resolve(__dirname, 'src/behaviors/live-region.ts'),
			},
			name: 'GreaterHeadless',
			formats: ['es'],
		},
		rollupOptions: {
			external: ['svelte', 'svelte/store', 'svelte/internal', 'focus-trap', 'tabbable'],
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
