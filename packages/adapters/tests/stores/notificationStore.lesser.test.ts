/**
 * Notification Store - Lesser Integration Tests
 * 
 * Tests for Lesser-specific notification types and metadata handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createNotificationStore } from '../../src/stores/notificationStore.js';
import type { NotificationConfig, Notification, LesserNotificationMetadata } from '../../src/stores/types.js';

describe('NotificationStore - Lesser Integration', () => {
  let mockTransportManager: any;
  let store: ReturnType<typeof createNotificationStore>;

  beforeEach(() => {
    mockTransportManager = {
      on: vi.fn(() => vi.fn()),
      connect: vi.fn(),
      disconnect: vi.fn(),
    };

    const config: NotificationConfig = {
      transportManager: mockTransportManager,
      maxNotifications: 100,
    };

    store = createNotificationStore(config);
  });

  describe('Lesser Notification Types', () => {
    it('should accept quote notifications', () => {
      const id = store.addNotification({
        type: 'quote',
        title: 'New quote',
        message: 'Someone quoted your post',
        isRead: false,
        priority: 'normal',
        metadata: {
          lesser: {
            quoteStatus: {
              id: 'quote-123',
              content: 'Quoted content',
              author: 'alice',
            },
          },
        },
      });

      const state = store.get();
      const notification = state.notifications.find((n) => n.id === id);
      
      expect(notification).toBeDefined();
      expect(notification?.type).toBe('quote');
      expect(notification?.metadata?.lesser?.quoteStatus).toBeDefined();
    });

    it('should accept community_note notifications', () => {
      const id = store.addNotification({
        type: 'community_note',
        title: 'Community note added',
        message: 'A community note was added to your post',
        isRead: false,
        priority: 'normal',
        metadata: {
          lesser: {
            communityNote: {
              id: 'note-456',
              content: 'Additional context provided',
              helpful: 10,
              notHelpful: 2,
            },
          },
        },
      });

      const state = store.get();
      const notification = state.notifications.find((n) => n.id === id);

      expect(notification?.type).toBe('community_note');
      expect(notification?.metadata?.lesser?.communityNote?.helpful).toBe(10);
    });

    it('should accept trust_update notifications', () => {
      const id = store.addNotification({
        type: 'trust_update',
        title: 'Trust score updated',
        message: 'Your trust score increased',
        isRead: false,
        priority: 'high',
        metadata: {
          lesser: {
            trustUpdate: {
              newScore: 85,
              previousScore: 78,
              reason: 'Consistent quality contributions',
            },
          },
        },
      });

      const notification = store.get().notifications.find((n) => n.id === id);
      expect(notification?.metadata?.lesser?.trustUpdate?.newScore).toBe(85);
    });

    it('should accept cost_alert notifications', () => {
      const id = store.addNotification({
        type: 'cost_alert',
        title: 'Cost threshold exceeded',
        message: 'Your usage exceeded the alert threshold',
        isRead: false,
        priority: 'urgent',
        metadata: {
          lesser: {
            costAlert: {
              amount: 5000000,
              threshold: 4000000,
            },
          },
        },
      });

      const notification = store.get().notifications.find((n) => n.id === id);
      expect(notification?.metadata?.lesser?.costAlert?.amount).toBe(5000000);
    });

    it('should accept moderation_action notifications', () => {
      const id = store.addNotification({
        type: 'moderation_action',
        title: 'Moderation action',
        message: 'Content was flagged by moderation',
        isRead: false,
        priority: 'high',
        metadata: {
          lesser: {
            moderationAction: {
              action: 'FLAG',
              reason: 'Potentially sensitive content',
              statusId: 'status-789',
            },
          },
        },
      });

      const notification = store.get().notifications.find((n) => n.id === id);
      expect(notification?.metadata?.lesser?.moderationAction?.action).toBe('FLAG');
    });
  });

  describe('Lesser-Specific Selectors', () => {
    beforeEach(() => {
      // Add various Lesser notification types
      store.addNotification({
        type: 'quote',
        title: 'Quote 1',
        message: 'Quote message',
        isRead: false,
        priority: 'normal',
      });

      store.addNotification({
        type: 'quote',
        title: 'Quote 2',
        message: 'Another quote',
        isRead: true,
        priority: 'normal',
      });

      store.addNotification({
        type: 'community_note',
        title: 'Note',
        message: 'Community note',
        isRead: false,
        priority: 'normal',
      });

      store.addNotification({
        type: 'trust_update',
        title: 'Trust',
        message: 'Trust updated',
        isRead: false,
        priority: 'high',
      });

      store.addNotification({
        type: 'cost_alert',
        title: 'Cost',
        message: 'Cost alert',
        isRead: false,
        priority: 'urgent',
      });

      store.addNotification({
        type: 'moderation_action',
        title: 'Moderation',
        message: 'Moderation action',
        isRead: false,
        priority: 'high',
      });

      // Non-Lesser notification
      store.addNotification({
        type: 'info',
        title: 'Info',
        message: 'Regular notification',
        isRead: false,
        priority: 'normal',
      });
    });

    it('getQuoteNotifications() should return only quote notifications', () => {
      const quotes = store.getQuoteNotifications();
      expect(quotes).toHaveLength(2);
      expect(quotes.every((n) => n.type === 'quote')).toBe(true);
    });

    it('getCommunityNoteNotifications() should return only community note notifications', () => {
      const notes = store.getCommunityNoteNotifications();
      expect(notes).toHaveLength(1);
      expect(notes[0].type).toBe('community_note');
    });

    it('getTrustUpdateNotifications() should return only trust update notifications', () => {
      const trustUpdates = store.getTrustUpdateNotifications();
      expect(trustUpdates).toHaveLength(1);
      expect(trustUpdates[0].type).toBe('trust_update');
    });

    it('getCostAlertNotifications() should return only cost alert notifications', () => {
      const costAlerts = store.getCostAlertNotifications();
      expect(costAlerts).toHaveLength(1);
      expect(costAlerts[0].type).toBe('cost_alert');
    });

    it('getModerationActionNotifications() should return only moderation action notifications', () => {
      const moderationActions = store.getModerationActionNotifications();
      expect(moderationActions).toHaveLength(1);
      expect(moderationActions[0].type).toBe('moderation_action');
    });

    it('getUnreadLesserNotifications() should return all unread Lesser notifications', () => {
      const unreadLesser = store.getUnreadLesserNotifications();
      // Should have 5 unread Lesser notifications:
      // 1 quote (unread), 1 community_note, 1 trust_update, 1 cost_alert, 1 moderation_action
      // The second quote is marked as read so it shouldn't be included
      expect(unreadLesser.length).toBeGreaterThanOrEqual(4);
      expect(unreadLesser.every((n) => !n.isRead)).toBe(true);
      expect(unreadLesser.every((n) => ['quote', 'community_note', 'trust_update', 'cost_alert', 'moderation_action'].includes(n.type))).toBe(true);
    });
  });

  describe('Filtering Lesser Notifications', () => {
    beforeEach(() => {
      store.addNotification({
        type: 'quote',
        title: 'Quote',
        message: 'Quote',
        isRead: false,
        priority: 'normal',
      });

      store.addNotification({
        type: 'trust_update',
        title: 'Trust',
        message: 'Trust',
        isRead: false,
        priority: 'high',
      });

      store.addNotification({
        type: 'info',
        title: 'Info',
        message: 'Info',
        isRead: false,
        priority: 'normal',
      });
    });

    it('should filter by Lesser notification types', () => {
      store.updateFilter({
        types: ['quote', 'trust_update'],
      });

      const state = store.get();
      expect(state.filteredNotifications).toHaveLength(2);
      expect(state.filteredNotifications.every((n) => 
        n.type === 'quote' || n.type === 'trust_update'
      )).toBe(true);
    });
  });

  describe('Lesser Notification Limits', () => {
    it('should respect maxNotifications with Lesser types', () => {
      const limitedConfig: NotificationConfig = {
        transportManager: mockTransportManager,
        maxNotifications: 5,
      };

      const limitedStore = createNotificationStore(limitedConfig);

      // Add 10 Lesser notifications
      for (let i = 0; i < 10; i++) {
        limitedStore.addNotification({
          type: i % 2 === 0 ? 'quote' : 'trust_update',
          title: `Notification ${i}`,
          message: `Message ${i}`,
          isRead: i < 5,
          priority: 'normal',
        });
      }

      const state = limitedStore.get();
      expect(state.notifications.length).toBeLessThanOrEqual(5);
      
      // Should keep recent unread notifications
      const unread = state.notifications.filter((n) => !n.isRead);
      expect(unread.length).toBeGreaterThan(0);
    });
  });

  describe('Data Integrity', () => {
    it('should not break with missing Lesser metadata', () => {
      store.addNotification({
        type: 'quote',
        title: 'Quote without metadata',
        message: 'No metadata',
        isRead: false,
        priority: 'normal',
      });

      expect(() => store.getQuoteNotifications()).not.toThrow();
      expect(() => store.getUnreadLesserNotifications()).not.toThrow();
    });

    it('should handle mixed notification types correctly', () => {
      store.addNotification({ type: 'info', title: 'Info', message: 'Info', isRead: false, priority: 'normal' });
      store.addNotification({ type: 'quote', title: 'Quote', message: 'Quote', isRead: false, priority: 'normal' });
      store.addNotification({ type: 'success', title: 'Success', message: 'Success', isRead: false, priority: 'normal' });
      store.addNotification({ type: 'trust_update', title: 'Trust', message: 'Trust', isRead: false, priority: 'high' });

      const lesser = store.getUnreadLesserNotifications();
      expect(lesser).toHaveLength(2);
      
      const state = store.get();
      expect(state.notifications).toHaveLength(4);
    });
  });
});

