<script lang="ts">
  import { createCritiqueCircleContext } from '../../../src/components/Community/CritiqueCircle/context.ts';
  import type { CritiqueCircleData } from '../../../src/types/community.js';
  import type { Component as SvelteComponent } from 'svelte';

  interface Props {
    circle: CritiqueCircleData;
    Component: SvelteComponent<any>;
    props?: Record<string, any>;
  }

  let { circle, Component, props = {} }: Props = $props();

  createCritiqueCircleContext(circle);
</script>

<Component {...props} />
