import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        runes: true
      }
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'GreaterFediverse',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['svelte', '@greater/tokens', '@greater/utils', '@greater/primitives', '@greater/icons', '@tanstack/svelte-virtual'],
      output: {
        preserveModules: false
      }
    },
    sourcemap: true,
    outDir: 'dist',
    emptyOutDir: true
  },
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '*.config.ts'
      ]
    }
  }
});