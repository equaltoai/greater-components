<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import { Button, TextField } from '@equaltoai/greater-components-primitives';
	import * as IconComponents from '@equaltoai/greater-components-icons';
	import { iconList, iconCategories, iconAliases } from '@equaltoai/greater-components-icons';

	type CategoryKey = keyof typeof iconCategories;

	const aliasLookup = Object.entries(iconAliases).reduce<Record<string, string[]>>(
		(acc, [alias, canonical]) => {
			acc[canonical] = acc[canonical] ?? [];
			acc[canonical].push(alias);
			return acc;
		},
		{}
	);

	const categories = ['all', ...Object.keys(iconCategories)] as const;
	type FilterCategory = (typeof categories)[number];

	let selectedCategory = $state<FilterCategory>('all');
	let search = $state('');
	let previewSize = $state(48);
	let previewStroke = $state(2);
	let previewColor = $state('currentColor');
	let activeIcon = $state(iconList[0]);
	let copySuccess = $state<'idle' | 'copied'>('idle');

	const totalIcons = iconList.length;
	const aliasCount = Object.keys(iconAliases).length;

	function toComponentName(name: string) {
		return name
			.split('-')
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join('');
	}

	const filteredIcons = $derived(() => {
		const query = search.trim().toLowerCase();
		const pool =
			selectedCategory === 'all'
				? iconList
				: (iconCategories[selectedCategory as CategoryKey] ?? []);
		if (!query) return pool;
		return pool.filter(
			(name) => name.includes(query) || aliasLookup[name]?.some((alias) => alias.includes(query))
		);
	});

	function getIconComponent(name: string) {
		return IconComponents[`${toComponentName(name)}Icon` as keyof typeof IconComponents];
	}

	const ActiveIconComponent = $derived(() => getIconComponent(activeIcon));

	const usageSnippet = $derived(() => {
		const componentName = `${toComponentName(activeIcon)}Icon`;
		return `import { ${componentName} } from '@equaltoai/greater-components-icons';\n\n<${componentName} size={${previewSize}} strokeWidth={${previewStroke}} color="${previewColor}" />`;
	});

	const clipboard = typeof navigator !== 'undefined' ? navigator.clipboard : undefined;

	async function copyUsage() {
		if (!clipboard?.writeText) {
			return;
		}

		try {
			await clipboard.writeText(usageSnippet());
			copySuccess = 'copied';
			setTimeout(() => (copySuccess = 'idle'), 2000);
		} catch (error) {
			console.error('Copy failed', error);
		}
	}
</script>

<DemoPage
	eyebrow="Icon Library"
	title="Icon Gallery"
	description="Search, filter, and preview the 300+ icons shipping with Greater Components. Every icon renders from the published build so you see exactly what consumers receive."
