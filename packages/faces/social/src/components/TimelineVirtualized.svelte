<script lang="ts">
	import StatusCard from './StatusCard.svelte';
	import type { Status } from '../types';
	import type { StatusActionHandlers } from './Status/context.js';
	import type { Snippet } from 'svelte';

	interface Props {
		/**
		 * Array of status items to display
		 */
		items: Status[];
		/**
		 * Estimated height of each item (for virtualization)
		 */
		estimateSize?: number;
		/**
		 * Overscan count for virtualization
		 */
		overscan?: number;
		/**
		 * Whether to show a loading indicator at the top
		 */
		loadingTop?: boolean;
		/**
		 * Whether to show a loading indicator at the bottom
		 */
		loadingBottom?: boolean;
		/**
		 * Whether we've reached the end of the feed
		 */
		endReached?: boolean;
		/**
		 * Callback when scrolling near the top
		 */
		onLoadMore?: () => void;
		/**
		 * Callback when scrolling near the bottom
		 */
		onLoadPrevious?: () => void;
		/**
		 * Custom gap loader content
		 */
		gapLoader?: Snippet;
		/**
		 * Custom end of feed content
		 */
		endOfFeed?: Snippet;
		/**
		 * CSS class for the timeline
		 */
		class?: string;
		/**
		 * Density for status cards
		 */
		density?: 'compact' | 'comfortable';
		/**
		 * Action handlers to pass into StatusCard
		 */
		actionHandlers?: StatusActionHandlers | ((status: Status) => StatusActionHandlers | undefined);
	}

	let {
		items = [],
		loadingTop = false,
		loadingBottom = false,
		endReached = false,
		gapLoader,
		endOfFeed,
		class: className = '',
		density = 'comfortable',
		actionHandlers,
	}: Props = $props();
</script>

<div class={`timeline-virtualized ${className}`}>
	{#if loadingTop}
		<div class="loading-indicator top">
			<div class="spinner" role="status" aria-label="Loading new items"></div>
		</div>
	{/if}

	<div
		class="virtual-list"
		role="feed"
		aria-label="Timeline"
		aria-busy={loadingTop || loadingBottom}
	>
		{#each items as item, index (item?.id || index)}
			{@const handlersForItem =
				typeof actionHandlers === 'function' ? actionHandlers(item) : actionHandlers}
			<div class="virtual-row" role="article">
				<StatusCard status={item} {density} showActions={true} actionHandlers={handlersForItem} />
			</div>
		{/each}
	</div>

	{#if loadingBottom && !endReached}
		<div class="loading-indicator bottom">
			{#if gapLoader}
				{@render gapLoader()}
			{:else}
				<div class="spinner" role="status" aria-label="Loading more items"></div>
			{/if}
		</div>
	{/if}

	{#if endReached}
		<div class="end-of-feed">
			{#if endOfFeed}
				{@render endOfFeed()}
			{:else}
				<p>You've reached the end</p>
			{/if}
		</div>
	{/if}
</div>
