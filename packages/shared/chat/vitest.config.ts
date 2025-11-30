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
				'../../../packages/primitives/src/index.ts'
			),
			'@equaltoai/greater-components-headless': path.resolve(
				__dirname,
				'../../../packages/headless/src/index.ts'
			),
			'@equaltoai/greater-components-icons': path.resolve(
				__dirname,
				'../../../packages/icons/src/index.ts'
			),
			'@equaltoai/greater-components-content': path.resolve(
				__dirname,
				'../../../packages/content/src/index.ts'
			),
			'@equaltoai/greater-components-utils': path.resolve(
				__dirname,
				'../../../packages/utils/src/index.ts'
			),
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
			thresholds: {
				global: {
					branches: 60,
					functions: 60,
					lines: 60,
					statements: 60,
				},
			},
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
