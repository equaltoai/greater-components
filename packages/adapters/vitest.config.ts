import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			environment: 'jsdom',
			globals: true,
			fileParallelism: false,
			coverage: {
				provider: 'v8',
				reporter: ['text', 'json', 'html'],
				exclude: ['node_modules/', 'dist/', '*.config.ts'],
			},
		},
	})
);
