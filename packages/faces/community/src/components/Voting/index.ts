/**
 * Voting Compound Component
 *
 * A flexible, composable voting component for upvote/downvote functionality.
 * Built using compound component pattern for maximum flexibility and customization.
 *
 * @example Basic usage
 * ```svelte
 * <script>
 *   import { Voting } from '@equaltoai/greater-components/faces/community';
 * </script>
 *
 * <Voting.Root score={42} userVote={1} {handlers}>
 *   <Voting.Buttons />
 *   <Voting.Score />
 * </Voting.Root>
 * ```
 *
 * @module @equaltoai/greater-components/faces/community/Voting
 */

// Placeholder - components to be implemented
// export { default as Root } from './Root.svelte';
// export { default as Buttons } from './Buttons.svelte';
// export { default as Score } from './Score.svelte';
// export { default as Ratio } from './Ratio.svelte';

// Export types
export type { VoteData, VoteDirection, VoteHandlers } from '../../types.js';

/**
 * Voting compound component
 */
export const Voting = {
	// Root: {} as typeof import('./Root.svelte').default,
	// Buttons: {} as typeof import('./Buttons.svelte').default,
	// Score: {} as typeof import('./Score.svelte').default,
	// Ratio: {} as typeof import('./Ratio.svelte').default,
};
