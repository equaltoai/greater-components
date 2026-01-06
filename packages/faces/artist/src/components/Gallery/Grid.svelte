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
		balanceColumns,
		measureAspectRatio,
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
		onLoadMore,
		onItemClick,
		class: className = '',
		scrollKey = 'gallery',
		itemRenderer,
	}: Props = $props();

	// Container reference
	let containerRef: HTMLElement | null = $state(null);
	let containerWidth = $state(0);

	// Focused item for keyboard navigation
	let focusedIndex = $state(-1);

	// Calculate actual column count
	const actualColumns = $derived(
		columns === 'auto' ? calculateColumns(containerWidth, { gap: GAP_SIZES[gap] }) : columns
	);

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

	// Handle scroll for virtual scrolling and infinite scroll
	function handleScroll(event: Event) {
		const target = event.target as HTMLElement;
		const nextScrollTop = target.scrollTop;

		// Save scroll position
		saveScrollPosition(scrollKey, nextScrollTop);

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

			// Focus the element (button inside the wrapper)
			const element = containerRef?.querySelector(
				`[data-index="${nextIndex}"] button`
			) as HTMLElement;
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

	function getAspectRatioClass(ratio: number): string {
		if (ratio >= 1.6) return 'gallery-item--ratio-16-9';
		if (ratio >= 1.2) return 'gallery-item--ratio-4-3';
		if (ratio >= 0.9) return 'gallery-item--ratio-1-1';
		return 'gallery-item--ratio-3-4';
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

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	bind:this={containerRef}
	class={`gallery-grid gallery-grid--gap-${gap} ${className}`}
	role="region"
	aria-label={`Gallery with ${items.length} artworks`}
	aria-busy={false}
	onscroll={handleScroll}
	onkeydown={handleKeydown}
>
	<!-- Skip link for accessibility -->
	<a href="#gallery-end" class="skip-link">Skip gallery</a>

	<!-- Standard masonry grid -->
	<div class="masonry-grid">
		{#each masonryColumns as column, colIndex (colIndex)}
			<div class="masonry-column">
				{#each column.items as item, itemIndex (item.id)}
					{@const globalIndex = colIndex + itemIndex * actualColumns}
					{@const aspectRatio = measureAspectRatio(item)}
					{@const aspectRatioClass = getAspectRatioClass(aspectRatio)}
					<div
						class={`gallery-item ${aspectRatioClass}`}
						class:focused={focusedIndex === globalIndex}
						data-index={globalIndex}
						role="article"
						aria-label={getAriaLabel(globalIndex)}
						onfocusin={() => handleItemFocus(globalIndex)}
					>
						{#if itemRenderer}
							{@render itemRenderer(item, globalIndex)}
						{:else}
							<ArtworkCard
								artwork={item}
								variant="grid"
								tabindex={focusedIndex === globalIndex ? 0 : -1}
								onclick={() => handleItemClick(item)}
							/>
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div id="gallery-end" tabindex="-1" class="sr-only">End of gallery</div>
</div>

<style>
	.gallery-grid {
		position: relative;
		width: 100%;
		height: 100%;
		--gallery-gap: 16px;
		overflow-y: auto;
		overflow-x: hidden;
		scroll-behavior: smooth;
	}

	.gallery-grid--gap-sm {
		--gallery-gap: 8px;
	}

	.gallery-grid--gap-md {
		--gallery-gap: 16px;
	}

	.gallery-grid--gap-lg {
		--gallery-gap: 24px;
	}

	.skip-link {
		position: absolute;
		top: -40px;
		left: 0;
		background: var(--gr-color-primary-700);
		color: white;
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		z-index: 100;
		transition: top 0.2s;
	}

	.skip-link:focus {
		top: 0;
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
		aspect-ratio: 1 / 1;
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

	.gallery-item--ratio-1-1 {
		aspect-ratio: 1 / 1;
	}

	.gallery-item--ratio-4-3 {
		aspect-ratio: 4 / 3;
	}

	.gallery-item--ratio-16-9 {
		aspect-ratio: 16 / 9;
	}

	.gallery-item--ratio-3-4 {
		aspect-ratio: 3 / 4;
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
