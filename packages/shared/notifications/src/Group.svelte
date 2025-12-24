<!--
Notifications.Group - Grouped notification display

Displays multiple similar notifications grouped together.

@component
@example
```svelte
<Notifications.Root {notifications} {groups}>
  {#each groups as group}
    <Notifications.Group {group} />
  {/each}
</Notifications.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { NotificationGroup } from './types.js';
	import { getNotificationsContext } from './context.svelte.js';

	interface Props {
		/**
		 * Notification group data
		 */
		group: NotificationGroup;

		/**
		 * Custom content rendering
		 */
		children?: Snippet;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { group, children, class: className = '' }: Props = $props();

	const context = getNotificationsContext();

	/**
	 * Get group icon based on type
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
		}[group.type] || '🔔'
	);

	/**
	 * Get group title based on type and count
	 */
	const title = $derived.by(() => {
		const count = group.notifications.length;
		const baseTitle =
			{
				follow: count > 1 ? 'followed you' : 'followed you',
				mention: count > 1 ? 'mentioned you' : 'mentioned you',
				reblog: count > 1 ? 'boosted your post' : 'boosted your post',
				favourite: count > 1 ? 'favorited your post' : 'favorited your post',
				poll: 'poll ended',
				follow_request: count > 1 ? 'requested to follow you' : 'requested to follow you',
				status: count > 1 ? 'posted' : 'posted',
				update: 'edited a post',
				'admin.sign_up': 'signed up',
				'admin.report': 'reported',
			}[group.type] || 'sent notifications';

		return baseTitle;
	});

	/**
	 * Format the names of accounts
	 */
	const accountNames = $derived.by(() => {
		const notifications = group.notifications;
		const count = notifications.length;

		if (count === 1) {
			return notifications[0].account?.displayName || notifications[0].account?.username || '';
		} else if (count === 2) {
			return `${notifications[0].account?.displayName || notifications[0].account?.username} and ${notifications[1].account?.displayName || notifications[1].account?.username}`;
		} else {
			return `${notifications[0].account?.displayName || notifications[0].account?.username} and ${count - 1} others`;
		}
	});

	/**
	 * Check if group has any unread notifications
	 */
	const hasUnread = $derived(group.notifications.some((n) => !n.read));

	/**
	 * Handle group click
	 */
	function handleClick() {
		context.handlers.onGroupClick?.(group);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleClick();
		}
	}

	function sanitizeContent(html: string): string {
		return html.replace(/<[^>]+>/g, '');
	}
</script>

<div
	class={`notification-group notification-group--${group.type} ${className}`}
	class:notification-group--unread={hasUnread}
	onclick={handleClick}
	role="button"
	tabindex="0"
	onkeydown={handleKeyDown}
	aria-label={`${accountNames} ${title}`}
>
	{#if children}
		{@render children()}
	{:else}
		<div class="notification-group__icon" aria-hidden="true">
			{icon}
		</div>

		<div class="notification-group__content">
			{#if context.config.showAvatars}
				<div class="notification-group__avatars">
					{#each group.notifications.slice(0, 3) as notification (notification.id)}
						{#if notification.account?.avatar}
							<img
								src={notification.account.avatar}
								alt={`${notification.account.displayName || notification.account.username} avatar`}
								class="notification-group__avatar"
							/>
						{/if}
					{/each}
				</div>
			{/if}

			<div class="notification-group__body">
				<p class="notification-group__text">
					<strong class="notification-group__names">{accountNames}</strong>
					<span class="notification-group__action">{title}</span>
				</p>

				{#if context.config.showTimestamps && group.notifications[0]?.createdAt}
					<time class="notification-group__timestamp" datetime={group.notifications[0].createdAt}>
						{new Date(group.notifications[0].createdAt).toLocaleDateString()}
					</time>
				{/if}

				{#if group.notifications[0]?.status}
					<div class="notification-group__status">
						{sanitizeContent(group.notifications[0].status.content)}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
