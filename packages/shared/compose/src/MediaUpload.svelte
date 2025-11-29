<!--
Compose.MediaUpload - Enhanced media upload with drag & drop

Upload images, videos, and audio with drag & drop, progress tracking, and validation.

@component
@example
```svelte
<script>
  import { Compose } from '@equaltoai/greater-components-fediverse';
  
  async function handleUpload(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/media', {
      method: 'POST',
      body: formData
    });
    return response.json();
  }
</script>

<Compose.MediaUpload 
  onUpload={handleUpload}
  maxFiles={4}
/>
```
-->

<script lang="ts">
	import { createButton } from '@equaltoai/greater-components-headless/button';
	import {
		processFiles,
		validateFiles,
		formatFileSize,
		cleanupMediaFiles,
		type MediaFile,
		type MediaUploadConfig,
	} from './MediaUploadHandler.js';
	import type { MediaCategory } from './types.js';

	const SPOILER_MAX_LENGTH = 200;
	const DESCRIPTION_MAX_LENGTH = 1500;

	const MEDIA_CATEGORY_OPTIONS: Array<{ value: MediaCategory; label: string }> = [
		{ value: 'IMAGE', label: 'Image' },
		{ value: 'VIDEO', label: 'Video' },
		{ value: 'AUDIO', label: 'Audio' },
		{ value: 'GIFV', label: 'Animated GIF' },
		{ value: 'DOCUMENT', label: 'Document' },
	];

	interface Props {
		/**
		 * Upload handler - receives File and returns media info
		 */
		onUpload?: (
			file: File,
			onProgress: (progress: number) => void,
			meta: MediaFile
		) => Promise<{
			id: string;
			url: string;
			thumbnailUrl?: string;
			sensitive?: boolean;
			spoilerText?: string | null;
			mediaCategory?: MediaCategory;
		}>;

		/**
		 * Callback when file is removed
		 */
		onRemove?: (id: string) => void;

		/**
		 * Maximum number of files
		 */
		maxFiles?: number;

		/**
		 * Upload configuration
		 */
		config?: MediaUploadConfig;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { onUpload, onRemove, maxFiles = 4, config = {}, class: className = '' }: Props = $props();

	let files = $state<MediaFile[]>([]);
	let isDragging = $state(false);
	let error = $state<string | null>(null);
	let fileInput: HTMLInputElement;
	let sensitiveVisibility = $state<Record<string, boolean>>({});

	const uploadButton = createButton();

	function extractErrorMessage(error: unknown): string {
		if (error instanceof Error) {
			return error.message;
		}
		if (typeof error === 'string') {
			return error;
		}
		return 'Upload failed';
	}

	/**
	 * Handle file selection
	 */
	async function handleFilesSelected(selectedFiles: FileList | null) {
		if (!selectedFiles || selectedFiles.length === 0) return;

		error = null;

		// Convert FileList to array
		const fileArray = Array.from(selectedFiles);

		// Check if adding these files would exceed max
		if (files.length + fileArray.length > maxFiles) {
			error = `Maximum ${maxFiles} files allowed`;
			return;
		}

		// Validate files
		const validation = validateFiles(fileArray, { ...config, maxFiles });
		if (!validation.valid) {
			error = validation.errors[0];
			return;
		}

		// Process files
		const processedFiles = await processFiles(fileArray, config);

		// Add to files array
		files = [...files, ...processedFiles];

		// Start uploading if handler provided
		if (onUpload) {
			for (const file of processedFiles) {
				uploadFile(file);
			}
		}
	}

	/**
	 * Upload a single file
	 */
	async function uploadFile(mediaFile: MediaFile) {
		if (!onUpload) return;

		mediaFile.status = 'uploading';

		try {
			const progressCallback = (progress: number) => {
				mediaFile.progress = progress;
			};

			const result = await onUpload(mediaFile.file, progressCallback, mediaFile);

			if (result.thumbnailUrl) {
				mediaFile.thumbnailUrl = result.thumbnailUrl;
			}

			mediaFile.sensitive = result.sensitive ?? mediaFile.sensitive;
			if (result.spoilerText !== undefined) {
				mediaFile.spoilerText = result.spoilerText ?? '';
			}
			if (result.mediaCategory) {
				mediaFile.mediaCategory = result.mediaCategory;
			}

			mediaFile.serverId = result.id;
			mediaFile.status = 'complete';
			mediaFile.progress = 100;
		} catch (error) {
			mediaFile.status = 'error';
			mediaFile.error = extractErrorMessage(error);
		}
	}

	/**
	 * Remove a file
	 */
	function removeFile(id: string) {
		const file = files.find((f) => f.id === id);
		if (file) {
			// Cleanup URLs
			if (file.previewUrl && file.previewUrl.startsWith('blob:')) {
				URL.revokeObjectURL(file.previewUrl);
			}

			// Call remove handler
			if (onRemove && file.serverId) {
				onRemove(file.serverId);
			}
		}

		files = files.filter((f) => f.id !== id);
	}

	function updateFileMetadata(id: string, updater: (file: MediaFile) => MediaFile) {
		files = files.map((file) => (file.id === id ? updater(file) : file));
	}

	function handleSensitiveToggle(id: string, sensitive: boolean) {
		updateFileMetadata(id, (file) => ({
			...file,
			sensitive,
		}));

		if (sensitive) {
			sensitiveVisibility = { ...sensitiveVisibility, [id]: false };
		} else {
			const nextVisibility = { ...sensitiveVisibility };
			delete nextVisibility[id];
			sensitiveVisibility = nextVisibility;
		}
	}

	function handleSpoilerChange(id: string, value: string) {
		const normalized = value.slice(0, SPOILER_MAX_LENGTH);
		updateFileMetadata(id, (file) => ({
			...file,
			spoilerText: normalized,
		}));
	}

	function handleDescriptionChange(id: string, value: string) {
		const normalized = value.slice(0, DESCRIPTION_MAX_LENGTH);
		updateFileMetadata(id, (file) => ({
			...file,
			description: normalized,
		}));
	}

	function handleMediaCategoryChange(id: string, category: MediaCategory) {
		updateFileMetadata(id, (file) => ({
			...file,
			mediaCategory: category,
		}));
	}

	function toggleSensitiveVisibility(id: string) {
		const current = sensitiveVisibility[id] === true;
		sensitiveVisibility = { ...sensitiveVisibility, [id]: !current };
	}

	function getPreviewType(file: MediaFile): 'image' | 'video' | 'audio' | 'file' {
		switch (file.mediaCategory) {
			case 'IMAGE':
				return 'image';
			case 'VIDEO':
			case 'GIFV':
				return 'video';
			case 'AUDIO':
				return 'audio';
			default:
				return 'file';
		}
	}

	/**
	 * Handle drag over
	 */
	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragging = true;
	}

	/**
	 * Handle drag leave
	 */
	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		// Check if we're leaving the drop zone completely
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const x = event.clientX;
		const y = event.clientY;

		if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
			isDragging = false;
		}
	}

	/**
	 * Handle drop
	 */
	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;

		const droppedFiles = event.dataTransfer?.files;
		handleFilesSelected(droppedFiles || null);
	}

	/**
	 * Handle file input change
	 */
	function handleInputChange(event: Event) {
		const target = event.target as HTMLInputElement;
		handleFilesSelected(target.files);
		// Reset input so same file can be selected again
		target.value = '';
	}

	/**
	 * Open file picker
	 */
	function openFilePicker() {
		fileInput?.click();
	}

	/**
	 * Cleanup on unmount
	 */
	$effect(() => {
		return () => {
			cleanupMediaFiles(files);
		};
	});

	const canAddMore = $derived(files.length < maxFiles);
