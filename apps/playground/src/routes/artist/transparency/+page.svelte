<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';
	import { Transparency } from '@equaltoai/greater-components-artist/components/Transparency';
	
	const aiUsage = {
		usedAI: true,
		description: 'Used AI for background generation and texture synthesis.',
		tools: ['Midjourney', 'Stable Diffusion'],
		generators: ['Background', 'Texture']
	};

	const processSteps = [
		{ title: 'Sketch', description: 'Initial pencil sketch.', imageUrl: '/images/artist/artwork1.svg' },
		{ title: 'Line Art', description: 'Clean digital line art.', imageUrl: '/images/artist/artwork4.svg' },
		{ title: 'Color', description: 'Flat colors added.', imageUrl: '/images/artist/artwork5.svg' },
		{ title: 'Final', description: 'Rendering and lighting.', imageUrl: '/images/artist/artwork2.svg' }
	];
	
	let optOutStatus = $state({
		discoveryAI: true,
		generativeAI: false,
		allAI: false
	});

	function handleUpdate(newStatus: typeof optOutStatus) {
		optOutStatus = newStatus;
	}

	const transparencyExample = `
<!-- AI Disclosure -->
<Transparency.AIDisclosure usage={aiUsage} variant="card" />

<!-- Process Documentation -->
<Transparency.ProcessDocumentation steps={processSteps} />

<!-- Opt-out Controls -->
<Transparency.AIOptOutControls 
  currentStatus={optOutStatus}
  onUpdate={handleUpdate}
/>`;
</script>

<DemoPage
	eyebrow="Artist Face / Transparency"
	title="Transparency Tools"
	description="Tools for disclosing AI usage and documenting the creative process."
>
	<section class="demo-section">
		<header>
			<h2>AI Disclosure</h2>
			<p>Transparently display AI tool usage.</p>
		</header>
		<div class="demo-container">
			<div class="disclosure-grid">
				<Transparency.AIDisclosure usage={aiUsage} variant="card" />
				<Transparency.AIDisclosure usage={{ usedAI: false }} variant="card" />
			</div>
		</div>
	</section>

	<section class="demo-section">
		<header>
			<h2>Process Documentation</h2>
			<p>Show the steps taken to create an artwork.</p>
		</header>
		<div class="demo-container">
			<Transparency.ProcessDocumentation steps={processSteps} />
		</div>
	</section>

	<section class="demo-section">
		<header>
			<h2>AI Opt-Out</h2>
			<p>Controls for opting out of AI training.</p>
		</header>
		<div class="demo-container">
			<Transparency.AIOptOutControls 
				currentStatus={optOutStatus}
				onUpdate={handleUpdate}
			/>
		</div>
		
		<CodeExample code={transparencyExample} language="svelte" />
	</section>

	<section class="demo-section" id="ai-policy">
		<header>
			<h2>AI Policy</h2>
			<p>Platform policies regarding AI usage and artist rights.</p>
		</header>
		<div class="demo-container">
			<p>This is a placeholder for the platform's AI policy documentation.</p>
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
	
	.disclosure-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: var(--space-4);
	}
</style>
