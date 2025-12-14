<script lang="ts">
	import ExhibitionRoot from '../../../src/components/Exhibition/Root.svelte';
	import ExhibitionGallery from '../../../src/components/Exhibition/Gallery.svelte';
	import type { ExhibitionData, ExhibitionHandlers } from '../../../src/types/exhibition.js';

	interface Props {
		exhibition: ExhibitionData;
		handlers?: ExhibitionHandlers;
		layout?: 'gallery' | 'narrative' | 'timeline';
	}

	let { exhibition, handlers = {}, layout }: Props = $props();
</script>

<ExhibitionRoot {exhibition} {handlers} {layout}>
	<ExhibitionGallery />
</ExhibitionRoot>
