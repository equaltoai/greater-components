import { describe, it, expect } from 'vitest';
import {
	scoreCommandPaletteItem,
	filterAndRankItems,
	tokenizeQuery,
} from '../src/utils/fuzzy-filter.js';
import type { CommandPaletteItem } from '../src/types.js';

const items: CommandPaletteItem[] = [
	{ id: 'overview', label: 'Overview', description: 'Fleet overview', keywords: ['home', 'fleet'] },
	{ id: 'instances', label: 'Instances', description: 'Provisioned instances' },
	{ id: 'instance-detail', label: 'Instance detail', keywords: ['single'] },
	{ id: 'billing', label: 'Billing & invoicing', description: 'Monthly cycles' },
	{ id: 'theme-toggle', label: 'Toggle theme', keywords: ['dark', 'light', 'mode'] },
	{ id: 'disabled', label: 'Disabled action', disabled: true },
];

describe('tokenizeQuery', () => {
	it('returns empty array for empty / whitespace query', () => {
		expect(tokenizeQuery('')).toEqual([]);
		expect(tokenizeQuery('   ')).toEqual([]);
	});

	it('splits on whitespace and lowercases', () => {
		expect(tokenizeQuery('Hot Reload')).toEqual(['hot', 'reload']);
		expect(tokenizeQuery('   FOO  bar   ')).toEqual(['foo', 'bar']);
	});
});

describe('scoreCommandPaletteItem (built-in scorer)', () => {
	it('returns 0 for empty query (include everything)', () => {
		for (const item of items) {
			expect(scoreCommandPaletteItem(item, '')).toBe(0);
			expect(scoreCommandPaletteItem(item, '   ')).toBe(0);
		}
	});

	it('exact full-string label match ranks above prefix / substring', () => {
		const target = items[0]!; // "Overview"
		const exact = scoreCommandPaletteItem(target, 'Overview');
		const prefix = scoreCommandPaletteItem(target, 'Over');
		const sub = scoreCommandPaletteItem(target, 'view');
		expect(exact).not.toBeNull();
		expect(prefix).not.toBeNull();
		expect(sub).not.toBeNull();
		expect(exact!).toBeGreaterThan(prefix!);
		expect(prefix!).toBeGreaterThan(sub!);
	});

	it('returns null when any token has no match anywhere', () => {
		const target = items[0]!; // "Overview / Fleet overview / [home, fleet]"
		expect(scoreCommandPaletteItem(target, 'overview zzzzz')).toBeNull();
		expect(scoreCommandPaletteItem(target, 'zzz')).toBeNull();
	});

	it('ranks label matches above description matches', () => {
		const labelMatch = scoreCommandPaletteItem(items[1]!, 'Instances'); // label exact
		const descOnly = scoreCommandPaletteItem(items[3]!, 'cycles'); // description substring
		expect(labelMatch!).toBeGreaterThan(descOnly!);
	});

	it('matches against keywords', () => {
		// "dark" is only present as a keyword on theme-toggle
		const result = scoreCommandPaletteItem(items[4]!, 'dark');
		expect(result).not.toBeNull();
		expect(result!).toBeGreaterThan(0);
	});

	it('multi-token queries require every token to match somewhere', () => {
		// items[0]: label "Overview", description "Fleet overview", keywords ["home","fleet"]
		// "fleet overview" → both match
		expect(scoreCommandPaletteItem(items[0]!, 'fleet overview')).not.toBeNull();
		// "fleet zzz" → second token has no match
		expect(scoreCommandPaletteItem(items[0]!, 'fleet zzz')).toBeNull();
	});

	it('is case-insensitive', () => {
		const lower = scoreCommandPaletteItem(items[0]!, 'overview');
		const upper = scoreCommandPaletteItem(items[0]!, 'OVERVIEW');
		const mixed = scoreCommandPaletteItem(items[0]!, 'OvErVieW');
		expect(lower).toBe(upper);
		expect(lower).toBe(mixed);
	});
});

describe('filterAndRankItems', () => {
	it('returns all items in natural order when query is empty', () => {
		const result = filterAndRankItems(items, '');
		expect(result.map((it) => it.id)).toEqual(items.map((it) => it.id));
	});

	it('returns only items that match every query token', () => {
		const result = filterAndRankItems(items, 'instance');
		expect(result.map((it) => it.id)).toEqual(['instances', 'instance-detail']);
	});

	it('ranks better matches first', () => {
		const result = filterAndRankItems(items, 'instance');
		// "Instances" prefix match (rank 60) vs "Instance detail" prefix match (rank 60);
		// tie broken by natural order, so "instances" stays first.
		expect(result[0]?.id).toBe('instances');
	});

	it('ranks an exact label match above other matches with the same token', () => {
		const fixture: CommandPaletteItem[] = [
			{ id: 'b', label: 'About', description: 'Cat info', keywords: [] },
			{ id: 'a', label: 'Cat', description: 'A cat page', keywords: [] }, // exact label match
			{ id: 'c', label: 'Catalog', description: '', keywords: [] }, // prefix match
		];
		const result = filterAndRankItems(fixture, 'cat');
		// Exact "Cat" first, then prefix "Catalog", then substring "About"
		expect(result.map((it) => it.id)).toEqual(['a', 'c', 'b']);
	});

	it('excludes items where any token does not match', () => {
		const result = filterAndRankItems(items, 'fleet zzzzz');
		expect(result).toEqual([]);
	});

	it('keeps disabled items in results (renderer decides how to show them)', () => {
		const result = filterAndRankItems(items, 'disabled');
		expect(result.find((it) => it.id === 'disabled')).toBeDefined();
	});

	it('uses keywords for matching even when label/description omit the term', () => {
		const result = filterAndRankItems(items, 'dark');
		expect(result.map((it) => it.id)).toContain('theme-toggle');
	});

	it('matches across whitespace tokens out of order', () => {
		const fixture: CommandPaletteItem[] = [
			{ id: 'a', label: 'Switch to dark mode' },
			{ id: 'b', label: 'Switch to light mode' },
		];
		const result = filterAndRankItems(fixture, 'mode dark');
		expect(result.map((it) => it.id)).toEqual(['a']);
	});
});
