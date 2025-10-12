<!--
Compose.MediaUpload - Enhanced media upload with drag & drop

Upload images, videos, and audio with drag & drop, progress tracking, and validation.

@component
@example
```svelte
<script>
  import { Compose } from '@greater/fediverse';
  
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
	import { createButton } from '@greater/headless/button';
	import {
		processFiles,
		validateFiles,
		formatFileSize,
		cleanupMediaFiles,
		type MediaFile,
		type MediaUploadConfig,
	} from './MediaUploadHandler.js';

	interface Props {
		/**
		 * Upload handler - receives File and returns media info
		 */
		onUpload?: (file: File, onProgress: (progress: number) => void) => Promise<{
			id: string;
			url: string;
			thumbnailUrl?: string;
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

	let {
		onUpload,
		onRemove,
		maxFiles = 4,
		config = {},
		class: className = '',
	}: Props = $props();

	let files = $state<MediaFile[]>([]);
	let isDragging = $state(false);
	let error = $state<string | null>(null);
	let fileInput: HTMLInputElement;

	const uploadButton = createButton();

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

			const result = await onUpload(mediaFile.file, progressCallback);

			mediaFile.serverId = result.id;
			mediaFile.status = 'complete';
			mediaFile.progress = 100;
		} catch (err: any) {
			mediaFile.status = 'error';
			mediaFile.error = err.message || 'Upload failed';
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

<div class="media-upload {className}">
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
				<path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z"/>
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
				<div class="media-upload__item">
					<div class="media-upload__preview">
						{#if file.type === 'image' && file.previewUrl}
							<img
								src={file.previewUrl}
								alt={file.description || file.file.name}
								class="media-upload__preview-image"
							/>
						{:else if file.type === 'video' && file.previewUrl}
							<video
								src={file.previewUrl}
								class="media-upload__preview-video"
								muted
								loop
							></video>
						{:else if file.type === 'audio'}
							<div class="media-upload__preview-audio">
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
								</svg>
								<span>{file.file.name}</span>
							</div>
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
											stroke-dasharray="{file.progress}, 100"
										/>
									</svg>
									<span class="media-upload__progress-text">{Math.round(file.progress)}%</span>
								</div>
							</div>
						{/if}

						{#if file.status === 'error'}
							<div class="media-upload__overlay media-upload__overlay--error">
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
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
						<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
					</svg>
					<span>Add more</span>
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.media-upload {
		width: 100%;
	}

	.media-upload__error {
		padding: 0.75rem 1rem;
		margin-bottom: 1rem;
		background: rgba(244, 33, 46, 0.1);
		border: 1px solid #f4211e;
		border-radius: 0.5rem;
		color: #f4211e;
		font-size: 0.875rem;
	}

	.media-upload__drop-zone {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		min-height: 200px;
		padding: 2rem;
		background: var(--drop-zone-bg, #f7f9fa);
		border: 2px dashed var(--drop-zone-border, #cfd9de);
		border-radius: 0.75rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.media-upload__drop-zone:hover,
	.media-upload__drop-zone--dragging {
		background: var(--drop-zone-hover, #eff3f4);
		border-color: var(--primary-color, #1d9bf0);
	}

	.media-upload__icon {
		width: 48px;
		height: 48px;
		color: var(--text-secondary, #536471);
	}

	.media-upload__text {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		text-align: center;
	}

	.media-upload__text strong {
		font-size: 1rem;
		color: var(--text-primary, #0f1419);
	}

	.media-upload__text span {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.media-upload__grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 1rem;
	}

	.media-upload__item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.media-upload__preview {
		position: relative;
		aspect-ratio: 16 / 9;
		background: var(--preview-bg, #f7f9fa);
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.media-upload__preview-image,
	.media-upload__preview-video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.media-upload__preview-audio {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		padding: 1rem;
		gap: 0.5rem;
	}

	.media-upload__preview-audio svg {
		width: 32px;
		height: 32px;
		color: var(--text-secondary, #536471);
	}

	.media-upload__preview-audio span {
		font-size: 0.75rem;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 100%;
	}

	.media-upload__overlay {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.7);
		color: white;
	}

	.media-upload__overlay--error {
		background: rgba(244, 33, 46, 0.9);
		gap: 0.5rem;
		padding: 1rem;
	}

	.media-upload__overlay--error svg {
		width: 32px;
		height: 32px;
	}

	.media-upload__overlay--error span {
		font-size: 0.75rem;
		text-align: center;
	}

	.media-upload__progress {
		position: relative;
		width: 48px;
		height: 48px;
	}

	.media-upload__progress-ring {
		transform: rotate(-90deg);
	}

	.media-upload__progress-text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 0.75rem;
		font-weight: 700;
	}

	.media-upload__remove {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.7);
		border: none;
		border-radius: 50%;
		color: white;
		font-size: 1.25rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.media-upload__remove:hover {
		background: #f4211e;
		transform: scale(1.1);
	}

	.media-upload__info {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.media-upload__filename {
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.media-upload__filesize {
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
	}

	.media-upload__add-more {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		aspect-ratio: 16 / 9;
		background: var(--add-more-bg, #f7f9fa);
		border: 2px dashed var(--add-more-border, #cfd9de);
		border-radius: 0.5rem;
		color: var(--primary-color, #1d9bf0);
		cursor: pointer;
		transition: all 0.2s;
	}

	.media-upload__add-more:hover {
		background: var(--add-more-hover, #eff3f4);
		border-color: var(--primary-color, #1d9bf0);
	}

	.media-upload__add-more svg {
		width: 24px;
		height: 24px;
	}

	.media-upload__add-more span {
		font-size: 0.875rem;
		font-weight: 600;
	}
</style>

