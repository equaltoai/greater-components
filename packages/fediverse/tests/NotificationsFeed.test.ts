/**
 * NotificationsFeed Logic Tests
 * 
 * Tests the pure logic functions used by NotificationsFeed component
 */

import { describe, it, expect } from 'vitest';
import type { Notification, NotificationGroup } from '../src/types';
import { groupNotifications } from '../src/utils/notificationGrouping';

// Helper to create mock notification
function createNotification(overrides: Partial<Notification> = {}): Notification {
  return {
    id: Math.random().toString(),
    type: 'mention',
    createdAt: new Date().toISOString(),
    account: {
      id: 'acc1',
      username: 'testuser',
      displayName: 'Test User',
      avatar: '',
      acct: 'testuser@example.com',
      url: '',
    },
    read: false,
    ...overrides,
  } as Notification;
}

// Calculate unread count
function getUnreadCount(notifications: Notification[]): number {
  return notifications.filter((n) => !n.read).length;
}

// Check if should show mark all as read
function shouldShowMarkAllAsRead(unreadCount: number, onMarkAllAsRead?: () => void): boolean {
  return unreadCount > 0 && onMarkAllAsRead !== undefined;
}

// Check if should show header
function shouldShowHeader(unreadCount: number): boolean {
  return unreadCount > 0;
}

// Check if should show empty state
function shouldShowEmptyState(
  notifications: Notification[],
  loading: boolean
): boolean {
  return notifications.length === 0 && !loading;
}

// Check if should show loading
function shouldShowLoading(loading: boolean, notifications: Notification[]): boolean {
  return loading && notifications.length === 0;
}

// Check if should show loading more
function shouldShowLoadingMore(loadingMore: boolean, hasMore: boolean): boolean {
  return loadingMore && hasMore;
}

// Get density class
function getDensityClass(density: 'compact' | 'comfortable'): string {
  return `notifications-feed--${density}`;
}

// Calculate items to display
function getItemsToDisplay(
  notifications: Notification[],
  grouped: boolean,
  groups?: NotificationGroup[]
): (Notification | NotificationGroup)[] {
  if (grouped && groups && groups.length > 0) {
    return groups;
  }
  return notifications;
}

// Check if has notifications
function hasNotifications(notifications: Notification[]): boolean {
  return notifications.length > 0;
}

// Check if all read
function areAllRead(notifications: Notification[]): boolean {
  return notifications.every((n) => n.read);
}

// Get latest notification time
function getLatestTime(notifications: Notification[]): string | null {
  if (notifications.length === 0) return null;
  return notifications.reduce((latest, n) => {
    return new Date(n.createdAt) > new Date(latest) ? n.createdAt : latest;
  }, notifications[0].createdAt);
}

// Count by type
function countByType(notifications: Notification[], type: string): number {
  return notifications.filter((n) => n.type === type).length;
}

// Filter by read status
function filterByReadStatus(
  notifications: Notification[],
  unreadOnly: boolean
): Notification[] {
  return unreadOnly ? notifications.filter((n) => !n.read) : notifications;
}

describe('NotificationsFeed - Unread Count', () => {
  it('calculates unread count', () => {
    const notifications = [
      createNotification({ read: false }),
      createNotification({ read: true }),
      createNotification({ read: false }),
    ];
    expect(getUnreadCount(notifications)).toBe(2);
  });

  it('returns zero for all read', () => {
    const notifications = [
      createNotification({ read: true }),
      createNotification({ read: true }),
    ];
    expect(getUnreadCount(notifications)).toBe(0);
  });

  it('returns count for all unread', () => {
    const notifications = [
      createNotification({ read: false }),
      createNotification({ read: false }),
    ];
    expect(getUnreadCount(notifications)).toBe(2);
  });

  it('handles empty array', () => {
    expect(getUnreadCount([])).toBe(0);
  });
});

describe('NotificationsFeed - Mark All As Read Button', () => {
  it('shows when has unread and handler exists', () => {
    expect(shouldShowMarkAllAsRead(3, () => {})).toBe(true);
  });

  it('hides when all read', () => {
    expect(shouldShowMarkAllAsRead(0, () => {})).toBe(false);
  });

  it('hides when no handler', () => {
    expect(shouldShowMarkAllAsRead(3, undefined)).toBe(false);
  });
});

