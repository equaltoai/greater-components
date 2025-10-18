import type { Meta, StoryObj } from '@storybook/svelte';
import { action } from '@storybook/addon-actions';
import ComposeBox from '../src/components/ComposeBox.svelte';
import type { 
  ComposeMediaAttachment, 
  ComposePoll,
  Status,
  Account
} from '../src/types.js';

// Mock data for stories
const mockAccount: Account = {
  id: '1',
  username: 'alice',
  acct: 'alice@mastodon.social',
  displayName: 'Alice Johnson',
  avatar: 'https://picsum.photos/48/48?random=1',
  note: 'Frontend developer and open source enthusiast',
  url: 'https://mastodon.social/@alice',
  followersCount: 1250,
  followingCount: 340,
  statusesCount: 2890,
  createdAt: '2023-01-15T10:30:00.000Z'
};

const mockReplyStatus: Status = {
  id: '123',
  uri: 'https://mastodon.social/users/alice/statuses/123',
  url: 'https://mastodon.social/@alice/123',
  account: mockAccount,
  content: 'Just finished implementing a new component! Really happy with how it turned out.',
  createdAt: '2024-01-15T14:30:00.000Z',
  visibility: 'public',
  repliesCount: 5,
  reblogsCount: 12,
  favouritesCount: 23,
  language: 'en'
};

