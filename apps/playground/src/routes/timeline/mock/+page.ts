import type { PageLoad } from './$types';
import type { DemoPageData } from '$lib/types/demo';

export const load: PageLoad = (() => ({
	metadata: {
		slug: 'timeline-mock-boosts-replies',
		title: 'Timeline (mocked boosts & replies)',
		description:
			'Mocked timeline using sample-timeline.json to verify boost/reply rendering without hitting Lesser.',
		sections: ['Boosted posts', 'Reply context', 'Interaction states'],
	},
})) satisfies () => DemoPageData;
