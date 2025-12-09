<script lang="ts">
	import InsightsModerationAnalytics from '../src/Insights/ModerationAnalytics.svelte';
	import { createInsightsContext } from '../src/Insights/context.js';
	import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';

	let {
		adapter,
		period,
		class: className,
	}: {
		adapter: LesserGraphQLAdapter;
		period?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
		class?: string;
	} = $props();

	import { untrack } from 'svelte';
	createInsightsContext(untrack(() => ({ adapter })));
</script>

<InsightsModerationAnalytics {period} class={className} />
