import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WebSocketClient } from '../WebSocketClient';
import {
	AUTH_EXPIRED_CODE,
	AuthExpiredError,
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

	removeEventListener(): void {
		// The client rebinds handlers with `.bind(this)`, so removal is a no-op
		// here; `close()` plus instance tracking is what the assertions use.
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
			extractServerErrorCodes({ networkError: { result: { errors: [{ extensions: { code: 'C' } }] } } })
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
		expect(isAuthExpiredError({ errors: [{ extensions: { code: 'UNAUTHENTICATED' } }] })).toBe(false);
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
