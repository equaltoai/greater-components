import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TransportManager } from '../TransportManager';
import { WebSocketClient } from '../WebSocketClient';
import { SseClient } from '../SseClient';
import { HttpPollingClient } from '../HttpPollingClient';

// Mock transports
vi.mock('../WebSocketClient', () => ({
	WebSocketClient: vi.fn()
}));
vi.mock('../SseClient', () => ({
	SseClient: vi.fn()
}));
vi.mock('../HttpPollingClient', () => ({
	HttpPollingClient: vi.fn()
}));

describe('TransportManager', () => {
	const baseConfig = {
		websocket: { url: 'wss://example.com/ws' },
		sse: { url: 'https://example.com/sse' },
		polling: { url: 'https://example.com/poll' },
		logger: {
			info: vi.fn(),
			error: vi.fn(),
			warn: vi.fn(),
			debug: vi.fn(),
		},
	};

	let mockWsClient: any;
	let mockSseClient: any;
	let mockPollingClient: any;

	beforeEach(() => {
		vi.useFakeTimers();
		vi.clearAllMocks();

		// Helper to create mock transport
		const createMockTransport = (type: string) => ({
			connect: vi.fn(),
			disconnect: vi.fn(),
			destroy: vi.fn(),
			send: vi.fn(),
			on: vi.fn(() => vi.fn()),
			getState: vi.fn().mockReturnValue({ status: 'disconnected', error: null }),
			type
		});

		mockWsClient = createMockTransport('websocket');
		mockSseClient = createMockTransport('sse');
		mockPollingClient = createMockTransport('polling');

		(WebSocketClient as unknown as ReturnType<typeof vi.fn>).mockImplementation(function(this: any) { return mockWsClient; });
		(SseClient as unknown as ReturnType<typeof vi.fn>).mockImplementation(function(this: any) { return mockSseClient; });
		(HttpPollingClient as unknown as ReturnType<typeof vi.fn>).mockImplementation(function(this: any) { return mockPollingClient; });

		// Mock feature support by default all supported
		vi.spyOn(TransportManager, 'getFeatureSupport').mockReturnValue({
			websocket: true,
			sse: true,
			polling: true,
		});
	});

	afterEach(() => {
		vi.runOnlyPendingTimers();
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	describe('constructor', () => {
		it('initializes with default state', () => {
			const manager = new TransportManager(baseConfig);
			const state = manager.getState();

			expect(state.status).toBe('disconnected');
			expect(state.activeTransport).toBeNull();
			expect(state.failureCount).toBe(0);
		});

		it('detects transport priority', () => {
			const manager = new TransportManager(baseConfig);
			expect(manager.getState().transportPriority).toEqual(['websocket', 'sse', 'polling']);
		});
	});

	describe('connect', () => {
		it('connects using optimal transport (websocket)', () => {
			const manager = new TransportManager(baseConfig);
			manager.connect();

			expect(WebSocketClient).toHaveBeenCalled();
			expect(mockWsClient.connect).toHaveBeenCalled();
			expect(manager.getActiveTransport()).toBe('websocket');
		});

		it('connects using SSE if websocket not supported', () => {
			vi.spyOn(TransportManager, 'getFeatureSupport').mockReturnValue({
				websocket: false,
				sse: true,
				polling: true,
			});

			const manager = new TransportManager(baseConfig);
			manager.connect();

			expect(SseClient).toHaveBeenCalled();
			expect(mockSseClient.connect).toHaveBeenCalled();
			expect(manager.getActiveTransport()).toBe('sse');
		});

		it('connects using polling if websocket and SSE not supported', () => {
			vi.spyOn(TransportManager, 'getFeatureSupport').mockReturnValue({
				websocket: false,
				sse: false,
				polling: true,
			});

			const manager = new TransportManager(baseConfig);
			manager.connect();

			expect(HttpPollingClient).toHaveBeenCalled();
			expect(mockPollingClient.connect).toHaveBeenCalled();
			expect(manager.getActiveTransport()).toBe('polling');
		});

		it('respects forced transport', () => {
			const manager = new TransportManager({
				...baseConfig,
				forceTransport: 'polling'
			});
			manager.connect();

			expect(HttpPollingClient).toHaveBeenCalled();
			expect(manager.getActiveTransport()).toBe('polling');
		});

		it('throws if forced transport is not supported', () => {
			vi.spyOn(TransportManager, 'getFeatureSupport').mockReturnValue({
				websocket: true,
				sse: true,
				polling: false, // polling not supported
			});

			const manager = new TransportManager({
				...baseConfig,
				forceTransport: 'polling'
			});

			expect(() => manager.connect()).toThrow('not supported');
		});
	});

	describe('fallback', () => {
		it('falls back to SSE when WebSocket fails persistently', () => {
			const manager = new TransportManager({
				...baseConfig,
				maxFailuresBeforeSwitch: 2
			});
			manager.connect();

			expect(manager.getActiveTransport()).toBe('websocket');

			// Retrieve error handler
			const wsCalls = mockWsClient.on.mock.calls;
			const wsErrorHandler = wsCalls.find((c: any) => c[0] === 'error')[1];

			// Simulate errors
			wsErrorHandler({ error: new Error('Network Error 1') });
			expect(manager.getState().activeTransport).toBe('websocket'); // Not yet switched

			wsErrorHandler({ error: new Error('Network Error 2') });
			// Should switch now
			expect(manager.getState().activeTransport).toBe('sse');
			expect(mockWsClient.disconnect).toHaveBeenCalled();
			expect(mockSseClient.connect).toHaveBeenCalled();
		});

		it('falls back immediately on fatal errors (404, not supported)', () => {
			const manager = new TransportManager({
				...baseConfig,
				maxFailuresBeforeSwitch: 1
			});
			manager.connect();

			const wsErrorHandler = mockWsClient.on.mock.calls.find((c: any) => c[0] === 'error')[1];
			
			// Simulate not supported error
			wsErrorHandler({ error: new Error('WebSocket not supported by server') });

			expect(manager.getState().activeTransport).toBe('sse');
		});

		it('emits error if no fallback available', () => {
			vi.spyOn(TransportManager, 'getFeatureSupport').mockReturnValue({
				websocket: true,
				sse: false,
				polling: false,
			});

			const manager = new TransportManager({
				...baseConfig,
				maxFailuresBeforeSwitch: 1
			});
			const closeHandler = vi.fn();
			manager.on('close', closeHandler);

			manager.connect();

			const wsErrorHandler = mockWsClient.on.mock.calls.find((c: any) => c[0] === 'error')[1];
			wsErrorHandler({ error: new Error('Network error') });

			expect(closeHandler).toHaveBeenCalled();
			expect(manager.getState().status).toBe('disconnected');
		});
	});

	describe('lifecycle', () => {
		it('handles disconnect', () => {
			const manager = new TransportManager(baseConfig);
			manager.connect();
			
			manager.disconnect();

			expect(mockWsClient.disconnect).toHaveBeenCalled();
			expect(manager.getState().status).toBe('disconnected');
		});

		it('proxies transport events', () => {
			const manager = new TransportManager(baseConfig);
			const openHandler = vi.fn();
			manager.on('open', openHandler);

			manager.connect();

			// We need to trigger the event on the transport
			// But since we mocked on(), the transport doesn't actually store handlers.
			// However, TransportManager passes the handler to transport.on
			// mockWsClient.on IS called.
			
			expect(mockWsClient.on).toHaveBeenCalledWith('open', openHandler);
		});

		it('updates state from transport events', () => {
			const manager = new TransportManager(baseConfig);
			manager.connect();

			// Find internal handlers
			const openHandler = mockWsClient.on.mock.calls.find((c: any) => c[0] === 'open')[1];
			
			openHandler({});
			expect(manager.getState().status).toBe('connected');

			const reconnectingHandler = mockWsClient.on.mock.calls.find((c: any) => c[0] === 'reconnecting')[1];
			reconnectingHandler({});
			expect(manager.getState().status).toBe('reconnecting');
		});
	});

	describe('upgrade', () => {
		it('attempts upgrade from lower priority transport', async () => {
			const manager = new TransportManager({
				...baseConfig,
				enableUpgradeAttempts: true,
				upgradeAttemptInterval: 1000
			});

			// Simulate start with polling (mock features initially)
			const featureSpy = vi.spyOn(TransportManager, 'getFeatureSupport').mockReturnValue({
				websocket: false,
				sse: false,
				polling: true,
			});
			
			manager.connect();
			expect(manager.getActiveTransport()).toBe('polling');

			// Now enable websocket
			featureSpy.mockReturnValue({
				websocket: true,
				sse: true,
				polling: true,
			});
			
			// Trigger connect success to start upgrade timer
			const pollOpenHandler = mockPollingClient.on.mock.calls.find((c: any) => c[0] === 'open')[1];
			pollOpenHandler({});

			// Advance time to trigger upgrade
			await vi.advanceTimersByTimeAsync(1000);

			// Should attempt to switch to WebSocket
			expect(WebSocketClient).toHaveBeenCalled();
			expect(mockWsClient.connect).toHaveBeenCalled();
			
			// If upgrade succeeds:
			const wsOpenHandler = mockWsClient.on.mock.calls.find((c: any) => c[0] === 'open')[1];
			wsOpenHandler({});

			expect(manager.getActiveTransport()).toBe('websocket');
			
			// Check cleanup of old transport
			await vi.advanceTimersByTimeAsync(5000);
			expect(mockPollingClient.destroy).toHaveBeenCalled();
		});
	});
	
	describe('state aggregation', () => {
		it('merges state from transport', () => {
			const manager = new TransportManager(baseConfig);
			manager.connect();
			
			mockWsClient.getState.mockReturnValue({
				status: 'connected',
				latency: 42,
				lastEventId: 'id-1'
			});

			const state = manager.getState();
			expect(state.latency).toBe(42);
			expect(state.lastEventId).toBe('id-1');
		});
	});

	describe('sending', () => {
		it('sends via active transport', () => {
			const manager = new TransportManager(baseConfig);
			manager.connect();
			
			manager.send('data');
			expect(mockWsClient.send).toHaveBeenCalledWith('data');
		});

		it('throws if not connected', () => {
			const manager = new TransportManager(baseConfig);
			// Not connected
			
			expect(() => manager.send('data')).toThrow('No transport connected');
		});
	});
});
