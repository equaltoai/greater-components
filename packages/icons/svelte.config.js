import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: true
	},
	preprocess: vitePreprocess(),
	kit: {
		files: {
			lib: 'src'
		},
		alias: {
			$lib: 'src'
		},
		outDir: '.svelte-kit'
	}
};

export default config;
