import type { Meta, StoryObj } from '@storybook/svelte';
import SettingsPanelDemo from './SettingsPanelDemo.svelte';

const meta = {
  title: 'Fediverse/SettingsPanel',
  component: SettingsPanelDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive settings panel for fediverse applications with sections for appearance, accessibility, behavior, and more.',
      },
    },
  },
  argTypes: {
    activeSection: {
      control: 'select',
      options: [
        'appearance',
        'accessibility',
        'behavior',
        'language',
        'privacy',
        'notifications',
        'account',
        'help',
      ],
      description: 'The initially active settings section',
      defaultValue: 'appearance',
    },
    showHeader: {
      control: 'boolean',
      description: 'Show the settings panel header',
      defaultValue: true,
    },
  },
} satisfies Meta<SettingsPanelDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    activeSection: 'appearance',
    showHeader: true,
  },
};

export const AccessibilitySection: Story = {
  args: {
    activeSection: 'accessibility',
    showHeader: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Settings panel opened to the accessibility section with options for navigation, screen readers, and media preferences.',
      },
    },
  },
};

export const BehaviorSection: Story = {
  args: {
    activeSection: 'behavior',
    showHeader: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Settings panel showing behavior preferences including confirmations, timeline settings, and posting defaults.',
      },
    },
  },
};

export const NotificationsSection: Story = {
  args: {
    activeSection: 'notifications',
    showHeader: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Settings panel with notification preferences for different types of activities and sound settings.',
      },
    },
  },
};

export const WithoutHeader: Story = {
  args: {
    activeSection: 'appearance',
    showHeader: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Settings panel without the header, useful when embedded in another component.',
      },
    },
  },
};

export const DarkMode: Story = {
  args: {
    activeSection: 'appearance',
    showHeader: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Settings panel in dark mode environment.',
      },
    },
  },
  decorators: [
    (Story) => ({
      Component: Story,
      props: {
        style: '[data-theme="dark"]',
      },
    }),
  ],
};

export const Mobile: Story = {
  args: {
    activeSection: 'appearance',
    showHeader: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Settings panel with responsive mobile layout featuring collapsible navigation.',
      },
    },
  },
};

export const Tablet: Story = {
  args: {
    activeSection: 'appearance',
    showHeader: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'ipad',
    },
    docs: {
      description: {
        story: 'Settings panel optimized for tablet viewing.',
      },
    },
  },
};

export const HighContrast: Story = {
  args: {
    activeSection: 'accessibility',
    showHeader: true,
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
        story: 'Settings panel with high contrast mode enhancements for better visibility.',
      },
    },
  },
};

export const WithCustomContent: Story = {
  args: {
    activeSection: 'appearance',
    showHeader: true,
    showCustomContent: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Settings panel with custom content slot for application-specific settings.',
      },
    },
  },
};

export const WithCallback: Story = {
  args: {
    activeSection: 'appearance',
    showHeader: true,
    onSectionChange: (section: string) => {
      console.log('Section changed to:', section);
      // In a real app, this could update URL, analytics, etc.
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Settings panel with callback function that fires when section changes.',
      },
    },
  },
};