/**
 * Post Compound Component
 *
 * Components for forum posts with voting and metadata.
 *
 * @module @equaltoai/greater-components/faces/community/Post
 */

export { default as Root } from './Root.svelte';

export {
	POST_CONTEXT_KEY,
	DEFAULT_POST_CONFIG,
	createPostContext,
	getPostContext,
	hasPostContext,
} from './context.js';

export type { PostContext, PostConfig, PostHandlers } from './context.js';

export const Post = {
	Root: {} as typeof import('./Root.svelte').default,
};

// Dynamic imports for tree-shaking
import Root from './Root.svelte';
Post.Root = Root;

