<script lang="ts">
	import { sanitizeHtml, linkifyHtml, useStableId } from '@equaltoai/greater-components-utils';
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
		// Sanitization stays authoritative and upstream of linkification.
		const sanitized = sanitizeHtml(html, {
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

		// Linkify text nodes only. Passing sanitized markup through the plain-text
		// linkifier would escape it into literal `&lt;p&gt;` (see #926).
		return linkifyHtml(sanitized, {
			mentions,
			tags,
			mentionBaseUrl,
			hashtagBaseUrl,
			openInNewTab: true,
			nofollow: false,
		});
	}

	const processedContent = $derived(processContent(content));
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
			class:collapsed={!!spoilerText && !expanded}
			id={contentId}
			aria-hidden={!!spoilerText && !expanded}
		>
			<!-- Sanitized upstream by processContent; rendered declaratively so the
			     body server-renders instead of being written by a client-only action. -->
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html processedContent}
		</div>
	{/if}
</div>
