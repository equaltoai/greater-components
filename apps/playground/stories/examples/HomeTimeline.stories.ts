import type { Meta, StoryObj } from '@storybook/svelte';
import HomeTimelineExample from './HomeTimelineExample.svelte';

const meta = {
  title: 'Examples/Home Timeline',
  component: HomeTimelineExample,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete home timeline with compose box, virtualized timeline, and real-time updates. Toggle between mock data and real Mastodon API.'
      }
    }
  },
  argTypes: {
    useMockData: {
      control: 'boolean',
      description: 'Toggle between mock data and real Mastodon API'
    },
    instanceUrl: {
      control: 'text',
      description: 'Mastodon instance URL (when not using mock data)'
    },
    enableStreaming: {
      control: 'boolean', 
      description: 'Enable real-time streaming updates'
    },
    virtualizeTimeline: {
      control: 'boolean',
      description: 'Use virtualized scrolling for performance'
    },
    showProfileSwitcher: {
      control: 'boolean',
      description: 'Show profile switcher component'
    },
    debugMode: {
      control: 'boolean',
      description: 'Show debug panel with events and transport info'
    }
  }
} satisfies Meta<HomeTimelineExample>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with mock data
export const MockData: Story = {
  args: {
    useMockData: true,
    instanceUrl: 'https://mastodon.social',
    enableStreaming: true,
    virtualizeTimeline: true,
    showProfileSwitcher: true,
    debugMode: false
  }
};

// Story with real API connection
export const RealAPI: Story = {
  args: {
    useMockData: false,
    instanceUrl: 'https://mastodon.social',
    enableStreaming: true,
    virtualizeTimeline: true,
    showProfileSwitcher: true,
    debugMode: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Connects to a real Mastodon instance. Requires authentication token.'
      }
    }
  }
};

// Story with debug mode enabled
export const WithDebugPanel: Story = {
  args: {
    useMockData: true,
    instanceUrl: 'https://mastodon.social',
    enableStreaming: true,
    virtualizeTimeline: true,
    showProfileSwitcher: true,
    debugMode: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows debug panel with real-time event monitoring and transport information.'
      }
    }
  }
};

// Story with minimal features
export const Minimal: Story = {
  args: {
    useMockData: true,
    instanceUrl: 'https://mastodon.social',
    enableStreaming: false,
    virtualizeTimeline: false,
    showProfileSwitcher: false,
    debugMode: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal timeline without streaming or virtualization.'
      }
    }
  }
};

// Mobile responsive view
export const Mobile: Story = {
  args: {
    useMockData: true,
    instanceUrl: 'https://mastodon.social', 
    enableStreaming: true,
    virtualizeTimeline: true,
    showProfileSwitcher: false,
    debugMode: false
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile-optimized timeline view.'
      }
    }
  }
};