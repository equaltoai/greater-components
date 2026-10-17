import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { createHighlighter } from 'shiki';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(projectDir, '../../');

function resolve(pkgPath: string) {
	return path.resolve(workspaceRoot, pkgPath);
}

// Initialize highlighter (shiki v3+)
const highlighter = await createHighlighter({
	themes: ['github-dark'],
	langs: ['javascript', 'typescript', 'svelte', 'html', 'css', 'bash', 'json'],
});

const mdsvexOptions = {
	extensions: ['.md', '.mdx'],
	highlight: {
		highlighter: (code: string, lang: string | null | undefined) => {
			const html = highlighter.codeToHtml(code, {
				lang: lang || 'text',
				theme: 'github-dark',
			});
			return `{@html \`${html}\`}`;
		},
	},
	remarkPlugins: [],
	rehypePlugins: [],
};

const dev = process.argv.includes('dev');
const basePath = dev ? '' : '/greater-components/docs';

export default defineConfig({
	plugins: [
		sveltekit({
			extensions: ['.svelte', '.md', '.mdx'],
			preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
			adapter: adapter({
				pages: 'build',
				assets: 'build',
				fallback: '404.html',
				precompress: false,
				strict: true,
			}),
			paths: {
				base: basePath,
			},
			prerender: {
				entries: ['*'],
				handleHttpError: 'warn',
			},
			alias: {
				$lib: './src/lib',
				$components: './src/lib/components',
				$content: './src/content',
				$utils: './src/lib/utils',
				'@equaltoai/greater-components-adapters': resolve('packages/adapters/src'),
				'@equaltoai/greater-components-social': resolve('packages/faces/social/src'),
				'@equaltoai/greater-components-headless': resolve('packages/headless/src'),
				'@equaltoai/greater-components-icons': resolve('packages/icons/src'),
				'@equaltoai/greater-components-primitives': resolve('packages/primitives/src'),
				'@equaltoai/greater-components-tokens': resolve('packages/tokens/src'),
				'@equaltoai/greater-components-utils': resolve('packages/utils/src'),
				'@equaltoai/greater-components-testing': resolve('packages/testing/src'),
				'@equaltoai/greater-components': resolve('packages/greater-components/src'),
				'@equaltoai/greater-components-cli': resolve('packages/cli/src'),
				'@equaltoai/greater-components-content': resolve('packages/content/src'),
				'@equaltoai/greater-components-auth': resolve('packages/shared/auth/src'),
				'@equaltoai/greater-components-admin': resolve('packages/shared/admin/src'),
				'@equaltoai/greater-components-compose': resolve('packages/shared/compose/src'),
				'@equaltoai/greater-components-messaging': resolve('packages/shared/messaging/src'),
				'@equaltoai/greater-components-search': resolve('packages/shared/search/src'),
				'@equaltoai/greater-components-notifications': resolve('packages/shared/notifications/src'),
				'@equaltoai/greater-components-chat': resolve('packages/shared/chat/src'),
			},
		}),
		VitePWA({
			// SvelteKit 3 sets per-environment output dirs; the plugin's default
			// (vite `build.outDir`, i.e. `dist`) misses the kit client bundle that
			// adapter-static copies into `build/`.
			outDir: '.svelte-kit/output/client',
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
						type: 'image/png',
					},
					{
						src: '/icon-512.png',
						sizes: '512x512',
						type: 'image/png',
					},
				],
			},
		}),
	],
	resolve: {
		alias: {
			'@equaltoai/greater-components-primitives': path.resolve('../../packages/primitives/src'),
			'@equaltoai/greater-components-tokens': path.resolve('../../packages/tokens/src'),
			'@equaltoai/greater-components-icons': path.resolve('../../packages/icons/src'),
			'@equaltoai/greater-components-utils': path.resolve('../../packages/utils/src'),
			'@equaltoai/greater-components-social': path.resolve('../../packages/faces/social/src'),
			'@equaltoai/greater-components-adapters': path.resolve('../../packages/adapters/src'),
		},
	},
	server: {
		fs: {
			allow: ['../../'],
		},
	},
});
