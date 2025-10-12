import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SseClient } from '../src/SseClient';
import type { SseClientConfig } from '../src/types';

// Mock EventSource
class MockEventSource {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSED = 2;

  url: string;
  withCredentials: boolean;
  readyState: number = MockEventSource.CONNECTING;
  onopen: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  
  private listeners: Map<string, Set<(event: any) => void>> = new Map();

  constructor(url: string, init?: EventSourceInit) {
    this.url = url;
    this.withCredentials = init?.withCredentials || false;
    
    // Simulate connection opening
    setTimeout(() => {
      if (this.readyState === MockEventSource.CONNECTING) {
        this.readyState = MockEventSource.OPEN;
        const event = new Event('open');
        this.onopen?.(event);
        this.dispatchEvent('open', event);
      }
    }, 10);
  }

  addEventListener(type: string, listener: (event: any) => void): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);
  }

  removeEventListener(type: string, listener: (event: any) => void): void {
    this.listeners.get(type)?.delete(listener);
  }

  dispatchEvent(type: string, event: any): void {
    if (type === 'message' && this.onmessage) {
      this.onmessage(event);
    }
    if (type === 'open' && this.onopen) {
      this.onopen(event);
    }
    if (type === 'error' && this.onerror) {
      this.onerror(event);
    }
    this.listeners.get(type)?.forEach(listener => listener(event));
  }

  close(): void {
    this.readyState = MockEventSource.CLOSED;
  }

  simulateMessage(data: string, lastEventId?: string): void {
    const event = new MessageEvent('message', { 
      data,
      lastEventId
    });
    this.dispatchEvent('message', event);
  }

  simulateError(): void {
    const event = new Event('error');
    this.readyState = MockEventSource.CLOSED; // Set CLOSED before dispatching error
    this.dispatchEvent('error', event);
  }

  simulateCustomEvent(eventType: string, data: string): void {
    const event = new MessageEvent(eventType, { data });
    this.dispatchEvent(eventType, event);
  }
}

// Mock fetch
const mockFetch = vi.fn();

// Mock Storage
class MockStorage implements Storage {
  private store: Map<string, string> = new Map();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) || null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] || null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

