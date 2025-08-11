import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
	plugins: [
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Greater Components Documentation',
				short_name: 'GC Docs',
				theme_color: '#000000',
				background_color: '#ffffff',
				display: 'standalone',
				icons: [
					{
						src: '/icon-192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/icon-512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
		})
	],
	resolve: {
		alias: {
			'@greater/primitives': path.resolve('../../packages/primitives/src'),
			'@greater/tokens': path.resolve('../../packages/tokens/src'),
			'@greater/icons': path.resolve('../../packages/icons/src'),
			'@greater/utils': path.resolve('../../packages/utils/src'),
			'@greater/fediverse': path.resolve('../../packages/fediverse/src'),
			'@greater/adapters': path.resolve('../../packages/adapters/src')
		}
	},
	server: {
		fs: {
			allow: ['../../']
		}
	}
});