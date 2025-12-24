/**
 * Filters Context Tests
 *
 * Tests for the Filters context module including context creation,
 * state management, filter matching, and utility functions.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	createFiltersContext,
	formatExpiration,
	calculateExpiresAt,
	type ContentFilter,
	type FilterFormData,
	type FilterContext,
	type FiltersHandlers,
} from '../src/components/Filters/context';

// Mock Svelte's context functions
vi.mock('svelte', () => ({
	getContext: vi.fn(),
	setContext: vi.fn(),
}));

describe('Filters Context', () => {
	describe('createFiltersContext', () => {
		it('creates context with default state', () => {
			const ctx = createFiltersContext();

			expect(ctx.state.filters).toEqual([]);
			expect(ctx.state.selectedFilter).toBeNull();
			expect(ctx.state.loading).toBe(false);
			expect(ctx.state.saving).toBe(false);
			expect(ctx.state.error).toBeNull();
			expect(ctx.state.editorOpen).toBe(false);
			expect(ctx.state.stats).toEqual({
				totalFilters: 0,
				totalFiltered: 0,
				filteredToday: 0,
			});
		});

		it('provides handlers from configuration', () => {
			const handlers: FiltersHandlers = {
				onFetchFilters: vi.fn(),
				onCreateFilter: vi.fn(),
			};
			const ctx = createFiltersContext(handlers);

			expect(ctx.handlers).toBe(handlers);
		});

		describe('updateState', () => {
			it('updates state with partial values', () => {
				const ctx = createFiltersContext();

				ctx.updateState({ loading: true, error: 'Test error' });

				expect(ctx.state.loading).toBe(true);
				expect(ctx.state.error).toBe('Test error');
			});
		});

		describe('clearError', () => {
			it('clears the error state', () => {
				const ctx = createFiltersContext();

				ctx.updateState({ error: 'Some error' });
				ctx.clearError();

				expect(ctx.state.error).toBeNull();
			});
		});

		describe('fetchFilters', () => {
			it('populates filters from handler response', async () => {
				const mockFilters: ContentFilter[] = [
					createMockFilter({ id: '1', phrase: 'spam' }),
					createMockFilter({ id: '2', phrase: 'advertisement' }),
				];
				const onFetchFilters = vi.fn().mockResolvedValue(mockFilters);
				const ctx = createFiltersContext({ onFetchFilters });

				await ctx.fetchFilters();

				expect(ctx.state.filters).toEqual(mockFilters);
				expect(ctx.state.stats.totalFilters).toBe(2);
			});

			it('sets error state on fetch failure', async () => {
				const onFetchFilters = vi.fn().mockRejectedValue(new Error('Network error'));
				const ctx = createFiltersContext({ onFetchFilters });

				await ctx.fetchFilters();

				expect(ctx.state.error).toBe('Network error');
				expect(ctx.state.loading).toBe(false);
			});

			it('uses default error message for non-Error exceptions', async () => {
				const onFetchFilters = vi.fn().mockRejectedValue('Unknown error');
				const ctx = createFiltersContext({ onFetchFilters });

				await ctx.fetchFilters();

				expect(ctx.state.error).toBe('Failed to fetch filters');
			});

			it('handles missing handler gracefully', async () => {
				const ctx = createFiltersContext();

				await ctx.fetchFilters();

				expect(ctx.state.error).toBeNull();
				expect(ctx.state.filters).toEqual([]);
			});
		});

		describe('createFilter', () => {
			it('creates a filter and adds to state', async () => {
				const formData: FilterFormData = {
					phrase: 'test',
					context: ['home'],
					expiresIn: null,
					irreversible: false,
					wholeWord: true,
				};
				const createdFilter = createMockFilter({ id: '1', phrase: 'test' });
				const onCreateFilter = vi.fn().mockResolvedValue(createdFilter);
				const ctx = createFiltersContext({ onCreateFilter });

				ctx.openEditor();
				await ctx.createFilter(formData);

				expect(onCreateFilter).toHaveBeenCalledWith(formData);
				expect(ctx.state.filters).toContainEqual(createdFilter);
				expect(ctx.state.stats.totalFilters).toBe(1);
				expect(ctx.state.editorOpen).toBe(false);
			});

			it('sets error and throws on create failure', async () => {
				const formData: FilterFormData = {
					phrase: 'test',
					context: ['home'],
					expiresIn: null,
					irreversible: false,
					wholeWord: true,
				};
				const onCreateFilter = vi.fn().mockRejectedValue(new Error('Create failed'));
				const ctx = createFiltersContext({ onCreateFilter });

				await expect(ctx.createFilter(formData)).rejects.toThrow('Create failed');
				expect(ctx.state.error).toBe('Create failed');
				expect(ctx.state.saving).toBe(false);
			});
		});

		describe('updateFilter', () => {
			it('updates a filter in state', async () => {
				const originalFilter = createMockFilter({ id: '1', phrase: 'original' });
				const updatedFilter = createMockFilter({ id: '1', phrase: 'updated' });
				const onUpdateFilter = vi.fn().mockResolvedValue(updatedFilter);
				const ctx = createFiltersContext({ onUpdateFilter });

				ctx.updateState({ filters: [originalFilter], selectedFilter: originalFilter });

				await ctx.updateFilter('1', { phrase: 'updated' });

				expect(onUpdateFilter).toHaveBeenCalledWith('1', { phrase: 'updated' });
				expect(ctx.state.filters[0]).toEqual(updatedFilter);
				expect(ctx.state.editorOpen).toBe(false);
				expect(ctx.state.selectedFilter).toBeNull();
			});

			it('throws on update failure', async () => {
				const onUpdateFilter = vi.fn().mockRejectedValue(new Error('Update failed'));
				const ctx = createFiltersContext({ onUpdateFilter });

				await expect(ctx.updateFilter('1', { phrase: 'test' })).rejects.toThrow('Update failed');
				expect(ctx.state.error).toBe('Update failed');
			});
		});

		describe('deleteFilter', () => {
			it('removes filter from state', async () => {
				const filter1 = createMockFilter({ id: '1', phrase: 'filter1' });
				const filter2 = createMockFilter({ id: '2', phrase: 'filter2' });
				const onDeleteFilter = vi.fn().mockResolvedValue(undefined);
				const ctx = createFiltersContext({ onDeleteFilter });

				ctx.updateState({ filters: [filter1, filter2] });

				await ctx.deleteFilter('1');

				expect(onDeleteFilter).toHaveBeenCalledWith('1');
				expect(ctx.state.filters).toEqual([filter2]);
				expect(ctx.state.stats.totalFilters).toBe(1);
			});

			it('throws on delete failure', async () => {
				const onDeleteFilter = vi.fn().mockRejectedValue(new Error('Delete failed'));
				const ctx = createFiltersContext({ onDeleteFilter });

				await expect(ctx.deleteFilter('1')).rejects.toThrow('Delete failed');
				expect(ctx.state.error).toBe('Delete failed');
			});
		});

		describe('checkFilters', () => {
			it('matches filter in correct context', () => {
				const filter = createMockFilter({
					id: '1',
					phrase: 'spam',
					context: ['home', 'notifications'],
					wholeWord: false,
				});
				const ctx = createFiltersContext();
				ctx.updateState({ filters: [filter] });

				const matches = ctx.checkFilters('This is spam content', 'home');

				expect(matches).toContainEqual(filter);
			});

			it('does not match filter in wrong context', () => {
				const filter = createMockFilter({
					id: '1',
					phrase: 'spam',
					context: ['home'],
					wholeWord: false,
				});
				const ctx = createFiltersContext();
				ctx.updateState({ filters: [filter] });

				const matches = ctx.checkFilters('This is spam content', 'public');

				expect(matches).toEqual([]);
			});

			it('does not match expired filter', () => {
				const pastDate = new Date(Date.now() - 3600000).toISOString(); // 1 hour ago
				const filter = createMockFilter({
					id: '1',
					phrase: 'spam',
					context: ['home'],
					expiresAt: pastDate,
				});
				const ctx = createFiltersContext();
				ctx.updateState({ filters: [filter] });

				const matches = ctx.checkFilters('This is spam content', 'home');

				expect(matches).toEqual([]);
			});

			it('matches non-expired filter', () => {
				const futureDate = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
				const filter = createMockFilter({
					id: '1',
					phrase: 'spam',
					context: ['home'],
					expiresAt: futureDate,
				});
				const ctx = createFiltersContext();
				ctx.updateState({ filters: [filter] });

				const matches = ctx.checkFilters('This is spam content', 'home');

				expect(matches).toContainEqual(filter);
			});

			it('matches case-insensitively', () => {
				const filter = createMockFilter({
					id: '1',
					phrase: 'SPAM',
					context: ['home'],
					wholeWord: false,
				});
				const ctx = createFiltersContext();
				ctx.updateState({ filters: [filter] });

				const matches = ctx.checkFilters('this is spam content', 'home');

				expect(matches).toContainEqual(filter);
			});

			it('matches whole word only when configured', () => {
				const filter = createMockFilter({
					id: '1',
					phrase: 'spam',
					context: ['home'],
					wholeWord: true,
				});
				const ctx = createFiltersContext();
				ctx.updateState({ filters: [filter] });

				// Should match
				expect(ctx.checkFilters('This is spam content', 'home')).toHaveLength(1);

				// Should not match (part of a word)
				expect(ctx.checkFilters('This is spammer content', 'home')).toHaveLength(0);
			});

			it('matches partial word when whole word is false', () => {
				const filter = createMockFilter({
					id: '1',
					phrase: 'spam',
					context: ['home'],
					wholeWord: false,
				});
				const ctx = createFiltersContext();
				ctx.updateState({ filters: [filter] });

				expect(ctx.checkFilters('This is spammer content', 'home')).toHaveLength(1);
			});

			it('returns multiple matching filters', () => {
				const filter1 = createMockFilter({
					id: '1',
					phrase: 'spam',
					context: ['home'],
					wholeWord: false,
				});
				const filter2 = createMockFilter({
					id: '2',
					phrase: 'test',
					context: ['home'],
					wholeWord: false,
				});
				const ctx = createFiltersContext();
				ctx.updateState({ filters: [filter1, filter2] });

				const matches = ctx.checkFilters('spam and test content', 'home');

				expect(matches).toHaveLength(2);
			});
		});

		describe('openEditor / closeEditor', () => {
			it('opens editor for new filter', () => {
				const ctx = createFiltersContext();

				ctx.openEditor();

				expect(ctx.state.editorOpen).toBe(true);
				expect(ctx.state.selectedFilter).toBeNull();
				expect(ctx.state.error).toBeNull();
			});

			it('opens editor for existing filter', () => {
				const filter = createMockFilter({ id: '1', phrase: 'test' });
				const ctx = createFiltersContext();

				ctx.openEditor(filter);

				expect(ctx.state.editorOpen).toBe(true);
				expect(ctx.state.selectedFilter).toEqual(filter);
			});

			it('closes editor and clears state', () => {
				const filter = createMockFilter({ id: '1', phrase: 'test' });
				const ctx = createFiltersContext();

				ctx.openEditor(filter);
				ctx.updateState({ error: 'Some error' });
				ctx.closeEditor();

				expect(ctx.state.editorOpen).toBe(false);
				expect(ctx.state.selectedFilter).toBeNull();
				expect(ctx.state.error).toBeNull();
			});
		});
	});

	describe('formatExpiration', () => {
		beforeEach(() => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2024-06-15T12:00:00Z'));
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it('returns "Never" for null expiration', () => {
			expect(formatExpiration(null)).toBe('Never');
		});

		it('returns "Expired" for past date', () => {
			const pastDate = new Date('2024-06-15T11:00:00Z').toISOString(); // 1 hour ago
			expect(formatExpiration(pastDate)).toBe('Expired');
		});

		it('formats days correctly', () => {
			const twoDaysLater = new Date('2024-06-17T12:00:00Z').toISOString();
			expect(formatExpiration(twoDaysLater)).toBe('2 days');
		});

		it('formats single day correctly', () => {
			const oneDayLater = new Date('2024-06-16T12:00:00Z').toISOString();
			expect(formatExpiration(oneDayLater)).toBe('1 day');
		});

		it('formats hours correctly when less than a day', () => {
			const fiveHoursLater = new Date('2024-06-15T17:00:00Z').toISOString();
			expect(formatExpiration(fiveHoursLater)).toBe('5 hours');
		});

		it('formats single hour correctly', () => {
			const oneHourLater = new Date('2024-06-15T13:00:00Z').toISOString();
			expect(formatExpiration(oneHourLater)).toBe('1 hour');
		});

		it('returns "Less than 1 hour" for very short times', () => {
			const thirtyMinutesLater = new Date('2024-06-15T12:30:00Z').toISOString();
			expect(formatExpiration(thirtyMinutesLater)).toBe('Less than 1 hour');
		});
	});

	describe('calculateExpiresAt', () => {
		beforeEach(() => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2024-06-15T12:00:00Z'));
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it('returns null for null input', () => {
			expect(calculateExpiresAt(null)).toBeNull();
		});

		it('returns null for zero input', () => {
			expect(calculateExpiresAt(0)).toBeNull();
		});

		it('calculates expiration from seconds', () => {
			const result = calculateExpiresAt(3600); // 1 hour

			expect(result).toBe(new Date('2024-06-15T13:00:00Z').toISOString());
		});

		it('calculates expiration for longer durations', () => {
			const result = calculateExpiresAt(86400); // 24 hours

			expect(result).toBe(new Date('2024-06-16T12:00:00Z').toISOString());
		});
	});
});

// Helper function to create mock filters
function createMockFilter(overrides: Partial<ContentFilter> = {}): ContentFilter {
	return {
		id: '1',
		phrase: 'test',
		context: ['home'] as FilterContext[],
		expiresAt: null,
		irreversible: false,
		wholeWord: false,
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
		...overrides,
	};
}
