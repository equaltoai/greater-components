/**
 * Utilities for grouping and processing notifications
 */

import type { Notification, NotificationGroup, NotificationType } from '../types';

/**
 * Group notifications by type and similar content
 */
export function groupNotifications(notifications: Notification[]): NotificationGroup[] {
	const groups = new Map<string, NotificationGroup>();

	for (const notification of notifications) {
		const groupKey = getGroupKey(notification);
		const existingGroup = groups.get(groupKey);

		if (existingGroup) {
			existingGroup.notifications.push(notification);
			existingGroup.count = existingGroup.notifications.length;

			// Update accounts list (avoid duplicates)
			const accountExists = existingGroup.accounts.some(
				(acc) => acc.id === notification.account.id
			);
			if (!accountExists) {
				existingGroup.accounts.push(notification.account);
			}

			// Update latest timestamp
			if (new Date(notification.createdAt) > new Date(existingGroup.latestCreatedAt)) {
				existingGroup.latestCreatedAt = notification.createdAt;
				existingGroup.sampleNotification = notification;
			}

			// Update read status
			existingGroup.allRead = existingGroup.allRead && (notification.read ?? false);
		} else {
			// Create new group
			const newGroup: NotificationGroup = {
				id: groupKey,
				type: notification.type,
				notifications: [notification],
				accounts: [notification.account],
				sampleNotification: notification,
				count: 1,
				latestCreatedAt: notification.createdAt,
				allRead: notification.read ?? false,
			};
			groups.set(groupKey, newGroup);
		}
	}

	// Sort groups by latest activity
	return Array.from(groups.values()).sort(
		(a, b) => new Date(b.latestCreatedAt).getTime() - new Date(a.latestCreatedAt).getTime()
	);
}

/**
 * Generate a group key for notifications that should be grouped together
 */
function getGroupKey(notification: Notification): string {
	switch (notification.type) {
		case 'reblog':
		case 'favourite':
			// Group by type and status ID
			return `${notification.type}-${('status' in notification && notification.status?.id) || 'unknown'}`;

		case 'mention':
			// Group mentions by status ID (replies to same post)
			return `${notification.type}-${('status' in notification && notification.status?.id) || notification.id}`;

		case 'follow':
		case 'follow_request':
			// Group follows by type only (all follows together)
			return `${notification.type}-group`;

		case 'poll':
			// Group by poll (status) ID
			return `${notification.type}-${('status' in notification && notification.status?.id) || 'unknown'}`;

		case 'status':
		case 'update':
			// Individual items for new posts and updates
			return `${notification.type}-${notification.id}`;

		case 'admin.sign_up':
		case 'admin.report':
			// Group admin notifications by type
			return `${notification.type}-group`;

		default:
			// Fallback: each notification is its own group
			return `${(notification as Notification).type}-${(notification as Notification).id}`;
	}
}

/**
 * Get a human-readable title for a notification group
 */
