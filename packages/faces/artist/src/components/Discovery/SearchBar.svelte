<!--
DiscoveryEngine.SearchBar - Search input with autocomplete and visual search

Features:
- Text search with autocomplete
- Visual search (image upload)
- Recent searches
- Voice search (optional)
- Keyboard navigation

@component
@example
```svelte
<DiscoveryEngine.SearchBar placeholder="Search artworks..." />
```
-->

<script lang="ts">
	import { getDiscoveryContext, type SearchSuggestion } from './context.js';

	interface Props {
		/**
		 * Placeholder text
		 */
		placeholder?: string;

		/**
		 * Show visual search button
		 */
		showVisualSearch?: boolean;

		/**
		 * Show voice search button
		 */
		showVoiceSearch?: boolean;

		/**
		 * Show recent searches
		 */
		showRecent?: boolean;

		/**
		 * Maximum suggestions to show
		 */
		maxSuggestions?: number;

		/**
		 * Debounce delay for search-as-you-type (ms)
		 */
		debounceMs?: number;

		/**
		 * Enable search-as-you-type
		 */
		searchAsYouType?: boolean;

		/**
		 * Minimum characters to trigger search
		 */
		minSearchChars?: number;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		placeholder = 'Search artworks, artists, styles...',
		showVisualSearch = true,
		// showVoiceSearch = false, // TODO: Implement voice search
		showRecent = true,
		maxSuggestions = 8,
		debounceMs = 300,
		searchAsYouType = true,
		minSearchChars = 2,
		class: className = '',
	}: Props = $props();

	const ctx = getDiscoveryContext();
	const { store, config, handlers } = ctx;

	// Local state
	let inputValue = $state('');
	let isFocused = $state(false);
	let showDropdown = $state(false);
	let selectedIndex = $state(-1);
	let fileInput = $state<HTMLInputElement>();
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	let isSearching = $state(false);

	// Cleanup debounce timer on destroy
	$effect(() => {
		return () => {
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}
		};
	});

	// Store state subscription
	let storeState = $state(store.get());
	$effect(() => {
		const unsubscribe = store.subscribe((state) => {
			storeState = state;
		});
		return unsubscribe;
	});

	// Suggestions to display
	const displaySuggestions = $derived.by(() => {
		if (!isFocused || !config.showSuggestions) return [];

		// If input is empty, show recent searches
		if (!inputValue.trim() && showRecent) {
			return storeState.recentSearches.slice(0, maxSuggestions).map((text, i) => ({
				id: `recent-${i}`,
				text,
				type: 'query' as const,
			}));
		}

		// Otherwise show filtered suggestions (mock for now)
		return [];
	});

	// Handle search submission
	async function handleSubmit() {
		if (!inputValue.trim()) return;

		showDropdown = false;
		await store.search(inputValue.trim());
		handlers.onSearch?.(inputValue.trim());
	}

	// Handle suggestion selection
	function handleSuggestionSelect(suggestion: SearchSuggestion) {
		inputValue = suggestion.text;
		showDropdown = false;
		handleSubmit();
		handlers.onSuggestionSelect?.(suggestion);
	}

	// Handle visual search file upload
	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			ctx.searchMode = 'visual';
			handlers.onVisualSearch?.(file);
		}
	}

	// Handle keyboard navigation
	function handleKeydown(event: KeyboardEvent) {
		if (!showDropdown || displaySuggestions.length === 0) {
			if (event.key === 'Enter') {
				event.preventDefault();
				handleSubmit();
			}
			return;
		}

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				selectedIndex = Math.min(selectedIndex + 1, displaySuggestions.length - 1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				selectedIndex = Math.max(selectedIndex - 1, -1);
				break;
			case 'Enter':
				event.preventDefault();
				if (selectedIndex >= 0) {
					const suggestion = displaySuggestions[selectedIndex];
					if (suggestion) {
						handleSuggestionSelect(suggestion);
					}
				} else {
					handleSubmit();
				}
				break;
			case 'Escape':
				showDropdown = false;
				selectedIndex = -1;
				break;
		}
	}

	// Handle input changes with debounced search-as-you-type
	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		inputValue = target.value;
		showDropdown = true;
		selectedIndex = -1;

		// Clear existing debounce timer
		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = null;
		}

		// Trigger debounced search if enabled
		if (searchAsYouType && inputValue.trim().length >= minSearchChars) {
			isSearching = true;
			debounceTimer = setTimeout(async () => {
				try {
					await store.search(inputValue.trim());
					handlers.onSearch?.(inputValue.trim());
				} finally {
					isSearching = false;
				}
			}, debounceMs);
		} else if (inputValue.trim().length === 0) {
			// Clear search when input is empty
			store.search('');
			isSearching = false;
		}
	}

	// Handle focus
	function handleFocus() {
		isFocused = true;
		showDropdown = true;
	}

	// Handle blur with delay for click handling
	function handleBlur() {
		setTimeout(() => {
			isFocused = false;
			showDropdown = false;
		}, 200);
	}

	// Clear search
	function handleClear() {
		inputValue = '';
		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = null;
		}
		isSearching = false;
		store.search('');
	}
</script>

