import { defineConfig } from 'vite';
import { resolve } from 'path';
import { computeExternal } from '../../../scripts/vite/external';

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			formats: ['es'],
			fileName: 'index',
		},
		rollupOptions: {
			external: computeExternal(__dirname),
		},
	},
});
