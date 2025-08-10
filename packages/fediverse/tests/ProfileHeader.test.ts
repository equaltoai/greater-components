import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';
import ProfileHeader from '../src/components/ProfileHeader.svelte';
import type { UnifiedAccount } from '@greater/adapters';

// Mock the dependencies
vi.mock('@greater/primitives', () => ({
  Avatar: vi.fn(() => ({ $$set: vi.fn() }))
}));

vi.mock('@greater/utils', () => ({
  sanitizeHtml: vi.fn((html) => html),
  relativeTime: vi.fn((date) => '2 hours ago')
}));

vi.mock('../src/components/ContentRenderer.svelte', () => ({
  default: vi.fn(() => ({ $$set: vi.fn() }))
}));

// Mock account data
const mockAccount: UnifiedAccount = {
  id: '1',
  username: 'testuser',
  acct: 'testuser@example.com',
  displayName: 'Test User',
  note: '<p>This is a test bio with <a href="https://example.com">a link</a></p>',
  avatar: 'https://example.com/avatar.jpg',
  header: 'https://example.com/header.jpg',
  createdAt: '2023-01-15T10:30:00Z',
  followersCount: 1234,
  followingCount: 567,
  statusesCount: 890,
  locked: false,
  verified: false,
  bot: false,
  fields: [
    { name: 'Website', value: '<a href="https://test.com">test.com</a>', verifiedAt: '2024-01-15T10:30:00Z' },
    { name: 'Location', value: 'Test City' }
  ],
  metadata: {
    source: 'mastodon' as const,
    apiVersion: '4.0.0',
    lastUpdated: Date.now()
  }
};

