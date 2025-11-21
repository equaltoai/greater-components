<!--
CodeBlock component - Syntax highlighting code block with copy button.

@component
@example
```svelte
<CodeBlock code="console.log('Hello')" language="javascript" showLineNumbers />
```
-->
<script lang="ts">
	import CopyButton from './CopyButton.svelte';
	import type { Highlighter } from 'shiki';

	interface Props {
		/**
		 * The code to display.
		 */
		code: string;

		/**
		 * Language for syntax highlighting (e.g. 'javascript', 'python').
		 * If 'text' or undefined, no highlighting is performed.
		 */
		language?: string;

		/**
		 * Whether to show the copy button.
		 * @default true
		 */
		showCopy?: boolean;

		/**
		 * Whether to show line numbers.
		 * @default false
		 */
		showLineNumbers?: boolean;

		/**
		 * Lines to highlight (1-based index).
		 */
		highlightLines?: number[];

		/**
		 * Maximum height before scrolling (CSS value).
		 */
		maxHeight?: string | number;

		/**
		 * Whether to wrap long lines.
		 * @default false
		 */
		wrap?: boolean;

		/**
		 * Filename to display in the header.
		 */
		filename?: string;

		/**
		 * Visual variant.
		 * @default 'outlined'
		 */
		variant?: 'outlined' | 'filled';

		/**
		 * Syntax theme.
		 * @default 'github-dark'
		 */
		theme?: string;

		/**
		 * Additional CSS classes.
		 */
		class?: string;

		/**
		 * Callback when code is copied.
		 */
		onCopy?: (code: string) => void;
	}

	let {
		code,
		language = 'text',
		showCopy = true,
		showLineNumbers = false,
		highlightLines = [],
		maxHeight,
		wrap = false,
		filename,
		variant = 'outlined',
		theme = 'github-dark',
		class: className = '',
		onCopy,
		...restProps
	}: Props = $props();

	let highlightedCode = $state('');
	let loading = $state(true);

	// Static highlighter instance to share across components
	let highlighterPromise: Promise<Highlighter> | null = null;

	async function getHighlighterInstance() {
		if (!highlighterPromise) {
			// Lazy load shiki
			const { createHighlighter } = await import('shiki');
			highlighterPromise = createHighlighter({
				themes: ['github-dark', 'github-light'],
				langs: [
					'javascript',
					'typescript',
					'html',
					'css',
					'json',
					'bash',
					'python',
					'markdown',
					'yaml',
					'go',
					'rust',
					'svelte',
				],
			});
		}
		return highlighterPromise;
	}

	function escapeHtml(unsafe: string) {
		return unsafe
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	async function highlight() {
		if (!code) {
			highlightedCode = '';
			loading = false;
			return;
		}

		if (!language || language === 'text') {
			highlightedCode = escapeHtml(code);
			loading = false;
			return;
		}

		try {
			loading = true;
			const highlighter = await getHighlighterInstance();
			
			// Ensure language is loaded (if we pre-loaded specific langs, check if this one is available)
			// For now, we rely on the pre-loaded list or assume shiki handles it if we configured it.
			// Ideally we should loadLang if missing, but for this basic implementation we stick to bundled langs.
            // Or we can try to load it on demand if we want to be fancy, but let's keep it simple first.
            // Shiki's createHighlighter usually expects langs to be defined or loaded.
            
            // Check if lang is loaded
            if (!highlighter.getLoadedLanguages().includes(language)) {
                 // Fallback to text if lang not supported/loaded to avoid crash
                 // Or we could try to dynamic load it.
                 // console.warn(`Language '${language}' not loaded in Shiki.`);
                 highlightedCode = escapeHtml(code);
                 loading = false;
                 return;
            }

			highlightedCode = highlighter.codeToHtml(code, {
				lang: language,
				theme: theme,
				transformers: [
                    {
                        line(node, line) {
                            if (showLineNumbers) {
                                node.properties.class += ' line-number';
                                // Using CSS counters for line numbers usually, or we inject a span
                            }
                            if (highlightLines.includes(line)) {
                                node.properties.class += ' highlighted-line';
                            }
                        }
                    }
                ]
			});
			loading = false;
		} catch (e) {
			console.error('Syntax highlighting failed:', e);
			highlightedCode = escapeHtml(code);
			loading = false;
		}
	}

	$effect(() => {
		highlight();
	});

	function handleCopy() {
		onCopy?.(code);
	}
</script>

<div
	class="gr-code-block gr-code-block--{variant} {className}"
	class:gr-code-block--has-filename={!!filename}
	{...restProps}
>
	{#if filename}
		<div class="gr-code-block__header">
			<span class="gr-code-block__filename">{filename}</span>
			{#if showCopy}
				<CopyButton
					text={code}
					size="sm"
					variant="icon"
					buttonVariant="ghost"
					onCopy={handleCopy}
                    class="gr-code-block__copy-btn"
				/>
			{/if}
		</div>
	{/if}

	<div 
        class="gr-code-block__content" 
        style:max-height={typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight}
        class:gr-code-block--wrap={wrap}
        class:gr-code-block--line-numbers={showLineNumbers}
    >
		{#if loading}
			<pre class="gr-code-block__pre"><code>{code}</code></pre>
		{:else}
			<!-- Shiki output is safe -->
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html highlightedCode}
		{/if}
	</div>

	{#if !filename && showCopy}
		<div class="gr-code-block__overlay">
			<CopyButton
				text={code}
				size="sm"
				variant="icon"
				buttonVariant="ghost"
				onCopy={handleCopy}
			/>
		</div>
	{/if}
</div>

<style>
	:global {
		.gr-code-block {
			border-radius: var(--gr-radii-md);
			overflow: hidden;
			position: relative;
			background-color: #24292e; /* Fallback/Default for github-dark */
			color: #e1e4e8;
            margin-bottom: 1rem;
		}

		.gr-code-block--outlined {
			border: 1px solid var(--gr-semantic-border-subtle);
		}

		.gr-code-block--filled {
            /* Background provided by Shiki usually covers this */
		}

		.gr-code-block__header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0.5rem 1rem;
			background-color: rgba(255, 255, 255, 0.05);
			border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		}

		.gr-code-block__filename {
			font-family: var(--gr-typography-fontFamily-sans);
			font-size: var(--gr-typography-fontSize-xs);
			color: var(--gr-color-gray-400);
		}

		.gr-code-block__content {
			overflow-x: auto;
			padding: 1rem;
            font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
            font-size: 0.875rem;
            line-height: 1.5;
		}
        
        .gr-code-block--wrap .gr-code-block__content {
            white-space: pre-wrap;
            word-break: break-all;
        }

		.gr-code-block__pre {
			margin: 0;
            font-family: inherit;
		}

		.gr-code-block__overlay {
			position: absolute;
			top: 0.5rem;
			right: 0.5rem;
			opacity: 0;
			transition: opacity 0.2s;
		}

		.gr-code-block:hover .gr-code-block__overlay {
			opacity: 1;
		}
        
        /* Shiki overrides */
        .gr-code-block :global(pre.shiki) {
            background-color: transparent !important; /* Let container handle bg */
            margin: 0;
            padding: 0;
        }
        
        /* Highlighting */
        .gr-code-block :global(.highlighted-line) {
            background-color: rgba(255, 255, 255, 0.1);
            display: block;
            margin: 0 -1rem;
            padding: 0 1rem;
        }
        
        /* Line numbers via CSS counters if shiki structure allows, 
           or we rely on shiki transformers to inject spans. 
           Shiki usually outputs lines as spans if configured.
        */
	}
</style>
