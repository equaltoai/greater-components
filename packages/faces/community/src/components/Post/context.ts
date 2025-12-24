/**
 * Post Component Context
 *
 * Provides shared state and configuration for compound Post components.
 * Uses Svelte 5's context API for passing data between Post.* components.
 *
 * @module @equaltoai/greater-components/faces/community/Post/context
 */

import { getContext, setContext } from 'svelte';
import type { PostConfig, PostContext, PostData, PostHandlers } from '../../types.js';

export const POST_CONTEXT_KEY = Symbol('post-context');

export const DEFAULT_POST_CONFIG: Required<PostConfig> = {
	density: 'card',
	showVoting: true,
	showCommunity: true,
	showAuthor: true,
	showFlair: true,
	showAwards: false,
	expandMedia: false,
	class: '',
};

export function createPostContext(
	post: PostData,
	config: PostConfig = {},
	handlers: PostHandlers = {}
): PostContext {
	const context: PostContext = {
		post,
		get config() {
			return {
				...DEFAULT_POST_CONFIG,
				...config,
			};
		},
		get handlers() {
			return handlers;
		},
	};

	setContext(POST_CONTEXT_KEY, context);
	return context;
}

export function getPostContext(): PostContext {
	const context = getContext<PostContext>(POST_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'Post context not found. Make sure this component is used within a Post.Root component.'
		);
	}
	return context;
}

export function hasPostContext(): boolean {
	try {
		return !!getContext<PostContext>(POST_CONTEXT_KEY);
	} catch {
		return false;
	}
}

export type { PostContext, PostConfig, PostHandlers };
