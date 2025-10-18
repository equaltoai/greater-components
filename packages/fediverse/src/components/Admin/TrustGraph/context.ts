/**
 * Admin TrustGraph Context
 * 
 * Provides shared state for trust graph visualization.
 * 
 * @module @greater/fediverse/Admin/TrustGraph/context
 */

import { getContext, setContext } from 'svelte';
import type { LesserGraphQLAdapter } from '@greater/adapters';

const TRUST_GRAPH_CONTEXT_KEY = Symbol('trust-graph-context');

export interface TrustGraphConfig {
	/**
	 * GraphQL adapter for data fetching
	 */
	adapter: LesserGraphQLAdapter;

	/**
	 * Maximum depth for trust graph traversal
	 */
	maxDepth?: number;

	/**
	 * Minimum trust score to display
	 */
	minScore?: number;

	/**
	 * Trust category filter
	 */
	category?: 'CONTENT' | 'BEHAVIOR' | 'TECHNICAL';

	/**
	 * Layout algorithm
	 */
	layout?: 'force' | 'hierarchical' | 'radial';
}

export interface TrustGraphState {
	/**
	 * Root actor ID for the graph
	 */
	rootActorId: string | null;

	/**
	 * Loading state
	 */
	loading: boolean;

	/**
	 * Error state
	 */
	error: Error | null;

	/**
	 * Selected node
	 */
	selectedNodeId: string | null;
}

export interface TrustGraphContext {
	config: Required<TrustGraphConfig>;
	state: TrustGraphState;
	updateState: (partial: Partial<TrustGraphState>) => void;
	loadGraph: (actorId: string) => Promise<void>;
}

export function createTrustGraphContext(config: TrustGraphConfig): TrustGraphContext {
	const state: TrustGraphState = {
		rootActorId: null,
		loading: false,
		error: null,
		selectedNodeId: null,
	};

	const context: TrustGraphContext = {
		config: {
			adapter: config.adapter,
			maxDepth: config.maxDepth || 2,
			minScore: config.minScore || 0.1,
			category: config.category,
			layout: config.layout || 'force',
		},
		state,
		updateState: (partial: Partial<TrustGraphState>) => {
			Object.assign(state, partial);
		},
		loadGraph: async (actorId: string) => {
			state.loading = true;
			state.error = null;
			state.rootActorId = actorId;
			try {
				// Graph loading handled by visualization component
			} catch (error) {
				state.error = error instanceof Error ? error : new Error('Failed to load trust graph');
			} finally {
				state.loading = false;
			}
		},
	};

	setContext(TRUST_GRAPH_CONTEXT_KEY, context);
	return context;
}

export function getTrustGraphContext(): TrustGraphContext {
	const context = getContext<TrustGraphContext>(TRUST_GRAPH_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'TrustGraph context not found. Make sure you are using TrustGraph components inside <TrustGraph.Root>.'
		);
	}
	return context;
}

