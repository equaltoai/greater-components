/**
 * GraphQL Client for Lesser
 *
 * Production-ready GraphQL client with caching, deduplication, and WebSocket subscriptions.
 * Handles GraphQL queries, mutations, and subscriptions for Lesser's ActivityPub GraphQL API.
 *
 * Features:
 * - LRU caching with TTL for query results
 * - Request deduplication to prevent redundant API calls
 * - WebSocket subscriptions with auto-reconnect
 * - Configurable timeout and retry behavior
 *
 * @module adapters/graphql/client
 */

import type { GraphQLConfig, GraphQLResponse, Variables, SubscriptionEvent } from './types.js';
import { AdapterCache, createCacheKey } from '../cache.js';
import { RequestDeduplicator } from '../batcher.js';

const ANSI_ESCAPE_PATTERN = new RegExp(
	String.raw`[\u001B\u009B][[\]()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]`,
	'g'
);

function sanitizeLogValue(value: unknown): string {
	if (value === null) {
		return '';
	}
	const stripControl = (input: string) =>
		input.replace(/[\r\n]+/g, ' ').replace(ANSI_ESCAPE_PATTERN, '');
	if (typeof value === 'string') {
		return stripControl(value);
	}

	try {
		return stripControl(JSON.stringify(value));
	} catch {
		return '[unserializable]';
	}
}

function logError(message: string, detail?: unknown): void {
	if (detail === undefined) {
		console.error(message);
		return;
	}
	console.error(message, sanitizeLogValue(detail));
}

/**
 * GraphQL Client with built-in caching and deduplication
 */
export class GraphQLClient {
	private config: Required<GraphQLConfig>;
	private ws: WebSocket | null = null;
	private subscriptions: Map<string, Set<(event: SubscriptionEvent) => void>> = new Map();
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private reconnectDelay = 1000;

	// Caching and optimization
	private cache: AdapterCache;
	private deduplicator: RequestDeduplicator<string, unknown>;
	private enableCache: boolean;
	private enableDeduplication: boolean;
	private cacheTTL: number;

	constructor(config: GraphQLConfig) {
		// Initialize caching and optimization flags
		this.enableCache = config.enableCache ?? true;
		this.enableDeduplication = config.enableDeduplication ?? true;
		this.cacheTTL = config.cacheTTL ?? 300000; // 5 minutes default

		this.config = {
			endpoint: config.endpoint,
			wsEndpoint: config.wsEndpoint || config.endpoint.replace(/^http/, 'ws'),
			token: config.token || '',
			headers: config.headers || {},
			timeout: config.timeout || 30000,
			enableCache: this.enableCache,
			cacheTTL: this.cacheTTL,
			cacheSize: config.cacheSize ?? 1000,
			enableDeduplication: this.enableDeduplication,
			debug: config.debug ?? false,
		};

		this.cache = new AdapterCache({
			maxSize: this.config.cacheSize,
			defaultTTL: this.cacheTTL,
			debug: this.config.debug,
		});

		this.deduplicator = new RequestDeduplicator({
			debug: this.config.debug,
		});
	}

	/**
	 * Execute a GraphQL query with caching and deduplication
	 */
	async query<T = unknown>(query: string, variables?: Variables): Promise<T> {
		// Generate cache key
		const cacheKey = createCacheKey('query', query, JSON.stringify(variables || {}));

		// Check cache first (queries are cacheable)
		if (this.enableCache) {
			const cached = this.cache.get(cacheKey);
			if (cached !== undefined) {
				return cached as T;
			}
		}

		// Execute with deduplication
		const execute = async () => {
			const response = await this.request<T>(query, variables);
			return this.handleResponse(response);
		};

		const result = this.enableDeduplication
			? await this.deduplicator.execute(cacheKey, execute)
			: await execute();

		// Cache the result
		if (this.enableCache) {
			this.cache.set(cacheKey, result, this.cacheTTL);
		}

		return result as T;
	}

	/**
	 * Execute a GraphQL mutation (no caching, but with deduplication)
	 */
	async mutate<T = unknown>(mutation: string, variables?: Variables): Promise<T> {
		// Mutations are not cached, but can be deduplicated to prevent double-submits
		const execute = async () => {
			const response = await this.request<T>(mutation, variables);
			return this.handleResponse(response);
		};

		if (this.enableDeduplication) {
			const key = createCacheKey('mutation', mutation, JSON.stringify(variables || {}));
			return (await this.deduplicator.execute(key, execute)) as T;
		}

		return execute();
	}

	/**
	 * Subscribe to GraphQL subscriptions via WebSocket
	 */
	subscribe(
		subscription: string,
		callback: (event: SubscriptionEvent) => void,
		variables?: Variables
	): () => void {
		const subscriptionId = `${subscription}-${JSON.stringify(variables || {})}`;

		// Add callback to subscriptions
		let callbacks = this.subscriptions.get(subscriptionId);
		if (!callbacks) {
			callbacks = new Set();
			this.subscriptions.set(subscriptionId, callbacks);
		}
		callbacks.add(callback);

		// Connect WebSocket if not already connected
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
			this.connectWebSocket();
		}

