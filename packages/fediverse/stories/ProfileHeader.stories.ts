import type { Meta, StoryObj } from '@storybook/svelte';
import { action } from '@storybook/addon-actions';
import ProfileHeader from '../src/components/ProfileHeader.svelte';
import type { UnifiedAccount } from '@greater/adapters';

// Mock data for different profile examples
const baseMockAccount: UnifiedAccount = {
  id: '1',
  username: 'alice',
  acct: 'alice@social.example.com',
  displayName: 'Alice Johnson',
  note: '<p>Software engineer passionate about open source and the fediverse. Building a better social web, one commit at a time! 🚀</p><p>Available for consulting work.</p>',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c2e0?w=400&h=400&fit=crop&crop=face',
  header: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=800&h=200&fit=crop',
  createdAt: '2023-01-15T10:30:00Z',
  followersCount: 1234,
  followingCount: 567,
  statusesCount: 890,
  locked: false,
  verified: false,
  bot: false,
  fields: [
    { name: 'Website', value: '<a href="https://alice.dev">alice.dev</a>', verifiedAt: '2024-01-15T10:30:00Z' },
    { name: 'Location', value: 'San Francisco, CA' },
    { name: 'Pronouns', value: 'she/her' },
    { name: 'Languages', value: 'English, Spanish' }
  ],
  metadata: {
    source: 'mastodon' as const,
    apiVersion: '4.0.0',
    lastUpdated: Date.now()
  }
};

const verifiedAccount: UnifiedAccount = {
  ...baseMockAccount,
  id: '2',
  username: 'verified_user',
  acct: 'verified_user@mastodon.social',
  displayName: 'Verified Creator',
  verified: true,
  followersCount: 15420,
  followingCount: 892,
  statusesCount: 3567,
  note: '<p>Verified content creator and tech educator. Host of "The Future Web" podcast 🎙️</p><p>Sharing insights about #WebDev, #OpenSource, and #Privacy</p>',
  fields: [
    { name: 'Website', value: '<a href="https://verified.example">verified.example</a>', verifiedAt: '2024-01-15T10:30:00Z' },
    { name: 'Podcast', value: '<a href="https://futureweb.fm">The Future Web</a>', verifiedAt: '2024-02-01T14:20:00Z' },
    { name: 'YouTube', value: '<a href="https://youtube.com/@verified">@verified</a>' },
    { name: 'Mastodon', value: '<a href="https://mastodon.social/@verified">@verified@mastodon.social</a>', verifiedAt: '2024-01-01T00:00:00Z' }
  ]
};

const botAccount: UnifiedAccount = {
  ...baseMockAccount,
  id: '3',
  username: 'news_bot',
  acct: 'news_bot@bots.social',
  displayName: 'Tech News Bot',
  bot: true,
  verified: false,
  followersCount: 8923,
  followingCount: 0,
  statusesCount: 45678,
  note: '<p>🤖 Automated tech news aggregator</p><p>Posting the latest in technology, programming, and open source every hour. Maintained by @admin@bots.social</p>',
  avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop',
  header: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=200&fit=crop',
  fields: [
    { name: 'Source Code', value: '<a href="https://github.com/example/news-bot">GitHub</a>' },
    { name: 'Admin', value: '@admin@bots.social' },
    { name: 'Update Frequency', value: 'Every hour' },
    { name: 'Data Sources', value: 'RSS feeds, APIs' }
  ]
};

const lockedAccount: UnifiedAccount = {
  ...baseMockAccount,
  id: '4',
  username: 'private_user',
  acct: 'private_user@personal.social',
  displayName: 'Private Person',
  locked: true,
  followersCount: 47,
  followingCount: 123,
  statusesCount: 234,
  note: '<p>Personal account - follow requests welcome from real people only ✨</p><p>Occasional thoughts on books, gardening, and life.</p>',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  header: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=200&fit=crop',
  fields: [
    { name: 'Reading', value: 'Currently: "The Fifth Season" by N.K. Jemisin' },
    { name: 'Garden Zone', value: '9b (California)' }
  ]
};

