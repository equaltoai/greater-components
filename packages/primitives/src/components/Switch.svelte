<script lang="ts">
	interface Props {
		checked?: boolean;
		disabled?: boolean;
		class?: string;
		id?: string;
		name?: string;
		onchange?: (checked: boolean) => void;
	}

	let {
		checked = $bindable(false),
		disabled = false,
		class: className = '',
		id,
		name,
		onchange,
	}: Props = $props();

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		checked = target.checked;
		onchange?.(checked);
	}
</script>

<label class={`gc-switch ${className}`} class:gc-switch--checked={checked} class:gc-switch--disabled={disabled}>
	<input
		type="checkbox"
		bind:checked
		{disabled}
		{id}
		{name}
		class="gc-switch__input"
		onchange={handleChange}
	/>
	<span class="gc-switch__slider"></span>
</label>

<style>
	.gc-switch {
		position: relative;
		display: inline-block;
		width: 44px;
		height: 24px;
		cursor: pointer;
	}

	.gc-switch--disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.gc-switch__input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.gc-switch__slider {
		position: absolute;
		inset: 0;
		background-color: var(--gc-color-surface-400);
		border-radius: 24px;
		transition: background-color 0.2s;
	}

	.gc-switch__slider::before {
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

	.gc-switch--checked .gc-switch__slider {
		background-color: var(--gc-color-primary-500);
	}

	.gc-switch--checked .gc-switch__slider::before {
		transform: translateX(20px);
	}

	.gc-switch__input:focus-visible + .gc-switch__slider {
		box-shadow: 0 0 0 3px var(--gc-color-primary-100);
	}
</style>

