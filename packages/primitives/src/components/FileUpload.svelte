<script lang="ts">
	interface Props {
		accept?: string;
		multiple?: boolean;
		disabled?: boolean;
		class?: string;
		id?: string;
		name?: string;
		maxSize?: number;
		onchange?: (files: FileList | null) => void;
	}

	let {
		accept,
		multiple = false,
		disabled = false,
		class: className = '',
		id,
		name,
		maxSize,
		onchange,
	}: Props = $props();

	let fileInput = $state<HTMLInputElement>();
	let selectedFiles = $state<FileList | null>(null);
	let errorMessage = $state<string | null>(null);

	function isAccepted(file: File) {
		if (!accept) return true;

		const acceptList = accept.split(',').map((entry) => entry.trim().toLowerCase());
		const fileType = file.type.toLowerCase();
		const fileName = file.name.toLowerCase();

		return acceptList.some((rule) => {
			if (rule === '*/*') return true;
			if (rule.endsWith('/*')) {
				const prefix = rule.slice(0, rule.indexOf('/'));
				return fileType.startsWith(`${prefix}/`);
			}
			if (rule.startsWith('.')) {
				return fileName.endsWith(rule);
			}
			return fileType === rule;
		});
	}

	function isWithinSize(file: File) {
		if (!maxSize) return true;
		return file.size <= maxSize;
	}

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;
		const fileArray = files ? Array.from(files) : [];
		const invalid = fileArray.find((file) => !isAccepted(file) || !isWithinSize(file));

		if (!files || fileArray.length === 0) {
			selectedFiles = files;
			errorMessage = null;
			onchange?.(files);
			return;
		}

		if (invalid) {
			errorMessage = !isAccepted(invalid) ? 'File type not accepted' : 'File exceeds maximum size';
			selectedFiles = null;
			onchange?.(null);
			return;
		}

		errorMessage = null;
		selectedFiles = files;
		onchange?.(files);
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
	{:else if errorMessage}
		<span class="gr-file-upload__error" role="alert">{errorMessage}</span>
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

		.gr-file-upload__error {
			color: var(--gr-semantic-foreground-danger, #b91c1c);
			font-size: var(--gr-typography-fontSize-sm);
		}
	}
</style>
