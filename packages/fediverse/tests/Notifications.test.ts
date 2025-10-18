/**
 * Notifications Compound Component Tests
 * 
 * Comprehensive tests for Notifications components including:
 * - Context creation and management
 * - Notification grouping
 * - Filter management
 * - State management (loading, unreadCount, activeFilter)
 * - Event handlers (onNotificationClick, onGroupClick, onMarkRead, onMarkAllRead, onDismiss, onLoadMore, onFilterChange)
 * - Configuration options
 * - Edge cases
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	createNotificationsContext,
	getNotificationsContext,
	hasNotificationsContext,
	type NotificationsConfig,
	type NotificationsHandlers,
	type NotificationsState,
	type NotificationDisplayMode,
	type NotificationFilter,
} from '../src/components/Notifications/context';
import type { Notification, NotificationGroup } from '../src/types';

// Mock Svelte context
const contexts = new Map();
vi.mock('svelte', () => ({
	getContext: (key: symbol) => contexts.get(key),
	setContext: (key: symbol, value: any) => contexts.set(key, value),
}));

// Helper to create mock notification
function createMockNotification(id: string, type: string = 'mention'): Notification {
	return {
		id,
		type,
		created_at: new Date().toISOString(),
		account: {
			id: `account-${id}`,
			username: `user${id}`,
			display_name: `User ${id}`,
			avatar: `https://example.com/avatar${id}.jpg`,
			url: `https://example.com/@user${id}`,
		},
		status: type === 'mention' || type === 'favourite' || type === 'reblog' ? {
			id: `status-${id}`,
			content: `Status content ${id}`,
			created_at: new Date().toISOString(),
		} : undefined,
	} as Notification;
}

// Helper to create mock notification group
function createMockNotificationGroup(id: string, type: string, count: number): NotificationGroup {
	const notifications = Array.from({ length: count }, (_, i) =>
		createMockNotification(`${id}-${i}`, type)
	);

	return {
		id,
		type,
		notifications,
		count,
		created_at: notifications[0].created_at,
	};
}

describe('Notifications Context', () => {
	beforeEach(() => {
		contexts.clear();
	});

	describe('createNotificationsContext', () => {
		it('should create context with default configuration', () => {
			const notifications: Notification[] = [
				createMockNotification('1'),
				createMockNotification('2'),
			];

			const context = createNotificationsContext(notifications, undefined);

			expect(context.notifications).toEqual(notifications);
			expect(context.groups).toBeUndefined();
			expect(context.config.mode).toBe('grouped');
			expect(context.config.enableGrouping).toBe(true);
			expect(context.config.showTimestamps).toBe(true);
			expect(context.config.showAvatars).toBe(true);
			expect(context.config.infiniteScroll).toBe(true);
			expect(context.config.realtime).toBe(false);
			expect(context.config.filter).toBe('all');
			expect(context.config.class).toBe('');
		});

		it('should create context with custom configuration', () => {
			const notifications: Notification[] = [];
			const config: NotificationsConfig = {
				mode: 'flat',
				enableGrouping: false,
				showTimestamps: false,
				showAvatars: false,
				infiniteScroll: false,
				realtime: true,
				filter: 'mentions',
				class: 'custom-notifications',
			};

			const context = createNotificationsContext(notifications, undefined, config);

			expect(context.config.mode).toBe('flat');
			expect(context.config.enableGrouping).toBe(false);
			expect(context.config.showTimestamps).toBe(false);
			expect(context.config.showAvatars).toBe(false);
			expect(context.config.infiniteScroll).toBe(false);
			expect(context.config.realtime).toBe(true);
			expect(context.config.filter).toBe('mentions');
			expect(context.config.class).toBe('custom-notifications');
		});

		it('should create context with default state', () => {
			const notifications: Notification[] = [createMockNotification('1')];

			const context = createNotificationsContext(notifications, undefined);

			expect(context.state.loading).toBe(false);
			expect(context.state.loadingMore).toBe(false);
			expect(context.state.hasMore).toBe(true);
			expect(context.state.error).toBe(null);
			expect(context.state.unreadCount).toBe(0);
			expect(context.state.activeFilter).toBe('all');
		});

		it('should create context with custom initial state', () => {
			const notifications: Notification[] = [];
			const initialState: Partial<NotificationsState> = {
				loading: true,
				loadingMore: false,
				hasMore: false,
				error: new Error('Test error'),
				unreadCount: 5,
				activeFilter: 'mentions',
			};

			const context = createNotificationsContext(notifications, undefined, {}, {}, initialState);

			expect(context.state.loading).toBe(true);
			expect(context.state.loadingMore).toBe(false);
			expect(context.state.hasMore).toBe(false);
			expect(context.state.error).toBeInstanceOf(Error);
			expect(context.state.error?.message).toBe('Test error');
			expect(context.state.unreadCount).toBe(5);
			expect(context.state.activeFilter).toBe('mentions');
		});

		it('should register event handlers', () => {
			const notifications: Notification[] = [];
			const handlers: NotificationsHandlers = {
				onNotificationClick: vi.fn(),
				onGroupClick: vi.fn(),
				onMarkRead: vi.fn(),
				onMarkAllRead: vi.fn(),
				onDismiss: vi.fn(),
				onLoadMore: vi.fn(),
				onFilterChange: vi.fn(),
			};

			const context = createNotificationsContext(notifications, undefined, {}, handlers);

			expect(context.handlers.onNotificationClick).toBe(handlers.onNotificationClick);
			expect(context.handlers.onGroupClick).toBe(handlers.onGroupClick);
			expect(context.handlers.onMarkRead).toBe(handlers.onMarkRead);
			expect(context.handlers.onMarkAllRead).toBe(handlers.onMarkAllRead);
			expect(context.handlers.onDismiss).toBe(handlers.onDismiss);
			expect(context.handlers.onLoadMore).toBe(handlers.onLoadMore);
			expect(context.handlers.onFilterChange).toBe(handlers.onFilterChange);
		});

		it('should handle grouped notifications', () => {
			const notifications: Notification[] = [
				createMockNotification('1', 'favourite'),
				createMockNotification('2', 'favourite'),
			];
			const groups: NotificationGroup[] = [
				createMockNotificationGroup('group1', 'favourite', 2),
			];

			const context = createNotificationsContext(notifications, groups);

			expect(context.notifications).toEqual(notifications);
			expect(context.groups).toEqual(groups);
			expect(context.groups).toHaveLength(1);
			expect(context.groups[0].count).toBe(2);
		});
	});

	describe('updateState', () => {
		it('should update state with partial updates', () => {
			const context = createNotificationsContext([], undefined);

			context.updateState({ loading: true });
			expect(context.state.loading).toBe(true);

			context.updateState({ loadingMore: true, hasMore: false });
			expect(context.state.loadingMore).toBe(true);
			expect(context.state.hasMore).toBe(false);
			expect(context.state.loading).toBe(true); // Previous state preserved
		});

		it('should update unread count', () => {
			const context = createNotificationsContext([], undefined);

			expect(context.state.unreadCount).toBe(0);

			context.updateState({ unreadCount: 10 });
			expect(context.state.unreadCount).toBe(10);

			context.updateState({ unreadCount: 0 });
			expect(context.state.unreadCount).toBe(0);
		});

		it('should update active filter', () => {
			const context = createNotificationsContext([], undefined);

			expect(context.state.activeFilter).toBe('all');

			context.updateState({ activeFilter: 'mentions' });
			expect(context.state.activeFilter).toBe('mentions');

			context.updateState({ activeFilter: 'boosts' });
			expect(context.state.activeFilter).toBe('boosts');
		});

		it('should update error state', () => {
			const context = createNotificationsContext([], undefined);

			const error = new Error('Load failed');
			context.updateState({ error });

			expect(context.state.error).toBe(error);
			expect(context.state.error?.message).toBe('Load failed');
		});

		it('should clear error state', () => {
			const context = createNotificationsContext([], undefined, {}, {}, { error: new Error('Initial') });

			expect(context.state.error).toBeInstanceOf(Error);

			context.updateState({ error: null });

			expect(context.state.error).toBe(null);
		});
	});

	describe('getNotificationsContext', () => {
		it('should retrieve existing context', () => {
			const notifications: Notification[] = [createMockNotification('1')];
			const created = createNotificationsContext(notifications, undefined);

			const retrieved = getNotificationsContext();

			expect(retrieved).toBe(created);
			expect(retrieved.notifications).toEqual(notifications);
		});

		it('should throw error if context does not exist', () => {
			contexts.clear();

			expect(() => getNotificationsContext()).toThrow(
				'Notifications context not found. Make sure you are using Notifications components inside <Notifications.Root>.'
			);
		});
	});

	describe('hasNotificationsContext', () => {
		it('should return true when context exists', () => {
			const notifications: Notification[] = [];
			createNotificationsContext(notifications, undefined);

			expect(hasNotificationsContext()).toBe(true);
		});

		it('should return false when context does not exist', () => {
			contexts.clear();

			expect(hasNotificationsContext()).toBe(false);
		});
	});
});

describe('Notifications Display Modes', () => {
	beforeEach(() => {
		contexts.clear();
	});

	it('should support grouped mode', () => {
		const context = createNotificationsContext([], undefined, { mode: 'grouped' });
		expect(context.config.mode).toBe('grouped');
	});

	it('should support flat mode', () => {
		const context = createNotificationsContext([], undefined, { mode: 'flat' });
		expect(context.config.mode).toBe('flat');
	});
});

describe('Notifications Filters', () => {
	beforeEach(() => {
		contexts.clear();
	});

	const filters: NotificationFilter[] = ['all', 'mentions', 'follows', 'boosts', 'favorites', 'polls'];

	filters.forEach((filter) => {
		it(`should support ${filter} filter`, () => {
			const context = createNotificationsContext([], undefined, { filter });
			expect(context.config.filter).toBe(filter);
			expect(context.state.activeFilter).toBe(filter);
		});
	});

	it('should sync filter from config to state', () => {
		const context = createNotificationsContext([], undefined, { filter: 'mentions' });
		expect(context.config.filter).toBe('mentions');
		expect(context.state.activeFilter).toBe('mentions');
	});

	it('should allow filter override in initialState', () => {
		const context = createNotificationsContext(
			[],
			undefined,
			{ filter: 'all' },
			{},
			{ activeFilter: 'boosts' }
		);

		expect(context.config.filter).toBe('all');
		expect(context.state.activeFilter).toBe('boosts'); // State overrides config
	});
});

describe('Notifications Event Handlers', () => {
	beforeEach(() => {
		contexts.clear();
	});

	it('should call onNotificationClick handler', () => {
		const notification = createMockNotification('1');
		const onNotificationClick = vi.fn();
		const context = createNotificationsContext([notification], undefined, {}, { onNotificationClick });

		context.handlers.onNotificationClick?.(notification);

		expect(onNotificationClick).toHaveBeenCalledWith(notification);
	});

	it('should call onGroupClick handler', () => {
		const group = createMockNotificationGroup('group1', 'favourite', 3);
		const onGroupClick = vi.fn();
		const context = createNotificationsContext([], [group], {}, { onGroupClick });

		context.handlers.onGroupClick?.(group);

		expect(onGroupClick).toHaveBeenCalledWith(group);
	});

	it('should call onMarkRead handler', async () => {
		const onMarkRead = vi.fn().mockResolvedValue(undefined);
		const context = createNotificationsContext([], undefined, {}, { onMarkRead });

		await context.handlers.onMarkRead?.('notification-1');

		expect(onMarkRead).toHaveBeenCalledWith('notification-1');
	});

	it('should call onMarkAllRead handler', async () => {
		const onMarkAllRead = vi.fn().mockResolvedValue(undefined);
		const context = createNotificationsContext([], undefined, {}, { onMarkAllRead });

		await context.handlers.onMarkAllRead?.();

		expect(onMarkAllRead).toHaveBeenCalledTimes(1);
	});

	it('should call onDismiss handler', async () => {
		const onDismiss = vi.fn().mockResolvedValue(undefined);
		const context = createNotificationsContext([], undefined, {}, { onDismiss });

		await context.handlers.onDismiss?.('notification-1');

		expect(onDismiss).toHaveBeenCalledWith('notification-1');
	});

	it('should call onLoadMore handler', async () => {
		const onLoadMore = vi.fn().mockResolvedValue(undefined);
		const context = createNotificationsContext([], undefined, {}, { onLoadMore });

		await context.handlers.onLoadMore?.();

		expect(onLoadMore).toHaveBeenCalledTimes(1);
	});

	it('should call onFilterChange handler', () => {
		const onFilterChange = vi.fn();
		const context = createNotificationsContext([], undefined, {}, { onFilterChange });

		context.handlers.onFilterChange?.('mentions');

		expect(onFilterChange).toHaveBeenCalledWith('mentions');
	});

	it('should support sync handlers', () => {
		const onMarkRead = vi.fn(); // Sync version
		const context = createNotificationsContext([], undefined, {}, { onMarkRead });

		context.handlers.onMarkRead?.('notification-1');

		expect(onMarkRead).toHaveBeenCalledWith('notification-1');
	});

	it('should support async handlers', async () => {
		const onMarkAllRead = vi.fn().mockImplementation(() =>
			new Promise((resolve) => setTimeout(resolve, 100))
		);
		const context = createNotificationsContext([], undefined, {}, { onMarkAllRead });

		const promise = context.handlers.onMarkAllRead?.();
		expect(promise).toBeInstanceOf(Promise);

		await promise;

		expect(onMarkAllRead).toHaveBeenCalledTimes(1);
	});
});

describe('Notifications State Management', () => {
	beforeEach(() => {
		contexts.clear();
	});

	it('should track loading state', () => {
		const context = createNotificationsContext([], undefined);

		expect(context.state.loading).toBe(false);

		context.updateState({ loading: true });
		expect(context.state.loading).toBe(true);

		context.updateState({ loading: false });
		expect(context.state.loading).toBe(false);
	});

	it('should track loadingMore state separately from loading', () => {
		const context = createNotificationsContext([], undefined);

		context.updateState({ loading: true, loadingMore: false });
		expect(context.state.loading).toBe(true);
		expect(context.state.loadingMore).toBe(false);

		context.updateState({ loading: false, loadingMore: true });
		expect(context.state.loading).toBe(false);
		expect(context.state.loadingMore).toBe(true);
	});

	it('should track hasMore state', () => {
		const context = createNotificationsContext([], undefined, {}, {}, { hasMore: true });

		expect(context.state.hasMore).toBe(true);

		context.updateState({ hasMore: false });
		expect(context.state.hasMore).toBe(false);
	});

	it('should track error state', () => {
		const context = createNotificationsContext([], undefined);

		expect(context.state.error).toBe(null);

		const error = new Error('Network error');
		context.updateState({ error });
		expect(context.state.error).toBe(error);

		context.updateState({ error: null });
		expect(context.state.error).toBe(null);
	});

	it('should track unread count', () => {
		const context = createNotificationsContext([], undefined, {}, {}, { unreadCount: 5 });

		expect(context.state.unreadCount).toBe(5);

		context.updateState({ unreadCount: 10 });
		expect(context.state.unreadCount).toBe(10);

		context.updateState({ unreadCount: 0 });
		expect(context.state.unreadCount).toBe(0);
	});
});

describe('Notifications Grouping', () => {
	beforeEach(() => {
		contexts.clear();
	});

	it('should handle empty groups', () => {
		const context = createNotificationsContext([], [], { enableGrouping: true });

		expect(context.groups).toEqual([]);
		expect(context.config.enableGrouping).toBe(true);
	});

	it('should handle multiple groups', () => {
		const notifications: Notification[] = [];
		const groups: NotificationGroup[] = [
			createMockNotificationGroup('group1', 'favourite', 3),
			createMockNotificationGroup('group2', 'reblog', 2),
			createMockNotificationGroup('group3', 'follow', 5),
		];

		const context = createNotificationsContext(notifications, groups);

		expect(context.groups).toHaveLength(3);
		expect(context.groups).toBeDefined();
		if (!context.groups) {
			throw new Error('Expected notification groups to be defined');
		}
		expect(context.groups[0].type).toBe('favourite');
		expect(context.groups[0].count).toBe(3);
		expect(context.groups[1].type).toBe('reblog');
		expect(context.groups[1].count).toBe(2);
		expect(context.groups[2].type).toBe('follow');
		expect(context.groups[2].count).toBe(5);
	});

	it('should support disabled grouping', () => {
		const context = createNotificationsContext([], undefined, { enableGrouping: false });

		expect(context.config.enableGrouping).toBe(false);
		expect(context.groups).toBeUndefined();
	});

	it('should handle mixed grouped and flat notifications', () => {
		const notifications: Notification[] = [
			createMockNotification('1', 'mention'),
			createMockNotification('2', 'favourite'),
			createMockNotification('3', 'favourite'),
		];
		const groups: NotificationGroup[] = [
			createMockNotificationGroup('group1', 'favourite', 2),
		];

		const context = createNotificationsContext(notifications, groups);

		expect(context.notifications).toHaveLength(3);
		expect(context.groups).toHaveLength(1);
	});
});

describe('Notifications Edge Cases', () => {
	beforeEach(() => {
		contexts.clear();
	});

	it('should handle empty notifications', () => {
		const context = createNotificationsContext([], undefined);

		expect(context.notifications).toEqual([]);
		expect(context.groups).toBeUndefined();
	});

	it('should handle large notifications list', () => {
		const notifications = Array.from({ length: 1000 }, (_, i) =>
			createMockNotification(String(i))
		);
		const context = createNotificationsContext(notifications, undefined);

		expect(context.notifications.length).toBe(1000);
	});

	it('should handle missing optional handlers', () => {
		const context = createNotificationsContext([], undefined, {}, {});

		expect(context.handlers.onNotificationClick).toBeUndefined();
		expect(context.handlers.onGroupClick).toBeUndefined();
		expect(context.handlers.onMarkRead).toBeUndefined();
		expect(context.handlers.onMarkAllRead).toBeUndefined();
		expect(context.handlers.onDismiss).toBeUndefined();
		expect(context.handlers.onLoadMore).toBeUndefined();
		expect(context.handlers.onFilterChange).toBeUndefined();
	});

	it('should handle partial config', () => {
		const context = createNotificationsContext([], undefined, { mode: 'flat' });

		expect(context.config.mode).toBe('flat');
		expect(context.config.enableGrouping).toBe(true); // Default
		expect(context.config.showTimestamps).toBe(true); // Default
	});

	it('should handle realtime updates config', () => {
		const context = createNotificationsContext([], undefined, { realtime: true });

		expect(context.config.realtime).toBe(true);
	});

	it('should handle custom CSS class', () => {
		const context = createNotificationsContext([], undefined, { class: 'my-notifications' });

		expect(context.config.class).toBe('my-notifications');
	});

	it('should handle notifications without status', () => {
		const notification = createMockNotification('1', 'follow');
		const context = createNotificationsContext([notification], undefined);

		expect(context.notifications[0].type).toBe('follow');
		expect(context.notifications[0].status).toBeUndefined();
	});

	it('should handle groups with single notification', () => {
		const group = createMockNotificationGroup('group1', 'follow', 1);
		const context = createNotificationsContext([], [group]);

		const groups = context.groups;
		expect(groups).toBeDefined();
		if (!groups) {
			throw new Error('Expected groups to exist for grouped notifications');
		}
		expect(groups[0].count).toBe(1);
		expect(groups[0].notifications).toHaveLength(1);
	});
});

describe('Notifications Type Safety', () => {
	beforeEach(() => {
		contexts.clear();
	});

	it('should enforce NotificationDisplayMode type', () => {
		const modes: NotificationDisplayMode[] = ['grouped', 'flat'];

		modes.forEach((mode) => {
			const context = createNotificationsContext([], undefined, { mode });
			expect(context.config.mode).toBe(mode);
		});
	});

	it('should enforce NotificationFilter type', () => {
		const filters: NotificationFilter[] = ['all', 'mentions', 'follows', 'boosts', 'favorites', 'polls'];

		filters.forEach((filter) => {
			const context = createNotificationsContext([], undefined, { filter });
			expect(context.config.filter).toBe(filter);
		});
	});

	it('should enforce Notification structure', () => {
		const notification = createMockNotification('test');

		expect(notification).toHaveProperty('id');
		expect(notification).toHaveProperty('type');
		expect(notification).toHaveProperty('created_at');
		expect(notification).toHaveProperty('account');
	});

	it('should enforce NotificationGroup structure', () => {
		const group = createMockNotificationGroup('test', 'favourite', 3);

		expect(group).toHaveProperty('id');
		expect(group).toHaveProperty('type');
		expect(group).toHaveProperty('notifications');
		expect(group).toHaveProperty('count');
		expect(group).toHaveProperty('created_at');
	});
});
