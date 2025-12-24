/**
 * LesserTimelineStore Tests
 *
 * Tests for the Lesser timeline store with GraphQL integration.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LesserTimelineStore } from '../src/lib/lesserTimelineStore';
import type { LesserTimelineConfig } from '../src/lib/lesserTimelineStore';

// Mock the adapters module
vi.mock('@equaltoai/greater-components-adapters', () => ({
	mapLesserTimelineConnection: vi.fn((connection) => ({
		successful: connection?.edges?.map((e: { node: unknown }) => e.node) ?? [],
		failed: [],
	})),
	unifiedStatusToTimelineItem: vi.fn((status) => ({
		id: status.id,
		type: 'status',
		status,
		timestamp: new Date(status.createdAt),
		metadata: status.metadata,
	})),
	convertGraphQLObjectToLesser: vi.fn((obj) => obj),
	mapLesserObject: vi.fn((obj) => ({ success: true, data: obj })),
}));

// Factory functions
const makeUnifiedStatus = (id: string, overrides = {}) => ({
	id,
	uri: `https://example.social/@user/${id}`,
	url: `https://example.social/@user/${id}`,
	content: `<p>Status ${id}</p>`,
	createdAt: '2024-01-15T12:00:00Z',
	editedAt: undefined,
	visibility: 'public' as const,
	sensitive: false,
	spoilerText: '',
	repliesCount: 0,
	reblogsCount: 0,
	favouritesCount: 0,
	reblogged: false,
	favourited: false,
	bookmarked: false,
	muted: false,
	pinned: false,
	account: {
		id: `acct-${id}`,
		username: 'testuser',
		acct: 'testuser@example.social',
		displayName: 'Test User',
		avatar: 'https://example.social/avatar.jpg',
		header: 'https://example.social/header.jpg',
		note: 'Test bio',
		createdAt: '2024-01-01T00:00:00Z',
		followersCount: 100,
		followingCount: 50,
		statusesCount: 500,
		locked: false,
		emojis: [],
		fields: [],
		verified: false,
		bot: false,
		metadata: {
			source: 'unknown' as const,
			apiVersion: '1',
			lastUpdated: 1704067200000,
		},
	},
	mediaAttachments: [],
	mentions: [],
	tags: [],
	emojis: [],
	metadata: {
		source: 'unknown' as const,
		apiVersion: '1',
		lastUpdated: 1704067200000,
	},
	...overrides,
});

const makeTimelineResponse = (
	statuses: ReturnType<typeof makeUnifiedStatus>[],
	hasMore = true
) => ({
	edges: statuses.map((status) => ({ node: status, cursor: status.id })),
	pageInfo: {
		hasNextPage: hasMore,
		endCursor: statuses.length > 0 ? statuses[statuses.length - 1].id : null,
	},
});

const createMockAdapter = () => ({
	fetchTimeline: vi.fn(),
	getObject: vi.fn(),
	createNote: vi.fn(),
	deleteNote: vi.fn(),
	like: vi.fn(),
	unlike: vi.fn(),
	boost: vi.fn(),
	unboost: vi.fn(),
});

describe('LesserTimelineStore', () => {
	let mockAdapter: ReturnType<typeof createMockAdapter>;

	beforeEach(() => {
		mockAdapter = createMockAdapter();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('construction', () => {
		it('creates store with default config', () => {
			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			const state = store.getState();
			expect(state.items).toEqual([]);
			expect(state.loading).toBe(false);
			expect(state.hasMore).toBe(true);
			expect(state.error).toBeNull();
		});

		it('creates store with custom config', () => {
			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
				maxItems: 500,
				preloadCount: 10,
				type: 'HOME',
				enableRealtime: false,
			});

			expect(store.getState().items).toEqual([]);
		});
	});

	describe('loadInitial', () => {
		it('loads initial timeline data', async () => {
			const statuses = [makeUnifiedStatus('1'), makeUnifiedStatus('2')];
			mockAdapter.fetchTimeline.mockResolvedValue(makeTimelineResponse(statuses, false));

			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
				preloadCount: 2,
			});

			await store.loadInitial();

			expect(store.getItems().length).toBe(2);
			expect(store.getState().loading).toBe(false);
			expect(store.getState().connected).toBe(true);
		});

		it('prevents concurrent loads', async () => {
			mockAdapter.fetchTimeline.mockImplementation(
				() =>
					new Promise((resolve) =>
						setTimeout(() => resolve(makeTimelineResponse([makeUnifiedStatus('1')])), 100)
					)
			);

			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			const load1 = store.loadInitial();
			const load2 = store.loadInitial();

			await Promise.all([load1, load2]);

			expect(mockAdapter.fetchTimeline).toHaveBeenCalledTimes(1);
		});

		it('handles errors', async () => {
			mockAdapter.fetchTimeline.mockRejectedValue(new Error('Network error'));

			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			await store.loadInitial();

			expect(store.getState().error).toBe('Network error');
			expect(store.getState().loading).toBe(false);
		});

		it('sets hasMore based on pageInfo', async () => {
			mockAdapter.fetchTimeline.mockResolvedValue(
				makeTimelineResponse([makeUnifiedStatus('1')], false)
			);

			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			await store.loadInitial();

			expect(store.getState().hasMore).toBe(false);
		});
	});

	describe('loadMore', () => {
		it('loads additional items', async () => {
			const initialStatuses = [makeUnifiedStatus('1'), makeUnifiedStatus('2')];
			const moreStatuses = [makeUnifiedStatus('3'), makeUnifiedStatus('4')];

			mockAdapter.fetchTimeline
				.mockResolvedValueOnce(makeTimelineResponse(initialStatuses, true))
				.mockResolvedValueOnce(makeTimelineResponse(moreStatuses, false));

			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			await store.loadInitial();
			await store.loadMore();

			expect(store.getItems().length).toBe(4);
		});

		it('does nothing when hasMore is false', async () => {
			mockAdapter.fetchTimeline.mockResolvedValue(
				makeTimelineResponse([makeUnifiedStatus('1')], false)
			);

			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			await store.loadInitial();
			mockAdapter.fetchTimeline.mockClear();

			await store.loadMore();

			expect(mockAdapter.fetchTimeline).not.toHaveBeenCalled();
		});

		it('does nothing when no cursor', async () => {
			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			await store.loadMore();

			expect(mockAdapter.fetchTimeline).not.toHaveBeenCalled();
		});

		it('deduplicates items', async () => {
			const initialStatuses = [makeUnifiedStatus('1'), makeUnifiedStatus('2')];
			const moreStatuses = [makeUnifiedStatus('2'), makeUnifiedStatus('3')]; // '2' is duplicate

			mockAdapter.fetchTimeline
				.mockResolvedValueOnce(makeTimelineResponse(initialStatuses, true))
				.mockResolvedValueOnce(makeTimelineResponse(moreStatuses, false));

			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			await store.loadInitial();
			await store.loadMore();

			const ids = store.getItems().map((item) => item.id);
			expect(ids).toEqual(['1', '2', '3']);
		});

		it('handles errors', async () => {
			mockAdapter.fetchTimeline
				.mockResolvedValueOnce(makeTimelineResponse([makeUnifiedStatus('1')], true))
				.mockRejectedValueOnce(new Error('Load more failed'));

			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			await store.loadInitial();
			await store.loadMore();

			expect(store.getState().error).toBe('Load more failed');
			expect(store.getState().loadingMore).toBe(false);
		});
	});

	describe('refresh', () => {
		it('clears and reloads timeline', async () => {
			const initialStatuses = [makeUnifiedStatus('1')];
			const refreshedStatuses = [makeUnifiedStatus('2')];

			mockAdapter.fetchTimeline
				.mockResolvedValueOnce(makeTimelineResponse(initialStatuses, false))
				.mockResolvedValueOnce(makeTimelineResponse(refreshedStatuses, false));

			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			await store.loadInitial();
			expect(store.getItems()[0].id).toBe('1');

			await store.refresh();
			expect(store.getItems()[0].id).toBe('2');
		});
	});

	describe('addStatus', () => {
		it('adds new status to the front', async () => {
			mockAdapter.fetchTimeline.mockResolvedValue(makeTimelineResponse([makeUnifiedStatus('1')]));

			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			await store.loadInitial();

			store.addStatus(makeUnifiedStatus('new'));

			const ids = store.getItems().map((item) => item.id);
			expect(ids[0]).toBe('new');
		});

		it('deduplicates when adding existing id', async () => {
			mockAdapter.fetchTimeline.mockResolvedValue(makeTimelineResponse([makeUnifiedStatus('1')]));

			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			await store.loadInitial();

			// Add updated version of existing status
			store.addStatus(makeUnifiedStatus('1', { content: 'Updated content' }));

			expect(store.getItems().length).toBe(1);
			expect(store.getItems()[0].id).toBe('1');
		});

		it('respects maxItems limit', async () => {
			mockAdapter.fetchTimeline.mockResolvedValue(
				makeTimelineResponse([makeUnifiedStatus('1'), makeUnifiedStatus('2')])
			);

			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
				maxItems: 2,
			});

			await store.loadInitial();

			store.addStatus(makeUnifiedStatus('3'));

			expect(store.getItems().length).toBe(2);
			expect(store.getItems().map((i) => i.id)).toEqual(['3', '1']);
		});
	});

	describe('removeStatus', () => {
		it('removes status by id', async () => {
			mockAdapter.fetchTimeline.mockResolvedValue(
				makeTimelineResponse([makeUnifiedStatus('1'), makeUnifiedStatus('2')])
			);

			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			await store.loadInitial();

			store.removeStatus('1');

			const ids = store.getItems().map((item) => item.id);
			expect(ids).toEqual(['2']);
		});

		it('does nothing for non-existent id', async () => {
			mockAdapter.fetchTimeline.mockResolvedValue(makeTimelineResponse([makeUnifiedStatus('1')]));

			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			await store.loadInitial();

			store.removeStatus('nonexistent');

			expect(store.getItems().length).toBe(1);
		});
	});

	describe('cancel', () => {
		it('aborts pending operations', async () => {
			let resolvePromise: ((value: unknown) => void) | undefined;
			mockAdapter.fetchTimeline.mockImplementation(
				() =>
					new Promise((resolve) => {
						resolvePromise = resolve;
					})
			);

			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			const _loadPromise = store.loadInitial();

			store.cancel();

			// Resolve to avoid hanging
			if (resolvePromise) resolvePromise(makeTimelineResponse([]));
			await _loadPromise;
		});
	});

	describe('destroy', () => {
		it('resets store state', async () => {
			mockAdapter.fetchTimeline.mockResolvedValue(makeTimelineResponse([makeUnifiedStatus('1')]));

			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			await store.loadInitial();
			expect(store.getItems().length).toBe(1);

			store.destroy();

			const state = store.getState();
			expect(state.items).toEqual([]);
			expect(state.loading).toBe(false);
			expect(state.connected).toBe(false);
		});
	});

	describe('getters', () => {
		it('getState returns current state', () => {
			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			const state = store.getState();
			expect(state).toHaveProperty('items');
			expect(state).toHaveProperty('loading');
			expect(state).toHaveProperty('error');
		});

		it('getItems returns items array', () => {
			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			const items = store.getItems();
			expect(Array.isArray(items)).toBe(true);
		});
	});

	describe('timeline configuration', () => {
		it('builds variables for PUBLIC timeline', async () => {
			mockAdapter.fetchTimeline.mockResolvedValue(makeTimelineResponse([]));

			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
				type: 'PUBLIC',
			});

			await store.loadInitial();

			expect(mockAdapter.fetchTimeline).toHaveBeenCalledWith(
				expect.objectContaining({ type: 'PUBLIC' })
			);
		});

		it('builds variables for HASHTAG timeline', async () => {
			mockAdapter.fetchTimeline.mockResolvedValue(makeTimelineResponse([]));

			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
				type: 'HASHTAG',
				hashtag: 'svelte',
			});

			await store.loadInitial();

			expect(mockAdapter.fetchTimeline).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'HASHTAG',
					hashtag: 'svelte',
				})
			);
		});

		it('builds variables for HASHTAG timeline with hashtags array', async () => {
			mockAdapter.fetchTimeline.mockResolvedValue(makeTimelineResponse([]));

			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
				type: 'HASHTAG',
				hashtags: ['svelte', 'javascript'],
			});

			await store.loadInitial();

			expect(mockAdapter.fetchTimeline).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'HASHTAG',
					hashtag: 'svelte', // First hashtag
				})
			);
		});

		it('builds variables for LIST timeline', async () => {
			mockAdapter.fetchTimeline.mockResolvedValue(makeTimelineResponse([]));

			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
				type: 'LIST',
				listId: 'list-123',
			});

			await store.loadInitial();

			expect(mockAdapter.fetchTimeline).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'LIST',
					listId: 'list-123',
				})
			);
		});
	});

	describe('filtering methods', () => {
		const makeItemWithMetadata = (id: string, lesser = {}) => ({
			id,
			type: 'status',
			status: makeUnifiedStatus(id),
			timestamp: new Date(),
			metadata: { lesser },
		});

		it('getItemsWithLesserMetadata filters items with Lesser metadata', async () => {
			mockAdapter.fetchTimeline.mockResolvedValue(makeTimelineResponse([]));

			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			// Manually set items with metadata for testing
			const state = store.getState();
			(state as { items: unknown[] }).items = [
				makeItemWithMetadata('1', { estimatedCost: 0.001 }),
				makeItemWithMetadata('2', {}),
				makeItemWithMetadata('3', { moderationScore: 0.5 }),
			];

			const filtered = store.getItemsWithLesserMetadata();
			expect(filtered.map((i) => i.id)).toEqual(['1', '3']);
		});

		it('getItemsWithCost filters by cost threshold', async () => {
			mockAdapter.fetchTimeline.mockResolvedValue(makeTimelineResponse([]));

			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			const state = store.getState();
			(state as { items: unknown[] }).items = [
				makeItemWithMetadata('1', { estimatedCost: 0.001 }),
				makeItemWithMetadata('2', { estimatedCost: 0.01 }),
				makeItemWithMetadata('3', { estimatedCost: 0.1 }),
			];

			const filtered = store.getItemsWithCost(0.05);
			expect(filtered.map((i) => i.id)).toEqual(['1', '2']);
		});

		it('getItemsWithCost returns all with cost when no threshold', async () => {
			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			const state = store.getState();
			(state as { items: unknown[] }).items = [
				makeItemWithMetadata('1', { estimatedCost: 0.001 }),
				makeItemWithMetadata('2', {}),
			];

			const filtered = store.getItemsWithCost();
			expect(filtered.map((i) => i.id)).toEqual(['1']);
		});

		it('getItemsWithTrustScore filters by minimum trust score', async () => {
			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			const state = store.getState();
			(state as { items: unknown[] }).items = [
				makeItemWithMetadata('1', { authorTrustScore: 0.3 }),
				makeItemWithMetadata('2', { authorTrustScore: 0.8 }),
				makeItemWithMetadata('3', { authorTrustScore: 0.5 }),
			];

			const filtered = store.getItemsWithTrustScore(0.5);
			expect(filtered.map((i) => i.id)).toEqual(['2', '3']);
		});

		it('getItemsWithCommunityNotes filters items with community notes', async () => {
			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			const state = store.getState();
			(state as { items: unknown[] }).items = [
				makeItemWithMetadata('1', { hasCommunityNotes: true }),
				makeItemWithMetadata('2', {}),
				makeItemWithMetadata('3', { communityNotesCount: 2 }),
			];

			const filtered = store.getItemsWithCommunityNotes();
			expect(filtered.map((i) => i.id)).toEqual(['1', '3']);
		});

		it('getQuotePosts filters quote posts', async () => {
			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			const state = store.getState();
			(state as { items: unknown[] }).items = [
				makeItemWithMetadata('1', { isQuote: true }),
				makeItemWithMetadata('2', { isQuote: false }),
				makeItemWithMetadata('3', {}),
			];

			const filtered = store.getQuotePosts();
			expect(filtered.map((i) => i.id)).toEqual(['1']);
		});

		it('getModeratedItems filters items with moderation scores', async () => {
			const store = new LesserTimelineStore({
				adapter: mockAdapter as unknown as LesserTimelineConfig['adapter'],
			});

			const state = store.getState();
			(state as { items: unknown[] }).items = [
				makeItemWithMetadata('1', { moderationScore: 0.8 }),
				makeItemWithMetadata('2', {}),
				makeItemWithMetadata('3', { moderationScore: 0.5, aiModerationAction: 'FLAG' }),
			];

			const allModerated = store.getModeratedItems();
			expect(allModerated.map((i) => i.id)).toEqual(['1', '3']);

			const flagged = store.getModeratedItems('FLAG');
			expect(flagged.map((i) => i.id)).toEqual(['3']);
		});
	});
});
