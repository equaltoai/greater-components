<script lang="ts">
  import { ThemeWorkbench, ColorHarmonyPicker, ContrastChecker } from '@equaltoai/greater-components-primitives';
  import { generateTheme } from '@equaltoai/greater-components-utils';
  
  let savedThemes = $state<any[]>([]);
  
  function handleSave(theme: any) {
    savedThemes = [...savedThemes, { ...theme, id: Date.now() }];
  }
</script>

<div class="example-container">
  <h1>Theme Customization</h1>
  <p>Create custom themes with color harmony and contrast checking.</p>
  
  <ThemeWorkbench 
    initialColor="#3b82f6" 
    onSave={handleSave}
  />
  
  {#if savedThemes.length > 0}
    <div class="saved-themes">
      <h2>Saved Themes</h2>
      {#each savedThemes as theme}
        <div class="theme-card">
          <div class="color-swatch" style="background: {theme.colors.primary[500]}"></div>
          <pre>{JSON.stringify(theme, null, 2)}</pre>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .example-container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .saved-themes {
    margin-top: 2rem;
  }
  
  .theme-card {
    border: 1px solid var(--gr-color-border);
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: var(--gr-radius-md);
  }
  
  .color-swatch {
    width: 50px;
    height: 50px;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
  
  pre {
    background: var(--gr-color-surface-subtle);
    padding: 1rem;
    overflow: auto;
    font-size: 0.8rem;
  }
</style>
