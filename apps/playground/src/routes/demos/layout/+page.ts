import type { PageLoad } from './$types';
import type { DemoPageData } from '$lib/types/demo';

export const load: PageLoad = (() => ({
	metadata: {
		slug: 'layout-demo',
		title: 'Layout Components Demo',
		description:
			'Avatar, Skeleton, Modal, Tabs, and Tooltip patterns rendered from published Greater primitives.',
		sections: [
			'Avatar states',
			'Skeleton placeholders',
			'Modal flows',
			'Tabs & tooltip coordination',
		],
	},
})) satisfies () => DemoPageData;
