import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parse } from 'graphql';

/**
 * Subscribe-time credential expiry, end to end through the real Apollo link
 * chain — only `graphql-ws` is faked.
 *
 * The behaviour under test is a property of the *installed* graphql-ws (6.0.8),
 * not an assumption about it. Its client handles an Error frame as:
 *
 * ```js
 * case MessageType.Error: {
 *   errored = true, done = true;
 *   sink.error(message.payload);
 *   releaser();
 *   return;
 * }
 * ```
 *
 * The operation is finished the instant Lesser answers `TOKEN_EXPIRED`
 * (cmd/graphql-ws/main.go `sendOperationCredentialExpiredError`). Refreshing
 * the credential and re-dialing therefore restores every subscription except
 * the one that just failed — the caller is left holding a dead subscription on
 * a healthy socket. These tests pin the close of that gap: the operation is
 * re-issued as a fresh subscribe, and it delivers.
 *
 * The fake is deliberately thin: it records the credential
 * `connectionParams()` yields at each subscribe, which is what a re-dial would
 * present, and scripts one outcome per subscribe.
 */

interface Sink {
	next(value: unknown): void;
	error(error: unknown): void;
	complete(): void;
}

type ScriptStep = (sink: Sink) => void;

class FakeWsClient {
	readonly subscribeCalls: Array<{ credential: string | undefined; at: number }> = [];
	readonly events: string[] = [];
	script: ScriptStep[] = [];

	constructor(private readonly connectionParams: () => Record<string, string>) {}

	subscribe(_payload: unknown, sink: Sink): () => void {
		const index = this.subscribeCalls.length;
		this.subscribeCalls.push({
			credential: this.connectionParams()['authorization'],
			at: this.events.push('subscribe') - 1,
		});
		const step = this.script[index];
		// A socket answers asynchronously; resolving in a microtask keeps the
		// re-issue path honest about ordering.
		queueMicrotask(() => step?.(sink));
		return () => undefined;
	}

	terminate(): void {
		this.events.push('terminate');
	}

	dispose(): void {
		this.events.push('dispose');
	}
}

const fakeClients: FakeWsClient[] = [];

vi.mock('graphql-ws', () => ({
	createClient: vi.fn((options: { connectionParams: () => Record<string, string> }) => {
		const client = new FakeWsClient(options.connectionParams);
		fakeClients.push(client);
		return client;
	}),
}));

const { createGraphQLClient } = await import('../client');
const { AUTH_EXPIRED_CODE, AuthExpiredError } = await import('../../authExpiry');

const NOTE_ADDED = parse(`
	subscription NoteAdded {
		noteAdded {
			id
			content
		}
	}
`);

/** The GraphQLError list graphql-ws hands to `sink.error` for an Error frame. */
const expiredFrame = [
	{
		message: 'credential expired; re-authentication required',
		extensions: { code: AUTH_EXPIRED_CODE },
	},
];

const otherFailureFrame = [
	{ message: 'note stream unavailable', extensions: { code: 'INTERNAL_SERVER_ERROR' } },
];

function payload(id: string, content: string) {
	return { data: { noteAdded: { __typename: 'Note', id, content } } };
}

function build(overrides: Record<string, unknown> = {}) {
	return createGraphQLClient({
		httpEndpoint: 'https://lesser.example/graphql',
		wsEndpoint: 'wss://lesser.example/subscriptions',
		token: 'expired-token',
		// A zero retry budget: anything that survives here cannot be leaning on
		// RetryLink or on graphql-ws reconnect attempts.
		maxRetries: 0,
		...overrides,
	});
}

/**
 * Collects what one subscription emits, split the way Apollo Client 4 actually
 * reports it: a link failure arrives as `next({ data: undefined, error })`
 * rather than through the observer's `error` channel, so a test that only
 * watched `error` would read a failure as silence.
 */
