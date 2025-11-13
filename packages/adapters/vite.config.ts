import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'GreaterAdapters',
			formats: ['es'],
		},
		rollupOptions: {
			external: (id) => {
				return (
					id.startsWith('svelte') ||
					id.startsWith('@apollo/client') ||
					id.startsWith('graphql') ||
					id === 'graphql-ws'
				);
			},
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
