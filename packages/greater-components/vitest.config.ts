import path from 'node:path';
import { defineConfig } from 'vitest/config';

const stubSveltePlugin = {
	name: 'stub-svelte',
	resolveId(id: string) {
		if (id.endsWith('.svelte')) {
			return id;
		}
		return null;
	},
	load(id: string) {
		if (id.endsWith('.svelte')) {
			return 'export default {};';
		}
		return null;
	},
};

export default defineConfig({
	plugins: [stubSveltePlugin],
	test: {
		environment: 'jsdom',
		globals: true,
		include: ['tests/**/*.test.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			reportsDirectory: './coverage',
			include: [
				'dist/index.js',
				'dist/adapters/index.js',
				'dist/adapters/**/*.js',
				'dist/fediverse/index.js',
				'dist/fediverse/**/*.js',
				'dist/headless/index.js',
				'dist/headless/**/*.js',
				'dist/icons/index.js',
				'dist/icons/**/*.js',
				'dist/primitives/index.js',
				'dist/primitives/**/*.js',
				'dist/tokens/index.js',
				'dist/tokens/**/*.js',
				'dist/utils/index.js',
				'dist/utils/**/*.js',
				'dist/testing/index.js',
				'dist/testing/**/*.js',
				'dist/cli/index.js',
				'dist/cli/**/*.js',
			],
		},
	},
	resolve: {
		extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.node', '.svelte'],
		alias: {
			'@tanstack/svelte-virtual': path.resolve(__dirname, './tests/stubs/virtual.ts'),
			'isomorphic-dompurify': path.resolve(__dirname, './tests/stubs/dompurify.ts'),
			'focus-trap': path.resolve(__dirname, './tests/stubs/focus-trap.ts'),
			tabbable: path.resolve(__dirname, './tests/stubs/tabbable.ts'),
			'@playwright/test': path.resolve(__dirname, './tests/stubs/playwright.ts'),
			'axe-playwright': path.resolve(__dirname, './tests/stubs/axe-playwright.ts'),
			'@testing-library/svelte': path.resolve(__dirname, './tests/stubs/testing-library-svelte.ts'),
			commander: path.resolve(__dirname, './tests/stubs/commander.ts'),
			chalk: path.resolve(__dirname, './tests/stubs/chalk.ts'),
			'./tokens/index.js': path.resolve(__dirname, '../tokens/src/index.ts'),
		},
	},
});
