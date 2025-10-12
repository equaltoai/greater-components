<!--
Compose.Editor - Text editor area

Main content editing textarea with auto-resize and placeholder.

@component
@example
```svelte
<Compose.Root>
  <Compose.Editor rows={4} autofocus />
</Compose.Root>
```
-->

<script lang="ts">
	import { getComposeContext } from './context.js';

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
		 * Additional CSS class
		 */
		class?: string;
	}

	let { rows = 4, autofocus = false, class: className = '' }: Props = $props();

	const context = getComposeContext();

	let textareaEl: HTMLTextAreaElement;

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
	 * Handle input changes
	 */
	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		context.updateState({ content: target.value });
		autoResize();
	}

	/**
	 * Handle keyboard shortcuts
	 */
	function handleKeyDown(event: KeyboardEvent) {
		// Cmd/Ctrl + Enter to submit
		if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
			event.preventDefault();
			const form = textareaEl.closest('form');
			if (form) {
				form.requestSubmit();
			}
		}
	}
</script>

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

<style>
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
