<script lang="ts">
  import { createCostContext } from '../../src/components/Admin/Cost/context.js';
  import CostDashboard from '../../src/components/Admin/Cost/Dashboard.svelte';
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

  const context = createCostContext({ adapter });
  if (period) {
    context.updateState({ period });
  }
</script>

<CostDashboard {period} class={className} />
