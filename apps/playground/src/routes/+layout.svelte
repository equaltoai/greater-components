<script lang="ts">
  import '@greater/tokens/theme.css';
  import '@greater/primitives/styles.css';
  import '../app.css';
</script>

<main>
  <slot />
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