/**
 * Extended TimelineStore Tests
 *
 * Additional tests for TimelineStore focusing on uncovered functionality.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { TimelineStore } from '../src/lib/timelineStore';
import type { Status } from '../src/types';

const baseUrl = 'https://demo.equalto.social';

const makeStatus = (id: string, overrides: Partial<Status> = {}): Status => ({
	id,
	uri: `https://example.social/@demo/${id}`,
	url: `https://example.social/@demo/${id}`,
	account: {
		id: `acct-${id}`,
		username: 'demo',
		acct: 'demo@example.social',
		displayName: 'Demo Account',
		avatar: 'https://placehold.co/64x64',
		url: 'https://example.social/@demo',
		createdAt: '2024-01-01T00:00:00Z',
		followersCount: 10,
		followingCount: 5,
		statusesCount: 25,
	},
	content: `<p>Status ${id}</p>`,
	createdAt: '2024-01-01T00:00:00Z',
	visibility: 'public',
	repliesCount: 0,
	reblogsCount: 0,
	favouritesCount: 0,
	mediaAttachments: [],
	mentions: [],
	tags: [],
	...overrides,
});

const responseFor = (statuses: Status[]) =>
	new Response(JSON.stringify(statuses), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});

const errorResponse = (status: number, statusText: string) =>
	new Response(null, { status, statusText });

class MockTransport {
	private handlers = new Map<string, Set<(payload: unknown) => void>>();
	public subscribeToTimeline = vi.fn();

	on(event: string, handler: (payload: unknown) => void) {
		if (!this.handlers.has(event)) {
			this.handlers.set(event, new Set());
		}
		const subscribers = this.handlers.get(event);
		subscribers?.add(handler);
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

describe('TimelineStore Extended', () => {
	describe('Error Handling', () => {
		it('handles HTTP errors on loadInitial', async () => {
			const fetchMock = vi.fn().mockResolvedValue(errorResponse(500, 'Internal Server Error'));
			vi.stubGlobal('fetch', fetchMock);

			const store = new TimelineStore({ enableRealtime: false });
			await store.loadInitial(baseUrl);

			expect(store.error).toBe('HTTP 500: Internal Server Error');
			expect(store.items).toHaveLength(0);
		});

		it('handles HTTP errors on loadNewer', async () => {
			const fetchMock = vi
				.fn()
				.mockResolvedValueOnce(responseFor([makeStatus('a')]))
				.mockResolvedValueOnce(errorResponse(401, 'Unauthorized'));
			vi.stubGlobal('fetch', fetchMock);

			const store = new TimelineStore({ enableRealtime: false });
			await store.loadInitial(baseUrl);
			await store.loadNewer(baseUrl);

			expect(store.error).toBe('HTTP 401: Unauthorized');
		});

		it('handles HTTP errors on loadOlder', async () => {
			const fetchMock = vi
				.fn()
				.mockResolvedValueOnce(responseFor([makeStatus('a'), makeStatus('b')]))
				.mockResolvedValueOnce(errorResponse(404, 'Not Found'));
			vi.stubGlobal('fetch', fetchMock);

			const store = new TimelineStore({ preloadCount: 2, enableRealtime: false });
			await store.loadInitial(baseUrl);
			await store.loadOlder(baseUrl);

			expect(store.error).toBe('HTTP 404: Not Found');
		});
	});

	describe('Authorization', () => {
		it('includes authorization header when accessToken is provided', async () => {
			const fetchMock = vi.fn().mockResolvedValue(responseFor([makeStatus('a')]));
			vi.stubGlobal('fetch', fetchMock);

			const store = new TimelineStore({ enableRealtime: false });
			await store.loadInitial(baseUrl, 'test-token-123');

			expect(fetchMock).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: { Authorization: 'Bearer test-token-123' },
				})
			);
		});

		it('includes authorization header in loadNewer', async () => {
			const fetchMock = vi
				.fn()
				.mockResolvedValueOnce(responseFor([makeStatus('a')]))
				.mockResolvedValueOnce(responseFor([]));
			vi.stubGlobal('fetch', fetchMock);

			const store = new TimelineStore({ enableRealtime: false });
			await store.loadInitial(baseUrl, 'token-1');
			await store.loadNewer(baseUrl, 'token-2');

			expect(fetchMock.mock.calls[1][1]).toEqual(
				expect.objectContaining({
					headers: { Authorization: 'Bearer token-2' },
				})
			);
		});

		it('includes authorization header in loadOlder', async () => {
			const fetchMock = vi
				.fn()
				.mockResolvedValueOnce(responseFor([makeStatus('a'), makeStatus('b')]))
				.mockResolvedValueOnce(responseFor([makeStatus('c')]));
			vi.stubGlobal('fetch', fetchMock);

			const store = new TimelineStore({ preloadCount: 2, enableRealtime: false });
			await store.loadInitial(baseUrl);
			await store.loadOlder(baseUrl, 'older-token');

			expect(fetchMock.mock.calls[1][1]).toEqual(
				expect.objectContaining({
					headers: { Authorization: 'Bearer older-token' },
				})
			);
		});
	});

	describe('State Management', () => {
		it('prevents concurrent loadInitial calls', async () => {
			const fetchMock = vi
				.fn()
				.mockImplementation(
					() =>
						new Promise((resolve) => setTimeout(() => resolve(responseFor([makeStatus('a')])), 100))
				);
			vi.stubGlobal('fetch', fetchMock);

			const store = new TimelineStore({ enableRealtime: false });

			// Start two concurrent loads
			const load1 = store.loadInitial(baseUrl);
			const load2 = store.loadInitial(baseUrl);

			await Promise.all([load1, load2]);

			// Only one should have executed
			expect(fetchMock).toHaveBeenCalledTimes(1);
		});

		it('prevents loadNewer when empty', async () => {
			const fetchMock = vi.fn();
			vi.stubGlobal('fetch', fetchMock);

			const store = new TimelineStore({ enableRealtime: false });
			await store.loadNewer(baseUrl);

			expect(fetchMock).not.toHaveBeenCalled();
		});

		it('prevents loadOlder when endReached', async () => {
			const fetchMock = vi.fn().mockResolvedValueOnce(responseFor([makeStatus('a')])); // Less than preloadCount
			vi.stubGlobal('fetch', fetchMock);

			const store = new TimelineStore({ preloadCount: 2, enableRealtime: false });
			await store.loadInitial(baseUrl);

			expect(store.currentState.endReached).toBe(true);

			await store.loadOlder(baseUrl);

			// Should not make another request since endReached
			expect(fetchMock).toHaveBeenCalledTimes(1);
		});

		it('prevents loadOlder when empty', async () => {
			const fetchMock = vi.fn();
			vi.stubGlobal('fetch', fetchMock);

			const store = new TimelineStore({ enableRealtime: false });
			await store.loadOlder(baseUrl);

			expect(fetchMock).not.toHaveBeenCalled();
		});
	});

	describe('updateStatus', () => {
		it('updates an existing status', async () => {
			const fetchMock = vi
				.fn()
				.mockResolvedValue(responseFor([makeStatus('a', { content: 'old' })]));
			vi.stubGlobal('fetch', fetchMock);

			const store = new TimelineStore({ enableRealtime: false });
			await store.loadInitial(baseUrl);

			const updatedStatus = makeStatus('a', { content: 'updated content' });
			store.updateStatus(updatedStatus);

			expect(store.items[0].content).toBe('updated content');
		});

		it('does nothing when status does not exist', async () => {
			const fetchMock = vi.fn().mockResolvedValue(responseFor([makeStatus('a')]));
			vi.stubGlobal('fetch', fetchMock);

			const store = new TimelineStore({ enableRealtime: false });
			await store.loadInitial(baseUrl);

			const nonExistent = makeStatus('nonexistent', { content: 'new' });
			store.updateStatus(nonExistent);

			expect(store.items).toHaveLength(1);
			expect(store.items[0].id).toBe('a');
		});
	});

	describe('clearUnreadCount', () => {
		it('resets unread count to zero', () => {
			const transport = new MockTransport();
			const store = new TimelineStore({ maxItems: 10, enableRealtime: true });
			store.connectTransport(transport as unknown as any);

			transport.emit('connection.open');
			transport.emit('status.update', makeStatus('stream-1'));
			transport.emit('status.update', makeStatus('stream-2'));

			expect(store.unreadCount).toBe(2);

			store.clearUnreadCount();

			expect(store.unreadCount).toBe(0);
		});
	});

	describe('refresh', () => {
		it('clears items and reloads', async () => {
			const fetchMock = vi
				.fn()
				.mockResolvedValueOnce(responseFor([makeStatus('a'), makeStatus('b')]))
				.mockResolvedValueOnce(responseFor([makeStatus('c'), makeStatus('d')]));
			vi.stubGlobal('fetch', fetchMock);

			const store = new TimelineStore({ enableRealtime: false });
			await store.loadInitial(baseUrl);
			expect(store.items.map((s) => s.id)).toEqual(['a', 'b']);

			await store.refresh(baseUrl);
			expect(store.items.map((s) => s.id)).toEqual(['c', 'd']);
		});
	});

	describe('abort', () => {
		it('aborts current loading operation', async () => {
			let abortSignal: AbortSignal | undefined;
			const fetchMock = vi.fn().mockImplementation((url, options) => {
				abortSignal = options?.signal;
				return new Promise((resolve) =>
					setTimeout(() => resolve(responseFor([makeStatus('a')])), 1000)
				);
			});
			vi.stubGlobal('fetch', fetchMock);

			const store = new TimelineStore({ enableRealtime: false });
			const _loadPromise = store.loadInitial(baseUrl);

			store.abort();

			expect(abortSignal?.aborted).toBe(true);
		});
	});

	describe('destroy', () => {
		it('disconnects transport and clears state', () => {
			const transport = new MockTransport();
			const store = new TimelineStore({ enableRealtime: true });
			store.connectTransport(transport as unknown as any);
			transport.emit('connection.open');

			expect(store.connected).toBe(true);

			store.destroy();

			expect(store.connected).toBe(false);
		});
	});

	describe('Transport Events', () => {
		it('handles connection.error', () => {
			const transport = new MockTransport();
			const store = new TimelineStore({ enableRealtime: true });
			store.connectTransport(transport as unknown as any);

			transport.emit('connection.error', { message: 'Connection failed' });

			expect(store.connected).toBe(false);
			expect(store.error).toBe('Connection failed');
		});

		it('handles connection.close', () => {
			const transport = new MockTransport();
			const store = new TimelineStore({ enableRealtime: true });
			store.connectTransport(transport as unknown as any);

			transport.emit('connection.open');
			expect(store.connected).toBe(true);

			transport.emit('connection.close');
			expect(store.connected).toBe(false);
		});

		it('handles status.delete', () => {
			const transport = new MockTransport();
			const store = new TimelineStore({ enableRealtime: true });
			store.connectTransport(transport as unknown as any);

			transport.emit('connection.open');
			transport.emit('status.update', makeStatus('to-delete'));
			transport.emit('status.update', makeStatus('to-keep'));

			expect(store.items).toHaveLength(2);

			transport.emit('status.delete', { id: 'to-delete' });

			expect(store.items).toHaveLength(1);
			expect(store.items[0].id).toBe('to-keep');
		});

		it('reconnects transport properly', () => {
			const transport1 = new MockTransport();
			const transport2 = new MockTransport();
			const store = new TimelineStore({ enableRealtime: true });

			store.connectTransport(transport1 as unknown as any);
			transport1.emit('connection.open');
			expect(store.connected).toBe(true);

			store.connectTransport(transport2 as unknown as any);
			// After reconnecting, connected should be false until new transport opens
			expect(store.connected).toBe(false);

			transport2.emit('connection.open');
			expect(store.connected).toBe(true);
		});
	});

	describe('Getter Methods', () => {
		it('returns loading state', async () => {
			let resolvePromise: ((value: Response) => void) | undefined;
			const fetchMock = vi.fn().mockImplementation(
				() =>
					new Promise<Response>((resolve) => {
						resolvePromise = resolve;
					})
			);
			vi.stubGlobal('fetch', fetchMock);

			const store = new TimelineStore({ enableRealtime: false });
			const loadPromise = store.loadInitial(baseUrl);

			expect(store.loading).toBe(true);

			if (resolvePromise) resolvePromise(responseFor([makeStatus('a')]));
			await loadPromise;

			expect(store.loading).toBe(false);
		});
	});

	describe('Timeline Types', () => {
		it('uses correct endpoint for public timeline', async () => {
			const fetchMock = vi.fn().mockResolvedValue(responseFor([]));
			vi.stubGlobal('fetch', fetchMock);

			const store = new TimelineStore({ type: 'public', enableRealtime: false });
			await store.loadInitial(baseUrl);

			expect(fetchMock).toHaveBeenCalledWith(
				expect.stringContaining('/api/v1/timelines/public'),
				expect.any(Object)
			);
		});

		it('uses correct endpoint for home timeline', async () => {
			const fetchMock = vi.fn().mockResolvedValue(responseFor([]));
			vi.stubGlobal('fetch', fetchMock);

			const store = new TimelineStore({ type: 'home', enableRealtime: false });
			await store.loadInitial(baseUrl);

			expect(fetchMock).toHaveBeenCalledWith(
				expect.stringContaining('/api/v1/timelines/home'),
				expect.any(Object)
			);
		});

		it('uses correct endpoint for local timeline', async () => {
			const fetchMock = vi.fn().mockResolvedValue(responseFor([]));
			vi.stubGlobal('fetch', fetchMock);

			const store = new TimelineStore({ type: 'local', enableRealtime: false });
			await store.loadInitial(baseUrl);

			expect(fetchMock).toHaveBeenCalledWith(
				expect.stringContaining('/api/v1/timelines/local'),
				expect.any(Object)
			);
		});
	});
});