		// Send subscription message
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(
				JSON.stringify({
					type: 'subscribe',
					id: subscriptionId,
					query: subscription,
					variables,
				})
			);
		}

		// Return unsubscribe function
		return () => {
			const callbacks = this.subscriptions.get(subscriptionId);
			if (callbacks) {
				callbacks.delete(callback);
				if (callbacks.size === 0) {
					this.subscriptions.delete(subscriptionId);

					// Send unsubscribe message
					if (this.ws && this.ws.readyState === WebSocket.OPEN) {
						this.ws.send(
							JSON.stringify({
								type: 'unsubscribe',
								id: subscriptionId,
							})
						);
					}
				}
			}
		};
	}

	/**
	 * Update authentication token
	 */
	setToken(token: string) {
		this.config.token = token;

		// Reconnect WebSocket with new token
		if (this.ws) {
			this.disconnect();
			this.connectWebSocket();
		}
	}

	/**
	 * Disconnect WebSocket
	 */
	disconnect() {
		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}
		this.subscriptions.clear();
	}

	/**
	 * Invalidate cache entries matching a pattern
	 */
	invalidateCache(pattern: string | RegExp): number {
		return this.cache.invalidate(pattern);
	}

	/**
	 * Clear all cache
	 */
	clearCache(): void {
		this.cache.clear();
	}

	/**
	 * Get cache statistics
	 */
	getCacheStats() {
		return this.cache.getStats();
	}

	/**
	 * Get deduplication statistics
	 */
	getDeduplicationStats() {
		return this.deduplicator.getStats();
	}

	/**
	 * Get all client statistics
	 */
	getStats() {
		return {
			cache: this.getCacheStats(),
			deduplication: this.getDeduplicationStats(),
			subscriptions: this.subscriptions.size,
			wsConnected: this.ws?.readyState === WebSocket.OPEN,
		};
	}

	/**
	 * Make GraphQL HTTP request
	 */
	private async request<T>(query: string, variables?: Variables): Promise<GraphQLResponse<T>> {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), this.config.timeout);

		try {
			const response = await fetch(this.config.endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(this.config.token && { Authorization: `Bearer ${this.config.token}` }),
					...this.config.headers,
				},
				body: JSON.stringify({ query, variables }),
				signal: controller.signal,
			});

			clearTimeout(timeout);

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			return await response.json();
		} catch (error) {
			clearTimeout(timeout);

			if (error instanceof Error && error.name === 'AbortError') {
				throw new Error('GraphQL request timeout');
			}

			throw error;
		}
	}

	/**
	 * Handle GraphQL response
	 */
	private handleResponse<T>(response: GraphQLResponse<T>): T {
		if (response.errors && response.errors.length > 0) {
			const error = response.errors[0];
			throw new Error(error?.message || 'GraphQL error');
		}

		if (!response.data) {
			throw new Error('No data in GraphQL response');
		}

		return response.data;
	}

	/**
	 * Connect to GraphQL WebSocket
	 */
	private connectWebSocket() {
		if (this.ws) return;

		try {
			// Build WebSocket URL with auth token
			const url = new URL(this.config.wsEndpoint);
			if (this.config.token) {
				url.searchParams.set('token', this.config.token);
			}

			this.ws = new WebSocket(url.toString());

			this.ws.onopen = () => {
				this.reconnectAttempts = 0;

				// Re-subscribe to all active subscriptions
				for (const [subscriptionId, callbacks] of this.subscriptions) {
					if (callbacks.size > 0 && this.ws) {
						const [query, variablesStr] = subscriptionId.split('-');
						const variables = variablesStr ? JSON.parse(variablesStr) : undefined;

						this.ws.send(
							JSON.stringify({
								type: 'subscribe',
								id: subscriptionId,
								query,
								variables,
							})
						);
					}
				}
			};

			this.ws.onmessage = (event) => {
				try {
					const message = JSON.parse(event.data);

					if (message.type === 'data' && message.id) {
						const callbacks = this.subscriptions.get(message.id);
						if (callbacks) {
							for (const callback of callbacks) {
								callback(message.payload);
							}
						}
					} else if (message.type === 'error') {
						logError('GraphQL subscription error:', message.error);
					}
				} catch (error) {
					logError('Failed to parse WebSocket message:', error);
				}
			};

			this.ws.onerror = (error) => {
				logError('WebSocket error:', error);
			};

			this.ws.onclose = () => {
				this.ws = null;

				// Attempt to reconnect if there are active subscriptions
				if (this.subscriptions.size > 0 && this.reconnectAttempts < this.maxReconnectAttempts) {
					this.reconnectAttempts++;
					setTimeout(() => {
						this.connectWebSocket();
					}, this.reconnectDelay * this.reconnectAttempts);
				}
			};
		} catch (error) {
			logError('Failed to create WebSocket connection:', error);
		}
	}
}

/**
 * Create a GraphQL client instance
 *
 * @param config - GraphQL configuration
 * @returns GraphQL client instance
 *
 * @example
 * ```typescript
 * const client = createGraphQLClient({
 *   endpoint: 'https://api.example.com/graphql',
 *   token: 'your-auth-token',
 * });
 *
 * // Query
 * const data = await client.query(TIMELINE_QUERY, { limit: 20 });
 *
 * // Mutation
 * const result = await client.mutate(CREATE_NOTE_MUTATION, { content: 'Hello!' });
 *
 * // Subscription
 * const unsubscribe = client.subscribe(
 *   TIMELINE_SUBSCRIPTION,
 *   (event) => console.log('New activity:', event),
 *   { userId: 'me' }
 * );
 * ```
 */
export function createGraphQLClient(config: GraphQLConfig): GraphQLClient {
	return new GraphQLClient(config);
}
