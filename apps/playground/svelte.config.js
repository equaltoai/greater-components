import adapter from '@sveltejs/adapter-auto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(projectDir, '..', '..');

/** @param {string} pkgPath */
const resolvePackageDist = (pkgPath) => path.resolve(workspaceRoot, pkgPath);

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    alias: {
      $lib: './src/lib',
      '@equaltoai/greater-components-primitives': resolvePackageDist('packages/primitives/dist'),
      '@equaltoai/greater-components-icons': resolvePackageDist('packages/icons/dist'),
      '@equaltoai/greater-components-tokens': resolvePackageDist('packages/tokens/dist'),
      '@equaltoai/greater-components-utils': resolvePackageDist('packages/utils/dist')
    }
  },
  compilerOptions: {
    runes: true
  },
  vitePlugin: {
    inspector: {
      showToggleButton: 'never'
    }
  }
};

export default config;
