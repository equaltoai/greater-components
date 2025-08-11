import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        playwright: resolve(__dirname, 'src/playwright/index.ts'),
        vitest: resolve(__dirname, 'src/vitest/index.ts'),
        a11y: resolve(__dirname, 'src/a11y/index.ts'),
      },
      name: 'GreaterTesting',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'axe-core',
        'axe-playwright',
        '@axe-core/playwright', 
        '@playwright/test',
        '@testing-library/svelte',
        '@testing-library/user-event',
        '@vitest/ui',
        'vitest',
        'svelte',
        'focus-trap',
        'tabbable',
      ],
      output: {
        dir: 'dist',
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
      },
    },
    sourcemap: true,
    target: 'esnext',
    minify: false, // Keep readable for debugging
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
});