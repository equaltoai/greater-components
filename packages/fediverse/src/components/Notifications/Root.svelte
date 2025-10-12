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
	class="notifications-root notifications-root--{context.config.mode} {context.config.class}"
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

<style>
	.notifications-root {
		display: flex;
		flex-direction: column;
		width: 100%;
		background: var(--notifications-bg, white);
		position: relative;
	}

	.notifications-root--loading {
		opacity: 0.7;
	}

	.notifications-root__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid var(--notifications-border, #e1e8ed);
		background: var(--notifications-header-bg, #f7f9fa);
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.notifications-root__unread-count {
		font-size: var(--notifications-font-size-sm, 0.875rem);
		font-weight: 600;
		color: var(--notifications-text-primary, #0f1419);
	}

	.notifications-root__mark-read {
		padding: 0.5rem 1rem;
		background: transparent;
		color: var(--notifications-primary, #1d9bf0);
		border: 1px solid var(--notifications-primary, #1d9bf0);
		border-radius: var(--notifications-radius, 9999px);
		font-size: var(--notifications-font-size-sm, 0.875rem);
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.notifications-root__mark-read:hover {
		background: var(--notifications-primary, #1d9bf0);
		color: white;
	}

	.notifications-root__error {
		padding: 1rem;
		background: var(--notifications-error-bg, #fee);
		color: var(--notifications-error-color, #dc2626);
		border: 1px solid var(--notifications-error-border, #fcc);
		margin: 1rem;
		border-radius: var(--notifications-radius, 8px);
	}

	.notifications-root__content {
		flex: 1;
		overflow-y: auto;
	}

	/* Mode variations */
	.notifications-root--grouped {
		/* Grouped notification styling */
	}

	.notifications-root--flat {
		/* Flat notification styling */
	}

	@media (prefers-reduced-motion: reduce) {
		.notifications-root__mark-read {
			transition: none;
		}
	}
</style>
