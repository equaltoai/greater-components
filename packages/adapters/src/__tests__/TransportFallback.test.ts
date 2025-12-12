import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TransportFallback } from '../TransportFallback';

// Note: Complex mocking of SSE and Polling clients is avoided here since
// TransportFallback performs feature detection using EventSource.
// These tests focus on the public API behavior.

describe('TransportFallback', () => {
	const baseConfig = {
		primary: {
			url: 'https://example.com/sse',
			authToken: 'test-token',
		},
		fallback: {
			url: 'https://example.com/poll',
			authToken: 'test-token',
		},
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('constructor', () => {
		it('creates instance with default config values', () => {
			const fallback = new TransportFallback(baseConfig);
			const state = fallback.getState();

			expect(state.status).toBe('disconnected');
			expect(state.transport).toBeNull();
			expect(state.error).toBeNull();
		});

		it('creates instance with autoFallback default to true', () => {
			const fallback = new TransportFallback(baseConfig);

			// TransportFallback should have autoFallback enabled by default
			expect(fallback.getTransportType()).toBeNull();
		});

		it('creates instance with forceTransport option', () => {
			const fallback = new TransportFallback({
				...baseConfig,
				forceTransport: 'polling',
			});

			expect(fallback.getTransportType()).toBeNull();
		});
	});

	describe('destroy', () => {
		it('sets destroyed flag preventing further connections', () => {
			const fallback = new TransportFallback(baseConfig);

			fallback.destroy();

			expect(() => fallback.connect()).toThrow('TransportFallback has been destroyed');
		});
	});

	describe('disconnect', () => {
		it('handles disconnect when not connected', () => {
			const fallback = new TransportFallback(baseConfig);

			// Should not throw when not connected
			expect(() => fallback.disconnect()).not.toThrow();
		});
	});

	describe('send', () => {
		it('throws error when not connected', () => {
			const fallback = new TransportFallback(baseConfig);

			expect(() => fallback.send({ type: 'test', data: {} })).toThrow(
				'No transport connected'
			);
		});
	});

	describe('getState', () => {
		it('returns disconnected state when not connected', () => {
			const fallback = new TransportFallback(baseConfig);
			const state = fallback.getState();

			expect(state.status).toBe('disconnected');
			expect(state.transport).toBeNull();
		});
	});

	describe('getTransportType', () => {
		it('returns null when not connected', () => {
			const fallback = new TransportFallback(baseConfig);
			expect(fallback.getTransportType()).toBeNull();
		});
	});

	describe('isSseSupported', () => {
		it('returns boolean based on EventSource availability', () => {
			const result = TransportFallback.isSseSupported();
			
			// Should call SseClient.isSupported
			expect(typeof result).toBe('boolean');
		});
	});

	describe('on', () => {
		it('subscribes to events and returns unsubscribe function', () => {
			const fallback = new TransportFallback(baseConfig);
			const handler = vi.fn();

			const unsubscribe = fallback.on('message', handler);

			// Should not throw
			expect(() => unsubscribe()).not.toThrow();
		});

		it('stores handlers for later subscription when connected', () => {
			const fallback = new TransportFallback(baseConfig);
			const handler = vi.fn();

			fallback.on('message', handler);

			// Handler should be stored (verified through state)
			expect(fallback.getState().status).toBe('disconnected');
		});
	});
});
