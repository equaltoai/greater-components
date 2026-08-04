import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WebSocketClient } from '../WebSocketClient';
import {
	AUTH_EXPIRED_CODE,
	AuthExpiredError,
	createCredentialGenerations,
	createSingleFlightRefresh,
	extractServerErrorCodes,
	hasServerErrorCode,
	isAuthExpiredError,
} from '../authExpiry';

/**
 * Lesser v1.5.33 re-checks credential expiry as each `subscribe` operation
 * starts and answers an expired credential with `extensions.code` TOKEN_EXPIRED
 * (docs/security/hardened-auth-visibility-rollout.md, cmd/graphql-ws/main.go
 * `connectionCredentialExpired`). It also closes a duplicate `connection_init`
 * with code 4429 (`wsCloseTooManyInitialisationRequests`).
 */

class MockWebSocket {
	static instances: MockWebSocket[] = [];
	static readonly OPEN = 1;
	static readonly CLOSED = 3;

	readyState = MockWebSocket.OPEN;
	readonly url: string;
	readonly sent: string[] = [];
	private listeners = new Map<string, Set<(event: unknown) => void>>();

	constructor(url: string) {
		this.url = url;
		MockWebSocket.instances.push(this);
	}

	addEventListener(type: string, handler: (event: unknown) => void): void {
		let set = this.listeners.get(type);
		if (!set) {
			set = new Set();
			this.listeners.set(type, set);
		}
		set.add(handler);
	}

	removeEventListener(type: string, handler: (event: unknown) => void): void {
		this.listeners.get(type)?.delete(handler);
	}

	send(data: string): void {
		this.sent.push(data);
	}

	close(): void {
		this.readyState = MockWebSocket.CLOSED;
	}

	emit(type: string, event: unknown): void {
		this.listeners.get(type)?.forEach((handler) => handler(event));
	}

	deliver(payload: unknown): void {
		this.emit('message', { data: JSON.stringify(payload) });
	}

	static reset(): void {
		MockWebSocket.instances = [];
	}

	static get latest(): MockWebSocket {
		const socket = MockWebSocket.instances.at(-1);
		if (!socket) {
			throw new Error('no MockWebSocket was constructed');
		}
		return socket;
	}
}

/** The graphql-ws Error frame Lesser sends when a credential has expired. */
const tokenExpiredFrame = {
	id: 'sub-1',
	type: 'error',
	payload: [
		{
			message: 'credential expired; re-authentication required',
			extensions: { code: AUTH_EXPIRED_CODE },
		},
	],
};

/** Lets queued promise callbacks run without advancing fake timers. */
async function flush(times = 4): Promise<void> {
	for (let i = 0; i < times; i += 1) {
		await Promise.resolve();
	}
}

describe('extractServerErrorCodes', () => {
	it('reads codes from a graphql-ws error frame payload', () => {
		expect(extractServerErrorCodes(tokenExpiredFrame.payload)).toEqual([AUTH_EXPIRED_CODE]);
	});

	it('reads codes from an execution result, graphQLErrors, and networkError', () => {
		expect(extractServerErrorCodes({ errors: [{ extensions: { code: 'A' } }] })).toEqual(['A']);
		expect(extractServerErrorCodes({ graphQLErrors: [{ extensions: { code: 'B' } }] })).toEqual([
			'B',
		]);
		expect(
			extractServerErrorCodes({
				networkError: { result: { errors: [{ extensions: { code: 'C' } }] } },
			})
		).toEqual(['C']);
	});

	it('ignores messages and payloads, returning only the code enum', () => {
		const codes = extractServerErrorCodes({
			errors: [{ message: 'secret detail', extensions: { code: 'D', hint: 'more detail' } }],
		});
		expect(codes).toEqual(['D']);
	});

	it('tolerates cycles and non-objects without throwing', () => {
		const cyclic: Record<string, unknown> = { errors: [{ extensions: { code: 'E' } }] };
		cyclic['cause'] = cyclic;
		expect(extractServerErrorCodes(cyclic)).toEqual(['E']);
		expect(extractServerErrorCodes(null)).toEqual([]);
		expect(extractServerErrorCodes('TOKEN_EXPIRED')).toEqual([]);
	});

	it('recognises the expiry code through hasServerErrorCode / isAuthExpiredError', () => {
		expect(hasServerErrorCode(tokenExpiredFrame, AUTH_EXPIRED_CODE)).toBe(true);
		expect(isAuthExpiredError(tokenExpiredFrame)).toBe(true);
		expect(isAuthExpiredError(new AuthExpiredError('no-refresh-callback'))).toBe(true);
		expect(isAuthExpiredError({ errors: [{ extensions: { code: 'UNAUTHENTICATED' } }] })).toBe(
			false
		);
	});
});

