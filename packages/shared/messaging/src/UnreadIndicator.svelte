<!--
  Messages.UnreadIndicator - Unread Message Count Badge
  
  Displays unread message count as a badge.
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

	const unreadCount = $derived(
		messagesState.conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)
	);

	const shouldShow = $derived(unreadCount > 0 || showZero);

	const displayCount = $derived(unreadCount > 99 ? '99+' : String(unreadCount));
</script>

{#if shouldShow}
	<span
		class={`unread-indicator unread-indicator--${variant} unread-indicator--${size} ${className}`}
		aria-label={`${unreadCount} unread message${unreadCount === 1 ? '' : 's'}`}
	>
		{#if variant === 'badge'}
			{displayCount}
		{:else if variant === 'number'}
			<span class="unread-indicator__number">{displayCount}</span>
		{/if}
	</span>
{/if}
