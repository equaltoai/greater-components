<script lang="ts">
  import StatusActions from '../../src/components/Status/Actions.svelte';
  import { createStatusContext } from '../../src/components/Status/context.js';
  import type { GenericStatus } from '../../src/generics/index.js';
  import type { StatusActionHandlers } from '../../src/components/Status/context.js';

  let { status, handlers = {} }: { status: GenericStatus; handlers?: StatusActionHandlers } = $props();

  createStatusContext(status, {}, handlers);
</script>

<StatusActions />
