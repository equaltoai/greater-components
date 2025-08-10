import type { Meta, StoryObj } from '@storybook/svelte';
import IntegrationSettingsExample from './IntegrationSettingsExample.svelte';

const meta = {
  title: 'Examples/Integration Settings',
  component: IntegrationSettingsExample,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Transport configuration panel with mock/real endpoint toggle, connection monitoring, and debug capabilities.'
      }
    }
  },
  argTypes: {
    showConnectionStatus: {
      control: 'boolean',
      description: 'Show real-time connection status'
    },
    showDebugPanel: {
      control: 'boolean',
      description: 'Display debug panel with events'
    },
    showPerformanceMetrics: {
      control: 'boolean',
      description: 'Show performance metrics'
    },
    allowEndpointSwitch: {
      control: 'boolean',
      description: 'Allow switching between mock and real endpoints'
    },
    showEventLog: {
      control: 'boolean',
      description: 'Display real-time event log'
    },
    showRateLimits: {
      control: 'boolean',
      description: 'Show API rate limit information'
    }
  }
} satisfies Meta<IntegrationSettingsExample>;

export default meta;
type Story = StoryObj<typeof meta>;

// Full settings panel
export const FullSettings: Story = {
  args: {
    showConnectionStatus: true,
    showDebugPanel: true,
    showPerformanceMetrics: true,
    allowEndpointSwitch: true,
    showEventLog: true,
    showRateLimits: true
  }
};

// Simple connection panel
export const SimpleConnection: Story = {
  args: {
    showConnectionStatus: true,
    showDebugPanel: false,
    showPerformanceMetrics: false,
    allowEndpointSwitch: true,
    showEventLog: false,
    showRateLimits: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic connection settings without debug features.'
      }
    }
  }
};

// Debug-focused view
export const DebugMode: Story = {
  args: {
    showConnectionStatus: true,
    showDebugPanel: true,
    showPerformanceMetrics: false,
    allowEndpointSwitch: true,
    showEventLog: true,
    showRateLimits: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Settings optimized for debugging and event monitoring.'
      }
    }
  }
};

// Performance monitoring
export const PerformanceView: Story = {
  args: {
    showConnectionStatus: true,
    showDebugPanel: false,
    showPerformanceMetrics: true,
    allowEndpointSwitch: false,
    showEventLog: false,
    showRateLimits: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Focus on performance metrics and rate limiting.'
      }
    }
  }
};

// Mobile settings
export const MobileSettings: Story = {
  args: {
    showConnectionStatus: true,
    showDebugPanel: false,
    showPerformanceMetrics: false,
    allowEndpointSwitch: true,
    showEventLog: false,
    showRateLimits: false
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile-optimized settings interface.'
      }
    }
  }
};