import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        runes: true
      },
      emitCss: true  // Let Vite emit CSS
    })
  ],
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        'components/Button': path.resolve(__dirname, 'src/components/Button.svelte'),
        'components/Modal': path.resolve(__dirname, 'src/components/Modal.svelte'),
        'components/TextField': path.resolve(__dirname, 'src/components/TextField.svelte'),
        'components/TextArea': path.resolve(__dirname, 'src/components/TextArea.svelte'),
        'components/Select': path.resolve(__dirname, 'src/components/Select.svelte'),
        'components/Checkbox': path.resolve(__dirname, 'src/components/Checkbox.svelte'),
        'components/Switch': path.resolve(__dirname, 'src/components/Switch.svelte'),
        'components/FileUpload': path.resolve(__dirname, 'src/components/FileUpload.svelte'),
        'components/Menu': path.resolve(__dirname, 'src/components/Menu.svelte'),
        'components/Tooltip': path.resolve(__dirname, 'src/components/Tooltip.svelte'),
        'components/Tabs': path.resolve(__dirname, 'src/components/Tabs.svelte'),
        'components/Avatar': path.resolve(__dirname, 'src/components/Avatar.svelte'),
        'components/Skeleton': path.resolve(__dirname, 'src/components/Skeleton.svelte'),
        'components/ThemeSwitcher': path.resolve(__dirname, 'src/components/ThemeSwitcher.svelte'),
        'components/ThemeProvider': path.resolve(__dirname, 'src/components/ThemeProvider.svelte'),
      },
      name: 'GreaterPrimitives',
      formats: ['es']
    },
    rollupOptions: {
      external: [
        'svelte',
        'svelte/store',
        'svelte/internal',
        /^svelte\//,  // Externalize all svelte/* imports
        '@equaltoai/greater-components-tokens',
        '@equaltoai/greater-components-headless',
        '@equaltoai/greater-components-headless/textfield',
        'clsx'  // Also externalize clsx utility
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        exports: 'named',
        entryFileNames: '[name].js',
        globals: {
          svelte: 'Svelte',
          '@equaltoai/greater-components-tokens': 'GreaterTokens'
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
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