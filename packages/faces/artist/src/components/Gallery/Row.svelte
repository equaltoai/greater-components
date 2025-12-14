<!--
GalleryRow - Horizontal scrolling row for curated artwork selections

Implements REQ-DESIGN-006: Touch-optimized swipe gestures
Features scroll snap, navigation arrows, and lazy loading.

@component
@example
```svelte
<GalleryRow
  items={curatedArtworks}
  title="Featured Works"
  showAllLink="/gallery/featured"
  cardSize="md"
/>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ArtworkData } from '../Artwork/context.js';
	import ArtworkCard from '../ArtworkCard.svelte';

	interface Props {
		/**
		 * Array of artwork items to display
		 */
		items: ArtworkData[];

		/**
		 * Section title
		 */
		title?: string;

		/**
		 * Link to full collection
		 */
		showAllLink?: string;

		/**
		 * Card size variant
		 */
		cardSize?: 'sm' | 'md' | 'lg';

		/**
		 * Callback when an item is clicked
		 */
		onItemClick?: (item: ArtworkData) => void;

		/**
		 * Custom CSS class
		 */
		class?: string;

		/**
		 * Custom item renderer
		 */
		itemRenderer?: Snippet<[ArtworkData, number]>;
	}

	let {
		items = [],
		title,
		showAllLink,
		cardSize = 'md',
		onItemClick,
		class: className = '',
		itemRenderer,
	}: Props = $props();

	// Container reference
	let scrollContainerRef: HTMLElement | null = $state(null);
	let canScrollLeft = $state(false);
	let canScrollRight = $state(true);

	// Card sizes in pixels
	const cardSizes = {
		sm: 200,
		md: 280,
		lg: 360,
	};

	const cardWidth = $derived(cardSizes[cardSize]);

	// Track visible items for lazy loading
	let visibleIndices = $state<Set<number>>(new Set());

	// Update scroll state
	function updateScrollState() {
		if (!scrollContainerRef) return;

		const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef;
		canScrollLeft = scrollLeft > 0;
		canScrollRight = scrollLeft < scrollWidth - clientWidth - 10;
	}

	// Scroll by one card width
	function scrollBy(direction: 'left' | 'right') {
		if (!scrollContainerRef) return;

		const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
		scrollContainerRef.scrollBy({
			left: scrollAmount,
			behavior: 'smooth',
		});
	}

	// Handle keyboard navigation
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			scrollBy('left');
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			scrollBy('right');
		}
	}

	// Handle item click
	function handleItemClick(item: ArtworkData) {
		onItemClick?.(item);
	}

	// Intersection observer for lazy loading
	$effect(() => {
		if (!scrollContainerRef) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const index = parseInt((entry.target as HTMLElement).dataset['index'] || '0', 10);
					if (entry.isIntersecting) {
						visibleIndices = new Set([...visibleIndices, index]);
					}
				}
			},
			{
				root: scrollContainerRef,
				rootMargin: '100px',
				threshold: 0,
			}
		);

		const items = scrollContainerRef.querySelectorAll('.row-item');
		items.forEach((item) => observer.observe(item));

		return () => observer.disconnect();
	});

	// Update scroll state on mount and scroll
	$effect(() => {
		if (!scrollContainerRef) return;

		updateScrollState();
		scrollContainerRef.addEventListener('scroll', updateScrollState);

		return () => {
			scrollContainerRef?.removeEventListener('scroll', updateScrollState);
		};
	});
</script>

<section class={`gallery-row ${className}`} aria-label={title || 'Gallery row'}>
	{#if title || showAllLink}
		<header class="row-header">
			{#if title}
				<h2 class="row-title">{title}</h2>
			{/if}
			{#if showAllLink}
				<a href={showAllLink} class="show-all-link">
					Show All
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
						<path
							d="M6 12L10 8L6 4"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</a>
			{/if}
		</header>
	{/if}

	<div class="row-container">
		<!-- Left navigation arrow (desktop) -->
		<button
			class="nav-arrow nav-arrow-left"
			class:hidden={!canScrollLeft}
			onclick={() => scrollBy('left')}
			aria-label="Scroll left"
			tabindex={canScrollLeft ? 0 : -1}
		>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<path
					d="M15 18L9 12L15 6"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>

		<!-- Scrollable row -->
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			bind:this={scrollContainerRef}
			class="row-scroll"
			role="region"
			aria-label={`${items.length} artworks`}
			onkeydown={handleKeydown}
			tabindex="0"
		>
			{#each items as item, index (item.id)}
				<div
					class="row-item"
					class:loaded={visibleIndices.has(index)}
					data-index={index}
					style:--card-width={`${cardWidth}px`}
				>
					{#if visibleIndices.has(index) || index < 5}
						<button
							class="item-button"
							onclick={() => handleItemClick(item)}
							aria-label={`${item.title} by ${item.artist.name}`}
						>
							{#if itemRenderer}
								{@render itemRenderer(item, index)}
							{:else}
								<ArtworkCard artwork={item} variant="row" size={cardSize} />
							{/if}
						</button>
					{:else}
						<!-- Placeholder for lazy loading -->
						<div class="item-placeholder" aria-hidden="true"></div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Right navigation arrow (desktop) -->
		<button
			class="nav-arrow nav-arrow-right"
			class:hidden={!canScrollRight}
			onclick={() => scrollBy('right')}
			aria-label="Scroll right"
			tabindex={canScrollRight ? 0 : -1}
		>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<path
					d="M9 18L15 12L9 6"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
	</div>
</section>

<style>
	.gallery-row {
		position: relative;
		width: 100%;
	}

	.row-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--gr-spacing-scale-4) var(--gr-spacing-scale-4) var(--gr-spacing-scale-2);
	}

	.row-title {
		font-size: var(--gr-font-size-lg);
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-100);
		margin: 0;
	}

	.show-all-link {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		color: var(--gr-color-primary-400);
		text-decoration: none;
		font-size: var(--gr-font-size-sm);
		font-weight: var(--gr-font-weight-medium);
		transition: color 0.2s;
	}

	.show-all-link:hover {
		color: var(--gr-color-primary-300);
	}

	.row-container {
		position: relative;
		display: flex;
		align-items: center;
	}

	.nav-arrow {
		position: absolute;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: var(--gr-color-gray-800);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: 50%;
		color: var(--gr-color-gray-100);
		cursor: pointer;
		opacity: 1;
		transition:
			opacity 0.2s,
			background 0.2s;
	}

	.nav-arrow:hover {
		background: var(--gr-color-gray-700);
	}

	.nav-arrow:focus {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.nav-arrow.hidden {
		opacity: 0;
		pointer-events: none;
	}

	.nav-arrow-left {
		left: var(--gr-spacing-scale-2);
	}

	.nav-arrow-right {
		right: var(--gr-spacing-scale-2);
	}

	.row-scroll {
		display: flex;
		gap: var(--gr-spacing-scale-4);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
		scrollbar-width: none;
		-ms-overflow-style: none;
		-webkit-overflow-scrolling: touch; /* REQ-DESIGN-006: Touch-optimized */
	}

	.row-scroll::-webkit-scrollbar {
		display: none;
	}

	.row-scroll:focus {
		outline: none;
	}

	.row-scroll:focus-visible {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.row-item {
		flex-shrink: 0;
		width: var(--card-width);
		scroll-snap-align: start;
	}

	.item-button {
		display: block;
		width: 100%;
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
		transition: transform 0.2s;
	}

	.item-button:hover {
		transform: scale(1.02);
	}

	.item-button:focus {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
		border-radius: var(--gr-radii-md);
	}

	.item-placeholder {
		width: 100%;
		aspect-ratio: 1;
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radii-md);
		animation: pulse 1.5s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	/* Hide navigation arrows on mobile - REQ-DESIGN-006 */
	@media (max-width: 768px) {
		.nav-arrow {
			display: none;
		}

		.row-scroll {
			padding: var(--gr-spacing-scale-2);
			gap: var(--gr-spacing-scale-3);
		}
	}

	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.row-scroll {
			scroll-behavior: auto;
		}

		.item-button {
			transition: none;
		}

		.item-placeholder {
			animation: none;
		}
	}
</style>