function observe(subscription: { subscribe: (observer: unknown) => { unsubscribe(): void } }): {
	deliveries: unknown[];
	failures: unknown[];
	handle: { unsubscribe(): void };
} {
	const deliveries: unknown[] = [];
	const failures: unknown[] = [];
	const handle = subscription.subscribe({
		next: (value: unknown) => {
			const emitted = value as { data?: unknown; error?: unknown };
			if (emitted?.error) {
				failures.push(emitted.error);
			} else {
				deliveries.push(value);
			}
		},
		error: (error: unknown) => failures.push(error),
		complete: () => undefined,
	});
	return { deliveries, failures, handle };
}

/** The fake graphql-ws client the instance under construction just created. */
function latestWsClient(): FakeWsClient {
	const client = fakeClients.at(-1);
	if (!client) {
		throw new Error('no graphql-ws client was created');
	}
	return client;
}

async function settle(times = 12): Promise<void> {
	for (let i = 0; i < times; i += 1) {
		await Promise.resolve();
	}
}

describe('subscribe-time credential expiry through the real link chain', () => {
	beforeEach(() => {
		fakeClients.length = 0;
	});

	it('refreshes, re-dials, and re-issues the operation so it delivers data', async () => {
		const onTokenRefresh = vi.fn().mockResolvedValue('fresh-token');
		const instance = build({ onTokenRefresh });
		const ws = latestWsClient();
		ws.script = [(sink) => sink.error(expiredFrame), (sink) => sink.next(payload('1', 'hello'))];

		const { deliveries, failures } = observe(instance.client.subscribe({ query: NOTE_ADDED }));
		await settle();

		// The operation that Lesser refused is the one that delivers.
		expect(failures).toEqual([]);
		expect(deliveries).toHaveLength(1);
		expect(deliveries[0]).toMatchObject({ data: { noteAdded: { id: '1', content: 'hello' } } });

		expect(onTokenRefresh).toHaveBeenCalledTimes(1);
		expect(ws.subscribeCalls).toHaveLength(2);
		expect(ws.subscribeCalls[0]?.credential).toBe('Bearer expired-token');
		expect(ws.subscribeCalls[1]?.credential).toBe('Bearer fresh-token');

		// Re-dial before re-issue: the fresh subscribe must not ride the socket
		// that was already refused.
		expect(ws.events).toEqual(['subscribe', 'terminate', 'subscribe']);

		instance.close();
	});

	it('re-issues outside the retry budget', async () => {
		// `maxRetries: 0` leaves RetryLink with no attempts and graphql-ws with
		// no reconnect attempts, so a re-issue that consumed either would fail.
		const instance = build({ onTokenRefresh: () => 'fresh-token', maxRetries: 0 });
		const ws = latestWsClient();
		ws.script = [(sink) => sink.error(expiredFrame), (sink) => sink.next(payload('2', 'budget'))];

		const { deliveries, failures } = observe(instance.client.subscribe({ query: NOTE_ADDED }));
		await settle();

		expect(failures).toEqual([]);
		expect(deliveries).toHaveLength(1);

		instance.close();
	});

	it('keeps existing semantics for a non-auth failure', async () => {
		const onTokenRefresh = vi.fn().mockResolvedValue('fresh-token');
		const instance = build({ onTokenRefresh });
		const ws = latestWsClient();
		ws.script = [(sink) => sink.error(otherFailureFrame)];

		const { deliveries, failures } = observe(instance.client.subscribe({ query: NOTE_ADDED }));
		await settle();

		expect(deliveries).toEqual([]);
		expect(failures).toHaveLength(1);
		expect(onTokenRefresh).not.toHaveBeenCalled();
		expect(ws.events).toEqual(['subscribe']);

		instance.close();
	});

	it('re-issues once — a second expiry on the refreshed credential propagates', async () => {
		const onTokenRefresh = vi.fn().mockResolvedValue('fresh-token');
		const instance = build({ onTokenRefresh });
		const ws = latestWsClient();
		ws.script = [(sink) => sink.error(expiredFrame), (sink) => sink.error(expiredFrame)];

		const { deliveries, failures } = observe(instance.client.subscribe({ query: NOTE_ADDED }));
		await settle();

		expect(deliveries).toEqual([]);
		expect(failures).toHaveLength(1);
		// Exactly two attempts: the original and one re-issue. No loop.
		expect(ws.subscribeCalls).toHaveLength(2);

		instance.close();
	});

	it('reports terminal expiry and errors the operation when the refresh fails', async () => {
		const onAuthExpired = vi.fn();
		const instance = build({
			onTokenRefresh: vi.fn().mockRejectedValue(new Error('refresh endpoint down')),
			onAuthExpired,
		});
		const ws = latestWsClient();
		ws.script = [(sink) => sink.error(expiredFrame)];

		const { deliveries, failures } = observe(instance.client.subscribe({ query: NOTE_ADDED }));
		await settle();

		expect(deliveries).toEqual([]);
		expect(failures).toHaveLength(1);
		expect(onAuthExpired).toHaveBeenCalledTimes(1);
		expect(onAuthExpired.mock.calls[0]?.[0]).toBeInstanceOf(AuthExpiredError);
		expect((onAuthExpired.mock.calls[0]?.[0] as AuthExpiredError).reason).toBe('refresh-failed');
		// Nothing was re-dialed on a credential that could not be replaced.
		expect(ws.events).toEqual(['subscribe']);

		instance.close();
	});

	it('is terminal, not silent, when no refresh callback is configured', async () => {
		const onAuthExpired = vi.fn();
		const instance = build({ onAuthExpired });
		const ws = latestWsClient();
		ws.script = [(sink) => sink.error(expiredFrame)];

		const { failures } = observe(instance.client.subscribe({ query: NOTE_ADDED }));
		await settle();

		expect(failures).toHaveLength(1);
		expect((onAuthExpired.mock.calls[0]?.[0] as AuthExpiredError).reason).toBe(
			'no-refresh-callback'
		);
		expect(ws.subscribeCalls).toHaveLength(1);

		instance.close();
	});

	it('collapses concurrent expiries into one refresh and one re-dial, re-issuing both', async () => {
		const onTokenRefresh = vi.fn().mockResolvedValue('fresh-token');
		const instance = build({ onTokenRefresh });
		const ws = latestWsClient();
		ws.script = [
			(sink) => sink.error(expiredFrame),
			(sink) => sink.error(expiredFrame),
			(sink) => sink.next(payload('3', 'first')),
			(sink) => sink.next(payload('4', 'second')),
		];

		const first = observe(instance.client.subscribe({ query: NOTE_ADDED }));
		const second = observe(
			instance.client.subscribe({ query: NOTE_ADDED, variables: { cursor: 'b' } })
		);
		await settle(20);

		expect(first.failures).toEqual([]);
		expect(second.failures).toEqual([]);
		expect(first.deliveries).toHaveLength(1);
		expect(second.deliveries).toHaveLength(1);

		// One refresh and one terminate for both: Lesser closes a duplicate
		// connection_init with 4429.
		expect(onTokenRefresh).toHaveBeenCalledTimes(1);
		expect(ws.events.filter((event) => event === 'terminate')).toHaveLength(1);
		expect(ws.subscribeCalls).toHaveLength(4);
		expect(ws.subscribeCalls.slice(2).map((call) => call.credential)).toEqual([
			'Bearer fresh-token',
			'Bearer fresh-token',
		]);

		instance.close();
	});

	it('does not re-issue after the caller unsubscribed', async () => {
		const onTokenRefresh = vi.fn().mockResolvedValue('fresh-token');
		const instance = build({ onTokenRefresh });
		const ws = latestWsClient();
		ws.script = [(sink) => sink.error(expiredFrame), (sink) => sink.next(payload('5', 'late'))];

		const { deliveries, handle } = observe(instance.client.subscribe({ query: NOTE_ADDED }));
		handle.unsubscribe();
		await settle();

		expect(deliveries).toEqual([]);
		expect(ws.subscribeCalls).toHaveLength(1);

		instance.close();
	});
});
