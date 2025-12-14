<!--
GalleryGrid - Masonry-style grid layout for artwork display

Implements REQ-VIEW-001: Masonry-style grid layout
Implements REQ-PERF-005: Virtual scrolling for galleries > 50 items
Implements REQ-A11Y-004: Keyboard navigation with arrow keys

@component
@example
```svelte
<GalleryGrid
  items={artworks}
  columns="auto"
  gap="md"
  clustering="artist"
  virtualScrolling={true}
  onLoadMore={() => loadMore()}
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
		balanceColumns,
		measureAspectRatio,
		shouldUseVirtualScrolling,
		createVirtualScroller,
		clusterByArtist,
		clusterByTheme,
		clusterSmart,
		getNextIndex,
		getPositionInfo,
		saveScrollPosition,
		restoreScrollPosition,
		GAP_SIZES,
		type GapSize,
		type ClusteringMode,
	} from './utils.js';

	interface Props {
		/**
		 * Array of artwork items to display
		 */
		items: ArtworkData[];

		/**
		 * Number of columns or 'auto' for responsive
		 */
		columns?: number | 'auto';

		/**
		 * Gap between items
		 */
		gap?: GapSize;

		/**
		 * Clustering mode for items
		 */
		clustering?: ClusteringMode;

		/**
		 * Enable virtual scrolling (auto-enabled for > 50 items)
		 */
		virtualScrolling?: boolean;

		/**
		 * Callback when more items should be loaded
		 */
		onLoadMore?: () => void;

		/**
		 * Callback when an item is clicked
		 */
		onItemClick?: (item: ArtworkData) => void;

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
		columns = 'auto',
		gap = 'md',
		clustering = 'none',
		virtualScrolling = false,
		onLoadMore,
		onItemClick,
		class: className = '',
		scrollKey = 'gallery',
		itemRenderer,
	}: Props = $props();

	// Container reference
	let containerRef: HTMLElement | null = $state(null);
	let containerWidth = $state(0);
	let containerHeight = $state(0);
	let scrollTop = $state(0);

	// Focused item for keyboard navigation
	let focusedIndex = $state(-1);

	// Calculate actual column count
	const actualColumns = $derived(
		columns === 'auto' ? calculateColumns(containerWidth, { gap: GAP_SIZES[gap] }) : columns
	);

	// Calculate column width
	const columnWidth = $derived(calculateColumnWidth(containerWidth, actualColumns, GAP_SIZES[gap]));

	// Process items based on clustering
	const processedItems = $derived.by(() => {
		if (clustering === 'none') return items;
		if (clustering === 'smart') return clusterSmart(items);

		// For artist/theme clustering, flatten the map back to array
		const clusters = clustering === 'artist' ? clusterByArtist(items) : clusterByTheme(items);

		const result: ArtworkData[] = [];
		for (const [, clusterItems] of clusters) {
			result.push(...clusterItems);
		}
		return result;
	});

	// Balance items across columns for masonry layout
	const masonryColumns = $derived(balanceColumns(processedItems, actualColumns));

	// Determine if virtual scrolling should be used
	const useVirtualScrolling = $derived(virtualScrolling || shouldUseVirtualScrolling(items.length));

	// Virtual scroll state
	const virtualState = $derived.by(() => {
		if (!useVirtualScrolling) return null;

		return createVirtualScroller(
			{
				containerHeight,
				estimatedItemHeight: columnWidth / 1.5, // Assume average aspect ratio
				overscan: 5,
				totalItems: processedItems.length,
			},
			scrollTop
		);
	});

	// Handle scroll for virtual scrolling and infinite scroll
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

	// Handle keyboard navigation (REQ-A11Y-004)
	function handleKeydown(event: KeyboardEvent) {
		if (focusedIndex < 0) return;

		let direction: 'up' | 'down' | 'left' | 'right' | null = null;

		switch (event.key) {
			case 'ArrowUp':
				direction = 'up';
				break;
			case 'ArrowDown':
				direction = 'down';
				break;
			case 'ArrowLeft':
				direction = 'left';
				break;
			case 'ArrowRight':
				direction = 'right';
				break;
			case 'Enter':
			case ' ':
				if (onItemClick) {
					const item = processedItems[focusedIndex];
					if (item) onItemClick(item);
				}
				event.preventDefault();
				return;
			default:
				return;
		}

		if (direction) {
			event.preventDefault();
			const nextIndex = getNextIndex(focusedIndex, direction, actualColumns, processedItems.length);
			focusedIndex = nextIndex;

			// Focus the element
			const element = containerRef?.querySelector(`[data-index="${nextIndex}"]`) as HTMLElement;
			element?.focus();
		}
	}

	// Handle item focus
	function handleItemFocus(index: number) {
		focusedIndex = index;
	}

	// Handle item click
	function handleItemClick(item: ArtworkData) {
		onItemClick?.(item);
	}

	// Get position info for screen reader
	function getAriaLabel(index: number): string {
		const { row, column, totalRows } = getPositionInfo(index, actualColumns, processedItems.length);
		return `Gallery, ${processedItems.length} artworks, row ${row} of ${totalRows}, column ${column} of ${actualColumns}`;
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

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	bind:this={containerRef}
	class={`gallery-grid ${className}`}
	role="feed"
	aria-label={`Gallery with ${items.length} artworks`}
	aria-busy={false}
	onscroll={handleScroll}
	onkeydown={handleKeydown}
	tabindex="0"
	style:--gallery-columns={actualColumns}
	style:--gallery-gap={`${GAP_SIZES[gap]}px`}
>
	<!-- Skip link for accessibility -->
	<a href="#gallery-end" class="skip-link">Skip gallery</a>

	{#if useVirtualScrolling && virtualState}
		<!-- Virtual scrolling container -->
		<div class="virtual-container" style:height={`${virtualState.totalHeight}px`}>
			<div class="virtual-content" style:transform={`translateY(${virtualState.offsetTop}px)`}>
				<div class="masonry-grid">
					{#each masonryColumns as column, colIndex (colIndex)}
						<div class="masonry-column">
							{#each column.items as item, itemIndex (item.id)}
								{@const globalIndex = colIndex + itemIndex * actualColumns}
								{@const aspectRatio = measureAspectRatio(item)}
								<div
									class="gallery-item"
									class:focused={focusedIndex === globalIndex}
									data-index={globalIndex}
									tabindex={globalIndex === 0 ? 0 : -1}
									role="button"
									aria-label={getAriaLabel(globalIndex)}
									onfocus={() => handleItemFocus(globalIndex)}
									onclick={() => handleItemClick(item)}
									onkeydown={(e) => e.key === 'Enter' && handleItemClick(item)}
									style:--aspect-ratio={aspectRatio}
								>
									{#if itemRenderer}
										{@render itemRenderer(item, globalIndex)}
									{:else}
										<ArtworkCard artwork={item} variant="grid" />
									{/if}
								</div>
							{/each}
						</div>
					{/each}
				</div>
			</div>
		</div>
	{:else}
		<!-- Standard masonry grid -->
		<div class="masonry-grid">
			{#each masonryColumns as column, colIndex (colIndex)}
				<div class="masonry-column">
					{#each column.items as item, itemIndex (item.id)}
						{@const globalIndex = colIndex + itemIndex * actualColumns}
						{@const aspectRatio = measureAspectRatio(item)}
						<div
							class="gallery-item"
							class:focused={focusedIndex === globalIndex}
							data-index={globalIndex}
							tabindex={globalIndex === 0 ? 0 : -1}
							role="button"
							aria-label={getAriaLabel(globalIndex)}
							onfocus={() => handleItemFocus(globalIndex)}
							onclick={() => handleItemClick(item)}
							onkeydown={(e) => e.key === 'Enter' && handleItemClick(item)}
							style:--aspect-ratio={aspectRatio}
						>
							{#if itemRenderer}
								{@render itemRenderer(item, globalIndex)}
							{:else}
								<ArtworkCard artwork={item} variant="grid" />
							{/if}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	{/if}

	<div id="gallery-end" tabindex="-1" class="sr-only">End of gallery</div>
</div>

<style>
	.gallery-grid {
		position: relative;
		width: 100%;
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		scroll-behavior: smooth;
	}

	.skip-link {
		position: absolute;
		top: -40px;
		left: 0;
		background: var(--gr-color-primary-500);
		color: white;
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		z-index: 100;
		transition: top 0.2s;
	}

	.skip-link:focus {
		top: 0;
	}

	.virtual-container {
		position: relative;
		width: 100%;
	}

	.virtual-content {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
	}

	.masonry-grid {
		display: flex;
		gap: var(--gallery-gap);
		width: 100%;
	}

	.masonry-column {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--gallery-gap);
	}

	.gallery-item {
		position: relative;
		width: 100%;
		aspect-ratio: var(--aspect-ratio, 1);
		border-radius: var(--gr-radii-md);
		overflow: hidden;
		cursor: pointer;
		transition:
			transform 0.2s ease-out,
			box-shadow 0.2s ease-out;
	}

	.gallery-item:hover {
		transform: translateY(-2px);
		box-shadow: var(--gr-shadow-lg);
	}

	.gallery-item:focus {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.gallery-item.focused {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* Reduced motion support - REQ-A11Y-007 */
	@media (prefers-reduced-motion: reduce) {
		.gallery-grid {
			scroll-behavior: auto;
		}

		.gallery-item {
			transition: none;
		}
	}

	/* Mobile-first responsive breakpoints - REQ-DESIGN-006 */
	@media (max-width: 640px) {
		.masonry-grid {
			gap: var(--gr-spacing-scale-2);
		}
	}
</style>
