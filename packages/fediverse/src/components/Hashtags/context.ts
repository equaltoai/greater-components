/**
 * Hashtags Management Context
 */

import { getContext, setContext } from 'svelte';
import type { LesserGraphQLAdapter } from '@greater/adapters';

const HASHTAGS_CONTEXT_KEY = Symbol('hashtags-context');

export interface HashtagsConfig {
	adapter: LesserGraphQLAdapter;
}

export interface HashtagsState {
	loading: boolean;
	error: Error | null;
}

export interface HashtagsContext {
	config: Required<HashtagsConfig>;
	state: HashtagsState;
	updateState: (partial: Partial<HashtagsState>) => void;
}

export function createHashtagsContext(config: HashtagsConfig): HashtagsContext {
	const state: HashtagsState = {
		loading: false,
		error: null,
	};

	const context: HashtagsContext = {
		config: { adapter: config.adapter },
		state,
		updateState: (partial) => Object.assign(state, partial),
	};

	setContext(HASHTAGS_CONTEXT_KEY, context);
	return context;
}

export function getHashtagsContext(): HashtagsContext {
	const context = getContext<HashtagsContext>(HASHTAGS_CONTEXT_KEY);
	if (!context) {
		throw new Error('Hashtags context not found. Use components inside <Hashtags.Root>.');
	}
	return context;
}

