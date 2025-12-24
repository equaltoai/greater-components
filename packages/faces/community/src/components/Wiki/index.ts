/**
 * Wiki Compound Component
 *
 * A flexible, composable wiki component for community wiki pages.
 * Built using compound component pattern for maximum flexibility and customization.
 *
 * @example Basic usage
 * ```svelte
 * <script>
 *   import { Wiki } from '@equaltoai/greater-components/faces/community';
 * </script>
 *
 * <Wiki.Root wiki={wikiData} {handlers}>
 *   <Wiki.Navigation />
 *   <Wiki.Page />
 * </Wiki.Root>
 * ```
 *
 * @module @equaltoai/greater-components/faces/community/Wiki
 */

export { default as Root } from './Root.svelte';
export { default as Page } from './Page.svelte';
export { default as Editor } from './Editor.svelte';
export { default as Navigation } from './Navigation.svelte';
export { default as History } from './History.svelte';

export { WIKI_CONTEXT_KEY, createWikiContext, getWikiContext, hasWikiContext } from './context.js';

export type { WikiContext } from './context.js';

// Export types
export type { WikiPageData, WikiRevision, WikiHandlers } from '../../types.js';

/**
 * Wiki compound component
 */
export const Wiki = {
	Root: {} as typeof import('./Root.svelte').default,
	Page: {} as typeof import('./Page.svelte').default,
	Editor: {} as typeof import('./Editor.svelte').default,
	Navigation: {} as typeof import('./Navigation.svelte').default,
	History: {} as typeof import('./History.svelte').default,
};

// Dynamic imports for tree-shaking
import Root from './Root.svelte';
import Page from './Page.svelte';
import Editor from './Editor.svelte';
import Navigation from './Navigation.svelte';
import History from './History.svelte';

Wiki.Root = Root;
Wiki.Page = Page;
Wiki.Editor = Editor;
Wiki.Navigation = Navigation;
Wiki.History = History;
