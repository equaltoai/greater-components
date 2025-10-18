import type { Meta, StoryObj } from '@storybook/svelte';
import { action } from '@storybook/addon-actions';
import ThemeSwitcherDemo from './ThemeSwitcherDemo.svelte';

const meta = {
  title: 'Primitives/ThemeSwitcher',
  component: ThemeSwitcherDemo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A comprehensive theme switching component with support for color schemes, density, font size, motion preferences, and custom colors.',
      },
    },
  },
  argTypes: {
    showPreview: {
      control: 'boolean',
      description: 'Show preview section with sample elements',
      defaultValue: true,
    },
    showAdvanced: {
      control: 'boolean',
      description: 'Show advanced options like custom colors and font scale',
      defaultValue: false,
    },
  },
} satisfies Meta<ThemeSwitcherDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

const themeChangeAction = action('theme-switcher/change');

export const Default: Story = {
  args: {
    showPreview: true,
    showAdvanced: false,
  },
};

export const WithAdvancedOptions: Story = {
  args: {
    showPreview: true,
    showAdvanced: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Theme switcher with advanced options including custom colors, font scale, and import/export functionality.',
      },
    },
  },
};

export const CompactMode: Story = {
  args: {
    showPreview: false,
    showAdvanced: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal theme switcher without preview or advanced options.',
      },
    },
  },
};

export const DarkMode: Story = {
  args: {
    showPreview: true,
    showAdvanced: false,
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Theme switcher in dark mode environment.',
      },
    },
  },
  decorators: [
    (Story) => ({
      Component: Story,
      props: {
        style: 'padding: 20px; background: #111827; border-radius: 8px;',
      },
    }),
  ],
};

export const HighContrast: Story = {
  args: {
    showPreview: true,
    showAdvanced: true,
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
    docs: {
      description: {
        story: 'Theme switcher optimized for high contrast mode with enhanced focus indicators and borders.',
      },
    },
  },
};

export const Mobile: Story = {
  args: {
    showPreview: true,
    showAdvanced: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Theme switcher responsive layout for mobile devices.',
      },
    },
  },
};

export const CustomStyling: Story = {
  args: {
    showPreview: true,
    showAdvanced: true,
    class: 'custom-theme-switcher',
  },
  parameters: {
    docs: {
      description: {
        story: 'Theme switcher with custom CSS class for styling overrides.',
      },
    },
  },
  decorators: [
    (Story) => ({
      Component: Story,
      style: `
        <style>
          .custom-theme-switcher {
            --gr-semantic-action-primary-default: #8b5cf6;
            --gr-semantic-action-primary-hover: #7c3aed;
            --gr-semantic-action-primary-active: #6d28d9;
            max-width: 600px;
            margin: 0 auto;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            border-radius: 12px;
            background: white;
          }
        </style>
      `,
    }),
  ],
};

export const WithCallback: Story = {
  args: {
    showPreview: true,
    showAdvanced: false,
    onThemeChange: (theme: string) => themeChangeAction(theme),
  },
  parameters: {
    docs: {
      description: {
        story: 'Theme switcher with callback function that fires when theme changes.',
      },
    },
  },
};
