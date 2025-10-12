<script lang="ts">
	import { components, getComponentStats, getComponentsByCategory } from '$lib/data/registry.js';
	import type { Component } from '$lib/data/registry.js';

	let searchQuery = $state('');
	let selectedType = $state<Component['type'] | 'all'>('all');
	let selectedCategory = $state<Component['category'] | 'all'>('all');

	const stats = getComponentStats();

	const filteredComponents = $derived(() => {
		let filtered = components;

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(c) =>
					c.name.toLowerCase().includes(query) ||
					c.description.toLowerCase().includes(query) ||
					c.tags.some((tag) => tag.toLowerCase().includes(query))
			);
		}

		// Filter by type
		if (selectedType !== 'all') {
			filtered = filtered.filter((c) => c.type === selectedType);
		}

		// Filter by category
		if (selectedCategory !== 'all') {
			filtered = filtered.filter((c) => c.category === selectedCategory);
		}

		return filtered;
	})();
</script>

<svelte:head>
	<title>Components - Greater Components</title>
	<meta
		name="description"
		content="Browse all ActivityPub and Lesser components for Svelte 5. Headless primitives, compound components, and adapters."
	/>
</svelte:head>

<div class="components-page">
	<header class="page-header">
		<h1>Component Registry</h1>
		<p class="subtitle">
			{stats.total} production-ready components for ActivityPub and Lesser
		</p>

		<div class="stats">
			<div class="stat">
				<span class="stat-value">{stats.byType.primitive}</span>
				<span class="stat-label">Primitives</span>
			</div>
			<div class="stat">
				<span class="stat-value">{stats.byType.compound}</span>
				<span class="stat-label">Compounds</span>
			</div>
			<div class="stat">
				<span class="stat-value">{stats.byType.pattern}</span>
				<span class="stat-label">Patterns</span>
			</div>
			<div class="stat">
				<span class="stat-value">{stats.byType.adapter}</span>
				<span class="stat-label">Adapters</span>
			</div>
		</div>
	</header>

	<div class="controls">
		<div class="search">
			<input
				type="search"
				placeholder="Search components..."
				bind:value={searchQuery}
				class="search-input"
			/>
		</div>

		<div class="filters">
			<select bind:value={selectedType} class="filter-select">
				<option value="all">All Types</option>
				<option value="primitive">Primitives</option>
				<option value="compound">Compounds</option>
				<option value="pattern">Patterns</option>
				<option value="adapter">Adapters</option>
			</select>

			<select bind:value={selectedCategory} class="filter-select">
				<option value="all">All Categories</option>
				<option value="headless">Headless</option>
				<option value="activitypub">ActivityPub</option>
				<option value="lesser">Lesser</option>
				<option value="adapters">Adapters</option>
			</select>
		</div>
	</div>

	<div class="components-grid">
		{#each filteredComponents as component (component.slug)}
			<a href="/components/{component.slug}" class="component-card">
				<div class="component-header">
					<h3 class="component-name">{component.name}</h3>
					<span class="component-type type-{component.type}">{component.type}</span>
				</div>

				<p class="component-description">{component.description}</p>

				<div class="component-meta">
					<div class="tags">
						{#each component.tags.slice(0, 3) as tag}
							<span class="tag">#{tag}</span>
						{/each}
					</div>

					{#if component.bundleSize}
						<span class="bundle-size" title="Gzipped size">
							{component.bundleSize.gzipped}
						</span>
					{/if}
				</div>

				<div class="component-footer">
					<span class="status status-{component.status}">{component.status}</span>
					<span class="wcag">WCAG {component.accessibility.wcag}</span>
				</div>
			</a>
		{:else}
			<div class="no-results">
				<p>No components found matching your filters.</p>
				<button
					onclick={() => {
						searchQuery = '';
						selectedType = 'all';
						selectedCategory = 'all';
					}}
				>
					Clear filters
				</button>
			</div>
		{/each}
	</div>
</div>

<style>
	.components-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.page-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.page-header h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		font-size: 1.125rem;
		color: var(--color-text-secondary);
		margin-bottom: 2rem;
	}

	.stats {
		display: flex;
		gap: 2rem;
		justify-content: center;
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.stat-value {
		font-size: 2rem;
		font-weight: bold;
		color: var(--color-primary);
	}

	.stat-label {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	.controls {
		display: flex;
		gap: 1rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
	}

	.search {
		flex: 1;
		min-width: 250px;
	}

	.search-input {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		font-size: 1rem;
	}

	.filters {
		display: flex;
		gap: 0.5rem;
	}

	.filter-select {
		padding: 0.75rem 1rem;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		background: var(--color-bg);
		font-size: 1rem;
	}

	.components-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.5rem;
	}

	.component-card {
		display: flex;
		flex-direction: column;
		padding: 1.5rem;
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
		background: var(--color-bg-card);
		text-decoration: none;
		color: inherit;
		transition: all 0.2s;
	}

	.component-card:hover {
		border-color: var(--color-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.component-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 0.75rem;
	}

	.component-name {
		font-size: 1.25rem;
		margin: 0;
	}

	.component-type {
		padding: 0.25rem 0.75rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.type-primitive {
		background: #e0f2fe;
		color: #0369a1;
	}

	.type-compound {
		background: #fef3c7;
		color: #92400e;
	}

	.type-pattern {
		background: #ddd6fe;
		color: #5b21b6;
	}

	.type-adapter {
		background: #d1fae5;
		color: #065f46;
	}

	.component-description {
		flex: 1;
		margin: 0 0 1rem 0;
		color: var(--color-text-secondary);
		line-height: 1.5;
	}

	.component-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		gap: 1rem;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tag {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
	}

	.bundle-size {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		font-family: monospace;
	}

	.component-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 1rem;
		border-top: 1px solid var(--color-border);
	}

	.status {
		padding: 0.25rem 0.75rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.status-stable {
		background: #d1fae5;
		color: #065f46;
	}

	.status-beta {
		background: #fef3c7;
		color: #92400e;
	}

	.status-alpha {
		background: #fee2e2;
		color: #991b1b;
	}

	.wcag {
		font-size: 0.75rem;
		color: var(--color-text-secondary);
	}

	.no-results {
		grid-column: 1 / -1;
		text-align: center;
		padding: 3rem 1rem;
	}

	.no-results button {
		margin-top: 1rem;
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		background: var(--color-bg);
		cursor: pointer;
	}

	@media (max-width: 768px) {
		.components-page {
			padding: 1rem;
		}

		.page-header h1 {
			font-size: 2rem;
		}

		.stats {
			gap: 1rem;
		}

		.controls {
			flex-direction: column;
		}

		.filters {
			width: 100%;
		}

		.filter-select {
			flex: 1;
		}

		.components-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
