<script lang="ts">
	import type { Snippet } from 'svelte';
	import {
		preferencesStore,
		type ColorScheme,
		type Density,
		type FontSize,
		type MotionPreference,
	} from '../stores/preferences';

	interface Props {
		variant?: 'compact' | 'full';
		showPreview?: boolean;
		showAdvanced?: boolean;
		class?: string;
		value?: ColorScheme;
		onThemeChange?: (theme: ColorScheme) => void;
		children?: Snippet;
	}

	let {
		variant = 'compact', // Default to compact for header usage
		showPreview = true,
		showAdvanced = false,
		class: className = '',
		value,
		onThemeChange,
		children,
	}: Props = $props();

	// Get reactive state from preferences store
	let preferences = $state(preferencesStore.preferences);
	let state = $state(preferencesStore.state);

	// Use value prop if provided, otherwise use store
	const currentScheme = $derived(value ?? preferences.colorScheme);

	// Compact dropdown state
	let isCompactOpen = $state(false);
	let compactTrigger: HTMLElement | null = $state(null);
	let compactMenu: HTMLElement | null = $state(null);

	// Local state for color picker
	let primaryColor = $state('#3b82f6');
	let secondaryColor = $state('#8b5cf6');
	let accentColor = $state('#ec4899');
	let fontScale = $state(1);

	function syncPreferences() {
		preferences = preferencesStore.preferences;
		state = preferencesStore.state;
		primaryColor = preferences.customColors.primary;
		secondaryColor = preferences.customColors.secondary;
		accentColor = preferences.customColors.accent || '#ec4899';
		fontScale = preferences.fontScale;
	}

	syncPreferences();

	// Theme options
	const colorSchemes: { value: ColorScheme; label: string; description: string }[] = [
		{ value: 'light', label: 'Light', description: 'Light background with dark text' },
		{ value: 'dark', label: 'Dark', description: 'Dark background with light text' },
		{
			value: 'high-contrast',
			label: 'High Contrast',
			description: 'Maximum contrast for accessibility',
		},
		{ value: 'auto', label: 'Auto', description: 'Follow system preference' },
	];

	const densities: { value: Density; label: string; description: string }[] = [
		{ value: 'compact', label: 'Compact', description: 'Reduced spacing for more content' },
		{ value: 'comfortable', label: 'Comfortable', description: 'Balanced spacing' },
		{ value: 'spacious', label: 'Spacious', description: 'Extra spacing for readability' },
	];

	const fontSizes: { value: FontSize; label: string; scale: number }[] = [
		{ value: 'small', label: 'Small', scale: 0.875 },
		{ value: 'medium', label: 'Medium', scale: 1 },
		{ value: 'large', label: 'Large', scale: 1.125 },
	];

	const motionPreferences: { value: MotionPreference; label: string; description: string }[] = [
		{ value: 'normal', label: 'Normal', description: 'Full animations and transitions' },
		{ value: 'reduced', label: 'Reduced', description: 'Minimal motion for accessibility' },
	];

	const hasDocument = typeof document !== 'undefined';

	// Handlers
	function handleColorSchemeChange(scheme: ColorScheme) {
		if (value === undefined) {
			preferencesStore.setColorScheme(scheme);
			syncPreferences();
		}
		onThemeChange?.(scheme);
		if (variant === 'compact') {
			isCompactOpen = false;
		}
	}

	function handleDensityChange(density: Density) {
		preferencesStore.setDensity(density);
		syncPreferences();
	}

	function handleFontSizeChange(size: FontSize) {
		preferencesStore.setFontSize(size);
		syncPreferences();
	}

	function handleFontScaleChange(scale: number) {
		fontScale = scale;
		preferencesStore.setFontScale(scale);
		syncPreferences();
	}

	function handleMotionChange(motion: MotionPreference) {
		preferencesStore.setMotion(motion);
		syncPreferences();
	}

	function handleColorChange(type: 'primary' | 'secondary' | 'accent', color: string) {
		switch (type) {
			case 'primary':
				primaryColor = color;
				break;
			case 'secondary':
				secondaryColor = color;
				break;
			case 'accent':
				accentColor = color;
				break;
		}

		preferencesStore.setCustomColors({
			primary: primaryColor,
			secondary: secondaryColor,
			accent: accentColor,
		});
		syncPreferences();
	}

	function handleHighContrastToggle() {
		preferencesStore.setHighContrastMode(!preferences.highContrastMode);
		syncPreferences();
	}

	function resetToDefaults() {
		preferencesStore.reset();
		syncPreferences();
	}

	function exportSettings() {
		if (!hasDocument) {
			return;
		}

		const json = preferencesStore.export();
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'theme-preferences.json';
		a.click();
		URL.revokeObjectURL(url);
	}

	function importSettings(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			const json = e.target?.result as string;
			if (preferencesStore.import(json)) {
				syncPreferences();
			} else {
				alert('Invalid preferences file');
			}
		};
		reader.readAsText(file);
	}

	// Compact variant handlers
	function toggleCompact() {
		isCompactOpen = !isCompactOpen;
	}

	function closeCompact() {
		isCompactOpen = false;
	}

	// Close compact menu when clicking outside
	$effect(() => {
		if (!hasDocument || !isCompactOpen || variant !== 'compact') return;

		function handleClickOutside(event: MouseEvent) {
			if (
				compactMenu &&
				compactTrigger &&
				!compactMenu.contains(event.target as Node) &&
				!compactTrigger.contains(event.target as Node)
			) {
				closeCompact();
			}
		}

		function handleEscape(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				closeCompact();
				compactTrigger?.focus();
			}
		}

		document.addEventListener('click', handleClickOutside);
		document.addEventListener('keydown', handleEscape);

		return () => {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('keydown', handleEscape);
		};
	});

	// Get label for current scheme
	const currentSchemeLabel = $derived(() => {
		const scheme = colorSchemes.find((s) => s.value === currentScheme);
		return scheme?.label ?? 'Auto';
	});

	// Filter color schemes for compact (only show Light, Dark, Auto)
	const compactSchemes = $derived(() => {
		return colorSchemes.filter((s) => ['light', 'dark', 'auto'].includes(s.value));
	});
