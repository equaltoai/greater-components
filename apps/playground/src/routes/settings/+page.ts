import type { PageLoad } from './$types';
import type { DemoPageData } from '$lib/types/demo';

export const load: PageLoad = (() => ({
  metadata: {
    slug: 'settings-demo',
    title: 'Settings Application',
    description:
      'Theme-aware settings shell exercising ThemeSwitcher, privacy toggles, notification controls, and persisted account fields.',
    sections: ['Appearance', 'Privacy', 'Notifications', 'Account']
  }
})) satisfies () => DemoPageData;
