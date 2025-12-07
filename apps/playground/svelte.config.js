import adapter from '@sveltejs/adapter-static';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(projectDir, '..', '..');
const dev = process.argv.includes('dev');

const basePath = dev ? '' : '/greater-components';

/** @param {string} pkgPath */
const resolvePackageDist = (pkgPath) => path.resolve(workspaceRoot, pkgPath);

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
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
			handleHttpError: ({ path, message }) => {
				// Skip 404 errors for external links like /docs
				if (path === '/greater-components/docs' || path === '/docs') {
					return;
				}
				throw new Error(message);
			},
		},
		alias: {
			$lib: './src/lib',
			'@equaltoai/greater-components-tokens/theme.css': resolvePackageDist('packages/tokens/dist/theme.css'),
			'@equaltoai/greater-components-primitives/theme.css': resolvePackageDist('packages/primitives/dist/theme.css'),
			// Use directory-based aliases to support both main imports and subpath imports
			...['adapters', 'headless', 'icons', 'primitives', 'tokens', 'utils', 'testing'].reduce((acc, pkg) => {
				acc[`@equaltoai/greater-components-${pkg}`] = resolvePackageDist(`packages/${pkg}/src`);
				return acc;
			}, {}),
			...['auth', 'admin', 'compose', 'messaging', 'search', 'notifications', 'chat'].reduce((acc, pkg) => {
				acc[`@equaltoai/greater-components-${pkg}`] = resolvePackageDist(`packages/shared/${pkg}/src`);
				return acc;
			}, {}),
			'@equaltoai/greater-components-social': resolvePackageDist('packages/faces/social/src'),
			'@equaltoai/greater-components': resolvePackageDist('packages/greater-components/src'),
			'@equaltoai/greater-components-cli': resolvePackageDist('packages/cli/src'),
			'@equaltoai/greater-components-content': resolvePackageDist('packages/content/src'),
		},
	},
	compilerOptions: {
		runes: true,
	},
	vitePlugin: {
		inspector: {
			showToggleButton: 'never',
		},
	},
};

export default config;
