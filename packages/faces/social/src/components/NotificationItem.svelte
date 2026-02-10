<script lang="ts">
	import type { Notification, NotificationGroup, Status } from '../types';
	import {
		getGroupTitle,
		getNotificationIcon,
		getNotificationColor,
		formatNotificationTime,
		shouldHighlightNotification,
	} from '../utils/notificationGrouping';

	interface Props {
		notification: Notification;
		group?: NotificationGroup;
		density?: 'compact' | 'comfortable';
		showActions?: boolean;
		onClick?: (notification: Notification) => void;
		onMarkAsRead?: (notificationId: string) => void;
		onDismiss?: (notificationId: string) => void;
	}

	let {
		notification,
		group,
		density = 'comfortable',
		showActions = true,
		onClick,
		onMarkAsRead,
		onDismiss,
	}: Props = $props();

	const isGrouped = $derived(group !== undefined);
	const isUnread = $derived(!notification.read);
	const shouldHighlight = $derived(shouldHighlightNotification(notification));
	const iconName = $derived(getNotificationIcon(notification.type));
	const iconColor = $derived(getNotificationColor(notification.type));
	const timeString = $derived(formatNotificationTime(notification.createdAt));
	const createdAtDate = $derived.by(() => {
		const date = new Date(notification.createdAt);
		return Number.isNaN(date.getTime()) ? null : date;
	});

	const displayTitle = $derived.by(() => {
		if (group) {
			return getGroupTitle(group);
		}

		// Individual notification titles
		switch (notification.type) {
			case 'mention':
				return `${notification.account.displayName} mentioned you`;
			case 'reblog':
				return `${notification.account.displayName} boosted your post`;
			case 'favourite':
				return `${notification.account.displayName} favorited your post`;
			case 'follow':
				return `${notification.account.displayName} followed you`;
			case 'follow_request':
				return `${notification.account.displayName} requested to follow you`;
			case 'poll':
				return `${notification.account.displayName} voted in your poll`;
			case 'status':
				return `${notification.account.displayName} posted`;
			case 'update':
				return `${notification.account.displayName} edited a post`;
			case 'admin.sign_up':
				return 'New user registration';
			case 'admin.report':
				return 'New report submitted';
			default:
				return 'Notification';
		}
	});

	const avatars = $derived.by(() => {
		const accounts = group ? group.accounts : [notification.account];
		return accounts
			.filter((account): account is typeof notification.account => Boolean(account?.id))
			.slice(0, 4);
	});

	function getNotificationStatus(value: Notification): Status | null {
		if ('status' in value && value.status) {
			return value.status;
		}
		if (value.type === 'quote' && value.quoteStatus) {
			return value.quoteStatus;
		}
		if (value.type === 'admin.report' && value.report?.status) {
			return value.report.status;
		}
		return null;
	}

	const notificationStatus = $derived.by(() => getNotificationStatus(notification));

	const statusPreview = $derived.by(() => {
		const status = notificationStatus;
		if (!status?.content) return '';

		// Strip HTML tags and truncate
		const text = status.content.replace(/<[^>]*>/g, '');
		return text.length > 100 ? `${text.slice(0, 100)}...` : text;
	});

	function handleClick() {
		onClick?.(notification);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleClick();
		} else if (event.key === 'm' || event.key === 'M') {
			event.preventDefault();
			onMarkAsRead?.(notification.id);
		} else if (event.key === 'x' || event.key === 'X') {
			event.preventDefault();
			onDismiss?.(notification.id);
		}
	}

	function handleMarkAsRead(event: Event) {
		event.stopPropagation();
		onMarkAsRead?.(notification.id);
	}

	function handleDismiss(event: Event) {
		event.stopPropagation();
		onDismiss?.(notification.id);
	}
</script>

<article
	class={`notification-item ${density}`}
	class:unread={isUnread}
	class:highlighted={shouldHighlight}
	class:grouped={isGrouped}
	class:clickable={onClick}
	onclick={onClick ? handleClick : undefined}
	onkeydown={onClick ? handleKeyDown : undefined}
	{...onClick ? { role: 'button', tabindex: 0 } : {}}
	aria-label={onClick
		? `${displayTitle}. ${isUnread ? 'Unread. ' : ''}Press Enter to open, M to mark as read, X to dismiss`
		: displayTitle}
	aria-describedby={`notification-time-${notification.id}`}
