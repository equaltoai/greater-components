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
			const selectedEl = menuEl.querySelector(
				`[data-index="${selectedIndex}"]`
			) as HTMLElement | null;
			if (selectedEl) {
				selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
			}
		}
	});
</script>

	<div
		bind:this={menuEl}
		class={`autocomplete-menu ${className}`}
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
