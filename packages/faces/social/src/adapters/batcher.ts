/**
 * Request Batching for Adapters
 *
 * Combines multiple requests into batched operations to reduce API calls.
 * Supports automatic flushing based on time and size thresholds.
 *
 * @module adapters/batcher
 */

export interface BatchRequest<TRequest, TResponse> {
	request: TRequest;
	resolve: (response: TResponse) => void;
	reject: (error: Error) => void;
}

export interface BatcherOptions {
	/**
	 * Maximum number of requests in a batch
	 * @default 50
	 */
	maxBatchSize?: number;

	/**
	 * Maximum time to wait before flushing (ms)
	 * @default 50
	 */
	maxWaitTime?: number;

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

export interface DebugLogEntry {
	scope: 'batcher' | 'deduplicator' | 'cache' | 'optimistic';
	action: string;
	message: string;
	stats: Record<string, unknown>;
}

export type DebugLogger = (entry: DebugLogEntry) => void;

/**
 * Request Batcher
 * Accumulates requests and flushes them in batches
 */
export class RequestBatcher<TRequest, TResponse> {
	private queue: BatchRequest<TRequest, TResponse>[];
	private maxBatchSize: number;
	private maxWaitTime: number;
	private debug: boolean;
	private flushTimer: ReturnType<typeof setTimeout> | null;
	private executor: (requests: TRequest[]) => Promise<TResponse[]>;
	private totalBatches: number;
	private totalRequests: number;
	private logger?: DebugLogger;

	constructor(
		executor: (requests: TRequest[]) => Promise<TResponse[]>,
		options: BatcherOptions = {}
	) {
		this.executor = executor;
		this.queue = [];
		this.maxBatchSize = options.maxBatchSize ?? 50;
		this.maxWaitTime = options.maxWaitTime ?? 50;
		this.debug = options.debug ?? false;
		this.flushTimer = null;
		this.totalBatches = 0;
		this.totalRequests = 0;
		this.logger = options.logger;
	}

	/**
	 * Add request to batch
	 */
	add(request: TRequest): Promise<TResponse> {
		return new Promise((resolve, reject) => {
			this.queue.push({ request, resolve, reject });
			this.totalRequests++;

			this.log('add', `queue size: ${this.queue.length}`);

			// Flush immediately if batch is full
			if (this.queue.length >= this.maxBatchSize) {
				this.flush();
			} else if (!this.flushTimer) {
				// Schedule flush if not already scheduled
				this.flushTimer = setTimeout(() => {
					this.flush();
				}, this.maxWaitTime);
			}
		});
	}

	/**
	 * Flush current batch
	 */
	async flush(): Promise<void> {
		// Clear timer
		if (this.flushTimer) {
			clearTimeout(this.flushTimer);
			this.flushTimer = null;
		}

		// Nothing to flush
		if (this.queue.length === 0) {
			return;
		}

		// Take current queue
		const batch = this.queue.splice(0, this.maxBatchSize);
		this.totalBatches++;

		this.log('flush', `${batch.length} requests (batch #${this.totalBatches})`);

		try {
			// Execute batch
			const requests = batch.map((b) => b.request);
			const responses = await this.executor(requests);

			// Validate response count
			if (responses.length !== requests.length) {
				throw new Error(
					`Batch executor returned ${responses.length} responses for ${requests.length} requests`
				);
			}

			// Resolve individual promises
			batch.forEach((b, index) => {
				const response = responses[index];
				if (response === undefined) {
					throw new Error(`Missing response at index ${index}`);
				}
				b.resolve(response);
			});

			this.log('success', `${batch.length} requests resolved`);
		} catch (error) {
			// Reject all promises in batch
			const errorObj = error instanceof Error ? error : new Error(String(error));
			batch.forEach((b) => {
				b.reject(errorObj);
			});

			this.log('error', errorObj.message);
		}

		// If there are still items in queue, schedule another flush
		if (this.queue.length > 0) {
			this.flushTimer = setTimeout(() => {
				this.flush();
			}, this.maxWaitTime);
		}
	}

	/**
	 * Get batcher statistics
	 */
	getStats() {
		return {
			queueSize: this.queue.length,
			totalBatches: this.totalBatches,
			totalRequests: this.totalRequests,
			avgBatchSize: this.totalBatches > 0 ? this.totalRequests / this.totalBatches : 0,
		};
	}

	/**
	 * Clear queue and cancel pending requests
	 */
	clear(): void {
		if (this.flushTimer) {
			clearTimeout(this.flushTimer);
			this.flushTimer = null;
		}

		// Reject all pending
		const error = new Error('Batcher cleared');
		this.queue.forEach((b) => b.reject(error));
		this.queue = [];

		this.log('clear', 'queue cleared');
	}

	/**
	 * Debug logging
	 */
	private log(action: string, message: string): void {
		if (!this.debug) {
			return;
		}

		const stats = this.getStats();
		const entry: DebugLogEntry = {
			scope: 'batcher',
			action,
			message,
			stats,
		};

		if (this.logger) {
			this.logger(entry);
		} else if (typeof console !== 'undefined' && typeof console.warn === 'function') {
			console.warn(
				`[Batcher] ${action}: ${message} (total: ${stats.totalRequests} requests in ${stats.totalBatches} batches, avg: ${stats.avgBatchSize.toFixed(1)})`
			);
		}
	}
}

/**
 * Request deduplication
 * Prevents duplicate in-flight requests by returning the same promise
 */
export class RequestDeduplicator<TKey, TResponse> {
	private inFlight: Map<TKey, Promise<TResponse>>;
	private debug: boolean;
	private hits: number;
	private misses: number;
	private logger?: DebugLogger;

	constructor(options: { debug?: boolean; logger?: DebugLogger } = {}) {
		this.inFlight = new Map();
		this.debug = options.debug ?? false;
		this.hits = 0;
		this.misses = 0;
		this.logger = options.logger;
	}

	/**
	 * Execute request with deduplication
	 */
	async execute(key: TKey, executor: () => Promise<TResponse>): Promise<TResponse> {
		// Check if already in flight
		const existing = this.inFlight.get(key);
		if (existing) {
			this.hits++;
			this.log('dedupe', String(key));
			return existing;
		}

		// Execute new request
		this.misses++;
		const promise = executor()
			.then((result) => {
				this.inFlight.delete(key);
				this.log('complete', String(key));
				return result;
			})
			.catch((error) => {
				this.inFlight.delete(key);
				this.log('error', String(key));
				throw error;
			});

		this.inFlight.set(key, promise);
		this.log('new', String(key));
		return promise;
	}

	/**
	 * Get statistics
	 */
	getStats() {
		return {
			inFlight: this.inFlight.size,
			hits: this.hits,
			misses: this.misses,
			dedupeRate: this.hits / (this.hits + this.misses) || 0,
		};
	}

	/**
	 * Clear all in-flight requests
	 */
	clear(): void {
		this.inFlight.clear();
		this.log('clear', 'all');
	}

	/**
	 * Debug logging
	 */
	private log(action: string, key: string): void {
		if (!this.debug) {
			return;
		}

		const stats = this.getStats();
		const entry: DebugLogEntry = {
			scope: 'deduplicator',
			action,
			message: key,
			stats,
		};

		if (this.logger) {
			this.logger(entry);
		} else if (typeof console !== 'undefined' && typeof console.warn === 'function') {
			console.warn(
				`[Deduplicator] ${action} key="${key}" (${stats.inFlight} in-flight, dedupe rate: ${(stats.dedupeRate * 100).toFixed(1)}%)`
			);
		}
	}
}
