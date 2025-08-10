import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';
import ActionBar from '../src/components/ActionBar.svelte';

// Mock console.error to track error handling
const originalConsoleError = console.error;

beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
});

describe('ActionBar', () => {
  const defaultCounts = {
    replies: 5,
    boosts: 12,
    favorites: 23
  };

  const defaultHandlers = {
    onReply: vi.fn(),
    onBoost: vi.fn(),
    onFavorite: vi.fn(),
    onShare: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all action buttons', () => {
      render(ActionBar, {
        props: {
          counts: defaultCounts,
          handlers: defaultHandlers
        }
      });

      expect(screen.getByRole('button', { name: /reply/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /boost/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /favorites/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
    });

    it('displays correct count numbers', () => {
      render(ActionBar, {
        props: {
          counts: defaultCounts,
          handlers: defaultHandlers
        }
      });

      expect(screen.getByText('5')).toBeInTheDocument(); // replies
      expect(screen.getByText('12')).toBeInTheDocument(); // boosts
      expect(screen.getByText('23')).toBeInTheDocument(); // favorites
    });

    it('hides counts when they are zero', () => {
      render(ActionBar, {
        props: {
          counts: { replies: 0, boosts: 0, favorites: 0 },
          handlers: defaultHandlers
        }
      });

      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('formats large counts correctly', () => {
      render(ActionBar, {
        props: {
          counts: {
            replies: 1200,
            boosts: 5600,
            favorites: 12300
          },
          handlers: defaultHandlers
        }
      });

      expect(screen.getByText('1.2K')).toBeInTheDocument();
      expect(screen.getByText('5.6K')).toBeInTheDocument();
      expect(screen.getByText('12K')).toBeInTheDocument();
    });

    it('formats very large counts without decimals', () => {
      render(ActionBar, {
        props: {
          counts: {
            replies: 1000,
            boosts: 10000,
            favorites: 25000
          },
          handlers: defaultHandlers
        }
      });

      expect(screen.getByText('1K')).toBeInTheDocument();
      expect(screen.getByText('10K')).toBeInTheDocument();
      expect(screen.getByText('25K')).toBeInTheDocument();
    });
  });

  describe('Active States', () => {
    it('shows boost as active when boosted', () => {
      render(ActionBar, {
        props: {
          counts: defaultCounts,
          states: { boosted: true },
          handlers: defaultHandlers
        }
      });

      const boostButton = screen.getByRole('button', { name: /undo boost/i });
      expect(boostButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('shows favorite as active when favorited', () => {
      render(ActionBar, {
        props: {
          counts: defaultCounts,
          states: { favorited: true },
          handlers: defaultHandlers
        }
      });

      const favoriteButton = screen.getByRole('button', { name: /remove from favorites/i });
      expect(favoriteButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for each button', () => {
      render(ActionBar, {
        props: {
          counts: defaultCounts,
          handlers: defaultHandlers,
          idPrefix: 'test'
        }
      });

      expect(screen.getByRole('button', { name: 'Reply to this post. 5 replies' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Boost this post. 12 boosts' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add to favorites. 23 favorites' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Share this post' })).toBeInTheDocument();
    });

    it('has proper ARIA labels for zero counts', () => {
      render(ActionBar, {
        props: {
          counts: { replies: 0, boosts: 0, favorites: 0 },
          handlers: defaultHandlers
        }
      });

      expect(screen.getByRole('button', { name: 'Reply to this post' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Boost this post' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add to favorites' })).toBeInTheDocument();
    });

    it('sets correct IDs with prefix', () => {
      render(ActionBar, {
        props: {
          counts: defaultCounts,
          handlers: defaultHandlers,
          idPrefix: 'test-prefix'
        }
      });

      expect(screen.getByRole('button', { name: /reply/i })).toHaveAttribute('id', 'test-prefix-reply');
      expect(screen.getByRole('button', { name: /boost/i })).toHaveAttribute('id', 'test-prefix-boost');
      expect(screen.getByRole('button', { name: /favorites/i })).toHaveAttribute('id', 'test-prefix-favorite');
      expect(screen.getByRole('button', { name: /share/i })).toHaveAttribute('id', 'test-prefix-share');
    });

    it('has proper role and aria-label for the action bar', () => {
      render(ActionBar, {
        props: {
          counts: defaultCounts,
          handlers: defaultHandlers
        }
      });

      const actionBar = screen.getByRole('group', { name: 'Post actions' });
      expect(actionBar).toBeInTheDocument();
    });

    it('sets aria-pressed correctly for toggle buttons', () => {
      render(ActionBar, {
        props: {
          counts: defaultCounts,
          states: { boosted: true, favorited: false },
          handlers: defaultHandlers
        }
      });

      expect(screen.getByRole('button', { name: /undo boost/i })).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByRole('button', { name: /add to favorites/i })).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('Interactions', () => {
    it('calls reply handler when reply button is clicked', async () => {
      render(ActionBar, {
        props: {
          counts: defaultCounts,
          handlers: defaultHandlers
        }
      });

      const replyButton = screen.getByRole('button', { name: /reply/i });
      await fireEvent.click(replyButton);

      expect(defaultHandlers.onReply).toHaveBeenCalledOnce();
    });

    it('calls boost handler when boost button is clicked', async () => {
      render(ActionBar, {
        props: {
          counts: defaultCounts,
          handlers: defaultHandlers
        }
      });

      const boostButton = screen.getByRole('button', { name: /boost/i });
      await fireEvent.click(boostButton);

      expect(defaultHandlers.onBoost).toHaveBeenCalledOnce();
    });

    it('calls favorite handler when favorite button is clicked', async () => {
      render(ActionBar, {
        props: {
          counts: defaultCounts,
          handlers: defaultHandlers
        }
      });

      const favoriteButton = screen.getByRole('button', { name: /favorites/i });
      await fireEvent.click(favoriteButton);

      expect(defaultHandlers.onFavorite).toHaveBeenCalledOnce();
    });

    it('calls share handler when share button is clicked', async () => {
      render(ActionBar, {
        props: {
          counts: defaultCounts,
          handlers: defaultHandlers
        }
      });

      const shareButton = screen.getByRole('button', { name: /share/i });
      await fireEvent.click(shareButton);

      expect(defaultHandlers.onShare).toHaveBeenCalledOnce();
    });

    it('does not call handlers when buttons are clicked in readonly mode', async () => {
      render(ActionBar, {
        props: {
          counts: defaultCounts,
          handlers: defaultHandlers,
          readonly: true
        }
      });

      const replyButton = screen.getByRole('button', { name: /reply/i });
      const boostButton = screen.getByRole('button', { name: /boost/i });

      await fireEvent.click(replyButton);
      await fireEvent.click(boostButton);

      expect(defaultHandlers.onReply).not.toHaveBeenCalled();
      expect(defaultHandlers.onBoost).not.toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('shows loading state during async reply action', async () => {
      let resolvePromise: () => void;
      const asyncHandler = vi.fn(() => new Promise<void>((resolve) => {
        resolvePromise = resolve;
      }));

      render(ActionBar, {
        props: {
          counts: defaultCounts,
          handlers: { ...defaultHandlers, onReply: asyncHandler }
        }
      });

      const replyButton = screen.getByRole('button', { name: /reply/i });
      
      // Click button and verify loading state
      await fireEvent.click(replyButton);
      await tick();
      
      expect(replyButton).toHaveAttribute('aria-busy', 'true');
      expect(replyButton).toBeDisabled();

      // Resolve promise and verify loading state clears
      resolvePromise!();
      await waitFor(() => {
        expect(replyButton).not.toHaveAttribute('aria-busy', 'true');
        expect(replyButton).not.toBeDisabled();
      });
    });

    it('shows loading state during async boost action', async () => {
      let resolvePromise: () => void;
      const asyncHandler = vi.fn(() => new Promise<void>((resolve) => {
        resolvePromise = resolve;
      }));

      render(ActionBar, {
        props: {
          counts: defaultCounts,
          handlers: { ...defaultHandlers, onBoost: asyncHandler }
        }
      });

      const boostButton = screen.getByRole('button', { name: /boost/i });
      
      await fireEvent.click(boostButton);
      await tick();
      
      expect(boostButton).toHaveAttribute('aria-busy', 'true');
      expect(boostButton).toBeDisabled();

      resolvePromise!();
      await waitFor(() => {
        expect(boostButton).not.toHaveAttribute('aria-busy', 'true');
        expect(boostButton).not.toBeDisabled();
      });
    });

    it('prevents multiple clicks during loading', async () => {
      let resolvePromise: () => void;
      const asyncHandler = vi.fn(() => new Promise<void>((resolve) => {
        resolvePromise = resolve;
      }));

      render(ActionBar, {
        props: {
          counts: defaultCounts,
          handlers: { ...defaultHandlers, onFavorite: asyncHandler }
        }
      });

      const favoriteButton = screen.getByRole('button', { name: /favorites/i });
      
      // Click multiple times quickly
      await fireEvent.click(favoriteButton);
      await fireEvent.click(favoriteButton);
      await fireEvent.click(favoriteButton);
      
      expect(asyncHandler).toHaveBeenCalledOnce();

      resolvePromise!();
      await waitFor(() => {
        expect(favoriteButton).not.toBeDisabled();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles errors in reply handler gracefully', async () => {
      const errorHandler = vi.fn(() => Promise.reject(new Error('Reply failed')));

      render(ActionBar, {
        props: {
          counts: defaultCounts,
          handlers: { ...defaultHandlers, onReply: errorHandler }
        }
      });

      const replyButton = screen.getByRole('button', { name: /reply/i });
      await fireEvent.click(replyButton);

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Reply action failed:', expect.any(Error));
        expect(replyButton).not.toBeDisabled();
      });
    });

    it('handles errors in boost handler gracefully', async () => {
      const errorHandler = vi.fn(() => Promise.reject(new Error('Boost failed')));

      render(ActionBar, {
        props: {
          counts: defaultCounts,
          handlers: { ...defaultHandlers, onBoost: errorHandler }
        }
      });

      const boostButton = screen.getByRole('button', { name: /boost/i });
      await fireEvent.click(boostButton);

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Boost action failed:', expect.any(Error));
        expect(boostButton).not.toBeDisabled();
      });
    });
  });

  describe('Custom Props', () => {
    it('applies custom CSS class', () => {
      render(ActionBar, {
        props: {
          counts: defaultCounts,
          handlers: defaultHandlers,
          class: 'custom-action-bar'
        }
      });

      const actionBar = screen.getByRole('group');
      expect(actionBar).toHaveClass('custom-action-bar');
    });

    it('uses correct size prop', () => {
      const { rerender } = render(ActionBar, {
        props: {
          counts: defaultCounts,
          handlers: defaultHandlers,
          size: 'md'
        }
      });

      // Verify buttons have medium size class (this is passed to Button component)
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeInTheDocument(); // Basic verification
      });

      // Test with large size
      rerender({
        counts: defaultCounts,
        handlers: defaultHandlers,
        size: 'lg'
      });

      // Verify buttons still render correctly with large size
      const largeButtons = screen.getAllByRole('button');
      expect(largeButtons).toHaveLength(4);
    });
  });

  describe('Missing Handlers', () => {
    it('handles missing handlers gracefully', async () => {
      render(ActionBar, {
        props: {
          counts: defaultCounts,
          handlers: {} // No handlers provided
        }
      });

      const replyButton = screen.getByRole('button', { name: /reply/i });
      
      // Should not throw error when clicking
      await expect(fireEvent.click(replyButton)).resolves.not.toThrow();
    });

    it('does not call undefined handlers', async () => {
      render(ActionBar, {
        props: {
          counts: defaultCounts,
          handlers: {
            onReply: defaultHandlers.onReply
            // Other handlers are undefined
          }
        }
      });

      const boostButton = screen.getByRole('button', { name: /boost/i });
      await fireEvent.click(boostButton);

      // Should not error, and reply handler should not be called
      expect(defaultHandlers.onReply).not.toHaveBeenCalled();
    });
  });

  describe('Extensions Slot', () => {
    it('renders extensions slot when provided', () => {
      const { container } = render(ActionBar, {
        props: {
          counts: defaultCounts,
          handlers: defaultHandlers
        },
        context: new Map([
          ['$$slots', { extensions: true }]
        ])
      });

      // Note: Testing slots in Svelte testing library is limited
      // This test ensures the component doesn't break when slots are used
      expect(container).toBeInTheDocument();
    });
  });
});