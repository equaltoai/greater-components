import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { createHighlighter } from 'shiki';

// Initialize highlighter (shiki v3+)
const highlighter = await createHighlighter({
	themes: ['github-dark'],
	langs: ['javascript', 'typescript', 'svelte', 'html', 'css', 'bash', 'json'],
});

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md', '.mdx'],
	highlight: {
		highlighter: (code, lang) => {
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

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md', '.mdx'],
	// @ts-expect-error - mdsvex preprocessor type mismatch
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true,
		}),
		alias: {
			$lib: './src/lib',
			$components: './src/lib/components',
			$content: './src/content',
			$utils: './src/lib/utils',
		},
	},
};

export default config;
