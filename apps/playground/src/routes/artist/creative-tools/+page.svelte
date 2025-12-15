<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';
	import { WorkInProgress } from '@equaltoai/greater-components-artist/components/CreativeTools';
	
	const wipData = {
		id: 'wip-1',
		title: 'Character Design v3',
		artistId: 'artist-1',
		artistName: 'Jane Artist',
		status: 'in_progress',
		currentProgress: 60,
		isComplete: false,
		updates: [
			{ 
				id: 'v1', 
				content: 'Initial sketch', 
				media: [{ type: 'image', url: '/images/artist/artwork1.svg' }],
				createdAt: new Date(Date.now() - 86400000).toISOString() 
			},
			{ 
				id: 'v2', 
				content: 'Color pass', 
				media: [{ type: 'image', url: '/images/artist/artwork4.svg' }],
				createdAt: new Date().toISOString() 
			}
		],
		createdAt: new Date().toISOString()
	};

	const creativeExample = `
<!-- WIP Component -->
<WorkInProgress.Root thread={wipData}>
  <WorkInProgress.Header />
  <div class="wip-layout">
      <WorkInProgress.Compare />
      <div class="wip-sidebar">
          <WorkInProgress.Timeline />
          <WorkInProgress.Comments />
      </div>
  </div>
</WorkInProgress.Root>`;
</script>

<DemoPage
	eyebrow="Artist Face / Creative Tools"
	title="Creative Tools"
	description="Tools for the artistic process: WIP sharing, critique, and commissions."
>
	<section class="demo-section">
		<header>
			<h2>Work In Progress</h2>
			<p>Share and track versions of artwork during the creation process.</p>
		</header>
		<div class="demo-container">
			<WorkInProgress.Root thread={wipData}>
				<WorkInProgress.Header />
				<div class="wip-layout">
					<WorkInProgress.Compare />
					<div class="wip-sidebar">
						<WorkInProgress.Timeline />
						<WorkInProgress.Comments />
					</div>
				</div>
			</WorkInProgress.Root>
		</div>
		
		<CodeExample code={creativeExample} language="svelte" />
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

	.demo-container {
		padding: var(--space-6);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		margin-bottom: var(--space-6);
	}
	
	.wip-layout {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: var(--space-6);
		margin-top: var(--space-6);
	}
	
	.wip-sidebar {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}
	
	@media (max-width: 900px) {
		.wip-layout {
			grid-template-columns: 1fr;
		}
	}
</style>
