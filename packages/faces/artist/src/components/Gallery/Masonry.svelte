<!--
GalleryMasonry - Variable-height masonry layout for artwork display

Implements masonry layout with column balancing and responsive design.
Supports virtual scrolling for large galleries.

@component
@example
```svelte
<GalleryMasonry
  items={artworks}
  columnWidth={280}
  gap={16}
/>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ArtworkData } from '../Artwork/context.js';
	import ArtworkCard from '../ArtworkCard.svelte';
	import {
		calculateColumns,
		calculateColumnWidth,
		calculateMasonryPositions,
		shouldUseVirtualScrolling,
		createVirtualScroller,
		saveScrollPosition,
		restoreScrollPosition,
	} from './utils.js';

	interface Props {
		/**
		 * Array of artwork items to display
		 */
		items: ArtworkData[];

		/**
		 * Target column width in pixels
		 */
		columnWidth?: number;

		/**
		 * Gap between items in pixels
		 */
		gap?: number;

		/**
		 * Enable virtual scrolling
		 */
		virtualScrolling?: boolean;

		/**
		 * Callback when an item is clicked
		 */
		onItemClick?: (item: ArtworkData) => void;

		/**
		 * Callback when more items should be loaded
		 */
		onLoadMore?: () => void;

		/**
		 * Custom CSS class
		 */
		class?: string;

		/**
		 * Unique key for scroll position persistence
		 */
		scrollKey?: string;

		/**
		 * Custom item renderer
		 */
		itemRenderer?: Snippet<[ArtworkData, number]>;
	}

	let {
		items = [],
		columnWidth = 280,
		gap = 16,
		virtualScrolling = false,
		onItemClick,
		onLoadMore,
		class: className = '',
		scrollKey = 'masonry',
		itemRenderer,
	}: Props = $props();

	// Container reference
	let containerRef: HTMLElement | null = $state(null);
	let containerWidth = $state(0);
	let containerHeight = $state(0);
	let scrollTop = $state(0);

	// Calculate column count based on container width
	const columnCount = $derived(calculateColumns(containerWidth, { minWidth: columnWidth, gap }));

	// Calculate actual column width
	const actualColumnWidth = $derived(calculateColumnWidth(containerWidth, columnCount, gap));

	// Calculate positions for all items
	const positions = $derived(calculateMasonryPositions(items, columnCount, actualColumnWidth, gap));

	// Calculate total height
	const totalHeight = $derived.by(() => {
		if (positions.length === 0) return 0;
		return Math.max(...positions.map((p) => p.y + p.height)) + gap;
	});

	// Determine if virtual scrolling should be used
	const useVirtualScrolling = $derived(virtualScrolling || shouldUseVirtualScrolling(items.length));

	// Virtual scroll state
	const virtualState = $derived.by(() => {
		if (!useVirtualScrolling) return null;

		return createVirtualScroller(
			{
				containerHeight,
				estimatedItemHeight: actualColumnWidth / 1.5,
				overscan: 5,
				totalItems: items.length,
			},
			scrollTop
		);
	});

	// Filter visible positions for virtual scrolling
	const visiblePositions = $derived.by(() => {
		if (!useVirtualScrolling || !virtualState) {
			return positions;
		}

		const viewportTop = scrollTop - 200;
		const viewportBottom = scrollTop + containerHeight + 200;

		return positions.filter((p) => p.y + p.height >= viewportTop && p.y <= viewportBottom);
	});

	// Handle scroll
	function handleScroll(event: Event) {
		const target = event.target as HTMLElement;
		scrollTop = target.scrollTop;

		// Save scroll position
		saveScrollPosition(scrollKey, scrollTop);

		// Check for infinite scroll trigger
		if (onLoadMore) {
			const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
			if (scrollBottom < 200) {
				onLoadMore();
			}
		}
	}

	// Handle item click
	function handleItemClick(item: ArtworkData) {
		onItemClick?.(item);
	}

	// Observe container size
	$effect(() => {
		if (!containerRef) return;

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				containerWidth = entry.contentRect.width;
				containerHeight = entry.contentRect.height;
			}
		});

		observer.observe(containerRef);

		// Restore scroll position
		const savedPosition = restoreScrollPosition(scrollKey);
		if (savedPosition > 0) {
			containerRef.scrollTop = savedPosition;
		}

		return () => observer.disconnect();
	});
</script>

<div
	bind:this={containerRef}
	class={`gallery-masonry ${className}`}
	role="feed"
	aria-label={`Masonry gallery with ${items.length} artworks`}
	onscroll={handleScroll}
>
	<div class="masonry-container" style:height={`${totalHeight}px`}>
		{#each visiblePositions as position, index (position.item.id)}
			<div
				class="masonry-item"
				style:transform={`translate(${position.x}px, ${position.y}px)`}
				style:width={`${position.width}px`}
				style:height={`${position.height}px`}
				role="article"
				aria-label={`${position.item.title} by ${position.item.artist.name}`}
			>
				<button
					class="item-button"
					onclick={() => handleItemClick(position.item)}
					tabindex={index === 0 ? 0 : -1}
				>
					{#if itemRenderer}
						{@render itemRenderer(position.item, index)}
					{:else}
						<ArtworkCard artwork={position.item} variant="masonry" tagName="div" />
					{/if}
				</button>
			</div>
		{/each}
	</div>
</div>

<style>
	.gallery-masonry {
		position: relative;
		width: 100%;
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		scroll-behavior: smooth;
	}

	.masonry-container {
		position: relative;
		width: 100%;
	}

	.masonry-item {
		position: absolute;
		top: 0;
		left: 0;
		will-change: transform;
		transition: transform 0.3s ease-out;
	}

	.item-button {
		display: block;
		width: 100%;
		height: 100%;
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
		border-radius: var(--gr-radii-md);
		overflow: hidden;
		transition:
			transform 0.2s ease-out,
			box-shadow 0.2s ease-out;
	}

	.item-button:hover {
		transform: translateY(-2px);
		box-shadow: var(--gr-shadow-lg);
	}

	.item-button:focus {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.gallery-masonry {
			scroll-behavior: auto;
		}

		.masonry-item {
			transition: none;
		}

		.item-button {
			transition: none;
		}
	}
</style>
