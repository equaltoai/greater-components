<!--
DiscoveryEngine.Root - Container compound component for artwork discovery

Implements REQ-FR-004: AI-Powered Artwork Discovery
Implements accessibility with semantic heading structure and landmark regions

@component
@example
```svelte
<DiscoveryEngine.Root {store}>
  <DiscoveryEngine.SearchBar />
  <DiscoveryEngine.Filters />
  <DiscoveryEngine.Results />
  <DiscoveryEngine.Suggestions />
</DiscoveryEngine.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createDiscoveryContext, countActiveFilters, type DiscoveryHandlers } from './context.js';
	import type { DiscoveryStore } from '../../stores/types.js';

	interface Props {
		/**
		 * Discovery store instance from createDiscoveryStore()
		 */
		store: DiscoveryStore;

		/**
		 * Event handlers for discovery actions
		 */
		handlers?: DiscoveryHandlers;

		/**
		 * Enable color palette search
		 */
		enableColorSearch?: boolean;

		/**
		 * Enable mood-based discovery
		 */
		enableMoodMap?: boolean;

		/**
		 * Enable style filtering
		 */
		enableStyleFilter?: boolean;

		/**
		 * Enable visual search (image upload)
		 */
		enableVisualSearch?: boolean;

		/**
		 * Show filter panel
		 */
		showFilters?: boolean;

		/**
		 * Show suggestions
		 */
		showSuggestions?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;

		/**
		 * Child content
		 */
		children: Snippet;
	}

	let {
		store,
		handlers = {},
		enableColorSearch = true,
		enableMoodMap = true,
		enableStyleFilter = true,
		enableVisualSearch = true,
		showFilters = true,
		showSuggestions = true,
		class: className = '',
		children,
	}: Props = $props();

	// Create and set context for child components
	const config = $derived({
		enableColorSearch,
		enableMoodMap,
		enableStyleFilter,
		enableVisualSearch,
		showFilters,
		showSuggestions,
	});

	const ctx = createDiscoveryContext(
		() => store,
		() => config,
		() => handlers
	);

	// Subscribe to store state
	// Initialize with loading state to avoid accessing store prop immediately
	let storeState = $state({
		loading: true,
		results: [],
		filters: {},
		suggestions: [],
		error: null,
	} as unknown as ReturnType<typeof store.get>);

	$effect(() => {
		// Sync initial state
		storeState = store.get();
		const unsubscribe = store.subscribe((state) => {
			storeState = state;
			ctx.activeFilterCount = countActiveFilters(state.filters);
		});
		return unsubscribe;
	});

	// Computed classes
	const rootClasses = $derived(
		[
			'discovery-engine',
			ctx.filtersExpanded && 'discovery-engine--filters-expanded',
			storeState.loading && 'discovery-engine--loading',
			className,
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<section
	class={rootClasses}
	aria-label="Artwork discovery"
	data-search-mode={ctx.searchMode}
	data-loading={storeState.loading}
>
	<!-- Skip link for accessibility -->
	<a href="#discovery-results" class="skip-link">Skip to results</a>

	<!-- Main discovery content -->
	<div class="discovery-engine__content">
		{@render children()}
	</div>

	<!-- Loading overlay -->
	{#if storeState.loading}
		<div class="discovery-engine__loading" aria-live="polite" aria-busy="true">
			<span class="sr-only">Searching...</span>
		</div>
	{/if}
</section>

<style>
	.discovery-engine {
		position: relative;
		width: 100%;
		min-height: 400px;
		background: var(--gr-color-gray-900);
		color: var(--gr-color-gray-100);
	}

	.skip-link {
		position: absolute;
		top: -40px;
		left: 0;
		background: var(--gr-color-primary-500);
		color: white;
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		z-index: 100;
		transition: top 0.2s;
	}

	.skip-link:focus {
		top: 0;
	}

	.discovery-engine__content {
		position: relative;
		width: 100%;
	}

	.discovery-engine__loading {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 50;
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
		.skip-link {
			transition: none;
		}
	}
</style>
