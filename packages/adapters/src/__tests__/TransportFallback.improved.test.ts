import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TransportFallback } from '../TransportFallback';
import { SseClient } from '../SseClient';
import { HttpPollingClient } from '../HttpPollingClient';

// Mock SseClient and HttpPollingClient
vi.mock('../SseClient');
vi.mock('../HttpPollingClient');

describe('TransportFallback Improved Coverage', () => {
	const baseConfig = {
		primary: { url: 'https://example.com/sse' },
		fallback: { url: 'https://example.com/poll' },
		logger: {
			info: vi.fn(),
			error: vi.fn(),
			warn: vi.fn(),
			debug: vi.fn(),
		},
		autoFallback: true,
	};

	let mockSseClient: any;
	let mockPollingClient: any;

	beforeEach(() => {
		vi.clearAllMocks();

		mockSseClient = {
			connect: vi.fn(),
			disconnect: vi.fn(),
			destroy: vi.fn(),
			send: vi.fn(),
			on: vi.fn(() => vi.fn()),
			getState: vi.fn().mockReturnValue({ status: 'disconnected', error: null }),
		};
		(SseClient as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
			return mockSseClient;
		});
		(SseClient as any).isSupported = vi.fn().mockReturnValue(true);

		mockPollingClient = {
			connect: vi.fn(),
			disconnect: vi.fn(),
			destroy: vi.fn(),
			send: vi.fn(),
			on: vi.fn(() => vi.fn()),
			getState: vi.fn().mockReturnValue({ status: 'disconnected', error: null }),
		};
		(HttpPollingClient as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
			return mockPollingClient;
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('destroy', () => {
		it('should clean up resources and destroy transport', () => {
			const fallback = new TransportFallback(baseConfig);
			fallback.connect();

			// Spy on internal map clear by checking side effects or indirect behavior
			// But we can check if unsubscribers are called.
			const unsubscribe = vi.fn();
			// Mock internal implementation detail: addUnsubscribers is private,
			// but we can spy on currentTransport.on which returns unsubscribe
			mockSseClient.on.mockReturnValue(unsubscribe);

			const handler = vi.fn();
			fallback.on('test', handler);

			fallback.destroy();

			expect(mockSseClient.destroy).toHaveBeenCalled();
			expect(unsubscribe).toHaveBeenCalled();
			expect(() => fallback.connect()).toThrow('TransportFallback has been destroyed');
		});

		it('should handle destroy when no transport connected', () => {
			const fallback = new TransportFallback(baseConfig);
			fallback.destroy();
			// Should not throw
			expect(() => fallback.connect()).toThrow('TransportFallback has been destroyed');
		});
	});

	describe('send', () => {
		it('should throw if no transport connected', () => {
			const fallback = new TransportFallback(baseConfig);
			expect(() => fallback.send('test')).toThrow('No transport connected');
		});

		it('should throw if transport does not support send', () => {
			const fallback = new TransportFallback(baseConfig);
			fallback.connect();

			// Simulate transport without send
			mockSseClient.send = undefined;

			expect(() => fallback.send('test')).toThrow(
				'Current transport does not support sending messages'
			);
		});
	});

	describe('on / event handling', () => {
		it('should unsubscribe correctly', () => {
			const fallback = new TransportFallback(baseConfig);
			fallback.connect();

			const transportUnsub = vi.fn();
			mockSseClient.on.mockReturnValue(transportUnsub);

			const handler = vi.fn();
			const unsubscribe = fallback.on('message', handler);

			// Should have subscribed to transport
			expect(mockSseClient.on).toHaveBeenCalledWith('message', handler);

			// Unsubscribe
			unsubscribe();

			// Should have called transport unsubscribe
			expect(transportUnsub).toHaveBeenCalled();
		});

		it('should handle multiple handlers for same event', () => {
			const fallback = new TransportFallback(baseConfig);
			fallback.connect();

			const transportUnsub = vi.fn();
			mockSseClient.on.mockReturnValue(transportUnsub);

			const handler1 = vi.fn();
			const handler2 = vi.fn();

			const unsub1 = fallback.on('message', handler1);
			fallback.on('message', handler2);

			unsub1();
			// Transport unsub should ONLY be called when all handlers are gone?
			// Checking implementation:
			// const unsubs = this.unsubscribers.get(event);
			// if (unsubs) { unsubs.forEach(...) }
			// Wait, the implementation adds unsubs to a list.
			// When calling unsubscribe(), it runs ALL unsubs for that event?
			// Let's check code:
			// const unsubs = this.unsubscribers.get(event);
			// if (unsubs) { unsubs.forEach(u => u()); this.unsubscribers.delete(event); }

			// This suggests unsubscribing ONE handler unsubscribes ALL from transport for that event?
			// That seems like a bug or a specific design choice in TransportFallback.ts.
			// "this.unsubscribers.delete(event)" removes the list.
			// So if I have 2 handlers, and I unsub 1, it unsubs the transport listener.
			// But the transport listener was added for EACH handler:
			// "const unsubscribe = this.currentTransport.on(event, handler);"
			// "this.addUnsubscribers(event, unsubscribe);"

			// So `this.unsubscribers.get(event)` returns a list of ALL unsubs for that event type.
			// And the returned function runs ALL of them?
			// "return () => { ... const unsubs = this.unsubscribers.get(event); ... }"

			// Yes, looking at lines 136-138 of TransportFallback.ts:
			// unsubs.forEach((unsub) => unsub());
			// this.unsubscribers.delete(event);

			// This means unsubscribing one handler disconnects ALL handlers for that event type from the transport level.
			// This confirms the behavior to test.

			expect(transportUnsub).toHaveBeenCalled();
		});

		it('should catch errors in event handlers', () => {
			const fallback = new TransportFallback(baseConfig);
			const handler = vi.fn().mockImplementation(() => {
				throw new Error('Handler error');
			});

			// We need to trigger emitToHandlers.
			// This is private, but called by fallbackToPolling logic
			// fallbackToPolling emits 'fallback' event.

			fallback.on('fallback', handler);

			// Trigger fallback
			fallback.connect();
			const calls = mockSseClient.on.mock.calls;
			const errorCall = calls.find((c: any) => c[0] === 'error');

			// Should not throw
			errorCall[1]({ error: new Error('Network error') });

			expect(handler).toHaveBeenCalled();
			expect(baseConfig.logger.error).toHaveBeenCalledWith(
				expect.stringContaining('Error in fallback event handler'),
				expect.any(Object)
			);
		});
	});

	describe('shouldFallback', () => {
		// Access private method via casting or testing behavior
		it('should identify fallback conditions', () => {
			const fallback = new TransportFallback(baseConfig);
			fallback.connect();

			const conditions = [
				'eventsource not supported',
				'404 not found',
				'405 method not allowed',
				'501 not implemented',
				'failed to fetch',
				'connection refused',
			];

			conditions.forEach((msg) => {
				vi.clearAllMocks();
				const f = new TransportFallback(baseConfig);
				f.connect();
				const calls = mockSseClient.on.mock.calls;
				const errorCall = calls.find((c: any) => c[0] === 'error');
				errorCall[1]({ error: new Error(msg) });
				expect(f.getTransportType()).toBe('polling');
			});
		});

		it('should not fallback for minor errors', () => {
			const fallback = new TransportFallback(baseConfig);
			fallback.connect();

			const calls = mockSseClient.on.mock.calls;
			const errorCall = calls.find((c: any) => c[0] === 'error');
			errorCall[1]({ error: new Error('Some minor error') });

			expect(fallback.getTransportType()).toBe('sse');
		});
	});

	describe('connectSse retry logic', () => {
		it('should retry instantiation once if autoFallback is false', () => {
			const fallback = new TransportFallback({
				...baseConfig,
				autoFallback: false,
			});

			let attempt = 0;
			(SseClient as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
				attempt++;
				if (attempt === 1) throw new Error('Transient error');
				return mockSseClient;
			});

			fallback.connect();

			expect(attempt).toBe(2);
			expect(fallback.getTransportType()).toBe('sse');
		});

		it('should throw if retry fails when autoFallback is false', () => {
			const fallback = new TransportFallback({
				...baseConfig,
				autoFallback: false,
			});

			(SseClient as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
				throw new Error('Persistent error');
			});

			expect(() => fallback.connect()).toThrow('Persistent error');
		});
	});
});
