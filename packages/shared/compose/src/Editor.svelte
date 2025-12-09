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
	import { onMount, untrack } from 'svelte';
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
