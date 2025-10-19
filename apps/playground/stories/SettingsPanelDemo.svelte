<script lang="ts">
  import { SettingsPanel } from '@equaltoai/greater-components-fediverse';
  import { ThemeProvider } from '@equaltoai/greater-components-primitives';
  
  interface Props {
    activeSection?: string;
    showHeader?: boolean;
    showCustomContent?: boolean;
    onSectionChange?: (section: string) => void;
  }
  
  let {
    activeSection = 'appearance',
    showHeader = true,
    showCustomContent = false,
    onSectionChange
  }: Props = $props();
  
  let currentSection = $state(activeSection);
  
  function handleSectionChange(section: string) {
    currentSection = section;
    onSectionChange?.(section);
  }
</script>

<ThemeProvider>
  <div class="demo-container">
    <SettingsPanel
      activeSection={currentSection}
      {showHeader}
      onSectionChange={handleSectionChange}
    >
      {#if showCustomContent}
        <div class="custom-content">
          <h3>Custom Application Settings</h3>
          <p>This is a custom content area where you can add application-specific settings.</p>
          
          <div class="custom-settings">
            <div class="custom-setting">
              <label>
                <input type="checkbox" checked />
                Enable experimental features
              </label>
              <p class="setting-description">
                Access new features before they're officially released
              </p>
            </div>
            
            <div class="custom-setting">
              <label>
                <input type="checkbox" />
                Developer mode
              </label>
              <p class="setting-description">
                Show additional debugging information and tools
              </p>
            </div>
            
            <div class="custom-setting">
              <label>
                Cache size limit
                <select>
                  <option>100 MB</option>
                  <option>250 MB</option>
                  <option>500 MB</option>
                  <option>1 GB</option>
                </select>
              </label>
              <p class="setting-description">
                Maximum size for offline content cache
              </p>
            </div>
          </div>
        </div>
      {/if}
    </SettingsPanel>
    
    {#if currentSection}
      <div class="demo-status">
        Current section: <strong>{currentSection}</strong>
      </div>
    {/if}
  </div>
</ThemeProvider>

<style>
  .demo-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--gr-semantic-background-primary);
    color: var(--gr-semantic-foreground-primary);
    font-family: var(--gr-typography-fontFamily-sans);
    position: relative;
  }
  
  .demo-status {
    position: fixed;
    bottom: var(--gr-spacing-scale-4);
    right: var(--gr-spacing-scale-4);
    padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
    background-color: var(--gr-semantic-background-secondary);
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-md);
    font-size: calc(var(--gr-typography-fontSize-sm) * var(--gr-font-scale, 1));
    box-shadow: var(--gr-shadows-lg);
    z-index: 100;
  }
  
  .custom-content {
    padding: var(--gr-spacing-scale-6);
    background-color: var(--gr-semantic-background-secondary);
    border-radius: var(--gr-radii-lg);
  }
  
  .custom-content h3 {
    margin: 0 0 var(--gr-spacing-scale-2) 0;
    font-size: calc(var(--gr-typography-fontSize-lg) * var(--gr-font-scale, 1));
    font-weight: var(--gr-typography-fontWeight-semibold);
    color: var(--gr-semantic-foreground-primary);
  }
  
  .custom-content > p {
    margin: 0 0 var(--gr-spacing-scale-4) 0;
    color: var(--gr-semantic-foreground-secondary);
    font-size: calc(var(--gr-typography-fontSize-base) * var(--gr-font-scale, 1));
  }
  
  .custom-settings {
    display: flex;
    flex-direction: column;
    gap: var(--gr-spacing-scale-4);
  }
  
  .custom-setting {
    padding: var(--gr-spacing-scale-3);
    background-color: var(--gr-semantic-background-primary);
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-md);
  }
  
  .custom-setting label {
    display: flex;
    align-items: center;
    gap: var(--gr-spacing-scale-2);
    font-size: calc(var(--gr-typography-fontSize-base) * var(--gr-font-scale, 1));
    font-weight: var(--gr-typography-fontWeight-medium);
    color: var(--gr-semantic-foreground-primary);
    cursor: pointer;
  }
  
  .custom-setting select {
    margin-left: auto;
    padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-sm);
    background-color: var(--gr-semantic-background-primary);
    color: var(--gr-semantic-foreground-primary);
    font-size: calc(var(--gr-typography-fontSize-sm) * var(--gr-font-scale, 1));
  }
  
  .setting-description {
    margin: var(--gr-spacing-scale-2) 0 0 var(--gr-spacing-scale-6);
    font-size: calc(var(--gr-typography-fontSize-sm) * var(--gr-font-scale, 1));
    color: var(--gr-semantic-foreground-tertiary);
  }
  
  /* High contrast support */
  @media (prefers-contrast: high) {
    .custom-setting {
      border-width: 2px;
    }
    
    .custom-setting input[type="checkbox"]:focus-visible,
    .custom-setting select:focus-visible {
      outline: 3px solid var(--gr-semantic-focus-ring);
      outline-offset: 2px;
    }
  }
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    .demo-status {
      bottom: var(--gr-spacing-scale-2);
      right: var(--gr-spacing-scale-2);
      left: var(--gr-spacing-scale-2);
      text-align: center;
    }
  }
</style>