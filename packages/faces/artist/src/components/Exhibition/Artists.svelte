<!--
Exhibition.Artists - Featured artists list with cards

Features:
- Artist cards with avatars
- Link to artist profiles
- Artwork count per artist
- Horizontal scroll for many artists

@component
@example
```svelte
<Exhibition.Artists />
```
-->

<script lang="ts">
	import { getExhibitionContext } from './context.js';

	interface Props {
		/**
		 * Maximum artists to show before "view all"
		 */
		maxVisible?: number;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { maxVisible = 6, class: className = '' }: Props = $props();

	const ctx = getExhibitionContext();
	const { exhibition } = ctx;

	// Get artists from exhibition
	const artists = $derived(exhibition.artists || []);

	// Visible artists
	const visibleArtists = $derived(maxVisible ? artists.slice(0, maxVisible) : artists);

	// Count artworks per artist
	function getArtworkCount(artistId: string): number {
		return exhibition.artworks.filter((artwork) => artwork.artistId === artistId).length;
	}

	// Show all state
	let showAll = $state(false);

	// Displayed artists based on showAll
	const displayedArtists = $derived(showAll ? artists : visibleArtists);
</script>

{#if artists.length > 0}
	<section class={`exhibition-artists ${className}`} aria-labelledby="exhibition-artists-heading">
		<div class="exhibition-artists__header">
			<h2 id="exhibition-artists-heading" class="exhibition-artists__heading">Featured Artists</h2>
			<span class="exhibition-artists__count">
				{artists.length}
				{artists.length === 1 ? 'artist' : 'artists'}
			</span>
		</div>

		<ul class="exhibition-artists__list" role="list">
			{#each displayedArtists as artist (artist.id)}
				<li class="exhibition-artists__item">
					<a
						href={`/artists/${artist.username}`}
						class="exhibition-artists__card"
						aria-label={`View ${artist.name}'s profile`}
					>
						<div class="exhibition-artists__avatar-wrapper">
							{#if artist.avatar}
								<img src={artist.avatar} alt="" class="exhibition-artists__avatar" loading="lazy" />
							{:else}
								<div class="exhibition-artists__avatar-placeholder" aria-hidden="true">
									{artist.name.charAt(0).toUpperCase()}
								</div>
							{/if}
							{#if artist.isVerified}
								<svg
									class="exhibition-artists__verified"
									viewBox="0 0 24 24"
									fill="currentColor"
									aria-label="Verified artist"
								>
									<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
								</svg>
							{/if}
						</div>
						<div class="exhibition-artists__info">
							<span class="exhibition-artists__name">{artist.name}</span>
							<span class="exhibition-artists__works">
								{getArtworkCount(artist.id)}
								{getArtworkCount(artist.id) === 1 ? 'work' : 'works'}
							</span>
						</div>
					</a>
				</li>
			{/each}
		</ul>

		{#if artists.length > maxVisible && !showAll}
			<button type="button" class="exhibition-artists__show-all" onclick={() => (showAll = true)}>
				View all {artists.length} artists
			</button>
		{/if}
	</section>
{/if}

<style>
	.exhibition-artists {
		padding: var(--gr-spacing-scale-6) 0;
	}

	.exhibition-artists__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.exhibition-artists__heading {
		font-size: var(--gr-font-size-xl);
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-100);
		margin: 0;
	}

	.exhibition-artists__count {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-400);
	}

	.exhibition-artists__list {
		display: flex;
		gap: var(--gr-spacing-scale-4);
		overflow-x: auto;
		padding: var(--gr-spacing-scale-2) 0;
		margin: 0;
		list-style: none;
		scrollbar-width: thin;
		scrollbar-color: var(--gr-color-gray-600) transparent;
	}

	.exhibition-artists__item {
		flex-shrink: 0;
	}

	.exhibition-artists__card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-4);
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radius-lg);
		text-decoration: none;
		transition:
			background 0.2s,
			transform 0.2s;
		min-width: 120px;
	}

	.exhibition-artists__card:hover {
		background: var(--gr-color-gray-700);
		transform: translateY(-2px);
	}

	.exhibition-artists__avatar-wrapper {
		position: relative;
	}

	.exhibition-artists__avatar {
		width: 64px;
		height: 64px;
		border-radius: var(--gr-radius-full);
		object-fit: cover;
	}

	.exhibition-artists__avatar-placeholder {
		width: 64px;
		height: 64px;
		border-radius: var(--gr-radius-full);
		background: var(--gr-color-gray-600);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--gr-font-size-xl);
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-300);
	}

	.exhibition-artists__verified {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 20px;
		height: 20px;
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radius-full);
		color: var(--gr-color-primary-400);
		padding: 2px;
	}

	.exhibition-artists__info {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.exhibition-artists__name {
		font-size: var(--gr-font-size-sm);
		font-weight: var(--gr-font-weight-medium);
		color: var(--gr-color-gray-100);
	}

	.exhibition-artists__works {
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-gray-400);
	}

	.exhibition-artists__show-all {
		display: block;
		width: 100%;
		margin-top: var(--gr-spacing-scale-4);
		padding: var(--gr-spacing-scale-3);
		background: transparent;
		border: 1px solid var(--gr-color-gray-600);
		border-radius: var(--gr-radius-md);
		color: var(--gr-color-gray-300);
		font-size: var(--gr-font-size-sm);
		cursor: pointer;
		transition:
			background 0.2s,
			border-color 0.2s;
	}

	.exhibition-artists__show-all:hover {
		background: var(--gr-color-gray-800);
		border-color: var(--gr-color-gray-500);
	}

	@media (prefers-reduced-motion: reduce) {
		.exhibition-artists__card,
		.exhibition-artists__show-all {
			transition: none;
		}
	}
</style>
