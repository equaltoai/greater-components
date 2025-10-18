<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { GenericStatus } from '../../../src/generics/index.js';
  import type { StatusActionHandlers } from '../../../src/components/Status/context.js';
  import { setContext } from 'svelte';
  import { STUB_STATUS_CONTEXT } from './statusContextStub.js';

  let {
    status,
    handlers = {},
    children,
  }: {
    status: GenericStatus;
    handlers?: StatusActionHandlers;
    children?: Snippet;
  } = $props();

  setContext(STUB_STATUS_CONTEXT, {
    status,
    handlers,
  });
</script>

<div class="status-root-stub">
  {#if children}
    {@render children()}
  {/if}
</div>
