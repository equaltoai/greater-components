/**
 * Severed Relationships Context
 * 
 * Provides shared state for severed relationship management.
 */

import { getContext, setContext } from 'svelte';
import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';

const SEVERED_CONTEXT_KEY = Symbol('severed-context');

export interface SeveredRelationshipsConfig {
	adapter: LesserGraphQLAdapter;
	refreshInterval?: number;
}

export interface SeveredRelationshipsState {
	loading: boolean;
	error: Error | null;
	selectedId: string | null;
}

export interface SeveredRelationshipsContext {
	config: Required<SeveredRelationshipsConfig>;
	state: SeveredRelationshipsState;
	updateState: (partial: Partial<SeveredRelationshipsState>) => void;
}

export function createSeveredRelationshipsContext(
	config: SeveredRelationshipsConfig
): SeveredRelationshipsContext {
	const state: SeveredRelationshipsState = {
		loading: false,
		error: null,
		selectedId: null,
	};

	const context: SeveredRelationshipsContext = {
		config: {
			adapter: config.adapter,
			refreshInterval: config.refreshInterval || 300000, // 5 minutes
		},
		state,
		updateState: (partial) => Object.assign(state, partial),
	};

	setContext(SEVERED_CONTEXT_KEY, context);
	return context;
}

export function getSeveredRelationshipsContext(): SeveredRelationshipsContext {
	const context = getContext<SeveredRelationshipsContext>(SEVERED_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'SeveredRelationships context not found. Use components inside <SeveredRelationships.Root>.'
		);
	}
	return context;
}

