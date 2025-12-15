<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';
	import ArtistTimeline from '@equaltoai/greater-components-artist/components/ArtistTimeline';
	import { profileData, timelineItems } from '$lib/data/artist';

	const timelineExample = `
<ArtistTimeline
  artist={artist}
  items={timelineItems}
  showSocial={true}
  hasMore={true}
  onLoadMore={loadMore}
/>`;
</script>

<DemoPage
	eyebrow="Artist Face / Profile"
	title="Artist Timeline"
	description="Hybrid social feed with larger image previews and artwork-centric layout."
>
	<section class="demo-section">
		<div class="demo-container">
			<ArtistTimeline
				artist={profileData}
				items={timelineItems}
				showSocial={true}
				hasMore={false}
			/>
		</div>

		<CodeExample code={timelineExample} language="svelte" />
	</section>
</DemoPage>

<style>
	.demo-section {
		margin-bottom: var(--space-12);
	}

	.demo-container {
		padding: var(--space-6);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		margin-bottom: var(--space-6);
		max-width: 800px;
		margin-left: auto;
		margin-right: auto;
	}
</style>
