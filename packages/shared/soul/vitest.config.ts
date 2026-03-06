import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
	plugins: [
		svelte({
			compilerOptions: {
				runes: true,
			},
			emitCss: false,
		}),
	],
	resolve: {
		conditions: ['browser'],
		alias: {
			'@equaltoai/greater-components-adapters': path.resolve(
				__dirname,
				'../../adapters/src/index.ts'
			),
			'@equaltoai/greater-components-primitives': path.resolve(
				__dirname,
				'../../primitives/src/index.ts'
			),
			'@equaltoai/greater-components-utils': path.resolve(__dirname, '../../utils/src/index.ts'),
		},
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./tests/setup.ts'],
		include: ['tests/**/*.test.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			reportsDirectory: './coverage',
			include: ['src/**/*.{ts,js,svelte}'],
			exclude: ['src/**/*.d.ts', 'tests/**/*', 'dist/**/*', 'node_modules/**/*'],
		},
	},
});

