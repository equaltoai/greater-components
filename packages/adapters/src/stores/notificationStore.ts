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
  const persistentUnsubscribers: (() => void)[] = [];
  let streamingUnsubscribers: (() => void)[] = [];
  let updateDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  let pendingNotifications: Notification[] = [];

  function enforceNotificationLimit(notifications: Notification[]): {
    trimmed: Notification[];
    removed: Notification[];
  } {
    if (!config.maxNotifications || notifications.length <= config.maxNotifications) {
      return { trimmed: notifications, removed: [] };
    }

    let toRemove = notifications.length - config.maxNotifications;
    const removalQueue: Notification[] = [];

    const sortedRead = notifications
      .filter(notification => notification.isRead)
      .sort((a, b) => a.timestamp - b.timestamp);

    for (const notification of sortedRead) {
      if (toRemove === 0) break;
      removalQueue.push(notification);
      toRemove--;
    }

    if (toRemove > 0) {
      const remaining = notifications
        .filter(notification => !removalQueue.includes(notification))
        .sort((a, b) => a.timestamp - b.timestamp);

      for (const notification of remaining) {
        if (toRemove === 0) break;
        removalQueue.push(notification);
        toRemove--;
      }
    }

    const removalIds = new Set(removalQueue.map(notification => notification.id));
    const trimmed = notifications.filter(notification => !removalIds.has(notification.id));

    return {
      trimmed,
      removed: removalQueue
    };
  }

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

    // Deduplicate notifications by ID and ignore already stored items
    const notificationMap = new Map<string, Notification>();
    notifications.forEach(notification => notificationMap.set(notification.id, notification));

    const newNotifications = Array.from(notificationMap.values())
      .filter(notification => !state.value.notifications.some(existing => existing.id === notification.id));

    if (newNotifications.length === 0) {
      return;
    }

    const newNotificationIds = new Set(newNotifications.map(notification => notification.id));
    const mergedNotifications = [...state.value.notifications, ...newNotifications];
    const { trimmed, removed } = enforceNotificationLimit(mergedNotifications);

    state.update(current => ({
      ...current,
      notifications: trimmed
    }));

    trimmed
      .filter(notification => newNotificationIds.has(notification.id))
      .forEach(scheduleAutoDismiss);

    removed.forEach(notification => clearAutoDismiss(notification.id));

    updateDerivedValues(trimmed);
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

    const mergedNotifications = [...state.value.notifications, notification];
    const { trimmed, removed } = enforceNotificationLimit(mergedNotifications);
    const isNotificationKept = trimmed.some(item => item.id === id);

    state.update(current => ({
      ...current,
      notifications: trimmed
    }));

    if (isNotificationKept) {
      scheduleAutoDismiss(notification);
    }

    removed.forEach(item => clearAutoDismiss(item.id));
    updateDerivedValues(trimmed);

    if (isNotificationKept && state.value.isStreaming && config.transportManager) {
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

    ensureMessageSubscription();

    state.update(current => ({
      ...current,
      isStreaming: true,
      error: null
    }));

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

  function handleTransportMessage(event: { data?: unknown }): void {
    if (!event?.data || typeof event.data !== 'object' || !('type' in event.data)) {
      return;
    }

    const eventData = event.data as { type?: string; data?: unknown };
    if (!eventData.type) {
      return;
    }

    switch (eventData.type) {
      case 'notification_received':
        if (eventData.data) {
          scheduleNotificationUpdate(eventData.data as Notification);
        }
        break;
      case 'notification_updated': {
        const payload = eventData.data as { id?: string; updates?: Partial<Notification> } | undefined;
        if (payload?.id && payload.updates) {
          updateNotificationFromStream(payload.id, payload.updates);
        }
        break;
      }
      case 'notification_removed': {
        const payload = eventData.data as { id?: string } | undefined;
        if (payload?.id) {
          removeNotification(payload.id);
        }
        break;
      }
      default:
        break;
    }
  }

  function ensureMessageSubscription(): void {
    if (!config.transportManager) {
      return;
    }

    if (persistentUnsubscribers.length === 0) {
      const unsubscribe = config.transportManager.on('message', handleTransportMessage);
      persistentUnsubscribers.push(unsubscribe);
    }
  }

  ensureMessageSubscription();

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
      updateDebounceTimer = null;
    }

    persistentUnsubscribers.forEach(unsubscribe => unsubscribe());
    persistentUnsubscribers.length = 0;
    
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

  // Lesser-specific notification helpers
  function getQuoteNotifications(): Notification[] {
    return state.value.notifications.filter(n => n.type === 'quote');
  }

  function getCommunityNoteNotifications(): Notification[] {
    return state.value.notifications.filter(n => n.type === 'community_note');
  }

  function getTrustUpdateNotifications(): Notification[] {
    return state.value.notifications.filter(n => n.type === 'trust_update');
  }

  function getCostAlertNotifications(): Notification[] {
    return state.value.notifications.filter(n => n.type === 'cost_alert');
  }

  function getModerationActionNotifications(): Notification[] {
    return state.value.notifications.filter(n => n.type === 'moderation_action');
  }

  function getUnreadLesserNotifications(): Notification[] {
    const lesserTypes = ['quote', 'community_note', 'trust_update', 'cost_alert', 'moderation_action'];
    return state.value.notifications.filter(n => 
      lesserTypes.includes(n.type) && !n.isRead
    );
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
    stopStreaming,
    // Lesser-specific methods
    getQuoteNotifications,
    getCommunityNoteNotifications,
    getTrustUpdateNotifications,
    getCostAlertNotifications,
    getModerationActionNotifications,
    getUnreadLesserNotifications
  };
}