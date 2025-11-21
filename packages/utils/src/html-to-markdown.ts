import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

/**
 * Converts HTML string to Markdown.
 * Uses GitHub Flavored Markdown (GFM) and secure defaults.
 *
 * @param html - The HTML string to convert
 * @returns The generated Markdown string
 */
export function htmlToMarkdown(html: string): string {
	// Sanitize or pre-process HTML if needed.
	// Turndown generally handles conversion, but we might want to remove specific tags before conversion.
	// However, standard practice is to rely on Turndown rules or a sanitizer before passing to it.
	// The prompt says "Strip dangerous elements (script, style, iframe)".
	// Turndown ignores script and style tags by default (or keeps text?).
	// Turndown's default behavior:
	// - script: keeps content? No, default rules usually skip script/style content?
	// Actually Turndown keeps the text content of unknown tags.
	// We should remove script/style/iframe elements completely from the input HTML string or DOM.

	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');

	const dangerousTags = ['script', 'style', 'iframe', 'object', 'embed', 'link'];
	dangerousTags.forEach((tag) => {
		const elements = doc.querySelectorAll(tag);
		elements.forEach((el) => el.remove());
	});

	// Also remove comments? Turndown removes them by default.

	const cleanHtml = doc.body.innerHTML;

	const turndownService = new TurndownService({
		headingStyle: 'atx',
		codeBlockStyle: 'fenced',
		fence: '```',
		emDelimiter: '*',
		bulletListMarker: '-',
	});

	// Use GFM plugin
	turndownService.use(gfm);

	// Add specific rules if needed
	// e.g. keeping line breaks?

	return turndownService.turndown(cleanHtml);
}
