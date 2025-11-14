<script lang="ts">
	import { Switch, TextField } from '@equaltoai/greater-components-primitives';

	interface Props {
		enabled?: boolean;
		text?: string;
		label?: string;
		hint?: string;
	}

	let {
		enabled = $bindable(false),
		text = $bindable(''),
		label = 'Content warning',
		hint = 'Explain why viewers should opt in before revealing the preview.',
	}: Props = $props();

	const fieldId =
		typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
			? crypto.randomUUID()
			: `cw-${Math.random().toString(36).slice(2)}`;
	const toggleId = `${fieldId}-toggle`;
	const hintId = `${fieldId}-hint`;
</script>

<fieldset class="cw-field">
	<legend>{label}</legend>
	<div class="cw-toggle">
		<Switch id={toggleId} bind:checked={enabled} />
		<label for={toggleId}>Add content warning</label>
	</div>
	<p class="cw-hint" id={hintId}>
		{hint}
	</p>
	{#if enabled}
		<TextField
			label="Warning text"
			placeholder="e.g., spoilers, content note"
			bind:value={text}
			maxlength={160}
			aria-describedby={hintId}
		/>
	{/if}
</fieldset>

<style>
	fieldset {
		border: 1px solid var(--gr-semantic-border-subtle);
		border-radius: var(--gr-radii-xl);
		background: var(--gr-semantic-background-tertiary);
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin: 0;
	}

	legend {
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: var(--gr-typography-fontWeight-medium);
		padding: 0 0.35rem;
	}

	.cw-toggle {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.cw-toggle label {
		font-weight: var(--gr-typography-fontWeight-medium);
	}

	.cw-hint {
		margin: 0;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-semantic-foreground-tertiary);
	}
</style>
