<!--
  Messages.UnreadIndicator - Unread Conversation Count Badge
  
  Displays the number of conversations with unread activity as a badge.
-->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import { getMessagesContext } from './context.svelte.js';

	const ANNOUNCEMENT_DEBOUNCE_MS = 150;
	const ANNOUNCEMENT_MAX_WAIT_MS = 1_000;

	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;

		/**
		 * Display style
		 */
		variant?: 'badge' | 'dot' | 'number';

		/**
		 * Size variant
		 */
		size?: 'small' | 'medium' | 'large';

		/**
		 * Show zero count
		 */
		showZero?: boolean;
	}

	let {
		class: className = '',
		variant = 'badge',
		size = 'medium',
		showZero = false,
	}: Props = $props();

	const { state: messagesState } = getMessagesContext();

	const unreadConversationCount = $derived(
		messagesState.conversations.reduce((sum, conversation) => {
			return sum + (conversation.unreadCount > 0 ? 1 : 0);
		}, 0)
	);

	const shouldShow = $derived(unreadConversationCount > 0 || showZero);

	const displayCount = $derived(
		unreadConversationCount > 99 ? '99+' : String(unreadConversationCount)
	);
	const announcement = $derived(
		`${unreadConversationCount} ${unreadConversationCount === 1 ? 'conversation' : 'conversations'} with unread messages`
	);
	let announcedMessage = $state('');
	let lastAnnouncedMessage = '';
	let pendingAnnouncement = '';
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;
	let maxWaitTimer: ReturnType<typeof setTimeout> | undefined;

	function clearAnnouncementTimers() {
		if (debounceTimer !== undefined) clearTimeout(debounceTimer);
		if (maxWaitTimer !== undefined) clearTimeout(maxWaitTimer);
		debounceTimer = undefined;
		maxWaitTimer = undefined;
	}

	function publishPendingAnnouncement() {
		clearAnnouncementTimers();
		if (pendingAnnouncement === lastAnnouncedMessage) return;

		lastAnnouncedMessage = pendingAnnouncement;
		announcedMessage = pendingAnnouncement;
	}

	$effect(() => {
		const nextAnnouncement = shouldShow ? announcement : '';
		pendingAnnouncement = nextAnnouncement;

		if (debounceTimer !== undefined) clearTimeout(debounceTimer);
		if (nextAnnouncement === lastAnnouncedMessage) {
			clearAnnouncementTimers();
			return;
		}

		debounceTimer = setTimeout(publishPendingAnnouncement, ANNOUNCEMENT_DEBOUNCE_MS);
		maxWaitTimer ??= setTimeout(publishPendingAnnouncement, ANNOUNCEMENT_MAX_WAIT_MS);
	});

	onDestroy(clearAnnouncementTimers);
</script>

{#if shouldShow}
	<span
		class={`unread-indicator unread-indicator--${variant} unread-indicator--${size} ${className}`}
		role="img"
		aria-label={announcement}
	>
		{#if variant === 'badge'}
			{displayCount}
		{:else if variant === 'number'}
			<span class="unread-indicator__number">{displayCount}</span>
		{/if}
	</span>
{/if}

<span class="unread-indicator__live-region" role="status" aria-live="polite" aria-atomic="true">
	{#if announcedMessage}
		<span class="gr-sr-only">{announcedMessage}</span>
	{/if}
</span>
