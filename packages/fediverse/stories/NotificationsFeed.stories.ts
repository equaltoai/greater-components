import type { Meta, StoryObj } from '@storybook/svelte';
import NotificationsFeed from '../src/components/NotificationsFeed.svelte';
import { 
  generateMockNotifications, 
  generateMockGroupedNotifications 
} from '../src/mockData';
import { groupNotifications } from '../src/utils/notificationGrouping';

const meta: Meta<NotificationsFeed> = {
  title: 'Components/NotificationsFeed',
  component: NotificationsFeed,
  parameters: {
    docs: {
      description: {
        component: `
A virtualized notifications feed component that displays grouped or individual notifications from fediverse platforms.

## Features

- **Virtualized scrolling** for optimal performance with large notification feeds
- **Notification grouping** by type and content (similar notifications are grouped together)
- **Read/unread state management** with visual indicators
- **Click to navigate** functionality with proper event handling
- **Full accessibility** support with WCAG 2.1 AA compliance
- **Keyboard navigation** support (Enter/Space to activate, M to mark as read, X to dismiss)
- **Loading states** and empty state handling
- **Responsive design** with compact and comfortable density options

## Notification Types

- **Mentions**: When someone mentions you in a post
- **Boosts/Reblogs**: When someone boosts your post  
- **Favorites**: When someone favorites your post
- **Follows**: When someone follows you
- **Follow Requests**: When someone requests to follow you (private accounts)
- **Polls**: When someone votes in your poll or a poll you voted in ends
- **Status**: New posts from people you follow
- **Updates**: When someone edits a post you interacted with

## Accessibility Features

- Proper ARIA labels and roles
- Screen reader friendly content
- High contrast mode support
- Reduced motion support
- Keyboard navigation
- Focus management
        `
      }
    }
  },
  argTypes: {
    grouped: {
      control: 'boolean',
      description: 'Whether to group similar notifications together'
    },
    density: {
      control: 'select',
      options: ['compact', 'comfortable'],
      description: 'Visual density of notifications'
    },
    loading: {
      control: 'boolean',
      description: 'Whether to show loading state'
    },
    loadingMore: {
      control: 'boolean',
      description: 'Whether to show loading more indicator'
    },
    hasMore: {
      control: 'boolean',
      description: 'Whether there are more notifications to load'
    },
    emptyStateMessage: {
      control: 'text',
      description: 'Message to show when no notifications are present'
    },
    estimateSize: {
      control: { type: 'number', min: 50, max: 300, step: 10 },
      description: 'Estimated height of each notification for virtualization'
    },
    overscan: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Number of items to render outside visible area'
    },
    onNotificationClick: {
      action: 'notification-clicked',
      description: 'Callback when a notification is clicked'
    },
    onMarkAsRead: {
      action: 'mark-as-read',
      description: 'Callback when marking a notification as read'
    },
    onMarkAllAsRead: {
      action: 'mark-all-as-read',
      description: 'Callback when marking all notifications as read'
    },
    onDismiss: {
      action: 'dismiss',
      description: 'Callback when dismissing a notification'
    },
    onLoadMore: {
      action: 'load-more',
      description: 'Callback when loading more notifications'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Generate mock data
const mockNotifications = generateMockNotifications(50);
const mockGroupedNotifications = generateMockGroupedNotifications();

export const Default: Story = {
  args: {
    notifications: mockNotifications.slice(0, 20),
    grouped: true,
    density: 'comfortable',
    loading: false,
    loadingMore: false,
    hasMore: true,
    emptyStateMessage: 'No notifications yet',
    estimateSize: 120,
    overscan: 5
  }
};

export const Loading: Story = {
  args: {
    notifications: [],
    loading: true,
    grouped: true,
    density: 'comfortable'
  }
};

export const Empty: Story = {
  args: {
    notifications: [],
    loading: false,
    grouped: true,
    density: 'comfortable',
    emptyStateMessage: 'All caught up! No new notifications.'
  }
};

export const Ungrouped: Story = {
  args: {
    notifications: mockNotifications.slice(0, 15),
    grouped: false,
    density: 'comfortable',
    loading: false,
    loadingMore: false,
    hasMore: true
  }
};

export const CompactDensity: Story = {
  args: {
    notifications: mockNotifications.slice(0, 25),
    grouped: true,
    density: 'compact',
    loading: false,
    loadingMore: false,
    hasMore: true,
    estimateSize: 100
  }
};

export const WithGroupedNotifications: Story = {
  args: {
    notifications: mockGroupedNotifications,
    groups: groupNotifications(mockGroupedNotifications),
    grouped: true,
    density: 'comfortable',
    loading: false,
    loadingMore: false,
    hasMore: true
  }
};

export const LoadingMore: Story = {
  args: {
    notifications: mockNotifications.slice(0, 10),
    grouped: true,
    density: 'comfortable',
    loading: false,
    loadingMore: true,
    hasMore: true
  }
};

export const ManyUnread: Story = {
  args: {
    notifications: mockNotifications.map((n, i) => ({
      ...n,
      read: i > 15 // Only first 15 are read
    })),
    grouped: true,
    density: 'comfortable',
    loading: false,
    loadingMore: false,
    hasMore: true
  }
};

export const LargeDataset: Story = {
  args: {
    notifications: generateMockNotifications(200),
    grouped: true,
    density: 'comfortable',
    loading: false,
    loadingMore: false,
    hasMore: true,
    estimateSize: 120,
    overscan: 10
  }
};

export const MentionsOnly: Story = {
  args: {
    notifications: mockNotifications.filter(n => n.type === 'mention').slice(0, 10),
    grouped: false,
    density: 'comfortable',
    loading: false,
    loadingMore: false,
    hasMore: false
  }
};

export const FollowsAndRequests: Story = {
  args: {
    notifications: mockNotifications.filter(n => 
      n.type === 'follow' || n.type === 'follow_request'
    ).slice(0, 8),
    grouped: true,
    density: 'comfortable',
    loading: false,
    loadingMore: false,
    hasMore: false
  }
};

export const InteractionsWithPosts: Story = {
  args: {
    notifications: mockNotifications.filter(n => 
      n.type === 'reblog' || n.type === 'favourite'
    ).slice(0, 12),
    grouped: true,
    density: 'comfortable',
    loading: false,
    loadingMore: false,
    hasMore: true
  }
};

// Accessibility testing story
export const AccessibilityTest: Story = {
  args: {
    notifications: mockNotifications.slice(0, 5),
    grouped: true,
    density: 'comfortable',
    loading: false,
    loadingMore: false,
    hasMore: false
  },
  parameters: {
    docs: {
      description: {
        story: `
This story is optimized for accessibility testing. It includes:

- Proper ARIA labels and roles
- Keyboard navigation support (Tab, Enter, Space, M, X)
- Screen reader friendly content
- High contrast mode compatibility
- Focus management
- Unread indicators with appropriate announcements

Test with:
- Screen reader (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation
- High contrast mode
- Reduced motion preferences
        `
      }
    }
  }
};

// Performance testing story
export const PerformanceTest: Story = {
  args: {
    notifications: generateMockNotifications(1000),
    grouped: true,
    density: 'compact',
    loading: false,
    loadingMore: false,
    hasMore: true,
    estimateSize: 100,
    overscan: 15
  },
  parameters: {
    docs: {
      description: {
        story: `
This story tests performance with a large dataset (1000 notifications).
The virtualized list should handle this smoothly with minimal lag.

Performance features:
- Virtual scrolling with @tanstack/svelte-virtual
- Optimized rendering with estimated sizes
- Efficient grouping algorithms
- Minimal DOM updates
        `
      }
    }
  }
};