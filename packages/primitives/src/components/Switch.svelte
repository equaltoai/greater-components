<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'type' | 'checked'> {
		checked?: boolean;
		disabled?: boolean;
		class?: string;
		label?: string;
		onchange?: (checked: boolean) => void;
	}

	let {
		checked = $bindable(false),
		disabled = false,
		class: className = '',
		id,
		name,
		label,
		onchange,
		...restProps
	}: Props = $props();

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		checked = target.checked;
		onchange?.(checked);
	}
</script>

<label
	class={`gr-switch ${className}`}
	class:gr-switch--checked={checked}
	class:gr-switch--disabled={disabled}
>
	<input
		type="checkbox"
		bind:checked
		{disabled}
		{id}
		{name}
		class="gr-switch__input"
		onchange={handleChange}
		{...restProps}
	/>
	<span class="gr-switch__slider"></span>
	{#if label}
		<span class="gr-switch__label">{label}</span>
	{/if}
</label>

<style>
	:global {
		.gr-switch {
			position: relative;
			display: inline-flex;
			align-items: center;
			gap: var(--gr-spacing-scale-2);
			width: max-content;
			height: 24px;
			cursor: pointer;
		}

		.gr-switch--disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}

		.gr-switch__input {
			opacity: 0;
			width: 0;
			height: 0;
		}

		.gr-switch__slider {
			position: absolute;
			inset: 0;
			background-color: var(--gr-semantic-background-tertiary);
			border-radius: 24px;
			transition: background-color 0.2s;
		}

		.gr-switch__slider::before {
			content: '';
			position: absolute;
			height: 18px;
			width: 18px;
			left: 3px;
			bottom: 3px;
			background-color: white;
			border-radius: 50%;
			transition: transform 0.2s;
		}

		.gr-switch--checked .gr-switch__slider {
			background-color: var(--gr-semantic-action-primary-default);
		}

		.gr-switch--checked .gr-switch__slider::before {
			transform: translateX(20px);
		}

		.gr-switch__input:focus-visible + .gr-switch__slider {
			box-shadow: 0 0 0 3px var(--gr-semantic-focus-ring);
		}

		.gr-switch__label {
			font-size: var(--gr-typography-fontSize-sm);
			color: var(--gr-semantic-foreground-primary);
		}
	}
</style>
