/**
 * Filters Context
 * 
 * Provides content filtering state and handlers for keyword/phrase filtering.
 * Supports filtering by context (home, notifications, public, thread) with expiration.
 * 
 * @module Filters/context
 */

import { getContext, setContext } from 'svelte';

const FILTERS_CONTEXT_KEY = Symbol('filters-context');

/**
 * Filter context (where the filter applies)
 */
export type FilterContext = 'home' | 'notifications' | 'public' | 'thread' | 'account';

/**
 * Filter action (what to do with matching content)
 */
export type FilterAction = 'warn' | 'hide';

/**
 * Content filter rule
 */
export interface ContentFilter {
	id: string;
	phrase: string;
	context: FilterContext[];
	expiresAt: string | null;
	irreversible: boolean; // true = hide completely, false = show with warning
	wholeWord: boolean;
	createdAt: string;
	updatedAt: string;
}

/**
 * Form data for creating/editing a filter
 */
export interface FilterFormData {
	phrase: string;
	context: FilterContext[];
	expiresIn: number | null; // seconds, or null for never
	irreversible: boolean;
	wholeWord: boolean;
}

/**
 * Filters event handlers
 */
export interface FiltersHandlers {
	/**
	 * Fetch all filters
	 */
	onFetchFilters?: () => Promise<ContentFilter[]>;

	/**
	 * Create a new filter
	 */
	onCreateFilter?: (filter: FilterFormData) => Promise<ContentFilter>;

	/**
	 * Update an existing filter
	 */
	onUpdateFilter?: (filterId: string, filter: Partial<FilterFormData>) => Promise<ContentFilter>;

	/**
	 * Delete a filter
	 */
	onDeleteFilter?: (filterId: string) => Promise<void>;

	/**
	 * Check if content matches any filters
	 */
	onCheckFilters?: (content: string, context: FilterContext) => Promise<ContentFilter[]>;
}

/**
 * Filters state
 */
export interface FiltersState {
	/**
	 * All active filters
	 */
	filters: ContentFilter[];

	/**
	 * Currently selected filter for editing
	 */
	selectedFilter: ContentFilter | null;

	/**
	 * Whether filters are loading
	 */
	loading: boolean;

	/**
	 * Whether a filter operation is in progress
	 */
	saving: boolean;

	/**
	 * Current error message
	 */
	error: string | null;

	/**
	 * Whether the filter editor is open
	 */
	editorOpen: boolean;

	/**
	 * Statistics about filtered content
	 */
	stats: {
		totalFilters: number;
		totalFiltered: number;
		filteredToday: number;
	};
}

/**
 * Filters context
 */
export interface FiltersContext {
	/**
	 * Current filters state
	 */
	state: FiltersState;

	/**
	 * Filters event handlers
	 */
	handlers: FiltersHandlers;

	/**
	 * Update filters state
	 */
	updateState: (partial: Partial<FiltersState>) => void;

	/**
	 * Clear filters error
	 */
	clearError: () => void;

	/**
	 * Fetch all filters
	 */
	fetchFilters: () => Promise<void>;

	/**
	 * Create a new filter
	 */
	createFilter: (filter: FilterFormData) => Promise<void>;

	/**
	 * Update an existing filter
	 */
	updateFilter: (filterId: string, filter: Partial<FilterFormData>) => Promise<void>;

	/**
	 * Delete a filter
	 */
	deleteFilter: (filterId: string) => Promise<void>;

	/**
	 * Check if content matches filters
	 */
	checkFilters: (content: string, context: FilterContext) => ContentFilter[];

	/**
	 * Open filter editor for new filter
	 */
	openEditor: (filter?: ContentFilter) => void;

	/**
	 * Close filter editor
	 */
	closeEditor: () => void;
}

/**
 * Create filters context
 * 
 * @param handlers - Filters event handlers
 * @returns Filters context
 */
