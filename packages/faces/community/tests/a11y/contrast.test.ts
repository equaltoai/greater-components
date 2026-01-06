import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { Flair } from '../../src/components/Flair/index.js';
import { Voting } from '../../src/components/Voting/index.js';

describe('A11y: Contrast & Visuals', () => {
	describe('Flair Badge', () => {
		it('renders a CSP-safe indicator for user-defined colors', () => {
			const flair = {
				id: 'f1',
				text: 'Contrast Check',
				type: 'post' as const,
				backgroundColor: '#000000', // Black
				textColor: '#FFFFFF', // White
			};

			const { container } = render(Flair.Badge, { props: { flair } });
			const badge = container.querySelector('.gr-community-flair');
			const dot = container.querySelector('.gr-community-flair__dot circle');

			expect(badge).toHaveClass('gr-community-flair--post');
			expect(badge?.getAttribute('style')).toBe(null);
			expect(dot?.getAttribute('fill')).toBe(flair.backgroundColor);
		});

		it('handles missing colors gracefully', () => {
			const flair = {
				id: 'f2',
				text: 'Default Colors',
				type: 'user' as const,
			};

			const { container } = render(Flair.Badge, { props: { flair } });
			const badge = container.querySelector('.gr-community-flair');
			const dot = container.querySelector('.gr-community-flair__dot circle');

			expect(badge).toHaveClass('gr-community-flair--user');
			expect(badge?.getAttribute('style')).toBe(null);
			expect(dot).toBe(null);
		});
	});

	describe('Voting', () => {
		it('applies semantic classes for score color', () => {
			const { container } = render(Voting.Root, { props: { score: 100, userVote: 0 } });
			const score = container.querySelector('.gr-community-vote__score');
			expect(score).toHaveClass('gr-community-vote__score--positive');
		});

		it('applies semantic classes for negative score', () => {
			const { container } = render(Voting.Root, { props: { score: -5, userVote: 0 } });
			const score = container.querySelector('.gr-community-vote__score');
			expect(score).toHaveClass('gr-community-vote__score--negative');
		});
	});
});
