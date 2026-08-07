import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { stripCssBlockComments } from '../../../../scripts/css-source.mjs';

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
		const uncommentedBlogCss = stripCssBlockComments(blogCss);
		const emittedTokens = new Set(
			Array.from(tokenCss.matchAll(/(--gr-[\w-]+)\s*:/g), (match) => match[1])
		);
		const paletteReferences = Array.from(
			uncommentedBlogCss.matchAll(/var\(\s*(--gr-color-(?:gray|neutral|slate|stone|zinc)-[\w-]+)/g),
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
			const pageBackground = { value: 'var(--gr-semantic-background-primary)' };
			const articleHeadings =
				'.gr-blog-article__content h1,\n.gr-blog-article__content h2,\n.gr-blog-article__content h3,\n.gr-blog-article__content h4';
			const darkArticleHeadings =
				"[data-theme='dark'] .gr-blog-article__content h1,\n[data-theme='dark'] .gr-blog-article__content h2,\n[data-theme='dark'] .gr-blog-article__content h3,\n[data-theme='dark'] .gr-blog-article__content h4,\n[data-theme='dark'] .gr-blog-article__content h5,\n[data-theme='dark'] .gr-blog-article__content h6,\n[data-theme='dark'] .gr-blog-article__title";
			const darkCardSubtitle =
				"[data-theme='dark'] .gr-blog-article-card__subtitle,\n[data-theme='dark'] .gr-blog-article-card__excerpt";
			const darkTocArchiveMeta =
				"[data-theme='dark'] .gr-blog-toc__title,\n[data-theme='dark'] .gr-blog-archive__month-title,\n[data-theme='dark'] .gr-blog-editor__meta";
			const darkNewsletterArchive =
				"[data-theme='dark'] .gr-blog-newsletter__title,\n[data-theme='dark'] .gr-blog-archive__year";
			const darkAuthorCard = "[data-theme='dark'] .gr-blog-author-card";
			const cells: Array<{
				name: string;
				foreground: { selector: string; property: string };
				background: { selector?: string; property?: string; value?: string };
			}> =
				theme === 'light'
					? [
							{
								name: 'article prose',
								foreground: { selector: '.gr-blog-article__content', property: 'color' },
								background: pageBackground,
							},
							{
								name: 'article heading',
								foreground: { selector: articleHeadings, property: 'color' },
								background: pageBackground,
							},
							...[
								['card meta', '.gr-blog-article-card__meta'],
								[
									'card subtitle',
									'.gr-blog-article-card__subtitle,\n.gr-blog-article-card__excerpt',
								],
							].map(([name, selector]) => ({
								name,
								foreground: { selector, property: 'color' },
								background: { selector: '.gr-blog-article-card', property: 'background' },
							})),
							{
								name: 'card tag',
								foreground: { selector: '.gr-blog-article-card__tag', property: 'color' },
								background: { selector: '.gr-blog-article-card__tag', property: 'background' },
							},
							...[
								['toc title', '.gr-blog-toc__title'],
								['toc link', '.gr-blog-toc__link'],
								['archive year', '.gr-blog-archive__year'],
								['archive month', '.gr-blog-archive__month-title'],
								['editor meta', '.gr-blog-editor__meta'],
							].map(([name, selector]) => ({
								name,
								foreground: { selector, property: 'color' },
								background: pageBackground,
							})),
							...[
								['author name', "[data-theme='dark'] .gr-blog-author-card__name"],
								['author bio', "[data-theme='dark'] .gr-blog-author-card__bio"],
								['author link', "[data-theme='dark'] .gr-blog-author-card__link"],
							].map(([name, selector]) => ({
								name,
								foreground: { selector, property: 'color' },
								background: { selector: darkAuthorCard, property: 'background' },
							})),
							{
								name: 'publication',
								foreground: { selector: '.gr-blog-publication-banner', property: 'color' },
								background: { selector: '.gr-blog-publication-banner', property: 'background' },
							},
							...[
								['newsletter title', '.gr-blog-newsletter__title'],
								['newsletter description', '.gr-blog-newsletter__description'],
							].map(([name, selector]) => ({
								name,
								foreground: { selector, property: 'color' },
								background: { selector: '.gr-blog-newsletter', property: 'background' },
							})),
							{
								name: 'tag cloud',
								foreground: { selector: '.gr-blog-tag-cloud__tag', property: 'color' },
								background: { selector: '.gr-blog-tag-cloud__tag', property: 'background' },
							},
							{
								name: 'toolbar button',
								foreground: { selector: '.gr-blog-editor-toolbar__button', property: 'color' },
								background: { selector: '.gr-blog-editor-toolbar', property: 'background' },
							},
							{
								name: 'toolbar button hover',
								foreground: {
									selector: '.gr-blog-editor-toolbar__button:hover',
									property: 'color',
								},
								background: {
									selector: '.gr-blog-editor-toolbar__button:hover',
									property: 'background',
								},
							},
							{
								name: 'caption gradient',
								foreground: { selector: '.gr-blog-featured-image__caption', property: 'color' },
								background: { value: '#4d4d4d' },
							},
						]
					: [
							{
								name: 'article prose',
								foreground: {
									selector: "[data-theme='dark'] .gr-blog-article__content",
									property: 'color',
								},
								background: {
									selector: "[data-theme='dark'] .gr-blog-article",
									property: 'background',
								},
							},
							{
								name: 'article heading',
								foreground: { selector: darkArticleHeadings, property: 'color' },
								background: {
									selector: "[data-theme='dark'] .gr-blog-article",
									property: 'background',
								},
							},
							...[
								[
									'article meta',
									"[data-theme='dark'] .gr-blog-article__subtitle,\n[data-theme='dark'] .gr-blog-article__meta",
								],
								['article link', "[data-theme='dark'] .gr-blog-article__content a"],
							].map(([name, selector]) => ({
								name,
								foreground: { selector, property: 'color' },
								background: {
									selector: "[data-theme='dark'] .gr-blog-article",
									property: 'background',
								},
							})),
							...[
								[
									'article tag',
									"[data-theme='dark'] .gr-blog-article__tags .gr-blog-tag-cloud__tag",
								],
								['code', "[data-theme='dark'] .gr-blog-article__content code"],
							].map(([name, selector]) => ({
								name,
								foreground: { selector, property: 'color' },
								background: {
									selector:
										name === 'code' ? '.gr-blog-article__content :not(pre) > code' : selector,
									property: 'background',
								},
							})),
							...[
								['card meta', "[data-theme='dark'] .gr-blog-article-card__meta"],
								['card title', "[data-theme='dark'] .gr-blog-article-card__title"],
								['card subtitle', darkCardSubtitle],
							].map(([name, selector]) => ({
								name,
								foreground: { selector, property: 'color' },
								background: {
									selector: "[data-theme='dark'] .gr-blog-article-card",
									property: 'background',
								},
							})),
							{
								name: 'card tag',
								foreground: {
									selector: "[data-theme='dark'] .gr-blog-article-card__tag",
									property: 'color',
								},
								background: {
									selector: "[data-theme='dark'] .gr-blog-article-card__tag",
									property: 'background',
								},
							},
							...[
								['toc title', darkTocArchiveMeta],
								['toc link', '.gr-blog-toc__link'],
								['archive year', darkNewsletterArchive],
								['archive month', darkTocArchiveMeta],
								['editor meta', darkTocArchiveMeta],
							].map(([name, selector]) => ({
								name,
								foreground: { selector, property: 'color' },
								background: pageBackground,
							})),
							...[
								['author name', '.gr-blog-author-card__name'],
								['author bio', '.gr-blog-author-card__bio'],
							].map(([name, selector]) => ({
								name,
								foreground: { selector, property: 'color' },
								background: { selector: '.gr-blog-author-card', property: 'background' },
							})),
							{
								name: 'publication',
								foreground: { selector: '.gr-blog-publication-banner', property: 'color' },
								background: { selector: '.gr-blog-publication-banner', property: 'background' },
							},
							...[
								['newsletter title', darkNewsletterArchive],
								['newsletter description', "[data-theme='dark'] .gr-blog-newsletter__description"],
							].map(([name, selector]) => ({
								name,
								foreground: { selector, property: 'color' },
								background: { selector: '.gr-blog-newsletter', property: 'background' },
							})),
							{
								name: 'tag cloud',
								foreground: {
									selector: "[data-theme='dark'] .gr-blog-tag-cloud .gr-blog-tag-cloud__tag",
									property: 'color',
								},
								background: {
									selector: "[data-theme='dark'] .gr-blog-tag-cloud .gr-blog-tag-cloud__tag",
									property: 'background',
								},
							},
							{
								name: 'toolbar button',
								foreground: { selector: '.gr-blog-editor-toolbar__button', property: 'color' },
								background: { selector: '.gr-blog-editor-toolbar', property: 'background' },
							},
							{
								name: 'toolbar button hover',
								foreground: {
									selector: '.gr-blog-editor-toolbar__button:hover',
									property: 'color',
								},
								background: {
									selector: '.gr-blog-editor-toolbar__button:hover',
									property: 'background',
								},
							},
							{
								name: 'editor preview',
								foreground: {
									selector: "[data-theme='dark'] .gr-blog-editor__preview",
									property: 'color',
								},
								background: {
									selector: "[data-theme='dark'] .gr-blog-editor__preview",
									property: 'background',
								},
							},
							{
								name: 'caption gradient',
								foreground: { selector: '.gr-blog-featured-image__caption', property: 'color' },
								background: { value: '#4d4d4d' },
							},
						];

			for (const { name, foreground, background } of cells) {
				const foregroundValue = resolveValue(
					declarationValue(blogCss, foreground.selector, foreground.property),
					properties
				);
				const backgroundValue = resolveValue(
					background.value ??
						declarationValue(blogCss, background.selector as string, background.property as string),
					properties
				);
				expect(contrast(foregroundValue, backgroundValue), name).toBeGreaterThanOrEqual(4.5);
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
