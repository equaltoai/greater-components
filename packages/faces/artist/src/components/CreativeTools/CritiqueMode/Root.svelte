<!--
CritiqueMode.Root - Container for structured critique interface

@component
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createCritiqueContext, type CritiqueConfig } from './context.js';
	import type { ArtworkData } from '../../Artwork/context.js';
	import type { CritiqueAnnotation, CritiqueHandlers } from '../../../types/creative-tools.js';

	interface Props {
		artwork: ArtworkData;
		handlers?: CritiqueHandlers;
		initialAnnotations?: CritiqueAnnotation[];
		enableAnnotations?: boolean;
		enableDrawing?: boolean;
		showCategories?: boolean;
		categories?: string[];
		class?: string;
		children: Snippet;
	}

	let {
		artwork,
		handlers = {},
		initialAnnotations = [],
		enableAnnotations = true,
		enableDrawing = true,
		showCategories = true,
		categories,
		class: className = '',
		children,
	}: Props = $props();

	// svelte-ignore state_referenced_locally
	const config: CritiqueConfig = {
		enableAnnotations,
		enableDrawing,
		showCategories,
		categories,
	};

	// svelte-ignore state_referenced_locally
	const ctx = createCritiqueContext(artwork, config, handlers, initialAnnotations);
</script>

<div
	class={`critique-mode ${className}`}
	data-annotating={ctx.isAnnotating}
	data-tool={ctx.currentTool}
>
	{@render children()}
</div>

<style>
	.critique-mode {
		position: relative;
		width: 100%;
		background: var(--gr-color-gray-900);
		color: var(--gr-color-gray-100);
		border-radius: var(--gr-radius-lg);
		overflow: hidden;
	}

	.critique-mode[data-annotating='true'] {
		cursor: crosshair;
	}

	.critique-mode[data-tool='select'] {
		cursor: default;
	}
</style>
