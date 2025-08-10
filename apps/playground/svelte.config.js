import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    alias: {
      $lib: './src/lib'
    }
  },
  compilerOptions: {
    runes: true
  },
  // Disable runes for storybook compatibility  
  vitePlugin: {
    inspector: {
      showToggleButton: 'never'
    }
  }
};

export default config;