export function getGroupTitle(group: NotificationGroup): string {
	const { type, count, accounts } = group;
	const primaryAccount = accounts[0];

	if (!primaryAccount) {
		return `${count} notification${count !== 1 ? 's' : ''}`;
	}

	if (count === 1) {
		switch (type) {
			case 'mention':
				return `${primaryAccount.displayName} mentioned you`;
			case 'reblog':
				return `${primaryAccount.displayName} boosted your post`;
			case 'favourite':
				return `${primaryAccount.displayName} favorited your post`;
			case 'follow':
				return `${primaryAccount.displayName} followed you`;
			case 'follow_request':
				return `${primaryAccount.displayName} requested to follow you`;
			case 'poll':
				return `${primaryAccount.displayName} voted in your poll`;
			case 'status':
				return `${primaryAccount.displayName} posted`;
			case 'update':
				return `${primaryAccount.displayName} edited a post`;
			case 'admin.sign_up':
				return 'New user registration';
			case 'admin.report':
				return 'New report submitted';
			default:
				return 'Notification';
		}
	}

	// Multiple notifications
	if (count === 2) {
		const secondAccount = accounts[1];
		if (!secondAccount) {
			return `${primaryAccount.displayName} and 1 other`;
		}

		switch (type) {
			case 'mention':
				return `${primaryAccount.displayName} and ${secondAccount.displayName} mentioned you`;
			case 'reblog':
				return `${primaryAccount.displayName} and ${secondAccount.displayName} boosted your post`;
			case 'favourite':
				return `${primaryAccount.displayName} and ${secondAccount.displayName} favorited your post`;
			case 'follow':
				return `${primaryAccount.displayName} and ${secondAccount.displayName} followed you`;
			case 'follow_request':
				return `${primaryAccount.displayName} and ${secondAccount.displayName} requested to follow you`;
			case 'poll':
				return `${primaryAccount.displayName} and ${secondAccount.displayName} voted in your poll`;
			default:
				return `${count} notifications`;
		}
	}

	// 3+ notifications
	switch (type) {
		case 'mention':
			return `${primaryAccount.displayName} and ${count - 1} others mentioned you`;
		case 'reblog':
			return `${primaryAccount.displayName} and ${count - 1} others boosted your post`;
		case 'favourite':
			return `${primaryAccount.displayName} and ${count - 1} others favorited your post`;
		case 'follow':
			return `${primaryAccount.displayName} and ${count - 1} others followed you`;
		case 'follow_request':
			return `${primaryAccount.displayName} and ${count - 1} others requested to follow you`;
		case 'poll':
			return `${primaryAccount.displayName} and ${count - 1} others voted in your poll`;
		case 'admin.sign_up':
			return `${count} new user registrations`;
		case 'admin.report':
			return `${count} new reports`;
		default:
			return `${count} notifications`;
	}
}

/**
 * Get icon name for notification type
 */
export function getNotificationIcon(type: NotificationType): string {
	switch (type) {
		case 'mention':
			return 'at-sign';
		case 'reblog':
			return 'repeat';
		case 'favourite':
			return 'heart';
		case 'follow':
			return 'user-plus';
		case 'follow_request':
			return 'user-clock';
		case 'poll':
			return 'bar-chart';
		case 'status':
			return 'message-circle';
		case 'update':
			return 'edit';
		case 'admin.sign_up':
			return 'user-check';
		case 'admin.report':
			return 'flag';
		default:
			return 'bell';
	}
}

/**
 * Get color for notification type
 */
export function getNotificationColor(type: NotificationType): string {
	switch (type) {
		case 'mention':
			return 'var(--color-primary, #1d9bf0)';
		case 'reblog':
			return 'var(--color-success, #00ba7c)';
		case 'favourite':
			return 'var(--color-accent, #f91880)';
		case 'follow':
		case 'follow_request':
			return 'var(--color-secondary, #794bc4)';
		case 'poll':
			return 'var(--color-info, #0084ff)';
		case 'status':
		case 'update':
			return 'var(--color-primary, #1d9bf0)';
		case 'admin.sign_up':
		case 'admin.report':
			return 'var(--color-warning, #ffad1f)';
		default:
			return 'var(--color-text-secondary, #536471)';
	}
}

/**
 * Format relative time for notification
 */
export function formatNotificationTime(date: string | Date): string {
	const now = new Date();
	const notificationDate = new Date(date);
	const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

	if (diffInSeconds < 60) {
		return 'now';
	}

	if (diffInSeconds < 3600) {
		const minutes = Math.floor(diffInSeconds / 60);
		return `${minutes}m`;
	}

	if (diffInSeconds < 86400) {
		const hours = Math.floor(diffInSeconds / 3600);
		return `${hours}h`;
	}

	if (diffInSeconds < 604800) {
		const days = Math.floor(diffInSeconds / 86400);
		return `${days}d`;
	}

	// Format as date for older notifications
	return notificationDate.toLocaleDateString(undefined, {
		month: 'short',
		day: 'numeric',
		year: notificationDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
	});
}

/**
 * Check if a notification should be highlighted
 */
export function shouldHighlightNotification(notification: Notification): boolean {
	// Highlight unread notifications
	if (!notification.read) return true;

	// Highlight recent notifications (within last hour)
	const oneHourAgo = new Date(Date.now() - 3600000);
	return new Date(notification.createdAt) > oneHourAgo;
}
