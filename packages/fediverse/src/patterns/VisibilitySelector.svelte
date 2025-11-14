<!--
  VisibilitySelector - Post Visibility Selection Component
  
  Allows users to select post visibility: Public, Unlisted, Followers-only, or Direct.
  Follows ActivityPub audience targeting patterns.
  
  @component
  @example
  ```svelte
  <VisibilitySelector
    bind:value={visibility}
    {config}
    {onChange}
  />
  ```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createMenu } from '@equaltoai/greater-components-headless/menu';

	export type PostVisibility = 'public' | 'unlisted' | 'private' | 'direct';

	interface VisibilityOption {
		value: PostVisibility;
		label: string;
		description: string;
		icon: string;
	}

	interface VisibilityConfig {
		/**
		 * Available visibility options
		 */
		options?: PostVisibility[];

		/**
		 * Display mode
		 */
		mode?: 'dropdown' | 'buttons' | 'inline';

		/**
		 * Show descriptions
		 */
		showDescriptions?: boolean;

		/**
		 * Show icons
		 */
		showIcons?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	interface Props {
		/**
		 * Current visibility value
		 */
		value: PostVisibility;

		/**
		 * Configuration
		 */
		config?: VisibilityConfig;

		/**
		 * Called when visibility changes
		 */
		onChange?: (visibility: PostVisibility) => void;

		/**
		 * Custom option renderer
		 */
		renderOption?: Snippet<[VisibilityOption, boolean]>;

		/**
		 * Disabled state
		 */
		disabled?: boolean;
	}

	let {
		value = $bindable('public'),
		config = {},
		onChange,
		renderOption,
		disabled = false,
	}: Props = $props();

	const {
		options = ['public', 'unlisted', 'private', 'direct'],
		mode = 'dropdown',
		showDescriptions = true,
		showIcons = true,
		class: className = '',
	} = config;

	/**
	 * Visibility option definitions
	 */
	const visibilityOptions: Record<PostVisibility, VisibilityOption> = {
		public: {
			value: 'public',
			label: 'Public',
			description: 'Visible to everyone, appears in public timelines',
			icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
		},
		unlisted: {
			value: 'unlisted',
			label: 'Unlisted',
			description: 'Visible to everyone, but not in public timelines',
			icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7v-2z',
		},
		private: {
			value: 'private',
			label: 'Followers-only',
			description: 'Only visible to your followers',
			icon: 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z',
		},
		direct: {
			value: 'direct',
			label: 'Direct',
			description: 'Only visible to mentioned users',
			icon: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z',
		},
	};

	const availableOptions = $derived(options.map((opt) => visibilityOptions[opt]));

	const selectedOption = $derived(visibilityOptions[value]);

	/**
	 * Handle selection
	 */
	function select(visibility: PostVisibility) {
		if (disabled) return;
		value = visibility;
		onChange?.(visibility);
	}

	/**
	 * Menu for dropdown mode
	 */
	const menu = createMenu({
		closeOnSelect: true,
		onSelect: (val) => select(val as PostVisibility),
	});
</script>

<div class={`visibility-selector visibility-selector--${mode} ${className}`}>
	{#if mode === 'dropdown'}
		<!-- Dropdown mode -->
		<button
			use:menu.actions.trigger
			class="visibility-selector__trigger"
			type="button"
			{disabled}
			aria-label="Select post visibility"
		>
			{#if showIcons}
				<svg class="visibility-selector__icon" viewBox="0 0 24 24" fill="currentColor">
					<path d={selectedOption.icon} />
				</svg>
			{/if}

			<span class="visibility-selector__label">{selectedOption.label}</span>

			<svg class="visibility-selector__chevron" viewBox="0 0 24 24" fill="currentColor">
				<path d="M7 10l5 5 5-5z" />
			</svg>
		</button>

		{#if menu.state.open}
			<div use:menu.actions.menu class="visibility-selector__menu">
				{#each availableOptions as option (option.value)}
					<button
						use:menu.actions.item={option.value}
						class="visibility-selector__option"
						class:visibility-selector__option--selected={option.value === value}
						type="button"
						onclick={() => select(option.value)}
					>
						{#if renderOption}
							{@render renderOption(option, option.value === value)}
						{:else}
							{#if showIcons}
								<svg
									class="visibility-selector__option-icon"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d={option.icon} />
								</svg>
							{/if}

							<div class="visibility-selector__option-text">
								<span class="visibility-selector__option-label">
									{option.label}
								</span>
								{#if showDescriptions}
									<span class="visibility-selector__option-description">
										{option.description}
									</span>
								{/if}
							</div>

							{#if option.value === value}
								<svg class="visibility-selector__check" viewBox="0 0 24 24" fill="currentColor">
									<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
								</svg>
							{/if}
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	{:else if mode === 'buttons'}
		<!-- Button group mode -->
		<div class="visibility-selector__buttons" role="radiogroup" aria-label="Post visibility">
			{#each availableOptions as option (option.value)}
				<button
					class="visibility-selector__button"
					class:visibility-selector__button--selected={option.value === value}
					type="button"
					onclick={() => select(option.value)}
					role="radio"
					aria-checked={option.value === value}
					{disabled}
				>
					{#if renderOption}
						{@render renderOption(option, option.value === value)}
					{:else}
						{#if showIcons}
							<svg class="visibility-selector__button-icon" viewBox="0 0 24 24" fill="currentColor">
								<path d={option.icon} />
							</svg>
						{/if}

						<div class="visibility-selector__button-text">
							<span class="visibility-selector__button-label">
								{option.label}
							</span>
							{#if showDescriptions}
								<span class="visibility-selector__button-description">
									{option.description}
								</span>
							{/if}
						</div>
					{/if}
				</button>
			{/each}
		</div>
	{:else}
		<!-- Inline mode -->
		<div class="visibility-selector__inline" role="radiogroup" aria-label="Post visibility">
			{#each availableOptions as option (option.value)}
				<label class="visibility-selector__inline-option">
					<input
						type="radio"
						class="visibility-selector__radio"
						name="visibility"
						value={option.value}
						checked={option.value === value}
						onchange={() => select(option.value)}
						{disabled}
					/>

					{#if renderOption}
						{@render renderOption(option, option.value === value)}
					{:else}
						{#if showIcons}
							<svg class="visibility-selector__inline-icon" viewBox="0 0 24 24" fill="currentColor">
								<path d={option.icon} />
							</svg>
						{/if}

						<span class="visibility-selector__inline-label">
							{option.label}
						</span>
					{/if}
				</label>
			{/each}
		</div>
	{/if}
</div>

<style>
	.visibility-selector {
		position: relative;
	}

	/* Dropdown mode */
	.visibility-selector__trigger {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-primary, #0f1419);
		transition: all 0.2s;
	}

	.visibility-selector__trigger:hover:not(:disabled) {
		background: var(--bg-hover, #eff3f4);
		border-color: var(--border-hover, #cfd9de);
	}

	.visibility-selector__trigger:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.visibility-selector__icon,
	.visibility-selector__chevron {
		width: 1.25rem;
		height: 1.25rem;
		color: var(--text-secondary, #536471);
	}

	.visibility-selector__chevron {
		margin-left: auto;
	}

	.visibility-selector__menu {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		margin-top: 0.5rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		z-index: 1000;
	}

	.visibility-selector__option {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.75rem 1rem;
		background: transparent;
		border: none;
		cursor: pointer;
		text-align: left;
		transition: background-color 0.2s;
	}

	.visibility-selector__option:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.visibility-selector__option--selected {
		background: var(--bg-selected, #e8f5fe);
	}

	.visibility-selector__option-icon {
		width: 1.25rem;
		height: 1.25rem;
		color: var(--text-secondary, #536471);
		flex-shrink: 0;
	}

	.visibility-selector__option-text {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		flex: 1;
	}

	.visibility-selector__option-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	.visibility-selector__option-description {
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
	}

	.visibility-selector__check {
		width: 1.25rem;
		height: 1.25rem;
		color: var(--primary-color, #1d9bf0);
		flex-shrink: 0;
	}

	/* Button group mode */
	.visibility-selector__buttons {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.visibility-selector__button {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background: var(--bg-primary, #ffffff);
		border: 2px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s;
	}

	.visibility-selector__button:hover:not(:disabled) {
		background: var(--bg-hover, #eff3f4);
		border-color: var(--border-hover, #cfd9de);
	}

	.visibility-selector__button--selected {
		background: var(--bg-selected, #e8f5fe);
		border-color: var(--primary-color, #1d9bf0);
	}

	.visibility-selector__button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.visibility-selector__button-icon {
		width: 1.25rem;
		height: 1.25rem;
		color: var(--text-secondary, #536471);
		flex-shrink: 0;
	}

	.visibility-selector__button-text {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		flex: 1;
	}

	.visibility-selector__button-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	.visibility-selector__button-description {
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
	}

	/* Inline mode */
	.visibility-selector__inline {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.visibility-selector__inline-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.375rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.visibility-selector__inline-option:has(:checked) {
		background: var(--bg-selected, #e8f5fe);
		border-color: var(--primary-color, #1d9bf0);
	}

	.visibility-selector__radio {
		margin: 0;
	}

	.visibility-selector__inline-icon {
		width: 1rem;
		height: 1rem;
		color: var(--text-secondary, #536471);
	}

	.visibility-selector__inline-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-primary, #0f1419);
	}
</style>
