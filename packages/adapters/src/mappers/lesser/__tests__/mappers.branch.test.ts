import { describe, it, expect } from 'vitest';
import {
	mapLesserNotification,
	mapLesserStreamingUpdate,
	batchMapLesserAccounts,
	batchMapLesserPosts,
	batchMapLesserNotifications,
	mapLesserTimelineConnection,
} from '../mappers';
import type {
	LesserNotificationFragment,
	LesserStreamingUpdate,
	LesserAccountFragment,
} from '../types';

const mockAccount: LesserAccountFragment = {
	id: 'acc_1',
	handle: 'user@example.com',
	localHandle: 'user',
	displayName: 'User',
	joinedAt: '2023-01-01T00:00:00Z',
	trustScore: 0.8,
} as any as LesserAccountFragment;

const baseNotification: LesserNotificationFragment = {
	id: 'notif_1',
	notificationType: 'MENTION',
	createdAt: '2023-01-01T00:00:00Z',
	triggerAccount: mockAccount,
	isRead: false,
};

describe('Mappers Branch Coverage', () => {
	describe('mapLesserNotification', () => {
		it('should map QUOTE notification', () => {
			const notif: LesserNotificationFragment = {
				...baseNotification,
				notificationType: 'QUOTE',
				status: {
					id: 's1',
					type: 'Note',
					actor: mockAccount,
					content: 'quote content',
					createdAt: '2023-01-01',
					updatedAt: '2023-01-01',
				} as any,
			};
			const result = mapLesserNotification(notif);
			expect(result.success).toBe(true);
			expect(result.data?.type).toBe('quote');
			expect(result.data?.quoteStatus).toBeDefined();
			expect(result.data?.quoteStatus?.id).toBe('s1');
		});

		it('should map COMMUNITY_NOTE notification', () => {
			const notif: LesserNotificationFragment = {
				...baseNotification,
				notificationType: 'COMMUNITY_NOTE',
				status: {
					id: 's1',
					type: 'Note',
					actor: mockAccount,
					content: 'status',
					createdAt: '2023-01-01',
					updatedAt: '2023-01-01',
					communityNotes: [
						{
							id: 'cn1',
							content: 'This is misleading',
							helpful: 10,
							notHelpful: 0,
							createdAt: '2023-01-01',
							author: mockAccount,
						},
					],
				} as any,
			};
			const result = mapLesserNotification(notif);
			expect(result.success).toBe(true);
			expect(result.data?.type).toBe('community_note');
			expect(result.data?.communityNote).toBeDefined();
			expect(result.data?.communityNote?.content).toBe('This is misleading');
		});

		it('should map TRUST_UPDATE notification', () => {
			const notif: LesserNotificationFragment = {
				...baseNotification,
				notificationType: 'TRUST_UPDATE',
				triggerAccount: {
					...mockAccount,
					trustScore: 0.95,
				},
			};
			const result = mapLesserNotification(notif);
			expect(result.success).toBe(true);
			expect(result.data?.type).toBe('trust_update');
			expect(result.data?.trustUpdate).toBeDefined();
			expect(result.data?.trustUpdate?.newScore).toBe(0.95);
		});

		it('should map MODERATION_ACTION notification', () => {
			const notif: LesserNotificationFragment = {
				...baseNotification,
				notificationType: 'MODERATION_ACTION',
				status: {
					id: 's1',
					type: 'Note',
					actor: mockAccount,
					content: 'bad content',
					createdAt: '2023-01-01',
					updatedAt: '2023-01-01',
					aiAnalysis: {
						moderationAction: 'HIDE',
					},
				} as any,
			};
			const result = mapLesserNotification(notif);
			expect(result.success).toBe(true);
			expect(result.data?.type).toBe('moderation_action');
			expect(result.data?.moderationAction).toBeDefined();
			expect(result.data?.moderationAction?.action).toBe('HIDE');
		});
	});

	describe('mapLesserStreamingUpdate', () => {
		it('should map POST_DELETED for account', () => {
			const update: LesserStreamingUpdate = {
				__typename: 'StreamingUpdate',
				eventType: 'POST_DELETED',
				timestamp: '2023-01-01',
				data: {
					__typename: 'DeleteStreamingData',
					deletedId: 'acc_1',
					deletedType: 'ACCOUNT',
				},
			};
			const result = mapLesserStreamingUpdate(update);
			expect(result.success).toBe(true);
			expect((result.data as any).itemType).toBe('account');
		});

		it('should map POST_DELETED for notification', () => {
			const update: LesserStreamingUpdate = {
				__typename: 'StreamingUpdate',
				eventType: 'POST_DELETED',
				timestamp: '2023-01-01',
				data: {
					__typename: 'DeleteStreamingData',
					deletedId: 'notif_1',
					deletedType: 'NOTIFICATION',
				},
			};
			const result = mapLesserStreamingUpdate(update);
			expect(result.success).toBe(true);
			expect((result.data as any).itemType).toBe('notification');
		});
	});

	describe('Batch Mappers Error Handling', () => {
		it('batchMapLesserAccounts should handle partial failures', () => {
			const accounts = [
				mockAccount,
				{} as any, // Invalid
			];
			const result = batchMapLesserAccounts(accounts);
			expect(result.successful).toHaveLength(1);
			expect(result.failed).toHaveLength(1);
		});

		it('batchMapLesserPosts should handle partial failures', () => {
			const posts = [
				{ id: 'p1', author: mockAccount, content: 'c', publishedAt: '2023-01-01' } as any,
				{ id: 'p2' } as any, // Invalid: missing author
			];
			const result = batchMapLesserPosts(posts);
			expect(result.successful).toHaveLength(1);
			expect(result.failed).toHaveLength(1);
		});

		it('batchMapLesserNotifications should handle partial failures', () => {
			const notifs = [
				baseNotification,
				{ id: 'n2' } as any, // Invalid: missing triggerAccount
			];
			const result = batchMapLesserNotifications(notifs);
			expect(result.successful).toHaveLength(1);
			expect(result.failed).toHaveLength(1);
		});

		it('mapLesserTimelineConnection should handle partial failures in edges', () => {
			const connection = {
				edges: [
					{
						node: { id: 'p1', author: mockAccount, content: 'c', publishedAt: '2023-01-01' } as any,
					},
					{ node: { id: 'p2' } as any }, // Invalid
				],
				pageInfo: {},
			};
			const result = mapLesserTimelineConnection(connection as any);
			expect(result.successful).toHaveLength(1);
			expect(result.failed).toHaveLength(1);
		});
	});
});
