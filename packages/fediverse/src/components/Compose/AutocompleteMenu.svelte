<!--
Compose.AutocompleteMenu - Autocomplete dropdown menu

Shows hashtag, mention, and emoji suggestions while typing.

@component
@example
```svelte
<Compose.Root>
  <Compose.EditorWithAutocomplete />
</Compose.Root>
```
-->

<script lang="ts">
	import type { AutocompleteSuggestion } from './Autocomplete.js';

	interface Props {
		/**
		 * Array of suggestions to display
		 */
		suggestions: AutocompleteSuggestion[];

		/**
		 * Currently selected index
		 */
		selectedIndex: number;

		/**
		 * Position of the menu
		 */
		position: { x: number; y: number };

		/**
		 * Loading state
		 */
		loading?: boolean;

		/**
		 * Callback when suggestion is selected
		 */
		onSelect: (suggestion: AutocompleteSuggestion) => void;

		/**
		 * Callback when menu should close
		 */
		onClose: () => void;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let {
		suggestions,
		selectedIndex = 0,
		position,
		loading = false,
		onSelect,
		onClose,
		class: className = '',
	}: Props = $props();

	let menuEl: HTMLDivElement | null = null;

	/**
	 * Handle keyboard navigation
	 */
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			onClose();
		}
	}

	/**
	 * Handle click outside to close
	 */
	function handleClickOutside(event: MouseEvent) {
		if (menuEl && !menuEl.contains(event.target as Node)) {
			onClose();
		}
	}

	// Attach event listeners
	$effect(() => {
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('click', handleClickOutside);
		};
	});

	/**
	 * Scroll selected item into view
	 */
	$effect(() => {
		if (menuEl && selectedIndex >= 0) {
			const selectedEl = menuEl.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement | null;
			if (selectedEl) {
				selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
			}
		}
	});
</script>

<div
	bind:this={menuEl}
	class={`autocomplete-menu ${className}`}
	style={`left: ${position.x}px; top: ${position.y}px;`}
	role="listbox"
	aria-label="Autocomplete suggestions"
>
	{#if loading}
		<div class="autocomplete-menu__loading">
			<span class="autocomplete-menu__spinner"></span>
			<span>Loading suggestions...</span>
		</div>
	{:else if suggestions.length === 0}
		<div class="autocomplete-menu__empty">No suggestions found</div>
	{:else}
		{#each suggestions as suggestion, index (suggestion.value)}
			<button
				class="autocomplete-menu__item"
				class:autocomplete-menu__item--selected={index === selectedIndex}
				data-index={index}
				role="option"
				aria-selected={index === selectedIndex}
				onclick={() => onSelect(suggestion)}
				type="button"
			>
				{#if suggestion.type === 'mention' && suggestion.metadata?.avatar}
					<img src={suggestion.metadata.avatar} alt="" class="autocomplete-menu__avatar" />
				{/if}

				<div class="autocomplete-menu__content">
					<div class="autocomplete-menu__primary">{suggestion.text}</div>

					{#if suggestion.type === 'mention' && suggestion.metadata}
						<div class="autocomplete-menu__secondary">
							{#if suggestion.metadata.displayName}
								{suggestion.metadata.displayName}
							{/if}
							{#if suggestion.metadata.followers !== undefined}
								<span class="autocomplete-menu__followers">
									{suggestion.metadata.followers.toLocaleString()} followers
								</span>
							{/if}
						</div>
					{/if}

					{#if suggestion.type === 'hashtag'}
						<div class="autocomplete-menu__secondary">#{suggestion.value}</div>
					{/if}
				</div>

				{#if suggestion.type === 'emoji'}
					<span class="autocomplete-menu__emoji">{suggestion.value}</span>
				{/if}
			</button>
		{/each}
	{/if}
</div>

<style>
	.autocomplete-menu {
		position: absolute;
		z-index: 1000;
		max-width: 400px;
		max-height: 300px;
		overflow-y: auto;
		background: var(--autocomplete-bg, white);
		border: 1px solid var(--autocomplete-border, #cfd9de);
		border-radius: var(--autocomplete-radius, 8px);
		box-shadow: var(--autocomplete-shadow, 0 4px 12px rgba(0, 0, 0, 0.15));
	}

	.autocomplete-menu__loading,
	.autocomplete-menu__empty {
		padding: 1rem;
		text-align: center;
		color: var(--text-secondary, #536471);
		font-size: 0.875rem;
	}

	.autocomplete-menu__loading {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.autocomplete-menu__spinner {
		width: 16px;
		height: 16px;
		border: 2px solid var(--text-secondary, #536471);
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.autocomplete-menu__item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.75rem 1rem;
		background: transparent;
		border: none;
		text-align: left;
		cursor: pointer;
		transition: background-color 0.15s;
	}

	.autocomplete-menu__item:hover,
	.autocomplete-menu__item--selected {
		background: var(--autocomplete-hover-bg, #f7f9fa);
	}

	.autocomplete-menu__avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		flex-shrink: 0;
		object-fit: cover;
	}

	.autocomplete-menu__content {
		flex: 1;
		min-width: 0;
	}

	.autocomplete-menu__primary {
		font-weight: 600;
		color: var(--text-primary, #0f1419);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.autocomplete-menu__secondary {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.autocomplete-menu__followers {
		margin-left: 0.5rem;
	}

	.autocomplete-menu__emoji {
		font-size: 1.5rem;
		flex-shrink: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.autocomplete-menu__spinner {
			animation: none;
		}
	}
</style>
