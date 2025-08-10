<script lang="ts">
  import { Menu } from '@greater/primitives';
  
  interface Props {
    orientation?: 'horizontal' | 'vertical';
    items?: Array<{
      id: string;
      label: string;
      disabled?: boolean;
      submenu?: Array<{ id: string; label: string; disabled?: boolean; action?: () => void }>;
      action?: () => void;
    }>;
    showAllVariants?: boolean;
  }

  let { orientation = 'vertical', items = [], showAllVariants = false }: Props = $props();

  const basicItems = [
    { id: '1', label: 'New File', action: () => console.log('New file') },
    { id: '2', label: 'Open File', action: () => console.log('Open file') },
    { id: '3', label: 'Save', action: () => console.log('Save') },
    { id: '4', label: 'Save As...', action: () => console.log('Save as') },
    { id: '5', label: 'Exit', action: () => console.log('Exit') }
  ];

  const horizontalItems = [
    { id: '1', label: 'File', submenu: [
      { id: '1-1', label: 'New', action: () => console.log('New') },
      { id: '1-2', label: 'Open', action: () => console.log('Open') },
      { id: '1-3', label: 'Save', action: () => console.log('Save') }
    ]},
    { id: '2', label: 'Edit', submenu: [
      { id: '2-1', label: 'Cut', action: () => console.log('Cut') },
      { id: '2-2', label: 'Copy', action: () => console.log('Copy') },
      { id: '2-3', label: 'Paste', action: () => console.log('Paste') }
    ]},
    { id: '3', label: 'View', submenu: [
      { id: '3-1', label: 'Zoom In', action: () => console.log('Zoom In') },
      { id: '3-2', label: 'Zoom Out', action: () => console.log('Zoom Out') },
      { id: '3-3', label: 'Reset Zoom', action: () => console.log('Reset Zoom') }
    ]},
    { id: '4', label: 'Help', action: () => console.log('Help') }
  ];

  const disabledItems = [
    { id: '1', label: 'Available Action', action: () => console.log('Available') },
    { id: '2', label: 'Disabled Action', disabled: true, action: () => console.log('Should not trigger') },
    { id: '3', label: 'Another Available', action: () => console.log('Another available') },
    { id: '4', label: 'Also Disabled', disabled: true, action: () => console.log('Should not trigger') }
  ];

  function handleItemSelect(item: any) {
    console.log('Item selected:', item);
  }
</script>

{#if showAllVariants}
  <div class="demo-container">
    <div class="demo-section">
      <h3>Vertical Menu</h3>
      <Menu
        orientation="vertical"
        items={basicItems}
        onItemSelect={handleItemSelect}
      >
        {#snippet trigger({ open, toggle })}
          <button class="demo-button" onclick={toggle}>
            File Menu {open ? '↑' : '↓'}
          </button>
        {/snippet}
      </Menu>
    </div>

    <div class="demo-section">
      <h3>Horizontal Menu Bar</h3>
      <Menu
        orientation="horizontal"
        items={horizontalItems}
        onItemSelect={handleItemSelect}
      >
        {#snippet trigger({ open, toggle })}
          <button class="demo-button" onclick={toggle}>
            Menu Bar {open ? '↑' : '↓'}
          </button>
        {/snippet}
      </Menu>
    </div>

    <div class="demo-section">
      <h3>Menu with Disabled Items</h3>
      <Menu
        orientation="vertical"
        items={disabledItems}
        onItemSelect={handleItemSelect}
      >
        {#snippet trigger({ open, toggle })}
          <button class="demo-button" onclick={toggle}>
            Mixed States {open ? '↑' : '↓'}
          </button>
        {/snippet}
      </Menu>
    </div>

    <div class="demo-section">
      <h3>Context Menu Style</h3>
      <div class="context-area">
        Right-click here for context menu
        <Menu
          orientation="vertical"
          items={[
            { id: '1', label: 'Cut', action: () => console.log('Cut') },
            { id: '2', label: 'Copy', action: () => console.log('Copy') },
            { id: '3', label: 'Paste', action: () => console.log('Paste') },
            { id: '4', label: 'Delete', action: () => console.log('Delete') }
          ]}
          onItemSelect={handleItemSelect}
        >
          {#snippet trigger({ open, toggle })}
            <button class="demo-button context-button" onclick={toggle}>
              Context Menu {open ? '↑' : '↓'}
            </button>
          {/snippet}
        </Menu>
      </div>
    </div>
  </div>
{:else}
  <div class="demo-single">
    <Menu
      {orientation}
      items={items.length > 0 ? items : basicItems}
      onItemSelect={handleItemSelect}
    >
      {#snippet trigger({ open, toggle })}
        <button class="demo-button" onclick={toggle}>
          {orientation === 'horizontal' ? 'Menu Bar' : 'Dropdown Menu'} {open ? '↑' : '↓'}
        </button>
      {/snippet}
    </Menu>
  </div>
{/if}

<style>
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 800px;
  }

  .demo-section {
    padding: 1rem;
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-md);
  }

  .demo-section h3 {
    margin: 0 0 1rem 0;
    color: var(--gr-semantic-foreground-primary);
    font-size: var(--gr-typography-fontSize-lg);
    font-weight: var(--gr-typography-fontWeight-semibold);
  }

  .demo-single {
    padding: 1rem;
  }

  .demo-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--gr-spacing-scale-2);
    padding: var(--gr-spacing-scale-3) var(--gr-spacing-scale-4);
    font-family: var(--gr-typography-fontFamily-sans);
    font-size: var(--gr-typography-fontSize-sm);
    font-weight: var(--gr-typography-fontWeight-medium);
    color: var(--gr-semantic-foreground-primary);
    background-color: var(--gr-semantic-background-primary);
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-md);
    cursor: pointer;
    transition-property: background-color, border-color, box-shadow;
    transition-duration: var(--gr-motion-duration-fast);
    transition-timing-function: var(--gr-motion-easing-out);
  }

  .demo-button:hover {
    background-color: var(--gr-semantic-background-secondary);
    border-color: var(--gr-semantic-border-strong);
  }

  .demo-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--gr-semantic-focus-ring);
  }

  .context-area {
    position: relative;
    padding: 2rem;
    background-color: var(--gr-semantic-background-secondary);
    border-radius: var(--gr-radii-md);
    text-align: center;
    color: var(--gr-semantic-foreground-secondary);
  }

  .context-button {
    margin-top: 1rem;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .demo-button {
      transition-duration: 0ms;
    }
  }
</style>