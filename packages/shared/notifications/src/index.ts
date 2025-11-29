/**
 * Notifications Compound Component
 *
 * A flexible, composable notifications component for displaying ActivityPub/Fediverse notifications.
 * Built using compound component pattern with grouping, filtering, and real-time updates.
 *
 * @example Basic usage
 * ```svelte
 * <script>
 *   import { Notifications } from '@equaltoai/greater-components-fediverse';
 *
 *   const notifications = [...]; // Notification[] from API
 * </script>
 *
 * <Notifications.Root {notifications}>
 *   {#each notifications as notification}
 *     <Notifications.Item {notification} />
 *   {/each}
 * </Notifications.Root>
 * ```
 *
 * @example With grouping
 * ```svelte
 * <Notifications.Root {notifications} {groups} config={{ mode: 'grouped' }}>
 *   {#each groups as group}
 *     <Notifications.Group {group} />
 *   {/each}
 * </Notifications.Root>
 * ```
 *
 * @example With filtering
 * ```svelte
 * <Notifications.Root {notifications}>
 *   <Notifications.Filter />
 *   {#each filteredNotifications as notification}
 *     <Notifications.Item {notification} />
 *   {/each}
 * </Notifications.Root>
 * ```
 *
 * @module @equaltoai/greater-components-fediverse/Notifications
 */

import NotificationsRoot from './Root.svelte';
import NotificationsItem from './Item.svelte';
import NotificationsGroup from './Group.svelte';
import NotificationsFilter from './Filter.svelte';
import NotificationsLesserNotificationItem from './LesserNotificationItem.svelte';

export {
	NotificationsRoot as Root,
	NotificationsItem as Item,
	NotificationsGroup as Group,
	NotificationsFilter as Filter,
	NotificationsLesserNotificationItem as LesserNotificationItem,
};

// Export types
export type {
	NotificationsContext,
	NotificationsConfig,
	NotificationsHandlers,
	NotificationsState,
	NotificationDisplayMode,
	NotificationFilter,
} from './context.js';

/**
 * Notifications compound component
 *
 * Provides a flexible, composable API for building notification feeds with:
 * - Grouped notifications for similar actions
 * - Filtering by notification type
 * - Read/unread state management
 * - Real-time updates support
 * - Custom rendering for each notification type
 * - Full accessibility
 */
export const Notifications = {
	/**
	 * Root container that provides context
	 */
	Root: NotificationsRoot,

	/**
	 * Individual notification item
	 */
	Item: NotificationsItem,

	/**
	 * Grouped notification display
	 */
	Group: NotificationsGroup,

	/**
	 * Filter tabs for notification types
	 */
	Filter: NotificationsFilter,

	/**
	 * Lesser-specific notification item (quote, community_note, trust_update, cost_alert, moderation_action)
	 */
	LesserNotificationItem: NotificationsLesserNotificationItem,
};

export default Notifications;
