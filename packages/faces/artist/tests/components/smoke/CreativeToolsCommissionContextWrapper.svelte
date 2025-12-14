<script lang="ts">
  import { createCommissionContext } from '../../../src/components/CreativeTools/CommissionWorkflow/context.ts';
  import type { CommissionData } from '../../../src/types/creative-tools.js';
  import type { Component as SvelteComponent } from 'svelte';

  interface Props {
    commission: CommissionData;
    Component: SvelteComponent<any>;
    props?: Record<string, any>;
  }

  let { commission, Component, props = {} }: Props = $props();

  createCommissionContext(() => commission, 'client');
</script>

<Component {...props} />
