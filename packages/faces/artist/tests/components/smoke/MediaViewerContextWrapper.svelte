<script lang="ts">
  import { createMediaViewerContext } from '../../../src/components/MediaViewer/context.ts';
  import type { ArtworkData } from '../../../src/types/artwork.js';
  import type { Component as SvelteComponent } from 'svelte';

  interface Props {
    artworks: ArtworkData[];
    Component: SvelteComponent<any>;
    props?: Record<string, any>;
  }

  let { artworks, Component, props = {} }: Props = $props();

  createMediaViewerContext(artworks);
</script>

<Component {...props} />
