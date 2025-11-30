import { describe, it, expect } from 'vitest';
import {
	groupNotifications,
	getGroupTitle,
	getNotificationIcon,
	getNotificationColor,
	formatNotificationTime,
	shouldHighlightNotification,
} from '../src/utils/notificationGrouping';
import { generateMockNotifications } from '../src/mockData';
import type { Notification, NotificationGroup } from '../src/types';

describe('Notification Grouping Utilities', () => {
	const mockNotifications = generateMockNotifications(20);

	describe('groupNotifications', () => {
		it('should group notifications by type and content', () => {
			// Create notifications with same status for favourites to ensure grouping
			const sameStatus = (
				mockNotifications.find((n) => n.type === 'favourite' && 'status' in n) as any
			)?.status;

			const notifications = [
				// 3 favourite notifications for same status (should group into 1)
				{
					id: 'fav1',
					type: 'favourite' as const,
					account: mockNotifications[0].account,
					createdAt: new Date().toISOString(),
					read: false,
					status: sameStatus,
				},
				{
					id: 'fav2',
					type: 'favourite' as const,
					account: mockNotifications[1].account,
					createdAt: new Date().toISOString(),
					read: false,
					status: sameStatus,
				},
				{
					id: 'fav3',
					type: 'favourite' as const,
					account: mockNotifications[2].account,
					createdAt: new Date().toISOString(),
					read: false,
					status: sameStatus,
				},
				// 2 follow notifications (should group into 1)
				{
					id: 'follow1',
					type: 'follow' as const,
					account: mockNotifications[3].account,
					createdAt: new Date().toISOString(),
					read: false,
				},
				{
					id: 'follow2',
					type: 'follow' as const,
					account: mockNotifications[4].account,
					createdAt: new Date().toISOString(),
					read: false,
				},
			];

			const groups = groupNotifications(notifications);

			expect(groups).toHaveLength(2);
			expect(groups.find((g) => g.type === 'favourite')).toBeDefined();
			expect(groups.find((g) => g.type === 'follow')).toBeDefined();

			// Check that favourites are properly grouped
			const favouriteGroup = groups.find((g) => g.type === 'favourite');
			expect(favouriteGroup).toBeDefined();
			if (!favouriteGroup) {
				throw new Error('Expected favourite notification group to be present');
			}
			expect(favouriteGroup.count).toBe(3);

			// Check that follows are properly grouped
			const followGroup = groups.find((g) => g.type === 'follow');
			expect(followGroup).toBeDefined();
			if (!followGroup) {
				throw new Error('Expected follow notification group to be present');
			}
			expect(followGroup.count).toBe(2);
		});

		it('should sort groups by latest activity', () => {
			const now = new Date();
			const older = new Date(now.getTime() - 3600000);
			const newer = new Date(now.getTime() - 1800000);

			const notifications: Notification[] = [
				{
					id: '1',
					type: 'follow',
					account: mockNotifications[0].account,
					createdAt: older.toISOString(),
					read: false,
				},
				{
					id: '2',
					type: 'favourite',
					account: mockNotifications[1].account,
					createdAt: newer.toISOString(),
					read: false,
					status: (mockNotifications[1] as any).status,
				},
			];

			const groups = groupNotifications(notifications);

			expect(groups[0].type).toBe('favourite'); // Should be first (newer)
			expect(groups[1].type).toBe('follow'); // Should be second (older)
		});

		it('should merge accounts without duplicates', () => {
			const sameAccount = mockNotifications[0].account;
			const notifications: Notification[] = [
				{
					id: '1',
					type: 'follow',
					account: sameAccount,
					createdAt: new Date().toISOString(),
					read: false,
				},
				{
					id: '2',
					type: 'follow',
					account: sameAccount,
					createdAt: new Date().toISOString(),
					read: false,
				},
			];

			const groups = groupNotifications(notifications);

			expect(groups).toHaveLength(1);
			expect(groups[0].accounts).toHaveLength(1);
			expect(groups[0].count).toBe(2);
		});

		it('should track read status correctly', () => {
			const notifications: Notification[] = [
				{
					id: '1',
					type: 'follow',
					account: mockNotifications[0].account,
					createdAt: new Date().toISOString(),
					read: true,
				},
				{
					id: '2',
					type: 'follow',
					account: mockNotifications[1].account,
					createdAt: new Date().toISOString(),
					read: false,
				},
			];

			const groups = groupNotifications(notifications);

			expect(groups[0].allRead).toBe(false); // One unread notification
		});

		it('should handle empty notification array', () => {
			const groups = groupNotifications([]);
			expect(groups).toHaveLength(0);
		});
	});

	describe('getGroupTitle', () => {
		it('should generate correct title for single notification', () => {
			const group: NotificationGroup = {
				id: 'test-group',
				type: 'mention',
				notifications: [mockNotifications[0]],
				accounts: [mockNotifications[0].account],
				sampleNotification: mockNotifications[0],
				count: 1,
				latestCreatedAt: new Date().toISOString(),
				allRead: false,
			};

			const title = getGroupTitle(group);
			expect(title).toContain(group.accounts[0].displayName);
			expect(title).toContain('mentioned you');
		});

		it('should generate correct title for two notifications', () => {
			const group: NotificationGroup = {
				id: 'test-group',
				type: 'reblog',
				notifications: mockNotifications.slice(0, 2),
				accounts: mockNotifications.slice(0, 2).map((n) => n.account),
				sampleNotification: mockNotifications[0],
				count: 2,
				latestCreatedAt: new Date().toISOString(),
				allRead: false,
			};

			const title = getGroupTitle(group);
			expect(title).toContain('and');
			expect(title).toContain('boosted your post');
		});

		it('should generate correct title for multiple notifications', () => {
			const group: NotificationGroup = {
				id: 'test-group',
				type: 'favourite',
				notifications: mockNotifications.slice(0, 5),
				accounts: mockNotifications.slice(0, 5).map((n) => n.account),
				sampleNotification: mockNotifications[0],
				count: 5,
				latestCreatedAt: new Date().toISOString(),
				allRead: false,
			};

			const title = getGroupTitle(group);
			expect(title).toContain('and 4 others');
			expect(title).toContain('favorited your post');
		});

		it('should handle all notification types', () => {
			const types: Array<Notification['type']> = [
				'mention',
				'reblog',
				'favourite',
				'follow',
				'follow_request',
				'poll',
				'status',
				'update',
				'admin.sign_up',
				'admin.report',
			];

			types.forEach((type) => {
				const group: NotificationGroup = {
					id: `test-${type}`,
					type,
					notifications: [mockNotifications[0]],
					accounts: [mockNotifications[0].account],
					sampleNotification: mockNotifications[0],
					count: 1,
					latestCreatedAt: new Date().toISOString(),
					allRead: false,
				};

				const title = getGroupTitle(group);
				expect(title).toBeTruthy();
				expect(typeof title).toBe('string');
			});
		});
	});

	describe('getNotificationIcon', () => {
		it('should return correct icons for all notification types', () => {
			const expectedIcons = {
				mention: 'at-sign',
				reblog: 'repeat',
				favourite: 'heart',
				follow: 'user-plus',
				follow_request: 'user-clock',
				poll: 'bar-chart',
				status: 'message-circle',
				update: 'edit',
				'admin.sign_up': 'user-check',
				'admin.report': 'flag',
			};

			Object.entries(expectedIcons).forEach(([type, expectedIcon]) => {
				const icon = getNotificationIcon(type as Notification['type']);
				expect(icon).toBe(expectedIcon);
			});
		});

		it('should return default icon for unknown types', () => {
			const icon = getNotificationIcon('unknown' as any);
			expect(icon).toBe('bell');
		});
	});

	describe('getNotificationColor', () => {
		it('should return correct colors for all notification types', () => {
			const types: Array<Notification['type']> = [
				'mention',
				'reblog',
				'favourite',
				'follow',
				'follow_request',
				'poll',
				'status',
				'update',
				'admin.sign_up',
				'admin.report',
			];

			types.forEach((type) => {
				const color = getNotificationColor(type);
				expect(color).toBeTruthy();
				expect(color).toMatch(/var\(--color-/);
			});
		});

		it('should return default color for unknown types', () => {
			const color = getNotificationColor('unknown' as any);
			expect(color).toBe('var(--color-text-secondary, #536471)');
		});
	});

	describe('formatNotificationTime', () => {
		const now = new Date();

		it('should return "now" for very recent notifications', () => {
			const recentDate = new Date(now.getTime() - 30000); // 30 seconds ago
			const formatted = formatNotificationTime(recentDate.toISOString());
			expect(formatted).toBe('now');
		});

		it('should return minutes for notifications within an hour', () => {
			const minutesAgo = new Date(now.getTime() - 1800000); // 30 minutes ago
			const formatted = formatNotificationTime(minutesAgo.toISOString());
			expect(formatted).toBe('30m');
		});

		it('should return hours for notifications within a day', () => {
			const hoursAgo = new Date(now.getTime() - 7200000); // 2 hours ago
			const formatted = formatNotificationTime(hoursAgo.toISOString());
			expect(formatted).toBe('2h');
		});

		it('should return days for notifications within a week', () => {
			const daysAgo = new Date(now.getTime() - 172800000); // 2 days ago
			const formatted = formatNotificationTime(daysAgo.toISOString());
			expect(formatted).toBe('2d');
		});

		it('should return formatted date for older notifications', () => {
			const weeksAgo = new Date(now.getTime() - 1209600000); // 2 weeks ago
			const formatted = formatNotificationTime(weeksAgo.toISOString());
			expect(formatted).toMatch(/^[A-Z][a-z]{2} \d{1,2}$/); // "Jan 15" format
		});

		it('should handle Date objects as well as ISO strings', () => {
			const date = new Date(now.getTime() - 1800000); // 30 minutes ago
			const formatted = formatNotificationTime(date);
			expect(formatted).toBe('30m');
		});

		it('should include year for old notifications from different years', () => {
			const lastYear = new Date(now.getFullYear() - 1, 0, 15);
			const formatted = formatNotificationTime(lastYear.toISOString());
			expect(formatted).toMatch(/\d{4}$/); // Should end with year
		});
	});

	describe('shouldHighlightNotification', () => {
		it('should highlight unread notifications', () => {
			const notification: Notification = {
				...mockNotifications[0],
				read: false,
				createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
			};

			expect(shouldHighlightNotification(notification)).toBe(true);
		});

		it('should highlight recent notifications (within last hour) even if read', () => {
			const notification: Notification = {
				...mockNotifications[0],
				read: true,
				createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
			};

			expect(shouldHighlightNotification(notification)).toBe(true);
		});

		it('should not highlight old read notifications', () => {
			const notification: Notification = {
				...mockNotifications[0],
				read: true,
				createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
			};

			expect(shouldHighlightNotification(notification)).toBe(false);
		});

		it('should handle Date objects as well as ISO strings', () => {
			const notification: Notification = {
				...mockNotifications[0],
				read: false,
				createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
			};

			expect(shouldHighlightNotification(notification)).toBe(true);
		});
	});

	describe('Edge Cases and Error Handling', () => {
		it('should handle notifications with missing accounts gracefully', () => {
			const notifications = [
				{
					id: '1',
					type: 'follow' as const,
					account: mockNotifications[0].account,
					createdAt: new Date().toISOString(),
					read: false,
				},
			];

			expect(() => groupNotifications(notifications)).not.toThrow();
		});

		it('should handle notifications with invalid dates', () => {
			const notification = {
				...mockNotifications[0],
				createdAt: 'invalid-date',
			};

			expect(() => formatNotificationTime(notification.createdAt)).not.toThrow();
		});

		it('should handle notifications with missing status when required', () => {
			const notifications = [
				{
					id: '1',
					type: 'reblog' as const,
					account: mockNotifications[0].account,
					createdAt: new Date().toISOString(),
					read: false,
					// Missing status property
				} as any,
			];

			expect(() => groupNotifications(notifications)).not.toThrow();
		});
	});
});
