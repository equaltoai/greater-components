<!--
DiscoveryEngine.Filters - Filter controls for artwork discovery

Features:
- Style, color, medium, mood filters
- Active filter chips
- Clear all filters
- Save filter presets
- Keyboard accessible

@component
@example
```svelte
<DiscoveryEngine.Filters />
```
-->

<script lang="ts">
	import { getDiscoveryContext, countActiveFilters } from './context.js';
	import type {
		DiscoveryFilters,
		ArtStyle,
		MoodDimensions,
		ColorPalette,
	} from '../../types/discovery.js';
	import StyleFilter from './StyleFilter.svelte';
	import ColorPaletteSearch from './ColorPaletteSearch.svelte';
	import MoodMap from './MoodMap.svelte';

	interface Props {
		/**
		 * Show as collapsible panel
		 */
		collapsible?: boolean;

		/**
		 * Initially expanded
		 */
		defaultExpanded?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		collapsible = true,
		defaultExpanded: initialExpanded = false,
		class: className = '',
	}: Props = $props();

	const ctx = getDiscoveryContext();
	const { store, config, handlers } = ctx;

	// Local state
	// svelte-ignore state_referenced_locally
	let isExpanded = $state(initialExpanded);

	// Store state subscription
	let storeState = $state(store.get());
	$effect(() => {
		const unsubscribe = store.subscribe((state) => {
			storeState = state;
		});
		return unsubscribe;
	});

	// Active filter count
	const activeCount = $derived(countActiveFilters(storeState.filters));

	// Toggle expansion
	function toggleExpanded() {
		if (collapsible) {
			isExpanded = !isExpanded;
			ctx.filtersExpanded = isExpanded;
		}
	}

	// Clear all filters
	function handleClearAll() {
		store.clearFilters();
		handlers.onFilterClear?.();
	}

	// Remove specific filter
	function removeFilter(key: keyof DiscoveryFilters) {
		const updates: Partial<DiscoveryFilters> = {};

		switch (key) {
			case 'styles':
				updates.styles = [];
				break;
			case 'mediums':
				updates.mediums = [];
				break;
			case 'tags':
				updates.tags = [];
				break;
			case 'colorPalette':
				updates.colorPalette = undefined;
				break;
			case 'mood':
				updates.mood = undefined;
				break;
			case 'dateRange':
				updates.dateRange = undefined;
				break;
			case 'priceRange':
				updates.priceRange = undefined;
				break;
			case 'aiUsage':
				updates.aiUsage = 'any';
				break;
			case 'forSaleOnly':
				updates.forSaleOnly = false;
				break;
			case 'featuredOnly':
				updates.featuredOnly = false;
				break;
		}

		store.updateFilters(updates);
		handlers.onFilterChange?.(updates);
	}

	// Available styles for the StyleFilter
	const availableStyles: ArtStyle[] = [
		{ id: 'impressionism', name: 'Impressionism', category: 'traditional' },
		{ id: 'abstract', name: 'Abstract', category: 'traditional' },
		{ id: 'surrealism', name: 'Surrealism', category: 'traditional' },
		{ id: 'digital-art', name: 'Digital Art', category: 'digital' },
		{ id: 'photography', name: 'Photography', category: 'photography' },
		{ id: 'generative', name: 'Generative', category: 'generative' },
		{ id: 'mixed-media', name: 'Mixed Media', category: 'mixed-media' },
		{ id: 'minimalism', name: 'Minimalism', category: 'traditional' },
		{ id: 'expressionism', name: 'Expressionism', category: 'traditional' },
		{ id: 'pop-art', name: 'Pop Art', category: 'traditional' },
	];

	// Available mediums for the MediumFilter
	const availableMediums = [
		{ id: 'oil', name: 'Oil Paint' },
		{ id: 'acrylic', name: 'Acrylic' },
		{ id: 'watercolor', name: 'Watercolor' },
		{ id: 'digital', name: 'Digital' },
		{ id: 'pencil', name: 'Pencil' },
		{ id: 'charcoal', name: 'Charcoal' },
		{ id: 'pastel', name: 'Pastel' },
		{ id: 'ink', name: 'Ink' },
		{ id: 'photography', name: 'Photography' },
		{ id: 'sculpture', name: 'Sculpture' },
	];

	// Selected styles derived from store
	const selectedStyles = $derived(storeState.filters.styles ?? []);

	// Selected mediums derived from store
	const selectedMediums = $derived(storeState.filters.mediums ?? []);

	// Handle style filter change
	function handleStyleChange(styles: string[]) {
		store.updateFilters({ styles });
		handlers.onStyleChange?.(styles);
	}

	// Handle medium filter change
	function handleMediumChange(mediums: string[]) {
		store.updateFilters({ mediums });
		handlers.onFilterChange?.({ mediums });
	}

	// Toggle medium selection
	function toggleMedium(mediumId: string) {
		const currentMediums = storeState.filters.mediums ?? [];
		const newMediums = currentMediums.includes(mediumId)
			? currentMediums.filter((id) => id !== mediumId)
			: [...currentMediums, mediumId];
		handleMediumChange(newMediums);
	}

	// Handle color search
	function handleColorSearch(colors: string[]) {
		const colorPalette: ColorPalette = {
			colors,
			tolerance: 50,
			matchMode: 'similar',
		};
		store.updateFilters({ colorPalette });
		handlers.onColorSearch?.(colors, 50, 'any');
	}

	// Handle mood change
	function handleMoodChange(dimensions: MoodDimensions) {
		store.updateFilters({ mood: dimensions });
		handlers.onMoodChange?.(dimensions);
	}

	// Get filter chip labels
	function getFilterChips(): Array<{ key: keyof DiscoveryFilters; label: string }> {
		const chips: Array<{ key: keyof DiscoveryFilters; label: string }> = [];
		const filters = storeState.filters;

		if (filters.styles?.length) {
			chips.push({
				key: 'styles',
				label: `${filters.styles.length} style${filters.styles.length > 1 ? 's' : ''}`,
			});
		}
		if (filters.mediums?.length) {
			chips.push({
				key: 'mediums',
				label: `${filters.mediums.length} medium${filters.mediums.length > 1 ? 's' : ''}`,
			});
		}
		if (filters.tags?.length) {
			chips.push({
				key: 'tags',
				label: `${filters.tags.length} tag${filters.tags.length > 1 ? 's' : ''}`,
			});
		}
		if (filters.colorPalette?.colors?.length) {
			chips.push({
				key: 'colorPalette',
				label: `${filters.colorPalette.colors.length} color${filters.colorPalette.colors.length > 1 ? 's' : ''}`,
			});
		}
		if (filters.mood) {
			chips.push({ key: 'mood', label: 'Mood filter' });
		}
		if (filters.dateRange?.from || filters.dateRange?.to) {
			chips.push({ key: 'dateRange', label: 'Date range' });
		}
		if (filters.priceRange?.min !== undefined || filters.priceRange?.max !== undefined) {
			chips.push({ key: 'priceRange', label: 'Price range' });
		}
		if (filters.aiUsage && filters.aiUsage !== 'any') {
			chips.push({ key: 'aiUsage', label: `AI: ${filters.aiUsage}` });
		}
		if (filters.forSaleOnly) {
			chips.push({ key: 'forSaleOnly', label: 'For sale' });
		}
		if (filters.featuredOnly) {
			chips.push({ key: 'featuredOnly', label: 'Featured' });
		}

		return chips;
	}

	const filterChips = $derived(getFilterChips());
