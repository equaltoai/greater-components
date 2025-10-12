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
	import { getTimelineContext } from './context.js';
	import { createButton } from '@greater/headless/button';

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

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { loading, button, buttonText = 'Load more', class: className = '' }: Props = $props();

	const context = getTimelineContext();

	const loadMoreButton = createButton({
		onClick: async () => {
			if (!context.handlers.onLoadMore) return;

			loadMoreButton.helpers.setLoading(true);
			context.updateState({ loadingMore: true });

			try {
				await context.handlers.onLoadMore();
			} catch (error) {
				context.updateState({ error: error as Error });
			} finally {
				loadMoreButton.helpers.setLoading(false);
				context.updateState({ loadingMore: false });
			}
		},
	});

	const shouldShow = $derived(
		context.state.hasMore && !context.config.infiniteScroll && !context.state.loading
	);
</script>

{#if shouldShow || context.state.loadingMore}
	<div class="timeline-load-more {className}" role="status" aria-live="polite">
		{#if context.state.loadingMore}
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

<style>
	.timeline-load-more {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: var(--timeline-spacing, 1rem);
		border-bottom: 1px solid var(--timeline-border, #e1e8ed);
	}

	.timeline-load-more__spinner {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--timeline-text-secondary, #536471);
	}

	.timeline-load-more__spinner-icon {
		width: 24px;
		height: 24px;
		animation: spin 1s linear infinite;
	}

	.timeline-load-more__text {
		font-size: var(--timeline-font-size-base, 1rem);
	}

	.timeline-load-more__button {
		padding: 0.75rem 2rem;
		background: var(--timeline-button-bg, #1d9bf0);
		color: var(--timeline-button-text, white);
		border: none;
		border-radius: var(--timeline-button-radius, 9999px);
		font-size: var(--timeline-font-size-base, 1rem);
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.timeline-load-more__button:hover {
		background: var(--timeline-button-hover-bg, #1a8cd8);
		transform: translateY(-1px);
	}

	.timeline-load-more__button:active {
		transform: translateY(0);
	}

	.timeline-load-more__button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.timeline-load-more__spinner-icon {
			animation: none;
		}

		.timeline-load-more__button {
			transition: none;
		}
	}
</style>
