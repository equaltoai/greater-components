/**
 * Hashtags Context Tests
 *
 * Tests for the Hashtags context module including context creation
 * and state management.
 */

import { describe, it, expect, vi } from 'vitest';
import { createHashtagsContext, type HashtagsConfig } from '../src/components/Hashtags/context';

// Mock Svelte's context functions
vi.mock('svelte', () => ({
	getContext: vi.fn(),
	setContext: vi.fn(),
}));

// Create a mock adapter
function createMockAdapter() {
	return {
		getFollowedHashtags: vi.fn(),
		followHashtag: vi.fn(),
		unfollowHashtag: vi.fn(),
		getMutedTags: vi.fn(),
		muteTag: vi.fn(),
		unmuteTag: vi.fn(),
	};
}

describe('Hashtags Context', () => {
	describe('createHashtagsContext', () => {
		it('creates context with initial state', () => {
			const adapter = createMockAdapter();
			const config: HashtagsConfig = { adapter: adapter as any };
			const ctx = createHashtagsContext(config);

			expect(ctx.state.loading).toBe(false);
			expect(ctx.state.error).toBeNull();
			expect(ctx.state.refreshVersion).toBe(0);
		});

		it('provides adapter from configuration', () => {
			const adapter = createMockAdapter();
			const config: HashtagsConfig = { adapter: adapter as any };
			const ctx = createHashtagsContext(config);

			expect(ctx.config.adapter).toBe(adapter);
		});

		describe('updateState', () => {
			it('updates state with partial values', () => {
				const adapter = createMockAdapter();
				const config: HashtagsConfig = { adapter: adapter as any };
				const ctx = createHashtagsContext(config);

				ctx.updateState({ loading: true });

				expect(ctx.state.loading).toBe(true);
				expect(ctx.state.error).toBeNull();
			});

			it('updates state with error', () => {
				const adapter = createMockAdapter();
				const config: HashtagsConfig = { adapter: adapter as any };
				const ctx = createHashtagsContext(config);

				const error = new Error('Test error');
				ctx.updateState({ error });

				expect(ctx.state.error).toBe(error);
			});

			it('increments refresh version', () => {
				const adapter = createMockAdapter();
				const config: HashtagsConfig = { adapter: adapter as any };
				const ctx = createHashtagsContext(config);

				ctx.updateState({ refreshVersion: 1 });

				expect(ctx.state.refreshVersion).toBe(1);
			});

			it('preserves unchanged state values', () => {
				const adapter = createMockAdapter();
				const config: HashtagsConfig = { adapter: adapter as any };
				const ctx = createHashtagsContext(config);

				ctx.updateState({ loading: true });
				ctx.updateState({ refreshVersion: 1 });

				expect(ctx.state.loading).toBe(true);
				expect(ctx.state.refreshVersion).toBe(1);
			});
		});
	});
});