>
	<!-- Unread indicator -->
	{#if isUnread}
		<div class="unread-indicator" aria-hidden="true"></div>
	{/if}

	<!-- Icon -->
	<div class={`notification-icon notification-icon--${iconColor}`}>
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			aria-hidden="true"
		>
			{#if iconName === 'at-sign'}
				<circle cx="12" cy="12" r="4"></circle>
				<path d="m12 2a15.3 15.3 0 0 1 4 10"></path>
				<path d="M2 12a15.3 15.3 0 0 1 4-10"></path>
				<circle cx="12" cy="12" r="10"></circle>
			{:else if iconName === 'repeat'}
				<polyline points="17 1 21 5 17 9"></polyline>
				<path d="M3 11v-1a4 4 0 0 1 4-4h14"></path>
				<polyline points="7 23 3 19 7 15"></polyline>
				<path d="M21 13v1a4 4 0 0 1-4 4H3"></path>
			{:else if iconName === 'heart'}
				<path
					d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
				></path>
			{:else if iconName === 'user-plus'}
				<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
				<circle cx="8.5" cy="7" r="4"></circle>
				<line x1="20" y1="8" x2="20" y2="14"></line>
				<line x1="23" y1="11" x2="17" y2="11"></line>
			{:else if iconName === 'user-clock'}
				<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
				<circle cx="8.5" cy="7" r="4"></circle>
				<circle cx="18.5" cy="10.5" r="2.5"></circle>
				<path d="m19.5 8.5-.5 2h2"></path>
			{:else if iconName === 'bar-chart'}
				<line x1="12" y1="20" x2="12" y2="10"></line>
				<line x1="18" y1="20" x2="18" y2="4"></line>
				<line x1="6" y1="20" x2="6" y2="16"></line>
			{:else if iconName === 'message-circle'}
				<path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
			{:else if iconName === 'edit'}
				<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
			{:else if iconName === 'user-check'}
				<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
				<circle cx="8.5" cy="7" r="4"></circle>
				<polyline points="17,11 19,13 23,9"></polyline>
			{:else if iconName === 'flag'}
				<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
				<line x1="4" y1="22" x2="4" y2="15"></line>
			{:else}
				<!-- Default bell icon -->
				<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
				<path d="m13.73 21a2 2 0 0 1-3.46 0"></path>
			{/if}
		</svg>
	</div>

	<!-- Avatars -->
	<div class="avatars">
		{#each avatars as account (account.id)}
			<img
				src={account.avatar}
				alt={`${account.displayName} (@${account.acct})`}
				class="avatar"
				loading="lazy"
			/>
		{/each}
		{#if group && group.count > 4}
			<div class="avatar-overflow">
				+{group.count - 4}
			</div>
		{/if}
	</div>

	<!-- Content -->
	<div class="notification-content">
		<div class="notification-header">
			<h3 class="notification-title">{displayTitle}</h3>
			<time
				class="notification-time"
				id={`notification-time-${notification.id}`}
				datetime={createdAtDate?.toISOString()}
				title={createdAtDate?.toLocaleString()}
			>
				{timeString}
			</time>
		</div>

		{#if statusPreview}
			<div class="status-preview">
				<p>{statusPreview}</p>
			</div>
		{/if}

		{#if group && group.count > 1}
			<div class="group-summary">
				{group.count} notifications
			</div>
		{/if}
	</div>

	<!-- Actions -->
	{#if showActions}
		<div class="notification-actions">
			{#if isUnread && onMarkAsRead}
				<button
					class="action-button mark-read"
					onclick={handleMarkAsRead}
					title="Mark as read (M)"
					aria-label="Mark notification as read"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<polyline points="20,6 9,17 4,12"></polyline>
					</svg>
				</button>
			{/if}

			{#if onDismiss}
				<button
					class="action-button dismiss"
					onclick={handleDismiss}
					title="Dismiss (X)"
					aria-label="Dismiss notification"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			{/if}
		</div>
	{/if}
</article>
