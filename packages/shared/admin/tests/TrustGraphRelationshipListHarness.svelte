<script lang="ts">
	import { createTrustGraphContext } from '../src/TrustGraph/context.js';
	import TrustGraphRelationshipList from '../src/TrustGraph/RelationshipList.svelte';
	import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';

	let {
		adapter,
		rootActorId = 'actor-root',
		class: className,
	}: {
		adapter: LesserGraphQLAdapter;
		rootActorId?: string;
		class?: string;
	} = $props();

	import { untrack } from 'svelte';
	const context = createTrustGraphContext(untrack(() => ({ adapter })));
	context.updateState({ rootActorId: untrack(() => rootActorId) });
</script>

<TrustGraphRelationshipList class={className} />
