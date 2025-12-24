/**
 * Author Compound Component
 *
 * Components for author profiles and bios, optimized for long-form reading contexts.
 *
 * @module @equaltoai/greater-components/faces/blog/Author
 */

export { default as Root } from './Root.svelte';
export { default as Card } from './Card.svelte';

export {
	AUTHOR_CONTEXT_KEY,
	DEFAULT_AUTHOR_CONFIG,
	createAuthorContext,
	getAuthorContext,
	hasAuthorContext,
} from './context.js';

export type { AuthorContext } from './context.js';

export const Author = {
	Root: {} as typeof import('./Root.svelte').default,
	Card: {} as typeof import('./Card.svelte').default,
};

// Dynamic imports for tree-shaking
import Root from './Root.svelte';
import Card from './Card.svelte';

Author.Root = Root;
Author.Card = Card;
