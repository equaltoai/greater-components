<!--
Compose.ImageEditor - Image editing with focal point picker

Edit image metadata, set focal points for proper cropping, and add alt text.

@component
@example
```svelte
<script>
  import { Compose } from '@equaltoai/greater-components-compose';
  
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
