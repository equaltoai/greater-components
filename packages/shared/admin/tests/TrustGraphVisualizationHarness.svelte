<script lang="ts">
	import { createTrustGraphContext } from '../src/TrustGraph/context.js';
	import TrustGraphVisualization from '../src/TrustGraph/Visualization.svelte';
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

	const context = createTrustGraphContext({ adapter });
	context.updateState({ rootActorId });
</script>

<TrustGraphVisualization class={className} />
