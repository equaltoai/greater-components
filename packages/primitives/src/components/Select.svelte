<script lang="ts">
	export interface SelectOption {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface Props {
		value?: string;
		options: SelectOption[];
		placeholder?: string;
		disabled?: boolean;
		required?: boolean;
		class?: string;
		id?: string;
		name?: string;
		onchange?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		options,
		placeholder,
		disabled = false,
		required = false,
		class: className = '',
		id,
		name,
		onchange,
	}: Props = $props();

	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		value = target.value;
		onchange?.(value);
	}
</script>

<select
	bind:value
	{disabled}
	{required}
	{id}
	{name}
	class={`gc-select ${className}`}
	onchange={handleChange}
>
	{#if placeholder}
		<option value="" disabled selected={!value}>{placeholder}</option>
	{/if}
	{#each options as option (option.value)}
		<option value={option.value} disabled={option.disabled}>
			{option.label}
		</option>
	{/each}
</select>

<style>
	.gc-select {
		width: 100%;
		padding: var(--gc-spacing-sm);
		border: 1px solid var(--gc-color-border-default);
		border-radius: var(--gc-radius-sm);
		background: var(--gc-color-surface-100);
		color: var(--gc-color-text-primary);
		font-family: inherit;
		font-size: var(--gc-font-size-md);
		cursor: pointer;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.gc-select:focus {
		outline: none;
		border-color: var(--gc-color-primary-500);
		box-shadow: 0 0 0 3px var(--gc-color-primary-100);
	}

	.gc-select:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		background: var(--gc-color-surface-200);
	}
</style>

