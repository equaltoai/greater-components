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
import { ApolloClient } from '@apollo/client';
import { type Client } from 'graphql-ws';
import { type AuthExpiredHandler, type TokenRefreshCallback } from '../authExpiry.js';
declare module '@apollo/client' {
	namespace ApolloClient {
		namespace DeclareDefaultOptions {
			interface WatchQuery {
				errorPolicy?: 'none' | 'ignore' | 'all';
			}
			interface Query {
				errorPolicy?: 'none' | 'ignore' | 'all';
			}
			interface Mutate {
				errorPolicy?: 'none' | 'ignore' | 'all';
			}
		}
	}
}
export interface GraphQLClientConfig {
	/**
	 * HTTP endpoint for queries and mutations
	 * @example 'https://api.lesser.social/graphql'
	 */
	httpEndpoint: string;
	/**
	 * WebSocket endpoint for subscriptions
	 * If not provided, WebSocket will NOT be used - subscriptions will not work
	 * @example 'wss://api.lesser.social/graphql'
	 */
	wsEndpoint?: string;
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
	/**
	 * Supplies a fresh access token when Lesser reports the current one expired.
	 *
	 * Lesser v1.5.33 re-checks credential expiry as each `subscribe` operation
	 * starts and answers an expired credential with a graphql-ws Error frame
	 * carrying `extensions.code = "TOKEN_EXPIRED"`. When this callback is
	 * configured the client refreshes once, re-dials the existing WebSocket so
	 * `connectionParams` re-evaluates with the new token, and graphql-ws
	 * re-establishes the active subscriptions.
	 *
	 * When omitted, expiry is terminal and reported through
	 * {@link GraphQLClientConfig.onAuthExpired} — never retried silently.
	 */
	onTokenRefresh?: TokenRefreshCallback;
	/**
	 * Notified when credential expiry is terminal: no refresh callback is
	 * configured, or refreshing produced no usable token.
	 */
	onAuthExpired?: AuthExpiredHandler;
}
export interface GraphQLClientInstance {
	client: ApolloClient;
	wsClient: Client | null;
	updateToken: (token: string | null) => void;
	onReconnect?: (listener: () => void) => () => void;
	close: () => void;
}
/**
 * Create Apollo Client with Lesser-specific configuration
 */
export declare function createGraphQLClient(config: GraphQLClientConfig): GraphQLClientInstance;
/**
 * Get or create singleton GraphQL client
 */
export declare function getGraphQLClient(config?: GraphQLClientConfig): GraphQLClientInstance;
/**
 * Close and reset singleton client
 */
export declare function closeGraphQLClient(): void;
//# sourceMappingURL=client.d.ts.map