</script>

<div
	class={`filters ${className}`}
	class:filters--expanded={isExpanded}
	class:filters--collapsible={collapsible}
>
	<!-- Filter header -->
	<div class="filters__header">
		{#if collapsible}
			<button
				type="button"
				class="filters__toggle"
				onclick={toggleExpanded}
				aria-expanded={isExpanded}
				aria-controls="filter-panel"
			>
				<svg
					class="filters__toggle-icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<span>Filters</span>
				{#if activeCount > 0}
					<span class="filters__badge" aria-label="{activeCount} active filters">{activeCount}</span
					>
				{/if}
				<svg
					class="filters__chevron"
					class:rotated={isExpanded}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path d="M6 9l6 6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</button>
		{:else}
			<div class="filters__title">
				<svg
					class="filters__toggle-icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<span>Filters</span>
				{#if activeCount > 0}
					<span class="filters__badge">{activeCount}</span>
				{/if}
			</div>
		{/if}

		{#if activeCount > 0}
			<button
				type="button"
				class="filters__clear-all"
				onclick={handleClearAll}
				aria-label="Clear all filters"
			>
				Clear all
			</button>
		{/if}
	</div>

	<!-- Active filter chips -->
	{#if filterChips.length > 0}
		<ul class="filters__chips" aria-label="Active filters">
			{#each filterChips as chip (chip.key)}
				<li>
					<button
						type="button"
						class="filters__chip"
						onclick={() => removeFilter(chip.key)}
						aria-label={`Remove ${chip.label} filter`}
					>
						<span>{chip.label}</span>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
							<path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round" />
						</svg>
					</button>
				</li>
			{/each}
		</ul>
	{/if}

	<!-- Filter panel -->
	{#if !collapsible || isExpanded}
		<div id="filter-panel" class="filters__panel" role="group" aria-label="Filter options">
			<!-- Style Filter Section -->
			{#if config.enableStyleFilter}
				<div class="filters__section">
					<StyleFilter
						styles={availableStyles}
						selected={selectedStyles}
						showCount={true}
						onChange={handleStyleChange}
						class="filters__component"
					/>
				</div>
			{/if}

			<!-- Color Palette Search Section -->
			{#if config.enableColorSearch}
				<div class="filters__section">
					<ColorPaletteSearch
						colors={storeState.filters.colorPalette?.colors ?? []}
						onSearch={handleColorSearch}
						maxColors={5}
						class="filters__component"
					/>
				</div>
			{/if}

			<!-- Mood Map Section -->
			{#if config.enableMoodMap}
				<div class="filters__section">
					<MoodMap
						selection={{
							x: storeState.filters.mood?.energy ?? 0,
							y: storeState.filters.mood?.valence ?? 0,
						}}
						onChange={handleMoodChange}
						class="filters__component"
					/>
				</div>
			{/if}

			<!-- Medium Filter Section -->
			<div class="filters__section">
				<div class="filters__medium-filter">
					<div class="filters__medium-header">
						<h3 class="filters__section-title">Medium</h3>
						{#if selectedMediums.length > 0}
							<button
								type="button"
								class="filters__medium-clear"
								onclick={() => handleMediumChange([])}
							>
								Clear ({selectedMediums.length})
							</button>
						{/if}
					</div>
					<div class="filters__medium-options" role="group" aria-label="Filter by medium">
						{#each availableMediums as medium (medium.id)}
							<button
								type="button"
								class="filters__medium-option"
								class:selected={selectedMediums.includes(medium.id)}
								onclick={() => toggleMedium(medium.id)}
								aria-pressed={selectedMediums.includes(medium.id)}
							>
								{medium.name}
							</button>
						{/each}
					</div>
				</div>
			</div>

			<div class="filters__section">
				<h3 class="filters__section-title">Options</h3>
				<label class="filters__checkbox">
					<input
						type="checkbox"
						checked={storeState.filters.forSaleOnly}
						onchange={(e) => {
							const target = e.target as HTMLInputElement;
							store.updateFilters({ forSaleOnly: target.checked });
						}}
					/>
					<span>For sale only</span>
				</label>
				<label class="filters__checkbox">
					<input
						type="checkbox"
						checked={storeState.filters.featuredOnly}
						onchange={(e) => {
							const target = e.target as HTMLInputElement;
							store.updateFilters({ featuredOnly: target.checked });
						}}
					/>
					<span>Featured only</span>
				</label>
			</div>
		</div>
	{/if}

	<!-- Screen reader announcement -->
	<div class="sr-only" aria-live="polite">
		{#if activeCount > 0}
			{activeCount} filter{activeCount > 1 ? 's' : ''} active
		{:else}
			No filters active
		{/if}
	</div>
</div>

<style>
	.filters {
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radii-lg);
		overflow: hidden;
	}

	.filters__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--gr-spacing-scale-3) var(--gr-spacing-scale-4);
		border-bottom: 1px solid var(--gr-color-gray-700);
	}

	.filters__toggle,
	.filters__title {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		background: transparent;
		border: none;
		color: var(--gr-color-gray-100);
		font-weight: var(--gr-font-weight-medium);
		cursor: pointer;
	}

	.filters__toggle:focus {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.filters__toggle-icon {
		width: 18px;
		height: 18px;
	}

	.filters__badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 20px;
		height: 20px;
		padding: 0 var(--gr-spacing-scale-1);
		background: var(--gr-color-primary-600);
		border-radius: var(--gr-radii-full);
		font-size: var(--gr-typography-fontSize-xs);
		font-weight: var(--gr-font-weight-semibold);
	}

	.filters__chevron {
		width: 16px;
		height: 16px;
		transition: transform 0.2s;
	}

	.filters__chevron.rotated {
		transform: rotate(180deg);
	}

	.filters__clear-all {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: transparent;
		border: none;
		color: var(--gr-color-primary-400);
		font-size: var(--gr-typography-fontSize-sm);
		cursor: pointer;
		transition: color 0.2s;
	}

	.filters__clear-all:hover {
		color: var(--gr-color-primary-300);
	}

	.filters__chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-3) var(--gr-spacing-scale-4);
		border-bottom: 1px solid var(--gr-color-gray-700);
		list-style: none;
		margin: 0;
	}

	.filters__chip {
		display: inline-flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-700);
		border: none;
		border-radius: var(--gr-radii-full);
		color: var(--gr-color-gray-100);
		font-size: var(--gr-typography-fontSize-sm);
		cursor: pointer;
		transition: background 0.2s;
	}

	.filters__chip:hover {
		background: var(--gr-color-gray-600);
	}

	.filters__chip svg {
		width: 14px;
		height: 14px;
	}

	.filters__panel {
		padding: var(--gr-spacing-scale-4);
	}

	.filters__section {
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.filters__section:last-child {
		margin-bottom: 0;
	}

	.filters__section-title {
		margin: 0 0 var(--gr-spacing-scale-2);
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-300);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.filters__component {
		background: transparent;
		padding: 0;
	}

	.filters__medium-filter {
		background: var(--gr-color-gray-700);
		border-radius: var(--gr-radii-md);
		padding: var(--gr-spacing-scale-3);
	}

	.filters__medium-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--gr-spacing-scale-3);
	}

	.filters__medium-clear {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: transparent;
		border: none;
		color: var(--gr-color-primary-400);
		font-size: var(--gr-typography-fontSize-sm);
		cursor: pointer;
	}

	.filters__medium-options {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gr-spacing-scale-2);
	}

	.filters__medium-option {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-600);
		border: 1px solid var(--gr-color-gray-500);
		border-radius: var(--gr-radii-md);
		color: var(--gr-color-gray-200);
		font-size: var(--gr-typography-fontSize-sm);
		cursor: pointer;
		transition:
			background 0.2s,
			border-color 0.2s;
	}

	.filters__medium-option:hover {
		background: var(--gr-color-gray-500);
		border-color: var(--gr-color-gray-400);
	}

	.filters__medium-option.selected {
		background: var(--gr-color-primary-600);
		border-color: var(--gr-color-primary-500);
		color: white;
	}

	.filters__checkbox {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		margin-bottom: var(--gr-spacing-scale-2);
		cursor: pointer;
	}

	.filters__checkbox input {
		width: 16px;
		height: 16px;
		accent-color: var(--gr-color-primary-500);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.filters__chevron {
			transition: none;
		}
	}
</style>
