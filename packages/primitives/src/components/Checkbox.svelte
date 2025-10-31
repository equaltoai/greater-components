<script lang="ts">
	interface Props {
		checked?: boolean;
		disabled?: boolean;
		required?: boolean;
		indeterminate?: boolean;
		class?: string;
		id?: string;
		name?: string;
		value?: string;
		onchange?: (checked: boolean) => void;
	}

	let {
		checked = $bindable(false),
		disabled = false,
		required = false,
		indeterminate = false,
		class: className = '',
		id,
		name,
		value,
		onchange,
	}: Props = $props();

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		checked = target.checked;
		onchange?.(checked);
	}
</script>

<input
	type="checkbox"
	bind:checked
	bind:indeterminate
	{disabled}
	{required}
	{id}
	{name}
	{value}
	class={`gc-checkbox ${className}`}
	onchange={handleChange}
/>

<style>
	.gc-checkbox {
		width: 18px;
		height: 18px;
		border-radius: var(--gc-radius-xs);
		cursor: pointer;
		accent-color: var(--gc-color-primary-500);
	}

	.gc-checkbox:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.gc-checkbox:focus-visible {
		outline: 2px solid var(--gc-color-primary-500);
		outline-offset: 2px;
	}
</style>

