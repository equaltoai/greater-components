<!--
DiscoveryEngine.Results - Search results display

Features:
- Gallery layout for results
- Result count and sort options
- Empty state handling
- Loading states
- Keyboard navigation

@component
@example
```svelte
<DiscoveryEngine.Results layout="grid" />
```
-->

<script lang="ts">
	import { getDiscoveryContext, formatResultCount, type SortOption } from './context.js';
	import type { ArtworkData } from '../../types/artwork.js';

	interface Props {
		/**
		 * Results layout
		 */
		layout?: 'grid' | 'masonry' | 'list';

		/**
		 * Columns for grid layout
		 */
		columns?: 2 | 3 | 4 | 5 | 6;

		/**
		 * Show sort options
		 */
		showSort?: boolean;

		/**
		 * Show result count
		 */
		showCount?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		layout = 'grid',
		columns = 4,
		showSort = true,
		showCount = true,
		class: className = '',
	}: Props = $props();

	const ctx = getDiscoveryContext();
	const { store, handlers } = ctx;

	// Store state subscription
	let storeState = $state(store.get());
	$effect(() => {
		const unsubscribe = store.subscribe((state) => {
			storeState = state;
		});
		return unsubscribe;
	});

	// Sort options
	const sortOptions: Array<{ value: SortOption; label: string }> = [
		{ value: 'relevance', label: 'Most Relevant' },
		{ value: 'recent', label: 'Most Recent' },
		{ value: 'popular', label: 'Most Popular' },
		{ value: 'trending', label: 'Trending' },
	];

	// Handle sort change
	function handleSortChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		ctx.sortBy = target.value as SortOption;
	}

	// Handle result click
	function handleResultClick(artwork: ArtworkData) {
		handlers.onResultClick?.(artwork);
	}

	// Handle "more like this"
	function handleMoreLikeThis(artwork: ArtworkData, event: Event) {
		event.stopPropagation();
		handlers.onMoreLikeThis?.(artwork);
	}

	// Result count text
	const resultCountText = $derived(formatResultCount(storeState.results.length));
</script>

<div
	id="discovery-results"
	class={`results ${className}`}
	class:results--loading={storeState.loading}
	role="region"
	aria-label="Search results"
	aria-busy={storeState.loading}
