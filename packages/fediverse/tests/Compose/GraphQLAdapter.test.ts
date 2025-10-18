import { describe, it, expect, vi } from 'vitest';
import {
	createOptimisticStatus,
	createComposeHandlers,
	createGraphQLComposeHandlers,
} from '../../src/components/Compose/GraphQLAdapter.js';

import type { LesserGraphQLAdapter, Visibility } from '@greater/adapters';
import type { PostVisibility } from '../../src/components/Compose/context.js';
const mockActor = {
	id: 'user-123',
	username: 'testuser',
	displayName: 'Test User',
	avatar: 'https://example.com/avatar.jpg',
	domain: null,
};

describe('GraphQLAdapter - Compose Integration', () => {
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
	});
});
