<!--
WorkInProgress.Compare - Version comparison tool

@component
-->

<script lang="ts">
	import { getWIPContext, setComparisonMode, type ComparisonMode } from './context.js';

	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const ctx = getWIPContext();
	const { thread, config, comparison } = ctx;

	// Get image URL for version
	function getVersionImage(index: number): string | null {
		const update = thread.updates[index];
		const imageMedia = update?.media?.find((m) => m.type === 'image');
		return imageMedia?.url || null;
	}

	// Handle mode change
	function handleModeChange(mode: ComparisonMode) {
		setComparisonMode(ctx, mode);
	}

	// Handle slider drag
	function handleSliderInput(event: Event) {
		const target = event.target as HTMLInputElement;
		ctx.comparison.sliderPosition = parseInt(target.value, 10);
	}

	// Handle opacity change
	function handleOpacityInput(event: Event) {
		const target = event.target as HTMLInputElement;
		ctx.comparison.overlayOpacity = parseFloat(target.value);
	}

	// Handle version selection
	function handleVersionAChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		ctx.comparison.versionA = parseInt(target.value, 10);
	}

	function handleVersionBChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		ctx.comparison.versionB = parseInt(target.value, 10);
	}

	// Images
	const imageA = $derived(getVersionImage(comparison.versionA));
	const imageB = $derived(getVersionImage(comparison.versionB));
</script>

