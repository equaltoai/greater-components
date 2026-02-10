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
		 * Whether to show a delete action (hidden by default)
		 */
		showDelete?: boolean;

		/**
		 * Label for delete action
		 */
		deleteLabel?: string;

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

	let {
		actions,
		size = 'sm',
		readonly = false,
		class: className = '',
		showDelete = false,
		deleteLabel = 'Delete',
	}: Props = $props();

	const context = getStatusContext();
	const { actualStatus, handlers, config } = context;

	// Only show if configured to show actions
	const isTombstone = $derived(
		(context.status as unknown as { type?: string }).type === 'tombstone' ||
			(context.status as unknown as { isDeleted?: boolean }).isDeleted === true ||
			(context.status as unknown as { metadata?: { lesser?: { isDeleted?: boolean } } })?.metadata
				?.lesser?.isDeleted === true
	);
	const shouldShowActions = $derived(config.showActions && !isTombstone);

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
	let deleteLoading = $state(false);
	const shouldShowDelete = $derived(showDelete && !!handlers.onDelete);

	async function handleDelete() {
		if (readonly || deleteLoading || !handlers.onDelete) return;

		deleteLoading = true;
		try {
			await handlers.onDelete(context.status);
		} catch (error) {
			console.error('Delete action failed:', error);
		} finally {
			deleteLoading = false;
		}
	}
</script>

{#if shouldShowActions}
	<div class={`status-actions ${className}`}>
		{#if actions}
			{@render actions()}
		{:else}
			{#snippet deleteExtension()}
				<button
					class="status-actions__delete"
					onclick={handleDelete}
					disabled={readonly || deleteLoading}
					aria-label={deleteLabel}
				>
					{deleteLoading ? 'Deleting…' : deleteLabel}
				</button>
			{/snippet}

			<ActionBar
				counts={{
					replies: actualStatus.repliesCount,
					boosts: actualStatus.reblogsCount,
					favorites: actualStatus.favouritesCount,
					quotes: quoteCount,
				}}
				states={{
					// Only show active styling when the current user has boosted
					boosted: actualStatus.reblogged,
					favorited: actualStatus.favourited,
					bookmarked: actualStatus.bookmarked,
				}}
				handlers={wrappedHandlers}
				shareUrl={actualStatus.url}
				shareTitle={`Post by ${context.account.displayName || context.account.username || 'Unknown'}`}
				{readonly}
				{size}
				idPrefix={`status-${actualStatus.id}`}
				extensions={shouldShowDelete ? deleteExtension : undefined}
			/>
		{/if}
	</div>
{/if}
