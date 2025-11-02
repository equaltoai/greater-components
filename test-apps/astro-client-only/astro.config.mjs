import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  
  integrations: [
    svelte({
      compilerOptions: {
        runes: true  // Required for Svelte 5 runes
      }
    })
  ],
  
  vite: {
    optimizeDeps: {
      exclude: [
        '@equaltoai/greater-components-primitives',
        '@equaltoai/greater-components-headless'
      ]
    },
    ssr: {
      noExternal: [
        '@equaltoai/greater-components-primitives',
        '@equaltoai/greater-components-headless'
      ]
    }
  }
});

