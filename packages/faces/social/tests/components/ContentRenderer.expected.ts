/**
 * Shared expectations for ContentRenderer's rendered body (issue #926).
 *
 * The SSR suite asserts the server output contains these strings and the DOM
 * suite asserts the client-rendered `.content` element contains the same ones.
 * Asserting both sides against one set of constants is what makes SSR output
 * and hydrated DOM provably identical for these inputs.
 */

import { linkifyHtml, sanitizeHtml } from '@equaltoai/greater-components-utils';
import type { Mention, Tag } from '../../src/types';

/** Mirrors ContentRenderer's sanitize + linkify pipeline. */
const ALLOWED_TAGS = [
	'p',
	'br',
	'span',
	'a',
	'del',
	'pre',
	'code',
	'em',
	'strong',
	'b',
	'i',
	'u',
	's',
	'strike',
	'ul',
	'ol',
	'li',
	'blockquote',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
];

const ALLOWED_ATTRIBUTES = ['href', 'title', 'class', 'rel', 'target'];

/**
 * Recompute the exact body markup ContentRenderer should produce, from the same
 * pure functions the component calls. Both the SSR suite and the DOM suite
 * assert against this, which is what proves server and client agree.
 */
export function expectedBody(
	content: string,
	options: { mentions?: Mention[]; tags?: Tag[] } = {}
): string {
	return linkifyHtml(
		sanitizeHtml(content, {
			allowedTags: ALLOWED_TAGS,
			allowedAttributes: ALLOWED_ATTRIBUTES,
		}),
		{
			mentions: options.mentions ?? [],
			tags: options.tags ?? [],
			openInNewTab: true,
			nofollow: false,
		}
	);
}

export const MENTIONS: Mention[] = [
	{
		id: 'm1',
		username: 'alice',
		acct: 'alice@example.com',
		url: 'https://example.com/@alice',
	},
];

export const TAGS: Tag[] = [{ name: 'svelte', url: 'https://example.com/tags/svelte' }];

interface ContentCase {
	name: string;
	content: string;
	mentions?: Mention[];
	tags?: Tag[];
	/** Fragments that must appear verbatim in both SSR output and client DOM. */
	expected: string[];
	/** Fragments that must appear in neither. */
	forbidden: string[];
}

export const CONTENT_CASES: ContentCase[] = [
	{
		// The exact example from issue #926.
		name: 'mention-less markup',
		content: '<p>Hello <strong>world</strong></p>',
		expected: ['<p>Hello <strong>world</strong></p>'],
		forbidden: ['&lt;p&gt;', '&lt;strong&gt;'],
	},
	{
		name: 'mention-bearing content with known mentions',
		content: '<p>Hello @alice</p>',
		mentions: MENTIONS,
		expected: ['<a href="https://example.com/@alice" class="mention"', '>@alice</a>'],
		forbidden: ['&lt;p&gt;', '&lt;a href'],
	},
	{
		name: 'mixed markup, mention and tag',
		content: '<p>Hello <strong>world</strong> @alice about #svelte</p>',
		mentions: MENTIONS,
		tags: TAGS,
		expected: [
			'<strong>world</strong>',
			'<a href="https://example.com/@alice" class="mention"',
			'<a href="https://example.com/tags/svelte" class="hashtag"',
		],
		forbidden: ['&lt;p&gt;', '&lt;strong&gt;'],
	},
	{
		name: 'generic linkification without known entities',
		content: '<p>Hello <em>there</em> @bob and #greater</p>',
		expected: [
			'<em>there</em>',
			'<a href="/users/bob" class="mention"',
			'<a href="/tags/greater" class="hashtag"',
		],
		forbidden: ['&lt;p&gt;', '&lt;em&gt;'],
	},
];