const meta: Meta<ComposeBox> = {
  title: 'Fediverse/ComposeBox',
  component: ComposeBox,
  parameters: {
    docs: {
      description: {
        component: `
A comprehensive compose box component for creating posts in fediverse applications.

## Features

- **Text Area with Character Counting**: Expandable textarea with real-time character counting, soft/hard limits, and visual indicators
- **Content Warning Support**: Toggle-able content warning field with separate character counting
- **Media & Poll Slots**: Flexible slots for media attachments and poll creation
- **Draft Persistence**: Auto-save drafts to localStorage with restoration on mount
- **Keyboard Shortcuts**: Ctrl/Cmd+Enter to submit, Escape to cancel
- **Accessibility**: Full WCAG 2.1 AA compliance with proper ARIA labels and live regions
- **Responsive Design**: Mobile-optimized layout with touch-friendly interactions

## Usage

\`\`\`svelte
<ComposeBox
  maxLength={500}
  placeholder="What's on your mind?"
  onSubmit={handleSubmit}
  {mediaSlot}
  {pollSlot}
/>
\`\`\`
        `
      }
    },
    layout: 'padded'
  },
  argTypes: {
    maxLength: {
      control: { type: 'number', min: 100, max: 5000, step: 50 },
      description: 'Maximum character limit for content'
    },
    maxCwLength: {
      control: { type: 'number', min: 50, max: 500, step: 10 },
      description: 'Maximum character limit for content warning'
    },
    characterCountMode: {
      control: { type: 'select' },
      options: ['soft', 'hard'],
      description: 'How to handle character limits'
    },
    defaultVisibility: {
      control: { type: 'select' },
      options: ['public', 'unlisted', 'private', 'direct'],
      description: 'Default post visibility'
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text for main content area'
    },
    cwPlaceholder: {
      control: { type: 'text' },
      description: 'Placeholder text for content warning field'
    },
    autoFocus: {
      control: { type: 'boolean' },
      description: 'Auto-focus the textarea on mount'
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the entire component'
    },
    enableContentWarnings: {
      control: { type: 'boolean' },
      description: 'Enable content warning functionality'
    },
    enableVisibilitySettings: {
      control: { type: 'boolean' },
      description: 'Enable post visibility selection'
    },
    enablePolls: {
      control: { type: 'boolean' },
      description: 'Enable poll creation functionality'
    },
    maxMediaAttachments: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Maximum number of media attachments allowed'
    },
    onSubmit: {
      action: 'submit',
      description: 'Callback fired when the form is submitted'
    },
    onCancel: {
      action: 'cancel',
      description: 'Callback fired when cancel is clicked'
    },
    onDraftSave: {
      action: 'draft-save',
      description: 'Callback fired when draft is auto-saved'
    }
  },
  args: {
    maxLength: 500,
    maxCwLength: 100,
    characterCountMode: 'soft',
    defaultVisibility: 'public',
    placeholder: "What's on your mind?",
    cwPlaceholder: 'Content warning',
    autoFocus: false,
    disabled: false,
    enableContentWarnings: true,
    enableVisibilitySettings: true,
    enablePolls: true,
    maxMediaAttachments: 4
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const mediaRemoveAction = action('compose-box: media remove');

// Mock media slot component
const createMediaSlot = () => {
  return (params: {
    attachments: ComposeMediaAttachment[];
    onRemove: (id: string) => void;
    onDescriptionEdit: (id: string, description: string) => void;
    disabled: boolean;
  }) => {
    return `
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${params.attachments.map(attachment => `
          <div style="
            position: relative;
            width: 120px;
            height: 120px;
            border-radius: 8px;
            overflow: hidden;
            background-color: var(--gr-semantic-background-secondary);
            border: 1px solid var(--gr-semantic-border-default);
            ${params.disabled ? 'opacity: 0.6;' : ''}
          ">
            <img 
              src="${attachment.url}" 
              alt="${attachment.description || 'Uploaded media'}"
              style="width: 100%; height: 100%; object-fit: cover;"
            />
            <button 
              onclick="(() => params.onRemove('${attachment.id}'))()"
              style="
                position: absolute;
                top: 4px;
                right: 4px;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: none;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                ${params.disabled ? 'cursor: not-allowed;' : ''}
              "
              ${params.disabled ? 'disabled' : ''}
              aria-label="Remove media"
            >
              ×
            </button>
            ${attachment.uploading ? `
              <div style="
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
              ">
                Uploading...
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  };
};

// Mock poll slot component
const createPollSlot = () => {
  return (params: {
    poll?: ComposePoll;
    onPollChange: (poll: ComposePoll | undefined) => void;
    disabled: boolean;
  }) => {
    if (!params.poll) return '';
    
    return `
      <div style="
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 16px;
        background-color: var(--gr-semantic-background-secondary);
        border-radius: 8px;
        border: 1px solid var(--gr-semantic-border-default);
        ${params.disabled ? 'opacity: 0.6;' : ''}
      ">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 500; font-size: 14px;">Poll Options</span>
          <button 
            onclick="(() => params.onPollChange(undefined))()"
            style="
              background: none;
              border: none;
              color: var(--gr-semantic-foreground-secondary);
              cursor: pointer;
              padding: 4px;
              ${params.disabled ? 'cursor: not-allowed;' : ''}
            "
            ${params.disabled ? 'disabled' : ''}
            aria-label="Remove poll"
          >
            ×
          </button>
        </div>
        ${params.poll.options.map((option, index) => `
          <input 
            type="text" 
            value="${option}"
            placeholder="Option ${index + 1}"
            style="
              padding: 8px 12px;
              border: 1px solid var(--gr-semantic-border-default);
              border-radius: 6px;
              background-color: var(--gr-semantic-background-primary);
              font-size: 14px;
            "
            ${params.disabled ? 'disabled' : ''}
          />
        `).join('')}
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
          <label style="display: flex; align-items: center; gap: 8px; font-size: 14px;">
            <input 
              type="checkbox" 
              ${params.poll.multiple ? 'checked' : ''}
              ${params.disabled ? 'disabled' : ''}
            />
            Allow multiple choices
          </label>
          <select 
            style="
              padding: 4px 8px;
              border: 1px solid var(--gr-semantic-border-default);
              border-radius: 4px;
              font-size: 14px;
            "
            ${params.disabled ? 'disabled' : ''}
          >
            <option value="86400" ${params.poll.expiresIn === 86400 ? 'selected' : ''}>1 day</option>
            <option value="259200" ${params.poll.expiresIn === 259200 ? 'selected' : ''}>3 days</option>
            <option value="604800" ${params.poll.expiresIn === 604800 ? 'selected' : ''}>7 days</option>
          </select>
        </div>
      </div>
    `;
  };
};

// Mock media upload function
const mockMediaUpload = async (file: File): Promise<ComposeMediaAttachment> => {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    file,
    url: URL.createObjectURL(file),
    type: file.type.startsWith('image/') ? 'image' : 
          file.type.startsWith('video/') ? 'video' : 
          file.type.startsWith('audio/') ? 'audio' : 'image',
    description: '',
    uploading: false
  };
};

export const Default: Story = {
  args: {}
};

export const WithReply: Story = {
  args: {
    replyToStatus: mockReplyStatus,
    placeholder: 'Reply to Alice...'
  }
};

export const WithInitialContent: Story = {
  args: {
    initialContent: 'This is some initial content that was loaded from a draft or passed in as a prop. #example #compose',
    autoFocus: true
  }
};

export const ShortCharacterLimit: Story = {
  args: {
    maxLength: 140,
    characterCountMode: 'hard',
    placeholder: 'Keep it short and sweet...'
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates behavior with Twitter-like character limits (140 characters with hard enforcement).'
      }
    }
  }
};

export const LongCharacterLimit: Story = {
  args: {
    maxLength: 5000,
    characterCountMode: 'soft',
    placeholder: 'Write as much as you want...'
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates behavior with generous character limits and soft enforcement.'
      }
    }
  }
};

export const WithContentWarning: Story = {
  args: {
    initialContent: 'This post contains sensitive content that some users might want to filter out.',
  },
  play: async ({ canvasElement }) => {
    // Auto-enable content warning for this story
    const cwButton = canvasElement.querySelector('[aria-label*="content warning"]') as HTMLButtonElement;
    if (cwButton) {
      cwButton.click();
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the content warning functionality with a separate character-counted field.'
      }
    }
  }
};

export const WithMediaSupport: Story = {
  args: {
    onMediaUpload: mockMediaUpload,
    onMediaRemove: (id: string) => mediaRemoveAction(id),
    mediaSlot: createMediaSlot()
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates media upload functionality with preview and removal capabilities.'
      }
    }
  }
};

export const WithPollSupport: Story = {
  args: {
    pollSlot: createPollSlot()
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows poll creation functionality with options, duration, and multiple choice settings.'
      }
    }
  }
};

export const FullyFeatured: Story = {
  args: {
    onMediaUpload: mockMediaUpload,
    onMediaRemove: (id: string) => mediaRemoveAction(id),
    mediaSlot: createMediaSlot(),
    pollSlot: createPollSlot(),
    placeholder: 'Share your thoughts, add media, create polls...',
    maxLength: 500,
    characterCountMode: 'soft'
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates all features working together - media, polls, content warnings, and more.'
      }
    }
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    initialContent: 'This compose box is disabled and cannot be interacted with.',
    mediaSlot: createMediaSlot(),
    pollSlot: createPollSlot()
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the disabled state of the component with all interactions prevented.'
      }
    }
  }
};

export const MinimalConfiguration: Story = {
  args: {
    enableContentWarnings: false,
    enableVisibilitySettings: false,
    enablePolls: false,
    maxMediaAttachments: 1,
    placeholder: 'Simple compose box...'
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal configuration with most features disabled, suitable for simple use cases.'
      }
    }
  }
};

export const DifferentVisibility: Story = {
  args: {
    defaultVisibility: 'private',
    initialContent: 'This post will only be visible to followers by default.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates different default visibility settings for posts.'
      }
    }
  }
};

export const MobileLayout: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Shows how the component adapts to mobile screen sizes with reorganized actions.'
      }
    }
  }
};
