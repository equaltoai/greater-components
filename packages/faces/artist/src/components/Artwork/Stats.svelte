<!--
Artwork.Stats - Engagement statistics display component

Displays views, likes, collections, comments.
REQ-PHIL-008: Transparent, real metrics (no inflation).
Subtle styling until hover/focus.

@component
@example
```svelte
<Artwork.Root artwork={artworkData}>
  <Artwork.Stats showViews showLikes />
</Artwork.Root>
```
-->

<script lang="ts">
	import { getArtworkContext } from './context.js';

	interface Props {
		/**
		 * Show view count
		 */
		showViews?: boolean;

		/**
		 * Show like count
		 */
		showLikes?: boolean;

		/**
		 * Show collection count
		 */
		showCollections?: boolean;

		/**
		 * Show comment count
		 */
		showComments?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		showViews = true,
		showLikes = true,
		showCollections = true,
		showComments = true,
		class: className = '',
	}: Props = $props();

	const context = getArtworkContext();
	const { artwork, config } = context;
	const { stats } = artwork;

	// Format number for display
	function formatNumber(num: number): string {
		if (num >= 1000000) {
			return `${(num / 1000000).toFixed(1)}M`;
		}
		if (num >= 1000) {
			return `${(num / 1000).toFixed(1)}K`;
		}
		return num.toString();
	}

	// Compute CSS classes
	const statsClass = $derived(['gr-artist-artwork-stats', className].filter(Boolean).join(' '));
</script>

{#if config.showStats}
	<div class={statsClass} aria-label="Artwork statistics">
		{#if showViews}
			<div class="gr-artist-artwork-stats-item" title="{stats.views} views">
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
				<span>{formatNumber(stats.views)}</span>
			</div>
		{/if}

		{#if showLikes}
			<div class="gr-artist-artwork-stats-item" title="{stats.likes} likes">
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
				<span>{formatNumber(stats.likes)}</span>
			</div>
		{/if}

		{#if showCollections}
			<div class="gr-artist-artwork-stats-item" title="{stats.collections} collections">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
				</svg>
				<span>{formatNumber(stats.collections)}</span>
			</div>
		{/if}

		{#if showComments}
			<div class="gr-artist-artwork-stats-item" title="{stats.comments} comments">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
				</svg>
				<span>{formatNumber(stats.comments)}</span>
			</div>
		{/if}
	</div>
{/if}

<style>
	.gr-artist-artwork-stats {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-4);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		/* REQ-PHIL-001: Subtle until hover/focus */
		opacity: 0.6;
		transition: opacity var(--gr-artist-transition-hover, 200ms ease-out);
	}

	.gr-artist-artwork-stats:hover,
	.gr-artist-artwork-stats:focus-within {
		opacity: 1;
	}

	.gr-artist-artwork-stats-item {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-artist-adaptive-muted, var(--gr-color-gray-500));
	}

	.gr-artist-artwork-stats-item svg {
		width: 16px;
		height: 16px;
	}

	/* REQ-A11Y-007: Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.gr-artist-artwork-stats {
			transition: none;
		}
	}
</style>
