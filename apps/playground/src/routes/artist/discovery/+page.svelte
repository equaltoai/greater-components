<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';
	import { DiscoveryEngine } from '@equaltoai/greater-components-artist/components/Discovery';
	import { createDiscoveryStore } from '@equaltoai/greater-components-artist/stores';
	import { componentArtworks } from '$lib/data/artist';

	const store = createDiscoveryStore({
		initialItems: componentArtworks
	});

	const discoveryExample = `
<DiscoveryEngine.Root {store}>
  <DiscoveryEngine.SearchBar />
  <DiscoveryEngine.Filters />
  <div class="discovery-content">
      <DiscoveryEngine.Results />
      <aside class="sidebar">
          <DiscoveryEngine.Suggestions />
          <DiscoveryEngine.ColorPaletteSearch />
          <DiscoveryEngine.MoodMap />
      </aside>
  </div>
</DiscoveryEngine.Root>`;
</script>

<DemoPage
	eyebrow="Artist Face / Discovery"
	title="Discovery Engine"
	description="AI-powered search and discovery for artworks."
>
	<section class="demo-section">
		<div class="demo-container">
			<DiscoveryEngine.Root {store}>
				<div class="discovery-header">
					<DiscoveryEngine.SearchBar />
					<DiscoveryEngine.Filters />
				</div>
				
				<div class="discovery-grid">
					<div class="results-area">
						<DiscoveryEngine.Results />
					</div>
					<aside class="discovery-sidebar">
						<div class="widget">
							<h3>Suggestions</h3>
							<DiscoveryEngine.Suggestions />
						</div>
						<div class="widget">
							<h3>Color Match</h3>
							<DiscoveryEngine.ColorPaletteSearch />
						</div>
						<div class="widget">
							<h3>Mood Map</h3>
							<DiscoveryEngine.MoodMap />
						</div>
					</aside>
				</div>
			</DiscoveryEngine.Root>
		</div>
		
		<CodeExample code={discoveryExample} language="svelte" />
	</section>
</DemoPage>

<style>
	.demo-container {
		padding: var(--space-6);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}
	
	.discovery-header {
		margin-bottom: var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
	
	.discovery-grid {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: var(--space-6);
	}
	
	@media (max-width: 900px) {
		.discovery-grid {
			grid-template-columns: 1fr;
		}
	}
	
	.widget {
		margin-bottom: var(--space-6);
		padding: var(--space-4);
		background: var(--color-background);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}
	
	.widget h3 {
		font-size: var(--font-size-md);
		margin-bottom: var(--space-3);
		font-weight: 600;
	}
</style>
