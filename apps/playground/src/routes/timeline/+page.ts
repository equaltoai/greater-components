import type { PageLoad } from './$types';
import type { DemoPageData } from '$lib/types/demo';

export const load: PageLoad = (() => ({
	metadata: {
		slug: 'timeline-demo',
		title: 'Timeline Application',
		description:
			'Complete timeline experience with a Compose dock, quick settings, virtualized feed, pinned posts, and notification rail all wired to the published stores.',
		sections: ['Compose dock', 'Virtualized feed', 'Profile & notifications'],
	},
})) satisfies () => DemoPageData;
