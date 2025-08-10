import type { Meta, StoryObj } from '@storybook/svelte';
import { Skeleton } from '@greater/primitives';
import SkeletonDemo from './SkeletonDemo.svelte';

const meta: Meta<Skeleton> = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  parameters: {
    docs: {
      description: {
        component: `
An accessible skeleton loading component with animated shimmer effects and reduced motion support.

## Features

- **Multiple Variants**: Text, circular, rectangular, rounded shapes
- **Animation Types**: Pulse (default), wave, or none
- **Customizable Dimensions**: Width and height can be specified
- **Reduced Motion**: Respects prefers-reduced-motion user preference
- **Loading State**: Can wrap content and show/hide based on loading prop
- **Accessibility**: Proper ARIA labeling for screen readers

## Usage

\`\`\`svelte
<script>
  import { Skeleton } from '@greater/primitives';
  let loading = true;
</script>

<!-- Text skeleton -->
<Skeleton variant="text" width="200px" />

<!-- Circular avatar skeleton -->
<Skeleton variant="circular" width="48px" />

<!-- Rectangular image skeleton -->
<Skeleton 
  variant="rectangular" 
  width="300px" 
  height="200px" 
  animation="wave"
/>

<!-- Wrap content with conditional loading -->
<Skeleton {loading}>
  <p>This content appears when loading is false</p>
</Skeleton>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['text', 'circular', 'rectangular', 'rounded']
    },
    animation: {
      control: { type: 'select' },
      options: ['pulse', 'wave', 'none']
    },
    width: {
      control: { type: 'text' }
    },
    height: {
      control: { type: 'text' }
    },
    loading: {
      control: { type: 'boolean' }
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<Skeleton>;

export const Default: Story = {
  args: {
    variant: 'text',
    width: '200px'
  },
  render: (args) => ({
    Component: SkeletonDemo,
    props: args
  })
};

export const Text: Story = {
  args: {
    variant: 'text',
    width: '100%',
    animation: 'pulse'
  },
  render: (args) => ({
    Component: SkeletonDemo,
    props: args
  })
};

export const Circular: Story = {
  args: {
    variant: 'circular',
    width: '48px'
  },
  render: (args) => ({
    Component: SkeletonDemo,
    props: args
  })
};

export const Rectangular: Story = {
  args: {
    variant: 'rectangular',
    width: '300px',
    height: '200px'
  },
  render: (args) => ({
    Component: SkeletonDemo,
    props: args
  })
};

export const Rounded: Story = {
  args: {
    variant: 'rounded',
    width: '250px',
    height: '150px'
  },
  render: (args) => ({
    Component: SkeletonDemo,
    props: args
  })
};

export const PulseAnimation: Story = {
  args: {
    variant: 'rectangular',
    width: '200px',
    height: '100px',
    animation: 'pulse'
  },
  render: (args) => ({
    Component: SkeletonDemo,
    props: args
  })
};

export const WaveAnimation: Story = {
  args: {
    variant: 'rectangular',
    width: '200px',
    height: '100px',
    animation: 'wave'
  },
  render: (args) => ({
    Component: SkeletonDemo,
    props: args
  })
};

export const NoAnimation: Story = {
  args: {
    variant: 'rectangular',
    width: '200px',
    height: '100px',
    animation: 'none'
  },
  render: (args) => ({
    Component: SkeletonDemo,
    props: args
  })
};

export const SmallSizes: Story = {
  args: {
    variant: 'circular',
    width: '24px'
  },
  render: (args) => ({
    Component: SkeletonDemo,
    props: args
  })
};

export const LargeSizes: Story = {
  args: {
    variant: 'rectangular',
    width: '400px',
    height: '300px'
  },
  render: (args) => ({
    Component: SkeletonDemo,
    props: args
  })
};

export const LoadingWrapper: Story = {
  args: {
    loading: true
  },
  render: (args) => ({
    Component: SkeletonDemo,
    props: {
      ...args,
      showLoadingWrapper: true
    }
  })
};

export const AllVariants: Story = {
  render: () => ({
    Component: SkeletonDemo,
    props: {
      showAllVariants: true
    }
  })
};