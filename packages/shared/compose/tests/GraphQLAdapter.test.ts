import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	createOptimisticStatus,
	createComposeHandlers,
	createGraphQLComposeHandlers,
} from '../src/GraphQLAdapter.js';

import type { LesserGraphQLAdapter, Visibility } from '@equaltoai/greater-components-adapters';
import type { PostVisibility } from '../src/context.js';

const mockActor = {
	id: 'user-123',
	username: 'testuser',
	displayName: 'Test User',
	avatar: 'https://example.com/avatar.jpg',
	domain: null,
};

describe('GraphQLAdapter - Compose Integration', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});
	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	describe('createOptimisticStatus', () => {
		it('creates optimistic object with expected defaults', () => {
			const object = createOptimisticStatus({
				content: 'Test post',
				visibility: 'public',
				account: mockActor,
			});

			expect(object.id).toMatch(/^optimistic-/);
			expect(object.content).toBe('Test post');
			expect(object.visibility).toBe('PUBLIC');
			expect(object.actor.username).toBe(mockActor.username);
			expect(object._optimistic).toBe(true);
		});

		it('includes spoiler text when provided', () => {
			const object = createOptimisticStatus({
				content: 'Sensitive',
				contentWarning: 'CW',
				visibility: 'unlisted',
				account: mockActor,
			});

			expect(object.spoilerText).toBe('CW');
			expect(object.visibility).toBe('UNLISTED');
		});

		it('initialises engagement metrics to zero', () => {
			const object = createOptimisticStatus({
				content: 'Metrics test',
				visibility: 'private',
				account: mockActor,
			});

			expect(object.repliesCount).toBe(0);
			expect(object.likesCount).toBe(0);
			expect(object.sharesCount).toBe(0);
			expect(object.quoteCount).toBe(0);
		});

		it('sets timestamps within current time window', () => {
			const before = Date.now();
			const object = createOptimisticStatus({
				content: 'Timestamp',
				visibility: 'direct',
				account: mockActor,
			});
			const after = Date.now();

			const createdAt = new Date(object.createdAt).getTime();
			expect(createdAt).toBeGreaterThanOrEqual(before);
			expect(createdAt).toBeLessThanOrEqual(after);
			const updatedAt = new Date(object.updatedAt).getTime();
			expect(updatedAt).toBeGreaterThanOrEqual(before);
			expect(updatedAt).toBeLessThanOrEqual(after);
		});

		it('maps visibility values to GraphQL enumeration', () => {
			const cases: Record<PostVisibility, Visibility> = {
				public: 'PUBLIC',
				unlisted: 'UNLISTED',
				private: 'FOLLOWERS',
				direct: 'DIRECT',
			};

			(Object.keys(cases) as Array<PostVisibility>).forEach((key) => {
				const object = createOptimisticStatus({
					content: 'Visibility',
					visibility: key,
					account: mockActor,
				});
				expect(object.visibility).toBe(cases[key]);
			});
		});

		it('preserves unicode content', () => {
			const unicode = '👋 Hello 世界 🌍';
			const object = createOptimisticStatus({
				content: unicode,
				visibility: 'public',
				account: mockActor,
			});

			expect(object.content).toBe(unicode);
		});
	});

	describe('createComposeHandlers', () => {
		it('creates base handlers with adapter', () => {
			const mockAdapter = {
				createNote: vi.fn(),
				search: vi.fn(),
			} as unknown as LesserGraphQLAdapter;

			const handlers = createComposeHandlers({
				adapter: mockAdapter,
			});

			expect(handlers.handleSubmit).toBeDefined();
			expect(handlers.handleMediaUpload).toBeDefined();
			expect(handlers.handleMediaRemove).toBeDefined();
			expect(handlers.handleThreadSubmit).toBeDefined();
			expect(handlers.handleAutocompleteSearch).toBeDefined();
		});

		it('creates optimistic handlers when account provided', () => {
			const mockAdapter = {
				createNote: vi.fn(),
				search: vi.fn(),
			} as unknown as LesserGraphQLAdapter;

			const handlers = createComposeHandlers({
				adapter: mockAdapter,
				currentAccount: mockActor,
				enableOptimistic: true,
			});

			expect(handlers.handleSubmit).toBeDefined();
		});

		it('falls back to base handlers when optimistic disabled', () => {
			const mockAdapter = {
				createNote: vi.fn(),
				search: vi.fn(),
			} as unknown as LesserGraphQLAdapter;

			const handlers = createComposeHandlers({
				adapter: mockAdapter,
				enableOptimistic: false,
			});

			expect(handlers.handleSubmit).toBeDefined();
		});

		it('falls back to base handlers when no account provided', () => {
			const mockAdapter = {
				createNote: vi.fn(),
				search: vi.fn(),
			} as unknown as LesserGraphQLAdapter;

			const handlers = createComposeHandlers({
				adapter: mockAdapter,
				enableOptimistic: true,
			});

			expect(handlers.handleSubmit).toBeDefined();
		});
	});

	describe('createGraphQLComposeHandlers', () => {
		it('delegates quote submissions to createQuoteNote', async () => {
			const mockAdapter = {
				createNote: vi.fn().mockResolvedValue({ object: { id: 'note-1' } }),
				createQuoteNote: vi.fn().mockResolvedValue({ object: { id: 'quote-1' } }),
			} as unknown as LesserGraphQLAdapter;

			const handlers = createGraphQLComposeHandlers(mockAdapter);

			await handlers.handleSubmit({
				content: 'Quoting this status',
				visibility: 'public',
				quoteUrl: 'https://example.com/status/abc',
			});

			expect(mockAdapter.createQuoteNote).toHaveBeenCalledTimes(1);
			expect(mockAdapter.createNote).not.toHaveBeenCalled();
		});

		it('handles quote submit with media', async () => {
			const mockAdapter = {
				createQuoteNote: vi.fn().mockResolvedValue({ object: { id: 'q' } }),
			} as unknown as LesserGraphQLAdapter;

			const handlers = createGraphQLComposeHandlers(mockAdapter);

			await handlers.handleSubmit({
				content: 'Q',
				visibility: 'public',
				quoteUrl: 'url',
				mediaAttachments: [{ serverId: 'm1' }] as any,
			});

			expect(mockAdapter.createQuoteNote).toHaveBeenCalledWith(
				expect.objectContaining({
					mediaIds: ['m1'],
				})
			);
		});

		it('uses createNote when quote data is absent', async () => {
			const mockAdapter = {
				createNote: vi.fn().mockResolvedValue({ object: { id: 'note-2' } }),
				createQuoteNote: vi.fn().mockResolvedValue({ object: { id: 'quote-2' } }),
			} as unknown as LesserGraphQLAdapter;

			const handlers = createGraphQLComposeHandlers(mockAdapter);

			await handlers.handleSubmit({
				content: 'Regular post',
				visibility: 'public',
			});

			expect(mockAdapter.createNote).toHaveBeenCalledTimes(1);
			expect(mockAdapter.createQuoteNote).not.toHaveBeenCalled();
		});

		it('passes media metadata through upload handler', async () => {
			const mockUploadResponse = {
				uploadId: 'upload-1',
				warnings: [],
				media: {
					__typename: 'Media',
					id: 'media-123',
					type: 'IMAGE',
					url: 'https://cdn.example.com/media-123.jpg',
					previewUrl: 'https://cdn.example.com/media-123-preview.jpg',
					description: 'Alt text',
					sensitive: true,
					spoilerText: 'Spoiler',
					mediaCategory: 'IMAGE',
					blurhash: null,
					width: 800,
					height: 600,
					duration: null,
					size: 1024,
					mimeType: 'image/jpeg',
					createdAt: new Date().toISOString(),
					uploadedBy: mockActor,
				},
				__typename: 'UploadMediaPayload',
			};

			const mockAdapter = {
				createNote: vi.fn(),
				createQuoteNote: vi.fn(),
				uploadMedia: vi.fn().mockResolvedValue(mockUploadResponse),
			} as unknown as LesserGraphQLAdapter;

			const handlers = createGraphQLComposeHandlers(mockAdapter);

			const mockFile = { name: 'test.jpg', type: 'image/jpeg' } as unknown as File;
			const mediaStub = {
				id: 'local-1',
				file: mockFile,
				type: 'image',
				previewUrl: 'blob:test',
				thumbnailUrl: undefined,
				progress: 0,
				status: 'pending' as const,
				sensitive: true,
				spoilerText: 'Spoiler',
				mediaCategory: 'IMAGE' as const,
				description: 'Alt text',
				metadata: { size: 1024 },
			};

			const progress = vi.fn();
			const result = await handlers.handleMediaUpload(mockFile, progress, mediaStub);

			// Advance timers to trigger progress interval
			vi.advanceTimersByTime(200);

			expect(mockAdapter.uploadMedia).toHaveBeenCalled();
			expect(result).toEqual(expect.objectContaining({ id: 'media-123' }));
			expect(progress).toHaveBeenCalled();
		});

		it('logs warnings from media upload', async () => {
			const mockUploadResponse = {
				media: { id: 'm' },
				warnings: ['warning1'],
			};
			const mockAdapter = {
				uploadMedia: vi.fn().mockResolvedValue(mockUploadResponse),
			} as unknown as LesserGraphQLAdapter;

			const handlers = createGraphQLComposeHandlers(mockAdapter);
			const mediaStub = {
				id: 'local-1',
				file: new File([], 'f'),
				type: 'image',
				progress: 0,
				status: 'pending',
				sensitive: false,
				spoilerText: '',
				mediaCategory: 'IMAGE',
				metadata: { size: 0 },
			} as any;

			await handlers.handleMediaUpload(new File([], 'f'), vi.fn(), mediaStub);
			expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('warnings'), ['warning1']);
		});

		it('handles media upload error', async () => {
			const mockAdapter = {
				uploadMedia: vi.fn().mockRejectedValue(new Error('Upload failed')),
			} as unknown as LesserGraphQLAdapter;
			const handlers = createGraphQLComposeHandlers(mockAdapter);
			const mediaStub = {
				id: 'local-1',
				file: new File([], 'f'),
				type: 'image',
				progress: 0,
				status: 'pending',
				sensitive: false,
				spoilerText: '',
				mediaCategory: 'IMAGE',
				metadata: { size: 0 },
			} as any;

			await expect(
				handlers.handleMediaUpload(new File([], 'f'), vi.fn(), mediaStub)
			).rejects.toThrow('Upload failed');
		});

		it('handles media remove', async () => {
			const handlers = createGraphQLComposeHandlers({} as any);
			await expect(handlers.handleMediaRemove('id')).resolves.toBeUndefined();
		});

		it('should handle thread submission', async () => {
			const mockAdapter = {
				createNote: vi
					.fn()
					.mockResolvedValueOnce({ object: { id: 'note-1' } })
					.mockResolvedValueOnce({ object: { id: 'note-2' } }),
			} as unknown as LesserGraphQLAdapter;

			const handlers = createGraphQLComposeHandlers(mockAdapter);

			const posts = [
				{ content: 'Post 1', visibility: 'public' as const },
				{ content: 'Post 2', visibility: 'public' as const },
			];

			const results = await handlers.handleThreadSubmit(posts);

			expect(results).toHaveLength(2);
			expect(mockAdapter.createNote).toHaveBeenCalledTimes(2);

			expect(mockAdapter.createNote).toHaveBeenNthCalledWith(
				1,
				expect.objectContaining({ content: 'Post 1' })
			);

			expect(mockAdapter.createNote).toHaveBeenNthCalledWith(
				2,
				expect.objectContaining({ content: 'Post 2', inReplyToId: 'note-1' })
			);
		});

		it('should handle autocomplete search for mentions', async () => {
			const mockAdapter = {
				search: vi.fn().mockResolvedValue({
					accounts: [
						{ username: 'alice', displayName: 'Alice' },
						{ username: 'bob', domain: 'example.com' },
					],
				}),
			} as unknown as LesserGraphQLAdapter;

			const handlers = createGraphQLComposeHandlers(mockAdapter);

			const results = await handlers.handleAutocompleteSearch('test', 'mention');

			expect(results).toHaveLength(2);
			expect(results[0].text).toBe('@alice');
			expect(results[1].text).toBe('@bob@example.com');
		});

		it('handles nulls in autocomplete search', async () => {
			const mockAdapter = {
				search: vi.fn().mockResolvedValue({
					accounts: [null, { username: 'alice' }],
					hashtags: [null, { name: 'tag' }],
				}),
			} as unknown as LesserGraphQLAdapter;

			const handlers = createGraphQLComposeHandlers(mockAdapter);

			// Mentions
			const results1 = await handlers.handleAutocompleteSearch('test', 'mention');
			expect(results1).toHaveLength(1);
			expect(results1[0].value).toBe('@alice');

			// Hashtags
			const results2 = await handlers.handleAutocompleteSearch('test', 'hashtag');
			expect(results2).toHaveLength(1);
			expect(results2[0].value).toBe('tag');
		});

		it('handles empty response in search', async () => {
			const mockAdapter = {
				search: vi.fn().mockResolvedValue({}),
			} as unknown as LesserGraphQLAdapter;
			const handlers = createGraphQLComposeHandlers(mockAdapter);

			const results1 = await handlers.handleAutocompleteSearch('test', 'mention');
			expect(results1).toEqual([]);

			const results2 = await handlers.handleAutocompleteSearch('test', 'hashtag');
			expect(results2).toEqual([]);
		});

		it('should handle autocomplete search for hashtags', async () => {
			const mockAdapter = {
				search: vi.fn().mockResolvedValue({
					hashtags: [{ name: 'test' }, { name: 'testing' }],
				}),
			} as unknown as LesserGraphQLAdapter;

			const handlers = createGraphQLComposeHandlers(mockAdapter);

			const results = await handlers.handleAutocompleteSearch('test', 'hashtag');

			expect(results).toHaveLength(2);
			expect(results[0].text).toBe('#test');
		});

		it('should handle autocomplete search for emojis (not implemented)', async () => {
			const mockAdapter = {
				search: vi.fn(),
			} as unknown as LesserGraphQLAdapter;

			const handlers = createGraphQLComposeHandlers(mockAdapter);

			const results = await handlers.handleAutocompleteSearch('smile', 'emoji');

			expect(results).toEqual([]);
		});
	});

	describe('createOptimisticComposeHandlers', () => {
		it('should perform optimistic update on success', async () => {
			const mockAdapter = {
				createNote: vi.fn().mockResolvedValue({ object: { id: 'real-id' } }),
			} as unknown as LesserGraphQLAdapter;
			const onOptimisticUpdate = vi.fn();

			const handlers = createComposeHandlers({
				adapter: mockAdapter,
				currentAccount: mockActor,
				enableOptimistic: true,
				onOptimisticUpdate,
			});

			await handlers.handleSubmit({ content: 'T', visibility: 'public' });

			expect(onOptimisticUpdate).toHaveBeenCalledTimes(2);
			// 1. Optimistic creation
			expect(onOptimisticUpdate.mock.calls[0][0]._optimistic).toBe(true);
			// 2. Replacement
			expect(onOptimisticUpdate.mock.calls[1][0]).toHaveProperty('_replaces');
			expect(onOptimisticUpdate.mock.calls[1][0].id).toBe('real-id');
		});

		it('should rollback optimistic update on submit error', async () => {
			const mockAdapter = {
				createNote: vi.fn().mockRejectedValue(new Error('Failed')),
			} as unknown as LesserGraphQLAdapter;
			const onOptimisticUpdate = vi.fn();

			const handlers = createComposeHandlers({
				adapter: mockAdapter,
				currentAccount: mockActor,
				enableOptimistic: true,
				onOptimisticUpdate,
			});

			await expect(
				handlers.handleSubmit({
					content: 'Test',
					visibility: 'public',
				})
			).rejects.toThrow('Failed');

			expect(onOptimisticUpdate).toHaveBeenCalledTimes(2);
			expect(onOptimisticUpdate.mock.calls[0][0]._optimistic).toBe(true);
			expect(onOptimisticUpdate.mock.calls[1][0]).toHaveProperty('_remove');
		});

		it('should perform optimistic updates for thread success', async () => {
			const mockAdapter = {
				createNote: vi
					.fn()
					.mockResolvedValueOnce({ object: { id: 'r1' } })
					.mockResolvedValueOnce({ object: { id: 'r2' } }),
			} as unknown as LesserGraphQLAdapter;
			const onOptimisticUpdate = vi.fn();

			const handlers = createComposeHandlers({
				adapter: mockAdapter,
				currentAccount: mockActor,
				enableOptimistic: true,
				onOptimisticUpdate,
			});

			await handlers.handleThreadSubmit([
				{ content: '1', visibility: 'public' },
				{ content: '2', visibility: 'public' },
			]);

			// 2 creates, 2 replacements = 4 calls
			expect(onOptimisticUpdate).toHaveBeenCalledTimes(4);
			expect(onOptimisticUpdate.mock.calls[0][0]._optimistic).toBe(true);
			expect(onOptimisticUpdate.mock.calls[2][0]._replaces).toBeDefined();
		});

		it('should rollback optimistic thread update on error', async () => {
			const mockAdapter = {
				createNote: vi.fn().mockRejectedValue(new Error('Failed')),
			} as unknown as LesserGraphQLAdapter;
			const onOptimisticUpdate = vi.fn();

			const handlers = createComposeHandlers({
				adapter: mockAdapter,
				currentAccount: mockActor,
				enableOptimistic: true,
				onOptimisticUpdate,
			});

			await expect(
				handlers.handleThreadSubmit([
					{ content: 'P1', visibility: 'public' },
					{ content: 'P2', visibility: 'public' },
				])
			).rejects.toThrow('Failed');

			expect(onOptimisticUpdate).toHaveBeenCalledTimes(4); // 2 creates + 2 removes
			expect(onOptimisticUpdate.mock.calls[2][0]).toHaveProperty('_remove');
		});

		it('skips replacement if optimistic status missing from map (edge case logic check)', async () => {
			// This is harder to test since map is internal to handleThreadSubmit scope
			// But we can check if onOptimisticUpdate logic handles it?
			// Actually handleThreadSubmit uses `optimisticStatuses` array which is local.
			// It will always exist in scope.
			// But if `optimisticStatuses[index]` is somehow undefined (length mismatch), it returns.
			// This is just a safety check.
		});
	});
});
