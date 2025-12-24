import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WebSocketPool, resetGlobalWebSocketPool } from '../WebSocketPool';

// Mock WebSocket class with more control
class MockWebSocket {
	static OPEN = 1;
	static CLOSED = 3;
	static CONNECTING = 0;
	static CLOSING = 2;

	url: string;
	readyState: number = MockWebSocket.CONNECTING;

	onopen: (() => void) | null = null;
	onclose: ((event: any) => void) | null = null;
	onerror: ((error: any) => void) | null = null;
	onmessage: ((event: any) => void) | null = null;

	constructor(url: string) {
		this.url = url;
	}

	send = vi.fn();
	close = vi.fn(() => {
		this.readyState = MockWebSocket.CLOSED;
		if (this.onclose) this.onclose({ code: 1000, reason: 'Normal closure' });
	});
}

describe('WebSocketPool Improved Coverage', () => {
	let originalWebSocket: any;
	let mockSockets: MockWebSocket[] = [];

	beforeEach(() => {
		vi.useFakeTimers();
		originalWebSocket = globalThis.WebSocket;
		mockSockets = [];

		globalThis.WebSocket = class extends MockWebSocket {
			constructor(url: string) {
				super(url);
				mockSockets.push(this);
			}
		} as any;

		resetGlobalWebSocketPool();
	});

	afterEach(() => {
		vi.clearAllMocks();
		vi.useRealTimers();
		globalThis.WebSocket = originalWebSocket;
		resetGlobalWebSocketPool();
	});

	describe('Reconnection Logic', () => {
		it('should attempt to reconnect on unexpected close', async () => {
			const pool = new WebSocketPool({
				reconnectDelay: 100,
				maxReconnectAttempts: 2,
			});

			// Establish initial connection
			const promise = pool.acquire('wss://example.com/reconnect');
			const socket = mockSockets[0];
			if (!socket) throw new Error('Socket not found');

			// Simulate open
			socket.readyState = MockWebSocket.OPEN;
			if (socket.onopen) socket.onopen();

			// Need to advance timers to let waitForConnection polling finish
			await vi.advanceTimersByTimeAsync(200);
			const conn = await promise;
			expect(conn.state).toBe('connected');

			// Simulate unexpected close
			socket.readyState = MockWebSocket.CLOSED;
			if (socket.onclose) socket.onclose({ code: 1006, reason: 'Abnormal' });

			expect(conn.state).toBe('disconnected');

			// Should be waiting for reconnect delay
			await vi.advanceTimersByTimeAsync(100);

			// Should have created a new socket
			expect(mockSockets.length).toBe(2);
			const newSocket = mockSockets[1];
			if (!newSocket) throw new Error('New socket not found');
			expect(newSocket.url).toBe('wss://example.com/reconnect');
		});

		it('should stop reconnecting after max attempts', async () => {
			const pool = new WebSocketPool({
				reconnectDelay: 100,
				maxReconnectAttempts: 1,
			});

			const promise = pool.acquire('wss://example.com/max-attempts');
			const socket = mockSockets[0];
			if (!socket) throw new Error('Socket not found');

			socket.readyState = MockWebSocket.OPEN;
			if (socket.onopen) socket.onopen();

			await vi.advanceTimersByTimeAsync(200);
			const _conn = await promise;

			// First close -> Trigger Reconnect 1
			socket.readyState = MockWebSocket.CLOSED;
			if (socket.onclose) socket.onclose({ code: 1006 });

			await vi.advanceTimersByTimeAsync(100);
			expect(mockSockets.length).toBe(2);
			const retrySocket1 = mockSockets[1];
			if (!retrySocket1) throw new Error('Retry socket not found');

			// Let's simulate the retry failing to connect
			// To do this, we need to let the createConnection proceed to waitForConnection
			// But createConnection is async inside reconnect()

			// Wait for retry socket creation (already done above)

			// Now simulate retry failure
			retrySocket1.readyState = MockWebSocket.CLOSED;
			if (retrySocket1.onclose) retrySocket1.onclose({ code: 1006 });

			await vi.advanceTimersByTimeAsync(100);

			// Should NOT have created a 3rd socket
			expect(mockSockets.length).toBe(2);

			// The connection should still be in the pool but disconnected
			// (It gets cleaned up on next acquire or idle timeout)
			expect(pool.getStats().totalConnections).toBe(1);
		});
	});

	describe('Heartbeat Logic', () => {
		it('should send pings periodically', async () => {
			const pool = new WebSocketPool({
				heartbeatInterval: 1000,
			});

			const promise = pool.acquire('wss://example.com/heartbeat');
			const socket = mockSockets[0];
			if (!socket) throw new Error('Socket not found');

			socket.readyState = MockWebSocket.OPEN;
			if (socket.onopen) socket.onopen();

			await vi.advanceTimersByTimeAsync(200);
			await promise;

			// Advance time by heartbeat interval
			await vi.advanceTimersByTimeAsync(1000);

			expect(socket.send).toHaveBeenCalledWith(JSON.stringify({ type: 'ping' }));
		});

		it('should reconnect if heartbeat fails', async () => {
			const pool = new WebSocketPool({
				heartbeatInterval: 1000,
				reconnectDelay: 100,
			});

			const promise = pool.acquire('wss://example.com/heartbeat-fail');
			const socket = mockSockets[0];
			if (!socket) throw new Error('Socket not found');

			socket.readyState = MockWebSocket.OPEN;
			if (socket.onopen) socket.onopen();

			await vi.advanceTimersByTimeAsync(200);
			await promise;

			// Make send throw error
			socket.send.mockImplementation(() => {
				throw new Error('Network error');
			});

			// Trigger heartbeat
			await vi.advanceTimersByTimeAsync(1000);

			// Should have triggered reconnect
			// Reconnect logic: increment attempts, wait delay, create new connection
			await vi.advanceTimersByTimeAsync(100);

			expect(mockSockets.length).toBe(2);
		});
	});

	describe('Connection Timeout', () => {
		it('should timeout if connection takes too long', async () => {
			const pool = new WebSocketPool({
				connectionTimeout: 100,
			});

			// Create promise and immediately attach catch handler to capture rejection
			let error: Error | null = null;
			const promise = pool.acquire('wss://example.com/timeout').catch((e) => {
				error = e as Error;
			});
			// Do NOT open the socket

			// Advance time past timeout - this will trigger the rejection
			await vi.advanceTimersByTimeAsync(150);

			// Wait for the promise to settle
			await promise;

			expect(error).not.toBeNull();
			expect(error?.message).toBe('WebSocket connection timeout');
		});

		it('should fail immediately if socket closes while connecting', async () => {
			const pool = new WebSocketPool();

			// Create promise and immediately attach catch handler to capture rejection
			let error: Error | null = null;
			const promise = pool.acquire('wss://example.com/fail').catch((e) => {
				error = e as Error;
			});
			const socket = mockSockets[0];
			if (!socket) throw new Error('Socket not found');

			// Close immediately
			socket.readyState = MockWebSocket.CLOSED;
			// The waitForConnection polls readyState, so we just need to advance time slightly

			await vi.advanceTimersByTimeAsync(100); // Wait for polling check

			// Wait for the promise to settle
			await promise;

			expect(error).not.toBeNull();
			expect(error?.message).toBe('WebSocket connection failed');
		});
	});

	describe('Error Handling', () => {
		it('should handle handler errors gracefully', async () => {
			const pool = new WebSocketPool();
			const promise = pool.acquire('wss://example.com/handler-error');
			const socket = mockSockets[0];
			if (!socket) throw new Error('Socket not found');

			socket.readyState = MockWebSocket.OPEN;
			if (socket.onopen) socket.onopen();

			await vi.advanceTimersByTimeAsync(200);
			const _conn = await promise;

			const badHandler = vi.fn().mockImplementation(() => {
				throw new Error('Bad handler');
			});
			const goodHandler = vi.fn();

			pool.subscribe('wss://example.com/handler-error', badHandler);
			pool.subscribe('wss://example.com/handler-error', goodHandler);

			// Simulate message
			if (socket.onmessage) {
				socket.onmessage({ data: 'test' } as any);
			}

			expect(badHandler).toHaveBeenCalled();
			expect(goodHandler).toHaveBeenCalled(); // Should still call other handlers
		});

		it('should handle send errors', async () => {
			const pool = new WebSocketPool();
			const promise = pool.acquire('wss://example.com/send-error');
			const socket = mockSockets[0];
			if (!socket) throw new Error('Socket not found');

			socket.readyState = MockWebSocket.OPEN;
			if (socket.onopen) socket.onopen();

			await vi.advanceTimersByTimeAsync(200);
			await promise;

			// Force connection state to disconnected (internal state check in send)
			// But wait, send() checks `connection.state`.
			// Let's try to pass an invalid url first
			expect(() => pool.send('wss://bad-url', 'test')).toThrow('No connection found');

			// Now valid url but not connected
			// We need to access the connection object to mess with it?
			// Or just close the socket but don't tell the pool?
			// The pool updates state on close.

			// Let's assume we are connected but socket.send fails
			socket.send.mockImplementation(() => {
				throw new Error('Send failed');
			});

			expect(() => pool.send('wss://example.com/send-error', 'test')).toThrow('Send failed');
		});

		it('should throw if sending on a not connected socket', async () => {
			const pool = new WebSocketPool();
			const promise = pool.acquire('wss://example.com/not-connected');
			const socket = mockSockets[0];
			if (!socket) throw new Error('Socket not found');

			socket.readyState = MockWebSocket.OPEN;
			if (socket.onopen) socket.onopen();

			await vi.advanceTimersByTimeAsync(200);
			const conn = await promise;

			// Manually mess up state for testing
			conn.state = 'connecting';

			expect(() => pool.send('wss://example.com/not-connected', 'test')).toThrow(
				'Connection not ready'
			);
		});
	});

	describe('Lifecycle', () => {
		it('should close all connections', async () => {
			const pool = new WebSocketPool();
			const p1 = pool.acquire('wss://example.com/1');
			const s1 = mockSockets[0];
			if (!s1) throw new Error('Socket 1 not found');
			s1.readyState = MockWebSocket.OPEN;
			if (s1.onopen) s1.onopen();
			await vi.advanceTimersByTimeAsync(200); // connect
			await p1;

			const p2 = pool.acquire('wss://example.com/2');
			const s2 = mockSockets[1];
			if (!s2) throw new Error('Socket 2 not found');
			s2.readyState = MockWebSocket.OPEN;
			if (s2.onopen) s2.onopen();
			await vi.advanceTimersByTimeAsync(200); // connect
			await p2;

			pool.closeAll();

			expect(s1.close).toHaveBeenCalled();
			expect(s2.close).toHaveBeenCalled();
			expect(pool.getStats().totalConnections).toBe(0);
		});
	});
});
