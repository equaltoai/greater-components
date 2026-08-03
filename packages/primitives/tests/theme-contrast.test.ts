import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { stripCssBlockComments } from '../../../scripts/css-source.mjs';

const tokenCss = fs.readFileSync(path.resolve(process.cwd(), '../tokens/dist/theme.css'), 'utf8');

function componentStyle(relativePath: string): string {
	const component = fs.readFileSync(path.resolve(process.cwd(), relativePath), 'utf8');
	const style = component.match(/<style>([\s\S]*?)<\/style>/)?.[1];
	if (!style) throw new Error(`Missing style block in ${relativePath}`);
	return style;
}

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

function themeProperties(theme: 'light' | 'dark'): Map<string, string> {
	return new Map([
		...readCustomProperties(declarations(tokenCss, ':root')),
		...readCustomProperties(declarations(tokenCss, `[data-theme="${theme}"]`)),
	]);
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
	if (seen.has(variable[1])) throw new Error(`Circular CSS variable: ${variable[1]}`);

	const nextSeen = new Set(seen).add(variable[1]);
	const declared = properties.get(variable[1]);
	if (declared) return resolveValue(declared, properties, nextSeen);
	if (variable[2]) return resolveValue(variable[2], properties, nextSeen);
	throw new Error(`Missing emitted token: ${variable[1]}`);
}

function luminance(hex: string): number {
	const channels = hex
		.slice(1)
		.match(/.{2}/g)
		?.map((value) => Number.parseInt(value, 16) / 255)
		.map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
	if (!channels || channels.length !== 3) throw new Error(`Invalid color: ${hex}`);
	const [red, green, blue] = channels;
	if (red === undefined || green === undefined || blue === undefined) {
		throw new Error(`Invalid color: ${hex}`);
	}
	return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

function contrast(foreground: string, background: string): number {
	const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
	if (lighter === undefined || darker === undefined) throw new Error('Missing luminance value');
	return (lighter + 0.05) / (darker + 0.05);
}

describe('newly-live primitive theme cells', () => {
	it.each(['light', 'dark'] as const)('binds declarations to AA contrast in %s', (theme) => {
		const settingsCss = componentStyle('src/components/Settings/SettingsSection.svelte');
		const checkerCss = componentStyle('src/components/Theme/ContrastChecker.svelte');
		const properties = themeProperties(theme);
		const cells = [
			['settings title', settingsCss, '.settings-section__title', '.settings-section__header'],
			[
				'settings description',
				settingsCss,
				'.settings-section__description',
				'.settings-section__header',
			],
			[
				'contrast pass',
				checkerCss,
				'.gr-contrast-checker__metric-value--pass,\n\t.gr-contrast-checker__compliance-badge--pass',
				null,
			],
			[
				'contrast failure',
				checkerCss,
				'.gr-contrast-checker__metric-value--fail,\n\t.gr-contrast-checker__compliance-badge--fail',
				null,
			],
			['contrast warning', checkerCss, '.gr-contrast-checker__metric-value--warn', null],
		] as const;

		for (const [name, css, foregroundSelector, backgroundSelector] of cells) {
			const foreground = resolveValue(
				declarationValue(css, foregroundSelector, 'color'),
				properties
			);
			const background = resolveValue(
				declarationValue(css, backgroundSelector ?? foregroundSelector, 'background'),
				properties
			);
			expect(contrast(foreground, background), name).toBeGreaterThanOrEqual(4.5);
		}
	});
});
