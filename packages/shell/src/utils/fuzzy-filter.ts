/**
 * @fileoverview Dependency-free, strict-CSP-safe filter + ranker for the
 * Greater CommandPalette.
 *
 * Design goals (see issue #647):
 * - No runtime dependencies (no cmdk, no fuzzysort, no Fuse, etc.). The
 *   palette is a source-install component shipped via the shadcn-style CLI;
 *   keeping it dependency-free avoids dragging consumer projects into
 *   license / supply-chain decisions just to render a palette.
 * - No `unsafe-eval`, no dynamic code generation. Pure data transforms over
 *   plain JS strings.
 * - Deterministic: same input → same output (used by tests as a fixed-point).
 * - Token-based: whitespace-separated query tokens must each match somewhere
 *   in the item's searchable text. This matches the way users actually type
 *   (`"hot reload"` finds "Toggle hot reload" but also "Hot reload settings").
 *
 * Ranking heuristic (per item):
 * - For each query token, the best per-token score across `label`,
 *   `description`, and `keywords` is summed:
 *   - Exact full-string match on `label`:           +100
 *   - Prefix match on `label`:                       +60
 *   - Word-boundary match on `label`:                +40
 *   - Substring match on `label`:                    +20
 *   - Same tiers for `description`, scaled by 0.5
 *   - Same tiers for `keywords` (best of any keyword), scaled by 0.7
 * - An item is excluded if any query token has no match anywhere.
 * - Empty query returns all items in their natural order with score 0.
 *
 * The exact numeric scale is internal; consumers should not depend on it.
 * They should use the boolean exclusion semantics + the sorted output.
 *
 * @public
 */

import type { CommandPaletteItem } from '../types.js';

interface SearchableFields {
	label: string;
	description: string;
	keywords: string[];
}

function getSearchableFields(item: CommandPaletteItem): SearchableFields {
	return {
		label: item.label,
		description: item.description ?? '',
		keywords: item.keywords ?? [],
	};
}

/** Tokenize a query into normalized lowercase tokens. */
export function tokenizeQuery(query: string): string[] {
	return query
		.trim()
		.toLowerCase()
		.split(/\s+/)
		.filter((token) => token.length > 0);
}

/**
 * Score a single token against a single string field.
 * Returns 0 when there is no match.
 *
 * The token and field are expected to already be lowercase.
 */
function scoreTokenInField(token: string, field: string): number {
	if (!field || !token) return 0;
	if (field === token) return 100;
	if (field.startsWith(token)) return 60;
	// Word-boundary check (non-alphanumeric followed by token).
	if (
		field.indexOf(' ' + token) >= 0 ||
		field.indexOf('-' + token) >= 0 ||
		field.indexOf('_' + token) >= 0 ||
		field.indexOf('/' + token) >= 0 ||
		field.indexOf('.' + token) >= 0
	) {
		return 40;
	}
	if (field.indexOf(token) >= 0) return 20;
	return 0;
}

/** Score a single token across all searchable fields of one item. */
function scoreTokenForItem(token: string, item: CommandPaletteItem): number {
	const fields = getSearchableFields(item);
	const labelLower = fields.label.toLowerCase();
	const descLower = fields.description.toLowerCase();

	const labelScore = scoreTokenInField(token, labelLower);
	const descScore = scoreTokenInField(token, descLower) * 0.5;

	let keywordsScore = 0;
	for (const kw of fields.keywords) {
		const s = scoreTokenInField(token, kw.toLowerCase()) * 0.7;
		if (s > keywordsScore) keywordsScore = s;
	}

	return Math.max(labelScore, descScore, keywordsScore);
}

/**
 * Built-in scorer: returns a numeric score (higher = better) when the item
 * matches every token in the query, or `null` when any token has no match.
 *
 * An empty query (no tokens) returns 0 (include everything, no preference).
 *
 * @public
 */
export function scoreCommandPaletteItem(item: CommandPaletteItem, query: string): number | null {
	const tokens = tokenizeQuery(query);
	if (tokens.length === 0) return 0;

	let total = 0;
	for (const token of tokens) {
		const tokenScore = scoreTokenForItem(token, item);
		if (tokenScore === 0) return null;
		total += tokenScore;
	}
	return total;
}

/**
 * Filter and rank a flat item list.
 *
 * Returns items with `score >= 0`, sorted by descending score, then by
 * natural array order for ties. Disabled items remain in results (the
 * palette still shows them); consumers decide how to render disabled.
 *
 * @public
 */
export function filterAndRankItems(
	items: CommandPaletteItem[],
	query: string
): CommandPaletteItem[] {
	const tokens = tokenizeQuery(query);
	if (tokens.length === 0) return items.slice();

	const scored: Array<{ item: CommandPaletteItem; score: number; index: number }> = [];
	for (let i = 0; i < items.length; i++) {
		const item = items[i]!;
		const score = scoreCommandPaletteItem(item, query);
		if (score !== null) scored.push({ item, score, index: i });
	}
	scored.sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score;
		return a.index - b.index;
	});
	return scored.map((entry) => entry.item);
}
