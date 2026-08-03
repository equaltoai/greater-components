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

import { ApolloClient, ApolloLink, InMemoryCache, HttpLink, split, from } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions/index.js';
import { getMainDefinition, Observable } from '@apollo/client/utilities/index.js';
import { onError } from '@apollo/client/link/error/index.js';
import { RetryLink } from '@apollo/client/link/retry/index.js';
import { createClient, type Client } from 'graphql-ws';
import { CombinedGraphQLErrors } from '@apollo/client/errors/index.js';
import { cacheConfig } from './cache.js';

/* eslint-disable @typescript-eslint/no-namespace -- Apollo's declaration-merging API requires namespaces. */
declare module '@apollo/client' {
	namespace ApolloClient {
		namespace DeclareDefaultOptions {
			// Optional declarations keep this library compatible with consumer-owned
			// clients while admitting the `all` defaults used by Greater's client.
			interface WatchQuery {
				errorPolicy?: 'all';
			}

			interface Query {
				errorPolicy?: 'all';
			}

			interface Mutate {
				errorPolicy?: 'all';
			}
		}
	}
}
/* eslint-enable @typescript-eslint/no-namespace */
import {
	AUTH_EXPIRED_CODE,
	AuthExpiredError,
	createCredentialGenerations,
	createSingleFlightRefresh,
	hasServerErrorCode,
	type AuthExpiredHandler,
	type TokenRefreshCallback,
} from '../authExpiry.js';

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
	wsClient: Client | null; // null if wsEndpoint not provided
	updateToken: (token: string | null) => void;
	close: () => void;
}

function parseWebSocketEndpoint(endpoint: string): URL | null {
	try {
		const parsed = new URL(endpoint);
		return parsed.protocol === 'ws:' || parsed.protocol === 'wss:' ? parsed : null;
	} catch {
		return null;
	}
}

function hasUrlCredentials(parsed: URL): boolean {
	if (parsed.username || parsed.password) {
		return true;
	}

	for (const key of parsed.searchParams.keys()) {
		const normalized = key.toLowerCase();
		if (
			normalized === 'auth' ||
			normalized.includes('authorization') ||
			normalized.includes('token')
		) {
			return true;
		}
	}

	return false;
}

/**
 * Create Apollo Client with Lesser-specific configuration
 */
