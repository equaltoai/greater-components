import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parse } from 'graphql';

/**
 * Subscribe-time credential expiry over the graphql-ws *protocol*, driving the
 * installed client (6.0.8) rather than a stand-in for it.
 *
 * The suites next door fake `graphql-ws` and so can only express what the
 * adapter's own links do. One behaviour lives entirely inside the real client
 * and is invisible to a fake: when the socket drops, graphql-ws re-subscribes
 * the operations that were still active, on the new socket, under whatever
 * credential `connectionParams()` now yields, reusing each operation's original
 * id. That restored frame is a subscribe like any other, and Lesser re-checks
 * expiry as each subscribe starts — a connection row persisted before expiry
 * persistence existed fails closed exactly once and self-heals on reconnect —
 * so a restored sibling can be refused on a socket that is already carrying a
 * fresh credential.
 *
 * That is the interleaving these probes pin. Only the WebSocket is faked, and
 * only as far as the transport: a scripted Lesser that speaks
 * connection_init/ack, subscribe, next and error frames.
 */

interface SubscribeFrame {
	/** Which socket carried the frame, in creation order. */
	socket: number;
	/** The graphql-ws operation id; stable across a restore. */
	id: string;
	/** Which subscription the payload identifies. */
	stream: string;
	/** True when graphql-ws re-sent an id it had already used. */
	restored: boolean;
	/** The credential the socket was initialised with. */
	credential: string | undefined;
}

/** What the scripted Lesser does with one subscribe frame. */
type ServerAnswer = 'expired' | 'deliver' | 'idle';

interface ServerScript {
	answer(frame: SubscribeFrame): ServerAnswer;
	/** How long a `deliver` answer sits queued before the payload is sent. */
	deliveryDelayMs?: number;
}

let script: ServerScript = { answer: () => 'idle' };

/** Every subscribe frame the client sent, across every socket. */
const subscribeFrames: SubscribeFrame[] = [];
const seenIds = new Set<string>();

class MockSocket {
	static readonly CONNECTING = 0;
	static readonly OPEN = 1;
	static readonly CLOSING = 2;
	static readonly CLOSED = 3;

	static instances: MockSocket[] = [];

	readonly index: number;
	readonly url: string;
	readyState: number = MockSocket.CONNECTING;
	credential: string | undefined;

	onopen: (() => void) | null = null;
	onmessage: ((event: { data: string }) => void) | null = null;
	onclose: ((event: { code: number; reason: string; wasClean: boolean }) => void) | null = null;
	onerror: ((error: unknown) => void) | null = null;

	constructor(url: string) {
		this.url = url;
		this.index = MockSocket.instances.push(this) - 1;
		// A socket opens on its own turn, never inside the constructor.
		setTimeout(() => {
			if (this.readyState !== MockSocket.CONNECTING) {
				return;
			}
			this.readyState = MockSocket.OPEN;
			this.onopen?.();
		}, 0);
	}

	send(raw: string): void {
		const message = JSON.parse(raw) as {
			type: string;
			id?: string;
			payload?: { authorization?: string; variables?: Record<string, unknown> };
		};

		if (message.type === 'connection_init') {
			this.credential = message.payload?.authorization;
			this.deliver({ type: 'connection_ack' });
			return;
		}

		if (message.type !== 'subscribe' || !message.id) {
			return;
		}

		const frame: SubscribeFrame = {
			socket: this.index,
			id: message.id,
			stream: String(message.payload?.variables?.['stream'] ?? ''),
			restored: seenIds.has(message.id),
			credential: this.credential,
		};
		seenIds.add(message.id);
		subscribeFrames.push(frame);

		const answer = script.answer(frame);
		if (answer === 'idle') {
			return;
		}
		if (answer === 'expired') {
			this.deliver({
				type: 'error',
				id: message.id,
				payload: [
					{
						message: 'credential expired; re-authentication required',
						extensions: { code: 'TOKEN_EXPIRED' },
					},
				],
			});
			return;
		}
		// A delivery the server has accepted and queued. If the client tears this
		// socket down before it lands, the payload is simply lost — which is the
		// cost of a reconnect nobody needed.
		setTimeout(() => {
			this.deliver({
				type: 'next',
				id: message.id,
				payload: {
					data: { noteAdded: { __typename: 'Note', id: frame.stream, content: frame.stream } },
				},
			});
		}, script.deliveryDelayMs ?? 20);
		return;
	}

