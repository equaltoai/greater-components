import type { Meta, StoryObj } from '@storybook/svelte';
import { Avatar } from '@greater/primitives';
import AvatarDemo from './AvatarDemo.svelte';

const meta: Meta<Avatar> = {
  title: 'Primitives/Avatar',
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component: `
An accessible avatar component with image loading, initials fallback, and status indicators.

## Features

- **Image Loading**: Graceful fallback to initials or custom fallback
- **Initials Generation**: Automatic initials from name with consistent colors
- **Multiple Sizes**: xs, sm, md (default), lg, xl, 2xl
- **Shape Variants**: Circle (default), square, rounded
- **Status Indicators**: Online, offline, busy, away with customizable position
- **Loading State**: Animated spinner during image loading
- **Accessibility**: Proper ARIA labeling and semantic markup

## Usage

\`\`\`svelte
<script>
  import { Avatar } from '@greater/primitives';
</script>

<!-- With image -->
<Avatar 
  src="https://example.com/avatar.jpg"
  alt="User Avatar"
  name="John Doe"
  size="md"
  status="online"
/>

<!-- With initials fallback -->
<Avatar 
  name="Jane Smith"
  size="lg"
  shape="rounded"
  status="busy"
  statusPosition="top-right"
/>

<!-- Custom fallback -->
<Avatar size="xl">
  {#snippet fallback()}
    <CustomIcon />
  {/snippet}
</Avatar>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    src: {
      control: { type: 'text' }
    },
    name: {
      control: { type: 'text' }
    },
    alt: {
      control: { type: 'text' }
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
    },
    shape: {
      control: { type: 'select' },
      options: ['circle', 'square', 'rounded']
    },
    status: {
      control: { type: 'select' },
      options: [undefined, 'online', 'offline', 'busy', 'away']
    },
    statusPosition: {
      control: { type: 'select' },
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left']
    },
    loading: {
      control: { type: 'boolean' }
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<Avatar>;

export const Default: Story = {
  args: {
    name: 'John Doe',
    size: 'md'
  },
  render: (args) => ({
    Component: AvatarDemo,
    props: args
  })
};

export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    alt: 'Profile picture',
    name: 'John Doe',
    size: 'md'
  },
  render: (args) => ({
    Component: AvatarDemo,
    props: args
  })
};

export const WithInitials: Story = {
  args: {
    name: 'Jane Smith',
    size: 'md'
  },
  render: (args) => ({
    Component: AvatarDemo,
    props: args
  })
};

export const SmallSize: Story = {
  args: {
    name: 'Small Avatar',
    size: 'sm'
  },
  render: (args) => ({
    Component: AvatarDemo,
    props: args
  })
};

export const LargeSize: Story = {
  args: {
    name: 'Large Avatar',
    size: 'lg'
  },
  render: (args) => ({
    Component: AvatarDemo,
    props: args
  })
};

export const ExtraLargeSize: Story = {
  args: {
    name: 'Extra Large',
    size: 'xl'
  },
  render: (args) => ({
    Component: AvatarDemo,
    props: args
  })
};

export const CircleShape: Story = {
  args: {
    name: 'Circle Shape',
    shape: 'circle',
    size: 'lg'
  },
  render: (args) => ({
    Component: AvatarDemo,
    props: args
  })
};

export const SquareShape: Story = {
  args: {
    name: 'Square Shape',
    shape: 'square',
    size: 'lg'
  },
  render: (args) => ({
    Component: AvatarDemo,
    props: args
  })
};

export const RoundedShape: Story = {
  args: {
    name: 'Rounded Shape',
    shape: 'rounded',
    size: 'lg'
  },
  render: (args) => ({
    Component: AvatarDemo,
    props: args
  })
};

export const OnlineStatus: Story = {
  args: {
    name: 'Online User',
    status: 'online',
    size: 'lg'
  },
  render: (args) => ({
    Component: AvatarDemo,
    props: args
  })
};

export const BusyStatus: Story = {
  args: {
    name: 'Busy User',
    status: 'busy',
    size: 'lg'
  },
  render: (args) => ({
    Component: AvatarDemo,
    props: args
  })
};

export const AwayStatus: Story = {
  args: {
    name: 'Away User',
    status: 'away',
    size: 'lg'
  },
  render: (args) => ({
    Component: AvatarDemo,
    props: args
  })
};

export const OfflineStatus: Story = {
  args: {
    name: 'Offline User',
    status: 'offline',
    size: 'lg'
  },
  render: (args) => ({
    Component: AvatarDemo,
    props: args
  })
};

export const StatusPositionTopLeft: Story = {
  args: {
    name: 'Top Left Status',
    status: 'online',
    statusPosition: 'top-left',
    size: 'lg'
  },
  render: (args) => ({
    Component: AvatarDemo,
    props: args
  })
};

export const StatusPositionBottomLeft: Story = {
  args: {
    name: 'Bottom Left Status',
    status: 'busy',
    statusPosition: 'bottom-left',
    size: 'lg'
  },
  render: (args) => ({
    Component: AvatarDemo,
    props: args
  })
};

export const LoadingState: Story = {
  args: {
    name: 'Loading Avatar',
    loading: true,
    size: 'lg'
  },
  render: (args) => ({
    Component: AvatarDemo,
    props: args
  })
};

export const BrokenImage: Story = {
  args: {
    src: 'https://broken-url-that-will-fail.jpg',
    name: 'Broken Image',
    alt: 'Broken image fallback',
    size: 'lg'
  },
  render: (args) => ({
    Component: AvatarDemo,
    props: args
  })
};

export const NoNameFallback: Story = {
  args: {
    size: 'lg'
  },
  render: (args) => ({
    Component: AvatarDemo,
    props: args
  })
};

export const AllVariants: Story = {
  render: () => ({
    Component: AvatarDemo,
    props: {
      showAllVariants: true
    }
  })
};