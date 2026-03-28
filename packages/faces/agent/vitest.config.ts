import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'node:path';

export default defineConfig({
	plugins: [
		svelte({
			compilerOptions: {
				runes: true,
			},
			emitCss: false,
		}),
	],
	resolve: {
		conditions: ['browser'],
		alias: {
			'@equaltoai/greater-components-agent': resolve(__dirname, '../../shared/agent/src/index.ts'),
			'@equaltoai/greater-components-adapters': resolve(
				__dirname,
				'../../adapters/src/index.ts'
			),
			'@equaltoai/greater-components-chat': resolve(__dirname, '../../shared/chat/src/index.ts'),
			'@equaltoai/greater-components-content': resolve(__dirname, '../../content/src/index.ts'),
			'@equaltoai/greater-components-icons': resolve(__dirname, '../../icons/src/index.ts'),
			'@equaltoai/greater-components-messaging': resolve(
				__dirname,
				'../../shared/messaging/src/index.ts'
			),
			'@equaltoai/greater-components-notifications': resolve(
				__dirname,
				'../../shared/notifications/src/index.ts'
			),
			'@equaltoai/greater-components-primitives': resolve(
				__dirname,
				'../../primitives/src/index.ts'
			),
			'@equaltoai/greater-components-soul': resolve(__dirname, '../../shared/soul/src/index.ts'),
			'@equaltoai/greater-components-tokens': resolve(__dirname, '../../tokens/src/index.ts'),
			'@equaltoai/greater-components-utils': resolve(__dirname, '../../utils/src/index.ts'),
		},
	},
	test: {
		environment: 'jsdom',
		globals: true,
		include: ['tests/**/*.test.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			include: ['src/**/*.{ts,svelte}'],
			exclude: ['src/**/*.d.ts'],
		},
	},
});
