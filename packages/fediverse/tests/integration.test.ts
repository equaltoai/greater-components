import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TransportManager } from '../src/lib/transport';
import { TimelineStore } from '../src/lib/timelineStore';
import { NotificationStore } from '../src/lib/notificationStore';
import { createTimelineIntegration, createNotificationIntegration } from '../src/lib/integration';
import type { Status, Notification } from '../src/types';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock WebSocket
const mockWebSocket = vi.fn().mockImplementation(() => ({
  send: vi.fn(),
  close: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  readyState: 1,
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
}));
global.WebSocket = mockWebSocket;

// Mock EventSource
const mockEventSource = vi.fn().mockImplementation(() => ({
  close: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
}));
global.EventSource = mockEventSource;

describe('Transport Integration', () => {
  let transport: TransportManager;
  let mockWs: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([])
    });

    mockWs = {
      send: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      readyState: 1,
      onopen: null,
      onmessage: null,
      onclose: null,
      onerror: null
    };
    mockWebSocket.mockImplementation(() => mockWs);

    transport = new TransportManager({
      baseUrl: 'https://example.com',
      accessToken: 'test-token',
      protocol: 'websocket'
    });
  });

  afterEach(() => {
    transport?.disconnect();
  });

  describe('WebSocket Transport', () => {
    it('should connect via WebSocket successfully', async () => {
      const connectPromise = transport.connect();
      
      // Simulate successful connection
      setTimeout(() => {
        if (mockWs.onopen) mockWs.onopen({});
      }, 0);

      await expect(connectPromise).resolves.toBeUndefined();
      expect(mockWebSocket).toHaveBeenCalledWith(
        expect.stringContaining('wss://example.com/api/v1/streaming')
      );
    });

    it('should handle WebSocket messages correctly', async () => {
      const statusUpdateHandler = vi.fn();
      transport.on('status.update', statusUpdateHandler);

      const connectPromise = transport.connect();
      setTimeout(() => {
        if (mockWs.onopen) mockWs.onopen({});
      }, 0);
      await connectPromise;

      // Simulate incoming message
      const mockStatus: Status = {
        id: '1',
        uri: 'https://example.com/statuses/1',
        url: 'https://example.com/@user/1',
        account: {
          id: '1',
          username: 'testuser',
          acct: 'testuser',
          displayName: 'Test User',
          avatar: 'https://example.com/avatar.jpg',
          url: 'https://example.com/@testuser',
          createdAt: '2023-01-01T00:00:00Z'
        },
        content: 'Test status',
        createdAt: '2023-01-01T00:00:00Z',
        visibility: 'public',
        repliesCount: 0,
        reblogsCount: 0,
        favouritesCount: 0
      };

      const message = {
        data: JSON.stringify({
          event: 'update',
          payload: mockStatus
        })
      };

      if (mockWs.onmessage) mockWs.onmessage(message);

      expect(statusUpdateHandler).toHaveBeenCalledWith(mockStatus);
    });

    it('should handle connection errors', async () => {
      const errorHandler = vi.fn();
      transport.on('connection.error', errorHandler);

      const connectPromise = transport.connect();
      
      // Simulate connection error
      setTimeout(() => {
        if (mockWs.onerror) mockWs.onerror(new Error('Connection failed'));
      }, 0);

      await expect(connectPromise).rejects.toThrow();
      expect(errorHandler).toHaveBeenCalled();
    });

    it('should reconnect after connection loss', async () => {
      const reconnectingHandler = vi.fn();
      transport.on('connection.reconnecting', reconnectingHandler);

      // Initial connection
      const connectPromise = transport.connect();
      setTimeout(() => {
        if (mockWs.onopen) mockWs.onopen({});
      }, 0);
      await connectPromise;

      // Simulate connection loss
      if (mockWs.onclose) mockWs.onclose({ code: 1006 }); // Abnormal closure

      // Wait for reconnection attempt
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(reconnectingHandler).toHaveBeenCalled();
    });
  });

  describe('Polling Transport', () => {
    it('should use polling fallback', async () => {
      const pollingTransport = new TransportManager({
        baseUrl: 'https://example.com',
        accessToken: 'test-token',
        protocol: 'polling',
        pollInterval: 100
      });

      await pollingTransport.connect();

      // Wait for poll cycle
      await new Promise(resolve => setTimeout(resolve, 150));

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/timelines/public'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token'
          })
        })
      );

      pollingTransport.disconnect();
    });
  });
});

