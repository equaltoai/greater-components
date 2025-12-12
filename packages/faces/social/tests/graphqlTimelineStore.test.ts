/**
 * GraphQLTimelineStore Tests
 *
 * Tests for the GraphQL timeline store adapter.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GraphQLTimelineStore, type GraphQLTimelineView } from '../src/lib/graphqlTimelineStore';

// Factory functions
const makeGraphQLStatus = (id: string, overrides = {}) => ({
	id,
	uri: `https://example.social/@user/${id}`,
	url: `https://example.social/@user/${id}`,
	content: `<p>Status ${id}</p>`,
	createdAt: '2024-01-15T12:00:00Z',
	visibility: 'public',
	sensitive: false,
	spoilerText: '',
	repliesCount: 0,
	reblogsCount: 0,
	favouritesCount: 0,
	account: {
		id: `acct-${id}`,
		username: 'testuser',
		displayName: 'Test User',
		avatar: 'https://example.social/avatar.jpg',
	},
	mediaAttachments: [],
	mentions: [],
	tags: [],
	...overrides,
});

const makeTimelineResponse = (statuses: ReturnType<typeof makeGraphQLStatus>[], hasMore = true) => ({
	edges: statuses.map((status) => ({ node: status, cursor: status.id })),
	pageInfo: {
		hasNextPage: hasMore,
		endCursor: statuses.length > 0 ? statuses[statuses.length - 1].id : null,
		startCursor: statuses.length > 0 ? statuses[0].id : null,
	},
});

const createMockAdapter = () => ({
	fetchHomeTimeline: vi.fn(),
	fetchPublicTimeline: vi.fn(),
	fetchHashtagTimeline: vi.fn(),
	fetchListTimeline: vi.fn(),
	fetchActorTimeline: vi.fn(),
	getActorByUsername: vi.fn(),
	getObject: vi.fn(),
});

describe('GraphQLTimelineStore', () => {
	let mockAdapter: ReturnType<typeof createMockAdapter>;

	beforeEach(() => {
		mockAdapter = createMockAdapter();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('construction', () => {
		it('creates store with default state', () => {
			const view: GraphQLTimelineView = { type: 'public' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			const state = store.currentState;
			expect(state.items).toEqual([]);
			expect(state.loading).toBe(false);
			expect(state.error).toBeNull();
			expect(state.connected).toBe(true);
		});
	});

	describe('connect', () => {
		it('loads initial data when items are empty', async () => {
			const statuses = [makeGraphQLStatus('1')];
			mockAdapter.fetchPublicTimeline.mockResolvedValue(makeTimelineResponse(statuses));

			const view: GraphQLTimelineView = { type: 'public' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.connect();

			expect(store.items.length).toBe(1);
		});

		it('does not reload when items exist', async () => {
			const statuses = [makeGraphQLStatus('1')];
			mockAdapter.fetchPublicTimeline.mockResolvedValue(makeTimelineResponse(statuses));

			const view: GraphQLTimelineView = { type: 'public' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.connect();
			mockAdapter.fetchPublicTimeline.mockClear();

			await store.connect();

			expect(mockAdapter.fetchPublicTimeline).not.toHaveBeenCalled();
		});
	});

	describe('loadInitial', () => {
		it('loads public timeline', async () => {
			const statuses = [makeGraphQLStatus('1'), makeGraphQLStatus('2')];
			mockAdapter.fetchPublicTimeline.mockResolvedValue(makeTimelineResponse(statuses, false));

			const view: GraphQLTimelineView = { type: 'public' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.loadInitial();

			expect(store.items.length).toBe(2);
			expect(store.currentState.endReached).toBe(true);
		});

		it('loads home timeline', async () => {
			const statuses = [makeGraphQLStatus('1')];
			mockAdapter.fetchHomeTimeline.mockResolvedValue(makeTimelineResponse(statuses));

			const view: GraphQLTimelineView = { type: 'home' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.loadInitial();

			expect(mockAdapter.fetchHomeTimeline).toHaveBeenCalled();
			expect(store.items.length).toBe(1);
		});

		it('loads hashtag timeline', async () => {
			const statuses = [makeGraphQLStatus('1')];
			mockAdapter.fetchHashtagTimeline.mockResolvedValue(makeTimelineResponse(statuses));

			const view: GraphQLTimelineView = { type: 'hashtag', hashtag: 'svelte' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.loadInitial();

			expect(mockAdapter.fetchHashtagTimeline).toHaveBeenCalledWith('svelte', expect.any(Object));
		});

		it('loads list timeline', async () => {
			const statuses = [makeGraphQLStatus('1')];
			mockAdapter.fetchListTimeline.mockResolvedValue(makeTimelineResponse(statuses));

			const view: GraphQLTimelineView = { type: 'list', listId: 'list-123' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.loadInitial();

			expect(mockAdapter.fetchListTimeline).toHaveBeenCalledWith('list-123', expect.any(Object));
		});

		it('loads profile timeline', async () => {
			const actor = { id: 'actor-1', username: 'testuser' };
			const statuses = [makeGraphQLStatus('1')];
			mockAdapter.getActorByUsername.mockResolvedValue(actor);
			mockAdapter.fetchActorTimeline.mockResolvedValue(makeTimelineResponse(statuses));

			const view: GraphQLTimelineView = { type: 'profile', username: 'testuser' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.loadInitial();

			expect(mockAdapter.getActorByUsername).toHaveBeenCalledWith('testuser');
			expect(mockAdapter.fetchActorTimeline).toHaveBeenCalledWith('actor-1', expect.any(Object));
		});

		it('uses cached actorId for profile timeline', async () => {
			const statuses = [makeGraphQLStatus('1')];
			mockAdapter.fetchActorTimeline.mockResolvedValue(makeTimelineResponse(statuses));

			const view: GraphQLTimelineView = { type: 'profile', username: 'testuser', actorId: 'cached-actor' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.loadInitial();

			expect(mockAdapter.getActorByUsername).not.toHaveBeenCalled();
			expect(mockAdapter.fetchActorTimeline).toHaveBeenCalledWith('cached-actor', expect.any(Object));
		});

		it('prevents concurrent loads', async () => {
			mockAdapter.fetchPublicTimeline.mockImplementation(
				() =>
					new Promise((resolve) =>
						setTimeout(() => resolve(makeTimelineResponse([makeGraphQLStatus('1')])), 100)
					)
			);

			const view: GraphQLTimelineView = { type: 'public' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			const load1 = store.loadInitial();
			const load2 = store.loadInitial();

			await Promise.all([load1, load2]);

			expect(mockAdapter.fetchPublicTimeline).toHaveBeenCalledTimes(1);
		});

		it('handles errors', async () => {
			mockAdapter.fetchPublicTimeline.mockRejectedValue(new Error('Network error'));

			const view: GraphQLTimelineView = { type: 'public' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.loadInitial();

			expect(store.currentState.error).toBe('Network error');
			expect(store.currentState.loading).toBe(false);
		});
	});

	describe('loadNewer', () => {
		it('loads newer items and prepends them', async () => {
			const initialStatuses = [makeGraphQLStatus('1')];
			const newerStatuses = [makeGraphQLStatus('2')];

			mockAdapter.fetchPublicTimeline
				.mockResolvedValueOnce(makeTimelineResponse(initialStatuses))
				.mockResolvedValueOnce(makeTimelineResponse(newerStatuses));

			const view: GraphQLTimelineView = { type: 'public' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.loadInitial();
			await store.loadNewer();

			expect(store.items.length).toBe(2);
			expect(store.items[0].id).toBe('2'); // Newer item prepended
		});

		it('clears unread count after loading newer', async () => {
			mockAdapter.fetchPublicTimeline.mockResolvedValue(makeTimelineResponse([makeGraphQLStatus('1')]));

			const view: GraphQLTimelineView = { type: 'public' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.loadInitial();
			await store.loadNewer();

			expect(store.currentState.unreadCount).toBe(0);
		});

		it('handles errors', async () => {
			mockAdapter.fetchPublicTimeline
				.mockResolvedValueOnce(makeTimelineResponse([makeGraphQLStatus('1')]))
				.mockRejectedValueOnce(new Error('Load newer failed'));

			const view: GraphQLTimelineView = { type: 'public' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.loadInitial();
			await store.loadNewer();

			expect(store.currentState.error).toBe('Load newer failed');
			expect(store.currentState.loadingTop).toBe(false);
		});
	});

	describe('loadOlder', () => {
		it('loads older items and appends them', async () => {
			const initialStatuses = Array.from({ length: 20 }, (_, i) => makeGraphQLStatus(`${i + 1}`));
			const olderStatuses = [makeGraphQLStatus('21')];

			mockAdapter.fetchPublicTimeline
				.mockResolvedValueOnce(makeTimelineResponse(initialStatuses, true))
				.mockResolvedValueOnce(makeTimelineResponse(olderStatuses, false));

			const view: GraphQLTimelineView = { type: 'public' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.loadInitial();
			await store.loadOlder();

			expect(store.items.length).toBe(21);
			expect(store.items[20].id).toBe('21');
		});

		it('does nothing when endReached', async () => {
			const statuses = [makeGraphQLStatus('1')]; // Less than 20 = endReached
			mockAdapter.fetchPublicTimeline.mockResolvedValue(makeTimelineResponse(statuses, false));

			const view: GraphQLTimelineView = { type: 'public' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.loadInitial();
			mockAdapter.fetchPublicTimeline.mockClear();

			await store.loadOlder();

			expect(mockAdapter.fetchPublicTimeline).not.toHaveBeenCalled();
		});

		it('handles errors', async () => {
			const initialStatuses = Array.from({ length: 20 }, (_, i) => makeGraphQLStatus(`${i + 1}`));
			mockAdapter.fetchPublicTimeline
				.mockResolvedValueOnce(makeTimelineResponse(initialStatuses, true))
				.mockRejectedValueOnce(new Error('Load older failed'));

			const view: GraphQLTimelineView = { type: 'public' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.loadInitial();
			await store.loadOlder();

			expect(store.currentState.error).toBe('Load older failed');
			expect(store.currentState.loadingBottom).toBe(false);
		});
	});

	describe('refresh', () => {
		it('clears and reloads timeline', async () => {
			const initialStatuses = [makeGraphQLStatus('1')];
			const refreshedStatuses = [makeGraphQLStatus('2')];

			mockAdapter.fetchPublicTimeline
				.mockResolvedValueOnce(makeTimelineResponse(initialStatuses))
				.mockResolvedValueOnce(makeTimelineResponse(refreshedStatuses));

			const view: GraphQLTimelineView = { type: 'public' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.loadInitial();
			expect(store.items[0].id).toBe('1');

			await store.refresh();
			expect(store.items[0].id).toBe('2');
		});
	});

	describe('updateStatus', () => {
		it('updates an existing status', async () => {
			const statuses = [makeGraphQLStatus('1', { content: 'Original' })];
			mockAdapter.fetchPublicTimeline.mockResolvedValue(makeTimelineResponse(statuses));

			const view: GraphQLTimelineView = { type: 'public' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.loadInitial();

			store.updateStatus({
				...store.items[0],
				content: 'Updated',
			});

			expect(store.items[0].content).toBe('Updated');
		});

		it('does nothing for non-existent status', async () => {
			const statuses = [makeGraphQLStatus('1')];
			mockAdapter.fetchPublicTimeline.mockResolvedValue(makeTimelineResponse(statuses));

			const view: GraphQLTimelineView = { type: 'public' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.loadInitial();

			store.updateStatus({
				...store.items[0],
				id: 'nonexistent',
				content: 'Updated',
			});

			expect(store.items.length).toBe(1);
			expect(store.items[0].id).toBe('1');
		});
	});

	describe('clearUnreadCount', () => {
		it('resets unread count to zero', () => {
			const view: GraphQLTimelineView = { type: 'public' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			store.clearUnreadCount();

			expect(store.currentState.unreadCount).toBe(0);
		});
	});

	describe('destroy', () => {
		it('calls disconnect', async () => {
			const view: GraphQLTimelineView = { type: 'public' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			const disconnectSpy = vi.spyOn(store, 'disconnect');

			store.destroy();

			expect(disconnectSpy).toHaveBeenCalled();
		});
	});

	describe('extractItems', () => {
		it('handles array response', async () => {
			const statuses = [makeGraphQLStatus('1')];
			mockAdapter.fetchPublicTimeline.mockResolvedValue(statuses);

			const view: GraphQLTimelineView = { type: 'public' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.loadInitial();

			expect(store.items.length).toBe(1);
		});

		it('handles nodes response format', async () => {
			const statuses = [makeGraphQLStatus('1')];
			mockAdapter.fetchPublicTimeline.mockResolvedValue({
				nodes: statuses,
				pageInfo: { hasNextPage: false },
			});

			const view: GraphQLTimelineView = { type: 'public' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.loadInitial();

			expect(store.items.length).toBe(1);
		});

		it('handles items response format', async () => {
			const statuses = [makeGraphQLStatus('1')];
			mockAdapter.fetchPublicTimeline.mockResolvedValue({
				items: statuses,
				pageInfo: { hasNextPage: false },
			});

			const view: GraphQLTimelineView = { type: 'public' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.loadInitial();

			expect(store.items.length).toBe(1);
		});
	});

	describe('mapToStatus', () => {
		it('handles media attachments', async () => {
			const statusWithMedia = makeGraphQLStatus('1', {
				mediaAttachments: [
					{
						id: 'media-1',
						type: 'image',
						url: 'https://example.com/image.jpg',
						previewUrl: 'https://example.com/preview.jpg',
						description: 'An image',
					},
				],
			});
			mockAdapter.fetchPublicTimeline.mockResolvedValue(makeTimelineResponse([statusWithMedia]));

			const view: GraphQLTimelineView = { type: 'public' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.loadInitial();

			expect(store.items[0].mediaAttachments).toHaveLength(1);
			expect(store.items[0].mediaAttachments?.[0].id).toBe('media-1');
		});

		it('handles reblog', async () => {
			const rebloggedStatus = makeGraphQLStatus('original', { content: 'Original content' });
			const statusWithReblog = makeGraphQLStatus('1', {
				reblog: rebloggedStatus,
			});
			mockAdapter.fetchPublicTimeline.mockResolvedValue(makeTimelineResponse([statusWithReblog]));

			const view: GraphQLTimelineView = { type: 'public' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.loadInitial();

			expect(store.items[0].reblog).toBeDefined();
			expect(store.items[0].reblog?.content).toBe('Original content');
		});

		it('filters out invalid items', async () => {
			const validStatus = makeGraphQLStatus('1');
			const invalidStatus = { id: 'invalid' }; // Missing required fields

			mockAdapter.fetchPublicTimeline.mockResolvedValue({
				edges: [
					{ node: validStatus, cursor: '1' },
					{ node: invalidStatus, cursor: '2' },
				],
				pageInfo: { hasNextPage: false },
			});

			const view: GraphQLTimelineView = { type: 'public' };
			const store = new GraphQLTimelineStore(
				mockAdapter as unknown as Parameters<typeof GraphQLTimelineStore['prototype']['constructor']>[0],
				view
			);

			await store.loadInitial();

			expect(store.items.length).toBe(1);
		});
	});
});
