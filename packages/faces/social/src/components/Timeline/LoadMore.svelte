<!--
Timeline.LoadMore - Load more items trigger

Displays loading state and triggers loading more items.
Automatically triggered with infinite scroll or manually by user.

@component
@example
```svelte
<Timeline.Root {items} handlers={{ onLoadMore }}>
  {#each items as item}
    <Timeline.Item {status} />
  {/each}
  <Timeline.LoadMore />
</Timeline.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getOptionalTimelineContext } from './context.js';
	import { createButton } from '@equaltoai/greater-components-headless/button';

	interface Props {
		/**
		 * Custom loading content
		 */
		loading?: Snippet;

		/**
		 * Custom load more button
		 */
		button?: Snippet;

		/**
		 * Text for load more button
		 */
		buttonText?: string;

		/** Load-more handler used when the control is outside Timeline.Root. */
		onLoadMore?: () => Promise<void> | void;

		/** Whether another page is available when used outside Timeline.Root. */
		hasMore?: boolean;

		/** Whether the parent timeline is initially loading when used standalone. */
		isLoading?: boolean;

		/** Hide the manual control when an alternative renderer handles infinite scrolling. */
		infiniteScroll?: boolean;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let {
		loading,
		button,
		buttonText = 'Load more',
		onLoadMore,
		hasMore = true,
		isLoading = false,
		infiniteScroll = false,
		class: className = '',
	}: Props = $props();

	const context = getOptionalTimelineContext();
	let standaloneLoadingMore = $state(false);
	const loadingMore = $derived(context?.state.loadingMore ?? standaloneLoadingMore);

	const loadMoreButton = createButton({
		onClick: async () => {
			const handler = onLoadMore ?? context?.handlers.onLoadMore;
			if (!handler) return;

			loadMoreButton.helpers.setLoading(true);
			standaloneLoadingMore = true;
			context?.updateState({ loadingMore: true });

			try {
				await handler();
			} catch (error) {
				context?.updateState({ error: error as Error });
			} finally {
				loadMoreButton.helpers.setLoading(false);
				standaloneLoadingMore = false;
				context?.updateState({ loadingMore: false });
			}
		},
	});

	const shouldShow = $derived(
		(context?.state.hasMore ?? hasMore) &&
			!(context?.config.infiniteScroll ?? infiniteScroll) &&
			!(context?.state.loading ?? isLoading)
	);
</script>

{#if shouldShow || loadingMore}
	<div class={`timeline-load-more ${className}`} role="status" aria-live="polite">
		{#if loadingMore}
			{#if loading}
				{@render loading()}
			{:else}
				<div class="timeline-load-more__spinner">
					<svg class="timeline-load-more__spinner-icon" viewBox="0 0 24 24" aria-hidden="true">
						<path
							fill="currentColor"
							d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"
						/>
						<path fill="currentColor" d="M12 4a8 8 0 0 0-8 8h2a6 6 0 0 1 6-6z" />
					</svg>
					<span class="timeline-load-more__text">Loading more...</span>
				</div>
			{/if}
		{:else if button}
			{@render button()}
		{:else}
			<button use:loadMoreButton.actions.button class="timeline-load-more__button">
				{buttonText}
			</button>
		{/if}
	</div>
{/if}
