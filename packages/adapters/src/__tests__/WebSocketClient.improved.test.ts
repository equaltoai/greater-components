import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WebSocketClient } from '../WebSocketClient';

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

	private listeners: Record<string, ((event: any) => void)[]> = {};

	constructor(url: string) {
		this.url = url;
		// Use a slight delay to simulate connection
		setTimeout(() => {
			if (this.readyState === MockWebSocket.CONNECTING) {
				this.readyState = MockWebSocket.OPEN;
				this.dispatchEvent({ type: 'open' });
			}
		}, 10);
	}

	send = vi.fn();
	close = vi.fn((code?: number, reason?: string) => {
		this.readyState = MockWebSocket.CLOSED;
		this.dispatchEvent({ type: 'close', code, reason });
	});

	addEventListener(event: string, handler: (event: any) => void) {
		if (!this.listeners[event]) this.listeners[event] = [];
		this.listeners[event].push(handler);
	}

	removeEventListener(event: string, handler: (event: any) => void) {
		if (!this.listeners[event]) return;
		this.listeners[event] = this.listeners[event].filter((h) => h !== handler);
	}

	dispatchEvent(event: any) {
		const type = event.type;
		if (this.listeners[type]) {
			this.listeners[type].forEach((handler) => handler(event));
		}
		if (type === 'open' && this.onopen) this.onopen(event);
		if (type === 'close' && this.onclose) this.onclose(event);
		if (type === 'error' && this.onerror) this.onerror(event);
		if (type === 'message' && this.onmessage) this.onmessage(event);
		return true;
	}
}

describe('WebSocketClient Improved Coverage', () => {
	let originalWebSocket: any;
	let socketInstance: MockWebSocket | null = null;

	beforeEach(() => {
		vi.useFakeTimers();
		originalWebSocket = globalThis.WebSocket;
		socketInstance = null;

		// Capture the socket instance
		globalThis.WebSocket = class CapturingWebSocket extends MockWebSocket {
			constructor(url: string) {
				super(url);
				// eslint-disable-next-line @typescript-eslint/no-this-alias
				socketInstance = this;
			}
		} as any;
	});

	afterEach(() => {
		vi.clearAllMocks();
		vi.useRealTimers();
		globalThis.WebSocket = originalWebSocket;
	});

	describe('Latency Sampling', () => {
		it('should send periodic pings for latency sampling', async () => {
			const client = new WebSocketClient({
				url: 'wss://example.com',
				enableLatencySampling: true,
				latencySamplingInterval: 1000,
			});

			client.connect();
			await vi.advanceTimersByTimeAsync(20); // connected

			// Clear previous calls (initial heartbeat might have sent a ping)
			socketInstance?.send.mockClear();

			// Advance time for sampling interval
			await vi.advanceTimersByTimeAsync(1000);

			expect(socketInstance?.send).toHaveBeenCalled();
			const msg = JSON.parse(socketInstance!.send.mock.calls[0]![0]);
			expect(msg.type).toBe('ping');
		});

		it('should handle latency sampling ping failure', async () => {
			const client = new WebSocketClient({
				url: 'wss://example.com',
				enableLatencySampling: true,
				latencySamplingInterval: 1000,
			});

			client.connect();
			await vi.advanceTimersByTimeAsync(20);

			socketInstance?.send.mockImplementationOnce(() => {
				throw new Error('Send failed');
			});

			// Advance time
			await vi.advanceTimersByTimeAsync(1000);

			// Should not crash, just log debug error (which we can't easily verify unless we spy logger)
			// But the test passing means it didn't throw
		});
	});

	describe('Explicit Disconnect', () => {
		it('should not reconnect if explicitly disconnected', async () => {
			const client = new WebSocketClient({
				url: 'wss://example.com',
				maxReconnectAttempts: 5,
			});

			client.connect();
			await vi.advanceTimersByTimeAsync(20);

			client.disconnect();

			expect(client.getState().status).toBe('disconnected');

			// Check if reconnect timer is scheduled (it shouldn't be)
			// Advance time a bit
			await vi.advanceTimersByTimeAsync(1000);
			expect(client.getState().status).toBe('disconnected');
		});
	});

	describe('Storage Logic', () => {
		it('should handle storage errors gracefully', async () => {
			const throwingStorage = {
				getItem: vi.fn().mockImplementation(() => {
					throw new Error('Storage error');
				}),
				setItem: vi.fn().mockImplementation(() => {
					throw new Error('Storage error');
				}),
				removeItem: vi.fn(),
				clear: vi.fn(),
				length: 0,
				key: vi.fn(),
			};

			const client = new WebSocketClient({
				url: 'wss://example.com',
				storage: throwingStorage,
				lastEventIdStorageKey: 'key',
			});

			// Should not throw on constructor (loadLastEventId)
			expect(client.getState().lastEventId).toBeNull();

			client.connect();
			await vi.advanceTimersByTimeAsync(20);

			// Simulate message with ID (trigger saveLastEventId)
			const msg = { id: '123', type: 'test' };
			socketInstance?.dispatchEvent({ type: 'message', data: JSON.stringify(msg) });

			// Should not throw
			expect(throwingStorage.setItem).toHaveBeenCalled();
		});
	});

	describe('Reconnection Branches', () => {
		it('should reconnect if connection fails during initial connect', async () => {
			// Mock failure for first connection only
			let attempts = 0;
			globalThis.WebSocket = class FlakyWebSocket extends MockWebSocket {
				constructor(url: string) {
					super(url);
					// eslint-disable-next-line @typescript-eslint/no-this-alias
					socketInstance = this;
					attempts++;
					if (attempts === 1) {
						setTimeout(() => {
							this.close(1006);
						}, 5);
					}
				}
			} as any;

			const client = new WebSocketClient({
				url: 'wss://example.com',
				maxReconnectAttempts: 2,
				initialReconnectDelay: 10,
			});

			client.connect();
			expect(client.getState().status).toBe('connecting');

			await vi.advanceTimersByTimeAsync(10); // First connection fails

			// Should be reconnecting
			// Note: state might be 'disconnected' briefly before 'reconnecting'

			await vi.advanceTimersByTimeAsync(20); // Reconnect timer + connection time

			expect(client.getState().status).toBe('connected');
		});

		it('should stop reconnecting if max attempts reached during initial connect', async () => {
			globalThis.WebSocket = class FailWebSocket extends MockWebSocket {
				constructor(url: string) {
					super(url);
					// eslint-disable-next-line @typescript-eslint/no-this-alias
					socketInstance = this;
					setTimeout(() => {
						this.close(1006);
					}, 5);
				}
			} as any;

			const client = new WebSocketClient({
				url: 'wss://example.com',
				maxReconnectAttempts: 1,
				initialReconnectDelay: 10,
				jitterFactor: 0,
			});

			client.connect();

			// Fail 1 (Initial) -> Retry 1
			await vi.advanceTimersByTimeAsync(20);

			// Fail 2 (Retry 1) -> Stop
			await vi.advanceTimersByTimeAsync(20);

			expect(client.getState().status).toBe('disconnected');
		});
	});
});
