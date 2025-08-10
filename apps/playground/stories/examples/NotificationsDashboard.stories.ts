import type { Meta, StoryObj } from '@storybook/svelte';
import NotificationsDashboardExample from './NotificationsDashboardExample.svelte';

const meta = {
  title: 'Examples/Notifications Dashboard',
  component: NotificationsDashboardExample,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Comprehensive notifications dashboard with grouping, real-time updates, and filtering capabilities.'
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
      description: 'Enable real-time notification streaming'
    },
    groupingMode: {
      control: 'select',
      options: ['none', 'type', 'account', 'time'],
      description: 'How to group notifications'
    },
    showFilters: {
      control: 'boolean',
      description: 'Show notification type filters'
    },
    autoMarkAsRead: {
      control: 'boolean',
      description: 'Automatically mark notifications as read when viewed'
    },
    showStats: {
      control: 'boolean',
      description: 'Show notification statistics panel'
    }
  }
} satisfies Meta<NotificationsDashboardExample>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with all features
export const FullDashboard: Story = {
  args: {
    useMockData: true,
    instanceUrl: 'https://mastodon.social',
    enableStreaming: true,
    groupingMode: 'type',
    showFilters: true,
    autoMarkAsRead: false,
    showStats: true
  }
};

// Story with account grouping
export const GroupedByAccount: Story = {
  args: {
    useMockData: true,
    instanceUrl: 'https://mastodon.social',
    enableStreaming: true,
    groupingMode: 'account',
    showFilters: true,
    autoMarkAsRead: false,
    showStats: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Groups notifications by account for easier management.'
      }
    }
  }
};

// Story with real-time streaming
export const LiveStreaming: Story = {
  args: {
    useMockData: true,
    instanceUrl: 'https://mastodon.social',
    enableStreaming: true,
    groupingMode: 'none',
    showFilters: false,
    autoMarkAsRead: true,
    showStats: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Real-time notification streaming with auto-read functionality.'
      }
    }
  }
};

// Minimal notification feed
export const MinimalFeed: Story = {
  args: {
    useMockData: true,
    instanceUrl: 'https://mastodon.social',
    enableStreaming: false,
    groupingMode: 'none',
    showFilters: false,
    autoMarkAsRead: false,
    showStats: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Simple notification feed without extra features.'
      }
    }
  }
};

// Mobile view
export const MobileView: Story = {
  args: {
    useMockData: true,
    instanceUrl: 'https://mastodon.social',
    enableStreaming: true,
    groupingMode: 'type',
    showFilters: false,
    autoMarkAsRead: true,
    showStats: false
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile-optimized notification dashboard.'
      }
    }
  }
};

// With time-based grouping
export const TimeGrouped: Story = {
  args: {
    useMockData: true,
    instanceUrl: 'https://mastodon.social',
    enableStreaming: false,
    groupingMode: 'time',
    showFilters: true,
    autoMarkAsRead: false,
    showStats: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Groups notifications by time periods (Today, Yesterday, This Week, etc.).'
      }
    }
  }
};