import DOMPurify from 'isomorphic-dompurify';
import type { Config } from 'dompurify';

export interface SanitizeOptions {
	/**
	 * Allow specific HTML tags
	 */
	allowedTags?: string[];
	/**
	 * Allow specific attributes
	 */
	allowedAttributes?: string[];
	/**
	 * Allow data URIs in src attributes
	 */
	allowDataUri?: boolean;
	/**
	 * Custom DOMPurify configuration
	 */
	customConfig?: Config;
}

/**
 * Default allowed tags for Fediverse content
 */
const DEFAULT_ALLOWED_TAGS = [
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

/**
 * Default allowed attributes
 */
const DEFAULT_ALLOWED_ATTRIBUTES = ['href', 'title', 'class', 'rel', 'target'];

/**
 * Sanitize HTML content using DOMPurify with an allow-list approach
 * @param dirty - The potentially unsafe HTML string
 * @param options - Sanitization options
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(dirty: string, options: SanitizeOptions = {}): string {
	const {
		allowedTags = DEFAULT_ALLOWED_TAGS,
		allowedAttributes = DEFAULT_ALLOWED_ATTRIBUTES,
		allowDataUri = false,
		customConfig = {},
	} = options;

	const config: Config = {
		ALLOWED_TAGS: allowedTags,
		ALLOWED_ATTR: allowedAttributes,
		ALLOW_DATA_ATTR: false,
		ALLOW_UNKNOWN_PROTOCOLS: false,
		ALLOW_ARIA_ATTR: true,
		KEEP_CONTENT: true,
		RETURN_DOM: false,
		RETURN_DOM_FRAGMENT: false,
		RETURN_TRUSTED_TYPE: false,
		SAFE_FOR_TEMPLATES: true,
		...customConfig,
	};

	if (!allowDataUri) {
		config.ALLOWED_URI_REGEXP = /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i;
	}

	// Add rel="noopener noreferrer" to all external links
	DOMPurify.addHook('afterSanitizeAttributes', (node) => {
		if (node.tagName === 'A' && node.hasAttribute('href')) {
			const href = node.getAttribute('href') || '';
			if (href.startsWith('http://') || href.startsWith('https://')) {
				node.setAttribute('rel', 'noopener noreferrer');
				if (!node.hasAttribute('target')) {
					node.setAttribute('target', '_blank');
				}
			}
		}
	});

	const clean = DOMPurify.sanitize(dirty, config) as string;

	// Remove the hook after use to prevent memory leaks
	DOMPurify.removeHook('afterSanitizeAttributes');

	return clean;
}

/**
 * Sanitize HTML for preview/excerpt (strips all HTML)
 * @param dirty - The HTML string to strip
 * @param maxLength - Maximum length of the output
 * @returns Plain text string
 */
export function sanitizeForPreview(dirty: string, maxLength = 200): string {
	const textOnly = DOMPurify.sanitize(dirty, {
		ALLOWED_TAGS: [],
		KEEP_CONTENT: true,
	});

	if (textOnly.length <= maxLength) {
		return textOnly;
	}

	return textOnly.substring(0, maxLength).trim() + '...';
}
