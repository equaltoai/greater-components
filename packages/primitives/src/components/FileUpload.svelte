<script lang="ts">
	interface Props {
		accept?: string;
		multiple?: boolean;
		disabled?: boolean;
		class?: string;
		id?: string;
		name?: string;
		onchange?: (files: FileList | null) => void;
	}

	let {
		accept,
		multiple = false,
		disabled = false,
		class: className = '',
		id,
		name,
		onchange,
	}: Props = $props();

	let fileInput = $state<HTMLInputElement>();
	let selectedFiles = $state<FileList | null>(null);

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		selectedFiles = target.files;
		onchange?.(target.files);
	}

	function triggerFileSelect() {
		fileInput?.click();
	}

	const fileNames = $derived(
		selectedFiles ? Array.from(selectedFiles).map((f) => f.name).join(', ') : ''
	);
</script>

<div class={`gc-file-upload ${className}`}>
	<input
		bind:this={fileInput}
		type="file"
		{accept}
		{multiple}
		{disabled}
		{id}
		{name}
		class="gc-file-upload__input"
		onchange={handleChange}
	/>
	<button
		type="button"
		class="gc-file-upload__button"
		onclick={triggerFileSelect}
		{disabled}
	>
		Choose {multiple ? 'Files' : 'File'}
	</button>
	{#if fileNames}
		<span class="gc-file-upload__files">{fileNames}</span>
	{/if}
</div>

<style>
	.gc-file-upload {
		display: flex;
		align-items: center;
		gap: var(--gc-spacing-sm);
	}

	.gc-file-upload__input {
		display: none;
	}

	.gc-file-upload__button {
		padding: var(--gc-spacing-sm) var(--gc-spacing-md);
		border: 1px solid var(--gc-color-border-default);
		border-radius: var(--gc-radius-sm);
		background: var(--gc-color-surface-100);
		color: var(--gc-color-text-primary);
		font-size: var(--gc-font-size-sm);
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.gc-file-upload__button:hover:not(:disabled) {
		background: var(--gc-color-surface-200);
	}

	.gc-file-upload__button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.gc-file-upload__files {
		color: var(--gc-color-text-secondary);
		font-size: var(--gc-font-size-sm);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>

