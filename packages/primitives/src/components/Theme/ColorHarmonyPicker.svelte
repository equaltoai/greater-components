<!--
  Visual color harmony selector with wheel representation
  CSP-compliant: Uses CSS custom properties instead of inline styles
-->
<script lang="ts">
	import { generateColorHarmony, type ColorHarmony } from '@equaltoai/greater-components-utils';

	interface Props {
		seedColor: string;
		harmonyType?: keyof Omit<ColorHarmony, 'base'>;
		onSelect?: (colors: string[]) => void;
	}

	let { seedColor = $bindable(), harmonyType = 'complementary', onSelect }: Props = $props();

	let harmony = $derived(generateColorHarmony(seedColor));
	let selectedColors = $derived(harmony[harmonyType] || []);

	function handleColorClick(color: string) {
		if (onSelect) {
			onSelect([seedColor, color, ...selectedColors.filter((c) => c !== color)]);
		}
	}

	function handleKeyDown(e: KeyboardEvent, color: string) {
		if (e.key === 'Enter') {
			handleColorClick(color);
		}
	}
</script>

<div class="gr-color-harmony-picker">
	<div class="gr-color-harmony-picker__visualization">
		<!-- Base color swatch using CSS custom property -->
		<div
			class="gr-color-harmony-picker__swatch gr-color-harmony-picker__swatch--base"
			style:--gr-harmony-swatch-color={seedColor}
			onclick={() => handleColorClick(seedColor)}
			title="Base Color: {seedColor}"
			role="button"
			tabindex="0"
			onkeydown={(e) => handleKeyDown(e, seedColor)}
		>
			<span class="gr-color-harmony-picker__label">Base</span>
		</div>

		{#each selectedColors as color, index (color)}
			<div
				class="gr-color-harmony-picker__swatch gr-color-harmony-picker__swatch--harmony"
				style:--gr-harmony-swatch-color={color}
				onclick={() => handleColorClick(color)}
				title="{harmonyType}: {color}"
				role="button"
				tabindex="0"
				onkeydown={(e) => handleKeyDown(e, color)}
			>
				<span class="gr-color-harmony-picker__label">{color}</span>
			</div>
		{/each}
	</div>

	<div class="gr-color-harmony-picker__info">
		<p>Harmony: <strong>{harmonyType}</strong></p>
	</div>
</div>

<style>
	.gr-color-harmony-picker {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		background: var(--gr-color-surface);
		border-radius: var(--gr-radius-md);
		border: 1px solid var(--gr-color-border);
	}

	.gr-color-harmony-picker__visualization {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
	}

	.gr-color-harmony-picker__swatch {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		border: 2px solid var(--gr-color-border);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.2s;
		background-color: var(--gr-harmony-swatch-color);
	}

	.gr-color-harmony-picker__swatch:hover {
		transform: scale(1.1);
	}

	.gr-color-harmony-picker__swatch--base {
		width: 80px;
		height: 80px;
		border-width: 3px;
		border-color: var(--gr-color-primary);
	}

	.gr-color-harmony-picker__label {
		font-size: 0.625rem;
		background: rgba(0, 0, 0, 0.5);
		color: white;
		padding: 2px 4px;
		border-radius: 4px;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.gr-color-harmony-picker__swatch:hover .gr-color-harmony-picker__label {
		opacity: 1;
	}

	.gr-color-harmony-picker__info {
		text-align: center;
		font-size: 0.875rem;
		color: var(--gr-color-text-muted);
	}
</style>
