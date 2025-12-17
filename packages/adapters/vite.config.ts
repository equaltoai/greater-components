import { defineConfig } from 'vite';
import { resolve } from 'path';
import { computeExternal } from '../../scripts/vite/external';

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'GreaterAdapters',
			formats: ['es'],
		},
		rollupOptions: {
			external: computeExternal(__dirname),
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
