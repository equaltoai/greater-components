/**
 * Thread Compound Component
 *
 * Components for nested comment threading and discussion views.
 *
 * @module @equaltoai/greater-components/faces/community/Thread
 */

export { default as Root } from './Root.svelte';
export { default as CommentTree } from './CommentTree.svelte';
export { default as Comment } from './Comment.svelte';

export {
	THREAD_CONTEXT_KEY,
	DEFAULT_THREAD_CONFIG,
	createThreadContext,
	getThreadContext,
	hasThreadContext,
} from './context.js';

export type { ThreadContext, ThreadConfig, ThreadHandlers } from './context.js';

export const Thread = {
	Root: {} as typeof import('./Root.svelte').default,
	CommentTree: {} as typeof import('./CommentTree.svelte').default,
	Comment: {} as typeof import('./Comment.svelte').default,
};

// Dynamic imports for tree-shaking
import Root from './Root.svelte';
import CommentTree from './CommentTree.svelte';
import Comment from './Comment.svelte';

Thread.Root = Root;
Thread.CommentTree = CommentTree;
Thread.Comment = Comment;

