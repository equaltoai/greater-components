import { defineConfig } from 'vitest/config';
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
	resolve: {
		conditions: ['browser'],
		alias: {
			'@equaltoai/greater-components-fediverse': resolve(__dirname, 'src'),
			'@equaltoai/greater-components-primitives': resolve(
				__dirname,
				'../../primitives/src/index.ts'
			),
			'@equaltoai/greater-components-icons': resolve(__dirname, '../../icons/src/index.ts'),
			'@equaltoai/greater-components-utils': resolve(__dirname, '../../utils/src/index.ts'),
			'@equaltoai/greater-components-headless/button': resolve(
				__dirname,
				'../../headless/src/primitives/button.ts'
			),
			'@equaltoai/greater-components-headless/modal': resolve(
				__dirname,
				'../../headless/src/primitives/modal.ts'
			),
			'@equaltoai/greater-components-headless': resolve(__dirname, '../../headless/src/index.ts'),
			'@equaltoai/greater-components-auth': resolve(__dirname, '../../shared/auth/src/index.ts'),
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
			thresholds: {
				global: {
					branches: 80,
					functions: 80,
					lines: 80,
					statements: 80,
				},
			},
			include: [
				'src/components/**/*.svelte',
			],
			exclude: [
				'src/**/*.d.ts',
				'src/**/*.test.{ts,js}',
				'src/**/*.spec.{ts,js}',
				'tests/**/*',
				'dist/**/*',
				'node_modules/**/*',
				'*.config.ts',
				'src/adapters/graphql/**/*',
			],
		},
		deps: {
			optimizer: {
				web: {
					include: ['@tanstack/svelte-virtual']
				}
			}
		}
	},
});
