import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';

import NotificationItem from '../src/components/NotificationItem.svelte';
import { generateMockNotifications, generateMockGroupedNotifications } from '../src/mockData';
import { groupNotifications } from '../src/utils/notificationGrouping';
import type { NotificationGroup } from '../src/types';

describe('NotificationItem', () => {
  const mockNotifications = generateMockNotifications(10);

  let mockHandlers: {
    onClick: ReturnType<typeof vi.fn>;
    onMarkAsRead: ReturnType<typeof vi.fn>;
    onDismiss: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockHandlers = {
      onClick: vi.fn(),
      onMarkAsRead: vi.fn(),
      onDismiss: vi.fn()
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render a single notification correctly', () => {
      const notification = mockNotifications[0];
      
      render(NotificationItem, {
        props: {
          notification,
          ...mockHandlers
        }
      });

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText(notification.account.displayName)).toBeInTheDocument();
    });

    it('should show unread indicator for unread notifications', () => {
      const notification = { ...mockNotifications[0], read: false };
      
      render(NotificationItem, {
        props: {
          notification,
          ...mockHandlers
        }
      });

      const item = screen.getByRole('button');
      expect(item).toHaveClass('unread');
      expect(screen.getByLabelText(/Unread/)).toBeInTheDocument();
    });

    it('should not show unread indicator for read notifications', () => {
      const notification = { ...mockNotifications[0], read: true };
      
      render(NotificationItem, {
        props: {
          notification,
          ...mockHandlers
        }
      });

      const item = screen.getByRole('button');
      expect(item).not.toHaveClass('unread');
      expect(screen.queryByLabelText(/Unread/)).not.toBeInTheDocument();
    });

    it('should display notification time correctly', () => {
      const notification = {
        ...mockNotifications[0],
        createdAt: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
      };
      
      render(NotificationItem, {
        props: {
          notification,
          ...mockHandlers
        }
      });

      expect(screen.getByText('30m')).toBeInTheDocument();
      const timeElement = screen.getByRole('time');
      expect(timeElement).toHaveAttribute('datetime');
    });

    it('should show appropriate icon for notification type', () => {
      const mentionNotification = mockNotifications.find(n => n.type === 'mention')!;
      
      render(NotificationItem, {
        props: {
          notification: mentionNotification,
          ...mockHandlers
        }
      });

      const icon = screen.getByRole('button').querySelector('.notification-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveStyle('color: var(--color-primary, #1d9bf0)');
    });
  });

  describe('Notification Types', () => {
    it('should render mention notification correctly', () => {
      const mentionNotification = mockNotifications.find(n => n.type === 'mention')!;
      
      render(NotificationItem, {
        props: {
          notification: mentionNotification,
          ...mockHandlers
        }
      });

      expect(screen.getByText(/mentioned you/)).toBeInTheDocument();
      // Should show status preview
      expect(screen.getByText(/Hey @you/)).toBeInTheDocument();
    });

    it('should render reblog notification correctly', () => {
      const reblogNotification = mockNotifications.find(n => n.type === 'reblog')!;
      
      render(NotificationItem, {
        props: {
          notification: reblogNotification,
          ...mockHandlers
        }
      });

      expect(screen.getByText(/boosted your post/)).toBeInTheDocument();
    });

    it('should render follow notification correctly', () => {
      const followNotification = mockNotifications.find(n => n.type === 'follow')!;
      
      render(NotificationItem, {
        props: {
          notification: followNotification,
          ...mockHandlers
        }
      });

      expect(screen.getByText(/followed you/)).toBeInTheDocument();
      // Follow notifications shouldn't have status preview
      expect(screen.queryByText(/.status-preview/)).not.toBeInTheDocument();
    });

    it('should render favourite notification correctly', () => {
      const favouriteNotification = mockNotifications.find(n => n.type === 'favourite')!;
      
      render(NotificationItem, {
        props: {
          notification: favouriteNotification,
          ...mockHandlers
        }
      });

      expect(screen.getByText(/favorited your post/)).toBeInTheDocument();
    });
  });

  describe('Grouped Notifications', () => {
    it('should render grouped notification with multiple avatars', () => {
      const groupedNotifications = generateMockGroupedNotifications();
      const groups = groupNotifications(groupedNotifications);
      const group = groups.find(g => g.count > 1)!;
      
      render(NotificationItem, {
        props: {
          notification: group.sampleNotification,
          group,
          ...mockHandlers
        }
      });

      // Should show multiple avatars
      const avatars = screen.getAllByRole('img');
      expect(avatars.length).toBeGreaterThan(1);
      
      // Should show group count
      expect(screen.getByText(`${group.count} notifications`)).toBeInTheDocument();
    });

    it('should show overflow indicator for groups with many members', () => {
      const largeGroup: NotificationGroup = {
        id: 'large-group',
        type: 'favourite',
        notifications: mockNotifications.slice(0, 6),
        accounts: mockNotifications.slice(0, 6).map(n => n.account),
        sampleNotification: mockNotifications[0],
        count: 6,
        latestCreatedAt: new Date().toISOString(),
        allRead: false
      };
      
      render(NotificationItem, {
        props: {
          notification: largeGroup.sampleNotification,
          group: largeGroup,
          ...mockHandlers
        }
      });

      // Should show +2 indicator (6 total - 4 shown = 2 overflow)
      expect(screen.getByText('+2')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onClick when notification is clicked', async () => {
      const notification = mockNotifications[0];
      
      render(NotificationItem, {
        props: {
          notification,
          ...mockHandlers
        }
      });

      const item = screen.getByRole('button');
      await fireEvent.click(item);

      expect(mockHandlers.onClick).toHaveBeenCalledWith(notification);
    });

    it('should call onClick when Enter key is pressed', async () => {
      const notification = mockNotifications[0];
      
      render(NotificationItem, {
        props: {
          notification,
          ...mockHandlers
        }
      });

      const item = screen.getByRole('button');
      item.focus();
      await fireEvent.keyDown(item, { key: 'Enter' });

      expect(mockHandlers.onClick).toHaveBeenCalledWith(notification);
    });

    it('should call onClick when Space key is pressed', async () => {
      const notification = mockNotifications[0];
      
      render(NotificationItem, {
        props: {
          notification,
          ...mockHandlers
        }
      });

      const item = screen.getByRole('button');
      item.focus();
      await fireEvent.keyDown(item, { key: ' ' });

      expect(mockHandlers.onClick).toHaveBeenCalledWith(notification);
    });

    it('should call onMarkAsRead when M key is pressed', async () => {
      const notification = mockNotifications[0];
      
      render(NotificationItem, {
        props: {
          notification,
          ...mockHandlers
        }
      });

      const item = screen.getByRole('button');
      item.focus();
      await fireEvent.keyDown(item, { key: 'm' });

      expect(mockHandlers.onMarkAsRead).toHaveBeenCalledWith(notification.id);
    });

    it('should call onDismiss when X key is pressed', async () => {
      const notification = mockNotifications[0];
      
      render(NotificationItem, {
        props: {
          notification,
          ...mockHandlers
        }
      });

      const item = screen.getByRole('button');
      item.focus();
      await fireEvent.keyDown(item, { key: 'x' });

      expect(mockHandlers.onDismiss).toHaveBeenCalledWith(notification.id);
    });
  });

  describe('Action Buttons', () => {
    it('should show mark as read button for unread notifications', async () => {
      const notification = { ...mockNotifications[0], read: false };
      
      render(NotificationItem, {
        props: {
          notification,
          showActions: true,
          ...mockHandlers
        }
      });

      // Action buttons are initially hidden, show on hover/focus
      const item = screen.getByRole('button');
      await fireEvent.mouseEnter(item);

      const markReadButton = screen.getByLabelText('Mark notification as read');
      expect(markReadButton).toBeInTheDocument();
    });

    it('should not show mark as read button for read notifications', () => {
      const notification = { ...mockNotifications[0], read: true };
      
      render(NotificationItem, {
        props: {
          notification,
          showActions: true,
          ...mockHandlers
        }
      });

      expect(screen.queryByLabelText('Mark notification as read')).not.toBeInTheDocument();
    });

    it('should show dismiss button when onDismiss is provided', async () => {
      const notification = mockNotifications[0];
      
      render(NotificationItem, {
        props: {
          notification,
          showActions: true,
          ...mockHandlers
        }
      });

      // Action buttons are initially hidden, show on hover/focus
      const item = screen.getByRole('button');
      await fireEvent.mouseEnter(item);

      const dismissButton = screen.getByLabelText('Dismiss notification');
      expect(dismissButton).toBeInTheDocument();
    });

    it('should call onMarkAsRead when mark as read button is clicked', async () => {
      const notification = { ...mockNotifications[0], read: false };
      
      render(NotificationItem, {
        props: {
          notification,
          showActions: true,
          ...mockHandlers
        }
      });

      const item = screen.getByRole('button');
      await fireEvent.mouseEnter(item);

      const markReadButton = screen.getByLabelText('Mark notification as read');
      await fireEvent.click(markReadButton);

      expect(mockHandlers.onMarkAsRead).toHaveBeenCalledWith(notification.id);
      expect(mockHandlers.onClick).not.toHaveBeenCalled(); // Should stop propagation
    });

    it('should call onDismiss when dismiss button is clicked', async () => {
      const notification = mockNotifications[0];
      
      render(NotificationItem, {
        props: {
          notification,
          showActions: true,
          ...mockHandlers
        }
      });

      const item = screen.getByRole('button');
      await fireEvent.mouseEnter(item);

      const dismissButton = screen.getByLabelText('Dismiss notification');
      await fireEvent.click(dismissButton);

      expect(mockHandlers.onDismiss).toHaveBeenCalledWith(notification.id);
      expect(mockHandlers.onClick).not.toHaveBeenCalled(); // Should stop propagation
    });

    it('should not show action buttons when showActions is false', () => {
      const notification = { ...mockNotifications[0], read: false };
      
      render(NotificationItem, {
        props: {
          notification,
          showActions: false,
          ...mockHandlers
        }
      });

      expect(screen.queryByLabelText('Mark notification as read')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Dismiss notification')).not.toBeInTheDocument();
    });
  });

  describe('Visual Density', () => {
    it('should apply compact density class', () => {
      const notification = mockNotifications[0];
      
      render(NotificationItem, {
        props: {
          notification,
          density: 'compact',
          ...mockHandlers
        }
      });

      const item = screen.getByRole('button');
      expect(item).toHaveClass('compact');
    });

    it('should apply comfortable density class by default', () => {
      const notification = mockNotifications[0];
      
      render(NotificationItem, {
        props: {
          notification,
          ...mockHandlers
        }
      });

      const item = screen.getByRole('button');
      expect(item).toHaveClass('comfortable');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const notification = { ...mockNotifications[0], read: false };
      
      render(NotificationItem, {
        props: {
          notification,
          ...mockHandlers
        }
      });

      const item = screen.getByRole('button');
      expect(item).toHaveAttribute('tabindex', '0');
      expect(item).toHaveAttribute('aria-label');
      expect(item).toHaveAttribute('aria-describedby');
      
      const ariaLabel = item.getAttribute('aria-label');
      expect(ariaLabel).toContain('Unread');
      expect(ariaLabel).toContain('Press Enter to open');
      expect(ariaLabel).toContain('M to mark as read');
      expect(ariaLabel).toContain('X to dismiss');
    });

    it('should not mention "Unread" in aria-label for read notifications', () => {
      const notification = { ...mockNotifications[0], read: true };
      
      render(NotificationItem, {
        props: {
          notification,
          ...mockHandlers
        }
      });

      const item = screen.getByRole('button');
      const ariaLabel = item.getAttribute('aria-label');
      expect(ariaLabel).not.toContain('Unread');
    });

    it('should provide proper time element with datetime attribute', () => {
      const notification = {
        ...mockNotifications[0],
        createdAt: '2023-12-01T10:30:00Z'
      };
      
      render(NotificationItem, {
        props: {
          notification,
          ...mockHandlers
        }
      });

      const timeElement = screen.getByRole('time');
      expect(timeElement).toHaveAttribute('datetime', '2023-12-01T10:30:00.000Z');
      expect(timeElement).toHaveAttribute('title');
    });

    it('should provide accessible avatar images', () => {
      const notification = mockNotifications[0];
      
      render(NotificationItem, {
        props: {
          notification,
          ...mockHandlers
        }
      });

      const avatar = screen.getByRole('img');
      expect(avatar).toHaveAttribute('alt');
      expect(avatar.getAttribute('alt')).toContain(notification.account.displayName);
      expect(avatar.getAttribute('alt')).toContain(notification.account.acct);
      expect(avatar).toHaveAttribute('loading', 'lazy');
    });
  });

  describe('Status Preview', () => {
    it('should show status preview for notifications with status', () => {
      const mentionNotification = mockNotifications.find(n => n.type === 'mention' && 'status' in n)!;
      
      render(NotificationItem, {
        props: {
          notification: mentionNotification,
          ...mockHandlers
        }
      });

      const statusPreview = screen.getByText(/Hey @you/);
      expect(statusPreview).toBeInTheDocument();
    });

    it('should truncate long status content', () => {
      const longContent = 'A'.repeat(200);
      const notification = {
        ...mockNotifications.find(n => n.type === 'mention')!,
        status: {
          ...(mockNotifications.find(n => n.type === 'mention')! as any).status,
          content: `<p>${longContent}</p>`
        }
      };
      
      render(NotificationItem, {
        props: {
          notification,
          ...mockHandlers
        }
      });

      const preview = screen.getByText(/A+\.\.\./);
      expect(preview).toBeInTheDocument();
    });

    it('should strip HTML tags from status content', () => {
      const notification = {
        ...mockNotifications.find(n => n.type === 'mention')!,
        status: {
          ...(mockNotifications.find(n => n.type === 'mention')! as any).status,
          content: '<p>Hello <strong>world</strong>!</p>'
        }
      };
      
      render(NotificationItem, {
        props: {
          notification,
          ...mockHandlers
        }
      });

      expect(screen.getByText('Hello world!')).toBeInTheDocument();
      expect(screen.queryByText('<p>')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing callback functions gracefully', () => {
      const notification = mockNotifications[0];
      
      expect(() => {
        render(NotificationItem, {
          props: {
            notification
            // No callback functions
          }
        });
      }).not.toThrow();
    });

    it('should handle malformed notification data', () => {
      const malformedNotification = {
        id: 'malformed',
        type: 'unknown',
        account: {
          id: 'test',
          username: 'test',
          acct: 'test@example.com',
          displayName: 'Test User',
          avatar: 'https://example.com/avatar.png',
          url: 'https://example.com/@test',
          createdAt: new Date().toISOString()
        },
        createdAt: new Date().toISOString(),
        read: false
      } as any;
      
      expect(() => {
        render(NotificationItem, {
          props: {
            notification: malformedNotification,
            ...mockHandlers
          }
        });
      }).not.toThrow();
    });

    it('should handle missing status data for status-based notifications', () => {
      const notificationWithoutStatus = {
        ...mockNotifications.find(n => n.type === 'mention')!,
        status: undefined
      } as any;
      
      expect(() => {
        render(NotificationItem, {
          props: {
            notification: notificationWithoutStatus,
            ...mockHandlers
          }
        });
      }).not.toThrow();
    });
  });
});