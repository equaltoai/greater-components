<!--
MoodMap - Mood-based artwork discovery

Implements REQ-AI-004: Mood Mapping

Features:
- Visual mood/emotion-based discovery
- 2D coordinate selection (energy vs. valence)
- Artwork clusters visualization
- Click/drag to select mood region
- Preview artworks in selected region

@component
@example
```svelte
<MoodMap
  dimensions={['energy', 'valence']}
  selection={{ x: 0.5, y: 0.5 }}
/>
```
-->

<script lang="ts">
	import type { MoodDimensions } from '../../types/discovery.js';

	interface Props {
		/**
		 * Dimension labels for axes
		 */
		dimensions?: [string, string];

		/**
		 * Current selection coordinates (-1 to 1)
		 */
		selection?: { x: number; y: number };

		/**
		 * Callback when selection changes
		 */
		onChange?: (dimensions: MoodDimensions) => void;

		/**
		 * Selection radius (0-1)
		 */
		radius?: number;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		dimensions = ['Energy', 'Valence'],
		selection = $bindable({ x: 0, y: 0 }),
		onChange,
		radius = 0.2,
		class: className = '',
	}: Props = $props();

	// Local state
	let isDragging = $state(false);
	let mapElement: HTMLDivElement;

	// Mood presets
	const moodPresets = [
		{ name: 'Calm', x: -0.7, y: 0.5, emoji: '😌' },
		{ name: 'Joyful', x: 0.7, y: 0.8, emoji: '😊' },
		{ name: 'Energetic', x: 0.9, y: 0.3, emoji: '⚡' },
		{ name: 'Melancholic', x: -0.5, y: -0.6, emoji: '😢' },
		{ name: 'Intense', x: 0.8, y: -0.5, emoji: '🔥' },
		{ name: 'Peaceful', x: -0.8, y: 0.7, emoji: '🕊️' },
	];

	// Convert selection to CSS position (0-100%)
	const selectionX = $derived(((selection.x + 1) / 2) * 100);
	const selectionY = $derived(((1 - selection.y) / 2) * 100); // Invert Y for CSS

	// Handle mouse/touch events
	function handlePointerDown(event: PointerEvent) {
		isDragging = true;
		updateSelection(event);
		(event.target as HTMLElement).setPointerCapture(event.pointerId);
	}

	function handlePointerMove(event: PointerEvent) {
		if (!isDragging) return;
		updateSelection(event);
	}

	function handlePointerUp() {
		isDragging = false;
	}

	function updateSelection(event: PointerEvent) {
		if (!mapElement) return;

		const rect = mapElement.getBoundingClientRect();
		const x = (event.clientX - rect.left) / rect.width;
		const y = (event.clientY - rect.top) / rect.height;

		// Convert to -1 to 1 range
		selection = {
			x: Math.max(-1, Math.min(1, x * 2 - 1)),
			y: Math.max(-1, Math.min(1, 1 - y * 2)), // Invert Y
		};

		onChange?.({
			energy: selection.x,
			valence: selection.y,
		});
	}

	// Apply preset
	function applyPreset(preset: { x: number; y: number }) {
		selection = { x: preset.x, y: preset.y };
		onChange?.({
			energy: selection.x,
			valence: selection.y,
		});
	}

	// Clear selection
	function clearSelection() {
		selection = { x: 0, y: 0 };
		onChange?.({
			energy: 0,
			valence: 0,
		});
	}
</script>

