import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			globals: true,
			environment: 'jsdom',
			setupFiles: ['./tests/setup.ts'],
			exclude: ['tests/**/*.a11y.test.ts', 'tests/**/*.visual.test.ts', 'tests/demo/**/*'],
			coverage: {
				provider: 'v8',
				reporter: ['text', 'json', 'html', 'lcov'],
				reportsDirectory: './coverage',
				include: ['src/**/*.{ts,js}'],
				exclude: ['tests/**/*', 'dist/**/*'],
			},
		},
	})
);
