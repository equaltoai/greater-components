import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	envPrefix: ['VITE_', 'PLAYGROUND_'],
	plugins: [sveltekit()],
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
		alias: {
			$lib: path.resolve(projectDir, 'src/lib'),
		},
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
