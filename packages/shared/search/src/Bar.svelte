<!--
  Search.Bar - Search Input Bar
  
  Search input with autocomplete, recent searches, and semantic search toggle.
  
  @component
  @example
  ```svelte
  <Search.Root {handlers}>
    <Search.Bar placeholder="Search posts, people, and tags..." />
  </Search.Root>
  ```
-->
<script lang="ts">
	import { createButton } from '@equaltoai/greater-components-headless/button';
	import { getSearchContext } from './context.svelte.js';

	interface Props {
		/**
		 * Input placeholder
		 * @default "Search..."
		 */
		placeholder?: string;

		/**
		 * Show semantic search toggle
		 * @default true
		 */
		showSemantic?: boolean;

		/**
		 * Show recent searches
		 * @default true
		 */
		showRecent?: boolean;

		/**
		 * Autofocus input
		 * @default false
		 */
		autofocus?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		placeholder = 'Search...',
		showSemantic = true,
		showRecent = true,
		autofocus = false,
		class: className = '',
	}: Props = $props();

	const { state: searchState, search, clear, toggleSemantic, updateState } = getSearchContext();

	let showRecentDropdown = $state(false);

	const searchButton = createButton({
		onClick: () => handleSearch(),
	});

	const clearButton = createButton({
		onClick: () => handleClear(),
	});

	let inputElement = $state<HTMLInputElement | null>(null);

	$effect(() => {
		if (autofocus && inputElement && document.activeElement !== inputElement) {
			inputElement.focus();
		}
	});

	/**
	 * Handle search submission
	 */
	function handleSearch() {
		if (searchState.query.trim()) {
			search();
			showRecentDropdown = false;
		}
	}

	/**
	 * Handle clear
	 */
	function handleClear() {
		clear();
		showRecentDropdown = false;
	}

	/**
	 * Handle input change
	 */
	function handleInput(value: string) {
		updateState({ query: value });
		showRecentDropdown = showRecent && !value.trim() && searchState.recentSearches.length > 0;
	}

	/**
	 * Handle recent search click
	 */
	function handleRecentClick(query: string) {
		updateState({ query });
		search(query);
		showRecentDropdown = false;
	}

	/**
	 * Handle key down
	 */
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSearch();
		} else if (event.key === 'Escape') {
			showRecentDropdown = false;
		}
	}
</script>

<div class={`search-bar ${className}`}>
	<div class="search-bar__input-wrapper">
		<svg class="search-bar__icon" viewBox="0 0 24 24" fill="currentColor">
			<path
				d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
			/>
		</svg>

		<input
			type="text"
			class="search-bar__input"
			{placeholder}
			value={searchState.query}
			oninput={(e) => handleInput(e.currentTarget.value)}
			onkeydown={handleKeyDown}
			onfocus={() =>
				(showRecentDropdown =
					showRecent && !searchState.query.trim() && searchState.recentSearches.length > 0)}
			disabled={searchState.loading}
			bind:this={inputElement}
		/>

		{#if searchState.query}
			<button use:clearButton.actions.button class="search-bar__clear" aria-label="Clear search">
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
					/>
				</svg>
			</button>
		{/if}

		{#if showSemantic}
			<button
				class="search-bar__semantic"
				class:search-bar__semantic--active={searchState.semantic}
				onclick={toggleSemantic}
				disabled={searchState.loading}
				title="AI Semantic Search"
				aria-pressed={searchState.semantic}
				aria-label={searchState.semantic ? 'Disable semantic search' : 'Enable semantic search'}
			>
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M9 2C7.89 2 7 2.89 7 4V20C7 21.11 7.89 22 9 22H15C16.11 22 17 21.11 17 20V4C17 2.89 16.11 2 15 2H9M9 4H15V8H9V4M15 12V14H9V12H15M15 16V18H9V16H15Z"
					/>
				</svg>
			</button>
		{/if}

		<button
			use:searchButton.actions.button
			class="search-bar__submit"
			aria-label={searchState.loading ? 'Searching' : 'Search'}
			disabled={searchState.loading || !searchState.query.trim()}
		>
			{#if searchState.loading}
				<span class="search-bar__spinner"></span>
			{:else}
				Search
			{/if}
		</button>

		{#if showRecentDropdown}
			<div class="search-bar__recent">
				<div class="search-bar__recent-header">
					<span>Recent Searches</span>
					<button
						class="search-bar__recent-clear"
						onclick={() => updateState({ recentSearches: [] })}
					>
						Clear
					</button>
				</div>
				<div class="search-bar__recent-list">
					{#each searchState.recentSearches as recent (recent)}
						<button class="search-bar__recent-item" onclick={() => handleRecentClick(recent)}>
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"
								/>
							</svg>
							{recent}
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
