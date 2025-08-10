import type { Meta, StoryObj } from '@storybook/svelte';
import ProfilePageExample from './ProfilePageExample.svelte';

const meta = {
  title: 'Examples/Profile Page',
  component: ProfilePageExample,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete profile page with header, timeline, follow/unfollow actions, and edit capabilities.'
      }
    }
  },
  argTypes: {
    useMockData: {
      control: 'boolean',
      description: 'Toggle between mock data and real Mastodon API'
    },
    profileId: {
      control: 'text',
      description: 'Profile ID to display'
    },
    isOwnProfile: {
      control: 'boolean',
      description: 'Whether this is the logged-in user\'s profile'
    },
    showTimeline: {
      control: 'boolean',
      description: 'Show user timeline below profile header'
    },
    showStats: {
      control: 'boolean',
      description: 'Show detailed statistics'
    },
    enableEditing: {
      control: 'boolean',
      description: 'Enable profile editing (for own profile)'
    },
    showRelationships: {
      control: 'boolean',
      description: 'Show followers/following lists'
    }
  }
} satisfies Meta<ProfilePageExample>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default profile view
export const DefaultProfile: Story = {
  args: {
    useMockData: true,
    profileId: 'user123',
    isOwnProfile: false,
    showTimeline: true,
    showStats: true,
    enableEditing: false,
    showRelationships: true
  }
};

// Own profile with editing
export const OwnProfile: Story = {
  args: {
    useMockData: true,
    profileId: 'self',
    isOwnProfile: true,
    showTimeline: true,
    showStats: true,
    enableEditing: true,
    showRelationships: true
  },
  parameters: {
    docs: {
      description: {
        story: 'User\'s own profile with editing capabilities enabled.'
      }
    }
  }
};

// Minimal profile header only
export const HeaderOnly: Story = {
  args: {
    useMockData: true,
    profileId: 'user123',
    isOwnProfile: false,
    showTimeline: false,
    showStats: false,
    enableEditing: false,
    showRelationships: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal profile showing only the header component.'
      }
    }
  }
};

// Profile with full timeline
export const WithFullTimeline: Story = {
  args: {
    useMockData: true,
    profileId: 'user123',
    isOwnProfile: false,
    showTimeline: true,
    showStats: true,
    enableEditing: false,
    showRelationships: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Profile page with complete user timeline integration.'
      }
    }
  }
};

// Mobile profile view
export const MobileProfile: Story = {
  args: {
    useMockData: true,
    profileId: 'user123',
    isOwnProfile: false,
    showTimeline: true,
    showStats: false,
    enableEditing: false,
    showRelationships: false
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile-optimized profile page layout.'
      }
    }
  }
};

// Verified account profile
export const VerifiedProfile: Story = {
  args: {
    useMockData: true,
    profileId: 'verified_user',
    isOwnProfile: false,
    showTimeline: true,
    showStats: true,
    enableEditing: false,
    showRelationships: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Profile of a verified account with badge and additional features.'
      }
    }
  }
};