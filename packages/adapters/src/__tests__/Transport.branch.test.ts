import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TransportManager } from '../TransportManager';
import { TransportFallback } from '../TransportFallback';
import { SseClient } from '../SseClient';
import { HttpPollingClient } from '../HttpPollingClient';
import type { TransportAdapter, WebSocketEventHandler } from '../types';

// Define a generic mock TransportAdapter class
class MockTransportAdapter implements TransportAdapter<any> {
	connect = vi.fn();
	disconnect = vi.fn();
	destroy = vi.fn();
	send = vi.fn();
	on = vi.fn((_event: string, _handler: WebSocketEventHandler) => vi.fn()); // Returns an unsubscribe function
	getState = vi.fn().mockReturnValue({ status: 'disconnected', error: null });
	type: string;

	constructor(type: string) {
		this.type = type;
	}
}

const { mockWebSocketClient, mockSseClient, mockPollingClient } = vi.hoisted(() => {
	return {
		mockWebSocketClient: vi.fn(),
		mockSseClient: vi.fn(),
		mockPollingClient: vi.fn(),
	};
});

// Mock transports
vi.mock('../WebSocketClient', () => ({ WebSocketClient: mockWebSocketClient }));
vi.mock('../SseClient', () => ({ SseClient: mockSseClient }));
vi.mock('../HttpPollingClient', () => ({ HttpPollingClient: mockPollingClient }));

describe('Transport Branch Coverage', () => {
	describe('TransportManager', () => {
		const mockStorage = {
			getItem: vi.fn((key: string) => (key === 'sse_last_event_id' ? 'initial-event-id' : null)),
			setItem: vi.fn(),
			removeItem: vi.fn(),
			clear: vi.fn(),
			length: 0,
			key: vi.fn(),
		};

		const baseConfig = {
			websocket: {
				url: 'wss://example.com',
				storage: mockStorage,
				lastEventIdStorageKey: 'sse_last_event_id',
			},
			sse: {
				url: 'https://example.com',
				storage: mockStorage,
				lastEventIdStorageKey: 'sse_last_event_id',
			},
			polling: {
				url: 'https://example.com',
				storage: mockStorage,
				lastEventIdStorageKey: 'sse_last_event_id',
			},
		};

		beforeEach(() => {
			vi.clearAllMocks();
			// Ensure constructor mocks return fresh instances of our MockTransportAdapter
			mockWebSocketClient.mockImplementation(function () {
				return new MockTransportAdapter('websocket');
			});
			mockSseClient.mockImplementation(function () {
				return new MockTransportAdapter('sse');
			});
			mockPollingClient.mockImplementation(function () {
				return new MockTransportAdapter('polling');
			});

			vi.spyOn(TransportManager, 'getFeatureSupport').mockReturnValue({
				websocket: true,
				sse: true,
				polling: true,
			});

			// Mock localStorage for TransportManager
			vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('initial-event-id');
		});
		// ... [lines skipped]
		it('should throw if connecting when destroyed', () => {
			const manager = new TransportManager(baseConfig);
			manager.destroy();
			expect(() => manager.connect()).toThrow('destroyed');
		});

		it('should throw if no transports supported', () => {
			vi.spyOn(TransportManager, 'getFeatureSupport').mockReturnValue({
				websocket: false,
				sse: false,
				polling: false,
			});
			const manager = new TransportManager(baseConfig);
			expect(() => manager.connect()).toThrow('No supported transports');
		});

		it('should handle getState with varying transport state types', () => {
			const manager = new TransportManager(baseConfig);
			manager.connect();

			// Get the instance that was created
			const createdInstance = mockWebSocketClient.mock.results[0]?.value;
			if (!createdInstance) {
				// Check if it threw
				if (mockWebSocketClient.mock.results[0]?.type === 'throw') {
					throw mockWebSocketClient.mock.results[0].value;
				}
				throw new Error('No WebSocketClient instance created');
			}

			// Configure the instance that is actually being used
			createdInstance.getState.mockReturnValueOnce({
				latency: null,
				lastEventId: 'id',
				status: 'connected',
			});
			createdInstance.getState.mockReturnValueOnce('string' as any);

			// First getState call, latency should be null as per mock
			const state1 = manager.getState();
			expect(state1.latency).toBeNull();
			expect(state1.lastEventId).toBe('id');

			// Second getState call, after mock returns string, latency should fallback to manager's state
			// Expect to fetch the manager's internal state which is 'initial-event-id'
			const state2 = manager.getState();
			expect(state2.latency).toBeNull();
			expect(state2.lastEventId).toBe('initial-event-id');
		});
	});

	describe('TransportFallback', () => {
		const baseConfig = {
			primary: { url: 'https://example.com/sse' },
			fallback: { url: 'https://example.com/poll' },
		};

		beforeEach(() => {
			vi.clearAllMocks();
			(SseClient as any).mockImplementation(function () {
				return new MockTransportAdapter('sse');
			});
			(SseClient as any).isSupported = vi.fn().mockReturnValue(true);
			(HttpPollingClient as any).mockImplementation(function () {
				return new MockTransportAdapter('polling');
			});
		});

		it('should handle manual mode retry on instantiation failure', () => {
			const fallback = new TransportFallback({ ...baseConfig, autoFallback: false });

			// Mock constructor to fail once then succeed
			let count = 0;
			(SseClient as any).mockImplementation(function () {
				count++;
				if (count === 1) throw new Error('Transient error');
				return new MockTransportAdapter('sse');
			});

			// Should succeed on second try internal logic
			fallback.connect();
			expect(SseClient).toHaveBeenCalledTimes(2);
		});

		it('should throw on second instantiation failure in manual mode', () => {
			const fallback = new TransportFallback({ ...baseConfig, autoFallback: false });

			(SseClient as any).mockImplementation(function () {
				throw new Error('Persistent error');
			});

			expect(() => fallback.connect()).toThrow('Persistent error');
		});

		it('should return disconnected state if no transport active', () => {
			const fallback = new TransportFallback(baseConfig);
			const state = fallback.getState();
			expect(state.status).toBe('disconnected');
			expect(state.transport).toBeNull();
		});

		it('should identify fallback conditions correctly', () => {
			const fallback = new TransportFallback(baseConfig);
			fallback.connect(); // Connects SSE

			const mockSse = (SseClient as any).mock.results[0].value;
			const errorCallback = mockSse.on.mock.calls.find((c: any) => c[0] === 'error')[1];

			// Trigger random error -> NO fallback
			errorCallback({ error: new Error('Random error') });
			expect(HttpPollingClient).not.toHaveBeenCalled();

			// Trigger 404 -> Fallback
			errorCallback({ error: new Error('404 Not Found') });
			expect(HttpPollingClient).toHaveBeenCalled();
		});

		it('should send message via current transport', () => {
			const fallback = new TransportFallback(baseConfig);
			fallback.connect();

			const mockSse = (SseClient as any).mock.results[0].value;
			mockSse.send = vi.fn();

			fallback.send('hello');
			expect(mockSse.send).toHaveBeenCalledWith('hello');
		});

		it('should throw if send not supported', () => {
			const fallback = new TransportFallback(baseConfig);
			fallback.connect();

			const mockSse = (SseClient as any).mock.results[0].value;
			mockSse.send = undefined;

			expect(() => fallback.send('hello')).toThrow('does not support');
		});
	});
});
