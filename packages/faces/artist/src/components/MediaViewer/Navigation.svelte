<!--
MediaViewer.Navigation - Navigation controls for multi-image series

Arrow key navigation.
Previous/next buttons.
Optional thumbnail strip.

@component
-->

<script lang="ts">
	import { getMediaViewerContext } from './context.js';

	interface Props {
		/**
		 * Show thumbnail strip
		 */
		showThumbnails?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { showThumbnails, class: className = '' }: Props = $props();

	const context = getMediaViewerContext();
	const { artworks, config, handlers } = context;

	// Use config default if not specified
	const showThumbStrip = $derived(showThumbnails ?? config.showThumbnails);

	// Navigation functions
	function navigatePrev() {
		if (context.currentIndex > 0) {
			context.currentIndex--;
			context.zoomLevel = 1;
			context.panOffset = { x: 0, y: 0 };
			handlers.onNavigate?.(context.currentIndex);
		}
	}

	function navigateNext() {
		if (context.currentIndex < artworks.length - 1) {
			context.currentIndex++;
			context.zoomLevel = 1;
			context.panOffset = { x: 0, y: 0 };
			handlers.onNavigate?.(context.currentIndex);
		}
	}

	function navigateTo(index: number) {
		if (index >= 0 && index < artworks.length) {
			context.currentIndex = index;
			context.zoomLevel = 1;
			context.panOffset = { x: 0, y: 0 };
			handlers.onNavigate?.(index);
		}
	}

	// Check if navigation is needed
	const hasMultiple = $derived(artworks.length > 1);
	const canGoPrev = $derived(context.currentIndex > 0);
	const canGoNext = $derived(context.currentIndex < artworks.length - 1);
</script>

{#if hasMultiple}
	<div class="gr-artist-media-viewer-nav {className}">
		<!-- Previous button -->
		<button
			class="gr-artist-media-viewer-nav-btn gr-artist-media-viewer-nav-prev"
			onclick={navigatePrev}
			disabled={!canGoPrev}
			aria-label="Previous image"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<polyline points="15 18 9 12 15 6" />
			</svg>
		</button>

		<!-- Next button -->
		<button
			class="gr-artist-media-viewer-nav-btn gr-artist-media-viewer-nav-next"
			onclick={navigateNext}
			disabled={!canGoNext}
			aria-label="Next image"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<polyline points="9 18 15 12 9 6" />
			</svg>
		</button>

		<!-- Counter -->
		<div class="gr-artist-media-viewer-nav-counter" aria-live="polite">
			{context.currentIndex + 1} / {artworks.length}
		</div>

		<!-- Thumbnail strip -->
		{#if showThumbStrip}
			<div class="gr-artist-media-viewer-thumbnails" role="listbox" aria-label="Image thumbnails">
				{#each artworks as artwork, index (artwork.id)}
					<button
						type="button"
						class="gr-artist-media-viewer-thumbnail"
						class:active={index === context.currentIndex}
						onclick={() => navigateTo(index)}
						role="option"
						aria-selected={index === context.currentIndex}
						aria-label={`View ${artwork.title}`}
					>
						<img
							src={artwork.images.thumbnail}
							alt=""
							loading="lazy"
							aria-hidden="true"
						/>
					</button>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	.gr-artist-media-viewer-nav {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.gr-artist-media-viewer-nav-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		padding: 0;
		background: rgba(255, 255, 255, 0.1);
		border: none;
		border-radius: 50%;
		color: white;
		cursor: pointer;
		pointer-events: auto;
		transition:
			background-color 200ms ease-out,
			opacity 200ms ease-out;
	}

	.gr-artist-media-viewer-nav-btn:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.2);
	}

	.gr-artist-media-viewer-nav-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.gr-artist-media-viewer-nav-btn:focus-visible {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.gr-artist-media-viewer-nav-btn svg {
		width: 24px;
		height: 24px;
	}

	.gr-artist-media-viewer-nav-prev {
		left: var(--gr-spacing-scale-4);
	}

	.gr-artist-media-viewer-nav-next {
		right: var(--gr-spacing-scale-4);
	}

	.gr-artist-media-viewer-nav-counter {
		position: absolute;
		top: var(--gr-spacing-scale-4);
		left: 50%;
		transform: translateX(-50%);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		background: rgba(0, 0, 0, 0.6);
		border-radius: var(--gr-radii-md);
		color: white;
		font-size: var(--gr-typography-fontSize-sm);
		pointer-events: auto;
	}

	.gr-artist-media-viewer-thumbnails {
		position: absolute;
		bottom: var(--gr-spacing-scale-4);
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2);
		background: rgba(0, 0, 0, 0.6);
		border-radius: var(--gr-radii-md);
		pointer-events: auto;
		max-width: 80%;
		overflow-x: auto;
	}

	.gr-artist-media-viewer-thumbnail {
		flex-shrink: 0;
		width: 48px;
		height: 48px;
		padding: 0;
		background: none;
		border: 2px solid transparent;
		border-radius: var(--gr-radii-sm);
		overflow: hidden;
		cursor: pointer;
		transition: border-color 200ms ease-out;
	}

	.gr-artist-media-viewer-thumbnail:hover {
		border-color: rgba(255, 255, 255, 0.5);
	}

	.gr-artist-media-viewer-thumbnail.active {
		border-color: var(--gr-color-primary-500);
	}

	.gr-artist-media-viewer-thumbnail:focus-visible {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.gr-artist-media-viewer-thumbnail img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* REQ-A11Y-007: Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.gr-artist-media-viewer-nav-btn,
		.gr-artist-media-viewer-thumbnail {
			transition: none;
		}
	}
</style>
