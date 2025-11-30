/**
 * ChatSettings Component Tests
 *
 * Tests for the chat settings modal component including:
 * - Modal open/close
 * - Settings controls
 * - onSettingsChange callback
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import ChatSettingsHarness from './harness/ChatSettingsHarness.svelte';
import type { ChatSettingsState } from '../src/types.js';

const createDefaultSettings = (): ChatSettingsState => ({
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 4096,
});

describe('ChatSettings.svelte', () => {
  describe('Modal Behavior', () => {
    it('does not render content when closed', () => {
      const { container } = render(ChatSettingsHarness, {
        props: { 
          open: false,
          settings: createDefaultSettings(),
        },
      });
      
      // Modal content should not be visible when closed
      expect(container.querySelector('.chat-settings__content')).toBeFalsy();
    });

    it('renders content when open', () => {
      const { container } = render(ChatSettingsHarness, {
        props: { 
          open: true,
          settings: createDefaultSettings(),
        },
      });
      
      expect(container.querySelector('.chat-settings__content')).toBeTruthy();
    });

    it('displays modal title', () => {
      const { getByText } = render(ChatSettingsHarness, {
        props: { 
          open: true,
          settings: createDefaultSettings(),
        },
      });
      
      expect(getByText('Chat Settings')).toBeInTheDocument();
    });

    it('calls onClose when cancel button is clicked', async () => {
      const onClose = vi.fn();
      const { getByText } = render(ChatSettingsHarness, {
        props: { 
          open: true,
          settings: createDefaultSettings(),
          onClose,
        },
      });
      
      await fireEvent.click(getByText('Cancel'));
      
      expect(onClose).toHaveBeenCalled();
    });

    it('calls onSave when save button is clicked', async () => {
      const onSave = vi.fn();
      const { getByText } = render(ChatSettingsHarness, {
        props: { 
          open: true,
          settings: createDefaultSettings(),
          onSave,
        },
      });
      
      await fireEvent.click(getByText('Save Settings'));
      
      expect(onSave).toHaveBeenCalled();
    });
  });

  describe('Model Selection', () => {
    it('displays model select', () => {
      const { container } = render(ChatSettingsHarness, {
        props: { 
          open: true,
          settings: createDefaultSettings(),
        },
      });
      
      expect(container.querySelector('select')).toBeTruthy();
    });

    it('displays available models', () => {
      const availableModels = [
        { id: 'gpt-4', name: 'GPT-4' },
        { id: 'claude-3', name: 'Claude 3' },
      ];
      
      const { container } = render(ChatSettingsHarness, {
        props: { 
          open: true,
          settings: createDefaultSettings(),
          availableModels,
        },
      });
      
      const select = container.querySelector('select');
      expect(select?.textContent).toContain('GPT-4');
    });

    it('calls onSettingsChange when model is changed', async () => {
      const onSettingsChange = vi.fn();
      const availableModels = [
        { id: 'gpt-4', name: 'GPT-4' },
        { id: 'claude-3', name: 'Claude 3' },
      ];
      
      const { container } = render(ChatSettingsHarness, {
        props: { 
          open: true,
          settings: createDefaultSettings(),
          availableModels,
          onSettingsChange,
        },
      });
      
      const select = container.querySelector('select')!;
      await fireEvent.change(select, { target: { value: 'claude-3' } });
      
      expect(onSettingsChange).toHaveBeenCalled();
    });
  });

  describe('Temperature Slider', () => {
    it('displays temperature slider', () => {
      const { container } = render(ChatSettingsHarness, {
        props: { 
          open: true,
          settings: createDefaultSettings(),
        },
      });
      
      const slider = container.querySelector('input[type="range"]');
      expect(slider).toBeTruthy();
    });

    it('displays current temperature value', () => {
      const { container } = render(ChatSettingsHarness, {
        props: { 
          open: true,
          settings: { ...createDefaultSettings(), temperature: 0.7 },
        },
      });
      
      expect(container.textContent).toContain('0.7');
    });

    it('slider has correct min/max values', () => {
      const { container } = render(ChatSettingsHarness, {
        props: { 
          open: true,
          settings: createDefaultSettings(),
        },
      });
      
      const slider = container.querySelector('input[type="range"]');
      expect(slider).toHaveAttribute('min', '0');
      expect(slider).toHaveAttribute('max', '2');
    });

    it('calls onSettingsChange when temperature is changed', async () => {
      const onSettingsChange = vi.fn();
      const { container } = render(ChatSettingsHarness, {
        props: { 
          open: true,
          settings: createDefaultSettings(),
          onSettingsChange,
        },
      });
      
      const slider = container.querySelector('input[type="range"]')!;
      await fireEvent.input(slider, { target: { value: '1.0' } });
      
      expect(onSettingsChange).toHaveBeenCalled();
    });

    it('displays temperature labels', () => {
      const { getByText } = render(ChatSettingsHarness, {
        props: { 
          open: true,
          settings: createDefaultSettings(),
        },
      });
      
      expect(getByText(/Precise/)).toBeInTheDocument();
      expect(getByText(/Creative/)).toBeInTheDocument();
    });
  });

  describe('Max Tokens Input', () => {
    it('displays max tokens input', () => {
      const { container } = render(ChatSettingsHarness, {
        props: { 
          open: true,
          settings: createDefaultSettings(),
        },
      });
      
      // Find input with Max Tokens label
      expect(container.textContent).toContain('Max Tokens');
    });

    it('displays current max tokens value', () => {
      const { container } = render(ChatSettingsHarness, {
        props: { 
          open: true,
          settings: { ...createDefaultSettings(), maxTokens: 4096 },
        },
      });
      
      const inputs = container.querySelectorAll('input[type="text"]');
      const maxTokensInput = Array.from(inputs).find(input => 
        (input as HTMLInputElement).value === '4096'
      );
      expect(maxTokensInput).toBeTruthy();
    });
  });

  describe('Knowledge Bases', () => {
    it('does not show knowledge bases section when none available', () => {
      const { container } = render(ChatSettingsHarness, {
        props: { 
          open: true,
          settings: createDefaultSettings(),
          availableKnowledgeBases: [],
        },
      });
      
      expect(container.textContent).not.toContain('Knowledge Bases');
    });

    it('shows knowledge bases section when available', () => {
      const availableKnowledgeBases = [
        { id: 'kb1', name: 'Documentation', description: 'Project docs' },
      ];
      
      const { getByText } = render(ChatSettingsHarness, {
        props: { 
          open: true,
          settings: createDefaultSettings(),
          availableKnowledgeBases,
        },
      });
      
      expect(getByText('Knowledge Bases')).toBeInTheDocument();
      expect(getByText('Documentation')).toBeInTheDocument();
    });

    it('displays knowledge base description', () => {
      const availableKnowledgeBases = [
        { id: 'kb1', name: 'Documentation', description: 'Project documentation' },
      ];
      
      const { getByText } = render(ChatSettingsHarness, {
        props: { 
          open: true,
          settings: createDefaultSettings(),
          availableKnowledgeBases,
        },
      });
      
      expect(getByText('Project documentation')).toBeInTheDocument();
    });
  });

  describe('Helper Text', () => {
    it('displays model helper text', () => {
      const { getByText } = render(ChatSettingsHarness, {
        props: { 
          open: true,
          settings: createDefaultSettings(),
        },
      });
      
      expect(getByText(/Choose the AI model/)).toBeInTheDocument();
    });

    it('displays temperature helper text', () => {
      const { getByText } = render(ChatSettingsHarness, {
        props: { 
          open: true,
          settings: createDefaultSettings(),
        },
      });
      
      expect(getByText(/Lower values produce more focused/)).toBeInTheDocument();
    });

    it('displays max tokens helper text', () => {
      const { getByText } = render(ChatSettingsHarness, {
        props: { 
          open: true,
          settings: createDefaultSettings(),
        },
      });
      
      expect(getByText(/Maximum number of tokens/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('temperature slider has id for label association', () => {
      const { container } = render(ChatSettingsHarness, {
        props: { 
          open: true,
          settings: createDefaultSettings(),
        },
      });
      
      const slider = container.querySelector('input[type="range"]');
      expect(slider).toHaveAttribute('id', 'chat-settings-temperature');
    });

    it('temperature slider has aria-describedby', () => {
      const { container } = render(ChatSettingsHarness, {
        props: { 
          open: true,
          settings: createDefaultSettings(),
        },
      });
      
      const slider = container.querySelector('input[type="range"]');
      expect(slider).toHaveAttribute('aria-describedby', 'chat-settings-temperature-help');
    });
  });
});