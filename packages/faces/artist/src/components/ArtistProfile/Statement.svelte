<!--
ArtistProfile.Statement - Rich-formatted artist statement

Features:
- Rich-formatted artist statement
- Typography using --gr-artist-font-statement
- Expandable for long statements
- Markdown/rich text support

@component
@example
```svelte
<ArtistProfile.Statement maxLines={5} expandable />
```
-->

<script lang="ts">
	import { getArtistProfileContext } from './context.js';

	interface Props {
		/**
		 * Maximum lines before truncation
		 */
		maxLines?: number;

		/**
		 * Allow expanding truncated content
		 */
		expandable?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { maxLines = 5, expandable = true, class: className = '' }: Props = $props();

	const ctx = getArtistProfileContext();
	const { artist } = ctx;

	const maxLinesClamped = $derived(Math.max(1, Math.min(10, Math.round(maxLines))));

	// Expanded state
	let isExpanded = $state(false);

	// Check if content is truncated
	let contentRef: HTMLElement | null = $state(null);
	let isTruncated = $state(false);

	$effect(() => {
		if (!contentRef) return;

		// Check if content overflows
		const lineHeight = parseInt(getComputedStyle(contentRef).lineHeight);
		const maxHeight = lineHeight * maxLinesClamped;
		isTruncated = contentRef.scrollHeight > maxHeight;
	});

	// Simple markdown-like parsing (basic support)
	function parseStatement(text: string): string {
		// Escape HTML first to prevent XSS
		const escaped = text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');

		return escaped
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			.replace(/\*(.*?)\*/g, '<em>$1</em>')
			.replace(/\n/g, '<br>');
	}

	const parsedStatement = $derived(artist.statement ? parseStatement(artist.statement) : '');
</script>

{#if artist.statement}
	<section class={`profile-statement ${className}`} aria-label="Artist statement">
		<div
			bind:this={contentRef}
			class={`profile-statement__content profile-statement__content--max-lines-${maxLinesClamped}`}
			class:truncated={!isExpanded && isTruncated}
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html parsedStatement}
		</div>

		{#if expandable && isTruncated}
			<button
				class="profile-statement__toggle"
				onclick={() => {
					isExpanded = !isExpanded;
				}}
				aria-expanded={isExpanded}
			>
				{isExpanded ? 'Show less' : 'Read more'}
			</button>
		{/if}
	</section>
{/if}

<style>
	.profile-statement {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-2);
	}

	.profile-statement__content {
		font-family: var(--gr-artist-font-statement, var(--gr-font-family-serif, Georgia, serif));
		font-size: var(--gr-font-size-lg);
		line-height: 1.7;
		color: var(--gr-color-gray-200);
	}

	.profile-statement__content.truncated {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.profile-statement__content--max-lines-1.truncated {
		-webkit-line-clamp: 1;
		line-clamp: 1;
	}

	.profile-statement__content--max-lines-2.truncated {
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	.profile-statement__content--max-lines-3.truncated {
		-webkit-line-clamp: 3;
		line-clamp: 3;
	}

	.profile-statement__content--max-lines-4.truncated {
		-webkit-line-clamp: 4;
		line-clamp: 4;
	}

	.profile-statement__content--max-lines-5.truncated {
		-webkit-line-clamp: 5;
		line-clamp: 5;
	}

	.profile-statement__content--max-lines-6.truncated {
		-webkit-line-clamp: 6;
		line-clamp: 6;
	}

	.profile-statement__content--max-lines-7.truncated {
		-webkit-line-clamp: 7;
		line-clamp: 7;
	}

	.profile-statement__content--max-lines-8.truncated {
		-webkit-line-clamp: 8;
		line-clamp: 8;
	}

	.profile-statement__content--max-lines-9.truncated {
		-webkit-line-clamp: 9;
		line-clamp: 9;
	}

	.profile-statement__content--max-lines-10.truncated {
		-webkit-line-clamp: 10;
		line-clamp: 10;
	}

	.profile-statement__content :global(strong) {
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-100);
	}

	.profile-statement__content :global(em) {
		font-style: italic;
	}

	.profile-statement__toggle {
		align-self: flex-start;
		padding: 0;
		border: none;
		background: none;
		color: var(--gr-color-primary-400);
		font-size: var(--gr-font-size-sm);
		font-weight: var(--gr-font-weight-medium);
		cursor: pointer;
		transition: color 0.2s;
	}

	.profile-statement__toggle:hover {
		color: var(--gr-color-primary-300);
	}

	.profile-statement__toggle:focus {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.profile-statement__toggle {
			transition: none;
		}
	}
</style>
