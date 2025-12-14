/**
 * NotificationStore Tests
 *
 * Tests for notification store with real-time updates and grouping.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { NotificationStore } from '../src/lib/notificationStore';
import type { Notification, Account } from '../src/types';

const baseUrl = 'https://demo.equalto.social';

// Factory functions
const makeAccount = (id: string, overrides: Partial<Account> = {}): Account => ({
	id,
	username: `user${id}`,
	acct: `user${id}@example.social`,
	displayName: `User ${id}`,
	avatar: `https://example.social/avatars/${id}.png`,
	url: `https://example.social/@user${id}`,
	createdAt: '2024-01-01T00:00:00Z',
	...overrides,
});

const makeNotification = (
	id: string,
	type: Notification['type'] = 'follow',
	overrides: Partial<Notification> = {}
): Notification => {
	const account = makeAccount(id);
	return {
		id,
		type,
		createdAt: '2024-01-15T12:00:00Z',
		account,
		read: false,
		...overrides,
	} as Notification;
};

const responseFor = (notifications: Notification[]) =>
	new Response(JSON.stringify(notifications), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});

const errorResponse = (status: number, statusText: string) =>
	new Response(null, { status, statusText });

const okResponse = () => new Response('{}', { status: 200 });

class MockTransport {
	private handlers = new Map<string, Set<(payload: unknown) => void>>();
	public subscribeToNotifications = vi.fn();

	on(event: string, handler: (payload: unknown) => void) {
		if (!this.handlers.has(event)) {
			this.handlers.set(event, new Set());
		}
		this.handlers.get(event)?.add(handler);
	}

	off(event: string, handler: (payload: unknown) => void) {
		this.handlers.get(event)?.delete(handler);
	}

	emit(event: string, payload?: unknown) {
		this.handlers.get(event)?.forEach((handler) => handler(payload));
	}
}

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('NotificationStore', () => {
	describe('Initialization', () => {
		it('creates with default config', () => {
			const store = new NotificationStore();

			expect(store.items).toEqual([]);
			expect(store.loading).toBe(false);
			expect(store.error).toBeNull();
			expect(store.grouped).toBe(true);
		});

		it('creates with custom config', () => {
			const store = new NotificationStore({
				maxItems: 100,
				preloadCount: 10,
				groupSimilar: false,
			});

			expect(store.grouped).toBe(false);
		});
	});

	describe('loadInitial', () => {
		it('loads notifications successfully', async () => {
			const notifications = [makeNotification('1'), makeNotification('2')];
			const fetchMock = vi.fn().mockResolvedValue(responseFor(notifications));
			vi.stubGlobal('fetch', fetchMock);

			const store = new NotificationStore({ preloadCount: 2, enableRealtime: false });
			await store.loadInitial(baseUrl);

			expect(store.items).toHaveLength(2);
			expect(store.currentState.hasMore).toBe(true);
		});

		it('handles HTTP errors', async () => {
			const fetchMock = vi.fn().mockResolvedValue(errorResponse(500, 'Server Error'));
			vi.stubGlobal('fetch', fetchMock);

			const store = new NotificationStore({ enableRealtime: false });
			await store.loadInitial(baseUrl);

			expect(store.error).toBe('HTTP 500: Server Error');
		});

		it('includes authorization header', async () => {
			const fetchMock = vi.fn().mockResolvedValue(responseFor([]));
			vi.stubGlobal('fetch', fetchMock);

			const store = new NotificationStore({ enableRealtime: false });
			await store.loadInitial(baseUrl, 'test-token');

			expect(fetchMock).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: { Authorization: 'Bearer test-token' },
				})
			);
		});

		it('sets hasMore=false when fewer than preloadCount returned', async () => {
			const notifications = [makeNotification('1')];
			const fetchMock = vi.fn().mockResolvedValue(responseFor(notifications));
			vi.stubGlobal('fetch', fetchMock);

			const store = new NotificationStore({ preloadCount: 5, enableRealtime: false });
			await store.loadInitial(baseUrl);

			expect(store.currentState.hasMore).toBe(false);
		});

		it('prevents concurrent loads', async () => {
			const fetchMock = vi
				.fn()
				.mockImplementation(
					() =>
						new Promise((resolve) =>
							setTimeout(() => resolve(responseFor([makeNotification('1')])), 100)
						)
				);
			vi.stubGlobal('fetch', fetchMock);

			const store = new NotificationStore({ enableRealtime: false });
			const load1 = store.loadInitial(baseUrl);
			const load2 = store.loadInitial(baseUrl);

			await Promise.all([load1, load2]);

			expect(fetchMock).toHaveBeenCalledTimes(1);
		});
	});

	describe('loadMore', () => {
		it('loads more notifications', async () => {
			const fetchMock = vi
				.fn()
				.mockResolvedValueOnce(responseFor([makeNotification('1'), makeNotification('2')]))
				.mockResolvedValueOnce(responseFor([makeNotification('3')]));
			vi.stubGlobal('fetch', fetchMock);

			const store = new NotificationStore({ preloadCount: 2, enableRealtime: false });
			await store.loadInitial(baseUrl);
			await store.loadMore(baseUrl);

			expect(store.items).toHaveLength(3);
		});

		it('does nothing when hasMore is false', async () => {
			const fetchMock = vi.fn().mockResolvedValue(responseFor([makeNotification('1')]));
			vi.stubGlobal('fetch', fetchMock);

			const store = new NotificationStore({ preloadCount: 5, enableRealtime: false });
			await store.loadInitial(baseUrl);
			fetchMock.mockClear();

			await store.loadMore(baseUrl);

			expect(fetchMock).not.toHaveBeenCalled();
		});

		it('does nothing when empty', async () => {
			const fetchMock = vi.fn();
			vi.stubGlobal('fetch', fetchMock);

			const store = new NotificationStore({ enableRealtime: false });
			await store.loadMore(baseUrl);

			expect(fetchMock).not.toHaveBeenCalled();
		});

		it('handles errors', async () => {
			const fetchMock = vi
				.fn()
				.mockResolvedValueOnce(responseFor([makeNotification('1'), makeNotification('2')]))
				.mockResolvedValueOnce(errorResponse(401, 'Unauthorized'));
			vi.stubGlobal('fetch', fetchMock);

			const store = new NotificationStore({ preloadCount: 2, enableRealtime: false });
			await store.loadInitial(baseUrl);
			await store.loadMore(baseUrl);

			expect(store.error).toBe('HTTP 401: Unauthorized');
		});
	});

	describe('toggleGrouping', () => {
		it('toggles grouping state', async () => {
			const fetchMock = vi.fn().mockResolvedValue(responseFor([makeNotification('1')]));
			vi.stubGlobal('fetch', fetchMock);

			const store = new NotificationStore({ groupSimilar: true, enableRealtime: false });
			expect(store.grouped).toBe(true);

			store.toggleGrouping();
			expect(store.grouped).toBe(false);

			store.toggleGrouping();
			expect(store.grouped).toBe(true);
		});

		it('updates groups when toggling', async () => {
			const notifications = [makeNotification('1', 'follow'), makeNotification('2', 'follow')];
			const fetchMock = vi.fn().mockResolvedValue(responseFor(notifications));
			vi.stubGlobal('fetch', fetchMock);

			const store = new NotificationStore({ groupSimilar: true, enableRealtime: false });
			await store.loadInitial(baseUrl);

			expect(store.groups.length).toBeGreaterThan(0);

			store.toggleGrouping();
			expect(store.groups).toEqual([]);
		});
	});

	describe('refresh', () => {
		it('clears and reloads', async () => {
			const fetchMock = vi
				.fn()
				.mockResolvedValueOnce(responseFor([makeNotification('1')]))
				.mockResolvedValueOnce(responseFor([makeNotification('2')]));
			vi.stubGlobal('fetch', fetchMock);

			const store = new NotificationStore({ enableRealtime: false });
			await store.loadInitial(baseUrl);
			expect(store.items[0].id).toBe('1');

			await store.refresh(baseUrl);
			expect(store.items[0].id).toBe('2');
		});
	});

	describe('abort', () => {
		it('aborts current operation', async () => {
			let abortSignal: AbortSignal | undefined;
			const fetchMock = vi.fn().mockImplementation((url, options) => {
				abortSignal = options?.signal;
				return new Promise((resolve) => setTimeout(() => resolve(responseFor([])), 1000));
			});
			vi.stubGlobal('fetch', fetchMock);

			const store = new NotificationStore({ enableRealtime: false });
			const _loadPromise = store.loadInitial(baseUrl);

			store.abort();

			expect(abortSignal?.aborted).toBe(true);
		});
	});

	describe('destroy', () => {
		it('disconnects transport and clears state', () => {
			const transport = new MockTransport();
			const store = new NotificationStore({ enableRealtime: true });
			store.connectTransport(transport as unknown as any);
			transport.emit('connection.open');

			expect(store.connected).toBe(true);

			store.destroy();

			expect(store.connected).toBe(false);
		});
	});

	describe('Transport Events', () => {
		it('handles connection.open', () => {
			const transport = new MockTransport();
			const store = new NotificationStore({ enableRealtime: true });
			store.connectTransport(transport as unknown as any);

			transport.emit('connection.open');

			expect(store.connected).toBe(true);
			expect(transport.subscribeToNotifications).toHaveBeenCalled();
		});

		it('handles connection.close', () => {
			const transport = new MockTransport();
			const store = new NotificationStore({ enableRealtime: true });
			store.connectTransport(transport as unknown as any);

			transport.emit('connection.open');
			transport.emit('connection.close');

			expect(store.connected).toBe(false);
		});

		it('handles connection.error', () => {
			const transport = new MockTransport();
			const store = new NotificationStore({ enableRealtime: true });
			store.connectTransport(transport as unknown as any);

			transport.emit('connection.error', { message: 'Connection failed' });

			expect(store.connected).toBe(false);
			expect(store.error).toBe('Connection failed');
		});

		it('handles notification.new', () => {
			const transport = new MockTransport();
			const store = new NotificationStore({ enableRealtime: true });
			store.connectTransport(transport as unknown as any);

			transport.emit('connection.open');
			transport.emit('notification.new', makeNotification('new-1'));

			expect(store.items).toHaveLength(1);
			expect(store.items[0].id).toBe('new-1');
		});

		it('handles notification.update', async () => {
			const fetchMock = vi
				.fn()
				.mockResolvedValue(responseFor([makeNotification('1', 'follow', { read: false })]));
			vi.stubGlobal('fetch', fetchMock);

			const transport = new MockTransport();
			const store = new NotificationStore({ enableRealtime: true });
			store.connectTransport(transport as unknown as any);

			await store.loadInitial(baseUrl);
			expect(store.items[0].read).toBe(false);

			transport.emit('connection.open');
			transport.emit('notification.update', makeNotification('1', 'follow', { read: true }));

			expect(store.items[0].read).toBe(true);
		});

		it('reconnects transport properly', () => {
			const transport1 = new MockTransport();
			const transport2 = new MockTransport();
			const store = new NotificationStore({ enableRealtime: true });

			store.connectTransport(transport1 as unknown as any);
			transport1.emit('connection.open');
			expect(store.connected).toBe(true);

			store.connectTransport(transport2 as unknown as any);
			expect(store.connected).toBe(false);

			transport2.emit('connection.open');
			expect(store.connected).toBe(true);
		});
	});

	describe('markAsRead', () => {
		it('marks notification as read locally', async () => {
			const fetchMock = vi
				.fn()
				.mockResolvedValueOnce(responseFor([makeNotification('1', 'follow', { read: false })]))
				.mockResolvedValueOnce(okResponse());
			vi.stubGlobal('fetch', fetchMock);

			const store = new NotificationStore({ enableRealtime: false });
			await store.loadInitial(baseUrl);

			expect(store.items[0].read).toBe(false);
			expect(store.unreadCount).toBe(1);

			await store.markAsRead('1', baseUrl, 'token');

			expect(store.items[0].read).toBe(true);
			expect(store.unreadCount).toBe(0);
		});

		it('does nothing for already read notification', async () => {
			const fetchMock = vi
				.fn()
				.mockResolvedValue(responseFor([makeNotification('1', 'follow', { read: true })]));
			vi.stubGlobal('fetch', fetchMock);

			const store = new NotificationStore({ enableRealtime: false });
			await store.loadInitial(baseUrl);
			fetchMock.mockClear();

			await store.markAsRead('1', baseUrl, 'token');

			expect(fetchMock).not.toHaveBeenCalled();
		});

		it('does nothing for non-existent notification', async () => {
			const fetchMock = vi.fn().mockResolvedValue(responseFor([]));
			vi.stubGlobal('fetch', fetchMock);

			const store = new NotificationStore({ enableRealtime: false });
			await store.loadInitial(baseUrl);
			fetchMock.mockClear();

			await store.markAsRead('non-existent', baseUrl, 'token');

			expect(fetchMock).not.toHaveBeenCalled();
		});
	});

	describe('markAllAsRead', () => {
		it('marks all notifications as read', async () => {
			const fetchMock = vi
				.fn()
				.mockResolvedValueOnce(
					responseFor([
						makeNotification('1', 'follow', { read: false }),
						makeNotification('2', 'follow', { read: false }),
					])
				)
				.mockResolvedValueOnce(okResponse());
			vi.stubGlobal('fetch', fetchMock);

			const store = new NotificationStore({ enableRealtime: false });
			await store.loadInitial(baseUrl);

			expect(store.unreadCount).toBe(2);

			await store.markAllAsRead(baseUrl, 'token');

			expect(store.unreadCount).toBe(0);
			expect(store.items.every((n) => n.read)).toBe(true);
		});

		it('does nothing when all are read', async () => {
			const fetchMock = vi
				.fn()
				.mockResolvedValue(
					responseFor([
						makeNotification('1', 'follow', { read: true }),
						makeNotification('2', 'follow', { read: true }),
					])
				);
			vi.stubGlobal('fetch', fetchMock);

			const store = new NotificationStore({ enableRealtime: false });
			await store.loadInitial(baseUrl);
			fetchMock.mockClear();

			await store.markAllAsRead(baseUrl, 'token');

			expect(fetchMock).not.toHaveBeenCalled();
		});
	});

	describe('dismissNotification', () => {
		it('removes notification from store', async () => {
			const fetchMock = vi
				.fn()
				.mockResolvedValueOnce(responseFor([makeNotification('1'), makeNotification('2')]))
				.mockResolvedValueOnce(okResponse());
			vi.stubGlobal('fetch', fetchMock);

			const store = new NotificationStore({ enableRealtime: false });
			await store.loadInitial(baseUrl);

			expect(store.items).toHaveLength(2);

			await store.dismissNotification('1', baseUrl, 'token');

			expect(store.items).toHaveLength(1);
			expect(store.items[0].id).toBe('2');
		});

		it('does nothing for non-existent notification', async () => {
			const fetchMock = vi.fn().mockResolvedValue(responseFor([]));
			vi.stubGlobal('fetch', fetchMock);

			const store = new NotificationStore({ enableRealtime: false });
			await store.loadInitial(baseUrl);
			fetchMock.mockClear();

			await store.dismissNotification('non-existent', baseUrl, 'token');

			expect(fetchMock).not.toHaveBeenCalled();
		});
	});

	describe('Counts', () => {
		it('tracks unread count correctly', async () => {
			const fetchMock = vi
				.fn()
				.mockResolvedValue(
					responseFor([
						makeNotification('1', 'follow', { read: false }),
						makeNotification('2', 'follow', { read: true }),
						makeNotification('3', 'follow', { read: false }),
					])
				);
			vi.stubGlobal('fetch', fetchMock);

			const store = new NotificationStore({ enableRealtime: false });
			await store.loadInitial(baseUrl);

			expect(store.unreadCount).toBe(2);
			expect(store.currentState.totalCount).toBe(3);
		});
	});

	describe('MaxItems', () => {
		it('trims items when exceeding maxItems', () => {
			const transport = new MockTransport();
			const store = new NotificationStore({ maxItems: 3, enableRealtime: true });
			store.connectTransport(transport as unknown as any);

			transport.emit('connection.open');
			transport.emit('notification.new', makeNotification('1'));
			transport.emit('notification.new', makeNotification('2'));
			transport.emit('notification.new', makeNotification('3'));
			transport.emit('notification.new', makeNotification('4'));

			expect(store.items).toHaveLength(3);
			expect(store.items[0].id).toBe('4');
		});
	});

	describe('Getters', () => {
		it('returns groups', async () => {
			const notifications = [makeNotification('1', 'follow'), makeNotification('2', 'follow')];
			const fetchMock = vi.fn().mockResolvedValue(responseFor(notifications));
			vi.stubGlobal('fetch', fetchMock);

			const store = new NotificationStore({ groupSimilar: true, enableRealtime: false });
			await store.loadInitial(baseUrl);

			expect(store.groups).toBeDefined();
			expect(store.groups.length).toBeGreaterThan(0);
		});
	});
});