	close(code = 1000, reason = ''): void {
		if (this.readyState === MockSocket.CLOSED) {
			return;
		}
		this.readyState = MockSocket.CLOSED;
		this.onclose?.({ code, reason, wasClean: code === 1000 });
	}

	/**
	 * Sends a frame back on a later turn, as a socket does.
	 *
	 * Answering inside `send()` would land the frame while graphql-ws is still
	 * inside `onopen` — before it arms its connection-acknowledgement timeout —
	 * and the timer it then arms would never be cleared.
	 */
	private deliver(message: unknown): void {
		setTimeout(() => {
			if (this.readyState !== MockSocket.OPEN) {
				return;
			}
			this.onmessage?.({ data: JSON.stringify(message) });
		}, 0);
	}

	static reset(): void {
		MockSocket.instances = [];
	}
}

const { createGraphQLClient } = await import('../client');

const NOTE_ADDED = parse(`
	subscription NoteAdded($stream: String) {
		noteAdded(stream: $stream) {
			id
			content
		}
	}
`);

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

/**
 * Lets the protocol run: graphql-ws waits on real timers between reconnect
 * attempts, and the socket answers on its own turn.
 */
async function runProtocol(ms = 20_000): Promise<void> {
	await vi.advanceTimersByTimeAsync(ms);
}

