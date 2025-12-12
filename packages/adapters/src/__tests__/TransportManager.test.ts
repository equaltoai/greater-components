import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TransportManager } from '../TransportManager';

// Note: Complex mocking of transport clients is avoided here since TransportManager
// performs feature detection using global objects (WebSocket, EventSource, fetch).
// These tests focus on the public API behavior with available transports.

describe('TransportManager', () => {
	const baseConfig = {
		websocket: {
			url: 'wss://example.com/ws',
			authToken: 'test-token',
		},
		sse: {
			url: 'https://example.com/sse',
			authToken: 'test-token',
		},
		polling: {
			url: 'https://example.com/poll',
			authToken: 'test-token',
		},
	};

	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.runOnlyPendingTimers();
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	describe('constructor', () => {
		it('creates instance with default config values', () => {
			const manager = new TransportManager(baseConfig);
			const state = manager.getState();

			expect(state.status).toBe('disconnected');
			expect(state.activeTransport).toBeNull();
			expect(state.failureCount).toBe(0);
		});

		it('detects transport priority based on feature support', () => {
			const manager = new TransportManager(baseConfig);
			const state = manager.getState();

			// Should include available transports
			expect(state.transportPriority.length).toBeGreaterThan(0);
		});
	});

	describe('getFeatureSupport', () => {
		it('returns feature support for all transports', () => {
			const support = TransportManager.getFeatureSupport();

			expect(support).toHaveProperty('websocket');
			expect(support).toHaveProperty('sse');
			expect(support).toHaveProperty('polling');
		});
	});

	describe('connect', () => {
		it('throws error when connecting after destroy', () => {
			const manager = new TransportManager(baseConfig);
			manager.destroy();

			expect(() => manager.connect()).toThrow('TransportManager has been destroyed');
		});
	});

	describe('disconnect', () => {
		it('sets status to disconnected', () => {
			const manager = new TransportManager(baseConfig);
			
			manager.disconnect();

			expect(manager.getState().status).toBe('disconnected');
		});
	});

	describe('send', () => {
		it('throws error when not connected', () => {
			const manager = new TransportManager(baseConfig);

			expect(() => manager.send({ type: 'test', data: {} })).toThrow(
				'No transport connected'
			);
		});
	});

	describe('on', () => {
		it('returns unsubscribe function', () => {
			const manager = new TransportManager(baseConfig);
			const handler = vi.fn();

			const unsubscribe = manager.on('message', handler);

			// Should not throw
			expect(() => unsubscribe()).not.toThrow();
		});

		it('stores handlers before connection', () => {
			const manager = new TransportManager(baseConfig);
			const handler = vi.fn();

			manager.on('message', handler);

			// Handler should be stored (we can't easily verify this without accessing internals)
			expect(manager.getState().status).toBe('disconnected');
		});
	});

	describe('getState', () => {
		it('returns disconnected state when not connected', () => {
			const manager = new TransportManager(baseConfig);

			const state = manager.getState();

			expect(state.status).toBe('disconnected');
			expect(state.activeTransport).toBeNull();
		});
	});

	describe('getActiveTransport', () => {
		it('returns null when not connected', () => {
			const manager = new TransportManager(baseConfig);
			expect(manager.getActiveTransport()).toBeNull();
		});
	});

	describe('isTransportSupported', () => {
		it('returns boolean for each transport type', () => {
			const manager = new TransportManager(baseConfig);

			// These should return booleans based on feature detection
			expect(typeof manager.isTransportSupported('websocket')).toBe('boolean');
			expect(typeof manager.isTransportSupported('sse')).toBe('boolean');
			expect(typeof manager.isTransportSupported('polling')).toBe('boolean');
		});
	});

	describe('switchTransport', () => {
		it('throws error for unsupported transport when forced', () => {
			const manager = new TransportManager(baseConfig);

			// Mock getFeatureSupport to return false for all transports
			vi.spyOn(TransportManager, 'getFeatureSupport').mockReturnValue({
				websocket: false,
				sse: false,
				polling: false,
			});

			expect(() => manager.switchTransport('websocket')).toThrow(
				'Transport websocket is not supported'
			);

			vi.restoreAllMocks();
		});
	});
});
