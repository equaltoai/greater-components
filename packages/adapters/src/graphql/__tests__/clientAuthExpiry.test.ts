import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Lesser v1.5.33 answers a subscribe operation carrying an expired credential
 * with a graphql-ws Error frame whose `extensions.code` is `TOKEN_EXPIRED`
 * (cmd/graphql-ws/main.go `sendOperationCredentialExpiredError`).
 *
 * These tests pin the client's response: refresh once, re-dial the *existing*
 * graphql-ws client so it re-authenticates and re-establishes its subscriptions,
 * and never open a second socket — Lesser closes a duplicate `connection_init`
 * with code 4429.
 */

const wsClients: Array<{
	connectionParams: () => Record<string, string>;
	terminate: ReturnType<typeof vi.fn>;
	dispose: ReturnType<typeof vi.fn>;
}> = [];

let capturedErrorHandler: ((input: { error: unknown }) => void) | null = null;

vi.mock('graphql-ws', () => ({
	createClient: vi.fn((options: { connectionParams: () => Record<string, string> }) => {
		const client = {
			connectionParams: options.connectionParams,
			terminate: vi.fn(),
			dispose: vi.fn(),
		};
		wsClients.push(client);
		return client;
	}),
}));

vi.mock('@apollo/client/link/error/index.js', () => ({
	onError: vi.fn((handler: (input: { error: unknown }) => void) => {
		capturedErrorHandler = handler;
		return { __link: 'error' };
	}),
}));

// Constructor mocks must be `function` expressions: an arrow function cannot
// be invoked with `new`.
vi.mock('@apollo/client', () => ({
	ApolloClient: vi.fn(function () {
		return {
			setLink: vi.fn(),
			clearStore: vi.fn().mockResolvedValue(undefined),
			stop: vi.fn(),
		};
	}),
	InMemoryCache: vi.fn(function () {
		return {};
	}),
	HttpLink: vi.fn(function () {
		return { __link: 'http' };
	}),
	split: vi.fn(() => ({ __link: 'split' })),
	from: vi.fn((links: unknown[]) => ({ __link: 'from', links })),
}));

vi.mock('@apollo/client/link/subscriptions/index.js', () => ({
	GraphQLWsLink: vi.fn(function () {
		return { __link: 'ws' };
	}),
}));

vi.mock('@apollo/client/utilities/index.js', () => ({
	getMainDefinition: vi.fn(() => ({ kind: 'OperationDefinition', operation: 'query' })),
}));

vi.mock('@apollo/client/link/retry/index.js', () => ({
	RetryLink: vi.fn(function () {
		return { __link: 'retry' };
	}),
}));

vi.mock('@apollo/client/errors/index.js', () => ({
	CombinedGraphQLErrors: {
		is: (error: unknown) =>
			Boolean(error && typeof error === 'object' && Array.isArray((error as { errors?: unknown }).errors)),
	},
}));

vi.mock('../cache.js', () => ({ cacheConfig: {}, typePolicies: {} }));

const { createGraphQLClient } = await import('../client');
const { AuthExpiredError, AUTH_EXPIRED_CODE } = await import('../../authExpiry');

/** A `CombinedGraphQLErrors`-shaped expiry signal, as the link receives it. */
const expiredCombined = {
	errors: [
		{
			message: 'credential expired; re-authentication required',
			extensions: { code: AUTH_EXPIRED_CODE },
		},
	],
};

/** The same signal arriving as a bare graphql-ws Error frame. */
const expiredRawFrame = {
	message: 'subscription failed',
	payload: [{ message: 'credential expired', extensions: { code: AUTH_EXPIRED_CODE } }],
};

async function flush(times = 4): Promise<void> {
	for (let i = 0; i < times; i += 1) {
		await Promise.resolve();
	}
}

function build(overrides: Record<string, unknown> = {}) {
	return createGraphQLClient({
		httpEndpoint: 'https://lesser.example/graphql',
		wsEndpoint: 'wss://lesser.example/subscriptions',
		token: 'expired-token',
		...overrides,
	});
}

function signal(error: unknown): void {
	if (!capturedErrorHandler) {
		throw new Error('error link handler was not captured');
	}
	capturedErrorHandler({ error });
}

