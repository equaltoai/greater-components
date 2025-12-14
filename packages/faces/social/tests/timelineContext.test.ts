/**
 * Timeline Context Tests
 *
 * Tests for the Timeline context module including context creation,
 * configuration handling, and state management.
 */

import { describe, it, expect, vi } from 'vitest';
import {
	createTimelineContext,
	type TimelineCompoundConfig,
	type TimelineHandlers,
	type TimelineCompoundState,
} from '../src/components/Timeline/context';
import type { GenericTimelineItem } from '../src/generics/index';

// Mock Svelte's context functions
vi.mock('svelte', () => ({
	getContext: vi.fn(),
	setContext: vi.fn(),
}));

// Helper to create mock timeline items
function createMockItem(id: string): GenericTimelineItem {
	return {
		id,
		type: 'status',
		content: `Content for item ${id}`,
		createdAt: '2024-01-15T12:00:00Z',
		account: {
			type: 'Person',
			id: `account-${id}`,
			username: 'testuser',
			displayName: 'Test User',
			avatar: 'https://example.com/avatar.jpg',
			url: 'https://example.com/@testuser',
		},
	} as unknown as GenericTimelineItem;
}

describe('Timeline Context', () => {
	describe('createTimelineContext', () => {
		it('creates context with items', () => {
			const items = [createMockItem('1'), createMockItem('2')];
			const ctx = createTimelineContext(items);

			expect(ctx.items).toBe(items);
		});

		it('uses default configuration values', () => {
			const ctx = createTimelineContext([]);

			expect(ctx.config.mode).toBe('feed');
			expect(ctx.config.density).toBe('comfortable');
			expect(ctx.config.virtualized).toBe(true);
			expect(ctx.config.infiniteScroll).toBe(true);
			expect(ctx.config.realtime).toBe(false);
			expect(ctx.config.showLoading).toBe(true);
			expect(ctx.config.estimatedItemHeight).toBe(200);
			expect(ctx.config.overscan).toBe(5);
			expect(ctx.config.class).toBe('');
		});

		it('applies custom configuration', () => {
			const config: TimelineCompoundConfig = {
				mode: 'thread',
				density: 'compact',
				virtualized: false,
				infiniteScroll: false,
				realtime: true,
				showLoading: false,
				estimatedItemHeight: 150,
				overscan: 10,
				class: 'custom-timeline',
			};
			const ctx = createTimelineContext([], config);

			expect(ctx.config.mode).toBe('thread');
			expect(ctx.config.density).toBe('compact');
			expect(ctx.config.virtualized).toBe(false);
			expect(ctx.config.infiniteScroll).toBe(false);
			expect(ctx.config.realtime).toBe(true);
			expect(ctx.config.showLoading).toBe(false);
			expect(ctx.config.estimatedItemHeight).toBe(150);
			expect(ctx.config.overscan).toBe(10);
			expect(ctx.config.class).toBe('custom-timeline');
		});

		it('provides handlers from configuration', () => {
			const handlers: TimelineHandlers = {
				onLoadMore: vi.fn(),
				onRefresh: vi.fn(),
				onItemClick: vi.fn(),
				onScroll: vi.fn(),
			};
			const ctx = createTimelineContext([], {}, handlers);

			expect(ctx.handlers).toBe(handlers);
		});

		describe('initial state', () => {
			it('uses default initial state', () => {
				const items = [createMockItem('1')];
				const ctx = createTimelineContext(items);

				expect(ctx.state.loading).toBe(false);
				expect(ctx.state.loadingMore).toBe(false);
				expect(ctx.state.hasMore).toBe(true);
				expect(ctx.state.error).toBeNull();
				expect(ctx.state.itemCount).toBe(1);
				expect(ctx.state.scrollTop).toBe(0);
			});

			it('applies custom initial state', () => {
				const initialState: Partial<TimelineCompoundState> = {
					loading: true,
					loadingMore: true,
					hasMore: false,
					error: new Error('Initial error'),
					scrollTop: 100,
				};
				const items = [createMockItem('1'), createMockItem('2')];
				const ctx = createTimelineContext(items, {}, {}, initialState);

				expect(ctx.state.loading).toBe(true);
				expect(ctx.state.loadingMore).toBe(true);
				expect(ctx.state.hasMore).toBe(false);
				expect(ctx.state.error).toBeInstanceOf(Error);
				expect(ctx.state.error?.message).toBe('Initial error');
				expect(ctx.state.itemCount).toBe(2); // This comes from items.length, not initial state
				expect(ctx.state.scrollTop).toBe(100);
			});
		});

		describe('updateState', () => {
			it('updates state with partial values', () => {
				const ctx = createTimelineContext([]);

				ctx.updateState({ loading: true, hasMore: false });

				expect(ctx.state.loading).toBe(true);
				expect(ctx.state.hasMore).toBe(false);
				expect(ctx.state.loadingMore).toBe(false); // unchanged
			});

			it('updates error state', () => {
				const ctx = createTimelineContext([]);
				const error = new Error('Something went wrong');

				ctx.updateState({ error });

				expect(ctx.state.error).toBe(error);
			});

			it('updates scroll position', () => {
				const ctx = createTimelineContext([]);

				ctx.updateState({ scrollTop: 500 });

				expect(ctx.state.scrollTop).toBe(500);
			});

			it('clears error state', () => {
				const ctx = createTimelineContext([], {}, {}, { error: new Error('Initial') });

				ctx.updateState({ error: null });

				expect(ctx.state.error).toBeNull();
			});
		});

		describe('mode configurations', () => {
			it('supports feed mode', () => {
				const ctx = createTimelineContext([], { mode: 'feed' });
				expect(ctx.config.mode).toBe('feed');
			});

			it('supports thread mode', () => {
				const ctx = createTimelineContext([], { mode: 'thread' });
				expect(ctx.config.mode).toBe('thread');
			});

			it('supports profile mode', () => {
				const ctx = createTimelineContext([], { mode: 'profile' });
				expect(ctx.config.mode).toBe('profile');
			});

			it('supports search mode', () => {
				const ctx = createTimelineContext([], { mode: 'search' });
				expect(ctx.config.mode).toBe('search');
			});
		});

		describe('density configurations', () => {
			it('supports compact density', () => {
				const ctx = createTimelineContext([], { density: 'compact' });
				expect(ctx.config.density).toBe('compact');
			});

			it('supports comfortable density', () => {
				const ctx = createTimelineContext([], { density: 'comfortable' });
				expect(ctx.config.density).toBe('comfortable');
			});

			it('supports spacious density', () => {
				const ctx = createTimelineContext([], { density: 'spacious' });
				expect(ctx.config.density).toBe('spacious');
			});
		});

		describe('proxy reactivity', () => {
			it('state proxy allows direct property assignment', () => {
				const ctx = createTimelineContext([]);

				ctx.state.loading = true;
				ctx.state.scrollTop = 250;

				expect(ctx.state.loading).toBe(true);
				expect(ctx.state.scrollTop).toBe(250);
			});
		});
	});
});
