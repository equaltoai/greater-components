<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';
	import { Monetization } from '@equaltoai/greater-components-artist/components/Monetization';
	import { demoArtist, artworks } from '$lib/data/artist';

	const pricing = {
		price: { amount: 150, currency: 'USD' },
		available: true,
	};

	const monetizationExample = `
<!-- Tip Jar -->
<Monetization.TipJar artist={demoArtist} />

<!-- Direct Purchase -->
<Monetization.DirectPurchase artwork={artwork} pricing={pricing} />

<!-- Protection Tools -->
<Monetization.ProtectionTools artwork={artwork} />`;
</script>

<DemoPage
	eyebrow="Artist Face / Monetization"
	title="Monetization"
	description="Tools for artists to earn from their work."
>
	<section class="demo-section">
		<header>
			<h2>Tip Jar</h2>
			<p>Support the artist directly.</p>
		</header>
		<div class="demo-container">
			<Monetization.TipJar artist={demoArtist} />
		</div>
	</section>

	<section class="demo-section">
		<header>
			<h2>Direct Purchase</h2>
			<p>Buy artworks directly from the artist.</p>
		</header>
		<div class="demo-container">
			<Monetization.DirectPurchase artwork={artworks[0]} {pricing} />
		</div>
	</section>

	<section class="demo-section">
		<header>
			<h2>Protection Tools</h2>
			<p>Protect your intellectual property.</p>
		</header>
		<div class="demo-container">
			<Monetization.ProtectionTools artwork={artworks[0]} />
		</div>

		<CodeExample code={monetizationExample} language="svelte" />
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
</style>
