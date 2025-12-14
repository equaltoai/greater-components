/**
 * Status Context Tests
 *
 * Tests for the Status component context including context creation,
 * configuration handling, and reblog processing.
 */

import { describe, it, expect, vi } from 'vitest';
import {
	createStatusContext,
	type StatusConfig,
	type StatusActionHandlers,
} from '../src/components/Status/context';
import type { GenericStatus } from '../src/generics/index';

// Mock Svelte's context functions
vi.mock('svelte', () => ({
	getContext: vi.fn(),
	setContext: vi.fn(),
}));

// Helper function to create a mock status
function createMockStatus(overrides: Partial<GenericStatus> = {}): GenericStatus {
	return {
		id: '1',
		content: 'Test status content',
		createdAt: '2024-01-15T12:00:00Z',
		account: {
			type: 'Person',
			id: 'account-1',
			username: 'testuser',
			displayName: 'Test User',
			avatar: 'https://example.com/avatar.jpg',
			url: 'https://example.com/@testuser',
		},
		favouritesCount: 5,
		reblogsCount: 3,
		repliesCount: 2,
		favourited: false,
		reblogged: false,
		bookmarked: false,
		sensitive: false,
		spoilerText: '',
		visibility: 'public',
		mediaAttachments: [],
		mentions: [],
		tags: [],
		emojis: [],
		url: 'https://example.com/statuses/1',
		uri: 'https://example.com/statuses/1',
		...overrides,
	} as GenericStatus;
}

describe('Status Context', () => {
	describe('createStatusContext', () => {
		it('creates context with status data', () => {
			const status = createMockStatus();
			const ctx = createStatusContext(status);

			expect(ctx.status).toBe(status);
			expect(ctx.actualStatus).toBe(status);
			expect(ctx.account).toBe(status.account);
		});

		it('uses default configuration values', () => {
			const status = createMockStatus();
			const ctx = createStatusContext(status);

			expect(ctx.config.density).toBe('comfortable');
			expect(ctx.config.showActions).toBe(true);
			expect(ctx.config.clickable).toBe(false);
			expect(ctx.config.showThread).toBe(true);
			expect(ctx.config.class).toBe('');
		});

		it('applies custom configuration', () => {
			const status = createMockStatus();
			const config: StatusConfig = {
				density: 'compact',
				showActions: false,
				clickable: true,
				showThread: false,
				class: 'custom-class',
			};
			const ctx = createStatusContext(status, config);

			expect(ctx.config.density).toBe('compact');
			expect(ctx.config.showActions).toBe(false);
			expect(ctx.config.clickable).toBe(true);
			expect(ctx.config.showThread).toBe(false);
			expect(ctx.config.class).toBe('custom-class');
		});

		it('provides handlers from configuration', () => {
			const status = createMockStatus();
			const handlers: StatusActionHandlers = {
				onClick: vi.fn(),
				onReply: vi.fn(),
				onBoost: vi.fn(),
				onFavorite: vi.fn(),
			};
			const ctx = createStatusContext(status, {}, handlers);

			expect(ctx.handlers).toBe(handlers);
		});

		describe('reblog handling', () => {
			it('identifies non-reblog status', () => {
				const status = createMockStatus();
				const ctx = createStatusContext(status);

				expect(ctx.isReblog).toBe(false);
				expect(ctx.actualStatus).toBe(status);
			});

			it('identifies reblog status', () => {
				const originalStatus = createMockStatus({ id: 'original-1' });
				const reblogStatus = createMockStatus({
					id: 'reblog-1',
					reblog: originalStatus,
				});
				const ctx = createStatusContext(reblogStatus);

				expect(ctx.isReblog).toBe(true);
				expect(ctx.actualStatus).toBe(originalStatus);
			});

			it('uses reblogged status account', () => {
				const originalAccount = {
					type: 'Person' as const,
					id: 'original-account',
					username: 'originaluser',
					displayName: 'Original User',
					avatar: 'https://example.com/original-avatar.jpg',
					url: 'https://example.com/@originaluser',
				};
				const originalStatus = createMockStatus({
					id: 'original-1',
					account: originalAccount,
				});
				const reblogStatus = createMockStatus({
					id: 'reblog-1',
					reblog: originalStatus,
				});
				const ctx = createStatusContext(reblogStatus);

				expect(ctx.account).toBe(originalAccount);
			});
		});

		describe('partial configuration', () => {
			it('uses defaults for missing config values', () => {
				const status = createMockStatus();
				const config: StatusConfig = { density: 'compact' };
				const ctx = createStatusContext(status, config);

				expect(ctx.config.density).toBe('compact');
				expect(ctx.config.showActions).toBe(true); // default
				expect(ctx.config.clickable).toBe(false); // default
			});

			it('handles undefined config', () => {
				const status = createMockStatus();
				const ctx = createStatusContext(status);

				expect(ctx.config.density).toBe('comfortable');
				expect(ctx.config.showActions).toBe(true);
			});

			it('handles empty handlers', () => {
				const status = createMockStatus();
				const ctx = createStatusContext(status, {}, {});

				expect(ctx.handlers).toEqual({});
			});
		});
	});
});