<div class={`mood-map ${className}`}>
	<div class="mood-map__header">
		<h3 class="mood-map__title">Mood Discovery</h3>
		<button type="button" class="mood-map__clear" onclick={clearSelection}> Reset </button>
	</div>

	<!-- Mood presets -->
	<div class="mood-map__presets">
		{#each moodPresets as preset (preset.name)}
			<button
				type="button"
				class="mood-map__preset"
				onclick={() => applyPreset(preset)}
				aria-label={`Select ${preset.name} mood`}
			>
				<span class="mood-map__preset-emoji">{preset.emoji}</span>
				<span class="mood-map__preset-name">{preset.name}</span>
			</button>
		{/each}
	</div>

	<!-- 2D mood map -->
	<div
		bind:this={mapElement}
		class="mood-map__canvas"
		role="slider"
		aria-label="Mood selection map"
		aria-valuenow={selection.x}
		aria-valuetext={`Energy: ${selection.x.toFixed(2)}, Valence: ${selection.y.toFixed(2)}`}
		tabindex="0"
		onpointerdown={handlePointerDown}
		onpointermove={handlePointerMove}
		onpointerup={handlePointerUp}
		onpointercancel={handlePointerUp}
	>
		<!-- Axis labels -->
		<span class="mood-map__label mood-map__label--top">Positive</span>
		<span class="mood-map__label mood-map__label--bottom">Negative</span>
		<span class="mood-map__label mood-map__label--left">Calm</span>
		<span class="mood-map__label mood-map__label--right">Energetic</span>

		<!-- Grid lines -->
		<div class="mood-map__grid" aria-hidden="true">
			<div class="mood-map__grid-line mood-map__grid-line--h"></div>
			<div class="mood-map__grid-line mood-map__grid-line--v"></div>
		</div>

		<!-- Gradient background -->
		<div class="mood-map__gradient" aria-hidden="true"></div>

		<!-- Selection indicator -->
		<div
			class="mood-map__selection"
			style:left="{selectionX}%"
			style:top="{selectionY}%"
			style:--radius="{radius * 100}%"
			aria-hidden="true"
		>
			<div class="mood-map__selection-ring"></div>
			<div class="mood-map__selection-dot"></div>
		</div>
	</div>

	<!-- Current values -->
	<div class="mood-map__values">
		<div class="mood-map__value">
			<span class="mood-map__value-label">{dimensions[0]}:</span>
			<span class="mood-map__value-number">{selection.x.toFixed(2)}</span>
		</div>
		<div class="mood-map__value">
			<span class="mood-map__value-label">{dimensions[1]}:</span>
			<span class="mood-map__value-number">{selection.y.toFixed(2)}</span>
		</div>
	</div>
</div>

<style>
	.mood-map {
		padding: var(--gr-spacing-scale-4);
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radii-lg);
	}

	.mood-map__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.mood-map__title {
		margin: 0;
		font-size: var(--gr-typography-fontSize-lg);
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-100);
	}

	.mood-map__clear {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: transparent;
		border: none;
		color: var(--gr-color-primary-400);
		font-size: var(--gr-typography-fontSize-sm);
		cursor: pointer;
	}

	.mood-map__presets {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gr-spacing-scale-2);
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.mood-map__preset {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-700);
		border: 1px solid var(--gr-color-gray-600);
		border-radius: var(--gr-radii-full);
		color: var(--gr-color-gray-200);
		font-size: var(--gr-typography-fontSize-sm);
		cursor: pointer;
		transition: border-color 0.2s;
	}

	.mood-map__preset:hover {
		border-color: var(--gr-color-primary-500);
	}

	.mood-map__preset-emoji {
		font-size: 1.2em;
	}

	.mood-map__canvas {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		background: var(--gr-color-gray-900);
		border-radius: var(--gr-radii-lg);
		overflow: hidden;
		cursor: crosshair;
		touch-action: none;
	}

	.mood-map__canvas:focus {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.mood-map__label {
		position: absolute;
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-500);
		pointer-events: none;
	}

	.mood-map__label--top {
		top: var(--gr-spacing-scale-2);
		left: 50%;
		transform: translateX(-50%);
	}

	.mood-map__label--bottom {
		bottom: var(--gr-spacing-scale-2);
		left: 50%;
		transform: translateX(-50%);
	}

	.mood-map__label--left {
		left: var(--gr-spacing-scale-2);
		top: 50%;
		transform: translateY(-50%);
	}

	.mood-map__label--right {
		right: var(--gr-spacing-scale-2);
		top: 50%;
		transform: translateY(-50%);
	}

	.mood-map__grid {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.mood-map__grid-line {
		position: absolute;
		background: var(--gr-color-gray-700);
	}

	.mood-map__grid-line--h {
		left: 0;
		right: 0;
		top: 50%;
		height: 1px;
	}

	.mood-map__grid-line--v {
		top: 0;
		bottom: 0;
		left: 50%;
		width: 1px;
	}

	.mood-map__gradient {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(circle at 75% 25%, rgba(255, 200, 100, 0.2), transparent 50%),
			radial-gradient(circle at 25% 25%, rgba(100, 200, 255, 0.2), transparent 50%),
			radial-gradient(circle at 75% 75%, rgba(255, 100, 100, 0.2), transparent 50%),
			radial-gradient(circle at 25% 75%, rgba(100, 100, 200, 0.2), transparent 50%);
		pointer-events: none;
	}

	.mood-map__selection {
		position: absolute;
		transform: translate(-50%, -50%);
		pointer-events: none;
	}

	.mood-map__selection-ring {
		position: absolute;
		width: calc(var(--radius) * 2);
		height: calc(var(--radius) * 2);
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border: 2px solid var(--gr-color-primary-500);
		border-radius: 50%;
		opacity: 0.5;
	}

	.mood-map__selection-dot {
		width: 16px;
		height: 16px;
		background: var(--gr-color-primary-500);
		border: 2px solid white;
		border-radius: 50%;
		box-shadow: var(--gr-shadow-md);
	}

	.mood-map__values {
		display: flex;
		justify-content: center;
		gap: var(--gr-spacing-scale-6);
		margin-top: var(--gr-spacing-scale-4);
	}

	.mood-map__value {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
	}

	.mood-map__value-label {
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-400);
	}

	.mood-map__value-number {
		font-size: var(--gr-typography-fontSize-sm);
		font-family: monospace;
		color: var(--gr-color-gray-200);
	}
</style>
