<!--
Exhibition.Gallery - Artwork display for exhibitions

Features:
- Curated ordering
- Narrative captions (for narrative layout)
- Timeline markers (for timeline layout)
- Grid display (for gallery layout)

@component
@example
```svelte
<Exhibition.Gallery columns={3} />
```
-->

<script lang="ts">
	import { getExhibitionContext } from './context.js';
	import type { ArtworkData } from '../../types/artwork.js';

	interface Props {
		/**
		 * Number of columns for grid layout
		 */
		columns?: number;

		/**
		 * Show artwork captions
		 */
		showCaptions?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { columns = 3, showCaptions = true, class: className = '' }: Props = $props();

	const ctx = getExhibitionContext();
	const { exhibition, layout, navigation, handlers } = ctx;

	const columnsClamped = $derived(Math.max(1, Math.min(6, Math.round(columns))));

	// Handle artwork click
	function handleArtworkClick(artwork: ArtworkData) {
		handlers.onArtworkClick?.(artwork);
	}

	// Format year for timeline
	function formatYear(date: string | Date): string {
		return new Date(date).getFullYear().toString();
	}

	// Group artworks by year for timeline layout
	const artworksByYear = $derived(() => {
		if (layout !== 'timeline') return null;

		const grouped = new Map<string, ArtworkData[]>();
		for (const artwork of exhibition.artworks) {
			const year = formatYear(artwork.createdAt);
			if (!grouped.has(year)) {
				grouped.set(year, []);
			}
			grouped.get(year)!.push(artwork);
		}
		return grouped;
	});
</script>

<section
	id="exhibition-gallery"
	class={`exhibition-gallery exhibition-gallery--${layout} ${className}`}
	aria-labelledby="exhibition-gallery-heading"
>
	<h2 id="exhibition-gallery-heading" class="sr-only">Exhibition Gallery</h2>

	{#if layout === 'gallery'}
		<!-- Grid layout -->
		<div class={`exhibition-gallery__grid exhibition-gallery__grid--columns-${columnsClamped}`}>
			{#each exhibition.artworks as artwork (artwork.id)}
				<button
					type="button"
					class="exhibition-gallery__item"
					onclick={() => handleArtworkClick(artwork)}
					aria-label={`View ${artwork.title} by ${artwork.artist.name}`}
				>
					<img
						src={artwork.images.preview}
						alt={artwork.altText}
						class="exhibition-gallery__image"
						loading="lazy"
					/>
					{#if showCaptions}
						<div class="exhibition-gallery__caption">
							<span class="exhibition-gallery__title">{artwork.title}</span>
							<span class="exhibition-gallery__artist">{artwork.artist.name}</span>
						</div>
					{/if}
				</button>
			{/each}
		</div>
	{:else if layout === 'narrative'}
		<!-- Narrative layout with large images and captions -->
		<div class="exhibition-gallery__narrative">
			{#each exhibition.artworks as artwork, index (artwork.id)}
				<article
					class="exhibition-gallery__narrative-item"
					class:active={index === navigation.currentIndex}
					aria-current={index === navigation.currentIndex ? 'true' : undefined}
				>
					<div class="exhibition-gallery__narrative-number">
						{index + 1} / {exhibition.artworks.length}
					</div>
					<button
						type="button"
						class="exhibition-gallery__narrative-image-wrapper"
						onclick={() => handleArtworkClick(artwork)}
					>
						<img
							src={artwork.images.standard}
							alt={artwork.altText}
							class="exhibition-gallery__narrative-image"
							loading={index < 3 ? 'eager' : 'lazy'}
						/>
					</button>
					<div class="exhibition-gallery__narrative-content">
						<h3 class="exhibition-gallery__narrative-title">{artwork.title}</h3>
						<p class="exhibition-gallery__narrative-artist">
							{artwork.artist.name}
							{#if artwork.metadata?.year}
								<span>, {artwork.metadata.year}</span>
							{/if}
						</p>
						{#if artwork.description}
							<p class="exhibition-gallery__narrative-description">
								{artwork.description}
							</p>
						{/if}
						{#if artwork.metadata?.medium}
							<p class="exhibition-gallery__narrative-medium">
								{artwork.metadata.medium}
								{#if artwork.metadata?.dimensions}
									<span> · {artwork.metadata.dimensions}</span>
								{/if}
							</p>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	{:else if layout === 'timeline'}
		<!-- Timeline layout grouped by year -->
		<div class="exhibition-gallery__timeline">
			{#if artworksByYear()}
				{#each [...artworksByYear()!.entries()] as [year, artworks] (year)}
					<div class="exhibition-gallery__timeline-group">
						<div class="exhibition-gallery__timeline-marker">
							<span class="exhibition-gallery__timeline-year">{year}</span>
						</div>
						<div class="exhibition-gallery__timeline-artworks">
							{#each artworks as artwork (artwork.id)}
								<button
									type="button"
									class="exhibition-gallery__timeline-item"
									onclick={() => handleArtworkClick(artwork)}
								>
									<img
										src={artwork.images.thumbnail}
										alt={artwork.altText}
										class="exhibition-gallery__timeline-image"
										loading="lazy"
									/>
									{#if showCaptions}
										<div class="exhibition-gallery__timeline-caption">
											<span class="exhibition-gallery__timeline-title">{artwork.title}</span>
										</div>
									{/if}
								</button>
							{/each}
						</div>
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</section>

<style>
	.exhibition-gallery {
		width: 100%;
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

	/* Grid layout */
		.exhibition-gallery__grid {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: var(--gr-spacing-scale-4);
		}

		.exhibition-gallery__grid--columns-1 {
			grid-template-columns: repeat(1, 1fr);
		}

		.exhibition-gallery__grid--columns-2 {
			grid-template-columns: repeat(2, 1fr);
		}

		.exhibition-gallery__grid--columns-3 {
			grid-template-columns: repeat(3, 1fr);
		}

		.exhibition-gallery__grid--columns-4 {
			grid-template-columns: repeat(4, 1fr);
		}

		.exhibition-gallery__grid--columns-5 {
			grid-template-columns: repeat(5, 1fr);
		}

		.exhibition-gallery__grid--columns-6 {
			grid-template-columns: repeat(6, 1fr);
		}

		.exhibition-gallery__item {
			position: relative;
			background: none;
			border: none;
		padding: 0;
		cursor: pointer;
		overflow: hidden;
		border-radius: var(--gr-radius-md);
		aspect-ratio: 1;
	}

	.exhibition-gallery__image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s;
	}

	.exhibition-gallery__item:hover .exhibition-gallery__image {
		transform: scale(1.05);
	}

	.exhibition-gallery__caption {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: var(--gr-spacing-scale-3);
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-1);
	}

	.exhibition-gallery__title {
		font-size: var(--gr-font-size-sm);
		font-weight: var(--gr-font-weight-medium);
		color: white;
	}

	.exhibition-gallery__artist {
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-gray-300);
	}

	/* Narrative layout */
	.exhibition-gallery__narrative {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-16);
	}

	.exhibition-gallery__narrative-item {
		display: grid;
		grid-template-columns: 1fr 400px;
		gap: var(--gr-spacing-scale-8);
		align-items: start;
	}

	.exhibition-gallery__narrative-number {
		grid-column: 1 / -1;
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-500);
		font-variant-numeric: tabular-nums;
	}

	.exhibition-gallery__narrative-image-wrapper {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.exhibition-gallery__narrative-image {
		width: 100%;
		height: auto;
		border-radius: var(--gr-radius-lg);
	}

	.exhibition-gallery__narrative-content {
		position: sticky;
		top: var(--gr-spacing-scale-8);
	}

	.exhibition-gallery__narrative-title {
		font-size: var(--gr-font-size-2xl);
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-100);
		margin: 0 0 var(--gr-spacing-scale-2) 0;
	}

	.exhibition-gallery__narrative-artist {
		font-size: var(--gr-font-size-base);
		color: var(--gr-color-gray-300);
		margin: 0 0 var(--gr-spacing-scale-4) 0;
	}

	.exhibition-gallery__narrative-description {
		font-size: var(--gr-font-size-base);
		line-height: 1.7;
		color: var(--gr-color-gray-400);
		margin: 0 0 var(--gr-spacing-scale-4) 0;
	}

	.exhibition-gallery__narrative-medium {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-500);
		margin: 0;
	}

	/* Timeline layout */
	.exhibition-gallery__timeline {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-8);
		padding-left: var(--gr-spacing-scale-8);
		border-left: 2px solid var(--gr-color-gray-700);
	}

	.exhibition-gallery__timeline-group {
		position: relative;
	}

	.exhibition-gallery__timeline-marker {
		position: absolute;
		left: calc(-1 * var(--gr-spacing-scale-8) - 1px);
		transform: translateX(-50%);
		background: var(--gr-color-gray-900);
		padding: var(--gr-spacing-scale-2) 0;
	}

	.exhibition-gallery__timeline-year {
		display: inline-block;
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-3);
		background: var(--gr-color-primary-500);
		border-radius: var(--gr-radius-full);
		font-size: var(--gr-font-size-sm);
		font-weight: var(--gr-font-weight-semibold);
		color: white;
	}

	.exhibition-gallery__timeline-artworks {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--gr-spacing-scale-4);
		padding-top: var(--gr-spacing-scale-4);
	}

	.exhibition-gallery__timeline-item {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		border-radius: var(--gr-radius-md);
		overflow: hidden;
	}

	.exhibition-gallery__timeline-image {
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
	}

	.exhibition-gallery__timeline-caption {
		padding: var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-800);
	}

	.exhibition-gallery__timeline-title {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-200);
	}

	@media (max-width: 768px) {
		.exhibition-gallery__grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.exhibition-gallery__narrative-item {
			grid-template-columns: 1fr;
		}

		.exhibition-gallery__narrative-content {
			position: static;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.exhibition-gallery__image {
			transition: none;
		}
	}
</style>
