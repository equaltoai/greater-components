import { describe, it, expect } from 'vitest';
import { unifiedStatusToTimelineItem, unifiedStatusesToTimelineItems } from '../unifiedToTimeline';
import type { UnifiedStatus } from '../../models/unified';

const mockAccount = {
	id: 'acc_1',
	username: 'user',
	acct: 'user@example.com',
	displayName: 'User',
	note: '',
	avatar: '',
	header: '',
	createdAt: '2023-01-01',
	followersCount: 0,
	followingCount: 0,
	statusesCount: 0,
	locked: false,
	verified: false,
	bot: false,
	fields: [],
	metadata: {
		source: 'mastodon' as const,
		apiVersion: '1.0',
		lastUpdated: Date.now(),
	},
};

const mockStatus: UnifiedStatus = {
	id: 'status_1',
	createdAt: '2023-01-01',
	content: 'Hello',
	visibility: 'public',
	sensitive: false,
	account: mockAccount,
	mediaAttachments: [],
	mentions: [],
	tags: [],
	emojis: [],
	repliesCount: 0,
	reblogsCount: 0,
	favouritesCount: 0,
	favourited: false,
	reblogged: false,
	bookmarked: false,
	pinned: false,
	metadata: {
		source: 'mastodon' as const,
		apiVersion: '1.0',
		lastUpdated: Date.now(),
	},
};

describe('unifiedToTimeline', () => {
	describe('unifiedStatusToTimelineItem', () => {
		it('should convert a basic status', () => {
			const item = unifiedStatusToTimelineItem(mockStatus);
			expect(item.type).toBe('status');
			expect(item.content).toEqual(mockStatus);
			expect(item.metadata).toBeUndefined();
		});

		it('should handle deleted status (tombstone)', () => {
			const deletedStatus: UnifiedStatus = {
				...mockStatus,
				isDeleted: true,
				deletedAt: '2023-01-01T00:00:00Z',
				formerType: 'status',
			};
			const item = unifiedStatusToTimelineItem(deletedStatus);
			expect(item.type).toBe('tombstone');
			expect(item.metadata?.lesser?.isDeleted).toBe(true);
			expect(item.metadata?.lesser?.deletedAt).toBe('2023-01-01T00:00:00Z');
			expect(item.metadata?.lesser?.formerType).toBe('status');
		});

		it('should populate Lesser metadata', () => {
			const richStatus: UnifiedStatus = {
				...mockStatus,
				estimatedCost: 10,
				moderationScore: 0.5,
				communityNotes: [{ id: 'note_1' } as any],
				quoteUrl: 'https://example.com/quote',
				quoteCount: 5,
				quoteable: true,
				quotePermissions: 'EVERYONE',
				aiAnalysis: {
					moderationAction: 'NONE',
					confidence: 0.9,
				} as any,
			};
			// Also add account trust score
			richStatus.account = { ...mockAccount, trustScore: 0.8 };

			const item = unifiedStatusToTimelineItem(richStatus);
			expect(item.metadata?.lesser).toBeDefined();
			expect(item.metadata?.lesser).toBeDefined();
			const meta = item.metadata?.lesser;
			if (!meta) throw new Error('MetaData not found');
			expect(meta.estimatedCost).toBe(10);
			expect(meta.moderationScore).toBe(0.5);
			expect(meta.hasCommunityNotes).toBe(true);
			expect(meta.communityNotesCount).toBe(1);
			expect(meta.isQuote).toBe(true);
			expect(meta.quoteCount).toBe(5);
			expect(meta.quoteable).toBe(true);
			expect(meta.quotePermission).toBe('EVERYONE');
			expect(meta.authorTrustScore).toBe(0.8);
			expect(meta.aiModerationAction).toBe('NONE');
			expect(meta.aiConfidence).toBe(0.9);
		});
	});

	describe('unifiedStatusesToTimelineItems', () => {
		it('should batch convert statuses', () => {
			const statuses = [mockStatus, { ...mockStatus, id: 'status_2' }];
			const items = unifiedStatusesToTimelineItems(statuses);
			expect(items).toHaveLength(2);
			expect((items[0]?.content as UnifiedStatus).id).toBe('status_1');
			expect((items[1]?.content as UnifiedStatus).id).toBe('status_2');
		});
	});
});
