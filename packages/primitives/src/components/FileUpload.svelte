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
		selectedFiles
			? Array.from(selectedFiles)
					.map((f) => f.name)
					.join(', ')
			: ''
	);
</script>

<div class={`gr-file-upload ${className}`}>
	<input
		bind:this={fileInput}
		type="file"
		{accept}
		{multiple}
		{disabled}
		{id}
		{name}
		class="gr-file-upload__input"
		onchange={handleChange}
	/>
	<button type="button" class="gr-file-upload__button" onclick={triggerFileSelect} {disabled}>
		Choose {multiple ? 'Files' : 'File'}
	</button>
	{#if fileNames}
		<span class="gr-file-upload__files">{fileNames}</span>
	{/if}
</div>

<style>
	:global {
		.gr-file-upload {
			display: flex;
			align-items: center;
			gap: var(--gr-spacing-scale-3);
		}

		.gr-file-upload__input {
			display: none;
		}

		.gr-file-upload__button {
			padding: var(--gr-spacing-scale-3) var(--gr-spacing-scale-4);
			border: 1px solid var(--gr-semantic-border-default);
			border-radius: var(--gr-radii-md);
			background: var(--gr-semantic-background-primary);
			color: var(--gr-semantic-foreground-primary);
			font-size: var(--gr-typography-fontSize-sm);
			cursor: pointer;
			transition: background-color 0.2s;
		}

		.gr-file-upload__button:hover:not(:disabled) {
			background: var(--gr-semantic-background-secondary);
		}

		.gr-file-upload__button:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}

		.gr-file-upload__files {
			color: var(--gr-semantic-foreground-secondary);
			font-size: var(--gr-typography-fontSize-sm);
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
</style>
