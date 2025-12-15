<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';
	import { Artwork } from '@equaltoai/greater-components-artist/components/Artwork';
	import { MediaViewer } from '@equaltoai/greater-components-artist/components/MediaViewer';
	import ArtworkCard from '@equaltoai/greater-components-artist/components/ArtworkCard';
	import { componentArtworks } from '$lib/data/artist';
	import { base } from '$app/paths';

	const sampleArtwork = componentArtworks[0];
	const galleryArtworks = componentArtworks.slice(0, 3);

	let viewerOpen = $state(false);
	let currentIndex = $state(0);

	const basicExample = `
<Artwork.Root {artwork}>
  <Artwork.Image />
  <Artwork.Title />
  <Artwork.Attribution />
  <Artwork.Metadata />
  <Artwork.Stats />
  <Artwork.Actions />
</Artwork.Root>`;

	const cardExample = `
<ArtworkCard 
  {artwork}
  size="md"
  showOverlay={true}
  aspectRatio="preserve"
  onclick={() => openViewer(artwork)}
/>`;

	const viewerExample = `
<MediaViewer 
  artworks={galleryArtworks}
  currentIndex={0}
  background="black"
  showMetadata={true}
  enableZoom={true}
  onClose={() => viewerOpen = false}
/>`;
</script>

<DemoPage
	eyebrow="Artist Face / Display"
	title="Artwork Components"
	description="Display components for artwork presentation with progressive loading and accessibility."
>
	<section class="demo-section">
		<header>
			<h2>Artwork Compound Component</h2>
			<p>The main compound component for displaying artwork with full context.</p>
		</header>

		<div class="demo-container">
			<div class="artwork-demo">
				<Artwork.Root artwork={sampleArtwork}>
					<Artwork.Image />
					<Artwork.Title />
					<Artwork.Attribution profileBaseUrl="/greater-components/artist" />
					<Artwork.Metadata />
					<Artwork.Stats />
					<Artwork.Actions />
				</Artwork.Root>
			</div>
		</div>

		<CodeExample code={basicExample} language="svelte" />
	</section>

	<section class="demo-section">
		<header>
			<h2>Artwork Card</h2>
			<p>Compact artwork representation for grid views with hover overlay.</p>
		</header>

		<div class="demo-container">
			<div class="card-grid">
				{#each galleryArtworks as artwork (artwork.id)}
					<ArtworkCard
						{artwork}
						size="md"
						showOverlay={true}
						aspectRatio="preserve"
						onclick={() => {
							currentIndex = galleryArtworks.indexOf(artwork);
							viewerOpen = true;
						}}
					/>
				{/each}
			</div>
		</div>

		<CodeExample code={cardExample} language="svelte" />
	</section>

	<section class="demo-section">
		<header>
			<h2>Media Viewer</h2>
			<p>Full-screen immersive viewing experience with zoom and navigation.</p>
		</header>

		<div class="demo-container">
			<button class="open-viewer-btn" onclick={() => (viewerOpen = true)}>
				Open Media Viewer
			</button>
		</div>

		<CodeExample code={viewerExample} language="svelte" />
	</section>

	{#if viewerOpen}
		<MediaViewer.Root
			artworks={galleryArtworks}
			currentIndex={0}
			config={{
				background: 'black',
				showMetadata: true,
				showSocial: false,
				enableZoom: true,
				enablePan: true
			}}
			handlers={{
				onClose: () => (viewerOpen = false),
				onNavigate: (index) => (currentIndex = index)
			}}
		/>
	{/if}
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

	.demo-container {
		padding: var(--space-6);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		margin-bottom: var(--space-4);
	}

	.artwork-demo {
		max-width: 600px;
		margin: 0 auto;
	}

	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--space-4);
	}

	.open-viewer-btn {
		padding: var(--space-3) var(--space-6);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		font-weight: 500;
	}

	.open-viewer-btn:hover {
		background: var(--color-primary-hover);
	}
</style>
