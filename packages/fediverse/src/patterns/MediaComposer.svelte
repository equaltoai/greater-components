<!--
  MediaComposer - Advanced Media Handling
  
  Provides comprehensive media upload and editing for ActivityPub posts.
  Supports images, videos, audio, focal points, alt text, and accessibility features.
  
  @component
  @example
  ```svelte
  <MediaComposer
    attachments={media}
    {config}
    {handlers}
  />
  ```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface MediaComposerAttachment {
		/**
		 * Unique ID
		 */
		id: string;

		/**
		 * Media type
		 */
		type: 'image' | 'video' | 'gifv' | 'audio' | 'unknown';

		/**
		 * Media URL
		 */
		url: string;

		/**
		 * Preview URL (thumbnail)
		 */
		previewUrl?: string;

		/**
		 * Alt text description
		 */
		description?: string;

		/**
		 * Focal point (x, y between -1 and 1)
		 */
		meta?: {
			focus?: { x: number; y: number };
			original?: {
				width: number;
				height: number;
				size?: string;
				aspect?: number;
			};
		};

		/**
		 * File object (for new uploads)
		 */
		file?: File;

		/**
		 * Upload progress (0-100)
		 */
		uploadProgress?: number;

		/**
		 * Whether upload is complete
		 */
		uploaded?: boolean;

		/**
		 * Upload error
		 */
		error?: string;
	}

	interface MediaComposerConfig {
		/**
		 * Maximum attachments
		 */
		maxAttachments?: number;

		/**
		 * Maximum alt text length
		 */
		maxAltTextLength?: number;

		/**
		 * Allowed file types
		 */
		allowedTypes?: string[];

		/**
		 * Maximum file size in bytes
		 */
		maxFileSize?: number;

		/**
		 * Show focal point editor
		 */
		enableFocalPoint?: boolean;

		/**
		 * Show image crop/edit tools
		 */
		enableImageEdit?: boolean;

		/**
		 * Require alt text for accessibility
		 */
		requireAltText?: boolean;

		/**
		 * Show thumbnail grid or list
		 */
		layout?: 'grid' | 'list';

		/**
		 * Custom CSS class
		 */
		class?: string;

		/**
		 * Enable drag and drop
		 */
		enableDragDrop?: boolean;
	}

	interface MediaComposerHandlers {
		/**
		 * Called when files are selected
		 */
		onUpload?: (files: File[]) => Promise<MediaComposerAttachment[]>;

		/**
		 * Called when attachment is removed
		 */
		onRemove?: (id: string) => void;

		/**
		 * Called when alt text is updated
		 */
		onUpdateAltText?: (id: string, altText: string) => void;

		/**
		 * Called when focal point is updated
		 */
		onUpdateFocalPoint?: (id: string, x: number, y: number) => void;

		/**
		 * Called when attachments are reordered
		 */
		onReorder?: (attachments: MediaComposerAttachment[]) => void;
	}

	interface Props {
		/**
		 * Current attachments
		 */
		attachments: MediaComposerAttachment[];

		/**
		 * Configuration
		 */
		config?: MediaComposerConfig;

		/**
		 * Event handlers
		 */
		handlers?: MediaComposerHandlers;

		/**
		 * Custom attachment renderer
		 */
		renderAttachment?: Snippet<[MediaComposerAttachment, number]>;
	}

	let {
		attachments = $bindable([]),
		config = {},
		handlers = {},
		renderAttachment,
	}: Props = $props();

	const {
		maxAttachments = 4,
		maxAltTextLength = 1500,
		allowedTypes = [
			'image/jpeg',
			'image/png',
			'image/gif',
			'image/webp',
			'video/mp4',
			'video/webm',
		],
	maxFileSize = 10 * 1024 * 1024, // 10MB
	enableFocalPoint = true,
		requireAltText = false,
		layout = 'grid',
		class: className = '',
		enableDragDrop = true,
	} = config;

	let editingAltTextId = $state<string | null>(null);
	let editingFocalPointId = $state<string | null>(null);
	let dragOverIndex = $state<number | null>(null);
	let uploading = $state(false);
	let fileInputRef = $state<HTMLInputElement | null>(null);

	/**
	 * Handle file selection
	 */
	async function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		const files = Array.from(input.files || []);
		await uploadFiles(files);
		input.value = ''; // Reset input
	}

	/**
	 * Upload files
	 */
	async function uploadFiles(files: File[]) {
		if (!files.length || uploading) return;

		// Validate
		const validFiles = files.filter((file) => {
			if (!allowedTypes.includes(file.type)) {
				console.warn(`File type ${file.type} not allowed`);
				return false;
			}
			if (file.size > maxFileSize) {
				console.warn(`File ${file.name} exceeds max size`);
				return false;
			}
			if (attachments.length >= maxAttachments) {
				console.warn(`Max attachments (${maxAttachments}) reached`);
				return false;
			}
			return true;
		});

		if (!validFiles.length) return;

		uploading = true;
		try {
			const newAttachments = await handlers.onUpload?.(validFiles);
			if (newAttachments) {
				attachments = [...attachments, ...newAttachments];
			}
		} finally {
			uploading = false;
		}
	}

	/**
	 * Remove attachment
	 */
	function removeAttachment(id: string) {
		handlers.onRemove?.(id);
		attachments = attachments.filter((a) => a.id !== id);
	}

	/**
	 * Update alt text
	 */
	function updateAltText(id: string, altText: string) {
		const attachment = attachments.find((a) => a.id === id);
		if (attachment) {
			attachment.description = altText;
			handlers.onUpdateAltText?.(id, altText);
		}
	}

	/**
	 * Update focal point
	 */
	function updateFocalPoint(id: string, event: MouseEvent) {
		const target = event.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();

		// Calculate focal point (-1 to 1)
		const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;

		const attachment = attachments.find((a) => a.id === id);
		if (attachment) {
			if (!attachment.meta) attachment.meta = {};
			attachment.meta.focus = { x, y };
			handlers.onUpdateFocalPoint?.(id, x, y);
		}
	}

	/**
	 * Get focal point position for display
	 */
	function getFocalPointPosition(attachment: MediaComposerAttachment): { x: string; y: string } {
		const focus = attachment.meta?.focus;
		if (!focus) return { x: '50%', y: '50%' };

		const x = ((focus.x + 1) / 2) * 100;
		const y = ((focus.y + 1) / 2) * 100;

		return { x: `${x}%`, y: `${y}%` };
	}

	/**
	 * Handle drag and drop
	 */
	function handleDragOver(event: DragEvent, index: number) {
		if (!enableDragDrop) return;
		event.preventDefault();
		dragOverIndex = index;
	}

	function handleDragLeave() {
		dragOverIndex = null;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		if (!enableDragDrop) return;

		const files = Array.from(event.dataTransfer?.files || []);
		if (files.length > 0) {
			uploadFiles(files);
		} else {
			// Handle reordering (if dragging existing attachment)
			// This would require additional drag state
		}

		dragOverIndex = null;
	}

	/**
	 * Check if all attachments have alt text
	 */
	const allHaveAltText = $derived(
		attachments.every((a) => a.description && a.description.trim().length > 0)
	);

	/**
	 * Get attachment thumbnail
	 */
	function getThumbnail(attachment: MediaComposerAttachment): string {
		return attachment.previewUrl || attachment.url;
	}

	/**
	 * Format file size
	 */
	function formatFileSize(bytes?: number): string {
		if (!bytes) return '';
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}
</script>

