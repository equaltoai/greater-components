/**
 * Community Context Tests
 *
 * Tests for Community component context and helper functions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { CommunityData, CommunityConfig, CommunityHandlers } from '../src/types';

// Mock Svelte's context functions
let contextStore = new Map<symbol, unknown>();

vi.mock('svelte', () => ({
	getContext: vi.fn((key: symbol) => contextStore.get(key)),
	setContext: vi.fn((key: symbol, value: unknown) => contextStore.set(key, value)),
}));

// Import after mock is set up
import {
	COMMUNITY_CONTEXT_KEY,
	DEFAULT_COMMUNITY_CONFIG,
	createCommunityContext,
	getCommunityContext,
	hasCommunityContext,
} from '../src/components/Community/context';

// Test data factories
const makeCommunity = (
	id: string = '1',
	overrides: Partial<CommunityData> = {}
): CommunityData => ({
	id,
	name: `test-community-${id}`,
	title: 'Test Community',
	description: 'A test community for unit testing',
	rules: [
		{ order: 1, title: 'Be respectful', description: 'Treat others with respect' },
		{ order: 2, title: 'No spam', description: 'No unsolicited advertisements' },
	],
	stats: {
		subscriberCount: 10000,
		activeCount: 500,
		postCount: 25000,
		createdAt: new Date('2020-01-01'),
	},
	...overrides,
});

describe('Community Context', () => {
	beforeEach(() => {
		contextStore = new Map<symbol, unknown>();
		vi.clearAllMocks();
	});

	describe('COMMUNITY_CONTEXT_KEY', () => {
		it('should be a unique symbol', () => {
			expect(typeof COMMUNITY_CONTEXT_KEY).toBe('symbol');
			expect(COMMUNITY_CONTEXT_KEY.description).toBe('community-context');
		});
	});

	describe('DEFAULT_COMMUNITY_CONFIG', () => {
		it('should show stats by default', () => {
			expect(DEFAULT_COMMUNITY_CONFIG.showStats).toBe(true);
		});

		it('should show rules by default', () => {
			expect(DEFAULT_COMMUNITY_CONFIG.showRules).toBe(true);
		});

		it('should hide moderators by default', () => {
			expect(DEFAULT_COMMUNITY_CONFIG.showModerators).toBe(false);
		});

		it('should not be compact by default', () => {
			expect(DEFAULT_COMMUNITY_CONFIG.compact).toBe(false);
		});

		it('should have empty class by default', () => {
			expect(DEFAULT_COMMUNITY_CONFIG.class).toBe('');
		});
	});

	describe('createCommunityContext', () => {
		it('creates context with community data', () => {
			const community = makeCommunity();
			const context = createCommunityContext(community);

			expect(context.community).toBe(community);
		});

		it('creates context with default config', () => {
			const community = makeCommunity();
			const context = createCommunityContext(community);

			expect(context.config.showStats).toBe(true);
			expect(context.config.showRules).toBe(true);
			expect(context.config.showModerators).toBe(false);
		});

		it('merges custom config with defaults', () => {
			const community = makeCommunity();
			const customConfig: CommunityConfig = {
				showModerators: true,
				compact: true,
			};
			const context = createCommunityContext(community, customConfig);

			expect(context.config.showModerators).toBe(true);
			expect(context.config.compact).toBe(true);
			expect(context.config.showStats).toBe(true); // from defaults
		});

		it('creates context with handlers', () => {
			const community = makeCommunity();
			const handlers: CommunityHandlers = {
				onSubscribe: vi.fn(),
				onUnsubscribe: vi.fn(),
			};
			const context = createCommunityContext(community, {}, handlers);

			expect(context.handlers.onSubscribe).toBeDefined();
			expect(context.handlers.onUnsubscribe).toBeDefined();
		});

		it('initializes with isSubscribed false by default', () => {
			const community = makeCommunity();
			const context = createCommunityContext(community);

			expect(context.isSubscribed).toBe(false);
		});

		it('initializes with isModerator false by default', () => {
			const community = makeCommunity();
			const context = createCommunityContext(community);

			expect(context.isModerator).toBe(false);
		});

		it('accepts isSubscribed parameter', () => {
			const community = makeCommunity();
			const context = createCommunityContext(community, {}, {}, true);

			expect(context.isSubscribed).toBe(true);
		});

		it('accepts isModerator parameter', () => {
			const community = makeCommunity();
			const context = createCommunityContext(community, {}, {}, false, true);

			expect(context.isModerator).toBe(true);
		});

		it('stores context using setContext', () => {
			const community = makeCommunity();
			createCommunityContext(community);

			expect(contextStore.has(COMMUNITY_CONTEXT_KEY)).toBe(true);
		});
	});

	describe('getCommunityContext', () => {
		it('retrieves stored context', () => {
			const community = makeCommunity();
			const createdContext = createCommunityContext(community);
			const retrievedContext = getCommunityContext();

			expect(retrievedContext).toBe(createdContext);
		});

		it('throws error when context does not exist', () => {
			contextStore.clear();

			expect(() => getCommunityContext()).toThrow(
				'Community context not found. Make sure this component is used within a Community.Root component.'
			);
		});
	});

	describe('hasCommunityContext', () => {
		it('returns true when context exists', () => {
			const community = makeCommunity();
			createCommunityContext(community);

			expect(hasCommunityContext()).toBe(true);
		});

		it('returns false when context does not exist', () => {
			contextStore.clear();

			expect(hasCommunityContext()).toBe(false);
		});
	});
});

describe('Community Types', () => {
	describe('CommunityData', () => {
		it('supports full community with all fields', () => {
			const community: CommunityData = {
				id: '1',
				name: 'programming',
				title: 'Programming',
				description: 'A community for programmers',
				sidebar: '## Welcome\n\nThis is the sidebar content.',
				bannerUrl: '/banner.jpg',
				iconUrl: '/icon.png',
				primaryColor: '#FF4500',
				rules: [
					{ order: 1, title: 'Rule 1', description: 'Description 1', autoEnforced: true },
					{ order: 2, title: 'Rule 2', description: 'Description 2' },
				],
				stats: {
					subscriberCount: 50000,
					activeCount: 1000,
					postCount: 100000,
					createdAt: new Date('2018-01-01'),
					growthRate: 100,
				},
				isNsfw: false,
				isPrivate: false,
				isQuarantined: false,
				postFlairs: [{ id: 'f1', text: 'Discussion', type: 'post', backgroundColor: '#FF0000' }],
				userFlairs: [{ id: 'uf1', text: 'Expert', type: 'user', isEditable: true }],
				wikiEnabled: true,
				moderators: [
					{
						id: 'm1',
						username: 'mod1',
						permissions: ['all'],
						addedAt: new Date('2020-01-01'),
					},
				],
			};

			expect(community.id).toBe('1');
			expect(community.moderators).toHaveLength(1);
		});

		it('supports minimal community with required fields only', () => {
			const community: CommunityData = {
				id: '2',
				name: 'minimal',
				title: 'Minimal Community',
				description: 'A minimal community',
				rules: [],
				stats: {
					subscriberCount: 0,
					activeCount: 0,
					postCount: 0,
					createdAt: new Date(),
				},
			};

			expect(community.id).toBe('2');
			expect(community.isNsfw).toBeUndefined();
		});
	});

	describe('CommunityConfig', () => {
		it('supports all configuration options', () => {
			const config: CommunityConfig = {
				showStats: true,
				showRules: false,
				showModerators: true,
				compact: true,
				class: 'custom-class',
			};

			expect(config.showStats).toBe(true);
			expect(config.showRules).toBe(false);
			expect(config.compact).toBe(true);
		});
	});

	describe('CommunityHandlers', () => {
		it('supports all handler types', async () => {
			const handlers: CommunityHandlers = {
				onSubscribe: vi.fn(),
				onUnsubscribe: vi.fn(),
				onReport: vi.fn(),
				onEdit: vi.fn(),
			};

			await handlers.onSubscribe?.('community-1');
			await handlers.onUnsubscribe?.('community-1');
			await handlers.onReport?.('community-1', 'spam');
			await handlers.onEdit?.('community-1', { title: 'Updated' });

			expect(handlers.onSubscribe).toHaveBeenCalledWith('community-1');
			expect(handlers.onUnsubscribe).toHaveBeenCalledWith('community-1');
			expect(handlers.onReport).toHaveBeenCalledWith('community-1', 'spam');
			expect(handlers.onEdit).toHaveBeenCalledWith('community-1', { title: 'Updated' });
		});
	});

	describe('PostData', () => {
		it('supports all post types', () => {
			const types = ['text', 'link', 'image', 'video', 'poll', 'crosspost'] as const;

			types.forEach((type) => {
				const post = {
					id: '1',
					title: 'Test Post',
					type,
					author: { id: 'u1', username: 'user1' },
					community: { id: 'c1', name: 'test', title: 'Test' },
					score: 100,
					upvoteRatio: 0.95,
					commentCount: 10,
					createdAt: new Date(),
				};

				expect(post.type).toBe(type);
			});
		});
	});

	describe('VoteDirection', () => {
		it('supports upvote, downvote, and no vote', () => {
			const upvote: -1 | 0 | 1 = 1;
			const downvote: -1 | 0 | 1 = -1;
			const noVote: -1 | 0 | 1 = 0;

			expect(upvote).toBe(1);
			expect(downvote).toBe(-1);
			expect(noVote).toBe(0);
		});
	});

	describe('CommentData', () => {
		it('supports nested comments', () => {
			const comment = {
				id: 'c1',
				parentId: null,
				postId: 'p1',
				content: 'Top level comment',
				author: { id: 'u1', username: 'user1' },
				score: 50,
				createdAt: new Date(),
				depth: 0,
				children: [
					{
						id: 'c2',
						parentId: 'c1',
						postId: 'p1',
						content: 'Reply',
						author: { id: 'u2', username: 'user2' },
						score: 10,
						createdAt: new Date(),
						depth: 1,
					},
				],
			};

			expect(comment.children).toHaveLength(1);
			expect(comment.children?.[0].parentId).toBe('c1');
		});

		it('supports special comment flags', () => {
			const comment = {
				id: 'c1',
				parentId: null,
				postId: 'p1',
				content: 'Special comment',
				author: { id: 'u1', username: 'user1' },
				score: 100,
				createdAt: new Date(),
				depth: 0,
				isOp: true,
				isMod: true,
				isStickied: true,
				isDeleted: false,
			};

			expect(comment.isOp).toBe(true);
			expect(comment.isMod).toBe(true);
		});
	});

	describe('FlairData', () => {
		it('supports post and user flairs', () => {
			const postFlair = {
				id: 'f1',
				text: 'Discussion',
				type: 'post' as const,
				backgroundColor: '#FF0000',
				textColor: '#FFFFFF',
			};

			const userFlair = {
				id: 'uf1',
				text: 'Verified',
				type: 'user' as const,
				emoji: '✓',
				isEditable: false,
				isModOnly: true,
			};

			expect(postFlair.type).toBe('post');
			expect(userFlair.type).toBe('user');
		});
	});

	describe('ModerationTypes', () => {
		it('supports all moderation action types', () => {
			const actions = [
				'remove',
				'approve',
				'spam',
				'lock',
				'unlock',
				'sticky',
				'unsticky',
				'distinguish',
				'undistinguish',
				'ban',
				'unban',
				'mute',
				'unmute',
				'flair',
				'nsfw',
				'spoiler',
			] as const;

			expect(actions).toHaveLength(16);
		});

		it('supports moderation queue items', () => {
			const queueItem = {
				id: 'q1',
				type: 'post' as const,
				content: { id: 'p1', title: 'Reported Post' },
				reports: [{ reason: 'spam', createdAt: new Date() }],
				queue: 'reports' as const,
				queuedAt: new Date(),
			};

			expect(queueItem.queue).toBe('reports');
			expect(queueItem.reports).toHaveLength(1);
		});
	});

	describe('WikiTypes', () => {
		it('supports wiki page with revisions', () => {
			const page = {
				path: 'index',
				title: 'Wiki Home',
				content: '# Welcome\n\nThis is the wiki.',
				lastEditor: { id: 'u1', username: 'editor' },
				lastEditedAt: new Date(),
				revision: 5,
				isLocked: false,
				editPermission: 'everyone' as const,
			};

			expect(page.revision).toBe(5);
			expect(page.editPermission).toBe('everyone');
		});
	});
});
