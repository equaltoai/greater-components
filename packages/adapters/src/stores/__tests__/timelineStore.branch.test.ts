import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTimelineStore } from '../timelineStore.js';
import type { TimelineConfig, TimelineSource } from '../types.js';
import { LesserGraphQLAdapter } from '../../graphql/LesserGraphQLAdapter.js';

// Mock fetchHelpers
vi.mock('../fetchHelpers.js', () => ({
	fetchTimelinePage: vi.fn(),
}));

// Mock mappers
vi.mock('../../mappers/lesser/mappers.js', () => ({
	mapLesserObject: vi.fn(),
	mapLesserStreamingUpdate: vi.fn(),
}));

// Mock graphqlConverters
vi.mock('../../mappers/lesser/graphqlConverters.js', () => ({
	convertGraphQLObjectToLesser: vi.fn(),
}));

// Mock unifiedToTimeline
vi.mock('../unifiedToTimeline.js', () => ({
	unifiedStatusToTimelineItem: vi.fn(),
}));

import { mapLesserObject, mapLesserStreamingUpdate } from '../../mappers/lesser/mappers.js';
import { convertGraphQLObjectToLesser } from '../../mappers/lesser/graphqlConverters.js';
import { unifiedStatusToTimelineItem } from '../unifiedToTimeline.js';
import * as fetchHelpers from '../fetchHelpers.js';

const transportManagerStub = {
	on: vi.fn(),
	send: vi.fn(),
	connect: vi.fn(),
	disconnect: vi.fn(),
} as unknown as NonNullable<TimelineConfig['transportManager']>;

const adapterStub = {
	deleteObject: vi.fn().mockResolvedValue(true),
} as unknown as LesserGraphQLAdapter;