<div class={`media-composer media-composer--${layout} ${className}`}>
	{#if attachments.length > 0}
		<div class="media-composer__attachments">
			{#each attachments as attachment, index (attachment.id)}
				<div
					class="media-composer__attachment"
					class:media-composer__attachment--uploading={!attachment.uploaded}
					class:media-composer__attachment--error={attachment.error}
					class:media-composer__attachment--drag-over={dragOverIndex === index}
					role="group"
					aria-label={`Attachment ${index + 1}`}
					ondragover={(e) => handleDragOver(e, index)}
					ondragleave={handleDragLeave}
					ondrop={handleDrop}
				>
					{#if renderAttachment}
						{@render renderAttachment(attachment, index)}
					{:else}
						<div class="media-composer__preview">
							{#if attachment.type === 'image' || attachment.type === 'gifv'}
								<img
									src={getThumbnail(attachment)}
									alt={attachment.description || ''}
									class="media-composer__preview-img"
								/>
							{:else if attachment.type === 'video'}
								<video
									src={attachment.url}
									class="media-composer__preview-video"
									controls={false}
									muted
								>
									<track kind="captions" />
								</video>
								<div class="media-composer__video-badge">
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M8 5v14l11-7z" />
									</svg>
								</div>
							{:else if attachment.type === 'audio'}
								<div class="media-composer__audio-placeholder">
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path
											d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"
										/>
									</svg>
								</div>
							{/if}

							{#if !attachment.uploaded && attachment.uploadProgress !== undefined}
								<div class="media-composer__progress">
									<div
										class="media-composer__progress-bar"
										style={`width: ${attachment.uploadProgress}%`}
									></div>
								</div>
							{/if}

							{#if attachment.error}
								<div class="media-composer__error">
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path
											d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
										/>
									</svg>
									<span>{attachment.error}</span>
								</div>
							{/if}

							{#if enableFocalPoint && attachment.type === 'image' && editingFocalPointId === attachment.id}
								{@const pos = getFocalPointPosition(attachment)}
								<button
									class="media-composer__focal-overlay"
									onclick={(e) => updateFocalPoint(attachment.id, e)}
									aria-label="Set focal point"
								>
									<div
										class="media-composer__focal-point"
										style={`left: ${pos.x}; top: ${pos.y}`}
									></div>
								</button>
							{/if}
						</div>

						<div class="media-composer__controls">
							{#if enableFocalPoint && attachment.type === 'image'}
								<button
									class="media-composer__control-btn"
									class:media-composer__control-btn--active={editingFocalPointId === attachment.id}
									onclick={() =>
										(editingFocalPointId =
											editingFocalPointId === attachment.id ? null : attachment.id)}
									aria-label="Set focal point"
									title="Focal point"
								>
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path
											d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
										/>
									</svg>
								</button>
							{/if}

							<button
								class="media-composer__control-btn"
								class:media-composer__control-btn--active={editingAltTextId === attachment.id}
								class:media-composer__control-btn--warn={requireAltText && !attachment.description}
								onclick={() =>
									(editingAltTextId = editingAltTextId === attachment.id ? null : attachment.id)}
								aria-label="Edit alt text"
								title="Alt text"
							>
								ALT
							</button>

							<button
								class="media-composer__control-btn media-composer__control-btn--danger"
								onclick={() => removeAttachment(attachment.id)}
								aria-label="Remove attachment"
								title="Remove"
							>
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
									/>
								</svg>
							</button>
						</div>

						{#if editingAltTextId === attachment.id}
							<div class="media-composer__alt-editor">
								<textarea
									class="media-composer__alt-textarea"
									placeholder="Describe this media for people who can't see it..."
									value={attachment.description || ''}
									oninput={(e) => updateAltText(attachment.id, e.currentTarget.value)}
									maxlength={maxAltTextLength}
									rows="3"
									aria-label="Alt text"
								></textarea>
								<div class="media-composer__alt-meta">
									<span class="media-composer__alt-count">
										{attachment.description?.length || 0}/{maxAltTextLength}
									</span>
									<button
										class="media-composer__alt-done"
										onclick={() => (editingAltTextId = null)}
									>
										Done
									</button>
								</div>
							</div>
						{/if}

						{#if attachment.meta?.original}
							<div class="media-composer__meta">
								{attachment.meta.original.width}×{attachment.meta.original.height}
								{#if attachment.meta.original.size}
									• {formatFileSize(parseInt(attachment.meta.original.size))}
								{/if}
							</div>
						{/if}
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	{#if attachments.length < maxAttachments}
		<button
			class="media-composer__add"
			class:media-composer__add--full={attachments.length === 0}
			onclick={() => fileInputRef?.click()}
			disabled={uploading}
			aria-label="Add media"
		>
			{#if uploading}
				<svg class="media-composer__spinner" viewBox="0 0 24 24">
					<circle class="media-composer__spinner-track" cx="12" cy="12" r="10" />
					<circle class="media-composer__spinner-path" cx="12" cy="12" r="10" />
				</svg>
				<span>Uploading...</span>
			{:else}
				<svg class="media-composer__add-icon" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
					/>
				</svg>
				<span>
					{#if attachments.length === 0}
						Add media
					{:else}
						Add more ({attachments.length}/{maxAttachments})
					{/if}
				</span>
			{/if}
		</button>

		<input
			type="file"
			bind:this={fileInputRef}
			onchange={handleFileSelect}
			accept={allowedTypes.join(',')}
			multiple={attachments.length < maxAttachments - 1}
			class="media-composer__input"
			aria-label="Select media files"
		/>
	{/if}

	{#if requireAltText && attachments.length > 0 && !allHaveAltText}
		<div class="media-composer__warning">
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
			</svg>
			<span>Alt text is required for all media attachments</span>
		</div>
	{/if}
</div>

<style>
	.media-composer {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.media-composer__attachments {
		display: grid;
		gap: 0.75rem;
	}

	.media-composer--grid .media-composer__attachments {
		grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
	}

	.media-composer--list .media-composer__attachments {
		grid-template-columns: 1fr;
	}

	.media-composer__attachment {
		position: relative;
		border: 2px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		overflow: hidden;
		background: var(--bg-secondary, #f7f9fa);
		transition: all 0.2s;
	}

	.media-composer__attachment--uploading {
		opacity: 0.6;
	}

	.media-composer__attachment--error {
		border-color: var(--danger-color, #f4211e);
	}

	.media-composer__attachment--drag-over {
		border-color: var(--primary-color, #1d9bf0);
		border-style: dashed;
	}

	.media-composer__preview {
		position: relative;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: #000;
	}

	.media-composer__preview-img,
	.media-composer__preview-video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.media-composer__audio-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		background: var(--bg-tertiary, #e1e8ed);
		color: var(--text-secondary, #536471);
	}

	.media-composer__audio-placeholder svg {
		width: 3rem;
		height: 3rem;
	}

	.media-composer__video-badge {
		position: absolute;
		bottom: 0.5rem;
		right: 0.5rem;
		padding: 0.25rem 0.5rem;
		background: rgba(0, 0, 0, 0.7);
		border-radius: 0.25rem;
		color: white;
	}

	.media-composer__video-badge svg {
		width: 1rem;
		height: 1rem;
		display: block;
	}

	.media-composer__progress {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 0.25rem;
		background: rgba(0, 0, 0, 0.3);
	}

	.media-composer__progress-bar {
		height: 100%;
		background: var(--primary-color, #1d9bf0);
		transition: width 0.3s ease;
	}

	.media-composer__error {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 1rem;
		background: rgba(244, 33, 46, 0.9);
		color: white;
		text-align: center;
		font-size: 0.75rem;
	}

	.media-composer__error svg {
		width: 2rem;
		height: 2rem;
	}

	.media-composer__focal-overlay {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		border: none;
		cursor: crosshair;
		padding: 0;
	}

	.media-composer__focal-point {
		position: absolute;
		width: 2rem;
		height: 2rem;
		margin: -1rem 0 0 -1rem;
		border: 2px solid white;
		border-radius: 50%;
		box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
		pointer-events: none;
	}

	.media-composer__focal-point::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0.5rem;
		height: 0.5rem;
		margin: -0.25rem 0 0 -0.25rem;
		background: white;
		border-radius: 50%;
	}

	.media-composer__controls {
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem;
		background: var(--bg-primary, #ffffff);
	}

	.media-composer__control-btn {
		padding: 0.5rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--text-secondary, #536471);
		transition: all 0.2s;
	}

	.media-composer__control-btn:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.media-composer__control-btn--active {
		background: var(--primary-color, #1d9bf0);
		border-color: var(--primary-color, #1d9bf0);
		color: white;
	}

	.media-composer__control-btn--warn {
		border-color: var(--warning-color, #ff9800);
		color: var(--warning-color, #ff9800);
	}

	.media-composer__control-btn--danger:hover {
		background: rgba(244, 33, 46, 0.1);
		border-color: #f4211e;
		color: #f4211e;
	}

	.media-composer__control-btn svg {
		width: 1rem;
		height: 1rem;
		display: block;
	}

	.media-composer__alt-editor {
		padding: 0.5rem;
		background: var(--bg-primary, #ffffff);
		border-top: 1px solid var(--border-color, #e1e8ed);
	}

	.media-composer__alt-textarea {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.25rem;
		font-size: 0.875rem;
		font-family: inherit;
		color: var(--text-primary, #0f1419);
		resize: vertical;
	}

	.media-composer__alt-textarea:focus {
		outline: 2px solid var(--primary-color, #1d9bf0);
		outline-offset: -2px;
	}

	.media-composer__alt-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 0.5rem;
	}

	.media-composer__alt-count {
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
	}

	.media-composer__alt-done {
		padding: 0.25rem 0.75rem;
		background: var(--primary-color, #1d9bf0);
		border: none;
		border-radius: 9999px;
		cursor: pointer;
		font-size: 0.75rem;
		font-weight: 700;
		color: white;
		transition: background-color 0.2s;
	}

	.media-composer__alt-done:hover {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.media-composer__meta {
		padding: 0.375rem 0.5rem;
		font-size: 0.625rem;
		color: var(--text-tertiary, #8899a6);
		background: var(--bg-secondary, #f7f9fa);
		text-align: center;
	}

	.media-composer__add {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 2rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 2px dashed var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		cursor: pointer;
		color: var(--text-secondary, #536471);
		transition: all 0.2s;
	}

	.media-composer__add--full {
		padding: 4rem 2rem;
	}

	.media-composer__add:hover:not(:disabled) {
		background: var(--bg-hover, #eff3f4);
		border-color: var(--primary-color, #1d9bf0);
		color: var(--primary-color, #1d9bf0);
	}

	.media-composer__add:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.media-composer__add-icon {
		width: 2rem;
		height: 2rem;
	}

	.media-composer__add span {
		font-size: 0.875rem;
		font-weight: 600;
	}

	.media-composer__input {
		display: none;
	}

	.media-composer__spinner {
		width: 1.5rem;
		height: 1.5rem;
		animation: spin 1s linear infinite;
	}

	.media-composer__spinner-track {
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		opacity: 0.3;
	}

	.media-composer__spinner-path {
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-dasharray: 60;
		stroke-dashoffset: 20;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.media-composer__warning {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: rgba(255, 152, 0, 0.1);
		border: 1px solid var(--warning-color, #ff9800);
		border-radius: 0.25rem;
		font-size: 0.875rem;
		color: var(--warning-color, #ff9800);
	}

	.media-composer__warning svg {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}
</style>
