import type { Meta, StoryObj } from '@storybook/svelte';
import ComposeFlowExample from './ComposeFlowExample.svelte';

const meta = {
  title: 'Examples/Compose Flow',
  component: ComposeFlowExample,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Complete compose flow with media upload, polls, drafts, and all posting features.'
      }
    }
  },
  argTypes: {
    useMockData: {
      control: 'boolean',
      description: 'Toggle between mock posting and real API'
    },
    showMediaUpload: {
      control: 'boolean',
      description: 'Enable media upload functionality'
    },
    showPollCreation: {
      control: 'boolean',
      description: 'Enable poll creation'
    },
    enableDrafts: {
      control: 'boolean',
      description: 'Enable draft saving and loading'
    },
    showContentWarning: {
      control: 'boolean',
      description: 'Show content warning field'
    },
    showVisibilitySelector: {
      control: 'boolean',
      description: 'Show post visibility options'
    },
    showScheduling: {
      control: 'boolean',
      description: 'Enable post scheduling'
    },
    maxLength: {
      control: 'number',
      description: 'Maximum character limit'
    },
    showEmojiPicker: {
      control: 'boolean',
      description: 'Show emoji picker'
    },
    showFormatting: {
      control: 'boolean',
      description: 'Show text formatting options'
    }
  }
} satisfies Meta<ComposeFlowExample>;

export default meta;
type Story = StoryObj<typeof meta>;

// Full compose experience
export const FullCompose: Story = {
  args: {
    useMockData: true,
    showMediaUpload: true,
    showPollCreation: true,
    enableDrafts: true,
    showContentWarning: true,
    showVisibilitySelector: true,
    showScheduling: true,
    maxLength: 500,
    showEmojiPicker: true,
    showFormatting: true
  }
};

// Simple compose
export const SimpleCompose: Story = {
  args: {
    useMockData: true,
    showMediaUpload: false,
    showPollCreation: false,
    enableDrafts: false,
    showContentWarning: false,
    showVisibilitySelector: true,
    showScheduling: false,
    maxLength: 500,
    showEmojiPicker: false,
    showFormatting: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal compose box with just text and visibility options.'
      }
    }
  }
};

// Media-focused compose
export const MediaCompose: Story = {
  args: {
    useMockData: true,
    showMediaUpload: true,
    showPollCreation: false,
    enableDrafts: true,
    showContentWarning: true,
    showVisibilitySelector: true,
    showScheduling: false,
    maxLength: 500,
    showEmojiPicker: true,
    showFormatting: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Compose box optimized for media posting.'
      }
    }
  }
};

// Poll creation flow
export const PollCompose: Story = {
  args: {
    useMockData: true,
    showMediaUpload: false,
    showPollCreation: true,
    enableDrafts: true,
    showContentWarning: false,
    showVisibilitySelector: true,
    showScheduling: false,
    maxLength: 500,
    showEmojiPicker: false,
    showFormatting: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Compose box focused on poll creation.'
      }
    }
  }
};

// Draft management
export const WithDrafts: Story = {
  args: {
    useMockData: true,
    showMediaUpload: true,
    showPollCreation: true,
    enableDrafts: true,
    showContentWarning: true,
    showVisibilitySelector: true,
    showScheduling: false,
    maxLength: 500,
    showEmojiPicker: true,
    showFormatting: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Compose box with draft saving and loading capabilities.'
      }
    }
  }
};

// Scheduled posts
export const ScheduledPost: Story = {
  args: {
    useMockData: true,
    showMediaUpload: true,
    showPollCreation: false,
    enableDrafts: true,
    showContentWarning: true,
    showVisibilitySelector: true,
    showScheduling: true,
    maxLength: 500,
    showEmojiPicker: true,
    showFormatting: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Compose box with post scheduling functionality.'
      }
    }
  }
};

// Mobile compose
export const MobileCompose: Story = {
  args: {
    useMockData: true,
    showMediaUpload: true,
    showPollCreation: false,
    enableDrafts: true,
    showContentWarning: false,
    showVisibilitySelector: true,
    showScheduling: false,
    maxLength: 500,
    showEmojiPicker: true,
    showFormatting: false
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile-optimized compose interface.'
      }
    }
  }
};