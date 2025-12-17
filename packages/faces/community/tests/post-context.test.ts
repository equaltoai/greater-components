/**
 * Post Context Tests
 *
 * Tests for Post component context and helper functions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { PostData, PostConfig, PostHandlers } from '../src/types';

// Mock Svelte's context functions
let contextStore = new Map<symbol, unknown>();

vi.mock('svelte', () => ({
	getContext: vi.fn((key: symbol) => contextStore.get(key)),
	setContext: vi.fn((key: symbol, value: unknown) => contextStore.set(key, value)),
}));

// Import after mock is set up
import {
	POST_CONTEXT_KEY,
	DEFAULT_POST_CONFIG,
	createPostContext,
	getPostContext,
	hasPostContext,
} from '../src/components/Post/context';

// Test data factory
const makePost = (id: string = '1', overrides: Partial<PostData> = {}): PostData => ({
	id,
	title: 'Test Post',
	type: 'text',
	author: { id: 'u1', username: 'user1' },
	community: { id: 'c1', name: 'test', title: 'Test' },
	score: 100,
	upvoteRatio: 0.95,
	commentCount: 10,
	createdAt: new Date('2023-01-01'),
	...overrides,
});

describe('Post Context', () => {
	beforeEach(() => {
		contextStore = new Map<symbol, unknown>();
		vi.clearAllMocks();
	});

	describe('POST_CONTEXT_KEY', () => {
		it('should be a unique symbol', () => {
			expect(typeof POST_CONTEXT_KEY).toBe('symbol');
			expect(POST_CONTEXT_KEY.description).toBe('post-context');
		});
	});

	describe('DEFAULT_POST_CONFIG', () => {
		it('should show voting by default', () => {
			expect(DEFAULT_POST_CONFIG.showVoting).toBe(true);
		});

		it('should show community by default', () => {
			expect(DEFAULT_POST_CONFIG.showCommunity).toBe(true);
		});

		it('should show author by default', () => {
			expect(DEFAULT_POST_CONFIG.showAuthor).toBe(true);
		});

		it('should show flair by default', () => {
			expect(DEFAULT_POST_CONFIG.showFlair).toBe(true);
		});

		it('should not show awards by default', () => {
			expect(DEFAULT_POST_CONFIG.showAwards).toBe(false);
		});

		it('should not expand media by default', () => {
			expect(DEFAULT_POST_CONFIG.expandMedia).toBe(false);
		});

		it('should use card density by default', () => {
			expect(DEFAULT_POST_CONFIG.density).toBe('card');
		});

		it('should have empty class by default', () => {
			expect(DEFAULT_POST_CONFIG.class).toBe('');
		});
	});

	describe('createPostContext', () => {
		it('creates context with post data', () => {
			const post = makePost();
			const context = createPostContext(post);

			expect(context.post).toBe(post);
		});

		it('creates context with default config', () => {
			const post = makePost();
			const context = createPostContext(post);

			expect(context.config.showVoting).toBe(true);
			expect(context.config.density).toBe('card');
		});

		it('merges custom config with defaults', () => {
			const post = makePost();
			const customConfig: PostConfig = {
				showVoting: false,
				density: 'compact',
			};
			const context = createPostContext(post, customConfig);

			expect(context.config.showVoting).toBe(false);
			expect(context.config.density).toBe('compact');
			expect(context.config.showAuthor).toBe(true); // from defaults
		});

		it('creates context with handlers', () => {
			const post = makePost();
			const handlers: PostHandlers = {
				onUpvote: vi.fn(),
				onDownvote: vi.fn(),
			};
			const context = createPostContext(post, {}, handlers);

			expect(context.handlers.onUpvote).toBeDefined();
			expect(context.handlers.onDownvote).toBeDefined();
		});

		it('stores context using setContext', () => {
			const post = makePost();
			createPostContext(post);

			expect(contextStore.has(POST_CONTEXT_KEY)).toBe(true);
		});
	});

	describe('getPostContext', () => {
		it('retrieves stored context', () => {
			const post = makePost();
			const createdContext = createPostContext(post);
			const retrievedContext = getPostContext();

			expect(retrievedContext).toBe(createdContext);
		});

		it('throws error when context does not exist', () => {
			contextStore.clear();

			expect(() => getPostContext()).toThrow(
				'Post context not found. Make sure this component is used within a Post.Root component.'
			);
		});
	});

	describe('hasPostContext', () => {
		it('returns true when context exists', () => {
			const post = makePost();
			createPostContext(post);

			expect(hasPostContext()).toBe(true);
		});

		it('returns false when context does not exist', () => {
			contextStore.clear();

			expect(hasPostContext()).toBe(false);
		});
	});
});
