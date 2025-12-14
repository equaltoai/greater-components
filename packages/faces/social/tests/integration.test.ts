/**
 * Integration Tests
 *
 * Tests for integration utilities that connect stores to components.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	RealtimeErrorBoundary,
	realtimeErrorBoundary,
	createTimelineIntegration,
	createNotificationIntegration,
	createGraphQLTimelineIntegration,
	createSharedTransport,
} from '../src/lib/integration';

// Mock the stores with proper class constructors
vi.mock('../src/lib/timelineStore', () => {
	const MockTimelineStore = vi.fn().mockImplementation(function (this: Record<string, unknown>) {
		this.connectTransport = vi.fn();
		this.disconnectTransport = vi.fn();
		this.loadInitial = vi.fn().mockResolvedValue(undefined);
		this.loadNewer = vi.fn().mockResolvedValue(undefined);
		this.loadOlder = vi.fn().mockResolvedValue(undefined);
		this.refresh = vi.fn().mockResolvedValue(undefined);
		this.updateStatus = vi.fn();
		this.clearUnreadCount = vi.fn();
		this.destroy = vi.fn();
		this.currentState = { items: [], loading: false, connected: false };
		this.items = [];
	});
	return { TimelineStore: MockTimelineStore };
});

vi.mock('../src/lib/notificationStore', () => {
	const MockNotificationStore = vi.fn().mockImplementation(function (
		this: Record<string, unknown>
	) {
		this.connectTransport = vi.fn();
		this.disconnectTransport = vi.fn();
		this.loadInitial = vi.fn().mockResolvedValue(undefined);
		this.loadMore = vi.fn().mockResolvedValue(undefined);
		this.refresh = vi.fn().mockResolvedValue(undefined);
		this.markAsRead = vi.fn().mockResolvedValue(undefined);
		this.markAllAsRead = vi.fn().mockResolvedValue(undefined);
		this.dismissNotification = vi.fn().mockResolvedValue(undefined);
		this.toggleGrouping = vi.fn();
		this.destroy = vi.fn();
		this.currentState = { items: [], loading: false, connected: false, grouped: false };
		this.items = [];
		this.groups = [];
	});
	return { NotificationStore: MockNotificationStore };
});

vi.mock('../src/lib/graphqlTimelineStore', () => {
	const MockGraphQLTimelineStore = vi.fn().mockImplementation(function (
		this: Record<string, unknown>
	) {
		this.connect = vi.fn().mockResolvedValue(undefined);
		this.disconnect = vi.fn();
		this.loadNewer = vi.fn().mockResolvedValue(undefined);
		this.loadOlder = vi.fn().mockResolvedValue(undefined);
		this.refresh = vi.fn().mockResolvedValue(undefined);
		this.updateStatus = vi.fn();
		this.destroy = vi.fn();
		this.currentState = { items: [], loading: false, connected: true };
		this.items = [];
	});
	return { GraphQLTimelineStore: MockGraphQLTimelineStore };
});

// Mock TransportManager
vi.mock('../src/lib/transport', () => {
	const MockTransportManager = vi.fn().mockImplementation(function (this: Record<string, unknown>) {
		this.connect = vi.fn().mockResolvedValue(undefined);
		this.disconnect = vi.fn();
		this.on = vi.fn();
		this.off = vi.fn();
	});
	return { TransportManager: MockTransportManager };
});

describe('RealtimeErrorBoundary', () => {
	let boundary: RealtimeErrorBoundary;

	beforeEach(() => {
		boundary = new RealtimeErrorBoundary();
	});

	describe('onError', () => {
		it('registers error handlers', () => {
			const handler = vi.fn();

			boundary.onError(handler);

			// Handler is registered
			boundary.handleError(new Error('Test error'));

			expect(handler).toHaveBeenCalledWith(expect.any(Error));
		});

		it('returns unsubscribe function', () => {
			const handler = vi.fn();

			const unsubscribe = boundary.onError(handler);

			unsubscribe();

			boundary.handleError(new Error('Test error'));

			expect(handler).not.toHaveBeenCalled();
		});
	});

	describe('handleError', () => {
		it('calls all registered handlers', () => {
			const handler1 = vi.fn();
			const handler2 = vi.fn();

			boundary.onError(handler1);
			boundary.onError(handler2);

			const error = new Error('Test error');
			boundary.handleError(error);

			expect(handler1).toHaveBeenCalledWith(error);
			expect(handler2).toHaveBeenCalledWith(error);
		});

		it('continues to other handlers if one throws', () => {
			const handler1 = vi.fn().mockImplementation(() => {
				throw new Error('Handler error');
			});
			const handler2 = vi.fn();

			boundary.onError(handler1);
			boundary.onError(handler2);

			expect(() => boundary.handleError(new Error('Test'))).toThrow();
			expect(handler2).toHaveBeenCalled();
		});

		it('throws handler error after completing all handlers', () => {
			const handler = vi.fn().mockImplementation(() => {
				throw new Error('Handler failed');
			});

			boundary.onError(handler);

			expect(() => boundary.handleError(new Error('Test'))).toThrow(
				'Realtime error handler failed: Handler failed'
			);
		});
	});
});

describe('realtimeErrorBoundary (global instance)', () => {
	afterEach(() => {
		// Clear any registered handlers
		vi.clearAllMocks();
	});

	it('is a singleton instance', () => {
		expect(realtimeErrorBoundary).toBeDefined();
		expect(realtimeErrorBoundary).toBeInstanceOf(RealtimeErrorBoundary);
	});
});

describe('createTimelineIntegration', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('creates integration with store', () => {
		const integration = createTimelineIntegration({
			baseUrl: 'https://example.social',
		});

		expect(integration.store).toBeDefined();
	});

	it('creates integration without transport', () => {
		const integration = createTimelineIntegration({
			baseUrl: 'https://example.social',
		});

		expect(integration.transport).toBeNull();
	});

	it('creates transport when configured', () => {
		const integration = createTimelineIntegration({
			baseUrl: 'https://example.social',
			transport: {
				baseUrl: 'https://example.social',
				protocol: 'websocket',
			},
		});

		expect(integration.transport).toBeDefined();
	});

	it('connect loads initial data', async () => {
		const integration = createTimelineIntegration({
			baseUrl: 'https://example.social',
		});

		await integration.connect();

		expect(integration.store.loadInitial).toHaveBeenCalled();
	});

	it('connect does nothing if already connected', async () => {
		const integration = createTimelineIntegration({
			baseUrl: 'https://example.social',
		});

		await integration.connect();
		vi.mocked(integration.store.loadInitial).mockClear();

		await integration.connect();

		expect(integration.store.loadInitial).not.toHaveBeenCalled();
	});

	it('disconnect calls store disconnect', async () => {
		const integration = createTimelineIntegration({
			baseUrl: 'https://example.social',
			transport: {
				baseUrl: 'https://example.social',
				protocol: 'websocket',
			},
		});

		await integration.connect();
		integration.disconnect();

		expect(integration.store.disconnectTransport).toHaveBeenCalled();
	});

	it('loadNewer clears unread count', async () => {
		const integration = createTimelineIntegration({
			baseUrl: 'https://example.social',
		});

		await integration.loadNewer();

		expect(integration.store.loadNewer).toHaveBeenCalled();
		expect(integration.store.clearUnreadCount).toHaveBeenCalled();
	});

	it('loadOlder calls store', async () => {
		const integration = createTimelineIntegration({
			baseUrl: 'https://example.social',
		});

		await integration.loadOlder();

		expect(integration.store.loadOlder).toHaveBeenCalled();
	});

	it('refresh calls store', async () => {
		const integration = createTimelineIntegration({
			baseUrl: 'https://example.social',
		});

		await integration.refresh();

		expect(integration.store.refresh).toHaveBeenCalled();
	});

	it('updateStatus calls store', () => {
		const integration = createTimelineIntegration({
			baseUrl: 'https://example.social',
		});

		const status = { id: '1' } as Parameters<typeof integration.updateStatus>[0];

		integration.updateStatus(status);

		expect(integration.store.updateStatus).toHaveBeenCalledWith(status);
	});

	it('state getter returns store state', () => {
		const integration = createTimelineIntegration({
			baseUrl: 'https://example.social',
		});

		expect(integration.state).toEqual(integration.store.currentState);
	});

	it('items getter returns store items', () => {
		const integration = createTimelineIntegration({
			baseUrl: 'https://example.social',
		});

		expect(integration.items).toEqual(integration.store.items);
	});

	it('destroy cleans up', async () => {
		const integration = createTimelineIntegration({
			baseUrl: 'https://example.social',
		});

		await integration.connect();
		integration.destroy();

		expect(integration.store.destroy).toHaveBeenCalled();
	});
});

describe('createNotificationIntegration', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('creates integration with store', () => {
		const integration = createNotificationIntegration({
			baseUrl: 'https://example.social',
		});

		expect(integration.store).toBeDefined();
	});

	it('connect loads initial data', async () => {
		const integration = createNotificationIntegration({
			baseUrl: 'https://example.social',
		});

		await integration.connect();

		expect(integration.store.loadInitial).toHaveBeenCalled();
	});

	it('loadMore calls store', async () => {
		const integration = createNotificationIntegration({
			baseUrl: 'https://example.social',
		});

		await integration.loadMore();

		expect(integration.store.loadMore).toHaveBeenCalled();
	});

	it('markAsRead calls store', async () => {
		const integration = createNotificationIntegration({
			baseUrl: 'https://example.social',
		});

		await integration.markAsRead('notif-1');

		expect(integration.store.markAsRead).toHaveBeenCalledWith(
			'notif-1',
			'https://example.social',
			undefined
		);
	});

	it('markAllAsRead calls store', async () => {
		const integration = createNotificationIntegration({
			baseUrl: 'https://example.social',
		});

		await integration.markAllAsRead();

		expect(integration.store.markAllAsRead).toHaveBeenCalled();
	});

	it('dismiss calls store', async () => {
		const integration = createNotificationIntegration({
			baseUrl: 'https://example.social',
		});

		await integration.dismiss('notif-1');

		expect(integration.store.dismissNotification).toHaveBeenCalledWith(
			'notif-1',
			'https://example.social',
			undefined
		);
	});

	it('toggleGrouping calls store', () => {
		const integration = createNotificationIntegration({
			baseUrl: 'https://example.social',
		});

		integration.toggleGrouping();

		expect(integration.store.toggleGrouping).toHaveBeenCalled();
	});

	it('groups getter returns store groups', () => {
		const integration = createNotificationIntegration({
			baseUrl: 'https://example.social',
		});

		expect(integration.groups).toEqual(integration.store.groups);
	});
});

describe('createGraphQLTimelineIntegration', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('creates integration with store', () => {
		const mockAdapter = {} as Parameters<typeof createGraphQLTimelineIntegration>[0];
		const view = { type: 'public' as const };

		const integration = createGraphQLTimelineIntegration(mockAdapter, view);

		expect(integration.store).toBeDefined();
		expect(integration.transport).toBeNull();
	});

	it('connect calls store connect', async () => {
		const mockAdapter = {} as Parameters<typeof createGraphQLTimelineIntegration>[0];
		const view = { type: 'public' as const };

		const integration = createGraphQLTimelineIntegration(mockAdapter, view);

		await integration.connect();

		expect(integration.store.connect).toHaveBeenCalled();
	});

	it('disconnect calls store disconnect', () => {
		const mockAdapter = {} as Parameters<typeof createGraphQLTimelineIntegration>[0];
		const view = { type: 'public' as const };

		const integration = createGraphQLTimelineIntegration(mockAdapter, view);

		integration.disconnect();

		expect(integration.store.disconnect).toHaveBeenCalled();
	});

	it('loadNewer calls store', async () => {
		const mockAdapter = {} as Parameters<typeof createGraphQLTimelineIntegration>[0];
		const view = { type: 'public' as const };

		const integration = createGraphQLTimelineIntegration(mockAdapter, view);

		await integration.loadNewer();

		expect(integration.store.loadNewer).toHaveBeenCalled();
	});

	it('loadOlder calls store', async () => {
		const mockAdapter = {} as Parameters<typeof createGraphQLTimelineIntegration>[0];
		const view = { type: 'public' as const };

		const integration = createGraphQLTimelineIntegration(mockAdapter, view);

		await integration.loadOlder();

		expect(integration.store.loadOlder).toHaveBeenCalled();
	});
});

describe('createSharedTransport', () => {
	it('creates a TransportManager instance', () => {
		const transport = createSharedTransport({
			baseUrl: 'https://example.social',
			protocol: 'websocket',
		});

		expect(transport).toBeDefined();
	});
});
