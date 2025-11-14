import type { PageLoad } from './$types';
import type { DemoPageData } from '$lib/types/demo';

export const load: PageLoad = (() => ({
	metadata: {
		slug: 'button-demo',
		title: 'Button Patterns',
		description:
			'Comprehensive coverage of Greater button variants, states, and icon affordances rendered from the published primitives package.',
		sections: ['Variants & sizes', 'Icon placements', 'Stateful interactions'],
	},
})) satisfies () => DemoPageData;
