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
	
	// Event handlers
	onopen: any = null;
	onclose: any = null;
	onerror: any = null;
	onmessage: any = null;

	private listeners: Record<string, Function[]> = {};

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

	addEventListener(event: string, handler: Function) {
		if (!this.listeners[event]) this.listeners[event] = [];
		this.listeners[event].push(handler);
	}

	removeEventListener(event: string, handler: Function) {
		if (!this.listeners[event]) return;
		this.listeners[event] = this.listeners[event].filter(h => h !== handler);
	}

	dispatchEvent(event: any) {
		const type = event.type;
		if (this.listeners[type]) {
			this.listeners[type].forEach(handler => handler(event));
		}
		if (type === 'open' && this.onopen) this.onopen(event);
		if (type === 'close' && this.onclose) this.onclose(event);
		if (type === 'error' && this.onerror) this.onerror(event);
		if (type === 'message' && this.onmessage) this.onmessage(event);
		return true;
	}
}

describe('WebSocketClient', () => {
	let originalWebSocket: any;

	beforeEach(() => {
		vi.useFakeTimers();
		originalWebSocket = globalThis.WebSocket;
		globalThis.WebSocket = MockWebSocket as any;
	});

	afterEach(() => {
		vi.clearAllMocks();
		vi.useRealTimers();
		globalThis.WebSocket = originalWebSocket;
	});

	describe('connect', () => {
		it('connects to websocket server', async () => {
			const client = new WebSocketClient({ url: 'wss://example.com/ws' });
			const openHandler = vi.fn();
			client.on('open', openHandler);

			client.connect();
			expect(client.getState().status).toBe('connecting');

			await vi.advanceTimersByTimeAsync(20);

			expect(client.getState().status).toBe('connected');
			expect(openHandler).toHaveBeenCalled();
		});

		it('handles connection failure', async () => {
			// Mock failure
			globalThis.WebSocket = class FailingWebSocket extends MockWebSocket {
				constructor(url: string) {
					super(url);
					throw new Error('Connection failed');
				}
			} as any;

			const client = new WebSocketClient({ url: 'wss://example.com/ws' });
			const errorHandler = vi.fn();
			client.on('error', errorHandler);

			client.connect();

			expect(errorHandler).toHaveBeenCalled();
			expect(client.getState().error).toBeDefined();
		});
	});

	describe('communication', () => {
		it('sends messages', async () => {
			const client = new WebSocketClient({ url: 'wss://example.com/ws' });
			client.connect();
			await vi.advanceTimersByTimeAsync(20);

			// We need to access the socket instance to verify send
			// Since it's private, we can't easily access it.
			// But we know MockWebSocket.send is a spy.
			// We can spy on the prototype? 
			// Or just assume if no error it worked?
			// Better: MockWebSocket instance is created inside. We need to capture it.
			
			// Let's capture the instance
			let socketInstance: MockWebSocket;
			globalThis.WebSocket = class CapturingWebSocket extends MockWebSocket {
				constructor(url: string) {
					super(url);
					socketInstance = this;
				}
			} as any;

			// Re-connect with capturing
			const client2 = new WebSocketClient({ url: 'wss://example.com/ws' });
			client2.connect();
			await vi.advanceTimersByTimeAsync(20);

			client2.send({ type: 'test', data: 'foo' });

			expect(socketInstance!.send).toHaveBeenCalled();
			const sentData = JSON.parse(socketInstance!.send.mock.calls[0][0] as string);
			expect(sentData.type).toBe('test');
			expect(sentData.data).toBe('foo');
		});

		it('receives messages', async () => {
			let socketInstance: MockWebSocket;
			globalThis.WebSocket = class CapturingWebSocket extends MockWebSocket {
				constructor(url: string) {
					super(url);
					socketInstance = this;
				}
			} as any;

			const client = new WebSocketClient({ url: 'wss://example.com/ws' });
			const messageHandler = vi.fn();
			client.on('message', messageHandler);

			client.connect();
			await vi.advanceTimersByTimeAsync(20);

			const msg = { type: 'test', data: 'bar' };
			socketInstance!.dispatchEvent({ type: 'message', data: JSON.stringify(msg) });

			expect(messageHandler).toHaveBeenCalled();
			// messageHandler receives the whole message object
			expect(messageHandler.mock.calls[0][0].type).toBe('message'); // The event type
			// Wait, the client emits 'message' event with the parsed message data?
			// Let's check handleMessage in WebSocketClient.ts:
			// this.emit('message', message);
			// So the event passed to handler is { type: 'message', data: message, error: undefined }
			
			expect(messageHandler.mock.calls[0][0].data).toEqual(msg);
		});
	});

	describe('heartbeat', () => {
		it('sends pings and handles timeouts', async () => {
			const client = new WebSocketClient({ 
				url: 'wss://example.com/ws',
				heartbeatInterval: 100,
				heartbeatTimeout: 50
			});

			let socketInstance: MockWebSocket;
			globalThis.WebSocket = class CapturingWebSocket extends MockWebSocket {
				constructor(url: string) {
					super(url);
					socketInstance = this;
				}
			} as any;

			client.connect();
			await vi.advanceTimersByTimeAsync(20);

			// Advance to trigger ping
			await vi.advanceTimersByTimeAsync(100);
			expect(socketInstance!.send).toHaveBeenCalled();
			const pingMsg = JSON.parse(socketInstance!.send.mock.calls[0][0] as string);
			expect(pingMsg.type).toBe('ping');

			// Advance to trigger timeout
			await vi.advanceTimersByTimeAsync(50);
			
			// Should have closed due to timeout
			expect(socketInstance!.close).toHaveBeenCalled();
			expect(client.getState().error?.message).toBe('Heartbeat timeout');
		});
	});

	describe('reconnection', () => {
		it('reconnects automatically', async () => {
			const client = new WebSocketClient({ 
				url: 'wss://example.com/ws',
				initialReconnectDelay: 50,
				maxReconnectAttempts: 2
			});

			let socketInstance: MockWebSocket;
			globalThis.WebSocket = class CapturingWebSocket extends MockWebSocket {
				constructor(url: string) {
					super(url);
					socketInstance = this;
				}
			} as any;

			client.connect();
			await vi.advanceTimersByTimeAsync(20);
			expect(client.getState().status).toBe('connected');

			// Simulate connection close
			socketInstance!.close(1006);
			
			expect(client.getState().status).toBe('reconnecting');
			
			// Wait for reconnect delay (50ms base + jitter) + connection delay (10ms)
			await vi.advanceTimersByTimeAsync(100);
			
			expect(client.getState().status).toBe('connected');
			expect(client.getState().reconnectAttempts).toBe(0); // Reset on connect
		});
	});
});