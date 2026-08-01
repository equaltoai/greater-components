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

/**
 * Elements whose descendants are never linkified.
 *
 * `a`, `code` and `pre` are prose barriers: an anchor cannot nest, and the other
 * two render their text literally. The rest are HTML raw-text and
 * escapable-raw-text elements, whose character data is a script, a stylesheet or
 * a control value rather than prose. `linkifyHtml` is not a sanitizer, so a
 * caller whose sanitizer policy retains any of them must get their contents back
 * unmodified instead of rewritten into serialized anchors.
 */
const LINKIFY_SKIP_TAGS = new Set([
	'a',
	'code',
	'pre',
	'script',
	'style',
	'textarea',
	'title',
	'iframe',
	'noembed',
	'noframes',
	'noscript',
	'plaintext',
	'xmp',
]);

/** Ordered alternation: URLs win over mentions, mentions over hashtags. */
const GENERIC_LINK_SOURCE =
	'(^|\\s)(?:' +
	'((?:https?:\\/\\/)?(?:[\\w-]+\\.)+[a-z]{2,}(?:\\/[^\\s]*)?)' +
	'|(@[\\w\\-.]+(?:@[\\w\\-.]+)?)' +
	'|(#[\\p{L}\\p{N}_]+)' +
	')';

/**
 * Sentinel origin relative hrefs are resolved against. Any relative form that
 * leaves this origin once resolved addresses another host and is rejected.
 */
const LINKIFY_RELATIVE_BASE = 'https://linkify.invalid';

function parseUrl(value: string, base?: string): URL | null {
	try {
		return new URL(value, base);
	} catch {
		return null;
	}
}

/**
 * Validate an href that may be relative.
 *
 * Absolute URLs must use an allow-listed protocol. Relative URLs must still
 * resolve to the sentinel origin once parsed, which rejects the shapes that read
 * as relative but address another host: `//evil.example/p`, `\\evil.example\p`
 * and `/\evil.example/p` are all authority references under WHATWG URL rules and
 * would inherit the page's scheme rather than stay on its origin.
 *
 * Returns null when the URL is missing, unparseable, off-origin, or uses a
 * protocol outside the allow-list (e.g. `javascript:`).
 */
function toSafeHref(url: string | undefined): string | null {
	if (!url || typeof url !== 'string') return null;
	const trimmed = url.trim();
	if (!trimmed) return null;

	const absolute = parseUrl(trimmed);
	if (absolute) {
		return LINKIFY_PROTOCOLS.has(absolute.protocol) ? trimmed : null;
	}

	const resolved = parseUrl(trimmed, LINKIFY_RELATIVE_BASE);
	if (!resolved) return null;
	if (!LINKIFY_PROTOCOLS.has(resolved.protocol)) return null;
	if (resolved.origin !== LINKIFY_RELATIVE_BASE) return null;
	return trimmed;
}

