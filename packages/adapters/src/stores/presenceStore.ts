/**
 * Presence Store - Reactive state management for user presence and connection monitoring
 * Built for Svelte 5 runes compatibility with fallback support
 */

import type {
  PresenceStore,
  PresenceState,
  UserPresence,
  SessionInfo,
  PresenceConfig
} from './types';

const STATUS_PRIORITY: Record<UserPresence['status'], number> = {
  active: 1,
  busy: 2,
  away: 3,
  idle: 4,
  offline: 5
};

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

function createReactiveMap<K, V>(
  source: Map<K, V> | Iterable<[K, V]> | undefined,
  onChange: () => void
): Map<K, V> {
  const base = source instanceof Map
    ? new Map(source)
    : source
      ? new Map(source)
      : new Map<K, V>();

  const proxy = new Proxy(base, {
    get(target, prop, receiver) {
      if (prop === 'size') {
        return target.size;
      }

      if (prop === 'set') {
        return (key: K, value: V) => {
          target.set(key, value);
          onChange();
          return receiver;
        };
      }

      if (prop === 'delete') {
        return (key: K) => {
          const removed = target.delete(key);
          if (removed) {
            onChange();
          }
          return removed;
        };
      }

      if (prop === 'clear') {
        return () => {
          if (target.size > 0) {
            target.clear();
            onChange();
          } else {
            target.clear();
          }
        };
      }

      const value = Reflect.get(target, prop, receiver);
      if (typeof value === 'function') {
        return value.bind(target);
      }
      return value;
    }
  });

  return proxy as Map<K, V>;
}

