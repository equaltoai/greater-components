/**
 * Store Utilities
 *
 * Reusable utilities for store creation and state management.
 * Follows patterns from @equaltoai/greater-components-adapters/stores
 *
 * @module @equaltoai/greater-components-artist/stores/utils
 */

// ============================================================================
// Reactive State Implementation
// ============================================================================

/**
 * Simple reactive state implementation compatible with Svelte 5 runes
 * Provides subscribe/update pattern for cross-component state sharing
 */
export class ReactiveState<T> {
	private _value: T;
	private _subscribers = new Set<(value: T) => void>();

	constructor(initialValue: T) {
		this._value = initialValue;
	}

	get value(): T {
		return this._value;
	}

	set value(newValue: T) {
		this._value = newValue;
		this._subscribers.forEach((callback) => {
			try {
				callback(newValue);
			} catch (error) {
				console.error('[ReactiveState] Error in subscriber:', error);
			}
		});
	}

	subscribe(callback: (value: T) => void): () => void {
		this._subscribers.add(callback);
		callback(this._value);
		return () => {
			this._subscribers.delete(callback);
		};
	}

	update(updater: (current: T) => T): void {
		this.value = updater(this._value);
	}
}

// ============================================================================
// Pagination Utilities
// ============================================================================

/**
 * Paginated state interface
 */
export interface PaginatedState<T> {
	items: T[];
	cursor: string | null;
	hasMore: boolean;
	loading: boolean;
	error: Error | null;
}

/**
 * Page info from GraphQL response
 */
export interface PageInfo {
	endCursor: string | null;
	hasNextPage: boolean;
}

/**
 * Creates initial paginated state
 */
export function createPaginatedState<T>(initialItems: T[] = []): PaginatedState<T> {
	return {
		items: initialItems,
		cursor: null,
		hasMore: true,
		loading: false,
		error: null,
	};
}

/**
 * Merges new page of items into existing state
 */
export function mergePaginatedItems<T extends { id: string }>(
	state: PaginatedState<T>,
	newItems: T[],
	pageInfo: PageInfo
): PaginatedState<T> {
	const existingIds = new Set(state.items.map((item) => item.id));
	const uniqueNewItems = newItems.filter((item) => !existingIds.has(item.id));

	return {
		...state,
		items: [...state.items, ...uniqueNewItems],
		cursor: pageInfo.endCursor,
		hasMore: pageInfo.hasNextPage,
		loading: false,
		error: null,
	};
}

// ============================================================================
// Filter Utilities
// ============================================================================

/**
 * Filtered state interface
 */
export interface FilteredState<T, F> {
	items: T[];
	filters: F;
	filteredItems: T[];
}

/**
 * Creates a filter function from filter object
 */
export function createFilterPredicate<T, F extends Record<string, unknown>>(
	filters: F,
	filterFns: Partial<Record<keyof F, (item: T, value: unknown) => boolean>>
): (item: T) => boolean {
	return (item: T) => {
		for (const [key, value] of Object.entries(filters)) {
			if (value === undefined || value === null) continue;
			if (Array.isArray(value) && value.length === 0) continue;

			const filterFn = filterFns[key as keyof F];
			if (filterFn && !filterFn(item, value)) {
				return false;
			}
		}
		return true;
	};
}

/**
 * Applies filters to items
 */
export function applyFilters<T, F extends Record<string, unknown>>(
	items: T[],
	filters: F,
	filterFns: Partial<Record<keyof F, (item: T, value: unknown) => boolean>>
): T[] {
	const predicate = createFilterPredicate(filters, filterFns);
	return items.filter(predicate);
}

// ============================================================================
// Optimistic Update Utilities
// ============================================================================

/**
 * Optimistic item wrapper
 */
export interface OptimisticItem<T> {
	data: T;
	isOptimistic: boolean;
	version: number;
	rollbackData?: T;
}

/**
 * Optimistic state interface
 */
export interface OptimisticState<T> {
	items: OptimisticItem<T>[];
	pendingOperations: Map<string, { type: 'add' | 'update' | 'delete'; data: T }>;
}

/**
 * Creates initial optimistic state
 */
export function createOptimisticState<T>(items: T[] = []): OptimisticState<T> {
	return {
		items: items.map((data) => ({ data, isOptimistic: false, version: 0 })),
		pendingOperations: new Map(),
	};
}

/**
 * Applies optimistic add
 */
export function optimisticAdd<T extends { id: string }>(
	state: OptimisticState<T>,
	item: T
): OptimisticState<T> {
	const newItem: OptimisticItem<T> = {
		data: item,
		isOptimistic: true,
		version: Date.now(),
	};

	return {
		items: [newItem, ...state.items],
		pendingOperations: new Map(state.pendingOperations).set(item.id, { type: 'add', data: item }),
	};
}

/**
 * Applies optimistic update
 */
