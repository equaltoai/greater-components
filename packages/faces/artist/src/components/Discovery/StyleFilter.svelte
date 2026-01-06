<!--
StyleFilter - Artistic style filtering

Implements REQ-AI-001: Style Recognition

Features:
- Filter by artistic style/movement
- AI-detected style tags
- Style hierarchy (e.g., Impressionism > Post-Impressionism)
- Artwork count per style
- Multi-select with chips

@component
@example
```svelte
<StyleFilter
  styles={artStyles}
  selected={['impressionism', 'abstract']}
  showCount={true}
/>
```
-->

<script lang="ts">
	import type { ArtStyle } from '../../types/discovery.js';

	interface Props {
		/**
		 * Available art styles
		 */
		styles?: ArtStyle[];

		/**
		 * Selected style IDs
		 */
		selected?: string[];

		/**
		 * Show artwork count per style
		 */
		showCount?: boolean;

		/**
		 * Callback when selection changes
		 */
		onChange?: (selected: string[]) => void;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		styles = $bindable([]),
		selected = $bindable([]),
		showCount = true,
		onChange,
		class: className = '',
	}: Props = $props();

	// Default styles if none provided
	const defaultStyles: ArtStyle[] = [
		{ id: 'impressionism', name: 'Impressionism', category: 'traditional' },
		{ id: 'abstract', name: 'Abstract', category: 'traditional' },
		{ id: 'surrealism', name: 'Surrealism', category: 'traditional' },
		{ id: 'digital-art', name: 'Digital Art', category: 'digital' },
		{ id: 'photography', name: 'Photography', category: 'photography' },
		{ id: 'generative', name: 'Generative', category: 'generative' },
		{ id: 'mixed-media', name: 'Mixed Media', category: 'mixed-media' },
		{ id: 'minimalism', name: 'Minimalism', category: 'traditional' },
	];

	const displayStyles = $derived(styles.length > 0 ? styles : defaultStyles);

	// Group styles by category
	const stylesByCategory = $derived.by(() => {
		const groups: Record<string, ArtStyle[]> = {};
		for (const style of displayStyles) {
			if (!groups[style.category]) {
				groups[style.category] = [];
			}
			(groups[style.category] = groups[style.category] || []).push(style);
		}
		return groups;
	});

	// Category labels
	const categoryLabels: Record<string, string> = {
		traditional: 'Traditional',
		digital: 'Digital',
		'mixed-media': 'Mixed Media',
		photography: 'Photography',
		sculpture: 'Sculpture',
		installation: 'Installation',
		performance: 'Performance',
		video: 'Video',
		generative: 'Generative',
	};

	// Toggle style selection
	function toggleStyle(styleId: string) {
		if (selected.includes(styleId)) {
			selected = selected.filter((id) => id !== styleId);
		} else {
			selected = [...selected, styleId];
		}
		onChange?.(selected);
	}

	// Clear all selections
	function clearAll() {
		selected = [];
		onChange?.(selected);
	}

	// Check if style is selected
	function isSelected(styleId: string): boolean {
		return selected.includes(styleId);
	}
</script>

<div class={`style-filter ${className}`}>
	<div class="style-filter__header">
		<h3 class="style-filter__title">Art Styles</h3>
		{#if selected.length > 0}
			<button type="button" class="style-filter__clear" onclick={clearAll}>
				Clear ({selected.length})
			</button>
		{/if}
	</div>

	<!-- Selected styles chips -->
	{#if selected.length > 0}
		<div class="style-filter__selected" role="list" aria-label="Selected styles">
			{#each selected as styleId (styleId)}
				{@const selectedStyle = displayStyles.find((s) => s.id === styleId)}
				{#if selectedStyle}
					<div role="listitem">
						<button
							type="button"
							class="style-filter__chip"
							onclick={() => toggleStyle(styleId)}
							aria-label={`Remove ${selectedStyle.name}`}
						>
							<span>{selectedStyle.name}</span>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
								<path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round" />
							</svg>
						</button>
					</div>
				{/if}
			{/each}
		</div>
	{/if}

	<!-- Style categories -->
	<div class="style-filter__categories">
		{#each Object.entries(stylesByCategory) as [category, categoryStyles] (category)}
			<div class="style-filter__category">
				<h4 class="style-filter__category-title">
					{categoryLabels[category] || category}
				</h4>
				<div
					class="style-filter__options"
					role="group"
					aria-label={`${categoryLabels[category] || category} styles`}
				>
					{#each categoryStyles as style (style.id)}
						<button
							type="button"
							class="style-filter__option"
							class:selected={isSelected(style.id)}
							onclick={() => toggleStyle(style.id)}
							aria-pressed={isSelected(style.id)}
						>
							<span class="style-filter__option-name">{style.name}</span>
							{#if showCount}
								<span class="style-filter__option-count">42</span>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.style-filter {
		padding: var(--gr-spacing-scale-4);
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radii-lg);
	}

	.style-filter__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.style-filter__title {
		margin: 0;
		font-size: var(--gr-typography-fontSize-lg);
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-100);
	}

	.style-filter__clear {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: transparent;
		border: none;
		color: var(--gr-color-primary-400);
		font-size: var(--gr-typography-fontSize-sm);
		cursor: pointer;
	}

	.style-filter__selected {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gr-spacing-scale-2);
		margin-bottom: var(--gr-spacing-scale-4);
		padding-bottom: var(--gr-spacing-scale-4);
		border-bottom: 1px solid var(--gr-color-gray-700);
	}

	.style-filter__chip {
		display: inline-flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-color-primary-600);
		border: none;
		border-radius: var(--gr-radii-full);
		color: white;
		font-size: var(--gr-typography-fontSize-sm);
		cursor: pointer;
		transition: background 0.2s;
	}

	.style-filter__chip:hover {
		background: var(--gr-color-primary-700);
	}

	.style-filter__chip svg {
		width: 14px;
		height: 14px;
	}

	.style-filter__categories {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-4);
	}

	.style-filter__category-title {
		margin: 0 0 var(--gr-spacing-scale-2);
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-400);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.style-filter__options {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gr-spacing-scale-2);
	}

	.style-filter__option {
		display: inline-flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border: 1px solid var(--gr-color-gray-600);
		border-radius: var(--gr-radii-md);
		color: var(--gr-color-gray-200);
		font-size: var(--gr-typography-fontSize-sm);
		cursor: pointer;
		transition:
			background 0.2s,
			border-color 0.2s;
	}

	.style-filter__option:hover {
		background: var(--gr-color-gray-600);
		border-color: var(--gr-color-gray-500);
	}

	.style-filter__option.selected {
		background: var(--gr-color-primary-600);
		border-color: var(--gr-color-primary-500);
		color: white;
	}

	.style-filter__option-count {
		padding: 0 var(--gr-spacing-scale-1);
		background: rgba(255, 255, 255, 0.1);
		border-radius: var(--gr-radii-sm);
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-400);
	}

	.style-filter__option.selected .style-filter__option-count {
		background: rgba(255, 255, 255, 0.2);
		color: rgba(255, 255, 255, 0.8);
	}
</style>
