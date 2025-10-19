import type { Meta, StoryObj } from '@storybook/svelte';
import { Button } from '@equaltoai/greater-components-primitives';
import ButtonDemo from './ButtonDemo.svelte';

const meta: Meta<Button> = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: `
A versatile button component with multiple variants, sizes, and states.

## Features

- **Variants**: solid (default), outline, ghost
- **Sizes**: sm, md (default), lg  
- **States**: normal, disabled, loading
- **Accessibility**: Full keyboard navigation, ARIA attributes, focus management
- **Customizable**: Prefix/suffix slots, custom styling

## Usage

\`\`\`svelte
<script>
  import { Button } from '@equaltoai/greater-components-primitives';
</script>

<Button variant="solid" size="md">
  Click me
</Button>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['solid', 'outline', 'ghost']
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg']
    },
    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset']
    },
    disabled: {
      control: { type: 'boolean' }
    },
    loading: {
      control: { type: 'boolean' }
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<Button>;

export const Solid: Story = {
  args: {
    variant: 'solid',
    children: 'Primary Action'
  }
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Secondary Action'
  }
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Tertiary Action'
  }
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button'
  }
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button'
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button'
  }
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading...'
  }
};

export const AllVariants: Story = {
  render: () => ({
    Component: ButtonDemo
  })
};