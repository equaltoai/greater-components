<script lang="ts">
	import { sanitizeHtml, linkifyMentions, useStableId } from '@equaltoai/greater-components-utils';
	import { untrack } from 'svelte';
	import type { Mention, Tag } from '../types';

	interface Props {
		/**
		 * HTML content to render (will be sanitized)
		 */
		content: string;
		/**
		 * Spoiler/Content Warning text
		 */
		spoilerText?: string;
		/**
		 * Whether content is initially collapsed (when spoiler text is present)
		 */
		collapsed?: boolean;
		/**
		 * Mentions to linkify
		 */
		mentions?: Mention[];
		/**
		 * Hashtags to linkify
		 */
		tags?: Tag[];
		/**
		 * Base URL for mentions
		 */
		mentionBaseUrl?: string;
		/**
		 * Base URL for hashtags
		 */
		hashtagBaseUrl?: string;
		/**
		 * Additional CSS class for content
		 */
		class?: string;
		/**
		 * Callback when expand/collapse state changes
		 */
		onToggle?: (expanded: boolean) => void;
	}

	let {
		content,
		spoilerText = '',
		collapsed = true,
		mentions = [],
		tags = [],
		mentionBaseUrl = '/users/',
		hashtagBaseUrl = '/tags/',
		class: className = '',
		onToggle,
	}: Props = $props();

	let expanded = $state(untrack(() => !collapsed || !spoilerText));
	const generatedId = useStableId('content');
	const contentId = $derived(generatedId.value);

	function toggleExpanded() {
		if (spoilerText) {
			expanded = !expanded;
			onToggle?.(expanded);
		}
	}

	function processContent(html: string): string {
		// First sanitize the HTML
		let processed = sanitizeHtml(html, {
			allowedTags: [
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
			],
			allowedAttributes: ['href', 'title', 'class', 'rel', 'target'],
		});

		// Replace mention links if we have mention data
		if (mentions.length > 0) {
			mentions.forEach((mention) => {
				const pattern = new RegExp(`@${mention.username}(@[\\w.-]+)?`, 'g');
				const safeUrl = encodeURI(mention.url);
				processed = processed.replace(pattern, (match) => {
					return `<a href="${safeUrl}" class="mention" rel="noopener noreferrer" target="_blank">${match}</a>`;
				});
			});
		}

		// Replace hashtag links if we have tag data
		if (tags.length > 0) {
			tags.forEach((tag) => {
				const pattern = new RegExp(`#${tag.name}\\b`, 'gi');
				const safeUrl = encodeURI(tag.url);
				processed = processed.replace(pattern, () => {
					return `<a href="${safeUrl}" class="hashtag" rel="noopener noreferrer" target="_blank">#${tag.name}</a>`;
				});
			});
		}

		// If no specific mention/tag data, use generic linkification
		if (mentions.length === 0 && tags.length === 0) {
			processed = linkifyMentions(processed, {
				mentionBaseUrl,
				hashtagBaseUrl,
				openInNewTab: true,
				nofollow: false,
			});
		}

		return processed;
	}

	const processedContent = $derived(processContent(content));

	function setHtml(node: HTMLElement, html: string) {
		node.innerHTML = html;
		return {
			update(newHtml: string) {
				node.innerHTML = newHtml;
			},
		};
	}
</script>

<div class={`content-renderer ${className}`}>
	{#if spoilerText}
		<div class="spoiler-warning">
			<span class="spoiler-text">{spoilerText}</span>
			<button
				class="spoiler-toggle"
				onclick={toggleExpanded}
				aria-expanded={expanded}
				aria-controls={contentId}
			>
				{expanded ? 'Hide' : 'Show more'}
			</button>
		</div>
	{/if}

	{#if !spoilerText || expanded}
		<div
			class="content"
			class:collapsed={spoilerText && !expanded}
			id={contentId}
			aria-hidden={spoilerText && !expanded}
			use:setHtml={processedContent}
		></div>
	{/if}
</div>
