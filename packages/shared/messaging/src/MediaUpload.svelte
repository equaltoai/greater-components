<!--
  Messages.MediaUpload - Media Attachment for Direct Messages
  
  Interface for uploading and attaching media (images, videos, audio) to direct messages.
-->
<script lang="ts">
	import { createButton } from '@equaltoai/greater-components-headless/button';
	import { getMessagesContext, type MessageMediaUploadMetadata } from './context.svelte.js';
	import { MediaUploadHandler } from '@equaltoai/greater-components-compose';

	const { mapMimeTypeToMediaCategory } = MediaUploadHandler;

	type MediaCategory = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'GIFV' | 'DOCUMENT';

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
