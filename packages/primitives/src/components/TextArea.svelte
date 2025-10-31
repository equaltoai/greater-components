<script lang="ts">

	interface Props {
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		readonly?: boolean;
		required?: boolean;
		rows?: number;
		maxlength?: number;
		class?: string;
		id?: string;
		name?: string;
		autocomplete?: string;
		onchange?: (value: string) => void;
		oninput?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		placeholder,
		disabled = false,
		readonly = false,
		required = false,
		rows = 4,
		maxlength,
		class: className = '',
		id,
		name,
		autocomplete,
		onchange,
		oninput,
	}: Props = $props();

	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		value = target.value;
		oninput?.(value);
	}

	function handleChange(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		value = target.value;
		onchange?.(value);
	}
</script>

<textarea
	bind:value
	{placeholder}
	{disabled}
	{readonly}
	{required}
	{rows}
	{maxlength}
	{id}
	{name}
	{autocomplete}
	class={`gc-textarea ${className}`}
	oninput={handleInput}
	onchange={handleChange}
></textarea>

<style>
	.gc-textarea {
		width: 100%;
		padding: var(--gc-spacing-sm);
		border: 1px solid var(--gc-color-border-default);
		border-radius: var(--gc-radius-sm);
		background: var(--gc-color-surface-100);
		color: var(--gc-color-text-primary);
		font-family: inherit;
		font-size: var(--gc-font-size-md);
		line-height: 1.5;
		resize: vertical;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.gc-textarea:focus {
		outline: none;
		border-color: var(--gc-color-primary-500);
		box-shadow: 0 0 0 3px var(--gc-color-primary-100);
	}

	.gc-textarea:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		background: var(--gc-color-surface-200);
	}

	.gc-textarea::placeholder {
		color: var(--gc-color-text-tertiary);
	}
</style>

