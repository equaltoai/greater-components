<!--
Notifications.Root - Container component for Notifications compound components

Provides context for child components and handles overall notifications display.

@component
@example
```svelte
<Notifications.Root notifications={items} groups={groupedItems}>
  {#each groupedItems as group}
    <Notifications.Group {group} />
  {/each}
</Notifications.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Notification, NotificationGroup } from '../../types.js';
	import { createNotificationsContext } from './context.js';
	import type {
		NotificationsConfig,
		NotificationsHandlers,
		NotificationsState,
	} from './context.js';

	interface Props {
		/**
		 * Notification items
		 */
		notifications: Notification[];

		/**
		 * Grouped notifications (optional)
		 */
		groups?: NotificationGroup[];

		/**
		 * Configuration options
		 */
		config?: NotificationsConfig;

		/**
		 * Action handlers
		 */
		handlers?: NotificationsHandlers;

		/**
		 * Initial state
		 */
		initialState?: Partial<NotificationsState>;

		/**
		 * Child components
		 */
		children?: Snippet;
	}

	let {
		notifications,
		groups,
		config = {},
		handlers = {},
		initialState = {},
		children,
	}: Props = $props();

	// Create context for child components
	const context = $derived(
		createNotificationsContext(notifications, groups, config, handlers, initialState)
	);

	/**
	 * Handle mark all as read
	 */
	async function handleMarkAllRead() {
		if (!context.handlers.onMarkAllRead) return;

		context.updateState({ loading: true });

		try {
			await context.handlers.onMarkAllRead();
			context.updateState({ unreadCount: 0 });
		} catch (error) {
			context.updateState({ error: error as Error });
		} finally {
			context.updateState({ loading: false });
		}
	}
</script>

<div
	class={`notifications-root notifications-root--${context.config.mode} ${context.config.class}`}
	class:notifications-root--loading={context.state.loading}
	role="feed"
	aria-busy={context.state.loading}
	aria-label="Notifications"
>
	{#if context.state.unreadCount > 0 && context.handlers.onMarkAllRead}
		<div class="notifications-root__header">
			<span class="notifications-root__unread-count">
				{context.state.unreadCount} unread
			</span>
			<button class="notifications-root__mark-read" onclick={handleMarkAllRead}>
				Mark all as read
			</button>
		</div>
	{/if}

	{#if context.state.error}
		<div class="notifications-root__error" role="alert">
			{context.state.error.message}
		</div>
	{/if}

	<div class="notifications-root__content">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
