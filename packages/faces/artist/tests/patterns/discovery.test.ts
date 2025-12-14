
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createDiscoveryPattern,
  getLayoutDisplayName,
  formatResultCount,
  getFilterSummary,
} from '../../src/patterns/discovery.js';

describe('Discovery Pattern', () => {
  describe('Factory & State', () => {
    it('initializes with default state', () => {
      const { state } = createDiscoveryPattern({
        initialQuery: '',
        layout: 'full',
        onSelect: vi.fn(),
      });

      expect(state.filters.query).toBe('');
      expect(state.results).toEqual([]);
      expect(state.searchState.state).toBe('idle');
    });

    it('initializes with config overrides', () => {
      const { state } = createDiscoveryPattern({
        initialQuery: 'test',
        initialFilters: { styles: ['modern'] },
        layout: 'sidebar',
        onSelect: vi.fn(),
      });

      expect(state.filters.query).toBe('test');
      expect(state.filters.styles).toEqual(['modern']);
    });
  });

  describe('LocalStorage Persistence', () => {
    let getItemSpy: any;
    let setItemSpy: any;

    beforeEach(() => {
      getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
      setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      localStorage.clear();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('loads recent searches from storage', () => {
      getItemSpy.mockReturnValue(JSON.stringify(['term1', 'term2']));
      
      const { state } = createDiscoveryPattern({
        layout: 'full',
        onSelect: vi.fn(),
        enableRecentSearches: true,
      });

      expect(state.recentSearches).toEqual(['term1', 'term2']);
    });

    it('handles corrupted storage gracefully', () => {
      getItemSpy.mockReturnValue('invalid json');
      
      const { state } = createDiscoveryPattern({
        layout: 'full',
        onSelect: vi.fn(),
        enableRecentSearches: true,
      });

      expect(state.recentSearches).toEqual([]);
    });

    it('saves recent searches on search success', async () => {
      const { state } = createDiscoveryPattern({
        layout: 'full',
        onSelect: vi.fn(),
        enableRecentSearches: true,
      });

      // Mock search handler
      const handlers = {
        onSearch: vi.fn().mockResolvedValue([]),
      };

      // We need to re-create to inject handlers because factory composes them
      const instance = createDiscoveryPattern({
          layout: 'full',
          onSelect: vi.fn(),
          enableRecentSearches: true,
      }, handlers);

      instance.state.filters.query = 'new term';
      await instance.state.search();

      expect(setItemSpy).toHaveBeenCalledWith(
        'discovery-recent-searches',
        expect.stringContaining('new term')
      );
    });
  });

  describe('Search Operations', () => {
    it('handles search success', async () => {
      const onSearch = vi.fn().mockResolvedValue([{ id: '1' }]);
      const pattern = createDiscoveryPattern(
        { layout: 'full', onSelect: vi.fn() },
        { onSearch }
      );

      await pattern.state.search({ query: 'art' });

      expect(pattern.state.searchState.state).toBe('success');
      expect(pattern.state.results).toHaveLength(1);
      expect(pattern.state.totalResults).toBe(1);
    });

    it('handles search error', async () => {
      const error = new Error('fail');
      const onSearch = vi.fn().mockRejectedValue(error);
      const pattern = createDiscoveryPattern(
        { layout: 'full', onSelect: vi.fn() },
        { onSearch }
      );

      await expect(pattern.state.search()).rejects.toThrow('fail');
      expect(pattern.state.searchState.state).toBe('error');
      expect(pattern.state.searchState.error).toBe(error);
    });
  });

  describe('Debounced Update', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('debounces updateQuery', async () => {
      const onSearch = vi.fn().mockResolvedValue([]);
      const pattern = createDiscoveryPattern(
        { layout: 'full', onSelect: vi.fn() },
        { onSearch }
      );

      pattern.state.updateQuery('a');
      pattern.state.updateQuery('ab');
      pattern.state.updateQuery('abc');

      expect(onSearch).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);
      
      // Should run once with final value
      expect(pattern.state.filters.query).toBe('abc');
      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledWith(expect.objectContaining({ query: 'abc' }));
    });
  });

  describe('Filter Operations', () => {
    it('updateFilters merges filters and triggers search', () => {
      const onFilterChange = vi.fn();
      const onSearch = vi.fn().mockResolvedValue([]);
      
      const pattern = createDiscoveryPattern(
        { layout: 'full', onSelect: vi.fn() },
        { onFilterChange, onSearch }
      );

      pattern.state.updateFilters({ styles: ['pop'] });

      expect(pattern.state.filters.styles).toEqual(['pop']);
      expect(onFilterChange).toHaveBeenCalled();
      expect(onSearch).toHaveBeenCalled();
    });

    it('clearFilters keeps query but resets others', () => {
      const pattern = createDiscoveryPattern({
        initialQuery: 'keep me',
        initialFilters: { styles: ['drop me'] },
        layout: 'full',
        onSelect: vi.fn(),
      });

      pattern.state.clearFilters();
      
      expect(pattern.state.filters.query).toBe('keep me');
      expect(pattern.state.filters.styles).toBeUndefined();
    });

    it('clearAll resets everything', () => {
      const pattern = createDiscoveryPattern({
        initialQuery: 'drop me',
        initialFilters: { styles: ['drop me'] },
        layout: 'full',
        onSelect: vi.fn(),
      });

      pattern.state.clearAll();

      expect(pattern.state.filters).toEqual({});
    });

    it('calculates active filter count correctly', () => {
      const pattern = createDiscoveryPattern({
        layout: 'full',
        onSelect: vi.fn(),
      });

      expect(pattern.state.getActiveFilterCount()).toBe(0);
      expect(pattern.state.hasActiveFilters()).toBe(false);

      pattern.state.filters.styles = ['one'];
      expect(pattern.state.getActiveFilterCount()).toBe(1);

      pattern.state.filters.priceRange = { min: 10 };
      expect(pattern.state.getActiveFilterCount()).toBe(2);
      expect(pattern.state.hasActiveFilters()).toBe(true);
    });
  });

  describe('Helpers', () => {
    it('getLayoutDisplayName returns readable name', () => {
      expect(getLayoutDisplayName('full')).toBe('Full Page');
      expect(getLayoutDisplayName('sidebar')).toBe('Sidebar');
      expect(getLayoutDisplayName('modal')).toBe('Modal');
    });

    it('formatResultCount formats numbers', () => {
      expect(formatResultCount(0)).toBe('No results');
      expect(formatResultCount(1)).toBe('1 result');
      expect(formatResultCount(50)).toBe('50 results');
      expect(formatResultCount(1500)).toBe('1.5k results');
    });

    it('getFilterSummary summarizes active filters', () => {
      expect(getFilterSummary({})).toBe('All artworks');
      expect(getFilterSummary({ query: 'cat' })).toBe('"cat"');
      expect(getFilterSummary({ styles: ['a', 'b'] })).toBe('2 styles');
      expect(getFilterSummary({ query: 'cat', forSaleOnly: true })).toBe('"cat", for sale');
    });
  });
});
