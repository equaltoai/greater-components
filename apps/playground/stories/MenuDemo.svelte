<script lang="ts">
  import { Menu } from '@greater/primitives';
  import { action } from '@storybook/addon-actions';
  
  type MenuItem = {
    id: string;
    label: string;
    disabled?: boolean;
    submenu?: MenuItem[];
    action?: () => void;
  };

  interface Props {
    orientation?: 'horizontal' | 'vertical';
    items?: MenuItem[];
    showAllVariants?: boolean;
  }

  const createMenuAction = (label: string) => action(`menu-demo/${label}`);
  const logSelection = action('menu-demo/select');

  let { orientation = 'vertical', items = [], showAllVariants = false }: Props = $props();

  const basicItems: MenuItem[] = [
    { id: '1', label: 'New File', action: createMenuAction('new-file') },
    { id: '2', label: 'Open File', action: createMenuAction('open-file') },
    { id: '3', label: 'Save', action: createMenuAction('save') },
    { id: '4', label: 'Save As...', action: createMenuAction('save-as') },
    { id: '5', label: 'Exit', action: createMenuAction('exit') }
  ];

  const horizontalItems: MenuItem[] = [
    { id: '1', label: 'File', submenu: [
      { id: '1-1', label: 'New', action: createMenuAction('file/new') },
      { id: '1-2', label: 'Open', action: createMenuAction('file/open') },
      { id: '1-3', label: 'Save', action: createMenuAction('file/save') }
    ]},
    { id: '2', label: 'Edit', submenu: [
      { id: '2-1', label: 'Cut', action: createMenuAction('edit/cut') },
      { id: '2-2', label: 'Copy', action: createMenuAction('edit/copy') },
      { id: '2-3', label: 'Paste', action: createMenuAction('edit/paste') }
    ]},
    { id: '3', label: 'View', submenu: [
      { id: '3-1', label: 'Zoom In', action: createMenuAction('view/zoom-in') },
      { id: '3-2', label: 'Zoom Out', action: createMenuAction('view/zoom-out') },
      { id: '3-3', label: 'Reset Zoom', action: createMenuAction('view/reset-zoom') }
    ]},
    { id: '4', label: 'Help', action: createMenuAction('help') }
  ];

  const disabledItems: MenuItem[] = [
    { id: '1', label: 'Available Action', action: createMenuAction('available') },
    { id: '2', label: 'Disabled Action', disabled: true, action: createMenuAction('disabled') },
    { id: '3', label: 'Another Available', action: createMenuAction('available-2') },
    { id: '4', label: 'Also Disabled', disabled: true, action: createMenuAction('disabled-2') }
  ];

  const contextMenuItems: MenuItem[] = [
    { id: 'context-cut', label: 'Cut', action: createMenuAction('context/cut') },
    { id: 'context-copy', label: 'Copy', action: createMenuAction('context/copy') },
    { id: 'context-paste', label: 'Paste', action: createMenuAction('context/paste') },
    { id: 'context-delete', label: 'Delete', action: createMenuAction('context/delete') }
  ];

  function handleItemSelect(item: MenuItem) {
    logSelection(item);
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
        <Menu orientation="vertical" items={contextMenuItems} onItemSelect={handleItemSelect}>
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
