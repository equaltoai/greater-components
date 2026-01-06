<!--
CritiqueMode.Annotations - Visual annotation layer

@component
-->

<script lang="ts">
	import { getCritiqueContext } from './context.svelte.js';

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

	function handleMarkerKeyDown(event: KeyboardEvent, id: string) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleAnnotationClick(id);
		}
	}
</script>

{#if config.enableAnnotations}
	<div class={`critique-annotations ${className}`}>
		<svg
			class="critique-annotations__overlay"
			viewBox="0 0 100 100"
			preserveAspectRatio="none"
			aria-hidden="true"
		>
			{#each annotations as annotation, index (annotation.id)}
				{@const x = annotation.position.x * 100}
				{@const y = annotation.position.y * 100}
					<g
						class="critique-annotations__marker"
						class:selected={ctx.selectedAnnotationId === annotation.id}
						role="button"
						tabindex={-1}
						onclick={() => handleAnnotationClick(annotation.id)}
						onkeydown={(event) => handleMarkerKeyDown(event, annotation.id)}
					>
					<circle class="critique-annotations__marker-hit" cx={x} cy={y} r="4" />
					<circle
						class="critique-annotations__marker-fill"
						cx={x}
						cy={y}
						r="2.5"
						fill={getColor(annotation.category)}
					/>
					<circle class="critique-annotations__marker-outline" cx={x} cy={y} r="2.5" />
					<text class="critique-annotations__marker-text" x={x} y={y}>
						{index + 1}
					</text>
				</g>
			{/each}
		</svg>

		<ul class="critique-annotations__sr-list">
			{#each annotations as annotation, index (annotation.id)}
				<li>
					<button
						type="button"
						class="critique-annotations__sr-button"
						onclick={() => handleAnnotationClick(annotation.id)}
						aria-label={`Annotation ${index + 1}: ${annotation.content.slice(0, 50)}`}
					>
						Annotation {index + 1}
					</button>
				</li>
			{/each}
		</ul>

		{#if ctx.selectedAnnotationId}
			{@const selectedAnnotation = annotations.find((a) => a.id === ctx.selectedAnnotationId)}
			{#if selectedAnnotation}
				<div class="critique-annotations__panel" role="region" aria-label="Selected annotation">
					<div class="critique-annotations__panel-header">
						<span class="critique-annotations__author">{selectedAnnotation.authorName}</span>
						{#if selectedAnnotation.category}
							<span
								class={`critique-annotations__category critique-annotations__category--${selectedAnnotation.category}`}
							>
								{selectedAnnotation.category}
							</span>
						{/if}
					</div>
					<p class="critique-annotations__content">{selectedAnnotation.content}</p>
				</div>
			{/if}
		{/if}
	</div>
{/if}

<style>
	.critique-annotations {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.critique-annotations__overlay {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: auto;
	}

	.critique-annotations__marker {
		cursor: pointer;
	}

	.critique-annotations__marker-hit {
		fill: transparent;
	}

	.critique-annotations__marker-outline {
		fill: none;
		stroke: white;
		stroke-width: 0.75;
	}

	.critique-annotations__marker.selected circle {
		filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));
	}

	.critique-annotations__marker-text {
		fill: white;
		font-size: 3.5px;
		font-weight: 700;
		text-anchor: middle;
		dominant-baseline: central;
		user-select: none;
	}

	.critique-annotations__sr-list {
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

	.critique-annotations__panel {
		position: absolute;
		left: var(--gr-spacing-scale-4);
		bottom: var(--gr-spacing-scale-4);
		width: min(320px, calc(100% - var(--gr-spacing-scale-8)));
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-800);
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radius-md);
		pointer-events: auto;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
	}

	.critique-annotations__panel-header {
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

	.critique-annotations__category--composition {
		background: #3b82f6;
	}

	.critique-annotations__category--color {
		background: #f59e0b;
	}

	.critique-annotations__category--technique {
		background: #10b981;
	}

	.critique-annotations__category--concept {
		background: #8b5cf6;
	}

	.critique-annotations__category--other {
		background: #6b7280;
	}

	.critique-annotations__content {
		margin: 0;
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-300);
		line-height: 1.5;
	}

	@media (prefers-reduced-motion: reduce) {
		.critique-annotations__marker.selected circle {
			filter: none;
		}
	}
</style>