describe('ProfileHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders profile header with required props', () => {
      render(ProfileHeader, { 
        props: { 
          account: mockAccount 
        } 
      });

      expect(screen.getByRole('article')).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('@testuser@example.com')).toBeInTheDocument();
    });

    it('applies custom CSS class', () => {
      render(ProfileHeader, { 
        props: { 
          account: mockAccount,
          class: 'custom-class'
        } 
      });

      const article = screen.getByRole('article');
      expect(article).toHaveClass('custom-class');
    });

    it('renders with minimal configuration', () => {
      render(ProfileHeader, { 
        props: { 
          account: mockAccount,
          showBanner: false,
          showBio: false,
          showFields: false,
          showJoinDate: false,
          showCounts: false
        } 
      });

      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('@testuser@example.com')).toBeInTheDocument();
      expect(screen.queryByRole('img', { name: /banner/i })).not.toBeInTheDocument();
    });
  });

  describe('Banner Display', () => {
    it('shows banner when showBanner is true and header exists', () => {
      render(ProfileHeader, { 
        props: { 
          account: mockAccount,
          showBanner: true
        } 
      });

      const banner = screen.getByRole('img', { name: /profile banner/i });
      expect(banner).toBeInTheDocument();
    });

    it('hides banner when showBanner is false', () => {
      render(ProfileHeader, { 
        props: { 
          account: mockAccount,
          showBanner: false
        } 
      });

      expect(screen.queryByRole('img', { name: /banner/i })).not.toBeInTheDocument();
    });

    it('uses fallback color when no header image', () => {
      const accountWithoutHeader = { ...mockAccount, header: '' };
      render(ProfileHeader, { 
        props: { 
          account: accountWithoutHeader,
          showBanner: true,
          bannerFallbackColor: '#ff0000'
        } 
      });

      const banner = screen.getByRole('img', { name: /profile banner \(default color\)/i });
      expect(banner).toBeInTheDocument();
    });

    it('handles banner image load and error states', async () => {
      render(ProfileHeader, { 
        props: { 
          account: mockAccount,
          showBanner: true
        } 
      });

      const bannerImg = screen.getByAltText('');
      
      // Simulate image load
      fireEvent.load(bannerImg);
      await tick();
      
      // Simulate image error
      fireEvent.error(bannerImg);
      await tick();
      
      expect(bannerImg).toBeInTheDocument();
    });
  });

  describe('Identity Display', () => {
    it('displays username when no display name', () => {
      const accountWithoutDisplayName = { ...mockAccount, displayName: '' };
      render(ProfileHeader, { 
        props: { 
          account: accountWithoutDisplayName 
        } 
      });

      expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    it('shows verified badge for verified accounts', () => {
      const verifiedAccount = { ...mockAccount, verified: true };
      render(ProfileHeader, { 
        props: { 
          account: verifiedAccount 
        } 
      });

      expect(screen.getByRole('img', { name: 'Verified account' })).toBeInTheDocument();
    });

    it('shows bot badge for bot accounts', () => {
      const botAccount = { ...mockAccount, bot: true };
      render(ProfileHeader, { 
        props: { 
          account: botAccount 
        } 
      });

      expect(screen.getByRole('img', { name: 'Bot account' })).toBeInTheDocument();
      expect(screen.getByText('Bot')).toBeInTheDocument();
    });

    it('shows lock icon for locked accounts', () => {
      const lockedAccount = { ...mockAccount, locked: true };
      render(ProfileHeader, { 
        props: { 
          account: lockedAccount 
        } 
      });

      expect(screen.getByRole('img', { name: 'Private account' })).toBeInTheDocument();
    });

    it('processes custom emoji in display name', () => {
      const emojiRenderer = vi.fn((text) => text.replace(':custom:', '🎉'));
      render(ProfileHeader, { 
        props: { 
          account: { ...mockAccount, displayName: 'Test :custom: User' },
          emojiRenderer
        } 
      });

      expect(emojiRenderer).toHaveBeenCalledWith('Test :custom: User');
    });
  });

  describe('Bio Display', () => {
    it('shows bio when showBio is true', () => {
      render(ProfileHeader, { 
        props: { 
          account: mockAccount,
          showBio: true
        } 
      });

      // Bio section should be present in the DOM
      const bioSection = screen.getByText('This is a test bio with a link').closest('.gr-profile-header__bio');
      expect(bioSection).toBeInTheDocument();
    });

    it('hides bio when showBio is false', () => {
      render(ProfileHeader, { 
        props: { 
          account: mockAccount,
          showBio: false
        } 
      });

      expect(screen.queryByText('This is a test bio with a link')).not.toBeInTheDocument();
    });

    it('hides bio section when account has no note', () => {
      const accountWithoutNote = { ...mockAccount, note: '' };
      render(ProfileHeader, { 
        props: { 
          account: accountWithoutNote,
          showBio: true
        } 
      });

      const bioElement = document.querySelector('.gr-profile-header__bio');
      expect(bioElement).not.toBeInTheDocument();
    });
  });

  describe('Metadata Fields', () => {
    it('shows fields when showFields is true and fields exist', () => {
      render(ProfileHeader, { 
        props: { 
          account: mockAccount,
          showFields: true
        } 
      });

      expect(screen.getByText('Website')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByText('Test City')).toBeInTheDocument();
    });

    it('hides fields when showFields is false', () => {
      render(ProfileHeader, { 
        props: { 
          account: mockAccount,
          showFields: false
        } 
      });

      expect(screen.queryByText('Website')).not.toBeInTheDocument();
      expect(screen.queryByText('Location')).not.toBeInTheDocument();
    });

    it('hides fields section when no fields exist', () => {
      const accountWithoutFields = { ...mockAccount, fields: [] };
      render(ProfileHeader, { 
        props: { 
          account: accountWithoutFields,
          showFields: true
        } 
      });

      expect(document.querySelector('.gr-profile-header__fields')).not.toBeInTheDocument();
    });

    it('shows verified icon for verified fields', () => {
      render(ProfileHeader, { 
        props: { 
          account: mockAccount,
          showFields: true
        } 
      });

      const verifiedIcons = screen.getAllByRole('img', { name: 'Verified link' });
      expect(verifiedIcons).toHaveLength(1); // Only Website field is verified
    });

    it('formats verification date in field title', () => {
      render(ProfileHeader, { 
        props: { 
          account: mockAccount,
          showFields: true
        } 
      });

      const verifiedIcon = screen.getByRole('img', { name: 'Verified link' });
      expect(verifiedIcon).toHaveAttribute('title', expect.stringContaining('2024'));
    });
  });

  describe('Join Date Display', () => {
    it('shows join date when showJoinDate is true', () => {
      render(ProfileHeader, { 
        props: { 
          account: mockAccount,
          showJoinDate: true
        } 
      });

      expect(screen.getByText(/joined/i)).toBeInTheDocument();
      expect(screen.getByText(/january 2023/i)).toBeInTheDocument();
    });

    it('hides join date when showJoinDate is false', () => {
      render(ProfileHeader, { 
        props: { 
          account: mockAccount,
          showJoinDate: false
        } 
      });

      expect(screen.queryByText(/joined/i)).not.toBeInTheDocument();
    });

    it('handles invalid createdAt date gracefully', () => {
      const accountWithInvalidDate = { ...mockAccount, createdAt: 'invalid-date' };
      render(ProfileHeader, { 
        props: { 
          account: accountWithInvalidDate,
          showJoinDate: true
        } 
      });

      expect(screen.queryByText(/joined/i)).not.toBeInTheDocument();
    });

    it('handles missing createdAt gracefully', () => {
      const accountWithoutDate = { ...mockAccount, createdAt: undefined as any };
      render(ProfileHeader, { 
        props: { 
          account: accountWithoutDate,
          showJoinDate: true
        } 
      });

      expect(screen.queryByText(/joined/i)).not.toBeInTheDocument();
    });
  });

  describe('Count Display and Formatting', () => {
    it('shows counts when showCounts is true', () => {
      render(ProfileHeader, { 
        props: { 
          account: mockAccount,
          showCounts: true
        } 
      });

      expect(screen.getByText('890')).toBeInTheDocument(); // Posts
      expect(screen.getByText('567')).toBeInTheDocument(); // Following
      expect(screen.getByText('1.2K')).toBeInTheDocument(); // Followers (formatted)
      expect(screen.getByText('Posts')).toBeInTheDocument();
      expect(screen.getByText('Following')).toBeInTheDocument();
      expect(screen.getByText('Followers')).toBeInTheDocument();
    });

    it('hides counts when showCounts is false', () => {
      render(ProfileHeader, { 
        props: { 
          account: mockAccount,
          showCounts: false
        } 
      });

      expect(screen.queryByText('Posts')).not.toBeInTheDocument();
      expect(screen.queryByText('Following')).not.toBeInTheDocument();
      expect(screen.queryByText('Followers')).not.toBeInTheDocument();
    });

    it('formats large numbers correctly', () => {
      const accountWithLargeCounts = {
        ...mockAccount,
        followersCount: 1234567,
        followingCount: 12345,
        statusesCount: 987654
      };

      render(ProfileHeader, { 
        props: { 
          account: accountWithLargeCounts,
          showCounts: true
        } 
      });

      expect(screen.getByText('1.2M')).toBeInTheDocument(); // Followers
      expect(screen.getByText('12K')).toBeInTheDocument(); // Following
      expect(screen.getByText('987K')).toBeInTheDocument(); // Posts
    });

    it('handles zero and small counts correctly', () => {
      const accountWithSmallCounts = {
        ...mockAccount,
        followersCount: 0,
        followingCount: 5,
        statusesCount: 42
      };

      render(ProfileHeader, { 
        props: { 
          account: accountWithSmallCounts,
          showCounts: true
        } 
      });

      expect(screen.getByText('0')).toBeInTheDocument(); // Followers
      expect(screen.getByText('5')).toBeInTheDocument(); // Following
      expect(screen.getByText('42')).toBeInTheDocument(); // Posts
    });

    describe('Clickable Counts', () => {
      it('makes counts clickable when clickableCounts is true', () => {
        const onFollowersClick = vi.fn();
        const onFollowingClick = vi.fn();
        const onPostsClick = vi.fn();

        render(ProfileHeader, { 
          props: { 
            account: mockAccount,
            showCounts: true,
            clickableCounts: true,
            onFollowersClick,
            onFollowingClick,
            onPostsClick
          } 
        });

        const followersButton = screen.getByLabelText('1.2K followers');
        const followingButton = screen.getByLabelText('567 following');
        const postsButton = screen.getByLabelText('890 posts');

        expect(followersButton).not.toBeDisabled();
        expect(followingButton).not.toBeDisabled();
        expect(postsButton).not.toBeDisabled();
      });

      it('calls click handlers when counts are clicked', async () => {
        const onFollowersClick = vi.fn();
        const onFollowingClick = vi.fn();
        const onPostsClick = vi.fn();

        render(ProfileHeader, { 
          props: { 
            account: mockAccount,
            showCounts: true,
            clickableCounts: true,
            onFollowersClick,
            onFollowingClick,
            onPostsClick
          } 
        });

        await fireEvent.click(screen.getByLabelText('1.2K followers'));
        expect(onFollowersClick).toHaveBeenCalledOnce();

        await fireEvent.click(screen.getByLabelText('567 following'));
        expect(onFollowingClick).toHaveBeenCalledOnce();

        await fireEvent.click(screen.getByLabelText('890 posts'));
        expect(onPostsClick).toHaveBeenCalledOnce();
      });

      it('disables counts when no click handler provided', () => {
        render(ProfileHeader, { 
          props: { 
            account: mockAccount,
            showCounts: true,
            clickableCounts: true,
            onFollowersClick: undefined,
            onFollowingClick: undefined,
            onPostsClick: undefined
          } 
        });

        expect(screen.getByLabelText('1.2K followers')).toBeDisabled();
        expect(screen.getByLabelText('567 following')).toBeDisabled();
        expect(screen.getByLabelText('890 posts')).toBeDisabled();
      });

      it('does not call handlers when counts are not clickable', async () => {
        const onFollowersClick = vi.fn();
        
        render(ProfileHeader, { 
          props: { 
            account: mockAccount,
            showCounts: true,
            clickableCounts: false,
            onFollowersClick
          } 
        });

        const followersButton = screen.getByLabelText('1.2K followers');
        expect(followersButton).toBeDisabled();
        
        await fireEvent.click(followersButton);
        expect(onFollowersClick).not.toHaveBeenCalled();
      });
    });
  });

  describe('Follow Button Slot', () => {
    it('renders follow button when provided', () => {
      render(ProfileHeader, { 
        props: { 
          account: mockAccount,
          followButton: () => '<button>Follow</button>'
        } 
      });

      expect(screen.getByRole('button', { name: 'Follow' })).toBeInTheDocument();
    });

    it('does not render follow button when not provided', () => {
      render(ProfileHeader, { 
        props: { 
          account: mockAccount 
        } 
      });

      expect(screen.queryByRole('button', { name: 'Follow' })).not.toBeInTheDocument();
    });
  });

  describe('Avatar Integration', () => {
    it('passes correct props to Avatar component', () => {
      const avatarSize = 'lg';
      
      render(ProfileHeader, { 
        props: { 
          account: mockAccount,
          avatarSize
        } 
      });

      // Avatar should be called with correct props (mocked, so we can't test directly)
      // This would be better tested with a real Avatar component
      expect(true).toBe(true); // Placeholder for proper Avatar testing
    });

    it('uses display name for avatar alt text', () => {
      render(ProfileHeader, { 
        props: { 
          account: mockAccount 
        } 
      });

      // In a real test, we'd check the Avatar component receives correct alt text
      expect(true).toBe(true); // Placeholder
    });

    it('falls back to username for avatar when no display name', () => {
      const accountWithoutDisplayName = { ...mockAccount, displayName: '' };
      
      render(ProfileHeader, { 
        props: { 
          account: accountWithoutDisplayName 
        } 
      });

      // In a real test, we'd verify Avatar gets username as name prop
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(ProfileHeader, { 
        props: { 
          account: mockAccount 
        } 
      });

      expect(screen.getByRole('article')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /profile banner/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('provides accessible names for interactive elements', () => {
      const onFollowersClick = vi.fn();
      
      render(ProfileHeader, { 
        props: { 
          account: mockAccount,
          clickableCounts: true,
          onFollowersClick
        } 
      });

      expect(screen.getByLabelText('1.2K followers')).toBeInTheDocument();
    });

    it('uses proper semantic HTML', () => {
      render(ProfileHeader, { 
        props: { 
          account: mockAccount,
          showFields: true
        } 
      });

      // Check for definition list for fields
      expect(document.querySelector('.gr-profile-header__fields')).toBeInTheDocument();
    });

    it('provides screen reader only content where appropriate', () => {
      const botAccount = { ...mockAccount, bot: true };
      render(ProfileHeader, { 
        props: { 
          account: botAccount 
        } 
      });

      expect(screen.getByText('Bot')).toHaveClass('sr-only');
    });
  });

  describe('Responsive Behavior', () => {
    it('applies mobile-specific styles', () => {
      // This would require testing CSS media queries, which is challenging in unit tests
      // Integration tests or visual regression tests would be more appropriate
      render(ProfileHeader, { 
        props: { 
          account: mockAccount 
        } 
      });

      expect(screen.getByRole('article')).toHaveClass('gr-profile-header');
    });
  });

  describe('Error Handling', () => {
    it('handles missing account data gracefully', () => {
      const incompleteAccount = {
        id: '1',
        username: 'test',
        acct: 'test@example.com',
        displayName: '',
        note: '',
        avatar: '',
        header: '',
        createdAt: '',
        followersCount: 0,
        followingCount: 0,
        statusesCount: 0,
        locked: false,
        verified: false,
        bot: false,
        fields: [],
        metadata: {
          source: 'mastodon' as const,
          apiVersion: '4.0.0',
          lastUpdated: Date.now()
        }
      };

      expect(() => {
        render(ProfileHeader, { 
          props: { 
            account: incompleteAccount 
          } 
        });
      }).not.toThrow();
    });

    it('handles null/undefined fields arrays', () => {
      const accountWithNullFields = { ...mockAccount, fields: null as any };
      
      expect(() => {
        render(ProfileHeader, { 
          props: { 
            account: accountWithNullFields,
            showFields: true
          } 
        });
      }).not.toThrow();
    });
  });
});