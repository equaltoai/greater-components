<script lang="ts">
  import InsightsModerationAnalytics from '../../src/components/Admin/Insights/ModerationAnalytics.svelte';
  import { createInsightsContext } from '../../src/components/Admin/Insights/context.js';
  import type { LesserGraphQLAdapter } from '@greater/adapters';

  let {
    adapter,
    period,
    class: className,
  }: {
    adapter: LesserGraphQLAdapter;
    period?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
    class?: string;
  } = $props();

  createInsightsContext({ adapter });
</script>

<InsightsModerationAnalytics {period} class={className} />
