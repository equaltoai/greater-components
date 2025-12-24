import { describe, it, expect } from 'vitest';
import type { CommentData } from '../../src/types.js';

// Logic for flattening or organizing comment trees
function flattenCommentTree(comments: CommentData[]): CommentData[] {
	const flattened: CommentData[] = [];

	function traverse(items: CommentData[]) {
		for (const item of items) {
			flattened.push(item);
			if (item.children && item.children.length > 0) {
				traverse(item.children);
			}
		}
	}

	traverse(comments);
	return flattened;
}

function calculateDepth(comment: CommentData, parentDepth: number): number {
	return parentDepth + 1;
}

describe('Pattern: Comment Tree Utilities', () => {
	const mockTree: CommentData[] = [
		{
			id: '1',
			content: 'Root 1',
			depth: 0,
			parentId: null,
			author: { id: 'u1', username: 'u1' },
			score: 1,
			postId: 'p1',
			createdAt: new Date(),
			children: [
				{
					id: '1.1',
					content: 'Child 1.1',
					depth: 1,
					parentId: '1',
					author: { id: 'u2', username: 'u2' },
					score: 1,
					postId: 'p1',
					createdAt: new Date(),
				},
			],
		},
		{
			id: '2',
			content: 'Root 2',
			depth: 0,
			parentId: null,
			author: { id: 'u3', username: 'u3' },
			score: 1,
			postId: 'p1',
			createdAt: new Date(),
			children: [],
		},
	];

	it('flattens comment tree for rendering if needed', () => {
		const flat = flattenCommentTree(mockTree);
		expect(flat).toHaveLength(3);
		expect(flat.map((c) => c.id)).toEqual(['1', '1.1', '2']);
	});

	it('calculates depth correctly', () => {
		expect(calculateDepth(mockTree[0], -1)).toBe(0);
		const child = mockTree[0].children?.[0];
		if (!child) throw new Error('Child not found');
		expect(calculateDepth(child, 0)).toBe(1);
	});
});