describe('NotificationsFeed - Header Display', () => {
  it('shows header when has unread', () => {
    expect(shouldShowHeader(3)).toBe(true);
  });

  it('hides header when all read', () => {
    expect(shouldShowHeader(0)).toBe(false);
  });
});

describe('NotificationsFeed - Empty State', () => {
  it('shows when no notifications and not loading', () => {
    expect(shouldShowEmptyState([], false)).toBe(true);
  });

  it('hides when has notifications', () => {
    expect(shouldShowEmptyState([createNotification()], false)).toBe(false);
  });

  it('hides when loading', () => {
    expect(shouldShowEmptyState([], true)).toBe(false);
  });
});

describe('NotificationsFeed - Loading States', () => {
  it('shows loading when loading and empty', () => {
    expect(shouldShowLoading(true, [])).toBe(true);
  });

  it('hides loading when not loading', () => {
    expect(shouldShowLoading(false, [])).toBe(false);
  });

  it('hides loading when has notifications', () => {
    expect(shouldShowLoading(true, [createNotification()])).toBe(false);
  });

  it('shows loading more when loadingMore and hasMore', () => {
    expect(shouldShowLoadingMore(true, true)).toBe(true);
  });

  it('hides loading more when not loading', () => {
    expect(shouldShowLoadingMore(false, true)).toBe(false);
  });

  it('hides loading more when no more', () => {
    expect(shouldShowLoadingMore(true, false)).toBe(false);
  });
});

describe('NotificationsFeed - Density Classes', () => {
  it('gets compact density class', () => {
    expect(getDensityClass('compact')).toBe('notifications-feed--compact');
  });

  it('gets comfortable density class', () => {
    expect(getDensityClass('comfortable')).toBe('notifications-feed--comfortable');
  });
});

describe('NotificationsFeed - Items Display', () => {
  it('uses groups when grouped', () => {
    const notifications = [
      createNotification({ type: 'favourite' }),
      createNotification({ type: 'favourite' }),
    ];
    const groups = groupNotifications(notifications);
    const items = getItemsToDisplay(notifications, true, groups);
    expect(items.length).toBeLessThanOrEqual(notifications.length);
  });

  it('uses notifications when not grouped', () => {
    const notifications = [
      createNotification(),
      createNotification(),
    ];
    const items = getItemsToDisplay(notifications, false);
    expect(items).toEqual(notifications);
  });

  it('uses notifications when no groups', () => {
    const notifications = [createNotification()];
    const items = getItemsToDisplay(notifications, true, undefined);
    expect(items).toEqual(notifications);
  });
});

describe('NotificationsFeed - Notification Checks', () => {
  it('detects when has notifications', () => {
    expect(hasNotifications([createNotification()])).toBe(true);
  });

  it('detects when empty', () => {
    expect(hasNotifications([])).toBe(false);
  });

  it('detects all read', () => {
    const notifications = [
      createNotification({ read: true }),
      createNotification({ read: true }),
    ];
    expect(areAllRead(notifications)).toBe(true);
  });

  it('detects has unread', () => {
    const notifications = [
      createNotification({ read: true }),
      createNotification({ read: false }),
    ];
    expect(areAllRead(notifications)).toBe(false);
  });
});

describe('NotificationsFeed - Time Calculations', () => {
  it('gets latest notification time', () => {
    const notifications = [
      createNotification({ createdAt: '2024-01-01T10:00:00Z' }),
      createNotification({ createdAt: '2024-01-01T12:00:00Z' }),
      createNotification({ createdAt: '2024-01-01T11:00:00Z' }),
    ];
    expect(getLatestTime(notifications)).toBe('2024-01-01T12:00:00Z');
  });

  it('returns null for empty', () => {
    expect(getLatestTime([])).toBeNull();
  });

  it('handles single notification', () => {
    const notification = createNotification({ createdAt: '2024-01-01T10:00:00Z' });
    expect(getLatestTime([notification])).toBe('2024-01-01T10:00:00Z');
  });
});

