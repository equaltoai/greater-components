import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WebSocketPool, resetGlobalWebSocketPool } from '../WebSocketPool';

// Mock WebSocket class
class MockWebSocket {
	static OPEN = 1;
	static CLOSED = 3;
	static CONNECTING = 0;
	static CLOSING = 2;

	url: string;
	readyState: number = MockWebSocket.CONNECTING;

	onopen: any = null;
	onclose: any = null;
	onerror: any = null;
	onmessage: any = null;

	constructor(url: string) {
		this.url = url;
		// Simulate connection
		setTimeout(() => {
			if (this.readyState === MockWebSocket.CONNECTING) {
				this.readyState = MockWebSocket.OPEN;
				if (this.onopen) this.onopen();
			}
		}, 10);
	}

	send = vi.fn();
	close = vi.fn(() => {
		this.readyState = MockWebSocket.CLOSED;
		if (this.onclose) this.onclose();
	});
}

describe('WebSocketPool', () => {
	let originalWebSocket: any;

	beforeEach(() => {
		vi.useFakeTimers();
		originalWebSocket = globalThis.WebSocket;
		globalThis.WebSocket = MockWebSocket as any;
		resetGlobalWebSocketPool();
	});

	afterEach(() => {
		vi.clearAllMocks();
		vi.useRealTimers();
		globalThis.WebSocket = originalWebSocket;
		resetGlobalWebSocketPool();
	});

	describe('acquire', () => {
		it('creates new connection if none exists', async () => {
			const pool = new WebSocketPool();
			const promise = pool.acquire('wss://example.com/1');

			await vi.advanceTimersByTimeAsync(200);
			const conn = await promise;

			expect(conn).toBeDefined();
			expect(conn.url).toBe('wss://example.com/1');
			expect(conn.state).toBe('connected');
			expect(conn.refCount).toBe(1);
		});

		it('reuses existing connection', async () => {
			const pool = new WebSocketPool();
			const promise1 = pool.acquire('wss://example.com/1');
			await vi.advanceTimersByTimeAsync(200);
			const conn1 = await promise1;

			const promise2 = pool.acquire('wss://example.com/1');
			// Reuse should be immediate, but acquire is async
			await vi.advanceTimersByTimeAsync(0);
			const conn2 = await promise2;

			expect(conn1).toBe(conn2);
			expect(conn1.refCount).toBe(2);
		});

		it('limits max connections', async () => {
			const pool = new WebSocketPool({ maxConnections: 1 });

			// First connection
			const p1 = pool.acquire('wss://example.com/1');
			await vi.advanceTimersByTimeAsync(200);
			await p1;

			// Second connection (different URL)
			// Should fail because limit reached and no idle connections
			const p2 = pool.acquire('wss://example.com/2');
			await expect(p2).rejects.toThrow('WebSocket pool exhausted');
		});

		it('evicts idle connection to make room', async () => {
			const pool = new WebSocketPool({ maxConnections: 1 });

			// First connection
			const p1 = pool.acquire('wss://example.com/1');
			await vi.advanceTimersByTimeAsync(200);
			const conn1 = await p1;

			// Release first connection (make it idle)
			pool.release('wss://example.com/1');
			expect(conn1.refCount).toBe(0);

			// Advance time so lastActivity is older than current time
			await vi.advanceTimersByTimeAsync(10);

			// Second connection should evict the first one
			const p2 = pool.acquire('wss://example.com/2');
			await vi.advanceTimersByTimeAsync(200);
			const conn2 = await p2;

			expect(conn2.url).toBe('wss://example.com/2');
			expect(pool.getStats().activeConnections).toBe(1);
		});
	});

	describe('release', () => {
		it('decrements ref count', async () => {
			const pool = new WebSocketPool();
			const p1 = pool.acquire('wss://example.com/1');
			await vi.advanceTimersByTimeAsync(200);
			const conn = await p1;

			expect(conn.refCount).toBe(1);
			pool.release('wss://example.com/1');
			expect(conn.refCount).toBe(0);
		});
	});

	describe('messaging', () => {
		it('sends messages', async () => {
			const pool = new WebSocketPool();
			const p1 = pool.acquire('wss://example.com/1');
			await vi.advanceTimersByTimeAsync(200);
			const conn = await p1;

			pool.send('wss://example.com/1', 'test');
			expect(conn.socket.send).toHaveBeenCalledWith('test');
		});

		it('receives messages', async () => {
			const pool = new WebSocketPool();
			const p1 = pool.acquire('wss://example.com/1');
			await vi.advanceTimersByTimeAsync(200);
			const conn = await p1;

			const handler = vi.fn();
			pool.subscribe('wss://example.com/1', handler);

			// Simulate message
			const msgEvent = { data: 'hello' };
			if (conn.socket.onmessage) {
				conn.socket.onmessage(msgEvent as any);
			}

			expect(handler).toHaveBeenCalledWith(msgEvent);
		});
	});

	describe('cleanup', () => {
		it('cleans up idle connections automatically', async () => {
			const pool = new WebSocketPool({
				idleTimeout: 100,
			});

			// Setup periodic check (need to advance timer for setInterval)

			const p1 = pool.acquire('wss://example.com/1');
			await vi.advanceTimersByTimeAsync(200);
			await p1;
			pool.release('wss://example.com/1');

			// Advance time past idle timeout + check interval
			await vi.advanceTimersByTimeAsync(60000 + 200);

			expect(pool.getStats().totalConnections).toBe(0);
		});
	});
});
