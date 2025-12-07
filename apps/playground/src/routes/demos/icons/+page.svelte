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

	const categories = ['all', 'brands', ...Object.keys(iconCategories)] as const;
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

	<section class="brand-icons-section">
		<h2>Brand Icons</h2>
		<p>Brand icons for OAuth providers and social platforms. These use fill instead of stroke for accurate brand representation.</p>
		
		<div class="brand-grid">
			<div class="brand-item">
				<div class="brand-icon-wrapper">
					<!-- GoogleIcon placeholder -->
					<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
						<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
						<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
						<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
						<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
					</svg>
				</div>
				<span>Google</span>
			</div>
			<div class="brand-item">
				<div class="brand-icon-wrapper">
					<!-- AppleIcon placeholder -->
					<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
						<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
					</svg>
				</div>
				<span>Apple</span>
			</div>
			<div class="brand-item">
				<div class="brand-icon-wrapper">
					<!-- MicrosoftIcon placeholder -->
					<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
						<path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
					</svg>
				</div>
				<span>Microsoft</span>
			</div>
			<div class="brand-item">
				<div class="brand-icon-wrapper">
					<!-- DiscordIcon placeholder -->
					<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
						<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
					</svg>
				</div>
				<span>Discord</span>
			</div>
		</div>
		
		<div class="brand-usage-note">
			<strong>Usage Note:</strong> Brand icons should be used according to each company's brand guidelines. 
			These are commonly used for OAuth sign-in buttons and social sharing features.
		</div>
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
	.brand-icons-section {
		margin-bottom: 2rem;
		padding: 1.5rem;
		border: 1px solid var(--gr-semantic-border-default);
		border-radius: var(--gr-radii-xl);
		background: var(--gr-semantic-background-secondary);
	}

	.brand-icons-section h2 {
		margin: 0 0 0.5rem;
		font-size: var(--gr-typography-fontSize-lg);
	}

	.brand-icons-section > p {
		margin: 0 0 1rem;
		color: var(--gr-semantic-foreground-secondary);
		font-size: var(--gr-typography-fontSize-sm);
	}

	.brand-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin-bottom: 1rem;
	}

	.brand-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.brand-icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 64px;
		height: 64px;
		background: var(--gr-semantic-background-primary);
		border: 1px solid var(--gr-semantic-border-default);
		border-radius: var(--gr-radii-lg);
	}

	.brand-item span {
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-semantic-foreground-secondary);
	}

	.brand-usage-note {
		padding: 0.75rem 1rem;
		background: var(--gr-semantic-background-primary);
		border-radius: var(--gr-radii-md);
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-semantic-foreground-secondary);
	}

	.brand-usage-note strong {
		color: var(--gr-semantic-foreground-primary);
	}

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
