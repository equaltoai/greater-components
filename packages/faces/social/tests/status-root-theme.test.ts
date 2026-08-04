import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { stripCssBlockComments } from '../../../../scripts/css-source.mjs';

const socialCss = fs.readFileSync(path.resolve(process.cwd(), 'src/theme.css'), 'utf8');
const tokenCss = fs.readFileSync(
	path.resolve(process.cwd(), '../../tokens/dist/theme.css'),
	'utf8'
);

function declarations(css: string, selector: string): string {
	let offset = 0;
	while (offset < css.length) {
		const open = css.indexOf('{', offset);
		if (open < 0) break;
		const start = Math.max(css.lastIndexOf('}', open - 1), css.lastIndexOf('{', open - 1)) + 1;
		const candidate = stripCssBlockComments(css.slice(start, open)).trim();
		const close = css.indexOf('}', open);
		if (candidate === selector && close >= 0) return css.slice(open + 1, close);
		offset = open + 1;
	}
	throw new Error(`Missing CSS block for ${selector}`);
}

function property(block: string, name: string): string {
	const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const match = block.match(new RegExp(`(?:^|;)\\s*${escaped}\\s*:\\s*([^;]+)`));
	if (!match?.[1]) throw new Error(`Missing ${name}`);
	return match[1].trim();
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

function themeProperties(selector: string): Map<string, string> {
	return new Map([
		...readCustomProperties(declarations(tokenCss, ':root')),
		...readCustomProperties(declarations(tokenCss, selector)),
	]);
}

function luminance(hex: string): number {
	const channels = hex
		.slice(1)
		.match(/.{2}/g)
		?.map((value) => Number.parseInt(value, 16) / 255);
	if (!channels || channels.length !== 3) throw new Error(`Invalid color: ${hex}`);
	const linear = channels.map((value) =>
		value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
	);
	const [red, green, blue] = linear;
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

describe('status root themed background', () => {
	it('pins theme-aware dark and high-contrast activation chains', () => {
		expect(
			property(declarations(socialCss, "[data-theme='dark'] .status-root"), '--status-bg')
		).toBe('var(--gr-semantic-background-primary, #030712)');
		expect(
			property(
				declarations(
					socialCss,
					"[data-theme='highContrast'] .status-root,\n[data-theme='high-contrast'] .status-root"
				),
				'--status-bg'
			)
		).toBe('var(--gr-semantic-background-primary, #000000)');
		expect(socialCss).toMatch(
			/@media \(prefers-color-scheme: dark\)[\s\S]*?:root:not\(\[data-theme\]\) \.status-root[\s\S]*?--status-bg: var\(--gr-semantic-background-primary, #030712\)/
		);
		expect(socialCss).toMatch(
			/@media \(prefers-contrast: high\)[\s\S]*?:root:not\(\[data-theme\]\) \.status-root[\s\S]*?--status-bg: var\(--gr-semantic-background-primary, #000000\)/
		);
	});

	it('resolves status body and link contrast from the shipped stylesheets', () => {
		const bodyValue = property(declarations(socialCss, '.status-content'), 'color');
		const linkValue = property(
			declarations(
				socialCss,
				"[data-theme='dark'] .status-content a,\n[data-theme='highContrast'] .status-content a,\n[data-theme='high-contrast'] .status-content a"
			),
			'color'
		);
		const themes = [
			{
				name: 'dark',
				tokenSelector: '[data-theme="dark"]',
				statusSelector: "[data-theme='dark'] .status-root",
			},
			{
				name: 'high-contrast',
				tokenSelector: '[data-theme="highContrast"],\n[data-theme="high-contrast"]',
				statusSelector:
					"[data-theme='highContrast'] .status-root,\n[data-theme='high-contrast'] .status-root",
			},
		] as const;

		for (const theme of themes) {
			const properties = themeProperties(theme.tokenSelector);
			const backgroundValue = property(
				declarations(socialCss, theme.statusSelector),
				'--status-bg'
			);
			const background = resolveValue(backgroundValue, properties);
			for (const [cell, value] of [
				['body', bodyValue],
				['link', linkValue],
			] as const) {
				const foreground = resolveValue(value, properties);
				expect(contrast(foreground, background), `${theme.name} ${cell}`).toBeGreaterThanOrEqual(
					4.5
				);
			}

			expect(
				contrast(resolveValue(linkValue, new Map()), resolveValue(backgroundValue, new Map())),
				`${theme.name} link fallbacks`
			).toBeGreaterThanOrEqual(4.5);
		}
	});
});
