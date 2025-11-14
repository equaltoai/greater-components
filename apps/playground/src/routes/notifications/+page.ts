import type { PageLoad } from './$types';
import type { DemoPageData } from '$lib/types/demo';

export const load: PageLoad = (() => ({
	metadata: {
		slug: 'notifications-demo',
		title: 'Notifications Demo',
		description:
			'ProfileHeader and NotificationsFeed wired with mock handlers to illustrate follows, mentions, dismissals, and accessibility cues.',
		sections: ['Profile header', 'Notification list', 'Accessibility guidance'],
	},
})) satisfies () => DemoPageData;
