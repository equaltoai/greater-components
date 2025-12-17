import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { Post } from '../../src/components/Post/index.js';
import { createMockPost } from '../mocks/mockPost.js';
import ModerationTestWrapper from '../fixtures/ModerationTestWrapper.svelte';
import { Moderation } from '../../src/components/Moderation/index.js';

describe('A11y: Screen Reader Support', () => {
	describe('Post', () => {
		it('uses article role', () => {
			render(Post.Root, { props: { post: createMockPost('1') } });
			expect(screen.getByRole('article')).toBeInTheDocument();
		});

		it('provides accessible labels for actions', () => {
			render(Post.Root, { props: { post: createMockPost('1', { commentCount: 5 }) } });
			expect(screen.getByText('5 comments')).toBeInTheDocument();
			// Voting component inside should have labels
			expect(screen.getByLabelText('Upvote')).toBeInTheDocument();
		});
	});

	describe('Moderation', () => {
		it('tabs have correct roles', () => {
			render(ModerationTestWrapper, { props: { component: Moderation.Panel } });

			const tablist = screen.getByRole('tablist');
			expect(tablist).toHaveAttribute('aria-label', 'Moderation tabs');

			const tabs = screen.getAllByRole('tab');
			expect(tabs[0]).toHaveAttribute('aria-selected', 'true'); // First tab active by default
		});
	});
});
