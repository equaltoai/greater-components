/**
 * Test Utilities
 *
 * Helper functions for testing Artist Face components.
 * Provides context wrappers, mock store creators, and interaction simulators.
 */

import { render } from '@testing-library/svelte';
import { vi, type Mock } from 'vitest';

type RenderableComponent = Parameters<typeof render>[0];

/**
 * Renders a component with Artist Face context providers
 */
export function renderWithContext(
	ComponentCtor: RenderableComponent,
	props?: Record<string, unknown>,
	options: { context?: Map<unknown, unknown> } = {}
): ReturnType<typeof render> {
	const renderProps = props ? { ...props, context: options.context } : { context: options.context };

	return render(ComponentCtor, renderProps) as unknown as ReturnType<typeof render>;
}

interface MockGalleryStoreState {
	items: unknown[];
	loading: boolean;
	error: Error | null;
	hasMore: boolean;
	filters: Record<string, unknown>;
	sortBy: string;
}

interface MockGalleryStore {
	get: () => MockGalleryStoreState;
	subscribe: (fn: (state: MockGalleryStoreState) => void) => () => boolean;
	update: (updater: (state: MockGalleryStoreState) => MockGalleryStoreState) => void;
	loadInitial: Mock;
	loadMore: Mock;
	refresh: Mock;
	setFilters: Mock;
	setSortBy: Mock;
	destroy: Mock;
}

/**
 * Creates a mock gallery store for testing
 */
export function createMockGalleryStore(
	initialState: Partial<MockGalleryStoreState> = {}
): MockGalleryStore {
	const defaultState: MockGalleryStoreState = {
		items: [],
		loading: false,
		error: null,
		hasMore: true,
		filters: {},
		sortBy: 'recent',
		...initialState,
	};

	let state = { ...defaultState };
	const subscribers = new Set<(state: MockGalleryStoreState) => void>();

	return {
		get: () => state,
		subscribe: (fn: (state: MockGalleryStoreState) => void) => {
			subscribers.add(fn);
			fn(state);
			return () => subscribers.delete(fn);
		},
		update: (updater: (state: MockGalleryStoreState) => MockGalleryStoreState) => {
			state = updater(state);
			subscribers.forEach((fn) => fn(state));
		},
		loadInitial: vi.fn().mockResolvedValue(undefined),
		loadMore: vi.fn().mockResolvedValue(undefined),
		refresh: vi.fn().mockResolvedValue(undefined),
		setFilters: vi.fn(),
		setSortBy: vi.fn(),
		destroy: vi.fn(),
	};
}

interface MockDiscoveryStoreState {
	query: string;
	results: unknown[];
	suggestions: unknown[];
	filters: Record<string, unknown>;
	loading: boolean;
	error: Error | null;
	searchHistory: unknown[];
	recentSearches: string[];
}

interface MockDiscoveryStore {
	get: () => MockDiscoveryStoreState;
	subscribe: (fn: (state: MockDiscoveryStoreState) => void) => () => boolean;
	update: (updater: (state: MockDiscoveryStoreState) => MockDiscoveryStoreState) => void;
	search: Mock;
	setFilters: Mock;
	updateFilters: Mock;
	clearFilters: Mock;
	searchByColor: Mock;
	saveSearch: Mock;
	deleteSavedSearch: Mock;
	clearRecentSearches: Mock;
	loadSuggestions: Mock;
	destroy: Mock;
}

/**
 * Creates a mock discovery store for testing
 */
export function createMockDiscoveryStore(
	initialState: Partial<MockDiscoveryStoreState> = {}
): MockDiscoveryStore {
	const defaultState: MockDiscoveryStoreState = {
		query: '',
		results: [],
		suggestions: [],
		filters: {},
		loading: false,
		error: null,
		searchHistory: [],
		recentSearches: [],
		...initialState,
	};

	let state = { ...defaultState };
	const subscribers = new Set<(state: MockDiscoveryStoreState) => void>();

	const notifySubscribers = () => {
		subscribers.forEach((fn) => fn(state));
	};

	return {
		get: () => state,
		subscribe: (fn: (state: MockDiscoveryStoreState) => void) => {
			subscribers.add(fn);
			fn(state);
			return () => subscribers.delete(fn);
		},
		update: (updater: (state: MockDiscoveryStoreState) => MockDiscoveryStoreState) => {
			state = updater(state);
			notifySubscribers();
		},
		search: vi.fn().mockImplementation(async (query: string) => {
			state = { ...state, query, loading: false };
			notifySubscribers();
		}),
		setFilters: vi.fn().mockImplementation((filters: Record<string, unknown>) => {
			state = { ...state, filters };
			notifySubscribers();
		}),
		updateFilters: vi.fn().mockImplementation((updates: Record<string, unknown>) => {
			state = { ...state, filters: { ...state.filters, ...updates } };
			notifySubscribers();
		}),
		clearFilters: vi.fn().mockImplementation(() => {
			state = { ...state, filters: {} };
			notifySubscribers();
		}),
		searchByColor: vi.fn().mockResolvedValue(undefined),
		saveSearch: vi.fn(),
		deleteSavedSearch: vi.fn(),
		clearRecentSearches: vi.fn().mockImplementation(() => {
			state = { ...state, recentSearches: [] };
			notifySubscribers();
		}),
		loadSuggestions: vi.fn().mockResolvedValue(undefined),
		destroy: vi.fn(),
	};
}

