<script lang="ts">
  import InsightsAIAnalysis from '../../src/components/Admin/Insights/AIAnalysis.svelte';
  import { createInsightsContext } from '../../src/components/Admin/Insights/context.js';
  import type { LesserGraphQLAdapter } from '@greater/adapters';

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

  createInsightsContext({ adapter });
</script>

<InsightsAIAnalysis {objectId} {autoRequest} class={className} />
