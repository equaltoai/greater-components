<!--
  ContentWarningHandler - Collapsible Sensitive Content Component
  
  Handles content warnings (CW) / spoiler text for sensitive content.
  Provides a collapsible interface with keyboard support.
  
  @component
  @example
  ```svelte
  <ContentWarningHandler
    warning="Sensitive content"
    {content}
    {config}
  />
  ```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { sanitizeHtml } from '@equaltoai/greater-components-utils';

	interface ContentWarningConfig {
		/**
		 * Default expanded state
		 */
		defaultExpanded?: boolean;

		/**
		 * Show content preview when collapsed
		 */
		showPreview?: boolean;

		/**
		 * Preview length (characters)
		 */
		previewLength?: number;

		/**
		 * Animation duration (ms)
		 */
		animationDuration?: number;

		/**
		 * Custom CSS class
		 */
		class?: string;

		/**
		 * Blur content when collapsed
		 */
		blurContent?: boolean;

		/**
		 * Show icon
		 */
		showIcon?: boolean;
	}

	interface Props {
		/**
		 * Warning text
		 */
		warning: string;

		/**
		 * Content to hide/show
		 */
		content?: Snippet;

		/**
		 * Alternative: HTML content string
		 */
		htmlContent?: string;

		/**
		 * Configuration
		 */
		config?: ContentWarningConfig;

		/**
		 * Called when expand/collapse
		 */
		onToggle?: (expanded: boolean) => void;

		/**
		 * Custom warning renderer
		 */
		renderWarning?: Snippet<[string, boolean]>;

		/**
		 * Custom toggle button
		 */
		renderToggle?: Snippet<[boolean]>;
	}

	let {
		warning,
		content,
		htmlContent,
		config = {},
		onToggle,
		renderWarning,
		renderToggle,
	}: Props = $props();

	const {
		defaultExpanded = false,
		showPreview = false,
		previewLength = 100,
		animationDuration = 200,
		class: className = '',
		blurContent = true,
		showIcon = true,
	} = config;

	let isExpanded = $state(defaultExpanded);
	let contentHeight = $state(0);
	let contentRef: HTMLElement;

	/**
	 * Toggle expand/collapse
	 */
	function toggle() {
		isExpanded = !isExpanded;
		onToggle?.(isExpanded);
	}

	/**
	 * Handle keyboard navigation
	 */
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggle();
		}
	}

	/**
	 * Get preview text
	 */
	function getPreview(html?: string): string {
		if (!html || !showPreview) return '';

		// Strip HTML tags
		const text = html.replace(/<[^>]*>/g, '');

		// Truncate
		if (text.length > previewLength) {
			return text.slice(0, previewLength) + '...';
		}

		return text;
	}

	const preview = $derived(getPreview(htmlContent));
	const sanitizedHtmlContent = $derived(() =>
		htmlContent
			? sanitizeHtml(htmlContent, {
					allowedTags: [
						'p',
						'br',
						'span',
						'a',
						'strong',
						'em',
						'b',
						'i',
						'u',
						'code',
						'pre',
						'blockquote',
						'ul',
						'ol',
						'li',
						'img',
					],
					allowedAttributes: ['href', 'rel', 'target', 'class', 'title', 'src', 'alt'],
			})
			: ''
	);

	let sanitizedContentRef = $state<HTMLDivElement>();

	$effect(() => {
		if (sanitizedContentRef) {
			sanitizedContentRef.innerHTML = sanitizedHtmlContent;
		}
	});

	/**
	 * Update content height for animation
	 */
	$effect(() => {
		if (contentRef) {
			contentHeight = contentRef.scrollHeight;
		}
	});
</script>

<div
	class={`cw-handler ${className}`}
	class:cw-handler--expanded={isExpanded}
	class:cw-handler--collapsed={!isExpanded}
