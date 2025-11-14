import type { PageLoad } from './$types';
import type { DemoPageData } from '$lib/types/demo';

export const load: PageLoad = (() => ({
  metadata: {
    slug: 'search-demo',
    title: 'Search Application',
    description:
      'Unified search bar with semantic toggle, filter chips, and mixed results spanning posts, accounts, and hashtags.',
    sections: ['Search surface', 'Results', 'Recents & states']
  }
})) satisfies () => DemoPageData;
