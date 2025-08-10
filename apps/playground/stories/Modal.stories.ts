import type { Meta, StoryObj } from '@storybook/svelte';
import { Modal } from '@greater/primitives';
import ModalDemo from './ModalDemo.svelte';

const meta: Meta<Modal> = {
  title: 'Primitives/Modal',
  component: Modal,
  parameters: {
    docs: {
      description: {
        component: `
A fully accessible modal dialog component with focus management and keyboard navigation.

## Features

- **Focus Management**: Automatic focus trapping and restoration
- **Keyboard Navigation**: Escape to close, Tab to cycle through focusable elements
- **Scroll Lock**: Prevents body scrolling when modal is open
- **Backdrop**: Click outside to close (configurable)
- **Sizes**: sm, md (default), lg, xl, full
- **Accessibility**: ARIA attributes, screen reader support

## Usage

\`\`\`svelte
<script>
  import { Modal, Button } from '@greater/primitives';
  let open = false;
</script>

<Button onclick={() => open = true}>Open Modal</Button>

<Modal bind:open title="Dialog Title">
  <p>Modal content goes here...</p>
  
  {#snippet footer()}
    <Button onclick={() => open = false}>Close</Button>
  {/snippet}
</Modal>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    open: {
      control: { type: 'boolean' }
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', 'full']
    },
    closeOnEscape: {
      control: { type: 'boolean' }
    },
    closeOnBackdrop: {
      control: { type: 'boolean' }
    },
    preventScroll: {
      control: { type: 'boolean' }
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<Modal>;

export const Basic: Story = {
  render: () => ({
    Component: ModalDemo,
    props: { variant: 'basic' }
  })
};

export const WithForm: Story = {
  render: () => ({
    Component: ModalDemo,
    props: { variant: 'form' }
  })
};

export const Confirmation: Story = {
  render: () => ({
    Component: ModalDemo,
    props: { variant: 'confirmation' }
  })
};

export const LongContent: Story = {
  render: () => ({
    Component: ModalDemo,
    props: { variant: 'long' }
  })
};

export const Sizes: Story = {
  render: () => ({
    Component: ModalDemo,
    props: { variant: 'sizes' }
  })
};

export const CustomHeader: Story = {
  render: () => ({
    Component: ModalDemo,
    props: { variant: 'custom' }
  })
};