export function createPresenceStore(config: PresenceConfig): PresenceStore {
  // Create reactive state
  const state = new ReactiveState<PresenceState>({
    currentUser: null,
    users: createReactiveUsersMap(),
    sessions: createReactiveSessionsMap(),
    connectionHealth: {
      status: 'disconnected',
      latency: null,
      lastHeartbeat: null,
      reconnectAttempts: 0
    },
    stats: {
      totalUsers: 0,
      onlineUsers: 0,
      activeUsers: 0,
      idleUsers: 0
    },
    isLoading: false,
    error: null,
    isStreaming: false
  });

  // Initialize current user
  if (config.currentUser) {
    const currentUserPresence: UserPresence = {
      ...config.currentUser,
      isOnline: true,
      lastSeen: Date.now(),
      status: 'active',
      location: config.enableLocationTracking && typeof window !== 'undefined' ? 
        { page: window.location.pathname } : undefined,
      connection: {
        sessionId: generateSessionId(),
        transportType: 'unknown',
        latency: undefined
      }
    };
    
    state.update(current => {
      const users = cloneUsersMap(current.users);
      users.set(config.currentUser.userId, currentUserPresence);

      return {
        ...current,
        currentUser: currentUserPresence,
        users
      };
    });
  }

  // Initialize computed values
  updateDerivedValues();

  // Connection health monitoring
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  let inactivityTimer: ReturnType<typeof setTimeout> | null = null;
  let updateDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  let lastActivity = Date.now();

  // Transport event handlers
  let streamingUnsubscribers: (() => void)[] = [];
  const pendingPresenceUpdates: Map<string, UserPresence> = new Map();

  function createReactiveUsersMap(source?: Map<string, UserPresence>): Map<string, UserPresence> {
    return createReactiveMap(source, updateDerivedValues);
  }

  function createReactiveSessionsMap(source?: Map<string, SessionInfo>): Map<string, SessionInfo> {
    return createReactiveMap(source, () => {});
  }

  function cloneUsersMap(source: Map<string, UserPresence>): Map<string, UserPresence> {
    return createReactiveUsersMap(source);
  }

  function cloneSessionsMap(source: Map<string, SessionInfo>): Map<string, SessionInfo> {
    return createReactiveSessionsMap(source);
  }

  function mergePresence(existing: UserPresence | undefined, incoming: UserPresence): UserPresence {
    if (!existing) {
      return { ...incoming };
    }

    const existingPriority = STATUS_PRIORITY[existing.status] ?? 0;
    const incomingPriority = STATUS_PRIORITY[incoming.status] ?? 0;
    const nextStatus = incomingPriority >= existingPriority ? incoming.status : existing.status;

    const location = mergeLocation(existing.location, incoming.location);
    const connection = mergeConnection(existing.connection, incoming.connection);

    return {
      ...existing,
      ...incoming,
      status: nextStatus,
      lastSeen: Math.max(existing.lastSeen, incoming.lastSeen),
      location,
      connection
    };
  }

  function mergeLocation(
    existing: UserPresence['location'],
    incoming: UserPresence['location']
  ): UserPresence['location'] {
    if (!existing && !incoming) {
      return undefined;
    }

    return {
      ...(existing || {}),
      ...(incoming || {})
    };
  }

  function mergeConnection(
    existing: UserPresence['connection'],
    incoming: UserPresence['connection']
  ): UserPresence['connection'] {
    if (!existing && !incoming) {
      return undefined;
    }

    return {
      ...(existing || {}),
      ...(incoming || {})
    };
  }

  function updateDerivedValues(): void {
    const currentState = state.value;
    const users = Array.from(currentState.users.values());

    const stats = {
      totalUsers: users.length,
      onlineUsers: users.filter(u => u.isOnline).length,
      activeUsers: users.filter(u => u.status === 'active').length,
      idleUsers: users.filter(u => u.status === 'idle').length
    };

    const existing = currentState.stats;
    if (existing.totalUsers === stats.totalUsers &&
        existing.onlineUsers === stats.onlineUsers &&
        existing.activeUsers === stats.activeUsers &&
        existing.idleUsers === stats.idleUsers) {
      return;
    }

    state.update(current => ({
      ...current,
      stats
    }));
  }

  function processPendingUpdates(): void {
    if (pendingPresenceUpdates.size === 0) return;

    const updates = new Map(pendingPresenceUpdates);
    pendingPresenceUpdates.clear();

    state.update(current => {
      const users = cloneUsersMap(current.users);

      updates.forEach((presence, userId) => {
        users.set(userId, presence);
      });

      const updatedCurrentUser = updates.get(config.currentUser.userId) ?? current.currentUser;

      return {
        ...current,
        users,
        currentUser: updatedCurrentUser ?? current.currentUser
      };
    });

    updateDerivedValues();
  }

  function schedulePresenceUpdate(presence: UserPresence): void {
    const existingPending = pendingPresenceUpdates.get(presence.userId);
    const currentPresence = state.value.users.get(presence.userId);
    const mergedPresence = mergePresence(existingPending ?? currentPresence, presence);

    pendingPresenceUpdates.set(presence.userId, mergedPresence);
    
    if (updateDebounceTimer) {
      clearTimeout(updateDebounceTimer);
    }
    
    updateDebounceTimer = setTimeout(() => {
      processPendingUpdates();
      updateDebounceTimer = null;
    }, config.updateDebounceMs || 250);
  }

  function startHeartbeat(): void {
    if (heartbeatTimer || !config.transportManager) return;

    const interval = config.heartbeatInterval || 30000; // 30 seconds
    
    heartbeatTimer = setInterval(() => {
      if (state.value.isStreaming) {
        sendHeartbeat();
      }
    }, interval);
  }

  function stopHeartbeat(): void {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
  }

  function sendHeartbeat(): void {
    if (!config.transportManager || !state.value.currentUser) return;

    const heartbeatData = {
      userId: state.value.currentUser.userId,
      timestamp: Date.now(),
      status: state.value.currentUser.status,
      location: state.value.currentUser.location
    };

    try {
      config.transportManager.send({
        type: 'presence_heartbeat',
        data: heartbeatData
      });
      
      // Update connection health based on transport state
      const transportState = config.transportManager.getState();
      state.update(current => ({
        ...current,
        connectionHealth: {
          ...current.connectionHealth,
          status: transportState.status === 'connected' ? 'healthy' : 'poor',
          latency: transportState.latency,
          reconnectAttempts: transportState.reconnectAttempts,
          lastHeartbeat: Date.now()
        }
      }));
      
    } catch (error) {
      state.update(current => ({
        ...current,
        connectionHealth: { ...current.connectionHealth, status: 'poor' },
        error: error as Error
      }));
    }
  }

  function startInactivityMonitoring(): void {
    const threshold = config.inactivityThreshold || 300000; // 5 minutes
    
    function resetInactivityTimer(): void {
      const now = Date.now();
      lastActivity = now;
      
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      
      // Update last activity in presence
      if (state.value.currentUser) {
        updatePresence({ lastSeen: lastActivity });
      }
      
      // Set user to active if currently idle
      if (state.value.currentUser && state.value.currentUser.status === 'idle') {
        updatePresence({ status: 'active' });
      }
      
      inactivityTimer = setTimeout(() => {
        if (state.value.currentUser && state.value.currentUser.status === 'active') {
          updatePresence({ status: 'idle' });
        }
      }, threshold);
    }

    // Listen for user activity
    if (typeof window !== 'undefined') {
      const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      
      const handleActivity = () => resetInactivityTimer();
      
      activityEvents.forEach(event => {
        window.addEventListener(event, handleActivity, { passive: true });
      });
      
      // Store cleanup function
      const cleanup = () => {
        activityEvents.forEach(event => {
          window.removeEventListener(event, handleActivity);
        });
      };
      
      streamingUnsubscribers.push(cleanup);
    }
    
    // Initialize timer
    resetInactivityTimer();
  }

  function trackLocationChanges(): void {
    if (!config.enableLocationTracking || typeof window === 'undefined') return;

    // Listen for navigation changes
    const handleLocationChange = () => {
      if (state.value.currentUser) {
        updateLocation({
          page: window.location.pathname,
          section: window.location.hash ? window.location.hash.slice(1) : undefined
        });
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    
    // Store cleanup function
    streamingUnsubscribers.push(() => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    });
  }

  // Store methods
  function updatePresence(presenceUpdates: Partial<Omit<UserPresence, 'userId'>>): void {
    const currentUserPresence = state.value.currentUser;
    if (!currentUserPresence) return;

    let mergedPresence = mergePresence(currentUserPresence, {
      ...currentUserPresence,
      ...presenceUpdates,
      userId: currentUserPresence.userId,
      lastSeen: Date.now()
    });

    if (typeof presenceUpdates.status !== 'undefined') {
      mergedPresence = { ...mergedPresence, status: presenceUpdates.status };
    }

    state.update(current => {
      const users = cloneUsersMap(current.users);
      users.set(mergedPresence.userId, mergedPresence);
      
      return {
        ...current,
        currentUser: mergedPresence,
        users
      };
    });
    
    updateDerivedValues();

    if (state.value.isStreaming && config.transportManager) {
      try {
        config.transportManager.send({
          type: 'presence_update',
          data: mergedPresence
        });
      } catch (error) {
        state.update(current => ({
          ...current,
          error: error as Error
        }));
        console.error('Failed to send presence update:', error);
      }
    }
  }

  function updateLocation(location: UserPresence['location']): void {
    if (!state.value.currentUser) return;

    updatePresence({ location });
  }

  function setStatus(status: UserPresence['status'], message?: string): void {
    if (!state.value.currentUser) return;

    updatePresence({ 
      status, 
      statusMessage: message 
    });
  }

  function getUserPresence(userId: string): UserPresence | null {
    return state.value.users.get(userId) || null;
  }

  function getActiveSessions(): SessionInfo[] {
    return Array.from(state.value.sessions.values())
      .filter(session => session.connectionStatus === 'connected');
  }

  function startMonitoring(): void {
    if (state.value.isStreaming || !config.transportManager) return;

    state.update(current => ({
      ...current,
      isStreaming: true,
      error: null
    }));

    // Subscribe to presence updates
    const messageHandler = config.transportManager.on('message', (event) => {
      handlePresenceMessage(event.data);
    });

    // Subscribe to connection events
    const openHandler = config.transportManager.on('open', () => {
      state.update(current => ({
        ...current,
        connectionHealth: {
          ...current.connectionHealth,
          status: 'healthy',
          reconnectAttempts: 0
        }
      }));
      
      // Send initial presence
      if (state.value.currentUser) {
        updatePresence({ isOnline: true });
      }
    });

    const errorHandler = config.transportManager.on('error', (event) => {
      state.update(current => ({
        ...current,
        connectionHealth: { ...current.connectionHealth, status: 'poor' },
        error: event.error || new Error('Connection error')
      }));
    });

    const closeHandler = config.transportManager.on('close', () => {
      state.update(current => {
        const currentUser = current.currentUser;
        const users = cloneUsersMap(current.users);
        
        if (currentUser) {
          const offlineUser = { ...currentUser, isOnline: false };
          users.set(offlineUser.userId, offlineUser);
        }
        
        return {
          ...current,
          isStreaming: false,
          currentUser: currentUser ? { ...currentUser, isOnline: false } : null,
          users,
          connectionHealth: { ...current.connectionHealth, status: 'disconnected' }
        };
      });
      
      updateDerivedValues();
    });

    const reconnectingHandler = config.transportManager.on('reconnecting', () => {
      state.update(current => ({
        ...current,
        connectionHealth: {
          ...current.connectionHealth,
          status: 'poor',
          reconnectAttempts: current.connectionHealth.reconnectAttempts + 1
        }
      }));
    });

    streamingUnsubscribers.push(
      messageHandler,
      openHandler,
      errorHandler,
      closeHandler,
      reconnectingHandler
    );

    // Start monitoring systems
    startHeartbeat();
    startInactivityMonitoring();
    trackLocationChanges();

    // Start the transport connection
    try {
      config.transportManager.connect();
    } catch (error) {
      state.update(current => ({
        ...current,
        error: error as Error,
        isStreaming: false,
        connectionHealth: { ...current.connectionHealth, status: 'disconnected' }
      }));
    }
  }

  function stopMonitoring(): void {
    state.update(current => ({
      ...current,
      isStreaming: false,
      connectionHealth: { ...current.connectionHealth, status: 'disconnected' }
    }));

    // Stop monitoring systems
    stopHeartbeat();
    
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      inactivityTimer = null;
    }

    if (updateDebounceTimer) {
      clearTimeout(updateDebounceTimer);
      updateDebounceTimer = null;
    }

    // Clean up event subscriptions
    streamingUnsubscribers.forEach(unsubscribe => unsubscribe());
    streamingUnsubscribers = [];

    // Clear pending updates
    pendingPresenceUpdates.clear();
  }

  function handlePresenceMessage(data: any): void {
    if (!data || !data.type) return;

    switch (data.type) {
      case 'presence_update':
        if (data.data?.userId) {
          schedulePresenceUpdate(data.data as UserPresence);
        }
        break;

      case 'presence_user_joined':
        if (data.data?.userId) {
          const userPresence = data.data as UserPresence;
          schedulePresenceUpdate(userPresence);
        }
        break;

      case 'presence_user_left':
        if (data.data?.userId) {
          const userId = data.data.userId;
          const existingUser = state.value.users.get(userId);
          if (existingUser) {
            const offlineUser = { ...existingUser, isOnline: false, status: 'offline' as const };
            schedulePresenceUpdate(offlineUser);
          }
        }
        break;

      case 'presence_session_update':
        if (data.data?.sessionId) {
          const sessionInfo = data.data as SessionInfo;
          state.update(current => {
            const sessions = cloneSessionsMap(current.sessions);
            sessions.set(sessionInfo.sessionId, sessionInfo);
            return { ...current, sessions };
          });
        }
        break;

      case 'presence_bulk_update':
        if (Array.isArray(data.data)) {
          data.data.forEach((presence: UserPresence) => {
            schedulePresenceUpdate(presence);
          });
        }
        break;

      default:
        console.debug('Unknown presence message type:', data.type);
    }
  }

  function subscribe(callback: (value: PresenceState) => void): () => void {
    return state.subscribe(callback);
  }

  function get(): PresenceState {
    return state.value;
  }

  function destroy(): void {
    stopMonitoring();

    // Clear all state
    state.update(() => ({
      currentUser: null,
      users: createReactiveUsersMap(),
      sessions: createReactiveSessionsMap(),
      connectionHealth: {
        status: 'disconnected',
        latency: null,
        lastHeartbeat: null,
        reconnectAttempts: 0
      },
      stats: {
        totalUsers: 0,
        onlineUsers: 0,
        activeUsers: 0,
        idleUsers: 0
      },
      isLoading: false,
      error: null,
      isStreaming: false
    }));
  }

  function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  return {
    subscribe,
    destroy,
    get,
    updatePresence,
    updateLocation,
    setStatus,
    getUserPresence,
    getActiveSessions,
    startMonitoring,
    stopMonitoring
  };
}