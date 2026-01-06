<!--
Compose.EditorWithAutocomplete - Enhanced editor with autocomplete

Text editor with hashtag, mention, and emoji autocomplete support.

@component
@example
```svelte
<Compose.Root>
  <Compose.EditorWithAutocomplete 
    searchHandler={searchHandler}
    rows={4} 
    autofocus 
  />
</Compose.Root>
```
-->

<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { getComposeContext } from './context.js';
	import AutocompleteMenu from './AutocompleteMenu.svelte';
	import {
		detectAutocompleteContext,
		filterSuggestions,
		insertSuggestion,
		getCursorPosition,
		setCursorPosition,
		type AutocompleteSuggestion,
		type AutocompleteMatch,
	} from './Autocomplete.js';
	import { countWeightedCharacters } from './UnicodeCounter.js';

	interface Props {
		/**
		 * Minimum number of rows
		 */
		rows?: number;

		/**
		 * Autofocus on mount
		 */
		autofocus?: boolean;

		/**
		 * Search handler for fetching suggestions
		 */
		searchHandler?: (
			query: string,
			type: 'hashtag' | 'mention' | 'emoji'
		) => Promise<AutocompleteSuggestion[]>;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { rows = 4, autofocus = false, searchHandler, class: className = '' }: Props = $props();

	const context = getComposeContext();

	let textareaEl: HTMLTextAreaElement;
	let showAutocomplete = $state(false);
		let autocompleteMatch = $state<AutocompleteMatch | null>(null);
		let suggestions = $state<AutocompleteSuggestion[]>([]);
		let selectedIndex = $state(0);
		let loading = $state(false);

	if (untrack(() => autofocus)) {
		onMount(() => {
			queueMicrotask(() => textareaEl?.focus());
		});
	}

	/**
	 * Auto-resize textarea based on content
	 */
	function autoResize() {
		if (textareaEl) {
			textareaEl.style.height = 'auto';
			textareaEl.style.height = `${textareaEl.scrollHeight}px`;
		}
	}

	/**
	 * Update autocomplete suggestions
	 */
	async function updateAutocomplete() {
		if (!textareaEl) return;

		const text = context.state.content;
		const cursorPos = getCursorPosition(textareaEl);
		const match = detectAutocompleteContext(text, cursorPos);

		if (!match) {
			showAutocomplete = false;
			autocompleteMatch = null;
			return;
		}

			autocompleteMatch = match;

			// Fetch suggestions
			if (searchHandler) {
			loading = true;
			try {
				const allSuggestions = await searchHandler(match.query, match.type);
				suggestions = filterSuggestions(allSuggestions, match.query, 10);
				selectedIndex = 0;
				showAutocomplete = suggestions.length > 0;
			} catch (error) {
				console.error('Failed to fetch suggestions:', error);
				suggestions = [];
				showAutocomplete = false;
			} finally {
				loading = false;
			}
		}
	}

	/**
	 * Handle input changes
	 */
	async function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;

		// Update character count with unicode support
		const metrics = countWeightedCharacters(target.value, {
			useUrlWeighting: true,
			maxCharacters: context.config.characterLimit,
		});

		context.updateState({
			content: target.value,
			characterCount: metrics.count,
			overLimit: metrics.count > context.config.characterLimit,
		});

		autoResize();
		await updateAutocomplete();
	}

	/**
	 * Handle keyboard shortcuts
	 */
	async function handleKeyDown(event: KeyboardEvent) {
		// Handle autocomplete navigation
		if (showAutocomplete) {
			if (event.key === 'ArrowDown') {
				event.preventDefault();
				selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
				return;
			}
			if (event.key === 'ArrowUp') {
				event.preventDefault();
				selectedIndex = Math.max(selectedIndex - 1, 0);
				return;
			}
			if (event.key === 'Enter' || event.key === 'Tab') {
				event.preventDefault();
				if (suggestions[selectedIndex]) {
					handleSelectSuggestion(suggestions[selectedIndex]);
				}
				return;
			}
			if (event.key === 'Escape') {
				event.preventDefault();
				showAutocomplete = false;
				return;
			}
		}

		// Cmd/Ctrl + Enter to submit
		if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
			event.preventDefault();
			const form = textareaEl.closest('form');
			if (form) {
				form.requestSubmit();
			}
		}
	}

	/**
	 * Handle suggestion selection
	 */
	function handleSelectSuggestion(suggestion: AutocompleteSuggestion) {
		if (!autocompleteMatch || !textareaEl) return;

		const result = insertSuggestion(context.state.content, autocompleteMatch, suggestion);
		context.updateState({ content: result.text });

		// Update textarea value and cursor
		textareaEl.value = result.text;
		setCursorPosition(textareaEl, result.cursorPosition);

		showAutocomplete = false;
		autocompleteMatch = null;
		autoResize();
	}

	/**
	 * Close autocomplete menu
	 */
	function handleCloseAutocomplete() {
		showAutocomplete = false;
		autocompleteMatch = null;
	}

	</script>

<div class="editor-with-autocomplete">
	<textarea
		bind:this={textareaEl}
		class={`compose-editor ${className}`}
		{rows}
		placeholder={context.config.placeholder}
		value={context.state.content}
		oninput={handleInput}
		onkeydown={handleKeyDown}
		disabled={context.state.submitting}
		aria-label="Compose post content"
		aria-describedby="compose-character-count"
	></textarea>

		{#if showAutocomplete && autocompleteMatch}
			<AutocompleteMenu
				{suggestions}
				{selectedIndex}
				{loading}
				onSelect={handleSelectSuggestion}
				onClose={handleCloseAutocomplete}
			/>
	{/if}
</div>
