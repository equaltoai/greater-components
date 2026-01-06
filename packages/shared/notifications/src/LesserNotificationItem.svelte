<!--
Notifications.LesserNotificationItem - Lesser-specific notification renderer

Handles quote, community_note, trust_update, cost_alert, and moderation_action notifications.

@component
@example
```svelte
<Notifications.Root notifications={notifications}>
  <Notifications.LesserNotificationItem />
</Notifications.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';

	// Use store Notification type which has metadata.lesser structure
	interface Notification {
		id: string;
		type:
			| 'info'
			| 'success'
			| 'warning'
			| 'error'
			| 'system'
			| 'quote'
			| 'community_note'
			| 'trust_update'
			| 'cost_alert'
			| 'moderation_action';
		title: string;
		message: string;
		timestamp: number;
		isRead: boolean;
		priority: 'low' | 'normal' | 'high' | 'urgent';
		metadata?: {
			lesser?: {
				quoteStatus?: {
					id: string;
					content: string;
					author: string;
				};
				communityNote?: {
					id: string;
					content: string;
					helpful: number;
					notHelpful: number;
				};
				trustUpdate?: {
					newScore: number;
					previousScore?: number;
					reason?: string;
				};
				costAlert?: {
					amount: number;
					threshold: number;
				};
				moderationAction?: {
					action: string;
					reason: string;
					statusId?: string;
				};
			};
		};
		createdAt: string | Date;
		account: {
			displayName?: string;
			username: string;
		};
	}

	interface Props {
		/**
		 * The notification to display (from adapter store)
		 */
		notification: Notification;

		/**
		 * Custom content rendering
		 */
		content?: Snippet;

		/**
		 * Callback when notification is clicked
		 */
		onClick?: (notification: Notification) => void;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { notification, content, onClick, class: className = '' }: Props = $props();

	type LesserNotificationType =
		| 'quote'
		| 'community_note'
		| 'trust_update'
		| 'cost_alert'
		| 'moderation_action';

	const notificationType = $derived(notification.type as LesserNotificationType);

	const iconMap: Record<LesserNotificationType, string> = {
		quote: 'M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z',
		community_note:
			'M21 11.5c0-.28-.11-.53-.29-.71l-9-9a.996.996 0 0 0-1.41 0l-9 9c-.18.18-.29.43-.29.71V21c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-5h4v5c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-9.5z',
		trust_update:
			'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z',
		cost_alert:
			'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z',
		moderation_action: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
	};

	function formatDate(date: string | Date): string {
		const d = typeof date === 'string' ? new Date(date) : date;
		const now = Date.now();
		const diff = now - d.getTime();
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);

		if (minutes < 1) return 'just now';
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		if (days < 7) return `${days}d ago`;
		return d.toLocaleDateString();
	}

	function handleClick() {
		onClick?.(notification);
	}
</script>

	<button
		class={`lesser-notification-item ${className}`}
		class:unread={!notification.isRead}
		type="button"
		aria-label={`${notification.type} notification`}
		onclick={handleClick}
	>

		<div class={`lesser-notification-item__icon lesser-notification-item__icon--${notificationType}`}>
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path fill="currentColor" d={iconMap[notificationType]} />
			</svg>
		</div>

		<div class="lesser-notification-item__content">
			{#if content}
				{@render content()}
		{:else}
			<div class="lesser-notification-item__header">
				<span class="lesser-notification-item__account">
					{notification.account.displayName || notification.account.username}
				</span>
				<span class="lesser-notification-item__time">
					{formatDate(notification.createdAt)}
				</span>
			</div>

			{#if notification.type === 'quote'}
				<div class="lesser-notification-item__body">
					<p class="lesser-notification-item__text">quoted your post</p>
					{#if notification.metadata?.lesser?.quoteStatus}
						<div class="lesser-notification-item__quote">
							{notification.metadata.lesser.quoteStatus.content}
						</div>
					{/if}
				</div>
			{:else if notification.type === 'community_note'}
				<div class="lesser-notification-item__body">
					<p class="lesser-notification-item__text">added a community note to your post</p>
					{#if notification.metadata?.lesser?.communityNote}
						<div class="lesser-notification-item__note">
							<p>{notification.metadata.lesser.communityNote.content}</p>
							<div class="lesser-notification-item__note-stats">
								<span>👍 {notification.metadata.lesser.communityNote.helpful}</span>
								<span>👎 {notification.metadata.lesser.communityNote.notHelpful}</span>
							</div>
						</div>
					{/if}
				</div>
			{:else if notification.type === 'trust_update'}
				<div class="lesser-notification-item__body">
					<p class="lesser-notification-item__text">
						Your trust score changed:
						{#if notification.metadata?.lesser?.trustUpdate?.previousScore !== undefined}
							<span class="trust-score"
								>{notification.metadata.lesser.trustUpdate.previousScore}</span
							> →
						{/if}
						<span class="trust-score trust-score--new"
							>{notification.metadata?.lesser?.trustUpdate?.newScore}</span
						>
					</p>
					{#if notification.metadata?.lesser?.trustUpdate?.reason}
						<p class="lesser-notification-item__reason">
							{notification.metadata.lesser.trustUpdate.reason}
						</p>
					{/if}
				</div>
			{:else if notification.type === 'cost_alert'}
				<div class="lesser-notification-item__body">
					<p class="lesser-notification-item__text">
						Cost alert: ${(
							(notification.metadata?.lesser?.costAlert?.amount || 0) / 1000000
						).toFixed(4)} (threshold: ${(
							(notification.metadata?.lesser?.costAlert?.threshold || 0) / 1000000
						).toFixed(4)})
					</p>
					<p class="lesser-notification-item__message">{notification.message}</p>
				</div>
			{:else if notification.type === 'moderation_action'}
				<div class="lesser-notification-item__body">
					<p class="lesser-notification-item__text">
						Moderation action taken: <strong
							>{notification.metadata?.lesser?.moderationAction?.action}</strong
						>
					</p>
					<p class="lesser-notification-item__reason">
						{notification.metadata?.lesser?.moderationAction?.reason}
					</p>
				</div>
			{/if}
		{/if}
		</div>
	</button>
