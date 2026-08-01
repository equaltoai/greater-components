import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WebSocketClient } from '../WebSocketClient';
import { AUTH_EXPIRED_CODE } from '../authExpiry';

/**
 * Socket handoff: a socket the client has moved on from must not be able to
 * touch the connection that replaced it.
 *
 * Every reconnect path — ordinary backoff, and the credential
 * refresh-and-reconnect Lesser v1.5.33 requires — drops one socket and dials
 * another. A real WebSocket keeps emitting after that: `close` is delivered
 * asynchronously, an `error` can follow a `close`, and a socket that was
 * already connecting can still fire `open`. If those land on handlers wired to
 * the client rather than to the socket they came from, the superseded socket
 * tears down its own replacement.
 *
 * These tests hold that boundary from both sides: the listeners are genuinely
 * detached, and each listener re-checks socket identity so an event that was
 * already queued is dropped rather than acted on.
 */

class MockWebSocket {
	static instances: MockWebSocket[] = [];
	static readonly CONNECTING = 0;
	static readonly OPEN = 1;
	static readonly CLOSED = 3;

	readyState = MockWebSocket.OPEN;
	readonly url: string;
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

	/**
	 * Models the real removal contract. The client used to remove by rebinding
	 * (`handler.bind(this)` allocates a new function each call), which removed
	 * nothing; a mock that ignores removal cannot tell the two apart.
	 */
	removeEventListener(type: string, handler: (event: unknown) => void): void {
		this.listeners.get(type)?.delete(handler);
	}

	send(): void {
		// Not exercised here.
	}

	/** Closing is silent: a real close event is delivered separately, and late. */
	close(): void {
		this.readyState = MockWebSocket.CLOSED;
	}

	emit(type: string, event: unknown): void {
		this.listeners.get(type)?.forEach((handler) => handler(event));
	}

	deliver(payload: unknown): void {
		this.emit('message', { data: JSON.stringify(payload) });
	}

	listenerCount(type: string): number {
		return this.listeners.get(type)?.size ?? 0;
	}

	get totalListenerCount(): number {
		let total = 0;
		for (const set of this.listeners.values()) {
			total += set.size;
		}
		return total;
	}

	static reset(): void {
		MockWebSocket.instances = [];
	}

	static at(index: number): MockWebSocket {
		const socket = MockWebSocket.instances[index];
		if (!socket) {
			throw new Error(`no MockWebSocket at index ${index}`);
		}
		return socket;
	}
}

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

async function flush(times = 4): Promise<void> {
	for (let i = 0; i < times; i += 1) {
		await Promise.resolve();
	}
}

