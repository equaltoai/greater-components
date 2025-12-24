/**
 * Timeline Component Context
 *
 * Provides shared state and configuration for compound Timeline components.
 * Handles virtualization, infinite scrolling, and real-time updates.
 *
 * @module @equaltoai/greater-components/faces/social/Timeline/context
 */

import { getContext, setContext } from 'svelte';
import type { GenericTimelineItem } from '../../generics/index.js';

/**
 * Timeline context key
 */
export const TIMELINE_CONTEXT_KEY = Symbol('timeline-context');

/**
 * Timeline display modes
 */
export type TimelineMode = 'feed' | 'thread' | 'profile' | 'search';

/**
 * Timeline density options
 */
export type TimelineDensity = 'compact' | 'comfortable' | 'spacious';

/**
 * Configuration options for Timeline compound component
 */
export interface TimelineCompoundConfig {
	/**
	 * Display mode affecting layout and behavior
	 */
	mode?: TimelineMode;

	/**
	 * Display density
	 */
	density?: TimelineDensity;

	/**
	 * Enable virtual scrolling for performance
	 */
	virtualized?: boolean;

	/**
	 * Enable infinite scroll
	 */
	infiniteScroll?: boolean;

	/**
	 * Enable real-time updates
	 */
	realtime?: boolean;

	/**
	 * Show loading indicators
	 */
	showLoading?: boolean;

	/**
	 * Estimated item height for virtualization (px)
	 */
	estimatedItemHeight?: number;

	/**
	 * Number of items to render outside viewport (overscan)
	 */
	overscan?: number;

	/**
	 * Custom CSS class
	 */
	class?: string;
}

/**
 * Timeline action handlers
 */
export interface TimelineHandlers {
	/**
	 * Called when more items should be loaded
	 */
	onLoadMore?: () => Promise<void> | void;

	/**
	 * Called when timeline is refreshed
	 */
	onRefresh?: () => Promise<void> | void;

	/**
	 * Called when an item is clicked
	 */
	onItemClick?: (item: GenericTimelineItem, index: number) => void;

	/**
	 * Called when timeline scrolls
	 */
	onScroll?: (scrollTop: number) => void;
}

/**
 * Timeline compound component state
 */
export interface TimelineCompoundState {
	/**
	 * Whether timeline is currently loading
	 */
	loading: boolean;

	/**
	 * Whether more items are being loaded
	 */
	loadingMore: boolean;

	/**
	 * Whether there are more items to load
	 */
	hasMore: boolean;

	/**
	 * Error state if any
	 */
	error: Error | null;

	/**
	 * Number of items in timeline
	 */
	itemCount: number;

	/**
	 * Current scroll position
	 */
	scrollTop: number;
}

/**
 * Timeline context value
 */
export interface TimelineContext {
	/**
	 * Timeline items
	 */
	items: GenericTimelineItem[];

	/**
	 * Configuration options
	 */
	config: Required<TimelineCompoundConfig>;

	/**
	 * Action handlers
	 */
	handlers: TimelineHandlers;

	/**
	 * Current timeline state
	 */
	state: TimelineCompoundState;

	/**
	 * Update state helper
	 */
	updateState: (partial: Partial<TimelineCompoundState>) => void;
}

/**
 * Create and set the timeline context
 *
 * @param items - Timeline items
 * @param config - Configuration options
 * @param handlers - Action handlers
 * @param initialState - Initial state
 */
export function createTimelineContext(
	items: GenericTimelineItem[],
	config: TimelineCompoundConfig = {},
	handlers: TimelineHandlers = {},
	initialState: Partial<TimelineCompoundState> = {}
): TimelineContext {
	// Create reactive state using Proxy for universal compatibility (Svelte + Node.js)
	const internalState: TimelineCompoundState = {
		loading: initialState.loading ?? false,
		loadingMore: initialState.loadingMore ?? false,
		hasMore: initialState.hasMore ?? true,
		error: initialState.error ?? null,
		itemCount: items.length,
		scrollTop: initialState.scrollTop ?? 0,
	};

	// Create proxy for reactivity
	const state = new Proxy(internalState, {
		set(target, prop: keyof TimelineCompoundState, value) {
			target[prop] = value as never;
			return true;
		},
	});

	const context: TimelineContext = {
		items,
		config: {
			mode: config.mode || 'feed',
			density: config.density || 'comfortable',
			virtualized: config.virtualized ?? true,
			infiniteScroll: config.infiniteScroll ?? true,
			realtime: config.realtime ?? false,
			showLoading: config.showLoading ?? true,
			estimatedItemHeight: config.estimatedItemHeight || 200,
			overscan: config.overscan || 5,
			class: config.class || '',
		},
		handlers,
		state,
		updateState: (partial: Partial<TimelineCompoundState>) => {
			Object.assign(state, partial);
		},
	};

	setContext(TIMELINE_CONTEXT_KEY, context);
	return context;
}

/**
 * Get the timeline context
 *
 * @throws Error if called outside of Timeline.Root
 */
export function getTimelineContext(): TimelineContext {
	const context = getContext<TimelineContext>(TIMELINE_CONTEXT_KEY);

	if (!context) {
		throw new Error(
			'Timeline context not found. Make sure you are using Timeline components inside <Timeline.Root>.'
		);
	}

	return context;
}

/**
 * Check if timeline context exists
 */
export function hasTimelineContext(): boolean {
	try {
		const context = getContext<TimelineContext>(TIMELINE_CONTEXT_KEY);
		return context !== undefined && context !== null;
	} catch {
		return false;
	}
}
