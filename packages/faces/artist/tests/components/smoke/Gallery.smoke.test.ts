
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { Gallery } from '../../../src/components/Gallery/index.ts';
import ArtworkCard from '../../../src/components/ArtworkCard.svelte';
import { createMockArtworkList, createMockArtwork } from '../../mocks/mockArtwork.ts';

describe('Gallery Components Smoke Tests', () => {
  const mockItems = createMockArtworkList(10);
  const mockArtwork = createMockArtwork('card-1');

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Gallery Components', () => {
    const components = [
      { name: 'Grid', Component: Gallery.Grid, props: { items: mockItems } },
      { name: 'Masonry', Component: Gallery.Masonry, props: { items: mockItems } },
      { name: 'Row', Component: Gallery.Row, props: { items: mockItems, title: 'Test Row' } },
    ];

    it.each(components)('renders $name without errors', ({ Component, props }) => {
      render(Component, { props });
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('ArtworkCard', () => {
    it('renders ArtworkCard without errors', () => {
      render(ArtworkCard, {
        props: {
          artwork: mockArtwork,
          size: 'md',
        }
      });
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(console.error).not.toHaveBeenCalled();
    });
  });
});
