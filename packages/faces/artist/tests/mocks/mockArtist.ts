/**
 * Mock Artist Data
 *
 * Factory functions for generating sample artist data for tests.
 */

export interface MockArtistProfile {
	id: string;
	username: string;
	displayName: string;
	avatar: string;
	header: string;
	bio: string;
	location?: string;
	website?: string;
	verified: boolean;
	badges: string[];
	stats: {
		artworks: number;
		followers: number;
		following: number;
		collections: number;
	};
	sections: {
		id: string;
		title: string;
		type: 'gallery' | 'about' | 'commissions' | 'shop';
		visible: boolean;
	}[];
	createdAt: string;
}

/**
 * Creates a mock artist profile with default values
 */
export function createMockArtist(
	id: string,
	overrides: Partial<MockArtistProfile> = {}
): MockArtistProfile {
	return {
		id,
		username: `artist${id}`,
		displayName: `Artist ${id}`,
		avatar: `https://example.com/avatars/${id}.jpg`,
		header: `https://example.com/headers/${id}.jpg`,
		bio: `Creative artist specializing in digital illustration. Artist ${id} bio.`,
		location: 'San Francisco, CA',
		website: `https://artist${id}.example.com`,
		verified: false,
		badges: [],
		stats: {
			artworks: 42,
			followers: 1500,
			following: 200,
			collections: 8,
		},
		sections: [
			{ id: 'gallery', title: 'Gallery', type: 'gallery', visible: true },
			{ id: 'about', title: 'About', type: 'about', visible: true },
			{ id: 'commissions', title: 'Commissions', type: 'commissions', visible: true },
		],
		createdAt: new Date().toISOString(),
		...overrides,
	};
}

/**
 * Creates a verified artist profile
 */
export function createMockVerifiedArtist(
	id: string,
	overrides: Partial<MockArtistProfile> = {}
): MockArtistProfile {
	return createMockArtist(id, {
		verified: true,
		badges: ['verified', 'pro'],
		stats: {
			artworks: 150,
			followers: 50000,
			following: 500,
			collections: 25,
		},
		...overrides,
	});
}

/**
 * Creates a list of mock artists
 */
export function createMockArtistList(count: number, startId = 1): MockArtistProfile[] {
	return Array.from({ length: count }, (_, i) => createMockArtist(`${startId + i}`));
}