>
	<!-- Warning banner -->
	<div
		class="cw-handler__warning"
		role="button"
		tabindex="0"
		aria-expanded={isExpanded}
		aria-label={`Content warning: ${warning}. ${isExpanded ? 'Hide' : 'Show'} content`}
		onclick={toggle}
		onkeydown={handleKeyDown}
	>
		{#if renderWarning}
			{@render renderWarning(warning, isExpanded)}
		{:else}
			<div class="cw-handler__warning-content">
				{#if showIcon}
					<svg
						class="cw-handler__icon"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
						/>
						<line x1="12" y1="9" x2="12" y2="13" />
						<line x1="12" y1="17" x2="12.01" y2="17" />
					</svg>
				{/if}

				<div class="cw-handler__warning-text">
					<span class="cw-handler__label">Content Warning</span>
					<span class="cw-handler__warning-message">{warning}</span>
				</div>
			</div>

			{#if renderToggle}
				{@render renderToggle(isExpanded)}
			{:else}
				<button
					class="cw-handler__toggle"
					aria-label={isExpanded ? 'Hide sensitive content' : 'Show sensitive content'}
				>
					<span class="cw-handler__toggle-text">
						{isExpanded ? 'Hide' : 'Show'}
					</span>
					<svg
						class="cw-handler__toggle-icon"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						{#if isExpanded}
							<polyline points="18 15 12 9 6 15" />
						{:else}
							<polyline points="6 9 12 15 18 9" />
						{/if}
					</svg>
				</button>
			{/if}
		{/if}
	</div>

	<!-- Preview (when collapsed and enabled) -->
	{#if !isExpanded && preview}
		<div class="cw-handler__preview">
			<p class="cw-handler__preview-text">{preview}</p>
		</div>
	{/if}

	<!-- Content -->
	<div
		class="cw-handler__content"
		class:cw-handler__content--blur={!isExpanded && blurContent}
		style={`--content-height: ${contentHeight}px; --animation-duration: ${animationDuration}ms;`}
		bind:this={contentRef}
		aria-hidden={!isExpanded}
	>
		<div class="cw-handler__content-inner">
			{#if content}
				{@render content()}
			{:else if sanitizedHtmlContent}
				<div class="cw-handler__content-html" bind:this={sanitizedContentRef}></div>
			{/if}
		</div>
	</div>
</div>

<style>
	.cw-handler {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		overflow: hidden;
		background: var(--bg-secondary, #f7f9fa);
	}

	.cw-handler__warning {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		background: var(--warning-bg, #fff3cd);
		border-bottom: 1px solid var(--warning-border, #ffc107);
		cursor: pointer;
		user-select: none;
		transition: background-color 0.2s;
	}

	.cw-handler__warning:hover {
		background: var(--warning-bg-hover, #ffe69c);
	}

	.cw-handler__warning:focus-visible {
		outline: 2px solid var(--focus-color, #1d9bf0);
		outline-offset: -2px;
	}

	.cw-handler__warning-content {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex: 1;
	}

	.cw-handler__icon {
		width: 1.25rem;
		height: 1.25rem;
		color: var(--warning-icon, #ff9800);
		flex-shrink: 0;
	}

	.cw-handler__warning-text {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.cw-handler__label {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-secondary, #536471);
	}

	.cw-handler__warning-message {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-primary, #0f1419);
	}

	.cw-handler__toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.375rem;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
		transition: all 0.2s;
	}

	.cw-handler__toggle:hover {
		background: var(--bg-hover, #eff3f4);
		border-color: var(--border-hover, #cfd9de);
	}

	.cw-handler__toggle-icon {
		width: 1rem;
		height: 1rem;
		transition: transform 0.2s;
	}

	.cw-handler__preview {
		padding: 1rem;
		border-top: 1px solid var(--border-color, #e1e8ed);
	}

	.cw-handler__preview-text {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
		font-style: italic;
		margin: 0;
	}

	.cw-handler__content {
		max-height: 0;
		overflow: hidden;
		transition: max-height var(--animation-duration, 200ms) ease-in-out;
	}

	.cw-handler--expanded .cw-handler__content {
		max-height: var(--content-height, 1000px);
	}

	.cw-handler__content--blur {
		filter: blur(10px);
		user-select: none;
		pointer-events: none;
	}

	.cw-handler__content-inner {
		padding: 1rem;
		background: var(--bg-primary, #ffffff);
	}

	/* Accessibility */
	@media (prefers-reduced-motion: reduce) {
		.cw-handler__content {
			transition: none;
		}
	}
</style>
