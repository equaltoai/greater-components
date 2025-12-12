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
			'@equaltoai/greater-components-blog': resolve(__dirname, 'src'),
			'@equaltoai/greater-components-primitives': resolve(
				__dirname,
				'../../primitives/src/index.ts'
			),
			'@equaltoai/greater-components-icons': resolve(__dirname, '../../icons/src/index.ts'),
			'@equaltoai/greater-components-utils': resolve(__dirname, '../../utils/src/index.ts'),
			'@equaltoai/greater-components-content': resolve(__dirname, '../../content/src/index.ts'),
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
			'@equaltoai/greater-components-search': resolve(
				__dirname,
				'../../shared/search/src/index.ts'
			),
		},
	},
	build: {
		minify: false,
		lib: {
			entry: {
				index: resolve(__dirname, 'src/index.ts'),
				'components/Article/index': resolve(__dirname, 'src/components/Article/index.ts'),
				'components/Author/index': resolve(__dirname, 'src/components/Author/index.ts'),
				'components/Publication/index': resolve(__dirname, 'src/components/Publication/index.ts'),
				'components/Navigation/index': resolve(__dirname, 'src/components/Navigation/index.ts'),
				'components/Editor/index': resolve(__dirname, 'src/components/Editor/index.ts'),
				'patterns/index': resolve(__dirname, 'src/patterns/index.ts'),
			},
			name: 'GreaterBlog',
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
				'@equaltoai/greater-components-content',
				/^@equaltoai\/greater-components-content\//,
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
