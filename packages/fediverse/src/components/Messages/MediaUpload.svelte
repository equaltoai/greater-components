<!--
  Messages.MediaUpload - Media Attachment for Direct Messages
  
  Interface for uploading and attaching media (images, videos, audio) to direct messages.
-->
<script lang="ts">
	import { createButton } from '@equaltoai/greater-components-headless/button';
	import { getMessagesContext, type MessageMediaUploadMetadata } from './context.js';
	import { mapMimeTypeToMediaCategory } from '../Compose/MediaUploadHandler.js';
	import type { MediaCategory } from '../../types.js';

	const SPOILER_MAX_LENGTH = 200;
	const DESCRIPTION_MAX_LENGTH = 1500;

	const MEDIA_CATEGORY_OPTIONS: Array<{ value: MediaCategory; label: string }> = [
		{ value: 'IMAGE', label: 'Image' },
		{ value: 'VIDEO', label: 'Video' },
		{ value: 'AUDIO', label: 'Audio' },
		{ value: 'GIFV', label: 'Animated GIF' },
		{ value: 'DOCUMENT', label: 'Document' },
	];

	interface MediaAttachment {
		id: string;
		url: string;
		previewUrl?: string;
		type: string;
		file?: File;
		description?: string;
		spoilerText: string;
		sensitive: boolean;
		mediaCategory: MediaCategory;
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
	let sensitiveVisibility = $state<Record<string, boolean>>({});

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

				const metadata: MessageMediaUploadMetadata = {
					mediaCategory: mapMimeTypeToMediaCategory(file.type),
					sensitive: false,
					spoilerText: '',
					description: undefined,
				};

				// Upload file
				const media = await handlers.onUploadMedia?.(file, metadata);

				if (media) {
					const previewUrl = media.previewUrl ?? URL.createObjectURL(file);
					const sensitive = media.sensitive ?? metadata.sensitive;
					const spoilerText = media.spoilerText ?? metadata.spoilerText ?? '';
					const mediaCategory = media.mediaCategory ?? metadata.mediaCategory;

					attachments = [
						...attachments,
						{
							id: media.id,
							url: media.url,
							previewUrl,
							type: file.type,
							file,
							description: metadata.description,
							spoilerText,
							sensitive,
							mediaCategory,
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

	function updateAttachment(id: string, updater: (attachment: MediaAttachment) => MediaAttachment) {
		attachments = attachments.map((attachment) =>
			attachment.id === id ? updater(attachment) : attachment
		);
	}

	function handleSensitiveToggle(id: string, sensitive: boolean) {
		updateAttachment(id, (attachment) => ({
			...attachment,
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
		updateAttachment(id, (attachment) => ({
			...attachment,
			spoilerText: normalized,
		}));
	}

	function handleDescriptionChange(id: string, value: string) {
		const normalized = value.slice(0, DESCRIPTION_MAX_LENGTH);
		updateAttachment(id, (attachment) => ({
			...attachment,
			description: normalized,
		}));
	}

	function handleMediaCategoryChange(id: string, category: MediaCategory) {
		updateAttachment(id, (attachment) => ({
			...attachment,
			mediaCategory: category,
		}));
	}

	function toggleSensitiveVisibility(id: string) {
		const current = sensitiveVisibility[id] === true;
		sensitiveVisibility = { ...sensitiveVisibility, [id]: !current };
	}

	function getPreviewType(attachment: MediaAttachment): 'image' | 'video' | 'audio' | 'file' {
		switch (attachment.mediaCategory) {
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

	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
				{@const mediaType = getPreviewType(attachment)}
				<div
					class="media-upload__preview"
					class:media-upload__preview--blurred={attachment.sensitive &&
						sensitiveVisibility[attachment.id] !== true}
				>
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

					{#if attachment.sensitive}
						{#if sensitiveVisibility[attachment.id] !== true}
							<div class="media-upload__overlay media-upload__overlay--sensitive">
								<span class="media-upload__overlay-label">Sensitive media</span>
								{#if attachment.spoilerText}
									<p class="media-upload__overlay-text">{attachment.spoilerText}</p>
								{/if}
								<button
									type="button"
									class="media-upload__reveal"
									onclick={() => toggleSensitiveVisibility(attachment.id)}
								>
									Reveal media
								</button>
							</div>
						{:else}
							<div class="media-upload__badge">Sensitive</div>
						{/if}
					{/if}

					<button
						class="media-upload__remove"
						onclick={() => removeAttachment(attachment.id)}
						aria-label="Remove attachment"
					>
						×
					</button>
				</div>

				<div class="media-upload__details">
					<div class="media-upload__filename">{attachment.file?.name || 'Attachment'}</div>
					<div class="media-upload__filesize">{formatFileSize(attachment.file?.size || 0)}</div>
				</div>

				<div class="media-upload__meta">
					<label class="media-upload__field media-upload__field--toggle">
						<input
							type="checkbox"
							checked={attachment.sensitive}
							onchange={(event) =>
								handleSensitiveToggle(attachment.id, (event.target as HTMLInputElement).checked)}
						/>
						<span>Sensitive content</span>
					</label>

					<label class="media-upload__field">
						<span class="media-upload__field-label">
							Spoiler text
							<span class="media-upload__counter"
								>{attachment.spoilerText.length}/{SPOILER_MAX_LENGTH}</span
							>
						</span>
						<input
							type="text"
							value={attachment.spoilerText}
							maxlength={SPOILER_MAX_LENGTH}
							oninput={(event) =>
								handleSpoilerChange(attachment.id, (event.target as HTMLInputElement).value)}
							placeholder="Optional warning before media"
						/>
					</label>

					<label class="media-upload__field">
						<span class="media-upload__field-label">
							Description
							<span class="media-upload__counter">
								{(attachment.description || '').length}/{DESCRIPTION_MAX_LENGTH}
							</span>
						</span>
						<textarea
							rows="3"
							maxlength={DESCRIPTION_MAX_LENGTH}
							oninput={(event) =>
								handleDescriptionChange(attachment.id, (event.target as HTMLTextAreaElement).value)}
							placeholder="Describe the media for accessibility"
							>{attachment.description ?? ''}</textarea
						>
					</label>

					<label class="media-upload__field">
						<span class="media-upload__field-label">Media type</span>
						<select
							onchange={(event) =>
								handleMediaCategoryChange(
									attachment.id,
									(event.target as HTMLSelectElement).value as MediaCategory
								)}
						>
							{#each MEDIA_CATEGORY_OPTIONS as option (option.value)}
								<option value={option.value} selected={option.value === attachment.mediaCategory}>
									{option.label}
								</option>
							{/each}
						</select>
					</label>
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

	.media-upload__overlay--sensitive {
		background: rgba(15, 20, 25, 0.85);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		text-align: center;
		padding: 1rem;
	}

	.media-upload__overlay-label {
		font-size: 0.875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.media-upload__overlay-text {
		font-size: 0.8125rem;
		margin: 0;
	}

	.media-upload__reveal {
		padding: 0.35rem 0.75rem;
		border-radius: 9999px;
		border: 1px solid rgba(255, 255, 255, 0.8);
		background: transparent;
		color: white;
		font-size: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			background-color 0.2s,
			color 0.2s;
	}

	.media-upload__reveal:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.media-upload__preview--blurred .media-upload__preview-image,
	.media-upload__preview--blurred .media-upload__preview-video {
		filter: blur(18px);
	}

	.media-upload__badge {
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
		padding: 0.25rem 0.5rem;
		border-radius: 9999px;
		background: rgba(15, 20, 25, 0.8);
		color: white;
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.media-upload__details {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		margin-top: 0.5rem;
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

	.media-upload__meta {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 0.5rem 0 0.75rem;
	}

	.media-upload__field {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.media-upload__field--toggle {
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-primary, #0f1419);
	}

	.media-upload__field input[type='text'],
	.media-upload__field textarea,
	.media-upload__field select {
		width: 100%;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--border-color, #cfd9de);
		border-radius: 0.5rem;
		font-size: 0.875rem;
		background: var(--bg-input, #fff);
		color: var(--text-primary, #0f1419);
	}

	.media-upload__field textarea {
		resize: vertical;
		min-height: 3.5rem;
	}

	.media-upload__field-label {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: var(--text-secondary, #536471);
		font-weight: 600;
	}

	.media-upload__counter {
		font-size: 0.75rem;
		color: var(--text-tertiary, #8899a6);
	}
</style>
