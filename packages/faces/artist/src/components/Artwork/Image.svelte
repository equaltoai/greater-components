<!--
Artwork.Image - Progressive image loading component

Implements REQ-PERF-001: Progressive image loading
- Blur-up placeholder during load
- Low-resolution preview (< 1KB) immediate
- Full resolution lazy-loaded
- Smooth transition between states

@component
@example
```svelte
<Artwork.Root artwork={artworkData}>
  <Artwork.Image aspectRatio="preserve" />
</Artwork.Root>
```
-->

<script lang="ts">
	import { getArtworkContext, updateImageLoadState, updateCurrentResolution } from './context.js';

	interface Props {
		/**
		 * Aspect ratio handling
		 */
		aspectRatio?: 'preserve' | '1:1' | '4:3' | '16:9';

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { aspectRatio = 'preserve', class: className = '' }: Props = $props();

	const context = getArtworkContext();
	const { artwork, config } = context;

	// Image loading state
	let loadState = $state<'loading' | 'loaded' | 'error'>('loading');
	let currentSrc = $state(artwork.images.thumbnail);
	let isFullLoaded = $state(false);

	// Compute aspect ratio class (strict CSP safe: no inline styles)
	const aspectRatioClass = $derived(() => {
		if (aspectRatio === '1:1') return 'gr-artist-artwork-image-container--ratio-1-1';
		if (aspectRatio === '4:3') return 'gr-artist-artwork-image-container--ratio-4-3';
		if (aspectRatio === '16:9') return 'gr-artist-artwork-image-container--ratio-16-9';

		// preserve (bucketed)
		const ratio = artwork.dimensions ? artwork.dimensions.width / artwork.dimensions.height : 1;
		if (ratio >= 1.6) return 'gr-artist-artwork-image-container--ratio-16-9';
		if (ratio >= 1.2) return 'gr-artist-artwork-image-container--ratio-4-3';
		if (ratio >= 0.9) return 'gr-artist-artwork-image-container--ratio-1-1';
		return 'gr-artist-artwork-image-container--ratio-3-4';
	});

	// Progressive loading effect
	$effect(() => {
		if (!config.progressiveLoading) {
			// Skip progressive loading, load full directly
			currentSrc = artwork.images.standard;
			return;
		}

		// Start with thumbnail (blur-up placeholder)
		currentSrc = artwork.images.thumbnail;
		updateCurrentResolution(context, 'thumbnail');

		// Load preview
		const previewImg = new Image();
		previewImg.src = artwork.images.preview;
		previewImg.onload = () => {
			currentSrc = artwork.images.preview;
			updateCurrentResolution(context, 'preview');

			// Then load standard resolution
			const standardImg = new Image();
			standardImg.src = artwork.images.standard;
			standardImg.onload = () => {
				currentSrc = artwork.images.standard;
				updateCurrentResolution(context, 'standard');
				loadState = 'loaded';
				updateImageLoadState(context, 'loaded');
				isFullLoaded = true;
			};
			standardImg.onerror = handleError;
		};
		previewImg.onerror = handleError;
	});

	function handleError() {
		loadState = 'error';
		updateImageLoadState(context, 'error');
		context.handlers.onImageError?.(new Error('Failed to load image'));
	}

	function handleLoad() {
		if (loadState !== 'error') {
			loadState = 'loaded';
			updateImageLoadState(context, 'loaded');
		}
	}

	// Compute CSS classes
	const imageClass = $derived(
		[
			'gr-artist-artwork-image',
			loadState === 'loading' && 'gr-artist-artwork-image--loading',
			loadState === 'loaded' && 'gr-artist-artwork-image--loaded',
			loadState === 'error' && 'gr-artist-artwork-image--error',
			!isFullLoaded && 'gr-artist-artwork-image--blur',
			className,
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<figure class={`gr-artist-artwork-image-container ${aspectRatioClass()}`}>
	{#if loadState === 'error'}
		<div class="gr-artist-artwork-image-fallback" role="img" aria-label={artwork.altText}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
				<circle cx="8.5" cy="8.5" r="1.5" />
				<polyline points="21,15 16,10 5,21" />
			</svg>
			<span class="sr-only">{artwork.altText}</span>
		</div>
	{:else}
		<img
			src={currentSrc}
			alt={artwork.altText}
			class={imageClass}
			loading="lazy"
			decoding="async"
			onload={handleLoad}
			onerror={handleError}
		/>
	{/if}
</figure>

<style>
	.gr-artist-artwork-image-container {
		position: relative;
		width: 100%;
		aspect-ratio: 1 / 1;
		overflow: hidden;
		background: var(--gr-artist-bg-secondary, var(--gr-color-gray-900));
		margin: 0;
	}

	.gr-artist-artwork-image-container--ratio-1-1 {
		aspect-ratio: 1 / 1;
	}

	.gr-artist-artwork-image-container--ratio-4-3 {
		aspect-ratio: 4 / 3;
	}

	.gr-artist-artwork-image-container--ratio-16-9 {
		aspect-ratio: 16 / 9;
	}

	.gr-artist-artwork-image-container--ratio-3-4 {
		aspect-ratio: 3 / 4;
	}

	.gr-artist-artwork-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition:
			filter 300ms ease-out,
			opacity 300ms ease-out;
	}

	/* REQ-PERF-001: Blur-up placeholder effect */
	.gr-artist-artwork-image--blur {
		filter: blur(20px);
		transform: scale(1.1);
	}

	.gr-artist-artwork-image--loading {
		opacity: 0.7;
	}

	.gr-artist-artwork-image--loaded {
		filter: blur(0);
		transform: scale(1);
		opacity: 1;
	}

	.gr-artist-artwork-image--error {
		display: none;
	}

	.gr-artist-artwork-image-fallback {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		min-height: 200px;
		background: var(--gr-artist-bg-secondary, var(--gr-color-gray-900));
		color: var(--gr-artist-adaptive-muted, var(--gr-color-gray-500));
	}

	.gr-artist-artwork-image-fallback svg {
		width: 48px;
		height: 48px;
	}

	/* Screen reader only text */
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

	/* REQ-A11Y-007: Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.gr-artist-artwork-image {
			transition: none;
		}

		.gr-artist-artwork-image--blur {
			filter: none;
			transform: none;
		}
	}
</style>
