/**
 * Mock Publication Data
 *
 * Factory functions for generating sample publication data for tests.
 */

import type { PublicationData } from '../../src/types.js';

export function createMockPublication(
	id: string,
	overrides: Partial<PublicationData> = {}
): PublicationData {
	const base: PublicationData = {
		id,
		name: `Publication ${id}`,
		tagline: `Tagline for publication ${id}`,
		description: `Description for publication ${id}`,
		logo: `/logos/pub${id}.png`,
		banner: `/banners/pub${id}.jpg`,
		primaryColor: '#000000',
		website: `https://pub${id}.com`,
		socialLinks: {
			twitter: `https://twitter.com/pub${id}`,
		},
		hasNewsletter: true,
		subscriberCount: 500,
	};

	return {
		...base,
		...overrides,
		socialLinks: { ...base.socialLinks, ...overrides.socialLinks },
	};
}
