/**
 * Status Compound Component Tests
 * 
 * Comprehensive tests for Status components including:
 * - Context creation and management
 * - Reblog handling
 * - Configuration options
 * - Event handlers (onClick, onReply, onBoost, onFavorite, onShare, onBookmark)
 * - Child component communication
 * - Edge cases
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	createStatusContext,
	getStatusContext,
	hasStatusContext,
	type StatusConfig,
	type StatusActionHandlers,
} from '../src/components/Status/context';
import type { GenericStatus, GenericActor } from '../src/generics/index';

// Mock Svelte context
const contexts = new Map();
vi.mock('svelte', () => ({
	getContext: (key: symbol) => contexts.get(key),
	setContext: (key: symbol, value: any) => contexts.set(key, value),
}));

// Helper to create mock actor
function createMockActor(id: string): GenericActor {
	return {
		id: `actor-${id}`,
		username: `user${id}`,
		displayName: `User ${id}`,
		avatar: `https://example.com/avatar${id}.jpg`,
		url: `https://example.com/@user${id}`,
		followers: 100,
		following: 50,
		posts: 10,
		createdAt: new Date().toISOString(),
	};
}

// Helper to create mock status
function createMockStatus(id: string, reblog?: GenericStatus): GenericStatus {
	const account = createMockActor(id);

	return {
		id,
		uri: `https://example.com/status/${id}`,
		content: `Test status ${id}`,
		account,
		createdAt: new Date().toISOString(),
		visibility: 'public',
		sensitive: false,
		spoilerText: '',
		repliesCount: 0,
		reblogsCount: 0,
		favouritesCount: 0,
		url: `https://example.com/status/${id}`,
		inReplyToId: null,
		inReplyToAccountId: null,
		reblog: reblog || null,
		mentions: [],
		tags: [],
		emojis: [],
		card: null,
		poll: null,
		application: null,
		language: 'en',
		pinned: false,
		bookmarked: false,
		favourited: false,
		reblogged: false,
		muted: false,
		mediaAttachments: [],
	};
}

describe('Status Context', () => {
	beforeEach(() => {
		contexts.clear();
	});

	describe('createStatusContext', () => {
		it('should create context with default configuration', () => {
			const status = createMockStatus('1');

			const context = createStatusContext(status);

			expect(context.status).toBe(status);
			expect(context.actualStatus).toBe(status);
			expect(context.account).toBe(status.account);
			expect(context.isReblog).toBe(false);
			expect(context.config.density).toBe('comfortable');
			expect(context.config.showActions).toBe(true);
			expect(context.config.clickable).toBe(false);
			expect(context.config.showThread).toBe(true);
			expect(context.config.class).toBe('');
		});

		it('should create context with custom configuration', () => {
			const status = createMockStatus('1');
			const config: StatusConfig = {
				density: 'compact',
				showActions: false,
				clickable: true,
				showThread: false,
				class: 'custom-status',
			};

			const context = createStatusContext(status, config);

			expect(context.config.density).toBe('compact');
			expect(context.config.showActions).toBe(false);
			expect(context.config.clickable).toBe(true);
			expect(context.config.showThread).toBe(false);
			expect(context.config.class).toBe('custom-status');
		});

		it('should register event handlers', () => {
			const status = createMockStatus('1');
			const handlers: StatusActionHandlers = {
				onClick: vi.fn(),
				onReply: vi.fn(),
				onBoost: vi.fn(),
				onFavorite: vi.fn(),
				onShare: vi.fn(),
				onBookmark: vi.fn(),
			};

			const context = createStatusContext(status, {}, handlers);

			expect(context.handlers.onClick).toBe(handlers.onClick);
			expect(context.handlers.onReply).toBe(handlers.onReply);
			expect(context.handlers.onBoost).toBe(handlers.onBoost);
			expect(context.handlers.onFavorite).toBe(handlers.onFavorite);
			expect(context.handlers.onShare).toBe(handlers.onShare);
			expect(context.handlers.onBookmark).toBe(handlers.onBookmark);
		});

		it('should handle empty handlers', () => {
			const status = createMockStatus('1');

			const context = createStatusContext(status, {}, {});

			expect(context.handlers.onClick).toBeUndefined();
			expect(context.handlers.onReply).toBeUndefined();
			expect(context.handlers.onBoost).toBeUndefined();
			expect(context.handlers.onFavorite).toBeUndefined();
			expect(context.handlers.onShare).toBeUndefined();
			expect(context.handlers.onBookmark).toBeUndefined();
		});
	});

	describe('Reblog Handling', () => {
		it('should handle reblogged status', () => {
			const originalStatus = createMockStatus('original');
			const reblogStatus = createMockStatus('reblog', originalStatus);

			const context = createStatusContext(reblogStatus);

			expect(context.status).toBe(reblogStatus);
			expect(context.actualStatus).toBe(originalStatus);
			expect(context.account).toBe(originalStatus.account);
			expect(context.isReblog).toBe(true);
		});

		it('should use original status when not a reblog', () => {
			const status = createMockStatus('1');

			const context = createStatusContext(status);

			expect(context.status).toBe(status);
			expect(context.actualStatus).toBe(status);
			expect(context.account).toBe(status.account);
			expect(context.isReblog).toBe(false);
		});

		it('should identify reblog correctly', () => {
			const regularStatus = createMockStatus('1');
			const rebloggedStatus = createMockStatus('2', createMockStatus('original'));

			const regularContext = createStatusContext(regularStatus);
			const reblogContext = createStatusContext(rebloggedStatus);

			expect(regularContext.isReblog).toBe(false);
			expect(reblogContext.isReblog).toBe(true);
		});
	});

	describe('getStatusContext', () => {
		it('should retrieve existing context', () => {
			const status = createMockStatus('1');
			const created = createStatusContext(status);

			const retrieved = getStatusContext();

			expect(retrieved).toBe(created);
			expect(retrieved.status).toBe(status);
		});

		it('should throw error if context does not exist', () => {
			contexts.clear();

			expect(() => getStatusContext()).toThrow(
				'Status context not found. Make sure you are using Status components inside <Status.Root>.'
			);
		});
	});

	describe('hasStatusContext', () => {
		it('should return true when context exists', () => {
			const status = createMockStatus('1');
			createStatusContext(status);

			expect(hasStatusContext()).toBe(true);
		});

		it('should return false when context does not exist', () => {
			contexts.clear();

			expect(hasStatusContext()).toBe(false);
		});
	});
});

describe('Status Configuration Options', () => {
	beforeEach(() => {
		contexts.clear();
	});

	it('should support compact density', () => {
		const status = createMockStatus('1');
		const context = createStatusContext(status, { density: 'compact' });
		expect(context.config.density).toBe('compact');
	});

	it('should support comfortable density', () => {
		const status = createMockStatus('1');
		const context = createStatusContext(status, { density: 'comfortable' });
		expect(context.config.density).toBe('comfortable');
	});

	it('should hide actions when showActions is false', () => {
		const status = createMockStatus('1');
		const context = createStatusContext(status, { showActions: false });
		expect(context.config.showActions).toBe(false);
	});

	it('should show actions by default', () => {
		const status = createMockStatus('1');
		const context = createStatusContext(status);
		expect(context.config.showActions).toBe(true);
	});

	it('should be clickable when clickable is true', () => {
		const status = createMockStatus('1');
		const context = createStatusContext(status, { clickable: true });
		expect(context.config.clickable).toBe(true);
	});

	it('should not be clickable by default', () => {
		const status = createMockStatus('1');
		const context = createStatusContext(status);
		expect(context.config.clickable).toBe(false);
	});

	it('should hide thread indicators when showThread is false', () => {
		const status = createMockStatus('1');
		const context = createStatusContext(status, { showThread: false });
		expect(context.config.showThread).toBe(false);
	});

	it('should show thread indicators by default', () => {
		const status = createMockStatus('1');
		const context = createStatusContext(status);
		expect(context.config.showThread).toBe(true);
	});

	it('should support custom CSS class', () => {
		const status = createMockStatus('1');
		const context = createStatusContext(status, { class: 'my-status' });
		expect(context.config.class).toBe('my-status');
	});

	it('should have empty class by default', () => {
		const status = createMockStatus('1');
		const context = createStatusContext(status);
		expect(context.config.class).toBe('');
	});
});

describe('Status Event Handlers', () => {
	beforeEach(() => {
		contexts.clear();
	});

	it('should call onClick handler', () => {
		const status = createMockStatus('1');
		const onClick = vi.fn();
		const context = createStatusContext(status, {}, { onClick });

		context.handlers.onClick?.(status);

		expect(onClick).toHaveBeenCalledWith(status);
	});

	it('should call onReply handler', async () => {
		const status = createMockStatus('1');
		const onReply = vi.fn().mockResolvedValue(undefined);
		const context = createStatusContext(status, {}, { onReply });

		await context.handlers.onReply?.(status);

		expect(onReply).toHaveBeenCalledWith(status);
	});

	it('should call onBoost handler', async () => {
		const status = createMockStatus('1');
		const onBoost = vi.fn().mockResolvedValue(undefined);
		const context = createStatusContext(status, {}, { onBoost });

		await context.handlers.onBoost?.(status);

		expect(onBoost).toHaveBeenCalledWith(status);
	});

	it('should call onFavorite handler', async () => {
		const status = createMockStatus('1');
		const onFavorite = vi.fn().mockResolvedValue(undefined);
		const context = createStatusContext(status, {}, { onFavorite });

		await context.handlers.onFavorite?.(status);

		expect(onFavorite).toHaveBeenCalledWith(status);
	});

	it('should call onShare handler', async () => {
		const status = createMockStatus('1');
		const onShare = vi.fn().mockResolvedValue(undefined);
		const context = createStatusContext(status, {}, { onShare });

		await context.handlers.onShare?.(status);

		expect(onShare).toHaveBeenCalledWith(status);
	});

	it('should call onBookmark handler', async () => {
		const status = createMockStatus('1');
		const onBookmark = vi.fn().mockResolvedValue(undefined);
		const context = createStatusContext(status, {}, { onBookmark });

		await context.handlers.onBookmark?.(status);

		expect(onBookmark).toHaveBeenCalledWith(status);
	});

	it('should support sync handlers', () => {
		const status = createMockStatus('1');
		const onReply = vi.fn(); // Sync version
		const context = createStatusContext(status, {}, { onReply });

		context.handlers.onReply?.(status);

		expect(onReply).toHaveBeenCalledWith(status);
	});

	it('should support async handlers', async () => {
		const status = createMockStatus('1');
		const onBoost = vi.fn().mockImplementation(() =>
			new Promise((resolve) => setTimeout(resolve, 100))
		);
		const context = createStatusContext(status, {}, { onBoost });

		const promise = context.handlers.onBoost?.(status);
		expect(promise).toBeInstanceOf(Promise);

		await promise;

		expect(onBoost).toHaveBeenCalledWith(status);
	});
});

describe('Status Data Properties', () => {
	beforeEach(() => {
		contexts.clear();
	});

	it('should preserve all status properties', () => {
		const status = createMockStatus('1');
		status.content = 'Test content';
		status.favouritesCount = 10;
		status.reblogsCount = 5;
		status.repliesCount = 3;

		const context = createStatusContext(status);

		expect(context.status.content).toBe('Test content');
		expect(context.status.favouritesCount).toBe(10);
		expect(context.status.reblogsCount).toBe(5);
		expect(context.status.repliesCount).toBe(3);
	});

	it('should handle status with media attachments', () => {
		const status = createMockStatus('1');
		status.mediaAttachments = [
			{
				id: 'media1',
				type: 'image',
				url: 'https://example.com/image.jpg',
				previewUrl: 'https://example.com/preview.jpg',
				description: 'Test image',
			},
		];

		const context = createStatusContext(status);

		expect(context.status.mediaAttachments).toHaveLength(1);
		expect(context.status.mediaAttachments[0].type).toBe('image');
	});

	it('should handle status with sensitive content', () => {
		const status = createMockStatus('1');
		status.sensitive = true;
		status.spoilerText = 'CW: Test warning';

		const context = createStatusContext(status);

		expect(context.status.sensitive).toBe(true);
		expect(context.status.spoilerText).toBe('CW: Test warning');
	});

	it('should handle status with mentions', () => {
		const status = createMockStatus('1');
		status.mentions = [
			{
				id: 'user2',
				username: 'user2',
				url: 'https://example.com/@user2',
				acct: 'user2@example.com',
			},
		];

		const context = createStatusContext(status);

		expect(context.status.mentions).toHaveLength(1);
		expect(context.status.mentions[0].username).toBe('user2');
	});

	it('should handle status with tags', () => {
		const status = createMockStatus('1');
		status.tags = [
			{
				name: 'test',
				url: 'https://example.com/tags/test',
			},
		];

		const context = createStatusContext(status);

		expect(context.status.tags).toHaveLength(1);
		expect(context.status.tags[0].name).toBe('test');
	});

	it('should handle status with poll', () => {
		const status = createMockStatus('1');
		status.poll = {
			id: 'poll1',
			expiresAt: new Date(Date.now() + 86400000).toISOString(),
			expired: false,
			multiple: false,
			votesCount: 10,
			votersCount: 10,
			voted: false,
			ownVotes: [],
			options: [
				{ title: 'Option 1', votesCount: 5 },
				{ title: 'Option 2', votesCount: 5 },
			],
		};

		const context = createStatusContext(status);

		expect(context.status.poll).toBeDefined();
		expect(context.status.poll?.options).toHaveLength(2);
	});
});

describe('Status Edge Cases', () => {
	beforeEach(() => {
		contexts.clear();
	});

	it('should handle status with null reblog', () => {
		const status = createMockStatus('1');
		status.reblog = null;

		const context = createStatusContext(status);

		expect(context.actualStatus).toBe(status);
		expect(context.isReblog).toBe(false);
	});

	it('should handle nested reblogs (reblog of reblog)', () => {
		const originalStatus = createMockStatus('original');
		const firstReblog = createMockStatus('reblog1', originalStatus);
		const secondReblog = createMockStatus('reblog2', firstReblog);

		const context = createStatusContext(secondReblog);

		// Should use the immediate reblog, not the original
		expect(context.actualStatus).toBe(firstReblog);
		expect(context.isReblog).toBe(true);
	});

	it('should handle status with all optional fields undefined', () => {
		const minimalStatus: GenericStatus = {
			id: '1',
			uri: 'https://example.com/status/1',
			content: 'Minimal',
			account: createMockActor('1'),
			createdAt: new Date().toISOString(),
			visibility: 'public',
			sensitive: false,
			spoilerText: '',
			repliesCount: 0,
			reblogsCount: 0,
			favouritesCount: 0,
			url: 'https://example.com/status/1',
			inReplyToId: null,
			inReplyToAccountId: null,
			reblog: null,
			mentions: [],
			tags: [],
			emojis: [],
			card: null,
			poll: null,
			application: null,
			language: 'en',
			pinned: false,
			bookmarked: false,
			favourited: false,
			reblogged: false,
			muted: false,
			mediaAttachments: [],
		};

		const context = createStatusContext(minimalStatus);

		expect(context.status).toBe(minimalStatus);
		expect(context.actualStatus).toBe(minimalStatus);
	});

	it('should handle partial config', () => {
		const status = createMockStatus('1');
		const context = createStatusContext(status, { density: 'compact' });

		expect(context.config.density).toBe('compact');
		expect(context.config.showActions).toBe(true); // Default
		expect(context.config.clickable).toBe(false); // Default
	});
});

describe('Status Type Safety', () => {
	beforeEach(() => {
		contexts.clear();
	});

	it('should enforce StatusConfig type', () => {
		const status = createMockStatus('1');
		const densities: Array<'compact' | 'comfortable'> = ['compact', 'comfortable'];

		densities.forEach((density) => {
			const context = createStatusContext(status, { density });
			expect(context.config.density).toBe(density);
		});
	});

	it('should enforce GenericStatus structure', () => {
		const status = createMockStatus('test');

		expect(status).toHaveProperty('id');
		expect(status).toHaveProperty('uri');
		expect(status).toHaveProperty('content');
		expect(status).toHaveProperty('account');
		expect(status).toHaveProperty('createdAt');
		expect(status).toHaveProperty('visibility');
	});

	it('should enforce GenericActor structure for account', () => {
		const status = createMockStatus('test');

		expect(status.account).toHaveProperty('id');
		expect(status.account).toHaveProperty('username');
		expect(status.account).toHaveProperty('displayName');
		expect(status.account).toHaveProperty('avatar');
		expect(status.account).toHaveProperty('url');
	});
});
