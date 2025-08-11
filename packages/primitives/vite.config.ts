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
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      thresholds: {
        global: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      },
      include: ['src/**/*.{ts,js,svelte}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{ts,js}',
        'src/**/*.spec.{ts,js}',
        'tests/**/*',
        'dist/**/*',
        'node_modules/**/*'
      ]
    }
  }
});