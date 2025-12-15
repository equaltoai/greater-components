<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';
	import { CritiqueCircle, MentorMatch } from '@equaltoai/greater-components-artist/components/Community';
	
	const circleData = {
		id: 'circle-1',
		name: 'Digital Illustrators',
		description: 'A circle for digital illustrators to improve their craft.',
		rules: 'Be constructive. Respect privacy.',
		members: [],
		queue: [],
		history: []
	};

	const communityExample = `
<!-- Critique Circle -->
<CritiqueCircle.Root circle={circleData} membership="member">
  <div class="circle-layout">
      <div class="main-col">
          <CritiqueCircle.Session />
          <CritiqueCircle.Queue />
      </div>
      <div class="side-col">
          <CritiqueCircle.Members />
          <CritiqueCircle.History />
      </div>
  </div>
</CritiqueCircle.Root>

<!-- Mentor Match -->
<MentorMatch />`;
</script>

<DemoPage
	eyebrow="Artist Face / Community"
	title="Community"
	description="Collaborative spaces for critique and mentorship."
>
	<section class="demo-section">
		<header>
			<h2>Critique Circle</h2>
			<p>Structured feedback sessions in a safe environment.</p>
		</header>
		<div class="demo-container">
			<CritiqueCircle.Root circle={circleData} membership="member">
				<div class="circle-layout">
					<div class="main-col">
						<CritiqueCircle.Session />
						<CritiqueCircle.Queue />
					</div>
					<div class="side-col">
						<CritiqueCircle.Members />
						<CritiqueCircle.History />
					</div>
				</div>
			</CritiqueCircle.Root>
		</div>
		
		<CodeExample code={communityExample} language="svelte" />
	</section>

	<section class="demo-section">
		<header>
			<h2>Mentor Match</h2>
			<p>Find a mentor or mentee to grow your skills.</p>
		</header>
		<div class="demo-container">
			<MentorMatch />
		</div>
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
	
	.circle-layout {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: var(--space-6);
	}
	
	.main-col, .side-col {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}
	
	@media (max-width: 900px) {
		.circle-layout {
			grid-template-columns: 1fr;
		}
	}
</style>
