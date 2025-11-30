import type { Notification, NotificationGroup, NotificationType, Status } from '../types.js';

type NotificationWithStatus = Extract<Notification, { status: Status }>;

function hasStatus(notification: Notification): notification is NotificationWithStatus {
	return 'status' in notification && Boolean((notification as NotificationWithStatus).status);
}

function getCreatedAt(notification: Notification): Date {
	const value =
		(notification as Notification & { created_at?: string | Date }).createdAt ??
		(notification as { created_at?: string | Date }).created_at ??
		new Date().toISOString();
	return new Date(value);
}

function getStatusId(notification: Notification): string | undefined {
	if (!hasStatus(notification)) {
		return undefined;
	}

	return notification.status?.id ?? undefined;
}

export function groupNotifications(notifications: Notification[]): NotificationGroup[] {
	const groups = new Map<string, NotificationGroup>();

	for (const notification of notifications) {
		const key = getGroupKey(notification);
		const timestamp = getCreatedAt(notification).toISOString();
		const existing = groups.get(key);

		if (existing) {
			existing.notifications.push(notification);
			existing.count = existing.notifications.length;

			const alreadyPresent = existing.accounts.some(
				(account) => account.id === notification.account.id
			);
			if (!alreadyPresent) {
				existing.accounts.push(notification.account);
			}

			if (new Date(timestamp) > new Date(existing.latestCreatedAt)) {
				existing.latestCreatedAt = timestamp;
				existing.sampleNotification = notification;
			}

			existing.allRead = existing.allRead && notification.read !== false;
			continue;
		}

		const newGroup: NotificationGroup = {
			id: key,
			type: notification.type,
			notifications: [notification],
			accounts: [notification.account],
			sampleNotification: notification,
			count: 1,
			latestCreatedAt: timestamp,
			allRead: notification.read ?? false,
		};

		groups.set(key, newGroup);
	}

	return Array.from(groups.values()).sort(
		(a, b) => new Date(b.latestCreatedAt).getTime() - new Date(a.latestCreatedAt).getTime()
	);
}

function getGroupKey(notification: Notification): string {
	const fallbackKey = `${notification.type}-${notification.id}`;

	switch (notification.type) {
		case 'reblog':
		case 'favourite':
			return `${notification.type}-${getStatusId(notification) ?? 'unknown'}`;
		case 'mention':
			return `${notification.type}-${
				getStatusId(notification) ?? (notification as Notification & { id: string }).id
			}`;
		case 'follow':
		case 'follow_request':
			return `${notification.type}-group`;
		case 'poll':
			return `${notification.type}-${getStatusId(notification) ?? 'unknown'}`;
		case 'status':
		case 'update':
			return `${notification.type}-${notification.id}`;
		case 'admin.sign_up':
		case 'admin.report':
			return `${notification.type}-group`;
		default:
			return fallbackKey;
	}
}

export function getGroupTitle(group: NotificationGroup): string {
	const { type, count, accounts } = group;
	const primary = accounts[0];

	if (!primary) {
		return `${count} notification${count === 1 ? '' : 's'}`;
	}

	if (count === 1) {
		switch (type) {
			case 'mention':
				return `${primary.displayName ?? primary.username} mentioned you`;
			case 'reblog':
				return `${primary.displayName ?? primary.username} boosted your post`;
			case 'favourite':
				return `${primary.displayName ?? primary.username} favorited your post`;
			case 'follow':
				return `${primary.displayName ?? primary.username} followed you`;
			case 'follow_request':
				return `${primary.displayName ?? primary.username} requested to follow you`;
			case 'poll':
				return `${primary.displayName ?? primary.username} voted in your poll`;
			case 'status':
				return `${primary.displayName ?? primary.username} posted`;
			case 'update':
				return `${primary.displayName ?? primary.username} edited a post`;
			case 'admin.sign_up':
				return 'New user registration';
			case 'admin.report':
				return 'New report submitted';
			default:
				return 'Notification';
		}
	}

	if (count === 2) {
		const second = accounts[1];
		if (!second) {
			return `${primary.displayName ?? primary.username} and 1 other`;
		}

		switch (type) {
			case 'mention':
				return `${primary.displayName ?? primary.username} and ${
					second.displayName ?? second.username
				} mentioned you`;
			case 'reblog':
				return `${primary.displayName ?? primary.username} and ${
					second.displayName ?? second.username
				} boosted your post`;
			case 'favourite':
				return `${primary.displayName ?? primary.username} and ${
					second.displayName ?? second.username
				} favorited your post`;
			case 'follow':
				return `${primary.displayName ?? primary.username} and ${
					second.displayName ?? second.username
				} followed you`;
			case 'follow_request':
				return `${primary.displayName ?? primary.username} and ${
					second.displayName ?? second.username
				} requested to follow you`;
			case 'poll':
				return `${primary.displayName ?? primary.username} and ${
					second.displayName ?? second.username
				} voted in your poll`;
			default:
				return `${count} notifications`;
		}
	}

	switch (type) {
		case 'mention':
			return `${primary.displayName ?? primary.username} and ${count - 1} others mentioned you`;
		case 'reblog':
			return `${primary.displayName ?? primary.username} and ${count - 1} others boosted your post`;
		case 'favourite':
			return `${primary.displayName ?? primary.username} and ${count - 1} others favorited your post`;
		case 'follow':
		case 'follow_request':
			return `${primary.displayName ?? primary.username} and ${count - 1} others ${
				type === 'follow' ? 'followed' : 'requested to follow'
			} you`;
		case 'poll':
			return `${primary.displayName ?? primary.username} and ${count - 1} others voted in your poll`;
		case 'admin.sign_up':
			return `${count} new user registrations`;
		case 'admin.report':
			return `${count} new reports`;
		default:
			return `${count} notifications`;
	}
}

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

export function formatNotificationTime(date: string | Date): string {
	const value = typeof date === 'string' ? new Date(date) : new Date(date);
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - value.getTime()) / 1000);

	if (diffInSeconds < 60) {
		return 'now';
	}

	if (diffInSeconds < 3600) {
		return `${Math.floor(diffInSeconds / 60)}m`;
	}

	if (diffInSeconds < 86400) {
		return `${Math.floor(diffInSeconds / 3600)}h`;
	}

	if (diffInSeconds < 604800) {
		return `${Math.floor(diffInSeconds / 86400)}d`;
	}

	return value.toLocaleDateString(undefined, {
		month: 'short',
		day: 'numeric',
		year: value.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
	});
}

export function shouldHighlightNotification(notification: Notification): boolean {
	const readState = notification.read;
	if (readState === false || readState === undefined) {
		return true;
	}

	const createdAt = getCreatedAt(notification);
	const oneHourAgo = new Date(Date.now() - 3600000);
	return createdAt > oneHourAgo;
}
