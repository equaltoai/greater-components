<script lang="ts">
	import ExhibitionRoot from '../../src/components/Exhibition/Root.svelte';
	import ExhibitionNavigation from '../../src/components/Exhibition/Navigation.svelte';
	import type { ExhibitionData } from '../../src/types/curation.js';

	interface Props {
		exhibition: ExhibitionData;
		layout?: any;
	}

	let { exhibition, layout }: Props = $props();
</script>

<ExhibitionRoot {exhibition} {layout}>
	<div data-testid="exhibition-content">
		<ExhibitionNavigation />
	</div>
</ExhibitionRoot>