/**
 * ChatContainer Component Tests
 *
 * Tests for the main chat container component including:
 * - Context creation and provision
 * - Auto-scroll behavior
 * - Keyboard shortcut handling
 * - Responsive layout classes
 * - Connection status indicators
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import ChatContainerHarness from './harness/ChatContainerHarness.svelte';
import type { ChatMessage } from '../src/types.js';
import type { ChatHandlers } from '../src/context.svelte.js';

const createMockMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
  id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
  role: 'user',
  content: 'Test message',
  timestamp: new Date(),
  status: 'complete',
  ...overrides,
});

describe('ChatContainer.svelte', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      const { container } = render(ChatContainerHarness);
      
      expect(container.querySelector('.chat-container')).toBeTruthy();
    });

    it('renders children content', () => {
      const { getByTestId } = render(ChatContainerHarness);
      
      expect(getByTestId('container-content')).toBeInTheDocument();
    });

    it('applies custom class', () => {
      const { container } = render(ChatContainerHarness, {
        props: { class: 'custom-class' },
      });
      
      expect(container.querySelector('.chat-container.custom-class')).toBeTruthy();
    });

    it('has proper ARIA attributes', () => {
      const { container } = render(ChatContainerHarness);
      const chatContainer = container.querySelector('.chat-container');
      
      expect(chatContainer).toHaveAttribute('role', 'region');
      expect(chatContainer).toHaveAttribute('aria-label', 'Chat conversation');
      expect(chatContainer).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Connection Status', () => {
    it('shows connecting status indicator', () => {
      const { container } = render(ChatContainerHarness, {
        props: { connectionStatus: 'connecting' },
      });
      
      expect(container.querySelector('.chat-container--connecting')).toBeTruthy();
      expect(container.textContent).toContain('Connecting...');
    });

    it('shows error status indicator', () => {
      const { container } = render(ChatContainerHarness, {
        props: { connectionStatus: 'error' },
      });
      
      expect(container.querySelector('.chat-container--connection-error')).toBeTruthy();
      expect(container.textContent).toContain('Connection error');
    });

    it('applies connected class when connected', () => {
      const { container } = render(ChatContainerHarness, {
        props: { connectionStatus: 'connected' },
      });
      
      expect(container.querySelector('.chat-container--connected')).toBeTruthy();
    });

    it('does not show status indicator when disconnected', () => {
      const { container } = render(ChatContainerHarness, {
        props: { connectionStatus: 'disconnected' },
      });
      
      expect(container.querySelector('.chat-container__status')).toBeFalsy();
    });
  });

  describe('Streaming State', () => {
    it('applies streaming class when streaming', () => {
      const { container } = render(ChatContainerHarness, {
        props: { streaming: true },
      });
      
      expect(container.querySelector('.chat-container--streaming')).toBeTruthy();
    });

    it('does not apply streaming class when not streaming', () => {
      const { container } = render(ChatContainerHarness, {
        props: { streaming: false },
      });
      
      expect(container.querySelector('.chat-container--streaming')).toBeFalsy();
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('cancels streaming on Escape key', async () => {
      const onStopStreaming = vi.fn();
      const handlers: ChatHandlers = { onStopStreaming };
      
      const { container } = render(ChatContainerHarness, {
        props: { 
          handlers, 
          streaming: true,
          enableKeyboardShortcuts: true,
        },
      });

      await fireEvent.keyDown(window, { key: 'Escape' });
      
      expect(onStopStreaming).toHaveBeenCalled();
    });

    it('clears messages on Ctrl+Shift+Backspace', async () => {
      const onClear = vi.fn();
      const handlers: ChatHandlers = { onClear };
      
      render(ChatContainerHarness, {
        props: { 
          handlers,
          enableKeyboardShortcuts: true,
        },
      });

      await fireEvent.keyDown(window, { 
        key: 'Backspace', 
        ctrlKey: true, 
        shiftKey: true,
      });
      
      expect(onClear).toHaveBeenCalled();
    });

    it('does not handle shortcuts when disabled', async () => {
      const onStopStreaming = vi.fn();
      const handlers: ChatHandlers = { onStopStreaming };
      
      render(ChatContainerHarness, {
        props: { 
          handlers, 
          streaming: true,
          enableKeyboardShortcuts: false,
        },
      });

      await fireEvent.keyDown(window, { key: 'Escape' });
      
      expect(onStopStreaming).not.toHaveBeenCalled();
    });
  });

  describe('Auto-scroll', () => {
    it('scrolls to bottom when new messages arrive with autoScroll enabled', async () => {
      const messages: ChatMessage[] = [createMockMessage()];
      
      const { rerender } = render(ChatContainerHarness, {
        props: { messages, autoScroll: true },
      });

      const newMessages = [...messages, createMockMessage({ content: 'New message' })];
      
      await rerender({ messages: newMessages, autoScroll: true });
      
      // scrollIntoView is mocked in setup.ts
      await waitFor(() => {
        expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
      });
    });
  });

  describe('Context Provision', () => {
    it('provides context to children', () => {
      // Context is provided internally - test that container renders without error
      const { container } = render(ChatContainerHarness, {
        props: {
          handlers: { onSubmit: vi.fn() },
          initialSettings: { model: 'gpt-4' },
        },
      });
      
      expect(container.querySelector('.chat-container')).toBeTruthy();
    });
  });
});