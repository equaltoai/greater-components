import type { Meta, StoryObj } from '@storybook/svelte';
import { action } from '@storybook/addon-actions';
import ActionBar from '../src/components/ActionBar.svelte';

const meta = {
  title: 'Fediverse/ActionBar',
  component: ActionBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Interactive action bar for fediverse posts with reply, boost, favorite, and share actions. Supports active states, loading states, and accessibility features.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    counts: {
      control: 'object',
      description: 'Action count numbers',
      defaultValue: { replies: 0, boosts: 0, favorites: 0 }
    },
    states: {
      control: 'object',
      description: 'Current action states (boosted, favorited, bookmarked)',
      defaultValue: {}
    },
    readonly: {
      control: 'boolean',
      description: 'Disables all actions for read-only mode'
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Button size variant'
    },
    idPrefix: {
      control: 'text',
      description: 'ID prefix for accessibility'
    },
    class: {
      control: 'text',
      description: 'Additional CSS class'
    }
  }
} satisfies Meta<ActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const replyAction = action('actionbar: reply');
const boostAction = action('actionbar: boost');
const favoriteAction = action('actionbar: favorite');
const shareAction = action('actionbar: share');
const unboostAction = action('actionbar: unboost');
const unfavoriteAction = action('actionbar: unfavorite');

const defaultHandlers = {
  onReply: replyAction,
  onBoost: boostAction,
  onFavorite: favoriteAction,
  onShare: shareAction
};

// Default story
export const Default: Story = {
  args: {
    counts: {
      replies: 5,
      boosts: 12,
      favorites: 23
    },
    states: {},
    readonly: false,
    size: 'sm',
    idPrefix: 'story-action',
    handlers: {
      ...defaultHandlers
    }
  }
};

// No counts
export const NoCounts: Story = {
  args: {
    counts: {
      replies: 0,
      boosts: 0,
      favorites: 0
    },
    handlers: {
      ...defaultHandlers
    }
  }
};

// Active states
export const ActiveStates: Story = {
  args: {
    counts: {
      replies: 3,
      boosts: 8,
      favorites: 15
    },
    states: {
      boosted: true,
      favorited: true
    },
    handlers: {
      onReply: replyAction,
      onBoost: unboostAction,
      onFavorite: unfavoriteAction,
      onShare: shareAction
    }
  }
};

// High counts
export const HighCounts: Story = {
  args: {
    counts: {
      replies: 1234,
      boosts: 5678,
      favorites: 9999
    },
    handlers: {
      ...defaultHandlers
    }
  }
};

// Very high counts (K formatting)
export const VeryHighCounts: Story = {
  args: {
    counts: {
      replies: 12300,
      boosts: 45600,
      favorites: 123000
    },
    handlers: {
      ...defaultHandlers
    }
  }
};

// Read-only mode
export const ReadOnly: Story = {
  args: {
    counts: {
      replies: 5,
      boosts: 12,
      favorites: 23
    },
    states: {
      boosted: true,
      favorited: false
    },
    readonly: true
  }
};

// Medium size
export const MediumSize: Story = {
  args: {
    counts: {
      replies: 5,
      boosts: 12,
      favorites: 23
    },
    size: 'md',
    handlers: { ...defaultHandlers }
  }
};

// Large size
export const LargeSize: Story = {
  args: {
    counts: {
      replies: 5,
      boosts: 12,
      favorites: 23
    },
    size: 'lg',
    handlers: { ...defaultHandlers }
  }
};

// Loading states simulation
export const LoadingStates: Story = {
  args: {
    counts: {
      replies: 5,
      boosts: 12,
      favorites: 23
    },
    handlers: {
      onReply: () => new Promise(resolve => setTimeout(resolve, 2000)),
      onBoost: () => new Promise(resolve => setTimeout(resolve, 2000)),
      onFavorite: () => new Promise(resolve => setTimeout(resolve, 2000)),
      onShare: () => new Promise(resolve => setTimeout(resolve, 2000))
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Click any action button to see the loading state. Actions have a 2-second delay for demonstration.'
      }
    }
  }
};

// Interactive playground
export const Interactive: Story = {
  render: (args) => ({
    Component: ActionBar,
    props: {
      ...args,
      counts: {
        replies: 5,
        boosts: 12,
        favorites: 23
      },
      states: {
        boosted: false,
        favorited: false
      },
      handlers: {
        onReply: () => {
          replyAction();
          // In a real app, this would open a reply dialog
        },
        onBoost: () => {
          const nextBoosted = !args.states?.boosted;
          if (nextBoosted) {
            boostAction();
          } else {
            unboostAction();
          }
          // Toggle boost state (in real app this would be handled by parent)
          args.states = { ...args.states, boosted: nextBoosted };
          if (nextBoosted) {
            args.counts = { ...args.counts, boosts: args.counts.boosts + 1 };
          } else {
            args.counts = { ...args.counts, boosts: args.counts.boosts - 1 };
          }
        },
        onFavorite: () => {
          const nextFavorited = !args.states?.favorited;
          if (nextFavorited) {
            favoriteAction();
          } else {
            unfavoriteAction();
          }
          // Toggle favorite state (in real app this would be handled by parent)
          args.states = { ...args.states, favorited: nextFavorited };
          if (nextFavorited) {
            args.counts = { ...args.counts, favorites: args.counts.favorites + 1 };
          } else {
            args.counts = { ...args.counts, favorites: args.counts.favorites - 1 };
          }
        },
        onShare: () => {
          shareAction();
          // In a real app, this would open share options or copy link
          if (navigator.share) {
            navigator.share({
              title: 'Shared Post',
              text: 'Check out this post!',
              url: window.location.href
            });
          }
        }
      }
    }
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive example where boost and favorite actions toggle their states. Check the Storybook actions panel for event logs.'
      }
    }
  }
};

// With extensions slot
export const WithExtensions: Story = {
  render: (args) => ({
    Component: ActionBar,
    props: {
      ...args,
      counts: {
        replies: 5,
        boosts: 12,
        favorites: 23
      },
      handlers: {
        ...defaultHandlers
      }
    },
    slots: {
      extensions: `
        <button 
          class="gr-button gr-button--ghost gr-button--sm" 
          aria-label="Bookmark this post"
          style="color: var(--gr-semantic-foreground-secondary);"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
        <button 
          class="gr-button gr-button--ghost gr-button--sm" 
          aria-label="More options"
          style="color: var(--gr-semantic-foreground-secondary);"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="19" cy="12" r="1"/>
            <circle cx="5" cy="12" r="1"/>
          </svg>
        </button>
      `
    }
  }),
  parameters: {
    docs: {
      description: {
        story: 'Example with custom extension buttons for bookmark and more options using the extensions slot.'
      }
    }
  }
};