const newAccount: UnifiedAccount = {
  ...baseMockAccount,
  id: '5',
  username: 'newbie',
  acct: 'newbie@mastodon.world',
  displayName: 'New User',
  followersCount: 3,
  followingCount: 15,
  statusesCount: 12,
  createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  note: '<p>Just joined the fediverse! Still learning how everything works. Hello world! 👋</p>',
  avatar: '',
  header: '',
  fields: []
};

const highCountsAccount: UnifiedAccount = {
  ...baseMockAccount,
  id: '6',
  username: 'popular',
  acct: 'popular@mastodon.social',
  displayName: 'Popular Account',
  verified: true,
  followersCount: 1234567,
  followingCount: 2345,
  statusesCount: 98765,
  note: '<p>Building the future of social media 🌐</p><p>Thoughts on technology, society, and the open web.</p>',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  header: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=200&fit=crop',
  fields: [
    { name: 'Website', value: '<a href="https://popular.social">popular.social</a>', verifiedAt: '2024-01-15T10:30:00Z' },
    { name: 'Founded', value: 'Popular Social Network Inc.' },
    { name: 'Location', value: 'Global' },
    { name: 'Team Size', value: '50+ engineers' }
  ]
};

const meta: Meta<ProfileHeader> = {
  title: 'Fediverse/ProfileHeader',
  component: ProfileHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
ProfileHeader is a comprehensive component for displaying user profile information in fediverse applications. 

## Features
- **Banner and Avatar**: Displays profile banner with fallback color and avatar using @greater/primitives Avatar component
- **Identity Display**: Shows display name with custom emoji support, handle, verification badges, and privacy indicators
- **Bio Rendering**: Renders sanitized HTML bio content with mention and hashtag linkification
- **Metadata Fields**: Displays custom profile fields with verification status
- **Stats Display**: Shows follower/following/post counts with optional click handlers
- **Follow Button Slot**: Flexible slot for action buttons
- **Accessibility**: Full WCAG 2.1 AA compliance with proper ARIA labels and keyboard navigation
- **Responsive Design**: Adapts to different screen sizes with mobile-friendly layout

## Usage
The component works with UnifiedAccount data from @greater/adapters and provides extensive customization options for different use cases.
        `
      }
    }
  },
  argTypes: {
    account: {
      control: { type: 'object' },
      description: 'The unified account data to display'
    },
    showBanner: {
      control: { type: 'boolean' },
      description: 'Whether to show the banner image'
    },
    bannerFallbackColor: {
      control: { type: 'color' },
      description: 'Fallback color when no banner image is available'
    },
    avatarSize: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Size of the avatar'
    },
    showBio: {
      control: { type: 'boolean' },
      description: 'Whether to show the bio/note content'
    },
    showFields: {
      control: { type: 'boolean' },
      description: 'Whether to show metadata fields'
    },
    showJoinDate: {
      control: { type: 'boolean' },
      description: 'Whether to show the join date'
    },
    showCounts: {
      control: { type: 'boolean' },
      description: 'Whether to show follower/following/post counts'
    },
    clickableCounts: {
      control: { type: 'boolean' },
      description: 'Whether counts should be clickable'
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<ProfileHeader>;

const followersClickAction = action('profile-header: followers click');
const followingClickAction = action('profile-header: following click');
const postsClickAction = action('profile-header: posts click');

// Default story
export const Default: Story = {
  args: {
    account: baseMockAccount,
    showBanner: true,
    bannerFallbackColor: '#3b82f6',
    avatarSize: 'xl',
    showBio: true,
    showFields: true,
    showJoinDate: true,
    showCounts: true,
    clickableCounts: false
  }
};

// Verified account
export const Verified: Story = {
  args: {
    account: verifiedAccount,
    showBanner: true,
    avatarSize: 'xl',
    showBio: true,
    showFields: true,
    showJoinDate: true,
    showCounts: true,
    clickableCounts: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Profile header for a verified account with multiple verified links and large follower count.'
      }
    }
  }
};

// Bot account
export const Bot: Story = {
  args: {
    account: botAccount,
    showBanner: true,
    avatarSize: 'xl',
    showBio: true,
    showFields: true,
    showJoinDate: true,
    showCounts: true,
    clickableCounts: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Profile header for a bot account showing the bot badge and automated content indication.'
      }
    }
  }
};

// Private/locked account
export const Private: Story = {
  args: {
    account: lockedAccount,
    showBanner: true,
    avatarSize: 'xl',
    showBio: true,
    showFields: true,
    showJoinDate: true,
    showCounts: true,
    clickableCounts: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Profile header for a private account showing the lock icon and limited information.'
      }
    }
  }
};

// New account
export const NewAccount: Story = {
  args: {
    account: newAccount,
    showBanner: true,
    bannerFallbackColor: '#10b981',
    avatarSize: 'xl',
    showBio: true,
    showFields: true,
    showJoinDate: true,
    showCounts: true,
    clickableCounts: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Profile header for a new user with minimal content, no avatar/banner, and recent join date.'
      }
    }
  }
};

// High follower count
export const Popular: Story = {
  args: {
    account: highCountsAccount,
    showBanner: true,
    avatarSize: 'xl',
    showBio: true,
    showFields: true,
    showJoinDate: true,
    showCounts: true,
    clickableCounts: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Profile header showing how large numbers are formatted (1.2M followers, 98K posts, etc.).'
      }
    }
  }
};

// With follow button
export const WithFollowButton: Story = {
  args: {
    account: baseMockAccount,
    showBanner: true,
    avatarSize: 'xl',
    showBio: true,
    showFields: true,
    showJoinDate: true,
    showCounts: true,
    clickableCounts: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Profile header with a follow button in the action slot.'
      }
    }
  }
};

// Minimal configuration
export const Minimal: Story = {
  args: {
    account: baseMockAccount,
    showBanner: false,
    avatarSize: 'md',
    showBio: false,
    showFields: false,
    showJoinDate: false,
    showCounts: true,
    clickableCounts: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal profile header showing only essential information (avatar, name, handle, counts).'
      }
    }
  }
};

// No banner image
export const NoBanner: Story = {
  args: {
    account: {
      ...baseMockAccount,
      header: ''
    },
    showBanner: true,
    bannerFallbackColor: '#8b5cf6',
    avatarSize: 'xl',
    showBio: true,
    showFields: true,
    showJoinDate: true,
    showCounts: true,
    clickableCounts: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Profile header with fallback banner color when no header image is available.'
      }
    }
  }
};

// Mobile layout simulation
export const Mobile: Story = {
  args: {
    account: baseMockAccount,
    showBanner: true,
    avatarSize: 'lg',
    showBio: true,
    showFields: true,
    showJoinDate: true,
    showCounts: true,
    clickableCounts: true
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Profile header optimized for mobile viewport with responsive layout adjustments.'
      }
    }
  }
};

// Different avatar sizes
export const AvatarSizes: Story = {
  render: () => ({
    Component: ProfileHeader,
    props: {}
  }),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different avatar sizes available for the profile header.'
      }
    }
  }
};

// Interactive example with count handlers
export const Interactive: Story = {
  args: {
    account: baseMockAccount,
    showBanner: true,
    avatarSize: 'xl',
    showBio: true,
    showFields: true,
    showJoinDate: true,
    showCounts: true,
    clickableCounts: true,
    onFollowersClick: () => followersClickAction(),
    onFollowingClick: () => followingClickAction(),
    onPostsClick: () => postsClickAction()
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive profile header with clickable counts (view the Storybook actions panel for click events).'
      }
    }
  }
};
