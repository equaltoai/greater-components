import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
	plugins: [
		svelte({
			compilerOptions: {
				runes: true,
			},
		}),
	],
	test: {
		include: ['tests/**/*.test.ts'],
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./tests/setup.ts'],
		server: {
			deps: {
				inline: [/svelte/],
			},
		},
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			include: ['src/**/*.{ts,svelte}'],
			exclude: ['src/**/*.d.ts', 'src/**/index.ts'],
		},
	},
	resolve: {
		conditions: ['browser'],
		alias: {
			'@equaltoai/greater-components-community': path.resolve(__dirname, 'src'),
			'@equaltoai/greater-components-primitives': path.resolve(
				__dirname,
				'../../primitives/src/index.ts'
			),
			'@equaltoai/greater-components-icons': path.resolve(__dirname, '../../icons/src/index.ts'),
			'@equaltoai/greater-components-utils': path.resolve(__dirname, '../../utils/src/index.ts'),
			'@equaltoai/greater-components-headless': path.resolve(
				__dirname,
				'../../headless/src/index.ts'
			),
			'@equaltoai/greater-components-auth': path.resolve(
				__dirname,
				'../../shared/auth/src/index.ts'
			),
			'@equaltoai/greater-components-notifications': path.resolve(
				__dirname,
				'../../shared/notifications/src/index.ts'
			),
			'@equaltoai/greater-components-admin': path.resolve(
				__dirname,
				'../../shared/admin/src/index.ts'
			),
			'@equaltoai/greater-components-content': path.resolve(
				__dirname,
				'../../content/src/index.ts'
			),
			'@equaltoai/greater-components-search': path.resolve(
				__dirname,
				'../../shared/search/src/index.ts'
			),
			'@equaltoai/greater-components-tokens': path.resolve(__dirname, '../../tokens/src/index.ts'),
		},
	},
});
