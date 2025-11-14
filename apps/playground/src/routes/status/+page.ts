import type { PageLoad } from './$types';
import type { DemoPageData } from '$lib/types/demo';

export const load: PageLoad = (() => ({
	metadata: {
		slug: 'status-demo',
		title: 'Status Card Demo',
		description:
			'StatusCard + Status compound demos sourced from the fediverse data helpers showing media, polls, threads, and a11y guidance.',
		sections: ['StatusCard showcase', 'Thread preview', 'Accessibility & shortcuts'],
	},
})) satisfies () => DemoPageData;