describe('Timeline Store Integration', () => {
  let timelineStore: TimelineStore;
  let transport: TransportManager;
  let mockStatuses: Status[];

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockStatuses = [
      {
        id: '1',
        uri: 'https://example.com/statuses/1',
        url: 'https://example.com/@user/1',
        account: {
          id: '1',
          username: 'testuser',
          acct: 'testuser',
          displayName: 'Test User',
          avatar: 'https://example.com/avatar.jpg',
          url: 'https://example.com/@testuser',
          createdAt: '2023-01-01T00:00:00Z'
        },
        content: 'Test status',
        createdAt: '2023-01-01T00:00:00Z',
        visibility: 'public',
        repliesCount: 0,
        reblogsCount: 0,
        favouritesCount: 0
      }
    ];

    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockStatuses)
    });

    timelineStore = new TimelineStore({
      maxItems: 100,
      preloadCount: 20,
      type: 'public',
      enableRealtime: true
    });

    transport = new TransportManager({
      baseUrl: 'https://example.com',
      protocol: 'polling',
      pollInterval: 1000
    });
  });

  afterEach(() => {
    timelineStore?.destroy();
    transport?.disconnect();
  });

  it('should load initial timeline data', async () => {
    await timelineStore.loadInitial('https://example.com', 'test-token');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/timelines/public'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-token'
        })
      })
    );

    expect(timelineStore.items).toHaveLength(1);
    expect(timelineStore.items[0]).toEqual(mockStatuses[0]);
  });

  it('should handle real-time status updates', async () => {
    timelineStore.connectTransport(transport);
    await timelineStore.loadInitial('https://example.com', 'test-token');

    const newStatus: Status = {
      ...mockStatuses[0],
      id: '2',
      content: 'New status'
    };

    // Simulate real-time update
    transport.emit('status.update' as any, newStatus);

    expect(timelineStore.items).toHaveLength(2);
    expect(timelineStore.items[0]).toEqual(newStatus); // New status should be first
    expect(timelineStore.unreadCount).toBe(1);
  });

  it('should handle status deletion', async () => {
    await timelineStore.loadInitial('https://example.com', 'test-token');
    
    timelineStore.connectTransport(transport);
    
    // Simulate status deletion
    transport.emit('status.delete' as any, { id: '1' });

    expect(timelineStore.items).toHaveLength(0);
  });

  it('should load newer statuses', async () => {
    await timelineStore.loadInitial('https://example.com', 'test-token');

    const newerStatuses = [
      { ...mockStatuses[0], id: '2', content: 'Newer status' }
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(newerStatuses)
    });

    await timelineStore.loadNewer('https://example.com', 'test-token');

    expect(timelineStore.items).toHaveLength(2);
    expect(timelineStore.items[0].id).toBe('2'); // Newer should be first
  });

  it('should load older statuses', async () => {
    await timelineStore.loadInitial('https://example.com', 'test-token');

    const olderStatuses = [
      { ...mockStatuses[0], id: '0', content: 'Older status' }
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(olderStatuses)
    });

    await timelineStore.loadOlder('https://example.com', 'test-token');

    expect(timelineStore.items).toHaveLength(2);
    expect(timelineStore.items[1].id).toBe('0'); // Older should be last
  });

  it('should handle loading states correctly', async () => {
    expect(timelineStore.loading).toBe(false);

    const loadPromise = timelineStore.loadInitial('https://example.com', 'test-token');
    expect(timelineStore.loading).toBe(true);

    await loadPromise;
    expect(timelineStore.loading).toBe(false);
  });

  it('should handle errors gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    await timelineStore.loadInitial('https://example.com', 'test-token');

    expect(timelineStore.error).toBe('HTTP 500: Internal Server Error');
    expect(timelineStore.items).toHaveLength(0);
  });
});

