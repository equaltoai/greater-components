<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';
	import { GalleryGrid, GalleryRow, GalleryMasonry } from '@equaltoai/greater-components-artist/components/Gallery';
	import { componentArtworks } from '$lib/data/artist';
	import { base } from '$app/paths';

	// Generate sample artworks by cycling through the 5 real ones
	const sampleArtworks = Array.from({ length: 12 }, (_, i) => ({
		...componentArtworks[i % componentArtworks.length],
		id: `gallery-artwork-${i + 1}`,
		title: `Artwork ${i + 1}`,
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
  showAllLink="${base}/artist/gallery"
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
				showAllLink={`${base}/artist/gallery`}
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
