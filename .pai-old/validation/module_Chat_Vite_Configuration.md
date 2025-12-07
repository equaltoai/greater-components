# Module: Chat Vite Configuration

## Type: creation

## Files:
[packages/shared/chat/vite.config.ts]

## File Changes:
- packages/shared/chat/vite.config.ts: BEFORE: DOES NOT EXIST | AFTER: <<<import { defineConfig } from 'vite';
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
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'svelte',
        /^svelte\//,
        /@equaltoai\/greater-components-.*/,
      ],
    },
  },
});>>> | TYPE: content creation | DESC: Creates vite.config.ts with Svelte plugin in runes mode and library build configuration