describe('credential expiry over the graphql-ws protocol', () => {
	let restoreWebSocket: () => void;

	beforeEach(() => {
		vi.useFakeTimers();
		MockSocket.reset();
		subscribeFrames.length = 0;
		seenIds.clear();
		script = { answer: () => 'idle' };

		const previous = Reflect.get(globalThis, 'WebSocket') as unknown;
		Reflect.set(globalThis, 'WebSocket', MockSocket);
		restoreWebSocket = () => {
			if (previous === undefined) {
				Reflect.deleteProperty(globalThis, 'WebSocket');
			} else {
				Reflect.set(globalThis, 'WebSocket', previous);
			}
		};
	});

	afterEach(() => {
		restoreWebSocket();
		vi.useRealTimers();
	});

	it('answers a restored sibling refusal with a re-issue, not a second cycle', async () => {
		// The interleaving, exactly as round 3 reported it:
		//   1. A and B are active on the socket carrying the expired credential;
		//   2. Lesser refuses A with TOKEN_EXPIRED;
		//   3. the client refreshes once and terminates the socket once;
		//   4. graphql-ws reconnects and restores still-active B, whose subscribe
		//      the fresh socket also refuses — a new-socket frame, not a stale one;
		//   5. B must recover on that socket without a second refresh, and A's
		//      queued delivery must survive.
		const onTokenRefresh = vi.fn().mockResolvedValue('fresh-token');
		script = {
			answer: (frame) => {
				// B subscribed before the credential lapsed and is delivering.
				if (frame.stream === 'B' && frame.socket === 0) {
					return 'idle';
				}
				// A subscribes after it lapsed and is refused.
				if (frame.stream === 'A' && frame.socket === 0) {
					return 'expired';
				}
				// B's automatic re-subscribe on the fresh socket: the connection row
				// fails closed exactly once before it self-heals.
				if (frame.restored) {
					return 'expired';
				}
				return 'deliver';
			},
			deliveryDelayMs: 200,
		};

		const instance = createGraphQLClient({
			httpEndpoint: 'https://lesser.example/graphql',
			wsEndpoint: 'wss://lesser.example/subscriptions',
			token: 'expired-token',
			maxRetries: 3,
			onTokenRefresh,
		});
		const terminate = vi.spyOn(
			instance.wsClient as unknown as { terminate: () => void },
			'terminate'
		);

		const b = observe(instance.client.subscribe({ query: NOTE_ADDED, variables: { stream: 'B' } }));
		await runProtocol(50);
		const a = observe(instance.client.subscribe({ query: NOTE_ADDED, variables: { stream: 'A' } }));
		await runProtocol();

		// One expiry condition, one recovery.
		expect(onTokenRefresh).toHaveBeenCalledTimes(1);
		expect(terminate).toHaveBeenCalledTimes(1);
		expect(MockSocket.instances).toHaveLength(2);

		// A's delivery was queued on the fresh socket; nothing tore that socket
		// down underneath it.
		expect(a.failures).toEqual([]);
		expect(a.deliveries).toHaveLength(1);
		expect(a.deliveries[0]).toMatchObject({ data: { noteAdded: { id: 'A' } } });

		// B recovered on the same fresh socket, by re-issuing rather than by
		// riding a second refresh-and-reconnect.
		expect(b.failures).toEqual([]);
		expect(b.deliveries).toHaveLength(1);
		expect(b.deliveries[0]).toMatchObject({ data: { noteAdded: { id: 'B' } } });

		// Every subscribe the fresh socket carried presented the fresh credential.
		const onFreshSocket = subscribeFrames.filter((frame) => frame.socket === 1);
		expect(onFreshSocket.length).toBeGreaterThan(0);
		expect(onFreshSocket.every((frame) => frame.credential === 'Bearer fresh-token')).toBe(true);
		expect(subscribeFrames.filter((frame) => frame.restored)).toHaveLength(1);

		instance.close();
	});

	it('keeps a restored sibling loud when the fresh credential is refused twice', async () => {
		// The bound: a restored sibling gets one re-issue on the credential in
		// force. If Lesser refuses that too, the caller hears about it — the
		// client never trades a loud failure for another socket teardown.
		const onTokenRefresh = vi.fn().mockResolvedValue('fresh-token');
		script = {
			answer: (frame) => {
				if (frame.stream === 'B' && frame.socket === 0) {
					return 'idle';
				}
				if (frame.stream === 'A' && frame.socket === 0) {
					return 'expired';
				}
				return frame.stream === 'B' ? 'expired' : 'deliver';
			},
			deliveryDelayMs: 200,
		};

		const instance = createGraphQLClient({
			httpEndpoint: 'https://lesser.example/graphql',
			wsEndpoint: 'wss://lesser.example/subscriptions',
			token: 'expired-token',
			maxRetries: 3,
			onTokenRefresh,
		});
		const terminate = vi.spyOn(
			instance.wsClient as unknown as { terminate: () => void },
			'terminate'
		);

		const b = observe(instance.client.subscribe({ query: NOTE_ADDED, variables: { stream: 'B' } }));
		await runProtocol(50);
		const a = observe(instance.client.subscribe({ query: NOTE_ADDED, variables: { stream: 'A' } }));
		await runProtocol();

		expect(onTokenRefresh).toHaveBeenCalledTimes(1);
		expect(terminate).toHaveBeenCalledTimes(1);
		expect(MockSocket.instances).toHaveLength(2);

		// B is loud, and bounded: the restored frame plus one re-issue.
		expect(b.failures).toHaveLength(1);
		expect(b.deliveries).toEqual([]);
		expect(
			subscribeFrames.filter((frame) => frame.stream === 'B' && frame.socket === 1)
		).toHaveLength(2);

		// A, which shares the socket, is untouched by B's failure.
		expect(a.failures).toEqual([]);
		expect(a.deliveries).toHaveLength(1);

		instance.close();
	});

	it('refreshes once and re-issues a lone expired subscription', async () => {
		// The plain case over the real protocol: refresh, re-dial, re-subscribe.
		const onTokenRefresh = vi.fn().mockResolvedValue('fresh-token');
		script = {
			answer: (frame) => (frame.socket === 0 ? 'expired' : 'deliver'),
		};

		const instance = createGraphQLClient({
			httpEndpoint: 'https://lesser.example/graphql',
			wsEndpoint: 'wss://lesser.example/subscriptions',
			token: 'expired-token',
			maxRetries: 3,
			onTokenRefresh,
		});

		const a = observe(instance.client.subscribe({ query: NOTE_ADDED, variables: { stream: 'A' } }));
		await runProtocol();

		expect(onTokenRefresh).toHaveBeenCalledTimes(1);
		expect(MockSocket.instances).toHaveLength(2);
		expect(a.failures).toEqual([]);
		expect(a.deliveries).toHaveLength(1);
		expect(subscribeFrames[0]?.credential).toBe('Bearer expired-token');
		expect(subscribeFrames.at(-1)?.credential).toBe('Bearer fresh-token');

		instance.close();
	});
});

/**
 * A refresh answers a question about one specific credential, and the app can
 * change the answer while it is still in flight.
 *
 * `updateToken()` is how an app switches accounts: it puts a credential in
 * force, rebuilds the transport around it, and expects every later request to
 * carry it. A refresh started before that call is asking on behalf of the
 * principal the app has just left. Installing its result afterwards would set
 * the socket's credential back to one obtained for the old principal — during
 * an account switch, requests and delivered data for the wrong person.
 *
 * These probes pin the invariant at the only place it can be enforced: after
 * `updateToken(T2)`, nothing fetched before T2 is ever applied. The refusal and
 * the credentials are real protocol frames, so what is asserted is what the
 * socket actually presented on the wire.
 */
