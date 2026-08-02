import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { Flair } from '../../src/components/Flair/index.js';
import { Voting } from '../../src/components/Voting/index.js';

const tokenCss = fs.readFileSync(
	path.resolve(process.cwd(), '../../tokens/dist/theme.css'),
	'utf8'
);

function tokenColor(name: string): string {
	const match = tokenCss.match(
		new RegExp(`${name.replaceAll('-', '\\-')}\\s*:\\s*(#[\\da-f]{6})`, 'i')
	);
	if (!match?.[1]) throw new Error(`Missing emitted token: ${name}`);
	return match[1];
}

function luminance(hex: string): number {
	const channels = hex
		.slice(1)
		.match(/.{2}/g)
		?.map((value) => Number.parseInt(value, 16) / 255);
	if (!channels || channels.length !== 3) throw new Error(`Invalid color: ${hex}`);
	const [red, green, blue] = channels.map((value) =>
		value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
	);
	if (red === undefined || green === undefined || blue === undefined) {
		throw new Error(`Invalid color: ${hex}`);
	}
	return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

function contrast(foreground: string, background: string): number {
	const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
	if (lighter === undefined || darker === undefined) throw new Error('Missing luminance');
	return (lighter + 0.05) / (darker + 0.05);
}

describe('A11y: Contrast & Visuals', () => {
	it.each([
		['light neutral vote icon', '--gr-color-gray-500', '--gr-color-base-white', 3],
		['dark neutral vote icon', '--gr-color-gray-400', '--gr-color-gray-900', 3],
		['light neutral surface text', '--gr-color-gray-900', '--gr-color-gray-100', 4.5],
		['dark neutral surface text', '--gr-color-gray-50', '--gr-color-gray-800', 4.5],
		['dark moderation preview text', '--gr-color-gray-50', '--gr-color-gray-900', 4.5],
	] as const)('holds %s contrast', (_name, foregroundToken, backgroundToken, floor) => {
		expect(
			contrast(tokenColor(foregroundToken), tokenColor(backgroundToken))
		).toBeGreaterThanOrEqual(floor);
	});

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
