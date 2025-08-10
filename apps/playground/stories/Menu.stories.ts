import type { Meta, StoryObj } from '@storybook/svelte';
import { Menu } from '@greater/primitives';
import MenuDemo from './MenuDemo.svelte';

const meta: Meta<Menu> = {
  title: 'Primitives/Menu',
  component: Menu,
  parameters: {
    docs: {
      description: {
        component: `
A accessible menu component with keyboard navigation and typeahead support.

## Features

- **Keyboard Navigation**: Arrow keys, Home/End, Enter/Space
- **Typeahead**: Type to search for menu items
- **Submenus**: Nested menu support with arrow key navigation
- **Orientation**: Horizontal (menubar) or vertical (dropdown) layouts
- **Accessibility**: Full ARIA support with menubar/menu/menuitem semantics
- **Click Outside**: Automatically closes when clicking outside

## Usage

\`\`\`svelte
<script>
  import { Menu } from '@greater/primitives';
  
  const items = [
    { id: '1', label: 'New File', action: () => console.log('New file') },
    { id: '2', label: 'Open', action: () => console.log('Open') },
    { 
      id: '3', 
      label: 'Recent', 
      submenu: [
        { id: '3-1', label: 'Project 1', action: () => console.log('Project 1') },
        { id: '3-2', label: 'Project 2', action: () => console.log('Project 2') }
      ]
    },
    { id: '4', label: 'Save', disabled: true }
  ];
</script>

<Menu {items} onItemSelect={(item) => console.log('Selected:', item)}>
  {#snippet trigger({ open, toggle })}
    <button onclick={toggle}>
      Menu {open ? '↑' : '↓'}
    </button>
  {/snippet}
</Menu>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical']
    },
    items: {
      control: { type: 'object' }
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<Menu>;

const basicItems = [
  { id: '1', label: 'New File', action: () => console.log('New file') },
  { id: '2', label: 'Open File', action: () => console.log('Open file') },
  { id: '3', label: 'Save', action: () => console.log('Save') },
  { id: '4', label: 'Save As...', action: () => console.log('Save as') },
  { id: 'divider', label: '---', disabled: true },
  { id: '5', label: 'Exit', action: () => console.log('Exit') }
];

const itemsWithSubmenus = [
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

const itemsWithDisabled = [
  { id: '1', label: 'Available Action', action: () => console.log('Available') },
  { id: '2', label: 'Disabled Action', disabled: true, action: () => console.log('Should not trigger') },
  { id: '3', label: 'Another Available', action: () => console.log('Another available') },
  { id: '4', label: 'Also Disabled', disabled: true, action: () => console.log('Should not trigger') }
];

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    items: basicItems
  },
  render: (args) => ({
    Component: MenuDemo,
    props: args
  })
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    items: itemsWithSubmenus
  },
  render: (args) => ({
    Component: MenuDemo,
    props: args
  })
};

export const WithSubmenus: Story = {
  args: {
    orientation: 'vertical',
    items: itemsWithSubmenus
  },
  render: (args) => ({
    Component: MenuDemo,
    props: args
  })
};

export const WithDisabledItems: Story = {
  args: {
    orientation: 'vertical',
    items: itemsWithDisabled
  },
  render: (args) => ({
    Component: MenuDemo,
    props: args
  })
};

export const AllVariants: Story = {
  render: () => ({
    Component: MenuDemo,
    props: {
      showAllVariants: true
    }
  })
};