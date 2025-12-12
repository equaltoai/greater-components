import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
	plugins: [
		svelte({
			compilerOptions: {
				runes: true,
			},
		}),
	],
	resolve: {
		conditions: ['browser'],
		alias: {
			'@equaltoai/greater-components-community': resolve(__dirname, 'src'),
			'@equaltoai/greater-components-primitives': resolve(
				__dirname,
				'../../primitives/src/index.ts'
			),
			'@equaltoai/greater-components-icons': resolve(__dirname, '../../icons/src/index.ts'),
			'@equaltoai/greater-components-utils': resolve(__dirname, '../../utils/src/index.ts'),
			'@equaltoai/greater-components-content': resolve(__dirname, '../../content/src/index.ts'),
			'@equaltoai/greater-components-headless/button': resolve(
				__dirname,
				'../../headless/src/primitives/button.ts'
			),
			'@equaltoai/greater-components-headless/modal': resolve(
				__dirname,
				'../../headless/src/primitives/modal.ts'
			),
			'@equaltoai/greater-components-headless': resolve(__dirname, '../../headless/src/index.ts'),
			'@equaltoai/greater-components-auth': resolve(__dirname, '../../shared/auth/src/index.ts'),
			'@equaltoai/greater-components-search': resolve(
				__dirname,
				'../../shared/search/src/index.ts'
			),
			'@equaltoai/greater-components-admin': resolve(__dirname, '../../shared/admin/src/index.ts'),
			'@equaltoai/greater-components-notifications': resolve(
				__dirname,
				'../../shared/notifications/src/index.ts'
			),
		},
	},
	build: {
		minify: false,
		lib: {
			entry: {
				index: resolve(__dirname, 'src/index.ts'),
				'components/Community/index': resolve(__dirname, 'src/components/Community/index.ts'),
				'components/Post/index': resolve(__dirname, 'src/components/Post/index.ts'),
				'components/Thread/index': resolve(__dirname, 'src/components/Thread/index.ts'),
				'components/Voting/index': resolve(__dirname, 'src/components/Voting/index.ts'),
				'components/Flair/index': resolve(__dirname, 'src/components/Flair/index.ts'),
				'components/Moderation/index': resolve(__dirname, 'src/components/Moderation/index.ts'),
				'components/Wiki/index': resolve(__dirname, 'src/components/Wiki/index.ts'),
				'patterns/index': resolve(__dirname, 'src/patterns/index.ts'),
			},
			name: 'GreaterCommunity',
			formats: ['es'],
		},
		rollupOptions: {
			external: [
				'svelte',
				'@equaltoai/greater-components-tokens',
				/^@equaltoai\/greater-components-tokens\//,
				'@equaltoai/greater-components-utils',
				/^@equaltoai\/greater-components-utils\//,
				'@equaltoai/greater-components-primitives',
				/^@equaltoai\/greater-components-primitives\//,
				'@equaltoai/greater-components-icons',
				/^@equaltoai\/greater-components-icons\//,
				'@equaltoai/greater-components-content',
				/^@equaltoai\/greater-components-content\//,
				'@equaltoai/greater-components-headless',
				/@equaltoai\/greater-components-headless\/.*/,
				'@equaltoai/greater-components-auth',
				/^@equaltoai\/greater-components-auth\//,
				'@equaltoai/greater-components-search',
				/^@equaltoai\/greater-components-search\//,
				'@equaltoai/greater-components-admin',
				/^@equaltoai\/greater-components-admin\//,
				'@equaltoai/greater-components-notifications',
				/^@equaltoai\/greater-components-notifications\//,
			],
			output: {
				preserveModules: true,
				preserveModulesRoot: 'src',
				exports: 'named',
				entryFileNames: '[name].js',
			},
		},
		sourcemap: true,
		outDir: 'dist',
		emptyOutDir: true,
	},
});