describe('createCredentialGenerations', () => {
	it('starts in force and advances once per fresh credential', () => {
		const generations = createCredentialGenerations();

		expect(generations.current()).toBe(0);
		expect(generations.advance()).toBe(1);
		expect(generations.advance()).toBe(2);
		expect(generations.current()).toBe(2);
	});

	it('allows exactly one refresh per credential', () => {
		const generations = createCredentialGenerations();

		// Every operation the socket was carrying reports its own refusal; only
		// the first one opens the episode.
		expect(generations.claimRefresh(0)).toBe(true);
		expect(generations.claimRefresh(0)).toBe(false);
		expect(generations.claimRefresh(0)).toBe(false);
	});

	it('re-arms the claim for the credential the refresh produced', () => {
		const generations = createCredentialGenerations();
		generations.claimRefresh(0);

		generations.advance();

		// A later, genuinely new expiry is a new episode and gets its own single
		// refresh — the bound is per credential, not per client.
		expect(generations.claimRefresh(1)).toBe(true);
		expect(generations.claimRefresh(1)).toBe(false);
	});

	it('refuses a claim from a credential that has been superseded', () => {
		const generations = createCredentialGenerations();
		generations.advance();

		// This is the restored-sibling case: graphql-ws re-subscribes an operation
		// issued under the old credential, Lesser refuses that frame once, and
		// refreshing again would terminate a socket already carrying a fresh
		// credential.
		expect(generations.claimRefresh(0)).toBe(false);
		// Nor may a generation this clock has never issued claim anything.
		expect(generations.claimRefresh(2)).toBe(false);
		expect(generations.claimRefresh(1)).toBe(true);
	});

	it('never lets a superseded credential re-arm an already spent claim', () => {
		const generations = createCredentialGenerations();
		generations.claimRefresh(0);
		generations.advance();
		generations.claimRefresh(1);

		expect(generations.claimRefresh(0)).toBe(false);
		expect(generations.claimRefresh(1)).toBe(false);
	});

	it('keeps one client instance from spending another instance claim', () => {
		const first = createCredentialGenerations();
		const second = createCredentialGenerations();

		expect(first.claimRefresh(0)).toBe(true);
		expect(second.claimRefresh(0)).toBe(true);
	});
});

describe('createSingleFlightRefresh', () => {
	it('collapses concurrent refreshes into one callback invocation', async () => {
		let release: (token: string) => void = () => undefined;
		const refresh = vi.fn(
			() =>
				new Promise<string>((resolve) => {
					release = resolve;
				})
		);
		const single = createSingleFlightRefresh(refresh);

		const first = single();
		const second = single();
		release('fresh-token');

		await expect(first).resolves.toBe('fresh-token');
		await expect(second).resolves.toBe('fresh-token');
		expect(refresh).toHaveBeenCalledTimes(1);
	});

	it('allows a later refresh after the in-flight one settles', async () => {
		const refresh = vi.fn().mockResolvedValueOnce('a').mockResolvedValueOnce('b');
		const single = createSingleFlightRefresh(refresh);

		await expect(single()).resolves.toBe('a');
		await expect(single()).resolves.toBe('b');
		expect(refresh).toHaveBeenCalledTimes(2);
	});

	it('does not poison later attempts when a refresh rejects', async () => {
		const refresh = vi.fn().mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce('ok');
		const single = createSingleFlightRefresh(refresh);

		await expect(single()).rejects.toBeInstanceOf(AuthExpiredError);
		await expect(single()).resolves.toBe('ok');
	});

	it('is terminal with no callback configured', async () => {
		const single = createSingleFlightRefresh(undefined);
		await expect(single()).rejects.toMatchObject({
			name: 'AuthExpiredError',
			code: AUTH_EXPIRED_CODE,
			reason: 'no-refresh-callback',
		});
	});

	it('is terminal when the callback yields no usable credential', async () => {
		await expect(createSingleFlightRefresh(() => null)()).rejects.toMatchObject({
			reason: 'refresh-empty',
		});
		await expect(createSingleFlightRefresh(() => '')()).rejects.toMatchObject({
			reason: 'refresh-empty',
		});
	});
});