describe('credential expiry racing an app-supplied credential', () => {
	let restoreWebSocket: () => void;

	beforeEach(() => {
		vi.useFakeTimers();
		MockSocket.reset();
		subscribeFrames.length = 0;
		seenIds.clear();
		script = { answer: () => 'idle' };

		const previous = Reflect.get(globalThis, 'WebSocket') as unknown;
		Reflect.set(globalThis, 'WebSocket', MockSocket);
		restoreWebSocket = () => {
			if (previous === undefined) {
				Reflect.deleteProperty(globalThis, 'WebSocket');
			} else {
				Reflect.set(globalThis, 'WebSocket', previous);
			}
		};
	});

	afterEach(() => {
		restoreWebSocket();
		vi.useRealTimers();
	});

	/** A refresh the probe settles by hand, at the instant it chooses. */
	function deferredRefresh(): {
		callback: () => Promise<string>;
		resolve: (token: string) => void;
		reject: (error: unknown) => void;
	} {
		let resolve: (token: string) => void = () => undefined;
		let reject: (error: unknown) => void = () => undefined;
		const pending = new Promise<string>((res, rej) => {
			resolve = res;
			reject = rej;
		});
		return { callback: () => pending, resolve, reject };
	}

	/** Every credential any socket was initialised with, in creation order. */
	const socketCredentials = (): (string | undefined)[] =>
		MockSocket.instances.map((socket) => socket.credential);

	it('discards a refresh that resolves after the app supplied its own credential', async () => {
		// The account switch, step by step:
		//   1. A is refused on the expired credential and a refresh starts;
		//   2. before it resolves the app calls updateToken('manual-token'),
		//      which puts the new principal in force and rebuilds the transport;
		//   3. B subscribes on that transport and is delivering happily;
		//   4. only now does the old refresh resolve.
		// Its result belongs to the principal the app left, so it is discarded
		// whole: no token, no re-dial, and above all no socket carrying it.
		const refresh = deferredRefresh();
		const onTokenRefresh = vi.fn(refresh.callback);
		const onAuthExpired = vi.fn();
		script = { answer: (frame) => (frame.socket === 0 ? 'expired' : 'deliver') };

		const instance = createGraphQLClient({
			httpEndpoint: 'https://lesser.example/graphql',
			wsEndpoint: 'wss://lesser.example/subscriptions',
			token: 'expired-token',
			maxRetries: 3,
			onTokenRefresh,
			onAuthExpired,
		});

		const a = observe(instance.client.subscribe({ query: NOTE_ADDED, variables: { stream: 'A' } }));
		await runProtocol(100);
		expect(onTokenRefresh).toHaveBeenCalledTimes(1);

		instance.updateToken('manual-token');
		const b = observe(instance.client.subscribe({ query: NOTE_ADDED, variables: { stream: 'B' } }));
		await runProtocol(100);

		// The new principal's socket is up and delivering before the stale
		// refresh lands, so there is something for a wrong install to break.
		expect(socketCredentials()).toEqual(['Bearer expired-token', 'Bearer manual-token']);
		expect(b.deliveries).toHaveLength(1);

		refresh.resolve('refresh-result');
		await runProtocol();

		// Nothing the stale refresh produced ever reached the wire. This is the
		// invariant: after updateToken, no credential fetched before it is applied.
		expect(socketCredentials()).not.toContain('Bearer refresh-result');
		expect(subscribeFrames.every((frame) => frame.credential !== 'Bearer refresh-result')).toBe(
			true
		);

		// The app's socket was not torn down underneath it either. A stale install
		// would have re-dialed it — the superseded episode owns no socket here.
		expect(MockSocket.instances[1]?.readyState).toBe(1);
		expect(b.failures).toEqual([]);
		expect(b.deliveries).toHaveLength(1);

		// The episode ends as superseded rather than dying: A re-issues, and it
		// re-issues under the credential the app put in force — the only one that
		// exists now. Its old transport reads the live credential when it dials,
		// so every socket after the refused one carries the manual token.
		expect(a.failures).toEqual([]);
		expect(a.deliveries).toHaveLength(1);
		expect(
			socketCredentials()
				.slice(1)
				.every((credential) => credential === 'Bearer manual-token')
		).toBe(true);
		expect(subscribeFrames.filter((frame) => frame.stream === 'A').at(-1)?.credential).toBe(
			'Bearer manual-token'
		);

		// One refresh for one expiry condition; the superseded episode does not
		// start another, and does not report a session the app has already
		// replaced as terminally expired.
		expect(onTokenRefresh).toHaveBeenCalledTimes(1);
		expect(onAuthExpired).not.toHaveBeenCalled();

		instance.close();
	});

	it('discards a refresh superseded between its resolution and the re-dial', async () => {
		// The narrower window: the refresh callback has already produced a token
		// and the client is on its way to installing it when updateToken lands.
		// One microtask hop is enough to sit inside that gap — the installation
		// runs on a later turn than the callback's own resolution.
		const refresh = deferredRefresh();
		const onTokenRefresh = vi.fn(refresh.callback);
		script = { answer: (frame) => (frame.socket === 0 ? 'expired' : 'deliver') };

		const instance = createGraphQLClient({
			httpEndpoint: 'https://lesser.example/graphql',
			wsEndpoint: 'wss://lesser.example/subscriptions',
			token: 'expired-token',
			maxRetries: 3,
			onTokenRefresh,
		});

		observe(instance.client.subscribe({ query: NOTE_ADDED, variables: { stream: 'A' } }));
		await runProtocol(100);
		expect(onTokenRefresh).toHaveBeenCalledTimes(1);

		refresh.resolve('refresh-result');
		await Promise.resolve();
		instance.updateToken('manual-token');

		const b = observe(instance.client.subscribe({ query: NOTE_ADDED, variables: { stream: 'B' } }));
		await runProtocol();

		expect(socketCredentials()).not.toContain('Bearer refresh-result');
		expect(subscribeFrames.every((frame) => frame.credential !== 'Bearer refresh-result')).toBe(
			true
		);
		expect(b.failures).toEqual([]);
		expect(b.deliveries).toHaveLength(1);
		expect(subscribeFrames.at(-1)?.credential).toBe('Bearer manual-token');

		instance.close();
	});

	it('does not report terminal expiry when a superseded refresh fails', async () => {
		// The rejection side of the same race. Failing to renew a credential the
		// app has already replaced is moot: telling an app that has just signed in
		// that its session is gone would send it back to a login screen it does
		// not need.
		const refresh = deferredRefresh();
		const onTokenRefresh = vi.fn(refresh.callback);
		const onAuthExpired = vi.fn();
		script = { answer: (frame) => (frame.socket === 0 ? 'expired' : 'deliver') };

		const instance = createGraphQLClient({
			httpEndpoint: 'https://lesser.example/graphql',
			wsEndpoint: 'wss://lesser.example/subscriptions',
			token: 'expired-token',
			maxRetries: 3,
			onTokenRefresh,
			onAuthExpired,
		});

		observe(instance.client.subscribe({ query: NOTE_ADDED, variables: { stream: 'A' } }));
		await runProtocol(100);

		instance.updateToken('manual-token');
		refresh.reject(new Error('refresh service unreachable'));
		await runProtocol();

		expect(onAuthExpired).not.toHaveBeenCalled();

		// The credential the app put in force is still the one in force, and the
		// transport still works.
		const b = observe(instance.client.subscribe({ query: NOTE_ADDED, variables: { stream: 'B' } }));
		await runProtocol();
		expect(b.failures).toEqual([]);
		expect(b.deliveries).toHaveLength(1);
		expect(subscribeFrames.at(-1)?.credential).toBe('Bearer manual-token');

		instance.close();
	});

	it('still installs a refresh that nothing superseded', async () => {
		// The regression guard for the compare-and-swap: with no interleaved
		// updateToken the ordinary episode is untouched — one refresh, one
		// re-dial, the refreshed credential on the wire, the operation restored.
		const onTokenRefresh = vi.fn().mockResolvedValue('fresh-token');
		script = { answer: (frame) => (frame.socket === 0 ? 'expired' : 'deliver') };

		const instance = createGraphQLClient({
			httpEndpoint: 'https://lesser.example/graphql',
			wsEndpoint: 'wss://lesser.example/subscriptions',
			token: 'expired-token',
			maxRetries: 3,
			onTokenRefresh,
		});

		const a = observe(instance.client.subscribe({ query: NOTE_ADDED, variables: { stream: 'A' } }));
		await runProtocol();

		expect(onTokenRefresh).toHaveBeenCalledTimes(1);
		expect(MockSocket.instances).toHaveLength(2);
		expect(socketCredentials()[1]).toBe('Bearer fresh-token');
		expect(a.failures).toEqual([]);
		expect(a.deliveries).toHaveLength(1);

		instance.close();
	});
});
