import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TransportFallback } from '../TransportFallback';
import { SseClient } from '../SseClient';
import { HttpPollingClient } from '../HttpPollingClient';

// Mock SseClient and HttpPollingClient
vi.mock('../SseClient');
vi.mock('../HttpPollingClient');

describe('TransportFallback', () => {
	const baseConfig = {
		primary: {
			url: 'https://example.com/sse',
		},
		fallback: {
			url: 'https://example.com/poll',
		},
		logger: {
			info: vi.fn(),
			error: vi.fn(),
			warn: vi.fn(),
			debug: vi.fn(),
		},
	};

	let mockSseClient: any;
	let mockPollingClient: any;

	beforeEach(() => {
		vi.clearAllMocks();

		// Setup Mock Instances
		mockSseClient = {
			connect: vi.fn(),
			disconnect: vi.fn(),
			destroy: vi.fn(),
			send: vi.fn(),
			on: vi.fn(() => vi.fn()),
			getState: vi.fn().mockReturnValue({ status: 'disconnected', error: null }),
		};
		(SseClient as unknown as ReturnType<typeof vi.fn>).mockImplementation(function(this: any) { return mockSseClient; });
		(SseClient as unknown as ReturnType<typeof vi.fn>).isSupported = vi.fn().mockReturnValue(true);

		mockPollingClient = {
			connect: vi.fn(),
			disconnect: vi.fn(),
			destroy: vi.fn(),
			send: vi.fn(),
			on: vi.fn(() => vi.fn()),
			getState: vi.fn().mockReturnValue({ status: 'disconnected', error: null }),
		};
		(HttpPollingClient as unknown as ReturnType<typeof vi.fn>).mockImplementation(function(this: any) { return mockPollingClient; });
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('constructor', () => {
		it('creates instance with default config', () => {
			const fallback = new TransportFallback(baseConfig);
			expect(fallback).toBeDefined();
		});
	});

	describe('connect', () => {
		it('connects to SSE by default if supported', () => {
			const fallback = new TransportFallback(baseConfig);
			fallback.connect();

			expect(SseClient).toHaveBeenCalled();
			expect(mockSseClient.connect).toHaveBeenCalled();
			expect(fallback.getTransportType()).toBe('sse');
		});

		it('connects to polling if SSE is not supported', () => {
			(SseClient as unknown as ReturnType<typeof vi.fn>).isSupported = vi.fn().mockReturnValue(false);
			
			const fallback = new TransportFallback(baseConfig);
			fallback.connect();

			expect(HttpPollingClient).toHaveBeenCalled();
			expect(mockPollingClient.connect).toHaveBeenCalled();
			expect(fallback.getTransportType()).toBe('polling');
		});

		it('connects to polling if forced', () => {
			const fallback = new TransportFallback({
				...baseConfig,
				forceTransport: 'polling'
			});
			fallback.connect();

			expect(HttpPollingClient).toHaveBeenCalled();
			expect(fallback.getTransportType()).toBe('polling');
		});

		it('does nothing if already connected', () => {
			const fallback = new TransportFallback(baseConfig);
			fallback.connect();
			
			// Try connecting again
			fallback.connect();

			expect(mockSseClient.connect).toHaveBeenCalledTimes(1);
		});

		it('throws if destroyed', () => {
			const fallback = new TransportFallback(baseConfig);
			fallback.destroy();
			expect(() => fallback.connect()).toThrow('TransportFallback has been destroyed');
		});
	});

	describe('fallback logic', () => {
		it('falls back to polling on SSE error', () => {
			const fallback = new TransportFallback(baseConfig);
			fallback.connect();

			// Verify we started with SSE
			expect(fallback.getTransportType()).toBe('sse');

			// Find the error handler passed to SseClient.on('error', ...)
			// The implementation calls .on('error', handler) internally
			const calls = mockSseClient.on.mock.calls;
			const errorCall = calls.find((c: any) => c[0] === 'error');
			const errorHandler = errorCall[1];

			// Simulate fatal error
			errorHandler({ error: new Error('Network error') });

			// Should have switched to polling
			expect(HttpPollingClient).toHaveBeenCalled();
			expect(mockPollingClient.connect).toHaveBeenCalled();
			expect(fallback.getTransportType()).toBe('polling');
		});

		it('does not fallback if autoFallback is false', () => {
			const fallback = new TransportFallback({
				...baseConfig,
				autoFallback: false
			});
			fallback.connect();

			const calls = mockSseClient.on.mock.calls;
			const errorCall = calls.find((c: any) => c[0] === 'error');
			// If autoFallback is false, it might not subscribe to error for fallback purposes
			// But let's check implementation:
			// if (this.config.autoFallback && this.currentTransport) { ... }
			
			expect(errorCall).toBeUndefined(); // Assuming it doesn't subscribe if autoFallback is false
		});

		it('falls back if SseClient instantiation fails', () => {
			(SseClient as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
				throw new Error('Instantiation failed');
			});

			const fallback = new TransportFallback(baseConfig);
			fallback.connect();

			expect(HttpPollingClient).toHaveBeenCalled();
			expect(fallback.getTransportType()).toBe('polling');
		});

		it('emits fallback event', () => {
			const fallback = new TransportFallback(baseConfig);
			const fallbackHandler = vi.fn();
			fallback.on('fallback', fallbackHandler);

			fallback.connect();

			// Trigger fallback
			const calls = mockSseClient.on.mock.calls;
			const errorCall = calls.find((c: any) => c[0] === 'error');
			errorCall[1]({ error: new Error('Network error') });

			expect(fallbackHandler).toHaveBeenCalled();
			expect(fallbackHandler.mock.calls[0][0].data).toEqual({ from: 'sse', to: 'polling' });
		});

		it('only attempts fallback once', () => {
			const fallback = new TransportFallback(baseConfig);
			fallback.connect();

			// Trigger fallback
			const calls = mockSseClient.on.mock.calls;
			const errorCall = calls.find((c: any) => c[0] === 'error');
			errorCall[1]({ error: new Error('Network error') });

			expect(fallback.getTransportType()).toBe('polling');
			
			// Clear mocks
			(HttpPollingClient as unknown as ReturnType<typeof vi.fn>).mockClear();

			// Try to fallback again (e.g. from polling error?)
			// Implementation: private fallbackToPolling() { if (this.fallbackAttempted ...) return; }
			
			// We can't easily access the private method, but if we trigger another error?
			// The polling client handles its own errors usually.
			// But if we simulate something that would trigger fallback if it wasn't already done...
			// The fallback logic is mostly tied to SSE errors.
			// If we explicitly call connect() again?
			// But connect() returns if currentTransport is set.
			
			// Let's verify fallbackAttempted flag logic by inspecting if it tries to connect SSE again on next connect call if disconnected?
			
			fallback.disconnect();
			fallback.connect();

			// Logic in selectTransport checks !this.fallbackAttempted
			// So it should choose polling directly now
			expect(fallback.getTransportType()).toBe('polling');
			expect(SseClient).toHaveBeenCalledTimes(1); // Only initial one
		});
	});

	describe('proxy methods', () => {
		it('proxies send to current transport', () => {
			const fallback = new TransportFallback(baseConfig);
			fallback.connect();

			fallback.send('test');
			expect(mockSseClient.send).toHaveBeenCalledWith('test');
		});

		it('proxies disconnect to current transport', () => {
			const fallback = new TransportFallback(baseConfig);
			fallback.connect();

			fallback.disconnect();
			expect(mockSseClient.disconnect).toHaveBeenCalled();
		});

		it('proxies getState', () => {
			const fallback = new TransportFallback(baseConfig);
			
			expect(fallback.getState().status).toBe('disconnected');

			fallback.connect();
			mockSseClient.getState.mockReturnValue({ status: 'connected', error: null });
			
			expect(fallback.getState().status).toBe('connected');
			expect(fallback.getState().transport).toBe('sse');
		});
	});

	describe('event handling', () => {
		it('proxies events from transport', () => {
			const fallback = new TransportFallback(baseConfig);
			const handler = vi.fn();
			fallback.on('message', handler);

			fallback.connect();

			// Check if subscribed to transport
			expect(mockSseClient.on).toHaveBeenCalledWith('message', handler);
		});

		it('resubscribes handlers after fallback', () => {
			const fallback = new TransportFallback(baseConfig);
			const handler = vi.fn();
			fallback.on('message', handler);

			fallback.connect();

			// Trigger fallback
			const calls = mockSseClient.on.mock.calls;
			const errorCall = calls.find((c: any) => c[0] === 'error');
			errorCall[1]({ error: new Error('Network error') });

			// Should be subscribed to polling client now
			expect(mockPollingClient.on).toHaveBeenCalledWith('message', handler);
		});
	});
});