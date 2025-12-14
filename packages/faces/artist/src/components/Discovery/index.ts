/**
 * Discovery Components
 *
 * Components for artwork discovery, search, and filtering.
 * Implements REQ-FR-004: AI-Powered Artwork Discovery
 *
 * @example Basic usage
 * ```svelte
 * <script>
 *   import { DiscoveryEngine, createDiscoveryStore } from '@equaltoai/greater-components/faces/artist';
 *   const store = createDiscoveryStore();
 * </script>
 *
 * <DiscoveryEngine.Root {store}>
 *   <DiscoveryEngine.SearchBar />
 *   <DiscoveryEngine.Filters />
 *   <DiscoveryEngine.Results />
 *   <DiscoveryEngine.Suggestions />
 * </DiscoveryEngine.Root>
 * ```
 *
 * @module @equaltoai/greater-components-artist/components/Discovery
 */

// Export individual components
export { default as Root } from './Root.svelte';
export { default as SearchBar } from './SearchBar.svelte';
export { default as Filters } from './Filters.svelte';
export { default as Results } from './Results.svelte';
export { default as Suggestions } from './Suggestions.svelte';
export { default as ColorPaletteSearch } from './ColorPaletteSearch.svelte';
export { default as StyleFilter } from './StyleFilter.svelte';
export { default as MoodMap } from './MoodMap.svelte';

// Export context utilities and types
export {
	DISCOVERY_CONTEXT_KEY,
	createDiscoveryContext,
	getDiscoveryContext,
	hasDiscoveryContext,
	DEFAULT_DISCOVERY_CONFIG,
	countActiveFilters,
	formatResultCount,
} from './context.js';

export type {
	DiscoveryContext,
	DiscoveryConfig,
	DiscoveryHandlers,
	SearchMode,
	SortOption,
	SearchSuggestion,
	VisualSearchResult,
} from './context.js';

// Import components for compound object
import RootComponent from './Root.svelte';
import SearchBarComponent from './SearchBar.svelte';
import FiltersComponent from './Filters.svelte';
import ResultsComponent from './Results.svelte';
import SuggestionsComponent from './Suggestions.svelte';
import ColorPaletteSearchComponent from './ColorPaletteSearch.svelte';
import StyleFilterComponent from './StyleFilter.svelte';
import MoodMapComponent from './MoodMap.svelte';

/**
 * DiscoveryEngine compound component
 *
 * @example
 * ```svelte
 * <DiscoveryEngine.Root {store}>
 *   <DiscoveryEngine.SearchBar />
 *   <DiscoveryEngine.Filters />
 *   <DiscoveryEngine.Results />
 * </DiscoveryEngine.Root>
 * ```
 */
export const DiscoveryEngine = {
	Root: RootComponent,
	SearchBar: SearchBarComponent,
	Filters: FiltersComponent,
	Results: ResultsComponent,
	Suggestions: SuggestionsComponent,
	ColorPaletteSearch: ColorPaletteSearchComponent,
	StyleFilter: StyleFilterComponent,
	MoodMap: MoodMapComponent,
};
