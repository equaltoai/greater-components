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
	class={`gr-textarea ${className}`}
	oninput={handleInput}
	onchange={handleChange}
></textarea>

<style>
	:global {
		.gr-textarea {
			width: 100%;
			padding: var(--gr-spacing-scale-3);
			border: 1px solid var(--gr-semantic-border-default);
			border-radius: var(--gr-radii-md);
			background: var(--gr-semantic-background-primary);
			color: var(--gr-semantic-foreground-primary);
			font-family: inherit;
			font-size: var(--gr-typography-fontSize-base);
			line-height: 1.5;
			resize: vertical;
			transition:
				border-color 0.2s,
				box-shadow 0.2s;
		}

		.gr-textarea:focus {
			outline: none;
			border-color: var(--gr-semantic-action-primary-default);
			box-shadow: 0 0 0 3px var(--gr-semantic-focus-ring);
		}

		.gr-textarea:disabled {
			opacity: 0.6;
			cursor: not-allowed;
			background: var(--gr-semantic-background-secondary);
		}

		.gr-textarea::placeholder {
			color: var(--gr-semantic-foreground-tertiary);
		}
	}
</style>
