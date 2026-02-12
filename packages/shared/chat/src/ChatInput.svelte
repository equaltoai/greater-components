<!--
  ChatInput - Smart Message Composer Component
  
  Provides a message input with auto-resize textarea, keyboard shortcuts,
  file upload support, and character count functionality.
  
  @component
  @example
  ```svelte
  <Chat.Container {handlers}>
    <Chat.Messages />
    <Chat.Input 
      placeholder="Type a message..."
      showFileUpload={true}
      onSend={(content, files) => handleSend(content, files)}
    />
  </Chat.Container>
  ```
-->
<script lang="ts">
	import { Button } from '@equaltoai/greater-components-primitives';
	import { SendIcon, PaperclipIcon, XIcon, ImageIcon } from '@equaltoai/greater-components-icons';

	/**
	 * Attached file with preview information
	 */
	interface AttachedFile {
		id: string;
		file: File;
		preview?: string;
		type: 'image' | 'file';
	}

	/**
	 * ChatInput component props
	 */
	interface Props {
		/**
		 * Current input value (bindable)
		 */
		value?: string;

		/**
		 * Placeholder text
		 * @default "Type a message..."
		 */
		placeholder?: string;

		/**
		 * Whether the input is disabled (e.g., during streaming)
		 */
		disabled?: boolean;

		/**
		 * Maximum character limit
		 */
		maxLength?: number;

		/**
		 * Whether to show file upload button
		 * @default false
		 */
		showFileUpload?: boolean;

		/**
		 * Accepted file types for upload
		 * @default "image/*,.pdf,.txt,.md"
		 */
		acceptedFileTypes?: string;

		/**
		 * Maximum number of files that can be attached
		 * @default 4
		 */
		maxFiles?: number;

		/**
		 * Maximum file size in bytes
		 * @default 10485760 (10MB)
		 */
		maxFileSize?: number;

		/**
		 * Called when message is submitted
		 */
		onSend: (content: string, files?: File[]) => void | Promise<void>;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		value = $bindable(''),
		placeholder = 'Type a message...',
		disabled = false,
		maxLength,
		showFileUpload = false,
		acceptedFileTypes = 'image/*,.pdf,.txt,.md',
		maxFiles = 4,
		maxFileSize = 10 * 1024 * 1024, // 10MB
		onSend,
		class: className = '',
	}: Props = $props();

	// Internal state
	let textareaEl: HTMLTextAreaElement | undefined = $state();
	let fileInputEl: HTMLInputElement | undefined = $state();
	let attachedFiles = $state<AttachedFile[]>([]);
	let isDragging = $state(false);
	let isSending = $state(false);
	let attachmentIdCounter = 0;

	// Computed values
	const characterCount = $derived(value.length);
	const isOverLimit = $derived(maxLength ? characterCount > maxLength : false);
	const isNearLimit = $derived(maxLength ? characterCount >= maxLength * 0.9 : false);
	const canSend = $derived(
		!disabled && !isSending && (value.trim().length > 0 || attachedFiles.length > 0) && !isOverLimit
	);
	const hasAttachments = $derived(attachedFiles.length > 0);
	const canAttachMore = $derived(attachedFiles.length < maxFiles);

	/**
	 * Handle input changes
	 */
	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		value = target.value;
	}

	/**
	 * Handle keyboard shortcuts
	 */
	function handleKeyDown(event: KeyboardEvent) {
		// Enter - Send message (if not empty)
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			if (canSend) {
				handleSend();
			}
			return;
		}

		// Shift+Enter - Insert newline (default behavior, no action needed)

		// Escape - Clear input
		if (event.key === 'Escape') {
			event.preventDefault();
			clearInput();
			return;
		}
	}

	/**
	 * Handle paste events (including image paste)
	 */
	async function handlePaste(event: ClipboardEvent) {
		if (!showFileUpload) return;

		const items = event.clipboardData?.items;
		if (!items) return;

		const imageItems: DataTransferItem[] = [];

		for (const item of items) {
			if (item.type.startsWith('image/')) {
				imageItems.push(item);
			}
		}

		if (imageItems.length > 0) {
			event.preventDefault();

			for (const item of imageItems) {
				const file = item.getAsFile();
				if (file && canAttachMore) {
					await addFile(file);
				}
			}
		}
	}

	/**
	 * Send the message
	 */
	async function handleSend() {
		if (!canSend) return;

		const content = value.trim();
		const files = attachedFiles.map((af) => af.file);

		isSending = true;

		try {
			await onSend(content, files.length > 0 ? files : undefined);

			// Clear input after successful send
			value = '';
			clearAttachments();
		} finally {
			isSending = false;
		}
	}

	/**
	 * Clear input and attachments
	 */
	function clearInput() {
		value = '';
		clearAttachments();
		textareaEl?.focus();
	}

	/**
	 * Clear all attachments
	 */
	function clearAttachments() {
		// Revoke object URLs to prevent memory leaks
		for (const attachment of attachedFiles) {
			if (attachment.preview) {
				URL.revokeObjectURL(attachment.preview);
			}
		}
		attachedFiles = [];
	}

	/**
	 * Generate unique ID for attachments
	 */
	function generateId(): string {
		attachmentIdCounter += 1;
		return `file_${Date.now()}_${attachmentIdCounter}`;
	}

	/**
	 * Add a file to attachments
	 */
	async function addFile(file: File): Promise<boolean> {
		// Validate file size
		if (file.size > maxFileSize) {
			console.warn(`File ${file.name} exceeds maximum size of ${maxFileSize} bytes`);
			return false;
		}

		// Check if we can add more files
		if (!canAttachMore) {
			console.warn(`Maximum of ${maxFiles} files allowed`);
			return false;
		}

		const isImage = file.type.startsWith('image/');
		const attachment: AttachedFile = {
			id: generateId(),
			file,
			type: isImage ? 'image' : 'file',
			preview: isImage ? URL.createObjectURL(file) : undefined,
		};

		attachedFiles = [...attachedFiles, attachment];
		return true;
	}

	/**
	 * Remove a file from attachments
	 */
	function removeFile(id: string) {
		const attachment = attachedFiles.find((af) => af.id === id);
		if (attachment?.preview) {
			URL.revokeObjectURL(attachment.preview);
		}
		attachedFiles = attachedFiles.filter((af) => af.id !== id);
	}

	/**
	 * Handle file input change
	 */
	async function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;

		if (!files) return;

		for (const file of files) {
			if (canAttachMore) {
				await addFile(file);
			}
		}

		// Reset input so the same file can be selected again
		target.value = '';
	}

	/**
	 * Trigger file input click
	 */
	function triggerFileSelect() {
		fileInputEl?.click();
	}

	/**
	 * Handle drag enter
	 */
	function handleDragEnter(event: DragEvent) {
		if (!showFileUpload) return;
		event.preventDefault();
		isDragging = true;
	}

	/**
	 * Handle drag leave
	 */
	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		// Only set to false if we're leaving the container
		const relatedTarget = event.relatedTarget as Node | null;
		if (!event.currentTarget || !(event.currentTarget as Node).contains(relatedTarget)) {
			isDragging = false;
		}
	}

	/**
	 * Handle drag over
	 */
	function handleDragOver(event: DragEvent) {
		if (!showFileUpload) return;
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'copy';
		}
	}

	/**
	 * Handle drop
	 */
	async function handleDrop(event: DragEvent) {
		if (!showFileUpload) return;
		event.preventDefault();
		isDragging = false;

		const files = event.dataTransfer?.files;
		if (!files) return;

		for (const file of files) {
			if (canAttachMore) {
				await addFile(file);
			}
		}
	}

	/**
	 * Format file size for display
	 */
	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	// Cleanup on unmount
	$effect(() => {
		return () => {
			// Cleanup object URLs
			for (const attachment of attachedFiles) {
				if (attachment.preview) {
					URL.revokeObjectURL(attachment.preview);
				}
			}
		};
	});
