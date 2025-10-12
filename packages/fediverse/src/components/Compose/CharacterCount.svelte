<!--
Compose.CharacterCount - Character counter display

Shows current character count and limit with visual warning.

@component
@example
```svelte
<Compose.Root>
  <Compose.Editor />
  <Compose.CharacterCount />
</Compose.Root>
```
-->

<script lang="ts">
	import { getComposeContext } from './context.js';

	interface Props {
		/**
		 * Show progress circle
		 */
		showProgress?: boolean;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { showProgress = true, class: className = '' }: Props = $props();

	const context = getComposeContext();

	const percentage = $derived((context.state.characterCount / context.config.characterLimit) * 100);

	const isNearLimit = $derived(percentage >= 80);
	const isOverLimit = $derived(context.state.overLimit);

	// Calculate SVG circle properties
	const radius = 14;
	const circumference = 2 * Math.PI * radius;
	const offset = $derived(circumference - (percentage / 100) * circumference);
</script>

<div
	id="compose-character-count"
	class="compose-character-count {className}"
	class:compose-character-count--near-limit={isNearLimit}
	class:compose-character-count--over-limit={isOverLimit}
	role="status"
	aria-live="polite"
	aria-label="{context.state.characterCount} of {context.config.characterLimit} characters used"
>
	{#if showProgress}
		<svg class="compose-character-count__progress" width="32" height="32" viewBox="0 0 32 32">
			<!-- Background circle -->
			<circle
				cx="16"
				cy="16"
				r={radius}
				fill="none"
				stroke="var(--compose-progress-bg, #e1e8ed)"
				stroke-width="2"
			/>
			<!-- Progress circle -->
			<circle
				cx="16"
				cy="16"
				r={radius}
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-dasharray={circumference}
				stroke-dashoffset={offset}
				transform="rotate(-90 16 16)"
				class="compose-character-count__progress-circle"
			/>
		</svg>
	{/if}

	{#if isNearLimit || isOverLimit}
		<span class="compose-character-count__text">
			{context.state.characterCount} / {context.config.characterLimit}
		</span>
	{/if}
</div>

<style>
	.compose-character-count {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--compose-text-secondary, #536471);
		font-size: var(--compose-font-size-sm, 0.875rem);
		font-weight: 600;
	}

	.compose-character-count--near-limit {
		color: var(--compose-warning-color, #f59e0b);
	}

	.compose-character-count--over-limit {
		color: var(--compose-error-color, #dc2626);
	}

	.compose-character-count__progress {
		flex-shrink: 0;
	}

	.compose-character-count__progress-circle {
		transition: stroke-dashoffset 0.2s ease-in-out;
	}

	.compose-character-count__text {
		white-space: nowrap;
	}

	@media (prefers-reduced-motion: reduce) {
		.compose-character-count__progress-circle {
			transition: none;
		}
	}
</style>
