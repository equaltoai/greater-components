<!--
MarkdownRenderer component - Renders markdown content safely with syntax highlighting support.

@component
@example
```svelte
<MarkdownRenderer content="# Hello\n\nThis is **markdown**." />
```
-->
<script lang="ts">
	import DOMPurify from 'isomorphic-dompurify';
	import { marked } from 'marked';

	interface Props {
		/**
		 * Markdown content to render.
		 */
		content: string;

		/**
		 * Whether to sanitize the HTML output.
		 * @default true
		 */
		sanitize?: boolean;

		/**
		 * List of allowed HTML tags.
		 */
		allowedTags?: string[];

		/**
		 * Enable syntax highlighting for code blocks (uses styling class).
		 * @default true
		 */
		enableCodeHighlight?: boolean;

		/**
		 * Enable clickable links.
		 * @default true
		 */
		enableLinks?: boolean;

		/**
		 * Open links in new tab.
		 * @default true
		 */
		openLinksInNewTab?: boolean;

		/**
		 * Additional CSS classes.
		 */
		class?: string;

		/**
		 * Callback when rendering is complete.
		 */
		onRenderComplete?: () => void;

		/**
		 * Callback on error.
		 */
		onError?: (error: Error) => void;
	}

	let {
		content,
		sanitize = true,
		allowedTags,
		// enableCodeHighlight = true, // Unused in this component logic, seems handled by marked or CSS?
		enableLinks = true,
		openLinksInNewTab = true,
		class: className = '',
		onRenderComplete,
		onError,
		...restProps
	}: Props = $props();

	// Configure marked
	const renderer = new marked.Renderer();

	// Custom link renderer
	renderer.link = ({ href, title, text }) => {
		if (!enableLinks) {
			return text;
		}
		let out = `<a href="${href}"`;
		if (title) {
			out += ` title="${title}"`;
		}
		if (openLinksInNewTab) {
			out += ' target="_blank" rel="noopener noreferrer"';
		}
		out += `>${text}</a>`;
		return out;
	};

	const renderedHtml = $derived.by(() => {
		try {
			if (!content) return '';

			const html = marked.parse(content, {
				renderer,
				breaks: true,
				gfm: true,
			});

			// marked.parse can return Promise if async is enabled, but by default it is sync.
			if (html instanceof Promise) {
				return '';
			}

			if (!sanitize) return html;

			const sanitized = DOMPurify.sanitize(html, {
				ALLOWED_TAGS: allowedTags || [
					'p',
					'br',
					'strong',
					'em',
					'code',
					'pre',
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6',
					'ul',
					'ol',
					'li',
					'a',
					'blockquote',
					'table',
					'thead',
					'tbody',
					'tr',
					'th',
					'td',
					'del',
					'img',
					'hr',
				],
				ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel'],
			});

			return sanitized;
		} catch (error: unknown) {
			if (onError && error instanceof Error) onError(error);
			// Fallback to text
			return content
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#039;');
		}
	});

	$effect(() => {
		if (renderedHtml && onRenderComplete) {
			onRenderComplete();
		}
	});
</script>

<div class="gr-markdown {className}" {...restProps}>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html renderedHtml}
</div>
