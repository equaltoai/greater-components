/**
 * Notifications Component Context
 *
 * Provides shared state and configuration for compound Notifications components.
 * Handles notification grouping, filtering, and read/unread state.
 *
 * @module @equaltoai/greater-components-fediverse/Notifications/context
 */

import { getContext, setContext } from 'svelte';
import type { Notification, NotificationGroup } from '../../types.js';

/**
 * Notifications context key
 */
const NOTIFICATIONS_CONTEXT_KEY = Symbol('notifications-context');

/**
 * Notification display mode
 */
export type NotificationDisplayMode = 'grouped' | 'flat';

/**
 * Notification filter type
 */
export type NotificationFilter = 'all' | 'mentions' | 'follows' | 'boosts' | 'favorites' | 'polls';

/**
 * Configuration options for Notifications component
 */
export interface NotificationsConfig {
	/**
	 * Display mode (grouped or flat)
	 */
	mode?: NotificationDisplayMode;

	/**
	 * Enable grouping similar notifications
	 */
	enableGrouping?: boolean;

	/**
	 * Show timestamps
	 */
	showTimestamps?: boolean;

	/**
	 * Show avatars
	 */
	showAvatars?: boolean;

	/**
	 * Enable infinite scroll
	 */
	infiniteScroll?: boolean;

	/**
	 * Enable real-time updates
	 */
	realtime?: boolean;

	/**
	 * Active filter
	 */
	filter?: NotificationFilter;

	/**
	 * Custom CSS class
	 */
	class?: string;
}

/**
 * Notification action handlers
 */
export interface NotificationsHandlers {
	/**
	 * Called when notification is clicked
	 */
	onNotificationClick?: (notification: Notification) => void;

	/**
	 * Called when notification group is clicked
	 */
	onGroupClick?: (group: NotificationGroup) => void;

	/**
	 * Called when notification is marked as read
	 */
	onMarkRead?: (id: string) => Promise<void> | void;

	/**
	 * Called when all notifications are marked as read
	 */
	onMarkAllRead?: () => Promise<void> | void;

	/**
	 * Called when notification is dismissed
	 */
	onDismiss?: (id: string) => Promise<void> | void;

	/**
	 * Called when more notifications should be loaded
	 */
	onLoadMore?: () => Promise<void> | void;

	/**
	 * Called when filter changes
	 */
	onFilterChange?: (filter: NotificationFilter) => void;
}

/**
 * Notifications state
 */
export interface NotificationsState {
	/**
	 * Whether notifications are loading
	 */
	loading: boolean;

	/**
	 * Whether more notifications are being loaded
	 */
	loadingMore: boolean;

	/**
	 * Whether there are more notifications to load
	 */
	hasMore: boolean;

	/**
	 * Error state if any
	 */
	error: Error | null;

	/**
	 * Number of unread notifications
	 */
	unreadCount: number;

	/**
	 * Currently selected filter
	 */
	activeFilter: NotificationFilter;
}

/**
 * Notifications context value
 */
export interface NotificationsContext {
	/**
	 * Notification items
	 */
	notifications: Notification[];

	/**
	 * Grouped notifications (if enabled)
	 */
	groups?: NotificationGroup[];

	/**
	 * Configuration options
	 */
	config: Required<NotificationsConfig>;

	/**
	 * Action handlers
	 */
	handlers: NotificationsHandlers;

	/**
	 * Current notifications state
	 */
	state: NotificationsState;

	/**
	 * Update state helper
	 */
	updateState: (partial: Partial<NotificationsState>) => void;
}

/**
 * Create and set the notifications context
 *
 * @param notifications - Notification items
 * @param groups - Grouped notifications (optional)
 * @param config - Configuration options
 * @param handlers - Action handlers
 * @param initialState - Initial state
 */
export function createNotificationsContext(
	notifications: Notification[],
	groups: NotificationGroup[] | undefined,
	config: NotificationsConfig = {},
	handlers: NotificationsHandlers = {},
	initialState: Partial<NotificationsState> = {}
): NotificationsContext {
	// Create reactive state using Proxy for universal compatibility (Svelte + Node.js)
	const internalState: NotificationsState = {
		loading: initialState.loading ?? false,
		loadingMore: initialState.loadingMore ?? false,
		hasMore: initialState.hasMore ?? true,
		error: initialState.error ?? null,
		unreadCount: initialState.unreadCount ?? 0,
		activeFilter: initialState.activeFilter || config.filter || 'all',
	};

	// Create proxy for reactivity
	const state = new Proxy(internalState, {
		set(target, prop: keyof NotificationsState, value) {
			target[prop] = value as never;
			return true;
		},
	});

	const context: NotificationsContext = {
		notifications,
		groups,
		config: {
			mode: config.mode || 'grouped',
			enableGrouping: config.enableGrouping ?? true,
			showTimestamps: config.showTimestamps ?? true,
			showAvatars: config.showAvatars ?? true,
			infiniteScroll: config.infiniteScroll ?? true,
			realtime: config.realtime ?? false,
			filter: config.filter || 'all',
			class: config.class || '',
		},
		handlers,
		state,
		updateState: (partial: Partial<NotificationsState>) => {
			Object.assign(state, partial);
		},
	};

	setContext(NOTIFICATIONS_CONTEXT_KEY, context);
	return context;
}

/**
 * Get the notifications context
 *
 * @throws Error if called outside of Notifications.Root
 */
export function getNotificationsContext(): NotificationsContext {
	const context = getContext<NotificationsContext>(NOTIFICATIONS_CONTEXT_KEY);

	if (!context) {
		throw new Error(
			'Notifications context not found. Make sure you are using Notifications components inside <Notifications.Root>.'
		);
	}

	return context;
}

/**
 * Check if notifications context exists
 */
export function hasNotificationsContext(): boolean {
	try {
		const context = getContext<NotificationsContext>(NOTIFICATIONS_CONTEXT_KEY);
		return context !== undefined && context !== null;
	} catch {
		return false;
	}
}
