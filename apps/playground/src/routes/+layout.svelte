<script lang="ts">
  import type { Snippet } from 'svelte';
  import '@equaltoai/greater-components-tokens/theme.css';
  import '@equaltoai/greater-components-primitives/styles.css';
  import '../app.css';

  let { children }: { children?: Snippet } = $props();
</script>

<main>
  {#if children}
    {@render children()}
  {/if}
</main>

<style>
  :global(html) {
    font-family: var(--gr-typography-fontFamily-sans);
  }

  :global(body) {
    margin: 0;
    padding: 0;
    background: var(--gr-semantic-background-primary);
    color: var(--gr-semantic-foreground-primary);
    line-height: var(--gr-typography-lineHeight-normal);
  }

  main {
    min-height: 100vh;
  }
</style>
