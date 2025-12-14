import { describe, it, expect } from 'vitest';
import {
	mapLesserAccount,
	mapLesserPost,
	mapLesserNotification,
	mapLesserStreamingUpdate,
	mapLesserObject,
	handleLesserGraphQLResponse,
	batchMapLesserAccounts,
	batchMapLesserPosts,
	batchMapLesserNotifications,
	mapLesserTimelineConnection,
} from '../mappers';
import type {
	LesserAccountFragment,
	LesserPostFragment,
	LesserNotificationFragment,
	LesserStreamingUpdate,
	LesserObjectFragment,
	LesserTimelineConnection,
} from '../types';

// Fixtures
const mockAccount: LesserAccountFragment = {
	id: 'acc_1',
	handle: 'user@example.com',
	localHandle: 'user',
	displayName: 'User Name',
	bio: 'A bio',
	avatarUrl: 'https://example.com/avatar.jpg',
	bannerUrl: 'https://example.com/banner.jpg',
	joinedAt: '2023-01-01T00:00:00Z',
	isVerified: true,
	isBot: false,
	isLocked: false,
	followerCount: 100,
	followingCount: 50,
	postCount: 10,
	profileFields: [
		{ label: 'Website', content: 'https://user.com', verifiedAt: '2023-01-02T00:00:00Z' },
	],
	customEmojis: [],
	trustScore: 0.9,
	reputation: {
		actorId: 'acc_1',
		instance: 'example.com',
		totalScore: 100,
		trustScore: 90,
		activityScore: 10,
		moderationScore: 0,
		communityScore: 0,
		calculatedAt: '2023-01-01T00:00:00Z',
		version: '1.0',
		evidence: {
			totalPosts: 10,
			totalFollowers: 100,
			accountAge: 365,
			vouchCount: 5,
			trustingActors: 20,
			averageTrustScore: 0.8,
		},
	},
	vouches: [
		{
			id: 'vouch_1',
			confidence: 0.8,
			context: 'Good user',
			voucherReputation: 0.9,
			createdAt: '2023-01-01T00:00:00Z',
			expiresAt: '2024-01-01T00:00:00Z',
			active: true,
			revoked: false,
		},
	],
};

const mockPost: LesserPostFragment = {
	id: 'post_1',
	publishedAt: '2023-01-02T10:00:00Z',
	content: '<p>Hello world</p>',
	contentWarning: null as any,
	visibility: 'PUBLIC',
	isSensitive: false,
	language: 'en',
	author: mockAccount,
	attachments: [
		{
			id: 'media_1',
			mediaType: 'IMAGE',
			url: 'https://example.com/image.jpg',
			thumbnailUrl: 'https://example.com/image_thumb.jpg',
			altText: 'An image',
			metadata: {
				dimensions: { width: 800, height: 600, aspectRatio: 1.33 },
			},
		},
	],
	mentions: [{ id: 'acc_2', username: 'other', url: 'https://example.com/@other' }],
	hashtags: [{ name: 'hello', url: 'https://example.com/tag/hello' }],
	emojis: [],
	interactionCounts: {
		replies: 5,
		shares: 2,
		favorites: 10,
	},
	userInteractions: {
		isFavorited: true,
		isShared: false,
		isBookmarked: false,
	},
	isPinned: false,
	estimatedCost: 0.001,
	moderationScore: 0.1,
	communityNotes: [
		{
			id: 'note_1',
			author: mockAccount,
			content: 'This is a note',
			helpful: 5,
			notHelpful: 1,
			createdAt: '2023-01-03T00:00:00Z',
		},
	],
};

const mockNotification: LesserNotificationFragment = {
	id: 'notif_1',
	notificationType: 'MENTION',
	createdAt: '2023-01-04T00:00:00Z',
	triggerAccount: mockAccount,
	status: {
		...mockPost,
		type: 'Post',
		actor: mockAccount,
		createdAt: mockPost.publishedAt,
		updatedAt: mockPost.publishedAt,
		repliesCount: mockPost.interactionCounts.replies,
		likesCount: mockPost.interactionCounts.favorites,
		sharesCount: mockPost.interactionCounts.shares,
		tags: [],
		communityNotes: [],
	} as unknown as LesserObjectFragment, // Adapting LesserPostFragment to LesserObjectFragment for tests
	isRead: false,
};

