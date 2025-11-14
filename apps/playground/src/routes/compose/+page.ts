import type { PageLoad } from './$types';
import type { DemoPageData } from '$lib/types/demo';

export const load: PageLoad = (() => ({
	metadata: {
		slug: 'compose-demo',
		title: 'Compose Demo',
		description:
			'Demonstrates the Compose compound with baseline editors, media attachments, spoiler labels, polls, and draft persistence pulled from the published fediverse package.',
		sections: [
			'Editor essentials',
			'Media + content warnings',
			'Autocomplete & polls',
			'Draft saving',
		],
	},
})) satisfies () => DemoPageData;
