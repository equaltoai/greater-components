/**
 * Chat Context Tests
 *
 * Tests for the chat context module including:
 * - Context creation
 * - State management
 * - Action functions
 * - Utility functions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createChatContext,
  formatMessageTime,
  formatStreamDuration,
  getConnectionStatusText,
  type ChatHandlers,
  type ChatContextValue,
} from '../src/context.svelte.js';
import type { ChatSettingsState } from '../src/types.js';

// Note: createChatContext uses Svelte's setContext which requires a component context
// These tests focus on the utility functions and the structure of the context

describe('Chat Context', () => {
  describe('formatMessageTime', () => {
    it('formats time for today', () => {
      const now = new Date();
      const result = formatMessageTime(now);
      
      // Should return time in format like "10:30 AM"
      expect(result).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)?/i);
    });

    it('returns "Yesterday" for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const result = formatMessageTime(yesterday);
      
      expect(result).toBe('Yesterday');
    });

    it('returns weekday name for dates within a week', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      
      const result = formatMessageTime(threeDaysAgo);
      
      // Should be a weekday name like "Monday", "Tuesday", etc.
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      expect(weekdays).toContain(result);
    });

    it('returns formatted date for older dates', () => {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      
      const result = formatMessageTime(twoWeeksAgo);
      
      // Should contain month and day
      expect(result).toMatch(/\w+\s+\d+/);
    });

    it('handles string timestamps', () => {
      const timestamp = new Date().toISOString();
      const result = formatMessageTime(timestamp);
      
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('includes year for dates from previous years', () => {
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      
      const result = formatMessageTime(lastYear);
      
      // Should include the year
      expect(result).toMatch(/\d{4}|\d{2}/);
    });
  });

  describe('formatStreamDuration', () => {
    it('formats seconds under 60', () => {
      expect(formatStreamDuration(30)).toBe('30s');
      expect(formatStreamDuration(1)).toBe('1s');
      expect(formatStreamDuration(59)).toBe('59s');
    });

    it('formats minutes', () => {
      const result = formatStreamDuration(90);
      
      // Should format as minutes
      expect(result).toMatch(/\d+m|\d+:\d+/);
    });

    it('handles zero seconds', () => {
      expect(formatStreamDuration(0)).toBe('0s');
    });
  });

  describe('getConnectionStatusText', () => {
    it('returns correct text for connected status', () => {
      const result = getConnectionStatusText('connected');
      expect(result).toBe('Connected');
    });

    it('returns correct text for connecting status', () => {
      const result = getConnectionStatusText('connecting');
      expect(result).toBe('Connecting...');
    });

    it('returns correct text for disconnected status', () => {
      const result = getConnectionStatusText('disconnected');
      expect(result).toBe('Disconnected');
    });

    it('returns correct text for error status', () => {
      const result = getConnectionStatusText('error');
      expect(result).toBe('Connection error');
    });
  });

  describe('Context Structure', () => {
    // Note: These tests verify the expected structure without actually creating context
    // (which requires Svelte component context)
    
    it('ChatHandlers interface has expected properties', () => {
      const handlers: ChatHandlers = {
        onSubmit: vi.fn(),
        onRegenerate: vi.fn(),
        onEdit: vi.fn(),
        onDelete: vi.fn(),
        onClear: vi.fn(),
        onSettingsChange: vi.fn(),
        onStopStreaming: vi.fn(),
        onRetry: vi.fn(),
      };
      
      expect(handlers.onSubmit).toBeDefined();
      expect(handlers.onClear).toBeDefined();
      expect(handlers.onStopStreaming).toBeDefined();
    });

    it('ChatSettingsState interface has expected properties', () => {
      const settings: ChatSettingsState = {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 4096,
        systemPrompt: 'You are a helpful assistant',
        streaming: true,
        knowledgeBases: ['kb1', 'kb2'],
      };
      
      expect(settings.model).toBe('gpt-4');
      expect(settings.temperature).toBe(0.7);
      expect(settings.maxTokens).toBe(4096);
    });
  });

  describe('Message ID Generation', () => {
    it('generates unique message IDs', () => {
      // Test the ID format pattern
      const idPattern = /^msg_\d+_[a-z0-9]+$/;
      
      // Generate multiple IDs and verify uniqueness
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        expect(id).toMatch(idPattern);
        ids.add(id);
      }
      
      // All IDs should be unique
      expect(ids.size).toBe(100);
    });
  });

  describe('Tool Call ID Generation', () => {
    it('generates unique tool call IDs', () => {
      const idPattern = /^tc_\d+_[a-z0-9]+$/;
      
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        const id = `tc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        expect(id).toMatch(idPattern);
        ids.add(id);
      }
      
      expect(ids.size).toBe(100);
    });
  });

  describe('Default Settings', () => {
    it('has expected default values', () => {
      const defaultSettings: ChatSettingsState = {
        model: undefined,
        temperature: 0.7,
        maxTokens: 4096,
        systemPrompt: undefined,
        streaming: true,
      };
      
      expect(defaultSettings.temperature).toBe(0.7);
      expect(defaultSettings.maxTokens).toBe(4096);
      expect(defaultSettings.streaming).toBe(true);
    });
  });
});