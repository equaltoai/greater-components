<!--
DiscoveryEngine.Suggestions - AI-powered artwork suggestions

Features:
- AI-generated similar work suggestions
- "More like this" functionality
- Confidence indicators
- Accessible display

@component
@example
```svelte
<DiscoveryEngine.Suggestions title="You might also like" />
```
-->

<script lang="ts">
	import { getDiscoveryContext } from './context.js';
	import type { ArtworkData } from '../../types/artwork.js';

	interface Props {
		/**
		 * Section title
		 */
		title?: string;

		/**
		 * Maximum suggestions to show
		 */
		maxItems?: number;

		/**
		 * Show confidence scores
		 */
		showConfidence?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		title = 'Suggested for you',
		maxItems = 6,
		showConfidence = false,
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

	// Load suggestions on mount
	$effect(() => {
		store.loadSuggestions();
	});

	// Displayed suggestions
	const displayedSuggestions = $derived(storeState.suggestions.slice(0, maxItems));

	// Handle suggestion click
	function handleSuggestionClick(artwork: ArtworkData) {
		handlers.onResultClick?.(artwork);
	}

	// Handle "more like this"
	function handleMoreLikeThis(artwork: ArtworkData, event: Event) {
		event.stopPropagation();
		handlers.onMoreLikeThis?.(artwork);
	}
</script>

{#if displayedSuggestions.length > 0}
	<section class={`suggestions ${className}`} aria-labelledby="suggestions-title">
		<div class="suggestions__header">
			<h2 id="suggestions-title" class="suggestions__title">{title}</h2>
			<button
				type="button"
				class="suggestions__refresh"
				onclick={() => store.loadSuggestions()}
				aria-label="Refresh suggestions"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
					<path
						d="M23 4v6h-6M1 20v-6h6"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		</div>

		<div class="suggestions__grid">
			{#each displayedSuggestions as artwork (artwork.id)}
				<div
					class="suggestions__item"
					role="button"
					tabindex="0"
					onclick={() => handleSuggestionClick(artwork)}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							handleSuggestionClick(artwork);
						}
					}}
				>
					<div class="suggestions__item-image">
						<img src={artwork.images.preview} alt={artwork.altText} loading="lazy" />
						<div class="suggestions__item-overlay">
							<button
								type="button"
								class="suggestions__item-action"
								onclick={(e) => handleMoreLikeThis(artwork, e)}
								aria-label="Find similar artworks"
							>
								More like this
							</button>
						</div>
					</div>
					<div class="suggestions__item-info">
						<h3 class="suggestions__item-title">{artwork.title}</h3>
						<p class="suggestions__item-artist">{artwork.artist.name}</p>
						{#if showConfidence}
							<div class="suggestions__item-confidence">
								<span class="suggestions__confidence-bar" style:--confidence="85%"></span>
								<span class="suggestions__confidence-text">85% match</span>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</section>
{/if}

<style>
	.suggestions {
		padding: var(--gr-spacing-scale-6) 0;
	}

	.suggestions__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.suggestions__title {
		margin: 0;
		font-size: var(--gr-typography-fontSize-xl);
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-100);
	}

	.suggestions__refresh {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		padding: 0;
		background: var(--gr-color-gray-800);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-md);
		color: var(--gr-color-gray-400);
		cursor: pointer;
		transition:
			color 0.2s,
			border-color 0.2s;
	}

	.suggestions__refresh:hover {
		color: var(--gr-color-gray-100);
		border-color: var(--gr-color-gray-600);
	}

	.suggestions__refresh svg {
		width: 18px;
		height: 18px;
	}

	.suggestions__grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: var(--gr-spacing-scale-4);
	}

	.suggestions__item {
		position: relative;
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radii-lg);
		overflow: hidden;
		cursor: pointer;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.suggestions__item:hover,
	.suggestions__item:focus {
		transform: translateY(-4px);
		box-shadow: var(--gr-shadow-lg);
	}

	.suggestions__item:focus {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.suggestions__item-image {
		position: relative;
		aspect-ratio: 1;
		overflow: hidden;
	}

	.suggestions__item-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s;
	}

	.suggestions__item:hover .suggestions__item-image img {
		transform: scale(1.05);
	}

	.suggestions__item-overlay {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.suggestions__item:hover .suggestions__item-overlay,
	.suggestions__item:focus .suggestions__item-overlay {
		opacity: 1;
	}

	.suggestions__item-action {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		background: var(--gr-color-primary-600);
		border: none;
		border-radius: var(--gr-radii-md);
		color: white;
		font-size: var(--gr-typography-fontSize-sm);
		cursor: pointer;
		transition: background 0.2s;
	}

	.suggestions__item-action:hover {
		background: var(--gr-color-primary-700);
	}

	.suggestions__item-info {
		padding: var(--gr-spacing-scale-3);
	}

	.suggestions__item-title {
		margin: 0 0 var(--gr-spacing-scale-1);
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: var(--gr-font-weight-medium);
		color: var(--gr-color-gray-100);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.suggestions__item-artist {
		margin: 0;
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-400);
	}

	.suggestions__item-confidence {
		margin-top: var(--gr-spacing-scale-2);
	}

	.suggestions__confidence-bar {
		display: block;
		height: 4px;
		background: var(--gr-color-gray-700);
		border-radius: var(--gr-radii-full);
		overflow: hidden;
	}

	.suggestions__confidence-bar::after {
		content: '';
		display: block;
		width: var(--confidence, 0%);
		height: 100%;
		background: var(--gr-color-primary-500);
	}

	.suggestions__confidence-text {
		display: block;
		margin-top: var(--gr-spacing-scale-1);
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-500);
	}

	/* Responsive */
	@media (max-width: 1200px) {
		.suggestions__grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@media (max-width: 768px) {
		.suggestions__grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 480px) {
		.suggestions__grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.suggestions__item,
		.suggestions__item-image img,
		.suggestions__item-overlay,
		.suggestions__item-action,
		.suggestions__refresh {
			transition: none;
		}
	}
</style>