/** As `toSafeHref`, but the URL must resolve on its own without a base. */
function toSafeAbsoluteHref(url: string): string | null {
	const parsed = parseUrl(url);
	if (!parsed) return null;
	return LINKIFY_PROTOCOLS.has(parsed.protocol) ? url : null;
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

interface LinkifyReplacement {
	nodes: LinkifySegment[];
	/**
	 * How many characters of the match `nodes` account for. Defaults to the whole
	 * match; a shorter value hands the unconsumed tail back to the scanner as
	 * text, which is how a token that picked up trailing prose punctuation links
	 * only its resolved prefix.
	 */
	consumed?: number;
}

/**
 * Append every element of `source` to `target`.
 *
 * `target.push(...source)` passes one argument per element, so a long source
 * array exceeds the engine's argument-count limit rather than the heap: Node 24
 * throws `RangeError: Maximum call stack size exceeded` once a single text node
 * yields roughly 70,000 segments, which a ~540 kB federated status reaches. The
 * append has to be bounded by the array length, not by the call stack.
 */
function appendAll<T>(target: T[], source: readonly T[]): void {
	for (const item of source) {
		target.push(item);
	}
}

/**
 * Replace pattern matches inside text segments with generated nodes. Element
 * segments produced by an earlier pass are left alone, so a run of text is
 * never linkified twice.
 */
function splitSegments(
	segments: LinkifySegment[],
	pattern: RegExp,
	build: (match: RegExpExecArray) => LinkifyReplacement | null
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
				appendAll(pending, replacement.nodes);
				cursor = match.index + (replacement.consumed ?? match[0].length);
				pattern.lastIndex = cursor;
			}

			// Guard against a zero-length match, or an unconsumed prefix, stalling the scan.
			if (pattern.lastIndex <= match.index) pattern.lastIndex = match.index + 1;
			match = pattern.exec(value);
		}

		if (pending.length === 0) {
			out.push(segment);
			continue;
		}

		if (cursor < value.length) {
			pending.push(textNode(value.slice(cursor)));
		}

		appendAll(out, pending);
	}

	return out;
}

/**
 * Characters a mention or hashtag token may be built from. This is the scanning
 * alphabet, not a validation rule: the token it delimits is resolved against the
 * supplied entity index, and anything unknown is left as plain text.
 */
const ENTITY_TOKEN_BODY = '[\\p{L}\\p{N}\\p{M}_.-]+';

/**
 * One alternation finds every mention and hashtag candidate in a text node in a
 * single left-to-right scan. A mention may carry an `@domain` suffix
 * (`@alice@example.com`); a hashtag may not.
 */
const KNOWN_ENTITY_SOURCE = `@(${ENTITY_TOKEN_BODY})(@[\\w.-]+)?|#(${ENTITY_TOKEN_BODY})`;

/**
 * Strip the punctuation a token picks up from prose: `@alice.`, `#svelte-`.
 *
 * This is a bounded backwards scan rather than a `/[.-]+$/` replace. The regex
 * form backtracks: on a token whose tail is a long `.`/`-` run terminated by a
 * character that blocks the `$` anchor, the engine retries the run from every
 * start offset inside it, which is quadratic in the token length. Tokens are
 * scanning-alphabet output, so a federated peer picks that length, and status
 * bodies now render on the server — 100k such characters cost ~3.6s under the
 * regex against ~2ms for the pattern walk this replaced.
 *
 * The scan stops at the first non-punctuation character from the right, so its
 * cost is the length of the trailing run and the total across a text node is
 * bounded by the node's own length.
 */
function stripTrailingPunctuation(token: string): string {
	let end = token.length;

	while (end > 0) {
		const char = token[end - 1];
		if (char !== '.' && char !== '-') break;
		end -= 1;
	}

	return end === token.length ? token : token.slice(0, end);
}

/** Entity name to validated href. */
type EntityIndex = Map<string, string>;

/**
 * Index the known entities once per call so each scanned token resolves with a
 * constant-cost map lookup.
 *
 * The previous implementation ran one `splitSegments` pass per entity, and every
 * pass walked the segment list the earlier passes had grown — quadratic in the
 * number of mentions and tags a status carries. Since status bodies now render
 * on the server, that cost was a federated peer's to spend on a render worker.
 */
function buildEntityIndex(
	entries: ReadonlyArray<{ name?: string; url?: string }>,
	foldCase: boolean
): EntityIndex {
	const index: EntityIndex = new Map();

	for (const entry of entries) {
		if (!entry?.name) continue;

		const href = toSafeHref(entry.url);
		if (!href) continue;

		const key = foldCase ? entry.name.toLowerCase() : entry.name;
		// First entry wins, matching the pass-per-entity ordering this replaced.
		if (!index.has(key)) index.set(key, href);
	}

	return index;
}

