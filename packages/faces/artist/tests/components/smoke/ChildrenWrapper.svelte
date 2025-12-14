<script lang="ts">
  import type { Component as SvelteComponent } from 'svelte';

  interface Props {
    Component: SvelteComponent<any>;
    props?: Record<string, any>;
  }

  let { Component, props = {} }: Props = $props();
</script>

<Component {...props}>
  <div data-testid="child" />
</Component>