describe('SseClient', () => {
  let client: SseClient;
  let mockStorage: MockStorage;
  let originalEventSource: typeof EventSource;
  let originalFetch: typeof fetch;

  beforeEach(() => {
    vi.useFakeTimers();
    originalEventSource = global.EventSource;
    originalFetch = global.fetch;
    (global as any).EventSource = MockEventSource;
    global.fetch = mockFetch;
    mockStorage = new MockStorage();
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    global.EventSource = originalEventSource;
    global.fetch = originalFetch;
    client?.destroy();
  });

  describe('Feature Detection', () => {
    it('should detect EventSource support', () => {
      expect(SseClient.isSupported()).toBe(true);
    });

    it('should detect lack of EventSource support', () => {
      delete (global as any).EventSource;
      expect(SseClient.isSupported()).toBe(false);
      (global as any).EventSource = MockEventSource;
    });
  });

  describe('Connection Management', () => {
    it('should connect to SSE endpoint', async () => {
      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        storage: mockStorage
      };

      client = new SseClient(config);
      const openHandler = vi.fn();
      client.on('open', openHandler);

      client.connect();
      
      // Wait for connection
      await vi.advanceTimersByTimeAsync(20);

      expect(openHandler).toHaveBeenCalled();
      expect(client.getState().status).toBe('connected');
    });

    it('should include auth token in connection URL', () => {
      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        authToken: 'test-token',
        storage: mockStorage
      };

      client = new SseClient(config);
      client.connect();

      const eventSource = client['eventSource'] as any;
      expect(eventSource?.url).toContain('token=test-token');
    });

    it('should include lastEventId in connection URL if available', () => {
      mockStorage.setItem('sse_last_event_id', 'event-123');

      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        storage: mockStorage
      };

      client = new SseClient(config);
      client.connect();

      const eventSource = client['eventSource'] as any;
      expect(eventSource?.url).toContain('lastEventId=event-123');
    });

    it('should set withCredentials when configured', () => {
      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        withCredentials: true,
        storage: mockStorage
      };

      client = new SseClient(config);
      client.connect();

      const eventSource = client['eventSource'] as any;
      expect(eventSource?.withCredentials).toBe(true);
    });

    it('should disconnect gracefully', async () => {
      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        storage: mockStorage
      };

      client = new SseClient(config);
      const closeHandler = vi.fn();
      client.on('close', closeHandler);

      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      // Verify connected first
      expect(client.getState().status).toBe('connected');

      client.disconnect();

      // For SSE client, disconnect doesn't emit close event - it just sets state
      // The close event is only emitted on actual connection close
      expect(client.getState().status).toBe('disconnected');
    });

    it('should throw error when connecting after destroy', () => {
      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        storage: mockStorage
      };

      client = new SseClient(config);
      client.destroy();

      expect(() => client.connect()).toThrow('SseClient has been destroyed');
    });
  });

  describe('Message Handling', () => {
    it('should handle incoming messages', async () => {
      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        storage: mockStorage
      };

      client = new SseClient(config);
      const messageHandler = vi.fn();
      const typeHandler = vi.fn();
      
      client.on('message', messageHandler);
      client.on('test-event', typeHandler);
      
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      const eventSource = client['eventSource'] as unknown as MockEventSource;
      eventSource.simulateMessage(JSON.stringify({
        type: 'test-event',
        data: { content: 'Test' },
        id: 'msg-123'
      }), 'msg-123');

      expect(messageHandler).toHaveBeenCalled();
      expect(typeHandler).toHaveBeenCalled();
      expect(client.getState().lastEventId).toBe('msg-123');
    });

    it('should handle plain text messages', async () => {
      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        storage: mockStorage
      };

      client = new SseClient(config);
      const messageHandler = vi.fn();
      
      client.on('message', messageHandler);
      
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      const eventSource = client['eventSource'] as unknown as MockEventSource;
      eventSource.simulateMessage('Plain text message');

      expect(messageHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: 'message',
            data: 'Plain text message'
          })
        })
      );
    });

    it('should persist lastEventId to storage', async () => {
      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        storage: mockStorage
      };

      client = new SseClient(config);
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      const eventSource = client['eventSource'] as unknown as MockEventSource;
      eventSource.simulateMessage('test', 'event-456');

      expect(mockStorage.getItem('sse_last_event_id')).toBe('event-456');
    });

    it('should handle custom event types', async () => {
      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        storage: mockStorage
      };

      client = new SseClient(config);
      const messageHandler = vi.fn();
      client.on('message', messageHandler);
      
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      const eventSource = client['eventSource'] as unknown as MockEventSource;
      // Custom events are processed as messages with type
      eventSource.simulateCustomEvent('ping', JSON.stringify({ type: 'ping', timestamp: Date.now() }));

      expect(messageHandler).toHaveBeenCalled();
    });
  });

  describe('Heartbeat Mechanism', () => {
    it('should send heartbeat pings', async () => {
      mockFetch.mockResolvedValue({ ok: true });

      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        heartbeatInterval: 100,
        storage: mockStorage
      };

      client = new SseClient(config);
      client.connect();
      
      await vi.advanceTimersByTimeAsync(20);

      // Advance time to trigger heartbeat
      await vi.advanceTimersByTimeAsync(100);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/ping'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"type":"ping"')
        })
      );
    });

    it('should handle pong responses and calculate latency', async () => {
      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        heartbeatInterval: 100,
        storage: mockStorage
      };

      client = new SseClient(config);
      const latencyHandler = vi.fn();
      client.on('latency', latencyHandler);
      
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      // Manually trigger a pong message
      const timestamp = Date.now();
      client['pendingPings'].set(timestamp, timestamp - 50);
      
      const eventSource = client['eventSource'] as unknown as MockEventSource;
      eventSource.simulateMessage(JSON.stringify({
        type: 'pong',
        timestamp
      }));

      expect(latencyHandler).toHaveBeenCalled();
      expect(client.getState().latency).toBeGreaterThan(0);
    });

    it('should timeout and reconnect on missing heartbeat', async () => {
      mockFetch.mockResolvedValue({ ok: true });

      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        heartbeatInterval: 100,
        heartbeatTimeout: 200,
        storage: mockStorage
      };

      client = new SseClient(config);
      const errorHandler = vi.fn();
      client.on('error', errorHandler);
      
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      // Trigger heartbeat
      await vi.advanceTimersByTimeAsync(100);
      
      // Wait for timeout
      await vi.advanceTimersByTimeAsync(200);

      expect(errorHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: 'Heartbeat timeout'
          })
        })
      );
    });
  });

  describe('Reconnection Logic', () => {
    it('should reconnect with exponential backoff', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);

      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        initialReconnectDelay: 100,
        maxReconnectDelay: 1000,
        jitterFactor: 0,
        storage: mockStorage
      };

      client = new SseClient(config);
      const reconnectingHandler = vi.fn();
      client.on('reconnecting', reconnectingHandler);
      
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      // Verify connected
      expect(client.getState().status).toBe('connected');

      // Simulate connection error
      const eventSource = client['eventSource'] as unknown as MockEventSource;
      eventSource.simulateError();

      // Wait for error and close events to propagate
      await vi.advanceTimersByTimeAsync(10);

      // Should trigger reconnection
      expect(reconnectingHandler).toHaveBeenCalled();
      
      const firstCall = reconnectingHandler.mock.calls[0]?.[0];
      expect(firstCall?.data.attempt).toBe(1);
      expect(firstCall?.data.delay).toBe(100);

      vi.restoreAllMocks();
    });

    it('should apply jitter to reconnect delay', async () => {
      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        initialReconnectDelay: 100,
        jitterFactor: 0.5,
        storage: mockStorage
      };

      client = new SseClient(config);
      const reconnectingHandler = vi.fn();
      client.on('reconnecting', reconnectingHandler);
      
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      // Simulate connection error
      const eventSource = client['eventSource'] as unknown as MockEventSource;
      eventSource.simulateError();

      // Wait for error and close events to propagate
      await vi.advanceTimersByTimeAsync(10);

      expect(reconnectingHandler).toHaveBeenCalled();
      
      const call = reconnectingHandler.mock.calls[0]?.[0];
      const delay = call?.data.delay;
      
      // Delay should be between 100 and 150
      expect(delay).toBeGreaterThanOrEqual(100);
      expect(delay).toBeLessThanOrEqual(150);
    });

    it('should emit reconnected event on successful reconnection', async () => {
      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        initialReconnectDelay: 50,
        storage: mockStorage
      };

      client = new SseClient(config);
      const reconnectedHandler = vi.fn();
      client.on('reconnected', reconnectedHandler);
      
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      expect(client.getState().status).toBe('connected');

      // Simulate connection error
      const eventSource = client['eventSource'] as unknown as MockEventSource;
      eventSource.simulateError();

      // Wait for error handling
      await vi.advanceTimersByTimeAsync(10);
      
      // Wait for reconnection delay
      await vi.advanceTimersByTimeAsync(60);

      // The mock EventSource will auto-open after construction
      await vi.advanceTimersByTimeAsync(20);

      // After successful reconnection, the reconnected event should be emitted
      expect(reconnectedHandler).toHaveBeenCalled();
      expect(client.getState().status).toBe('connected');
    });
  });

  describe('Custom Headers Support', () => {
    it('should use fetch when custom headers are provided', async () => {
      const mockResponse = {
        ok: true,
        body: {
          getReader: vi.fn().mockReturnValue({
            read: vi.fn()
              .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('data: test\n\n') })
              .mockResolvedValueOnce({ done: true })
          })
        }
      };
      mockFetch.mockResolvedValue(mockResponse);

      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        headers: {
          'X-Custom-Header': 'value'
        },
        storage: mockStorage
      };

      client = new SseClient(config);
      client.connect();

      await vi.advanceTimersByTimeAsync(20);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom-Header': 'value',
            'Accept': 'text/event-stream'
          })
        })
      );
    });

    it('should include auth token in headers when using fetch', async () => {
      const mockResponse = {
        ok: true,
        body: {
          getReader: vi.fn().mockReturnValue({
            read: vi.fn()
              .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('data: test\n\n') })
              .mockResolvedValueOnce({ done: true })
          })
        }
      };
      mockFetch.mockResolvedValue(mockResponse);

      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        authToken: 'test-token',
        headers: {
          'X-Custom-Header': 'value'
        },
        storage: mockStorage
      };

      client = new SseClient(config);
      client.connect();

      await vi.advanceTimersByTimeAsync(20);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token'
          })
        })
      );
    });
  });

  describe('Latency Sampling', () => {
    it('should sample latency periodically', async () => {
      mockFetch.mockResolvedValue({ ok: true });

      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        enableLatencySampling: true,
        latencySamplingInterval: 100,
        storage: mockStorage
      };

      client = new SseClient(config);
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      // Advance time to trigger sampling
      await vi.advanceTimersByTimeAsync(100);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/ping'),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });

    it('should calculate average latency from samples', async () => {
      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        enableLatencySampling: true,
        latencySamplingInterval: 50,
        storage: mockStorage
      };

      client = new SseClient(config);
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      // Add some latency samples
      for (let i = 0; i < 3; i++) {
        client['addLatencySample'](50 + i * 10);
      }

      const avgLatency = client.getAverageLatency();
      expect(avgLatency).toBe(60); // (50 + 60 + 70) / 3
    });

    it('should keep only last 10 samples', () => {
      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        storage: mockStorage
      };

      client = new SseClient(config);

      // Add more than 10 samples
      for (let i = 0; i < 15; i++) {
        client['addLatencySample'](100);
      }

      const samples = client['latencySamples'];
      expect(samples.length).toBe(10);
    });
  });

  describe('Event Handling', () => {
    it('should subscribe and unsubscribe to events', () => {
      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        storage: mockStorage
      };

      client = new SseClient(config);
      const handler = vi.fn();
      
      const unsubscribe = client.on('test', handler);
      
      // Emit event
      client['emit']('test', { data: 'test' });
      expect(handler).toHaveBeenCalledOnce();

      // Unsubscribe
      unsubscribe();
      
      // Emit again
      client['emit']('test', { data: 'test2' });
      expect(handler).toHaveBeenCalledOnce(); // Still only once
    });

    it('should handle multiple subscribers for same event', () => {
      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        storage: mockStorage
      };

      client = new SseClient(config);
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      
      client.on('test', handler1);
      client.on('test', handler2);
      
      client['emit']('test', { data: 'test' });
      
      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });

    it('should handle errors in event handlers gracefully', () => {
      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        storage: mockStorage
      };

      client = new SseClient(config);
      const errorHandler = vi.fn(() => {
        throw new Error('Handler error');
      });
      const goodHandler = vi.fn();
      
      client.on('test', errorHandler);
      client.on('test', goodHandler);
      
      // Should not throw
      expect(() => client['emit']('test', {})).not.toThrow();
      
      // Good handler should still be called
      expect(goodHandler).toHaveBeenCalled();
    });
  });

  describe('State Management', () => {
    it('should return immutable state', () => {
      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        storage: mockStorage
      };

      client = new SseClient(config);
      const state1 = client.getState();
      const state2 = client.getState();
      
      expect(state1).not.toBe(state2);
      expect(state1).toEqual(state2);
    });

    it('should track state changes correctly', async () => {
      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        storage: mockStorage
      };

      client = new SseClient(config);
      
      expect(client.getState().status).toBe('disconnected');
      
      client.connect();
      expect(client.getState().status).toBe('connecting');
      
      await vi.advanceTimersByTimeAsync(20);
      expect(client.getState().status).toBe('connected');
      
      client.disconnect();
      expect(client.getState().status).toBe('disconnected');
    });
  });

  describe('Edge Cases', () => {
    it('should handle connection without storage gracefully', async () => {
      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        storage: undefined
      };

      client = new SseClient(config);
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      const eventSource = client['eventSource'] as unknown as MockEventSource;
      eventSource.simulateMessage('test', 'event-789');

      // Should not throw even without storage
      expect(client.getState().lastEventId).toBe('event-789');
    });

    it('should handle storage errors gracefully', async () => {
      const brokenStorage = new MockStorage();
      brokenStorage.setItem = vi.fn(() => {
        throw new Error('Storage error');
      });

      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        storage: brokenStorage
      };

      client = new SseClient(config);
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      const eventSource = client['eventSource'] as unknown as MockEventSource;
      
      // Should not throw even with storage errors
      expect(() => {
        eventSource.simulateMessage('test', 'event-999');
      }).not.toThrow();
    });

    it('should not reconnect after explicit disconnect', async () => {
      const config: SseClientConfig = {
        url: 'http://localhost:8080/sse',
        initialReconnectDelay: 10,
        storage: mockStorage
      };

      client = new SseClient(config);
      const reconnectingHandler = vi.fn();
      client.on('reconnecting', reconnectingHandler);
      
      client.connect();
      await vi.advanceTimersByTimeAsync(20);
      
      // Explicit disconnect
      client.disconnect();
      
      await vi.advanceTimersByTimeAsync(100);
      
      expect(reconnectingHandler).not.toHaveBeenCalled();
      expect(client.getState().status).toBe('disconnected');
    });
  });
});