<script lang="ts">
	import Annotations from '../../../../../src/components/CreativeTools/CritiqueMode/Annotations.svelte';
	import TestCritiqueContext from './TestCritiqueContext.svelte';
	import type { ArtworkData } from '../../../../../src/components/Artwork/context.js';
	import type {
		CritiqueAnnotation,
		CritiqueConfig,
		CritiqueHandlers,
	} from '../../../../../src/components/CreativeTools/CritiqueMode/context.svelte.js';

	interface Props {
		artwork: ArtworkData;
		config?: CritiqueConfig;
		handlers?: CritiqueHandlers;
		initialAnnotations?: CritiqueAnnotation[];
	}

	let { artwork, config = {}, handlers = {}, initialAnnotations = [] }: Props = $props();
</script>

<TestCritiqueContext {artwork} {config} {handlers} {initialAnnotations}>
	{#snippet children()}
		<Annotations />
	{/snippet}
</TestCritiqueContext>
