/**
 * ChatMessages Component Tests
 *
 * Tests for the scrollable message list container including:
 * - Scroll container rendering
 * - Auto-scroll on new messages
 * - Scroll-to-bottom button visibility
 * - Empty state display
 * - Loading skeleton state
 */

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import ChatMessagesHarness from './harness/ChatMessagesHarness.svelte';
import type { ChatMessage } from '../src/types.js';

const createMockMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
  id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
  role: 'user',
  content: 'Test message',
  timestamp: new Date(),
  status: 'complete',
  ...overrides,
});

describe('ChatMessages.svelte', () => {
  describe('Rendering', () => {
    it('renders scroll container', () => {
      const { container } = render(ChatMessagesHarness);
      
      expect(container.querySelector('.chat-messages')).toBeTruthy();
    });

    it('applies custom class', () => {
      const { container } = render(ChatMessagesHarness, {
        props: { class: 'custom-messages' },
      });
      
      expect(container.querySelector('.chat-messages.custom-messages')).toBeTruthy();
    });

    it('has proper ARIA attributes', () => {
      const { container } = render(ChatMessagesHarness);
      const messagesContainer = container.querySelector('.chat-messages');
      
      expect(messagesContainer).toHaveAttribute('role', 'log');
      expect(messagesContainer).toHaveAttribute('aria-label', 'Chat messages');
      expect(messagesContainer).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no messages', () => {
      const { container } = render(ChatMessagesHarness, {
        props: { messages: [] },
      });
      
      expect(container.querySelector('.chat-messages--empty')).toBeTruthy();
      expect(container.querySelector('.chat-messages__empty-state')).toBeTruthy();
    });

    it('displays welcome title', () => {
      const { getByText } = render(ChatMessagesHarness, {
        props: { 
          messages: [],
          welcomeTitle: 'Hello!',
        },
      });
      
      expect(getByText('Hello!')).toBeInTheDocument();
    });

    it('displays welcome message', () => {
      const { getByText } = render(ChatMessagesHarness, {
        props: { 
          messages: [],
          welcomeMessage: 'How can I assist you?',
        },
      });
      
      expect(getByText('How can I assist you?')).toBeInTheDocument();
    });

    it('displays suggestions in empty state', () => {
      const suggestions = ['Tell me a joke', 'What can you do?'];
      const { getByText } = render(ChatMessagesHarness, {
        props: { 
          messages: [],
          suggestions,
        },
      });
      
      expect(getByText('Tell me a joke')).toBeInTheDocument();
      expect(getByText('What can you do?')).toBeInTheDocument();
    });

    it('calls onSuggestionClick when suggestion is clicked', async () => {
      const onSuggestionClick = vi.fn();
      const suggestions = ['Tell me a joke'];
      
      const { getByText } = render(ChatMessagesHarness, {
        props: { 
          messages: [],
          suggestions,
          onSuggestionClick,
        },
      });
      
      await fireEvent.click(getByText('Tell me a joke'));
      
      expect(onSuggestionClick).toHaveBeenCalledWith('Tell me a joke');
    });
  });

  describe('Message List', () => {
    it('renders messages when provided', () => {
      const messages = [
        createMockMessage({ role: 'user', content: 'Hello' }),
        createMockMessage({ role: 'assistant', content: 'Hi there!' }),
      ];
      
      const { container } = render(ChatMessagesHarness, {
        props: { messages },
      });
      
      expect(container.querySelector('.chat-messages__list')).toBeTruthy();
      expect(container.textContent).toContain('Hello');
      expect(container.textContent).toContain('Hi there!');
    });

    it('does not show empty state when messages exist', () => {
      const messages = [createMockMessage()];
      
      const { container } = render(ChatMessagesHarness, {
        props: { messages },
      });
      
      expect(container.querySelector('.chat-messages__empty-state')).toBeFalsy();
    });
  });

  describe('Loading State', () => {
    it('shows loading skeleton when loading with no messages', () => {
      const { container } = render(ChatMessagesHarness, {
        props: { messages: [], loading: true },
      });
      
      expect(container.querySelector('.chat-messages__loading')).toBeTruthy();
      expect(container.querySelector('.chat-messages__skeleton')).toBeTruthy();
    });

    it('applies loading class', () => {
      const { container } = render(ChatMessagesHarness, {
        props: { messages: [], loading: true },
      });
      
      expect(container.querySelector('.chat-messages--loading')).toBeTruthy();
    });
  });

  describe('Streaming State', () => {
    it('applies streaming class when streaming', () => {
      const messages = [createMockMessage()];
      
      const { container } = render(ChatMessagesHarness, {
        props: { messages, streaming: true },
      });
      
      expect(container.querySelector('.chat-messages--streaming')).toBeTruthy();
    });
  });

  describe('Scroll Behavior', () => {
    it('renders scroll anchor element', () => {
      const messages = [createMockMessage()];
      
      const { container } = render(ChatMessagesHarness, {
        props: { messages },
      });
      
      expect(container.querySelector('.chat-messages__scroll-anchor')).toBeTruthy();
    });

    it('scroll anchor is hidden from accessibility tree', () => {
      const messages = [createMockMessage()];
      
      const { container } = render(ChatMessagesHarness, {
        props: { messages },
      });
      
      const anchor = container.querySelector('.chat-messages__scroll-anchor');
      expect(anchor).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Avatar Configuration', () => {
    it('respects showAvatars prop', () => {
      const messages = [createMockMessage({ role: 'user', content: 'Hello' })];
      
      const { container } = render(ChatMessagesHarness, {
        props: { messages, showAvatars: true },
      });
      
      // Avatar should be rendered when showAvatars is true
      expect(container.querySelector('.chat-message__avatar')).toBeTruthy();
    });
  });
});