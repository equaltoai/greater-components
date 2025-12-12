import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchTimelinePage, fetchNotificationPage, normalizeNotificationType } from '../fetchHelpers';
import type { LesserGraphQLAdapter } from '../../graphql/LesserGraphQLAdapter';
import type { TimelineSource } from '../types';

// Mock dependencies
vi.mock('../../mappers/lesser/graphqlConverters', () => ({
    convertGraphQLObjectToLesser: vi.fn((node) => {
        if (!node) return undefined;
        return {
            id: node.id,
            // Minimal mocked LesserObjectFragment
            actor: { id: 'actor_1', handle: 'actor' }
        };
    }),
    convertGraphQLActorToLesserAccount: vi.fn((actor) => {
        if (!actor) return undefined;
        return { id: 'actor_1', handle: 'actor' };
    })
}));

vi.mock('../../mappers/lesser/mappers', () => ({
    mapLesserObject: vi.fn((obj) => ({
        success: true,
        data: { id: obj.id, content: 'Mapped content' }
    })),
    mapLesserNotification: vi.fn((notif) => ({
        success: true,
        data: { id: notif.id, type: 'mention' }
    }))
}));

describe('fetchHelpers', () => {
    describe('normalizeNotificationType', () => {
        it('should normalize standard types', () => {
            expect(normalizeNotificationType('MENTION')).toBe('MENTION');
            expect(normalizeNotificationType('mention')).toBe('MENTION');
        });

        it('should normalize types with dots', () => {
            expect(normalizeNotificationType('admin.report')).toBe('ADMIN_REPORT');
        });

        it('should default to MENTION for unknown types', () => {
            expect(normalizeNotificationType('UNKNOWN_TYPE')).toBe('MENTION');
        });
    });

    describe('fetchTimelinePage', () => {
        let mockAdapter: any;

        beforeEach(() => {
            mockAdapter = {
                fetchHomeTimeline: vi.fn(),
                fetchPublicTimeline: vi.fn(),
                fetchDirectTimeline: vi.fn(),
                fetchListTimeline: vi.fn(),
                fetchHashtagTimeline: vi.fn(),
                fetchActorTimeline: vi.fn()
            };
        });

        it('should fetch home timeline', async () => {
            mockAdapter.fetchHomeTimeline.mockResolvedValue({
                edges: [{ node: { id: '1' } }],
                pageInfo: { hasNextPage: true, endCursor: 'cursor' }
            });
            const source: TimelineSource = { type: 'home' };
            const result = await fetchTimelinePage({ adapter: mockAdapter, source });

            expect(mockAdapter.fetchHomeTimeline).toHaveBeenCalledWith({ first: 20, after: undefined });
            expect(result.items).toHaveLength(1);
            expect(result.items[0].id).toBe('1');
            expect(result.pageInfo.hasNextPage).toBe(true);
        });

        it('should fetch local timeline', async () => {
             mockAdapter.fetchPublicTimeline.mockResolvedValue({ edges: [] });
             const source: TimelineSource = { type: 'local' };
             await fetchTimelinePage({ adapter: mockAdapter, source });
             expect(mockAdapter.fetchPublicTimeline).toHaveBeenCalledWith({ first: 20 }, 'LOCAL');
        });

        it('should fetch federated timeline', async () => {
             mockAdapter.fetchPublicTimeline.mockResolvedValue({ edges: [] });
             const source: TimelineSource = { type: 'federated' };
             await fetchTimelinePage({ adapter: mockAdapter, source });
             expect(mockAdapter.fetchPublicTimeline).toHaveBeenCalledWith({ first: 20 }, 'PUBLIC');
        });

        it('should fetch direct timeline', async () => {
             mockAdapter.fetchDirectTimeline.mockResolvedValue({ edges: [] });
             const source: TimelineSource = { type: 'direct' };
             await fetchTimelinePage({ adapter: mockAdapter, source });
             expect(mockAdapter.fetchDirectTimeline).toHaveBeenCalled();
        });

        it('should fetch list timeline', async () => {
             mockAdapter.fetchListTimeline.mockResolvedValue({ edges: [] });
             const source: TimelineSource = { type: 'list', id: 'list_1' };
             await fetchTimelinePage({ adapter: mockAdapter, source });
             expect(mockAdapter.fetchListTimeline).toHaveBeenCalledWith('list_1', { first: 20 });
        });

        it('should throw error for list timeline without id', async () => {
             const source: TimelineSource = { type: 'list' };
             await expect(fetchTimelinePage({ adapter: mockAdapter, source })).rejects.toThrow('List timeline requires an id');
        });

        it('should fetch hashtag timeline', async () => {
             mockAdapter.fetchHashtagTimeline.mockResolvedValue({ edges: [] });
             const source: TimelineSource = { type: 'hashtag', id: 'tag' };
             await fetchTimelinePage({ adapter: mockAdapter, source });
             expect(mockAdapter.fetchHashtagTimeline).toHaveBeenCalledWith('tag', { first: 20 });
        });

        it('should throw error for hashtag timeline without id', async () => {
             const source: TimelineSource = { type: 'hashtag' };
             await expect(fetchTimelinePage({ adapter: mockAdapter, source })).rejects.toThrow('Hashtag timeline requires a hashtag or id');
        });

        it('should fetch actor timeline', async () => {
             mockAdapter.fetchActorTimeline.mockResolvedValue({ edges: [] });
             const source: TimelineSource = { type: 'actor', id: 'actor_1' };
             await fetchTimelinePage({ adapter: mockAdapter, source });
             expect(mockAdapter.fetchActorTimeline).toHaveBeenCalledWith('actor_1', { first: 20 });
        });

        it('should throw error for actor timeline without id', async () => {
             const source: TimelineSource = { type: 'actor' };
             await expect(fetchTimelinePage({ adapter: mockAdapter, source })).rejects.toThrow('Actor timeline requires an id');
        });

        it('should throw error for unsupported source', async () => {
             const source: any = { type: 'unknown' };
             await expect(fetchTimelinePage({ adapter: mockAdapter, source })).rejects.toThrow('Unsupported timeline type');
        });

        it('should handle pagination', async () => {
             mockAdapter.fetchHomeTimeline.mockResolvedValue({ edges: [] });
             const source: TimelineSource = { type: 'home' };
             await fetchTimelinePage({ adapter: mockAdapter, source, pageSize: 10, after: 'abc' });
             expect(mockAdapter.fetchHomeTimeline).toHaveBeenCalledWith({ first: 10, after: 'abc' });
        });
        
        it('should handle empty response gracefully', async () => {
             mockAdapter.fetchHomeTimeline.mockResolvedValue({});
             const source: TimelineSource = { type: 'home' };
             const result = await fetchTimelinePage({ adapter: mockAdapter, source });
             expect(result.items).toEqual([]);
        });
    });

    describe('fetchNotificationPage', () => {
        let mockAdapter: any;

        beforeEach(() => {
            mockAdapter = {
                fetchNotifications: vi.fn()
            };
        });

        it('should fetch notifications', async () => {
            mockAdapter.fetchNotifications.mockResolvedValue({
                edges: [{
                    node: {
                        id: 'notif_1',
                        type: 'MENTION',
                        account: { id: 'actor_1' }, // triggerAccount
                        status: { id: 'status_1' }
                    }
                }],
                pageInfo: { hasNextPage: true, endCursor: 'cursor' }
            });

            const result = await fetchNotificationPage({ adapter: mockAdapter });
            expect(mockAdapter.fetchNotifications).toHaveBeenCalledWith({ first: 20, after: undefined });
            expect(result.items).toHaveLength(1);
            expect(result.items[0].id).toBe('notif_1');
        });
        
         it('should handle missing nodes or accounts', async () => {
             mockAdapter.fetchNotifications.mockResolvedValue({
                edges: [
                    null,
                    { node: null },
                    { node: { id: 'bad', account: null } }
                ]
             });
             const result = await fetchNotificationPage({ adapter: mockAdapter });
             expect(result.items).toHaveLength(0);
         });

         it('should handle alternative field names (actor instead of account)', async () => {
              mockAdapter.fetchNotifications.mockResolvedValue({
                edges: [{
                    node: {
                        id: 'notif_2',
                        type: 'MENTION',
                        actor: { id: 'actor_1' } // actor instead of account
                    }
                }]
            });
            const result = await fetchNotificationPage({ adapter: mockAdapter });
            expect(result.items).toHaveLength(1);
         });
    });
});
