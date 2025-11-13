import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			environment: 'jsdom',
			globals: true,
			coverage: {
				provider: 'v8',
				reporter: ['text', 'json', 'html', 'lcov'],
				reportsDirectory: './coverage',
				thresholds: {
					global: {
						branches: 90,
						functions: 90,
						lines: 90,
						statements: 90,
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
