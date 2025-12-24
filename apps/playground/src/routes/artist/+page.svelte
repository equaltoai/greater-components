<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import { base } from '$app/paths';

	const sections = [
		{
			title: 'Display Components',
			items: [
				{
					name: 'Artwork',
					href: `${base}/artist/artwork`,
					description: 'Artwork display compound component',
				},
				{
					name: 'Gallery',
					href: `${base}/artist/gallery`,
					description: 'Gallery layouts and grids',
				},
			],
		},
		{
			title: 'Profile Components',
			items: [
				{
					name: 'Artist Profile',
					href: `${base}/artist/profile`,
					description: 'Artist portfolio and profile',
				},
				{
					name: 'Timeline',
					href: `${base}/artist/timeline`,
					description: 'Career timeline and activity',
				},
			],
		},
		{
			title: 'Discovery',
			items: [
				{
					name: 'Discovery Engine',
					href: `${base}/artist/discovery`,
					description: 'AI-powered search and filters',
				},
			],
		},
		{
			title: 'Creative Tools',
			items: [
				{
					name: 'Creative Tools',
					href: `${base}/artist/creative-tools`,
					description: 'WIP, critique, commissions',
				},
			],
		},
		{
			title: 'Community',
			items: [
				{
					name: 'Community',
					href: `${base}/artist/community`,
					description: 'Critique circles and collaboration',
				},
			],
		},
		{
			title: 'Transparency & Monetization',
			items: [
				{
					name: 'Transparency',
					href: `${base}/artist/transparency`,
					description: 'AI disclosure and process docs',
				},
				{
					name: 'Monetization',
					href: `${base}/artist/monetization`,
					description: 'Tips, purchases, and sales',
				},
			],
		},
	];
</script>

<DemoPage
	eyebrow="Artist Face"
	title="Artist Face Components"
	description="Visual artist portfolio and gallery UI components designed for art-first experiences."
>
	<section class="overview-section">
		<div class="intro">
			<p>
				The Artist Face is a specialized component bundle designed for visual artist communities and
				portfolio-centric social platforms. Unlike the social face which prioritizes text-based
				microblogging, the Artist Face reimagines the visual hierarchy to place <strong
					>artwork first</strong
				>
				and social elements second.
			</p>
		</div>

		<div class="features">
			<h2>Key Features</h2>
			<ul>
				<li><strong>Art-First Design</strong> - UI chrome recedes to let artwork breathe</li>
				<li><strong>Gallery Layouts</strong> - Masonry grids, rows, and virtual scrolling</li>
				<li>
					<strong>AI-Powered Discovery</strong> - Search by color, style, mood, and composition
				</li>
				<li><strong>Creative Tools</strong> - WIP tracking, critique mode, reference boards</li>
				<li><strong>Transparency</strong> - AI usage disclosure and process documentation</li>
				<li><strong>Federation</strong> - ActivityPub support for decentralized art sharing</li>
			</ul>
		</div>

		<div class="component-sections">
			{#each sections as section (section.title)}
				<div class="section-group">
					<h3>{section.title}</h3>
					<div class="section-items">
						{#each section.items as item (item.href)}
							<a href={item.href} class="section-item">
								<span class="item-name">{item.name}</span>
								<span class="item-description">{item.description}</span>
							</a>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>
</DemoPage>

<style>
	.overview-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
	}

	.intro p {
		font-size: var(--font-size-lg);
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	.features h2 {
		font-size: var(--font-size-xl);
		margin-bottom: var(--space-4);
	}

	.features ul {
		list-style: none;
		padding: 0;
		display: grid;
		gap: var(--space-3);
	}

	.features li {
		padding: var(--space-3);
		background: var(--color-surface);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.component-sections {
		display: grid;
		gap: var(--space-6);
	}

	.section-group h3 {
		font-size: var(--font-size-lg);
		margin-bottom: var(--space-3);
		color: var(--color-text-primary);
	}

	.section-items {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--space-4);
	}

	.section-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		padding: var(--space-4);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.section-item:hover {
		border-color: var(--color-primary);
		box-shadow: var(--shadow-md);
	}

	.item-name {
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.item-description {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
	}
</style>