</script>

<div
	class={`chat-input ${className}`.trim()}
	class:chat-input--disabled={disabled}
	class:chat-input--dragging={isDragging}
	ondragenter={handleDragEnter}
	ondragleave={handleDragLeave}
	ondragover={handleDragOver}
	ondrop={handleDrop}
	role="region"
	aria-label="Message composer"
>
	<!-- Drag overlay -->
	{#if isDragging}
		<div class="chat-input__drag-overlay">
			<div class="chat-input__drag-content">
				<ImageIcon size={32} />
				<span>Drop files here</span>
			</div>
		</div>
	{/if}

	<!-- Attached files preview -->
	{#if hasAttachments}
		<div class="chat-input__attachments" role="list" aria-label="Attached files">
			{#each attachedFiles as attachment (attachment.id)}
				<div class="chat-input__attachment" role="listitem">
					{#if attachment.type === 'image' && attachment.preview}
						<img
							src={attachment.preview}
							alt={attachment.file.name}
							class="chat-input__attachment-preview"
						/>
					{:else}
						<div class="chat-input__attachment-icon">
							<PaperclipIcon size={16} />
						</div>
					{/if}
					<div class="chat-input__attachment-info">
						<span class="chat-input__attachment-name" title={attachment.file.name}>
							{attachment.file.name}
						</span>
						<span class="chat-input__attachment-size">
							{formatFileSize(attachment.file.size)}
						</span>
					</div>
					<button
						type="button"
						class="chat-input__attachment-remove"
						onclick={() => removeFile(attachment.id)}
						aria-label={`Remove ${attachment.file.name}`}
					>
						<XIcon size={14} />
					</button>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Input area -->
	<div class="chat-input__container">
		<!-- File upload button -->
		{#if showFileUpload}
			<input
				bind:this={fileInputEl}
				type="file"
				accept={acceptedFileTypes}
				multiple={maxFiles > 1}
				class="chat-input__file-input"
				onchange={handleFileSelect}
				aria-hidden="true"
				tabindex="-1"
			/>
			<Button
				variant="ghost"
				size="sm"
				onclick={triggerFileSelect}
				disabled={disabled || !canAttachMore}
				class="chat-input__upload-button"
				aria-label="Attach file"
			>
				<PaperclipIcon size={20} />
			</Button>
		{/if}

	<!-- Textarea -->
		<div class="chat-input__textarea-wrapper gr-autosize-textarea" data-gr-value={`${value}\n`}>
			<textarea
				bind:this={textareaEl}
				bind:value
				{placeholder}
				{disabled}
				maxlength={maxLength}
				rows={1}
				class="chat-input__textarea"
				class:chat-input__textarea--error={isOverLimit}
				oninput={handleInput}
				onkeydown={handleKeyDown}
				onpaste={handlePaste}
				aria-label="Message input"
				aria-describedby={maxLength ? 'chat-input-char-count' : undefined}
				aria-invalid={isOverLimit || undefined}
			></textarea>
		</div>

		<!-- Send button -->
		<Button
			variant="solid"
			size="sm"
			onclick={handleSend}
			disabled={!canSend}
			loading={isSending}
			class="chat-input__send-button"
			aria-label="Send message"
		>
			<SendIcon size={20} />
		</Button>
	</div>

	<!-- Character count -->
	{#if maxLength}
		<div
			id="chat-input-char-count"
			class="chat-input__char-count"
			class:chat-input__char-count--warning={isNearLimit && !isOverLimit}
			class:chat-input__char-count--error={isOverLimit}
			aria-live="polite"
		>
			{characterCount}/{maxLength}
		</div>
	{/if}
</div>

<style>
	/* Base container */
	.chat-input {
		position: sticky;
		bottom: 0;
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-3) var(--gr-spacing-scale-4);
		background: var(--gr-semantic-background-primary);
		border-top: 1px solid var(--gr-semantic-border-default);
		border-radius: var(--gr-radii-lg) var(--gr-radii-lg) 0 0;
		box-shadow: var(--gr-shadows-sm);
	}

	/* Dark mode handled via semantic tokens - no explicit override needed */

	.chat-input--disabled {
		opacity: 0.7;
		pointer-events: none;
	}

	/* Drag overlay */
	.chat-input--dragging {
		position: relative;
	}

	.chat-input__drag-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--gr-color-primary-50);
		border: 2px dashed var(--gr-color-primary-500);
		border-radius: var(--gr-radii-lg);
		z-index: 10;
	}

	.chat-input__drag-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		color: var(--gr-color-primary-600);
		font-weight: var(--gr-typography-fontWeight-medium);
	}

	/* Attachments */
	.chat-input__attachments {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gr-spacing-scale-2);
		padding-bottom: var(--gr-spacing-scale-2);
		border-bottom: 1px solid var(--gr-semantic-border-default);
	}

	.chat-input__attachment {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-semantic-background-secondary);
		border-radius: var(--gr-radii-md);
		max-width: 200px;
	}

	.chat-input__attachment-preview {
		width: 32px;
		height: 32px;
		object-fit: cover;
		border-radius: var(--gr-radii-sm);
	}

	.chat-input__attachment-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: var(--gr-semantic-background-tertiary);
		border-radius: var(--gr-radii-sm);
		color: var(--gr-semantic-foreground-tertiary);
	}

	.chat-input__attachment-info {
		display: flex;
		flex-direction: column;
		min-width: 0;
		flex: 1;
	}

	.chat-input__attachment-name {
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: var(--gr-typography-fontWeight-medium);
		color: var(--gr-semantic-foreground-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.chat-input__attachment-size {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-semantic-foreground-secondary);
	}

	.chat-input__attachment-remove {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		padding: 0;
		border: none;
		background: transparent;
		color: var(--gr-semantic-foreground-tertiary);
		cursor: pointer;
		border-radius: var(--gr-radii-full);
		transition: all 150ms ease;
	}

	.chat-input__attachment-remove:hover {
		background: var(--gr-semantic-background-tertiary);
		color: var(--gr-semantic-foreground-primary);
	}

	/* Input container - unified visual container for all input elements */
	.chat-input__container {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		background: var(--gr-semantic-background-secondary);
		border: 1px solid var(--gr-semantic-border-default);
		border-radius: var(--gr-radii-lg);
		transition:
			border-color 150ms ease,
			box-shadow 150ms ease;
		box-sizing: border-box;
		width: 100%;
		min-width: 0;
	}

	/* Focus state on container when textarea is focused */
	.chat-input__container:focus-within {
		border-color: var(--gr-color-primary-500);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--gr-color-primary-500) 20%, transparent);
	}

	/* Error state on container */
	.chat-input__container:has(.chat-input__textarea--error) {
		border-color: var(--gr-color-error-500);
	}

	.chat-input__container:has(.chat-input__textarea--error):focus-within {
		border-color: var(--gr-color-error-500);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--gr-color-error-500) 20%, transparent);
	}

	/* Disabled state on container */
	.chat-input--disabled .chat-input__container {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.chat-input__file-input {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	:global(.chat-input__upload-button) {
		flex-shrink: 0;
	}

	/* Textarea wrapper */
	.chat-input__textarea-wrapper {
		flex: 1;
		min-width: 0;
		display: grid;
		min-height: 24px;
		max-height: 144px; /* 6 lines * 24px */
		font-family: var(--gr-typography-fontFamily-sans);
		font-size: var(--gr-typography-fontSize-base);
		line-height: 1.5;
		color: var(--gr-semantic-foreground-primary);
	}

	.chat-input__textarea {
		width: 100%;
		overflow-y: auto;
	}

	.chat-input__textarea::placeholder {
		color: var(--gr-semantic-foreground-tertiary);
	}

	.chat-input__textarea:disabled {
		cursor: not-allowed;
	}

	/* Error state class - used for :has() selector above */
	.chat-input__textarea--error {
		color: inherit; /* Marker class for :has() selector - styling handled by container */
	}

	/* Send button */
	:global(.chat-input__send-button) {
		flex-shrink: 0;
	}

	/* Character count */
	.chat-input__char-count {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-semantic-foreground-secondary);
		transition: color 150ms ease;
	}

	.chat-input__char-count--warning {
		color: var(--gr-color-warning-600);
	}

	.chat-input__char-count--error {
		color: var(--gr-color-error-600);
		font-weight: var(--gr-typography-fontWeight-medium);
	}
</style>
