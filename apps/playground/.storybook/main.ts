import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.stories.@(js|ts|svelte)',
    '../../packages/*/src/**/*.stories.@(js|ts|svelte)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-actions',
    '@storybook/addon-viewport',
    '@storybook/addon-a11y',
    '@chromatic-com/storybook'
  ],
  framework: {
    name: '@storybook/sveltekit',
    options: {
      builder: '@storybook/builder-vite'
    }
  },
  features: {
    storyStoreV7: true
  },
  core: {
    disableTelemetry: true
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true)
    }
  }
};

export default config;