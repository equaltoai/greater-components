/**
 * Lists Components
 * 
 * Complete lists management system for organizing and viewing curated actor feeds.
 * Supports creating, editing, and deleting lists with public/private visibility.
 * 
 * @module components/Lists
 * 
 * @example
 * ```svelte
 * <script>
 *   import * as Lists from '@greater/fediverse/Lists';
 * 
 *   const handlers = {
 *     onFetchLists: async () => {
 *       const response = await fetch('/api/lists');
 *       return await response.json();
 *     },
 *     onCreate: async (data) => {
 *       const response = await fetch('/api/lists', {
 *         method: 'POST',
 *         body: JSON.stringify(data),
 *       });
 *       return await response.json();
 *     },
 *   };
 * </script>
 * 
 * <Lists.Root {handlers}>
 *   <Lists.Manager />
 *   <Lists.Editor />
 *   <Lists.Timeline />
 * </Lists.Root>
 * ```
 */

export { default as Root } from './Root.svelte';
export { default as Manager } from './Manager.svelte';
export { default as Editor } from './Editor.svelte';
export { default as Timeline } from './Timeline.svelte';
export { default as MemberPicker } from './MemberPicker.svelte';
export { default as Settings } from './Settings.svelte';

// Export types and context utilities
export type {
	ListData,
	ListMember,
	ListFormData,
	ListsHandlers,
	ListsState,
	ListsContext,
} from './context.js';

export { createListsContext, getListsContext, validateListForm } from './context.js';

