import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Voting } from '../../../src/components/Voting/index.js';

describe('Voting Behavior', () => {
	const handlers = {
		onUpvote: vi.fn(),
		onDownvote: vi.fn(),
		onRemoveVote: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('triggers onUpvote when up arrow is clicked', async () => {
		render(Voting.Root, {
			props: {
				score: 10,
				userVote: 0,
				handlers,
			},
		});

		const upvoteBtn = screen.getByLabelText('Upvote');
		await fireEvent.click(upvoteBtn);

		expect(handlers.onUpvote).toHaveBeenCalled();
	});

	it('triggers onRemoveVote when up arrow is clicked while already upvoted', async () => {
		render(Voting.Root, {
			props: {
				score: 11,
				userVote: 1,
				handlers,
			},
		});

		const upvoteBtn = screen.getByLabelText('Upvote');
		await fireEvent.click(upvoteBtn);

		expect(handlers.onRemoveVote).toHaveBeenCalled();
	});
});
