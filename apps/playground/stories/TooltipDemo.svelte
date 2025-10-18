<script lang="ts">
  import { Tooltip } from '@greater/primitives';

  interface Props {
    content?: string;
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
    trigger?: 'hover' | 'focus' | 'click' | 'manual';
    delay?: { show?: number; hide?: number } | number;
    disabled?: boolean;
    showAllVariants?: boolean;
  }

  let {
    content = 'This is a helpful tooltip',
    placement = 'top',
    trigger = 'hover',
    delay = { show: 500, hide: 100 },
    disabled = false,
    showAllVariants = false
  }: Props = $props();
</script>

{#if showAllVariants}
  <div class="demo-container">
    <div class="demo-section">
      <h3>Placement Options</h3>
      <div class="placement-grid">
        <div class="placement-item">
          <Tooltip content="Tooltip on top" placement="top">
            <button class="demo-button">Top</button>
          </Tooltip>
        </div>
        
        <div class="placement-item">
          <Tooltip content="Tooltip on right" placement="right">
            <button class="demo-button">Right</button>
          </Tooltip>
        </div>
        
        <div class="placement-item">
          <Tooltip content="Tooltip on bottom" placement="bottom">
            <button class="demo-button">Bottom</button>
          </Tooltip>
        </div>
        
        <div class="placement-item">
          <Tooltip content="Tooltip on left" placement="left">
            <button class="demo-button">Left</button>
          </Tooltip>
        </div>

        <div class="placement-item">
          <Tooltip content="Smart placement - I position myself optimally!" placement="auto">
            <button class="demo-button">Auto</button>
          </Tooltip>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>Trigger Types</h3>
      <div class="trigger-grid">
        <div class="trigger-item">
          <Tooltip content="Appears on hover" trigger="hover">
            <button class="demo-button">Hover</button>
          </Tooltip>
        </div>
        
        <div class="trigger-item">
          <Tooltip content="Appears on focus" trigger="focus">
            <button class="demo-button">Focus</button>
          </Tooltip>
        </div>
        
        <div class="trigger-item">
          <Tooltip content="Click to toggle" trigger="click">
            <button class="demo-button">Click</button>
          </Tooltip>
        </div>
        
        <div class="trigger-item">
          <Tooltip content="I'm disabled" disabled={true}>
            <button class="demo-button" disabled>Disabled</button>
          </Tooltip>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>Different Content Types</h3>
      <div class="content-grid">
        <div class="content-item">
          <Tooltip content="Short">
            <span class="demo-text">Short</span>
          </Tooltip>
        </div>
        
        <div class="content-item">
          <Tooltip content="This is a longer tooltip that demonstrates text wrapping and multi-line content handling.">
            <span class="demo-text">Long Text</span>
          </Tooltip>
        </div>
        
        <div class="content-item">
          <Tooltip content="Line 1&#10;Line 2&#10;Line 3">
            <span class="demo-text">Multi-line</span>
          </Tooltip>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>Different Elements</h3>
      <div class="element-grid">
        <div class="element-item">
          <Tooltip content="Tooltip on button">
            <button class="demo-button">Button</button>
          </Tooltip>
        </div>
        
        <div class="element-item">
          <Tooltip content="Tooltip on link">
            <a href="https://example.com" class="demo-link" rel="noreferrer" target="_blank">Link</a>
          </Tooltip>
        </div>
        
        <div class="element-item">
          <Tooltip content="Tooltip on input">
            <input type="text" placeholder="Input field" class="demo-input" />
          </Tooltip>
        </div>
        
        <div class="element-item">
          <Tooltip content="Tooltip on icon">
            <div class="demo-icon" role="img" aria-label="Info">ℹ️</div>
          </Tooltip>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>Custom Timing</h3>
      <div class="timing-grid">
        <div class="timing-item">
          <Tooltip content="Fast show (100ms)" delay={{ show: 100, hide: 100 }}>
            <button class="demo-button">Fast</button>
          </Tooltip>
        </div>
        
        <div class="timing-item">
          <Tooltip content="Default timing" delay={{ show: 500, hide: 100 }}>
            <button class="demo-button">Default</button>
          </Tooltip>
        </div>
        
        <div class="timing-item">
          <Tooltip content="Slow show (1s)" delay={{ show: 1000, hide: 100 }}>
            <button class="demo-button">Slow</button>
          </Tooltip>
        </div>
        
        <div class="timing-item">
          <Tooltip content="No delay" delay={0}>
            <button class="demo-button">Instant</button>
          </Tooltip>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="demo-single">
    <Tooltip {content} {placement} {trigger} {delay} {disabled}>
      <button class="demo-button">
        {trigger === 'hover' ? 'Hover me' : trigger === 'click' ? 'Click me' : trigger === 'focus' ? 'Focus me' : 'Tooltip trigger'}
      </button>
    </Tooltip>
  </div>
{/if}

<style>
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 800px;
    padding: 2rem;
  }

  .demo-section {
    padding: 1.5rem;
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-lg);
    background-color: var(--gr-semantic-background-primary);
  }

  .demo-section h3 {
    margin: 0 0 1rem 0;
    color: var(--gr-semantic-foreground-primary);
    font-size: var(--gr-typography-fontSize-lg);
    font-weight: var(--gr-typography-fontWeight-semibold);
  }

  .demo-single {
    padding: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }

  .placement-grid,
  .trigger-grid,
  .content-grid,
  .element-grid,
  .timing-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
  }

  .placement-item,
  .trigger-item,
  .content-item,
  .element-item,
  .timing-item {
    flex: 1;
    min-width: 120px;
    display: flex;
    justify-content: center;
  }

  .demo-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--gr-spacing-scale-3) var(--gr-spacing-scale-4);
    font-family: var(--gr-typography-fontFamily-sans);
    font-size: var(--gr-typography-fontSize-sm);
    font-weight: var(--gr-typography-fontWeight-medium);
    color: var(--gr-semantic-foreground-primary);
    background-color: var(--gr-semantic-action-primary-default);
    color: var(--gr-color-base-white);
    border: none;
    border-radius: var(--gr-radii-md);
    cursor: pointer;
    transition-property: background-color, transform;
    transition-duration: var(--gr-motion-duration-fast);
    transition-timing-function: var(--gr-motion-easing-out);
    min-width: 100px;
  }

  .demo-button:hover:not(:disabled) {
    background-color: var(--gr-semantic-action-primary-hover);
  }

  .demo-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--gr-semantic-focus-ring);
  }

  .demo-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--gr-semantic-action-primary-disabled);
  }

  .demo-text {
    display: inline-block;
    padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
    color: var(--gr-semantic-foreground-primary);
    background-color: var(--gr-semantic-background-secondary);
    border-radius: var(--gr-radii-sm);
    font-size: var(--gr-typography-fontSize-sm);
    cursor: help;
    border: 1px dashed var(--gr-semantic-border-default);
  }

  .demo-link {
    color: var(--gr-semantic-action-primary-default);
    text-decoration: underline;
    font-weight: var(--gr-typography-fontWeight-medium);
    cursor: pointer;
  }

  .demo-link:hover {
    color: var(--gr-semantic-action-primary-hover);
  }

  .demo-input {
    padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
    font-family: var(--gr-typography-fontFamily-sans);
    font-size: var(--gr-typography-fontSize-sm);
    color: var(--gr-semantic-foreground-primary);
    background-color: var(--gr-semantic-background-primary);
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-md);
    width: 120px;
  }

  .demo-input:focus {
    outline: none;
    border-color: var(--gr-semantic-action-primary-default);
    box-shadow: 0 0 0 2px var(--gr-semantic-focus-ring);
  }

  .demo-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-size: 1.2em;
    background-color: var(--gr-semantic-background-secondary);
    border-radius: 50%;
    cursor: help;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .demo-button {
      transition-duration: 0ms;
    }
  }
</style>
