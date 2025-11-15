<script lang="ts">
	import type { HTMLTextAreaAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLTextAreaAttributes, 'value'> {
		value?: string;
		label?: string;
		helpText?: string;
		errorMessage?: string;
		textareaClass?: string;
		class?: string;
		invalid?: boolean;
		onchange?: (value: string) => void;
		oninput?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		label,
		helpText,
		errorMessage,
		textareaClass = '',
		class: className = '',
		placeholder,
		id,
		required = false,
		disabled = false,
		readonly = false,
		rows = 4,
		maxlength,
		name,
		autocomplete,
		invalid = false,
		onchange,
		oninput,
		...restProps
	}: Props = $props();

	const textareaId = $derived(id ?? `gr-textarea-${Math.random().toString(36).slice(2)}`);
	const helpTextId = $derived(`${textareaId}-help`);
	const errorId = $derived(`${textareaId}-error`);

	const isInvalid = $derived(invalid || Boolean(errorMessage));

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

<div class={`gr-textarea-field ${className}`.trim()}>
	{#if label}
		<label
			for={textareaId}
			class="gr-textarea__label"
			class:gr-textarea__label--required={required}
		>
			{label}
			{#if required}
				<span class="gr-textarea__required" aria-hidden="true">*</span>
			{/if}
		</label>
	{/if}

	<textarea
		id={textareaId}
		bind:value
		{placeholder}
		{disabled}
		{readonly}
		{required}
		{rows}
		{maxlength}
		{name}
		{autocomplete}
		class={`gr-textarea ${textareaClass}`.trim()}
		aria-invalid={isInvalid || undefined}
		aria-describedby={[
			helpText && !isInvalid ? helpTextId : null,
			errorMessage && isInvalid ? errorId : null,
		]
			.filter(Boolean)
			.join(' ') || undefined}
		oninput={handleInput}
		onchange={handleChange}
		{...restProps}
	></textarea>

	{#if helpText && !isInvalid}
		<div id={helpTextId} class="gr-textarea__help">
			{helpText}
		</div>
	{/if}

	{#if errorMessage && isInvalid}
		<div id={errorId} class="gr-textarea__error" role="alert" aria-live="polite">
			{errorMessage}
		</div>
	{/if}
</div>

<style>
	:global {
		.gr-textarea-field {
			display: flex;
			flex-direction: column;
			gap: var(--gr-spacing-scale-1);
			font-family: var(--gr-typography-fontFamily-sans);
		}

		.gr-textarea__label {
			font-weight: var(--gr-typography-fontWeight-medium);
			font-size: var(--gr-typography-fontSize-sm);
			color: var(--gr-semantic-foreground-secondary);
		}

		.gr-textarea__label--required .gr-textarea__required {
			color: var(--gr-semantic-danger-default);
			margin-left: 0.25rem;
		}

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

		.gr-textarea__help {
			color: var(--gr-semantic-foreground-tertiary);
			font-size: var(--gr-typography-fontSize-sm);
		}

		.gr-textarea__error {
			color: var(--gr-semantic-danger-default);
			font-size: var(--gr-typography-fontSize-sm);
		}
	}
</style>
