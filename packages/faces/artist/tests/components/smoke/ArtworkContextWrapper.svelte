<script lang="ts">
  import { createArtworkContext, type ArtworkData } from '../../../src/components/Artwork/context.ts';
  import type { Component as SvelteComponent } from 'svelte';

  interface Props {
    artwork: ArtworkData;
    Component: SvelteComponent<any>;
    props?: Record<string, any>;
  }

  let { artwork, Component, props = {} }: Props = $props();

  createArtworkContext(artwork);
</script>

<Component {...props} />
