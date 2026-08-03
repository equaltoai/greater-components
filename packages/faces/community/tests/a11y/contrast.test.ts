import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { Flair } from '../../src/components/Flair/index.js';
import { Voting } from '../../src/components/Voting/index.js';

const communityCss = fs.readFileSync(path.resolve(process.cwd(), 'src/theme.css'), 'utf8');
const tokenCss = fs.readFileSync(
	path.resolve(process.cwd(), '../../tokens/dist/theme.css'),
	'utf8'
);

function declarations(css: string, selector: string): string {
	let offset = 0;
	const blocks: string[] = [];
	while (offset < css.length) {
		const open = css.indexOf('{', offset);
		if (open < 0) break;
		const start = Math.max(css.lastIndexOf('}', open - 1), css.lastIndexOf('{', open - 1)) + 1;
		const candidate = css
			.slice(start, open)
			.replace(/\/\*[\s\S]*?\*\//g, '')
			.trim();
		const close = css.indexOf('}', open);
		if (candidate === selector && close >= 0) blocks.push(css.slice(open + 1, close));
		offset = open + 1;
	}
	if (blocks.length > 0) return blocks.join('\n');
	throw new Error(`Missing CSS block for ${selector}`);
}

function readCustomProperties(block: string): Map<string, string> {
	return new Map(
		Array.from(block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g), (match) => [
			match[1] as string,
			match[2]?.trim() as string,
		])
	);
}

function resolveValue(
	value: string,
	properties: Map<string, string>,
	seen = new Set<string>()
): string {
	const trimmed = value.trim();
	if (/^#[\da-f]{6}$/i.test(trimmed)) return trimmed.toLowerCase();

	const variable = trimmed.match(/^var\(\s*(--[\w-]+)\s*(?:,\s*(.+))?\)$/s);
	if (!variable?.[1]) throw new Error(`Unresolved CSS value: ${value}`);

	const name = variable[1];
	if (seen.has(name)) throw new Error(`Circular CSS variable: ${name}`);

	const nextSeen = new Set(seen).add(name);
	const declared = properties.get(name);
	if (declared) return resolveValue(declared, properties, nextSeen);
	if (variable[2]) return resolveValue(variable[2], properties, nextSeen);
	throw new Error(`Missing emitted token: ${name}`);
}

function themeProperties(theme: 'light' | 'dark'): Map<string, string> {
	const properties = new Map([
		...readCustomProperties(declarations(tokenCss, ':root')),
		...readCustomProperties(declarations(communityCss, ':root')),
	]);
	for (const [name, value] of readCustomProperties(
		declarations(tokenCss, `[data-theme="${theme}"]`)
	)) {
		properties.set(name, value);
	}
	if (theme === 'dark') {
		for (const [name, value] of readCustomProperties(
			declarations(communityCss, "[data-theme='dark']")
		)) {
			properties.set(name, value);
		}
	}
	return properties;
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
	it.each(['light', 'dark'] as const)(
		'holds neutral vote icon contrast from the %s face declaration',
		(theme) => {
			const properties = themeProperties(theme);
			const foreground = resolveValue('var(--gr-community-vote-neutral-color)', properties);
			const background = resolveValue(
				theme === 'light'
					? 'var(--gr-semantic-background-primary)'
					: 'var(--gr-community-card-background)',
				properties
			);

			expect(contrast(foreground, background)).toBeGreaterThanOrEqual(3);
		}
	);

	it('keeps header placeholders on dark emitted surfaces', () => {
		const banner = declarations(
			communityCss,
			"[data-theme='dark'] .gr-community-header__banner--placeholder"
		);
		const icon = declarations(communityCss, "[data-theme='dark'] .gr-community-header__icon");

		expect(banner).toContain('var(--gr-color-gray-800)');
		expect(banner).toContain('var(--gr-color-gray-700)');
		expect(icon).toContain('background: var(--gr-color-gray-700)');
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
