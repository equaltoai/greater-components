import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { stripCssBlockComments } from '../../../../../scripts/css-source.mjs';
import { Flair } from '../../src/components/Flair/index.js';
import { Voting } from '../../src/components/Voting/index.js';

const communityCss = fs.readFileSync(path.resolve(process.cwd(), 'src/theme.css'), 'utf8');
const tokenCss = fs.readFileSync(
	path.resolve(process.cwd(), '../../tokens/dist/theme.css'),
	'utf8'
);
const darkHoverSurfaces =
	"[data-theme='dark'] .gr-community-vote__button:hover,\n[data-theme='dark'] .gr-community-flair--post,\n[data-theme='dark'] .gr-community-sort__option:hover,\n[data-theme='dark'] .gr-community-mod-panel__refresh:hover,\n[data-theme='dark'] .gr-community-mod-queue-item__actions button:hover,\n[data-theme='dark'] .gr-community-header__subscribe:hover,\n[data-theme='dark'] .gr-community-wiki__action:hover";

function declarations(css: string, selector: string): string {
	let offset = 0;
	const blocks: string[] = [];
	while (offset < css.length) {
		const open = css.indexOf('{', offset);
		if (open < 0) break;
		const start = Math.max(css.lastIndexOf('}', open - 1), css.lastIndexOf('{', open - 1)) + 1;
		const candidate = stripCssBlockComments(css.slice(start, open)).trim();
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

function declarationValue(css: string, selector: string, property: string): string {
	const matches = Array.from(
		declarations(css, selector).matchAll(new RegExp(`(?:^|;)\\s*${property}\\s*:\\s*([^;]+)`, 'g'))
	);
	const value = matches.at(-1)?.[1]?.trim();
	if (!value) throw new Error(`Missing ${property} declaration for ${selector}`);
	return value;
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
	it('binds the light vote backdrop to the rendered post surface chain', () => {
		const postBackground = declarationValue(communityCss, '.gr-community-post', 'background');
		const cardSurface = readCustomProperties(declarations(communityCss, ':root')).get(
			'--gr-community-card-background'
		);
		if (!cardSurface) throw new Error('Missing --gr-community-card-background declaration');

		// Voting renders inside `.gr-community-post`. Guard that declared surface chain so
		// contrast cannot silently drift back to the page background when the card changes.
		expect(postBackground).toBe('var(--gr-community-card-background)');
		expect(cardSurface).toBe('var(--gr-semantic-background-surface)');
		expect(resolveValue(postBackground, themeProperties('light'))).toBe(
			resolveValue(cardSurface, themeProperties('light'))
		);
	});

	it.each(['light', 'dark'] as const)(
		'holds neutral vote icon contrast from the %s face declaration',
		(theme) => {
			const properties = themeProperties(theme);
			const foreground = resolveValue(
				declarationValue(communityCss, '.gr-community-vote__button', 'color'),
				properties
			);
			for (const [name, selector] of [
				['post surface', '.gr-community-post'],
				[
					'hover surface',
					theme === 'dark' ? darkHoverSurfaces : '.gr-community-vote__button:hover',
				],
			] as const) {
				const background = resolveValue(
					declarationValue(communityCss, selector, 'background'),
					properties
				);
				expect(contrast(foreground, background), name).toBeGreaterThanOrEqual(3);
			}
		}
	);

	it.each(['light', 'dark'] as const)(
		'holds text contrast for newly-live community cells in %s',
		(theme) => {
			const properties = themeProperties(theme);
			type Declaration = { selector: string; property: string; darkSelector?: string };
			type Cell = {
				name: string;
				foreground: Declaration;
				background: Declaration;
			};
			const surface = (selector: string): Declaration => ({ selector, property: 'background' });
			const color = (selector: string): Declaration => ({ selector, property: 'color' });
			const postSurface = surface('.gr-community-post');
			const rulesSurface = surface('.gr-community-rules');
			const moderationSurface = surface('.gr-community-mod-panel');
			const moderationLogSurface = surface('.gr-community-mod-log__entry');
			const headerSurface = surface('.gr-community-header__info');
			const wikiHeaderSurface = surface('.gr-community-wiki__header');
			const wikiEditorSurface = surface('.gr-community-wiki__editor');
			const wikiHistorySurface = surface('.gr-community-wiki-history__item');
			const hoverSurface = (selector: string): Declaration => ({
				selector,
				property: 'background',
				darkSelector: darkHoverSurfaces,
			});
			const cell = (name: string, selector: string, background: Declaration): Cell => ({
				name,
				foreground: color(selector),
				background,
			});
			const cells: ReadonlyArray<Cell> = [
				cell('post title', '.gr-community-post__title', postSurface),
				cell('post action hover', '.gr-community-post__action:hover', postSurface),
				cell('vote score', '.gr-community-vote__score', postSurface),
				cell('post flair', '.gr-community-flair--post', hoverSurface('.gr-community-flair--post')),
				cell(
					'sort hover',
					'.gr-community-sort__option:hover',
					hoverSurface('.gr-community-sort__option:hover')
				),
				cell('rules title', '.gr-community-rules__title', rulesSurface),
				cell('rule title', '.gr-community-rule__title', rulesSurface),
				cell('rule description', '.gr-community-rule__description', rulesSurface),
				cell('moderation title', '.gr-community-mod-panel__title', moderationSurface),
				cell('moderation tab', '.gr-community-mod-panel__tab', moderationSurface),
				cell('moderation tab hover', '.gr-community-mod-panel__tab:hover', moderationSurface),
				cell('moderation status', '.gr-community-mod-panel__status', moderationSurface),
				cell('queue title', '.gr-community-mod-queue-item__title', moderationSurface),
				cell('queue metadata', '.gr-community-mod-queue-item__meta', moderationSurface),
				cell('queue reports', '.gr-community-mod-queue-item__reports', moderationSurface),
				cell(
					'queue report detail',
					'.gr-community-mod-queue-item__report-detail',
					moderationSurface
				),
				cell('log summary', '.gr-community-mod-log__summary', moderationLogSurface),
				cell('log action', '.gr-community-mod-log__action', moderationLogSurface),
				cell('log metadata', '.gr-community-mod-log__meta', moderationLogSurface),
				cell('header name', '.gr-community-header__name', headerSurface),
				cell('header title', '.gr-community-header__title', headerSurface),
				cell('header statistics', '.gr-community-header__stats', headerSurface),
				cell('header statistic value', '.gr-community-header__stat-value', headerSurface),
				cell('wiki title', '.gr-community-wiki__title', wikiHeaderSurface),
				cell('wiki metadata', '.gr-community-wiki__meta', wikiHeaderSurface),
				cell('wiki field label', '.gr-community-wiki__field-label', wikiEditorSurface),
				cell('wiki history revision', '.gr-community-wiki-history__rev', wikiHistorySurface),
				cell('wiki history reason', '.gr-community-wiki-history__reason', wikiHistorySurface),
				{
					name: 'moderation refresh',
					foreground: color('.gr-community-mod-panel__refresh'),
					background: surface('.gr-community-mod-panel__refresh'),
				},
				{
					name: 'moderation refresh hover',
					foreground: color('.gr-community-mod-panel__refresh'),
					background: hoverSurface('.gr-community-mod-panel__refresh:hover'),
				},
				{
					name: 'queue action',
					foreground: color('.gr-community-mod-queue-item__actions button'),
					background: surface('.gr-community-mod-queue-item__actions button'),
				},
				{
					name: 'queue action hover',
					foreground: color('.gr-community-mod-queue-item__actions button'),
					background: hoverSurface('.gr-community-mod-queue-item__actions button:hover'),
				},
				{
					name: 'header subscribe',
					foreground: color('.gr-community-header__subscribe'),
					background: surface('.gr-community-header__subscribe'),
				},
				{
					name: 'header subscribe hover',
					foreground: color('.gr-community-header__subscribe'),
					background: hoverSurface('.gr-community-header__subscribe:hover'),
				},
				{
					name: 'wiki action',
					foreground: color('.gr-community-wiki__action'),
					background: surface('.gr-community-wiki__action'),
				},
				{
					name: 'wiki action hover',
					foreground: color('.gr-community-wiki__action'),
					background: hoverSurface('.gr-community-wiki__action:hover'),
				},
				{
					name: 'wiki editor input',
					foreground: color('.gr-community-wiki__textarea,\n.gr-community-wiki__input'),
					background: surface('.gr-community-wiki__textarea,\n.gr-community-wiki__input'),
				},
			];

			for (const {
				name,
				foreground: foregroundDeclaration,
				background: backgroundDeclaration,
			} of cells) {
				const foreground = resolveValue(
					declarationValue(
						communityCss,
						foregroundDeclaration.selector,
						foregroundDeclaration.property
					),
					properties
				);
				const backdrop = resolveValue(
					declarationValue(
						communityCss,
						theme === 'dark' && backgroundDeclaration.darkSelector
							? backgroundDeclaration.darkSelector
							: backgroundDeclaration.selector,
						backgroundDeclaration.property
					),
					properties
				);
				expect(contrast(foreground, backdrop), name).toBeGreaterThanOrEqual(4.5);
			}
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
