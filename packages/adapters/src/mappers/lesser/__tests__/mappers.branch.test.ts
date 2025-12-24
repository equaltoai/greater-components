import { describe, it, expect } from 'vitest';
import {
	mapLesserAccount,
	mapLesserPost,
	mapLesserNotification,
	mapLesserStreamingUpdate,
	mapLesserObject,
} from '../mappers';
import type {
	LesserAccountFragment,
	LesserPostFragment,
	LesserNotificationFragment,
	LesserStreamingUpdate,
	LesserObjectFragment,
} from '../types';

describe('Lesser Mappers Branch Coverage', () => {
	const baseAccount: LesserAccountFragment = {
		id: 'acc_1',
		handle: 'user@example.com',
		localHandle: 'user',
		displayName: 'User',
		bio: '',
		avatarUrl: '',
		bannerUrl: '',
		joinedAt: '2023-01-01',
		isVerified: false,
		isBot: false,
		isLocked: false,
		followerCount: 0,
		followingCount: 0,
		postCount: 0,
		profileFields: [],
		customEmojis: [],
	};

	describe('mapLesserAccount', () => {
		it('should handle missing optional fields', () => {
			const account = { ...baseAccount, reputation: undefined, vouches: undefined };
			const result = mapLesserAccount(account);
			expect(result.success).toBe(true);
			expect(result.data?.reputation).toBeUndefined();
			expect(result.data?.vouches).toBeUndefined();
		});

		it('should handle trustScore being 0', () => {
			const account = { ...baseAccount, trustScore: 0 };
			const result = mapLesserAccount(account);
			expect(result.data?.trustScore).toBe(0);
		});
	});

	describe('mapLesserPost', () => {
		const basePost: LesserPostFragment = {
			id: 'post_1',
			publishedAt: '2023-01-01',
			content: 'test',
			contentWarning: null as any,
			visibility: 'UNKNOWN' as any, // Test default case
			isSensitive: false,
			language: 'en',
			author: baseAccount,
			attachments: [],
			mentions: [],
			hashtags: [],
			emojis: [],
			interactionCounts: { replies: 0, shares: 0, favorites: 0 },
			userInteractions: { isFavorited: false, isShared: false, isBookmarked: false },
			isPinned: false,
		};

		it('should default visibility to public', () => {
			const result = mapLesserPost(basePost);
			expect(result.data?.visibility).toBe('public');
		});

		it('should map UNKNOWN media type', () => {
			const post = {
				...basePost,
				attachments: [{ id: 'm1', mediaType: 'UNKNOWN', url: 'url' } as any],
			};
			const result = mapLesserPost(post);
			expect(result.data?.mediaAttachments?.[0]?.type).toBe('unknown');
		});

		it('should handle shareOf vs boostedObject', () => {
			const boosted = { ...basePost, id: 'b1' };
			const post = { ...basePost, boostedObject: boosted, shareOf: undefined };
			const result = mapLesserPost(post);
			expect(result.data?.reblog?.id).toBe('b1');
		});
	});

	describe('mapLesserNotification', () => {
		const baseNotif: LesserNotificationFragment = {
			id: 'n1',
			notificationType: 'UNKNOWN' as any,
			createdAt: '2023-01-01',
			triggerAccount: baseAccount,
			isRead: false,
		};

		it('should default type to mention', () => {
			const result = mapLesserNotification(baseNotif);
			expect(result.data?.type).toBe('mention');
		});

		it('should map QUOTE type', () => {
			const notif = {
				...baseNotif,
				notificationType: 'QUOTE' as any,
				status: {
					id: 's1',
					type: 'Post',
					actor: baseAccount,
					content: 'quote',
					createdAt: '2023-01-01',
				} as any,
			};
			const result = mapLesserNotification(notif);
			expect(result.data?.type).toBe('quote');
			expect(result.data?.quoteStatus).toBeDefined();
		});

		it('should map COMMUNITY_NOTE type', () => {
			const notif = {
				...baseNotif,
				notificationType: 'COMMUNITY_NOTE' as any,
				status: {
					id: 's1',
					type: 'Post',
					actor: baseAccount,
					content: 'status',
					communityNotes: [
						{
							id: 'cn1',
							content: 'note',
							createdAt: '2023-01-01',
							helpful: 1,
							notHelpful: 0,
						},
					],
				} as any,
			};
			const result = mapLesserNotification(notif);
			expect(result.data?.type).toBe('community_note');
			expect(result.data?.communityNote).toBeDefined();
		});

		it('should map TRUST_UPDATE type', () => {
			const notif = {
				...baseNotif,
				notificationType: 'TRUST_UPDATE' as any,
				triggerAccount: { ...baseAccount, trustScore: 0.8 },
			};
			const result = mapLesserNotification(notif);
			expect(result.data?.type).toBe('trust_update');
			expect(result.data?.trustUpdate?.newScore).toBe(0.8);
		});

		it('should map MODERATION_ACTION type', () => {
			const notif = {
				...baseNotif,
				notificationType: 'MODERATION_ACTION' as any,
				status: {
					id: 's1',
					type: 'Post',
					actor: baseAccount,
					aiAnalysis: {
						moderationAction: 'HIDE',
					},
				} as any,
			};
			const result = mapLesserNotification(notif);
			expect(result.data?.type).toBe('moderation_action');
			expect(result.data?.moderationAction?.action).toBe('HIDE');
		});
	});

	describe('mapLesserObject', () => {
		const baseObject: LesserObjectFragment = {
			id: 'o1',
			type: 'Note',
			actor: baseAccount,
			content: 'content',
			createdAt: '2023-01-01',
			updatedAt: '2023-01-01',
			repliesCount: 0,
			likesCount: 0,
			sharesCount: 0,
			estimatedCost: 0,
			visibility: 'PUBLIC',
			sensitive: false,
			attachments: [],
			tags: [],
			mentions: [],
			communityNotes: [],
			quoteable: true,
			quotePermissions: 'EVERYONE',
		};

		it('should handle replyTo with actor', () => {
			const obj = {
				...baseObject,
				inReplyTo: {
					id: 'r1',
					actor: baseAccount,
				} as any,
			};
			const result = mapLesserObject(obj);
			expect(result.data?.inReplyTo?.account).toBeDefined();
		});

		it('should handle quoteContext', () => {
			const obj = {
				...baseObject,
				quoteContext: {
					quoteAllowed: true,
					withdrawn: false,
					quoteType: 'FULL',
				} as any,
			};
			const result = mapLesserObject(obj);
			expect(result.data?.quoteContext).toBeDefined();
		});

		it('should return error on exception', () => {
			// Force error by passing circular object or invalid type that causes throw
			const result = mapLesserObject(null as any);
			expect(result.success).toBe(false);
		});
	});

	describe('mapLesserStreamingUpdate', () => {
		it('should return raw status for generic update', () => {
			const update: LesserStreamingUpdate = {
				__typename: 'StreamingUpdate',
				eventType: 'UNKNOWN_EVENT' as any,
				timestamp: '2023-01-01T00:00:00Z',
				data: { foo: 'bar' } as any,
			};
			const result = mapLesserStreamingUpdate(update);
			expect(result.success).toBe(true);
			if (result.success && result.data && 'payload' in result.data) {
				expect((result.data as any).payload).toEqual({ foo: 'bar' });
			}
		});

		it('should map POST_DELETED', () => {
			const update: LesserStreamingUpdate = {
				__typename: 'StreamingUpdate',
				eventType: 'POST_DELETED',
				timestamp: '2023-01-01T00:00:00Z',
				data: {
					__typename: 'DeleteStreamingData',
					deletedId: 'p1',
					deletedType: 'POST',
				} as any,
			};
			const result = mapLesserStreamingUpdate(update);
			expect(result.success).toBe(true);
			if (result.success && result.data && 'itemType' in result.data) {
				expect(result.data.itemType).toBe('status');
			}
		});

		it('should map ACCOUNT_UPDATED', () => {
			const update: LesserStreamingUpdate = {
				__typename: 'StreamingUpdate',
				eventType: 'ACCOUNT_UPDATED',
				timestamp: '2023-01-01T00:00:00Z',
				data: {
					__typename: 'AccountStreamingData',
					account: baseAccount,
				} as any,
			};
			const result = mapLesserStreamingUpdate(update);
			expect(result.success).toBe(true);
			if (result.success && result.data && 'type' in result.data) {
				expect(result.data.type).toBe('status');
			}
		});

		it('should return error on exception', () => {
			const result = mapLesserStreamingUpdate(null as any);
			expect(result.success).toBe(false);
		});
	});

	describe('mapLesserAIAnalysis', () => {
		it('should map full AI analysis', () => {
			// We can test mapLesserAIAnalysis indirectly via mapLesserPost
			// but we need to construct a post with full AI data
			const aiData = {
				id: 'ai1',
				objectId: 'p1',
				objectType: 'POST',
				overallRisk: 0.8,
				moderationAction: 'WARN',
				confidence: 0.9,
				analyzedAt: '2023-01-01',
				textAnalysis: {
					sentiment: 'NEGATIVE',
					sentimentScores: { positive: 0, negative: 1, neutral: 0, mixed: 0 },
					toxicityScore: 0.9,
					toxicityLabels: ['HATE'],
					containsPII: true,
					dominantLanguage: 'en',
					entities: [{ text: 'foo', type: 'ORG', confidence: 0.9 }],
					keyPhrases: ['bad'],
				},
				imageAnalysis: {
					moderationLabels: [{ name: 'Violence', confidence: 0.9, parentName: 'Harm' }],
					isNSFW: true,
					nsfwConfidence: 0.9,
					violenceScore: 0.9,
					weaponsDetected: true,
					detectedText: ['gun'],
					textToxicity: 0.5,
					celebrityFaces: [{ name: 'Celeb', confidence: 0.9, urls: [] }],
					deepfakeScore: 0.8,
				},
				aiDetection: {
					aiGeneratedProbability: 0.9,
					generationModel: 'GPT',
					patternConsistency: 0.8,
					styleDeviation: 0.2,
					semanticCoherence: 0.9,
					suspiciousPatterns: ['repetition'],
				},
				spamAnalysis: {
					spamScore: 0.9,
					spamIndicators: [{ type: 'LINK', description: 'Too many', severity: 1 }],
					postingVelocity: 10,
					repetitionScore: 0.9,
					linkDensity: 0.5,
					followerRatio: 0.1,
					interactionRate: 0.01,
					accountAgeDays: 1,
				},
			};

			const post: LesserPostFragment = {
				id: 'p1',
				author: baseAccount,
				content: 'test',
				publishedAt: '2023-01-01',
				aiAnalysis: aiData as any,
			} as any;

			const result = mapLesserPost(post);
			expect(result.data?.aiAnalysis?.textAnalysis?.containsPII).toBe(true);
			expect(result.data?.aiAnalysis?.imageAnalysis?.isNSFW).toBe(true);
			expect(result.data?.aiAnalysis?.aiDetection?.aiGeneratedProbability).toBe(0.9);
			expect(result.data?.aiAnalysis?.spamAnalysis?.spamScore).toBe(0.9);
		});
	});
});
