<!--
2: CritiqueMode.Image - Annotatable artwork display
3: 
4: @component
5: -->

<script lang="ts">
	import { getCritiqueContext, zoomIn, zoomOut, resetZoom } from './context.svelte.js';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const ctx = getCritiqueContext();
	const { artwork, config, zoom } = ctx;

	let containerRef: HTMLDivElement;
	let isDragging = $state(false);
	let dragStart = $state({ x: 0, y: 0 });

	// Handle keypad controls
	function handleKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case '+':
			case '=':
				zoomIn(ctx);
				break;
			case '-':
			case '_':
				zoomOut(ctx);
				break;
			case '0':
				resetZoom(ctx);
				break;
			case 'ArrowUp':
				ctx.zoom.offsetY += 20;
				break;
			case 'ArrowDown':
				ctx.zoom.offsetY -= 20;
				break;
			case 'ArrowLeft':
				ctx.zoom.offsetX += 20;
				break;
			case 'ArrowRight':
				ctx.zoom.offsetX -= 20;
				break;
		}
	}

	// Handle click for annotation
	function handleClick(event: MouseEvent) {
		if (!ctx.isAnnotating || !config.enableAnnotations) return;
		if (isDragging) return;

		const rect = containerRef.getBoundingClientRect();
		const x = (event.clientX - rect.left) / rect.width;
		const y = (event.clientY - rect.top) / rect.height;

		ctx.pendingAnnotation = {
			type: ctx.currentTool === 'point' ? 'point' : ctx.currentTool === 'area' ? 'area' : 'point',
			position: { x, y },
		};
	}

	// Handle wheel for zoom
	function handleWheel(event: WheelEvent) {
		event.preventDefault();
		if (event.deltaY < 0) {
			zoomIn(ctx, 0.1);
		} else {
			zoomOut(ctx, 0.1);
		}
	}

	// Handle pan
	function handleMouseDown(event: MouseEvent) {
		if (event.button !== 0) return;
		isDragging = true;
		dragStart = { x: event.clientX - zoom.offsetX, y: event.clientY - zoom.offsetY };
	}

	function handleMouseMove(event: MouseEvent) {
		if (!isDragging) return;
		ctx.zoom.offsetX = event.clientX - dragStart.x;
		ctx.zoom.offsetY = event.clientY - dragStart.y;
	}

	function handleMouseUp() {
		isDragging = false;
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	bind:this={containerRef}
	class={`critique-image ${className}`}
	onclick={handleClick}
	onwheel={handleWheel}
	onmousedown={handleMouseDown}
	onmousemove={handleMouseMove}
	onmouseup={handleMouseUp}
	onmouseleave={handleMouseUp}
	onkeydown={handleKeyDown}
	tabindex="0"
	role="application"
	aria-label={`Interactive view of ${artwork.altText}`}
>
	<div
		class="critique-image__wrapper"
		style="transform: scale({zoom.level}) translate({zoom.offsetX / zoom.level}px, {zoom.offsetY /
			zoom.level}px)"
	>
		<img
			src={artwork.images.full}
			alt={artwork.altText}
			class="critique-image__img"
			draggable="false"
		/>
	</div>

	<!-- Zoom controls -->
	<div class="critique-image__zoom-controls">
		<button type="button" onclick={() => zoomIn(ctx)} aria-label="Zoom in">+</button>
		<span>{Math.round(zoom.level * 100)}%</span>
		<button type="button" onclick={() => zoomOut(ctx)} aria-label="Zoom out">−</button>
		<button type="button" onclick={() => resetZoom(ctx)} aria-label="Reset zoom">Reset</button>
	</div>
</div>

<style>
	.critique-image {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: var(--gr-color-gray-950);
	}

	.critique-image__wrapper {
		width: 100%;
		height: 100%;
		transform-origin: center center;
		transition: transform 0.1s ease-out;
	}

	.critique-image__img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		user-select: none;
	}

	.critique-image__zoom-controls {
		position: absolute;
		bottom: var(--gr-spacing-scale-4);
		right: var(--gr-spacing-scale-4);
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2);
		background: rgba(0, 0, 0, 0.7);
		border-radius: var(--gr-radius-md);
	}

	.critique-image__zoom-controls button {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--gr-color-gray-700);
		border: none;
		border-radius: var(--gr-radius-sm);
		color: white;
		cursor: pointer;
	}

	.critique-image__zoom-controls span {
		min-width: 50px;
		text-align: center;
		font-size: var(--gr-font-size-sm);
		color: white;
	}

	@media (prefers-reduced-motion: reduce) {
		.critique-image__wrapper {
			transition: none;
		}
	}
</style>
