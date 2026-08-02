import { sanitizeHtml } from '@equaltoai/greater-components-utils';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import type { Element, Root } from 'hast';

const RAW_TEXT_ELEMENTS_TO_DROP = [
	'style',
	'textarea',
	'title',
	'iframe',
	'noembed',
	'noframes',
	'xmp',
	'plaintext',
] as const;
const BLOCK_SEPARATOR_TAGS =
	/<(?:br|\/(?:p|pre|blockquote|li|ul|ol|h[1-6]))\b(?:"[^"]*"|'[^']*'|[^'">])*>/giu;
const HTML_TAG = /<(?:"[^"]*"|'[^']*'|[^'">])*>/gu;

function findTagEnd(html: string, start: number): number {
	let quote: '"' | "'" | undefined;

	for (let index = start; index < html.length; index += 1) {
		const character = html[index];
		if (quote) {
			if (character === quote) quote = undefined;
			continue;
		}

		if (character === '"' || character === "'") {
			quote = character;
		} else if (character === '>') {
			return index;
		}
	}

	return html.length - 1;
}

/**
 * Drop raw-text elements whose contents must not become readable message text.
 *
 * The shared sanitizer intentionally preserves the text children of most
 * disallowed elements. Messaging is a less-trusted surface: CSS source inside
 * raw-text elements is neither message content nor a useful preview, so remove
 * the complete element before applying the shared allow-list sanitizer.
 */
function dropRawTextElements(html: string): string {
	let result = html;

	for (const tagName of RAW_TEXT_ELEMENTS_TO_DROP) {
		const openingTag = new RegExp(`<${tagName}(?=[\\s/>])`, 'giu');
		const closingTag = new RegExp(`</${tagName}(?=[\\s>])`, 'giu');
		let cursor = 0;
		let cleaned = '';

		while (cursor < result.length) {
			openingTag.lastIndex = cursor;
			const openingMatch = openingTag.exec(result);
			if (!openingMatch) {
				cleaned += result.slice(cursor);
				break;
			}

			cleaned += result.slice(cursor, openingMatch.index);
			const openingEnd = findTagEnd(result, openingMatch.index);
			closingTag.lastIndex = openingEnd + 1;
			const closingMatch = closingTag.exec(result);
			if (!closingMatch) {
				// HTML parsers treat an unclosed raw-text element as consuming the rest
				// of the fragment, so the safe readable result ends here as well.
				break;
			}

			cursor = findTagEnd(result, closingMatch.index) + 1;
		}

		result = cleaned;
	}

	return result;
}

const htmlFragmentProcessor = unified().use(rehypeParse, { fragment: true }).use(rehypeStringify);

function relTokens(element: Element): string[] {
	const rel = element.properties['rel'];
	if (Array.isArray(rel)) return rel.map(String).filter(Boolean);
	if (typeof rel === 'string') return rel.split(/\s+/u).filter(Boolean);
	return [];
}

function hardenExternalAnchors(node: Root | Element): void {
	for (const child of node.children) {
		if (child.type !== 'element') continue;

		if (
			child.tagName === 'a' &&
			typeof child.properties['href'] === 'string' &&
			/^(?:https?:)?\/\//iu.test(child.properties['href'])
		) {
			const tokens = relTokens(child);
			const normalizedTokens = new Set(tokens.map((token) => token.toLowerCase()));

			for (const requiredToken of ['noopener', 'noreferrer']) {
				if (!normalizedTokens.has(requiredToken)) {
					tokens.push(requiredToken);
					normalizedTokens.add(requiredToken);
				}
			}

			child.properties['rel'] = tokens;
		}

		hardenExternalAnchors(child);
	}
}

function secureExternalLinks(html: string): string {
	const tree = htmlFragmentProcessor.parse(html) as Root;
	hardenExternalAnchors(tree);
	return htmlFragmentProcessor.stringify(tree);
}

function decodeSerializedText(text: string): string {
	return text.replace(
		/&#(?:x([\da-f]+)|(\d+));?|&(amp|lt|gt|quot|apos);/giu,
		(reference, hexadecimal: string | undefined, decimal: string | undefined, named: string) => {
			if (named) {
				return (
					{
						amp: '&',
						lt: '<',
						gt: '>',
						quot: '"',
						apos: "'",
					} as const
				)[named.toLowerCase() as 'amp' | 'lt' | 'gt' | 'quot' | 'apos'];
			}

			const codePoint = Number.parseInt(hexadecimal ?? decimal ?? '', hexadecimal ? 16 : 10);
			if (
				!Number.isFinite(codePoint) ||
				codePoint <= 0 ||
				codePoint > 0x10ffff ||
				(codePoint >= 0xd800 && codePoint <= 0xdfff)
			) {
				return reference;
			}
			return String.fromCodePoint(codePoint);
		}
	);
}

/** @internal Exported only for direct fixed-point regression coverage. */
export function stripSerializedMarkup(serialized: string): string {
	let text = serialized;
	let previous: string;
	let iterations = 0;
	const maxIterations = serialized.length + 1;

	// CodeQL js/incomplete-multi-character-sanitization: removing one tag can expose
	// another across the joined boundary. Iterate the quote-aware tag-strip chain to
	// a fixed point; every changing pass shortens the text, so this bound must converge.
	do {
		previous = text;
		text = text.replace(BLOCK_SEPARATOR_TAGS, ' ').replace(HTML_TAG, '');
		iterations += 1;
	} while (text !== previous && iterations < maxIterations);

	return text;
}

/** Sanitize server-authored message HTML for the {@html} message-body sink. */
export function sanitizeMessageHtml(dirty: string): string {
	return secureExternalLinks(
		sanitizeHtml(dropRawTextElements(dirty), {
			addRelToExternalLinks: false,
			externalLinksInNewTab: false,
		})
	).trim();
}

/** Extract a decoded, markup-free and Unicode-safe message-list preview. */
export function sanitizeMessagePreview(dirty: string, maxLength = 200): string {
	if (!dirty || typeof dirty !== 'string') return '';

	const serialized = sanitizeMessageHtml(dirty);
	const text = decodeSerializedText(stripSerializedMarkup(serialized)).replace(/\s+/gu, ' ').trim();
	const characters = Array.from(text);

	if (characters.length <= maxLength) return text;
	return `${characters.slice(0, Math.max(0, maxLength)).join('').trim()}...`;
}
