/**
 * Mock Comment Data
 *
 * Factory functions for generating sample comment data for tests.
 */

import type { CommentData } from '../../src/types.js';

export function createMockComment(
	id: string,
	parentId: string | null = null,
	depth = 0
): CommentData {
	return {
		id,
		parentId,
		postId: 'post-1',
		content: `Comment ${id}`,
		author: { id: `author-${id}`, username: `user${id}` },
		score: 50,
		createdAt: new Date(),
		depth,
	};
}

export function createMockCommentTree(): CommentData[] {
	return [
		{
			...createMockComment('c1', null, 0),
			children: [createMockComment('c2', 'c1', 1), createMockComment('c3', 'c1', 1)],
		},
		createMockComment('c4', null, 0),
	];
}