</script>

<div class="gr-theme-switcher gr-theme-switcher--{variant} {className}">
	{#if variant === 'compact'}
		<!-- Compact variant: dropdown button -->
		<div class="gr-theme-switcher__compact">
			<button
				bind:this={compactTrigger}
				onclick={toggleCompact}
				class="gr-theme-switcher__compact-button"
				aria-expanded={isCompactOpen}
				aria-haspopup="menu"
				type="button"
			>
				<span class="gr-theme-switcher__compact-label">{currentSchemeLabel()}</span>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="gr-theme-switcher__compact-icon"
					class:gr-theme-switcher__compact-icon--open={isCompactOpen}
				>
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
			</button>

			{#if isCompactOpen}
				<div bind:this={compactMenu} class="gr-theme-switcher__compact-menu" role="menu">
					{#each compactSchemes() as scheme (scheme.value)}
						<button
							class="gr-theme-switcher__compact-menu-item"
							class:gr-theme-switcher__compact-menu-item--active={currentScheme === scheme.value}
							role="menuitemradio"
							aria-checked={currentScheme === scheme.value}
							onclick={() => handleColorSchemeChange(scheme.value)}
							type="button"
						>
							<span class="gr-theme-switcher__compact-menu-label">{scheme.label}</span>
							{#if currentScheme === scheme.value}
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									class="gr-theme-switcher__compact-menu-check"
								>
									<polyline points="20 6 9 17 4 12"></polyline>
								</svg>
							{/if}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	{:else}
		<!-- Full variant: settings panel -->
		<div class="gr-theme-switcher__section">
			<h3 class="gr-theme-switcher__heading">Color Scheme</h3>
			<div class="gr-theme-switcher__options">
				{#each colorSchemes as scheme (scheme.value)}
					<label class="gr-theme-switcher__option">
						<input
							type="radio"
							name="colorScheme"
							value={scheme.value}
							checked={currentScheme === scheme.value}
							onchange={() => handleColorSchemeChange(scheme.value)}
							class="gr-theme-switcher__radio"
						/>
						<div class="gr-theme-switcher__option-content">
							<span class="gr-theme-switcher__option-label">{scheme.label}</span>
							<span class="gr-theme-switcher__option-description">{scheme.description}</span>
							{#if scheme.value === 'auto'}
								<span class="gr-theme-switcher__option-badge">
									Currently: {state.systemColorScheme}
								</span>
							{/if}
						</div>
					</label>
				{/each}
			</div>

			<label class="gr-theme-switcher__checkbox-label">
				<input
					type="checkbox"
					checked={preferences.highContrastMode}
					onchange={handleHighContrastToggle}
					class="gr-theme-switcher__checkbox"
				/>
				<span>Force high contrast mode</span>
			</label>
		</div>

		<div class="gr-theme-switcher__section">
			<h3 class="gr-theme-switcher__heading">Density</h3>
			<div class="gr-theme-switcher__options">
				{#each densities as density (density.value)}
					<label class="gr-theme-switcher__option">
						<input
							type="radio"
							name="density"
							value={density.value}
							checked={preferences.density === density.value}
							onchange={() => handleDensityChange(density.value)}
							class="gr-theme-switcher__radio"
						/>
						<div class="gr-theme-switcher__option-content">
							<span class="gr-theme-switcher__option-label">{density.label}</span>
							<span class="gr-theme-switcher__option-description">{density.description}</span>
						</div>
					</label>
				{/each}
			</div>
		</div>

		<div class="gr-theme-switcher__section">
			<h3 class="gr-theme-switcher__heading">Font Size</h3>
			<div class="gr-theme-switcher__options">
				{#each fontSizes as size (size.value)}
					<label class="gr-theme-switcher__option">
						<input
							type="radio"
							name="fontSize"
							value={size.value}
							checked={preferences.fontSize === size.value}
							onchange={() => handleFontSizeChange(size.value)}
							class="gr-theme-switcher__radio"
						/>
						<div class="gr-theme-switcher__option-content">
							<span class="gr-theme-switcher__option-label">{size.label}</span>
						</div>
					</label>
				{/each}
			</div>

			{#if showAdvanced}
				<div class="gr-theme-switcher__slider">
					<label for="fontScale">
						Font Scale: {fontScale.toFixed(2)}x
					</label>
					<input
						id="fontScale"
						type="range"
						min="0.85"
						max="1.5"
						step="0.05"
						value={fontScale}
						oninput={(e) => handleFontScaleChange(Number(e.currentTarget.value))}
						class="gr-theme-switcher__range"
					/>
				</div>
			{/if}
		</div>

		<div class="gr-theme-switcher__section">
			<h3 class="gr-theme-switcher__heading">Motion</h3>
			<div class="gr-theme-switcher__options">
				{#each motionPreferences as motion (motion.value)}
					<label class="gr-theme-switcher__option">
						<input
							type="radio"
							name="motion"
							value={motion.value}
							checked={preferences.motion === motion.value}
							disabled={state.systemMotion === 'reduced'}
							onchange={() => handleMotionChange(motion.value)}
							class="gr-theme-switcher__radio"
						/>
						<div class="gr-theme-switcher__option-content">
							<span class="gr-theme-switcher__option-label">{motion.label}</span>
							<span class="gr-theme-switcher__option-description">{motion.description}</span>
							{#if state.systemMotion === 'reduced' && motion.value === 'normal'}
								<span class="gr-theme-switcher__option-badge"> System prefers reduced motion </span>
							{/if}
						</div>
					</label>
				{/each}
			</div>
		</div>

		{#if showAdvanced}
			<div class="gr-theme-switcher__section">
				<h3 class="gr-theme-switcher__heading">Custom Colors</h3>
				<div class="gr-theme-switcher__colors">
					<div class="gr-theme-switcher__color-input">
						<label for="primaryColor">Primary</label>
						<div class="gr-theme-switcher__color-wrapper">
							<input
								id="primaryColor"
								type="color"
								value={primaryColor}
								oninput={(e) => handleColorChange('primary', e.currentTarget.value)}
								class="gr-theme-switcher__color-picker"
							/>
							<input
								type="text"
								value={primaryColor}
								oninput={(e) => handleColorChange('primary', e.currentTarget.value)}
								pattern="^#[0-9A-Fa-f]{6}$"
								class="gr-theme-switcher__color-text"
							/>
						</div>
					</div>

					<div class="gr-theme-switcher__color-input">
						<label for="secondaryColor">Secondary</label>
						<div class="gr-theme-switcher__color-wrapper">
							<input
								id="secondaryColor"
								type="color"
								value={secondaryColor}
								oninput={(e) => handleColorChange('secondary', e.currentTarget.value)}
								class="gr-theme-switcher__color-picker"
							/>
							<input
								type="text"
								value={secondaryColor}
								oninput={(e) => handleColorChange('secondary', e.currentTarget.value)}
								pattern="^#[0-9A-Fa-f]{6}$"
								class="gr-theme-switcher__color-text"
							/>
						</div>
					</div>

					<div class="gr-theme-switcher__color-input">
						<label for="accentColor">Accent</label>
						<div class="gr-theme-switcher__color-wrapper">
							<input
								id="accentColor"
								type="color"
								value={accentColor}
								oninput={(e) => handleColorChange('accent', e.currentTarget.value)}
								class="gr-theme-switcher__color-picker"
							/>
							<input
								type="text"
								value={accentColor}
								oninput={(e) => handleColorChange('accent', e.currentTarget.value)}
								pattern="^#[0-9A-Fa-f]{6}$"
								class="gr-theme-switcher__color-text"
							/>
						</div>
					</div>
				</div>
			</div>
		{/if}

		{#if showPreview}
			<div class="gr-theme-switcher__section">
				<h3 class="gr-theme-switcher__heading">Preview</h3>
				<div class="gr-theme-switcher__preview">
					<div class="gr-theme-switcher__preview-card">
						<h4>Sample Card</h4>
						<p>This is a preview of how your theme looks.</p>
						<div class="gr-theme-switcher__preview-buttons">
							<button
								class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--primary"
							>
								Primary
							</button>
							<button
								class="gr-theme-switcher__preview-button gr-theme-switcher__preview-button--secondary"
							>
								Secondary
							</button>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<div class="gr-theme-switcher__actions">
			<button
				onclick={resetToDefaults}
				class="gr-theme-switcher__action-button gr-theme-switcher__action-button--secondary"
			>
				Reset to Defaults
			</button>

			{#if showAdvanced}
				<button
					onclick={exportSettings}
					class="gr-theme-switcher__action-button gr-theme-switcher__action-button--secondary"
				>
					Export Settings
				</button>

				<label class="gr-theme-switcher__action-button gr-theme-switcher__action-button--secondary">
					Import Settings
					<input
						type="file"
						accept=".json"
						onchange={importSettings}
						class="gr-theme-switcher__file-input"
					/>
				</label>
			{/if}
		</div>

		{#if children}
			<div class="gr-theme-switcher__custom">
				{@render children()}
			</div>
		{/if}
	{/if}
</div>

<style>
	:global {
		.gr-theme-switcher {
			display: flex;
			flex-direction: column;
			gap: var(--gr-spacing-scale-6);
			padding: var(--gr-spacing-scale-4);
			font-family: var(--gr-typography-fontFamily-sans);
		}

		/* Compact variant */
		.gr-theme-switcher--compact {
			padding: 0;
			gap: 0;
		}

		.gr-theme-switcher__compact {
			position: relative;
			display: inline-block;
		}

		.gr-theme-switcher__compact-button {
			display: flex;
			align-items: center;
			gap: var(--gr-spacing-scale-2);
			padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
			font-family: var(--gr-typography-fontFamily-sans);
			font-size: var(--gr-typography-fontSize-base);
			font-weight: var(--gr-typography-fontWeight-medium);
			color: var(--gr-semantic-foreground-primary);
			background-color: var(--gr-semantic-background-primary);
			border: 1px solid var(--gr-semantic-border-default);
			border-radius: var(--gr-radii-md);
			cursor: pointer;
			transition: all var(--gr-motion-duration-fast) var(--gr-motion-easing-out);
		}

		.gr-theme-switcher__compact-button:hover {
			background-color: var(--gr-semantic-background-secondary);
			border-color: var(--gr-semantic-border-strong);
		}

		.gr-theme-switcher__compact-button:focus-visible {
			outline: none;
			box-shadow: 0 0 0 2px var(--gr-semantic-focus-ring);
		}

		.gr-theme-switcher__compact-label {
			white-space: nowrap;
		}

		.gr-theme-switcher__compact-icon {
			transition: transform var(--gr-motion-duration-fast) var(--gr-motion-easing-out);
		}

		.gr-theme-switcher__compact-icon--open {
			transform: rotate(180deg);
		}

		.gr-theme-switcher__compact-menu {
			position: absolute;
			top: calc(100% + var(--gr-spacing-scale-1));
			right: 0;
			min-width: 10rem;
			padding: var(--gr-spacing-scale-1);
			background-color: var(--gr-semantic-background-primary);
			border: 1px solid var(--gr-semantic-border-default);
			border-radius: var(--gr-radii-md);
			box-shadow: var(--gr-shadow-lg);
			z-index: 1000;
			display: flex;
			flex-direction: column;
			gap: var(--gr-spacing-scale-1);
		}

		.gr-theme-switcher__compact-menu-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
			font-family: var(--gr-typography-fontFamily-sans);
			font-size: var(--gr-typography-fontSize-sm);
			color: var(--gr-semantic-foreground-primary);
			background-color: transparent;
			border: none;
			border-radius: var(--gr-radii-sm);
			cursor: pointer;
			text-align: left;
			transition: background-color var(--gr-motion-duration-fast) var(--gr-motion-easing-out);
		}

		.gr-theme-switcher__compact-menu-item:hover {
			background-color: var(--gr-semantic-background-secondary);
		}

		.gr-theme-switcher__compact-menu-item--active {
			background-color: var(--gr-semantic-background-secondary);
			font-weight: var(--gr-typography-fontWeight-medium);
		}

		.gr-theme-switcher__compact-menu-item:focus-visible {
			outline: none;
			box-shadow: 0 0 0 2px var(--gr-semantic-focus-ring);
		}

		.gr-theme-switcher__compact-menu-label {
			flex: 1;
		}

		.gr-theme-switcher__compact-menu-check {
			margin-left: var(--gr-spacing-scale-2);
		}

		.gr-theme-switcher__section {
			display: flex;
			flex-direction: column;
			gap: var(--gr-spacing-scale-3);
		}

		.gr-theme-switcher__heading {
			font-size: calc(var(--gr-typography-fontSize-lg) * var(--gr-font-scale, 1));
			font-weight: var(--gr-typography-fontWeight-semibold);
			color: var(--gr-semantic-foreground-primary);
			margin: 0;
		}

		.gr-theme-switcher__options {
			display: flex;
			flex-direction: column;
			gap: var(--gr-spacing-scale-2);
		}

		.gr-theme-switcher__option {
			display: flex;
			align-items: flex-start;
			gap: var(--gr-spacing-scale-3);
			padding: var(--gr-spacing-scale-3);
			border: 1px solid var(--gr-semantic-border-default);
			border-radius: var(--gr-radii-md);
			cursor: pointer;
			transition: all var(--gr-motion-duration-fast) var(--gr-motion-easing-out);
		}

		.gr-theme-switcher__option:hover {
			background-color: var(--gr-semantic-background-secondary);
			border-color: var(--gr-semantic-border-strong);
		}

		.gr-theme-switcher__option:has(.gr-theme-switcher__radio:checked) {
			background-color: var(--gr-semantic-background-secondary);
			border-color: var(--gr-semantic-action-primary-default);
		}

		.gr-theme-switcher__radio,
		.gr-theme-switcher__checkbox {
			margin-top: 2px;
		}

		.gr-theme-switcher__option-content {
			display: flex;
			flex-direction: column;
			gap: var(--gr-spacing-scale-1);
			flex: 1;
		}

		.gr-theme-switcher__option-label {
			font-size: calc(var(--gr-typography-fontSize-base) * var(--gr-font-scale, 1));
			font-weight: var(--gr-typography-fontWeight-medium);
			color: var(--gr-semantic-foreground-primary);
		}

		.gr-theme-switcher__option-description {
			font-size: calc(var(--gr-typography-fontSize-sm) * var(--gr-font-scale, 1));
			color: var(--gr-semantic-foreground-secondary);
		}

		.gr-theme-switcher__option-badge {
			display: inline-block;
			padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
			font-size: calc(var(--gr-typography-fontSize-xs) * var(--gr-font-scale, 1));
			background-color: var(--gr-semantic-background-tertiary);
			color: var(--gr-semantic-foreground-secondary);
			border-radius: var(--gr-radii-sm);
		}

		.gr-theme-switcher__checkbox-label {
			display: flex;
			align-items: center;
			gap: var(--gr-spacing-scale-2);
			font-size: calc(var(--gr-typography-fontSize-base) * var(--gr-font-scale, 1));
			color: var(--gr-semantic-foreground-primary);
			cursor: pointer;
		}

		.gr-theme-switcher__slider {
			display: flex;
			flex-direction: column;
			gap: var(--gr-spacing-scale-2);
		}

		.gr-theme-switcher__slider label {
			font-size: calc(var(--gr-typography-fontSize-sm) * var(--gr-font-scale, 1));
			color: var(--gr-semantic-foreground-secondary);
		}

		.gr-theme-switcher__range {
			width: 100%;
		}

		.gr-theme-switcher__colors {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
			gap: var(--gr-spacing-scale-4);
		}

		.gr-theme-switcher__color-input {
			display: flex;
			flex-direction: column;
			gap: var(--gr-spacing-scale-2);
		}

		.gr-theme-switcher__color-input label {
			font-size: calc(var(--gr-typography-fontSize-sm) * var(--gr-font-scale, 1));
			color: var(--gr-semantic-foreground-secondary);
		}

		.gr-theme-switcher__color-wrapper {
			display: flex;
			gap: var(--gr-spacing-scale-2);
		}

		.gr-theme-switcher__color-picker {
			width: 48px;
			height: 36px;
			border: 1px solid var(--gr-semantic-border-default);
			border-radius: var(--gr-radii-md);
			cursor: pointer;
		}

		.gr-theme-switcher__color-text {
			flex: 1;
			padding: var(--gr-spacing-scale-2);
			border: 1px solid var(--gr-semantic-border-default);
			border-radius: var(--gr-radii-md);
			font-family: var(--gr-typography-fontFamily-mono);
			font-size: calc(var(--gr-typography-fontSize-sm) * var(--gr-font-scale, 1));
			background-color: var(--gr-semantic-background-primary);
			color: var(--gr-semantic-foreground-primary);
		}

		.gr-theme-switcher__preview {
			padding: var(--gr-spacing-scale-4);
			background-color: var(--gr-semantic-background-secondary);
			border-radius: var(--gr-radii-lg);
		}

		.gr-theme-switcher__preview-card {
			padding: var(--gr-spacing-scale-4);
			background-color: var(--gr-semantic-background-primary);
			border: 1px solid var(--gr-semantic-border-default);
			border-radius: var(--gr-radii-md);
		}

		.gr-theme-switcher__preview-card h4 {
			margin: 0 0 var(--gr-spacing-scale-2) 0;
			font-size: calc(var(--gr-typography-fontSize-lg) * var(--gr-font-scale, 1));
			font-weight: var(--gr-typography-fontWeight-semibold);
			color: var(--gr-semantic-foreground-primary);
		}

		.gr-theme-switcher__preview-card p {
			margin: 0 0 var(--gr-spacing-scale-4) 0;
			font-size: calc(var(--gr-typography-fontSize-base) * var(--gr-font-scale, 1));
			color: var(--gr-semantic-foreground-secondary);
		}

		.gr-theme-switcher__preview-buttons {
			display: flex;
			gap: var(--gr-spacing-scale-2);
		}

		.gr-theme-switcher__preview-button {
			padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
			border: none;
			border-radius: var(--gr-radii-md);
			font-size: calc(var(--gr-typography-fontSize-sm) * var(--gr-font-scale, 1));
			font-weight: var(--gr-typography-fontWeight-medium);
			cursor: pointer;
			transition: all var(--gr-motion-duration-fast) var(--gr-motion-easing-out);
		}

		.gr-theme-switcher__preview-button--primary {
			background-color: var(--gr-semantic-action-primary-default);
			color: var(--gr-color-base-white);
		}

		.gr-theme-switcher__preview-button--primary:hover {
			background-color: var(--gr-semantic-action-primary-hover);
		}

		.gr-theme-switcher__preview-button--secondary {
			background-color: transparent;
			color: var(--gr-semantic-foreground-primary);
			border: 1px solid var(--gr-semantic-border-default);
		}

		.gr-theme-switcher__preview-button--secondary:hover {
			background-color: var(--gr-semantic-background-secondary);
		}

		.gr-theme-switcher__actions {
			display: flex;
			flex-wrap: wrap;
			gap: var(--gr-spacing-scale-2);
		}

		.gr-theme-switcher__action-button {
			padding: var(--gr-spacing-scale-3) var(--gr-spacing-scale-4);
			border: 1px solid var(--gr-semantic-border-default);
			border-radius: var(--gr-radii-md);
			font-size: calc(var(--gr-typography-fontSize-base) * var(--gr-font-scale, 1));
			font-weight: var(--gr-typography-fontWeight-medium);
			background-color: var(--gr-semantic-background-primary);
			color: var(--gr-semantic-foreground-primary);
			cursor: pointer;
			transition: all var(--gr-motion-duration-fast) var(--gr-motion-easing-out);
		}

		.gr-theme-switcher__action-button:hover {
			background-color: var(--gr-semantic-background-secondary);
			border-color: var(--gr-semantic-border-strong);
		}

		.gr-theme-switcher__file-input {
			display: none;
		}

		.gr-theme-switcher__custom {
			padding-top: var(--gr-spacing-scale-4);
			border-top: 1px solid var(--gr-semantic-border-default);
		}

		/* Reduced motion support */
		@media (prefers-reduced-motion: reduce) {
			.gr-theme-switcher__option,
			.gr-theme-switcher__preview-button,
			.gr-theme-switcher__action-button {
				transition: none;
			}
		}

		/* High contrast support */
		@media (prefers-contrast: high) {
			.gr-theme-switcher__option {
				border-width: 2px;
			}

			.gr-theme-switcher__option:has(.gr-theme-switcher__radio:checked) {
				outline: 2px solid var(--gr-semantic-action-primary-default);
				outline-offset: 2px;
			}
		}

		/* Responsive design */
		@media (max-width: 640px) {
			.gr-theme-switcher {
				padding: var(--gr-spacing-scale-3);
			}

			.gr-theme-switcher__colors {
				grid-template-columns: 1fr;
			}
		}
	}
</style>
