
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/svelte';
import MediaViewerContextWrapper from './MediaViewerContextWrapper.svelte';
import { MediaViewer } from '../../../src/components/MediaViewer/index.ts';
import { createMockArtworkList } from '../../mocks/mockArtwork.ts';

describe('MediaViewer Smoke Tests', () => {
  const mockArtworks = createMockArtworkList(3);

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Subcomponents', () => {
    const components = [
      { name: 'Navigation', Component: MediaViewer.Navigation },
      { name: 'ZoomControls', Component: MediaViewer.ZoomControls },
      { name: 'MetadataPanel', Component: MediaViewer.MetadataPanel },
    ];

    it.each(components)('renders $name without errors', ({ Component }) => {
      render(MediaViewerContextWrapper, {
        props: {
          artworks: mockArtworks as any,
          Component: Component,
          props: {},
        }
      });
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('Root', () => {
    it('renders Root without errors', () => {
      render(MediaViewer.Root, {
        props: {
          artworks: mockArtworks as any,
          currentIndex: 0,
        }
      });
      expect(console.error).not.toHaveBeenCalled();
    });
  });
});
