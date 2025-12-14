import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/svelte';
import DiscoveryContextWrapper from './DiscoveryContextWrapper.svelte';
import ChildrenWrapper from './ChildrenWrapper.svelte';
import { DiscoveryEngine } from '../../../src/components/Discovery/index.ts';
import { createDiscoveryStore } from '../../../src/stores/discoveryStore.ts';

describe('Discovery Smoke Tests', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Subcomponents (with Context)', () => {
    const components = [
      { name: 'SearchBar', Component: DiscoveryEngine.SearchBar },
      { name: 'Filters', Component: DiscoveryEngine.Filters },
      { name: 'Results', Component: DiscoveryEngine.Results },
      { name: 'Suggestions', Component: DiscoveryEngine.Suggestions },
      { name: 'ColorPaletteSearch', Component: DiscoveryEngine.ColorPaletteSearch },
      { name: 'StyleFilter', Component: DiscoveryEngine.StyleFilter },
      { name: 'MoodMap', Component: DiscoveryEngine.MoodMap },
    ];

    it.each(components)('renders $name without errors', ({ Component }) => {
      render(DiscoveryContextWrapper, {
        props: {
          Component: Component,
          props: {},
        }
      });
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('Root', () => {
    it('renders Root without errors', () => {
      const store = createDiscoveryStore();
      render(ChildrenWrapper, {
        props: {
          Component: DiscoveryEngine.Root,
          props: {
            store,
          }
        }
      });
      expect(console.error).not.toHaveBeenCalled();
    });
  });
});