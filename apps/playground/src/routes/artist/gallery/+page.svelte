<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';
	import { GalleryGrid, GalleryRow, GalleryMasonry } from '@equaltoai/greater-components-artist';
	import type { ArtworkData } from '@equaltoai/greater-components-artist/types';

	// Generate sample artworks with varying aspect ratios
	const sampleArtworks: ArtworkData[] = Array.from({ length: 12 }, (_, i) => ({
		id: `artwork-${i + 1}`,
		title: `Artwork ${i + 1}`,
		imageUrl: `https://picsum.photos/seed/gallery${i}/${300 + (i % 3) * 100}/${400 + (i % 4) * 50}`,
		thumbnailUrl: `https://picsum.photos/seed/gallery${i}/150/150`,
		artist: {
			id: 'artist-1',
			name: 'Demo Artist',
			username: 'demoartist',
			avatar: 'https://picsum.photos/seed/avatar/100/100',
		},
		metadata: {
			medium: 'Digital Art',
			year: 2024,
		},
		stats: {
			views: Math.floor(Math.random() * 1000),
			likes: Math.floor(Math.random() * 100),
			collections: Math.floor(Math.random() * 20),
			comments: Math.floor(Math.random() * 10),
		},
	}));

	let gridColumns = $state<number | 'auto'>('auto');
	let gridGap = $state<'sm' | 'md' | 'lg'>('md');

	const gridExample = `
<GalleryGrid 
  items={artworks}
  columns="auto"
  gap="md"
  virtualScrolling={true}
  onLoadMore={loadMore}
/>`;

	const rowExample = `
<GalleryRow 
  items={featuredArtworks}
  title="Featured This Week"
  showAllLink="/gallery/featured"
  cardSize="md"
/>`;

	const masonryExample = `
<GalleryMasonry 
  items={artworks}
  columnWidth={300}
  gap={16}
/>`;
</script>

<DemoPage
	eyebrow="Artist Face / Layout"
	title="Gallery Components"
	description="Layout components for displaying artwork collections with virtual scrolling and responsive behavior."
>
	<section class="demo-section">
		<header>
			<h2>Gallery Grid</h2>
			<p>Masonry-style grid layout with virtual scrolling support.</p>
		</header>

		<div class="controls">
			<label>
				Columns:
				<select bind:value={gridColumns}>
					<option value="auto">Auto</option>
					<option value={2}>2</option>
					<option value={3}>3</option>
					<option value={4}>4</option>
				</select>
			</label>
			<label>
				Gap:
				<select bind:value={gridGap}>
					<option value="sm">Small</option>
					<option value="md">Medium</option>
					<option value="lg">Large</option>
				</select>
			</label>
		</div>

		<div class="demo-container">
			<GalleryGrid
				items={sampleArtworks}
				columns={gridColumns}
				gap={gridGap}
				virtualScrolling={false}
			/>
		</div>

		<CodeExample code={gridExample} language="svelte" />
	</section>

	<section class="demo-section">
		<header>
			<h2>Gallery Row</h2>
			<p>Horizontal scrolling row for curated selections.</p>
		</header>

		<div class="demo-container">
			<GalleryRow
				items={sampleArtworks.slice(0, 6)}
				title="Featured This Week"
				showAllLink="/artist/gallery"
				cardSize="md"
			/>
		</div>

		<CodeExample code={rowExample} language="svelte" />
	</section>

	<section class="demo-section">
		<header>
			<h2>Gallery Masonry</h2>
			<p>Variable-height masonry layout respecting artwork aspect ratios.</p>
		</header>

		<div class="demo-container">
			<GalleryMasonry items={sampleArtworks} columnWidth={250} gap={16} />
		</div>

		<CodeExample code={masonryExample} language="svelte" />
	</section>
</DemoPage>

<style>
	.demo-section {
		margin-bottom: var(--space-12);
	}

	.demo-section header {
		margin-bottom: var(--space-6);
	}

	.demo-section h2 {
		font-size: var(--font-size-xl);
		margin-bottom: var(--space-2);
	}

	.demo-section p {
		color: var(--color-text-secondary);
	}

	.controls {
		display: flex;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
		padding: var(--space-4);
		background: var(--color-surface);
		border-radius: var(--radius-md);
	}

	.controls label {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.controls select {
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-background);
	}

	.demo-container {
		padding: var(--space-6);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		margin-bottom: var(--space-4);
		max-height: 600px;
		overflow-y: auto;
	}
</style>
