<!--
Status.Actions - Display action buttons for status interactions

Provides reply, boost, favorite, and share actions.
Uses handlers from context.

@component
@example
```svelte
<Status.Root status={post} handlers={{ onBoost, onFavorite }}>
  <Status.Actions />
</Status.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getStatusContext } from './context.js';
	import ActionBar from '../ActionBar.svelte';

	interface Props {
		/**
		 * Custom actions rendering
		 */
		actions?: Snippet;

		/**
		 * Size of action buttons
		 */
		size?: 'sm' | 'md' | 'lg';

		/**
		 * Whether actions are read-only (no handlers)
		 */
		readonly?: boolean;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { actions, size = 'sm', readonly = false, class: className = '' }: Props = $props();

	const context = getStatusContext();
	const { actualStatus, handlers, config } = context;

	// Only show if configured to show actions
	const shouldShowActions = $derived(config.showActions);

	// Wrap handlers to pass the status
	const wrappedHandlers = $derived({
		onReply: handlers.onReply ? () => handlers.onReply!(context.status) : undefined,
		onBoost: handlers.onBoost ? () => handlers.onBoost!(context.status) : undefined,
		onFavorite: handlers.onFavorite ? () => handlers.onFavorite!(context.status) : undefined,
		onShare: handlers.onShare ? () => handlers.onShare!(context.status) : undefined,
		onQuote: handlers.onQuote ? () => handlers.onQuote!(context.status) : undefined,
	});

	// Get quote count from Lesser metadata
	import type { Status as FediverseStatus } from '../../types.js';
	const extendedStatus = actualStatus as unknown as FediverseStatus;
	const quoteCount = $derived(extendedStatus.quoteCount);
</script>

{#if shouldShowActions}
	<div class={`status-actions ${className}`}>
		{#if actions}
			{@render actions()}
		{:else}
			<ActionBar
				counts={{
					replies: actualStatus.repliesCount,
					boosts: actualStatus.reblogsCount,
					favorites: actualStatus.favouritesCount,
					quotes: quoteCount,
				}}
				states={{
					boosted: actualStatus.reblogged,
					favorited: actualStatus.favourited,
					bookmarked: actualStatus.bookmarked,
				}}
				handlers={wrappedHandlers}
				{readonly}
				{size}
				idPrefix={`status-${actualStatus.id}`}
			/>
		{/if}
	</div>
{/if}

<style>
	.status-actions {
		margin-top: var(--status-spacing-sm, 0.5rem);
		padding-top: var(--status-spacing-sm, 0.5rem);
	}

	/* Compact density adjustments */
	:global(.status-root--compact) .status-actions {
		margin-top: var(--status-spacing-xs, 0.25rem);
		padding-top: var(--status-spacing-xs, 0.25rem);
	}
</style>
