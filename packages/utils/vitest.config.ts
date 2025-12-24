import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
	viteConfig,
	defineConfig({
		resolve: {
			conditions: ['browser'],
		},
		test: {
			environment: 'jsdom',
			globals: true,
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
				include: ['src/**/*.{ts,js}'],
				exclude: [
					'src/**/*.d.ts',
					'src/**/*.test.{ts,js}',
					'src/**/*.spec.{ts,js}',
					'tests/**/*',
					'dist/**/*',
					'node_modules/**/*',
					'*.config.ts',
				],
			},
		},
	})
);
