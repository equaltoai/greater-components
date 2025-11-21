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

			// Configure renderer based on props if needed (dynamic renderer update is tricky with marked, 
            // so we use the static one but logic inside handles props)
            // Ideally we should pass options to marked.parse, but Renderer is stateful?
            // We can just use the renderer we defined.
            
            // Note: marked 11+ might use object arg for renderer functions
            // We check marked version. Assuming latest.
            
			const html = marked.parse(content, { 
                renderer,
                breaks: true, 
                gfm: true 
            });

            // marked.parse can return Promise if async is enabled, but by default it is sync.
            // We assume sync string.
            if (html instanceof Promise) {
                // Should not happen with default options
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
                    'img', // Maybe allow img? Standard markdown often has images.
                    'hr'
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

<style>
	:global {
		.gr-markdown {
			line-height: 1.6;
			color: var(--gr-semantic-foreground-primary);
            font-family: var(--gr-typography-fontFamily-sans);
            font-size: var(--gr-typography-fontSize-base);
		}

		.gr-markdown p {
			margin-bottom: 1rem;
		}

		.gr-markdown h1,
		.gr-markdown h2,
		.gr-markdown h3,
		.gr-markdown h4,
		.gr-markdown h5,
		.gr-markdown h6 {
			margin-top: 1.5rem;
			margin-bottom: 0.75rem;
			font-weight: var(--gr-typography-fontWeight-bold);
			line-height: 1.25;
            color: var(--gr-semantic-foreground-strong);
		}

		.gr-markdown h1 { font-size: var(--gr-typography-fontSize-3xl); }
		.gr-markdown h2 { font-size: var(--gr-typography-fontSize-2xl); }
		.gr-markdown h3 { font-size: var(--gr-typography-fontSize-xl); }
        
        .gr-markdown a {
            color: var(--gr-color-primary-600);
            text-decoration: none;
        }
        .gr-markdown a:hover {
            text-decoration: underline;
        }

		.gr-markdown code {
			background-color: var(--gr-semantic-background-secondary);
			padding: 0.2em 0.4em;
			border-radius: var(--gr-radii-sm);
			font-size: 0.85em;
			font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
            color: var(--gr-semantic-foreground-strong);
		}

		.gr-markdown pre {
			background-color: var(--gr-semantic-background-secondary);
			border: 1px solid var(--gr-semantic-border-subtle);
			border-radius: var(--gr-radii-md);
			padding: 1rem;
			overflow-x: auto;
			margin: 1rem 0;
		}

		.gr-markdown pre code {
			background: none;
			padding: 0;
            color: inherit;
            font-size: 0.9em;
		}
        
        .gr-markdown ul, .gr-markdown ol {
            margin-bottom: 1rem;
            padding-left: 1.5rem;
        }
        
        .gr-markdown li {
            margin-bottom: 0.25rem;
        }
        
        .gr-markdown blockquote {
            border-left: 4px solid var(--gr-color-gray-300);
            padding-left: 1rem;
            margin: 1rem 0;
            color: var(--gr-color-gray-600);
            font-style: italic;
        }
        
        .gr-markdown img {
            max-width: 100%;
            height: auto;
            border-radius: var(--gr-radii-md);
        }
        
        .gr-markdown table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1rem;
        }
        
        .gr-markdown th, .gr-markdown td {
            border: 1px solid var(--gr-semantic-border-subtle);
            padding: 0.5rem;
            text-align: left;
        }
        
        .gr-markdown th {
            background-color: var(--gr-semantic-background-secondary);
            font-weight: var(--gr-typography-fontWeight-semibold);
        }
	}
</style>
