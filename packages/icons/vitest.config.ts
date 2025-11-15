import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [
		svelte({
			hot: !process.env['VITEST'],
			compilerOptions: {
				dev: true,
			},
		}),
	],
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
	resolve: {
		alias: {
			'@': '/src',
		},
		conditions: ['browser', 'development'],
	},
});
