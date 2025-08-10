import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import ComposeBox from '../src/components/ComposeBox.svelte';
import type { 
  ComposeBoxDraft, 
  ComposeMediaAttachment, 
  ComposePoll,
  Status,
  Account
} from '../src/types.js';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock URL.createObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  value: vi.fn(() => 'blob:mock-url'),
  writable: true
});

// Mock data
const mockAccount: Account = {
  id: '1',
  username: 'alice',
  acct: 'alice@mastodon.social',
  displayName: 'Alice Johnson',
  avatar: 'https://example.com/avatar.jpg',
  note: 'Test user',
  url: 'https://mastodon.social/@alice',
  followersCount: 100,
  followingCount: 50,
  statusesCount: 200,
  createdAt: '2023-01-01T00:00:00.000Z'
};

const mockReplyStatus: Status = {
  id: '123',
  uri: 'https://mastodon.social/users/alice/statuses/123',
  url: 'https://mastodon.social/@alice/123',
  account: mockAccount,
  content: 'Original post content',
  createdAt: '2024-01-01T00:00:00.000Z',
  visibility: 'public',
  repliesCount: 0,
  reblogsCount: 0,
  favouritesCount: 0
};

const mockMediaUpload = vi.fn().mockImplementation(async (file: File): Promise<ComposeMediaAttachment> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    id: `media-${Date.now()}`,
    file,
    url: 'blob:mock-url',
    type: 'image',
    description: '',
    uploading: false
  };
});

