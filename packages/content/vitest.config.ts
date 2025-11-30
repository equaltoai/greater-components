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
			'@equaltoai/greater-components-primitives': path.resolve(
				__dirname,
				'../primitives/src/index.ts'
			),
			'@equaltoai/greater-components-utils': path.resolve(__dirname, '../utils/src/index.ts'),
			'@equaltoai/greater-components-icons': path.resolve(__dirname, '../icons/src/index.ts'),
		},
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./tests/setup.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			reportsDirectory: './coverage',
			include: ['src/**/*.{ts,js,svelte}'],
			exclude: [
				'src/**/*.d.ts',
				'src/**/*.test.{ts,js}',
				'src/**/*.spec.{ts,js}',
				'tests/**/*',
				'dist/**/*',
				'node_modules/**/*',
			],
		},
	},
});
