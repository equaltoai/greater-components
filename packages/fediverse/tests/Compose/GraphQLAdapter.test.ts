import { describe, it, expect, vi } from 'vitest';
import {
	createOptimisticStatus,
	createComposeHandlers,
} from '../../src/components/Compose/GraphQLAdapter.js';

describe('GraphQLAdapter - Compose Integration', () => {
	const mockAccount = {
		id: 'user-123',
		username: 'testuser',
		displayName: 'Test User',
		avatar: 'https://example.com/avatar.jpg',
	};

	describe('createOptimisticStatus', () => {
		it('should create optimistic status with basic data', () => {
			const status = createOptimisticStatus({
				content: 'Test post',
				visibility: 'public',
				account: mockAccount,
			});

			expect(status.id).toMatch(/^optimistic-/);
			expect(status.content).toBe('Test post');
			expect(status.visibility).toBe('public');
			expect(status.account).toEqual(mockAccount);
			expect(status._optimistic).toBe(true);
		});

		it('should include content warning when provided', () => {
			const status = createOptimisticStatus({
				content: 'Sensitive content',
				contentWarning: 'CW: Test',
				visibility: 'public',
				account: mockAccount,
			});

			expect(status.contentWarning).toBe('CW: Test');
		});

		it('should set initial interaction counts to zero', () => {
			const status = createOptimisticStatus({
				content: 'Test',
				visibility: 'public',
				account: mockAccount,
			});

			expect(status.repliesCount).toBe(0);
			expect(status.reblogsCount).toBe(0);
			expect(status.favouritesCount).toBe(0);
		});

		it('should set initial interaction states to false', () => {
			const status = createOptimisticStatus({
				content: 'Test',
				visibility: 'public',
				account: mockAccount,
			});

			expect(status.favourited).toBe(false);
			expect(status.reblogged).toBe(false);
			expect(status.bookmarked).toBe(false);
		});

		it('should include timestamp', () => {
			const before = Date.now();
			const status = createOptimisticStatus({
				content: 'Test',
				visibility: 'public',
				account: mockAccount,
			});
			const after = Date.now();

			const timestamp = new Date(status.createdAt).getTime();
			expect(timestamp).toBeGreaterThanOrEqual(before);
			expect(timestamp).toBeLessThanOrEqual(after);
		});

		it('should create unique IDs for each status', async () => {
			const status1 = createOptimisticStatus({
				content: 'Test 1',
				visibility: 'public',
				account: mockAccount,
			});

			// Wait 1ms to ensure different timestamp
			await new Promise((resolve) => setTimeout(resolve, 1));

			const status2 = createOptimisticStatus({
				content: 'Test 2',
				visibility: 'public',
				account: mockAccount,
			});

			expect(status1.id).not.toBe(status2.id);
		});

		it('should handle different visibility levels', () => {
			const visibilities: Array<'public' | 'unlisted' | 'private' | 'direct'> = [
				'public',
				'unlisted',
				'private',
				'direct',
			];

			visibilities.forEach((visibility) => {
				const status = createOptimisticStatus({
					content: 'Test',
					visibility,
					account: mockAccount,
				});

				expect(status.visibility).toBe(visibility);
			});
		});

		it('should handle empty content', () => {
			const status = createOptimisticStatus({
				content: '',
				visibility: 'public',
				account: mockAccount,
			});

			expect(status.content).toBe('');
		});

		it('should handle very long content', () => {
			const longContent = 'a'.repeat(5000);
			const status = createOptimisticStatus({
				content: longContent,
				visibility: 'public',
				account: mockAccount,
			});

			expect(status.content).toBe(longContent);
		});

		it('should handle unicode content', () => {
			const unicodeContent = '👋 Hello 世界 🌍';
			const status = createOptimisticStatus({
				content: unicodeContent,
				visibility: 'public',
				account: mockAccount,
			});

			expect(status.content).toBe(unicodeContent);
		});
	});

	describe('createComposeHandlers', () => {
		it('should create handlers with adapter', () => {
			const mockAdapter = {
				createStatus: vi.fn(),
				search: vi.fn(),
			} as any;

			const handlers = createComposeHandlers({
				adapter: mockAdapter,
			});

			expect(handlers).toBeDefined();
			expect(handlers.handleSubmit).toBeDefined();
			expect(handlers.handleMediaUpload).toBeDefined();
			expect(handlers.handleMediaRemove).toBeDefined();
			expect(handlers.handleThreadSubmit).toBeDefined();
			expect(handlers.handleAutocompleteSearch).toBeDefined();
		});

		it('should create optimistic handlers when account provided', () => {
			const mockAdapter = {
				createStatus: vi.fn(),
				search: vi.fn(),
			} as any;

			const handlers = createComposeHandlers({
				adapter: mockAdapter,
				currentAccount: mockAccount,
				enableOptimistic: true,
			});

			expect(handlers).toBeDefined();
			expect(handlers.handleSubmit).toBeDefined();
		});

		it('should create basic handlers when optimistic disabled', () => {
			const mockAdapter = {
				createStatus: vi.fn(),
				search: vi.fn(),
			} as any;

			const handlers = createComposeHandlers({
				adapter: mockAdapter,
				enableOptimistic: false,
			});

			expect(handlers).toBeDefined();
		});

		it('should create basic handlers when no account provided', () => {
			const mockAdapter = {
				createStatus: vi.fn(),
				search: vi.fn(),
			} as any;

			const handlers = createComposeHandlers({
				adapter: mockAdapter,
			});

			expect(handlers).toBeDefined();
		});

		it('should accept optimistic update callback', () => {
			const mockAdapter = {
				createStatus: vi.fn(),
				search: vi.fn(),
			} as any;

			const onOptimisticUpdate = vi.fn();

			const handlers = createComposeHandlers({
				adapter: mockAdapter,
				currentAccount: mockAccount,
				onOptimisticUpdate,
			});

			expect(handlers).toBeDefined();
		});
	});

	describe('Edge Cases', () => {
		it('should handle null/undefined content warning', () => {
			const status = createOptimisticStatus({
				content: 'Test',
				contentWarning: undefined,
				visibility: 'public',
				account: mockAccount,
			});

			expect(status.contentWarning).toBeUndefined();
		});

		it('should handle special characters in content', () => {
			const specialContent = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
			const status = createOptimisticStatus({
				content: specialContent,
				visibility: 'public',
				account: mockAccount,
			});

			expect(status.content).toBe(specialContent);
		});

		it('should handle newlines in content', () => {
			const multilineContent = 'Line 1\nLine 2\nLine 3';
			const status = createOptimisticStatus({
				content: multilineContent,
				visibility: 'public',
				account: mockAccount,
			});

			expect(status.content).toBe(multilineContent);
		});

		it('should handle RTL text', () => {
			const rtlContent = 'مرحبا بك';
			const status = createOptimisticStatus({
				content: rtlContent,
				visibility: 'public',
				account: mockAccount,
			});

			expect(status.content).toBe(rtlContent);
		});

		it('should handle mixed LTR and RTL', () => {
			const mixedContent = 'Hello مرحبا World';
			const status = createOptimisticStatus({
				content: mixedContent,
				visibility: 'public',
				account: mockAccount,
			});

			expect(status.content).toBe(mixedContent);
		});
	});
});
