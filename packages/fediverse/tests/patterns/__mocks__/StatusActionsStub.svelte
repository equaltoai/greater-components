<script lang="ts">
  import { getContext } from 'svelte';
  import type { GenericStatus } from '../../../src/generics/index.js';
  import type { StatusActionHandlers } from '../../../src/components/Status/context.js';
  import { STUB_STATUS_CONTEXT } from './statusContextStub.js';

  const context = getContext<{ status: GenericStatus; handlers: StatusActionHandlers }>(
    STUB_STATUS_CONTEXT
  );

  const handlers = context?.handlers ?? {};
  const status = context?.status;

  const hasQuoteHandler = typeof handlers.onQuote === 'function';

  function handleQuote() {
    handlers.onQuote?.(status as GenericStatus);
  }
</script>

{#if hasQuoteHandler}
  <button type="button" aria-label="Quote this post" onclick={handleQuote}>
    Quote
  </button>
{/if}
