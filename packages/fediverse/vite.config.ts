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
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'components/StatusCard': resolve(__dirname, 'src/components/StatusCard.svelte'),
        'components/TimelineVirtualized': resolve(__dirname, 'src/components/TimelineVirtualized.svelte'),
        'components/ComposeBox': resolve(__dirname, 'src/components/ComposeBox.svelte'),
        'components/ActionBar': resolve(__dirname, 'src/components/ActionBar.svelte'),
        'components/ContentRenderer': resolve(__dirname, 'src/components/ContentRenderer.svelte'),
        'components/ProfileHeader': resolve(__dirname, 'src/components/ProfileHeader.svelte'),
        'components/NotificationsFeed': resolve(__dirname, 'src/components/NotificationsFeed.svelte'),
        'components/NotificationItem': resolve(__dirname, 'src/components/NotificationItem.svelte'),
        'components/SettingsPanel': resolve(__dirname, 'src/components/SettingsPanel.svelte'),
        'components/TimelineVirtualizedReactive': resolve(__dirname, 'src/components/TimelineVirtualizedReactive.svelte'),
        'components/NotificationsFeedReactive': resolve(__dirname, 'src/components/NotificationsFeedReactive.svelte'),
        'components/RealtimeWrapper': resolve(__dirname, 'src/components/RealtimeWrapper.svelte'),
      },
      name: 'GreaterFediverse',
      formats: ['es']
    },
    rollupOptions: {
      external: [
        'svelte',
        '@greater/tokens',
        '@greater/utils',
        '@greater/primitives',
        '@greater/icons',
        '@greater/headless',
        /@greater\/headless\/.*/,  // Match all @greater/headless subpaths
        '@tanstack/svelte-virtual'
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        exports: 'named',
        entryFileNames: '[name].js'
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
      include: ['src/**/*.{ts,js,svelte}'],
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