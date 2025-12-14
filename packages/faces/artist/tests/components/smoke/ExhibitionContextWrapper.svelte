<script lang="ts">
  import { createExhibitionContext } from '../../../src/components/Exhibition/context.ts';
  import type { ExhibitionData } from '../../../src/types/curation.js';
  import type { Component as SvelteComponent } from 'svelte';

  interface Props {
    exhibition: ExhibitionData;
    Component: SvelteComponent<any>;
    props?: Record<string, any>;
  }

  let { exhibition, Component, props = {} }: Props = $props();

  createExhibitionContext(exhibition);
</script>

<Component {...props} />
