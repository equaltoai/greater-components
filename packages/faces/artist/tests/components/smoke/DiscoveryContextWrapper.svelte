<script lang="ts">
  import { createDiscoveryContext } from '../../../src/components/Discovery/context.ts';
  import { createDiscoveryStore } from '../../../src/stores/discoveryStore.ts';
  import type { Component as SvelteComponent } from 'svelte';

  interface Props {
    Component: SvelteComponent<any>;
    props?: Record<string, any>;
  }

  let { Component, props = {} }: Props = $props();

  const store = createDiscoveryStore();
  createDiscoveryContext(store);
</script>

<Component {...props} />
