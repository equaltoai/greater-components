<script lang="ts">
  import { createTrustGraphContext } from '../../src/components/Admin/TrustGraph/context.js';
  import TrustGraphVisualization from '../../src/components/Admin/TrustGraph/Visualization.svelte';
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
