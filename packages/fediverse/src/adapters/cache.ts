/**
 * Cache Layer for Adapters
 *
 * Provides LRU caching with TTL for adapter responses.
 * Prevents redundant API calls and improves performance.
 *
 * @module adapters/cache
 */
import type { DebugLogEntry, DebugLogger } from './batcher.js';

export interface CacheEntry<T> {
	value: T;
	timestamp: number;
	ttl: number;
	size: number;
}

export interface CacheOptions {
	/**
	 * Maximum number of entries in the cache
	 * @default 1000
	 */
	maxSize?: number;

	/**
	 * Default time-to-live in milliseconds
	 * @default 300000 (5 minutes)
	 */
	defaultTTL?: number;

	/**
	 * Enable debug logging
	 * @default false
	 */
	debug?: boolean;

	/**
	 * Optional logger for debug messages
	 */
	logger?: DebugLogger;
}

/**
 * LRU Cache with TTL support
 */
export class AdapterCache<T = unknown> {
	private cache: Map<string, CacheEntry<T>>;
	private accessOrder: string[];
	private maxSize: number;
	private defaultTTL: number;
	private debug: boolean;
	private hits: number;
	private misses: number;
	private logger?: DebugLogger;

	constructor(options: CacheOptions = {}) {
		this.cache = new Map();
		this.accessOrder = [];
		this.maxSize = options.maxSize ?? 1000;
		this.defaultTTL = options.defaultTTL ?? 300000; // 5 minutes
		this.debug = options.debug ?? false;
		this.hits = 0;
		this.misses = 0;
		this.logger = options.logger;
	}

	/**
	 * Get value from cache
	 */
	get(key: string): T | undefined {
		const entry = this.cache.get(key);

		if (!entry) {
			this.misses++;
			this.log('miss', key);
			return undefined;
		}

		// Check if expired
		if (Date.now() - entry.timestamp > entry.ttl) {
			this.cache.delete(key);
			this.removeFromAccessOrder(key);
			this.misses++;
			this.log('expired', key);
			return undefined;
		}

		// Update access order (move to end = most recently used)
		this.updateAccessOrder(key);
		this.hits++;
		this.log('hit', key);

		return entry.value;
	}

	/**
	 * Set value in cache
	 */
	set(key: string, value: T, ttl?: number): void {
		const entry: CacheEntry<T> = {
			value,
			timestamp: Date.now(),
			ttl: ttl ?? this.defaultTTL,
			size: this.estimateSize(value),
		};

		// If cache is full, evict least recently used
		if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
			this.evictLRU();
		}

		this.cache.set(key, entry);
		this.updateAccessOrder(key);
		this.log('set', key, `ttl=${entry.ttl}ms`);
	}

	/**
	 * Check if key exists and is not expired
	 */
	has(key: string): boolean {
		return this.get(key) !== undefined;
	}

	/**
	 * Delete entry from cache
	 */
	delete(key: string): boolean {
		const deleted = this.cache.delete(key);
		if (deleted) {
			this.removeFromAccessOrder(key);
			this.log('delete', key);
		}
		return deleted;
	}

	/**
	 * Clear all entries
	 */
	clear(): void {
		this.cache.clear();
		this.accessOrder = [];
		this.hits = 0;
		this.misses = 0;
		this.log('clear', 'all');
	}

	/**
	 * Get cache statistics
	 */
	getStats() {
		return {
			size: this.cache.size,
			maxSize: this.maxSize,
			hits: this.hits,
			misses: this.misses,
			hitRate: this.hits / (this.hits + this.misses) || 0,
		};
	}

	/**
	 * Invalidate entries matching a pattern
	 */
	invalidate(pattern: string | RegExp): number {
		const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
		const patternStr = pattern.toString();
		let count = 0;

		for (const key of this.cache.keys()) {
			if (regex.test(key)) {
				this.delete(key);
				count++;
			}
		}

		this.log('invalidate', patternStr, `${count} entries`);
		return count;
	}

	/**
	 * Update access order (LRU tracking)
	 */
	private updateAccessOrder(key: string): void {
		this.removeFromAccessOrder(key);
		this.accessOrder.push(key);
	}

	/**
	 * Remove from access order
	 */
	private removeFromAccessOrder(key: string): void {
		const index = this.accessOrder.indexOf(key);
		if (index !== -1) {
			this.accessOrder.splice(index, 1);
		}
	}

	/**
	 * Evict least recently used entry
	 */
	private evictLRU(): void {
		if (this.accessOrder.length === 0) return;

		const lruKey = this.accessOrder[0];
		if (lruKey === undefined) return; // Should never happen due to length check
		
		this.cache.delete(lruKey);
		this.accessOrder.shift();
		this.log('evict', lruKey);
	}

	/**
	 * Estimate size of value (rough approximation)
	 */
	private estimateSize(value: unknown): number {
		try {
			return JSON.stringify(value).length;
		} catch {
			return 1000; // Default size if can't stringify
		}
	}

	/**
	 * Debug logging
	 */
	private log(action: string, key: string, extra?: string): void {
		if (!this.debug) {
			return;
		}

		const stats = this.getStats();
		const entry: DebugLogEntry = {
			scope: 'cache',
			action,
			message: `${key}${extra ? ` ${extra}` : ''}`.trim(),
			stats,
		};

		if (this.logger) {
			this.logger(entry);
		} else if (typeof console !== 'undefined' && typeof console.warn === 'function') {
			console.warn(
				`[Cache] ${action} key="${key}" ${extra || ''} (${stats.size}/${stats.maxSize}, hit rate: ${(stats.hitRate * 100).toFixed(1)}%)`
			);
		}
	}
}

/**
 * Create cache key from components
 */
export function createCacheKey(...parts: (string | number | boolean | undefined | null)[]): string {
	return parts
		.filter((p) => p !== undefined && p !== null)
		.map(String)
		.join(':');
}

/**
 * Global cache instance for adapters
 */
export const adapterCache = new AdapterCache({
	maxSize: 1000,
	defaultTTL: 300000, // 5 minutes
	debug: false,
});
