/**
 * Mock Author Data
 *
 * Factory functions for generating sample author data for tests.
 */

import type { AuthorData } from '../../src/types.js';

export function createMockAuthor(id: string, overrides: Partial<AuthorData> = {}): AuthorData {
	const base: AuthorData = {
		id,
		name: `Author ${id}`,
		username: `user${id}`,
		bio: `Bio for author ${id}`,
		shortBio: `Short bio for author ${id}`,
		avatar: `/avatars/author${id}.jpg`,
		coverImage: `/covers/author${id}.jpg`,
		socialLinks: {
			twitter: `https://twitter.com/user${id}`,
			github: `https://github.com/user${id}`,
		},
		articleCount: 10,
		followerCount: 100,
	};

	return {
		...base,
		...overrides,
		socialLinks: { ...base.socialLinks, ...overrides.socialLinks },
	};
}

export function createMockAuthorList(count: number, startId = 1): AuthorData[] {
	return Array.from({ length: count }, (_, i) => createMockAuthor(`author-${startId + i}`));
}
