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
 * Convert mentions, hashtags, and URLs in text to clickable links
 * @param text - The text to linkify
 * @param options - Linkify options
 * @returns HTML string with links
 */
export declare function linkifyMentions(text: string, options?: LinkifyOptions): string;
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
export declare function linkifyHtml(html: string, options?: LinkifyHtmlOptions): string;
/**
 * Extract mentions from text
 * @param text - The text to extract mentions from
 * @returns Array of mentions (without @ prefix)
 */
export declare function extractMentions(text: string): string[];
/**
 * Extract hashtags from text
 * @param text - The text to extract hashtags from
 * @returns Array of hashtags (without # prefix)
 */
export declare function extractHashtags(text: string): string[];
/**
 * Extract URLs from text
 * @param text - The text to extract URLs from
 * @returns Array of URLs
 */
export declare function extractUrls(text: string): string[];
/**
 * Check if text contains mentions
 */
export declare function hasMentions(text: string): boolean;
/**
 * Check if text contains hashtags
 */
export declare function hasHashtags(text: string): boolean;
/**
 * Check if text contains URLs
 */
export declare function hasUrls(text: string): boolean;
//# sourceMappingURL=linkifyMentions.d.ts.map
