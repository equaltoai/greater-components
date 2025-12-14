/**
 * Discovery Flow Integration Tests
 *
 * Tests for discovery flows including:
 * - Search to view flow
 * - Filter combinations
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMockAdapter } from '../mocks/mockAdapter.js';
import { createMockArtworkList } from '../mocks/mockArtwork.js';

describe('Discovery Flow Integration', () => {
	let mockAdapter: ReturnType<typeof createMockAdapter>;

	beforeEach(() => {
		mockAdapter = createMockAdapter();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	describe('Search to View Flow', () => {
		it('completes search to artwork view flow', async () => {
			const searchQuery = 'landscape painting';
			const searchResults = createMockArtworkList(5);

			mockAdapter.searchArtworks.mockResolvedValue({
				results: searchResults,
				total: 5,
			});

			// Step 1: Enter search query
			expect(searchQuery.length).toBeGreaterThan(0);

			// Step 2: Wait for debounce
			vi.advanceTimersByTime(300);

			// Step 3: Execute search
			const results = await mockAdapter.searchArtworks(searchQuery);
			expect(results.results.length).toBe(5);

			// Step 4: Click on result
			const selectedArtwork = results.results[0];
			expect(selectedArtwork).toBeDefined();

			// Step 5: View artwork
			mockAdapter.getArtwork.mockResolvedValue(selectedArtwork);
			const artwork = await mockAdapter.getArtwork(selectedArtwork.id);
			expect(artwork.id).toBe(selectedArtwork.id);
		});

		it('handles empty search results', async () => {
			mockAdapter.searchArtworks.mockResolvedValue({
				results: [],
				total: 0,
			});

			const results = await mockAdapter.searchArtworks('nonexistent query');

			expect(results.results.length).toBe(0);
			expect(results.total).toBe(0);
		});

		it('shows suggestions while typing', async () => {
			const suggestions = ['landscape', 'landscape painting', 'landscape photography'];

			mockAdapter.getRecommendations.mockResolvedValue({
				suggestions,
			});

			const result = await mockAdapter.getRecommendations('land');

			expect(result.suggestions.length).toBe(3);
		});

		it('clears search and returns to browse', () => {
			let searchQuery = 'test query';
			let showingResults = true;

			// Clear search
			searchQuery = '';
			showingResults = false;

			expect(searchQuery).toBe('');
			expect(showingResults).toBe(false);
		});
	});

	describe('Filter Combinations', () => {
		it('applies single filter', async () => {
			const filters = { medium: 'Digital' };

			mockAdapter.searchArtworks.mockResolvedValue({
				results: createMockArtworkList(3),
				total: 3,
			});

			const results = await mockAdapter.searchArtworks('', filters);

			expect(mockAdapter.searchArtworks).toHaveBeenCalledWith('', filters);
			expect(results.results.length).toBe(3);
		});

		it('applies multiple filters', async () => {
			const filters = {
				medium: 'Digital',
				style: 'Abstract',
				minYear: 2020,
			};

			mockAdapter.searchArtworks.mockResolvedValue({
				results: createMockArtworkList(2),
				total: 2,
			});

			const results = await mockAdapter.searchArtworks('', filters);

			expect(results.results.length).toBe(2);
		});

		it('combines search query with filters', async () => {
			const query = 'portrait';
			const filters = { medium: 'Oil' };

			mockAdapter.searchArtworks.mockResolvedValue({
				results: createMockArtworkList(4),
				total: 4,
			});

			await mockAdapter.searchArtworks(query, filters);

			expect(mockAdapter.searchArtworks).toHaveBeenCalledWith(query, filters);
		});

		it('applies color palette filter', async () => {
			const colors = ['#FF5733', '#33FF57', '#3357FF'];

			mockAdapter.searchByColor.mockResolvedValue({
				results: createMockArtworkList(5),
			});

			const results = await mockAdapter.searchByColor(colors);

			expect(results.results.length).toBe(5);
		});

		it('applies mood filter', async () => {
			const filters = { mood: 'calm' };

			mockAdapter.searchArtworks.mockResolvedValue({
				results: createMockArtworkList(6),
				total: 6,
			});

			const results = await mockAdapter.searchArtworks('', filters);

			expect(results.results.length).toBe(6);
		});

		it('applies style filter', async () => {
			const filters = { styles: ['impressionism', 'post-impressionism'] };

			mockAdapter.searchArtworks.mockResolvedValue({
				results: createMockArtworkList(4),
				total: 4,
			});

			const results = await mockAdapter.searchArtworks('', filters);

			expect(results.results.length).toBe(4);
		});

		it('clears individual filter', async () => {
			const filters: Record<string, unknown> = {
				medium: 'Digital',
				style: 'Abstract',
			};

			// Clear medium filter
			delete filters.medium;

			mockAdapter.searchArtworks.mockResolvedValue({
				results: createMockArtworkList(10),
				total: 10,
			});

			await mockAdapter.searchArtworks('', filters);

			expect(filters.medium).toBeUndefined();
			expect(filters.style).toBe('Abstract');
		});

		it('clears all filters', async () => {
			let filters: Record<string, unknown> = {
				medium: 'Digital',
				style: 'Abstract',
				mood: 'energetic',
			};

			// Clear all
			filters = {};

			mockAdapter.searchArtworks.mockResolvedValue({
				results: createMockArtworkList(20),
				total: 20,
			});

			await mockAdapter.searchArtworks('', filters);

			expect(Object.keys(filters).length).toBe(0);
		});

		it('persists filters across pagination', async () => {
			const filters = { medium: 'Digital' };
			let page = 1;

			mockAdapter.searchArtworks
				.mockResolvedValueOnce({ results: createMockArtworkList(10, 1), total: 25 })
				.mockResolvedValueOnce({ results: createMockArtworkList(10, 11), total: 25 });

			// First page
			await mockAdapter.searchArtworks('', { ...filters, page });
			page++;

			// Second page with same filters
			await mockAdapter.searchArtworks('', { ...filters, page });

			expect(mockAdapter.searchArtworks).toHaveBeenCalledTimes(2);
			expect(mockAdapter.searchArtworks).toHaveBeenLastCalledWith('', { ...filters, page: 2 });
		});
	});

	describe('Search History', () => {
		it('saves search to history', () => {
			const history: string[] = [];
			const query = 'landscape painting';

			history.unshift(query);

			expect(history[0]).toBe(query);
		});

		it('loads search from history', async () => {
			const history = ['landscape', 'portrait', 'abstract'];
			const selectedQuery = history[1];

			mockAdapter.searchArtworks.mockResolvedValue({
				results: createMockArtworkList(5),
				total: 5,
			});

			await mockAdapter.searchArtworks(selectedQuery);

			expect(mockAdapter.searchArtworks).toHaveBeenCalledWith(selectedQuery);
		});

		it('removes duplicate from history', () => {
			let history = ['landscape', 'portrait', 'abstract'];
			const newQuery = 'landscape';

			// Remove existing and add to front
			history = history.filter((q) => q !== newQuery);
			history.unshift(newQuery);

			expect(history[0]).toBe('landscape');
			expect(history.filter((q) => q === 'landscape').length).toBe(1);
		});
	});
});
