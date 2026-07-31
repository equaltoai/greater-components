import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';

export interface LinkifyOptions {
	/**
	 * Base URL for user mentions (e.g., "https://mastodon.social/@")
	 */
	mentionBaseUrl?: string;
	/**
	 * Base URL for hashtags (e.g., "https://mastodon.social/tags/")
	 */
	hashtagBaseUrl?: string;
	/**
	 * CSS class for mention links
	 */
	mentionClass?: string;
	/**
	 * CSS class for hashtag links
	 */
	hashtagClass?: string;
	/**
	 * CSS class for URL links
	 */
	urlClass?: string;
	/**
	 * Whether to open links in new tab
	 */
	openInNewTab?: boolean;
	/**
	 * Maximum length for URL display text
	 */
	maxUrlLength?: number;
	/**
	 * Whether to add rel="nofollow" to links
	 */
	nofollow?: boolean;
}

/**
 * Regular expressions for matching patterns
 */
const PATTERNS = {
	// Matches @username@domain.com or @username
	mention: /(?:^|\s)(@[\w\-.]+(?:@[\w\-.]+)?)/g,
	// Matches #hashtag (with Unicode support)
	hashtag: /(?:^|\s)(#[\p{L}\p{N}_]+)/gu,
	// Matches URLs (simplified pattern)
	url: /(?:^|\s)((?:https?:\/\/)?(?:[\w-]+\.)+[a-z]{2,}(?:\/[^\s]*)?)/gi,
	// Email pattern
	email: /(?:^|\s)([\w\-.]+@[\w\-.]+\.[a-z]{2,})/gi,
};

/**
 * Escape HTML special characters
 */
const htmlEscapeMap: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
};

