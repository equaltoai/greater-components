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
	import { sanitizeHtml } from '@equaltoai/greater-components-utils';
	import type { Snippet } from 'svelte';
	import WorkflowNotificationItem from './WorkflowNotificationItem.svelte';
	import type { Notification, NotificationType, WorkflowEventNotification } from './types.js';
	import { getNotificationsContext } from './context.svelte.js';

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
	const iconMap: Partial<Record<NotificationType, string>> = {
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
		quote: '💬',
		community_note: '📝',
		trust_update: '🔒',
		cost_alert: '💸',
		moderation_action: '🛡️',
		workflow_event: '🧭',
	};

	const icon = $derived(iconMap[notification.type] ?? '🔔');

	/**
	 * Get notification title based on type
	 */
	const titleMap: Partial<Record<NotificationType, string>> = {
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
		quote: 'quoted your post',
		community_note: 'added a community note',
		trust_update: 'updated your trust score',
		cost_alert: 'sent a cost alert',
		moderation_action: 'performed a moderation action',
		workflow_event: 'updated a workflow',
	};

	function isWorkflowEventNotification(
		candidate: Notification
	): candidate is WorkflowEventNotification {
		return candidate.type === 'workflow_event';
	}

	const title = $derived(
		isWorkflowEventNotification(notification)
			? notification.workflowEvent.title
			: (titleMap[notification.type] ?? 'sent a notification')
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

	const sanitizedStatusContent = $derived(
		notification.status
			? sanitizeHtml(notification.status.content, {
					allowedTags: [
						'p',
						'br',
						'span',
						'a',
						'del',
						'pre',
						'code',
						'em',
						'strong',
						'b',
						'i',
						'u',
						's',
						'strike',
						'ul',
						'ol',
						'li',
						'blockquote',
					],
					allowedAttributes: ['href', 'title', 'class', 'rel', 'target'],
				}).trim()
			: ''
	);

	function setHtml(node: HTMLElement, html: string) {
		node.innerHTML = html;
		return {
			update(newHtml: string) {
				node.innerHTML = newHtml;
			},
		};
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
				{#if isWorkflowEventNotification(notification)}
					<WorkflowNotificationItem {notification} />
				{:else}
					<p class="notification-item__text">
						<strong class="notification-item__name">
							{notification.account?.displayName || notification.account?.username}
						</strong>
						<span class="notification-item__action">{title}</span>
					</p>

					{#if context.config.showTimestamps && notification.createdAt}
						{@const createdAt = notification.createdAt}
						<time
							class="notification-item__timestamp"
							datetime={typeof createdAt === 'string' ? createdAt : createdAt.toISOString()}
						>
							{new Date(notification.createdAt).toLocaleDateString()}
						</time>
					{/if}

					{#if notification.status && sanitizedStatusContent}
						<div class="notification-item__status">
							<div
								class="notification-item__status-content"
								use:setHtml={sanitizedStatusContent}
							></div>
						</div>
					{/if}
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
