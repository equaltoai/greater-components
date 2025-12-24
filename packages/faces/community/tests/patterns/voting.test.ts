import { describe, it, expect } from 'vitest';
import type { VoteDirection } from '../../src/types.js';

// Logic from Post/Root.svelte and Thread/Comment.svelte
function calculateNewScore(
	currentScore: number,
	currentVote: VoteDirection,
	newVote: VoteDirection
): number {
	return currentScore + (newVote - currentVote);
}

function calculateUpvoteRatio(upvotes: number, downvotes: number): number {
	const total = upvotes + downvotes;
	if (total === 0) return 0;
	return upvotes / total;
}

describe('Pattern: Voting Logic', () => {
	describe('Score Calculation', () => {
		it('calculates score when upvoting (neutral -> up)', () => {
			// 10 + (1 - 0) = 11
			expect(calculateNewScore(10, 0, 1)).toBe(11);
		});

		it('calculates score when downvoting (neutral -> down)', () => {
			// 10 + (-1 - 0) = 9
			expect(calculateNewScore(10, 0, -1)).toBe(9);
		});

		it('calculates score when removing upvote (up -> neutral)', () => {
			// 11 + (0 - 1) = 10
			expect(calculateNewScore(11, 1, 0)).toBe(10);
		});

		it('calculates score when changing vote (up -> down)', () => {
			// 11 + (-1 - 1) = 11 - 2 = 9
			expect(calculateNewScore(11, 1, -1)).toBe(9);
		});
	});

	describe('Upvote Ratio', () => {
		it('calculates ratio correctly', () => {
			expect(calculateUpvoteRatio(90, 10)).toBe(0.9);
			expect(calculateUpvoteRatio(50, 50)).toBe(0.5);
		});

		it('handles zero votes', () => {
			expect(calculateUpvoteRatio(0, 0)).toBe(0);
		});
	});
});
