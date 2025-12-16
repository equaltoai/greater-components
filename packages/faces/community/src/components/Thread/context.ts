/**
 * Thread Component Context
 *
 * Provides shared state and configuration for compound Thread components.
 *
 * @module @equaltoai/greater-components/faces/community/Thread/context
 */

import { getContext, setContext } from 'svelte';
import type { ThreadConfig, ThreadContext, ThreadData, ThreadHandlers } from '../../types.js';

export const THREAD_CONTEXT_KEY = Symbol('thread-context');

export const DEFAULT_THREAD_CONFIG: Required<ThreadConfig> = {
	maxDepth: 8,
	collapseDepth: Number.POSITIVE_INFINITY,
	showVoting: true,
	showFlairs: true,
	highlightOp: true,
	class: '',
};

export function createThreadContext(
	thread: ThreadData,
	config: ThreadConfig = {},
	handlers: ThreadHandlers = {}
): ThreadContext {
	const context: ThreadContext = {
		thread,
		get config() {
			return {
				...DEFAULT_THREAD_CONFIG,
				...config,
			};
		},
		get handlers() {
			return handlers;
		},
	};

	setContext(THREAD_CONTEXT_KEY, context);
	return context;
}

export function getThreadContext(): ThreadContext {
	const context = getContext<ThreadContext>(THREAD_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'Thread context not found. Make sure this component is used within a Thread.Root component.'
		);
	}
	return context;
}

export function hasThreadContext(): boolean {
	try {
		return !!getContext<ThreadContext>(THREAD_CONTEXT_KEY);
	} catch {
		return false;
	}
}

export type { ThreadContext, ThreadConfig, ThreadHandlers };
