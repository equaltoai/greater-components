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
			'@equaltoai/greater-components-fediverse': resolve(__dirname, 'src'),
			'@equaltoai/greater-components-social': resolve(__dirname, 'src'),
			'@equaltoai/greater-components-primitives': resolve(
				__dirname,
				'../../primitives/src/index.ts'
			),
			'@equaltoai/greater-components-icons': resolve(__dirname, '../../icons/src/index.ts'),
			'@equaltoai/greater-components-utils': resolve(__dirname, '../../utils/src/index.ts'),
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
			'@equaltoai/greater-components-adapters': resolve(__dirname, '../../adapters/src/index.ts'),
		},
	},
	build: {
		// Prevent esbuild from mangling identifiers to `$`, which conflicts with Svelte 5 runes.
		minify: false,
		lib: {
			entry: {
				index: resolve(__dirname, 'src/index.ts'),
				'patterns/index': resolve(__dirname, 'src/patterns/index.ts'),
				'components/Hashtags/index': resolve(__dirname, 'src/components/Hashtags/index.ts'),
				'components/StatusCard': resolve(__dirname, 'src/components/StatusCard.svelte'),
				'components/TimelineVirtualized': resolve(
					__dirname,
					'src/components/TimelineVirtualized.svelte'
				),
				'components/ComposeBox': resolve(__dirname, 'src/components/ComposeBox.svelte'),
				'components/ActionBar': resolve(__dirname, 'src/components/ActionBar.svelte'),
				'components/ContentRenderer': resolve(__dirname, 'src/components/ContentRenderer.svelte'),
				'components/ProfileHeader': resolve(__dirname, 'src/components/ProfileHeader.svelte'),
				'components/NotificationsFeed': resolve(
					__dirname,
					'src/components/NotificationsFeed.svelte'
				),
				'components/NotificationItem': resolve(__dirname, 'src/components/NotificationItem.svelte'),
				'components/SettingsPanel': resolve(__dirname, 'src/components/SettingsPanel.svelte'),
				'components/TimelineVirtualizedReactive': resolve(
					__dirname,
					'src/components/TimelineVirtualizedReactive.svelte'
				),
				'components/NotificationsFeedReactive': resolve(
					__dirname,
					'src/components/NotificationsFeedReactive.svelte'
				),
				'components/RealtimeWrapper': resolve(__dirname, 'src/components/RealtimeWrapper.svelte'),
			},
			name: 'GreaterFediverse',
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
				'@equaltoai/greater-components-headless',
				/@equaltoai\/greater-components-headless\/.*/, // Match all headless subpaths
				'@tanstack/svelte-virtual',
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
