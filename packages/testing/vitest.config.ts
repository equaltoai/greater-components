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
		},
	})
);
