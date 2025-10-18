<script lang="ts">
  import { setContext } from 'svelte';
  import HashtagsMutedList from '../src/components/Hashtags/MutedList.svelte';
  import type { LesserGraphQLAdapter } from '@greater/adapters';

  const HASHTAGS_CONTEXT_KEY = Symbol.for('hashtags-context');

  function provideHashtagsContext(adapter: LesserGraphQLAdapter) {
    const state = {
      loading: false,
      error: null as Error | null,
      refreshVersion: 0,
    };

    const context = {
      config: { adapter },
      state,
      updateState: (partial: Partial<typeof state>) => Object.assign(state, partial),
    };

    setContext(HASHTAGS_CONTEXT_KEY, context);
    return context;
  }

  let {
    adapter,
    class: className,
    refreshVersion = 0,
  }: {
    adapter: LesserGraphQLAdapter;
    class?: string;
    refreshVersion?: number;
  } = $props();

  const context = provideHashtagsContext(adapter);

  $effect(() => {
    context.updateState({ refreshVersion });
  });
</script>

<HashtagsMutedList class={className} />
