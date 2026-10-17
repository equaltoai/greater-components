import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(projectDir, '..', '..');

const dev = process.argv.includes('dev');

const basePath = dev ? '' : '/greater-components';

const resolvePackageDist = (pkgPath: string) => path.resolve(workspaceRoot, pkgPath);

const forceEsbuildCssMinify = () => ({
	name: 'playground-force-esbuild-css-minify',
	config() {
		return {
			build: {
				cssMinify: 'esbuild' as const,
			},
		};
	},
});

export default defineConfig({
	envPrefix: ['VITE_', 'PLAYGROUND_'],
	plugins: [
		sveltekit({
			adapter: adapter({
				pages: 'build',
				assets: 'build',
				fallback: undefined,
			}),
			paths: {
				base: basePath,
			},
			prerender: {
				entries: ['*'],
				handleHttpError: ({ status, path, message }) => {
					// Skip 404 errors for external links like /docs
					if (path === '/greater-components/docs' || path === '/docs') {
						return;
					}
					// Demo mention and hashtag links. ContentRenderer linkifies mentions
					// and tags in the demo status bodies to its defaults (`/users/`,
					// `/tags/`), and the playground has no profile or tag routes for
					// the crawler to reach. These bodies only became crawlable once status
					// content started server-rendering (equaltoai/greater-components#926).
					// Scoped to the missing-route case only: any other prerender failure
					// under these paths is a real break and must still fail the build.
					if (status === 404 && /^(\/greater-components)?\/(users|tags)\//.test(path)) {
						return;
					}
					throw new Error(message);
				},
			},
			alias: {
				$lib: './src/lib',
				'@equaltoai/greater-components/faces/agent/style.css': resolvePackageDist(
					'packages/faces/agent/src/theme.css'
				),
				'@equaltoai/greater-components/faces/agent': resolvePackageDist('packages/faces/agent/src'),
				'@equaltoai/greater-components/primitives/style.css': resolvePackageDist(
					'packages/primitives/dist/style.css'
				),
				'@equaltoai/greater-components/primitives': resolvePackageDist('packages/primitives/src'),
				'@equaltoai/greater-components-tokens/theme.css': resolvePackageDist(
					'packages/tokens/dist/theme.css'
				),
				'@equaltoai/greater-components/tokens/theme.css': resolvePackageDist(
					'packages/tokens/dist/theme.css'
				),
				'@equaltoai/greater-components-primitives/theme.css': resolvePackageDist(
					'packages/primitives/dist/theme.css'
				),
				'@equaltoai/greater-components-shell/shell.css': resolvePackageDist(
					'packages/shell/dist/shell.css'
				),
				'@equaltoai/greater-components-shell/style.css': resolvePackageDist(
					'packages/shell/dist/shell.css'
				),
				'@equaltoai/greater-components-host-platform/host-platform.css': resolvePackageDist(
					'packages/host-platform/dist/host-platform.css'
				),
				'@equaltoai/greater-components-host-platform/style.css': resolvePackageDist(
					'packages/host-platform/dist/host-platform.css'
				),
				// Use directory-based aliases to support both main imports and subpath imports
				...[
					'adapters',
					'headless',
					'icons',
					'primitives',
					'tokens',
					'utils',
					'testing',
					'shell',
					'host-platform',
				].reduce(
					(acc, pkg) => {
						acc[`@equaltoai/greater-components-${pkg}`] = resolvePackageDist(`packages/${pkg}/src`);
						return acc;
					},
					{} as Record<string, string>
				),
				...['auth', 'admin', 'compose', 'messaging', 'search', 'notifications', 'chat'].reduce(
					(acc, pkg) => {
						acc[`@equaltoai/greater-components-${pkg}`] = resolvePackageDist(
							`packages/shared/${pkg}/src`
						);
						return acc;
					},
					{} as Record<string, string>
				),
				...['social', 'artist', 'community', 'blog'].reduce(
					(acc, pkg) => {
						acc[`@equaltoai/greater-components-${pkg}`] = resolvePackageDist(
							`packages/faces/${pkg}/src`
						);
						return acc;
					},
					{} as Record<string, string>
				),
				'@equaltoai/greater-components': resolvePackageDist('packages/greater-components/src'),
				'@equaltoai/greater-components-cli': resolvePackageDist('packages/cli/src'),
				'@equaltoai/greater-components-content': resolvePackageDist('packages/content/src'),
			},
			compilerOptions: {
				runes: true,
			},
			inspector: {
				showToggleButton: 'never',
			},
		}),
		forceEsbuildCssMinify(),
	],
	server: {
		port: 5173,
		host: true,
	},
	// Avoid bundling heavy jsdom stack; rollup fails parsing cssstyle when included in SSR bundle.
	ssr: {
		external: ['jsdom', 'cssstyle', 'symbol-tree'],
	},
	resolve: {
		dedupe: ['svelte'],
		alias: [
			{
				find: /^@equaltoai\/greater-components\/faces\/agent\/style\.css$/,
				replacement: path.resolve(workspaceRoot, 'packages/faces/agent/src/theme.css'),
			},
			{
				find: /^@equaltoai\/greater-components\/faces\/agent$/,
				replacement: path.resolve(workspaceRoot, 'packages/faces/agent/src/index.ts'),
			},
			{
				find: /^@equaltoai\/greater-components\/primitives\/style\.css$/,
				replacement: path.resolve(workspaceRoot, 'packages/primitives/dist/style.css'),
			},
			{
				find: /^@equaltoai\/greater-components\/primitives$/,
				replacement: path.resolve(workspaceRoot, 'packages/primitives/src/index.ts'),
			},
			{
				find: /^@equaltoai\/greater-components\/tokens\/theme\.css$/,
				replacement: path.resolve(workspaceRoot, 'packages/tokens/dist/theme.css'),
			},
			{
				find: '$lib',
				replacement: path.resolve(projectDir, 'src/lib'),
			},
		],
	},
	optimizeDeps: {
		exclude: ['@equaltoai/greater-components-icons'],
	},
	test: {
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.{js,ts}'],
		globals: true,
	},
});
