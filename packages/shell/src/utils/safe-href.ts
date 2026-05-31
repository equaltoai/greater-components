/**
 * @fileoverview Shared URL allowlist guard for Shell components that render links.
 *
 * Shell components can receive href-like values from route state, CMS content,
 * or federated data. Svelte escapes attribute delimiters, but it does not make
 * unsafe URL schemes safe. Keep all component-boundary href rendering behind
 * this allowlist so unsafe schemes render as static text instead of links.
 *
 * @internal
 */

const allowedLinkProtocols = new Set(['http:', 'https:', 'mailto:']);
const relativeUrlBase = 'https://example.invalid';

/**
 * Return an href safe to render into an `<a>` tag, or null for unsafe values.
 *
 * Allows relative URLs plus absolute http:, https:, and mailto: URLs. Unsafe
 * schemes such as javascript:, data:, and vbscript: return null.
 */
export function toSafeHref(value?: string | null): string | null {
	if (typeof value !== 'string') return null;

	const href = value.trim();
	if (!href) return null;

	try {
		const parsed = new URL(href, relativeUrlBase);
		if (!allowedLinkProtocols.has(parsed.protocol)) return null;
		return encodeURI(href);
	} catch {
		return null;
	}
}
