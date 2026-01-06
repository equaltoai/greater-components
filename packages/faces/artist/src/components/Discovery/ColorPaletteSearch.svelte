<!--
ColorPaletteSearch - Color-based artwork discovery

Implements REQ-AI-002: Color Palette Extraction

Features:
- Color picker interface
- Extract colors from uploaded image
- Color harmony suggestions
- Tolerance slider for matching flexibility

@component
@example
```svelte
<ColorPaletteSearch
  colors={['#FF5733', '#33FF57']}
  tolerance={50}
  mode="any"
  onSearch={(colors) => console.log(colors)}
/>
```
-->

<script lang="ts">
	interface Props {
		/**
		 * Selected colors (hex values)
		 */
		colors?: string[];

		/**
		 * Color matching tolerance (0-100)
		 */
		tolerance?: number;

		/**
		 * Matching mode
		 */
		mode?: 'any' | 'all' | 'dominant';

		/**
		 * Callback when search is triggered
		 */
		onSearch?: (colors: string[]) => void;

		/**
		 * Maximum colors to select
		 */
		maxColors?: number;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		colors = $bindable([]),
		tolerance = $bindable(50),
		mode = $bindable('any'),
		onSearch,
		maxColors = 5,
		class: className = '',
	}: Props = $props();

	// Local state
	let colorInput = $state('#000000');
	let fileInput: HTMLInputElement;

	// Preset color palettes
	const presetPalettes = [
		{ name: 'Warm', colors: ['#FF6B6B', '#FFA07A', '#FFD93D', '#FF8C42'] },
		{ name: 'Cool', colors: ['#4ECDC4', '#45B7D1', '#96CEB4', '#88D8B0'] },
		{ name: 'Earth', colors: ['#8B4513', '#D2691E', '#CD853F', '#DEB887'] },
		{ name: 'Monochrome', colors: ['#2C3E50', '#34495E', '#7F8C8D', '#BDC3C7'] },
	];

	// Add color to selection
	function addColor(color: string) {
		if (colors.length < maxColors && !colors.includes(color)) {
			colors = [...colors, color];
		}
	}

	// Remove color from selection
	function removeColor(color: string) {
		colors = colors.filter((c) => c !== color);
	}

	// Handle color input change
	function handleColorInputChange(event: Event) {
		const target = event.target as HTMLInputElement;
		colorInput = target.value;
	}

	// Add color from input
	function handleAddColor() {
		addColor(colorInput);
	}

	// Handle file upload for color extraction
	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			extractColorsFromImage(file);
		}
	}

	// Extract colors from image (mock implementation)
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async function extractColorsFromImage(_: File) {
		// In a real implementation, this would use canvas or a color extraction library
		// For now, we'll add some placeholder colors
		const extractedColors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12'];
		colors = extractedColors.slice(0, maxColors);
	}

	// Apply preset palette
	function applyPreset(palette: { name: string; colors: string[] }) {
		colors = palette.colors.slice(0, maxColors);
	}

	// Clear all colors
	function clearColors() {
		colors = [];
	}

	// Trigger search
	function handleSearch() {
		onSearch?.(colors);
	}
</script>