export function createFiltersContext(handlers: FiltersHandlers = {}): FiltersContext {
	let state = $state<FiltersState>({
		filters: [],
		selectedFilter: null,
		loading: false,
		saving: false,
		error: null,
		editorOpen: false,
		stats: {
			totalFilters: 0,
			totalFiltered: 0,
			filteredToday: 0,
		},
	});

	const context: FiltersContext = {
		state,
		handlers,
		updateState: (partial: Partial<FiltersState>) => {
			Object.assign(state, partial);
		},
		clearError: () => {
			state.error = null;
		},
		fetchFilters: async () => {
			state.loading = true;
			state.error = null;

			try {
				const filters = await handlers.onFetchFilters?.();
				if (filters) {
					state.filters = filters;
					state.stats.totalFilters = filters.length;
				}
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to fetch filters';
			} finally {
				state.loading = false;
			}
		},
		createFilter: async (filter: FilterFormData) => {
			state.saving = true;
			state.error = null;

			try {
				const newFilter = await handlers.onCreateFilter?.(filter);
				if (newFilter) {
					state.filters = [...state.filters, newFilter];
					state.stats.totalFilters = state.filters.length;
					state.editorOpen = false;
				}
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to create filter';
				throw error;
			} finally {
				state.saving = false;
			}
		},
		updateFilter: async (filterId: string, filter: Partial<FilterFormData>) => {
			state.saving = true;
			state.error = null;

			try {
				const updatedFilter = await handlers.onUpdateFilter?.(filterId, filter);
				if (updatedFilter) {
					state.filters = state.filters.map((f) => (f.id === filterId ? updatedFilter : f));
					state.editorOpen = false;
					state.selectedFilter = null;
				}
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to update filter';
				throw error;
			} finally {
				state.saving = false;
			}
		},
		deleteFilter: async (filterId: string) => {
			state.saving = true;
			state.error = null;

			try {
				await handlers.onDeleteFilter?.(filterId);
				state.filters = state.filters.filter((f) => f.id !== filterId);
				state.stats.totalFilters = state.filters.length;
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to delete filter';
				throw error;
			} finally {
				state.saving = false;
			}
		},
		checkFilters: (content: string, context: FilterContext) => {
			const lowerContent = content.toLowerCase();
			const now = new Date();

			return state.filters.filter((filter) => {
				// Check if filter applies to this context
				if (!filter.context.includes(context)) {
					return false;
				}

				// Check if filter is expired
				if (filter.expiresAt && new Date(filter.expiresAt) < now) {
					return false;
				}

				// Check if content matches
				const phrase = filter.phrase.toLowerCase();

				if (filter.wholeWord) {
					// Match whole word only
					const regex = new RegExp(`\\b${phrase}\\b`, 'i');
					return regex.test(content);
				} else {
					// Match anywhere in content
					return lowerContent.includes(phrase);
				}
			});
		},
		openEditor: (filter?: ContentFilter) => {
			state.selectedFilter = filter || null;
			state.editorOpen = true;
			state.error = null;
		},
		closeEditor: () => {
			state.editorOpen = false;
			state.selectedFilter = null;
			state.error = null;
		},
	};

	setContext(FILTERS_CONTEXT_KEY, context);
	return context;
}

/**
 * Get filters context
 * 
 * Must be called within a Filters component tree.
 * 
 * @throws Error if called outside Filters component tree
 * @returns Filters context
 */
export function getFiltersContext(): FiltersContext {
	const context = getContext<FiltersContext>(FILTERS_CONTEXT_KEY);
	if (!context) {
		throw new Error('Filters components must be used within a Filters.Root component');
	}
	return context;
}

/**
 * Format expiration duration for display
 */
export function formatExpiration(expiresAt: string | null): string {
	if (!expiresAt) return 'Never';

	const now = new Date();
	const expires = new Date(expiresAt);
	const diff = expires.getTime() - now.getTime();

	if (diff < 0) return 'Expired';

	const hours = Math.floor(diff / (1000 * 60 * 60));
	const days = Math.floor(hours / 24);

	if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
	if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
	return 'Less than 1 hour';
}

/**
 * Calculate expiration date from duration in seconds
 */
export function calculateExpiresAt(expiresIn: number | null): string | null {
	if (!expiresIn) return null;

	const now = new Date();
	const expiresAt = new Date(now.getTime() + expiresIn * 1000);
	return expiresAt.toISOString();
}

