import type { PageLoad } from './$types';
import type { DemoPageData } from '$lib/types/demo';

export const load: PageLoad = (() => ({
  metadata: {
    slug: 'interactive-demo',
    title: 'Interactive Components Demo',
    description: 'Menus, context menus, and theming utilities wired to the published primitives package.',
    sections: [
      'Menus & context menus',
      'Theme switcher variants',
      'Theme provider guidance'
    ]
  }
})) satisfies () => DemoPageData;
