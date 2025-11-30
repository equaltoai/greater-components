/**
 * ChatSuggestions Component Tests
 *
 * Tests for the quick prompt suggestions component including:
 * - Pills variant rendering
 * - Cards variant rendering
 * - onSelect callback
 * - Keyboard navigation
 * - Accessibility
 */

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ChatSuggestionsHarness from './harness/ChatSuggestionsHarness.svelte';

describe('ChatSuggestions.svelte', () => {
  describe('Rendering', () => {
    it('renders suggestions container', () => {
      const onSelect = vi.fn();
      const { container } = render(ChatSuggestionsHarness, {
        props: { 
          suggestions: ['Hello', 'World'],
          onSelect,
        },
      });
      
      expect(container.querySelector('.chat-suggestions')).toBeTruthy();
    });

    it('renders all suggestions', () => {
      const onSelect = vi.fn();
      const suggestions = ['Option 1', 'Option 2', 'Option 3'];
      
      const { getByText } = render(ChatSuggestionsHarness, {
        props: { suggestions, onSelect },
      });
      
      expect(getByText('Option 1')).toBeInTheDocument();
      expect(getByText('Option 2')).toBeInTheDocument();
      expect(getByText('Option 3')).toBeInTheDocument();
    });

    it('applies custom class', () => {
      const onSelect = vi.fn();
      const { container } = render(ChatSuggestionsHarness, {
        props: { 
          suggestions: ['Hello'],
          onSelect,
          class: 'custom-suggestions',
        },
      });
      
      expect(container.querySelector('.chat-suggestions.custom-suggestions')).toBeTruthy();
    });
  });

  describe('Pills Variant', () => {
    it('applies pills variant class', () => {
      const onSelect = vi.fn();
      const { container } = render(ChatSuggestionsHarness, {
        props: { 
          suggestions: ['Hello'],
          onSelect,
          variant: 'pills',
        },
      });
      
      expect(container.querySelector('.chat-suggestions--pills')).toBeTruthy();
    });

    it('renders suggestions as pill buttons', () => {
      const onSelect = vi.fn();
      const { container } = render(ChatSuggestionsHarness, {
        props: { 
          suggestions: ['Hello', 'World'],
          onSelect,
          variant: 'pills',
        },
      });
      
      const items = container.querySelectorAll('.chat-suggestions__item');
      expect(items.length).toBe(2);
    });
  });

  describe('Cards Variant', () => {
    it('applies cards variant class', () => {
      const onSelect = vi.fn();
      const { container } = render(ChatSuggestionsHarness, {
        props: { 
          suggestions: ['Hello'],
          onSelect,
          variant: 'cards',
        },
      });
      
      expect(container.querySelector('.chat-suggestions--cards')).toBeTruthy();
    });

    it('displays description in cards variant', () => {
      const onSelect = vi.fn();
      const suggestions = [
        { text: 'Option 1', description: 'Description for option 1' },
      ];
      
      const { getByText } = render(ChatSuggestionsHarness, {
        props: { 
          suggestions,
          onSelect,
          variant: 'cards',
        },
      });
      
      expect(getByText('Option 1')).toBeInTheDocument();
      expect(getByText('Description for option 1')).toBeInTheDocument();
    });

    it('does not display description in pills variant', () => {
      const onSelect = vi.fn();
      const suggestions = [
        { text: 'Option 1', description: 'Description for option 1' },
      ];
      
      const { queryByText } = render(ChatSuggestionsHarness, {
        props: { 
          suggestions,
          onSelect,
          variant: 'pills',
        },
      });
      
      expect(queryByText('Description for option 1')).toBeFalsy();
    });
  });

  describe('onSelect Callback', () => {
    it('calls onSelect when suggestion is clicked', async () => {
      const onSelect = vi.fn();
      const { getByText } = render(ChatSuggestionsHarness, {
        props: { 
          suggestions: ['Click me'],
          onSelect,
        },
      });
      
      await fireEvent.click(getByText('Click me'));
      
      expect(onSelect).toHaveBeenCalledWith('Click me');
    });

    it('calls onSelect with correct suggestion text', async () => {
      const onSelect = vi.fn();
      const { getByText } = render(ChatSuggestionsHarness, {
        props: { 
          suggestions: ['Option A', 'Option B'],
          onSelect,
        },
      });
      
      await fireEvent.click(getByText('Option B'));
      
      expect(onSelect).toHaveBeenCalledWith('Option B');
    });

    it('calls onSelect with text from object suggestion', async () => {
      const onSelect = vi.fn();
      const suggestions = [
        { text: 'Object Option', description: 'Some description' },
      ];
      
      const { getByText } = render(ChatSuggestionsHarness, {
        props: { suggestions, onSelect, variant: 'cards' },
      });
      
      await fireEvent.click(getByText('Object Option'));
      
      expect(onSelect).toHaveBeenCalledWith('Object Option');
    });
  });

  describe('Keyboard Navigation', () => {
    it('triggers onSelect on Enter key', async () => {
      const onSelect = vi.fn();
      const { container } = render(ChatSuggestionsHarness, {
        props: { 
          suggestions: ['Press Enter'],
          onSelect,
        },
      });
      
      const item = container.querySelector('.chat-suggestions__item')!;
      await fireEvent.keyDown(item, { key: 'Enter' });
      
      expect(onSelect).toHaveBeenCalledWith('Press Enter');
    });

    it('triggers onSelect on Space key', async () => {
      const onSelect = vi.fn();
      const { container } = render(ChatSuggestionsHarness, {
        props: { 
          suggestions: ['Press Space'],
          onSelect,
        },
      });
      
      const item = container.querySelector('.chat-suggestions__item')!;
      await fireEvent.keyDown(item, { key: ' ' });
      
      expect(onSelect).toHaveBeenCalledWith('Press Space');
    });

    it('does not trigger on other keys', async () => {
      const onSelect = vi.fn();
      const { container } = render(ChatSuggestionsHarness, {
        props: { 
          suggestions: ['Test'],
          onSelect,
        },
      });
      
      const item = container.querySelector('.chat-suggestions__item')!;
      await fireEvent.keyDown(item, { key: 'a' });
      
      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('container has role="group"', () => {
      const onSelect = vi.fn();
      const { container } = render(ChatSuggestionsHarness, {
        props: { 
          suggestions: ['Hello'],
          onSelect,
        },
      });
      
      expect(container.querySelector('.chat-suggestions')).toHaveAttribute('role', 'group');
    });

    it('container has aria-label', () => {
      const onSelect = vi.fn();
      const { container } = render(ChatSuggestionsHarness, {
        props: { 
          suggestions: ['Hello'],
          onSelect,
        },
      });
      
      expect(container.querySelector('.chat-suggestions')).toHaveAttribute('aria-label', 'Suggested prompts');
    });

    it('items have aria-label', () => {
      const onSelect = vi.fn();
      const { container } = render(ChatSuggestionsHarness, {
        props: { 
          suggestions: ['Test suggestion'],
          onSelect,
        },
      });
      
      const item = container.querySelector('.chat-suggestions__item');
      expect(item).toHaveAttribute('aria-label', 'Suggestion: Test suggestion');
    });

    it('items are focusable', () => {
      const onSelect = vi.fn();
      const { container } = render(ChatSuggestionsHarness, {
        props: { 
          suggestions: ['Hello'],
          onSelect,
        },
      });
      
      const item = container.querySelector('.chat-suggestions__item');
      expect(item).toHaveAttribute('tabindex', '0');
    });

    it('items are buttons', () => {
      const onSelect = vi.fn();
      const { container } = render(ChatSuggestionsHarness, {
        props: { 
          suggestions: ['Hello'],
          onSelect,
        },
      });
      
      const item = container.querySelector('.chat-suggestions__item');
      expect(item?.tagName.toLowerCase()).toBe('button');
      expect(item).toHaveAttribute('type', 'button');
    });
  });

  describe('String and Object Suggestions', () => {
    it('handles string suggestions', () => {
      const onSelect = vi.fn();
      const { getByText } = render(ChatSuggestionsHarness, {
        props: { 
          suggestions: ['String option'],
          onSelect,
        },
      });
      
      expect(getByText('String option')).toBeInTheDocument();
    });

    it('handles object suggestions', () => {
      const onSelect = vi.fn();
      const suggestions = [{ text: 'Object option' }];
      
      const { getByText } = render(ChatSuggestionsHarness, {
        props: { suggestions, onSelect },
      });
      
      expect(getByText('Object option')).toBeInTheDocument();
    });

    it('handles mixed suggestions', () => {
      const onSelect = vi.fn();
      const suggestions = [
        'String option',
        { text: 'Object option', description: 'With description' },
      ];
      
      const { getByText } = render(ChatSuggestionsHarness, {
        props: { suggestions, onSelect, variant: 'cards' },
      });
      
      expect(getByText('String option')).toBeInTheDocument();
      expect(getByText('Object option')).toBeInTheDocument();
    });
  });
});