describe('createGraphQLClient credential expiry (Lesser v1.5.33)', () => {
	beforeEach(() => {
		wsClients.length = 0;
		capturedErrorHandler = null;
		vi.clearAllMocks();
	});

	it('refreshes once and re-dials the same client so subscriptions resume', async () => {
		const onTokenRefresh = vi.fn().mockResolvedValue('fresh-token');
		build({ onTokenRefresh });

		expect(wsClients).toHaveLength(1);
		expect(wsClients[0]?.connectionParams()).toEqual({ authorization: 'Bearer expired-token' });

		signal(expiredCombined);
		await flush();

		expect(onTokenRefresh).toHaveBeenCalledTimes(1);
		// Same client re-dialed, not disposed and rebuilt: it owns the active
		// subscriptions and re-establishes them on reconnect.
		expect(wsClients).toHaveLength(1);
		expect(wsClients[0]?.terminate).toHaveBeenCalledTimes(1);
		expect(wsClients[0]?.dispose).not.toHaveBeenCalled();

		// The reconnect presents the refreshed credential.
		expect(wsClients[0]?.connectionParams()).toEqual({ authorization: 'Bearer fresh-token' });
	});

	it('collapses concurrent expiry frames into one refresh and one re-dial', async () => {
		const onTokenRefresh = vi.fn().mockResolvedValue('fresh-token');
		build({ onTokenRefresh });

		signal(expiredCombined);
		signal(expiredCombined);
		signal(expiredCombined);
		await flush();

		expect(onTokenRefresh).toHaveBeenCalledTimes(1);
		expect(wsClients[0]?.terminate).toHaveBeenCalledTimes(1);
	});

	it('detects expiry on a bare graphql-ws Error frame too', async () => {
		const onTokenRefresh = vi.fn().mockResolvedValue('fresh-token');
		build({ onTokenRefresh });

		signal(expiredRawFrame);
		await flush();

		expect(onTokenRefresh).toHaveBeenCalledTimes(1);
		expect(wsClients[0]?.terminate).toHaveBeenCalledTimes(1);
	});

	it('is loud and terminal with no refresh callback, and does not re-dial', async () => {
		const onAuthExpired = vi.fn();
		build({ onAuthExpired });

		signal(expiredCombined);
		await flush();

		expect(onAuthExpired).toHaveBeenCalledTimes(1);
		const error = onAuthExpired.mock.calls[0]?.[0] as InstanceType<typeof AuthExpiredError>;
		expect(error).toBeInstanceOf(AuthExpiredError);
		expect(error.code).toBe(AUTH_EXPIRED_CODE);
		expect(error.reason).toBe('no-refresh-callback');

		// No silent churn: the stale credential is not re-presented.
		expect(wsClients[0]?.terminate).not.toHaveBeenCalled();
		expect(wsClients[0]?.connectionParams()).toEqual({ authorization: 'Bearer expired-token' });
	});

	it('reports a failed or empty refresh as terminal rather than reconnecting', async () => {
		for (const [onTokenRefresh, reason] of [
			[vi.fn().mockRejectedValue(new Error('offline')), 'refresh-failed'],
			[vi.fn().mockResolvedValue(''), 'refresh-empty'],
		] as const) {
			wsClients.length = 0;
			const onAuthExpired = vi.fn();
			build({ onTokenRefresh, onAuthExpired });

			signal(expiredCombined);
			await flush(8);

			expect(onAuthExpired).toHaveBeenCalledTimes(1);
			expect((onAuthExpired.mock.calls[0]?.[0] as { reason: string }).reason).toBe(reason);
			expect(wsClients[0]?.terminate).not.toHaveBeenCalled();
		}
	});

	it('leaves UNAUTHENTICATED handling unchanged', async () => {
		const onTokenRefresh = vi.fn();
		const onAuthExpired = vi.fn();
		build({ onTokenRefresh, onAuthExpired });

		signal({ errors: [{ message: 'nope', extensions: { code: 'UNAUTHENTICATED' } }] });
		await flush();

		expect(onTokenRefresh).not.toHaveBeenCalled();
		expect(onAuthExpired).not.toHaveBeenCalled();
		expect(wsClients[0]?.terminate).not.toHaveBeenCalled();
	});
});
