/**
 * Mock Post Data
 *
 * Factory functions for generating sample post data for tests.
 */

import type { PostData } from '../../src/types.js';

export function createMockPost(id: string, overrides: Partial<PostData> = {}): PostData {
	return {
		id,
		title: `Test Post ${id}`,
		type: 'text',
		content: `Content for post ${id}`,
		author: { id: `author-${id}`, username: `user${id}` },
		community: { id: 'c1', name: 'test', title: 'Test' },
		score: 100,
		upvoteRatio: 0.95,
		commentCount: 10,
		createdAt: new Date(),
		...overrides,
	};
}