</script>

<div class={`media-upload ${className}`}>
	<input
		bind:this={fileInput}
		type="file"
		accept="image/*,video/*,audio/*"
		multiple
		onchange={handleInputChange}
		style="display: none;"
	/>

	{#if error}
		<div class="media-upload__error" role="alert">
			{error}
		</div>
	{/if}

	{#if files.length === 0}
		<div
			class="media-upload__drop-zone"
			class:media-upload__drop-zone--dragging={isDragging}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={handleDrop}
			role="button"
			tabindex="0"
			onclick={openFilePicker}
			onkeydown={(e) => e.key === 'Enter' && openFilePicker()}
		>
			<svg class="media-upload__icon" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z"
				/>
			</svg>
			<div class="media-upload__text">
				{#if isDragging}
					<strong>Drop files here</strong>
				{:else}
					<strong>Click or drag files to upload</strong>
					<span>Images, videos, or audio</span>
				{/if}
			</div>
		</div>
	{:else}
		<div class="media-upload__grid">
			{#each files as file (file.id)}
				{@const previewType = getPreviewType(file)}
				<div class="media-upload__item">
					<div
						class="media-upload__preview"
						class:media-upload__preview--blurred={file.sensitive &&
							sensitiveVisibility[file.id] !== true}
					>
						{#if previewType === 'image' && file.previewUrl}
							<img
								src={file.previewUrl}
								alt={file.description || file.file.name}
								class="media-upload__preview-image"
							/>
						{:else if previewType === 'video' && file.previewUrl}
							<video src={file.previewUrl} class="media-upload__preview-video" muted loop></video>
						{:else if previewType === 'audio'}
							<div class="media-upload__preview-audio">
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
									/>
								</svg>
								<span>{file.file.name}</span>
							</div>
						{/if}

						{#if file.sensitive && file.status !== 'uploading' && file.status !== 'error'}
							{#if sensitiveVisibility[file.id] !== true}
								<div class="media-upload__overlay media-upload__overlay--sensitive">
									<span class="media-upload__overlay-label">Sensitive media</span>
									{#if file.spoilerText}
										<p class="media-upload__overlay-text">{file.spoilerText}</p>
									{/if}
									<button
										type="button"
										class="media-upload__reveal"
										onclick={() => toggleSensitiveVisibility(file.id)}
									>
										Reveal media
									</button>
								</div>
							{:else}
								<div class="media-upload__badge">Sensitive</div>
							{/if}
						{/if}

						{#if file.status === 'uploading'}
							<div class="media-upload__overlay">
								<div class="media-upload__progress">
									<svg class="media-upload__progress-ring" viewBox="0 0 36 36">
										<path
											d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
											fill="none"
											stroke="white"
											stroke-width="3"
											stroke-dasharray={`${file.progress}, 100`}
										/>
									</svg>
									<span class="media-upload__progress-text">{Math.round(file.progress)}%</span>
								</div>
							</div>
						{/if}

						{#if file.status === 'error'}
							<div class="media-upload__overlay media-upload__overlay--error">
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
									/>
								</svg>
								<span>{file.error}</span>
							</div>
						{/if}

						<button
							type="button"
							class="media-upload__remove"
							onclick={() => removeFile(file.id)}
							aria-label="Remove file"
						>
							×
						</button>
					</div>

					<div class="media-upload__info">
						<div class="media-upload__filename">{file.file.name}</div>
						<div class="media-upload__filesize">{formatFileSize(file.metadata?.size || 0)}</div>
					</div>

					<div class="media-upload__meta">
						<label class="media-upload__field media-upload__field--toggle">
							<input
								type="checkbox"
								checked={file.sensitive}
								onchange={(event) =>
									handleSensitiveToggle(file.id, (event.target as HTMLInputElement).checked)}
							/>
							<span>Sensitive content</span>
						</label>

						<label class="media-upload__field">
							<span class="media-upload__field-label">
								Spoiler text
								<span class="media-upload__counter"
									>{file.spoilerText.length}/{SPOILER_MAX_LENGTH}</span
								>
							</span>
							<input
								type="text"
								value={file.spoilerText}
								maxlength={SPOILER_MAX_LENGTH}
								oninput={(event) =>
									handleSpoilerChange(file.id, (event.target as HTMLInputElement).value)}
								placeholder="Optional warning shown before media"
							/>
						</label>

						<label class="media-upload__field">
							<span class="media-upload__field-label">
								Description
								<span class="media-upload__counter">
									{(file.description || '').length}/{DESCRIPTION_MAX_LENGTH}
								</span>
							</span>
							<textarea
								rows="3"
								maxlength={DESCRIPTION_MAX_LENGTH}
								oninput={(event) =>
									handleDescriptionChange(file.id, (event.target as HTMLTextAreaElement).value)}
								placeholder="Describe the media for accessibility"
								>{file.description ?? ''}</textarea
							>
						</label>

						<label class="media-upload__field">
							<span class="media-upload__field-label">Media type</span>
							<select
								onchange={(event) =>
									handleMediaCategoryChange(
										file.id,
										(event.target as HTMLSelectElement).value as MediaCategory
									)}
							>
								{#each MEDIA_CATEGORY_OPTIONS as option (option.value)}
									<option value={option.value} selected={option.value === file.mediaCategory}>
										{option.label}
									</option>
								{/each}
							</select>
						</label>
					</div>
				</div>
			{/each}

			{#if canAddMore}
				<button
					use:uploadButton.actions.button
					type="button"
					class="media-upload__add-more"
					onclick={openFilePicker}
				>
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
					</svg>
					<span>Add more</span>
				</button>
			{/if}
		</div>
	{/if}
</div>
