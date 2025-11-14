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

<style>
	.notification-item {
		display: flex;
		padding: 1rem;
		border-bottom: 1px solid var(--notifications-border, #e1e8ed);
		background: var(--notifications-item-bg, white);
		cursor: pointer;
		transition: background-color 0.2s;
		position: relative;
	}

	.notification-item:hover {
		background: var(--notifications-item-hover-bg, #f7f9fa);
	}

	.notification-item--unread {
		background: var(--notifications-unread-bg, #eff6ff);
		border-left: 3px solid var(--notifications-primary, #1d9bf0);
	}

	.notification-item__icon {
		font-size: 1.5rem;
		margin-right: 1rem;
		flex-shrink: 0;
	}

	.notification-item__content {
		display: flex;
		flex: 1;
		gap: 0.75rem;
		position: relative;
		cursor: pointer;
		border: none;
		background: transparent;
		text-align: left;
	}

	.notification-item__avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
		flex-shrink: 0;
	}

	.notification-item__body {
		flex: 1;
		min-width: 0;
	}

	.notification-item__content:focus-visible {
		outline: 2px solid var(--notifications-primary, #1d9bf0);
		outline-offset: 2px;
	}

	.notification-item__text {
		margin: 0 0 0.25rem 0;
		font-size: var(--notifications-font-size-base, 1rem);
		color: var(--notifications-text-primary, #0f1419);
	}

	.notification-item__name {
		font-weight: 600;
	}

	.notification-item__action {
		color: var(--notifications-text-secondary, #536471);
	}

	.notification-item__timestamp {
		display: block;
		font-size: var(--notifications-font-size-sm, 0.875rem);
		color: var(--notifications-text-secondary, #536471);
		margin-bottom: 0.5rem;
	}

	.notification-item__status {
		margin-top: 0.5rem;
		padding: 0.75rem;
		background: var(--notifications-status-bg, #f7f9fa);
		border-radius: var(--notifications-radius, 8px);
		font-size: var(--notifications-font-size-sm, 0.875rem);
		color: var(--notifications-text-secondary, #536471);
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.notification-item__dismiss {
		position: absolute;
		top: 0;
		right: 0;
		width: 24px;
		height: 24px;
		padding: 0;
		background: transparent;
		border: none;
		color: var(--notifications-text-secondary, #536471);
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.notification-item:hover .notification-item__dismiss {
		opacity: 1;
	}

	.notification-item__dismiss:hover {
		color: var(--notifications-error-color, #dc2626);
	}

	/* Type-specific styling */
	.notification-item--follow {
		/* Follow notification styling */
	}

	.notification-item--mention {
		/* Mention notification styling */
	}

	.notification-item--reblog {
		/* Boost notification styling */
	}

	.notification-item--favourite {
		/* Favorite notification styling */
	}

	@media (prefers-reduced-motion: reduce) {
		.notification-item,
		.notification-item__dismiss {
			transition: none;
		}
	}
</style>