describe('WebSocketClient socket handoff', () => {
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

	/** Drives a client to the point where socket 0 has been replaced by socket 1. */
	async function handOffViaRefresh() {
		const client = createClient({ onTokenRefresh: () => 'fresh-token' });

		client.connect();
		MockWebSocket.at(0).emit('open', {});
		MockWebSocket.at(0).deliver(tokenExpiredFrame);
		await flush();

		expect(MockWebSocket.instances).toHaveLength(2);
		const superseded = MockWebSocket.at(0);
		const live = MockWebSocket.at(1);
		live.emit('open', {});
		expect(client.getState().status).toBe('connected');

		return { client, superseded, live };
	}

	it('detaches every listener from the socket it moved on from', async () => {
		const { client, superseded, live } = await handOffViaRefresh();

		expect(superseded.totalListenerCount).toBe(0);
		expect(live.listenerCount('close')).toBe(1);

		client.destroy();
	});

	it('survives a delayed close from the superseded socket', async () => {
		const { client, superseded, live } = await handOffViaRefresh();

		// The refused socket's close finally lands. Before the handoff was keyed
		// on socket identity this ran handleClose against the *fresh* socket:
		// cleanup() closed it and a reconnect was scheduled behind its back.
		superseded.emit('close', { code: 1006, reason: 'abnormal closure' });
		await vi.advanceTimersByTimeAsync(60_000);

		expect(live.readyState).toBe(MockWebSocket.OPEN);
		expect(client.getState().status).toBe('connected');
		expect(client.getState().reconnectAttempts).toBe(0);
		expect(MockWebSocket.instances).toHaveLength(2);

		client.destroy();
	});

	it('does not surface a delayed error from the superseded socket', async () => {
		const { client, superseded, live } = await handOffViaRefresh();
		const errors: unknown[] = [];
		client.on('error', (event) => errors.push(event.error));

		superseded.emit('error', new Error('stale transport failure'));

		expect(errors).toEqual([]);
		expect(client.getState().error).toBeNull();
		expect(client.getState().status).toBe('connected');
		expect(live.readyState).toBe(MockWebSocket.OPEN);

		client.destroy();
	});

	it('ignores a delayed message from the superseded socket', async () => {
		const { client, superseded } = await handOffViaRefresh();
		const messages: unknown[] = [];
		client.on('message', (event) => messages.push(event.data));

		superseded.deliver({ id: 'evt-9', type: 'update', data: { note: 'stale' } });

		expect(messages).toEqual([]);
		expect(client.getState().lastEventId).toBeNull();

		client.destroy();
	});

	it('does not let a superseded socket report itself open after the live one drops', async () => {
		const { client, superseded, live } = await handOffViaRefresh();
		const opens: unknown[] = [];
		client.on('open', () => opens.push('open'));

		// The live socket drops, so the client is now reconnecting.
		live.emit('close', { code: 1006, reason: 'network loss' });
		expect(client.getState().status).toBe('reconnecting');

		// Interleaved: the superseded socket's open finally arrives. Reporting
		// it as `connected` would hand the app a socket that is already closed.
		superseded.emit('open', {});

		expect(opens).toEqual([]);
		expect(client.getState().status).toBe('reconnecting');

		client.destroy();
	});

	it('isolates the superseded socket across an ordinary backoff reconnect too', async () => {
		const client = createClient();

		client.connect();
		const first = MockWebSocket.at(0);
		first.emit('open', {});

		first.emit('close', { code: 1006, reason: 'network loss' });
		await vi.advanceTimersByTimeAsync(5_000);
		expect(MockWebSocket.instances).toHaveLength(2);

		const second = MockWebSocket.at(1);
		second.emit('open', {});
		expect(client.getState().status).toBe('connected');

		// A close event can be followed by an error on the same socket.
		first.emit('error', new Error('post-close failure'));
		first.emit('close', { code: 1006, reason: 'duplicate close' });
		await vi.advanceTimersByTimeAsync(60_000);

		expect(second.readyState).toBe(MockWebSocket.OPEN);
		expect(client.getState().status).toBe('connected');
		expect(client.getState().error).toBeNull();
		expect(MockWebSocket.instances).toHaveLength(2);

		client.destroy();
	});

	it('keeps the fresh socket alive when expiry frames race the handoff', async () => {
		const onTokenRefresh = vi.fn().mockResolvedValue('fresh-token');
		const client = createClient({ onTokenRefresh });

		client.connect();
		const first = MockWebSocket.at(0);
		first.emit('open', {});
		first.deliver(tokenExpiredFrame);
		await flush();

		const second = MockWebSocket.at(1);
		second.emit('open', {});

		// A second expiry frame that was already in the old socket's buffer must
		// not drive another refresh — nor reach the socket that replaced it.
		first.deliver({ ...tokenExpiredFrame, id: 'sub-2' });
		await flush();

		expect(onTokenRefresh).toHaveBeenCalledTimes(1);
		expect(MockWebSocket.instances).toHaveLength(2);
		expect(second.readyState).toBe(MockWebSocket.OPEN);
		expect(client.getState().status).toBe('connected');

		client.destroy();
	});
});
