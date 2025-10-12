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
	let menuPosition = $state({ x: 0, y: 0 });

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

		// Calculate menu position
		const rect = textareaEl.getBoundingClientRect();
		const coords = getCaretCoordinates(textareaEl, cursorPos);
		menuPosition = {
			x: rect.left + coords.left,
			y: rect.top + coords.top + coords.height + window.scrollY,
		};

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

	/**
	 * Get caret coordinates in textarea
	 * Based on https://github.com/component/textarea-caret-position
	 */
	function getCaretCoordinates(
		element: HTMLTextAreaElement,
		position: number
	): { left: number; top: number; height: number } {
		// Create a mirror div
		const div = document.createElement('div');
		const style = getComputedStyle(element);
		const properties = [
			'boxSizing',
			'width',
			'height',
			'overflowX',
			'overflowY',
			'borderTopWidth',
			'borderRightWidth',
			'borderBottomWidth',
			'borderLeftWidth',
			'paddingTop',
			'paddingRight',
			'paddingBottom',
			'paddingLeft',
			'fontStyle',
			'fontVariant',
			'fontWeight',
			'fontStretch',
			'fontSize',
			'fontSizeAdjust',
			'lineHeight',
			'fontFamily',
			'textAlign',
			'textTransform',
			'textIndent',
			'textDecoration',
			'letterSpacing',
			'wordSpacing',
		];

		properties.forEach((prop) => {
			div.style[prop as any] = style[prop as any];
		});

		div.style.position = 'absolute';
		div.style.visibility = 'hidden';
		div.style.whiteSpace = 'pre-wrap';
		div.style.wordWrap = 'break-word';
		div.textContent = element.value.substring(0, position);

		const span = document.createElement('span');
		span.textContent = element.value.substring(position) || '.';
		div.appendChild(span);

		document.body.appendChild(div);

		const coordinates = {
			left: span.offsetLeft,
			top: span.offsetTop,
			height: span.offsetHeight,
		};

		document.body.removeChild(div);

		return coordinates;
	}
</script>

<div class="editor-with-autocomplete">
	<textarea
		bind:this={textareaEl}
		class="compose-editor {className}"
		{rows}
		{autofocus}
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
			position={menuPosition}
			{loading}
			onSelect={handleSelectSuggestion}
			onClose={handleCloseAutocomplete}
		/>
	{/if}
</div>

<style>
	.editor-with-autocomplete {
		position: relative;
	}

	.compose-editor {
		width: 100%;
		min-height: 100px;
		padding: 0.75rem;
		font-family: var(--compose-font-family, inherit);
		font-size: var(--compose-font-size, 1rem);
		line-height: 1.5;
		color: var(--compose-text-primary, #0f1419);
		background: var(--compose-editor-bg, white);
		border: 1px solid var(--compose-border, #cfd9de);
		border-radius: var(--compose-radius, 8px);
		resize: none;
		outline: none;
		transition: border-color 0.2s;
	}

	.compose-editor:focus {
		border-color: var(--compose-focus-color, #1d9bf0);
		box-shadow: 0 0 0 1px var(--compose-focus-color, #1d9bf0);
	}

	.compose-editor:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.compose-editor::placeholder {
		color: var(--compose-text-secondary, #536471);
	}
</style>
