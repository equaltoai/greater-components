/**
 * Mock Community Data
 *
 * Factory functions for generating sample community data for tests.
 */

import type { CommunityData } from '../../src/types.js';

export function createMockCommunity(
	id: string,
	overrides: Partial<CommunityData> = {}
): CommunityData {
	const base: CommunityData = {
		id,
		name: `test-community-${id}`,
		title: `Test Community ${id}`,
		description: `A test community for unit testing`,
		rules: [
			{ order: 1, title: 'Be respectful', description: 'Treat others with respect' },
			{ order: 2, title: 'No spam', description: 'No unsolicited advertisements' },
		],
		stats: {
			subscriberCount: 10000,
			activeCount: 500,
			postCount: 25000,
			createdAt: new Date('2020-01-01'),
		},
	};

	return {
		...base,
		...overrides,
		stats: { ...base.stats, ...overrides.stats },
		rules: overrides.rules ?? base.rules,
	};
}
