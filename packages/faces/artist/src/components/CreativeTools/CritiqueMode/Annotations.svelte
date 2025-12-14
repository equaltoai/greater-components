<!--
CritiqueMode.Annotations - Visual annotation layer

@component
-->

<script lang="ts">
	import { getCritiqueContext } from './context.js';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const ctx = getCritiqueContext();
	const { annotations, config } = ctx;

	// Category colors
	const categoryColors: Record<string, string> = {
		composition: '#3b82f6',
		color: '#f59e0b',
		technique: '#10b981',
		concept: '#8b5cf6',
		other: '#6b7280',
	};

	// Get color for annotation
	function getColor(category?: string): string {
		return categoryColors[category || 'other'] || categoryColors.other;
	}

	// Handle annotation click
	function handleAnnotationClick(id: string) {
		ctx.selectedAnnotationId = ctx.selectedAnnotationId === id ? null : id;
	}
</script>

{#if config.enableAnnotations}
	<div class={`critique-annotations ${className}`}>
		{#each annotations as annotation, index (annotation.id)}
			<button
				type="button"
				class="critique-annotations__marker"
				class:selected={ctx.selectedAnnotationId === annotation.id}
				style="
					left: {annotation.position.x * 100}%;
					top: {annotation.position.y * 100}%;
					--marker-color: {getColor(annotation.category)};
				"
				onclick={() => handleAnnotationClick(annotation.id)}
				aria-label={`Annotation ${index + 1}: ${annotation.content.slice(0, 50)}`}
			>
				<span class="critique-annotations__number">{index + 1}</span>
			</button>

			{#if ctx.selectedAnnotationId === annotation.id}
				<div
					class="critique-annotations__tooltip"
					style="
						left: {annotation.position.x * 100}%;
						top: {annotation.position.y * 100}%;
					"
				>
					<div class="critique-annotations__tooltip-header">
						<span class="critique-annotations__author">{annotation.authorName}</span>
						{#if annotation.category}
							<span
								class="critique-annotations__category"
								style="background: {getColor(annotation.category)}"
							>
								{annotation.category}
							</span>
						{/if}
					</div>
					<p class="critique-annotations__content">{annotation.content}</p>
				</div>
			{/if}
		{/each}
	</div>
{/if}

<style>
	.critique-annotations {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.critique-annotations__marker {
		position: absolute;
		transform: translate(-50%, -50%);
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--marker-color, var(--gr-color-primary-500));
		border: 2px solid white;
		border-radius: var(--gr-radius-full);
		color: white;
		font-size: var(--gr-font-size-xs);
		font-weight: var(--gr-font-weight-bold);
		cursor: pointer;
		pointer-events: auto;
		transition: transform 0.2s;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.critique-annotations__marker:hover,
	.critique-annotations__marker.selected {
		transform: translate(-50%, -50%) scale(1.2);
		z-index: 10;
	}

	.critique-annotations__tooltip {
		position: absolute;
		transform: translate(-50%, calc(-100% - 16px));
		width: 250px;
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-800);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radius-md);
		pointer-events: auto;
		z-index: 20;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
	}

	.critique-annotations__tooltip-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--gr-spacing-scale-2);
	}

	.critique-annotations__author {
		font-weight: var(--gr-font-weight-medium);
		color: var(--gr-color-gray-100);
	}

	.critique-annotations__category {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		border-radius: var(--gr-radius-sm);
		font-size: var(--gr-font-size-xs);
		color: white;
	}

	.critique-annotations__content {
		margin: 0;
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-300);
		line-height: 1.5;
	}

	@media (prefers-reduced-motion: reduce) {
		.critique-annotations__marker {
			transition: none;
		}
	}
</style>
