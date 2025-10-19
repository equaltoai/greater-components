import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 5173,
    host: true
  },
  // Avoid bundling heavy jsdom stack; rollup fails parsing cssstyle when included in SSR bundle.
  ssr: {
    external: ['jsdom', 'cssstyle', 'symbol-tree']
  }
});