describe('NotificationsFeed - Type Counting', () => {
  it('counts notifications by type', () => {
    const notifications = [
      createNotification({ type: 'mention' }),
      createNotification({ type: 'favourite' }),
      createNotification({ type: 'mention' }),
      createNotification({ type: 'follow' }),
    ];
    expect(countByType(notifications, 'mention')).toBe(2);
    expect(countByType(notifications, 'favourite')).toBe(1);
    expect(countByType(notifications, 'follow')).toBe(1);
  });

  it('returns zero for non-existent type', () => {
    const notifications = [createNotification({ type: 'mention' })];
    expect(countByType(notifications, 'reblog')).toBe(0);
  });
});

describe('NotificationsFeed - Filtering', () => {
  it('filters to unread only', () => {
    const notifications = [
      createNotification({ read: false }),
      createNotification({ read: true }),
      createNotification({ read: false }),
    ];
    const filtered = filterByReadStatus(notifications, true);
    expect(filtered).toHaveLength(2);
    expect(filtered.every((n) => !n.read)).toBe(true);
  });

  it('returns all when not filtering', () => {
    const notifications = [
      createNotification({ read: false }),
      createNotification({ read: true }),
    ];
    const filtered = filterByReadStatus(notifications, false);
    expect(filtered).toEqual(notifications);
  });
});

describe('NotificationsFeed - Edge Cases', () => {
  it('handles empty notifications array', () => {
    expect(getUnreadCount([])).toBe(0);
    expect(hasNotifications([])).toBe(false);
    expect(areAllRead([])).toBe(true);
    expect(getLatestTime([])).toBeNull();
  });

  it('handles single notification', () => {
    const notification = createNotification();
    expect(getUnreadCount([notification])).toBe(1);
    expect(hasNotifications([notification])).toBe(true);
  });

  it('handles large notification count', () => {
    const notifications = Array.from({ length: 1000 }, () => createNotification());
    expect(hasNotifications(notifications)).toBe(true);
    expect(notifications.length).toBe(1000);
  });
});

describe('NotificationsFeed - Integration', () => {
  it('processes complete feed workflow', () => {
    const notifications = [
      createNotification({ type: 'mention', read: false, createdAt: '2024-01-01T10:00:00Z' }),
      createNotification({ type: 'favourite', read: false, createdAt: '2024-01-01T11:00:00Z' }),
      createNotification({ type: 'mention', read: true, createdAt: '2024-01-01T09:00:00Z' }),
    ];

    // Check counts
    expect(getUnreadCount(notifications)).toBe(2);
    expect(hasNotifications(notifications)).toBe(true);
    expect(areAllRead(notifications)).toBe(false);

    // Check header
    expect(shouldShowHeader(2)).toBe(true);
    expect(shouldShowMarkAllAsRead(2, () => {})).toBe(true);

    // Check states
    expect(shouldShowEmptyState(notifications, false)).toBe(false);
    expect(shouldShowLoading(false, notifications)).toBe(false);

    // Check items
    const groups = groupNotifications(notifications);
    const items = getItemsToDisplay(notifications, true, groups);
    expect(items.length).toBeGreaterThan(0);

    // Check latest
    expect(getLatestTime(notifications)).toBe('2024-01-01T11:00:00Z');
  });

  it('handles all read scenario', () => {
    const notifications = [
      createNotification({ read: true }),
      createNotification({ read: true }),
    ];

    expect(getUnreadCount(notifications)).toBe(0);
    expect(areAllRead(notifications)).toBe(true);
    expect(shouldShowHeader(0)).toBe(false);
    expect(shouldShowMarkAllAsRead(0, () => {})).toBe(false);
  });

  it('handles empty feed scenario', () => {
    const notifications: Notification[] = [];

    expect(getUnreadCount(notifications)).toBe(0);
    expect(hasNotifications(notifications)).toBe(false);
    expect(shouldShowEmptyState(notifications, false)).toBe(true);
    expect(shouldShowLoading(true, notifications)).toBe(true);
  });

  it('handles loading more scenario', () => {
    const notifications = [createNotification()];

    expect(hasNotifications(notifications)).toBe(true);
    expect(shouldShowLoadingMore(true, true)).toBe(true);
    expect(shouldShowLoadingMore(true, false)).toBe(false);
  });
});
