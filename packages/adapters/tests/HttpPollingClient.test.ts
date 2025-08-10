import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HttpPollingClient } from '../src/HttpPollingClient';
import type { HttpPollingClientConfig, HttpPollingMessage } from '../src/types';

// Mock fetch
const mockFetch = vi.fn();

// Mock AbortSignal.timeout
if (!AbortSignal.timeout) {
  (AbortSignal as any).timeout = (delay: number) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), delay);
    return controller.signal;
  };
}

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

describe('HttpPollingClient', () => {
  let client: HttpPollingClient;
  let mockStorage: MockStorage;
  let originalFetch: typeof fetch;

  beforeEach(() => {
    vi.useFakeTimers();
    originalFetch = global.fetch;
    global.fetch = mockFetch;
    mockStorage = new MockStorage();
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    global.fetch = originalFetch;
    client?.destroy();
  });

  describe('Connection Management', () => {
    it('should start polling on connect', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => []
      });

      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        pollingInterval: 1000,
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      const openHandler = vi.fn();
      client.on('open', openHandler);

      client.connect();

      expect(openHandler).toHaveBeenCalled();
      expect(client.getState().status).toBe('polling');

      // Wait for first poll
      await vi.advanceTimersByTimeAsync(10);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/poll'),
        expect.any(Object)
      );
    });

    it('should include auth token in request', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => []
      });

      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        authToken: 'test-token',
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      client.connect();

      await vi.advanceTimersByTimeAsync(10);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('token=test-token'),
        expect.any(Object)
      );
    });

    it('should include lastEventId in request', async () => {
      mockStorage.setItem('polling_last_event_id', 'event-123');

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => []
      });

      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      client.connect();

      await vi.advanceTimersByTimeAsync(10);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('lastEventId=event-123'),
        expect.any(Object)
      );
    });

    it('should include custom headers', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => []
      });

      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        headers: {
          'X-Custom-Header': 'value'
        },
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      client.connect();

      await vi.advanceTimersByTimeAsync(10);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom-Header': 'value'
          })
        })
      );
    });

    it('should set credentials when configured', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => []
      });

      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        withCredentials: true,
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      client.connect();

      await vi.advanceTimersByTimeAsync(10);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          credentials: 'include'
        })
      );
    });

    it('should stop polling on disconnect', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => []
      });

      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        pollingInterval: 1000,
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      const closeHandler = vi.fn();
      client.on('close', closeHandler);

      client.connect();
      await vi.advanceTimersByTimeAsync(10);

      const callCount = mockFetch.mock.calls.length;
      
      client.disconnect();

      expect(closeHandler).toHaveBeenCalled();
      expect(client.getState().status).toBe('disconnected');

      // Advance time and verify no more polls
      await vi.advanceTimersByTimeAsync(2000);
      expect(mockFetch.mock.calls.length).toBe(callCount);
    });

    it('should throw error when connecting after destroy', () => {
      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      client.destroy();

      expect(() => client.connect()).toThrow('HttpPollingClient has been destroyed');
    });
  });

  describe('Polling Behavior', () => {
    it('should poll at configured interval', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => []
      });

      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        pollingInterval: 1000,
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      client.connect();

      // First poll
      await vi.advanceTimersByTimeAsync(10);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Wait for polling interval
      await vi.advanceTimersByTimeAsync(1100);
      expect(mockFetch).toHaveBeenCalledTimes(2);

      // Wait for another interval
      await vi.advanceTimersByTimeAsync(1100);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should apply jitter to polling interval', async () => {
      const randomSpy = vi.spyOn(Math, 'random');
      randomSpy.mockReturnValue(0.5);

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => []
      });

      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        pollingInterval: 1000,
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      client.connect();

      // First poll
      await vi.advanceTimersByTimeAsync(10);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Jitter should add up to 10% (100ms with random=0.5 means 50ms)
      await vi.advanceTimersByTimeAsync(1050);
      expect(mockFetch).toHaveBeenCalledTimes(2);

      randomSpy.mockRestore();
    });

    it('should handle single message response', async () => {
      const message: HttpPollingMessage = {
        type: 'test',
        data: { content: 'Test message' },
        id: 'msg-123'
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => message
      });

      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      const messageHandler = vi.fn();
      client.on('message', messageHandler);

      client.connect();
      await vi.advanceTimersByTimeAsync(10);

      expect(messageHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          data: message
        })
      );
      expect(client.getState().lastEventId).toBe('msg-123');
    });

    it('should handle array of messages', async () => {
      const messages: HttpPollingMessage[] = [
        { type: 'test1', data: { content: 'Message 1' }, id: 'msg-1' },
        { type: 'test2', data: { content: 'Message 2' }, id: 'msg-2' }
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => messages
      });

      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      const messageHandler = vi.fn();
      client.on('message', messageHandler);

      client.connect();
      await vi.advanceTimersByTimeAsync(10);

      expect(messageHandler).toHaveBeenCalledTimes(2);
      expect(client.getState().lastEventId).toBe('msg-2');
    });

    it('should emit type-specific events', async () => {
      const message: HttpPollingMessage = {
        type: 'custom-event',
        data: { value: 42 }
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => message
      });

      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      const customHandler = vi.fn();
      client.on('custom-event', customHandler);

      client.connect();
      await vi.advanceTimersByTimeAsync(10);

      expect(customHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { value: 42 }
        })
      );
    });
  });

  describe('Message Sending', () => {
    it('should send messages via POST', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => [] }) // For poll
        .mockResolvedValueOnce({ ok: true }); // For send

      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      client.connect();
      await vi.advanceTimersByTimeAsync(10);

      const message: HttpPollingMessage = {
        type: 'test',
        data: { content: 'Hello' }
      };

      await client.send(message);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/send'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"type":"test"')
        })
      );
    });

    it('should throw error when sending without connection', async () => {
      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        storage: mockStorage
      };

      client = new HttpPollingClient(config);

      const message: HttpPollingMessage = {
        type: 'test',
        data: { content: 'Hello' }
      };

      await expect(client.send(message)).rejects.toThrow('HttpPollingClient is not connected');
    });

    it('should handle send errors', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => [] }) // For poll
        .mockResolvedValueOnce({ ok: false, status: 500, statusText: 'Internal Server Error' }); // For send

      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      const errorHandler = vi.fn();
      client.on('error', errorHandler);

      client.connect();
      await vi.advanceTimersByTimeAsync(10);

      const message: HttpPollingMessage = {
        type: 'test',
        data: { content: 'Hello' }
      };

      await expect(client.send(message)).rejects.toThrow('Failed to send message');
      expect(errorHandler).toHaveBeenCalled();
    });
  });

  describe('Error Handling and Reconnection', () => {
    it('should handle polling errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        pollingInterval: 1000,
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      const errorHandler = vi.fn();
      client.on('error', errorHandler);

      client.connect();
      await vi.advanceTimersByTimeAsync(10);

      expect(errorHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: 'Network error'
          })
        })
      );
    });

    it('should continue polling after errors up to max consecutive errors', async () => {
      mockFetch
        .mockRejectedValueOnce(new Error('Error 1'))
        .mockRejectedValueOnce(new Error('Error 2'))
        .mockResolvedValueOnce({ ok: true, json: async () => [] });

      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        pollingInterval: 100,
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      client.connect();

      // First error
      await vi.advanceTimersByTimeAsync(10);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Second error
      await vi.advanceTimersByTimeAsync(110);
      expect(mockFetch).toHaveBeenCalledTimes(2);

      // Success - should reset consecutive errors
      await vi.advanceTimersByTimeAsync(110);
      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(client.getState().status).toBe('waiting');
    });

    it('should disconnect after max consecutive errors', async () => {
      mockFetch.mockRejectedValue(new Error('Persistent error'));

      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        pollingInterval: 100,
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      const reconnectingHandler = vi.fn();
      client.on('reconnecting', reconnectingHandler);

      client.connect();

      // Trigger 3 consecutive errors
      for (let i = 0; i < 3; i++) {
        await vi.advanceTimersByTimeAsync(110);
      }

      expect(reconnectingHandler).toHaveBeenCalled();
      expect(client.getState().status).toBe('reconnecting');
    });

    it('should reconnect with exponential backoff', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      mockFetch.mockRejectedValue(new Error('Persistent error'));

      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        pollingInterval: 100,
        initialReconnectDelay: 100,
        maxReconnectDelay: 1000,
        jitterFactor: 0,
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      const reconnectingHandler = vi.fn();
      client.on('reconnecting', reconnectingHandler);

      client.connect();

      // Trigger disconnect
      for (let i = 0; i < 3; i++) {
        await vi.advanceTimersByTimeAsync(110);
      }

      // First reconnect attempt
      const firstCall = reconnectingHandler.mock.calls[0]![0];
      expect(firstCall.data.attempt).toBe(1);
      expect(firstCall.data.delay).toBe(100);

      vi.restoreAllMocks();
    });

    it('should emit reconnected event on successful reconnection', async () => {
      mockFetch
        .mockRejectedValueOnce(new Error('Error'))
        .mockRejectedValueOnce(new Error('Error'))
        .mockRejectedValueOnce(new Error('Error'))
        .mockResolvedValue({ ok: true, json: async () => [] });

      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        pollingInterval: 100,
        initialReconnectDelay: 50,
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      const reconnectedHandler = vi.fn();
      client.on('reconnected', reconnectedHandler);

      client.connect();

      // Trigger disconnect
      for (let i = 0; i < 3; i++) {
        await vi.advanceTimersByTimeAsync(110);
      }

      // Wait for reconnection
      await vi.advanceTimersByTimeAsync(100);

      expect(reconnectedHandler).toHaveBeenCalled();
    });
  });

  describe('Latency Tracking', () => {
    it('should track latency when enabled', async () => {
      mockFetch.mockImplementation(() => 
        new Promise(resolve => {
          setTimeout(() => {
            resolve({ ok: true, json: async () => [] });
          }, 50);
        })
      );

      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        enableLatencySampling: true,
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      const latencyHandler = vi.fn();
      client.on('latency', latencyHandler);

      client.connect();
      await vi.advanceTimersByTimeAsync(100);

      expect(latencyHandler).toHaveBeenCalled();
      expect(client.getState().latency).toBeGreaterThan(0);
    });

    it('should calculate average latency', () => {
      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        storage: mockStorage
      };

      client = new HttpPollingClient(config);

      // Add some latency samples
      client['addLatencySample'](100);
      client['addLatencySample'](200);
      client['addLatencySample'](150);

      expect(client.getAverageLatency()).toBe(150);
    });

    it('should keep only last 10 samples', () => {
      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        storage: mockStorage
      };

      client = new HttpPollingClient(config);

      // Add more than 10 samples
      for (let i = 0; i < 15; i++) {
        client['addLatencySample'](100);
      }

      expect(client['latencySamples'].length).toBe(10);
    });
  });

  describe('State Management', () => {
    it('should return immutable state', () => {
      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      const state1 = client.getState();
      const state2 = client.getState();
      
      expect(state1).not.toBe(state2);
      expect(state1).toEqual(state2);
    });

    it('should track state transitions', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => []
      });

      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        pollingInterval: 100,
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      
      expect(client.getState().status).toBe('disconnected');
      
      client.connect();
      expect(client.getState().status).toBe('polling');
      
      await vi.advanceTimersByTimeAsync(10);
      expect(client.getState().status).toBe('waiting');
      
      await vi.advanceTimersByTimeAsync(110);
      // After polling completes, it goes to waiting, then back to polling
      expect(['polling', 'waiting']).toContain(client.getState().status);
      
      client.disconnect();
      expect(client.getState().status).toBe('disconnected');
    });
  });

  describe('Storage Integration', () => {
    it('should persist lastEventId', async () => {
      const message: HttpPollingMessage = {
        type: 'test',
        data: {},
        id: 'event-456'
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => message
      });

      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      client.connect();
      await vi.advanceTimersByTimeAsync(10);

      expect(mockStorage.getItem('polling_last_event_id')).toBe('event-456');
    });

    it('should load lastEventId on initialization', () => {
      mockStorage.setItem('polling_last_event_id', 'event-789');

      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      expect(client.getState().lastEventId).toBe('event-789');
    });

    it('should handle missing storage gracefully', async () => {
      const message: HttpPollingMessage = {
        type: 'test',
        data: {},
        id: 'event-999'
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => message
      });

      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        storage: undefined
      };

      client = new HttpPollingClient(config);
      client.connect();
      await vi.advanceTimersByTimeAsync(10);

      // Should not throw
      expect(client.getState().lastEventId).toBe('event-999');
    });
  });

  describe('Event Handling', () => {
    it('should support multiple event listeners', () => {
      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      
      client.on('test', handler1);
      client.on('test', handler2);
      
      client['emit']('test', { data: 'test' });
      
      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });

    it('should support unsubscribe', () => {
      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      const handler = vi.fn();
      
      const unsubscribe = client.on('test', handler);
      
      client['emit']('test', { data: 'test1' });
      expect(handler).toHaveBeenCalledOnce();
      
      unsubscribe();
      
      client['emit']('test', { data: 'test2' });
      expect(handler).toHaveBeenCalledOnce();
    });

    it('should handle errors in event handlers', () => {
      const config: HttpPollingClientConfig = {
        url: 'http://localhost:8080',
        storage: mockStorage
      };

      client = new HttpPollingClient(config);
      const errorHandler = vi.fn(() => {
        throw new Error('Handler error');
      });
      const goodHandler = vi.fn();
      
      client.on('test', errorHandler);
      client.on('test', goodHandler);
      
      expect(() => client['emit']('test', {})).not.toThrow();
      expect(goodHandler).toHaveBeenCalled();
    });
  });
});