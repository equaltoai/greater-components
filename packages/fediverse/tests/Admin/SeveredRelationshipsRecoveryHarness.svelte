<script lang="ts">
  import { createSeveredRelationshipsContext } from '../../src/components/Admin/SeveredRelationships/context.js';
  import RecoveryPanel from '../../src/components/Admin/SeveredRelationships/RecoveryPanel.svelte';
  import type { LesserGraphQLAdapter } from '@greater/adapters';

  let {
    adapter,
    severanceId,
    class: className,
  }: {
    adapter: LesserGraphQLAdapter;
    severanceId: string;
    class?: string;
  } = $props();

  createSeveredRelationshipsContext({ adapter });
</script>

<RecoveryPanel {severanceId} class={className} />
