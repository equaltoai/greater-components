/**
 * Admin Insights Context
 *
 * Provides shared state for AI analysis and moderation analytics.
 *
 * @module @equaltoai/greater-components/faces/social/Admin/Insights/context
 */

import { getContext, setContext } from 'svelte';
import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';

const INSIGHTS_CONTEXT_KEY = Symbol('insights-context');

export interface InsightsConfig {
	/**
	 * GraphQL adapter for data fetching
	 */
	adapter: LesserGraphQLAdapter;

	/**
	 * Auto-refresh interval (milliseconds)
	 */
	refreshInterval?: number;

	/**
	 * Default time period for stats
	 */
	defaultPeriod?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

	/**
	 * Show AI capabilities info
	 */
	showCapabilities?: boolean;
}

export interface InsightsState {
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

export interface InsightsContext {
	config: Required<InsightsConfig>;
	state: InsightsState;
	updateState: (partial: Partial<InsightsState>) => void;
	refresh: () => Promise<void>;
}

export function createInsightsContext(config: InsightsConfig): InsightsContext {
	const state: InsightsState = {
		period: config.defaultPeriod || 'DAY',
		loading: false,
		error: null,
		lastRefresh: Date.now(),
	};

	const context: InsightsContext = {
		config: {
			adapter: config.adapter,
			refreshInterval: config.refreshInterval || 60000, // 1 minute
			defaultPeriod: config.defaultPeriod || 'DAY',
			showCapabilities: config.showCapabilities ?? true,
		},
		state,
		updateState: (partial: Partial<InsightsState>) => {
			Object.assign(state, partial);
		},
		refresh: async () => {
			state.loading = true;
			state.error = null;
			try {
				// Refresh logic handled by individual components
				state.lastRefresh = Date.now();
			} catch (error) {
				state.error = error instanceof Error ? error : new Error('Failed to refresh insights');
			} finally {
				state.loading = false;
			}
		},
	};

	setContext(INSIGHTS_CONTEXT_KEY, context);
	return context;
}

export function getInsightsContext(): InsightsContext {
	const context = getContext<InsightsContext>(INSIGHTS_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'Insights context not found. Make sure you are using Insights components inside <Insights.Root>.'
		);
	}
	return context;
}