{#if config.enableComparison && comparison.isActive}
	<div class={`wip-compare ${className}`}>
		<!-- Mode selector -->
		<div class="wip-compare__controls">
			<div class="wip-compare__modes" role="tablist">
				<button
					type="button"
					role="tab"
					class="wip-compare__mode"
					class:active={comparison.mode === 'side-by-side'}
					aria-selected={comparison.mode === 'side-by-side'}
					onclick={() => handleModeChange('side-by-side')}
				>
					Side by Side
				</button>
				<button
					type="button"
					role="tab"
					class="wip-compare__mode"
					class:active={comparison.mode === 'slider'}
					aria-selected={comparison.mode === 'slider'}
					onclick={() => handleModeChange('slider')}
				>
					Slider
				</button>
				<button
					type="button"
					role="tab"
					class="wip-compare__mode"
					class:active={comparison.mode === 'overlay'}
					aria-selected={comparison.mode === 'overlay'}
					onclick={() => handleModeChange('overlay')}
				>
					Overlay
				</button>
			</div>

			<!-- Version selectors -->
			<div class="wip-compare__selectors">
				<label class="wip-compare__selector">
					<span>Version A:</span>
					<select value={comparison.versionA} onchange={handleVersionAChange}>
						<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
						{#each thread.updates as _, index (index)}
							<option value={index}>v{index + 1}</option>
						{/each}
					</select>
				</label>
				<label class="wip-compare__selector">
					<span>Version B:</span>
					<select value={comparison.versionB} onchange={handleVersionBChange}>
						<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
						{#each thread.updates as _, index (index)}
							<option value={index}>v{index + 1}</option>
						{/each}
					</select>
				</label>
			</div>
		</div>

		<!-- Comparison view -->
		<div class="wip-compare__view" data-mode={comparison.mode}>
			{#if comparison.mode === 'side-by-side'}
				<div class="wip-compare__side-by-side">
					<div class="wip-compare__panel">
						{#if imageA}
							<img src={imageA} alt={`Version ${comparison.versionA + 1}`} />
						{/if}
						<span class="wip-compare__label">v{comparison.versionA + 1}</span>
					</div>
					<div class="wip-compare__panel">
						{#if imageB}
							<img src={imageB} alt={`Version ${comparison.versionB + 1}`} />
						{/if}
						<span class="wip-compare__label">v{comparison.versionB + 1}</span>
					</div>
				</div>
			{:else if comparison.mode === 'slider'}
				<div class="wip-compare__slider">
					<div class="wip-compare__slider-container">
						{#if imageB}
							<img
								src={imageB}
								alt={`Version ${comparison.versionB + 1}`}
								class="wip-compare__slider-base"
							/>
						{/if}
						{#if imageA}
							<div
								class="wip-compare__slider-overlay"
								style="clip-path: inset(0 {100 - comparison.sliderPosition}% 0 0)"
							>
								<img src={imageA} alt={`Version ${comparison.versionA + 1}`} />
							</div>
						{/if}
						<div class="wip-compare__slider-handle" style="left: {comparison.sliderPosition}%">
							<div class="wip-compare__slider-line"></div>
						</div>
					</div>
					<input
						type="range"
						min="0"
						max="100"
						value={comparison.sliderPosition}
						oninput={handleSliderInput}
						class="wip-compare__slider-input"
						aria-label="Comparison slider"
					/>
				</div>
			{:else if comparison.mode === 'overlay'}
				<div class="wip-compare__overlay">
					{#if imageB}
						<img
							src={imageB}
							alt={`Version ${comparison.versionB + 1}`}
							class="wip-compare__overlay-base"
						/>
					{/if}
					{#if imageA}
						<img
							src={imageA}
							alt={`Version ${comparison.versionA + 1}`}
							class="wip-compare__overlay-top"
							style="opacity: {comparison.overlayOpacity}"
						/>
					{/if}
					<label class="wip-compare__opacity-control">
						<span>Opacity:</span>
						<input
							type="range"
							min="0"
							max="1"
							step="0.1"
							value={comparison.overlayOpacity}
							oninput={handleOpacityInput}
						/>
					</label>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.wip-compare {
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radius-lg);
		overflow: hidden;
	}

	.wip-compare__controls {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: var(--gr-spacing-scale-4);
		padding: var(--gr-spacing-scale-4);
		border-bottom: 1px solid var(--gr-color-gray-700);
	}

	.wip-compare__modes {
		display: flex;
		gap: var(--gr-spacing-scale-2);
	}

	.wip-compare__mode {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border: none;
		border-radius: var(--gr-radius-md);
		color: var(--gr-color-gray-300);
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s;
	}

	.wip-compare__mode:hover {
		background: var(--gr-color-gray-600);
	}

	.wip-compare__mode.active {
		background: var(--gr-color-primary-600);
		color: white;
	}

	.wip-compare__selectors {
		display: flex;
		gap: var(--gr-spacing-scale-4);
	}

	.wip-compare__selector {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-300);
	}

	.wip-compare__selector select {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-700);
		border: 1px solid var(--gr-color-gray-600);
		border-radius: var(--gr-radius-sm);
		color: var(--gr-color-gray-100);
	}

	.wip-compare__view {
		padding: var(--gr-spacing-scale-4);
	}

	.wip-compare__side-by-side {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--gr-spacing-scale-4);
	}

	.wip-compare__panel {
		position: relative;
	}

	.wip-compare__panel img {
		width: 100%;
		height: auto;
		border-radius: var(--gr-radius-md);
	}

	.wip-compare__label {
		position: absolute;
		top: var(--gr-spacing-scale-2);
		left: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: rgba(0, 0, 0, 0.7);
		border-radius: var(--gr-radius-sm);
		font-size: var(--gr-font-size-sm);
		color: white;
	}

	.wip-compare__slider {
		position: relative;
	}

	.wip-compare__slider-container {
		position: relative;
		overflow: hidden;
		border-radius: var(--gr-radius-md);
	}

	.wip-compare__slider-base {
		width: 100%;
		display: block;
	}

	.wip-compare__slider-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.wip-compare__slider-overlay img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.wip-compare__slider-handle {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 4px;
		transform: translateX(-50%);
	}

	.wip-compare__slider-line {
		width: 100%;
		height: 100%;
		background: white;
		box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
	}

	.wip-compare__slider-input {
		width: 100%;
		margin-top: var(--gr-spacing-scale-4);
	}

	.wip-compare__overlay {
		position: relative;
	}

	.wip-compare__overlay-base {
		width: 100%;
		border-radius: var(--gr-radius-md);
	}

	.wip-compare__overlay-top {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: var(--gr-radius-md);
	}

	.wip-compare__opacity-control {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		margin-top: var(--gr-spacing-scale-4);
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-300);
	}

	.wip-compare__opacity-control input {
		flex: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.wip-compare__mode {
			transition: none;
		}
	}
</style>
