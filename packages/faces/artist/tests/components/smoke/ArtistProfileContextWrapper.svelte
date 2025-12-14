<script lang="ts">
  import { createArtistProfileContext, type ArtistData } from '../../../src/components/ArtistProfile/context.ts';
  import type { Component as SvelteComponent } from 'svelte';

  interface Props {
    artist: ArtistData;
    Component: SvelteComponent<any>;
    props?: Record<string, any>;
  }

  let { artist, Component, props = {} }: Props = $props();

  createArtistProfileContext(artist);
</script>

<Component {...props} />
