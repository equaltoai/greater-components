import type { Meta, StoryObj } from '@storybook/svelte';
import { Tabs } from '@equaltoai/greater-components-primitives';
import TabsDemo from './TabsDemo.svelte';

const meta: Meta<Tabs> = {
  title: 'Primitives/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: `
An accessible tabs component with keyboard navigation and multiple visual styles.

## Features

- **Keyboard Navigation**: Arrow keys, Home/End for tab navigation  
- **Activation Modes**: Automatic (select on focus) or manual (select on Enter/Space)
- **Orientations**: Horizontal (default) or vertical layouts
- **Visual Variants**: Default, pills, or underline styles
- **Accessibility**: Full ARIA tablist/tab/tabpanel semantics
- **Disabled State**: Support for disabled individual tabs

## Usage

\`\`\`svelte
<script>
  import { Tabs } from '@equaltoai/greater-components-primitives';
  
  const tabs = [
    { 
      id: 'tab1', 
      label: 'Tab 1',
      content: () => \`<p>Content for tab 1</p>\`
    },
    { 
      id: 'tab2', 
      label: 'Tab 2',
      content: () => \`<p>Content for tab 2</p>\`
    },
    { 
      id: 'tab3', 
      label: 'Disabled Tab',
      disabled: true,
      content: () => \`<p>This tab is disabled</p>\`
    }
  ];
</script>

<Tabs 
  {tabs} 
  activeTab="tab1"
  onTabChange={(tabId) => console.log('Active tab:', tabId)}
/>
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
    activation: {
      control: { type: 'select' },
      options: ['automatic', 'manual']
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'pills', 'underline']
    },
    activeTab: {
      control: { type: 'text' }
    },
    tabs: {
      control: { type: 'object' }
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<Tabs>;

const basicTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'support', label: 'Support' }
];

const tabsWithContent = [
  { 
    id: 'profile', 
    label: 'Profile',
    content: true
  },
  { 
    id: 'settings', 
    label: 'Settings',
    content: true
  },
  { 
    id: 'notifications', 
    label: 'Notifications',
    content: true
  }
];

const tabsWithDisabled = [
  { id: 'enabled1', label: 'Enabled' },
  { id: 'disabled1', label: 'Disabled', disabled: true },
  { id: 'enabled2', label: 'Also Enabled' },
  { id: 'disabled2', label: 'Also Disabled', disabled: true }
];

export const Default: Story = {
  args: {
    tabs: basicTabs,
    activeTab: 'overview',
    orientation: 'horizontal',
    variant: 'default'
  },
  render: (args) => ({
    Component: TabsDemo,
    props: args
  })
};

export const Horizontal: Story = {
  args: {
    tabs: tabsWithContent,
    activeTab: 'profile',
    orientation: 'horizontal',
    variant: 'default'
  },
  render: (args) => ({
    Component: TabsDemo,
    props: args
  })
};

export const Vertical: Story = {
  args: {
    tabs: tabsWithContent,
    activeTab: 'profile',
    orientation: 'vertical',
    variant: 'default'
  },
  render: (args) => ({
    Component: TabsDemo,
    props: args
  })
};

export const Pills: Story = {
  args: {
    tabs: basicTabs,
    activeTab: 'overview',
    variant: 'pills'
  },
  render: (args) => ({
    Component: TabsDemo,
    props: args
  })
};

export const Underline: Story = {
  args: {
    tabs: basicTabs,
    activeTab: 'overview',
    variant: 'underline'
  },
  render: (args) => ({
    Component: TabsDemo,
    props: args
  })
};

export const AutomaticActivation: Story = {
  args: {
    tabs: tabsWithContent,
    activeTab: 'profile',
    activation: 'automatic'
  },
  render: (args) => ({
    Component: TabsDemo,
    props: args
  })
};

export const ManualActivation: Story = {
  args: {
    tabs: tabsWithContent,
    activeTab: 'profile',
    activation: 'manual'
  },
  render: (args) => ({
    Component: TabsDemo,
    props: args
  })
};

export const WithDisabledTabs: Story = {
  args: {
    tabs: tabsWithDisabled,
    activeTab: 'enabled1'
  },
  render: (args) => ({
    Component: TabsDemo,
    props: args
  })
};

export const AllVariants: Story = {
  render: () => ({
    Component: TabsDemo,
    props: {
      showAllVariants: true
    }
  })
};