import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

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
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'GreaterPrimitives',
      fileName: 'index'
    },
    rollupOptions: {
      external: ['svelte', 'svelte/store', 'svelte/internal', '@greater/tokens'],
      output: {
        globals: {
          svelte: 'Svelte',
          '@greater/tokens': 'GreaterTokens'
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts']
  }
});