export function optimisticUpdate<T extends { id: string }>(
	state: OptimisticState<T>,
	id: string,
	updates: Partial<T>
): OptimisticState<T> {
	const items = state.items.map((item) => {
		if (item.data.id !== id) return item;

		const updatedData = { ...item.data, ...updates } as T;
		return {
			data: updatedData,
			isOptimistic: true,
			version: Date.now(),
			rollbackData: item.data,
		};
	});

	const existingItem = state.items.find((item) => item.data.id === id);
	const pendingOperations = new Map(state.pendingOperations);
	if (existingItem) {
		pendingOperations.set(id, { type: 'update', data: { ...existingItem.data, ...updates } as T });
	}

	return { items, pendingOperations };
}

/**
 * Applies optimistic delete
 */
export function optimisticDelete<T extends { id: string }>(
	state: OptimisticState<T>,
	id: string
): OptimisticState<T> {
	const deletedItem = state.items.find((item) => item.data.id === id);
	const items = state.items.filter((item) => item.data.id !== id);

	const pendingOperations = new Map(state.pendingOperations);
	if (deletedItem) {
		pendingOperations.set(id, { type: 'delete', data: deletedItem.data });
	}

	return { items, pendingOperations };
}

/**
 * Confirms optimistic operation
 */
export function confirmOptimistic<T extends { id: string }>(
	state: OptimisticState<T>,
	id: string,
	confirmedData?: T
): OptimisticState<T> {
	const items = state.items.map((item) => {
		if (item.data.id !== id) return item;

		return {
			data: confirmedData ?? item.data,
			isOptimistic: false,
			version: item.version,
		};
	});

	const pendingOperations = new Map(state.pendingOperations);
	pendingOperations.delete(id);

	return { items, pendingOperations };
}

/**
 * Rolls back optimistic operation
 */
export function rollbackOptimistic<T extends { id: string }>(
	state: OptimisticState<T>,
	id: string
): OptimisticState<T> {
	const operation = state.pendingOperations.get(id);
	if (!operation) return state;

	let items: OptimisticItem<T>[];

	switch (operation.type) {
		case 'add':
			items = state.items.filter((item) => item.data.id !== id);
			break;
		case 'update':
			items = state.items.map((item) => {
				if (item.data.id !== id || !item.rollbackData) return item;
				return {
					data: item.rollbackData,
					isOptimistic: false,
					version: item.version,
				};
			});
			break;
		case 'delete':
			items = [...state.items, { data: operation.data, isOptimistic: false, version: Date.now() }];
			break;
		default:
			items = state.items;
	}

	const pendingOperations = new Map(state.pendingOperations);
	pendingOperations.delete(id);

	return { items, pendingOperations };
}

// ============================================================================
// Persistence Utilities
// ============================================================================

/**
 * LocalStorage persistence helper
 */
export function persistToLocalStorage<T>(key: string, data: T): void {
	try {
		localStorage.setItem(key, JSON.stringify(data));
	} catch (error) {
		console.warn('[persistToLocalStorage] Failed to save:', error);
	}
}

/**
 * LocalStorage retrieval helper
 */
export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
	try {
		const stored = localStorage.getItem(key);
		if (!stored) return defaultValue;
		return JSON.parse(stored) as T;
	} catch (error) {
		console.warn('[loadFromLocalStorage] Failed to load:', error);
		return defaultValue;
	}
}

/**
 * IndexedDB persistence helper for offline support
 */
export async function persistToIndexedDB<T>(
	dbName: string,
	storeName: string,
	key: string,
	data: T
): Promise<void> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(dbName, 1);

		request.onerror = () => reject(request.error);

		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains(storeName)) {
				db.createObjectStore(storeName);
			}
		};

		request.onsuccess = () => {
			const db = request.result;
			const transaction = db.transaction(storeName, 'readwrite');
			const store = transaction.objectStore(storeName);
			const putRequest = store.put(data, key);

			putRequest.onerror = () => reject(putRequest.error);
			putRequest.onsuccess = () => resolve();

			transaction.oncomplete = () => db.close();
		};
	});
}

/**
 * IndexedDB retrieval helper
 */
export async function loadFromIndexedDB<T>(
	dbName: string,
	storeName: string,
	key: string
): Promise<T | null> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(dbName, 1);

		request.onerror = () => reject(request.error);

		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains(storeName)) {
				db.createObjectStore(storeName);
			}
		};

		request.onsuccess = () => {
			const db = request.result;
			const transaction = db.transaction(storeName, 'readonly');
			const store = transaction.objectStore(storeName);
			const getRequest = store.get(key);

			getRequest.onerror = () => reject(getRequest.error);
			getRequest.onsuccess = () => resolve(getRequest.result ?? null);

			transaction.oncomplete = () => db.close();
		};
	});
}

// ============================================================================
// Debounce Utility
// ============================================================================

/**
 * Creates a debounced function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => unknown>(
	fn: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	return (...args: Parameters<T>) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			fn(...args);
			timeoutId = null;
		}, delay);
	};
}

// ============================================================================
// Network Status Utility
// ============================================================================

/**
 * Creates a network status observer
 */
export function createNetworkObserver(onOnline: () => void, onOffline: () => void): () => void {
	const handleOnline = () => onOnline();
	const handleOffline = () => onOffline();

	if (typeof window !== 'undefined') {
		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}

	return () => {};
}

/**
 * Gets current network status
 */
export function isOnline(): boolean {
	if (typeof navigator !== 'undefined') {
		return navigator.onLine;
	}
	return true;
}
