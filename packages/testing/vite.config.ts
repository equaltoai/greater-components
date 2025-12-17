import { defineConfig } from 'vite';
import { resolve } from 'path';
import { computeExternal } from '../../scripts/vite/external';

export default defineConfig({
	build: {
		lib: {
			entry: {
				index: resolve(__dirname, 'src/index.ts'),
				'playwright/index': resolve(__dirname, 'src/playwright/index.ts'),
				'vitest/index': resolve(__dirname, 'src/vitest/index.ts'),
				'a11y/index': resolve(__dirname, 'src/a11y/index.ts'),
			},
			name: 'GreaterTesting',
			formats: ['es'],
		},
		rollupOptions: {
			external: computeExternal(__dirname),
			output: {
				dir: 'dist',
				format: 'es',
				entryFileNames: '[name].js',
				chunkFileNames: '[name]-[hash].js',
			},
		},
		sourcemap: true,
		target: 'esnext',
		minify: false, // Keep readable for debugging
	},
});