describe('Notification Store Integration', () => {
  let notificationStore: NotificationStore;
  let transport: TransportManager;
  let mockNotifications: Notification[];

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockNotifications = [
      {
        id: '1',
        type: 'mention',
        createdAt: '2023-01-01T00:00:00Z',
        account: {
          id: '1',
          username: 'testuser',
          acct: 'testuser',
          displayName: 'Test User',
          avatar: 'https://example.com/avatar.jpg',
          url: 'https://example.com/@testuser',
          createdAt: '2023-01-01T00:00:00Z'
        },
        status: {
          id: '1',
          uri: 'https://example.com/statuses/1',
          url: 'https://example.com/@user/1',
          account: {
            id: '1',
            username: 'testuser',
            acct: 'testuser',
            displayName: 'Test User',
            avatar: 'https://example.com/avatar.jpg',
            url: 'https://example.com/@testuser',
            createdAt: '2023-01-01T00:00:00Z'
          },
          content: '@testuser Hello!',
          createdAt: '2023-01-01T00:00:00Z',
          visibility: 'public',
          repliesCount: 0,
          reblogsCount: 0,
          favouritesCount: 0
        },
        read: false
      }
    ] as Notification[];

    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockNotifications)
    });

    notificationStore = new NotificationStore({
      maxItems: 100,
      preloadCount: 20,
      enableRealtime: true,
      groupSimilar: true
    });

    transport = new TransportManager({
      baseUrl: 'https://example.com',
      protocol: 'polling',
      pollInterval: 1000
    });
  });

  afterEach(() => {
    notificationStore?.destroy();
    transport?.disconnect();
  });

  it('should load initial notifications', async () => {
    await notificationStore.loadInitial('https://example.com', 'test-token');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/notifications'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-token'
        })
      })
    );

    expect(notificationStore.items).toHaveLength(1);
    expect(notificationStore.unreadCount).toBe(1);
  });

  it('should handle real-time notification updates', async () => {
    notificationStore.connectTransport(transport);
    await notificationStore.loadInitial('https://example.com', 'test-token');

    const newNotification: Notification = {
      ...mockNotifications[0],
      id: '2',
      read: false
    };

    // Simulate real-time notification
    transport.emit('notification.new' as any, newNotification);

    expect(notificationStore.items).toHaveLength(2);
    expect(notificationStore.items[0]).toEqual(newNotification);
    expect(notificationStore.unreadCount).toBe(2);
  });

  it('should mark notification as read', async () => {
    await notificationStore.loadInitial('https://example.com', 'test-token');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({})
    });

    await notificationStore.markAsRead('1', 'https://example.com', 'test-token');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/notifications/1/dismiss'),
      expect.objectContaining({
        method: 'POST'
      })
    );

    expect(notificationStore.unreadCount).toBe(0);
  });

  it('should mark all notifications as read', async () => {
    const unreadNotifications = mockNotifications.map(n => ({ ...n, read: false }));
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(unreadNotifications)
    });

    await notificationStore.loadInitial('https://example.com', 'test-token');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({})
    });

    await notificationStore.markAllAsRead('https://example.com', 'test-token');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/notifications/clear'),
      expect.objectContaining({
        method: 'POST'
      })
    );

    expect(notificationStore.unreadCount).toBe(0);
  });

  it('should toggle grouping', () => {
    expect(notificationStore.grouped).toBe(true);
    
    notificationStore.toggleGrouping();
    expect(notificationStore.grouped).toBe(false);
    
    notificationStore.toggleGrouping();
    expect(notificationStore.grouped).toBe(true);
  });

  it('should dismiss notification', async () => {
    await notificationStore.loadInitial('https://example.com', 'test-token');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({})
    });

    await notificationStore.dismissNotification('1', 'https://example.com', 'test-token');

    expect(notificationStore.items).toHaveLength(0);
  });
});

describe('Integration Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([])
    });
  });

  it('should create timeline integration with transport', async () => {
    const integration = createTimelineIntegration({
      baseUrl: 'https://example.com',
      accessToken: 'test-token',
      transport: {
        baseUrl: 'https://example.com',
        protocol: 'polling',
        pollInterval: 1000
      },
      timeline: {
        maxItems: 50,
        type: 'public'
      }
    });

    expect(integration.store).toBeInstanceOf(TimelineStore);
    expect(integration.transport).toBeInstanceOf(TransportManager);

    await integration.connect();

    expect(integration.state.connected).toBe(true);
    expect(mockFetch).toHaveBeenCalled();

    integration.destroy();
  });

  it('should create notification integration with transport', async () => {
    const integration = createNotificationIntegration({
      baseUrl: 'https://example.com',
      accessToken: 'test-token',
      transport: {
        baseUrl: 'https://example.com',
        protocol: 'polling',
        pollInterval: 1000
      },
      notification: {
        maxItems: 50,
        groupSimilar: true
      }
    });

    expect(integration.store).toBeInstanceOf(NotificationStore);
    expect(integration.transport).toBeInstanceOf(TransportManager);

    await integration.connect();

    expect(integration.state.connected).toBe(true);
    expect(mockFetch).toHaveBeenCalled();

    integration.destroy();
  });

  it('should handle integration errors gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const integration = createTimelineIntegration({
      baseUrl: 'https://example.com',
      accessToken: 'test-token'
    });

    await expect(integration.connect()).rejects.toThrow('Network error');

    integration.destroy();
  });

  it('should provide cleanup functionality', () => {
    const integration = createTimelineIntegration({
      baseUrl: 'https://example.com',
      accessToken: 'test-token'
    });

    // Should not throw when destroying
    expect(() => integration.destroy()).not.toThrow();
  });
});

describe('Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle network failures in timeline store', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const store = new TimelineStore();
    await store.loadInitial('https://example.com', 'test-token');

    expect(store.error).toBe('Network error');
    expect(store.loading).toBe(false);
  });

  it('should handle network failures in notification store', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const store = new NotificationStore();
    await store.loadInitial('https://example.com', 'test-token');

    expect(store.error).toBe('Network error');
    expect(store.loading).toBe(false);
  });

  it('should handle transport connection failures', async () => {
    mockWebSocket.mockImplementation(() => {
      throw new Error('WebSocket not supported');
    });

    const transport = new TransportManager({
      baseUrl: 'https://example.com',
      protocol: 'websocket'
    });

    await expect(transport.connect()).rejects.toThrow('WebSocket not supported');
  });

  it('should recover from optimistic update failures', async () => {
    const store = new NotificationStore();
    
    // Load initial data
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue([mockNotifications[0]])
    });
    await store.loadInitial('https://example.com', 'test-token');

    // Simulate API failure for mark as read
    mockFetch.mockRejectedValueOnce(new Error('API error'));

    await store.markAsRead('1', 'https://example.com', 'test-token');

    // Should revert optimistic update
    expect(store.items[0].read).toBe(false);
  });
});