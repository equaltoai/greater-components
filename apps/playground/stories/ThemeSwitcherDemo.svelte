<script lang="ts">
  import { ThemeSwitcher, ThemeProvider } from '@greater/primitives';
  import type { ColorScheme } from '@greater/primitives';
  
  interface Props {
    showPreview?: boolean;
    showAdvanced?: boolean;
    class?: string;
    onThemeChange?: (theme: ColorScheme) => void;
  }
  
  let {
    showPreview = true,
    showAdvanced = false,
    class: className = '',
    onThemeChange
  }: Props = $props();
  
  let currentTheme = $state<ColorScheme>('auto');
  
  function handleThemeChange(theme: ColorScheme) {
    currentTheme = theme;
    onThemeChange?.(theme);
  }
</script>

<ThemeProvider>
  <div class="demo-container">
    <div class="demo-header">
      <h2>Theme Settings</h2>
      <p>Customize the appearance of your application</p>
      {#if currentTheme}
        <div class="current-theme">
          Current theme: <strong>{currentTheme}</strong>
        </div>
      {/if}
    </div>
    
    <ThemeSwitcher
      {showPreview}
      {showAdvanced}
      class={className}
      onThemeChange={handleThemeChange}
    />
    
    {#if showPreview}
      <div class="demo-preview">
        <h3>Additional Preview Elements</h3>
        
        <div class="preview-grid">
          <div class="preview-card">
            <h4>Typography</h4>
            <p class="text-large">Large text sample</p>
            <p>Regular text sample</p>
            <p class="text-small">Small text sample</p>
          </div>
          
          <div class="preview-card">
            <h4>Colors</h4>
            <div class="color-swatches">
              <div class="color-swatch primary">Primary</div>
              <div class="color-swatch secondary">Secondary</div>
              <div class="color-swatch accent">Accent</div>
            </div>
          </div>
          
          <div class="preview-card">
            <h4>Interactive Elements</h4>
            <div class="interactive-elements">
              <button class="demo-button">Button</button>
              <input type="text" placeholder="Text input" class="demo-input" />
              <label class="demo-checkbox">
                <input type="checkbox" checked />
                Checkbox
              </label>
            </div>
          </div>
          
          <div class="preview-card">
            <h4>Spacing & Density</h4>
            <div class="spacing-demo">
              <div class="spacing-box">Box 1</div>
              <div class="spacing-box">Box 2</div>
              <div class="spacing-box">Box 3</div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</ThemeProvider>

<style>
  .demo-container {
    padding: var(--gr-spacing-scale-4);
    background-color: var(--gr-semantic-background-primary);
    color: var(--gr-semantic-foreground-primary);
    font-family: var(--gr-typography-fontFamily-sans);
    min-height: 100vh;
  }
  
  .demo-header {
    margin-bottom: var(--gr-spacing-scale-6);
  }
  
  .demo-header h2 {
    margin: 0 0 var(--gr-spacing-scale-2) 0;
    font-size: calc(var(--gr-typography-fontSize-2xl) * var(--gr-font-scale, 1));
    font-weight: var(--gr-typography-fontWeight-bold);
  }
  
  .demo-header p {
    margin: 0 0 var(--gr-spacing-scale-4) 0;
    color: var(--gr-semantic-foreground-secondary);
    font-size: calc(var(--gr-typography-fontSize-base) * var(--gr-font-scale, 1));
  }
  
  .current-theme {
    padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
    background-color: var(--gr-semantic-background-secondary);
    border-radius: var(--gr-radii-md);
    display: inline-block;
    font-size: calc(var(--gr-typography-fontSize-sm) * var(--gr-font-scale, 1));
  }
  
  .demo-preview {
    margin-top: var(--gr-spacing-scale-8);
    padding-top: var(--gr-spacing-scale-8);
    border-top: 1px solid var(--gr-semantic-border-default);
  }
  
  .demo-preview h3 {
    margin: 0 0 var(--gr-spacing-scale-4) 0;
    font-size: calc(var(--gr-typography-fontSize-xl) * var(--gr-font-scale, 1));
    font-weight: var(--gr-typography-fontWeight-semibold);
  }
  
  .preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--gr-spacing-scale-4);
  }
  
  .preview-card {
    padding: var(--gr-spacing-scale-4);
    background-color: var(--gr-semantic-background-secondary);
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-lg);
  }
  
  .preview-card h4 {
    margin: 0 0 var(--gr-spacing-scale-3) 0;
    font-size: calc(var(--gr-typography-fontSize-base) * var(--gr-font-scale, 1));
    font-weight: var(--gr-typography-fontWeight-semibold);
  }
  
  .text-large {
    font-size: calc(var(--gr-typography-fontSize-lg) * var(--gr-font-scale, 1));
  }
  
  .text-small {
    font-size: calc(var(--gr-typography-fontSize-sm) * var(--gr-font-scale, 1));
  }
  
  .color-swatches {
    display: flex;
    gap: var(--gr-spacing-scale-2);
  }
  
  .color-swatch {
    flex: 1;
    padding: var(--gr-spacing-scale-3);
    text-align: center;
    border-radius: var(--gr-radii-md);
    font-size: calc(var(--gr-typography-fontSize-xs) * var(--gr-font-scale, 1));
    font-weight: var(--gr-typography-fontWeight-medium);
  }
  
  .color-swatch.primary {
    background-color: var(--gr-theme-primary, var(--gr-semantic-action-primary-default));
    color: white;
  }
  
  .color-swatch.secondary {
    background-color: var(--gr-theme-secondary, var(--gr-semantic-action-primary-hover));
    color: white;
  }
  
  .color-swatch.accent {
    background-color: var(--gr-theme-accent, var(--gr-semantic-action-primary-active));
    color: white;
  }
  
  .interactive-elements {
    display: flex;
    flex-direction: column;
    gap: var(--gr-spacing-scale-3);
  }
  
  .demo-button {
    padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
    background-color: var(--gr-semantic-action-primary-default);
    color: white;
    border: none;
    border-radius: var(--gr-radii-md);
    font-size: calc(var(--gr-typography-fontSize-base) * var(--gr-font-scale, 1));
    font-weight: var(--gr-typography-fontWeight-medium);
    cursor: pointer;
    transition: background-color var(--gr-motion-duration-fast) var(--gr-motion-easing-out);
  }
  
  .demo-button:hover {
    background-color: var(--gr-semantic-action-primary-hover);
  }
  
  .demo-input {
    padding: var(--gr-spacing-scale-2);
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-md);
    background-color: var(--gr-semantic-background-primary);
    color: var(--gr-semantic-foreground-primary);
    font-size: calc(var(--gr-typography-fontSize-base) * var(--gr-font-scale, 1));
  }
  
  .demo-checkbox {
    display: flex;
    align-items: center;
    gap: var(--gr-spacing-scale-2);
    font-size: calc(var(--gr-typography-fontSize-base) * var(--gr-font-scale, 1));
    cursor: pointer;
  }
  
  .spacing-demo {
    display: flex;
    gap: calc(var(--gr-spacing-scale-3) * var(--gr-density-scale, 1));
  }
  
  .spacing-box {
    flex: 1;
    padding: calc(var(--gr-spacing-scale-3) * var(--gr-density-scale, 1));
    background-color: var(--gr-semantic-background-tertiary);
    border-radius: var(--gr-radii-md);
    text-align: center;
    font-size: calc(var(--gr-typography-fontSize-sm) * var(--gr-font-scale, 1));
  }
  
  /* High contrast support */
  @media (prefers-contrast: high) {
    .preview-card,
    .demo-input,
    .spacing-box {
      border-width: 2px;
    }
    
    .demo-button:focus-visible,
    .demo-input:focus-visible {
      outline: 3px solid var(--gr-semantic-focus-ring);
      outline-offset: 2px;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .demo-button {
      transition: none;
    }
  }
</style>