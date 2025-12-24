<!--
Exhibition.Statement - Curator statement with expandable content

Features:
- Rich text formatting
- Expandable for long statements
- Curator attribution
- Accessible expand/collapse

@component
@example
```svelte
<Exhibition.Statement maxLength={300} />
```
-->

<script lang="ts">
	import { getExhibitionContext } from './context.js';

	interface Props {
		/**
		 * Maximum characters before truncation
		 */
		maxLength?: number;

		/**
		 * Show curator info inline
		 */
		showCurator?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { maxLength = 500, showCurator = true, class: className = '' }: Props = $props();

	const ctx = getExhibitionContext();
	const { exhibition, handlers } = ctx;

	// Check if statement needs truncation
	const needsTruncation = $derived(
		exhibition.curatorStatement && exhibition.curatorStatement.length > maxLength
	);

	// Truncated text
	const displayText = $derived(() => {
		if (!exhibition.curatorStatement) return '';
		if (!needsTruncation || ctx.statementExpanded) {
			return exhibition.curatorStatement;
		}
		return exhibition.curatorStatement.slice(0, maxLength).trim() + '...';
	});

	// Toggle expanded state
	function toggleExpanded() {
		ctx.statementExpanded = !ctx.statementExpanded;
	}

	// Handle curator click
	function handleCuratorClick() {
		handlers.onCuratorClick?.(exhibition.curator);
	}
</script>

{#if exhibition.curatorStatement}
	<section class={`exhibition-statement ${className}`} aria-labelledby="curator-statement-heading">
		<h2 id="curator-statement-heading" class="exhibition-statement__heading">
			Curator's Statement
		</h2>

		{#if showCurator}
			<button type="button" class="exhibition-statement__curator" onclick={handleCuratorClick}>
				{#if exhibition.curator.avatar}
					<img src={exhibition.curator.avatar} alt="" class="exhibition-statement__avatar" />
				{/if}
				<div class="exhibition-statement__curator-info">
					<span class="exhibition-statement__curator-name">{exhibition.curator.name}</span>
					{#if exhibition.curator.institution}
						<span class="exhibition-statement__curator-institution"
							>{exhibition.curator.institution}</span
						>
					{/if}
				</div>
			</button>
		{/if}

		<blockquote class="exhibition-statement__content">
			<p class="exhibition-statement__text">
				{displayText()}
			</p>
		</blockquote>

		{#if needsTruncation}
			<button
				type="button"
				class="exhibition-statement__toggle"
				onclick={toggleExpanded}
				aria-expanded={ctx.statementExpanded}
				aria-controls="curator-statement-content"
			>
				{ctx.statementExpanded ? 'Read less' : 'Read more'}
				<svg
					class="exhibition-statement__toggle-icon"
					class:rotated={ctx.statementExpanded}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					aria-hidden="true"
				>
					<polyline
						points="6,9 12,15 18,9"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		{/if}
	</section>
{/if}

<style>
	.exhibition-statement {
		padding: var(--gr-spacing-scale-6);
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radius-lg);
	}

	.exhibition-statement__heading {
		font-size: var(--gr-font-size-lg);
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-100);
		margin: 0 0 var(--gr-spacing-scale-4) 0;
	}

	.exhibition-statement__curator {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-3);
		background: none;
		border: none;
		padding: 0;
		margin-bottom: var(--gr-spacing-scale-4);
		cursor: pointer;
		text-align: left;
	}

	.exhibition-statement__curator:hover .exhibition-statement__curator-name {
		color: var(--gr-color-primary-400);
	}

	.exhibition-statement__avatar {
		width: 48px;
		height: 48px;
		border-radius: var(--gr-radius-full);
		object-fit: cover;
	}

	.exhibition-statement__curator-info {
		display: flex;
		flex-direction: column;
	}

	.exhibition-statement__curator-name {
		font-size: var(--gr-font-size-base);
		font-weight: var(--gr-font-weight-medium);
		color: var(--gr-color-gray-100);
		transition: color 0.2s;
	}

	.exhibition-statement__curator-institution {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-400);
	}

	.exhibition-statement__content {
		margin: 0;
		padding: 0;
		border: none;
	}

	.exhibition-statement__text {
		font-size: var(--gr-font-size-base);
		line-height: 1.7;
		color: var(--gr-color-gray-300);
		margin: 0;
		white-space: pre-wrap;
	}

	.exhibition-statement__toggle {
		display: inline-flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		margin-top: var(--gr-spacing-scale-3);
		padding: 0;
		background: none;
		border: none;
		color: var(--gr-color-primary-400);
		font-size: var(--gr-font-size-sm);
		font-weight: var(--gr-font-weight-medium);
		cursor: pointer;
		transition: color 0.2s;
	}

	.exhibition-statement__toggle:hover {
		color: var(--gr-color-primary-300);
	}

	.exhibition-statement__toggle-icon {
		width: 16px;
		height: 16px;
		transition: transform 0.2s;
	}

	.exhibition-statement__toggle-icon.rotated {
		transform: rotate(180deg);
	}

	@media (prefers-reduced-motion: reduce) {
		.exhibition-statement__curator-name,
		.exhibition-statement__toggle,
		.exhibition-statement__toggle-icon {
			transition: none;
		}
	}
</style>
