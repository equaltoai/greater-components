
import { describe, it, expect, vi } from 'vitest';
import {
  createExhibitionPattern,
  createGalleryExhibition,
  formatExhibitionDates,
  getExhibitionStatusLabel,
} from '../../src/patterns/exhibition.js';

describe('Exhibition Pattern', () => {
  const mockArtworks = [
    { id: '1', title: 'A1' },
    { id: '2', title: 'A2' },
    { id: '3', title: 'A3' },
  ] as any;

  const mockExhibition = {
    id: 'e1',
    title: 'Exhibition',
    artworks: mockArtworks,
  } as any;

  describe('Factory & State', () => {
    it('initializes correctly', () => {
      const pattern = createExhibitionPattern({
        exhibition: mockExhibition,
        layout: 'gallery',
        showCurator: true,
        showArtists: true,
        enableNavigation: true,
      });

      expect(pattern.state.navigation.totalArtworks).toBe(3);
      expect(pattern.state.navigation.currentIndex).toBe(0);
      expect(pattern.state.navigation.canNavigate).toBe(true);
      expect(pattern.state.navigation.isFirst).toBe(true);
      expect(pattern.state.navigation.isLast).toBe(false);
    });

    it('initializes with no navigation for single artwork', () => {
      const singleExhibition = { ...mockExhibition, artworks: [mockArtworks[0]] };
      const pattern = createExhibitionPattern({
        exhibition: singleExhibition,
        layout: 'gallery',
        showCurator: true,
        showArtists: true,
        enableNavigation: true,
      });

      expect(pattern.state.navigation.canNavigate).toBe(false);
    });
  });

  describe('Navigation', () => {
    it('navigates next', () => {
      const onNavigate = vi.fn();
      const pattern = createExhibitionPattern(
        { exhibition: mockExhibition, layout: 'gallery', showCurator: true, showArtists: true, enableNavigation: true },
        { onNavigate }
      );

      pattern.state.navigateNext();
      expect(pattern.state.navigation.currentIndex).toBe(1);
      expect(pattern.state.navigation.isFirst).toBe(false);
      expect(onNavigate).toHaveBeenCalledWith(1);
    });

    it('navigates previous', () => {
      const pattern = createExhibitionPattern({
        exhibition: mockExhibition,
        layout: 'gallery',
        showCurator: true,
        showArtists: true,
        enableNavigation: true,
      });

      pattern.state.navigateToIndex(2); // Go to last
      expect(pattern.state.navigation.currentIndex).toBe(2);

      pattern.state.navigatePrevious();
      expect(pattern.state.navigation.currentIndex).toBe(1);
    });

    it('respects bounds', () => {
      const pattern = createExhibitionPattern({
        exhibition: mockExhibition,
        layout: 'gallery',
        showCurator: true,
        showArtists: true,
        enableNavigation: true,
      });

      pattern.state.navigatePrevious();
      expect(pattern.state.navigation.currentIndex).toBe(0); // Can't go below 0

      pattern.state.navigateToIndex(10);
      expect(pattern.state.navigation.currentIndex).toBe(2); // Clamped to max
    });
  });

  describe('Helpers & Factories', () => {
      it('createGalleryExhibition creates specific layout', () => {
          const pattern = createGalleryExhibition({
              exhibition: mockExhibition,
              showCurator: true,
              showArtists: true,
              enableNavigation: true,
          });
          expect(pattern.config.layout).toBe('gallery');
      });

      it('formats dates correctly', () => {
          // Use noon to avoid timezone shift to previous day
          const d1 = new Date('2023-01-01T12:00:00');
          const d2 = new Date('2023-01-31T12:00:00');
          const result = formatExhibitionDates(d1, d2);
          
          expect(result).toContain('Jan 1');
          expect(result).toContain('Jan 31');
          expect(result).toContain('2023');
          
          const resultOpen = formatExhibitionDates(d1);
          expect(resultOpen).toContain('Opens Jan 1');
      });

      it('returns status labels', () => {
          expect(getExhibitionStatusLabel('current')).toBe('Now Showing');
      });
  });
});