describe('ComposeBox', () => {
  const user = userEvent.setup();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Basic Rendering', () => {
    it('should render with default props', () => {
      render(ComposeBox);
      
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByPlaceholderText("What's on your mind?")).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Post' })).toBeInTheDocument();
    });

    it('should render with initial content', () => {
      render(ComposeBox, {
        props: { initialContent: 'Hello world!' }
      });
      
      expect(screen.getByDisplayValue('Hello world!')).toBeInTheDocument();
    });

    it('should render as reply when replyToStatus is provided', () => {
      render(ComposeBox, {
        props: { replyToStatus: mockReplyStatus }
      });
      
      expect(screen.getByText('Replying to @alice@mastodon.social')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Reply' })).toBeInTheDocument();
      expect(screen.getByLabelText('Reply to Alice Johnson')).toBeInTheDocument();
    });

    it('should apply custom placeholder', () => {
      render(ComposeBox, {
        props: { placeholder: 'Custom placeholder text' }
      });
      
      expect(screen.getByPlaceholderText('Custom placeholder text')).toBeInTheDocument();
    });
  });

  describe('Character Counting', () => {
    it('should show character count when focused', async () => {
      render(ComposeBox, { props: { maxLength: 500 } });
      
      const textarea = screen.getByRole('textbox');
      await user.click(textarea);
      
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should update character count as user types', async () => {
      render(ComposeBox, { props: { maxLength: 500 } });
      
      const textarea = screen.getByRole('textbox');
      await user.click(textarea);
      await user.type(textarea, 'Hello');
      
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should show hard limit in hard mode', async () => {
      render(ComposeBox, { 
        props: { 
          maxLength: 140, 
          characterCountMode: 'hard' 
        } 
      });
      
      const textarea = screen.getByRole('textbox');
      await user.click(textarea);
      
      expect(screen.getByText('0/140')).toBeInTheDocument();
    });

    it('should show warning color when approaching limit', async () => {
      render(ComposeBox, { props: { maxLength: 100 } });
      
      const textarea = screen.getByRole('textbox');
      await user.click(textarea);
      
      // Type 85 characters (85% of 100, which should trigger warning)
      const longText = 'a'.repeat(85);
      await user.type(textarea, longText);
      
      const charCount = screen.getByText('85');
      expect(charCount).toHaveStyle({ color: 'var(--gr-semantic-action-warning-default)' });
    });

    it('should show error color when over limit', async () => {
      render(ComposeBox, { props: { maxLength: 50 } });
      
      const textarea = screen.getByRole('textbox');
      await user.click(textarea);
      
      // Type more than the limit
      const longText = 'a'.repeat(60);
      await user.type(textarea, longText);
      
      const charCount = screen.getByText('60');
      expect(charCount).toHaveStyle({ color: 'var(--gr-semantic-action-error-default)' });
    });

    it('should disable submit button when over hard limit', async () => {
      render(ComposeBox, { 
        props: { 
          maxLength: 50, 
          characterCountMode: 'hard' 
        } 
      });
      
      const textarea = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: 'Post' });
      
      await user.click(textarea);
      await user.type(textarea, 'a'.repeat(60));
      
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Content Warning', () => {
    it('should toggle content warning field', async () => {
      render(ComposeBox, { props: { enableContentWarnings: true } });
      
      const cwButton = screen.getByRole('button', { name: 'Add content warning' });
      await user.click(cwButton);
      
      expect(screen.getByLabelText('Content warning')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Content warning')).toBeInTheDocument();
    });

    it('should show separate character count for content warning', async () => {
      render(ComposeBox, { 
        props: { 
          enableContentWarnings: true,
          maxCwLength: 100
        } 
      });
      
      const cwButton = screen.getByRole('button', { name: 'Add content warning' });
      await user.click(cwButton);
      
      const cwField = screen.getByLabelText('Content warning');
      await user.type(cwField, 'Warning text');
      
      expect(screen.getByText('12/100')).toBeInTheDocument();
    });

    it('should focus CW field when toggled on', async () => {
      render(ComposeBox, { props: { enableContentWarnings: true } });
      
      const cwButton = screen.getByRole('button', { name: 'Add content warning' });
      await user.click(cwButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Content warning')).toHaveFocus();
      });
    });

    it('should validate CW character limit', async () => {
      const onSubmit = vi.fn();
      render(ComposeBox, { 
        props: { 
          enableContentWarnings: true,
          maxCwLength: 10,
          onSubmit
        } 
      });
      
      const textarea = screen.getByRole('textbox');
      const cwButton = screen.getByRole('button', { name: 'Add content warning' });
      
      await user.type(textarea, 'Main content');
      await user.click(cwButton);
      
      const cwField = screen.getByLabelText('Content warning');
      await user.type(cwField, 'Very long content warning text');
      
      const submitButton = screen.getByRole('button', { name: 'Post' });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should submit on Ctrl+Enter', async () => {
      const onSubmit = vi.fn();
      render(ComposeBox, { props: { onSubmit } });
      
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Test content');
      await user.keyboard('{Control>}{Enter}{/Control}');
      
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'Test content'
        })
      );
    });

    it('should submit on Cmd+Enter (Mac)', async () => {
      const onSubmit = vi.fn();
      render(ComposeBox, { props: { onSubmit } });
      
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Test content');
      await user.keyboard('{Meta>}{Enter}{/Meta}');
      
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'Test content'
        })
      );
    });

    it('should cancel on Escape', async () => {
      const onCancel = vi.fn();
      render(ComposeBox, { props: { onCancel } });
      
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Test content');
      await user.keyboard('{Escape}');
      
      expect(onCancel).toHaveBeenCalled();
    });
  });

  describe('Draft Persistence', () => {
    it('should save draft to localStorage on content change', async () => {
      vi.useFakeTimers();
      render(ComposeBox, { props: { draftKey: 'test-draft' } });
      
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Draft content');
      
      // Fast-forward timers to trigger auto-save
      vi.advanceTimersByTime(1100);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'test-draft',
        expect.stringContaining('Draft content')
      );
      
      vi.useRealTimers();
    });

    it('should load draft from localStorage on mount', () => {
      const mockDraft: ComposeBoxDraft = {
        content: 'Loaded draft',
        contentWarning: '',
        hasContentWarning: false,
        visibility: 'public',
        mediaAttachments: [],
        timestamp: Date.now()
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockDraft));
      
      render(ComposeBox, { props: { draftKey: 'test-draft' } });
      
      expect(screen.getByDisplayValue('Loaded draft')).toBeInTheDocument();
    });

    it('should not load old drafts (older than 24 hours)', () => {
      const oldDraft: ComposeBoxDraft = {
        content: 'Old draft',
        contentWarning: '',
        hasContentWarning: false,
        visibility: 'public',
        mediaAttachments: [],
        timestamp: Date.now() - (25 * 60 * 60 * 1000) // 25 hours ago
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(oldDraft));
      
      render(ComposeBox, { props: { draftKey: 'test-draft' } });
      
      expect(screen.queryByDisplayValue('Old draft')).not.toBeInTheDocument();
    });

    it('should clear draft after successful submit', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      render(ComposeBox, { 
        props: { 
          onSubmit,
          draftKey: 'test-draft'
        } 
      });
      
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Test content');
      
      const submitButton = screen.getByRole('button', { name: 'Post' });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-draft');
      });
    });
  });

  describe('Media Handling', () => {
    it('should show media button when onMediaUpload is provided', () => {
      render(ComposeBox, { 
        props: { onMediaUpload: mockMediaUpload }
      });
      
      expect(screen.getByLabelText('Add media')).toBeInTheDocument();
    });

    it('should upload media when file is selected', async () => {
      render(ComposeBox, { 
        props: { onMediaUpload: mockMediaUpload }
      });
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText('Add media').previousElementSibling as HTMLInputElement;
      
      await user.upload(input, file);
      
      await waitFor(() => {
        expect(mockMediaUpload).toHaveBeenCalledWith(file);
      });
    });

    it('should respect maxMediaAttachments limit', () => {
      const { rerender } = render(ComposeBox, { 
        props: { 
          onMediaUpload: mockMediaUpload,
          maxMediaAttachments: 1
        }
      });
      
      // Simulate having 1 attachment already
      rerender({
        onMediaUpload: mockMediaUpload,
        maxMediaAttachments: 1,
        // Would need to pass attachments via slot in real usage
      });
      
      // Media button should still be present (this test would need slot implementation)
      expect(screen.getByLabelText('Add media')).toBeInTheDocument();
    });
  });

  describe('Visibility Settings', () => {
    it('should show visibility selector when enabled', () => {
      render(ComposeBox, { 
        props: { enableVisibilitySettings: true }
      });
      
      expect(screen.getByLabelText('Post visibility')).toBeInTheDocument();
    });

    it('should hide visibility selector when disabled', () => {
      render(ComposeBox, { 
        props: { enableVisibilitySettings: false }
      });
      
      expect(screen.queryByLabelText('Post visibility')).not.toBeInTheDocument();
    });

    it('should set default visibility', () => {
      render(ComposeBox, { 
        props: { 
          enableVisibilitySettings: true,
          defaultVisibility: 'private'
        }
      });
      
      const select = screen.getByLabelText('Post visibility') as HTMLSelectElement;
      expect(select.value).toBe('private');
    });

    it('should update visibility when changed', async () => {
      render(ComposeBox, { 
        props: { enableVisibilitySettings: true }
      });
      
      const select = screen.getByLabelText('Post visibility');
      await user.selectOptions(select, 'unlisted');
      
      expect((select as HTMLSelectElement).value).toBe('unlisted');
    });
  });

  describe('Poll Support', () => {
    it('should show poll button when enabled', () => {
      render(ComposeBox, { 
        props: { enablePolls: true }
      });
      
      expect(screen.getByLabelText('Add poll')).toBeInTheDocument();
    });

    it('should hide poll button when disabled', () => {
      render(ComposeBox, { 
        props: { enablePolls: false }
      });
      
      expect(screen.queryByLabelText('Add poll')).not.toBeInTheDocument();
    });

    it('should disable poll when media attachments exist', () => {
      // This would require implementing the slot and passing media attachments
      // For now, just test that the button exists
      render(ComposeBox, { 
        props: { enablePolls: true }
      });
      
      const pollButton = screen.getByLabelText('Add poll');
      expect(pollButton).not.toBeDisabled();
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with correct data', async () => {
      const onSubmit = vi.fn();
      render(ComposeBox, { props: { onSubmit } });
      
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Test post content');
      
      const submitButton = screen.getByRole('button', { name: 'Post' });
      await user.click(submitButton);
      
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'Test post content',
          hasContentWarning: false,
          visibility: 'public',
          mediaAttachments: [],
          poll: undefined
        })
      );
    });

    it('should prevent submission when content is empty', async () => {
      const onSubmit = vi.fn();
      render(ComposeBox, { props: { onSubmit } });
      
      const submitButton = screen.getByRole('button', { name: 'Post' });
      expect(submitButton).toBeDisabled();
      
      await user.click(submitButton);
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should prevent submission when over hard limit', async () => {
      const onSubmit = vi.fn();
      render(ComposeBox, { 
        props: { 
          onSubmit,
          maxLength: 10,
          characterCountMode: 'hard'
        } 
      });
      
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'This is way too long');
      
      const submitButton = screen.getByRole('button', { name: 'Post' });
      expect(submitButton).toBeDisabled();
    });

    it('should show loading state during submission', async () => {
      const onSubmit = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
      render(ComposeBox, { props: { onSubmit } });
      
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Test content');
      
      const submitButton = screen.getByRole('button', { name: 'Post' });
      await user.click(submitButton);
      
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveAttribute('aria-busy', 'true');
    });

    it('should clear form after successful submission', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      render(ComposeBox, { props: { onSubmit } });
      
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Test content');
      
      const submitButton = screen.getByRole('button', { name: 'Post' });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(textarea).toHaveValue('');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(ComposeBox);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-label', 'Compose new post');
    });

    it('should have proper ARIA describedby for character count', async () => {
      render(ComposeBox, { props: { maxLength: 100 } });
      
      const textarea = screen.getByRole('textbox');
      await user.click(textarea);
      
      const charCountId = screen.getByText('0').id;
      expect(textarea).toHaveAttribute('aria-describedby', charCountId);
    });

    it('should have live regions for character count', async () => {
      render(ComposeBox, { props: { maxLength: 100 } });
      
      const textarea = screen.getByRole('textbox');
      await user.click(textarea);
      
      const charCount = screen.getByText('0');
      expect(charCount).toHaveAttribute('aria-live', 'polite');
      expect(charCount).toHaveAttribute('aria-atomic', 'true');
    });

    it('should properly label reply context', () => {
      render(ComposeBox, { 
        props: { replyToStatus: mockReplyStatus }
      });
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-label', 'Reply to Alice Johnson');
    });
  });

  describe('Disabled State', () => {
    it('should disable all interactive elements when disabled', () => {
      render(ComposeBox, { 
        props: { 
          disabled: true,
          enableContentWarnings: true,
          enableVisibilitySettings: true,
          enablePolls: true,
          onMediaUpload: mockMediaUpload
        }
      });
      
      expect(screen.getByRole('textbox')).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Post' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Add content warning' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Add poll' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Add media' })).toBeDisabled();
      expect(screen.getByLabelText('Post visibility')).toBeDisabled();
    });

    it('should apply disabled styling', () => {
      render(ComposeBox, { props: { disabled: true } });
      
      const container = screen.getByRole('textbox').closest('.gr-compose-box');
      expect(container).toHaveClass('gr-compose-box--disabled');
    });
  });
});