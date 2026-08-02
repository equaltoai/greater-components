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
		...readCustomProperties(declarations(blogCss, ':root')),
	]);
	for (const [name, value] of readCustomProperties(
		declarations(tokenCss, `[data-theme="${theme}"]`)
	)) {
		properties.set(name, value);
	}
	if (theme === 'dark') {
		for (const [name, value] of [
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
	it('references selectable palettes only through emitted token paths', () => {
		const emittedTokens = new Set(
			Array.from(tokenCss.matchAll(/(--gr-[\w-]+)\s*:/g), (match) => match[1])
		);
		const paletteReferences = Array.from(
			blogCss.matchAll(/var\(\s*(--gr-color-(?:gray|neutral|slate|stone|zinc)-[\w-]+)/g),
			(match) => match[1]
		);

		expect(
			paletteReferences.filter((token) => !emittedTokens.has(token)),
			'palette names select --gr-color-gray-* values and are not token paths'
		).toEqual([]);
	});

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

	it.each(['light', 'dark'] as const)(
		'holds contrast for every neutral-mapping text cell in %s',
		(theme) => {
			const properties = themeProperties(theme);
			const pageBackground = '--gr-semantic-background-primary';
			const cells =
				theme === 'light'
					? [
							['article prose', '--gr-color-gray-800', '--gr-color-base-white'],
							['article heading', '--gr-color-gray-900', '--gr-color-base-white'],
							['card meta', '--gr-color-gray-600', '--gr-color-base-white'],
							['card subtitle', '--gr-color-gray-700', '--gr-color-base-white'],
							['card tag', '--gr-color-gray-700', '--gr-color-gray-100'],
							['toc title', '--gr-color-gray-500', pageBackground],
							['toc link', '--gr-color-gray-600', pageBackground],
							['author name', '--gr-color-gray-900', '--gr-color-gray-50'],
							['author bio', '--gr-color-gray-600', '--gr-color-gray-50'],
							['publication', '--gr-color-gray-100', '--gr-color-gray-900'],
							['newsletter title', '--gr-color-gray-900', '--gr-color-primary-50'],
							['newsletter description', '--gr-color-gray-600', '--gr-color-primary-50'],
							['archive year', '--gr-color-gray-900', pageBackground],
							['archive month', '--gr-color-gray-700', pageBackground],
							['tag cloud', '--gr-color-gray-700', '--gr-color-gray-100'],
							['toolbar button', '--gr-color-gray-600', '--gr-color-gray-50'],
							['toolbar button hover', '--gr-color-gray-900', '--gr-color-gray-200'],
							['editor meta', '--gr-color-gray-600', pageBackground],
							['caption gradient', '--gr-color-gray-100', '#4d4d4d'],
						]
					: [
							['article prose', '--gr-color-gray-200', '--gr-color-gray-900'],
							['article heading', '--gr-color-gray-100', '--gr-color-gray-900'],
							['article meta', '--gr-color-gray-300', '--gr-color-gray-900'],
							['article link', '--gr-color-primary-400', '--gr-color-gray-900'],
							['article tag', '--gr-color-gray-200', '--gr-color-gray-800'],
							['code', '--gr-color-gray-100', '--gr-color-gray-800'],
							['card meta', '--gr-color-gray-400', '--gr-color-gray-900'],
							['card title', '--gr-color-gray-100', '--gr-color-gray-900'],
							['card subtitle', '--gr-color-gray-300', '--gr-color-gray-900'],
							['card tag', '--gr-color-gray-200', '--gr-color-gray-800'],
							['toc title', '--gr-color-gray-300', pageBackground],
							['toc link', '--gr-color-gray-400', pageBackground],
							['author name', '--gr-color-gray-900', '--gr-color-gray-50'],
							['author bio', '--gr-color-gray-600', '--gr-color-gray-50'],
							['publication', '--gr-color-gray-100', '--gr-color-gray-900'],
							['newsletter title', '--gr-color-gray-100', '--gr-color-gray-800'],
							['newsletter description', '--gr-color-gray-300', '--gr-color-gray-800'],
							['archive year', '--gr-color-gray-100', pageBackground],
							['archive month', '--gr-color-gray-300', pageBackground],
							['tag cloud', '--gr-color-gray-700', '--gr-color-gray-100'],
							['toolbar button', '--gr-color-gray-600', '--gr-color-gray-50'],
							['toolbar button hover', '--gr-color-gray-900', '--gr-color-gray-200'],
							['editor preview', '--gr-color-gray-100', '--gr-color-gray-900'],
							['editor meta', '--gr-color-gray-300', pageBackground],
							['caption gradient', '--gr-color-gray-100', '#4d4d4d'],
						];

			for (const [name, foregroundToken, backgroundToken] of cells) {
				const foreground = resolveValue(`var(${foregroundToken})`, properties);
				const background = backgroundToken.startsWith('#')
					? backgroundToken
					: resolveValue(`var(${backgroundToken})`, properties);
				expect(contrast(foreground, background), name).toBeGreaterThanOrEqual(4.5);
			}
		}
	);

	it('leaves the light reading surface on its pre-theme cascade', () => {
		expect(declarations(blogCss, '.gr-blog-article')).not.toMatch(/\b(?:background|color)\s*:/);
		expect(declarations(blogCss, '.gr-blog-article__content')).toContain(
			'color: var(--gr-color-gray-800)'
		);
		expect(
			declarations(
				blogCss,
				'.gr-blog-article__content h1,\n.gr-blog-article__content h2,\n.gr-blog-article__content h3,\n.gr-blog-article__content h4'
			)
		).toContain('color: var(--gr-color-gray-900)');
		expect(() => declarations(blogCss, '.gr-blog-article__content a')).toThrow();
		expect(declarations(blogCss, '.gr-blog-article__content code')).not.toMatch(/\bcolor\s*:/);
	});
});
