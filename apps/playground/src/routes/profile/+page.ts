import type { PageLoad } from './$types';
import type { DemoPageData } from '$lib/types/demo';

export const load: PageLoad = (() => ({
  metadata: {
    slug: 'profile-demo',
    title: 'Profile Application',
    description:
      'Profile header, pinned posts, media gallery, and optimistic follow panels stitched together with the published Greater components.',
    sections: ['Profile header', 'Pinned posts & tabs', 'Followers & media']
  }
})) satisfies () => DemoPageData;
