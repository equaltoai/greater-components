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
	import GalleryGrid from './Grid.svelte';
	import { GAP_SIZES, type GapSize } from './utils.js';

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
		gap = 16,
		onItemClick,
		onLoadMore,
		class: className = '',
		scrollKey = 'masonry',
		itemRenderer,
	}: Props = $props();

	function gapToSize(gapPx: number): GapSize {
		if (gapPx <= GAP_SIZES.sm) return 'sm';
		if (gapPx <= GAP_SIZES.md) return 'md';
		return 'lg';
	}

	const gapSize = $derived(gapToSize(gap));
</script>

<GalleryGrid
	{items}
	columns="auto"
	gap={gapSize}
	clustering="none"
	{onLoadMore}
	{onItemClick}
	class={className}
	{scrollKey}
	{itemRenderer}
/>
