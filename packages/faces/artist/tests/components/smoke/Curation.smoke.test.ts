
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/svelte';
import { CuratorSpotlight, CollectionCard } from '../../../src/components/Curation/index.ts';

describe('Curation Smoke Tests', () => {
  const mockCurator = {
    id: 'c1',
    name: 'Curator',
    avatar: 'avatar.jpg',
    bio: 'Bio',
    collections: [],
  } as any;

  const mockCollection = {
    id: 'col1',
    title: 'Collection',
    description: 'Desc',
    curator: mockCurator,
    artworks: [],
    visibility: 'public',
  } as any;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders CuratorSpotlight', () => {
    render(CuratorSpotlight, {
      props: {
        curator: mockCurator,
        collection: []
      }
    });
    expect(console.error).not.toHaveBeenCalled();
  });

  it('renders CollectionCard', () => {
    render(CollectionCard, {
      props: {
        collection: mockCollection
      }
    });
    expect(console.error).not.toHaveBeenCalled();
  });
});
