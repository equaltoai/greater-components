/**
 * Notification Grouping Utilities Tests
 *
 * Tests for notification grouping, formatting, and helper functions.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	groupNotifications,
	getGroupTitle,
	getNotificationIcon,
	getNotificationColor,
	formatNotificationTime,
	shouldHighlightNotification,
} from '../src/utils/notificationGrouping';
import type { Notification, Account, Status, NotificationGroup } from '../src/types';

// Factory functions for test data
const makeAccount = (id: string, overrides: Partial<Account> = {}): Account => ({
	id,
	username: `user${id}`,
	acct: `user${id}@example.social`,
	displayName: `User ${id}`,
	avatar: `https://example.social/avatars/${id}.png`,
	url: `https://example.social/@user${id}`,
	createdAt: '2024-01-01T00:00:00Z',
	...overrides,
});

const makeStatus = (id: string, account: Account): Status => ({
	id,
	uri: `https://example.social/@${account.username}/${id}`,
	url: `https://example.social/@${account.username}/${id}`,
	account,
	content: `<p>Test status ${id}</p>`,
	createdAt: '2024-01-15T12:00:00Z',
	visibility: 'public',
	repliesCount: 0,
	reblogsCount: 0,
	favouritesCount: 0,
});

const makeNotification = (
	type: Notification['type'],
	id: string,
	account: Account,
	createdAt: string = '2024-01-15T12:00:00Z',
	overrides: Partial<Notification> = {}
): Notification => {
	const base = {
		id,
		type,
		createdAt,
		account,
		read: false,
	};

	// Add status for notification types that require it
	if (
		type === 'mention' ||
		type === 'reblog' ||
		type === 'favourite' ||
		type === 'poll' ||
		type === 'status' ||
		type === 'update'
	) {
		return {
			...base,
			status: makeStatus(`status-${id}`, account),
			...overrides,
		} as Notification;
	}

	return {
		...base,
		...overrides,
	} as Notification;
};

describe('Notification Grouping Utilities', () => {
	describe('groupNotifications', () => {
		it('should return empty array for empty input', () => {
			const result = groupNotifications([]);
			expect(result).toEqual([]);
		});

		it('should create single group for single notification', () => {
			const account = makeAccount('1');
			const notification = makeNotification('follow', 'n1', account);

			const result = groupNotifications([notification]);

			expect(result).toHaveLength(1);
			expect(result[0].type).toBe('follow');
			expect(result[0].count).toBe(1);
			expect(result[0].accounts).toHaveLength(1);
		});

		it('should group multiple follow notifications together', () => {
			const account1 = makeAccount('1');
			const account2 = makeAccount('2');
			const account3 = makeAccount('3');

			const notifications = [
				makeNotification('follow', 'n1', account1, '2024-01-15T12:00:00Z'),
				makeNotification('follow', 'n2', account2, '2024-01-15T12:01:00Z'),
				makeNotification('follow', 'n3', account3, '2024-01-15T12:02:00Z'),
			];

			const result = groupNotifications(notifications);

			expect(result).toHaveLength(1);
			expect(result[0].type).toBe('follow');
			expect(result[0].count).toBe(3);
			expect(result[0].accounts).toHaveLength(3);
		});

		it('should group favourites on the same status', () => {
			const account1 = makeAccount('1');
			const account2 = makeAccount('2');
			const sharedStatus = makeStatus('shared-status', makeAccount('author'));

			const notifications = [
				{
					id: 'n1',
					type: 'favourite' as const,
					createdAt: '2024-01-15T12:00:00Z',
					account: account1,
					status: sharedStatus,
					read: false,
				},
				{
					id: 'n2',
					type: 'favourite' as const,
					createdAt: '2024-01-15T12:05:00Z',
					account: account2,
					status: sharedStatus,
					read: false,
				},
			];

			const result = groupNotifications(notifications);

			expect(result).toHaveLength(1);
			expect(result[0].type).toBe('favourite');
			expect(result[0].count).toBe(2);
		});

		it('should group reblogs on the same status', () => {
			const account1 = makeAccount('1');
			const account2 = makeAccount('2');
			const sharedStatus = makeStatus('shared-status', makeAccount('author'));

			const notifications = [
				{
					id: 'n1',
					type: 'reblog' as const,
					createdAt: '2024-01-15T12:00:00Z',
					account: account1,
					status: sharedStatus,
					read: false,
				},
				{
					id: 'n2',
					type: 'reblog' as const,
					createdAt: '2024-01-15T12:05:00Z',
					account: account2,
					status: sharedStatus,
					read: false,
				},
			];

			const result = groupNotifications(notifications);

			expect(result).toHaveLength(1);
			expect(result[0].type).toBe('reblog');
			expect(result[0].count).toBe(2);
		});

		it('should NOT group status and update notifications', () => {
			const account = makeAccount('1');
			const notifications = [
				makeNotification('status', 'n1', account, '2024-01-15T12:00:00Z'),
				makeNotification('status', 'n2', account, '2024-01-15T12:05:00Z'),
			];

			const result = groupNotifications(notifications);

			expect(result).toHaveLength(2);
		});

		it('should sort groups by latest activity', () => {
			const account1 = makeAccount('1');
			const account2 = makeAccount('2');

			const notifications = [
				makeNotification('follow', 'n1', account1, '2024-01-15T10:00:00Z'),
				makeNotification('follow_request', 'n2', account2, '2024-01-15T15:00:00Z'),
			];

			const result = groupNotifications(notifications);

			expect(result).toHaveLength(2);
			expect(result[0].type).toBe('follow_request');
			expect(result[1].type).toBe('follow');
		});

		it('should update allRead status correctly', () => {
			const account1 = makeAccount('1');
			const account2 = makeAccount('2');

			const notifications = [
				makeNotification('follow', 'n1', account1, '2024-01-15T12:00:00Z', { read: true }),
				makeNotification('follow', 'n2', account2, '2024-01-15T12:05:00Z', { read: false }),
			];

			const result = groupNotifications(notifications);

			expect(result).toHaveLength(1);
			expect(result[0].allRead).toBe(false);
		});

		it('should mark group as allRead when all notifications are read', () => {
			const account1 = makeAccount('1');
			const account2 = makeAccount('2');

			const notifications = [
				makeNotification('follow', 'n1', account1, '2024-01-15T12:00:00Z', { read: true }),
				makeNotification('follow', 'n2', account2, '2024-01-15T12:05:00Z', { read: true }),
			];

			const result = groupNotifications(notifications);

			expect(result).toHaveLength(1);
			expect(result[0].allRead).toBe(true);
		});

		it('should avoid duplicate accounts in group', () => {
			const account = makeAccount('1');
			const sharedStatus = makeStatus('shared-status', makeAccount('author'));

			// Same account liking multiple times (edge case)
			const notifications = [
				{
					id: 'n1',
					type: 'favourite' as const,
					createdAt: '2024-01-15T12:00:00Z',
					account,
					status: sharedStatus,
					read: false,
				},
				{
					id: 'n2',
					type: 'favourite' as const,
					createdAt: '2024-01-15T12:05:00Z',
					account, // Same account
					status: sharedStatus,
					read: false,
				},
			];

			const result = groupNotifications(notifications);

			expect(result).toHaveLength(1);
			expect(result[0].accounts).toHaveLength(1);
			expect(result[0].count).toBe(2);
		});

		it('should group admin notifications', () => {
			const account1 = makeAccount('1');
			const account2 = makeAccount('2');

			const notifications = [
				{
					id: 'n1',
					type: 'admin.sign_up' as const,
					createdAt: '2024-01-15T12:00:00Z',
					account: account1,
					read: false,
				},
				{
					id: 'n2',
					type: 'admin.sign_up' as const,
					createdAt: '2024-01-15T12:05:00Z',
					account: account2,
					read: false,
				},
			];

			const result = groupNotifications(notifications);

			expect(result).toHaveLength(1);
			expect(result[0].type).toBe('admin.sign_up');
			expect(result[0].count).toBe(2);
		});
	});

	describe('getGroupTitle', () => {
		const makeGroup = (
			type: Notification['type'],
			count: number,
			accountCount: number = count
		): NotificationGroup => {
			const accounts = Array.from({ length: accountCount }, (_, i) =>
				makeAccount(String(i + 1), { displayName: `User ${i + 1}` })
			);

			const notifications = Array.from({ length: count }, (_, i) =>
				makeNotification(type, `n${i}`, accounts[i % accountCount] || accounts[0])
			);

			return {
				id: `group-${type}`,
				type,
				notifications,
				accounts,
				sampleNotification: notifications[0],
				count,
				latestCreatedAt: '2024-01-15T12:00:00Z',
				allRead: false,
			};
		};

		describe('single notification', () => {
			it('should return correct title for mention', () => {
				const group = makeGroup('mention', 1);
				expect(getGroupTitle(group)).toBe('User 1 mentioned you');
			});

			it('should return correct title for reblog', () => {
				const group = makeGroup('reblog', 1);
				expect(getGroupTitle(group)).toBe('User 1 boosted your post');
			});

			it('should return correct title for favourite', () => {
				const group = makeGroup('favourite', 1);
				expect(getGroupTitle(group)).toBe('User 1 favorited your post');
			});

			it('should return correct title for follow', () => {
				const group = makeGroup('follow', 1);
				expect(getGroupTitle(group)).toBe('User 1 followed you');
			});

			it('should return correct title for follow_request', () => {
				const group = makeGroup('follow_request', 1);
				expect(getGroupTitle(group)).toBe('User 1 requested to follow you');
			});

			it('should return correct title for poll', () => {
				const group = makeGroup('poll', 1);
				expect(getGroupTitle(group)).toBe('User 1 voted in your poll');
			});

			it('should return correct title for status', () => {
				const group = makeGroup('status', 1);
				expect(getGroupTitle(group)).toBe('User 1 posted');
			});

			it('should return correct title for update', () => {
				const group = makeGroup('update', 1);
				expect(getGroupTitle(group)).toBe('User 1 edited a post');
			});

			it('should return correct title for admin.sign_up', () => {
				const group = makeGroup('admin.sign_up', 1);
				expect(getGroupTitle(group)).toBe('New user registration');
			});

			it('should return correct title for admin.report', () => {
				const group = makeGroup('admin.report', 1);
				expect(getGroupTitle(group)).toBe('New report submitted');
			});
		});

		describe('two notifications', () => {
			it('should include both names for mention', () => {
				const group = makeGroup('mention', 2);
				expect(getGroupTitle(group)).toBe('User 1 and User 2 mentioned you');
			});

			it('should include both names for reblog', () => {
				const group = makeGroup('reblog', 2);
				expect(getGroupTitle(group)).toBe('User 1 and User 2 boosted your post');
			});

			it('should include both names for favourite', () => {
				const group = makeGroup('favourite', 2);
				expect(getGroupTitle(group)).toBe('User 1 and User 2 favorited your post');
			});

			it('should include both names for follow', () => {
				const group = makeGroup('follow', 2);
				expect(getGroupTitle(group)).toBe('User 1 and User 2 followed you');
			});
		});

		describe('3+ notifications', () => {
			it('should use "and X others" format for mention', () => {
				const group = makeGroup('mention', 5);
				expect(getGroupTitle(group)).toBe('User 1 and 4 others mentioned you');
			});

			it('should use "and X others" format for reblog', () => {
				const group = makeGroup('reblog', 3);
				expect(getGroupTitle(group)).toBe('User 1 and 2 others boosted your post');
			});

			it('should use correct format for admin.sign_up', () => {
				const group = makeGroup('admin.sign_up', 5);
				expect(getGroupTitle(group)).toBe('5 new user registrations');
			});

			it('should use correct format for admin.report', () => {
				const group = makeGroup('admin.report', 3);
				expect(getGroupTitle(group)).toBe('3 new reports');
			});
		});

		it('should handle group with no accounts', () => {
			const group: NotificationGroup = {
				id: 'empty-group',
				type: 'follow',
				notifications: [],
				accounts: [],
				sampleNotification: makeNotification('follow', 'n1', makeAccount('1')),
				count: 3,
				latestCreatedAt: '2024-01-15T12:00:00Z',
				allRead: false,
			};

			expect(getGroupTitle(group)).toBe('3 notifications');
		});
	});

	describe('getNotificationIcon', () => {
		it('should return correct icon for mention', () => {
			expect(getNotificationIcon('mention')).toBe('at-sign');
		});

		it('should return correct icon for reblog', () => {
			expect(getNotificationIcon('reblog')).toBe('repeat');
		});

		it('should return correct icon for favourite', () => {
			expect(getNotificationIcon('favourite')).toBe('heart');
		});

		it('should return correct icon for follow', () => {
			expect(getNotificationIcon('follow')).toBe('user-plus');
		});

		it('should return correct icon for follow_request', () => {
			expect(getNotificationIcon('follow_request')).toBe('user-clock');
		});

		it('should return correct icon for poll', () => {
			expect(getNotificationIcon('poll')).toBe('bar-chart');
		});

		it('should return correct icon for status', () => {
			expect(getNotificationIcon('status')).toBe('message-circle');
		});

		it('should return correct icon for update', () => {
			expect(getNotificationIcon('update')).toBe('edit');
		});

		it('should return correct icon for admin.sign_up', () => {
			expect(getNotificationIcon('admin.sign_up')).toBe('user-check');
		});

		it('should return correct icon for admin.report', () => {
			expect(getNotificationIcon('admin.report')).toBe('flag');
		});

		it('should return default icon for unknown type', () => {
			expect(getNotificationIcon('unknown' as any)).toBe('bell');
		});
	});

	describe('getNotificationColor', () => {
		it('should return primary color for mention', () => {
			expect(getNotificationColor('mention')).toBe('primary');
		});

		it('should return success color for reblog', () => {
			expect(getNotificationColor('reblog')).toBe('success');
		});

		it('should return accent color for favourite', () => {
			expect(getNotificationColor('favourite')).toBe('accent');
		});

		it('should return secondary color for follow', () => {
			expect(getNotificationColor('follow')).toBe('secondary');
		});

		it('should return secondary color for follow_request', () => {
			expect(getNotificationColor('follow_request')).toBe('secondary');
		});

		it('should return info color for poll', () => {
			expect(getNotificationColor('poll')).toBe('info');
		});

		it('should return warning color for admin types', () => {
			expect(getNotificationColor('admin.sign_up')).toBe('warning');
			expect(getNotificationColor('admin.report')).toBe('warning');
		});

		it('should return default color for unknown type', () => {
			expect(getNotificationColor('unknown' as any)).toBe('muted');
		});
	});

	describe('formatNotificationTime', () => {
		beforeEach(() => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it('should return "now" for less than 60 seconds', () => {
			const date = new Date('2024-01-15T11:59:30Z');
			expect(formatNotificationTime(date)).toBe('now');
		});

		it('should return minutes for less than an hour', () => {
			const date = new Date('2024-01-15T11:45:00Z');
			expect(formatNotificationTime(date)).toBe('15m');
		});

		it('should return hours for less than a day', () => {
			const date = new Date('2024-01-15T09:00:00Z');
			expect(formatNotificationTime(date)).toBe('3h');
		});

		it('should return days for less than a week', () => {
			const date = new Date('2024-01-13T12:00:00Z');
			expect(formatNotificationTime(date)).toBe('2d');
		});

		it('should return formatted date for older notifications', () => {
			const date = new Date('2024-01-01T12:00:00Z');
			const result = formatNotificationTime(date);
			expect(result).toContain('Jan');
		});

		it('should accept string date input', () => {
			const result = formatNotificationTime('2024-01-15T11:55:00Z');
			expect(result).toBe('5m');
		});

		it('should include year for different year', () => {
			const date = new Date('2023-06-15T12:00:00Z');
			const result = formatNotificationTime(date);
			expect(result).toContain('2023');
		});
	});

	describe('shouldHighlightNotification', () => {
		beforeEach(() => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it('should highlight unread notifications', () => {
			const account = makeAccount('1');
			const notification = makeNotification('follow', 'n1', account, '2024-01-10T12:00:00Z', {
				read: false,
			});

			expect(shouldHighlightNotification(notification)).toBe(true);
		});

		it('should highlight recent notifications even if read', () => {
			const account = makeAccount('1');
			const notification = makeNotification('follow', 'n1', account, '2024-01-15T11:30:00Z', {
				read: true,
			});

			expect(shouldHighlightNotification(notification)).toBe(true);
		});

		it('should not highlight old read notifications', () => {
			const account = makeAccount('1');
			const notification = makeNotification('follow', 'n1', account, '2024-01-10T12:00:00Z', {
				read: true,
			});

			expect(shouldHighlightNotification(notification)).toBe(false);
		});

		it('should highlight notifications at exactly one hour boundary', () => {
			const account = makeAccount('1');
			// Just under one hour ago
			const notification = makeNotification('follow', 'n1', account, '2024-01-15T11:00:01Z', {
				read: true,
			});

			expect(shouldHighlightNotification(notification)).toBe(true);
		});
	});
});
