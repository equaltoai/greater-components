import type { Meta, StoryObj } from '@storybook/svelte';
import { Tooltip } from '@equaltoai/greater-components-primitives';
import TooltipDemo from './TooltipDemo.svelte';

const meta: Meta<Tooltip> = {
  title: 'Primitives/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component: `
An accessible tooltip component with smart positioning and multiple trigger modes.

## Features

- **Multiple Triggers**: Hover (default), focus, click, manual control
- **Smart Positioning**: Auto-adjusts placement to stay within viewport
- **Placement Options**: Top, bottom, left, right, or auto
- **Customizable Delays**: Independent show/hide delays
- **Touch Support**: Long-press activation on mobile devices
- **Accessibility**: Proper ARIA labeling and keyboard support
- **Responsive**: Automatically repositions on scroll/resize

## Usage

\`\`\`svelte
<script>
  import { Tooltip } from '@equaltoai/greater-components-primitives';
</script>

<Tooltip content="This is helpful information">
  <button>Hover me</button>
</Tooltip>

<!-- With custom trigger and placement -->
<Tooltip 
  content="Click to toggle this tooltip"
  trigger="click"
  placement="bottom"
  delay={{ show: 0, hide: 200 }}
>
  <button>Click me</button>
</Tooltip>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    content: {
      control: { type: 'text' }
    },
    placement: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right', 'auto']
    },
    trigger: {
      control: { type: 'select' },
      options: ['hover', 'focus', 'click', 'manual']
    },
    delay: {
      control: { type: 'object' }
    },
    disabled: {
      control: { type: 'boolean' }
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<Tooltip>;

export const Default: Story = {
  args: {
    content: 'This is a helpful tooltip'
  },
  render: (args) => ({
    Component: TooltipDemo,
    props: args
  })
};

export const Top: Story = {
  args: {
    content: 'Tooltip positioned on top',
    placement: 'top'
  },
  render: (args) => ({
    Component: TooltipDemo,
    props: args
  })
};

export const Bottom: Story = {
  args: {
    content: 'Tooltip positioned at bottom',
    placement: 'bottom'
  },
  render: (args) => ({
    Component: TooltipDemo,
    props: args
  })
};

export const Left: Story = {
  args: {
    content: 'Tooltip positioned on left side',
    placement: 'left'
  },
  render: (args) => ({
    Component: TooltipDemo,
    props: args
  })
};

export const Right: Story = {
  args: {
    content: 'Tooltip positioned on right side',
    placement: 'right'
  },
  render: (args) => ({
    Component: TooltipDemo,
    props: args
  })
};

export const AutoPlacement: Story = {
  args: {
    content: 'Smart placement - I will position myself to stay in viewport',
    placement: 'auto'
  },
  render: (args) => ({
    Component: TooltipDemo,
    props: args
  })
};

export const HoverTrigger: Story = {
  args: {
    content: 'Appears on hover and focus',
    trigger: 'hover',
    delay: { show: 500, hide: 100 }
  },
  render: (args) => ({
    Component: TooltipDemo,
    props: args
  })
};

export const ClickTrigger: Story = {
  args: {
    content: 'Click to toggle this tooltip',
    trigger: 'click',
    delay: 0
  },
  render: (args) => ({
    Component: TooltipDemo,
    props: args
  })
};

export const FocusTrigger: Story = {
  args: {
    content: 'Appears when element receives focus',
    trigger: 'focus',
    delay: { show: 0, hide: 200 }
  },
  render: (args) => ({
    Component: TooltipDemo,
    props: args
  })
};

export const CustomDelay: Story = {
  args: {
    content: 'Custom timing - fast show, slow hide',
    delay: { show: 100, hide: 1000 }
  },
  render: (args) => ({
    Component: TooltipDemo,
    props: args
  })
};

export const Disabled: Story = {
  args: {
    content: 'This tooltip is disabled',
    disabled: true
  },
  render: (args) => ({
    Component: TooltipDemo,
    props: args
  })
};

export const LongContent: Story = {
  args: {
    content: 'This is a much longer tooltip with multiple lines of text that demonstrates how the tooltip handles wrapping and sizing when there is more content to display.'
  },
  render: (args) => ({
    Component: TooltipDemo,
    props: args
  })
};

export const AllVariants: Story = {
  render: () => ({
    Component: TooltipDemo,
    props: {
      showAllVariants: true
    }
  })
};