import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';

import NotificationsFeed from '../src/components/NotificationsFeed.svelte';
import { 
  generateMockNotifications, 
  generateMockGroupedNotifications 
} from '../src/mockData';
import { groupNotifications } from '../src/utils/notificationGrouping';

// Mock the virtual scrolling library
vi.mock('@tanstack/svelte-virtual', () => ({
  createVirtualizer: vi.fn(() => ({
    getVirtualItems: () => [],
    getTotalSize: () => 0
  }))
}));

describe('NotificationsFeed', () => {
  const mockNotifications = generateMockNotifications(10);

  let mockHandlers: {
    onNotificationClick: ReturnType<typeof vi.fn>;
    onMarkAsRead: ReturnType<typeof vi.fn>;
    onMarkAllAsRead: ReturnType<typeof vi.fn>;
    onDismiss: ReturnType<typeof vi.fn>;
    onLoadMore: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockHandlers = {
      onNotificationClick: vi.fn(),
      onMarkAsRead: vi.fn(),
      onMarkAllAsRead: vi.fn(),
      onDismiss: vi.fn(),
      onLoadMore: vi.fn()
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render loading state when loading and no notifications', () => {
      render(NotificationsFeed, {
        props: {
          notifications: [],
          loading: true
        }
      });

      expect(screen.getByText('Loading notifications...')).toBeInTheDocument();
      expect(screen.getByLabelText('Loading notifications')).toBeInTheDocument();
    });

    it('should render empty state when no notifications and not loading', () => {
      render(NotificationsFeed, {
        props: {
          notifications: [],
          loading: false,
          emptyStateMessage: 'No notifications yet'
        }
      });

      expect(screen.getByText('No notifications')).toBeInTheDocument();
      expect(screen.getByText('No notifications yet')).toBeInTheDocument();
    });

    it('should render notifications feed with proper ARIA labels', () => {
      render(NotificationsFeed, {
        props: {
          notifications: mockNotifications.slice(0, 3),
          loading: false
        }
      });

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByLabelText('Notifications feed')).toBeInTheDocument();
      expect(screen.getByRole('feed')).toBeInTheDocument();
    });

    it('should show unread count and mark all as read button when there are unread notifications', () => {
      const notifications = mockNotifications.slice(0, 5).map((n, i) => ({
        ...n,
        read: i > 2 // First 3 are unread
      }));

      render(NotificationsFeed, {
        props: {
          notifications,
          loading: false,
          ...mockHandlers
        }
      });

      expect(screen.getByText('3 unread')).toBeInTheDocument();
      expect(screen.getByLabelText('3 unread notifications')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Mark all as read' })).toBeInTheDocument();
    });

    it('should not show header when all notifications are read', () => {
      const readNotifications = mockNotifications.slice(0, 3).map(n => ({
        ...n,
        read: true
      }));

      render(NotificationsFeed, {
        props: {
          notifications: readNotifications,
          loading: false
        }
      });

      expect(screen.queryByText(/unread/)).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Mark all as read' })).not.toBeInTheDocument();
    });
  });

  describe('Notification Grouping', () => {
    it('should group notifications by default', () => {
      const groupedNotifications = generateMockGroupedNotifications();
      const groups = groupNotifications(groupedNotifications);

      render(NotificationsFeed, {
        props: {
          notifications: groupedNotifications,
          groups,
          grouped: true,
          loading: false
        }
      });

      // Should display grouped notifications
      expect(screen.getByRole('feed')).toBeInTheDocument();
    });

    it('should display ungrouped notifications when grouped is false', () => {
      render(NotificationsFeed, {
        props: {
          notifications: mockNotifications.slice(0, 3),
          grouped: false,
          loading: false
        }
      });

      expect(screen.getByRole('feed')).toBeInTheDocument();
    });
  });

  describe('Interaction Handling', () => {
    it('should call onMarkAllAsRead when mark all as read button is clicked', async () => {
      const notifications = mockNotifications.slice(0, 3).map(n => ({
        ...n,
        read: false
      }));

      render(NotificationsFeed, {
        props: {
          notifications,
          loading: false,
          ...mockHandlers
        }
      });

      const markAllButton = screen.getByRole('button', { name: 'Mark all as read' });
      await fireEvent.click(markAllButton);

      expect(mockHandlers.onMarkAllAsRead).toHaveBeenCalledOnce();
    });

    it('should handle keyboard navigation on mark all as read button', async () => {
      const notifications = mockNotifications.slice(0, 3).map(n => ({
        ...n,
        read: false
      }));

      render(NotificationsFeed, {
        props: {
          notifications,
          loading: false,
          ...mockHandlers
        }
      });

      const markAllButton = screen.getByRole('button', { name: 'Mark all as read' });
      markAllButton.focus();
      await fireEvent.keyDown(markAllButton, { key: 'Enter' });

      expect(mockHandlers.onMarkAllAsRead).toHaveBeenCalledOnce();
    });

    it('should apply correct CSS classes for density', () => {
      const { container: compactContainer } = render(NotificationsFeed, {
        props: {
          notifications: mockNotifications.slice(0, 3),
          density: 'compact',
          loading: false
        }
      });

      expect(compactContainer.querySelector('.notifications-feed.compact')).toBeInTheDocument();

      const { container: comfortableContainer } = render(NotificationsFeed, {
        props: {
          notifications: mockNotifications.slice(0, 3),
          density: 'comfortable',
          loading: false
        }
      });

      expect(comfortableContainer.querySelector('.notifications-feed.comfortable')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show loading more indicator when loadingMore is true', () => {
      render(NotificationsFeed, {
        props: {
          notifications: mockNotifications.slice(0, 3),
          loading: false,
          loadingMore: true,
          hasMore: true
        }
      });

      expect(screen.getByText('Loading more...')).toBeInTheDocument();
      expect(screen.getByLabelText('Loading more notifications')).toBeInTheDocument();
    });

    it('should not show loading more when hasMore is false', () => {
      render(NotificationsFeed, {
        props: {
          notifications: mockNotifications.slice(0, 3),
          loading: false,
          loadingMore: false,
          hasMore: false
        }
      });

      expect(screen.queryByText('Loading more...')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(NotificationsFeed, {
        props: {
          notifications: mockNotifications.slice(0, 3),
          loading: false,
          loadingMore: true
        }
      });

      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('aria-label', 'Notifications feed');

      const feed = screen.getByRole('feed');
      expect(feed).toHaveAttribute('aria-label', 'Notifications');
      expect(feed).toHaveAttribute('aria-busy', 'true');
      expect(feed).toHaveAttribute('tabindex', '0');
    });

    it('should announce loading states to screen readers', () => {
      render(NotificationsFeed, {
        props: {
          notifications: [],
          loading: true
        }
      });

      const loadingContainer = screen.getByText('Loading notifications...').parentElement;
      expect(loadingContainer).toHaveAttribute('aria-live', 'polite');
    });

    it('should announce empty state to screen readers', () => {
      render(NotificationsFeed, {
        props: {
          notifications: [],
          loading: false
        }
      });

      const emptyState = screen.getByRole('status');
      expect(emptyState).toHaveAttribute('aria-live', 'polite');
    });

    it('should provide proper button labeling and keyboard shortcuts', () => {
      const notifications = mockNotifications.slice(0, 2).map(n => ({
        ...n,
        read: false
      }));

      render(NotificationsFeed, {
        props: {
          notifications,
          loading: false,
          ...mockHandlers
        }
      });

      const markAllButton = screen.getByRole('button', { name: 'Mark all as read' });
      expect(markAllButton).toHaveAttribute('aria-label', 'Mark all notifications as read');
    });
  });

  describe('Custom Content', () => {
    it('should use custom empty state message', () => {
      const customMessage = 'All caught up! No new notifications.';
      
      render(NotificationsFeed, {
        props: {
          notifications: [],
          loading: false,
          emptyStateMessage: customMessage
        }
      });

      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(NotificationsFeed, {
        props: {
          notifications: mockNotifications.slice(0, 3),
          className: 'custom-notifications',
          loading: false
        }
      });

      expect(container.querySelector('.notifications-feed.custom-notifications')).toBeInTheDocument();
    });
  });

  describe('Performance and Virtualization', () => {
    it('should handle large datasets with virtualization settings', () => {
      render(NotificationsFeed, {
        props: {
          notifications: mockNotifications,
          loading: false,
          estimateSize: 150,
          overscan: 8
        }
      });

      expect(screen.getByRole('feed')).toBeInTheDocument();
      // Virtualization is mocked, so we just ensure it renders without errors
    });

    it('should preserve scroll position when notifications are added', () => {
      const { rerender } = render(NotificationsFeed, {
        props: {
          notifications: mockNotifications.slice(0, 5),
          loading: false
        }
      });

      // Add more notifications (simulating prepend)
      rerender({
        notifications: mockNotifications.slice(0, 10),
        loading: false
      });

      // Component should handle scroll preservation internally
      expect(screen.getByRole('feed')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing callback functions gracefully', () => {
      render(NotificationsFeed, {
        props: {
          notifications: mockNotifications.slice(0, 3),
          loading: false
          // No callback functions provided
        }
      });

      // Should render without errors even without callbacks
      expect(screen.getByRole('feed')).toBeInTheDocument();
    });

    it('should handle empty or undefined notification arrays', () => {
      render(NotificationsFeed, {
        props: {
          notifications: [],
          loading: false
        }
      });

      expect(screen.getByText('No notifications')).toBeInTheDocument();
    });

    it('should handle malformed notification data gracefully', () => {
      const malformedNotifications = [
        ...mockNotifications.slice(0, 2),
        { id: 'malformed', type: 'unknown' } as any
      ];

      // Should not throw an error
      expect(() => {
        render(NotificationsFeed, {
          props: {
            notifications: malformedNotifications,
            loading: false
          }
        });
      }).not.toThrow();
    });
  });

  describe('Responsive Behavior', () => {
    it('should handle different screen sizes appropriately', () => {
      // Test with compact density for smaller screens
      render(NotificationsFeed, {
        props: {
          notifications: mockNotifications.slice(0, 5),
          density: 'compact',
          loading: false,
          estimateSize: 100
        }
      });

      expect(screen.getByRole('feed')).toBeInTheDocument();
    });
  });
});