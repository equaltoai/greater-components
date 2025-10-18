<!--
  Messages.UnreadIndicator - Unread Message Count Badge
  
  Displays unread message count as a badge.
-->
<script lang="ts">
	import { getMessagesContext } from './context.js';

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

<style>
	.unread-indicator {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		line-height: 1;
		background: #f4211e;
		color: white;
	}

	/* Badge variant */
	.unread-indicator--badge {
		padding: 0.125rem 0.375rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		min-width: 1.25rem;
	}

	.unread-indicator--badge.unread-indicator--small {
		padding: 0.0625rem 0.25rem;
		font-size: 0.625rem;
		min-width: 1rem;
	}

	.unread-indicator--badge.unread-indicator--large {
		padding: 0.25rem 0.5rem;
		font-size: 0.875rem;
		min-width: 1.5rem;
	}

	/* Dot variant */
	.unread-indicator--dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		padding: 0;
	}

	.unread-indicator--dot.unread-indicator--small {
		width: 0.375rem;
		height: 0.375rem;
	}

	.unread-indicator--dot.unread-indicator--large {
		width: 0.625rem;
		height: 0.625rem;
	}

	/* Number variant */
	.unread-indicator--number {
		padding: 0;
		background: transparent;
		color: #f4211e;
		font-size: 0.875rem;
	}

	.unread-indicator--number.unread-indicator--small {
		font-size: 0.75rem;
	}

	.unread-indicator--number.unread-indicator--large {
		font-size: 1rem;
	}

	.unread-indicator__number {
		font-weight: 700;
	}
</style>
