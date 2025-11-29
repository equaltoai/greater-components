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

describe('TimelineStore', () => {
	it('loads initial statuses respecting preloadCount', async () => {
		const fetchMock = vi.fn().mockResolvedValue(responseFor([makeStatus('a'), makeStatus('b')]));
		vi.stubGlobal('fetch', fetchMock);

		const store = new TimelineStore({ preloadCount: 2, enableRealtime: false });
		await store.loadInitial(baseUrl);

		expect(store.items).toHaveLength(2);
		expect(store.currentState.endReached).toBe(false);
		expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/api/v1/timelines/public'), {
			headers: {},
			signal: expect.any(AbortSignal),
		});
	});

	it('prepends newer statuses when loadNewer is invoked', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(responseFor([makeStatus('first'), makeStatus('second')]))
			.mockResolvedValueOnce(responseFor([makeStatus('newest'), makeStatus('recent')]));
		vi.stubGlobal('fetch', fetchMock);

		const store = new TimelineStore({ preloadCount: 2, enableRealtime: false });
		await store.loadInitial(baseUrl);
		await store.loadNewer(baseUrl);

		expect(store.items.slice(0, 2).map((status) => status.id)).toEqual(['newest', 'recent']);
	});

	it('appends older batches and marks endReached when page smaller than preloadCount', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(responseFor([makeStatus('one'), makeStatus('two')]))
			.mockResolvedValueOnce(responseFor([makeStatus('older')]));
		vi.stubGlobal('fetch', fetchMock);

		const store = new TimelineStore({ preloadCount: 2, enableRealtime: false });
		await store.loadInitial(baseUrl);
		await store.loadOlder(baseUrl);

		expect(store.items.at(-1)?.id).toBe('older');
		expect(store.currentState.endReached).toBe(true);
	});

	it('streams updates via transport and trims to maxItems', () => {
		const transport = new MockTransport();
		const store = new TimelineStore({ maxItems: 2, enableRealtime: true });
		store.connectTransport(transport as unknown as any);

		transport.emit('connection.open');
		expect(store.connected).toBe(true);

		transport.emit('status.update', makeStatus('stream-1'));
		transport.emit('status.update', makeStatus('stream-2'));
		transport.emit('status.update', makeStatus('stream-3'));

		expect(store.items).toHaveLength(2);
		expect(store.items[0]?.id).toBe('stream-3');
		expect(store.unreadCount).toBe(3);
	});
});
