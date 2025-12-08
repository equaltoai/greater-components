/**
 * Filters Components
 *
 * Complete content filtering system for ActivityPub.
 * Supports keyword/phrase filtering with context-specific rules.
 *
 * @example
 * ```svelte
 * <script>
 *   import * as Filters from '@equaltoai/greater-components/faces/social/Filters';
 *
 *   const handlers = {
 *     onFetchFilters: async () => api.fetchFilters(),
 *     onCreateFilter: async (filter) => api.createFilter(filter),
 *     onUpdateFilter: async (id, filter) => api.updateFilter(id, filter),
 *     onDeleteFilter: async (id) => api.deleteFilter(id),
 *   };
 * </script>
 *
 * <Filters.Root {handlers}>
 *   <Filters.Manager />
 *   <Filters.Editor />
 *
 *   <!-- Wrap content to check for filters -->
 *   <Filters.FilteredContent content={post.content} context="home">
 *     <StatusCard {post} />
 *   </Filters.FilteredContent>
 * </Filters.Root>
 * ```
 *
 * @module Filters
 */

export { default as Root } from './Root.svelte';
export { default as Manager } from './Manager.svelte';
export { default as Editor } from './Editor.svelte';
export { default as FilteredContent } from './FilteredContent.svelte';

export {
	createFiltersContext,
	getFiltersContext,
	formatExpiration,
	calculateExpiresAt,
	type ContentFilter,
	type FilterContext,
	type FilterAction,
	type FilterFormData,
	type FiltersHandlers,
	type FiltersState,
	type FiltersContext,
} from './context.js';
