<script lang="ts">
  import StatusCommunityNotes from '../../src/components/Status/CommunityNotes.svelte';
  import { createStatusContext } from '../../src/components/Status/context.js';
  import type { GenericStatus } from '../../src/generics/index.js';
  import type { StatusActionHandlers } from '../../src/components/Status/context.js';

  let {
    status,
    handlers = {},
    maxInitialNotes,
    onVote,
    enableVoting = true,
    class: className,
  }: {
    status: GenericStatus;
    handlers?: StatusActionHandlers;
    maxInitialNotes?: number;
    onVote?: (noteId: string, helpful: boolean) => Promise<void> | void;
    enableVoting?: boolean;
    class?: string;
  } = $props();

  createStatusContext(status, {}, handlers);
</script>

<StatusCommunityNotes
  {maxInitialNotes}
  {onVote}
  {enableVoting}
  class={className}
/>
