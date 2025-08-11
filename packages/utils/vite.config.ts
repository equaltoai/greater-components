import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'GreaterUtils',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['svelte', 'dompurify', 'isomorphic-dompurify'],
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
      include: ['src/**/*.{ts,js}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{ts,js}',
        'src/**/*.spec.{ts,js}',
        'tests/**/*',
        'dist/**/*',
        'node_modules/**/*',
        '*.config.ts'
      ]
    }
  }
});