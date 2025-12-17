import { describe, it, expect } from 'vitest';
import {
	mapLesserAccount,
	mapLesserPost,
	mapLesserNotification,
	mapLesserStreamingUpdate,
	mapLesserObject,
	batchMapLesserAccounts,
	batchMapLesserPosts,
	batchMapLesserNotifications,
	mapLesserTimelineConnection,
	handleLesserGraphQLResponse,
} from '../mappers.js';

describe('Lesser Mappers Coverage', () => {
	const validAccount = { id: 'acc1', handle: 'user@domain', displayName: 'User' };

	describe('mapLesserAccount', () => {
		it('returns error for invalid account', () => {
			const result = mapLesserAccount({} as any);
			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('Invalid account');
		});

		it('handles unexpected error in mapLesserAccount', () => {
			const throwingAccount = new Proxy(
				{ id: '123' },
				{
					get: (target, prop) => {
						if (prop === 'handle') throw new Error('Boom');
						return Reflect.get(target, prop);
					},
				}
			);

			const result = mapLesserAccount(throwingAccount as any);
			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('Failed to map account: Boom');
		});
	});

	describe('mapLesserPost', () => {
		it('returns error for invalid post', () => {
			const result = mapLesserPost({} as any);
			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('Invalid post');
		});

		it('returns error for missing author', () => {
			const result = mapLesserPost({ id: '123' } as any);
			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('Invalid post: missing author');
		});

		it('returns error when author mapping fails', () => {
			const result = mapLesserPost({ id: '123', author: {} } as any);
			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('Invalid account');
		});

		it('handles unexpected error in mapLesserPost', () => {
			const throwingPost = new Proxy(
				{ id: '123', author: validAccount },
				{
					get: (target, prop) => {
						if (prop === 'content') throw new Error('Boom');
						if (prop === 'author') return validAccount;
						if (prop === 'id') return '123';
						return Reflect.get(target, prop);
					},
				}
			);

			const result = mapLesserPost(throwingPost as any);
			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('Failed to map post: Boom');
		});
	});

	describe('mapLesserObject', () => {
		it('returns error for invalid object', () => {
			const result = mapLesserObject({} as any);
			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('Invalid object');
		});

		it('returns error for missing actor', () => {
			const result = mapLesserObject({ id: '123' } as any);
			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('Invalid object: missing actor');
		});

		it('returns error when actor mapping fails', () => {
			const result = mapLesserObject({ id: '123', actor: {} } as any);
			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('Failed to map object actor');
		});

		it('handles unexpected error in mapLesserObject', () => {
			const throwingObj = new Proxy(
				{ id: '123', actor: validAccount },
				{
					get: (target, prop) => {
						if (prop === 'content') throw new Error('Boom');
						if (prop === 'actor') return validAccount;
						if (prop === 'id') return '123';
						return Reflect.get(target, prop);
					},
				}
			);
			const result = mapLesserObject(throwingObj as any);
			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('Failed to map Lesser object: Boom');
		});
	});

	describe('mapLesserNotification', () => {
		it('returns error for invalid notification', () => {
			const result = mapLesserNotification({} as any);
			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('Invalid notification');
		});

		it('returns error for missing triggerAccount', () => {
			const result = mapLesserNotification({ id: '123' } as any);
			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('Invalid notification: missing trigger account');
		});

		it('returns error when triggerAccount mapping fails', () => {
			const result = mapLesserNotification({ id: '123', triggerAccount: {} } as any);
			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('Invalid account');
		});

		it('handles unexpected error in mapLesserNotification', () => {
			const throwingNotif = new Proxy(
				{ id: '123', triggerAccount: validAccount },
				{
					get: (target, prop) => {
						if (prop === 'createdAt') throw new Error('Boom');
						if (prop === 'triggerAccount') return validAccount;
						if (prop === 'id') return '123';
						return Reflect.get(target, prop);
					},
				}
			);
			const result = mapLesserNotification(throwingNotif as any);
			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('Failed to map notification: Boom');
		});

		it('maps COST_ALERT notification', () => {
			const notification = {
				id: '1',
				triggerAccount: validAccount,
				notificationType: 'COST_ALERT',
				status: { id: 's1', estimatedCost: 50, actor: validAccount },
			} as any;
			const result = mapLesserNotification(notification);
			expect(result.success).toBe(true);
			expect(result.data?.costAlert?.amount).toBe(50);
			expect(result.data?.costAlert?.threshold).toBe(1000000);
		});

		it('maps TRUST_UPDATE notification', () => {
			const notification = {
				id: '1',
				triggerAccount: { ...validAccount, trustScore: 0.9 },
				notificationType: 'TRUST_UPDATE',
			} as any;
			const result = mapLesserNotification(notification);
			expect(result.success).toBe(true);
			expect(result.data?.trustUpdate?.newScore).toBe(0.9);
		});

		it('maps MODERATION_ACTION notification', () => {
			const notification = {
				id: '1',
				triggerAccount: validAccount,
				notificationType: 'MODERATION_ACTION',
				status: { id: 's1', aiAnalysis: { moderationAction: 'warn' }, actor: validAccount },
			} as any;
			const result = mapLesserNotification(notification);
			expect(result.success).toBe(true);
			expect(result.data?.moderationAction?.action).toBe('warn');
			expect(result.data?.moderationAction?.statusId).toBe('s1');
		});
	});

	describe('mapLesserStreamingUpdate', () => {
		it('returns error for invalid update', () => {
			const result = mapLesserStreamingUpdate({} as any);
			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('Invalid streaming update');
		});

		it('handles unexpected error in mapLesserStreamingUpdate', () => {
			const throwingUpdate = new Proxy(
				{ eventType: 'POST_CREATED', timestamp: '2023-01-01', data: {} },
				{
					get: (target, prop) => {
						if (prop === 'data') throw new Error('Boom');
						return Reflect.get(target, prop);
					},
				}
			);
			const result = mapLesserStreamingUpdate(throwingUpdate as any);
			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('Failed to map streaming update: Boom');
		});

		it('handles POST_CREATED with failed post mapping', () => {
			const update = {
				eventType: 'POST_CREATED',
				timestamp: new Date().toISOString(),
				data: {
					__typename: 'PostStreamingData',
					post: {}, // Invalid post
				},
			};
			const result = mapLesserStreamingUpdate(update as any);
			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('Invalid post');
		});

		it('handles NOTIFICATION_CREATED with failed notification mapping', () => {
			const update = {
				eventType: 'NOTIFICATION_CREATED',
				timestamp: new Date().toISOString(),
				data: {
					__typename: 'NotificationStreamingData',
					notification: {}, // Invalid notification
				},
			};
			const result = mapLesserStreamingUpdate(update as any);
			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('Invalid notification');
		});

		it('handles ACCOUNT_UPDATED', () => {
			const update = {
				eventType: 'ACCOUNT_UPDATED',
				timestamp: new Date().toISOString(),
				data: {
					__typename: 'AccountStreamingData',
					account: validAccount,
				},
			};
			const result = mapLesserStreamingUpdate(update as any);
			expect(result.success).toBe(true);
			expect(result.data && 'type' in result.data ? result.data.type : undefined).toBe('status');
			expect(
				result.data && 'payload' in result.data
					? (result.data.payload as { id?: string })?.id
					: undefined
			).toBe('acc1');
		});
	});

	describe('Batch Mappers', () => {
		it('batchMapLesserAccounts handles failures', () => {
			const accounts = [validAccount, {}] as any[];
			const result = batchMapLesserAccounts(accounts);
			expect(result.successful.length).toBe(1);
			expect(result.failed.length).toBe(1);
		});

		it('batchMapLesserPosts handles failures', () => {
			const posts = [{ id: '1', author: validAccount }, {}] as any[];
			const result = batchMapLesserPosts(posts);
			expect(result.successful.length).toBe(1);
			expect(result.failed.length).toBe(1);
		});

		it('batchMapLesserNotifications handles failures', () => {
			const notifications = [{ id: '1', triggerAccount: validAccount }, {}] as any[];
			const result = batchMapLesserNotifications(notifications);
			expect(result.successful.length).toBe(1);
			expect(result.failed.length).toBe(1);
		});

		it('mapLesserTimelineConnection handles failures', () => {
			const connection = {
				edges: [{ node: { id: '1', author: validAccount } }, { node: {} }],
			} as any;
			const result = mapLesserTimelineConnection(connection);
			expect(result.successful.length).toBe(1);
			expect(result.failed.length).toBe(1);
		});

		it('mapLesserTimelineConnection handles empty edges', () => {
			const result = mapLesserTimelineConnection({} as any);
			expect(result.totalProcessed).toBe(0);
		});
	});

	describe('handleLesserGraphQLResponse', () => {
		it('returns error if response has errors', () => {
			const response = { errors: [{ message: 'GraphQLError' }] };
			const result = handleLesserGraphQLResponse(response as any);
			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('GraphQL response contains errors');
		});

		it('returns error if response missing data', () => {
			const response = {};
			const result = handleLesserGraphQLResponse(response as any);
			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('GraphQL response missing data');
		});

		it('returns success if data exists', () => {
			const response = { data: { foo: 'bar' } };
			const result = handleLesserGraphQLResponse(response as any);
			expect(result.success).toBe(true);
			expect(result.data).toEqual({ foo: 'bar' });
		});
	});
});
