import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
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
				'scripts/**/*',
				'dist/**/*',
				'node_modules/**/*',
			],
		},
	},
});
