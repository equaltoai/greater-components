import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { stripCssBlockComments } from '../../../scripts/css-source.mjs';

const tokenCss = fs.readFileSync(
	path.resolve(process.cwd(), '../../packages/tokens/dist/theme.css'),
	'utf8'
);
const appCss = fs.readFileSync(path.resolve(process.cwd(), 'src/app.css'), 'utf8');

function componentStyle(relativePath: string): string {
	const component = fs.readFileSync(path.resolve(process.cwd(), relativePath), 'utf8');
	const style = component.match(/<style\b[^>]*>([\s\S]*?)<\/style>/i)?.[1];
	if (!style) throw new Error(`Missing style block in ${relativePath}`);
	return style;
}

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
	if (seen.has(variable[1])) throw new Error(`Circular CSS variable: ${variable[1]}`);

	const nextSeen = new Set(seen).add(variable[1]);
	const declared = properties.get(variable[1]);
	if (declared) return resolveValue(declared, properties, nextSeen);
	if (variable[2]) return resolveValue(variable[2], properties, nextSeen);
	throw new Error(`Missing emitted token: ${variable[1]}`);
}

function themeProperties(theme: 'light' | 'dark'): Map<string, string> {
	return new Map([
		...readCustomProperties(declarations(tokenCss, ':root')),
		...readCustomProperties(declarations(tokenCss, `[data-theme="${theme}"]`)),
	]);
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

type Declaration = {
	css: string;
	selector: string;
	darkSelector?: string;
	property: 'background' | 'color';
};

function selectorForTheme(declaration: Declaration, theme: 'light' | 'dark'): string {
	return theme === 'dark' && declaration.darkSelector
		? declaration.darkSelector
		: declaration.selector;
}

const bodyForeground: Declaration = { css: appCss, selector: 'body', property: 'color' };
const bodyBackground: Declaration = {
	css: appCss,
	selector: 'body',
	property: 'background',
};
const workbenchCss = componentStyle('src/lib/components/settings/ThemeWorkbenchDemo.svelte');
const composeCss = componentStyle('src/routes/compose/+page.svelte');
const settingsCss = componentStyle('src/routes/examples/settings-panel/+page.svelte');
const customizationCss = componentStyle('src/routes/examples/theme-customization/+page.svelte');
const timelineCss = componentStyle('src/routes/timeline/+page.svelte');
const cells: ReadonlyArray<{
	name: string;
	foreground: Declaration;
	backdrop: Declaration;
}> = [
	{
		name: 'theme workbench introduction',
		foreground: { css: workbenchCss, selector: '.demo-intro', property: 'color' },
		backdrop: bodyBackground,
	},
	{
		name: 'compose badge',
		foreground: { css: composeCss, selector: '.badge', property: 'color' },
		backdrop: { css: composeCss, selector: '.badge', property: 'background' },
	},
	{
		name: 'settings debug information',
		foreground: bodyForeground,
		backdrop: { css: settingsCss, selector: '.debug-info', property: 'background' },
	},
	{
		name: 'theme customization code',
		foreground: bodyForeground,
		backdrop: { css: customizationCss, selector: 'pre', property: 'background' },
	},
	{
		name: 'selected timeline navigation',
		foreground: {
			css: timelineCss,
			selector: '.sidebar-nav button.selected',
			property: 'color',
		},
		backdrop: {
			css: timelineCss,
			selector: '.sidebar-nav button.selected',
			property: 'background',
		},
	},
	{
		name: 'timeline state card',
		foreground: { css: timelineCss, selector: '.state-card', property: 'color' },
		backdrop: { css: timelineCss, selector: '.state-card', property: 'background' },
	},
];

describe('newly-live playground theme cells', () => {
	describe.each(['light', 'dark'] as const)('%s theme', (theme) => {
		it.each(cells)('$name binds its swept declaration to a real AA backdrop', (cell) => {
			const properties = themeProperties(theme);
			const foregroundValue = resolveValue(
				declarationValue(
					cell.foreground.css,
					selectorForTheme(cell.foreground, theme),
					cell.foreground.property
				),
				properties
			);
			const backgroundValue = resolveValue(
				declarationValue(
					cell.backdrop.css,
					selectorForTheme(cell.backdrop, theme),
					cell.backdrop.property
				),
				properties
			);

			expect(contrast(foregroundValue, backgroundValue)).toBeGreaterThanOrEqual(4.5);
		});
	});
});
