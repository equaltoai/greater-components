
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/svelte';
import ExhibitionContextWrapper from './ExhibitionContextWrapper.svelte';
import ChildrenWrapper from './ChildrenWrapper.svelte';
import { Exhibition } from '../../../src/components/Exhibition/index.ts';
import type { ExhibitionData } from '../../../src/types/curation.js';

describe('Exhibition Smoke Tests', () => {
  const mockExhibition: ExhibitionData = {
    id: 'e1',
    title: 'Exhibition',
    slug: 'exhibition',
    description: 'Desc',
    curator: { id: 'c1', name: 'Curator', avatar: '' },
    artworks: [],
    artists: [],
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    coverImage: '',
    status: 'current',
    tags: [],
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
      { name: 'Banner', Component: Exhibition.Banner },
      { name: 'Statement', Component: Exhibition.Statement },
      { name: 'Artists', Component: Exhibition.Artists },
      { name: 'Gallery', Component: Exhibition.Gallery },
      { name: 'Navigation', Component: Exhibition.Navigation },
    ];

    it.each(components)('renders $name without errors', ({ Component }) => {
      render(ExhibitionContextWrapper, {
        props: {
          exhibition: mockExhibition,
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
          Component: Exhibition.Root,
          props: {
            exhibition: mockExhibition,
          }
        }
      });
      expect(console.error).not.toHaveBeenCalled();
    });
  });
});
