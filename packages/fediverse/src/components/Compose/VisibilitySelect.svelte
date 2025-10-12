<!--
Compose.VisibilitySelect - Post visibility selector

Dropdown for selecting post visibility (public, unlisted, private, direct).

@component
@example
```svelte
<Compose.Root>
  <Compose.Editor />
  <Compose.VisibilitySelect />
  <Compose.Submit />
</Compose.Root>
```
-->

<script lang="ts">
	import { getComposeContext } from './context.js';
	import type { PostVisibility } from './context.js';

	interface Props {
		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const context = getComposeContext();

	const visibilityOptions: Array<{
		value: PostVisibility;
		label: string;
		icon: string;
		description: string;
	}> = [
		{
			value: 'public',
			label: 'Public',
			icon: '🌐',
			description: 'Anyone can see this post',
		},
		{
			value: 'unlisted',
			label: 'Unlisted',
			icon: '🔓',
			description: 'Not shown in public timelines',
		},
		{
			value: 'private',
			label: 'Followers only',
			icon: '🔒',
			description: 'Only your followers can see',
		},
		{
			value: 'direct',
			label: 'Direct',
			icon: '✉️',
			description: 'Only mentioned users can see',
		},
	];

	const currentOption = $derived(
		visibilityOptions.find((opt) => opt.value === context.state.visibility) || visibilityOptions[0]
	);

	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		context.updateState({ visibility: target.value as PostVisibility });
	}
</script>

<div class="compose-visibility-select {className}">
	<label for="compose-visibility" class="compose-visibility-select__label"> Visibility </label>
	<select
		id="compose-visibility"
		class="compose-visibility-select__select"
		value={context.state.visibility}
		onchange={handleChange}
		disabled={context.state.submitting}
		aria-label="Post visibility"
	>
		{#each visibilityOptions as option}
			<option value={option.value}>
				{option.icon}
				{option.label}
			</option>
		{/each}
	</select>
	<p class="compose-visibility-select__description">
		{currentOption.description}
	</p>
</div>

<style>
	.compose-visibility-select {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.compose-visibility-select__label {
		font-size: var(--compose-font-size-sm, 0.875rem);
		font-weight: 600;
		color: var(--compose-text-primary, #0f1419);
	}

	.compose-visibility-select__select {
		padding: 0.5rem 0.75rem;
		font-size: var(--compose-font-size, 1rem);
		color: var(--compose-text-primary, #0f1419);
		background: var(--compose-editor-bg, white);
		border: 1px solid var(--compose-border, #cfd9de);
		border-radius: var(--compose-radius, 8px);
		cursor: pointer;
		transition: border-color 0.2s;
	}

	.compose-visibility-select__select:hover:not(:disabled) {
		border-color: var(--compose-focus-color, #1d9bf0);
	}

	.compose-visibility-select__select:focus {
		outline: none;
		border-color: var(--compose-focus-color, #1d9bf0);
		box-shadow: 0 0 0 1px var(--compose-focus-color, #1d9bf0);
	}

	.compose-visibility-select__select:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.compose-visibility-select__description {
		margin: 0;
		font-size: var(--compose-font-size-sm, 0.875rem);
		color: var(--compose-text-secondary, #536471);
	}
</style>