function escapeHtml(text: string): string {
	return text.replace(/[&<>"']/g, (char) => htmlEscapeMap[char] ?? char);
}

/**
 * Truncate URL for display
 */
function truncateUrl(url: string, maxLength: number): string {
	if (url.length <= maxLength) return url;

	const urlObj = new URL(url);
	const domain = urlObj.hostname;

	if (domain.length >= maxLength - 3) {
		return domain.substring(0, maxLength - 3) + '...';
	}

	const pathLength = maxLength - domain.length - 3;
	const path = urlObj.pathname + urlObj.search + urlObj.hash;

	if (path.length <= pathLength) {
		return domain + path;
	}

	return domain + path.substring(0, pathLength) + '...';
}

/**
 * Convert mentions, hashtags, and URLs in text to clickable links
 * @param text - The text to linkify
 * @param options - Linkify options
 * @returns HTML string with links
 */
export function linkifyMentions(text: string, options: LinkifyOptions = {}): string {
	const {
		mentionBaseUrl = '/users/',
		hashtagBaseUrl = '/tags/',
		mentionClass = 'mention',
		hashtagClass = 'hashtag',
		urlClass = 'url',
		openInNewTab = true,
		maxUrlLength = 30,
		nofollow = true,
	} = options;

	let result = escapeHtml(text);
	const targetAttr = openInNewTab ? ' target="_blank"' : '';
	const relValue =
		`${openInNewTab ? 'noopener noreferrer' : ''}${nofollow ? ' nofollow' : ''}`.trim();
	const relAttr = relValue ? ` rel="${relValue}"` : '';

	// Process URLs first (to avoid linkifying URLs within other patterns)
	result = result.replace(PATTERNS.url, (match, url) => {
		const href = url.startsWith('http') ? url : `https://${url}`;
		try {
			new URL(href); // Validate URL
			const displayText = truncateUrl(href, maxUrlLength);
			return ` <a href="${href}" class="${urlClass}"${targetAttr}${relAttr}>${displayText}</a>`;
		} catch {
			return match; // Invalid URL, return as-is
		}
	});

	// Process mentions
	result = result.replace(PATTERNS.mention, (_match, mention) => {
		const username = mention.substring(1); // Remove @
		const href = mentionBaseUrl + username;
		return ` <a href="${href}" class="${mentionClass}"${targetAttr}${relAttr}>${mention}</a>`;
	});

	// Process hashtags
	result = result.replace(PATTERNS.hashtag, (_match, hashtag) => {
		const tag = hashtag.substring(1); // Remove #
		const href = hashtagBaseUrl + encodeURIComponent(tag);
		return ` <a href="${href}" class="${hashtagClass}"${targetAttr}${relAttr}>${hashtag}</a>`;
	});

	return result.trim();
}

/**
 * Reference to a mention supplied alongside a status payload.
 */
export interface LinkifyMentionRef {
	/** Bare username, without the leading `@` */
	username: string;
	/** Canonical profile URL for the mention */
	url?: string;
}

/**
 * Reference to a hashtag supplied alongside a status payload.
 */
export interface LinkifyTagRef {
	/** Tag name, without the leading `#` */
	name: string;
	/** Canonical tag URL */
	url?: string;
}

export interface LinkifyHtmlOptions extends LinkifyOptions {
	/**
	 * Known mentions to linkify. When either `mentions` or `tags` is non-empty,
	 * only those are linkified and generic pattern matching is skipped.
	 */
	mentions?: LinkifyMentionRef[];
	/** Known hashtags to linkify. See `mentions` for precedence. */
	tags?: LinkifyTagRef[];
}

/** Protocols permitted on generated link hrefs. */
const LINKIFY_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

/** Elements whose descendants are never linkified. */
const LINKIFY_SKIP_TAGS = new Set(['a', 'code', 'pre']);

/** Ordered alternation: URLs win over mentions, mentions over hashtags. */
const GENERIC_LINK_SOURCE =
	'(^|\\s)(?:' +
	'((?:https?:\\/\\/)?(?:[\\w-]+\\.)+[a-z]{2,}(?:\\/[^\\s]*)?)' +
	'|(@[\\w\\-.]+(?:@[\\w\\-.]+)?)' +
	'|(#[\\p{L}\\p{N}_]+)' +
	')';

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Validate an href that may be relative. Returns null when the URL is missing,
 * unparseable, or uses a protocol outside the allow-list (e.g. `javascript:`).
 */
function toSafeHref(url: string | undefined): string | null {
	if (!url || typeof url !== 'string') return null;
	const trimmed = url.trim();
	if (!trimmed) return null;

	try {
		const parsed = new URL(trimmed, 'https://example.invalid');
		if (!LINKIFY_PROTOCOLS.has(parsed.protocol)) return null;
		return trimmed;
	} catch {
		return null;
	}
}

/** As `toSafeHref`, but the URL must resolve on its own without a base. */
function toSafeAbsoluteHref(url: string): string | null {
	try {
		const parsed = new URL(url);
		if (!LINKIFY_PROTOCOLS.has(parsed.protocol)) return null;
		return url;
	} catch {
		return null;
	}
}

/**
 * Minimal structural view of the HTML AST rehype produces. Declared locally
 * rather than imported from `hast` so this file needs no type-only package when
 * consumers vendor it through the CLI.
 */
interface LinkifyNode {
	type: string;
	children?: LinkifyNode[];
}

interface LinkifyTextNode extends LinkifyNode {
	type: 'text';
	value: string;
}

interface LinkifyElementNode extends LinkifyNode {
	type: 'element';
	tagName: string;
	properties: Record<string, unknown>;
	children: LinkifyNode[];
}

function textNode(value: string): LinkifyTextNode {
	return { type: 'text', value };
}

function isTextNode(node: LinkifyNode): node is LinkifyTextNode {
	return node.type === 'text';
}

function isElementNode(node: LinkifyNode): node is LinkifyElementNode {
	return node.type === 'element';
}

type LinkifySegment = LinkifyTextNode | LinkifyElementNode;

/**
 * Replace pattern matches inside text segments with generated nodes. Element
 * segments produced by an earlier pass are left alone, so a run of text is
 * never linkified twice.
 */
function splitSegments(
	segments: LinkifySegment[],
	pattern: RegExp,
	build: (match: RegExpExecArray) => LinkifySegment[] | null
): LinkifySegment[] {
	const out: LinkifySegment[] = [];

	for (const segment of segments) {
		if (!isTextNode(segment)) {
			out.push(segment);
			continue;
		}

		const { value } = segment;
		const pending: LinkifySegment[] = [];
		let cursor = 0;

		pattern.lastIndex = 0;
		let match = pattern.exec(value);

		while (match !== null) {
			const replacement = build(match);

			if (replacement) {
				if (match.index > cursor) {
					pending.push(textNode(value.slice(cursor, match.index)));
				}
				pending.push(...replacement);
				cursor = match.index + match[0].length;
			}

			// Guard against a zero-length match stalling the scan.
			if (pattern.lastIndex === match.index) pattern.lastIndex += 1;
			match = pattern.exec(value);
		}

		if (pending.length === 0) {
			out.push(segment);
			continue;
		}

		if (cursor < value.length) {
			pending.push(textNode(value.slice(cursor)));
		}

		out.push(...pending);
	}

	return out;
}

/**
 * Walk a child list, rewriting text nodes and recursing into elements that are
 * not linkification barriers.
 */
function linkifyChildren(
	children: readonly LinkifyNode[],
	transform: (text: LinkifyTextNode) => LinkifySegment[] | null
): LinkifyNode[] {
	const out: LinkifyNode[] = [];

	for (const child of children) {
		if (isTextNode(child)) {
			const replaced = transform(child);
			out.push(...(replaced ?? [child]));
			continue;
		}

		if (isElementNode(child) && !LINKIFY_SKIP_TAGS.has(child.tagName)) {
			child.children = linkifyChildren(child.children, transform);
		}

		out.push(child);
	}

	return out;
}

/**
 * Linkify mentions, hashtags, and URLs inside **already-sanitized** HTML.
 *
 * Unlike {@link linkifyMentions}, which takes plain text and escapes it, this
 * treats its input as trusted markup: it parses the HTML and rewrites text
 * nodes only, so existing tags survive intact instead of being escaped into
 * literal `&lt;p&gt;`. Text content and generated attribute values are escaped
 * by the HTML serializer, and generated hrefs are protocol-checked.
 *
 * This is not a sanitizer. Callers must sanitize `html` first — anything unsafe
 * in the input stays unsafe in the output.
 */
export function linkifyHtml(html: string, options: LinkifyHtmlOptions = {}): string {
	if (!html || typeof html !== 'string') return '';

	const {
		mentionBaseUrl = '/users/',
		hashtagBaseUrl = '/tags/',
		mentionClass = 'mention',
		hashtagClass = 'hashtag',
		urlClass = 'url',
		openInNewTab = true,
		maxUrlLength = 30,
		nofollow = true,
		mentions = [],
		tags = [],
	} = options;

	const relValue =
		`${openInNewTab ? 'noopener noreferrer' : ''}${nofollow ? ' nofollow' : ''}`.trim();

	const anchor = (href: string, className: string, label: string): LinkifyElementNode => ({
		type: 'element',
		tagName: 'a',
		properties: {
			href,
			className: [className],
			...(relValue ? { rel: relValue.split(' ') } : {}),
			...(openInNewTab ? { target: '_blank' } : {}),
		},
		children: [textNode(label)],
	});

	const useKnownEntities = mentions.length > 0 || tags.length > 0;

	const transform = (text: LinkifyTextNode): LinkifySegment[] | null => {
		let segments: LinkifySegment[] = [text];

		if (useKnownEntities) {
			for (const mention of mentions) {
				const href = toSafeHref(mention?.url);
				if (!href || !mention.username) continue;

				const pattern = new RegExp(`@${escapeRegExp(mention.username)}(?:@[\\w.-]+)?`, 'g');
				segments = splitSegments(segments, pattern, (match) => [
					anchor(href, mentionClass, match[0]),
				]);
			}

			for (const tag of tags) {
				const href = toSafeHref(tag?.url);
				if (!href || !tag.name) continue;

				const pattern = new RegExp(`#${escapeRegExp(tag.name)}\\b`, 'gi');
				segments = splitSegments(segments, pattern, (match) => [
					anchor(href, hashtagClass, match[0]),
				]);
			}
		} else {
			segments = splitSegments(segments, new RegExp(GENERIC_LINK_SOURCE, 'giu'), (match) => {
				const [, boundary = '', url, mention, hashtag] = match;
				const lead: LinkifySegment[] = boundary ? [textNode(boundary)] : [];

				if (url) {
					const href = toSafeAbsoluteHref(url.startsWith('http') ? url : `https://${url}`);
					if (!href) return null;
					return [...lead, anchor(href, urlClass, truncateUrl(href, maxUrlLength))];
				}

				if (mention) {
					const href = toSafeHref(mentionBaseUrl + mention.slice(1));
					if (!href) return null;
					return [...lead, anchor(href, mentionClass, mention)];
				}

				if (hashtag) {
					const href = toSafeHref(hashtagBaseUrl + encodeURIComponent(hashtag.slice(1)));
					if (!href) return null;
					return [...lead, anchor(href, hashtagClass, hashtag)];
				}

				return null;
			});
		}

		return segments.length === 1 && segments[0] === text ? null : segments;
	};

	const processor = unified().use(rehypeParse, { fragment: true }).use(rehypeStringify);
	const tree = processor.parse(html);

	// The local node types mirror the subset of hast rehype emits here.
	const root = tree as unknown as LinkifyNode;
	root.children = linkifyChildren(root.children ?? [], transform);

	return processor.stringify(tree);
}

/**
 * Extract mentions from text
 * @param text - The text to extract mentions from
 * @returns Array of mentions (without @ prefix)
 */
export function extractMentions(text: string): string[] {
	const mentions: string[] = [];

	PATTERNS.mention.lastIndex = 0;
	let match = PATTERNS.mention.exec(text);
	while (match !== null) {
		if (match[1]) {
			mentions.push(match[1].substring(1)); // Remove @ prefix
		}
		match = PATTERNS.mention.exec(text);
	}

	return [...new Set(mentions)]; // Remove duplicates
}

/**
 * Extract hashtags from text
 * @param text - The text to extract hashtags from
 * @returns Array of hashtags (without # prefix)
 */
export function extractHashtags(text: string): string[] {
	const hashtags: string[] = [];

	PATTERNS.hashtag.lastIndex = 0;
	let match = PATTERNS.hashtag.exec(text);
	while (match !== null) {
		if (match[1]) {
			hashtags.push(match[1].substring(1)); // Remove # prefix
		}
		match = PATTERNS.hashtag.exec(text);
	}

	return [...new Set(hashtags)]; // Remove duplicates
}

/**
 * Extract URLs from text
 * @param text - The text to extract URLs from
 * @returns Array of URLs
 */
export function extractUrls(text: string): string[] {
	const urls: string[] = [];

	PATTERNS.url.lastIndex = 0;
	let match = PATTERNS.url.exec(text);
	while (match !== null) {
		const url = match[1];
		if (url) {
			const href = url.startsWith('http') ? url : `https://${url}`;
			try {
				new URL(href); // Validate URL
				urls.push(href);
			} catch {
				// Invalid URL, skip
			}
		}
		match = PATTERNS.url.exec(text);
	}

	return [...new Set(urls)]; // Remove duplicates
}

/**
 * Check if text contains mentions
 */
export function hasMentions(text: string): boolean {
	PATTERNS.mention.lastIndex = 0;
	return PATTERNS.mention.test(text);
}

/**
 * Check if text contains hashtags
 */
export function hasHashtags(text: string): boolean {
	PATTERNS.hashtag.lastIndex = 0;
	return PATTERNS.hashtag.test(text);
}

/**
 * Check if text contains URLs
 */
export function hasUrls(text: string): boolean {
	PATTERNS.url.lastIndex = 0;
	return PATTERNS.url.test(text);
}
