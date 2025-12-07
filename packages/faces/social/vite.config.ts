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
		},
	},
	build: {
		// Prevent esbuild from mangling identifiers to `$`, which conflicts with Svelte 5 runes.
		minify: false,
		lib: {
			entry: {
				index: resolve(__dirname, 'src/index.ts'),
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
