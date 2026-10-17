import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	compilerOptions: {
		runes: true,
	},
	extensions: ['.svelte'],
	preprocess: vitePreprocess(),
};

export default config;
