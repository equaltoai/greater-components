import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	WebSocketPool,
	resetGlobalWebSocketPool,
	getGlobalWebSocketPool,
} from '../WebSocketPool.js';

describe('WebSocketPool Coverage', () => {
	let pool: WebSocketPool;

	beforeEach(() => {
		vi.useFakeTimers();
		resetGlobalWebSocketPool();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Connection Management', () => {
		it('throws when pool exhausted and no LRU candidate', async () => {
			pool = new WebSocketPool({ maxConnections: 1 });

			const mockConn = {
				url: 'ws://1',
				state: 'connected',
				refCount: 1,
				lastActivity: Date.now(),
				reconnectAttempts: 0,
				socket: { close: vi.fn(), send: vi.fn(), readyState: 1 },
			};

			vi.spyOn(pool as any, 'createConnection').mockImplementation(async (url) => {
				const conn = { ...mockConn, url };
				(pool as any).connections.set(url, conn);
				return conn;
			});

			await pool.acquire('ws://1');

			await expect(pool.acquire('ws://2')).rejects.toThrow('WebSocket pool exhausted');
		});

		it('evicts LRU connection logic', async () => {
			pool = new WebSocketPool({ maxConnections: 1 });

			const mockSocket1 = { close: vi.fn(), send: vi.fn(), readyState: 1 };
			const mockConn1 = {
				url: 'ws://1',
				state: 'connected',
				refCount: 0,
				lastActivity: Date.now() - 1000,
				reconnectAttempts: 0,
				socket: mockSocket1,
			};
			(pool as any).connections.set('ws://1', mockConn1);

			const result = (pool as any).evictLRU();

			expect(result).toBe(true);
			expect(mockSocket1.close).toHaveBeenCalled();
			expect((pool as any).connections.has('ws://1')).toBe(false);
		});

		it('handles connection timeout', async () => {
			pool = new WebSocketPool({ connectionTimeout: 100 });

			vi.spyOn(pool as any, 'createConnection').mockRejectedValue(
				new Error('WebSocket connection timeout')
			);

			await expect(pool.acquire('ws://timeout')).rejects.toThrow('WebSocket connection timeout');
		});
	});

	describe('Lifecycle & Errors', () => {
		it('cleans up idle connections logic', async () => {
			pool = new WebSocketPool({ idleTimeout: 100 });

			const mockSocket = { close: vi.fn(), readyState: 1 };
			const mockConn = {
				url: 'ws://idle',
				state: 'connected',
				refCount: 0,
				lastActivity: Date.now() - 200, // Past idle timeout
				socket: mockSocket,
			};
			(pool as any).connections.set('ws://idle', mockConn);

			(pool as any).cleanupIdleConnections();

			expect(mockSocket.close).toHaveBeenCalled();
		});
	});

	describe('Heartbeat & Messages', () => {
		it('sends heartbeat', async () => {
			pool = new WebSocketPool({ heartbeatInterval: 1000 });

			const mockSocket = { send: vi.fn(), readyState: 1 };
			const mockConn = {
				url: 'ws://heartbeat',
				state: 'connected',
				refCount: 1,
				socket: mockSocket,
				heartbeatId: undefined,
			};

			vi.spyOn(pool as any, 'createConnection').mockImplementation(async (url) => {
				(pool as any).connections.set(url, mockConn);
				return mockConn;
			});

			await pool.acquire('ws://heartbeat');

			(pool as any).setupHeartbeat(mockConn);

			await vi.advanceTimersByTimeAsync(1000);

			expect(mockSocket.send).toHaveBeenCalledWith(expect.stringContaining('ping'));
		});
	});

	describe('Global Pool', () => {
		it('reuses global instance', () => {
			const p1 = getGlobalWebSocketPool();
			const p2 = getGlobalWebSocketPool();
			expect(p1).toBe(p2);
		});

		it('resets global instance', () => {
			const p1 = getGlobalWebSocketPool();
			resetGlobalWebSocketPool();
			const p2 = getGlobalWebSocketPool();
			expect(p1).not.toBe(p2);
		});
	});

	describe('Public API', () => {
		it('send throws if no connection', () => {
			pool = new WebSocketPool();
			expect(() => pool.send('ws://none', 'test')).toThrow('No connection found');
		});

		it('send throws if connection not ready', async () => {
			pool = new WebSocketPool();
			const mockConn = { state: 'connecting', socket: {} };
			(pool as any).connections.set('ws://not-ready', mockConn);
			expect(() => pool.send('ws://not-ready', 'test')).toThrow('Connection not ready');
		});
	});
});
