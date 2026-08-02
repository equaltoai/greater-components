import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const css = fs.readFileSync(path.resolve(process.cwd(), 'src/theme.css'), 'utf8');

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
		expect(css).toContain(`[data-theme='dark'] .status-root {
	--status-bg: var(--gr-semantic-background-primary, #030712);
	--status-bg-hover: var(--gr-semantic-background-secondary, #111827);
}`);
		expect(css).toContain(`[data-theme='highContrast'] .status-root,
[data-theme='high-contrast'] .status-root {
	--status-bg: var(--gr-semantic-background-primary, #000000);
	--status-bg-hover: var(--gr-semantic-background-primary, #000000);
}`);
		expect(css).toContain(`:root:not([data-theme]) .status-root {
		--status-bg: var(--gr-semantic-background-primary, #030712);`);
		expect(css).toContain(`:root:not([data-theme]) .status-root {
		--status-bg: var(--gr-semantic-background-primary, #000000);`);
	});

	it('keeps status body text and links above the AA contrast floor', () => {
		const cells = [
			['dark body', '#f9fafb', '#030712'],
			['dark link', '#1d9bf0', '#030712'],
			['high-contrast body', '#ffffff', '#000000'],
			['high-contrast link', '#1d9bf0', '#000000'],
		] as const;

		for (const [name, foreground, background] of cells) {
			expect(contrast(foreground, background), name).toBeGreaterThanOrEqual(4.5);
		}

		expect(css).toContain(
			'color: var(--gr-semantic-foreground-primary, var(--status-text-primary, #0f1419))'
		);
		expect(css).toContain(
			"[data-theme='dark'] .status-content a,\n[data-theme='highContrast'] .status-content a,\n[data-theme='high-contrast'] .status-content a"
		);
	});
});
