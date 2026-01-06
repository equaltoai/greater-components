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
		const next = parseInt(target.value, 10);
		const clamped = Math.max(0, Math.min(100, Number.isFinite(next) ? next : 50));
		ctx.comparison.sliderPosition = Math.round(clamped / 5) * 5;
	}

	// Handle opacity change
	function handleOpacityInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const next = parseFloat(target.value);
		const clamped = Math.max(0, Math.min(1, Number.isFinite(next) ? next : 0.5));
		ctx.comparison.overlayOpacity = Math.round(clamped * 10) / 10;
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

	const sliderPosition = $derived(
		Math.max(0, Math.min(100, Math.round(comparison.sliderPosition / 5) * 5))
	);

	const overlayOpacityPercent = $derived(
		Math.max(0, Math.min(100, Math.round(comparison.overlayOpacity * 10) * 10))
	);
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
								class={`wip-compare__slider-overlay wip-compare__slider-overlay--p${sliderPosition}`}
							>
								<img src={imageA} alt={`Version ${comparison.versionA + 1}`} />
							</div>
						{/if}
						<div
							class={`wip-compare__slider-handle wip-compare__slider-handle--p${sliderPosition}`}
						>
							<div class="wip-compare__slider-line"></div>
						</div>
					</div>
					<input
						type="range"
						min="0"
						max="100"
						step="5"
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
							class={`wip-compare__overlay-top wip-compare__overlay-top--opacity-${overlayOpacityPercent}`}
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

	.wip-compare__slider-overlay--p0 {
		clip-path: inset(0 100% 0 0);
	}

	.wip-compare__slider-overlay--p5 {
		clip-path: inset(0 95% 0 0);
	}

	.wip-compare__slider-overlay--p10 {
		clip-path: inset(0 90% 0 0);
	}

	.wip-compare__slider-overlay--p15 {
		clip-path: inset(0 85% 0 0);
	}

	.wip-compare__slider-overlay--p20 {
		clip-path: inset(0 80% 0 0);
	}

	.wip-compare__slider-overlay--p25 {
		clip-path: inset(0 75% 0 0);
	}

	.wip-compare__slider-overlay--p30 {
		clip-path: inset(0 70% 0 0);
	}

	.wip-compare__slider-overlay--p35 {
		clip-path: inset(0 65% 0 0);
	}

	.wip-compare__slider-overlay--p40 {
		clip-path: inset(0 60% 0 0);
	}

	.wip-compare__slider-overlay--p45 {
		clip-path: inset(0 55% 0 0);
	}

	.wip-compare__slider-overlay--p50 {
		clip-path: inset(0 50% 0 0);
	}

	.wip-compare__slider-overlay--p55 {
		clip-path: inset(0 45% 0 0);
	}

	.wip-compare__slider-overlay--p60 {
		clip-path: inset(0 40% 0 0);
	}

	.wip-compare__slider-overlay--p65 {
		clip-path: inset(0 35% 0 0);
	}

	.wip-compare__slider-overlay--p70 {
		clip-path: inset(0 30% 0 0);
	}

	.wip-compare__slider-overlay--p75 {
		clip-path: inset(0 25% 0 0);
	}

	.wip-compare__slider-overlay--p80 {
		clip-path: inset(0 20% 0 0);
	}

	.wip-compare__slider-overlay--p85 {
		clip-path: inset(0 15% 0 0);
	}

	.wip-compare__slider-overlay--p90 {
		clip-path: inset(0 10% 0 0);
	}

	.wip-compare__slider-overlay--p95 {
		clip-path: inset(0 5% 0 0);
	}

	.wip-compare__slider-overlay--p100 {
		clip-path: inset(0 0 0 0);
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

	.wip-compare__slider-handle--p0 {
		left: 0%;
	}

	.wip-compare__slider-handle--p5 {
		left: 5%;
	}

	.wip-compare__slider-handle--p10 {
		left: 10%;
	}

	.wip-compare__slider-handle--p15 {
		left: 15%;
	}

	.wip-compare__slider-handle--p20 {
		left: 20%;
	}

	.wip-compare__slider-handle--p25 {
		left: 25%;
	}

	.wip-compare__slider-handle--p30 {
		left: 30%;
	}

	.wip-compare__slider-handle--p35 {
		left: 35%;
	}

	.wip-compare__slider-handle--p40 {
		left: 40%;
	}

	.wip-compare__slider-handle--p45 {
		left: 45%;
	}

	.wip-compare__slider-handle--p50 {
		left: 50%;
	}

	.wip-compare__slider-handle--p55 {
		left: 55%;
	}

	.wip-compare__slider-handle--p60 {
		left: 60%;
	}

	.wip-compare__slider-handle--p65 {
		left: 65%;
	}

	.wip-compare__slider-handle--p70 {
		left: 70%;
	}

	.wip-compare__slider-handle--p75 {
		left: 75%;
	}

	.wip-compare__slider-handle--p80 {
		left: 80%;
	}

	.wip-compare__slider-handle--p85 {
		left: 85%;
	}

	.wip-compare__slider-handle--p90 {
		left: 90%;
	}

	.wip-compare__slider-handle--p95 {
		left: 95%;
	}

	.wip-compare__slider-handle--p100 {
		left: 100%;
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

	.wip-compare__overlay-top--opacity-0 {
		opacity: 0;
	}

	.wip-compare__overlay-top--opacity-10 {
		opacity: 0.1;
	}

	.wip-compare__overlay-top--opacity-20 {
		opacity: 0.2;
	}

	.wip-compare__overlay-top--opacity-30 {
		opacity: 0.3;
	}

	.wip-compare__overlay-top--opacity-40 {
		opacity: 0.4;
	}

	.wip-compare__overlay-top--opacity-50 {
		opacity: 0.5;
	}

	.wip-compare__overlay-top--opacity-60 {
		opacity: 0.6;
	}

	.wip-compare__overlay-top--opacity-70 {
		opacity: 0.7;
	}

	.wip-compare__overlay-top--opacity-80 {
		opacity: 0.8;
	}

	.wip-compare__overlay-top--opacity-90 {
		opacity: 0.9;
	}

	.wip-compare__overlay-top--opacity-100 {
		opacity: 1;
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
