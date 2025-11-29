/**
 * Optimistic Updates for Adapters
 *
 * Provides optimistic UI updates with automatic rollback on failure.
 * Updates UI immediately while request is in progress.
 *
 * @module adapters/optimistic
 */

import type { DebugLogEntry, DebugLogger } from './batcher.js';

export type OptimisticUpdateId = string;

export interface OptimisticUpdate<TState, TResult> {
	/**
	 * Unique identifier for this update
	 */
	id: OptimisticUpdateId;

	/**
	 * Apply optimistic change to state
	 */
	apply: (state: TState) => TState;

	/**
	 * Revert optimistic change (rollback)
	 */
	revert: (state: TState) => TState;

	/**
	 * Confirm optimistic change with actual result
	 */
	confirm?: (state: TState, result: TResult) => TState;

	/**
	 * The actual operation to perform
	 */
	operation: () => Promise<TResult>;

	/**
	 * Timestamp when update was created
	 */
	timestamp: number;

	/**
	 * Current status
	 */
	status: 'pending' | 'confirmed' | 'reverted';

	/**
	 * Error if failed
	 */
	error?: Error;
}

export interface OptimisticManagerOptions {
	/**
	 * Maximum number of pending updates
	 * @default 100
	 */
	maxPending?: number;

	/**
	 * Enable debug logging
	 * @default false
	 */
	debug?: boolean;

	/**
	 * Timeout for operations (ms)
	 * @default 30000 (30 seconds)
	 */
	timeout?: number;

	/**
	 * Optional logger for debug traces
	 */
	logger?: DebugLogger;
}

/**
 * Optimistic Update Manager
 * Manages queue of optimistic updates with rollback support
 */
export class OptimisticManager<TState> {
	private updates: Map<OptimisticUpdateId, OptimisticUpdate<TState, unknown>>;
	private maxPending: number;
	private debug: boolean;
	private timeout: number;
	private totalUpdates: number;
	private totalConfirmed: number;
	private totalReverted: number;
	private logger?: DebugLogger;

	constructor(options: OptimisticManagerOptions = {}) {
		this.updates = new Map();
		this.maxPending = options.maxPending ?? 100;
		this.debug = options.debug ?? false;
		this.timeout = options.timeout ?? 30000;
		this.totalUpdates = 0;
		this.totalConfirmed = 0;
		this.totalReverted = 0;
		this.logger = options.logger;
	}

	/**
	 * Add optimistic update
	 */
	async add<TResult>(
		id: OptimisticUpdateId,
		apply: (state: TState) => TState,
		revert: (state: TState) => TState,
		operation: () => Promise<TResult>,
		confirm?: (state: TState, result: TResult) => TState
	): Promise<TResult> {
		// Check if already exists
		if (this.updates.has(id)) {
			throw new Error(`Optimistic update with id "${id}" already exists`);
		}

		// Check limit
		if (this.updates.size >= this.maxPending) {
			throw new Error(`Maximum pending updates (${this.maxPending}) reached`);
		}

		// Create update
		const update: OptimisticUpdate<TState, TResult> = {
			id,
			apply,
			revert,
			confirm,
			operation,
			timestamp: Date.now(),
			status: 'pending',
		};

		// We store the update with an unknown result type so mixed TResult values can share the map.
		this.updates.set(id, update as OptimisticUpdate<TState, unknown>);
		this.totalUpdates++;
		this.log('add', id);

		try {
			// Execute operation with timeout
			const result = await this.withTimeout(operation(), this.timeout);

			// Mark as confirmed
			update.status = 'confirmed';
			this.totalConfirmed++;
			this.log('confirm', id);

			// Keep in map for a bit to allow confirm() to be called
			setTimeout(() => {
				this.updates.delete(id);
			}, 1000);

			return result;
		} catch (error) {
			// Mark as reverted
			update.status = 'reverted';
			update.error = error instanceof Error ? error : new Error(String(error));
			this.totalReverted++;
			this.log('revert', id, update.error.message);

			// Keep in map briefly to allow revert() to be called
			setTimeout(() => {
				this.updates.delete(id);
			}, 1000);

			throw error;
		}
	}

	/**
	 * Apply all pending optimistic updates to state
	 */
	applyAll(initialState: TState): TState {
		let state = initialState;

		for (const update of this.updates.values()) {
			if (update.status === 'pending') {
				state = update.apply(state);
			}
		}

		return state;
	}

