
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/svelte';
import ArtistBadge from '../../../src/components/ArtistBadge.svelte';
import ArtistTimeline from '../../../src/components/ArtistTimeline.svelte';
import PortfolioSection from '../../../src/components/PortfolioSection.svelte';
import { createMockArtist } from '../../mocks/mockArtist.ts';

describe('Top Level Components Smoke Tests', () => {
  const mockArtist = createMockArtist('tl1');

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders ArtistBadge', () => {
    render(ArtistBadge, {
      props: {
        type: 'verified',
        size: 'md'
      }
    });
    expect(console.error).not.toHaveBeenCalled();
  });

  it('renders ArtistTimeline', () => {
    render(ArtistTimeline, {
      props: {
        artist: mockArtist as any,
        items: []
      }
    });
    expect(console.error).not.toHaveBeenCalled();
  });

  it('renders PortfolioSection', () => {
    render(PortfolioSection, {
      props: {
        section: { id: 's1', title: 'Sec', type: 'gallery', items: [], visible: true, order: 0 } as any
      }
    });
    expect(console.error).not.toHaveBeenCalled();
  });
});