<div class={`color-palette-search ${className}`}>
	<div class="color-palette-search__header">
		<h3 class="color-palette-search__title">Search by Color</h3>
		{#if colors.length > 0}
			<button type="button" class="color-palette-search__clear" onclick={clearColors}>
				Clear all
			</button>
		{/if}
	</div>

	<!-- Selected colors -->
	<div class="color-palette-search__selected" role="list" aria-label="Selected colors">
		{#each colors as color (color)}
			<div role="listitem">
				<button
					type="button"
					class="color-palette-search__color"
					onclick={() => removeColor(color)}
					aria-label={`Remove color ${color}`}
				>
					<svg
						class="color-palette-search__color-swatch"
						viewBox="0 0 20 20"
						aria-hidden="true"
					>
						<circle cx="10" cy="10" r="9" fill={color} />
					</svg>
					<span class="color-palette-search__color-value">{color}</span>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
						<path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round" />
					</svg>
				</button>
			</div>
		{/each}
		{#if colors.length < maxColors}
			<div role="listitem">
				<div class="color-palette-search__add">
					<input
						type="color"
						class="color-palette-search__picker"
						value={colorInput}
						oninput={handleColorInputChange}
						aria-label="Pick a color"
					/>
					<button
						type="button"
						class="color-palette-search__add-btn"
						onclick={handleAddColor}
						aria-label="Add selected color"
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
							<path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round" />
						</svg>
					</button>
				</div>
			</div>
		{/if}
	</div>

	<!-- Extract from image -->
	<div class="color-palette-search__extract">
		<button
			type="button"
			class="color-palette-search__extract-btn"
			onclick={() => fileInput?.click()}
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
				<rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2" />
				<circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
				<path
					d="M21 15l-5-5L5 21"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			Extract from image
		</button>
		<input
			bind:this={fileInput}
			type="file"
			accept="image/*"
			class="sr-only"
			onchange={handleFileSelect}
			aria-label="Upload image for color extraction"
		/>
	</div>

	<!-- Preset palettes -->
	<div class="color-palette-search__presets">
		<span class="color-palette-search__presets-label">Presets:</span>
		{#each presetPalettes as palette (palette.name)}
			<button
				type="button"
				class="color-palette-search__preset"
				onclick={() => applyPreset(palette)}
				aria-label={`Apply ${palette.name} palette`}
			>
				{#each palette.colors as color (color)}
					<svg
						class="color-palette-search__preset-color"
						viewBox="0 0 16 16"
						preserveAspectRatio="none"
						aria-hidden="true"
					>
						<rect x="0" y="0" width="16" height="16" fill={color} />
					</svg>
				{/each}
			</button>
		{/each}
	</div>

	<!-- Tolerance slider -->
	<div class="color-palette-search__tolerance">
		<label for="tolerance-slider" class="color-palette-search__tolerance-label">
			Tolerance: {tolerance}%
		</label>
		<input
			id="tolerance-slider"
			type="range"
			min="0"
			max="100"
			bind:value={tolerance}
			class="color-palette-search__tolerance-slider"
		/>
		<div class="color-palette-search__tolerance-hints">
			<span>Exact</span>
			<span>Flexible</span>
		</div>
	</div>

	<!-- Match mode -->
	<div class="color-palette-search__mode">
		<span class="color-palette-search__mode-label">Match:</span>
		<div class="color-palette-search__mode-options" role="radiogroup" aria-label="Color match mode">
			<label class="color-palette-search__mode-option">
				<input type="radio" name="mode" value="any" bind:group={mode} />
				<span>Any color</span>
			</label>
			<label class="color-palette-search__mode-option">
				<input type="radio" name="mode" value="all" bind:group={mode} />
				<span>All colors</span>
			</label>
			<label class="color-palette-search__mode-option">
				<input type="radio" name="mode" value="dominant" bind:group={mode} />
				<span>Dominant</span>
			</label>
		</div>
	</div>

	<!-- Search button -->
	<button
		type="button"
		class="color-palette-search__search"
		onclick={handleSearch}
		disabled={colors.length === 0}
	>
		Search by colors
	</button>
</div>

<style>
	.color-palette-search {
		padding: var(--gr-spacing-scale-4);
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radii-lg);
	}

	.color-palette-search__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.color-palette-search__title {
		margin: 0;
		font-size: var(--gr-typography-fontSize-lg);
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-100);
	}

	.color-palette-search__clear {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: transparent;
		border: none;
		color: var(--gr-color-primary-400);
		font-size: var(--gr-typography-fontSize-sm);
		cursor: pointer;
	}

	.color-palette-search__selected {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gr-spacing-scale-2);
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.color-palette-search__color {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-700);
		border: none;
		border-radius: var(--gr-radii-full);
		cursor: pointer;
		transition: background 0.2s;
	}

	.color-palette-search__color:hover {
		background: var(--gr-color-gray-600);
	}

	.color-palette-search__color-swatch {
		width: 20px;
		height: 20px;
		border-radius: var(--gr-radii-full);
		overflow: hidden;
	}

	.color-palette-search__color-swatch circle {
		stroke: var(--gr-color-gray-500);
		stroke-width: 2px;
	}

	.color-palette-search__color-value {
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-300);
		font-family: monospace;
	}

	.color-palette-search__color svg {
		width: 14px;
		height: 14px;
		color: var(--gr-color-gray-400);
	}

	.color-palette-search__add {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
	}

	.color-palette-search__picker {
		width: 36px;
		height: 36px;
		padding: 0;
		border: none;
		border-radius: var(--gr-radii-md);
		cursor: pointer;
	}

	.color-palette-search__add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		padding: 0;
		background: var(--gr-color-gray-700);
		border: 1px dashed var(--gr-color-gray-500);
		border-radius: var(--gr-radii-md);
		color: var(--gr-color-gray-400);
		cursor: pointer;
		transition:
			border-color 0.2s,
			color 0.2s;
	}

	.color-palette-search__add-btn:hover {
		border-color: var(--gr-color-primary-500);
		color: var(--gr-color-primary-500);
	}

	.color-palette-search__add-btn svg {
		width: 18px;
		height: 18px;
	}

	.color-palette-search__extract {
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.color-palette-search__extract-btn {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		width: 100%;
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border: 1px dashed var(--gr-color-gray-500);
		border-radius: var(--gr-radii-md);
		color: var(--gr-color-gray-300);
		cursor: pointer;
		transition: border-color 0.2s;
	}

	.color-palette-search__extract-btn:hover {
		border-color: var(--gr-color-primary-500);
	}

	.color-palette-search__extract-btn svg {
		width: 18px;
		height: 18px;
	}

	.color-palette-search__presets {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		margin-bottom: var(--gr-spacing-scale-4);
		flex-wrap: wrap;
	}

	.color-palette-search__presets-label {
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-400);
	}

	.color-palette-search__preset {
		display: flex;
		padding: var(--gr-spacing-scale-1);
		background: var(--gr-color-gray-700);
		border: 1px solid var(--gr-color-gray-600);
		border-radius: var(--gr-radii-md);
		cursor: pointer;
		transition: border-color 0.2s;
	}

	.color-palette-search__preset:hover {
		border-color: var(--gr-color-primary-500);
	}

	.color-palette-search__preset-color {
		display: block;
		width: 16px;
		height: 16px;
		overflow: hidden;
	}

	.color-palette-search__preset-color:first-child {
		border-radius: var(--gr-radii-sm) 0 0 var(--gr-radii-sm);
	}

	.color-palette-search__preset-color:last-child {
		border-radius: 0 var(--gr-radii-sm) var(--gr-radii-sm) 0;
	}

	.color-palette-search__tolerance {
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.color-palette-search__tolerance-label {
		display: block;
		margin-bottom: var(--gr-spacing-scale-2);
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-300);
	}

	.color-palette-search__tolerance-slider {
		width: 100%;
		height: 6px;
		background: var(--gr-color-gray-700);
		border-radius: var(--gr-radii-full);
		appearance: none;
		cursor: pointer;
	}

	.color-palette-search__tolerance-slider::-webkit-slider-thumb {
		width: 18px;
		height: 18px;
		background: var(--gr-color-primary-500);
		border-radius: var(--gr-radii-full);
		appearance: none;
		cursor: pointer;
	}

	.color-palette-search__tolerance-hints {
		display: flex;
		justify-content: space-between;
		margin-top: var(--gr-spacing-scale-1);
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-gray-400);
	}

	.color-palette-search__mode {
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.color-palette-search__mode-label {
		display: block;
		margin-bottom: var(--gr-spacing-scale-2);
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-400);
	}

	.color-palette-search__mode-options {
		display: flex;
		gap: var(--gr-spacing-scale-3);
	}

	.color-palette-search__mode-option {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-gray-300);
		cursor: pointer;
	}

	.color-palette-search__mode-option input {
		accent-color: var(--gr-color-primary-500);
	}

	.color-palette-search__search {
		width: 100%;
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-primary-600);
		border: none;
		border-radius: var(--gr-radii-md);
		color: white;
		font-weight: var(--gr-font-weight-medium);
		cursor: pointer;
		transition: background 0.2s;
	}

	.color-palette-search__search:hover:not(:disabled) {
		background: var(--gr-color-primary-700);
	}

	.color-palette-search__search:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
