/**
 * Hashtags Management Context
 */

import { getContext, setContext } from 'svelte';
import type { LesserGraphQLAdapter } from '@greater/adapters';

const HASHTAGS_CONTEXT_KEY = Symbol.for('hashtags-context');

export interface HashtagsConfig {
	adapter: LesserGraphQLAdapter;
}

export interface HashtagsState {
	loading: boolean;
	error: Error | null;
	refreshVersion: number;
}

export interface HashtagsContext {
	config: Required<HashtagsConfig>;
	state: HashtagsState;
	updateState: (partial: Partial<HashtagsState>) => void;
}

export function createHashtagsContext(config: HashtagsConfig): HashtagsContext {
	let state: HashtagsState = {
		loading: false,
		error: null,
		refreshVersion: 0,
	};

	const context: HashtagsContext = {
		config: { adapter: config.adapter },
		state,
		updateState: (partial) => {
			state = { ...state, ...partial };
			context.state = state;
		},
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
