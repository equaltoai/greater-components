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
			'@equaltoai/greater-components-artist': resolve(__dirname, 'src'),
			'@equaltoai/greater-components-primitives': resolve(
				__dirname,
				'../../primitives/src/index.ts'
			),
			'@equaltoai/greater-components-icons': resolve(__dirname, '../../icons/src/index.ts'),
			'@equaltoai/greater-components-utils': resolve(__dirname, '../../utils/src/index.ts'),
			'@equaltoai/greater-components-adapters': resolve(__dirname, '../../adapters/src/index.ts'),
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
				'components/Artwork/index': resolve(__dirname, 'src/components/Artwork/index.ts'),
				'components/ArtworkCard/index': resolve(__dirname, 'src/components/ArtworkCard/index.ts'),
				'components/ArtistProfile/index': resolve(
					__dirname,
					'src/components/ArtistProfile/index.ts'
				),
				'components/ArtistTimeline/index': resolve(__dirname, 'src/components/ArtistTimeline/index.ts'),
				'components/Gallery/index': resolve(__dirname, 'src/components/Gallery/index.ts'),
				'components/Discovery/index': resolve(__dirname, 'src/components/Discovery/index.ts'),
				'components/Exhibition/index': resolve(__dirname, 'src/components/Exhibition/index.ts'),
				'components/CreativeTools/index': resolve(
					__dirname,
					'src/components/CreativeTools/index.ts'
				),
				'components/Community/index': resolve(__dirname, 'src/components/Community/index.ts'),
				'components/Transparency/index': resolve(__dirname, 'src/components/Transparency/index.ts'),
				'components/Monetization/index': resolve(__dirname, 'src/components/Monetization/index.ts'),
				'patterns/index': resolve(__dirname, 'src/patterns/index.ts'),
				'stores/index': resolve(__dirname, 'src/stores/index.ts'),
				'types/index': resolve(__dirname, 'src/types/index.ts'),
			},
			name: 'GreaterArtist',
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
				'@equaltoai/greater-components-adapters',
				/^@equaltoai\/greater-components-adapters\//,
				'@equaltoai/greater-components-headless',
				/@equaltoai\/greater-components-headless\/.*/,
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
