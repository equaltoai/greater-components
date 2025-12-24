/**
 * Navigation Compound Component
 *
 * Widgets for archives, tags, and category navigation.
 *
 * @module @equaltoai/greater-components/faces/blog/Navigation
 */

export { default as Root } from './Root.svelte';
export { default as ArchiveView } from './ArchiveView.svelte';
export { default as TagCloud } from './TagCloud.svelte';

export {
	NAVIGATION_CONTEXT_KEY,
	createNavigationContext,
	getNavigationContext,
	hasNavigationContext,
} from './context.js';

export type { NavigationContext } from './context.js';

export const Navigation = {
	Root: {} as typeof import('./Root.svelte').default,
	ArchiveView: {} as typeof import('./ArchiveView.svelte').default,
	TagCloud: {} as typeof import('./TagCloud.svelte').default,
};

// Dynamic imports for tree-shaking
import Root from './Root.svelte';
import ArchiveView from './ArchiveView.svelte';
import TagCloud from './TagCloud.svelte';

Navigation.Root = Root;
Navigation.ArchiveView = ArchiveView;
Navigation.TagCloud = TagCloud;
