<script lang="ts">
	import InsightsAIAnalysis from '../src/Insights/AIAnalysis.svelte';
	import { createInsightsContext } from '../src/Insights/context.js';
	import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';

	let {
		adapter,
		objectId,
		autoRequest = false,
		class: className,
	}: {
		adapter: LesserGraphQLAdapter;
		objectId?: string;
		autoRequest?: boolean;
		class?: string;
	} = $props();

	import { untrack } from 'svelte';
	createInsightsContext(untrack(() => ({ adapter })));
</script>

<InsightsAIAnalysis {objectId} {autoRequest} class={className} />
