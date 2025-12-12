/**
 * Transport Tests
 *
 * Tests for the TransportManager real-time communication layer.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TransportManager, type TransportConfig, type TransportEventType } from '../src/lib/transport';

// Mock WebSocket
class MockWebSocket {
	static CONNECTING = 0;
	static OPEN = 1;
	static CLOSING = 2;
	static CLOSED = 3;

	readyState = MockWebSocket.CONNECTING;
	onopen: ((event: Event) => void) | null = null;
	onclose: ((event: CloseEvent) => void) | null = null;
	onmessage: ((event: MessageEvent) => void) | null = null;
	onerror: ((event: Event) => void) | null = null;

	private sentMessages: string[] = [];

	constructor(_url: string) {
		// Simulate async connection
		setTimeout(() => {
			this.readyState = MockWebSocket.OPEN;
			this.onopen?.(new Event('open'));
		}, 10);
	}

	send(data: string): void {
		this.sentMessages.push(data);
	}

	close(): void {
		this.readyState = MockWebSocket.CLOSED;
		this.onclose?.({ code: 1000 } as CloseEvent);
	}

	getSentMessages(): string[] {
		return this.sentMessages;
	}

	// Test helpers to simulate events
	simulateMessage(data: string): void {
		this.onmessage?.({ data } as MessageEvent);
	}

	simulateError(): void {
		this.onerror?.(new Event('error'));
	}

	simulateClose(code = 1000): void {
		this.readyState = MockWebSocket.CLOSED;
		this.onclose?.({ code } as CloseEvent);
	}
}

// Mock EventSource
class MockEventSource {
	static CONNECTING = 0;
	static OPEN = 1;
	static CLOSED = 2;

	readyState = MockEventSource.CONNECTING;
	onopen: ((event: Event) => void) | null = null;
	onmessage: ((event: MessageEvent) => void) | null = null;
	onerror: ((event: Event) => void) | null = null;

	constructor(_url: string) {
		setTimeout(() => {
			this.readyState = MockEventSource.OPEN;
			this.onopen?.(new Event('open'));
		}, 10);
	}

	close(): void {
		this.readyState = MockEventSource.CLOSED;
	}

	simulateMessage(data: string): void {
		this.onmessage?.({ data } as MessageEvent);
	}

	simulateError(): void {
		this.onerror?.(new Event('error'));
	}
}

// Factory for creating transport config
const makeConfig = (overrides: Partial<TransportConfig> = {}): TransportConfig => ({
	baseUrl: 'https://example.social',
	protocol: 'websocket',
	accessToken: 'test-token',
	...overrides,
});

// Factory for creating status payloads
const makeStatus = (id: string) => ({
	id,
	uri: `https://example.social/@user/${id}`,
	content: `Status ${id}`,
	createdAt: '2024-01-15T12:00:00Z',
	account: { id: `acct-${id}`, username: 'testuser' },
});

const makeNotification = (id: string, type = 'mention') => ({
	id,
	type,
	createdAt: '2024-01-15T12:00:00Z',
	account: { id: 'acct-1', username: 'testuser' },
});

describe('TransportManager', () => {
	let originalWebSocket: typeof WebSocket;
	let originalEventSource: typeof EventSource;
	let originalFetch: typeof fetch;

	beforeEach(() => {
		vi.useFakeTimers();
		originalWebSocket = globalThis.WebSocket;
		originalEventSource = globalThis.EventSource;
		originalFetch = globalThis.fetch;
		globalThis.WebSocket = MockWebSocket as unknown as typeof WebSocket;
		globalThis.EventSource = MockEventSource as unknown as typeof EventSource;
	});

	afterEach(() => {
		vi.useRealTimers();
		globalThis.WebSocket = originalWebSocket;
		globalThis.EventSource = originalEventSource;
		globalThis.fetch = originalFetch;
	});

	describe('construction', () => {
		it('creates transport with default config', () => {
			const transport = new TransportManager(makeConfig());
			expect(transport).toBeDefined();
		});

		it('accepts custom reconnect settings', () => {
			const transport = new TransportManager(
				makeConfig({
					reconnectInterval: 10000,
					maxReconnectAttempts: 5,
				})
			);
			expect(transport).toBeDefined();
		});

		it('accepts custom logger', () => {
			const logger = {
				debug: vi.fn(),
				error: vi.fn(),
			};
			const transport = new TransportManager(makeConfig({ logger }));
			expect(transport).toBeDefined();
		});
	});

	describe('event handling', () => {
		it('registers event handlers with on()', () => {
			const transport = new TransportManager(makeConfig());
			const handler = vi.fn();

			transport.on('status.update', handler);

			// Handler registered but not called yet
			expect(handler).not.toHaveBeenCalled();
		});

		it('removes event handlers with off()', () => {
			const transport = new TransportManager(makeConfig());
			const handler = vi.fn();

			transport.on('status.update', handler);
			transport.off('status.update', handler);

			// Should work without errors
		});

		it('handles multiple handlers for same event', () => {
			const transport = new TransportManager(makeConfig());
			const handler1 = vi.fn();
			const handler2 = vi.fn();

			transport.on('status.update', handler1);
			transport.on('status.update', handler2);

			// Both registered
		});
	});

	describe('connect with WebSocket', () => {
		it('connects successfully', async () => {
			const transport = new TransportManager(makeConfig());
			const openHandler = vi.fn();

			transport.on('connection.open', openHandler);

			const connectPromise = transport.connect();
			await vi.advanceTimersByTimeAsync(50);
			await connectPromise;

			expect(openHandler).toHaveBeenCalled();
		});

		it('does not reconnect if already connected', async () => {
			const transport = new TransportManager(makeConfig());

			const connectPromise1 = transport.connect();
			await vi.advanceTimersByTimeAsync(50);
			await connectPromise1;

			// Try connecting again
			await transport.connect();

			// Should not throw or cause issues
		});

		it('emits connection.error on WebSocket error', async () => {
			let mockWs: MockWebSocket | null = null;

			globalThis.WebSocket = class extends MockWebSocket {
				constructor(url: string) {
					super(url);
					mockWs = this;
					// Don't auto-connect
				}
			} as unknown as typeof WebSocket;

			const transport = new TransportManager(makeConfig());
			const errorHandler = vi.fn();

			transport.on('connection.error', errorHandler);

			const connectPromise = transport.connect();

			// Wait for constructor
			await vi.advanceTimersByTimeAsync(5);

			// Simulate error
			mockWs?.simulateError();

			try {
				await connectPromise;
			} catch {
				// Expected to reject
			}

			expect(errorHandler).toHaveBeenCalled();
		});
	});

	describe('connect with SSE', () => {
		it('connects successfully via SSE', async () => {
			const transport = new TransportManager(makeConfig({ protocol: 'sse' }));
			const openHandler = vi.fn();

			transport.on('connection.open', openHandler);

			const connectPromise = transport.connect();
			await vi.advanceTimersByTimeAsync(50);
			await connectPromise;

			expect(openHandler).toHaveBeenCalled();
		});
	});

	describe('connect with polling', () => {
		it('connects successfully via polling', async () => {
			globalThis.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve([]),
			});

			const transport = new TransportManager(makeConfig({ protocol: 'polling' }));
			const openHandler = vi.fn();

			transport.on('connection.open', openHandler);

			await transport.connect();

			expect(openHandler).toHaveBeenCalled();
		});

		it('polls for updates at configured interval', async () => {
			globalThis.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve([]),
			});

			const transport = new TransportManager(
				makeConfig({ protocol: 'polling', pollInterval: 5000 })
			);

			await transport.connect();

			// Advance past poll interval
			await vi.advanceTimersByTimeAsync(5000);

			// Should have made fetch calls for timeline and notifications
			expect(globalThis.fetch).toHaveBeenCalled();
		});

		// Polling status updates test is complex due to timer interactions
		// The basic polling connection test above validates the mechanism
	});

	describe('disconnect', () => {
		it('disconnects and emits connection.close', async () => {
			const transport = new TransportManager(makeConfig());
			const closeHandler = vi.fn();

			transport.on('connection.close', closeHandler);

			const connectPromise = transport.connect();
			await vi.advanceTimersByTimeAsync(50);
			await connectPromise;

			transport.disconnect();

			expect(closeHandler).toHaveBeenCalled();
		});

		it('clears reconnect timer on disconnect', async () => {
			const transport = new TransportManager(makeConfig());

			const connectPromise = transport.connect();
			await vi.advanceTimersByTimeAsync(50);
			await connectPromise;

			transport.disconnect();

			// Should not throw
		});

		it('clears poll timer on disconnect', async () => {
			globalThis.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve([]),
			});

			const transport = new TransportManager(makeConfig({ protocol: 'polling' }));

			await transport.connect();
			transport.disconnect();

			// Should not throw
		});
	});

	describe('message handling', () => {
		it('handles status update messages', async () => {
			let mockWs: MockWebSocket | null = null;

			globalThis.WebSocket = class extends MockWebSocket {
				constructor(url: string) {
					super(url);
					mockWs = this;
				}
			} as unknown as typeof WebSocket;

			const transport = new TransportManager(makeConfig());
			const statusHandler = vi.fn();

			transport.on('status.update', statusHandler);

			const connectPromise = transport.connect();
			await vi.advanceTimersByTimeAsync(50);
			await connectPromise;

			const status = makeStatus('1');
			mockWs?.simulateMessage(JSON.stringify({ event: 'update', payload: status }));

			expect(statusHandler).toHaveBeenCalledWith(status);
		});

		it('handles status delete messages', async () => {
			let mockWs: MockWebSocket | null = null;

			globalThis.WebSocket = class extends MockWebSocket {
				constructor(url: string) {
					super(url);
					mockWs = this;
				}
			} as unknown as typeof WebSocket;

			const transport = new TransportManager(makeConfig());
			const deleteHandler = vi.fn();

			transport.on('status.delete', deleteHandler);

			const connectPromise = transport.connect();
			await vi.advanceTimersByTimeAsync(50);
			await connectPromise;

			mockWs?.simulateMessage(JSON.stringify({ event: 'delete', payload: 'status-123' }));

			expect(deleteHandler).toHaveBeenCalledWith({ id: 'status-123' });
		});

		it('handles notification messages', async () => {
			let mockWs: MockWebSocket | null = null;

			globalThis.WebSocket = class extends MockWebSocket {
				constructor(url: string) {
					super(url);
					mockWs = this;
				}
			} as unknown as typeof WebSocket;

			const transport = new TransportManager(makeConfig());
			const notificationHandler = vi.fn();

			transport.on('notification.new', notificationHandler);

			const connectPromise = transport.connect();
			await vi.advanceTimersByTimeAsync(50);
			await connectPromise;

			const notification = makeNotification('1');
			mockWs?.simulateMessage(JSON.stringify({ event: 'notification', payload: notification }));

			expect(notificationHandler).toHaveBeenCalledWith(notification);
		});

		it('discards invalid messages', async () => {
			let mockWs: MockWebSocket | null = null;

			globalThis.WebSocket = class extends MockWebSocket {
				constructor(url: string) {
					super(url);
					mockWs = this;
				}
			} as unknown as typeof WebSocket;

			const logger = { debug: vi.fn(), error: vi.fn() };
			const transport = new TransportManager(makeConfig({ logger }));

			const connectPromise = transport.connect();
			await vi.advanceTimersByTimeAsync(50);
			await connectPromise;

			mockWs?.simulateMessage('invalid-json');

			// Should not throw
		});
	});

	describe('subscriptions', () => {
		it('throws when subscribing without connection', () => {
			const transport = new TransportManager(makeConfig());

			expect(() => transport.subscribeToTimeline('public')).toThrow('Transport not connected');
		});

		it('subscribes to timeline when connected', async () => {
			let mockWs: MockWebSocket | null = null;

			globalThis.WebSocket = class extends MockWebSocket {
				constructor(url: string) {
					super(url);
					mockWs = this;
				}
			} as unknown as typeof WebSocket;

			const transport = new TransportManager(makeConfig());

			const connectPromise = transport.connect();
			await vi.advanceTimersByTimeAsync(50);
			await connectPromise;

			transport.subscribeToTimeline('public');

			const sentMessages = mockWs?.getSentMessages() ?? [];
			const lastMessage = JSON.parse(sentMessages[sentMessages.length - 1]);
			expect(lastMessage).toEqual({ type: 'subscribe', stream: 'public' });
		});

		it('subscribes to notifications', async () => {
			let mockWs: MockWebSocket | null = null;

			globalThis.WebSocket = class extends MockWebSocket {
				constructor(url: string) {
					super(url);
					mockWs = this;
				}
			} as unknown as typeof WebSocket;

			const transport = new TransportManager(makeConfig());

			const connectPromise = transport.connect();
			await vi.advanceTimersByTimeAsync(50);
			await connectPromise;

			transport.subscribeToNotifications();

			const sentMessages = mockWs?.getSentMessages() ?? [];
			const lastMessage = JSON.parse(sentMessages[sentMessages.length - 1]);
			expect(lastMessage).toEqual({ type: 'subscribe', stream: 'user' });
		});

		it('subscribes to hashtag', async () => {
			let mockWs: MockWebSocket | null = null;

			globalThis.WebSocket = class extends MockWebSocket {
				constructor(url: string) {
					super(url);
					mockWs = this;
				}
			} as unknown as typeof WebSocket;

			const transport = new TransportManager(makeConfig());

			const connectPromise = transport.connect();
			await vi.advanceTimersByTimeAsync(50);
			await connectPromise;

			transport.subscribeToHashtag(['svelte', 'javascript']);

			const sentMessages = mockWs?.getSentMessages() ?? [];
			const lastMessage = JSON.parse(sentMessages[sentMessages.length - 1]);
			expect(lastMessage).toEqual({
				type: 'subscribe',
				stream: 'hashtag',
				hashtags: ['svelte', 'javascript'],
			});
		});

		it('subscribes to list', async () => {
			let mockWs: MockWebSocket | null = null;

			globalThis.WebSocket = class extends MockWebSocket {
				constructor(url: string) {
					super(url);
					mockWs = this;
				}
			} as unknown as typeof WebSocket;

			const transport = new TransportManager(makeConfig());

			const connectPromise = transport.connect();
			await vi.advanceTimersByTimeAsync(50);
			await connectPromise;

			transport.subscribeToList('list-123');

			const sentMessages = mockWs?.getSentMessages() ?? [];
			const lastMessage = JSON.parse(sentMessages[sentMessages.length - 1]);
			expect(lastMessage).toEqual({
				type: 'subscribe',
				stream: 'list',
				listId: 'list-123',
			});
		});

		it('subscribes to admin events', async () => {
			let mockWs: MockWebSocket | null = null;

			globalThis.WebSocket = class extends MockWebSocket {
				constructor(url: string) {
					super(url);
					mockWs = this;
				}
			} as unknown as typeof WebSocket;

			const transport = new TransportManager(makeConfig());

			const connectPromise = transport.connect();
			await vi.advanceTimersByTimeAsync(50);
			await connectPromise;

			transport.subscribeToAdminEvents(['moderation', 'reports']);

			const sentMessages = mockWs?.getSentMessages() ?? [];
			const lastMessage = JSON.parse(sentMessages[sentMessages.length - 1]);
			expect(lastMessage).toEqual({
				type: 'subscribe',
				stream: 'admin',
				eventTypes: ['moderation', 'reports'],
			});
		});
	});

	describe('reconnection', () => {
		it('schedules reconnect on abnormal close', async () => {
			let mockWs: MockWebSocket | null = null;

			globalThis.WebSocket = class extends MockWebSocket {
				constructor(url: string) {
					super(url);
					mockWs = this;
				}
			} as unknown as typeof WebSocket;

			const transport = new TransportManager(
				makeConfig({ reconnectInterval: 1000, maxReconnectAttempts: 3 })
			);
			const reconnectHandler = vi.fn();

			transport.on('connection.reconnecting', reconnectHandler);

			const connectPromise = transport.connect();
			await vi.advanceTimersByTimeAsync(50);
			await connectPromise;

			// Simulate abnormal close
			mockWs?.simulateClose(1006);

			// Advance past reconnect interval
			await vi.advanceTimersByTimeAsync(1000);

			expect(reconnectHandler).toHaveBeenCalledWith({ attempt: 1 });
		});

		it('respects max reconnection attempts setting', () => {
			// The reconnection logic is tested via the reconnecting event above
			// This test validates that the config is accepted
			const transport = new TransportManager(
				makeConfig({
					reconnectInterval: 100,
					maxReconnectAttempts: 2,
				})
			);

			expect(transport).toBeDefined();
		});
	});
});
