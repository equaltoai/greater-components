/**
 * Notification Store - Reactive state management for notifications with filtering and streaming
 * Built for Svelte 5 runes compatibility with fallback support
 */

import type {
  NotificationStore,
  NotificationState,
  Notification,
  NotificationConfig,
  NotificationFilter
} from './types';

// Simple reactive state implementation that works everywhere
class ReactiveState<T> {
  private _value: T;
  private _subscribers = new Set<(value: T) => void>();

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    this._value = newValue;
    this._subscribers.forEach(callback => {
      try {
        callback(newValue);
      } catch (error) {
        console.error('Error in reactive state subscriber:', error);
      }
    });
  }

  subscribe(callback: (value: T) => void): () => void {
    this._subscribers.add(callback);
    // Call immediately with current value
    callback(this._value);
    
    return () => {
      this._subscribers.delete(callback);
    };
  }

  update(updater: (current: T) => T): void {
    this.value = updater(this._value);
  }
}

export function createNotificationStore(config: NotificationConfig): NotificationStore {
  // Create reactive state
  const state = new ReactiveState<NotificationState>({
    notifications: config.initialNotifications || [],
    filteredNotifications: [],
    unreadCounts: {},
    totalUnread: 0,
    filter: {
      types: undefined,
      readStatus: 'all',
      priority: undefined,
      dateRange: undefined,
      query: undefined
    },
    isLoading: false,
    error: null,
    isStreaming: false
  });

  // Initialize computed values
  updateDerivedValues();

  // Auto-dismiss notification timers
  const dismissalTimers = new Map<string, ReturnType<typeof setTimeout>>();

  // Transport event handlers
  let streamingUnsubscribers: (() => void)[] = [];
  let updateDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  let pendingNotifications: Notification[] = [];

  function updateDerivedValues(notifications?: Notification[], filter?: NotificationFilter): void {
    const currentState = state.value;
    const notificationsToProcess = notifications || currentState.notifications;
    const filterToUse = filter || currentState.filter;
    
    // Filter notifications
    let filtered = [...notificationsToProcess];

    // Filter by types
    if (filterToUse.types && filterToUse.types.length > 0) {
      filtered = filtered.filter(n => filterToUse.types!.includes(n.type));
    }

    // Filter by read status
    if (filterToUse.readStatus === 'read') {
      filtered = filtered.filter(n => n.isRead);
    } else if (filterToUse.readStatus === 'unread') {
      filtered = filtered.filter(n => !n.isRead);
    }

    // Filter by priority
    if (filterToUse.priority && filterToUse.priority.length > 0) {
      filtered = filtered.filter(n => filterToUse.priority!.includes(n.priority));
    }

    // Filter by date range
    if (filterToUse.dateRange) {
      const start = filterToUse.dateRange.start.getTime();
      const end = filterToUse.dateRange.end.getTime();
      filtered = filtered.filter(n => 
        n.timestamp >= start && n.timestamp <= end
      );
    }

    // Filter by search query
    if (filterToUse.query && filterToUse.query.trim()) {
      const query = filterToUse.query.toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query)
      );
    }

    // Sort by timestamp (newest first)
    filtered = filtered.sort((a, b) => b.timestamp - a.timestamp);
    
    // Calculate unread counts by type
    const unreadCounts: Record<string, number> = {};
    notificationsToProcess.forEach(notification => {
      if (!notification.isRead) {
        unreadCounts[notification.type] = (unreadCounts[notification.type] || 0) + 1;
        unreadCounts['all'] = (unreadCounts['all'] || 0) + 1;
      }
    });
    
    // Update state with computed values only if they've changed
    const needsUpdate = JSON.stringify(currentState.filteredNotifications) !== JSON.stringify(filtered) ||
                        JSON.stringify(currentState.unreadCounts) !== JSON.stringify(unreadCounts) ||
                        currentState.totalUnread !== (unreadCounts['all'] || 0);
    
    if (needsUpdate) {
      state.update(current => ({
        ...current,
        filteredNotifications: filtered,
        unreadCounts,
        totalUnread: unreadCounts['all'] || 0
      }));
    }
  }

  function scheduleAutoDismiss(notification: Notification): void {
    if (notification.dismissAfter && notification.dismissAfter > 0) {
      const timer = setTimeout(() => {
        removeNotification(notification.id);
        dismissalTimers.delete(notification.id);
      }, notification.dismissAfter);
      
      dismissalTimers.set(notification.id, timer);
    }
  }

  function clearAutoDismiss(notificationId: string): void {
    const timer = dismissalTimers.get(notificationId);
    if (timer) {
      clearTimeout(timer);
      dismissalTimers.delete(notificationId);
    }
  }

  function processPendingNotifications(): void {
    if (pendingNotifications.length === 0) return;

    const notifications = [...pendingNotifications];
    pendingNotifications = [];

    // Deduplicate notifications by ID
    const notificationMap = new Map<string, Notification>();
    notifications.forEach(n => notificationMap.set(n.id, n));

    // Add new notifications
    const newNotifications = Array.from(notificationMap.values())
      .filter(n => !state.value.notifications.some(existing => existing.id === n.id));

    if (newNotifications.length > 0) {
      state.update(current => ({
        ...current,
        notifications: [...current.notifications, ...newNotifications]
      }));
      
      // Schedule auto-dismiss for new notifications
      newNotifications.forEach(scheduleAutoDismiss);
      
      // Limit total notifications if configured
      const currentNotifications = state.value.notifications;
      if (config.maxNotifications && currentNotifications.length > config.maxNotifications) {
        const excess = currentNotifications.length - config.maxNotifications;
        const readNotifications = currentNotifications.filter(n => n.isRead);
        const toRemove = readNotifications.slice(0, Math.min(excess, readNotifications.length));
        
        if (toRemove.length > 0) {
          state.update(current => ({
            ...current,
            notifications: current.notifications.filter(n => !toRemove.some(r => r.id === n.id))
          }));
          
          // Clear timers for removed notifications
          toRemove.forEach(n => clearAutoDismiss(n.id));
        }
      }
      
      updateDerivedValues();
    }
  }

  function scheduleNotificationUpdate(notification: Notification): void {
    pendingNotifications.push(notification);
    
    if (updateDebounceTimer) {
      clearTimeout(updateDebounceTimer);
    }
    
    updateDebounceTimer = setTimeout(() => {
      processPendingNotifications();
      updateDebounceTimer = null;
    }, config.updateDebounceMs || 100);
  }

  // Store methods
  function addNotification(notificationData: Omit<Notification, 'id' | 'timestamp'>): string {
    const id = generateId();
    const timestamp = Date.now();
    
    const notification: Notification = {
      ...notificationData,
      id,
      timestamp,
      isRead: false,
      dismissAfter: notificationData.dismissAfter || config.defaultDismissAfter
    };
    
    state.update(current => ({
      ...current,
      notifications: [...current.notifications, notification]
    }));
    
    scheduleAutoDismiss(notification);
    updateDerivedValues();
    
    // Send to server if streaming is active
    if (state.value.isStreaming && config.transportManager) {
      try {
        config.transportManager.send({
          type: 'notification_add',
          data: notification
        });
      } catch (error) {
        state.update(current => ({
          ...current,
          error: error as Error
        }));
        console.error('Failed to send notification to server:', error);
      }
    }
    
    return id;
  }

  function markAsRead(id: string): boolean {
    const currentState = state.value;
    const notificationIndex = currentState.notifications.findIndex(n => n.id === id);
    if (notificationIndex === -1) return false;
    
    const notification = currentState.notifications[notificationIndex];
    if (!notification) return false;
    if (notification.isRead) return true; // Already read
    
    const updatedNotification = { ...notification, isRead: true };
    const newNotifications = currentState.notifications.map((n, index) =>
      index === notificationIndex ? updatedNotification : n
    );
    
    state.update(current => ({
      ...current,
      notifications: newNotifications
    }));
    
    // Clear auto-dismiss timer since it's now read
    clearAutoDismiss(id);
    updateDerivedValues();
    
    // Send to server if streaming is active
    if (currentState.isStreaming && config.transportManager) {
      try {
        config.transportManager.send({
          type: 'notification_read',
          data: { id, isRead: true }
        });
      } catch (error) {
        state.update(current => ({
          ...current,
          error: error as Error
        }));
        console.error('Failed to mark notification as read on server:', error);
      }
    }
    
    return true;
  }

  function markAllAsRead(): void {
    const unreadNotifications = state.value.notifications.filter(n => !n.isRead);
    
    if (unreadNotifications.length === 0) return;
    
    state.update(current => ({
      ...current,
      notifications: current.notifications.map(n => ({ ...n, isRead: true }))
    }));
    
    // Clear all auto-dismiss timers
    unreadNotifications.forEach(n => clearAutoDismiss(n.id));
    updateDerivedValues();
    
    // Send to server if streaming is active
    if (state.value.isStreaming && config.transportManager) {
      try {
        config.transportManager.send({
          type: 'notifications_read_all',
          data: { notificationIds: unreadNotifications.map(n => n.id) }
        });
      } catch (error) {
        state.update(current => ({
          ...current,
          error: error as Error
        }));
        console.error('Failed to mark all notifications as read on server:', error);
      }
    }
  }

  function removeNotificationInternal(id: string): boolean {
    const notificationExists = state.value.notifications.some(n => n.id === id);
    if (!notificationExists) return false;
    
    state.update(current => ({
      ...current,
      notifications: current.notifications.filter(n => n.id !== id)
    }));
    
    clearAutoDismiss(id);
    return true;
  }

  function removeNotification(id: string): boolean {
    const success = removeNotificationInternal(id);
    
    if (success) {
      updateDerivedValues();
      
      // Send to server if streaming is active
      if (state.value.isStreaming && config.transportManager) {
        try {
          config.transportManager.send({
            type: 'notification_remove',
            data: { id }
          });
        } catch (error) {
          state.update(current => ({
            ...current,
            error: error as Error
          }));
          console.error('Failed to remove notification on server:', error);
        }
      }
    }
    
    return success;
  }

  function clearAll(): void {
    // Clear all auto-dismiss timers
    state.value.notifications.forEach(n => clearAutoDismiss(n.id));
    
    const notificationIds = state.value.notifications.map(n => n.id);
    state.update(current => ({
      ...current,
      notifications: []
    }));
    
    updateDerivedValues();
    
    // Send to server if streaming is active
    if (state.value.isStreaming && config.transportManager) {
      try {
        config.transportManager.send({
          type: 'notifications_clear_all',
          data: { notificationIds }
        });
      } catch (error) {
        state.update(current => ({
          ...current,
          error: error as Error
        }));
        console.error('Failed to clear all notifications on server:', error);
      }
    }
  }

  function updateFilter(newFilter: Partial<NotificationFilter>): void {
    const currentState = state.value;
    const updatedFilter = { ...currentState.filter, ...newFilter };
    
    state.update(current => ({
      ...current,
      filter: updatedFilter
    }));
    
    updateDerivedValues(currentState.notifications, updatedFilter);
  }

  function startStreaming(): void {
    if (state.value.isStreaming || !config.transportManager) return;
    
    state.update(current => ({
      ...current,
      isStreaming: true,
      error: null
    }));
    
    // Subscribe to new notifications
    const messageHandler = config.transportManager.on('message', (event) => {
      if (event.data && typeof event.data === 'object' && 'type' in event.data) {
        const eventData = event.data as any;
        if (eventData.type === 'notification_received' && eventData.data) {
          const notification = eventData.data as Notification;
          scheduleNotificationUpdate(notification);
        } else if (eventData.type === 'notification_updated' && eventData.data) {
          const { id, updates } = eventData.data;
          if (id && updates) {
            updateNotificationFromStream(id, updates);
          }
        } else if (eventData.type === 'notification_removed' && eventData.data) {
          const { id } = eventData.data;
          if (id) {
            removeNotification(id);
          }
        }
      }
    });
    
    streamingUnsubscribers.push(messageHandler);
    
    // Subscribe to connection events
    const errorHandler = config.transportManager.on('error', (event) => {
      state.update(current => ({
        ...current,
        error: event.error || new Error('Streaming connection error')
      }));
    });
    
    const closeHandler = config.transportManager.on('close', () => {
      state.update(current => ({
        ...current,
        isStreaming: false
      }));
    });
    
    streamingUnsubscribers.push(errorHandler, closeHandler);
    
    // Start the transport connection
    try {
      config.transportManager.connect();
    } catch (error) {
      state.update(current => ({
        ...current,
        error: error as Error,
        isStreaming: false
      }));
    }
  }

  function stopStreaming(): void {
    state.update(current => ({
      ...current,
      isStreaming: false
    }));
    
    // Clean up event subscriptions
    streamingUnsubscribers.forEach(unsubscribe => unsubscribe());
    streamingUnsubscribers = [];
    
    // Clear pending updates
    if (updateDebounceTimer) {
      clearTimeout(updateDebounceTimer);
      updateDebounceTimer = null;
    }
    pendingNotifications = [];
  }

  function updateNotificationFromStream(id: string, updates: Partial<Notification>): void {
    const currentState = state.value;
    const notificationIndex = currentState.notifications.findIndex(n => n.id === id);
    if (notificationIndex === -1) return;
    
    const notification = currentState.notifications[notificationIndex];
    if (!notification) return;
    
    const updatedNotification = { ...notification, ...updates };
    const newNotifications = currentState.notifications.map((n, index) =>
      index === notificationIndex ? updatedNotification : n
    );
    
    state.update(current => ({
      ...current,
      notifications: newNotifications
    }));
    
    // Handle read status change
    if ('isRead' in updates && updates.isRead && !notification.isRead) {
      clearAutoDismiss(id);
    }
    
    // Handle dismiss timer change
    if ('dismissAfter' in updates) {
      clearAutoDismiss(id);
      if (updates.dismissAfter) {
        scheduleAutoDismiss(updatedNotification);
      }
    }
    
    updateDerivedValues();
  }

  function subscribe(callback: (value: NotificationState) => void): () => void {
    return state.subscribe(callback);
  }

  function get(): NotificationState {
    return state.value;
  }

  function destroy(): void {
    stopStreaming();
    
    // Clear all auto-dismiss timers
    dismissalTimers.forEach(timer => clearTimeout(timer));
    dismissalTimers.clear();
    
    // Clear debounce timer
    if (updateDebounceTimer) {
      clearTimeout(updateDebounceTimer);
    }
    
    // Clear state
    state.update(() => ({
      notifications: [],
      filteredNotifications: [],
      unreadCounts: {},
      totalUnread: 0,
      filter: {
        types: undefined,
        readStatus: 'all',
        priority: undefined,
        dateRange: undefined,
        query: undefined
      },
      isLoading: false,
      error: null,
      isStreaming: false
    }));
  }

  function generateId(): string {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  return {
    subscribe,
    destroy,
    get,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    updateFilter,
    startStreaming,
    stopStreaming
  };
}