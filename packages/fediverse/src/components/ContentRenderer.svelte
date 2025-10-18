<script lang="ts">
  import { sanitizeHtml, linkifyMentions } from '@greater/utils';
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
    onToggle
  }: Props = $props();

  let expanded = $state(!collapsed || !spoilerText);

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
        'p', 'br', 'span', 'a', 'del', 'pre', 'code',
        'em', 'strong', 'b', 'i', 'u', 's', 'strike',
        'ul', 'ol', 'li', 'blockquote',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
      ],
      allowedAttributes: ['href', 'title', 'class', 'rel', 'target']
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
        nofollow: false
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
      }
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
        aria-controls={`content-${Math.random().toString(36).substr(2, 9)}`}
      >
        {expanded ? 'Hide' : 'Show more'}
      </button>
    </div>
  {/if}
  
  {#if !spoilerText || expanded}
    <div 
      class="content"
      class:collapsed={spoilerText && !expanded}
      id={`content-${Math.random().toString(36).substr(2, 9)}`}
      aria-hidden={spoilerText && !expanded}
      use:setHtml={processedContent}
    ></div>
  {/if}
</div>

<style>
  .content-renderer {
    position: relative;
  }

  .spoiler-warning {
    display: flex;
    align-items: center;
    gap: var(--spacing-md, 1rem);
    padding: var(--spacing-sm, 0.5rem) 0;
    border-bottom: 1px solid var(--color-border, #e1e8ed);
    margin-bottom: var(--spacing-sm, 0.5rem);
  }

  .spoiler-text {
    flex: 1;
    font-weight: 500;
    color: var(--color-text-secondary, #536471);
  }

  .spoiler-toggle {
    padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
    background: var(--color-primary, #1d9bf0);
    color: white;
    border: none;
    border-radius: var(--radius-sm, 4px);
    font-size: var(--font-size-sm, 0.875rem);
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .spoiler-toggle:hover {
    background: var(--color-primary-hover, #1a8cd8);
  }

  .spoiler-toggle:focus-visible {
    outline: 2px solid var(--color-focus, #1d9bf0);
    outline-offset: 2px;
  }

  .content {
    line-height: 1.5;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .content.collapsed {
    display: none;
  }

  /* Content styles */
  .content :global(p) {
    margin: 0 0 var(--spacing-sm, 0.5rem);
  }

  .content :global(p:last-child) {
    margin-bottom: 0;
  }

  .content :global(a) {
    color: var(--color-link, #1d9bf0);
    text-decoration: none;
  }

  .content :global(a:hover) {
    text-decoration: underline;
  }

  .content :global(.mention) {
    color: var(--color-link, #1d9bf0);
    font-weight: 500;
  }

  .content :global(.hashtag) {
    color: var(--color-link, #1d9bf0);
  }

  .content :global(blockquote) {
    margin: var(--spacing-sm, 0.5rem) 0;
    padding-left: var(--spacing-md, 1rem);
    border-left: 3px solid var(--color-border, #e1e8ed);
    color: var(--color-text-secondary, #536471);
  }

  .content :global(pre) {
    background: var(--color-bg-secondary, #f7f9fa);
    padding: var(--spacing-sm, 0.5rem);
    border-radius: var(--radius-sm, 4px);
    overflow-x: auto;
  }

  .content :global(code) {
    background: var(--color-bg-secondary, #f7f9fa);
    padding: 0.125rem 0.25rem;
    border-radius: var(--radius-xs, 2px);
    font-family: monospace;
    font-size: 0.875em;
  }

  .content :global(pre code) {
    background: none;
    padding: 0;
  }

  .content :global(ul),
  .content :global(ol) {
    margin: var(--spacing-sm, 0.5rem) 0;
    padding-left: var(--spacing-lg, 1.5rem);
  }

  .content :global(li) {
    margin: var(--spacing-xs, 0.25rem) 0;
  }
</style>
