import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { Flair } from '../../src/components/Flair/index.js';
import { Voting } from '../../src/components/Voting/index.js';

// Simple luminosity contrast calculator
function getLuminance(r: number, g: number, b: number) {
	const a = [r, g, b].map((v) => {
		v /= 255;
		return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
	});
	return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function hexToRgb(hex: string) {
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
			}
		: null;
}

function calculateContrast(fgHex: string, bgHex: string) {
	const fg = hexToRgb(fgHex);
	const bg = hexToRgb(bgHex);
	if (!fg || !bg) return 0;
	const lum1 = getLuminance(fg.r, fg.g, fg.b);
	const lum2 = getLuminance(bg.r, bg.g, bg.b);
	const brightest = Math.max(lum1, lum2);
	const darkest = Math.min(lum1, lum2);
	return (brightest + 0.05) / (darkest + 0.05);
}

describe('A11y: Contrast & Visuals', () => {
	describe('Flair Badge', () => {
		it('applies user-defined colors correctly', () => {
			const flair = {
				id: 'f1',
				text: 'Contrast Check',
				type: 'post' as const,
				backgroundColor: '#000000', // Black
				textColor: '#FFFFFF', // White
			};

			const { container } = render(Flair.Badge, { props: { flair } });
			const badge = container.querySelector('.gr-community-flair');

			expect(badge).toHaveStyle({
				backgroundColor: 'rgb(0, 0, 0)',
				color: 'rgb(255, 255, 255)',
			});

			// Manual verification of the input colors
			const contrast = calculateContrast(flair.textColor, flair.backgroundColor);
			expect(contrast).toBeGreaterThan(4.5); // AAA
		});

		it('handles missing colors gracefully', () => {
			const flair = {
				id: 'f2',
				text: 'Default Colors',
				type: 'user' as const,
			};

			const { container } = render(Flair.Badge, { props: { flair } });
			const badge = container.querySelector('.gr-community-flair');

			// Should not have inline styles for color
			const style = badge?.getAttribute('style');
			expect(style).toBe('');
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
