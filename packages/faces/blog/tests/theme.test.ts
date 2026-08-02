import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const blogCss = fs.readFileSync(path.resolve(process.cwd(), 'src/theme.css'), 'utf8');
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
		const candidate = css
			.slice(start, open)
			.replace(/\/\*[\s\S]*?\*\//g, '')
			.trim();
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
		...readCustomProperties(declarations(blogCss, ':root')),
	]);
	if (theme === 'dark') {
		for (const [name, value] of [
			...readCustomProperties(declarations(tokenCss, '[data-theme="dark"]')),
			...readCustomProperties(declarations(blogCss, "[data-theme='dark']")),
		]) {
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

describe('blog reading-surface theme', () => {
	it.each(['light', 'dark'] as const)('resolves all new public reading tokens in %s', (theme) => {
		const properties = themeProperties(theme);
		for (const token of [
			'--gr-blog-code-text',
			'--gr-blog-article-background',
			'--gr-blog-article-text',
			'--gr-blog-article-heading',
			'--gr-blog-article-muted',
			'--gr-blog-article-link',
			'--gr-blog-article-tag-background',
			'--gr-blog-article-tag-text',
		]) {
			expect(resolveValue(`var(${token})`, properties), token).toMatch(/^#[\da-f]{6}$/);
		}
	});

	it('resolves dark contrast through the emitted token sheet and each cell background', () => {
		const properties = themeProperties('dark');
		const cells = [
			['prose', '--gr-blog-article-text', '--gr-blog-article-background'],
			['headings', '--gr-blog-article-heading', '--gr-blog-article-background'],
			['meta', '--gr-blog-article-muted', '--gr-blog-article-background'],
			['links', '--gr-blog-article-link', '--gr-blog-article-background'],
			['tags', '--gr-blog-article-tag-text', '--gr-blog-article-tag-background'],
			['code', '--gr-blog-code-text', '--gr-blog-code-background'],
		] as const;

		for (const [name, foregroundToken, backgroundToken] of cells) {
			const foreground = resolveValue(`var(${foregroundToken})`, properties);
			const background = resolveValue(`var(${backgroundToken})`, properties);
			expect(contrast(foreground, background), name).toBeGreaterThanOrEqual(4.5);
		}

		expect(declarations(blogCss, "[data-theme='dark'] .gr-blog-article__content")).toContain(
			'color: var(--gr-blog-article-text)'
		);
		expect(
			declarations(
				blogCss,
				"[data-theme='dark'] .gr-blog-article__content h1,\n[data-theme='dark'] .gr-blog-article__content h2,\n[data-theme='dark'] .gr-blog-article__content h3,\n[data-theme='dark'] .gr-blog-article__content h4,\n[data-theme='dark'] .gr-blog-article__content h5,\n[data-theme='dark'] .gr-blog-article__content h6,\n[data-theme='dark'] .gr-blog-article__title"
			)
		).toContain('color: var(--gr-blog-article-heading)');
		expect(
			declarations(
				blogCss,
				"[data-theme='dark'] .gr-blog-article__subtitle,\n[data-theme='dark'] .gr-blog-article__meta"
			)
		).toContain('color: var(--gr-blog-article-muted)');
		expect(
			declarations(blogCss, "[data-theme='dark'] .gr-blog-article__tags .gr-blog-tag-cloud__tag")
		).toContain('color: var(--gr-blog-article-tag-text)');
		expect(declarations(blogCss, "[data-theme='dark'] .gr-blog-article__content code")).toContain(
			'color: var(--gr-blog-code-text)'
		);
	});

	it('leaves the light reading surface on its pre-theme cascade', () => {
		expect(declarations(blogCss, '.gr-blog-article')).not.toMatch(/\b(?:background|color)\s*:/);
		expect(declarations(blogCss, '.gr-blog-article__content')).toContain(
			'color: var(--gr-color-neutral-800)'
		);
		expect(
			declarations(
				blogCss,
				'.gr-blog-article__content h1,\n.gr-blog-article__content h2,\n.gr-blog-article__content h3,\n.gr-blog-article__content h4'
			)
		).toContain('color: var(--gr-color-neutral-900)');
		expect(() => declarations(blogCss, '.gr-blog-article__content a')).toThrow();
		expect(declarations(blogCss, '.gr-blog-article__content code')).not.toMatch(/\bcolor\s*:/);
	});
});