	/**
	 * Get specific update
	 */
	get(id: OptimisticUpdateId): OptimisticUpdate<TState, unknown> | undefined {
		return this.updates.get(id);
	}

	/**
	 * Check if update exists
	 */
	has(id: OptimisticUpdateId): boolean {
		return this.updates.has(id);
	}

	/**
	 * Get all pending updates
	 */
	getPending(): OptimisticUpdate<TState, unknown>[] {
		return Array.from(this.updates.values()).filter((u) => u.status === 'pending');
	}

	/**
	 * Clear all updates
	 */
	clear(): void {
		this.updates.clear();
		this.log('clear', 'all');
	}

	/**
	 * Get statistics
	 */
	getStats() {
		return {
			pending: this.updates.size,
			total: this.totalUpdates,
			confirmed: this.totalConfirmed,
			reverted: this.totalReverted,
			successRate: this.totalUpdates > 0 ? this.totalConfirmed / this.totalUpdates : 0,
		};
	}

	/**
	 * Execute with timeout
	 */
	private async withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
		return Promise.race([
			promise,
			new Promise<T>((_, reject) =>
				setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
			),
		]);
	}

	/**
	 * Debug logging
	 */
	private log(action: string, id: string, extra?: string): void {
		if (!this.debug) {
			return;
		}

		const stats = this.getStats();
		const entry: DebugLogEntry = {
			scope: 'optimistic',
			action,
			message: `${id}${extra ? ` ${extra}` : ''}`.trim(),
			stats,
		};

		if (this.logger) {
			this.logger(entry);
		} else if (typeof console !== 'undefined' && typeof console.warn === 'function') {
			console.warn(
				`[Optimistic] ${action} id="${id}" ${extra || ''} (${stats.pending} pending, success rate: ${(stats.successRate * 100).toFixed(1)}%)`
			);
		}
	}
}

/**
 * Helper to generate unique update IDs
 */
export function generateUpdateId(prefix: string = 'update'): OptimisticUpdateId {
	return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Optimistic State Manager
 * Combines state management with optimistic updates
 */
export class OptimisticState<TState> {
	private baseState: TState;
	private manager: OptimisticManager<TState>;
	private listeners: Set<(state: TState) => void>;

	constructor(initialState: TState, options: OptimisticManagerOptions = {}) {
		this.baseState = initialState;
		this.manager = new OptimisticManager(options);
		this.listeners = new Set();
	}

	/**
	 * Get current state (with all optimistic updates applied)
	 */
	getState(): TState {
		return this.manager.applyAll(this.baseState);
	}

	/**
	 * Get base state (without optimistic updates)
	 */
	getBaseState(): TState {
		return this.baseState;
	}

	/**
	 * Set base state
	 */
	setState(state: TState): void {
		this.baseState = state;
		this.notify();
	}

	/**
	 * Perform optimistic update
	 */
	async update<TResult>(
		apply: (state: TState) => TState,
		revert: (state: TState) => TState,
		operation: () => Promise<TResult>,
		confirm?: (state: TState, result: TResult) => TState
	): Promise<TResult> {
		const id = generateUpdateId();

		// Notify immediately after applying optimistic update
		this.notify();

		try {
			const result = await this.manager.add(id, apply, revert, operation, confirm);

			// Apply confirmation if provided
			if (confirm) {
				this.baseState = confirm(this.baseState, result);
			}

			this.notify();
			return result;
		} catch (error) {
			// Revert will be applied automatically by manager
			// Just need to apply revert to base state
			this.baseState = revert(this.baseState);
			this.notify();
			throw error;
		}
	}

	/**
	 * Subscribe to state changes
	 */
	subscribe(listener: (state: TState) => void): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	/**
	 * Notify all listeners
	 */
	private notify(): void {
		const state = this.getState();
		this.listeners.forEach((listener) => {
			try {
				listener(state);
			} catch (error) {
				console.error('Error in state listener:', error);
			}
		});
	}

	/**
	 * Get statistics
	 */
	getStats() {
		return this.manager.getStats();
	}

	/**
	 * Clear all optimistic updates
	 */
	clear(): void {
		this.manager.clear();
		this.notify();
	}
}
