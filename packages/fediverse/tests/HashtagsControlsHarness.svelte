<script lang="ts">
  import { setContext } from 'svelte';
  import HashtagControls from '../src/components/Hashtags/Controls.svelte';
  import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';

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
    hashtag = 'example',
    class: className,
  }: {
    adapter: LesserGraphQLAdapter;
    hashtag?: string;
    class?: string;
  } = $props();

  provideHashtagsContext(adapter);
</script>

<HashtagControls {hashtag} class={className} />