interface MockCommissionStoreState {
	commissions: unknown[];
	activeCommission: unknown | null;
	role: 'client' | 'artist';
	loading: boolean;
	error: Error | null;
}

interface MockCommissionStore {
	get: () => MockCommissionStoreState;
	subscribe: (fn: (state: MockCommissionStoreState) => void) => () => boolean;
	loadCommissions: Mock;
	setActiveCommission: Mock;
	updateStatus: Mock;
	addMessage: Mock;
	destroy: Mock;
}

/**
 * Creates a mock commission store for testing
 */
export function createMockCommissionStore(
	initialState: Partial<MockCommissionStoreState> = {}
): MockCommissionStore {
	const defaultState: MockCommissionStoreState = {
		commissions: [],
		activeCommission: null,
		role: 'client' as const,
		loading: false,
		error: null,
		...initialState,
	};

	const state = { ...defaultState };
	const subscribers = new Set<(state: MockCommissionStoreState) => void>();

	return {
		get: () => state,
		subscribe: (fn: (state: MockCommissionStoreState) => void) => {
			subscribers.add(fn);
			fn(state);
			return () => subscribers.delete(fn);
		},
		loadCommissions: vi.fn().mockResolvedValue(undefined),
		setActiveCommission: vi.fn(),
		updateStatus: vi.fn().mockResolvedValue(undefined),
		addMessage: vi.fn().mockResolvedValue(undefined),
		destroy: vi.fn(),
	};
}

interface MockOfflineStoreState {
	isOnline: boolean;
	savedArtworks: unknown[];
	syncQueue: unknown[];
	lastSync: Date | null;
	isSyncing: boolean;
	error: Error | null;
}

interface MockOfflineStore {
	get: () => MockOfflineStoreState;
	subscribe: (fn: (state: MockOfflineStoreState) => void) => () => boolean;
	saveArtwork: Mock;
	removeSavedArtwork: Mock;
	isArtworkSaved: Mock;
	queueAction: Mock;
	processQueue: Mock;
	destroy: Mock;
}

/**
 * Creates a mock offline store for testing
 */
export function createMockOfflineStore(
	initialState: Partial<MockOfflineStoreState> = {}
): MockOfflineStore {
	const defaultState: MockOfflineStoreState = {
		isOnline: true,
		savedArtworks: [],
		syncQueue: [],
		lastSync: null,
		isSyncing: false,
		error: null,
		...initialState,
	};

	const state = { ...defaultState };
	const subscribers = new Set<(state: MockOfflineStoreState) => void>();

	return {
		get: () => state,
		subscribe: (fn: (state: MockOfflineStoreState) => void) => {
			subscribers.add(fn);
			fn(state);
			return () => subscribers.delete(fn);
		},
		saveArtwork: vi.fn().mockResolvedValue(undefined),
		removeSavedArtwork: vi.fn().mockResolvedValue(undefined),
		isArtworkSaved: vi.fn().mockReturnValue(false),
		queueAction: vi.fn(),
		processQueue: vi.fn().mockResolvedValue(undefined),
		destroy: vi.fn(),
	};
}

/**
 * Simulates keyboard events for accessibility testing
 */
export function simulateKeyboard(
	element: HTMLElement,
	key: string,
	options: KeyboardEventInit = {}
) {
	const event = new KeyboardEvent('keydown', {
		key,
		bubbles: true,
		cancelable: true,
		...options,
	});
	element.dispatchEvent(event);
	return event;
}

/**
 * Simulates arrow key navigation
 */
export function simulateArrowNavigation(
	element: HTMLElement,
	direction: 'up' | 'down' | 'left' | 'right'
) {
	const keyMap = {
		up: 'ArrowUp',
		down: 'ArrowDown',
		left: 'ArrowLeft',
		right: 'ArrowRight',
	};
	return simulateKeyboard(element, keyMap[direction]);
}

/**
 * Waits for animations to complete
 */
export async function waitForAnimation(duration = 300): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, duration));
}

/**
 * Waits for a condition to be true
 */
export async function waitFor(
	condition: () => boolean,
	timeout = 1000,
	interval = 50
): Promise<void> {
	const start = Date.now();
	while (!condition()) {
		if (Date.now() - start > timeout) {
			throw new Error('waitFor timeout');
		}
		await new Promise((resolve) => setTimeout(resolve, interval));
	}
}

/**
 * Creates a mock fetch response
 */
export function mockFetchResponse<T>(data: T, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

/**
 * Creates a mock error response
 */
export function mockErrorResponse(status: number, statusText: string): Response {
	return new Response(null, { status, statusText });
}