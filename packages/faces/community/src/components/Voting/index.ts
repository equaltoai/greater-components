/**
 * Voting Components
 *
 * Upvote/downvote controls and score display.
 *
 * @module @equaltoai/greater-components/faces/community/Voting
 */

export { default as Root } from './Root.svelte';

export type { VoteData, VoteDirection, VoteHandlers } from '../../types.js';

export const Voting = {
	Root: {} as typeof import('./Root.svelte').default,
};

// Dynamic imports for tree-shaking
import Root from './Root.svelte';
Voting.Root = Root;
