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
	import { createButton } from '@greater/headless/button';

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

<style>
	.compose-submit {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: var(--compose-submit-bg, #1d9bf0);
		color: var(--compose-submit-text, white);
		border: none;
		border-radius: var(--compose-submit-radius, 9999px);
		font-size: var(--compose-font-size, 1rem);
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s;
	}

	.compose-submit:hover:not(:disabled) {
		background: var(--compose-submit-hover-bg, #1a8cd8);
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(29, 155, 240, 0.3);
	}

	.compose-submit:active:not(:disabled) {
		transform: translateY(0);
	}

	.compose-submit:disabled {
		background: var(--compose-submit-disabled-bg, #cfd9de);
		color: var(--compose-submit-disabled-text, #8899a6);
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	.compose-submit__spinner {
		width: 20px;
		height: 20px;
		animation: spin 1s linear infinite;
	}

	.compose-submit__spinner svg {
		width: 100%;
		height: 100%;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.compose-submit {
			transition: none;
		}

		.compose-submit__spinner {
			animation: none;
		}
	}
</style>
