
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { MediaViewer } from '../../../src/components/MediaViewer/index.ts';
import { createMockArtworkList } from '../../mocks/mockArtwork.ts';

describe('MediaViewer Behavior', () => {
  const mockArtworks = createMockArtworkList(3);

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Navigation & Interactions', () => {
    it('closes on Escape key', async () => {
      const onClose = vi.fn();
      render(MediaViewer.Root, {
        props: {
          artworks: mockArtworks as any,
          currentIndex: 0,
          handlers: { onClose }
        }
      });

      await fireEvent.keyDown(window, { key: 'Escape' });
      expect(onClose).toHaveBeenCalled();
    });

    it('navigates with arrow keys', async () => {
      const onNavigate = vi.fn();
      render(MediaViewer.Root, {
        props: {
          artworks: mockArtworks as any,
          currentIndex: 0,
          handlers: { onNavigate }
        }
      });

      await fireEvent.keyDown(window, { key: 'ArrowRight' });
      // Component calls handlers.onNavigate(nextIndex) but handles state via context.
      // Since context is created inside Root, we rely on the handler being called.
      expect(onNavigate).toHaveBeenCalledWith(1);

      await fireEvent.keyDown(window, { key: 'ArrowLeft' });
      // Should go back to 0
      expect(onNavigate).toHaveBeenCalledWith(0);
    });

    it('has dialog role for focus trap', () => {
      render(MediaViewer.Root, {
        props: {
          artworks: mockArtworks as any,
          currentIndex: 0
        }
      });
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });
  });
});
