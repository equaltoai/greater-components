<script lang="ts">
  import { createDiscoveryContext } from '../../../src/components/Discovery/context.ts';
  import type { DiscoveryStore } from '../../../src/stores/types.js';
  import type { Component as SvelteComponent } from 'svelte';

  interface Props {
    store: DiscoveryStore;
    Component: SvelteComponent<any>;
    props?: Record<string, any>;
  }

  let { store, Component, props = {} }: Props = $props();

  createDiscoveryContext(store);
</script>

<Component {...props} />
