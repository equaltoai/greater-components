<!--
Compose.Submit - Submit button

Submit button with loading state and disabled when over limit.

@component
@example
```svelte
<Compose.Root>
  <Compose.Editor />
  <Compose.Submit text="Post" />
</Compose.Root>
```
-->

<script lang="ts">
	import { getComposeContext } from './context.js';
	import { createButton } from '@equaltoai/greater-components-headless/button';

	interface Props {
		/**
		 * Button text
		 */
		text?: string;

		/**
		 * Loading text
		 */
		loadingText?: string;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { text = 'Post', loadingText = 'Posting...', class: className = '' }: Props = $props();

	const context = getComposeContext();

	const submitButton = createButton({
		type: 'submit',
	});

	const isDisabled = $derived(
		context.state.submitting || context.state.overLimit || context.state.content.trim().length === 0
	);

	// Update button disabled state
	$effect(() => {
		submitButton.helpers.setDisabled(isDisabled);
		submitButton.helpers.setLoading(context.state.submitting);
	});
</script>

<button use:submitButton.actions.button class={`compose-submit ${className}`}>
	{#if context.state.submitting}
		<span class="compose-submit__spinner">
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path
					fill="currentColor"
					d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"
				/>
				<path fill="currentColor" d="M12 4a8 8 0 0 0-8 8h2a6 6 0 0 1 6-6z" />
			</svg>
		</span>
		{loadingText}
	{:else}
		{text}
	{/if}
</button>
