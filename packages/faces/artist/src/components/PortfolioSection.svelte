<!--
PortfolioSection - Customizable gallery section within a profile

Features:
- Pre-defined section types
- Grid, row, or featured layout
- Drag-and-drop artwork reordering when editable
- Section visibility toggle

@component
@example
```svelte
<PortfolioSection
  title="Featured Works"
  items={artworks}
  layout="featured"
  editable={false}
/>
```
-->

<script lang="ts">
	import type { ArtworkData } from './Artwork/context.js';
	import ArtworkCard from './ArtworkCard.svelte';

	interface Props {
		/**
		 * Section title
		 */
		title: string;

		/**
		 * Section description
		 */
		description?: string;

		/**
		 * Artworks in section
		 */
		items?: ArtworkData[];

		/**
		 * Section layout
		 */
		layout?: 'grid' | 'row' | 'featured';

		/**
		 * Enable editing (drag-and-drop reordering)
		 */
		editable?: boolean;

		/**
		 * Callback when artwork order changes
		 */
		onReorder?: (itemIds: string[]) => void;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		title,
		description,
		items = [],
		layout = 'grid',
		editable = false,
		onReorder,
		class: className = '',
	}: Props = $props();

	// Drag state for reordering
	let draggedId: string | null = $state(null);
	let dragOverId: string | null = $state(null);

	// Handle drag start
	function handleDragStart(event: DragEvent, itemId: string) {
		if (!editable) return;
		draggedId = itemId;
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
		}
	}

	// Handle drag over
	function handleDragOver(event: DragEvent, itemId: string) {
		if (!editable || !draggedId || draggedId === itemId) return;
		event.preventDefault();
		dragOverId = itemId;
	}

	// Handle drop
	function handleDrop(event: DragEvent, targetId: string) {
		if (!editable || !draggedId || draggedId === targetId) return;
		event.preventDefault();

		const currentItems = [...items];
		const draggedIndex = currentItems.findIndex((i) => i.id === draggedId);
		const targetIndex = currentItems.findIndex((i) => i.id === targetId);

		if (draggedIndex !== -1 && targetIndex !== -1) {
			const [removed] = currentItems.splice(draggedIndex, 1);
			currentItems.splice(targetIndex, 0, removed);
			onReorder?.(currentItems.map((i) => i.id));
		}

		draggedId = null;
		dragOverId = null;
	}

	// Handle drag end
	function handleDragEnd() {
		draggedId = null;
		dragOverId = null;
	}

	// Grid columns based on layout
	const gridColumns = $derived(
		layout === 'featured'
			? 'repeat(auto-fill, minmax(400px, 1fr))'
			: 'repeat(auto-fill, minmax(280px, 1fr))'
	);
</script>

<section class={`portfolio-section portfolio-section--${layout} ${className}`}>
	<header class="portfolio-section__header">
		<h3 class="portfolio-section__title">{title}</h3>
		{#if description}
			<p class="portfolio-section__description">{description}</p>
		{/if}
	</header>

	{#if items.length > 0}
		<div
			class="portfolio-section__content"
			class:editable
			style:--grid-columns={gridColumns}
			role={layout === 'row' ? 'list' : 'grid'}
		>
			{#each items as item (item.id)}
				<div
					class="portfolio-section__item"
					class:dragging={draggedId === item.id}
					class:drag-over={dragOverId === item.id}
					draggable={editable}
					ondragstart={(e) => handleDragStart(e, item.id)}
					ondragover={(e) => handleDragOver(e, item.id)}
					ondrop={(e) => handleDrop(e, item.id)}
					ondragend={handleDragEnd}
					role={layout === 'row' ? 'listitem' : 'gridcell'}
				>
					<ArtworkCard artwork={item} variant={layout === 'featured' ? 'featured' : 'grid'} />
				</div>
			{/each}
		</div>
	{:else}
		<div class="portfolio-section__empty">
			<p>No artworks in this section yet.</p>
		</div>
	{/if}
</section>

<style>
	.portfolio-section {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-4);
	}

	.portfolio-section__header {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-2);
	}

	.portfolio-section__title {
		margin: 0;
		font-size: var(--gr-font-size-xl);
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-100);
	}

	.portfolio-section__description {
		margin: 0;
		font-size: var(--gr-font-size-md);
		color: var(--gr-color-gray-400);
	}

	.portfolio-section__content {
		display: grid;
		grid-template-columns: var(--grid-columns);
		gap: var(--gr-spacing-scale-4);
	}

	.portfolio-section--row .portfolio-section__content {
		display: flex;
		overflow-x: auto;
		gap: var(--gr-spacing-scale-4);
		padding-bottom: var(--gr-spacing-scale-2);
		scroll-snap-type: x mandatory;
	}

	.portfolio-section--row .portfolio-section__item {
		flex-shrink: 0;
		width: 280px;
		scroll-snap-align: start;
	}

	.portfolio-section__item {
		transition:
			opacity 0.2s,
			transform 0.2s;
	}

	.portfolio-section__item.dragging {
		opacity: 0.5;
	}

	.portfolio-section__item.drag-over {
		transform: scale(1.02);
	}

	.portfolio-section__content.editable .portfolio-section__item {
		cursor: grab;
	}

	.portfolio-section__content.editable .portfolio-section__item:active {
		cursor: grabbing;
	}

	.portfolio-section__empty {
		padding: var(--gr-spacing-scale-8);
		text-align: center;
		color: var(--gr-color-gray-500);
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radii-md);
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.portfolio-section__item {
			transition: none;
		}
	}
</style>