<div class={`search-bar ${className}`} role="search">
	<div class="search-bar__input-wrapper">
		<!-- Search icon -->
		<svg
			class="search-bar__icon"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			aria-hidden="true"
		>
			<circle cx="11" cy="11" r="8" stroke-width="2" />
			<path d="M21 21l-4.35-4.35" stroke-width="2" stroke-linecap="round" />
		</svg>

		<!-- Text input -->
		<input
			type="search"
			class="search-bar__input"
			{placeholder}
			value={inputValue}
			oninput={handleInput}
			onfocus={handleFocus}
			onblur={handleBlur}
			onkeydown={handleKeydown}
			aria-label="Search artworks"
			role="combobox"
			aria-controls={showDropdown && displaySuggestions.length > 0
				? 'search-suggestions'
				: undefined}
			aria-expanded={showDropdown && displaySuggestions.length > 0}
			aria-autocomplete="list"
			autocomplete="off"
		/>

		<!-- Loading indicator for search-as-you-type -->
		{#if isSearching}
			<div class="search-bar__loading" aria-label="Searching...">
				<svg
					class="search-bar__spinner"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					aria-hidden="true"
				>
					<circle
						cx="12"
						cy="12"
						r="10"
						stroke-width="2"
						stroke-dasharray="32"
						stroke-linecap="round"
					/>
				</svg>
			</div>
		{/if}

		<!-- Clear button -->
		{#if inputValue && !isSearching}
			<button
				type="button"
				class="search-bar__clear"
				onclick={handleClear}
				aria-label="Clear search"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
					<path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round" />
				</svg>
			</button>
		{/if}

		<!-- Visual search button -->
		{#if showVisualSearch && config.enableVisualSearch}
			<button
				type="button"
				class="search-bar__visual"
				onclick={() => fileInput?.click()}
				aria-label="Search by image"
				title="Upload image to find similar artworks"
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
			</button>
			<input
				bind:this={fileInput}
				type="file"
				accept="image/*"
				class="sr-only"
				onchange={handleFileSelect}
				aria-label="Upload image for visual search"
			/>
		{/if}

		<!-- Submit button -->
		<button type="submit" class="search-bar__submit" onclick={handleSubmit} aria-label="Search">
			Search
		</button>
	</div>

	<!-- Suggestions dropdown -->
	{#if showDropdown && displaySuggestions.length > 0}
		<ul
			id="search-suggestions"
			class="search-bar__suggestions"
			role="listbox"
			aria-label="Search suggestions"
		>
			{#each displaySuggestions as suggestion, index (suggestion.id || index)}
				<li
					class="search-bar__suggestion"
					class:selected={index === selectedIndex}
					role="option"
					aria-selected={index === selectedIndex}
				>
					<button
						type="button"
						class="search-bar__suggestion-btn"
						onclick={() => handleSuggestionSelect(suggestion)}
						tabindex="-1"
					>
						<span class="search-bar__suggestion-content">
							{#if suggestion.type === 'query'}
								<svg
									class="search-bar__suggestion-icon"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path d="M12 8v4l3 3" stroke-width="2" stroke-linecap="round" />
									<circle cx="12" cy="12" r="9" stroke-width="2" />
								</svg>
							{:else}
								<svg
									class="search-bar__suggestion-icon"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									aria-hidden="true"
								>
									<circle cx="11" cy="11" r="8" stroke-width="2" />
									<path d="M21 21l-4.35-4.35" stroke-width="2" stroke-linecap="round" />
								</svg>
							{/if}
							<span class="search-bar__suggestion-text">{suggestion.text}</span>
						</span>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.search-bar {
		position: relative;
		width: 100%;
		max-width: 600px;
	}

	.search-bar__input-wrapper {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-800);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-lg);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.search-bar__input-wrapper:focus-within {
		border-color: var(--gr-color-primary-500);
		box-shadow: 0 0 0 3px rgba(var(--gr-color-primary-500-rgb), 0.2);
	}

	.search-bar__icon {
		width: 20px;
		height: 20px;
		color: var(--gr-color-gray-400);
		flex-shrink: 0;
	}

	.search-bar__input {
		flex: 1;
		background: transparent;
		border: none;
		color: var(--gr-color-gray-100);
		font-size: var(--gr-typography-fontSize-base);
		outline: none;
	}

	.search-bar__input::placeholder {
		color: var(--gr-color-gray-500);
	}

	.search-bar__clear,
	.search-bar__visual {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: var(--gr-radii-md);
		color: var(--gr-color-gray-400);
		cursor: pointer;
		transition:
			color 0.2s,
			background 0.2s;
	}

	.search-bar__clear:hover,
	.search-bar__visual:hover {
		color: var(--gr-color-gray-100);
		background: var(--gr-color-gray-700);
	}

	.search-bar__clear svg,
	.search-bar__visual svg,
	.search-bar__loading svg {
		width: 18px;
		height: 18px;
	}

	.search-bar__loading {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
	}

	.search-bar__spinner {
		color: var(--gr-color-primary-500);
		animation: search-spin 1s linear infinite;
	}

	@keyframes search-spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.search-bar__submit {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		background: var(--gr-color-primary-600);
		border: none;
		border-radius: var(--gr-radii-md);
		color: white;
		font-weight: var(--gr-font-weight-medium);
		cursor: pointer;
		transition: background 0.2s;
	}

	.search-bar__submit:hover {
		background: var(--gr-color-primary-700);
	}

	.search-bar__submit:focus {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.search-bar__suggestions {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		margin-top: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-800);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-lg);
		list-style: none;
		z-index: 100;
		box-shadow: var(--gr-shadow-lg);
	}

	.search-bar__suggestion {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-3);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		border-radius: var(--gr-radii-md);
		cursor: pointer;
		transition: background 0.15s;
	}

	.search-bar__suggestion:hover,
	.search-bar__suggestion.selected {
		background: var(--gr-color-gray-700);
	}

	.search-bar__suggestion-icon {
		width: 16px;
		height: 16px;
		color: var(--gr-color-gray-400);
		flex-shrink: 0;
	}

	.search-bar__suggestion-text {
		color: var(--gr-color-gray-100);
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

	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.search-bar__input-wrapper,
		.search-bar__clear,
		.search-bar__visual,
		.search-bar__submit,
		.search-bar__suggestion {
			transition: none;
		}
	}
</style>
