<!--
MediaViewer.Root - Full-screen lightbox viewer

REQ-FR-003: Full-screen lightbox with true black background option.
Focus trap for accessibility.
Escape key to close.
Arrow key navigation.
Swipe gestures for touch devices.

@component
@example
```svelte
<MediaViewer.Root
  artworks={artworkList}
  currentIndex={0}
  config={{ background: 'black' }}
  handlers={{ onClose }}
>
  <MediaViewer.Navigation />
  <MediaViewer.ZoomControls />
  <MediaViewer.MetadataPanel />
</MediaViewer.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ArtworkData } from '../../types/artwork.js';
	import {
		createMediaViewerContext,
		type MediaViewerConfig,
		type MediaViewerHandlers,
	} from './context.js';
	import { untrack } from 'svelte';

	interface Props {
		/**
		 * Array of artworks to display
		 */
		artworks: ArtworkData[];

		/**
		 * Currently displayed index
		 */
		currentIndex?: number;

		/**
		 * Configuration options
		 */
		config?: MediaViewerConfig;

		/**
		 * Event handlers
		 */
		handlers?: MediaViewerHandlers;

		/**
		 * Child components
		 */
		children?: Snippet;
	}

	let { artworks, currentIndex = 0, config = {}, handlers = {}, children }: Props = $props();

	// Create context
	const context = createMediaViewerContext(
		() => artworks,
		() => currentIndex,
		() => config,
		() => handlers
	);

	// Current artwork
	const currentArtwork = $derived(artworks[context.currentIndex]);

	// Image loading state
	let imageLoaded = $state(false);
	let imageSrc = $state(untrack(() => currentArtwork?.images.full || ''));

	// Touch handling for swipe
	let touchStartX = 0;
	let touchStartY = 0;

	const ZOOM_LEVELS = [0.5, 0.75, 1, 1.5, 2, 3, 4, 5] as const;

	function normalizeZoomLevel(level: number): number {
		let closest = ZOOM_LEVELS[0];
		for (const candidate of ZOOM_LEVELS) {
			if (Math.abs(candidate - level) < Math.abs(closest - level)) {
				closest = candidate;
			}
		}
		return closest;
	}

	function zoomStep(direction: 'in' | 'out'): number {
		const normalized = normalizeZoomLevel(context.zoomLevel);
		const index = ZOOM_LEVELS.indexOf(normalized);
		if (index === -1) return 1;

		const nextIndex =
			direction === 'in' ? Math.min(ZOOM_LEVELS.length - 1, index + 1) : Math.max(0, index - 1);

		return ZOOM_LEVELS[nextIndex] ?? 1;
	}

	const zoomPercent = $derived(Math.round(normalizeZoomLevel(context.zoomLevel) * 100));

	// Handle keyboard navigation
	function handleKeydown(e: KeyboardEvent) {
		switch (e.key) {
			case 'Escape':
				e.preventDefault();
				handlers.onClose?.();
				break;
			case 'ArrowLeft':
				e.preventDefault();
				navigatePrev();
				break;
			case 'ArrowRight':
				e.preventDefault();
				navigateNext();
				break;
			case '+':
			case '=':
				e.preventDefault();
				zoomIn();
				break;
			case '-':
				e.preventDefault();
				zoomOut();
				break;
			case '0':
				e.preventDefault();
				resetZoom();
				break;
		}
	}

	// Navigation functions
	function navigatePrev() {
		if (context.currentIndex > 0) {
			context.currentIndex--;
			resetZoom();
			handlers.onNavigate?.(context.currentIndex);
		}
	}

	function navigateNext() {
		if (context.currentIndex < artworks.length - 1) {
			context.currentIndex++;
			resetZoom();
			handlers.onNavigate?.(context.currentIndex);
		}
	}

	// Zoom functions
	function zoomIn() {
		if (context.config.enableZoom) {
			context.zoomLevel = zoomStep('in');
			handlers.onZoom?.(context.zoomLevel);
		}
	}

	function zoomOut() {
		if (context.config.enableZoom) {
			context.zoomLevel = zoomStep('out');
			handlers.onZoom?.(context.zoomLevel);
		}
	}

	function resetZoom() {
		context.zoomLevel = 1;
		context.panOffset = { x: 0, y: 0 };
		handlers.onZoom?.(1);
	}

	// Touch handlers for swipe
	function handleTouchStart(e: TouchEvent) {
		if (e.touches && e.touches.length > 0) {
			touchStartX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
		}
	}

	function handleTouchEnd(e: TouchEvent) {
		if (e.changedTouches && e.changedTouches.length > 0) {
			const touchEndX = e.changedTouches[0].clientX;
			const touchEndY = e.changedTouches[0].clientY;
			const deltaX = touchEndX - touchStartX;
			const deltaY = touchEndY - touchStartY;

			// Only swipe if horizontal movement is greater than vertical
			if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
				if (deltaX > 0) {
					navigatePrev();
				} else {
					navigateNext();
				}
			}
		}
	}

	// Wheel zoom
	function handleWheel(e: WheelEvent) {
		if (context.config.enableZoom) {
			e.preventDefault();
			if (e.deltaY < 0) {
				zoomIn();
			} else {
				zoomOut();
			}
		}
	}

	// Close on backdrop click
	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handlers.onClose?.();
		}
	}

	// Update image when index changes
	$effect(() => {
		const artwork = artworks[context.currentIndex];
		if (artwork) {
			imageLoaded = false;
			imageSrc = artwork.images.full;
		}
	});

	// Background class
	const bgClass = $derived(
		context.config.background === 'black'
			? 'gr-artist-media-viewer--black'
			: context.config.background === 'blur'
				? 'gr-artist-media-viewer--blur'
				: 'gr-artist-media-viewer--dark'
	);
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="gr-artist-media-viewer {bgClass}"
	role="dialog"
	aria-modal="true"
	aria-label="Image viewer"
	tabindex="-1"
	onclick={handleBackdropClick}
	onkeydown={(e) => {
		if (e.key === 'Escape') {
			handlers.onClose?.();
		}
	}}
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
	onwheel={handleWheel}
>
	<!-- Close button -->
	<button
		class="gr-artist-media-viewer-close"
		onclick={() => handlers.onClose?.()}
		aria-label="Close viewer"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			aria-hidden="true"
		>
			<line x1="18" y1="6" x2="6" y2="18" />
			<line x1="6" y1="6" x2="18" y2="18" />
		</svg>
	</button>

	<!-- Main image -->
	<div class="gr-artist-media-viewer-content">
		{#if currentArtwork}
			<img
				src={imageSrc}
				alt={currentArtwork.altText}
				class={`gr-artist-media-viewer-image gr-artist-media-viewer-image--zoom-${zoomPercent}`}
				class:loaded={imageLoaded}
				onload={() => (imageLoaded = true)}
				draggable="false"
			/>
		{/if}
	</div>

	<!-- Child components (Navigation, ZoomControls, MetadataPanel) -->
	{@render children?.()}
</div>

<style>
	.gr-artist-media-viewer {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.gr-artist-media-viewer--black {
		background: var(--gr-artist-bg-immersive, #000000);
	}

	.gr-artist-media-viewer--dark {
		background: var(--gr-artist-bg-primary, var(--gr-color-gray-950));
	}

	.gr-artist-media-viewer--blur {
		background: rgba(0, 0, 0, 0.9);
		backdrop-filter: blur(20px);
	}

	.gr-artist-media-viewer-close {
		position: absolute;
		top: var(--gr-spacing-scale-4);
		right: var(--gr-spacing-scale-4);
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		padding: 0;
		background: rgba(255, 255, 255, 0.1);
		border: none;
		border-radius: 50%;
		color: white;
		cursor: pointer;
		transition: background-color 200ms ease-out;
	}

	.gr-artist-media-viewer-close:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.gr-artist-media-viewer-close:focus-visible {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.gr-artist-media-viewer-close svg {
		width: 24px;
		height: 24px;
	}

	.gr-artist-media-viewer-content {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		padding: var(--gr-spacing-scale-8);
	}

	.gr-artist-media-viewer-image {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		opacity: 0;
		transform: scale(1);
		transform-origin: center center;
		transition:
			opacity 300ms ease-out,
			transform 200ms ease-out;
		user-select: none;
	}

	.gr-artist-media-viewer-image--zoom-50 {
		transform: scale(0.5);
	}

	.gr-artist-media-viewer-image--zoom-75 {
		transform: scale(0.75);
	}

	.gr-artist-media-viewer-image--zoom-100 {
		transform: scale(1);
	}

	.gr-artist-media-viewer-image--zoom-150 {
		transform: scale(1.5);
	}

	.gr-artist-media-viewer-image--zoom-200 {
		transform: scale(2);
	}

	.gr-artist-media-viewer-image--zoom-300 {
		transform: scale(3);
	}

	.gr-artist-media-viewer-image--zoom-400 {
		transform: scale(4);
	}

	.gr-artist-media-viewer-image--zoom-500 {
		transform: scale(5);
	}

	.gr-artist-media-viewer-image.loaded {
		opacity: 1;
	}

	/* REQ-A11Y-007: Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.gr-artist-media-viewer-close,
		.gr-artist-media-viewer-image {
			transition: none;
		}
	}
</style>
