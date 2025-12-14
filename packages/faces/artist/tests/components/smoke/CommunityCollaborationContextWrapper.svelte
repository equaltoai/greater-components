<script lang="ts">
  import { createCollaborationContext } from '../../../src/components/Community/Collaboration/context.ts';
  import type { CollaborationData } from '../../../src/types/community.js';
  import type { Component as SvelteComponent } from 'svelte';

  interface Props {
    collaboration: CollaborationData;
    Component: SvelteComponent<any>;
    props?: Record<string, any>;
  }

  let { collaboration, Component, props = {} }: Props = $props();

  createCollaborationContext(collaboration);
</script>

<Component {...props} />
