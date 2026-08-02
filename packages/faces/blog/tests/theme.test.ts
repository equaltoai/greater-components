import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const css = fs.readFileSync(path.resolve(process.cwd(), 'src/theme.css'), 'utf8');

const darkRamp: Record<string, string> = {
	'--gr-color-neutral-100': '#f3f4f6',
	'--gr-color-neutral-200': '#e5e7eb',
	'--gr-color-neutral-300': '#d1d5db',
	'--gr-color-neutral-800': '#1f2937',
	'--gr-color-neutral-900': '#111827',
	'--gr-color-primary-400': '#60a5fa',
};

function declarations(selector: string): string {
	const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
	if (!match?.[1]) throw new Error(`Missing CSS block for ${selector}`);
	return match[1];
}

function customProperty(block: string, name: string): string {
	const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const match = block.match(new RegExp(`${escaped}\\s*:\\s*([^;]+)`));
	if (!match?.[1]) throw new Error(`Missing ${name}`);
	return match[1].trim();
}

function resolveRamp(value: string): string {
	const token = value.match(/var\((--gr-color-[^)]+)\)/)?.[1];
	if (!token || !darkRamp[token]) throw new Error(`Unresolved dark token: ${value}`);
	return darkRamp[token];
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
	it('resolves prose, headings, meta, links, tags and code to dark-theme colors', () => {
		const dark = declarations("[data-theme='dark']");
		const background = resolveRamp(customProperty(dark, '--gr-blog-article-background'));
		const cells = [
			['prose', '--gr-blog-article-text'],
			['headings', '--gr-blog-article-heading'],
			['meta', '--gr-blog-article-muted'],
			['links', '--gr-blog-article-link'],
			['tags', '--gr-blog-article-tag-text'],
			['code', '--gr-blog-code-text'],
		] as const;

		for (const [name, token] of cells) {
			const foreground = resolveRamp(customProperty(dark, token));
			expect(contrast(foreground, background), name).toBeGreaterThanOrEqual(4.5);
		}

		expect(declarations('.gr-blog-article__content')).toContain(
			'color: var(--gr-blog-article-text)'
		);
		expect(declarations('.gr-blog-article__title')).toContain(
			'color: var(--gr-blog-article-heading)'
		);
		expect(declarations('.gr-blog-article__subtitle,\n.gr-blog-article__meta')).toContain(
			'color: var(--gr-blog-article-muted)'
		);
		expect(declarations('.gr-blog-article__tags .gr-blog-tag-cloud__tag')).toContain(
			'color: var(--gr-blog-article-tag-text)'
		);
		expect(declarations('.gr-blog-article__content code')).toContain(
			'color: var(--gr-blog-code-text)'
		);
	});
});
