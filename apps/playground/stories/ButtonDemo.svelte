<script lang="ts">
  import { Button } from '@greater/primitives';
  
  let loadingStates = $state({
    solid: false,
    outline: false,
    ghost: false
  });

  function handleClick(variant: keyof typeof loadingStates) {
    loadingStates[variant] = true;
    setTimeout(() => {
      loadingStates[variant] = false;
    }, 2000);
  }
</script>

<div class="button-demo">
  <section class="demo-section">
    <h3>Variants</h3>
    <div class="button-grid">
      <Button variant="solid" onclick={() => handleClick('solid')} loading={loadingStates.solid}>
        Solid Button
      </Button>
      <Button variant="outline" onclick={() => handleClick('outline')} loading={loadingStates.outline}>
        Outline Button
      </Button>
      <Button variant="ghost" onclick={() => handleClick('ghost')} loading={loadingStates.ghost}>
        Ghost Button
      </Button>
    </div>
  </section>

  <section class="demo-section">
    <h3>Sizes</h3>
    <div class="button-grid">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  </section>

  <section class="demo-section">
    <h3>States</h3>
    <div class="button-grid">
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </div>
  </section>

  <section class="demo-section">
    <h3>With Icons (Prefix/Suffix)</h3>
    <div class="button-grid">
      <Button>
        {#snippet prefix()}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        {/snippet}
        Bookmark
      </Button>
      
      <Button variant="outline">
        Download
        {#snippet suffix()}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        {/snippet}
      </Button>
    </div>
  </section>

  <section class="demo-section">
    <h3>All Variants by Size</h3>
    <div class="size-comparison">
      {#each ['sm', 'md', 'lg'] as size (size)}
        <div class="size-group">
          <h4>{size.toUpperCase()}</h4>
          <div class="button-grid">
            <Button {size} variant="solid">Solid</Button>
            <Button {size} variant="outline">Outline</Button>
            <Button {size} variant="ghost">Ghost</Button>
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>

<style>
  .button-demo {
    padding: 2rem;
    font-family: var(--gr-typography-fontFamily-sans);
    background: var(--gr-semantic-background-primary);
    color: var(--gr-semantic-foreground-primary);
  }

  .demo-section {
    margin-bottom: 3rem;
  }

  .demo-section h3 {
    font-size: var(--gr-typography-fontSize-lg);
    font-weight: var(--gr-typography-fontWeight-semibold);
    margin-bottom: 1rem;
    color: var(--gr-semantic-foreground-primary);
  }

  .demo-section h4 {
    font-size: var(--gr-typography-fontSize-sm);
    font-weight: var(--gr-typography-fontWeight-medium);
    margin-bottom: 0.5rem;
    color: var(--gr-semantic-foreground-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .button-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
  }

  .size-comparison {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .size-group {
    padding: 1rem;
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-md);
    background: var(--gr-semantic-background-secondary);
  }
</style>