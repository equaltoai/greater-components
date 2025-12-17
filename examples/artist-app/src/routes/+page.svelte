<script lang="ts">
	/**
	 * Artist Portfolio Home Page
	 *
	 * Demonstrates the Gallery component with masonry layout
	 * and artwork cards from the Artist Face.
	 */

	// Import components from local lib (installed via Greater CLI)
	// In a real app, these would be in $lib/components/faces/artist

	// Mock artwork data for demonstration
	const artworks = [
		{
			id: '1',
			title: 'Sunset Over Mountains',
			images: {
				thumbnail: 'https://picsum.photos/seed/art1/400/300',
				preview: 'https://picsum.photos/seed/art1/800/600',
				standard: 'https://picsum.photos/seed/art1/1200/900',
			},
			artist: {
				id: 'artist-1',
				name: 'Jane Artist',
				username: 'janeartist',
				avatar: 'https://picsum.photos/seed/avatar1/100/100',
			},
			metadata: {
				medium: 'Oil on canvas',
				year: 2024,
				dimensions: '24×36 in',
			},
			stats: { views: 1250, likes: 89, collections: 12, comments: 7 },
			altText: 'Oil painting of a sun setting behind layered mountain ridges',
			createdAt: new Date().toISOString(),
		},
		{
			id: '2',
			title: 'Urban Reflections',
			images: {
				thumbnail: 'https://picsum.photos/seed/art2/400/500',
				preview: 'https://picsum.photos/seed/art2/800/1000',
				standard: 'https://picsum.photos/seed/art2/1200/1500',
			},
			artist: {
				id: 'artist-2',
				name: 'Alex Chen',
				username: 'alexchen',
				avatar: 'https://picsum.photos/seed/avatar2/100/100',
			},
			metadata: {
				medium: 'Digital',
				year: 2024,
			},
			stats: { views: 856, likes: 124, collections: 28, comments: 15 },
			altText: 'Digital artwork showing city reflections in rain puddles',
			createdAt: new Date().toISOString(),
		},
		{
			id: '3',
			title: 'Abstract Harmony',
			images: {
				thumbnail: 'https://picsum.photos/seed/art3/400/400',
				preview: 'https://picsum.photos/seed/art3/800/800',
				standard: 'https://picsum.photos/seed/art3/1200/1200',
			},
			artist: {
				id: 'artist-1',
				name: 'Jane Artist',
				username: 'janeartist',
				avatar: 'https://picsum.photos/seed/avatar1/100/100',
			},
			metadata: {
				medium: 'Acrylic on canvas',
				year: 2023,
				dimensions: '30×30 in',
			},
			stats: { views: 2100, likes: 256, collections: 45, comments: 23 },
			altText: 'Abstract painting with flowing colors and geometric shapes',
			createdAt: new Date().toISOString(),
		},
		{
			id: '4',
			title: 'Forest Dreams',
			images: {
				thumbnail: 'https://picsum.photos/seed/art4/400/600',
				preview: 'https://picsum.photos/seed/art4/800/1200',
				standard: 'https://picsum.photos/seed/art4/1200/1800',
			},
			artist: {
				id: 'artist-3',
				name: 'Sam Green',
				username: 'samgreen',
				avatar: 'https://picsum.photos/seed/avatar3/100/100',
			},
			metadata: {
				medium: 'Watercolor',
				year: 2024,
				dimensions: '18×24 in',
			},
			stats: { views: 567, likes: 78, collections: 9, comments: 4 },
			altText: 'Dreamy watercolor forest scene with morning mist',
			createdAt: new Date().toISOString(),
		},
	];

	function handleArtistClick(artistId: string) {
		console.log('Navigate to artist:', artistId);
		// In real app: goto(`/artist/${artistId}`)
	}
</script>

<svelte:head>
	<title>Gallery | Artist Portfolio</title>
	<meta name="description" content="Explore our curated collection of artworks" />
</svelte:head>

<div class="gallery-page">
	<header class="gallery-header">
		<h1>Featured Artworks</h1>
		<p>Discover amazing works from talented artists</p>
	</header>

	<div class="gallery-grid">
		{#each artworks as artwork (artwork.id)}
			<article class="artwork-card">
				<a
					href={`/artwork/${artwork.id}`}
					class="artwork-card__link"
					aria-label={`View ${artwork.title}`}
				>
					<div class="artwork-card__image-container">
						<img
							src={artwork.images.thumbnail}
							alt={artwork.altText}
							class="artwork-card__image"
							loading="lazy"
						/>
					</div>
					<div class="artwork-card__content">
						<h3 class="artwork-card__title">{artwork.title}</h3>
					</div>
				</a>
				<div class="artwork-card__details">
					<button
						class="artwork-card__artist"
						onclick={(e) => {
							e.stopPropagation();
							handleArtistClick(artwork.artist.id);
						}}
					>
						<img
							src={artwork.artist.avatar}
							alt={artwork.artist.name}
							class="artwork-card__avatar"
						/>
						<span>{artwork.artist.name}</span>
					</button>
					<div class="artwork-card__meta">
						<span>{artwork.metadata.medium}</span>
						{#if artwork.metadata.year}
							<span>•</span>
							<span>{artwork.metadata.year}</span>
						{/if}
					</div>
					<div class="artwork-card__stats">
						<span>❤️ {artwork.stats.likes}</span>
						<span>👁️ {artwork.stats.views}</span>
					</div>
				</div>
			</article>
		{/each}
	</div>
</div>

<style>
	.gallery-page {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.gallery-header {
		text-align: center;
	}

	.gallery-header h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.gallery-header p {
		color: var(--gr-semantic-foreground-secondary);
	}

	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.artwork-card {
		background: var(--gr-semantic-surface-elevated);
		border-radius: 12px;
		overflow: hidden;
		cursor: pointer;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		border: 1px solid var(--gr-semantic-border-default);
	}

	.artwork-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
	}

	.artwork-card__image-container {
		aspect-ratio: 4/3;
		overflow: hidden;
	}

	.artwork-card__image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s;
	}

	.artwork-card:hover .artwork-card__image {
		transform: scale(1.05);
	}

	.artwork-card__link {
		text-decoration: none;
		color: inherit;
		display: block;
	}

	.artwork-card__content {
		padding: 0.5rem 1rem;
	}

	.artwork-card__details {
		padding: 0 1rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.artwork-card__title {
		font-size: 1rem;
		font-weight: 600;
		margin: 0;
	}

	.artwork-card__artist {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		color: var(--gr-semantic-foreground-secondary);
		font-size: 0.875rem;
	}

	.artwork-card__artist:hover {
		color: var(--gr-color-primary-500);
	}

	.artwork-card__avatar {
		width: 24px;
		height: 24px;
		border-radius: 50%;
	}

	.artwork-card__meta {
		display: flex;
		gap: 0.5rem;
		font-size: 0.75rem;
		color: var(--gr-semantic-foreground-muted);
	}

	.artwork-card__stats {
		display: flex;
		gap: 1rem;
		font-size: 0.75rem;
		color: var(--gr-semantic-foreground-secondary);
		padding-top: 0.5rem;
		border-top: 1px solid var(--gr-semantic-border-subtle);
	}
</style>
