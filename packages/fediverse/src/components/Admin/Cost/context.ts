/**
 * Admin Cost Dashboard Context
 * 
 * Provides shared state for cost tracking and budget management.
 * 
 * @module @greater/fediverse/Admin/Cost/context
 */

import { getContext, setContext } from 'svelte';
import type { LesserGraphQLAdapter } from '@greater/adapters';

const COST_CONTEXT_KEY = Symbol('cost-context');

export interface CostConfig {
	/**
	 * GraphQL adapter for data fetching
	 */
	adapter: LesserGraphQLAdapter;

	/**
	 * Auto-refresh interval (milliseconds)
	 */
	refreshInterval?: number;

	/**
	 * Default time period for cost breakdown
	 */
	defaultPeriod?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

	/**
	 * Alert threshold (percentage of budget)
	 */
	alertThreshold?: number;
}

export interface CostState {
	/**
	 * Current time period
	 */
	period: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

	/**
	 * Loading state
	 */
	loading: boolean;

	/**
	 * Error state
	 */
	error: Error | null;

	/**
	 * Last refresh timestamp
	 */
	lastRefresh: number;
}

export interface CostContext {
	config: Required<CostConfig>;
	state: CostState;
	updateState: (partial: Partial<CostState>) => void;
	refresh: () => Promise<void>;
}

export function createCostContext(config: CostConfig): CostContext {
	const state: CostState = {
		period: config.defaultPeriod || 'DAY',
		loading: false,
		error: null,
		lastRefresh: Date.now(),
	};

	const context: CostContext = {
		config: {
			adapter: config.adapter,
			refreshInterval: config.refreshInterval || 60000, // 1 minute
			defaultPeriod: config.defaultPeriod || 'DAY',
			alertThreshold: config.alertThreshold || 0.8,
		},
		state,
		updateState: (partial: Partial<CostState>) => {
			Object.assign(state, partial);
		},
		refresh: async () => {
			state.loading = true;
			state.error = null;
			try {
				state.lastRefresh = Date.now();
			} catch (error) {
				state.error = error instanceof Error ? error : new Error('Failed to refresh cost data');
			} finally {
				state.loading = false;
			}
		},
	};

	setContext(COST_CONTEXT_KEY, context);
	return context;
}

export function getCostContext(): CostContext {
	const context = getContext<CostContext>(COST_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'Cost context not found. Make sure you are using Cost components inside <Cost.Root>.'
		);
	}
	return context;
}
