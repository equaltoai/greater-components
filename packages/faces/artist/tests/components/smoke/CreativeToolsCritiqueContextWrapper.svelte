<script lang="ts">
  import { createCritiqueContext } from '../../../src/components/CreativeTools/CritiqueMode/context.ts';
  import type { ArtworkData } from '../../../src/types/artwork.js';
  import type { Component as SvelteComponent } from 'svelte';

  interface Props {
    artwork: ArtworkData;
    Component: SvelteComponent<any>;
    props?: Record<string, any>;
  }

  let { artwork, Component, props = {} }: Props = $props();

  createCritiqueContext(artwork);
</script>

<Component {...props} />
