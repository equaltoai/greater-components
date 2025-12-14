
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createGalleryPattern,
  getLayoutDisplayName,
  getLayoutIcon,
  getSortDisplayName,
} from '../../src/patterns/gallery.js';
import { createMockArtworkList } from '../mocks/mockArtwork.js';

describe('Gallery Pattern', () => {
  const mockItems = createMockArtworkList(10);

  describe('Factory & State', () => {
    it('initializes with default state', () => {
      const pattern = createGalleryPattern({
        items: mockItems as any,
        layout: 'grid',
        enableFilters: true,
        enableSort: true,
        onArtworkClick: vi.fn(),
      });

      expect(pattern.state.items).toHaveLength(10);
      expect(pattern.state.layout).toBe('grid');
      expect(pattern.state.sortOption).toBe('newest');
    });
  });

  describe('Layout', () => {
    it('updates layout and triggers handler', () => {
      const onLayoutChange = vi.fn();
      const pattern = createGalleryPattern(
        { items: [], layout: 'grid', enableFilters: true, enableSort: true, onArtworkClick: vi.fn() },
        { onLayoutChange }
      );

      pattern.state.setLayout('masonry');
      expect(pattern.state.layout).toBe('masonry');
      expect(onLayoutChange).toHaveBeenCalledWith('masonry');
    });
  });

  describe('Sorting', () => {
    it('updates sort option and sorts items', () => {
      const items = createMockArtworkList(2);
      // Date order: items[0] is older, items[1] is newer
      items[0].createdAt = new Date('2023-01-01').toISOString();
      items[1].createdAt = new Date('2024-01-01').toISOString();

      const pattern = createGalleryPattern({
        items: items as any,
        layout: 'grid',
        enableFilters: true,
        enableSort: true,
        onArtworkClick: vi.fn(),
      });

      // Trigger sort
      pattern.state.setSort('newest');

      // Default is newest
      expect(pattern.state.items[0].id).toBe(items[1].id);

      pattern.state.setSort('oldest');
      expect(pattern.state.sortOption).toBe('oldest');
      expect(pattern.state.items[0].id).toBe(items[0].id);
    });
  });

  describe('Filtering', () => {
    it('filters items by query', () => {
      const items = createMockArtworkList(2);
      items[0].title = 'Sunset';
      items[1].title = 'Mountain';

      const pattern = createGalleryPattern({
        items: items as any,
        layout: 'grid',
        enableFilters: true,
        enableSort: true,
        onArtworkClick: vi.fn(),
      });

      pattern.state.setFilters({ query: 'sun' });
      expect(pattern.state.items).toHaveLength(1);
      expect(pattern.state.items[0].title).toBe('Sunset');
    });

    it('clears filters', () => {
      const items = createMockArtworkList(2);
      const pattern = createGalleryPattern({
        items: items as any,
        layout: 'grid',
        enableFilters: true,
        enableSort: true,
        onArtworkClick: vi.fn(),
      });

      pattern.state.setFilters({ query: 'none' });
      expect(pattern.state.items).toHaveLength(0);

      pattern.state.clearFilters();
      expect(pattern.state.items).toHaveLength(2);
    });
  });

  describe('Viewer', () => {
    it('opens viewer at correct index', () => {
      const onOpenViewer = vi.fn();
      const pattern = createGalleryPattern(
        { items: mockItems as any, layout: 'grid', enableFilters: true, enableSort: true, onArtworkClick: vi.fn() },
        { onOpenViewer }
      );

      pattern.state.openViewer(mockItems[2] as any);
      expect(pattern.state.viewerState.isOpen).toBe(true);
      expect(pattern.state.viewerState.currentIndex).toBe(2);
      expect(onOpenViewer).toHaveBeenCalledWith(mockItems[2], 2);
    });

    it('navigates viewer', () => {
      const pattern = createGalleryPattern({
        items: mockItems as any,
        layout: 'grid',
        enableFilters: true,
        enableSort: true,
        onArtworkClick: vi.fn(),
      });

      pattern.state.openViewer(mockItems[0] as any);
      pattern.state.navigateViewer('next');
      expect(pattern.state.viewerState.currentIndex).toBe(1);

      pattern.state.navigateViewer('prev');
      expect(pattern.state.viewerState.currentIndex).toBe(0);
    });

    it('closes viewer', () => {
      const pattern = createGalleryPattern({
        items: mockItems as any,
        layout: 'grid',
        enableFilters: true,
        enableSort: true,
        onArtworkClick: vi.fn(),
      });

      pattern.state.openViewer(mockItems[0] as any);
      pattern.state.closeViewer();
      expect(pattern.state.viewerState.isOpen).toBe(false);
    });
  });

  describe('Infinite Scroll', () => {
    it('loads more items', async () => {
      const newItems = createMockArtworkList(5, 11);
      const onLoadMore = vi.fn().mockResolvedValue(newItems);
      
      const pattern = createGalleryPattern(
        { 
          items: mockItems as any, 
          layout: 'grid', 
          enableFilters: true, 
          enableSort: true, 
          onArtworkClick: vi.fn(),
          enableInfiniteScroll: true 
        },
        { onLoadMore }
      );

      await pattern.state.loadMore();
      
      expect(pattern.state.allItems).toHaveLength(15);
      expect(pattern.state.infiniteScrollState.page).toBe(2);
    });

    it('handles load more error', async () => {
      const error = new Error('fail');
      const onLoadMore = vi.fn().mockRejectedValue(error);
      
      const pattern = createGalleryPattern(
        { 
          items: mockItems as any, 
          layout: 'grid', 
          enableFilters: true, 
          enableSort: true, 
          onArtworkClick: vi.fn(),
          enableInfiniteScroll: true 
        },
        { onLoadMore }
      );

      await pattern.state.loadMore();
      
      expect(pattern.state.loadingState.state).toBe('error');
    });
  });

  describe('Helpers', () => {
    it('returns display names and icons', () => {
      expect(getLayoutDisplayName('grid')).toBe('Grid');
      expect(getLayoutIcon('grid')).toBe('⊞');
      expect(getSortDisplayName('newest')).toBe('Newest First');
    });
  });
});
