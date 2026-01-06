<!--
ReferenceBoard - Mood board / reference collection tool

Implements REQ-FR-006: Creative Tools for Artistic Process

@component
-->

<script lang="ts">
	import type {
		ReferenceBoardData,
		ReferenceBoardHandlers,
	} from '../../types/creative-tools.js';

	interface Props {
		board: ReferenceBoardData;
		editable?: boolean;
		showSources?: boolean;
		handlers?: ReferenceBoardHandlers;
		layout?: 'grid' | 'freeform';
		class?: string;
	}

	let {
		board,
		editable = false,
		showSources = true,
		handlers = {},
		layout = 'freeform',
		class: className = '',
	}: Props = $props();

	const effectiveLayout = $derived(layout === 'freeform' ? 'grid' : layout);

	// Handle remove
	function handleRemove(itemId: string) {
		handlers.onRemoveItem?.(itemId);
	}

	const boardRatioClass = $derived(() => {
		const ratio = board.dimensions.width / board.dimensions.height;
		if (ratio >= 1.6) return 'reference-board--ratio-wide';
		if (ratio >= 1.2) return 'reference-board--ratio-landscape';
		if (ratio >= 0.9) return 'reference-board--ratio-square';
		return 'reference-board--ratio-portrait';
	});

	const backgroundFill = $derived(
		board.backgroundColor?.trim() ? board.backgroundColor : 'var(--gr-color-gray-900)'
	);
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	class={`reference-board reference-board--${effectiveLayout} ${boardRatioClass} ${className}`}
	role="application"
	tabindex="0"
	aria-label={`Reference board: ${board.title}`}
>
	<svg
		class="reference-board__background"
		viewBox="0 0 100 100"
		preserveAspectRatio="none"
		aria-hidden="true"
	>
		<rect x="0" y="0" width="100" height="100" fill={backgroundFill} />
	</svg>

	<header class="reference-board__header">
		<h2 class="reference-board__title">{board.title}</h2>
		{#if board.description}
			<p class="reference-board__description">{board.description}</p>
		{/if}
	</header>

	<div class="reference-board__canvas" role="list" aria-label="Reference items">
		{#each board.items as item (item.id)}
			<div
				class="reference-board__item"
				role="listitem"
				aria-label={item.title || 'Reference image'}
			>
				<img
					src={item.thumbnailUrl || item.imageUrl}
					alt={item.title || 'Reference'}
					class="reference-board__image"
					draggable="false"
				/>

				{#if showSources && item.attribution}
					<span class="reference-board__attribution">{item.attribution}</span>
				{/if}

				{#if item.notes}
					<div class="reference-board__notes">{item.notes}</div>
				{/if}

				{#if editable}
					<button
						type="button"
						class="reference-board__remove"
						onclick={() => handleRemove(item.id)}
						aria-label="Remove reference"
					>
						×
					</button>
				{/if}
			</div>
		{/each}
	</div>

	{#if editable}
		<div class="reference-board__actions">
			<button
				type="button"
				class="reference-board__action"
				onclick={() => handlers.onSave?.(board)}
			>
				Save Board
			</button>
			<button
				type="button"
				class="reference-board__action reference-board__action--secondary"
				onclick={() => handlers.onShare?.(board)}
			>
				Share
			</button>
		</div>
	{/if}
</div>

<style>
	.reference-board {
		position: relative;
		width: 100%;
		aspect-ratio: 4 / 3;
		border-radius: var(--gr-radius-lg);
		overflow: hidden;
	}

	.reference-board--ratio-square {
		aspect-ratio: 1 / 1;
	}

	.reference-board--ratio-landscape {
		aspect-ratio: 4 / 3;
	}

	.reference-board--ratio-wide {
		aspect-ratio: 16 / 9;
	}

	.reference-board--ratio-portrait {
		aspect-ratio: 3 / 4;
	}

	.reference-board__background {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
	}

	.reference-board__header {
		position: relative;
		z-index: 1;
		padding: var(--gr-spacing-scale-4);
		background: rgba(0, 0, 0, 0.5);
	}

	.reference-board__title {
		font-size: var(--gr-font-size-lg);
		font-weight: var(--gr-font-weight-semibold);
		color: white;
		margin: 0;
	}

	.reference-board__description {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-300);
		margin: var(--gr-spacing-scale-2) 0 0 0;
	}

	.reference-board__canvas {
		position: relative;
		z-index: 1;
		width: 100%;
		height: calc(100% - 80px);
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-4);
		align-content: start;
	}

	.reference-board__item {
		position: relative;
		cursor: default;
		transition: box-shadow 0.2s;
	}

	.reference-board__item:hover {
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
	}

	.reference-board__image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: var(--gr-radius-sm);
	}

	.reference-board__attribution {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: rgba(0, 0, 0, 0.7);
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-gray-300);
		border-radius: 0 0 var(--gr-radius-sm) var(--gr-radius-sm);
	}

	.reference-board__notes {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		padding: var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-800);
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-gray-300);
		border-radius: var(--gr-radius-sm);
		margin-top: var(--gr-spacing-scale-1);
		opacity: 0;
		transition: opacity 0.2s;
	}

	.reference-board__item:hover .reference-board__notes {
		opacity: 1;
	}

	.reference-board__remove {
		position: absolute;
		top: var(--gr-spacing-scale-1);
		right: var(--gr-spacing-scale-1);
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.7);
		border: none;
		border-radius: var(--gr-radius-full);
		color: white;
		cursor: pointer;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.reference-board__item:hover .reference-board__remove {
		opacity: 1;
	}

	.reference-board__actions {
		position: absolute;
		bottom: var(--gr-spacing-scale-4);
		right: var(--gr-spacing-scale-4);
		z-index: 2;
		display: flex;
		gap: var(--gr-spacing-scale-2);
	}

	.reference-board__action {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		background: var(--gr-color-primary-600);
		border: none;
		border-radius: var(--gr-radius-md);
		color: white;
		cursor: pointer;
	}

	.reference-board__action--secondary {
		background: var(--gr-color-gray-700);
	}

	@media (prefers-reduced-motion: reduce) {
		.reference-board__item,
		.reference-board__notes,
		.reference-board__remove {
			transition: none;
		}
	}
</style>
