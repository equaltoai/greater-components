import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/svelte';
import ArtistProfileContextWrapper from './ArtistProfileContextWrapper.svelte';
import ChildrenWrapper from './ChildrenWrapper.svelte';
import { ArtistProfile } from '../../../src/components/ArtistProfile/index.ts';
import type { ArtistData } from '../../../src/components/ArtistProfile/context.ts';

describe('ArtistProfile Smoke Tests', () => {
  const mockArtist: ArtistData = {
    id: 'a1',
    displayName: 'Test Artist',
    username: 'testartist',
    profileUrl: '/u/testartist',
    avatar: 'avatar.jpg',
    heroBanner: 'hero.jpg',
    statement: 'My statement',
    badges: [],
    status: 'online',
    verified: true,
    commissionStatus: 'open',
    stats: {
      followers: 100,
      following: 10,
      works: 5,
      exhibitions: 1,
      collaborations: 0,
      totalViews: 500,
    },
    sections: [],
    joinedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Subcomponents (with Context)', () => {
    const components = [
      { name: 'Avatar', Component: ArtistProfile.Avatar },
      { name: 'Name', Component: ArtistProfile.Name },
      { name: 'Badges', Component: ArtistProfile.Badges },
      { name: 'Statement', Component: ArtistProfile.Statement },
      { name: 'Stats', Component: ArtistProfile.Stats },
      { name: 'Actions', Component: ArtistProfile.Actions },
      { name: 'HeroBanner', Component: ArtistProfile.HeroBanner },
      { name: 'Timeline', Component: ArtistProfile.Timeline },
    ];

    it.each(components)('renders $name without errors', ({ Component }) => {
      render(ArtistProfileContextWrapper, {
        props: {
          artist: mockArtist,
          Component: Component,
          props: {},
        }
      });
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('Root', () => {
    it('renders Root without errors', () => {
      render(ChildrenWrapper, {
        props: {
          Component: ArtistProfile.Root,
          props: {
            artist: mockArtist,
          }
        }
      });
      expect(console.error).not.toHaveBeenCalled();
    });
  });
});