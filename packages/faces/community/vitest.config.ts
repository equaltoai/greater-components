import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [
		svelte({
			compilerOptions: {
				runes: true,
			},
		}),
	],
	test: {
		include: ['tests/**/*.test.ts'],
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./tests/setup.ts'],
		server: {
			deps: {
				inline: [/svelte/],
			},
		},
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			include: ['src/**/*.{ts,svelte}'],
			exclude: ['src/**/*.d.ts', 'src/**/index.ts'],
		},
	},
	resolve: {
		conditions: ['browser'],
	},
});
