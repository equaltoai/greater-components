/**
 * GraphQL Client Setup for Lesser
 * 
 * Configures Apollo Client with:
 * - HTTP link for queries/mutations
 * - WebSocket link for subscriptions
 * - Normalized caching
 * - Authentication
 * - Error handling
 * - Retry logic
 */

import {
	ApolloClient,
	InMemoryCache,
	HttpLink,
	split,
	from,
	ApolloLink,
	type NormalizedCacheObject,
	type DefaultOptions,
} from '@apollo/client/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { createClient, type Client } from 'graphql-ws';
import { cacheConfig } from './cache.js';

export interface GraphQLClientConfig {
	/**
	 * HTTP endpoint for queries and mutations
	 * @example 'https://api.lesser.social/graphql'
	 */
	httpEndpoint: string;

	/**
	 * WebSocket endpoint for subscriptions
	 * @example 'wss://api.lesser.social/graphql'
	 */
	wsEndpoint: string;

	/**
	 * Authentication token
	 */
	token?: string;

	/**
	 * Enable debug logging
	 */
	debug?: boolean;

	/**
	 * Custom headers for HTTP requests
	 */
	headers?: Record<string, string>;

	/**
	 * Connection timeout in milliseconds
	 * @default 10000
	 */
	connectionTimeout?: number;

	/**
	 * Enable automatic retry on network errors
	 * @default true
	 */
	enableRetry?: boolean;

	/**
	 * Maximum retry attempts
	 * @default 3
	 */
	maxRetries?: number;
}

export interface GraphQLClientInstance {
	client: ApolloClient<NormalizedCacheObject>;
	wsClient: Client;
	updateToken: (token: string | null) => void;
	close: () => void;
}

/**
 * Create Apollo Client with Lesser-specific configuration
 */
export function createGraphQLClient(config: GraphQLClientConfig): GraphQLClientInstance {
	const {
		httpEndpoint,
		wsEndpoint,
		token,
		debug = false,
		headers = {},
		connectionTimeout = 10000,
		enableRetry = true,
		maxRetries = 3,
	} = config;

	let currentToken = token || null;

	// HTTP Link for queries and mutations
	const httpLink = new HttpLink({
		uri: httpEndpoint,
		headers: {
			...headers,
			...(currentToken && { authorization: `Bearer ${currentToken}` }),
		},
		fetch,
	});

	// WebSocket client for subscriptions
	let wsClient = createClient({
		url: wsEndpoint,
		connectionParams: () => ({
			...(currentToken && { authorization: `Bearer ${currentToken}` }),
		}),
		retryAttempts: maxRetries,
		shouldRetry: () => enableRetry,
		connectionAckWaitTimeout: connectionTimeout,
		on: {
			connected: () => {
				if (debug) console.log('[GraphQL] WebSocket connected');
			},
			closed: () => {
				if (debug) console.log('[GraphQL] WebSocket closed');
			},
			error: (error) => {
				if (debug) console.error('[GraphQL] WebSocket error:', error);
			},
		},
	});

	// WebSocket Link for subscriptions
	const wsLink = new GraphQLWsLink(wsClient);

	// Error handling link
	const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
		if (graphQLErrors) {
			graphQLErrors.forEach(({ message, locations, path, extensions }) => {
				const errorMsg = `[GraphQL Error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`;
				if (debug) console.error(errorMsg);

				// Handle authentication errors
				if (extensions?.code === 'UNAUTHENTICATED') {
					if (debug) console.error('[GraphQL] Authentication error');
					// Clear token on auth failure
					currentToken = null;
				}
			});
		}

		if (networkError) {
			if (debug) console.error(`[GraphQL Network Error]: ${networkError.message}`);
		}
	});

	// Retry link for network errors
	const retryLink = new RetryLink({
		attempts: {
			max: enableRetry ? maxRetries : 0,
			retryIf: (error) => {
				// Retry on network errors but not on GraphQL errors
				return !!error && !error.result;
			},
		},
		delay: {
			initial: 300,
			max: 3000,
			jitter: true,
		},
	});

	// Split link: WebSocket for subscriptions, HTTP for queries/mutations
	const splitLink = split(
		({ query }) => {
			const definition = getMainDefinition(query);
			return (
				definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
			);
		},
		wsLink,
		httpLink
	);

	// Combine all links
	const link = from([errorLink, retryLink, splitLink]);

	// Default options for all operations
	const defaultOptions: DefaultOptions = {
		watchQuery: {
			fetchPolicy: 'cache-and-network',
			errorPolicy: 'all',
		},
		query: {
			fetchPolicy: 'network-only',
			errorPolicy: 'all',
		},
		mutate: {
			errorPolicy: 'all',
		},
	};

	// Create Apollo Client
	const client = new ApolloClient({
		link,
		cache: new InMemoryCache(cacheConfig),
		defaultOptions,
		connectToDevTools: debug,
	});

	// Function to update authentication token
	const updateToken = (newToken: string | null) => {
		currentToken = newToken;

		// Reconnect WebSocket with new token
		wsClient.dispose();
		wsClient = createClient({
			url: wsEndpoint,
			connectionParams: () => ({
				...(currentToken && { authorization: `Bearer ${currentToken}` }),
			}),
			retryAttempts: maxRetries,
			shouldRetry: () => enableRetry,
		});

		// Clear cache on token change
		client.clearStore();

		if (debug) console.log('[GraphQL] Token updated, cache cleared');
	};

	// Cleanup function
	const close = () => {
		wsClient.dispose();
		client.stop();
		if (debug) console.log('[GraphQL] Client closed');
	};

	return {
		client,
		wsClient,
		updateToken,
		close,
	};
}

/**
 * Singleton client instance (optional)
 */
let clientInstance: GraphQLClientInstance | null = null;

/**
 * Get or create singleton GraphQL client
 */
export function getGraphQLClient(config?: GraphQLClientConfig): GraphQLClientInstance {
	if (!clientInstance && !config) {
		throw new Error('GraphQL client not initialized. Call getGraphQLClient with config first.');
	}

	if (config && !clientInstance) {
		clientInstance = createGraphQLClient(config);
	}

	return clientInstance!;
}

/**
 * Close and reset singleton client
 */
export function closeGraphQLClient(): void {
	if (clientInstance) {
		clientInstance.close();
		clientInstance = null;
	}
}

