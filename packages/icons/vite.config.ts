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
      name: 'GreaterIcons',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['svelte', 'svelte/store', 'svelte/internal'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        exports: 'named',
        entryFileNames: '[name].js'
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
});