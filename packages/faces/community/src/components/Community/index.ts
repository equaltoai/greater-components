/**
 * Community Compound Component
 *
 * A flexible, composable community component for displaying forum communities.
 * Built using compound component pattern for maximum flexibility and customization.
 *
 * @example Basic usage
 * ```svelte
 * <script>
 *   import { Community } from '@equaltoai/greater-components/faces/community';
 * </script>
 *
 * <Community.Root community={communityData}>
 *   <Community.Header />
 *   <Community.RulesSidebar />
 *   <Community.Stats />
 * </Community.Root>
 * ```
 *
 * @module @equaltoai/greater-components/faces/community/Community
 */

// Placeholder exports - components to be implemented
export { default as Root } from './Root.svelte';
// export { default as Index } from './Index.svelte';
export { default as Header } from './Header.svelte';
export { default as RulesSidebar } from './RulesSidebar.svelte';
export { default as Stats } from './Stats.svelte';
// export { default as Settings } from './Settings.svelte';

// Export context utilities
export {
	createCommunityContext,
	getCommunityContext,
	hasCommunityContext,
	COMMUNITY_CONTEXT_KEY,
	DEFAULT_COMMUNITY_CONFIG,
} from './context.js';

// Export types
export type { CommunityContext } from './context.js';

/**
 * Community compound component
 */
export const Community = {
	Root: {} as typeof import('./Root.svelte').default,
	// Index: {} as typeof import('./Index.svelte').default,
	Header: {} as typeof import('./Header.svelte').default,
	RulesSidebar: {} as typeof import('./RulesSidebar.svelte').default,
	Stats: {} as typeof import('./Stats.svelte').default,
	// Settings: {} as typeof import('./Settings.svelte').default,
};

// Dynamic imports for tree-shaking
import Root from './Root.svelte';
import Header from './Header.svelte';
import RulesSidebar from './RulesSidebar.svelte';
import Stats from './Stats.svelte';
Community.Root = Root;
Community.Header = Header;
Community.RulesSidebar = RulesSidebar;
Community.Stats = Stats;
