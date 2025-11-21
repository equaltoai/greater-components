<!--
Notifications.Item - Individual notification item

Displays a single notification with type-specific rendering.

@component
@example
```svelte
<Notifications.Root {notifications}>
  {#each notifications as notification}
    <Notifications.Item {notification} />
  {/each}
</Notifications.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Notification } from '../../types.js';
	import { getNotificationsContext } from './context.js';
	import ContentRenderer from '../ContentRenderer.svelte';

	interface Props {
		/**
		 * Notification data
		 */
		notification: Notification;

		/**
		 * Custom content rendering
		 */
		children?: Snippet;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { notification, children, class: className = '' }: Props = $props();

	const context = getNotificationsContext();

	/**
	 * Get notification icon based on type
	 */
	const icon = $derived(
		{
			follow: '👤',
			mention: '@',
			reblog: '🔁',
			favourite: '⭐',
			poll: '📊',
			follow_request: '👥',
			status: '📝',
			update: '✏️',
			'admin.sign_up': '🎉',
			'admin.report': '⚠️',
		}[notification.type] || '🔔'
	);

	/**
	 * Get notification title based on type
	 */
	const title = $derived(
		{
			follow: 'followed you',
			mention: 'mentioned you',
			reblog: 'boosted your post',
			favourite: 'favorited your post',
			poll: 'poll ended',
			follow_request: 'requested to follow you',
			status: 'posted',
			update: 'edited a post',
			'admin.sign_up': 'signed up',
			'admin.report': 'reported',
		}[notification.type] || 'sent a notification'
	);

	/**
	 * Handle notification click
	 */
	function handleClick() {
		context.handlers.onNotificationClick?.(notification);

		// Mark as read if unread
		if (!notification.read && context.handlers.onMarkRead) {
			context.handlers.onMarkRead(notification.id);
		}
	}

	/**
	 * Handle dismiss
	 */
	async function handleDismiss(event: Event) {
		event.stopPropagation();

		if (context.handlers.onDismiss) {
			await context.handlers.onDismiss(notification.id);
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleClick();
		}
	}
</script>

<article
	class={`notification-item notification-item--${notification.type} ${className}`}
	class:notification-item--unread={!notification.read}
	aria-label={`${notification.account?.displayName || notification.account?.username} ${title}`}
>
	{#if children}
		{@render children()}
	{:else}
		<div class="notification-item__icon" aria-hidden="true">
			{icon}
		</div>

		<div
			class="notification-item__content"
			role="button"
			tabindex={0}
			onclick={handleClick}
			onkeydown={handleKeyDown}
		>
			{#if context.config.showAvatars && notification.account?.avatar}
				<img
					src={notification.account.avatar}
					alt={`${notification.account.displayName || notification.account.username} avatar`}
					class="notification-item__avatar"
				/>
			{/if}

			<div class="notification-item__body">
				<p class="notification-item__text">
					<strong class="notification-item__name">
						{notification.account?.displayName || notification.account?.username}
					</strong>
					<span class="notification-item__action">{title}</span>
				</p>

				{#if context.config.showTimestamps && notification.createdAt}
					<time class="notification-item__timestamp" datetime={notification.createdAt}>
						{new Date(notification.createdAt).toLocaleDateString()}
					</time>
				{/if}

				{#if notification.status}
					<div class="notification-item__status">
						<ContentRenderer
							content={notification.status.content}
							mentions={notification.status.mentions ?? []}
							tags={notification.status.tags ?? []}
							class="notification-item__status-content"
						/>
					</div>
				{/if}
			</div>

			{#if context.handlers.onDismiss}
				<button
					class="notification-item__dismiss"
					onclick={handleDismiss}
					aria-label="Dismiss notification"
				>
					×
				</button>
			{/if}
		</div>
	{/if}
</article>