>
	<!-- Results header -->
	<div class="results__header">
		{#if showCount}
			<div class="results__count" aria-live="polite">
				{resultCountText}
				{#if storeState.query}
					<span class="results__query">for "{storeState.query}"</span>
				{/if}
			</div>
		{/if}

		{#if showSort && storeState.results.length > 0}
			<div class="results__sort">
				<label for="sort-select" class="results__sort-label">Sort by:</label>
				<select
					id="sort-select"
					class="results__sort-select"
					value={ctx.sortBy}
					onchange={handleSortChange}
				>
					{#each sortOptions as option (option.value)}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
		{/if}
	</div>

	<!-- Results content -->
	{#if storeState.loading}
		<!-- Loading state -->
		<div class="results__loading" aria-label="Loading results">
			<div class={`results__grid results__grid--columns-${columns}`}>
				<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
				{#each Array(8) as _, i (i)}
					<div class="results__skeleton">
						<div class="results__skeleton-image"></div>
						<div class="results__skeleton-text"></div>
						<div class="results__skeleton-text results__skeleton-text--short"></div>
					</div>
				{/each}
			</div>
		</div>
	{:else if storeState.error}
		<!-- Error state -->
		<div class="results__error" role="alert">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
				<circle cx="12" cy="12" r="10" stroke-width="2" />
				<path d="M12 8v4M12 16h.01" stroke-width="2" stroke-linecap="round" />
			</svg>
			<h2>Something went wrong</h2>
			<p>{storeState.error.message}</p>
			<button type="button" onclick={() => store.search(storeState.query)}> Try again </button>
		</div>
	{:else if storeState.results.length === 0}
		<!-- Empty state -->
		<div class="results__empty">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
				<circle cx="11" cy="11" r="8" stroke-width="2" />
				<path d="M21 21l-4.35-4.35" stroke-width="2" stroke-linecap="round" />
			</svg>
			<h2>No results found</h2>
			{#if storeState.query}
				<p>Try adjusting your search or filters</p>
			{:else}
				<p>Start searching to discover amazing artworks</p>
			{/if}
		</div>
	{:else}
		<!-- Results grid -->
		<div
			class={`results__grid results__grid--columns-${columns}`}
			class:results__grid--masonry={layout === 'masonry'}
			class:results__grid--list={layout === 'list'}
			role="list"
		>
			{#each storeState.results as artwork (artwork.id)}
				<div class="results__item" role="listitem">
					<div class="results__item-image">
						<button
							type="button"
							class="results__item-image-btn"
							onclick={() => handleResultClick(artwork)}
							aria-label={`View ${artwork.title}`}
						>
							<img src={artwork.images.preview} alt={artwork.altText} loading="lazy" />
						</button>
						<div class="results__item-overlay">
							<button
								type="button"
								class="results__item-action"
								onclick={(e) => handleMoreLikeThis(artwork, e)}
								aria-label="Find similar artworks"
							>
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
									<circle cx="11" cy="11" r="8" stroke-width="2" />
									<path d="M21 21l-4.35-4.35" stroke-width="2" stroke-linecap="round" />
								</svg>
								More like this
							</button>
						</div>
					</div>
					<div class="results__item-info">
						<button
							type="button"
							class="results__item-info-btn"
							onclick={() => handleResultClick(artwork)}
						>
							<h4 class="results__item-title">{artwork.title}</h4>
							<p class="results__item-artist">{artwork.artist.name}</p>
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.results {
		width: 100%;
	}

	.results__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--gr-spacing-scale-4);
		padding: 0 var(--gr-spacing-scale-2);
	}

	.results__count {
		color: var(--gr-color-gray-300);
		font-size: var(--gr-typography-fontSize-sm);
	}

	.results__query {
		color: var(--gr-color-gray-400);
	}

	.results__sort {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
	}

	.results__sort-label {
		color: var(--gr-color-gray-400);
		font-size: var(--gr-typography-fontSize-sm);
	}

	.results__sort-select {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-800);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-md);
		color: var(--gr-color-gray-100);
		font-size: var(--gr-typography-fontSize-sm);
	}

	.results__grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--gr-spacing-scale-4);
	}

	.results__grid--columns-1 {
		grid-template-columns: repeat(1, 1fr);
	}

	.results__grid--columns-2 {
		grid-template-columns: repeat(2, 1fr);
	}

	.results__grid--columns-3 {
		grid-template-columns: repeat(3, 1fr);
	}

	.results__grid--columns-4 {
		grid-template-columns: repeat(4, 1fr);
	}

	.results__grid--columns-5 {
		grid-template-columns: repeat(5, 1fr);
	}

	.results__grid--columns-6 {
		grid-template-columns: repeat(6, 1fr);
	}

	.results__grid.results__grid--list {
		grid-template-columns: 1fr;
	}

	.results__item {
		position: relative;
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radii-lg);
		overflow: hidden;
		cursor: pointer;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.results__item:hover,
	.results__item:focus {
		transform: translateY(-4px);
		box-shadow: var(--gr-shadow-lg);
	}

	.results__item:focus {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.results__item-image {
		position: relative;
		aspect-ratio: 1;
		overflow: hidden;
	}

	.results__item-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s;
	}

	.results__item:hover .results__item-image img {
		transform: scale(1.05);
	}

	.results__item-overlay {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.results__item:hover .results__item-overlay,
	.results__item:focus .results__item-overlay {
		opacity: 1;
	}

	.results__item-action {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		background: var(--gr-color-primary-600);
		border: none;
		border-radius: var(--gr-radii-md);
		color: white;
		font-size: var(--gr-typography-fontSize-sm);
		cursor: pointer;
		transition: background 0.2s;
	}

	.results__item-action:hover {
		background: var(--gr-color-primary-700);
	}

	.results__item-action svg {
		width: 16px;
		height: 16px;
	}

	.results__item-info {
		padding: var(--gr-spacing-scale-3);
	}

	.results__item-title {
		margin: 0 0 var(--gr-spacing-scale-1);
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: var(--gr-font-weight-medium);
		color: var(--gr-color-gray-100);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.results__item-artist {
		margin: 0;
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-400);
	}

	/* Loading skeleton */
	.results__skeleton {
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radii-lg);
		overflow: hidden;
	}

	.results__skeleton-image {
		aspect-ratio: 1;
		background: linear-gradient(
			90deg,
			var(--gr-color-gray-700) 25%,
			var(--gr-color-gray-600) 50%,
			var(--gr-color-gray-700) 75%
		);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
	}

	.results__skeleton-text {
		height: 16px;
		margin: var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border-radius: var(--gr-radii-sm);
	}

	.results__skeleton-text--short {
		width: 60%;
		height: 12px;
	}

	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	/* Empty and error states */
	.results__empty,
	.results__error {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--gr-spacing-scale-8);
		text-align: center;
	}

	.results__empty svg,
	.results__error svg {
		width: 64px;
		height: 64px;
		color: var(--gr-color-gray-500);
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.results__empty h2,
	.results__error h2 {
		margin: 0 0 var(--gr-spacing-scale-2);
		color: var(--gr-color-gray-200);
	}

	.results__empty p,
	.results__error p {
		margin: 0;
		color: var(--gr-color-gray-400);
	}

	.results__error button {
		margin-top: var(--gr-spacing-scale-4);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		background: var(--gr-color-primary-600);
		border: none;
		border-radius: var(--gr-radii-md);
		color: white;
		cursor: pointer;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.results__grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 768px) {
		.results__grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 480px) {
		.results__grid {
			grid-template-columns: repeat(1, 1fr);
		}
	}

	.results__item-image-btn {
		width: 100%;
		height: 100%;
		border: none;
		padding: 0;
		background: none;
		cursor: pointer;
		display: block;
	}

	.results__item-info-btn {
		width: 100%;
		border: none;
		padding: 0;
		background: none;
		text-align: left;
		cursor: pointer;
		display: block;
	}

	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.results__item,
		.results__item-image img,
		.results__item-overlay,
		.results__item-action {
			transition: none;
		}

		.results__skeleton-image {
			animation: none;
		}
	}
</style>