/**
 * Resolve a scanned token against an index. The whole token is tried first, then
 * the token with trailing punctuation removed, so `@alice.` at the end of a
 * sentence links `@alice` and leaves the period as text. Both probes are bounded
 * by the token's own length, so resolution cost does not grow with the number of
 * entities supplied.
 */
function resolveEntity(
	index: EntityIndex,
	token: string,
	foldCase: boolean
): { name: string; href: string } | null {
	if (index.size === 0) return null;

	const direct = index.get(foldCase ? token.toLowerCase() : token);
	if (direct !== undefined) return { name: token, href: direct };

	const trimmed = stripTrailingPunctuation(token);
	if (!trimmed || trimmed.length === token.length) return null;

	const href = index.get(foldCase ? trimmed.toLowerCase() : trimmed);
	return href === undefined ? null : { name: trimmed, href };
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
			if (replaced) {
				appendAll(out, replaced);
			} else {
				out.push(child);
			}
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
 *
 * When `mentions` or `tags` is supplied, each text node is scanned once and
 * every candidate token is resolved against those entities by name: a token
 * matches only as a whole (`@user10` never resolves to `@user1`), optionally
 * minus trailing prose punctuation (`@alice.` links `@alice`). A mention may
 * carry an `@domain` suffix. The scan cost is a function of the content length,
 * not of how many entities the caller supplies.
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

	// Built once per call, not once per text node, and never once per entity.
	const mentionIndex = useKnownEntities
		? buildEntityIndex(
				mentions.map((mention) => ({ name: mention?.username, url: mention?.url })),
				false
			)
		: (new Map() as EntityIndex);
	const tagIndex = useKnownEntities
		? buildEntityIndex(
				tags.map((tag) => ({ name: tag?.name, url: tag?.url })),
				true
			)
		: (new Map() as EntityIndex);

	const transform = (text: LinkifyTextNode): LinkifySegment[] | null => {
		let segments: LinkifySegment[] = [text];

		if (useKnownEntities) {
			segments = splitSegments(segments, new RegExp(KNOWN_ENTITY_SOURCE, 'gu'), (match) => {
				const [, mentionToken, domain = '', tagToken] = match;

				if (mentionToken !== undefined) {
					const resolved = resolveEntity(mentionIndex, mentionToken, false);
					if (!resolved) return null;

					// A `@domain` suffix belongs to the link only when the whole local
					// part resolved: `@alice.@example.com` links `@alice` and leaves the
					// rest as text, exactly as the per-entity patterns did.
					const suffix = resolved.name.length === mentionToken.length ? domain : '';
					const label = `@${resolved.name}${suffix}`;
					return { nodes: [anchor(resolved.href, mentionClass, label)], consumed: label.length };
				}

				if (tagToken !== undefined) {
					const resolved = resolveEntity(tagIndex, tagToken, true);
					if (!resolved) return null;

					const label = `#${resolved.name}`;
					return { nodes: [anchor(resolved.href, hashtagClass, label)], consumed: label.length };
				}

				return null;
			});
		} else {
			segments = splitSegments(segments, new RegExp(GENERIC_LINK_SOURCE, 'giu'), (match) => {
				const [, boundary = '', url, mention, hashtag] = match;
				const lead: LinkifySegment[] = boundary ? [textNode(boundary)] : [];

				if (url) {
					const href = toSafeAbsoluteHref(url.startsWith('http') ? url : `https://${url}`);
					if (!href) return null;
					return { nodes: [...lead, anchor(href, urlClass, truncateUrl(href, maxUrlLength))] };
				}

				if (mention) {
					const href = toSafeHref(mentionBaseUrl + mention.slice(1));
					if (!href) return null;
					return { nodes: [...lead, anchor(href, mentionClass, mention)] };
				}

				if (hashtag) {
					const href = toSafeHref(hashtagBaseUrl + encodeURIComponent(hashtag.slice(1)));
					if (!href) return null;
					return { nodes: [...lead, anchor(href, hashtagClass, hashtag)] };
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
