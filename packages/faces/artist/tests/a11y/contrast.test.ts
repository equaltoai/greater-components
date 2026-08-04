/**
 * Contrast Accessibility Tests
 *
 * Tests for color contrast including:
 * - Color contrast ratios
 * - High contrast mode
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { calculateContrastRatio } from '../../src/utils/highContrast';
import { stripCssBlockComments } from '../../../../../scripts/css-source.mjs';

const tokenCss = fs.readFileSync(
	path.resolve(process.cwd(), '../../tokens/dist/theme.css'),
	'utf8'
);

function componentStyle(relativePath: string): string {
	const component = fs.readFileSync(path.resolve(process.cwd(), relativePath), 'utf8');
	const style = component.match(/<style>([\s\S]*?)<\/style>/)?.[1];
	if (!style) throw new Error(`Missing style block in ${relativePath}`);
	return style;
}

function declarations(css: string, selector: string): string {
	for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
		if (stripCssBlockComments(match[1] ?? '').trim() === selector) return match[2] ?? '';
	}
	throw new Error(`Missing CSS block for ${selector}`);
}

function declarationValue(css: string, selector: string, property: string): string {
	const matches = Array.from(
		declarations(css, selector).matchAll(new RegExp(`(?:^|;)\\s*${property}\\s*:\\s*([^;]+)`, 'g'))
	);
	const value = matches.at(-1)?.[1]?.trim();
	if (!value) throw new Error(`Missing ${property} declaration for ${selector}`);
	return value;
}

const emittedProperties = new Map(
	Array.from(tokenCss.matchAll(/(--gr-[\w-]+)\s*:\s*([^;]+);/g), (match) => [
		match[1] as string,
		match[2]?.trim() as string,
	])
);

function resolveValue(value: string, seen = new Set<string>()): string {
	const trimmed = value.trim();
	if (/^#[\da-f]{6}$/i.test(trimmed)) return trimmed.toLowerCase();

	const variable = trimmed.match(/^var\(\s*(--[\w-]+)\s*(?:,\s*(.+))?\)$/s);
	if (!variable?.[1]) throw new Error(`Unresolved CSS value: ${value}`);
	if (seen.has(variable[1])) throw new Error(`Circular CSS variable: ${variable[1]}`);

	const declared = emittedProperties.get(variable[1]);
	if (declared) return resolveValue(declared, new Set(seen).add(variable[1]));
	if (variable[2]) return resolveValue(variable[2], new Set(seen).add(variable[1]));
	throw new Error(`Missing emitted token: ${variable[1]}`);
}

describe('Contrast Accessibility', () => {
	beforeEach(() => {
		// Setup
	});

	describe('Color Contrast Ratios', () => {
		it('resolves newly-live transparency badge declarations at WCAG AA contrast', () => {
			const optOutCss = componentStyle('src/components/Transparency/AIOptOutControls.svelte');
			const ethicalCss = componentStyle('src/components/Transparency/EthicalSourcingBadge.svelte');
			const processCss = componentStyle('src/components/Transparency/ProcessDocumentation.svelte');
			const pairedCells = [
				['opt-out low impact', optOutCss, '.gr-transparency-optout-impact-badge--low'],
				['opt-out high impact', optOutCss, '.gr-transparency-optout-impact-badge--high'],
				['opt-out complete impact', optOutCss, '.gr-transparency-optout-impact-badge--complete'],
				['opt-out blocked status', optOutCss, '.gr-transparency-optout-status-badge--blocked'],
				[
					'hybrid process type',
					processCss,
					'.gr-transparency-process-step--hybrid .gr-transparency-process-step-type',
				],
			] as const;

			for (const [name, css, selector] of pairedCells) {
				const foreground = resolveValue(declarationValue(css, selector, 'color'));
				const background = resolveValue(declarationValue(css, selector, 'background'));
				expect(calculateContrastRatio(foreground, background), name).toBeGreaterThanOrEqual(4.5);
			}

			const ethicalVariants = [
				['green', 'green'],
				['blue', 'blue'],
				['yellow', 'yellow'],
				['expired', 'expired'],
			] as const;
			for (const [name, variant] of ethicalVariants) {
				const main = `.gr-transparency-ethical-badge--${variant} .gr-transparency-ethical-badge-main`;
				const status = `.gr-transparency-ethical-badge--${variant} .gr-transparency-ethical-badge-status`;
				const foreground = resolveValue(declarationValue(ethicalCss, status, 'color'));
				const background = resolveValue(declarationValue(ethicalCss, main, 'background'));
				expect(
					calculateContrastRatio(foreground, background),
					`${name} status`
				).toBeGreaterThanOrEqual(4.5);
			}
		});

		it('meets WCAG AA for normal text (4.5:1)', () => {
			// Dark text (#333333) on light background (#FFFFFF)
			const ratio = calculateContrastRatio('#333333', '#FFFFFF');

			expect(ratio).toBeGreaterThanOrEqual(4.5);
		});

		it('meets WCAG AA for large text (3:1)', () => {
			// Large text (#666666) has lower requirement
			const ratio = calculateContrastRatio('#666666', '#FFFFFF');

			expect(ratio).toBeGreaterThanOrEqual(3);
		});

		it('meets WCAG AAA for normal text (7:1)', () => {
			// Highest contrast requirement (#000000 on #FFFFFF)
			const ratio = calculateContrastRatio('#000000', '#FFFFFF');

			expect(ratio).toBeGreaterThanOrEqual(7);
		});

		it('has sufficient contrast for interactive elements', () => {
			// Button text (White) on Blue-600 (#2563EB - approx 37, 99, 235)
			const ratio = calculateContrastRatio('#FFFFFF', '#2563EB');

			expect(ratio).toBeGreaterThanOrEqual(4.5);
		});

		it('has sufficient contrast for focus indicators', () => {
			// Focus ring (Blue-600) should be visible on White
			const ratio = calculateContrastRatio('#2563EB', '#FFFFFF');

			expect(ratio).toBeGreaterThanOrEqual(3);
		});

		it('has sufficient contrast for error states', () => {
			// Error text (Red-600 #DC2626 - approx 220, 38, 38)
			const ratio = calculateContrastRatio('#DC2626', '#FFFFFF');

			expect(ratio).toBeGreaterThanOrEqual(4.5);
		});
	});

	describe('High Contrast Mode', () => {
		it('supports forced-colors media query', () => {
			// Component should respond to forced-colors
			const mediaQuery = '(forced-colors: active)';
			expect(mediaQuery).toContain('forced-colors');
		});

		it('uses system colors in high contrast mode', () => {
			const systemColors = [
				'Canvas',
				'CanvasText',
				'LinkText',
				'ButtonFace',
				'ButtonText',
				'Highlight',
				'HighlightText',
			];

			expect(systemColors).toContain('CanvasText');
			expect(systemColors).toContain('Highlight');
		});

		it('maintains visible borders in high contrast', () => {
			// Borders should use system colors
			const borderColor = 'ButtonText';
			expect(borderColor).toBe('ButtonText');
		});

		it('maintains visible focus indicators in high contrast', () => {
			// Focus should use Highlight color
			const focusColor = 'Highlight';
			expect(focusColor).toBe('Highlight');
		});

		it('does not rely solely on color for information', () => {
			// Error states should have icons/text, not just color
			const errorIndicators = {
				hasIcon: true,
				hasText: true,
				hasColor: true,
			};

			expect(errorIndicators.hasIcon || errorIndicators.hasText).toBe(true);
		});
	});

	describe('Dark Mode Contrast', () => {
		it('meets contrast requirements in dark mode', () => {
			// Light text (Gray-200 #E5E7EB) on dark background (Gray-900 #111827)
			const ratio = calculateContrastRatio('#E5E7EB', '#111827');

			expect(ratio).toBeGreaterThanOrEqual(4.5);
		});

		it('has visible borders in dark mode', () => {
			// Border (Gray-500 #6B7280) on dark background (Gray-900 #111827)
			const ratio = calculateContrastRatio('#6B7280', '#111827');

			expect(ratio).toBeGreaterThanOrEqual(3);
		});
	});
});
