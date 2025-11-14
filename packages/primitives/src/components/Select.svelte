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
	class={`gr-select ${className}`}
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
	:global {
		.gr-select {
			width: 100%;
			padding: var(--gr-spacing-scale-3);
			border: 1px solid var(--gr-semantic-border-default);
			border-radius: var(--gr-radii-md);
			background: var(--gr-semantic-background-primary);
			color: var(--gr-semantic-foreground-primary);
			font-family: inherit;
			font-size: var(--gr-typography-fontSize-base);
			cursor: pointer;
			transition:
				border-color 0.2s,
				box-shadow 0.2s;
		}

		.gr-select:focus {
			outline: none;
			border-color: var(--gr-semantic-action-primary-default);
			box-shadow: 0 0 0 3px var(--gr-semantic-focus-ring);
		}

		.gr-select:disabled {
			opacity: 0.6;
			cursor: not-allowed;
			background: var(--gr-semantic-background-secondary);
		}
	}
</style>
