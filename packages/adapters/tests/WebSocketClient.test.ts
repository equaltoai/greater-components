import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WebSocketClient } from '../src/WebSocketClient';
import type { WebSocketClientConfig, WebSocketMessage } from '../src/types';

// Mock WebSocket
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  url: string;
  readyState: number = MockWebSocket.CONNECTING;
  onopen: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  
  private listeners: Map<string, Set<(event: any) => void>> = new Map();

  constructor(url: string) {
    this.url = url;
    // Simulate connection opening
    setTimeout(() => {
      if (this.readyState === MockWebSocket.CONNECTING) {
        this.readyState = MockWebSocket.OPEN;
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
    this.listeners.get(type)?.forEach(listener => listener(event));
  }

  send(data: string): void {
    if (this.readyState !== MockWebSocket.OPEN) {
      throw new Error('WebSocket is not open');
    }
    
    // Handle ping messages
    const message = JSON.parse(data);
    if (message.type === 'ping') {
      // Simulate pong response
      setTimeout(() => {
        const pong = { type: 'pong', timestamp: message.timestamp };
        const event = new MessageEvent('message', { data: JSON.stringify(pong) });
        this.onmessage?.(event);
        this.dispatchEvent('message', event);
      }, 5);
    }
  }

  close(): void {
    if (this.readyState === MockWebSocket.OPEN) {
      this.readyState = MockWebSocket.CLOSED;
      const event = new CloseEvent('close', { code: 1000, reason: 'Normal closure' });
      this.onclose?.(event);
      this.dispatchEvent('close', event);
    }
  }

  simulateMessage(data: unknown): void {
    const event = new MessageEvent('message', { data: JSON.stringify(data) });
    this.onmessage?.(event);
    this.dispatchEvent('message', event);
  }

  simulateError(): void {
    const event = new Event('error');
    this.onerror?.(event);
    this.dispatchEvent('error', event);
  }

  simulateClose(code: number = 1000, reason: string = ''): void {
    this.readyState = MockWebSocket.CLOSED;
    const event = new CloseEvent('close', { code, reason });
    this.onclose?.(event);
    this.dispatchEvent('close', event);
  }
}

// Mock localStorage
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

describe('WebSocketClient', () => {
  let client: WebSocketClient;
  let mockStorage: MockStorage;
  let originalWebSocket: typeof WebSocket;

  beforeEach(() => {
    vi.useFakeTimers();
    originalWebSocket = global.WebSocket;
    (global as any).WebSocket = MockWebSocket;
    mockStorage = new MockStorage();
  });

  afterEach(() => {
    vi.useRealTimers();
    global.WebSocket = originalWebSocket;
    client?.destroy();
  });

  describe('Connection Management', () => {
    it('should connect to WebSocket server', async () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      const openHandler = vi.fn();
      client.on('open', openHandler);

      client.connect();
      
      // Wait for connection
      await vi.advanceTimersByTimeAsync(20);

      expect(openHandler).toHaveBeenCalled();
      expect(client.getState().status).toBe('connected');
    });

    it('should include auth token in connection URL', () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        authToken: 'test-token',
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      client.connect();

      const ws = client['socket'] as any;
      expect(ws?.url).toContain('token=test-token');
    });

    it('should include lastEventId in connection URL if available', () => {
      mockStorage.setItem('ws_last_event_id', 'event-123');

      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      client.connect();

      const ws = client['socket'] as any;
      expect(ws?.url).toContain('lastEventId=event-123');
    });

    it('should disconnect gracefully', async () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      const closeHandler = vi.fn();
      client.on('close', closeHandler);

      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      client.disconnect();

      expect(closeHandler).toHaveBeenCalled();
      expect(client.getState().status).toBe('disconnected');
    });

    it('should throw error when connecting after destroy', () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      client.destroy();

      expect(() => client.connect()).toThrow('WebSocketClient has been destroyed');
    });
  });

  describe('Message Handling', () => {
    it('should send messages when connected', async () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      client.connect();
      
      await vi.advanceTimersByTimeAsync(20);

      const message: WebSocketMessage = {
        type: 'test',
        data: { content: 'Hello' }
      };

      const ws = client['socket'] as any;
      const sendSpy = vi.spyOn(ws, 'send');

      client.send(message);

      expect(sendSpy).toHaveBeenCalledWith(
        expect.stringContaining('"type":"test"')
      );
    });

    it('should throw error when sending without connection', () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        storage: mockStorage
      };

      client = new WebSocketClient(config);

      const message: WebSocketMessage = {
        type: 'test',
        data: { content: 'Hello' }
      };

      expect(() => client.send(message)).toThrow('WebSocket is not connected');
    });

    it('should handle incoming messages', async () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      const messageHandler = vi.fn();
      const typeHandler = vi.fn();
      
      client.on('message', messageHandler);
      client.on('test-event', typeHandler);
      
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      const ws = client['socket'] as unknown as MockWebSocket;
      ws.simulateMessage({
        type: 'test-event',
        data: { content: 'Test' },
        id: 'msg-123'
      });

      expect(messageHandler).toHaveBeenCalled();
      expect(typeHandler).toHaveBeenCalled();
      expect(client.getState().lastEventId).toBe('msg-123');
    });

    it('should persist lastEventId to storage', async () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      const ws = client['socket'] as unknown as MockWebSocket;
      ws.simulateMessage({
        type: 'test',
        id: 'event-456'
      });

      expect(mockStorage.getItem('ws_last_event_id')).toBe('event-456');
    });
  });

  describe('Heartbeat Mechanism', () => {
    it('should send heartbeat pings', async () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        heartbeatInterval: 100,
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      client.connect();
      
      await vi.advanceTimersByTimeAsync(20);

      const ws = client['socket'] as any;
      const sendSpy = vi.spyOn(ws, 'send');

      // Advance time to trigger heartbeat
      await vi.advanceTimersByTimeAsync(100);

      expect(sendSpy).toHaveBeenCalledWith(
        expect.stringContaining('"type":"ping"')
      );
    });

    it('should handle pong responses and calculate latency', async () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        heartbeatInterval: 100,
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      const latencyHandler = vi.fn();
      client.on('latency', latencyHandler);
      
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      // Trigger heartbeat
      await vi.advanceTimersByTimeAsync(100);
      
      // Wait for pong response
      await vi.advanceTimersByTimeAsync(10);

      expect(latencyHandler).toHaveBeenCalled();
      expect(client.getState().latency).toBeGreaterThan(0);
    });

    it('should timeout and reconnect on missing heartbeat', async () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        heartbeatInterval: 100,
        heartbeatTimeout: 200,
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      const errorHandler = vi.fn();
      client.on('error', errorHandler);
      
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      // Override send to not send pong
      const ws = client['socket'] as any;
      ws.send = vi.fn();

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
      // Mock Math.random to return predictable values
      vi.spyOn(Math, 'random').mockReturnValue(0);

      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        initialReconnectDelay: 100,
        maxReconnectDelay: 1000,
        jitterFactor: 0,
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      const reconnectingHandler = vi.fn();
      client.on('reconnecting', reconnectingHandler);
      
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      // Simulate connection loss
      const ws = client['socket'] as unknown as MockWebSocket;
      ws.simulateClose(1006, 'Connection lost');

      // First reconnect attempt (100ms with jitter factor 0, Math.random should have no effect)
      const firstCall = reconnectingHandler.mock.calls[0]![0];
      expect(firstCall.data.attempt).toBe(1);
      expect(firstCall.data.delay).toBe(100);

      await vi.advanceTimersByTimeAsync(100);
      
      // Simulate another failure
      const ws2 = client['socket'] as MockWebSocket;
      ws2.simulateClose(1006, 'Connection lost');

      // Second reconnect attempt (200ms with jitter factor 0)
      const secondCall = reconnectingHandler.mock.calls[1]![0];
      expect(secondCall.data.attempt).toBe(2);
      expect(secondCall.data.delay).toBe(200);

      // Restore Math.random
      vi.restoreAllMocks();
    });

    it('should apply jitter to reconnect delay', async () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        initialReconnectDelay: 100,
        jitterFactor: 0.5,
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      const reconnectingHandler = vi.fn();
      client.on('reconnecting', reconnectingHandler);
      
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      // Simulate connection loss
      const ws = client['socket'] as unknown as MockWebSocket;
      ws.simulateClose(1006, 'Connection lost');

      const call = reconnectingHandler.mock.calls[0]![0];
      const delay = call.data.delay;
      
      // Delay should be between 100 and 150 (base + up to 50% jitter)
      expect(delay).toBeGreaterThanOrEqual(100);
      expect(delay).toBeLessThanOrEqual(150);
    });

    it('should cap reconnect delay at maximum', async () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        initialReconnectDelay: 100,
        maxReconnectDelay: 500,
        jitterFactor: 0,
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      const reconnectingHandler = vi.fn();
      client.on('reconnecting', reconnectingHandler);
      
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      // Simulate multiple connection losses
      for (let i = 0; i < 5; i++) {
        const ws = client['socket'] as unknown as MockWebSocket;
        ws.simulateClose(1006, 'Connection lost');
        await vi.advanceTimersByTimeAsync(1000);
      }

      // Check that delay never exceeds max
      const delays = reconnectingHandler.mock.calls.map(call => call[0].data.delay);
      delays.forEach(delay => {
        expect(delay).toBeLessThanOrEqual(500);
      });
    });

    it('should stop reconnecting after max attempts', async () => {
      // Mock Math.random for predictable jitter
      vi.spyOn(Math, 'random').mockReturnValue(0);

      // Override MockWebSocket to not auto-open on reconnect
      const originalMockWebSocket = MockWebSocket;
      class NonAutoOpenMockWebSocket extends MockWebSocket {
        constructor(url: string) {
          super(url);
          this.readyState = MockWebSocket.CONNECTING;
          // Don't auto-open
        }
        
        simulateOpen(): void {
          this.readyState = MockWebSocket.OPEN;
          const event = new Event('open');
          this.onopen?.(event);
          this.dispatchEvent('open', event);
        }
      }
      (global as any).WebSocket = NonAutoOpenMockWebSocket;

      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        initialReconnectDelay: 10,
        maxReconnectAttempts: 2,
        jitterFactor: 0,
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      const reconnectingHandler = vi.fn();
      client.on('reconnecting', reconnectingHandler);
      
      client.connect();
      // Manually open the first connection
      const ws1 = client['socket'] as NonAutoOpenMockWebSocket;
      ws1.simulateOpen();

      // Simulate connection loss - triggers first reconnect attempt
      ws1.simulateClose(1006, 'Connection lost');
      
      // Should schedule first reconnect
      expect(reconnectingHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ attempt: 1, delay: 10 })
        })
      );
      
      // Wait for first reconnect attempt
      await vi.advanceTimersByTimeAsync(10);
      
      // Fail this connection immediately (don't open it)
      const ws2 = client['socket'] as NonAutoOpenMockWebSocket;
      ws2.simulateClose(1006, 'Connection lost');
      
      // Should schedule second reconnect
      expect(reconnectingHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ attempt: 2, delay: 20 })
        })
      );
      
      // Wait for second reconnect attempt
      await vi.advanceTimersByTimeAsync(20);
      
      // Fail this connection immediately (don't open it) - should NOT reconnect (max attempts reached)
      const ws3 = client['socket'] as NonAutoOpenMockWebSocket;
      ws3.simulateClose(1006, 'Connection lost');
      
      // Should not schedule another reconnect
      expect(reconnectingHandler).toHaveBeenCalledTimes(2);
      expect(client.getState().status).toBe('disconnected');
      
      // Restore
      (global as any).WebSocket = originalMockWebSocket;
      vi.restoreAllMocks();
    });

    it('should emit reconnected event on successful reconnection', async () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        initialReconnectDelay: 50,
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      const reconnectedHandler = vi.fn();
      client.on('reconnected', reconnectedHandler);
      
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      // Simulate connection loss
      const ws = client['socket'] as unknown as MockWebSocket;
      ws.simulateClose(1006, 'Connection lost');

      // Wait for reconnection
      await vi.advanceTimersByTimeAsync(100);

      expect(reconnectedHandler).toHaveBeenCalled();
      expect(client.getState().status).toBe('connected');
    });
  });

  describe('Latency Sampling', () => {
    it('should sample latency periodically', async () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        enableLatencySampling: true,
        latencySamplingInterval: 100,
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      const ws = client['socket'] as any;
      const sendSpy = vi.spyOn(ws, 'send');

      // Advance time to trigger sampling
      await vi.advanceTimersByTimeAsync(100);

      expect(sendSpy).toHaveBeenCalledWith(
        expect.stringContaining('"type":"ping"')
      );
    });

    it('should calculate average latency from samples', async () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        enableLatencySampling: true,
        latencySamplingInterval: 50,
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      // Trigger multiple samples
      for (let i = 0; i < 3; i++) {
        await vi.advanceTimersByTimeAsync(50);
        await vi.advanceTimersByTimeAsync(10); // Wait for pong
      }

      const avgLatency = client.getAverageLatency();
      expect(avgLatency).toBeGreaterThan(0);
    });

    it('should keep only last 10 samples', async () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        enableLatencySampling: true,
        latencySamplingInterval: 10,
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      // Trigger more than 10 samples
      for (let i = 0; i < 15; i++) {
        await vi.advanceTimersByTimeAsync(10);
        await vi.advanceTimersByTimeAsync(5); // Wait for pong
      }

      const samples = client['latencySamples'];
      expect(samples.length).toBeLessThanOrEqual(10);
    });

    it('should disable latency sampling when configured', async () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        enableLatencySampling: false,
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      const ws = client['socket'] as any;
      const sendSpy = vi.spyOn(ws, 'send');

      // Advance time but no sampling should occur
      await vi.advanceTimersByTimeAsync(10000);

      // Should only have heartbeat pings, not sampling pings
      const pings = sendSpy.mock.calls.filter(call => 
        call[0].includes('"type":"ping"')
      );
      
      expect(pings.length).toBeLessThan(5); // Only heartbeats, not frequent sampling
    });
  });

  describe('Event Handling', () => {
    it('should subscribe and unsubscribe to events', () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        storage: mockStorage
      };

      client = new WebSocketClient(config);
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
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      
      client.on('test', handler1);
      client.on('test', handler2);
      
      client['emit']('test', { data: 'test' });
      
      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });

    it('should handle errors in event handlers gracefully', () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        storage: mockStorage
      };

      client = new WebSocketClient(config);
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
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      const state1 = client.getState();
      const state2 = client.getState();
      
      expect(state1).not.toBe(state2);
      expect(state1).toEqual(state2);
    });

    it('should track state changes correctly', async () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      
      expect(client.getState().status).toBe('disconnected');
      
      client.connect();
      expect(client.getState().status).toBe('connecting');
      
      await vi.advanceTimersByTimeAsync(20);
      expect(client.getState().status).toBe('connected');
      
      client.disconnect();
      expect(client.getState().status).toBe('disconnected');
    });

    it('should track errors in state', async () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      client.connect();
      await vi.advanceTimersByTimeAsync(20);
      
      const ws = client['socket'] as unknown as MockWebSocket;
      ws.simulateError();
      
      expect(client.getState().error).toBeInstanceOf(Error);
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed messages gracefully', async () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        storage: mockStorage
      };

      client = new WebSocketClient(config);
      const errorHandler = vi.fn();
      client.on('error', errorHandler);
      
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      const ws = client['socket'] as any;
      const event = new MessageEvent('message', { data: 'invalid json' });
      ws.onmessage?.(event);
      ws.dispatchEvent('message', event);

      expect(errorHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: expect.stringContaining('Failed to parse message')
          })
        })
      );
    });

    it('should handle connection without storage gracefully', async () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        storage: undefined
      };

      client = new WebSocketClient(config);
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      const ws = client['socket'] as unknown as MockWebSocket;
      ws.simulateMessage({
        type: 'test',
        id: 'event-789'
      });

      // Should not throw even without storage
      expect(client.getState().lastEventId).toBe('event-789');
    });

    it('should handle storage errors gracefully', async () => {
      const brokenStorage = new MockStorage();
      brokenStorage.setItem = vi.fn(() => {
        throw new Error('Storage error');
      });

      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        storage: brokenStorage
      };

      client = new WebSocketClient(config);
      client.connect();
      await vi.advanceTimersByTimeAsync(20);

      const ws = client['socket'] as unknown as MockWebSocket;
      
      // Should not throw even with storage errors
      expect(() => {
        ws.simulateMessage({
          type: 'test',
          id: 'event-999'
        });
      }).not.toThrow();
    });

    it('should not reconnect after explicit disconnect', async () => {
      const config: WebSocketClientConfig = {
        url: 'ws://localhost:8080',
        initialReconnectDelay: 10,
        storage: mockStorage
      };

      client = new WebSocketClient(config);
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