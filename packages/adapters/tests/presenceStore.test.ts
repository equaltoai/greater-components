// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';
import {
	createBrowserPresenceActivitySource,
	createBrowserPresenceLocationSource,
	createPresenceStore,
} from '../src/stores/index.js';
import type { UserPresence } from '../src/stores/types.js';

function createMockTransportManager() {
	return {
		connect: vi.fn(),
		disconnect: vi.fn(),
		destroy: vi.fn(),
		send: vi.fn(),
		on: vi.fn(() => () => {}),
		getState: vi.fn(() => ({
			status: 'disconnected',
			latency: null,
			reconnectAttempts: 0,
			activeTransport: null,
			failureCount: 0,
			canFallback: false,
			error: null,
			lastEventId: null,
			transportPriority: [],
		})),
	};
}

describe('PresenceStore host boundaries', () => {
	it('seeds current-user location from host-provided initialLocation', () => {
		const transportManager = createMockTransportManager();
		const store = createPresenceStore({
			transportManager: transportManager as any,
			currentUser: {
				userId: 'user-1',
				displayName: 'Test User',
			},
			initialLocation: {
				page: '/face/server',
				section: 'overview',
			},
		});

		expect(store.get().currentUser?.location).toEqual({
			page: '/face/server',
			section: 'overview',
		});
	});

	it('treats activity and location tracking as explicit opt-in sources', () => {
		const transportManager = createMockTransportManager();
		let activityHandler: (() => void) | undefined;
		let locationHandler: ((location: UserPresence['location']) => void) | undefined;

		const store = createPresenceStore({
			transportManager: transportManager as any,
			currentUser: {
				userId: 'user-2',
				displayName: 'Tracked User',
			},
			inactivityThreshold: 50,
			activitySource: {
				subscribe(onActivity) {
					activityHandler = onActivity;
					return () => {};
				},
			},
			locationSource: {
				getLocation() {
					return {
						page: '/face/initial',
					};
				},
				subscribe(onLocationChange) {
					locationHandler = onLocationChange;
					return () => {};
				},
			},
		});

		store.startMonitoring();

		expect(transportManager.connect).toHaveBeenCalled();
		expect(store.get().currentUser?.location).toEqual({
			page: '/face/initial',
		});

		locationHandler?.({
			page: '/face/updated',
			section: 'details',
		});

		expect(store.get().currentUser?.location).toEqual({
			page: '/face/updated',
			section: 'details',
		});

		const beforeLastSeen = store.get().currentUser?.lastSeen ?? 0;
		activityHandler?.();

		expect(store.get().currentUser?.lastSeen ?? 0).toBeGreaterThanOrEqual(beforeLastSeen);
		store.stopMonitoring();
		expect(transportManager.disconnect).toHaveBeenCalled();
	});

	it('builds browser activity and location sources from an explicit host target', () => {
		const listeners = new Map<string, () => void>();
		const target = {
			location: {
				pathname: '/feed',
				hash: '#replies',
			},
			addEventListener: vi.fn((eventName: string, handler: () => void) => {
				listeners.set(eventName, handler);
			}),
			removeEventListener: vi.fn((eventName: string) => {
				listeners.delete(eventName);
			}),
		};

		const activitySource = createBrowserPresenceActivitySource({
			target,
			events: ['mousedown'],
		});
		const locationSource = createBrowserPresenceLocationSource({
			target,
		});

		expect(locationSource.getLocation()).toEqual({
			page: '/feed',
			section: 'replies',
		});

		const onActivity = vi.fn();
		const onLocationChange = vi.fn();
		const stopActivity = activitySource.subscribe(onActivity);
		const stopLocation = locationSource.subscribe?.(onLocationChange) ?? (() => {});

		listeners.get('mousedown')?.();
		listeners.get('popstate')?.();

		expect(onActivity).toHaveBeenCalledTimes(1);
		expect(onLocationChange).toHaveBeenCalledWith({
			page: '/feed',
			section: 'replies',
		});

		stopActivity();
		stopLocation();
		expect(target.removeEventListener).toHaveBeenCalled();
	});
});
