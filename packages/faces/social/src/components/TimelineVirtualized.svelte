<script lang="ts">
	import { createVirtualizer } from '@tanstack/svelte-virtual';
	import { untrack, type Snippet } from 'svelte';
	import { get } from 'svelte/store';
	import StatusCard from './StatusCard.svelte';
	import type { Status } from '../types';

	interface StatusCardActionHandlers {
		onReply?: (status: Status) => Promise<void> | void;
		onBoost?: (status: Status) => Promise<void> | void;
		onFavorite?: (status: Status) => Promise<void> | void;
		onShare?: (status: Status) => Promise<void> | void;
		onQuote?: (status: Status) => Promise<void> | void;
	}

	interface Props {
		/**
		 * Array of status items to display
		 */
		items: Status[];
		/**
		 * Disable virtualization (renders all rows)
		 * @default true
		 */
		virtualScrolling?: boolean;
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
		actionHandlers?:
			| StatusCardActionHandlers
			| ((status: Status) => StatusCardActionHandlers | undefined);
	}

	let {
		items = [],
		virtualScrolling = true,
		loadingTop = false,
		loadingBottom = false,
		endReached = false,
		onLoadMore,
		onLoadPrevious,
		gapLoader,
		endOfFeed,
		class: className = '',
		density = 'comfortable',
		actionHandlers,
		estimateSize = 400,
		overscan = 5,
	}: Props = $props();

	let scrollElement = $state<HTMLDivElement | null>(null);
	let prevScrollTop = 0;

	const rowVirtualizer = createVirtualizer<HTMLDivElement, HTMLElement>({
		count: untrack(() => items.length),
		getScrollElement: () => scrollElement,
		estimateSize: () => estimateSize,
		overscan: untrack(() => overscan),
		getItemKey: (index) => items[index]?.id ?? index,
		indexAttribute: 'data-index',
	});

	$effect(() => {
		get(rowVirtualizer).setOptions?.({
			count: items.length,
			estimateSize: () => estimateSize,
			overscan,
			enabled: virtualScrolling,
			getItemKey: (index) => items[index]?.id ?? index,
		});
	});

	function measureRow(node: HTMLElement) {
		get(rowVirtualizer).measureElement?.(node);
		return {
			update: () => get(rowVirtualizer).measureElement?.(node),
		};
	}

	function handleScroll() {
		if (!scrollElement) return;

		const { scrollTop, scrollHeight, clientHeight } = scrollElement;
		const scrollDirection = scrollTop > prevScrollTop ? 'down' : 'up';
		prevScrollTop = scrollTop;

		// Load more when scrolling near the bottom
		if (scrollDirection === 'down' && onLoadMore && !loadingBottom && !endReached) {
			const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
			if (distanceFromBottom < 500) {
				onLoadMore();
			}
		}

		// Load previous when scrolling near the top
		if (scrollDirection === 'up' && onLoadPrevious && !loadingTop && scrollTop < 500) {
			onLoadPrevious();
		}
	}
</script>

<div class={`timeline-virtualized ${className}`}>
	<div
		class="timeline-scroll"
		bind:this={scrollElement}
		onscroll={handleScroll}
		role="feed"
		aria-label="Timeline"
		aria-busy={loadingTop || loadingBottom}
	>
		{#if loadingTop}
			<div class="loading-indicator top">
				<div class="spinner" role="status" aria-label="Loading new items"></div>
			</div>
		{/if}

		<div
			class="virtual-list"
			style:height={virtualScrolling ? `${$rowVirtualizer.getTotalSize()}px` : 'auto'}
		>
			{#if virtualScrolling}
				{#each $rowVirtualizer.getVirtualItems() as virtualRow (virtualRow.key)}
					{@const item = items[virtualRow.index]}
					{#if item}
						{@const handlersForItem =
							typeof actionHandlers === 'function' ? actionHandlers(item) : actionHandlers}
						<div
							class="virtual-row"
							role="article"
							data-index={virtualRow.index}
							use:measureRow
							style={`position:absolute;top:0;left:0;width:100%;transform:translateY(${virtualRow.start}px)`}
						>
							<StatusCard
								status={item}
								{density}
								showActions={true}
								actionHandlers={handlersForItem}
							/>
						</div>
					{/if}
				{/each}
			{:else}
				{#each items as item, index (item?.id || index)}
					{@const handlersForItem =
						typeof actionHandlers === 'function' ? actionHandlers(item) : actionHandlers}
					<div class="virtual-row" role="article">
						<StatusCard
							status={item}
							{density}
							showActions={true}
							actionHandlers={handlersForItem}
						/>
					</div>
				{/each}
			{/if}
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
</div>
