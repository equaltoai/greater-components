<!--
Compose.ImageEditor - Image editing with focal point picker

Edit image metadata, set focal points for proper cropping, and add alt text.

@component
@example
```svelte
<script>
  import { Compose } from '@equaltoai/greater-components-fediverse';
  
  let image = {
    url: '/path/to/image.jpg',
    focalPoint: { x: 0, y: 0 }
  };
</script>

<Compose.ImageEditor 
  bind:image={image}
  onSave={(image) => console.log('Saved:', image)}
/>
```
-->

<script lang="ts">
	import { createButton } from '@equaltoai/greater-components-headless/button';

	interface ImageData {
		/**
		 * Image URL or data URL
		 */
		url: string;

		/**
		 * Alt text description
		 */
		description?: string;

		/**
		 * Focal point (-1 to 1 for both x and y)
		 * 0,0 is center, -1,-1 is top-left, 1,1 is bottom-right
		 */
		focalPoint?: { x: number; y: number };

		/**
		 * Image dimensions
		 */
		width?: number;
		height?: number;
	}

	interface Props {
		/**
		 * Image data
		 */
		image: ImageData;

		/**
		 * Maximum alt text length
		 */
		maxAltTextLength?: number;

		/**
		 * Show focal point picker
		 */
		showFocalPoint?: boolean;

		/**
		 * Callback when changes are saved
		 */
		onSave?: (image: ImageData) => void;

		/**
		 * Callback when cancelled
		 */
		onCancel?: () => void;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let {
		image = $bindable(),
		maxAltTextLength = 1500,
		showFocalPoint = true,
		onSave,
		onCancel,
		class: className = '',
	}: Props = $props();

	let description = $state(image.description || '');
	let focalPoint = $state(image.focalPoint || { x: 0, y: 0 });
	let imageEl: HTMLImageElement;
	let containerEl: HTMLDivElement;
	let isDraggingFocal = $state(false);

	const saveButton = createButton();
	const cancelButton = createButton();

	/**
	 * Handle alt text change
	 */
	function handleDescriptionInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		description = target.value;
	}

	/**
	 * Handle focal point mouse down
	 */
	function handleFocalPointMouseDown(event: MouseEvent) {
		if (!showFocalPoint) return;
		event.preventDefault();
		isDraggingFocal = true;
		updateFocalPoint(event);
	}

	/**
	 * Handle focal point mouse move
	 */
	function handleFocalPointMouseMove(event: MouseEvent) {
		if (!isDraggingFocal) return;
		event.preventDefault();
		updateFocalPoint(event);
	}

	/**
	 * Handle focal point mouse up
	 */
	function handleFocalPointMouseUp() {
		isDraggingFocal = false;
	}

	/**
	 * Update focal point based on mouse position
	 */
	function updateFocalPoint(event: MouseEvent) {
		if (!containerEl) return;

		const rect = containerEl.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		// Convert to -1 to 1 range
		const normalizedX = (x / rect.width) * 2 - 1;
		const normalizedY = (y / rect.height) * 2 - 1;

		// Clamp to -1 to 1
		focalPoint = {
			x: Math.max(-1, Math.min(1, normalizedX)),
			y: Math.max(-1, Math.min(1, normalizedY)),
		};
	}

	/**
	 * Reset focal point to center
	 */
	function resetFocalPoint() {
		focalPoint = { x: 0, y: 0 };
	}

	/**
	 * Save changes
	 */
	function handleSave() {
		const updatedImage: ImageData = {
			...image,
			description: description.trim(),
			focalPoint: showFocalPoint ? focalPoint : undefined,
		};

		if (onSave) {
			onSave(updatedImage);
		} else {
			image = updatedImage;
		}
	}

	/**
	 * Cancel editing
	 */
	function handleCancel() {
		if (onCancel) {
			onCancel();
		} else {
			// Reset to original values
			description = image.description || '';
			focalPoint = image.focalPoint || { x: 0, y: 0 };
		}
	}

	// Attach mouse event listeners for focal point dragging
	$effect(() => {
		if (!showFocalPoint) return;

		document.addEventListener('mousemove', handleFocalPointMouseMove);
		document.addEventListener('mouseup', handleFocalPointMouseUp);

		return () => {
			document.removeEventListener('mousemove', handleFocalPointMouseMove);
			document.removeEventListener('mouseup', handleFocalPointMouseUp);
		};
	});

	// Calculate focal point position for display
	const focalPositionPercent = $derived({
		x: ((focalPoint.x + 1) / 2) * 100,
		y: ((focalPoint.y + 1) / 2) * 100,
	});

	const remainingChars = $derived(maxAltTextLength - description.length);
	const isDescriptionOverLimit = $derived(description.length > maxAltTextLength);
</script>

