<!--
ArtistProfile.Sections - Customizable gallery sections container

Features:
- Customizable gallery sections
- Drag-and-drop reordering (when editable)
- Add/remove sections
- Uses PortfolioSection component

@component
@example
```svelte
<ArtistProfile.Sections />
```
-->

<script lang="ts">
	import { getArtistProfileContext } from './context.js';
	import PortfolioSection from '../PortfolioSection.svelte';

	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const ctx = getArtistProfileContext();
	const { artist, isEditing, handlers } = ctx;

	// Sorted sections by order
	const sortedSections = $derived(
		[...artist.sections].filter((s) => s.visible || isEditing).sort((a, b) => a.order - b.order)
	);

	// Drag state
	let draggedId: string | null = $state(null);
	let dragOverId: string | null = $state(null);

	// Handle drag start
	function handleDragStart(event: DragEvent, sectionId: string) {
		if (!isEditing) return;
		draggedId = sectionId;
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/plain', sectionId);
		}
	}

	// Handle drag over
	function handleDragOver(event: DragEvent, sectionId: string) {
		if (!isEditing || !draggedId || draggedId === sectionId) return;
		event.preventDefault();
		dragOverId = sectionId;
	}

	// Handle drag leave
	function handleDragLeave() {
		dragOverId = null;
	}

	// Handle drop
	function handleDrop(event: DragEvent, targetId: string) {
		if (!isEditing || !draggedId || draggedId === targetId) return;
		event.preventDefault();

		// Calculate new order
		const sections = [...sortedSections];
		const draggedIndex = sections.findIndex((s) => s.id === draggedId);
		const targetIndex = sections.findIndex((s) => s.id === targetId);

		if (draggedIndex !== -1 && targetIndex !== -1) {
			const [removed] = sections.splice(draggedIndex, 1);
			sections.splice(targetIndex, 0, removed!);

			// Notify parent of new order
			handlers.onSectionReorder?.(sections.map((s) => s.id));
		}

		draggedId = null;
		dragOverId = null;
	}

	// Handle drag end
	function handleDragEnd() {
		draggedId = null;
		dragOverId = null;
	}

	// Toggle section visibility
	function toggleVisibility(sectionId: string, visible: boolean) {
		handlers.onSectionToggle?.(sectionId, visible);
	}
</script>

<div class={`profile-sections ${className}`} role="region" aria-label="Portfolio sections">
	{#each sortedSections as section (section.id)}
		<div
			class="profile-sections__item"
			class:dragging={draggedId === section.id}
			class:drag-over={dragOverId === section.id}
			class:hidden={!section.visible}
			draggable={isEditing}
			ondragstart={(e) => handleDragStart(e, section.id)}
			ondragover={(e) => handleDragOver(e, section.id)}
			ondragleave={handleDragLeave}
			ondrop={(e) => handleDrop(e, section.id)}
			ondragend={handleDragEnd}
			role="article"
			aria-label={section.title}
		>
			{#if isEditing}
				<div class="profile-sections__controls">
					<button class="profile-sections__drag-handle" aria-label="Drag to reorder" tabindex={-1}>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
							<circle cx="4" cy="4" r="1.5" />
							<circle cx="12" cy="4" r="1.5" />
							<circle cx="4" cy="8" r="1.5" />
							<circle cx="12" cy="8" r="1.5" />
							<circle cx="4" cy="12" r="1.5" />
							<circle cx="12" cy="12" r="1.5" />
						</svg>
					</button>

					<button
						class="profile-sections__visibility-toggle"
						aria-label={section.visible ? 'Hide section' : 'Show section'}
						onclick={() => toggleVisibility(section.id, !section.visible)}
					>
						{#if section.visible}
							<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
								<path
									d="M8 3C4.5 3 1.5 6 1.5 8s3 5 6.5 5 6.5-3 6.5-5-3-5-6.5-5zm0 8a3 3 0 110-6 3 3 0 010 6z"
								/>
							</svg>
						{:else}
							<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
								<path
									d="M2 2l12 12M8 3C4.5 3 1.5 6 1.5 8c0 .5.2 1 .5 1.5M14.5 8c0 2-3 5-6.5 5-1 0-2-.2-2.8-.6"
								/>
							</svg>
						{/if}
					</button>
				</div>
			{/if}

			<PortfolioSection
				title={section.title}
				description={section.description}
				items={section.items}
				layout={section.layout}
				editable={isEditing}
			/>
		</div>
	{/each}
</div>

<style>
	.profile-sections {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-8);
	}

	.profile-sections__item {
		position: relative;
		transition:
			opacity 0.2s,
			transform 0.2s;
	}

	.profile-sections__item.dragging {
		opacity: 0.5;
	}

	.profile-sections__item.drag-over {
		transform: translateY(4px);
	}

	.profile-sections__item.hidden {
		opacity: 0.5;
	}

	.profile-sections__controls {
		position: absolute;
		top: 0;
		left: -40px;
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-2);
		z-index: 10;
	}

	.profile-sections__drag-handle,
	.profile-sections__visibility-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		padding: 0;
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-sm);
		background: var(--gr-color-gray-800);
		color: var(--gr-color-gray-400);
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s;
	}

	.profile-sections__drag-handle {
		cursor: grab;
	}

	.profile-sections__drag-handle:active {
		cursor: grabbing;
	}

	.profile-sections__drag-handle:hover,
	.profile-sections__visibility-toggle:hover {
		background: var(--gr-color-gray-700);
		color: var(--gr-color-gray-200);
	}

	.profile-sections__visibility-toggle:focus,
	.profile-sections__drag-handle:focus {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.profile-sections__item {
			transition: none;
		}

		.profile-sections__drag-handle,
		.profile-sections__visibility-toggle {
			transition: none;
		}
	}
</style>
