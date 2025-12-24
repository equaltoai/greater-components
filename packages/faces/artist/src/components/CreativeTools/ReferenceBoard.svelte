<!--
ReferenceBoard - Mood board / reference collection tool

Implements REQ-FR-006: Creative Tools for Artistic Process

@component
-->

<script lang="ts">
	import type {
		ReferenceBoardData,
		ReferenceItem,
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

	// Local state
	let draggingItem = $state<string | null>(null);
	let dragOffset = $state({ x: 0, y: 0 });

	// Handle drag start
	function handleDragStart(event: MouseEvent, item: ReferenceItem) {
		if (!editable) return;
		draggingItem = item.id;
		const rect = (event.target as HTMLElement).getBoundingClientRect();
		dragOffset = {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top,
		};
	}

	// Handle drag
	function handleDrag(event: MouseEvent) {
		if (!draggingItem || !editable) return;

		const container = event.currentTarget as HTMLElement;
		const rect = container.getBoundingClientRect();
		const x = (event.clientX - rect.left - dragOffset.x) / rect.width;
		const y = (event.clientY - rect.top - dragOffset.y) / rect.height;

		handlers.onUpdateItem?.(draggingItem, {
			position: { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) },
		});
	}

	// Handle drag end
	function handleDragEnd() {
		draggingItem = null;
	}

	// Handle remove
	function handleRemove(itemId: string) {
		handlers.onRemoveItem?.(itemId);
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	class={`reference-board reference-board--${layout} ${className}`}
	style="aspect-ratio: {board.dimensions.width} / {board.dimensions
		.height}; background: {board.backgroundColor || 'var(--gr-color-gray-900)'}"
	onmousemove={handleDrag}
	onmouseup={handleDragEnd}
	onmouseleave={handleDragEnd}
	role="application"
	tabindex="0"
	aria-label={`Reference board: ${board.title}`}
>
	<header class="reference-board__header">
		<h2 class="reference-board__title">{board.title}</h2>
		{#if board.description}
			<p class="reference-board__description">{board.description}</p>
		{/if}
	</header>

	<div class="reference-board__canvas">
		{#each board.items as item (item.id)}
			<div
				class="reference-board__item"
				class:dragging={draggingItem === item.id}
				style="
					{layout === 'freeform'
					? `
						left: ${item.position.x * 100}%;
						top: ${item.position.y * 100}%;
						width: ${item.size.width}px;
						height: ${item.size.height}px;
						transform: rotate(${item.rotation || 0}deg);
						z-index: ${item.zIndex || 1};
					`
					: ''}
				"
				onmousedown={(e) => handleDragStart(e, item)}
				role="button"
				tabindex="0"
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
		border-radius: var(--gr-radius-lg);
		overflow: hidden;
	}

	.reference-board__header {
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
		width: 100%;
		height: calc(100% - 80px);
	}

	.reference-board--grid .reference-board__canvas {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-4);
	}

	.reference-board--freeform .reference-board__item {
		position: absolute;
	}

	.reference-board__item {
		position: relative;
		cursor: grab;
		transition: box-shadow 0.2s;
	}

	.reference-board__item:hover {
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
	}

	.reference-board__item.dragging {
		cursor: grabbing;
		opacity: 0.8;
		z-index: 100 !important;
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
