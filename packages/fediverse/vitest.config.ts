import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
	viteConfig,
	defineConfig({
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
				include: ['src/adapters/**/*.{ts,js}', 'src/lib/timelineStore.ts'],
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
		},
	})
);
