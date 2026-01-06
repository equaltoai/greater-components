<!--
MediaViewer.ZoomControls - Zoom control buttons

High-resolution zoom with pan capabilities.
Pinch-to-zoom for touch.
Scroll wheel zoom for desktop.
Reset zoom button.

@component
-->

<script lang="ts">
	import { getMediaViewerContext } from './context.js';

	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const context = getMediaViewerContext();
	const { config, handlers } = context;

	const ZOOM_LEVELS = [0.5, 0.75, 1, 1.5, 2, 3, 4, 5] as const;

	function normalizeZoomLevel(level: number): number {
		let closest = ZOOM_LEVELS[0];
		for (const candidate of ZOOM_LEVELS) {
			if (Math.abs(candidate - level) < Math.abs(closest - level)) {
				closest = candidate;
			}
		}
		return closest;
	}

	function zoomStep(direction: 'in' | 'out'): number {
		const normalized = normalizeZoomLevel(context.zoomLevel);
		const index = ZOOM_LEVELS.indexOf(normalized);
		if (index === -1) return 1;

		const nextIndex =
			direction === 'in' ? Math.min(ZOOM_LEVELS.length - 1, index + 1) : Math.max(0, index - 1);

		return ZOOM_LEVELS[nextIndex] ?? 1;
	}

	const normalizedZoom = $derived(normalizeZoomLevel(context.zoomLevel));

	// Zoom functions
	function zoomIn() {
		if (config.enableZoom) {
			context.zoomLevel = zoomStep('in');
			handlers.onZoom?.(context.zoomLevel);
		}
	}

	function zoomOut() {
		if (config.enableZoom) {
			context.zoomLevel = zoomStep('out');
			handlers.onZoom?.(context.zoomLevel);
		}
	}

	function resetZoom() {
		context.zoomLevel = 1;
		context.panOffset = { x: 0, y: 0 };
		handlers.onZoom?.(1);
	}

	// Format zoom percentage
	const zoomPercent = $derived(Math.round(normalizedZoom * 100));
</script>

{#if config.enableZoom}
	<div class="gr-artist-media-viewer-zoom {className}" role="group" aria-label="Zoom controls">
		<button
			class="gr-artist-media-viewer-zoom-btn"
			onclick={zoomOut}
			disabled={normalizedZoom <= 0.5}
			aria-label="Zoom out"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<circle cx="11" cy="11" r="8" />
				<line x1="21" y1="21" x2="16.65" y2="16.65" />
				<line x1="8" y1="11" x2="14" y2="11" />
			</svg>
		</button>

		<span class="gr-artist-media-viewer-zoom-level" aria-live="polite">
			{zoomPercent}%
		</span>

		<button
			class="gr-artist-media-viewer-zoom-btn"
			onclick={zoomIn}
			disabled={normalizedZoom >= 5}
			aria-label="Zoom in"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<circle cx="11" cy="11" r="8" />
				<line x1="21" y1="21" x2="16.65" y2="16.65" />
				<line x1="11" y1="8" x2="11" y2="14" />
				<line x1="8" y1="11" x2="14" y2="11" />
			</svg>
		</button>

		<button
			class="gr-artist-media-viewer-zoom-btn gr-artist-media-viewer-zoom-reset"
			onclick={resetZoom}
			disabled={normalizedZoom === 1}
			aria-label="Reset zoom"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
				<path d="M3 3v5h5" />
			</svg>
		</button>
	</div>
{/if}

<style>
	.gr-artist-media-viewer-zoom {
		position: absolute;
		bottom: var(--gr-spacing-scale-4);
		right: var(--gr-spacing-scale-4);
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2);
		background: rgba(0, 0, 0, 0.6);
		border-radius: var(--gr-radii-md);
	}

	.gr-artist-media-viewer-zoom-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: var(--gr-radii-sm);
		color: white;
		cursor: pointer;
		transition:
			background-color 200ms ease-out,
			opacity 200ms ease-out;
	}

	.gr-artist-media-viewer-zoom-btn:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.1);
	}

	.gr-artist-media-viewer-zoom-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.gr-artist-media-viewer-zoom-btn:focus-visible {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.gr-artist-media-viewer-zoom-btn svg {
		width: 20px;
		height: 20px;
	}

	.gr-artist-media-viewer-zoom-level {
		min-width: 48px;
		text-align: center;
		font-size: var(--gr-typography-fontSize-sm);
		color: white;
	}

	.gr-artist-media-viewer-zoom-reset {
		margin-left: var(--gr-spacing-scale-2);
		border-left: 1px solid rgba(255, 255, 255, 0.2);
		padding-left: var(--gr-spacing-scale-2);
	}

	/* REQ-A11Y-007: Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.gr-artist-media-viewer-zoom-btn {
			transition: none;
		}
	}
</style>
