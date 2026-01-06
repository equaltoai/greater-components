<!--
ArtworkCard - Compact artwork representation for grid views

Props: artwork, size, showOverlay, aspectRatio
Hover overlay revealing title, artist, quick stats
Progressive image loading
Keyboard focusable with visible focus ring
Click handler to open MediaViewer or navigate

@component
@example
```svelte
<ArtworkCard
  artwork={artworkData}
  size="md"
  showOverlay
  onclick={() => openViewer(artwork)}
/>
```
-->

<script lang="ts">
	import type { ArtworkData } from './Artwork/context.js';

	interface Props {
		/**
		 * Artwork data
		 */
		artwork: ArtworkData;

		/**
		 * Card size variant
		 */
		size?: 'sm' | 'md' | 'lg' | 'auto';

		/**
		 * Display variant
		 */
		/**
		 * Display variant
		 */
		variant?: 'grid' | 'row' | 'list' | 'masonry';

		/**
		 * Show info overlay on hover
		 */
		showOverlay?: boolean;

		/**
		 * Aspect ratio handling
		 */
		aspectRatio?: 'preserve' | '1:1' | '4:3' | '16:9';

		/**
		 * Click handler
		 */
		onclick?: (artwork: ArtworkData) => void;

		/**
		 * Custom CSS class
		 */
		class?: string;

		/**
		 * Tab index for keyboard navigation
		 */
		tabindex?: number;

		/**
		 * HTML tag to render
		 */
		tagName?: 'button' | 'div';
	}

	let {
		artwork,
		size = 'auto',
		variant = 'grid',
		showOverlay = true,
		aspectRatio = 'preserve',
		onclick,
		class: className = '',
		tabindex = 0,
		tagName = 'button',
	}: Props = $props();

	// Image loading state
	let loadState = $state<'loading' | 'loaded' | 'error'>('loading');
	const currentSrc = $derived(
		loadState === 'loaded' ? artwork.images.preview : artwork.images.thumbnail
	);

	// Progressive loading
	$effect(() => {
		// Reset load state when artwork changes
		loadState = 'loading';

		const previewImg = new Image();
		previewImg.src = artwork.images.preview;
		previewImg.onload = () => {
			loadState = 'loaded';
		};
		previewImg.onerror = () => {
			loadState = 'error';
		};
	});

	// Handle click
	function handleClick() {
		onclick?.(artwork);
	}

	// Format number
	function formatNumber(num: number): string {
		if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
		return num.toString();
	}

	// Compute aspect ratio class (strict CSP safe: no inline styles)
	const aspectRatioClass = $derived(() => {
		if (aspectRatio === '1:1') return 'gr-artist-artwork-card--ratio-1-1';
		if (aspectRatio === '4:3') return 'gr-artist-artwork-card--ratio-4-3';
		if (aspectRatio === '16:9') return 'gr-artist-artwork-card--ratio-16-9';

		// preserve (bucketed)
		const ratio = artwork.dimensions ? artwork.dimensions.width / artwork.dimensions.height : 1;
		if (ratio >= 1.6) return 'gr-artist-artwork-card--ratio-16-9';
		if (ratio >= 1.2) return 'gr-artist-artwork-card--ratio-4-3';
		if (ratio >= 0.9) return 'gr-artist-artwork-card--ratio-1-1';
		return 'gr-artist-artwork-card--ratio-3-4';
	});

	// Compute CSS classes
	const cardClass = $derived(
		[
			'gr-artist-artwork-card',
			`gr-artist-artwork-card--${size}`,
			`gr-artist-artwork-card--${variant}`,
			aspectRatioClass(),
			loadState === 'loading' && 'gr-artist-artwork-card--loading',
			className,
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<svelte:element
	this={tagName}
	type={tagName === 'button' ? 'button' : undefined}
	role={tagName === 'button' ? undefined : 'button'}
	class={cardClass}
	onclick={handleClick}
	aria-label={tagName === 'button' ? `${artwork.title} by ${artwork.artist.name}` : undefined}
	tabindex={tagName === 'button' ? tabindex : undefined}
>
	{#if loadState === 'error'}
		<div class="gr-artist-artwork-card-fallback">
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
		</div>
	{:else}
		<img
			src={currentSrc}
			alt={artwork.altText}
			class="gr-artist-artwork-card-image"
			class:blur={loadState === 'loading'}
			loading="lazy"
			decoding="async"
		/>
	{/if}

	{#if showOverlay}
		<div class="gr-artist-artwork-card-overlay">
			<div class="gr-artist-artwork-card-overlay-content">
				<h3 class="gr-artist-artwork-card-title">{artwork.title}</h3>
				<p class="gr-artist-artwork-card-artist">{artwork.artist.name}</p>
				<div class="gr-artist-artwork-card-stats">
					<span title="{artwork.stats.likes} likes">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path
								d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
							/>
						</svg>
						{formatNumber(artwork.stats.likes)}
					</span>
					<span title="{artwork.stats.views} views">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
							<circle cx="12" cy="12" r="3" />
						</svg>
						{formatNumber(artwork.stats.views)}
					</span>
				</div>
			</div>
		</div>
	{/if}

	{#if artwork.aiUsage?.hasAI}
		<div class="gr-artist-artwork-card-ai-badge" aria-label="AI-assisted artwork">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path d="M12 2L2 7l10 5 10-5-10-5z" />
				<path d="M2 17l10 5 10-5" />
				<path d="M2 12l10 5 10-5" />
			</svg>
		</div>
	{/if}
</svelte:element>

<style>
	.gr-artist-artwork-card {
		position: relative;
		overflow: hidden;
		border-radius: var(--gr-radii-md);
		background: var(--gr-artist-bg-secondary, var(--gr-color-gray-900));
		cursor: pointer;
		transition:
			transform var(--gr-artist-transition-hover, 200ms ease-out),
			box-shadow var(--gr-artist-transition-hover, 200ms ease-out);
		padding: 0;
		border: none;
		text-align: left;
		display: block;
		width: 100%;
		aspect-ratio: 1 / 1;
	}

	.gr-artist-artwork-card--ratio-1-1 {
		aspect-ratio: 1 / 1;
	}

	.gr-artist-artwork-card--ratio-4-3 {
		aspect-ratio: 4 / 3;
	}

	.gr-artist-artwork-card--ratio-16-9 {
		aspect-ratio: 16 / 9;
	}

	.gr-artist-artwork-card--ratio-3-4 {
		aspect-ratio: 3 / 4;
	}

	.gr-artist-artwork-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--gr-shadow-lg);
	}

	.gr-artist-artwork-card:focus-visible {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	/* Size variants */
	.gr-artist-artwork-card--sm {
		min-width: 150px;
	}

	.gr-artist-artwork-card--md {
		min-width: 250px;
	}

	.gr-artist-artwork-card--lg {
		min-width: 350px;
	}

	.gr-artist-artwork-card--auto {
		width: 100%;
	}

	.gr-artist-artwork-card-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition:
			filter 300ms ease-out,
			transform 300ms ease-out;
	}

	.gr-artist-artwork-card-image.blur {
		filter: blur(10px);
		transform: scale(1.05);
	}

	.gr-artist-artwork-card-fallback {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		min-height: 150px;
		color: var(--gr-artist-adaptive-muted, var(--gr-color-gray-500));
	}

	.gr-artist-artwork-card-fallback svg {
		width: 32px;
		height: 32px;
	}

	/* Overlay */
	.gr-artist-artwork-card-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: flex-end;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 50%);
		opacity: 0;
		transition: opacity var(--gr-artist-transition-reveal, 300ms ease-out);
	}

	.gr-artist-artwork-card:hover .gr-artist-artwork-card-overlay,
	.gr-artist-artwork-card:focus-within .gr-artist-artwork-card-overlay {
		opacity: 1;
	}

	.gr-artist-artwork-card-overlay-content {
		padding: var(--gr-spacing-scale-3);
		width: 100%;
	}

	.gr-artist-artwork-card-title {
		margin: 0 0 var(--gr-spacing-scale-1);
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: 500;
		color: white;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.gr-artist-artwork-card-artist {
		margin: 0 0 var(--gr-spacing-scale-2);
		font-size: var(--gr-typography-fontSize-xs);
		color: rgba(255, 255, 255, 0.7);
	}

	.gr-artist-artwork-card-stats {
		display: flex;
		gap: var(--gr-spacing-scale-3);
		font-size: var(--gr-typography-fontSize-xs);
		color: rgba(255, 255, 255, 0.7);
	}

	.gr-artist-artwork-card-stats span {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
	}

	.gr-artist-artwork-card-stats svg {
		width: 12px;
		height: 12px;
	}

	/* AI Badge */
	.gr-artist-artwork-card-ai-badge {
		position: absolute;
		top: var(--gr-spacing-scale-2);
		right: var(--gr-spacing-scale-2);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		background: rgba(0, 0, 0, 0.6);
		border-radius: var(--gr-radii-sm);
		color: var(--gr-color-gray-300);
	}

	.gr-artist-artwork-card-ai-badge svg {
		width: 14px;
		height: 14px;
	}

	/* REQ-A11Y-007: Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.gr-artist-artwork-card,
		.gr-artist-artwork-card-image,
		.gr-artist-artwork-card-overlay {
			transition: none;
		}

		.gr-artist-artwork-card:hover {
			transform: none;
		}

		.gr-artist-artwork-card-image.blur {
			filter: none;
			transform: none;
		}
	}
</style>
