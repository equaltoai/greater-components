// @ts-nocheck
import type { Component } from 'svelte';

// Wrappers
import CommunityTestWrapper from '../fixtures/CommunityTestWrapper.svelte';
import ThreadTestWrapper from '../fixtures/ThreadTestWrapper.svelte';
import ModerationTestWrapper from '../fixtures/ModerationTestWrapper.svelte';
import WikiTestWrapper from '../fixtures/WikiTestWrapper.svelte';

// Components to cover
import { Community } from '../../src/components/Community/index.js';
import { Post } from '../../src/components/Post/index.js';
import { Thread } from '../../src/components/Thread/index.js';
import { Voting } from '../../src/components/Voting/index.js';
import { Moderation } from '../../src/components/Moderation/index.js';
import { Wiki } from '../../src/components/Wiki/index.js';
import { Flair } from '../../src/components/Flair/index.js';

// Mocks
import { createMockCommunity } from '../mocks/mockCommunity.js';
import { createMockPost } from '../mocks/mockPost.js';
import { createMockCommentTree } from '../mocks/mockComment.js';
import { createMockFlair } from '../mocks/mockFlair.js';

interface Scenario {
	name: string;
	props: Record<string, unknown>;
	Wrapper?: Component<Record<string, unknown>>;
	wrapperProps?: Record<string, unknown>;
	action?: () => Promise<void>;
}

interface ComponentDefinition {
	component: Component<Record<string, unknown>>;
	scenarios: Scenario[];
}

const mockCommunity = createMockCommunity('1');
const mockPost = createMockPost('1');
const mockThread = {
	post: mockPost,
	comments: createMockCommentTree(),
	totalComments: 5,
	sortBy: 'best',
};

export const componentsToCover: Record<string, ComponentDefinition> = {
	// Community Components
	'Community/Header': {
		component: Community.Header,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: CommunityTestWrapper,
				wrapperProps: { community: mockCommunity },
			},
		],
	},
	'Community/RulesSidebar': {
		component: Community.RulesSidebar,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: CommunityTestWrapper,
				wrapperProps: { community: mockCommunity },
			},
		],
	},
	'Community/Stats': {
		component: Community.Stats,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: CommunityTestWrapper,
				wrapperProps: { community: mockCommunity },
			},
		],
	},

	// Post Components (Post.Root handles rendering content)
	'Post/Root': {
		component: Post.Root, // Wrapper not needed if Post.Root is the SUT and self-contained
		scenarios: [
			{ name: 'default', props: { post: mockPost } },
			{
				name: 'link-post',
				props: { post: { ...mockPost, type: 'link', url: 'https://example.com' } },
			},
		],
	},

	// Thread Components
	'Thread/CommentTree': {
		component: Thread.CommentTree,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: ThreadTestWrapper,
				wrapperProps: { thread: mockThread },
			},
		],
	},

	// Voting
	'Voting/Root': {
		component: Voting.Root,
		scenarios: [
			{ name: 'default', props: { score: 10, userVote: 0 } },
			{ name: 'upvoted', props: { score: 11, userVote: 1 } },
			{ name: 'downvoted', props: { score: 9, userVote: -1 } },
		],
	},

	// Moderation
	'Moderation/Panel': {
		component: Moderation.Panel,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: ModerationTestWrapper,
				wrapperProps: { handlers: { onFetchQueue: async () => [] } },
			},
		],
	},
	'Moderation/Queue': {
		component: Moderation.Queue,
		scenarios: [
			{
				name: 'empty',
				props: { queue: 'modqueue' },
				Wrapper: ModerationTestWrapper,
				wrapperProps: { handlers: {} },
			},
		],
	},

	// Wiki
	'Wiki/Page': {
		component: Wiki.Page,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: WikiTestWrapper,
				wrapperProps: {
					wiki: { path: '/', title: 'Home', content: 'Wiki content', editPermission: 'everyone' },
				},
			},
		],
	},
	'Wiki/Navigation': {
		component: Wiki.Navigation,
		scenarios: [{ name: 'default', props: {}, Wrapper: WikiTestWrapper, wrapperProps: {} }],
	},

	// Flair
	'Flair/Badge': {
		component: Flair.Badge,
		scenarios: [
			{ name: 'default', props: { flair: createMockFlair('f1') } },
			{
				name: 'user-flair',
				props: { flair: createMockFlair('f2', { type: 'user', backgroundColor: 'blue' }) },
			},
		],
	},
};
