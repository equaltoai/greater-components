<script lang="ts">
  import { createWIPContext, type WIPThreadData } from '../../../src/components/CreativeTools/WorkInProgress/context.ts';
  import type { Component as SvelteComponent } from 'svelte';

  interface Props {
    thread: WIPThreadData;
    Component: SvelteComponent<any>;
    props?: Record<string, any>;
  }

  let { thread, Component, props = {} }: Props = $props();

  createWIPContext(thread);
</script>

<Component {...props} />
