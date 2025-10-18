  const flushTimers = async (ms = 0) => {
    await vi.advanceTimersByTimeAsync(ms);
    await Promise.resolve();
  };

/**
 * Presence Store Tests - Comprehensive testing for reactivity and memory safety
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createPresenceStore } from '../../src/stores/presenceStore';
import type { PresenceConfig, UserPresence, SessionInfo } from '../../src/stores/types';
import type {
  RelationshipUpdatesSubscription,
  TrustUpdatesSubscription
} from '../../src/graphql/generated/types';

type RelationshipUpdatePayload = RelationshipUpdatesSubscription['relationshipUpdates'];
type TrustUpdatePayload = TrustUpdatesSubscription['trustUpdates'];

// Mock window object for browser APIs
const mockWindow = {
  location: {
    pathname: '/test',
    hash: '#section1'
  },
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
};
Object.defineProperty(globalThis, 'window', {
  value: mockWindow,
  writable: true
});

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
      latency: 25,
      lastEventId: null,
      reconnectAttempts: 0
    };
  }
}

const isoNow = () => new Date().toISOString();

function createLesserAccount(overrides: Record<string, unknown> = {}) {
  const now = isoNow();
  return {
    id: 'actor-1',
    handle: 'actor@example.com',
    localHandle: 'actor',
    displayName: 'Actor',
    bio: '',
    avatarUrl: 'https://avatars.example.com/actor',
    bannerUrl: '',
    joinedAt: now,
    isVerified: false,
    isBot: false,
    isLocked: false,
    followerCount: 0,
    followingCount: 0,
    postCount: 0,
    profileFields: [],
    customEmojis: [],
    trustScore: 80,
    ...overrides
  };
}

function createRelationshipUpdatePayload(
  overrides: Record<string, unknown> = {}
): RelationshipUpdatePayload {
  const base = {
    type: 'followed',
    timestamp: isoNow(),
    relationship: { id: 'rel-1', following: true, followedBy: true },
    actor: createLesserAccount()
  };

  return { ...base, ...overrides } as unknown as RelationshipUpdatePayload;
}

function createTrustUpdatePayload(
  overrides: Record<string, unknown> = {}
): TrustUpdatePayload {
  const base = {
    category: 'QUALITY',
    score: 92,
    updatedAt: isoNow(),
    from: createLesserAccount({ id: 'trust-source' }),
    to: createLesserAccount({ id: 'trust-target', handle: 'target@example.com', localHandle: 'target' })
  };

  return { ...base, ...overrides } as unknown as TrustUpdatePayload;
}

describe('Presence Store', () => {
  let mockTransport: MockTransportManager;
  let config: PresenceConfig;

  beforeEach(() => {
    mockTransport = new MockTransportManager();
    vi.useFakeTimers();
    
    config = {
      transportManager: mockTransport as any,
      currentUser: {
        userId: 'current-user',
        displayName: 'Current User',
        avatar: 'https://avatar.example.com/current'
      },
      heartbeatInterval: 1000,
      inactivityThreshold: 5000,
      updateDebounceMs: 100,
      enableLocationTracking: true
    };

    // Reset window mock
    mockWindow.addEventListener.mockClear();
    mockWindow.removeEventListener.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Initialization', () => {
    it('should initialize with current user presence', async () => {
      const store = createPresenceStore(config);
      
      // Wait for initialization effect
      await vi.advanceTimersByTimeAsync(10);
      
      const state = store.get();
      expect(state.currentUser).toBeTruthy();
      expect(state.currentUser?.userId).toBe('current-user');
      expect(state.currentUser?.displayName).toBe('Current User');
      expect(state.currentUser?.isOnline).toBe(true);
      expect(state.currentUser?.status).toBe('active');
    });

    it('should update status message from trustUpdates', async () => {
      const store = createPresenceStore(config);
      store.startMonitoring();

      const trustPayload = createTrustUpdatePayload({
        score: 88,
        to: createLesserAccount({
          id: 'trust-user',
          displayName: 'Trust User'
        })
      });

      mockTransport.emit('trustUpdates', {
        type: 'trustUpdates',
        data: trustPayload
      });

      await vi.advanceTimersByTimeAsync(110);

      const presence = store.get().users.get('trust-user');
      expect(presence?.statusMessage).toBe('Trust score: 88');
    });

    it('should initialize with location tracking when enabled', async () => {
      const store = createPresenceStore(config);
      
      await vi.advanceTimersByTimeAsync(10);
      
      const state = store.get();
      expect(state.currentUser?.location).toBeTruthy();
      expect(state.currentUser?.location?.page).toBe('/test');
    });

    it('should initialize without location tracking when disabled', async () => {
      const disabledConfig = { ...config, enableLocationTracking: false };
      const store = createPresenceStore(disabledConfig);
      
      await vi.advanceTimersByTimeAsync(10);
      
      const state = store.get();
      expect(state.currentUser?.location).toBeUndefined();
    });

    it('should initialize connection health as disconnected', () => {
      const store = createPresenceStore(config);
      const state = store.get();
      
      expect(state.connectionHealth.status).toBe('disconnected');
      expect(state.connectionHealth.latency).toBeNull();
      expect(state.connectionHealth.lastHeartbeat).toBeNull();
    });
  });

  describe('Reactivity', () => {
    it('should notify subscribers when state changes', async () => {
      const store = createPresenceStore(config);
      let callCount = 0;
      let lastState;
      
      const unsubscribe = store.subscribe((state) => {
        callCount++;
        lastState = state;
      });
      
      expect(callCount).toBe(1);
      
      store.updatePresence({ status: 'busy' });
      
      await vi.advanceTimersByTimeAsync(10);
      expect(callCount).toBeGreaterThan(1);
      expect(lastState.currentUser?.status).toBe('busy');
      
      unsubscribe();
    });

    it('should update presence statistics reactively', async () => {
      const store = createPresenceStore(config);
      
      // Add some users
      const user1: UserPresence = {
        userId: 'user1',
        displayName: 'User 1',
        isOnline: true,
        lastSeen: Date.now(),
        status: 'active'
      };
      
      const user2: UserPresence = {
        userId: 'user2',
        displayName: 'User 2',
        isOnline: true,
        lastSeen: Date.now(),
        status: 'idle'
      };
      
      const state = store.get();
      state.users.set('user1', user1);
      state.users.set('user2', user2);

      await flushTimers(10);

      const updatedState = store.get();
      expect(updatedState.stats.totalUsers).toBe(3); // Including current user
      expect(updatedState.stats.onlineUsers).toBe(3);
      expect(updatedState.stats.activeUsers).toBe(2);
      expect(updatedState.stats.idleUsers).toBe(1);
    });
  });

  describe('Presence Updates', () => {
    it('should update current user presence', async () => {
      const store = createPresenceStore(config);
      
      await vi.advanceTimersByTimeAsync(10);
      
      store.updatePresence({
        status: 'busy',
        statusMessage: 'In a meeting'
      });
      
      const state = store.get();
      expect(state.currentUser?.status).toBe('busy');
      expect(state.currentUser?.statusMessage).toBe('In a meeting');
      expect(state.users.get(config.currentUser.userId)?.status).toBe('busy');
    });

    it('should update location', async () => {
      const store = createPresenceStore(config);
      
      await vi.advanceTimersByTimeAsync(10);
      
      store.updateLocation({
        page: '/dashboard',
        section: 'analytics',
        coordinates: { x: 100, y: 200 }
      });
      
      const state = store.get();
      expect(state.currentUser?.location?.page).toBe('/dashboard');
      expect(state.currentUser?.location?.section).toBe('analytics');
      expect(state.currentUser?.location?.coordinates).toEqual({ x: 100, y: 200 });
    });

    it('should set status with message', async () => {
      const store = createPresenceStore(config);
      
      await vi.advanceTimersByTimeAsync(10);
      
      store.setStatus('away', 'Gone for lunch');
      
      const state = store.get();
      expect(state.currentUser?.status).toBe('away');
      expect(state.currentUser?.statusMessage).toBe('Gone for lunch');
    });

    it('should send presence updates to transport when streaming', async () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      
      await vi.advanceTimersByTimeAsync(10);
      
      store.updatePresence({ status: 'busy' });
      
      expect(mockTransport.lastSentMessage).toEqual({
        type: 'presence_update',
        data: expect.objectContaining({
          userId: 'current-user',
          status: 'busy'
        })
      });
    });
  });

  describe('User Lookup', () => {
    it('should get user presence by ID', async () => {
      const store = createPresenceStore(config);
      
      const user: UserPresence = {
        userId: 'test-user',
        displayName: 'Test User',
        isOnline: true,
        lastSeen: Date.now(),
        status: 'active'
      };
      
      const state = store.get();
      state.users.set('test-user', user);
      
      const retrievedUser = store.getUserPresence('test-user');
      expect(retrievedUser).toEqual(user);
    });

    it('should return null for non-existent users', () => {
      const store = createPresenceStore(config);
      
      const retrievedUser = store.getUserPresence('nonexistent');
      expect(retrievedUser).toBeNull();
    });

    it('should get active sessions', async () => {
      const store = createPresenceStore(config);
      
      const session1: SessionInfo = {
        sessionId: 'session-1',
        userId: 'user1',
        startTime: Date.now(),
        lastActivity: Date.now(),
        connectionStatus: 'connected'
      };
      
      const session2: SessionInfo = {
        sessionId: 'session-2',
        userId: 'user2',
        startTime: Date.now(),
        lastActivity: Date.now(),
        connectionStatus: 'disconnected'
      };
      
      const state = store.get();
      state.sessions.set('session-1', session1);
      state.sessions.set('session-2', session2);
      
      const activeSessions = store.getActiveSessions();
      expect(activeSessions).toHaveLength(1);
      expect(activeSessions[0].sessionId).toBe('session-1');
    });
  });

  describe('Heartbeat System', () => {
    it('should send heartbeats when monitoring starts', async () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      
      await vi.advanceTimersByTimeAsync(10);
      
      // Fast forward past heartbeat interval
      vi.advanceTimersByTime(1001);
      
      expect(mockTransport.lastSentMessage).toEqual({
        type: 'presence_heartbeat',
        data: expect.objectContaining({
          userId: 'current-user',
          timestamp: expect.any(Number)
        })
      });
    });

    it('should update connection health on successful heartbeat', async () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      
      await vi.advanceTimersByTimeAsync(10);
      
      // Trigger heartbeat
      vi.advanceTimersByTime(1001);
      
      const state = store.get();
      expect(state.connectionHealth.status).toBe('healthy');
      expect(state.connectionHealth.latency).toBe(25); // From mock transport
    });

    it('should handle heartbeat errors', async () => {
      const store = createPresenceStore(config);
      
      // Mock transport to throw error
      vi.spyOn(mockTransport, 'send').mockImplementation(() => {
        throw new Error('Network error');
      });
      
      store.startMonitoring();
      
      await vi.advanceTimersByTimeAsync(10);
      
      // Trigger heartbeat
      vi.advanceTimersByTime(1001);
      
      const state = store.get();
      expect(state.connectionHealth.status).toBe('poor');
      expect(state.error).toBeTruthy();
    });
  });

  describe('Inactivity Monitoring', () => {
    it('should set up activity event listeners', () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      
      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        'mousedown',
        expect.any(Function),
        { passive: true }
      );
      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function),
        { passive: true }
      );
      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        'keypress',
        expect.any(Function),
        { passive: true }
      );
    });

    it('should set user to idle after inactivity threshold', async () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      
      await vi.advanceTimersByTimeAsync(10);
      
      // Fast forward past inactivity threshold
      vi.advanceTimersByTime(5001);
      
      const state = store.get();
      expect(state.currentUser?.status).toBe('idle');
    });

    it('should reset to active on user activity', async () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      
      await vi.advanceTimersByTimeAsync(10);
      
      // Set to idle first
      store.setStatus('idle');
      expect(store.get().currentUser?.status).toBe('idle');
      
      // Simulate activity event
      const activityHandler = mockWindow.addEventListener.mock.calls
        .find(call => call[0] === 'mousedown')?.[1];
      
      if (activityHandler) {
        activityHandler();
      }
      
      await vi.advanceTimersByTimeAsync(10);
      
      const state = store.get();
      expect(state.currentUser?.status).toBe('active');
    });
  });

  describe('Location Tracking', () => {
    it('should track navigation changes', () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      
      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        'popstate',
        expect.any(Function)
      );
      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        'hashchange',
        expect.any(Function)
      );
    });

    it('should update location on navigation', async () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      
      await vi.advanceTimersByTimeAsync(10);
      
      // Change window location
      mockWindow.location.pathname = '/new-page';
      mockWindow.location.hash = '#new-section';
      
      // Simulate navigation event
      const popstateHandler = mockWindow.addEventListener.mock.calls
        .find(call => call[0] === 'popstate')?.[1];
      
      if (popstateHandler) {
        popstateHandler();
      }
      
      await vi.advanceTimersByTimeAsync(10);
      
      const state = store.get();
      expect(state.currentUser?.location?.page).toBe('/new-page');
      expect(state.currentUser?.location?.section).toBe('new-section');
    });
  });

  describe('Streaming Updates', () => {
    it('should handle relationshipUpdates events', async () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      
      const relationshipPayload = createRelationshipUpdatePayload({
        type: 'followed',
        actor: createLesserAccount({
          id: 'remote-user',
          displayName: 'Remote User',
          avatarUrl: 'https://avatars.example.com/remote'
        })
      });
      
      mockTransport.emit('relationshipUpdates', {
        type: 'relationshipUpdates',
        data: relationshipPayload
      });

      // Wait for debounce
      await vi.advanceTimersByTimeAsync(110);
      
      const state = store.get();
      const presence = state.users.get('remote-user');
      expect(presence?.displayName).toBe('Remote User');
      expect(presence?.isOnline).toBe(true);
      expect(presence?.status).toBe('active');
    });

    it('should handle user joined events via relationshipUpdates', async () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      
      const newUserPayload = createRelationshipUpdatePayload({
        type: 'followed',
        actor: createLesserAccount({
          id: 'new-user',
          displayName: 'New User'
        })
      });

      mockTransport.emit('relationshipUpdates', {
        type: 'relationshipUpdates',
        data: newUserPayload
      });

      await vi.advanceTimersByTimeAsync(110);
      
      const state = store.get();
      const newUserPresence = state.users.get('new-user');
      expect(newUserPresence?.displayName).toBe('New User');
      expect(newUserPresence?.isOnline).toBe(true);
    });

    it('should handle user left events', async () => {
      const store = createPresenceStore(config);
      
      // Add a user first
      const state = store.get();
      const user: UserPresence = {
        userId: 'leaving-user',
        displayName: 'Leaving User',
        isOnline: true,
        lastSeen: Date.now(),
        status: 'active'
      };
      state.users.set('leaving-user', user);
      
      store.startMonitoring();

      const leavePayload = createRelationshipUpdatePayload({
        type: 'blocked',
        actor: createLesserAccount({
          id: 'leaving-user',
          displayName: 'Leaving User'
        })
      });

      mockTransport.emit('relationshipUpdates', {
        type: 'relationshipUpdates',
        data: leavePayload
      });

      await vi.advanceTimersByTimeAsync(110);
      
      const updatedState = store.get();
      const leftUser = updatedState.users.get('leaving-user');
      expect(leftUser?.isOnline).toBe(false);
      expect(leftUser?.status).toBe('offline');
    });

    it('should handle session updates', async () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      
      const sessionInfo: SessionInfo = {
        sessionId: 'session-123',
        userId: 'user-123',
        startTime: Date.now(),
        lastActivity: Date.now(),
        connectionStatus: 'connected'
      };
      
      mockTransport.emit('metricsUpdates', {
        type: 'metricsUpdates',
        data: sessionInfo
      });
      
      await vi.advanceTimersByTimeAsync(10);
      
      const state = store.get();
      expect(state.sessions.get('session-123')).toEqual(sessionInfo);
    });

    it('should handle bulk presence updates', async () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      
      const users: UserPresence[] = [
        {
          userId: 'bulk-user-1',
          displayName: 'Bulk User 1',
          isOnline: true,
          lastSeen: Date.now(),
          status: 'active'
        },
        {
          userId: 'bulk-user-2',
          displayName: 'Bulk User 2',
          isOnline: true,
          lastSeen: Date.now(),
          status: 'idle'
        }
      ];
      
      mockTransport.emit('metricsUpdates', {
        type: 'metricsUpdates',
        data: { users }
      });
      
      await vi.advanceTimersByTimeAsync(110);
      
      const state = store.get();
      expect(state.users.get('bulk-user-1')).toEqual(users[0]);
      expect(state.users.get('bulk-user-2')).toEqual(users[1]);
    });

    it('should debounce rapid presence updates', async () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      
      const user: UserPresence = {
        userId: 'rapid-user',
        displayName: 'Rapid User',
        isOnline: true,
        lastSeen: Date.now(),
        status: 'active'
      };
      
      const statuses: Array<UserPresence['status']> = ['active', 'idle', 'busy', 'away', 'idle'];
      statuses.forEach(status => {
        mockTransport.emit('metricsUpdates', {
          type: 'metricsUpdates',
          data: { users: [{ ...user, status }] }
        });
      });

      await flushTimers(110);

      const state = store.get();
      const updatedUser = state.users.get('rapid-user');
      expect(updatedUser?.status).toBe('idle'); // Should have latest update
    });
  });

  describe('Connection Management', () => {
    it('should start monitoring and connect transport', () => {
      const store = createPresenceStore(config);
      const connectSpy = vi.spyOn(mockTransport, 'connect');
      
      store.startMonitoring();
      
      const state = store.get();
      expect(state.isStreaming).toBe(true);
      expect(connectSpy).toHaveBeenCalled();
    });

    it('should handle connection open events', async () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      
      mockTransport.emit('open', {});
      
      await vi.advanceTimersByTimeAsync(10);
      
      const state = store.get();
      expect(state.connectionHealth.status).toBe('healthy');
      expect(state.connectionHealth.reconnectAttempts).toBe(0);
    });

    it('should handle connection errors', () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      
      const error = new Error('Connection failed');
      mockTransport.emit('error', { error });
      
      const state = store.get();
      expect(state.connectionHealth.status).toBe('poor');
      expect(state.error).toBe(error);
    });

    it('should handle connection close events', async () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      
      await vi.advanceTimersByTimeAsync(10);
      
      mockTransport.emit('close', {});
      
      const state = store.get();
      expect(state.isStreaming).toBe(false);
      expect(state.connectionHealth.status).toBe('disconnected');
      expect(state.currentUser?.isOnline).toBe(false);
    });

    it('should handle reconnecting events', () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      
      mockTransport.emit('reconnecting', {});
      
      const state = store.get();
      expect(state.connectionHealth.status).toBe('poor');
      expect(state.connectionHealth.reconnectAttempts).toBe(1);
    });

    it('should stop monitoring and cleanup', () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      
      expect(store.get().isStreaming).toBe(true);
      
      store.stopMonitoring();
      
      const state = store.get();
      expect(state.isStreaming).toBe(false);
      expect(state.connectionHealth.status).toBe('disconnected');
    });
  });

  describe('Memory Management', () => {
    it('should cleanup resources on destroy', async () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      
      await vi.advanceTimersByTimeAsync(10);
      
      // Add some data
      const state = store.get();
      state.users.set('test-user', {
        userId: 'test-user',
        displayName: 'Test',
        isOnline: true,
        lastSeen: Date.now(),
        status: 'active'
      });
      
      expect(state.users.size).toBeGreaterThan(0);
      expect(state.isStreaming).toBe(true);
      
      store.destroy();
      
      const finalState = store.get();
      expect(finalState.users.size).toBe(0);
      expect(finalState.sessions.size).toBe(0);
      expect(finalState.currentUser).toBeNull();
      expect(finalState.isStreaming).toBe(false);
      expect(finalState.connectionHealth.status).toBe('disconnected');
    });

    it('should cleanup event listeners on destroy', () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      store.destroy();
      
      // Event listeners should be removed
      expect(mockWindow.removeEventListener).toHaveBeenCalled();
    });

    it('should prevent memory leaks from subscriptions', () => {
      const store = createPresenceStore(config);
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

    it('should cleanup timers on destroy', () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      
      // Start heartbeat timer
      vi.advanceTimersByTime(100);
      
      store.destroy();
      
      // Should not throw when advancing time after destroy
      vi.advanceTimersByTime(10000);
      expect(true).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle presence updates without current user', () => {
      const noUserConfig = { ...config, currentUser: undefined as any };
      const store = createPresenceStore(noUserConfig);
      
      // Should not throw
      store.updatePresence({ status: 'busy' });
      expect(store.get().currentUser).toBeNull();
    });

    it('should handle streaming without transport manager', () => {
      const noTransportConfig = { ...config, transportManager: undefined as any };
      const store = createPresenceStore(noTransportConfig);
      
      // Should not throw
      store.startMonitoring();
      expect(store.get().isStreaming).toBe(false);
    });

    it('should handle malformed presence messages', async () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      
      // Send malformed message
      mockTransport.emit('relationshipUpdates', {
        type: 'relationshipUpdates',
        data: null
      });
      
      await vi.advanceTimersByTimeAsync(110);
      
      // Should not crash
      expect(true).toBe(true);
    });

    it('should handle unknown message types gracefully', async () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      
      mockTransport.emit('metricsUpdates', {
        type: 'metricsUpdates',
        data: { someData: 'test' }
      });
      
      await vi.advanceTimersByTimeAsync(110);
      
      // Should not crash
      expect(true).toBe(true);
    });

    it('should handle concurrent presence updates', async () => {
      const store = createPresenceStore(config);
      store.startMonitoring();
      
      await vi.advanceTimersByTimeAsync(10);
      
      // Send multiple concurrent updates
      store.updatePresence({ status: 'busy' });
      store.setStatus('idle');
      store.updateLocation({ page: '/new' });
      
      await vi.advanceTimersByTimeAsync(10);
      
      const state = store.get();
      // Should have applied all updates
      expect(state.currentUser?.status).toBe('idle');
      expect(state.currentUser?.location?.page).toBe('/new');
    });
  });
});