>
	<section class="icon-meta">
		<div>
			<p class="label">Total Icons</p>
			<strong>{totalIcons}</strong>
		</div>
		<div>
			<p class="label">Aliases</p>
			<strong>{aliasCount}</strong>
		</div>
		<div>
			<p class="label">Categories</p>
			<strong>{Object.keys(iconCategories).length}</strong>
		</div>
	</section>

	<section class="icon-controls" aria-label="Icon filters">
		<TextField
			label="Search icons"
			placeholder="Type a name or alias"
			bind:value={search}
			data-testid="icon-search"
		/>
		<div class="chip-row">
			{#each categories as category (category)}
				<button
					type="button"
					class:selected={selectedCategory === category}
					onclick={() => (selectedCategory = category)}
				>
					{category === 'all' ? 'All icons' : category.replace(/([A-Z])/g, ' $1')}
				</button>
			{/each}
		</div>
	</section>

	<section class="icon-grid" aria-live="polite">
		{#if filteredIcons().length === 0}
			<p class="empty-state">No icons match “{search}”. Try another name or reset filters.</p>
		{:else}
			{#each filteredIcons() as name (name)}
				{@const IconComponent = getIconComponent(name)}
				<button
					class="icon-card"
					aria-pressed={activeIcon === name}
					onclick={() => (activeIcon = name)}
					type="button"
				>
					{#if IconComponent}
						<IconComponent size={32} />
					{/if}
					<span>{name}</span>
				</button>
			{/each}
		{/if}
	</section>

	<section class="icon-preview">
		<div class="preview-header">
			<div>
				<p class="label">Selected icon</p>
				<h2>{toComponentName(activeIcon)}</h2>
			</div>
			<Button variant="outline" size="sm" onclick={copyUsage} data-testid="copy-usage">
				{copySuccess === 'copied' ? 'Copied!' : 'Copy snippet'}
			</Button>
		</div>
		<div class="preview-pane">
			{#if ActiveIconComponent}
				<ActiveIconComponent
					size={previewSize}
					strokeWidth={previewStroke}
					color={previewColor}
					aria-label={activeIcon}
				/>
			{/if}
			<dl>
				<div>
					<dt>Category</dt>
					<dd>{selectedCategory === 'all' ? 'All' : selectedCategory}</dd>
				</div>
				<div>
					<dt>Aliases</dt>
					<dd>{aliasLookup[activeIcon]?.join(', ') ?? '—'}</dd>
				</div>
			</dl>
		</div>
		<div class="preview-controls">
			<label>
				Size ({previewSize}px)
				<input type="range" min="12" max="96" step="4" bind:value={previewSize} />
			</label>
			<label>
				Stroke width ({previewStroke})
				<input type="range" min="1" max="4" step="0.5" bind:value={previewStroke} />
			</label>
			<label>
				Color
				<input type="color" bind:value={previewColor} />
			</label>
		</div>
		<pre><code>{usageSnippet()}</code></pre>
	</section>
</DemoPage>

<style>
	.icon-meta {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 1rem;
		padding: 1.5rem;
		border: 1px solid var(--gr-semantic-border-default);
		border-radius: var(--gr-radii-xl);
		background: var(--gr-semantic-background-secondary);
	}

	.label {
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-semantic-foreground-tertiary);
		margin-bottom: 0.25rem;
	}

	.icon-controls {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		border: 1px solid var(--gr-semantic-border-default);
		border-radius: var(--gr-radii-xl);
		padding: 1.5rem;
	}

	.chip-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.chip-row button {
		border: 1px solid var(--gr-semantic-border-default);
		border-radius: var(--gr-radii-full);
		padding: 0.35rem 0.9rem;
		background: transparent;
		color: inherit;
		cursor: pointer;
	}

	.chip-row button.selected {
		background: var(--gr-semantic-action-primary-default);
		border-color: var(--gr-semantic-action-primary-default);
		color: var(--gr-color-base-white);
	}

	.icon-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 0.75rem;
	}

	.icon-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.35rem;
		border: 1px solid var(--gr-semantic-border-subtle);
		border-radius: var(--gr-radii-lg);
		padding: 0.85rem;
		background: var(--gr-semantic-background-secondary);
		cursor: pointer;
		transition:
			border-color 0.15s ease,
			transform 0.15s ease;
	}

	.icon-card[aria-pressed='true'] {
		border-color: var(--gr-semantic-action-primary-default);
		transform: translateY(-2px);
	}

	.icon-card span {
		font-size: var(--gr-typography-fontSize-sm);
		text-transform: lowercase;
	}

	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		padding: 2rem;
		border: 1px dashed var(--gr-semantic-border-default);
		border-radius: var(--gr-radii-xl);
		color: var(--gr-semantic-foreground-secondary);
	}

	.icon-preview {
		border: 1px solid var(--gr-semantic-border-default);
		border-radius: var(--gr-radii-xl);
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.preview-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.preview-pane {
		display: flex;
		gap: 2rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.preview-pane dl {
		margin: 0;
		display: grid;
		gap: 0.75rem;
	}

	.preview-pane dt {
		font-size: var(--gr-typography-fontSize-xs);
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--gr-semantic-foreground-tertiary);
	}

	.preview-controls {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1rem;
	}

	.preview-controls label {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-size: var(--gr-typography-fontSize-sm);
	}

	pre {
		margin: 0;
		border-radius: var(--gr-radii-lg);
		background: var(--gr-semantic-background-secondary);
		border: 1px solid var(--gr-semantic-border-subtle);
	}
</style>