export function createGraphQLClient(config: GraphQLClientConfig): GraphQLClientInstance {
	const {
		httpEndpoint,
		wsEndpoint: configWsEndpoint,
		token,
		debug = false,
		headers = {},
		connectionTimeout = 10000,
		enableRetry = true,
		maxRetries = 3,
		onTokenRefresh,
		onAuthExpired,
	} = config;

	let currentToken = token || null;
	const refreshAccessToken = createSingleFlightRefresh(onTokenRefresh);
	/** The in-flight refresh-and-re-dial, shared by every expiring operation. */
	let authRedial: Promise<void> | null = null;
	/**
	 * Which credential is in force, and which generation has spent its recovery.
	 *
	 * Every `TOKEN_EXPIRED` this client acts on is arbitrated here: the refusals
	 * of one credential are one episode, however many operations report them and
	 * whichever link sees them first. At most one refresh per generation, ever.
	 */
	const generations = createCredentialGenerations();
	/**
	 * The credential generation each operation was issued under.
	 *
	 * Recorded once, as the operation enters the chain, and never rewritten: it
	 * answers "which credential was this asking with", which is what tells a
	 * first refusal of the credential in force apart from the tail of an episode
	 * that has already refreshed. Held weakly, keyed on the operation Apollo
	 * threads through the links, so nothing is retained past the request.
	 */
	const operationGenerations = new WeakMap<ApolloLink.Operation, number>();

	/**
	 * The generation `operation` was issued under, defaulting to the credential
	 * in force when the operation never passed the stamping link.
	 */
	const issuedGeneration = (operation: ApolloLink.Operation | undefined): number => {
		const stamped = operation ? operationGenerations.get(operation) : undefined;
		return stamped ?? generations.current();
	};

	const logDebug = (message: string, context?: unknown): void => {
		if (!debug) {
			return;
		}
		const output = globalThis.console;
		if (!output?.warn) {
			return;
		}
		if (context !== undefined) {
			output.warn(message, context);
		} else {
			output.warn(message);
		}
	};

	const logDebugError = (message: string, context?: unknown): void => {
		if (!debug) {
			return;
		}
		const output = globalThis.console;
		if (!output?.error) {
			return;
		}
		if (context !== undefined) {
			output.error(message, context);
		} else {
			output.error(message);
		}
	};

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
	// CRITICAL: Only create WebSocket code if wsEndpoint is explicitly provided
	// NO FALLBACKS - if wsEndpoint is missing/invalid, skip WebSocket entirely
	let wsClient: Client | null = null;
	let wsLink: GraphQLWsLink | null = null;
	let baseWsEndpoint: string | null = null; // Store original endpoint without token for token updates

	if (configWsEndpoint) {
		// Validate wsEndpoint
		if (typeof configWsEndpoint !== 'string') {
			logDebugError(
				`[GraphQL] Invalid wsEndpoint type: ${typeof configWsEndpoint}. Skipping WebSocket.`
			);
		} else if (configWsEndpoint.trim() === '') {
			logDebugError('[GraphQL] wsEndpoint is empty. Skipping WebSocket.');
		} else {
			const wsEndpoint = configWsEndpoint.trim();
			const parsedWsEndpoint = parseWebSocketEndpoint(wsEndpoint);

			// Validate wsEndpoint is a valid WebSocket URL
			if (!parsedWsEndpoint) {
				logDebugError(
					"[GraphQL] wsEndpoint must be a valid 'ws://' or 'wss://' URL. Skipping WebSocket."
				);
			} else if (hasUrlCredentials(parsedWsEndpoint)) {
				logDebugError(
					'[GraphQL] wsEndpoint must not include credentials or authentication query parameters. Skipping WebSocket.'
				);
			} else {
				// Ensure wsEndpoint is NOT derived from httpEndpoint - skip if it appears to be
				const derivedFromHttp =
					wsEndpoint === httpEndpoint ||
					wsEndpoint === httpEndpoint.replace('https://', 'wss://') ||
					wsEndpoint === httpEndpoint.replace('http://', 'ws://') ||
					wsEndpoint === httpEndpoint.replace(/^https?:\/\//, 'wss://');

				if (derivedFromHttp) {
					logDebugError(
						`[GraphQL] wsEndpoint appears to be derived from httpEndpoint! ` +
							'Skipping WebSocket - wsEndpoint must be explicitly provided.'
					);
				} else {
					// wsEndpoint is valid - create WebSocket client
					// Store the base endpoint (without token) for token updates
					baseWsEndpoint = wsEndpoint;

					// IMPORTANT: do not initialize WebSocket transport until a token is available
					if (!currentToken) {
						throw new Error(
							'[GraphQL] Cannot initialize WebSocket subscriptions without an authentication token.'
						);
					}

					logDebug('[GraphQL] Creating WebSocket client with explicit endpoint');

					wsClient = createClient({
						url: wsEndpoint, // This is the ONLY URL that will be used - no fallbacks
						connectionParams: () => {
							const params: Record<string, string> = {};
							if (currentToken) {
								params['authorization'] = `Bearer ${currentToken}`;
							}
							return params;
						},
						retryAttempts: maxRetries,
						shouldRetry: () => enableRetry,
						connectionAckWaitTimeout: connectionTimeout,
						on: {
							connecting: () => {
								logDebug('[GraphQL] WebSocket connecting to explicit endpoint');
							},
							connected: () => {
								logDebug('[GraphQL] WebSocket connected to explicit endpoint');
							},
							closed: () => {
								logDebug('[GraphQL] WebSocket closed');
							},
							error: (error) => {
								logDebugError(
									'[GraphQL] WebSocket error while connecting to explicit endpoint',
									error
								);
							},
						},
					});

					wsLink = new GraphQLWsLink(wsClient);
					logDebug('[GraphQL] GraphQLWsLink created for explicit WebSocket endpoint');
				}
			}
		}
	} else {
		logDebug(
			'[GraphQL] No wsEndpoint provided - WebSocket will NOT be used. Subscriptions will not work.'
		);
	}

	/**
	 * Reports terminal credential expiry to the app.
	 *
	 * Expiry is never swallowed: with no way to recover the credential, the app
	 * is told explicitly so it can prompt for re-authentication instead of
	 * watching subscriptions fail silently.
	 */
	const failAuthExpiryTerminally = (error: AuthExpiredError): void => {
		logDebugError(`[GraphQL] Credential expired (${error.reason}); re-authentication required`);
		try {
			onAuthExpired?.(error);
		} catch (handlerError) {
			logDebugError('[GraphQL] onAuthExpired handler threw', handlerError);
		}
	};

	/**
	 * Refreshes the credential and re-dials the existing WebSocket, resolving
	 * once the socket is ready to carry a fresh `subscribe`.
	 *
	 * `terminate()` is used rather than `dispose()` + `createClient()` on
	 * purpose. The graphql-ws client owns the active subscriptions, so tearing
	 * it down would strand them; terminating drops the socket and lets the same
	 * client reconnect, re-evaluate `connectionParams` with the fresh token,
	 * and re-establish its operations. It also keeps a single socket lifecycle,
	 * so exactly one `connection_init` is sent — Lesser closes a duplicate init
	 * with code 4429.
	 *
	 * Concurrent `TOKEN_EXPIRED` frames (one per in-flight subscription)
	 * collapse into a single refresh and a single re-dial: every caller awaits
	 * the same promise, so every re-issue happens after the same handoff.
	 *
	 * `generation` is the credential the caller was refused on. Returns `null`
	 * when that credential's one recovery is already spent and settled — the
	 * caller must then fail loudly rather than open a second cycle.
	 */
	const refreshAndRedial = (generation: number): Promise<void> | null => {
		// Each in-flight subscription reports its own expiry frame. Latch here
		// so those collapse into a single re-dial, not one per frame.
		if (authRedial) {
			return authRedial;
		}
		// One refresh per credential, ever. Everything else that Lesser refuses
		// on this credential rides the recovery that is already running or has
		// already happened.
		if (!generations.claimRefresh(generation)) {
			return null;
		}

		/**
		 * Whether the credential this refresh was started for is still the one in
		 * force.
		 *
		 * A refresh is an answer to a question about a specific credential, and it
		 * is only installed while that question is still the one being asked.
		 * `updateToken()` puts an app-supplied credential in force and advances the
		 * clock, so a refresh claimed under `generation` that resolves afterwards is
		 * answering for a principal the app has already moved off — during an
		 * account switch, literally a different one.
		 *
		 * Hence a compare-and-swap rather than an unconditional install: the whole
		 * result is discarded when the clock has moved. It sets no token, advances
		 * nothing, and terminates no socket — the socket by then belongs to the new
		 * credential, and terminating it would re-dial the app's replacement with a
		 * credential fetched before it. After `updateToken()`, nothing obtained
		 * before it is ever re-applied.
		 */
		const superseded = (): boolean => generations.current() !== generation;

		const attempt = refreshAccessToken().then(
			(freshToken) => {
				if (superseded()) {
					// The episode still ends, and ends successfully: the operations
					// waiting on it re-issue under the credential the app put in force
					// rather than opening a second cycle for a credential that is gone.
					logDebug(
						'[GraphQL] Credential refresh superseded by an app-supplied credential; discarding its result'
					);
					return;
				}

				currentToken = freshToken;
				// The fresh credential is in force from here: later frames are issued
				// under the next generation, and refusals still arriving for the last
				// one are the tail of this episode, not the start of another.
				generations.advance();
				logDebug('[GraphQL] Credential refreshed; re-dialing WebSocket to resubscribe');

				const terminate = (wsClient as { terminate?: () => void } | null)?.terminate;
				if (typeof terminate === 'function') {
					terminate.call(wsClient);
				}
			},
			(error: unknown) => {
				if (superseded()) {
					// The app replaced the credential while this refresh was in flight,
					// so failing to renew the old one is moot — there is nothing left to
					// re-authenticate. Reporting terminal expiry here would tell an app
					// that has just signed in that its session is gone.
					logDebug(
						'[GraphQL] Credential refresh failed after the app supplied a new credential; ending the episode as superseded'
					);
					return;
				}

				const authError =
					error instanceof AuthExpiredError
						? error
						: new AuthExpiredError('refresh-failed', { cause: error });
				failAuthExpiryTerminally(authError);
				throw authError;
			}
		);

		authRedial = attempt;
		// Release the latch once settled so a later expiry can refresh again,
		// without a rejected refresh poisoning subsequent attempts.
		void attempt
			.catch(() => undefined)
			.finally(() => {
				if (authRedial === attempt) {
					authRedial = null;
				}
			});

		return attempt;
	};

	/** Fire-and-forget re-dial for callers with no operation to re-issue. */
	const handleAuthExpired = (generation: number): void => {
		void refreshAndRedial(generation)?.catch(() => undefined);
	};

	/**
	 * Resolves once the socket carrying the credential in force is ready for a
	 * fresh subscribe: immediately when the re-dial has already happened, or with
	 * the episode in flight when one is still running.
	 */
	const currentSocketReady = (): Promise<void> => authRedial ?? Promise.resolve();

	/**
	 * Re-issues a subscription that Lesser refused for an expired credential.
	 *
	 * graphql-ws completes an operation the moment the server sends an Error
	 * frame for it: the sink is errored, the operation is released, and the
	 * reconnect that `terminate()` triggers re-establishes every subscription
	 * *except* the one that just failed. Refreshing alone therefore leaves the
	 * caller with a dead subscription and a healthy socket.
	 *
	 * So this link sits directly in front of the WebSocket link, below
	 * `RetryLink`, and closes that gap: it catches the expiry on the operation's
	 * own error path, waits for the shared refresh-and-re-dial, and subscribes
	 * again. Because the re-issue happens beneath `RetryLink`, it costs nothing
	 * from the retry budget — an expired credential is not a transport fault,
	 * and consuming a network retry for it would starve the genuine ones.
	 *
	 * Recovery is bounded by the credential, not by the error: exactly one
	 * refresh per generation and one re-issue per operation per generation. A
	 * second refusal of the credential in force is a server the client cannot
	 * satisfy, so it propagates loudly rather than looping; a refusal of a
	 * credential that has already been replaced is the tail of the episode that
	 * replaced it, so it is re-issued on the current socket and never refreshed
	 * for again. The second case is the one graphql-ws creates on its own: it
	 * restores the operations that were still active when the socket dropped,
	 * and Lesser can refuse one of those once on the fresh socket before the
	 * connection row self-heals. Refreshing for that would terminate a socket
	 * that is already carrying a fresh credential and take every healthy
	 * subscription with it.
	 */
	const authExpiryReissueLink = new ApolloLink((operation, forward) => {
		return new Observable<ApolloLink.Result>((observer) => {
			let inner: { unsubscribe: () => void } | null = null;
			let unsubscribed = false;
			/** The credential generation this attempt's subscribe was issued under. */
			let attemptGeneration = generations.current();
			/** The generation this operation has already spent its re-issue on. */
			let reissuedUnder: number | null = null;

			const attempt = (): void => {
				attemptGeneration = generations.current();
				inner = forward(operation).subscribe({
					next: (value) => observer.next(value),
					complete: () => observer.complete(),
					error: (error: unknown) => {
						if (unsubscribed) {
							return;
						}
						if (!hasServerErrorCode(error, AUTH_EXPIRED_CODE)) {
							observer.error(error);
							return;
						}

						const generation = generations.current();

						if (reissuedUnder === generation) {
							// Already re-issued on the credential in force, and refused
							// again. Loud to the caller, and never a second refresh for a
							// credential the server has just rejected on its own terms.
							logDebugError(
								'[GraphQL] Subscription expired again on the refreshed credential; not refreshing twice'
							);
							observer.error(error);
							return;
						}

						if (attemptGeneration < generation) {
							// Refused on a credential that has since been replaced — the
							// episode that replaced it is this operation's recovery. Take
							// the fresh socket rather than opening a second cycle on it.
							logDebug(
								'[GraphQL] Subscription expired under a superseded credential; re-issuing on the current socket'
							);
							reissueWhenReady(currentSocketReady());
							return;
						}

						const recovery = refreshAndRedial(generation);
						if (!recovery) {
							// This credential's one recovery is spent and settled: it was
							// driven and the server is still refusing, or refreshing it
							// failed and the app has already been told to re-authenticate.
							logDebugError(
								'[GraphQL] Subscription expired on a credential whose refresh is already spent'
							);
							observer.error(error);
							return;
						}

						logDebug('[GraphQL] Subscription expired; re-issuing after credential refresh');
						reissueWhenReady(recovery);
					},
				});
			};

			/** Re-issues this operation once `ready` hands over a usable socket. */
			const reissueWhenReady = (ready: Promise<void>): void => {
				void ready.then(
					() => {
						if (unsubscribed) {
							return;
						}
						reissuedUnder = generations.current();
						attempt();
					},
					(refreshError: unknown) => {
						if (!unsubscribed) {
							// Terminal expiry was already reported through onAuthExpired;
							// the caller still gets it, rather than a subscription that
							// quietly stopped delivering.
							observer.error(refreshError);
						}
					}
				);
			};

			attempt();

			return () => {
				unsubscribed = true;
				inner?.unsubscribe();
			};
		});
	});

	/**
	 * Routes subscriptions through the re-issue link before the WebSocket link,
	 * leaving queries and mutations on HTTP untouched.
	 */
	const buildSplitLink = (subscriptionLink: GraphQLWsLink, requestLink: HttpLink): ApolloLink =>
		split(
			({ query }) => {
				const definition = getMainDefinition(query);
				return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
			},
			from([authExpiryReissueLink, subscriptionLink]),
			requestLink
		);

	/**
	 * Records the credential generation each operation is issued under.
	 *
	 * It sits at the top of the chain so every path is stamped — subscriptions,
	 * queries and mutations alike — and it stamps once, on the way down, so the
	 * mark stays with the credential the caller actually asked with.
	 */
	const credentialGenerationLink = new ApolloLink((operation, forward) => {
		operationGenerations.set(operation, generations.current());
		return forward(operation);
	});

	// Error handling link
	const errorLink = onError(({ error, operation }) => {
		// Which credential this operation was asking with. The re-issue link owns
		// recovery for the subscriptions it forwards; a failure that reaches here
		// has either already been recovered below or belongs to a path the
		// re-issue link cannot see. Asking the credential clock answers both:
		// a first refusal of the credential in force still gets its one refresh,
		// while a refusal carrying a credential that has since been replaced —
		// including one the re-issue link gave up on and propagated — is the tail
		// of an episode that already refreshed and re-dialed once. Recovering it
		// again would cost a second `terminate()` and every healthy subscription
		// with it.
		const generation = issuedGeneration(operation);

		if (CombinedGraphQLErrors.is(error)) {
			error.errors.forEach(({ message, locations, path, extensions }) => {
				const errorMsg = `[GraphQL Error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`;
				logDebugError(errorMsg);

				// Handle authentication errors
				const extensionCode =
					extensions && typeof extensions === 'object'
						? (extensions as Record<string, unknown>)['code']
						: undefined;
				if (extensionCode === 'UNAUTHENTICATED') {
					logDebugError('[GraphQL] Authentication error');
					// Clear token on auth failure
					currentToken = null;
				}
				// Lesser v1.5.33 re-checks expiry per subscribe operation.
				// Refresh and reconnect once; legacy rows without persisted
				// expiry fail closed exactly once and self-heal on reconnect.
				if (extensionCode === AUTH_EXPIRED_CODE) {
					handleAuthExpired(generation);
				}
			});
			return;
		}

		// graphql-ws Error frames do not always reach the link as
		// `CombinedGraphQLErrors` — a subscription can surface the raw
		// GraphQLError list instead. Check that shape too so a subscribe-time
		// expiry is never missed.
		if (hasServerErrorCode(error, AUTH_EXPIRED_CODE)) {
			handleAuthExpired(generation);
			return;
		}

		logDebugError(`[GraphQL Network Error]: ${error.message}`);
	});

	// Retry link for network errors
	const retryLink = new RetryLink({
		attempts: {
			max: enableRetry ? maxRetries : 0,
			retryIf: (error) => {
				// Retry on network errors but not on GraphQL errors
				return Boolean(error) && !CombinedGraphQLErrors.is(error);
			},
		},
		delay: {
			initial: 300,
			max: 3000,
			jitter: true,
		},
	});

	// Split link: WebSocket for subscriptions (if available), HTTP for queries/mutations
	// If wsLink is null, all operations go through HTTP (subscriptions will fail)
	const splitLink = wsLink ? buildSplitLink(wsLink, httpLink) : httpLink; // No WebSocket - route everything through HTTP

	// Combine all links
	const link = from([credentialGenerationLink, errorLink, retryLink, splitLink]);

	// Default options for all operations
	const defaultOptions: ApolloClient.DefaultOptions.Input = {
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
		devtools: {
			enabled: debug,
		},
	});

	// Function to update authentication token
	const updateToken = (newToken: string | null) => {
		currentToken = newToken;
		// A credential supplied by the app is a new generation just as much as a
		// refreshed one: operations issued from here are asking with it, and it
		// arms a fresh refresh claim for the expiry episodes it may still meet.
		//
		// Advancing here is also what makes the app's credential final. A refresh
		// already in flight claimed the generation this call supersedes, so its
		// result no longer installs (see `refreshAndRedial`). An account switch is
		// the case that matters: the credential the app just put in force must be
		// the one every later request carries.
		generations.advance();

		// Update HTTP link headers
		const newHttpLink = new HttpLink({
			uri: httpEndpoint,
			headers: {
				...headers,
				...(currentToken && { authorization: `Bearer ${currentToken}` }),
			},
			fetch,
		});

		// If token has been cleared, disable WebSocket and fall back to HTTP only
		if (!currentToken) {
			if (wsClient) {
				wsClient.dispose();
			}
			wsClient = null;
			wsLink = null;

			const newLink = from([credentialGenerationLink, errorLink, retryLink, newHttpLink]);
			client.setLink(newLink);
			logDebug('[GraphQL] Token cleared, WebSocket disabled until token is restored');

			void client.clearStore();
			return;
		}

		// Only reconnect WebSocket if it exists
		if (wsClient && baseWsEndpoint) {
			wsClient.dispose();

			logDebug('[GraphQL] Rebuilding WebSocket transport for updated token');

			const newWsClient = createClient({
				url: baseWsEndpoint,
				connectionParams: () => ({
					...(currentToken && { authorization: `Bearer ${currentToken}` }),
				}),
				retryAttempts: maxRetries,
				shouldRetry: () => enableRetry,
				connectionAckWaitTimeout: connectionTimeout,
				on: {
					connected: () => {
						logDebug('[GraphQL] WebSocket reconnected to explicit endpoint');
					},
					closed: () => {
						logDebug('[GraphQL] WebSocket closed after token update');
					},
					error: (error) => {
						logDebugError(
							'[GraphQL] WebSocket error after token update while connecting to explicit endpoint',
							error
						);
					},
				},
			});

			wsClient = newWsClient;

			// Update the wsLink with new client
			const newWsLink = new GraphQLWsLink(wsClient);
			logDebug('[GraphQL] Recreated wsLink with explicit WebSocket endpoint');

			// Recreate split link with new WebSocket link
			const newSplitLink = buildSplitLink(newWsLink, newHttpLink);

			// Recreate combined link
			const newLink = from([credentialGenerationLink, errorLink, retryLink, newSplitLink]);

			// Update Apollo Client link
			client.setLink(newLink);

			logDebug('[GraphQL] Token updated, cache cleared, WebSocket reconnected');
		} else {
			// No WebSocket - just update HTTP link
			const newLink = from([credentialGenerationLink, errorLink, retryLink, newHttpLink]);
			client.setLink(newLink);
			logDebug('[GraphQL] Token updated, cache cleared (no WebSocket to reconnect)');
		}

		// Clear cache on token change
		void client.clearStore();
	};

	// Cleanup function
	const close = () => {
		if (wsClient) {
			wsClient.dispose();
		}
		client.stop();
		logDebug('[GraphQL] Client closed');
	};

	return {
		client,
		wsClient, // null if wsEndpoint not provided
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

	if (!clientInstance) {
		throw new Error('GraphQL client not initialized.');
	}

	return clientInstance;
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
