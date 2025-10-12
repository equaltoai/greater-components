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
			entry: {
				index: path.resolve(__dirname, 'src/index.ts'),
				'primitives/button': path.resolve(__dirname, 'src/primitives/button.ts'),
				'primitives/modal': path.resolve(__dirname, 'src/primitives/modal.ts'),
				'primitives/menu': path.resolve(__dirname, 'src/primitives/menu.ts'),
				'primitives/tooltip': path.resolve(__dirname, 'src/primitives/tooltip.ts'),
				'primitives/tabs': path.resolve(__dirname, 'src/primitives/tabs.ts'),
			},
			name: 'GreaterHeadless',
			formats: ['es']
		},
    rollupOptions: {
      external: ['svelte', 'svelte/store', 'svelte/internal', 'focus-trap', 'tabbable'],
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

