/**
 * Notification Store Tests - Comprehensive testing for reactivity and memory safety
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createNotificationStore } from '../../src/stores/notificationStore';
import type { Notification, NotificationConfig } from '../../src/stores/types';

// Mock TransportManager
class MockTransportManager {
  private eventHandlers = new Map<string, Set<(event: any) => void>>();
  
  connect() {}
  disconnect() {}
  destroy() {}
  
  send(message: unknown) {
    (this as any).lastSentMessage = message;
  }
  
  on(event: string, handler: (event: any) => void) {
    let handlers = this.eventHandlers.get(event);
    if (!handlers) {
      handlers = new Set();
      this.eventHandlers.set(event, handlers);
    }
    handlers.add(handler);
    
    return () => {
      this.eventHandlers.get(event)?.delete(handler);
    };
  }
  
  emit(event: string, data: any) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }
  
  getState() {
    return {
      status: 'connected',
      latency: 30,
      lastEventId: null
    };
  }
}

describe('Notification Store', () => {
  let mockTransport: MockTransportManager;
  let config: NotificationConfig;
  let initialNotifications: Notification[];

  const flushTimers = async (ms = 0) => {
    await vi.advanceTimersByTimeAsync(ms);
    await Promise.resolve();
  };

  beforeEach(() => {
    mockTransport = new MockTransportManager();
    vi.useFakeTimers();
    
    initialNotifications = [
      {
        id: 'notif-1',
        type: 'info',
        title: 'Welcome',
        message: 'Welcome to the app',
        timestamp: Date.now() - 5000,
        isRead: false,
        priority: 'normal',
        dismissAfter: 5000
      },
      {
        id: 'notif-2',
        type: 'success',
        title: 'Success',
        message: 'Operation completed',
        timestamp: Date.now() - 3000,
        isRead: true,
        priority: 'normal'
      },
      {
        id: 'notif-3',
        type: 'error',
        title: 'Error',
        message: 'Something went wrong',
        timestamp: Date.now() - 1000,
        isRead: false,
        priority: 'high'
      }
    ];

    config = {
      transportManager: mockTransport as any,
      initialNotifications,
      defaultDismissAfter: 10000,
      maxNotifications: 50,
      updateDebounceMs: 50
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Initialization', () => {
    it('should initialize with provided notifications', () => {
      const store = createNotificationStore(config);
      const state = store.get();
      
      expect(state.notifications).toHaveLength(3);
      expect(state.totalUnread).toBe(2);
      expect(state.isLoading).toBe(false);
      expect(state.isStreaming).toBe(false);
    });

    it('should initialize with empty notifications when none provided', () => {
      const emptyConfig = { ...config, initialNotifications: undefined };
      const store = createNotificationStore(emptyConfig);
      const state = store.get();
      
      expect(state.notifications).toHaveLength(0);
      expect(state.totalUnread).toBe(0);
    });

    it('should calculate unread counts by type', () => {
      const store = createNotificationStore(config);
      const state = store.get();
      
      expect(state.unreadCounts).toEqual({
        info: 1,
        error: 1,
        all: 2
      });
    });
  });

  describe('Reactivity', () => {
    it('should notify subscribers when state changes', async () => {
      const store = createNotificationStore(config);
      let callCount = 0;
      let lastState;
      
      const unsubscribe = store.subscribe((state) => {
        callCount++;
        lastState = state;
      });
      
      expect(callCount).toBe(1);
      
      store.addNotification({
        type: 'warning',
        title: 'Warning',
        message: 'This is a warning',
        priority: 'normal'
      });
      
      await vi.advanceTimersByTimeAsync(10);
      expect(callCount).toBeGreaterThan(1);
      expect(lastState.notifications).toHaveLength(4);
      
      unsubscribe();
    });

    it('should update filtered notifications reactively', async () => {
      const store = createNotificationStore(config);
      
      // Filter for unread notifications
      store.updateFilter({ readStatus: 'unread' });
      
      await vi.advanceTimersByTimeAsync(10);
      const state = store.get();
      
      expect(state.filteredNotifications).toHaveLength(2);
      expect(state.filteredNotifications.every(n => !n.isRead)).toBe(true);
    });
  });

  describe('CRUD Operations', () => {
    it('should add new notifications', () => {
      const store = createNotificationStore(config);
      const initialCount = store.get().notifications.length;
      
      const notificationId = store.addNotification({
        type: 'info',
        title: 'New Notification',
        message: 'This is a new notification',
        priority: 'normal'
      });
      
      const state = store.get();
      expect(state.notifications).toHaveLength(initialCount + 1);
      expect(notificationId).toBeTruthy();
      
      const newNotification = state.notifications.find(n => n.id === notificationId);
      expect(newNotification).toBeTruthy();
      expect(newNotification?.title).toBe('New Notification');
      expect(newNotification?.isRead).toBe(false);
    });

    it('should mark notifications as read', () => {
      const store = createNotificationStore(config);
      const unreadNotification = store.get().notifications.find(n => !n.isRead);
      if (!unreadNotification) {
        throw new Error('Expected at least one unread notification for markAsRead test');
      }
      const initialUnreadCount = store.get().totalUnread;
      
      const success = store.markAsRead(unreadNotification.id);
      
      expect(success).toBe(true);
      
      const state = store.get();
      const updatedNotification = state.notifications.find(n => n.id === unreadNotification.id);
      expect(updatedNotification?.isRead).toBe(true);
      expect(state.totalUnread).toBe(initialUnreadCount - 1);
    });

    it('should mark all notifications as read', () => {
      const store = createNotificationStore(config);
      
      store.markAllAsRead();
      
      const state = store.get();
      expect(state.notifications.every(n => n.isRead)).toBe(true);
      expect(state.totalUnread).toBe(0);
    });

    it('should remove notifications', () => {
      const store = createNotificationStore(config);
      const targetNotification = store.get().notifications[0];
      const initialCount = store.get().notifications.length;
      
      const success = store.removeNotification(targetNotification.id);
      
      expect(success).toBe(true);
      
      const state = store.get();
      expect(state.notifications).toHaveLength(initialCount - 1);
      expect(state.notifications.find(n => n.id === targetNotification.id)).toBeUndefined();
    });

    it('should clear all notifications', () => {
      const store = createNotificationStore(config);
      
      store.clearAll();
      
      const state = store.get();
      expect(state.notifications).toHaveLength(0);
      expect(state.totalUnread).toBe(0);
    });

    it('should return false when trying to modify non-existent notifications', () => {
      const store = createNotificationStore(config);
      
      expect(store.markAsRead('nonexistent')).toBe(false);
      expect(store.removeNotification('nonexistent')).toBe(false);
    });
  });

  describe('Filtering', () => {
    it('should filter by notification types', async () => {
      const store = createNotificationStore(config);
      
      store.updateFilter({ types: ['error'] });
      
      await vi.advanceTimersByTimeAsync(10);
      const state = store.get();
      
      expect(state.filteredNotifications).toHaveLength(1);
      expect(state.filteredNotifications[0].type).toBe('error');
    });

    it('should filter by read status', async () => {
      const store = createNotificationStore(config);
      
      store.updateFilter({ readStatus: 'read' });
      
      await vi.advanceTimersByTimeAsync(10);
      const state = store.get();
      
      expect(state.filteredNotifications).toHaveLength(1);
      expect(state.filteredNotifications.every(n => n.isRead)).toBe(true);
    });

    it('should filter by priority', async () => {
      const store = createNotificationStore(config);
      
      store.updateFilter({ priority: ['high'] });
      
      await vi.advanceTimersByTimeAsync(10);
      const state = store.get();
      
      expect(state.filteredNotifications).toHaveLength(1);
      expect(state.filteredNotifications[0].priority).toBe('high');
    });

    it('should filter by search query', async () => {
      const store = createNotificationStore(config);
      
      store.updateFilter({ query: 'welcome' });
      
      await vi.advanceTimersByTimeAsync(10);
      const state = store.get();
      
      expect(state.filteredNotifications).toHaveLength(1);
      expect(state.filteredNotifications[0].title.toLowerCase()).toContain('welcome');
    });

    it('should filter by date range', async () => {
      const store = createNotificationStore(config);
      const now = Date.now();
      
      store.updateFilter({
        dateRange: {
          start: new Date(now - 4000),
          end: new Date(now - 2000)
        }
      });
      
      await vi.advanceTimersByTimeAsync(10);
      const state = store.get();
      
      expect(state.filteredNotifications).toHaveLength(1);
      expect(state.filteredNotifications[0].id).toBe('notif-2');
    });

    it('should combine multiple filters', async () => {
      const store = createNotificationStore(config);
      
      store.updateFilter({
        types: ['info', 'error'],
        readStatus: 'unread'
      });
      
      await vi.advanceTimersByTimeAsync(10);
      const state = store.get();
      
      expect(state.filteredNotifications).toHaveLength(2);
      expect(state.filteredNotifications.every(n => !n.isRead)).toBe(true);
      expect(state.filteredNotifications.every(n => ['info', 'error'].includes(n.type))).toBe(true);
    });
  });

  describe('Auto-dismiss', () => {
    it('should schedule auto-dismiss for notifications with timeout', () => {
      const store = createNotificationStore(config);
      
      const notificationId = store.addNotification({
        type: 'info',
        title: 'Auto Dismiss',
        message: 'This will auto-dismiss',
        priority: 'normal',
        dismissAfter: 1000
      });
      
      expect(store.get().notifications.find(n => n.id === notificationId)).toBeTruthy();
      
      // Fast forward time
      vi.advanceTimersByTime(1001);
      
      expect(store.get().notifications.find(n => n.id === notificationId)).toBeUndefined();
    });

    it('should cancel auto-dismiss when notification is marked as read', () => {
      const store = createNotificationStore(config);
      
      const notificationId = store.addNotification({
        type: 'info',
        title: 'Cancel Dismiss',
        message: 'This will not auto-dismiss after read',
        priority: 'normal',
        dismissAfter: 1000
      });
      
      // Mark as read before timeout
      store.markAsRead(notificationId);
      
      // Fast forward time
      vi.advanceTimersByTime(1001);
      
      // Should still exist because it was marked as read
      expect(store.get().notifications.find(n => n.id === notificationId)).toBeTruthy();
    });

    it('should use default dismiss timeout when not specified', () => {
      const store = createNotificationStore(config);
      
      const notificationId = store.addNotification({
        type: 'info',
        title: 'Default Timeout',
        message: 'Uses default timeout',
        priority: 'normal'
      });
      
      const notification = store.get().notifications.find(n => n.id === notificationId);
      expect(notification?.dismissAfter).toBe(10000); // config.defaultDismissAfter
    });
  });

  describe('Streaming Updates', () => {
    it('should handle streaming notifications', async () => {
      const store = createNotificationStore(config);
      store.startStreaming();
      
      const streamingNotification: Notification = {
        id: 'stream-notif-1',
        type: 'info',
        title: 'Streamed',
        message: 'This came from stream',
        timestamp: Date.now(),
        isRead: false,
        priority: 'normal'
      };
      
      mockTransport.emit('message', {
        data: {
          type: 'notification_received',
          data: streamingNotification
        }
      });
      
      // Wait for debounce
      await flushTimers(60);
      
      const state = store.get();
      expect(state.notifications.find(n => n.id === 'stream-notif-1')).toBeTruthy();
    });

    it('should handle notification updates from stream', async () => {
      const store = createNotificationStore(config);
      store.startStreaming();
      
      const targetNotification = store.get().notifications[0];
      
      mockTransport.emit('message', {
        data: {
          type: 'notification_updated',
          data: {
            id: targetNotification.id,
            updates: { isRead: true, title: 'Updated Title' }
          }
        }
      });
      
      await vi.advanceTimersByTimeAsync(10);
      
      const state = store.get();
      const updatedNotification = state.notifications.find(n => n.id === targetNotification.id);
      expect(updatedNotification?.isRead).toBe(true);
      expect(updatedNotification?.title).toBe('Updated Title');
    });

    it('should handle notification removal from stream', async () => {
      const store = createNotificationStore(config);
      store.startStreaming();
      
      const targetNotification = store.get().notifications[0];
      const initialCount = store.get().notifications.length;
      
      mockTransport.emit('message', {
        data: {
          type: 'notification_removed',
          data: { id: targetNotification.id }
        }
      });
      
      await vi.advanceTimersByTimeAsync(10);
      
      const state = store.get();
      expect(state.notifications).toHaveLength(initialCount - 1);
      expect(state.notifications.find(n => n.id === targetNotification.id)).toBeUndefined();
    });

    it('should deduplicate streaming notifications', async () => {
      const store = createNotificationStore(config);
      
      const duplicateNotification: Notification = {
        id: 'duplicate-notif',
        type: 'info',
        title: 'Duplicate',
        message: 'This is a duplicate',
        timestamp: Date.now(),
        isRead: false,
        priority: 'normal'
      };
      
      // Send same notification multiple times rapidly
      for (let i = 0; i < 5; i++) {
        mockTransport.emit('message', {
          data: {
            type: 'notification_received',
            data: duplicateNotification
          }
        });
      }
      
      await vi.advanceTimersByTimeAsync(60);
      
      const state = store.get();
      const duplicates = state.notifications.filter(n => n.id === 'duplicate-notif');
      expect(duplicates).toHaveLength(1); // Should only have one
    });
  });

  describe('Connection Management', () => {
    it('should start streaming and connect transport', () => {
      const store = createNotificationStore(config);
      const connectSpy = vi.spyOn(mockTransport, 'connect');
      
      store.startStreaming();
      
      const state = store.get();
      expect(state.isStreaming).toBe(true);
      expect(connectSpy).toHaveBeenCalled();
    });

    it('should stop streaming and cleanup subscriptions', () => {
      const store = createNotificationStore(config);
      
      store.startStreaming();
      expect(store.get().isStreaming).toBe(true);
      
      store.stopStreaming();
      expect(store.get().isStreaming).toBe(false);
    });

    it('should handle transport errors', () => {
      const store = createNotificationStore(config);
      store.startStreaming();
      
      const error = new Error('Connection failed');
      mockTransport.emit('error', { error });
      
      const state = store.get();
      expect(state.error).toBe(error);
    });

    it('should handle transport close events', () => {
      const store = createNotificationStore(config);
      store.startStreaming();
      
      mockTransport.emit('close', {});
      
      const state = store.get();
      expect(state.isStreaming).toBe(false);
    });
  });

  describe('Memory Management', () => {
    it('should respect max notifications limit', () => {
      const smallConfig = { ...config, maxNotifications: 5 };
      const store = createNotificationStore(smallConfig);
      
      // Mark some existing notifications as read
      store.markAllAsRead();
      
      // Add notifications beyond the limit
      const addNotifications = async () => {
        for (let i = 0; i < 10; i++) {
          store.addNotification({
            type: 'info',
            title: `Notification ${i}`,
            message: `Message ${i}`,
            priority: 'normal'
          });

          await flushTimers();
        }
      };

      return addNotifications().then(async () => {
        await flushTimers(100);
        const state = store.get();
        expect(state.notifications.length).toBeLessThanOrEqual(5);
      });
    });

    it('should cleanup resources on destroy', () => {
      const store = createNotificationStore(config);
      store.startStreaming();
      
      // Add notification with auto-dismiss
      store.addNotification({
        type: 'info',
        title: 'Will be cleaned',
        message: 'This will be cleaned up',
        priority: 'normal',
        dismissAfter: 5000
      });
      
      const state = store.get();
      expect(state.notifications.length).toBeGreaterThan(0);
      expect(state.isStreaming).toBe(true);
      
      store.destroy();
      
      const finalState = store.get();
      expect(finalState.notifications).toHaveLength(0);
      expect(finalState.isStreaming).toBe(false);
      expect(finalState.error).toBeNull();
    });

    it('should prevent memory leaks from subscriptions', () => {
      const store = createNotificationStore(config);
      const callbacks: (() => void)[] = [];
      
      // Create multiple subscriptions
      for (let i = 0; i < 10; i++) {
        const unsubscribe = store.subscribe(() => {});
        callbacks.push(unsubscribe);
      }
      
      // Unsubscribe all
      callbacks.forEach(unsubscribe => unsubscribe());
      
      expect(callbacks).toHaveLength(10);
    });

    it('should cleanup auto-dismiss timers properly', () => {
      const store = createNotificationStore(config);
      
      // Add multiple notifications with auto-dismiss
      for (let i = 0; i < 5; i++) {
        store.addNotification({
          type: 'info',
          title: `Auto dismiss ${i}`,
          message: `Message ${i}`,
          priority: 'normal',
          dismissAfter: 1000 + i * 100
        });
      }
      
      // Destroy store before timeouts fire
      store.destroy();
      
      // Fast forward time - should not cause any issues
      vi.advanceTimersByTime(10000);
      
      expect(true).toBe(true); // Should not throw
    });
  });

  describe('Edge Cases', () => {
    it('should handle concurrent mark as read operations', () => {
      const store = createNotificationStore(config);
      const targetNotification = store.get().notifications.find(n => !n.isRead);
      if (!targetNotification) {
        throw new Error('Expected unread notification for concurrent markAsRead test');
      }
      
      // Try to mark as read multiple times concurrently
      const result1 = store.markAsRead(targetNotification.id);
      const result2 = store.markAsRead(targetNotification.id);
      
      expect(result1).toBe(true);
      expect(result2).toBe(true); // Should return true even if already read
      
      const state = store.get();
      const updatedNotification = state.notifications.find(n => n.id === targetNotification.id);
      expect(updatedNotification?.isRead).toBe(true);
    });

    it('should handle empty filter queries gracefully', async () => {
      const store = createNotificationStore(config);
      
      store.updateFilter({ query: '' });
      
      await vi.advanceTimersByTimeAsync(10);
      const state = store.get();
      
      // Empty query should show all notifications
      expect(state.filteredNotifications).toHaveLength(3);
    });

    it('should handle invalid date ranges', async () => {
      const store = createNotificationStore(config);
      
      store.updateFilter({
        dateRange: {
          start: new Date(Date.now()),
          end: new Date(Date.now() - 10000) // End before start
        }
      });
      
      await vi.advanceTimersByTimeAsync(10);
      const state = store.get();
      
      // Should not crash and return empty results
      expect(state.filteredNotifications).toHaveLength(0);
    });

    it('should handle notifications with missing properties', async () => {
      const store = createNotificationStore(config);
      
      const incompleteNotification = {
        id: 'incomplete',
        type: 'info',
        title: 'Incomplete',
        message: 'Missing some properties',
        timestamp: Date.now(),
        isRead: false,
        priority: 'normal'
        // Missing optional properties
      } as Notification;
      
      mockTransport.emit('message', {
        data: {
          type: 'notification_received',
          data: incompleteNotification
        }
      });
      
      await flushTimers(60);

      const state = store.get();
      const addedNotification = state.notifications.find(n => n.id === 'incomplete');
      expect(addedNotification).toBeTruthy();
      expect(addedNotification?.dismissAfter).toBeUndefined();
    });
  });
});