const mockObject: LesserObjectFragment = {
	id: 'obj_1',
	type: 'Note',
	actor: mockAccount,
	content: 'Object content',
	visibility: 'PUBLIC',
	sensitive: false,
	attachments: [],
	tags: [],
	mentions: [],
	createdAt: '2023-01-05T00:00:00Z',
	updatedAt: '2023-01-05T00:00:00Z',
	repliesCount: 0,
	likesCount: 0,
	sharesCount: 0,
	estimatedCost: 0,
	communityNotes: [],
	quoteable: true,
	quotePermissions: 'EVERYONE',
};

describe('Lesser Mappers', () => {
	describe('mapLesserAccount', () => {
		it('should map a full account correctly', () => {
			const result = mapLesserAccount(mockAccount);
			expect(result.success).toBe(true);
			if (!result.success) return;

			const account = result.data;
			expect(account).toBeDefined();
			if (!account) return;
			expect(account.id).toBe(mockAccount.id);
			expect(account.username).toBe(mockAccount.localHandle);
			expect(account.displayName).toBe(mockAccount.displayName);
			expect(account.followersCount).toBe(mockAccount.followerCount);
			expect(account.fields).toHaveLength(1);
			expect(account.fields?.[0]?.name).toBe('Website');
			expect(account.trustScore).toBe(0.9);
			expect(account.reputation).toBeDefined();
			expect(account.vouches).toHaveLength(1);
		});

		it('should handle partial account data', () => {
			const partialAccount = {
				...mockAccount,
				localHandle: null as any, // Simulate missing localHandle
				handle: 'user@example.com',
				reputation: undefined,
				vouches: undefined,
			};
			const result = mapLesserAccount(partialAccount);
			expect(result.success).toBe(true);
			if (!result.success) return;

			expect(result.data?.username).toBe('user'); // Fallback to handle split
			expect(result.data?.reputation).toBeUndefined();
		});

		it('should return error for invalid account', () => {
			const result = mapLesserAccount({} as any);
			expect(result.success).toBe(false);
			expect(result.error?.type).toBe('validation');
		});

		it('should map relationships if provided', () => {
			const relationship = {
				target: { id: mockAccount.id },
				isFollowing: true,
				isFollowedBy: false,
				hasPendingRequest: false,
				isBlocking: false,
				isBlockedBy: false,
				isMuting: false,
				isMutingNotifications: false,
				isDomainBlocked: false,
				isEndorsed: true,
				personalNote: 'note',
			};
			const result = mapLesserAccount(mockAccount, relationship);
			expect(result.success).toBe(true);
			expect(result.data?.relationship?.following).toBe(true);
			expect(result.data?.relationship?.note).toBe('note');
		});
	});

	describe('mapLesserPost', () => {
		it('should map a full post correctly', () => {
			const result = mapLesserPost(mockPost);
			expect(result.success).toBe(true);
			if (!result.success) return;

			const post = result.data;
			expect(post).toBeDefined();
			if (!post) return;
			expect(post.id).toBe(mockPost.id);
			expect(post.content).toBe(mockPost.content);
			expect(post.account.id).toBe(mockAccount.id);
			expect(post.mediaAttachments).toHaveLength(1);
			expect(post.mediaAttachments[0]?.type).toBe('image');
			expect(post.mentions).toHaveLength(1);
			expect(post.tags).toHaveLength(1);
			expect(post.favourited).toBe(true);
			expect(post.communityNotes).toHaveLength(1);
		});

		it('should handle reblogs', () => {
			const reblogPost = {
				...mockPost,
				id: 'post_2',
				shareOf: mockPost,
			};
			const result = mapLesserPost(reblogPost);
			expect(result.success).toBe(true);
			if (!result.success) return;

			expect(result.data?.reblog).toBeDefined();
			expect(result.data?.reblog?.id).toBe(mockPost.id);
		});

		it('should handle polls', () => {
			const pollPost = {
				...mockPost,
				poll: {
					id: 'poll_1',
					question: 'Question?',
					options: [{ index: 0, text: 'Yes', voteCount: 10 }],
					isExpired: false,
					allowsMultiple: false,
					totalVotes: 10,
				},
			};
			const result = mapLesserPost(pollPost);
			expect(result.success).toBe(true);
			expect(result.data?.poll).toBeDefined();
			expect(result.data?.poll?.options).toHaveLength(1);
		});

		it('should return error for invalid post', () => {
			const result = mapLesserPost({} as any);
			expect(result.success).toBe(false);
		});

		it('should return error if author is missing', () => {
			const result = mapLesserPost({ id: '123' } as any);
			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('missing author');
		});

		it('should map AI analysis if present', () => {
			const postWithAI = {
				...mockPost,
				aiAnalysis: {
					id: 'ai_1',
					objectId: mockPost.id,
					objectType: 'POST',
					overallRisk: 0.5,
					moderationAction: 'NONE',
					confidence: 0.9,
					analyzedAt: '2023-01-01',
					textAnalysis: {
						sentiment: 'POSITIVE',
						sentimentScores: { positive: 0.9, negative: 0.1, neutral: 0, mixed: 0 },
						toxicityScore: 0.1,
						toxicityLabels: [],
						containsPII: false,
						dominantLanguage: 'en',
						entities: [],
						keyPhrases: [],
					},
				} as any,
			};
			const result = mapLesserPost(postWithAI);
			expect(result.success).toBe(true);
			expect(result.data?.aiAnalysis).toBeDefined();
			expect(result.data?.aiAnalysis?.textAnalysis?.sentiment).toBe('POSITIVE');
		});
	});

	describe('mapLesserNotification', () => {
		it('should map a notification correctly', () => {
			const result = mapLesserNotification(mockNotification);
			expect(result.success).toBe(true);
			if (!result.success) return;

			const notif = result.data;
			expect(notif).toBeDefined();
			if (!notif) return;
			expect(notif.id).toBe(mockNotification.id);
			expect(notif.type).toBe('mention');
			expect(notif.account.id).toBe(mockAccount.id);
			expect(notif.status).toBeDefined();
		});

		it('should map admin report notifications', () => {
			const reportNotif: LesserNotificationFragment = {
				...mockNotification,
				notificationType: 'ADMIN_REPORT',
				adminReport: {
					id: 'rep_1',
					reportedAccount: mockAccount,
					reporterAccount: mockAccount,
					reason: 'Spam',
					isActionTaken: false,
					submittedAt: '2023-01-01',
					category: 'SPAM',
				},
			};
			const result = mapLesserNotification(reportNotif);
			expect(result.success).toBe(true);
			expect(result.data?.report).toBeDefined();
			expect(result.data?.report?.comment).toBe('Spam');
		});

		it('should map derived types (COST_ALERT)', () => {
			const costNotif: LesserNotificationFragment = {
				...mockNotification,
				notificationType: 'COST_ALERT',
				status: {
					...mockObject,
					estimatedCost: 50,
				},
			};
			const result = mapLesserNotification(costNotif);
			expect(result.success).toBe(true);
			expect(result.data?.costAlert).toBeDefined();
			expect(result.data?.costAlert?.amount).toBe(50);
		});

		it('should return error for invalid notification', () => {
			const result = mapLesserNotification({} as any);
			expect(result.success).toBe(false);
		});
	});

	describe('mapLesserObject', () => {
		it('should map a basic object correctly', () => {
			const result = mapLesserObject(mockObject);
			expect(result.success).toBe(true);
			if (!result.success) return;

			expect(result.data?.id).toBe(mockObject.id);
			expect(result.data?.account.id).toBe(mockAccount.id);
			expect(result.data?.content).toBe(mockObject.content);
		});

		it('should return error if missing actor', () => {
			const invalidObject = { ...mockObject, actor: undefined };
			const result = mapLesserObject(invalidObject as any);
			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('missing actor');
		});
	});

	describe('mapLesserStreamingUpdate', () => {
		it('should map POST_CREATED update', () => {
			const update: LesserStreamingUpdate = {
				__typename: 'StreamingUpdate',
				eventType: 'POST_CREATED',
				timestamp: '2023-01-01T00:00:00Z',
				data: {
					__typename: 'PostStreamingData',
					post: mockPost,
				},
			};
			const result = mapLesserStreamingUpdate(update);
			expect(result.success).toBe(true);
			if (!result.success) return;

			expect((result.data as any).type).toBe('status');
			expect((result.data as any).payload.id).toBe(mockPost.id);
		});

		it('should map POST_UPDATED update', () => {
			const update: LesserStreamingUpdate = {
				__typename: 'StreamingUpdate',
				eventType: 'POST_UPDATED',
				timestamp: '2023-01-01T00:00:00Z',
				data: {
					__typename: 'PostStreamingData',
					post: mockPost,
				},
			};
			const result = mapLesserStreamingUpdate(update);
			expect(result.success).toBe(true);
			if (!result.success) return;

			// Check it maps to StreamingEdit
			expect((result.data as any).editType).toBe('content');
			expect((result.data as any).id).toBe(mockPost.id);
		});

		it('should map POST_DELETED update', () => {
			const update: LesserStreamingUpdate = {
				__typename: 'StreamingUpdate',
				eventType: 'POST_DELETED',
				timestamp: '2023-01-01T00:00:00Z',
				data: {
					__typename: 'DeleteStreamingData',
					deletedId: 'post_1',
					deletedType: 'POST',
				},
			};
			const result = mapLesserStreamingUpdate(update);
			expect(result.success).toBe(true);
			if (!result.success) return;

			expect((result.data as any).itemType).toBe('status');
			expect((result.data as any).id).toBe('post_1');
		});

		it('should map NOTIFICATION_CREATED update', () => {
			const update: LesserStreamingUpdate = {
				__typename: 'StreamingUpdate',
				eventType: 'NOTIFICATION_CREATED',
				timestamp: '2023-01-01T00:00:00Z',
				data: {
					__typename: 'NotificationStreamingData',
					notification: mockNotification,
				},
			};
			const result = mapLesserStreamingUpdate(update);
			expect(result.success).toBe(true);
			if (!result.success) return;

			expect((result.data as any).type).toBe('notification');
		});

		it('should map ACCOUNT_UPDATED update', () => {
			const update: LesserStreamingUpdate = {
				__typename: 'StreamingUpdate',
				eventType: 'ACCOUNT_UPDATED',
				timestamp: '2023-01-01T00:00:00Z',
				data: {
					__typename: 'AccountStreamingData',
					account: mockAccount,
				},
			};
			const result = mapLesserStreamingUpdate(update);
			expect(result.success).toBe(true);
			if (!result.success) return;

			expect((result.data as any).type).toBe('status'); // StreamingUpdate type for account is effectively status payload? Or generic.
			// The mapper returns type: 'status' for Account Update in the code
			expect((result.data as any).payload.id).toBe(mockAccount.id);
		});

		it('should return error for invalid update', () => {
			const result = mapLesserStreamingUpdate({} as any);
			expect(result.success).toBe(false);
		});
	});

	describe('handleLesserGraphQLResponse', () => {
		it('should return data on success', () => {
			const response = { data: { foo: 'bar' } };
			const result = handleLesserGraphQLResponse(response);
			expect(result.success).toBe(true);
			expect(result.data).toEqual({ foo: 'bar' });
		});

		it('should return error if errors present', () => {
			const response = { errors: [{ message: 'Error' }] };
			const result = handleLesserGraphQLResponse(response);
			expect(result.success).toBe(false);
			expect(result.error?.message).toContain('GraphQL response contains errors');
		});

		it('should return error if data missing', () => {
			const response = {};
			const result = handleLesserGraphQLResponse(response);
			expect(result.success).toBe(false);
		});
	});

	describe('Batch Mappers', () => {
		it('batchMapLesserAccounts should map multiple accounts', () => {
			const result = batchMapLesserAccounts([mockAccount]);
			expect(result.successful).toHaveLength(1);
			expect(result.failed).toHaveLength(0);
		});

		it('batchMapLesserPosts should map multiple posts', () => {
			const result = batchMapLesserPosts([mockPost]);
			expect(result.successful).toHaveLength(1);
			expect(result.failed).toHaveLength(0);
		});

		it('batchMapLesserNotifications should map multiple notifications', () => {
			const result = batchMapLesserNotifications([mockNotification]);
			expect(result.successful).toHaveLength(1);
			expect(result.failed).toHaveLength(0);
		});

		it('mapLesserTimelineConnection should map edges', () => {
			const connection: LesserTimelineConnection = {
				edges: [{ node: mockPost, cursor: '1' }],
				pageInfo: { hasNextPage: false, hasPreviousPage: false },
			};
			const result = mapLesserTimelineConnection(connection);
			expect(result.successful).toHaveLength(1);
		});
	});
});