<div class={`image-editor ${className}`}>
	<div class="image-editor__preview">
		<div
			bind:this={containerEl}
			class="image-editor__image-container"
			class:image-editor__image-container--dragging={isDraggingFocal}
			onmousedown={handleFocalPointMouseDown}
			role="button"
			tabindex="0"
			aria-label="Click to set focal point"
		>
			<img
				bind:this={imageEl}
				src={image.url}
				alt={description || 'Image preview'}
				class="image-editor__image"
			/>

			{#if showFocalPoint}
				<div
					class="image-editor__focal-point"
					style={`left: ${focalPositionPercent.x}%; top: ${focalPositionPercent.y}%;`}
					role="presentation"
				>
					<div class="image-editor__focal-point-inner"></div>
				</div>

				<div class="image-editor__focal-instructions">Click or drag to set focal point</div>
			{/if}
		</div>

		{#if showFocalPoint}
			<div class="image-editor__focal-controls">
				<button type="button" class="image-editor__reset-button" onclick={resetFocalPoint}>
					Reset to center
				</button>
				<span class="image-editor__focal-coords">
					x: {focalPoint.x.toFixed(2)}, y: {focalPoint.y.toFixed(2)}
				</span>
			</div>
		{/if}
	</div>

	<div class="image-editor__form">
		<div class="image-editor__field">
			<label for="alt-text" class="image-editor__label">
				Alt text (for accessibility)
				<span class="image-editor__required">Required</span>
			</label>
			<textarea
				id="alt-text"
				class="image-editor__textarea"
				class:image-editor__textarea--error={isDescriptionOverLimit}
				placeholder="Describe this image for people using screen readers..."
				value={description}
				oninput={handleDescriptionInput}
				rows="4"
				maxlength={maxAltTextLength}
			></textarea>
			<div
				class="image-editor__char-count"
				class:image-editor__char-count--over={isDescriptionOverLimit}
			>
				{remainingChars} characters remaining
			</div>
		</div>

		<div class="image-editor__actions">
			<button
				use:cancelButton.actions.button
				type="button"
				class="image-editor__cancel"
				onclick={handleCancel}
			>
				Cancel
			</button>

			<button
				use:saveButton.actions.button
				type="button"
				class="image-editor__save"
				onclick={handleSave}
				disabled={isDescriptionOverLimit || !description.trim()}
			>
				Save
			</button>
		</div>
	</div>
</div>

<style>
	.image-editor {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		padding: 1.5rem;
		background: var(--editor-bg, white);
		border-radius: 0.75rem;
	}

	.image-editor__preview {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.image-editor__image-container {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		background: var(--image-container-bg, #f7f9fa);
		border-radius: 0.5rem;
		overflow: hidden;
		cursor: crosshair;
	}

	.image-editor__image-container--dragging {
		cursor: grabbing;
	}

	.image-editor__image {
		width: 100%;
		height: 100%;
		object-fit: contain;
		user-select: none;
	}

	.image-editor__focal-point {
		position: absolute;
		width: 40px;
		height: 40px;
		transform: translate(-50%, -50%);
		pointer-events: none;
	}

	.image-editor__focal-point-inner {
		width: 100%;
		height: 100%;
		border: 3px solid white;
		border-radius: 50%;
		box-shadow:
			0 2px 8px rgba(0, 0, 0, 0.3),
			inset 0 0 0 1px rgba(0, 0, 0, 0.2);
		background: rgba(29, 155, 240, 0.3);
	}

	.image-editor__focal-instructions {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 0.75rem;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
		color: white;
		font-size: 0.875rem;
		text-align: center;
		pointer-events: none;
	}

	.image-editor__focal-controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem;
		background: var(--focal-controls-bg, #f7f9fa);
		border-radius: 0.5rem;
	}

	.image-editor__reset-button {
		padding: 0.5rem 1rem;
		background: transparent;
		border: 1px solid var(--border-color, #cfd9de);
		border-radius: 0.375rem;
		color: var(--text-primary, #0f1419);
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.image-editor__reset-button:hover {
		background: var(--hover-bg, #eff3f4);
		border-color: var(--primary-color, #1d9bf0);
		color: var(--primary-color, #1d9bf0);
	}

	.image-editor__focal-coords {
		font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.image-editor__form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.image-editor__field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.image-editor__label {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	.image-editor__required {
		color: #f4211e;
		font-weight: 400;
		font-size: 0.875rem;
		margin-left: 0.25rem;
	}

	.image-editor__textarea {
		width: 100%;
		min-height: 120px;
		padding: 0.75rem;
		font-family: inherit;
		font-size: 0.9375rem;
		line-height: 1.5;
		color: var(--text-primary, #0f1419);
		background: var(--textarea-bg, white);
		border: 1px solid var(--border-color, #cfd9de);
		border-radius: 0.5rem;
		resize: vertical;
		outline: none;
		transition: border-color 0.2s;
	}

	.image-editor__textarea:focus {
		border-color: var(--primary-color, #1d9bf0);
		box-shadow: 0 0 0 1px var(--primary-color, #1d9bf0);
	}

	.image-editor__textarea--error {
		border-color: #f4211e;
	}

	.image-editor__char-count {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
		text-align: right;
	}

	.image-editor__char-count--over {
		color: #f4211e;
		font-weight: 600;
	}

	.image-editor__actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
		margin-top: auto;
	}

	.image-editor__cancel {
		padding: 0.75rem 1.5rem;
		background: transparent;
		border: 1px solid var(--border-color, #cfd9de);
		border-radius: 9999px;
		color: var(--text-primary, #0f1419);
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s;
	}

	.image-editor__cancel:hover {
		background: var(--hover-bg, #eff3f4);
	}

	.image-editor__save {
		padding: 0.75rem 1.5rem;
		background: var(--primary-color, #1d9bf0);
		border: none;
		border-radius: 9999px;
		color: white;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s;
	}

	.image-editor__save:hover:not(:disabled) {
		background: var(--primary-hover, #1a8cd8);
	}

	.image-editor__save:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@media (max-width: 768px) {
		.image-editor {
			grid-template-columns: 1fr;
		}
	}
</style>
