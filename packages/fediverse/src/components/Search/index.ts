/**
 * Search Components
 * 
 * Complete search system with AI semantic search for ActivityPub/Fediverse applications.
 * Supports full-text search, filtering by type, and real-time results.
 * 
 * @module components/Search
 * 
 * @example
 * ```svelte
 * <script>
 *   import * as Search from '@equaltoai/greater-components-fediverse/Search';
 * 
 *   const handlers = {
 *     onSearch: async (options) => {
 *       const response = await fetch(`/api/search?q=${options.query}`);
 *       return await response.json();
 *     },
 *     onActorClick: (actor) => {
 *       navigate(`/@${actor.username}`);
 *     },
 *   };
 * </script>
 * 
 * <Search.Root {handlers}>
 *   <Search.Bar placeholder="Search posts, people, and tags..." />
 *   <Search.Filters />
 *   <Search.Results />
 * </Search.Root>
 * ```
 */

export { default as Root } from './Root.svelte';
export { default as Bar } from './Bar.svelte';
export { default as Filters } from './Filters.svelte';
export { default as Results } from './Results.svelte';
export { default as ActorResult } from './ActorResult.svelte';
export { default as NoteResult } from './NoteResult.svelte';
export { default as TagResult } from './TagResult.svelte';

// Export types and context utilities
export type {
	SearchResultType,
	SearchActor,
	SearchNote,
	SearchTag,
	SearchResults,
	SearchOptions,
	SearchHandlers,
	SearchState,
	SearchContext,
} from './context.js';

export {
	createInitialSearchState,
	createSearchContext,
	getSearchContext,
	highlightQuery,
	formatResultCount,
	formatCount,
} from './context.js';
