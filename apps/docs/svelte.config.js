import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import shiki from 'shiki';

const highlighter = await shiki.getHighlighter({
	theme: 'github-dark',
	langs: ['javascript', 'typescript', 'svelte', 'html', 'css', 'bash', 'json']
});

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md', '.mdx'],
	highlight: {
		highlighter: (code, lang) => {
			const html = highlighter.codeToHtml(code, { lang });
			return `{@html \`${html}\`}`;
		}
	},
	remarkPlugins: [],
	rehypePlugins: []
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md', '.mdx'],
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		alias: {
			$lib: './src/lib',
			$components: './src/lib/components',
			$content: './src/content',
			$utils: './src/lib/utils'
		}
	}
};

export default config;