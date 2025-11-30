<script lang="ts">
	import { createSeveredRelationshipsContext } from '../src/SeveredRelationships/context.js';
	import SeveredRelationshipsList from '../src/SeveredRelationships/List.svelte';
	import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';

	let {
		adapter,
		class: className,
	}: {
		adapter: LesserGraphQLAdapter;
		class?: string;
	} = $props();

	createSeveredRelationshipsContext({ adapter });
</script>

<SeveredRelationshipsList class={className} />