describe('WebSocketClient credential expiry (Lesser v1.5.33)', () => {
	const originalWebSocket = globalThis.WebSocket;

	beforeEach(() => {
		vi.useFakeTimers();
		MockWebSocket.reset();
		(globalThis as { WebSocket: unknown }).WebSocket = MockWebSocket;
	});

	afterEach(() => {
		vi.useRealTimers();
		(globalThis as { WebSocket: unknown }).WebSocket = originalWebSocket;
	});

	function createClient(overrides: Record<string, unknown> = {}) {
		return new WebSocketClient({
			url: 'wss://lesser.example/stream',
			authToken: 'expired-token',
			enableLatencySampling: false,
			storage: undefined as unknown as Storage,
			...overrides,
		});
	}

	it('refreshes, reconnects with the fresh token, and resumes', async () => {
		const onTokenRefresh = vi.fn().mockResolvedValue('fresh-token');
		const client = createClient({ onTokenRefresh });

		client.connect();
		MockWebSocket.latest.emit('open', {});
		expect(MockWebSocket.latest.url).toContain('token=expired-token');

		MockWebSocket.latest.deliver(tokenExpiredFrame);
		await flush();

		expect(onTokenRefresh).toHaveBeenCalledTimes(1);
		expect(MockWebSocket.instances).toHaveLength(2);
		expect(MockWebSocket.latest.url).toContain('token=fresh-token');
		expect(MockWebSocket.latest.url).not.toContain('expired-token');

		// The refused socket is dropped rather than left open alongside the new one.
		expect(MockWebSocket.instances[0]?.readyState).toBe(MockWebSocket.CLOSED);

		client.destroy();
	});

	it('does not consume a reconnect attempt for a credential refresh', async () => {
		const client = createClient({ onTokenRefresh: () => 'fresh-token' });

		client.connect();
		MockWebSocket.latest.emit('open', {});
		expect(client.getState().reconnectAttempts).toBe(0);

		MockWebSocket.latest.deliver(tokenExpiredFrame);
		await flush();
		MockWebSocket.latest.emit('open', {});

		expect(client.getState().reconnectAttempts).toBe(0);
		expect(client.getState().status).toBe('connected');

		client.destroy();
	});

	it('opens exactly one socket when concurrent expiry frames arrive', async () => {
		const onTokenRefresh = vi.fn().mockResolvedValue('fresh-token');
		const client = createClient({ onTokenRefresh });

		client.connect();
		MockWebSocket.latest.emit('open', {});

		const socket = MockWebSocket.latest;
		socket.deliver({ ...tokenExpiredFrame, id: 'sub-1' });
		socket.deliver({ ...tokenExpiredFrame, id: 'sub-2' });
		socket.deliver({ ...tokenExpiredFrame, id: 'sub-3' });
		await flush();

		// One refresh, one new socket: Lesser closes a duplicate
		// connection_init with 4429, so a single re-dial is required.
		expect(onTokenRefresh).toHaveBeenCalledTimes(1);
		expect(MockWebSocket.instances).toHaveLength(2);

		client.destroy();
	});

	it('suppresses ordinary reconnect scheduling while a refresh is in flight', async () => {
		let release: (token: string) => void = () => undefined;
		const client = createClient({
			onTokenRefresh: () =>
				new Promise<string>((resolve) => {
					release = resolve;
				}),
		});

		client.connect();
		const first = MockWebSocket.latest;
		first.emit('open', {});

		// Expiry arrives; the refresh is still pending.
		first.deliver(tokenExpiredFrame);
		await flush();
		expect(MockWebSocket.instances).toHaveLength(1);

		// The socket now drops, which would normally schedule a reconnect.
		first.emit('close', { code: 1006, reason: 'dropped' });
		await vi.advanceTimersByTimeAsync(60_000);
		expect(MockWebSocket.instances).toHaveLength(1);

		// Only the refreshed dial opens a socket — one connection_init, not two.
		release('fresh-token');
		await flush();
		expect(MockWebSocket.instances).toHaveLength(2);
		expect(MockWebSocket.latest.url).toContain('token=fresh-token');

		client.destroy();
	});

	it('is loud and terminal when no refresh callback is configured', async () => {
		const onAuthExpired = vi.fn();
		const client = createClient({ onAuthExpired });
		const observed: unknown[] = [];
		client.on('authExpired', (event) => observed.push(event.error));

		client.connect();
		MockWebSocket.latest.emit('open', {});
		MockWebSocket.latest.deliver(tokenExpiredFrame);
		await flush();

		expect(onAuthExpired).toHaveBeenCalledTimes(1);
		const error = onAuthExpired.mock.calls[0]?.[0] as AuthExpiredError;
		expect(error).toBeInstanceOf(AuthExpiredError);
		expect(error.code).toBe(AUTH_EXPIRED_CODE);
		expect(error.reason).toBe('no-refresh-callback');
		expect(observed).toHaveLength(1);

		expect(client.getState().status).toBe('disconnected');
		expect(client.getState().error).toBe(error);

		// Terminal means terminal: no silent reconnect churn.
		await vi.advanceTimersByTimeAsync(120_000);
		expect(MockWebSocket.instances).toHaveLength(1);

		client.destroy();
	});

	it('is terminal when the refresh callback fails or yields nothing', async () => {
		for (const [refresh, reason] of [
			[vi.fn().mockRejectedValue(new Error('offline')), 'refresh-failed'],
			[vi.fn().mockResolvedValue(null), 'refresh-empty'],
		] as const) {
			MockWebSocket.reset();
			const onAuthExpired = vi.fn();
			const client = createClient({ onTokenRefresh: refresh, onAuthExpired });

			client.connect();
			MockWebSocket.latest.emit('open', {});
			MockWebSocket.latest.deliver(tokenExpiredFrame);
			await flush(8);

			expect(onAuthExpired).toHaveBeenCalledTimes(1);
			expect((onAuthExpired.mock.calls[0]?.[0] as AuthExpiredError).reason).toBe(reason);
			expect(MockWebSocket.instances).toHaveLength(1);

			client.destroy();
		}
	});

	/**
	 * Serial refusals: a server that answers every newly minted credential with
	 * TOKEN_EXPIRED.
	 *
	 * This needs no malice. Clock skew between the client and the auth node, an
	 * inconsistent auth node behind a load balancer, delayed revocation state, or
	 * a refresh service handing out credentials that are already expired all
	 * produce it. Auth recovery deliberately spends no reconnect attempt, so
	 * `maxReconnectAttempts` cannot stop the refresh → redial → refuse cycle;
	 * only its own budget can.
	 */
	async function refuseOnce(): Promise<void> {
		MockWebSocket.latest.emit('open', {});
		MockWebSocket.latest.deliver(tokenExpiredFrame);
		await flush(8);
	}

	it('stops a serial refusal loop at the auth-recovery cap, loudly', async () => {
		const onTokenRefresh = vi.fn(async () => `minted-${onTokenRefresh.mock.calls.length}`);
		const onAuthExpired = vi.fn();
		const client = createClient({ onTokenRefresh, onAuthExpired });
		const observed: AuthExpiredError[] = [];
		client.on('authExpired', (event) => observed.push(event.error as AuthExpiredError));

		client.connect();

		// Five scripted refusals, each on the socket the previous recovery
		// opened. The client must not answer all five.
		for (let refusal = 0; refusal < 5; refusal += 1) {
			await refuseOnce();
			// Let any backoff between consecutive recoveries elapse.
			await vi.advanceTimersByTimeAsync(60_000);
		}

		// Three recoveries, then the condition is terminal: the fourth refusal is
		// answered with a typed error instead of a fourth credential.
		expect(onTokenRefresh).toHaveBeenCalledTimes(3);
		expect(MockWebSocket.instances).toHaveLength(4);

		expect(onAuthExpired).toHaveBeenCalledTimes(1);
		const error = onAuthExpired.mock.calls[0]?.[0] as AuthExpiredError;
		expect(error).toBeInstanceOf(AuthExpiredError);
		expect(error.code).toBe(AUTH_EXPIRED_CODE);
		expect(error.reason).toBe('recovery-exhausted');
		expect(observed).toEqual([error]);

		// Loud, and stopped: the app is told, and nothing keeps dialing.
		expect(client.getState().status).toBe('disconnected');
		expect(client.getState().error).toBe(error);
		await vi.advanceTimersByTimeAsync(300_000);
		expect(MockWebSocket.instances).toHaveLength(4);

		// The reconnect budget is still whole — auth recovery never spent it, and
		// so was never bounded by it.
		expect(client.getState().reconnectAttempts).toBe(0);

		client.destroy();
	});

	it('spaces consecutive auth recoveries instead of dialing straight back', async () => {
		const onTokenRefresh = vi.fn().mockResolvedValue('fresh-token');
		// Jitter is a fraction of the base delay, so each window below is
		// [base, base * 1.3] — asserted from both ends rather than assumed.
		const client = createClient({ onTokenRefresh, initialReconnectDelay: 1000 });

		client.connect();

		// One credential expiring and one refresh answering it is the ordinary
		// case: it is not delayed, or every routine renewal would be.
		await refuseOnce();
		expect(MockWebSocket.instances).toHaveLength(2);

		// A second refusal, on a credential minted moments ago, is not ordinary.
		await refuseOnce();
		expect(MockWebSocket.instances).toHaveLength(2);
		await vi.advanceTimersByTimeAsync(999);
		expect(MockWebSocket.instances).toHaveLength(2);
		await vi.advanceTimersByTimeAsync(301);
		expect(MockWebSocket.instances).toHaveLength(3);

		// And the third waits longer than the second could have: at 1999ms the
		// previous window has long closed, and this one has not opened.
		await refuseOnce();
		await vi.advanceTimersByTimeAsync(1999);
		expect(MockWebSocket.instances).toHaveLength(3);
		await vi.advanceTimersByTimeAsync(601);
		expect(MockWebSocket.instances).toHaveLength(4);

		client.destroy();
	});

	it('resets the auth-recovery budget when the server answers on the fresh credential', async () => {
		const onTokenRefresh = vi.fn().mockResolvedValue('fresh-token');
		const onAuthExpired = vi.fn();
		const client = createClient({ onTokenRefresh, onAuthExpired });

		client.connect();

		// Five refusals again — more than the cap — but this time the server
		// delivers real traffic on each refreshed credential before refusing the
		// next one. None of them are consecutive, so the budget never runs down.
		for (let refusal = 0; refusal < 5; refusal += 1) {
			await refuseOnce();
			await vi.advanceTimersByTimeAsync(60_000);
			MockWebSocket.latest.emit('open', {});
			MockWebSocket.latest.deliver({ type: 'note', id: `event-${refusal}`, data: { ok: true } });
		}

		expect(onTokenRefresh).toHaveBeenCalledTimes(5);
		expect(onAuthExpired).not.toHaveBeenCalled();
		expect(client.getState().status).toBe('connected');

		client.destroy();
	});

	it('does not count another open socket as evidence the credential is accepted', async () => {
		// The cap would be meaningless if opening the next socket cleared it —
		// a refusal loop produces a fresh socket every cycle by construction. The
		// refusal always arrives after the open, so only what the server sends
		// afterwards can count.
		const onTokenRefresh = vi.fn().mockResolvedValue('fresh-token');
		const onAuthExpired = vi.fn();
		const client = createClient({ onTokenRefresh, onAuthExpired });

		client.connect();
		for (let refusal = 0; refusal < 4; refusal += 1) {
			// Each cycle opens a socket, and each socket refuses.
			await refuseOnce();
			await vi.advanceTimersByTimeAsync(60_000);
		}

		expect(MockWebSocket.instances.length).toBeGreaterThan(1);
		expect(onTokenRefresh).toHaveBeenCalledTimes(3);
		expect(onAuthExpired).toHaveBeenCalledTimes(1);

		client.destroy();
	});

	it('never writes the credential to the logger', async () => {
		const logger = { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() };
		const client = createClient({ logger, onTokenRefresh: () => 'fresh-token' });

		client.connect();
		MockWebSocket.latest.emit('open', {});
		MockWebSocket.latest.deliver(tokenExpiredFrame);
		await flush();
		MockWebSocket.latest.emit('error', new Error('boom'));

		const logged = JSON.stringify(
			Object.values(logger).flatMap((fn) => fn.mock.calls),
			(_key, value) => (value instanceof Error ? value.message : value)
		);
		expect(logged).not.toContain('expired-token');
		expect(logged).not.toContain('fresh-token');
		expect(logged).not.toContain('wss://lesser.example');

		client.destroy();
	});
});
