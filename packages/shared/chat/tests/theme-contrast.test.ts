import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const component = fs.readFileSync(path.resolve(process.cwd(), 'src/ChatThreadView.svelte'), 'utf8');
const chatCss = component.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '';
const tokenCss = fs.readFileSync(
	path.resolve(process.cwd(), '../../tokens/dist/theme.css'),
	'utf8'
);

function declarations(css: string, selector: string): string {
	for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
		if (match[1]?.replace(/\/\*[\s\S]*?\*\//g, '').trim() === selector) return match[2] ?? '';
	}
	throw new Error(`Missing CSS block for ${selector}`);
}

function declarationValue(css: string, selector: string, property: string): string {
	const value = Array.from(
		declarations(css, selector).matchAll(new RegExp(`(?:^|;)\\s*${property}\\s*:\\s*([^;]+)`, 'g'))
	)
		.at(-1)?.[1]
		?.trim();
	if (!value) throw new Error(`Missing ${property} declaration for ${selector}`);
	return value;
}

function properties(theme: 'light' | 'dark'): Map<string, string> {
	const values = new Map<string, string>();
	for (const block of [
		declarations(tokenCss, ':root'),
		declarations(tokenCss, `[data-theme="${theme}"]`),
	]) {
		for (const match of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
			if (match[1] && match[2]) values.set(match[1], match[2].trim());
		}
	}
	return values;
}

function resolve(value: string, values: Map<string, string>, seen = new Set<string>()): string {
	if (/^#[\da-f]{6}$/i.test(value.trim())) return value.trim().toLowerCase();
	const variable = value.trim().match(/^var\(\s*(--[\w-]+)\s*(?:,\s*(.+))?\)$/s);
	if (!variable?.[1] || seen.has(variable[1])) throw new Error(`Unresolved CSS value: ${value}`);
	const next = values.get(variable[1]);
	if (next) return resolve(next, values, new Set(seen).add(variable[1]));
	if (variable[2]) return resolve(variable[2], values, new Set(seen).add(variable[1]));
	throw new Error(`Missing emitted token: ${variable[1]}`);
}

function luminance(hex: string): number {
	const channels = hex
		.slice(1)
		.match(/.{2}/g)!
		.map((part) => Number.parseInt(part, 16) / 255)
		.map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
	return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722;
}

function contrast(foreground: string, background: string): number {
	const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
	return (lighter! + 0.05) / (darker! + 0.05);
}

describe('newly-live chat theme cells', () => {
	it.each(['light', 'dark'] as const)(
		'binds message declarations to AA contrast in %s',
		(theme) => {
			const values = properties(theme);
			for (const [name, selector] of [
				[
					'assistant message',
					'.chat-thread-view__message--assistant .chat-thread-view__message-text',
				],
				['system message', '.chat-thread-view__message--system .chat-thread-view__message-text'],
				['branch link', '.chat-thread-view__branch-link'],
				['branch link hover', '.chat-thread-view__branch-link:hover'],
			] as const) {
				const foreground = resolve(declarationValue(chatCss, selector, 'color'), values);
				const background = resolve(declarationValue(chatCss, selector, 'background'), values);
				expect(contrast(foreground, background), name).toBeGreaterThanOrEqual(4.5);
			}
		}
	);
});
