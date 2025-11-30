/**
 * NotificationItem Logic Tests
 *
 * Tests the pure logic functions used by NotificationItem component
 */

import { describe, it, expect } from 'vitest';
import type { Notification, NotificationGroup, NotificationType, Account } from '../src/types';
import {
	getNotificationIcon,
	getNotificationColor,
	formatNotificationTime,
	shouldHighlightNotification,
	getGroupTitle,
} from '../src/utils/notificationGrouping';

// Helper to create mock notification
function createNotification(overrides: Partial<Notification> = {}): Notification {
	return {
		id: '1',
		type: 'mention',
		createdAt: '2024-01-01T12:00:00Z',
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

// Get display title for notification
function getDisplayTitle(notification: Notification, group?: NotificationGroup): string {
	if (group) {
		return getGroupTitle(group);
	}

	switch (notification.type) {
		case 'mention':
			return `${notification.account.displayName} mentioned you`;
		case 'reblog':
			return `${notification.account.displayName} boosted your post`;
		case 'favourite':
			return `${notification.account.displayName} favorited your post`;
		case 'follow':
			return `${notification.account.displayName} followed you`;
		case 'follow_request':
			return `${notification.account.displayName} requested to follow you`;
		case 'poll':
			return `${notification.account.displayName} voted in your poll`;
		case 'status':
			return `${notification.account.displayName} posted`;
		case 'update':
			return `${notification.account.displayName} edited a post`;
		case 'admin.sign_up':
			return 'New user registration';
		case 'admin.report':
			return 'New report submitted';
		default:
			return 'Notification';
	}
}

// Check if notification is unread
function isUnread(notification: Notification): boolean {
	return !notification.read;
}

type NotificationHandlers = {
	onMarkAsRead?: (notificationId: string) => void;
	onDismiss?: (notificationId: string) => void;
};

// Check if should show actions
function shouldShowActions(showActions: boolean, handlers: NotificationHandlers): boolean {
	return showActions && (handlers.onMarkAsRead !== undefined || handlers.onDismiss !== undefined);
}

// Check if should show mark as read button
function shouldShowMarkAsRead(
	notification: Notification,
	onMarkAsRead?: (notificationId: string) => void
): boolean {
	return !notification.read && onMarkAsRead !== undefined;
}

// Check if should show dismiss button
function shouldShowDismiss(onDismiss?: (notificationId: string) => void): boolean {
	return onDismiss !== undefined;
}

// Get density class
function getDensityClass(density: 'compact' | 'comfortable'): string {
	return `notification-item--${density}`;
}

// Get avatars for display
function getAvatars(notification: Notification, group?: NotificationGroup): Account[] {
	if (group) {
		return group.accounts.slice(0, 4);
	}
	return [notification.account];
}

// Check if has status
function hasStatus(notification: Notification): boolean {
	return 'status' in notification && !!notification.status;
}

// Strip HTML tags
function stripHTMLTags(html: string): string {
	return html.replace(/<[^>]*>/g, '');
}

// Truncate content
function truncateContent(content: string, maxLength: number = 100): string {
	if (content.length <= maxLength) return content;
	return content.slice(0, maxLength) + '...';
}

// Check if should show overflow indicator
function shouldShowOverflowIndicator(accountsCount: number, maxAvatars: number = 4): boolean {
	return accountsCount > maxAvatars;
}

// Get overflow count
function getOverflowCount(accountsCount: number, maxAvatars: number = 4): number {
	return Math.max(0, accountsCount - maxAvatars);
}

describe('NotificationItem - Display Title', () => {
	it('generates title for mention', () => {
		const notification = createNotification({ type: 'mention' });
		expect(getDisplayTitle(notification)).toBe('Test User mentioned you');
	});

	it('generates title for reblog', () => {
		const notification = createNotification({ type: 'reblog' });
		expect(getDisplayTitle(notification)).toBe('Test User boosted your post');
	});

	it('generates title for favourite', () => {
		const notification = createNotification({ type: 'favourite' });
		expect(getDisplayTitle(notification)).toBe('Test User favorited your post');
	});

	it('generates title for follow', () => {
		const notification = createNotification({ type: 'follow' });
		expect(getDisplayTitle(notification)).toBe('Test User followed you');
	});

	it('generates title for follow_request', () => {
		const notification = createNotification({ type: 'follow_request' });
		expect(getDisplayTitle(notification)).toBe('Test User requested to follow you');
	});

	it('generates title for poll', () => {
		const notification = createNotification({ type: 'poll' });
		expect(getDisplayTitle(notification)).toBe('Test User voted in your poll');
	});

	it('generates title for status', () => {
		const notification = createNotification({ type: 'status' });
		expect(getDisplayTitle(notification)).toBe('Test User posted');
	});

	it('generates title for update', () => {
		const notification = createNotification({ type: 'update' });
		expect(getDisplayTitle(notification)).toBe('Test User edited a post');
	});

	it('generates title for admin.sign_up', () => {
		const notification = createNotification({ type: 'admin.sign_up' as NotificationType });
		expect(getDisplayTitle(notification)).toBe('New user registration');
	});

	it('generates title for admin.report', () => {
		const notification = createNotification({ type: 'admin.report' as NotificationType });
		expect(getDisplayTitle(notification)).toBe('New report submitted');
	});
});

describe('NotificationItem - Read Status', () => {
	it('detects unread notifications', () => {
		const notification = createNotification({ read: false });
		expect(isUnread(notification)).toBe(true);
	});

	it('detects read notifications', () => {
		const notification = createNotification({ read: true });
		expect(isUnread(notification)).toBe(false);
	});
});

describe('NotificationItem - Action Buttons', () => {
	it('shows actions when showActions is true and handlers exist', () => {
		expect(shouldShowActions(true, { onMarkAsRead: (_id) => {} })).toBe(true);
		expect(shouldShowActions(true, { onDismiss: () => {} })).toBe(true);
	});

	it('hides actions when showActions is false', () => {
		expect(shouldShowActions(false, { onMarkAsRead: (_id) => {} })).toBe(false);
	});

	it('hides actions when no handlers', () => {
		expect(shouldShowActions(true, {})).toBe(false);
	});

	it('shows mark as read for unread notifications', () => {
		const unread = createNotification({ read: false });
		expect(shouldShowMarkAsRead(unread, (_id) => {})).toBe(true);
	});

	it('hides mark as read for read notifications', () => {
		const read = createNotification({ read: true });
		expect(shouldShowMarkAsRead(read, (_id) => {})).toBe(false);
	});

	it('hides mark as read when no handler', () => {
		const unread = createNotification({ read: false });
		expect(shouldShowMarkAsRead(unread, undefined)).toBe(false);
	});

	it('shows dismiss when handler exists', () => {
		expect(shouldShowDismiss((_id) => {})).toBe(true);
	});

	it('hides dismiss when no handler', () => {
		expect(shouldShowDismiss(undefined)).toBe(false);
	});
});

describe('NotificationItem - Density', () => {
	it('gets compact density class', () => {
		expect(getDensityClass('compact')).toBe('notification-item--compact');
	});

	it('gets comfortable density class', () => {
		expect(getDensityClass('comfortable')).toBe('notification-item--comfortable');
	});
});

describe('NotificationItem - Avatars', () => {
	it('gets single avatar for individual notification', () => {
		const notification = createNotification();
		const avatars = getAvatars(notification);
		expect(avatars).toHaveLength(1);
		expect(avatars[0].id).toBe('acc1');
	});

	it('gets multiple avatars from group', () => {
		const notification = createNotification();
		const group: NotificationGroup = {
			id: 'group1',
			type: 'favourite',
			notifications: [notification],
			accounts: [
				notification.account,
				{ id: 'acc2', username: 'user2', displayName: 'User 2', avatar: '', acct: '', url: '' },
				{ id: 'acc3', username: 'user3', displayName: 'User 3', avatar: '', acct: '', url: '' },
			],
			sampleNotification: notification,
			count: 3,
			latestCreatedAt: notification.createdAt,
			allRead: false,
		};
		const avatars = getAvatars(notification, group);
		expect(avatars).toHaveLength(3);
	});

	it('limits avatars to 4', () => {
		const notification = createNotification();
		const group: NotificationGroup = {
			id: 'group1',
			type: 'favourite',
			notifications: [notification],
			accounts: Array.from({ length: 10 }, (_, i) => ({
				id: `acc${i}`,
				username: `user${i}`,
				displayName: `User ${i}`,
				avatar: '',
				acct: '',
				url: '',
			})),
			sampleNotification: notification,
			count: 10,
			latestCreatedAt: notification.createdAt,
			allRead: false,
		};
		const avatars = getAvatars(notification, group);
		expect(avatars).toHaveLength(4);
	});
});

describe('NotificationItem - Status Detection', () => {
	it('detects notifications with status', () => {
		const notification = createNotification({
			status: {
				id: 'status1',
				content: 'Test post',
				createdAt: '2024-01-01T12:00:00Z',
				account: {} as any,
			} as any,
		});
		expect(hasStatus(notification)).toBe(true);
	});

	it('detects notifications without status', () => {
		const notification = createNotification();
		expect(hasStatus(notification)).toBe(false);
	});
});

describe('NotificationItem - Content Processing', () => {
	it('strips HTML tags', () => {
		expect(stripHTMLTags('<p>Hello <strong>world</strong></p>')).toBe('Hello world');
		expect(stripHTMLTags('<a href="#">Link</a>')).toBe('Link');
	});

	it('handles content without tags', () => {
		expect(stripHTMLTags('Plain text')).toBe('Plain text');
	});

	it('truncates long content', () => {
		const long = 'A'.repeat(150);
		const truncated = truncateContent(long, 100);
		expect(truncated).toHaveLength(103); // 100 + '...'
		expect(truncated).toContain('...');
	});

	it('does not truncate short content', () => {
		const short = 'Short text';
		expect(truncateContent(short, 100)).toBe('Short text');
	});
});

describe('NotificationItem - Overflow Indicator', () => {
	it('shows overflow indicator when more than max avatars', () => {
		expect(shouldShowOverflowIndicator(6, 4)).toBe(true);
	});

	it('hides overflow indicator when at or below max', () => {
		expect(shouldShowOverflowIndicator(4, 4)).toBe(false);
		expect(shouldShowOverflowIndicator(3, 4)).toBe(false);
	});

	it('calculates overflow count', () => {
		expect(getOverflowCount(6, 4)).toBe(2);
		expect(getOverflowCount(10, 4)).toBe(6);
	});

	it('returns zero for no overflow', () => {
		expect(getOverflowCount(4, 4)).toBe(0);
		expect(getOverflowCount(2, 4)).toBe(0);
	});
});

describe('NotificationItem - Icon and Color', () => {
	it('gets correct icons for notification types', () => {
		expect(getNotificationIcon('mention')).toBeTruthy();
		expect(getNotificationIcon('follow')).toBeTruthy();
		expect(getNotificationIcon('favourite')).toBeTruthy();
		expect(getNotificationIcon('reblog')).toBeTruthy();
	});

	it('gets correct colors for notification types', () => {
		expect(getNotificationColor('mention')).toBeTruthy();
		expect(getNotificationColor('follow')).toBeTruthy();
		expect(getNotificationColor('favourite')).toBeTruthy();
		expect(getNotificationColor('reblog')).toBeTruthy();
	});
});

describe('NotificationItem - Time Formatting', () => {
	it('formats notification time', () => {
		const time = formatNotificationTime('2024-01-01T12:00:00Z');
		expect(time).toBeTruthy();
		expect(typeof time).toBe('string');
	});
});

describe('NotificationItem - Highlighting', () => {
	it('determines if notification should be highlighted', () => {
		const notification = createNotification();
		const result = shouldHighlightNotification(notification);
		expect(typeof result).toBe('boolean');
	});
});

describe('NotificationItem - Edge Cases', () => {
	it('handles notification without display name', () => {
		const notification = createNotification({
			account: {
				id: 'acc1',
				username: 'testuser',
				displayName: '',
				avatar: '',
				acct: 'testuser@example.com',
				url: '',
			},
		});
		const title = getDisplayTitle(notification);
		expect(title).toBeTruthy();
	});

	it('handles very long content', () => {
		const longContent = 'A'.repeat(1000);
		const truncated = truncateContent(longContent, 100);
		expect(truncated.length).toBeLessThanOrEqual(103);
	});

	it('handles empty HTML', () => {
		expect(stripHTMLTags('')).toBe('');
	});

	it('handles nested HTML tags', () => {
		expect(stripHTMLTags('<div><p><span>Text</span></p></div>')).toBe('Text');
	});
});

describe('NotificationItem - Integration', () => {
	it('processes complete notification workflow', () => {
		const notification = createNotification({
			type: 'mention',
			read: false,
			status: {
				id: 'status1',
				content: '<p>Hello <strong>world</strong>!</p>',
				createdAt: '2024-01-01T12:00:00Z',
				account: {} as any,
			} as any,
		});

		// Check basic properties
		expect(isUnread(notification)).toBe(true);
		expect(hasStatus(notification)).toBe(true);

		// Check title
		const title = getDisplayTitle(notification);
		expect(title).toContain('mentioned you');

		// Check icon and color
		const icon = getNotificationIcon(notification.type);
		const color = getNotificationColor(notification.type);
		expect(icon).toBeTruthy();
		expect(color).toBeTruthy();

		// Process status content
		const content = (notification as any).status.content;
		const stripped = stripHTMLTags(content);
		expect(stripped).toBe('Hello world!');

		// Check actions
		expect(shouldShowActions(true, { onMarkAsRead: (_id) => {} })).toBe(true);
		expect(shouldShowMarkAsRead(notification, (_id) => {})).toBe(true);
	});

	it('processes grouped notification workflow', () => {
		const notification = createNotification({ type: 'favourite', read: true });
		const group: NotificationGroup = {
			id: 'group1',
			type: 'favourite',
			notifications: [notification],
			accounts: Array.from({ length: 6 }, (_, i) => ({
				id: `acc${i}`,
				username: `user${i}`,
				displayName: `User ${i}`,
				avatar: '',
				acct: '',
				url: '',
			})),
			sampleNotification: notification,
			count: 6,
			latestCreatedAt: notification.createdAt,
			allRead: true,
		};

		// Check group title
		const title = getGroupTitle(group);
		expect(title).toBeTruthy();

		// Check avatars
		const avatars = getAvatars(notification, group);
		expect(avatars).toHaveLength(4); // Max 4

		// Check overflow
		expect(shouldShowOverflowIndicator(group.accounts.length, 4)).toBe(true);
		expect(getOverflowCount(group.accounts.length, 4)).toBe(2);

		// Check read status
		expect(isUnread(notification)).toBe(false);
		expect(shouldShowMarkAsRead(notification, (_id) => {})).toBe(false);
	});
});
