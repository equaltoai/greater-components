<!--
  Messages.UnreadIndicator - Unread Conversation Count Badge
  
  Displays the number of conversations with unread activity as a badge.
-->
<script lang="ts">
	import { getMessagesContext } from './context.svelte.js';

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

	$effect(() => {
		const nextAnnouncement = shouldShow ? announcement : '';
		const timer = setTimeout(() => {
			announcedMessage = nextAnnouncement;
		}, 150);

		return () => clearTimeout(timer);
	});
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
