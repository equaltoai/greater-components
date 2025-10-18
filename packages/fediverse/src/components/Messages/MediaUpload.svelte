<!--
  Messages.MediaUpload - Media Attachment for Direct Messages
  
  Interface for uploading and attaching media (images, videos, audio) to direct messages.
-->
<script lang="ts">
	import { createButton } from '@greater/headless/button';
	import { getMessagesContext } from './context.js';

	interface MediaAttachment {
		id: string;
		url: string;
		previewUrl?: string;
		type: string;
		file?: File;
	}

	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;

		/**
		 * Maximum number of attachments
		 */
		maxAttachments?: number;

		/**
		 * Accepted file types
		 */
		accept?: string;

		/**
		 * Maximum file size in bytes
		 */
		maxFileSize?: number;

		/**
		 * Callback when attachments change
		 */
		onAttachmentsChange?: (mediaIds: string[]) => void;
	}

	let {
		class: className = '',
		maxAttachments = 4,
		accept = 'image/*,video/*,audio/*',
		maxFileSize = 10 * 1024 * 1024, // 10MB default
		onAttachmentsChange,
	}: Props = $props();

	const { handlers } = getMessagesContext();

	let attachments = $state<MediaAttachment[]>([]);
	let uploading = $state(false);
	let error = $state<string | null>(null);
	let fileInput: HTMLInputElement | null = $state(null);

	const canAddMore = $derived(attachments.length < maxAttachments);

	const uploadButton = createButton({
		onClick: () => {
			fileInput?.click();
		},
	});

	async function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		const files = input.files;

		if (!files || files.length === 0) return;

		error = null;

		// Check if adding these files would exceed max
		if (attachments.length + files.length > maxAttachments) {
			error = `Maximum ${maxAttachments} attachment${maxAttachments === 1 ? '' : 's'} allowed`;
			return;
		}

		uploading = true;

		try {
			for (const file of Array.from(files)) {
				// Validate file size
				if (file.size > maxFileSize) {
					error = `File ${file.name} exceeds maximum size of ${formatFileSize(maxFileSize)}`;
					continue;
				}

				// Upload file
				const media = await handlers.onUploadMedia?.(file);

				if (media) {
					// Create preview URL for local display
					const previewUrl = URL.createObjectURL(file);

					attachments = [
						...attachments,
						{
							id: media.id,
							url: media.url,
							previewUrl,
							type: file.type,
							file,
						},
					];
				}
			}

			// Notify parent of changes
			onAttachmentsChange?.(attachments.map((a) => a.id));
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to upload media';
		} finally {
			uploading = false;
			// Reset input so the same file can be selected again
			if (input) input.value = '';
		}
	}

	function removeAttachment(id: string) {
		const attachment = attachments.find((a) => a.id === id);
		if (attachment?.previewUrl) {
			URL.revokeObjectURL(attachment.previewUrl);
		}

		attachments = attachments.filter((a) => a.id !== id);
		onAttachmentsChange?.(attachments.map((a) => a.id));
	}

	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	function getMediaType(type: string): 'image' | 'video' | 'audio' | 'other' {
		if (type.startsWith('image/')) return 'image';
		if (type.startsWith('video/')) return 'video';
		if (type.startsWith('audio/')) return 'audio';
		return 'other';
	}

	// Cleanup preview URLs on unmount
	$effect(() => {
		return () => {
			attachments.forEach((attachment) => {
				if (attachment.previewUrl) {
					URL.revokeObjectURL(attachment.previewUrl);
				}
			});
		};
	});
</script>

<div class={`media-upload ${className}`}>
	<!-- Upload Button -->
	{#if canAddMore}
		<button
			use:uploadButton.actions.button
			class="media-upload__button"
			disabled={uploading}
			title="Attach media"
		>
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z"
				/>
			</svg>
			{#if uploading}
				<span class="media-upload__spinner"></span>
			{/if}
		</button>

		<input
			type="file"
			bind:this={fileInput}
			class="media-upload__input"
			{accept}
			multiple={maxAttachments > 1}
			onchange={handleFileSelect}
			aria-label="Upload media"
		/>
	{/if}

	<!-- Error Message -->
	{#if error}
		<div class="media-upload__error" role="alert">
			{error}
		</div>
	{/if}

	<!-- Attachments Preview -->
	{#if attachments.length > 0}
		<div class="media-upload__previews">
			{#each attachments as attachment (attachment.id)}
				{@const mediaType = getMediaType(attachment.type)}
				<div class="media-upload__preview">
					{#if mediaType === 'image'}
						<img
							src={attachment.previewUrl || attachment.url}
							alt="Attachment"
							class="media-upload__preview-image"
						/>
					{:else if mediaType === 'video'}
						<video
							src={attachment.previewUrl || attachment.url}
							class="media-upload__preview-video"
							controls
						>
							<track kind="captions" />
						</video>
					{:else if mediaType === 'audio'}
						<div class="media-upload__preview-audio">
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"
								/>
							</svg>
							<audio
								src={attachment.previewUrl || attachment.url}
								controls
								class="media-upload__audio"
							>
								<track kind="captions" />
							</audio>
						</div>
					{:else}
						<div class="media-upload__preview-file">
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
								/>
							</svg>
							<span class="media-upload__file-name">
								{attachment.file?.name || 'Attachment'}
							</span>
						</div>
					{/if}

					<button
						class="media-upload__remove"
						onclick={() => removeAttachment(attachment.id)}
						aria-label="Remove attachment"
					>
						×
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.media-upload {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.media-upload__button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: 50%;
		cursor: pointer;
		color: var(--primary-color, #1d9bf0);
		transition: background-color 0.2s;
		flex-shrink: 0;
	}

	.media-upload__button:hover:not(:disabled) {
		background: rgba(29, 155, 240, 0.1);
	}

	.media-upload__button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.media-upload__button svg {
		width: 1.25rem;
		height: 1.25rem;
	}

	.media-upload__spinner {
		position: absolute;
		width: 1rem;
		height: 1rem;
		border: 2px solid var(--border-color, #e1e8ed);
		border-top-color: var(--primary-color, #1d9bf0);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.media-upload__input {
		display: none;
	}

	.media-upload__error {
		padding: 0.5rem 0.75rem;
		background: rgba(244, 33, 46, 0.1);
		border: 1px solid #f4211e;
		border-radius: 0.5rem;
		color: #f4211e;
		font-size: 0.875rem;
	}

	.media-upload__previews {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 0.5rem;
	}

	.media-upload__preview {
		position: relative;
		aspect-ratio: 1;
		background: var(--bg-secondary, #f7f9fa);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.media-upload__preview-image,
	.media-upload__preview-video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.media-upload__preview-audio,
	.media-upload__preview-file {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 1rem;
		height: 100%;
	}

	.media-upload__preview-audio svg,
	.media-upload__preview-file svg {
		width: 2rem;
		height: 2rem;
		color: var(--text-secondary, #536471);
	}

	.media-upload__audio {
		width: 100%;
		height: 2rem;
	}

	.media-upload__file-name {
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.media-upload__remove {
		position: absolute;
		top: 0.25rem;
		right: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.75rem;
		height: 1.75rem;
		padding: 0;
		background: rgba(0, 0, 0, 0.7);
		border: none;
		border-radius: 50%;
		color: white;
		font-size: 1.25rem;
		line-height: 1;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.media-upload__remove:hover {
		background: rgba(0, 0, 0, 0.9);
	}
</style>
