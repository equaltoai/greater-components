import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTimelineStore } from '../timelineStore.js';
import type { TimelineItem, TimelineConfig, TimelineSource } from '../types.js';
import * as fetchHelpers from '../fetchHelpers.js';
import { LesserGraphQLAdapter } from '../../graphql/LesserGraphQLAdapter.js';

// Mock fetchHelpers
vi.mock('../fetchHelpers.js', () => ({
	fetchTimelinePage: vi.fn(),
}));

const transportManagerStub = {
	on: vi.fn().mockReturnValue(() => {}),
	send: vi.fn(),
	connect: vi.fn(),
	disconnect: vi.fn(),
} as unknown as NonNullable<TimelineConfig['transportManager']>;

const adapterStub = {
	deleteObject: vi.fn().mockResolvedValue(true),
} as unknown as LesserGraphQLAdapter;

const baseItem: TimelineItem = {
	id: 'status-1',
	type: 'status',
	timestamp: Date.now(),
	content: { id: 'status-1', createdAt: new Date().toISOString() },
};

describe('timelineStore', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.runAllTimers();
		vi.useRealTimers();
	});

	describe('Initialization', () => {
		it('should initialize with provided items', () => {
			const store = createTimelineStore({
				initialItems: [baseItem],
			});
			expect(store.get().items).toHaveLength(1);
			expect(store.get().items[0]?.id).toBe(baseItem.id);
		});

		it('should initialize with default empty state', () => {
			const store = createTimelineStore({});
			expect(store.get().items).toHaveLength(0);
			expect(store.get().isLoading).toBe(false);
		});
	});

	describe('Pagination', () => {
		it('should fetch page on loadMore', async () => {
			const mockPageResult = {
				items: [
					{
						id: 'status-2',
						createdAt: new Date().toISOString(),
						account: { id: 'acc-2' },
						content: 'content',
					} as any,
				],
				pageInfo: { hasNextPage: true, endCursor: 'cursor-2' },
			};
			(fetchHelpers.fetchTimelinePage as any).mockResolvedValue(mockPageResult);

			const store = createTimelineStore({
				adapter: adapterStub,
				timeline: { type: 'home' } as TimelineSource,
				initialPageInfo: { hasNextPage: true, endCursor: 'cursor-1' },
				updateDebounceMs: 0,
			});

			const loadPromise = store.loadMore();

			// Check loading state
			expect(store.get().isLoading).toBe(true);

			await loadPromise;
			vi.runAllTimers();

			expect(fetchHelpers.fetchTimelinePage).toHaveBeenCalledWith(
				expect.objectContaining({
					after: 'cursor-1',
				})
			);

			expect(store.get().items).toHaveLength(1);
			expect(store.get().items[0]?.id).toBe('status-2');
			expect(store.get().pageInfo.endCursor).toBe('cursor-2');
			expect(store.get().isLoading).toBe(false);
		});

		it('should not load more if no next page', async () => {
			const store = createTimelineStore({
				adapter: adapterStub,
				timeline: { type: 'home' } as TimelineSource,
				initialPageInfo: { hasNextPage: false, endCursor: 'cursor-1' },
			});

			await store.loadMore();
			expect(fetchHelpers.fetchTimelinePage).not.toHaveBeenCalled();
		});

		it('should refresh timeline', async () => {
			const mockPageResult = {
				items: [
					{
						id: 'status-new',
						createdAt: new Date().toISOString(),
						account: { id: 'acc-new' },
						content: 'content',
					} as any,
				],
				pageInfo: { hasNextPage: true, endCursor: 'new-cursor' },
			};
			(fetchHelpers.fetchTimelinePage as any).mockResolvedValue(mockPageResult);

			const store = createTimelineStore({
				adapter: adapterStub,
				timeline: { type: 'home' } as TimelineSource,
				initialItems: [baseItem],
				updateDebounceMs: 0,
			});

			await store.refresh();
			vi.runAllTimers();

			expect(fetchHelpers.fetchTimelinePage).toHaveBeenCalledWith(
				expect.objectContaining({
					after: null,
				})
			);

			expect(store.get().items).toHaveLength(1);
			expect(store.get().items[0]?.id).toBe('status-new');
		});

		it('should handle fetch errors', async () => {
			const error = new Error('Fetch failed');
			(fetchHelpers.fetchTimelinePage as any).mockRejectedValue(error);

			const store = createTimelineStore({
				adapter: adapterStub,
				timeline: { type: 'home' } as TimelineSource,
				initialPageInfo: { hasNextPage: true },
			});

			await expect(store.loadMore()).rejects.toThrow('Fetch failed');
			expect(store.get().error).toBe(error);
			expect(store.get().isLoading).toBe(false);
		});

		it('should fail if missing adapter or source', async () => {
			const store = createTimelineStore({});
			await expect(store.refresh()).rejects.toThrow('Timeline adapter and source are required');
		});
	});

	describe('CRUD Operations', () => {
		it('should add item optimistically', () => {
			const store = createTimelineStore({
				updateDebounceMs: 0,
			});

			store.addItem({
				content: { id: 'new', createdAt: new Date().toISOString() },
				type: 'status',
			});

			const items = store.get().items;
			expect(items).toHaveLength(1);
			expect(items[0]?.isOptimistic).toBe(true);
		});

		it('should replace item', () => {
			const store = createTimelineStore({
				initialItems: [baseItem],
				updateDebounceMs: 0,
			});

			store.replaceItem(baseItem.id, { isOptimistic: true });

			const items = store.get().items;
			expect(items[0]?.isOptimistic).toBe(true);
		});

		it('should delete item', () => {
			const store = createTimelineStore({
				initialItems: [baseItem],
				updateDebounceMs: 0,
			});

			store.deleteItem(baseItem.id);
			expect(store.get().items).toHaveLength(0);
		});
	});

	describe('Virtual Window', () => {
		it('should update virtual window', () => {
			const store = createTimelineStore({});
			store.updateVirtualWindow(0, 10);
			const window = store.get().virtualWindow;
			expect(window.startIndex).toBe(0);
			expect(window.endIndex).toBe(10);
		});
	});

	describe('Lesser Filters', () => {
		const richItem: TimelineItem = {
			id: 'rich-1',
			type: 'status',
			timestamp: Date.now(),
			content: { id: 'rich-1' },
			metadata: {
				lesser: {
					estimatedCost: 10,
					authorTrustScore: 0.9,
					hasCommunityNotes: true,
					isQuote: true,
					aiModerationAction: 'FLAG',
				},
			},
		};

		let store: ReturnType<typeof createTimelineStore>;

		beforeEach(() => {
			store = createTimelineStore({
				initialItems: [baseItem, richItem],
			});
		});

		it('should filter by cost', () => {
			expect(store.getItemsWithCost(5)).toHaveLength(0);
			expect(store.getItemsWithCost(15)).toHaveLength(1);
		});

		it('should filter by trust score', () => {
			expect(store.getItemsWithTrustScore(0.8)).toHaveLength(1);
			expect(store.getItemsWithTrustScore(1.0)).toHaveLength(0);
		});

		it('should filter by community notes', () => {
			expect(store.getItemsWithCommunityNotes()).toHaveLength(1);
		});

		it('should filter quote posts', () => {
			expect(store.getQuotePosts()).toHaveLength(1);
		});

		it('should filter moderated items', () => {
			expect(store.getModeratedItems('FLAG')).toHaveLength(1);
			expect(store.getModeratedItems('HIDE')).toHaveLength(0);
		});
	});

	describe('Deletion Behavior', () => {
		it('converts deleteStatus into a tombstone when deletionMode is tombstone', async () => {
			const store = createTimelineStore({
				transportManager: transportManagerStub,
				adapter: adapterStub,
				initialItems: [baseItem],
				deletionMode: 'tombstone',
				updateDebounceMs: 0,
			});

			await store.deleteStatus(baseItem.id);

			vi.runAllTimers();

			const items = store.get().items;
			expect(items).toHaveLength(1);
			const [first] = items;
			expect(first?.type).toBe('tombstone');
			expect(first?.metadata?.lesser?.isDeleted).toBe(true);
			expect(adapterStub.deleteObject).toHaveBeenCalledWith(baseItem.id);
		});

		it('removes items when deletionMode is remove', async () => {
			const store = createTimelineStore({
				transportManager: transportManagerStub,
				adapter: adapterStub,
				initialItems: [baseItem],
				deletionMode: 'remove',
				updateDebounceMs: 0,
			});

			await store.deleteStatus(baseItem.id);

			expect(store.get().items).toHaveLength(0);
		});

		it('normalizes streaming delete edits into tombstones', async () => {
			const store = createTimelineStore({
				transportManager: transportManagerStub,
				adapter: adapterStub,
				initialItems: [baseItem],
				deletionMode: 'tombstone',
				updateDebounceMs: 0,
			});

			store.applyStreamingEdit({
				type: 'delete',
				itemId: baseItem.id,
				timestamp: Date.now(),
			});

			vi.runAllTimers();

			const item = store.get().items.find((candidate) => candidate.id === baseItem.id);
			expect(item?.type).toBe('tombstone');
			expect(item?.metadata?.lesser?.isDeleted).toBe(true);
		});
	});

	describe('Streaming', () => {
		it('should start and stop streaming', () => {
			const store = createTimelineStore({
				transportManager: transportManagerStub,
			});

			store.startStreaming();
			expect(store.get().isStreaming).toBe(true);
			expect(transportManagerStub.on).toHaveBeenCalled();

			store.stopStreaming();
			expect(store.get().isStreaming).toBe(false);
		});

		it('should handle streaming updates', () => {
			const store = createTimelineStore({
				transportManager: transportManagerStub,
				updateDebounceMs: 0,
			});

			store.applyStreamingEdit({
				type: 'add',
				itemId: 'new-streamed',
				data: { type: 'status', content: { id: 'new-streamed' } },
				timestamp: Date.now(),
			});

			vi.runAllTimers();

			expect(store.get().items.some((i) => i.id === 'new-streamed')).toBe(true);
		});
	});
});