describe('timelineStore branches', () => {
	let store: ReturnType<typeof createTimelineStore>;
	let transportEvents: Record<string, (event: any) => void> = {};

	beforeEach(() => {
		vi.useFakeTimers();
		transportEvents = {};
		(transportManagerStub.on as any).mockImplementation((event: string, handler: any) => {
			transportEvents[event] = handler;
			return () => {};
		});

		// Setup default mock behaviors
		(convertGraphQLObjectToLesser as any).mockImplementation((obj: any) => obj); // Pass through by default
		(mapLesserObject as any).mockImplementation((obj: any) => ({
			success: true,
			data: {
				id: obj.id,
				createdAt: new Date().toISOString(),
				account: { id: 'acc-1' },
			},
		}));
		(unifiedStatusToTimelineItem as any).mockImplementation((status: any) => ({
			id: status.id,
			type: 'status',
			timestamp: Date.now(),
			content: status,
			metadata: {},
		}));

		store = createTimelineStore({
			transportManager: transportManagerStub,
			adapter: adapterStub,
			timeline: { type: 'home' } as TimelineSource,
			updateDebounceMs: 0,
			deletionMode: 'remove',
		});
	});

	afterEach(() => {
		vi.runAllTimers();
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	describe('applyStreamingEdit (Internal Logic)', () => {
		it('should ignore add edit if item exists', () => {
			// Setup: add item first
			store.addItem({ content: { id: 'existing' }, type: 'status' });
			const existingId = store.get().items[0]?.id;
			if (!existingId) throw new Error('Existing item not found');

			// Try to add same ID
			store.applyStreamingEdit({
				type: 'add',
				itemId: existingId,
				data: { type: 'status', content: { id: existingId } },
				timestamp: Date.now(),
			});
			vi.runAllTimers();

			// Should still be 1 item, no duplicate
			expect(store.get().items).toHaveLength(1);
		});

		it('should ignore add edit with missing content', () => {
			store.applyStreamingEdit({
				type: 'add',
				itemId: 'bad-1',
				data: { type: 'status' }, // Missing content
				timestamp: Date.now(),
			});
			vi.runAllTimers();
			expect(store.get().items).toHaveLength(0);
		});

		it('should handle add edit with full metadata and version', () => {
			store.applyStreamingEdit({
				type: 'add',
				itemId: 'full-1',
				data: {
					type: 'status',
					content: { id: 'full-1' },
					metadata: { lesser: { isDeleted: false } },
					version: 5,
					isOptimistic: true,
				},
				timestamp: Date.now(),
			});
			vi.runAllTimers();

			const item = store.get().items[0];
			if (!item) throw new Error('Item not found');
			expect(item.metadata?.lesser?.isDeleted).toBe(false);
			expect(item.version).toBe(5);
			expect(item.isOptimistic).toBe(true);
		});

		it('should handle add edit with null/invalid metadata', () => {
			// Null metadata
			store.applyStreamingEdit({
				type: 'add',
				itemId: 'null-meta',
				data: {
					type: 'status',
					content: { id: 'null-meta' },
					metadata: null,
				},
				timestamp: Date.now(),
			});
			// Invalid metadata type (not object)
			store.applyStreamingEdit({
				type: 'add',
				itemId: 'bad-meta',
				data: {
					type: 'status',
					content: { id: 'bad-meta' },
					metadata: 'invalid',
				},
				timestamp: Date.now(),
			});
			vi.runAllTimers();

			const nullMetaItem = store.get().items.find((i) => i.id === 'null-meta');
			expect(nullMetaItem?.metadata).toBeUndefined();

			const badMetaItem = store.get().items.find((i) => i.id === 'bad-meta');
			expect(badMetaItem).toBeUndefined(); // Should break out and not add
		});

		it('should replace existing item keeping values if not provided', () => {
			const id = store.addItem({
				content: { id: 'orig', text: 'old' },
				type: 'status',
				metadata: { lesser: { estimatedCost: 1 } },
				version: 1,
				isOptimistic: true,
			});

			store.applyStreamingEdit({
				type: 'replace',
				itemId: id,
				data: {
					content: { id: 'orig', text: 'new' },
					// Missing type, metadata, version, isOptimistic -> should keep old
				},
				timestamp: Date.now(),
			});
			vi.runAllTimers();

			const item = store.get().items[0];
			if (!item) throw new Error('Item not found');
			expect(item.content).toEqual({ id: 'orig', text: 'new' }); // Updated
			expect(item.type).toBe('status'); // Kept
			expect(item.metadata?.lesser?.estimatedCost).toBe(1); // Kept
			expect(item.version).toBe(1); // Kept
			expect(item.isOptimistic).toBe(true); // Kept
		});

		it('should replace item with new values including explicit nulls/undefined', () => {
			const id = store.addItem({
				content: { id: 'orig' },
				type: 'status',
				version: 1,
				isOptimistic: true,
			});

			store.applyStreamingEdit({
				type: 'replace',
				itemId: id,
				data: {
					type: 'new-type',
					version: 2,
					isOptimistic: false,
					metadata: { lesser: { isDeleted: true } },
				},
				timestamp: Date.now(),
			});
			vi.runAllTimers();

			const item = store.get().items[0];
			if (!item) throw new Error('Item not found');
			expect(item.type).toBe('new-type');
			expect(item.version).toBe(2);
			expect(item.isOptimistic).toBe(false);
			expect(item.metadata?.lesser?.isDeleted).toBe(true);
		});

		it('should create new item on replace if not exists', () => {
			store.applyStreamingEdit({
				type: 'replace',
				itemId: 'ghost',
				data: {
					type: 'ghost',
					content: { id: 'ghost' },
					version: 1,
				},
				timestamp: Date.now(),
			});
			vi.runAllTimers();

			const item = store.get().items[0];
			if (!item) throw new Error('Item not found');
			expect(item.id).toBe('ghost');
			expect(item.type).toBe('ghost');
		});

		it('should handle JSON patches', () => {
			const id = store.addItem({
				content: { text: 'original', nested: { val: 1 } },
				type: 'status',
			});

			store.applyStreamingEdit({
				type: 'patch',
				itemId: id,
				patches: [
					{ op: 'replace', path: '/content/text', value: 'patched' },
					{ op: 'add', path: '/content/nested/new', value: 2 },
					{ op: 'remove', path: '/content/nested/val' },
				],
				timestamp: Date.now(),
			});
			vi.runAllTimers();

			const item = store.get().items[0];
			if (!item) throw new Error('Item not found');
			const content = item.content as any;
			expect(content.text).toBe('patched');
			expect(content.nested.new).toBe(2);
			expect(content.nested.val).toBeUndefined();
		});

		it('should handle JSON patch nested creation', () => {
			const id = store.addItem({ content: {}, type: 'status' });

			store.applyStreamingEdit({
				type: 'patch',
				itemId: id,
				patches: [{ op: 'add', path: '/content/deeply/nested/value', value: 'deep' }],
				timestamp: Date.now(),
			});
			vi.runAllTimers();

			const item = store.get().items[0];
			if (!item) throw new Error('Item not found');
			const content = item.content as any;
			expect(content.deeply.nested.value).toBe('deep');
		});
	});

	describe('Streaming Event Handlers', () => {
		beforeEach(() => {
			store.startStreaming();
		});

		it('should handle timelineUpdates', () => {
			const handler = transportEvents['timelineUpdates'];
			expect(handler).toBeDefined();

			const mockPayload = { id: 'stream-1' };
			handler?.({ data: mockPayload });

			vi.runAllTimers();
			expect(convertGraphQLObjectToLesser).toHaveBeenCalledWith(mockPayload);
			expect(mapLesserObject).toHaveBeenCalled();
			expect(store.get().items).toHaveLength(1);
		});

		it('should handle quoteActivity', () => {
			const handler = transportEvents['quoteActivity'];

			// 1. Withdrawn
			store.applyStreamingEdit({
				type: 'add',
				itemId: 'quote-1',
				data: { type: 'status', content: { id: 'quote-1' } },
				timestamp: Date.now(),
			});
			vi.runAllTimers(); // Commit setup

			handler?.({
				data: { type: 'withdrawn', quote: { id: 'quote-1' } },
			});
			vi.runAllTimers();
			expect(store.get().items).toHaveLength(0);

			// 2. New Quote
			const quoteMock = { id: 'quote-2' };
			(mapLesserObject as any).mockReturnValue({
				success: true,
				data: { id: 'quote-2', quoteCount: 5, quoteable: true, quotePermissions: 'EVERYONE' },
			});

			handler?.({
				data: {
					type: 'added',
					quote: quoteMock,
					quoteCount: 5,
					quoteable: true,
				},
			});
			vi.runAllTimers();
			const item = store.get().items.find((i) => i.id === 'quote-2');
			if (!item) throw new Error('Quote item not found');
			// Metadata merging logic test
			expect(item?.metadata?.lesser?.isQuote).toBe(true);
			expect(item?.metadata?.lesser?.quoteCount).toBe(5);
		});

		it('should handle hashtagActivity', () => {
			const handler = transportEvents['hashtagActivity'];

			const postMock = { id: 'tag-1' };
			(mapLesserObject as any).mockReturnValue({
				success: true,
				data: { id: 'tag-1' },
			});

			handler?.({
				data: {
					hashtag: 'vitest',
					post: postMock,
				},
			});
			vi.runAllTimers();

			const item = store.get().items[0];
			if (!item) throw new Error('Item not found');
			expect(item.id).toBe('tag-1');
			expect(item.metadata?.lesser?.hashtags).toContain('vitest');
		});

		it('should handle listUpdates', () => {
			const handler = transportEvents['listUpdates'];

			// 1. Account Added
			store.applyStreamingEdit({
				type: 'add',
				itemId: 's1',
				data: {
					type: 'status',
					content: { id: 's1', account: { id: 'acc-1' } } as any,
				},
				timestamp: Date.now(),
			});
			vi.runAllTimers(); // Commit setup

			handler?.({
				data: {
					type: 'account_added',
					list: { id: 'list-1', title: 'Besties' },
					account: { id: 'acc-1' },
				},
			});
			vi.runAllTimers();

			const item = store.get().items[0];
			if (!item) throw new Error('Item not found');
			expect(item.metadata?.lesser?.listMemberships).toContain('list-1');
			expect(item.metadata?.lesser?.listTitles?.['list-1']).toBe('Besties');

			// 2. Updated
			handler?.({
				data: {
					type: 'updated',
					list: { id: 'list-1', title: 'Super Besties' },
				},
			});
			vi.runAllTimers();
			expect(store.get().items[0]?.metadata?.lesser?.listTitles?.['list-1']).toBe('Super Besties');

			// 3. Account Removed
			handler?.({
				data: {
					type: 'account_removed',
					list: { id: 'list-1' },
					account: { id: 'acc-1' },
				},
			});
			vi.runAllTimers();
			// Should delete item
			expect(store.get().items).toHaveLength(0);
		});

		it('should handle relationshipUpdates', () => {
			const handler = transportEvents['relationshipUpdates'];

			// 1. Blocked -> Remove
			store.applyStreamingEdit({
				type: 'add',
				itemId: 's1',
				data: {
					type: 'status',
					content: { id: 's1', account: { id: 'blocked-user' } } as any,
				},
				timestamp: Date.now(),
			});
			vi.runAllTimers(); // Commit setup

			handler?.({
				data: { type: 'blocked', actor: { id: 'blocked-user' } },
			});
			vi.runAllTimers();
			expect(store.get().items).toHaveLength(0);

			// 2. Followed -> Update Metadata
			store.applyStreamingEdit({
				type: 'add',
				itemId: 's2',
				data: {
					type: 'status',
					content: { id: 's2', account: { id: 'friend' } } as any,
				},
				timestamp: Date.now(),
			});
			vi.runAllTimers(); // Commit setup

			handler?.({
				data: {
					type: 'following',
					actor: { id: 'friend' },
					timestamp: new Date().toISOString(),
				},
			});
			vi.runAllTimers();
			const item = store.get().items[0];
			if (!item) throw new Error('Item not found');
			expect(item.metadata?.lesser?.relationshipStatus).toBe('following');
		});

		it('should handle activityStream', () => {
			const handler = transportEvents['activityStream'];

			// 1. Item Type Status -> Delete
			store.applyStreamingEdit({
				type: 'add',
				itemId: 'del-me',
				data: { type: 'status', content: { id: 'del-me' } },
				timestamp: Date.now(),
			});
			vi.runAllTimers(); // Commit setup

			(mapLesserStreamingUpdate as any).mockReturnValue({
				success: true,
				data: {
					id: 'del-me',
					itemType: 'status', // mapped value
					timestamp: Date.now(),
				},
			});

			handler?.({
				data: {
					// raw data input
					eventType: 'POST_DELETED',
					data: { deletedId: 'del-me', deletedType: 'POST' },
				},
			});
			vi.runAllTimers();
			expect(store.get().items).toHaveLength(0);

			// 2. Edit Type -> Replace
			store.applyStreamingEdit({
				type: 'add',
				itemId: 'edit-me',
				data: { type: 'status', content: { id: 'edit-me', text: 'old' } },
				timestamp: Date.now(),
			});
			vi.runAllTimers(); // Commit setup

			(mapLesserStreamingUpdate as any).mockReturnValue({
				success: true,
				data: {
					editType: 'replace',
					id: 'edit-me',
					timestamp: Date.now(),
					data: { content: { id: 'edit-me', text: 'new' } },
				},
			});

			handler?.({
				data: {
					eventType: 'POST_UPDATED',
				},
			});
			vi.runAllTimers();
			expect((store.get().items[0]?.content as any).text).toBe('new');
		});

		it('should handle mapping failures gracefully', () => {
			const handler = transportEvents['timelineUpdates'];

			// Mock failure
			(mapLesserObject as any).mockReturnValue({ success: false });

			handler?.({ data: { id: 'fail' } });
			vi.runAllTimers();

			expect(store.get().items).toHaveLength(0);
		});

		it('should handle connection error events', () => {
			const handler = transportEvents['error'];
			const error = new Error('Connection lost');

			handler?.({ error });
			vi.runAllTimers();

			expect(store.get().error).toBe(error);
		});

		it('should handle connection close events', () => {
			const handler = transportEvents['close'];

			handler?.({});
			vi.runAllTimers();

			expect(store.get().isStreaming).toBe(false);
		});
	});

	describe('Metadata Enhancer & Edge Cases', () => {
		it('should enhance metadata for list source', async () => {
			const listStore = createTimelineStore({
				transportManager: transportManagerStub,
				adapter: adapterStub,
				timeline: { type: 'list', id: 'my-list' } as TimelineSource,
				updateDebounceMs: 0,
			});

			const mockItems = [{ id: 'i1', content: 'c' }];
			(fetchHelpers.fetchTimelinePage as any).mockResolvedValue({
				items: mockItems,
				pageInfo: { hasNextPage: false },
			});
			(unifiedStatusToTimelineItem as any).mockImplementation((s: any) => ({
				id: s.id,
				type: 'status',
				content: s,
				metadata: {},
			}));

			await listStore.refresh();
			vi.runAllTimers();

			const item = listStore.get().items[0];
			if (!item) throw new Error('Item not found');
			expect(item.metadata?.lesser?.listMemberships).toContain('my-list');
		});

		it('should enhance metadata for hashtag source', async () => {
			const tagStore = createTimelineStore({
				transportManager: transportManagerStub,
				adapter: adapterStub,
				timeline: { type: 'hashtag', hashtag: 'vitest' } as TimelineSource,
				updateDebounceMs: 0,
			});

			const mockItems = [{ id: 'i1', content: 'c' }];
			(fetchHelpers.fetchTimelinePage as any).mockResolvedValue({
				items: mockItems,
				pageInfo: { hasNextPage: false },
			});
			(unifiedStatusToTimelineItem as any).mockImplementation((s: any) => ({
				id: s.id,
				type: 'status',
				content: s,
				metadata: {},
			}));

			await tagStore.refresh();
			vi.runAllTimers();

			const item = tagStore.get().items[0];
			if (!item) throw new Error('Item not found');
			expect(item.metadata?.lesser?.hashtags).toContain('vitest');
		});

		it('should handle duplicate merge logic in upsert', async () => {
			// Setup item with existing metadata
			store.applyStreamingEdit({
				type: 'add',
				itemId: 'dup',
				data: {
					type: 'status',
					content: { id: 'dup' },
					metadata: { lesser: { estimatedCost: 10 } },
				},
				timestamp: Date.now(),
			});
			vi.runAllTimers();

			// Fetch same item with different metadata
			(fetchHelpers.fetchTimelinePage as any).mockResolvedValue({
				items: [{ id: 'dup' }], // content is merged via mocks
				pageInfo: {},
			});

			// Mock unifiedToTimeline to return new metadata
			(unifiedStatusToTimelineItem as any).mockReturnValue({
				id: 'dup',
				metadata: { lesser: { authorTrustScore: 0.9 } },
			});

			await store.loadMore(); // Trigger upsert
			vi.runAllTimers();

			const item = store.get().items[0];
			if (!item) throw new Error('Item not found');
			// Should have merged metadata
			expect(item.metadata?.lesser?.estimatedCost).toBe(10);
			expect(item.metadata?.lesser?.authorTrustScore).toBe(0.9);
		});

		it('should handle transport connect failure', () => {
			const error = new Error('Connect failed');
			(transportManagerStub.connect as any).mockImplementationOnce(() => {
				throw error;
			});

			store.startStreaming();

			expect(store.get().error).toBe(error);
			expect(store.get().isStreaming).toBe(false);
		});

		it('should handle activityStream upsert path', () => {
			store.startStreaming();
			const handler = transportEvents['activityStream'];

			(mapLesserStreamingUpdate as any).mockReturnValue({
				success: true,
				data: {
					type: 'status',
					payload: { id: 'new-activity' },
					stream: 'main',
					timestamp: Date.now(),
				},
			});

			handler?.({
				data: { eventType: 'POST_CREATED', data: {} },
			});
			vi.runAllTimers();

			const item = store.get().items.find((i) => i.id === 'new-activity');
			if (!item) throw new Error('Activity item not found');
		});
	});
});
