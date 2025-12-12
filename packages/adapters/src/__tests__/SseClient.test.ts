import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SseClient } from '../SseClient';

// Mock EventSource
class MockEventSource {
	static OPEN = 1;
	static CLOSED = 2;
	static CONNECTING = 0;

	url: string;
	readyState: number = MockEventSource.CONNECTING;
	
	// Event handlers
	onopen: any = null;
	onerror: any = null;
	onmessage: any = null;

	private listeners: Record<string, Function[]> = {};

	constructor(url: string, init?: EventSourceInit) {
		this.url = url;
		// Use a slight delay to simulate connection
		setTimeout(() => {
			if (this.readyState === MockEventSource.CONNECTING) {
				this.readyState = MockEventSource.OPEN;
				this.dispatchEvent({ type: 'open' });
			}
		}, 10);
	}

	close = vi.fn(() => {
		this.readyState = MockEventSource.CLOSED;
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
		if (type === 'error' && this.onerror) this.onerror(event);
		if (type === 'message' && this.onmessage) this.onmessage(event);
		return true;
	}
}

describe('SseClient', () => {
	let originalEventSource: any;
	let mockFetch: any;

	beforeEach(() => {
		vi.useFakeTimers();
		vi.clearAllMocks();

		originalEventSource = globalThis.EventSource;
		globalThis.EventSource = MockEventSource as any;

		mockFetch = vi.fn();
		globalThis.fetch = mockFetch;
	});

	afterEach(() => {
		vi.runOnlyPendingTimers();
		vi.useRealTimers();
		globalThis.EventSource = originalEventSource;
	});

	describe('constructor', () => {
		it('creates client with default config', () => {
			const client = new SseClient({ url: 'https://example.com/sse' });
			const state = client.getState();

			expect(state.status).toBe('disconnected');
			expect(state.error).toBeNull();
		});
	});

	describe('connect (EventSource)', () => {
		it('connects using EventSource when no custom headers', async () => {
			const client = new SseClient({ url: 'https://example.com/sse' });
			const openHandler = vi.fn();
			client.on('open', openHandler);

			client.connect();
			expect(client.getState().status).toBe('connecting');

			await vi.advanceTimersByTimeAsync(20);

			expect(client.getState().status).toBe('connected');
			expect(openHandler).toHaveBeenCalled();
		});

		it('adds auth token to query params', async () => {
			let createdUrl = '';
			globalThis.EventSource = class CapturingEventSource extends MockEventSource {
				constructor(url: string) {
					super(url);
					createdUrl = url;
				}
			} as any;

			const client = new SseClient({ 
				url: 'https://example.com/sse',
				authToken: 'test-token' 
			});

			client.connect();
			
			expect(createdUrl).toContain('token=test-token');
		});

		it('handles connection error', async () => {
			globalThis.EventSource = class FailingEventSource extends MockEventSource {
				constructor(url: string) {
					super(url);
					setTimeout(() => {
						this.dispatchEvent({ type: 'error' });
					}, 10);
				}
			} as any;

			const client = new SseClient({ url: 'https://example.com/sse' });
			const errorHandler = vi.fn();
			client.on('error', errorHandler);

			client.connect();
			await vi.advanceTimersByTimeAsync(20);

			expect(errorHandler).toHaveBeenCalled();
			expect(client.getState().error).toBeDefined();
		});
	});

	describe('connect (Fetch polyfill)', () => {
		it('connects using fetch when custom headers present', async () => {
			const stream = new ReadableStream({
				start(controller) {
					controller.enqueue(new TextEncoder().encode('data: {"type":"open"}\n\n'));
				}
			});

			mockFetch.mockResolvedValue({
				ok: true,
				body: stream,
				headers: new Headers()
			});

			const client = new SseClient({ 
				url: 'https://example.com/sse',
				headers: { 'X-Custom': 'value' }
			});
			const openHandler = vi.fn();
			client.on('open', openHandler);

			client.connect();
			
			expect(mockFetch).toHaveBeenCalled();
			expect(mockFetch.mock.calls[0][1].headers).toHaveProperty('X-Custom', 'value');

			// Processing loop needs to run
			await vi.advanceTimersByTimeAsync(0); // Allow promise resolution

			expect(client.getState().status).toBe('connected');
			expect(openHandler).toHaveBeenCalled();
		});

		it('handles fetch errors', async () => {
			mockFetch.mockRejectedValue(new Error('Fetch failed'));

			const client = new SseClient({ 
				url: 'https://example.com/sse',
				headers: { 'X-Custom': 'value' }
			});
			const errorHandler = vi.fn();
			client.on('error', errorHandler);

			client.connect();
			await vi.advanceTimersByTimeAsync(0);

			expect(errorHandler).toHaveBeenCalled();
			expect(client.getState().error).toBeDefined();
		});
	});

	describe('message handling', () => {
		it('processes standard SSE messages', async () => {
			let esInstance: MockEventSource;
			globalThis.EventSource = class CapturingEventSource extends MockEventSource {
				constructor(url: string) {
					super(url);
					esInstance = this;
				}
			} as any;

			const client = new SseClient({ url: 'https://example.com/sse' });
			const messageHandler = vi.fn();
			client.on('message', messageHandler);

			client.connect();
			await vi.advanceTimersByTimeAsync(20);

			const msg = { foo: 'bar' };
			const event = new MessageEvent('message', { data: JSON.stringify(msg) });
			esInstance!.dispatchEvent(event);

			expect(messageHandler).toHaveBeenCalled();
			expect(messageHandler.mock.calls[0][0].data).toEqual({ ...msg, type: 'message' });
		});

		it('handles typed events', async () => {
			const client = new SseClient({ url: 'https://example.com/sse' });
			const customHandler = vi.fn();
			client.on('custom', customHandler);

			client.connect();
			await vi.advanceTimersByTimeAsync(20);

			// We need to inject a message that simulates typed event
			// SseClient handles standard message event where data contains 'type'
			// OR it listens to custom events on EventSource
			
			// Let's test data-embedded type first
			let esInstance: MockEventSource;
			globalThis.EventSource = class CapturingEventSource extends MockEventSource {
				constructor(url: string) {
					super(url);
					esInstance = this;
				}
			} as any;
			
			// Re-connect to capture
			const client2 = new SseClient({ url: 'https://example.com/sse' });
			client2.on('custom', customHandler);
			client2.connect();
			await vi.advanceTimersByTimeAsync(20);

			const msg = { type: 'custom', data: 'foo' };
			const event = new MessageEvent('message', { data: JSON.stringify(msg) });
			esInstance!.dispatchEvent(event);

			expect(customHandler).toHaveBeenCalled();
			expect(customHandler.mock.calls[0][0].data).toBe('foo');
		});
	});

	describe('reconnection', () => {
		it('reconnects automatically', async () => {
			const client = new SseClient({ 
				url: 'https://example.com/sse',
				initialReconnectDelay: 50,
				maxReconnectAttempts: 2
			});

			let esInstance: MockEventSource;
			globalThis.EventSource = class CapturingEventSource extends MockEventSource {
				constructor(url: string) {
					super(url);
					esInstance = this;
				}
			} as any;

			client.connect();
			await vi.advanceTimersByTimeAsync(20);
			expect(client.getState().status).toBe('connected');

			// Simulate error
			esInstance!.close(); // Ensure readyState is CLOSED
			esInstance!.dispatchEvent({ type: 'error' });
			
			// SseClient doesn't listen to 'close', but 'error'. 
			// In handleError:
			// if (this.eventSource?.readyState === EventSource.CLOSED) { this.handleClose(); }
			// So we need to ensure readyState is CLOSED. MockEventSource.close() sets it.

			expect(client.getState().status).toBe('reconnecting');
			
			// Wait for reconnect
			await vi.advanceTimersByTimeAsync(100);
			
			expect(client.getState().status).toBe('connected');
		});
	});

	describe('latency sampling', () => {
		it('sends ping via fetch when using EventSource', async () => {
			const client = new SseClient({ 
				url: 'https://example.com/sse',
				latencySamplingInterval: 100
			});

			client.connect();
			await vi.advanceTimersByTimeAsync(20);

			// Wait for sampling interval
			await vi.advanceTimersByTimeAsync(100);

			expect(mockFetch).toHaveBeenCalled();
			const url = mockFetch.mock.calls[0][0];
			expect(url).toContain('/ping');
		});
	});
});
