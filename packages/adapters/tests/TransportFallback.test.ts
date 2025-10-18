import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TransportFallback } from '../src/TransportFallback';
import { SseClient } from '../src/SseClient';
import type { TransportFallbackConfig } from '../src/types';

// Mock SseClient
vi.mock('../src/SseClient', () => {
  const MockSseClient = vi.fn().mockImplementation(function(this: any) {
    this.handlers = new Map();
    this.connected = false;
    this.destroyed = false;
    
    this.connect = vi.fn(() => {
      this.connected = true;
    });
    
    this.disconnect = vi.fn(() => {
      this.connected = false;
    });
    
    this.destroy = vi.fn(() => {
      this.destroyed = true;
      this.connected = false;
    });
    
    this.on = vi.fn((event: string, handler: any) => {
      let handlersForEvent = this.handlers.get(event);
      if (!handlersForEvent) {
        handlersForEvent = new Set();
        this.handlers.set(event, handlersForEvent);
      }
      handlersForEvent.add(handler);
      
      return () => {
        this.handlers.get(event)?.delete(handler);
      };
    });
    
    this.getState = vi.fn(() => {
      return {
        status: this.connected ? 'connected' : 'disconnected',
        error: null
      };
    });
    
    this.emit = vi.fn((event: string, data?: any, error?: Error) => {
      const handlers = this.handlers.get(event);
      if (handlers) {
        handlers.forEach((handler: any) => {
          handler({ type: event, data, error });
        });
      }
    });
    
    this.simulateError = vi.fn((error: Error) => {
      this.emit('error', undefined, error);
    });
  });
  
  MockSseClient.isSupported = vi.fn(() => true);
  
  return { SseClient: MockSseClient };
});

// Mock HttpPollingClient
vi.mock('../src/HttpPollingClient', () => {
  const MockHttpPollingClient = vi.fn().mockImplementation(function(this: any) {
    this.handlers = new Map();
    this.connected = false;
    this.destroyed = false;
    
    this.connect = vi.fn(() => {
      this.connected = true;
    });
    
    this.disconnect = vi.fn(() => {
      this.connected = false;
    });
    
    this.destroy = vi.fn(() => {
      this.destroyed = true;
      this.connected = false;
    });
    
    this.send = vi.fn((_message: any) => {
      // Mock send
    });
    
    this.on = vi.fn((event: string, handler: any) => {
      let handlersForEvent = this.handlers.get(event);
      if (!handlersForEvent) {
        handlersForEvent = new Set();
        this.handlers.set(event, handlersForEvent);
      }
      handlersForEvent.add(handler);
      
      return () => {
        this.handlers.get(event)?.delete(handler);
      };
    });
    
    this.getState = vi.fn(() => {
      return {
        status: this.connected ? 'polling' : 'disconnected',
        error: null
      };
    });
    
    this.emit = vi.fn((event: string, data?: any, error?: Error) => {
      const handlers = this.handlers.get(event);
      if (handlers) {
        handlers.forEach((handler: any) => {
          handler({ type: event, data, error });
        });
      }
    });
    
    this.simulateError = vi.fn((error: Error) => {
      this.emit('error', undefined, error);
    });
  });
  
  return { HttpPollingClient: MockHttpPollingClient };
});

describe('TransportFallback', () => {
  let client: TransportFallback;
  let baseConfig: TransportFallbackConfig;
  let config: TransportFallbackConfig;

  beforeEach(() => {
    vi.clearAllMocks();

    baseConfig = {
      primary: {
        url: 'http://localhost:8080/sse',
        authToken: 'test-token'
      },
      fallback: {
        url: 'http://localhost:8080',
        pollingInterval: 5000
      }
    };

    config = structuredClone(baseConfig);
  });

  afterEach(() => {
    client?.destroy();
  });

  describe('Transport Selection', () => {
    it('should use SSE by default when supported', () => {
      (SseClient.isSupported as any).mockReturnValue(true);
      
      client = new TransportFallback(config);
      client.connect();
      
      expect(client.getTransportType()).toBe('sse');
      expect(client.getState().transport).toBe('sse');
    });

    it('should use polling when SSE is not supported', () => {
      (SseClient.isSupported as any).mockReturnValue(false);
      
      client = new TransportFallback(config);
      client.connect();
      
      expect(client.getTransportType()).toBe('polling');
      expect(client.getState().transport).toBe('polling');
    });

    it('should respect forced transport type', () => {
      config.forceTransport = 'polling';
      
      client = new TransportFallback(config);
      client.connect();
      
      expect(client.getTransportType()).toBe('polling');
    });

    it('should force SSE even if not supported when configured', () => {
      (SseClient.isSupported as any).mockReturnValue(false);
      config.forceTransport = 'sse';
      
      client = new TransportFallback(config);
      client.connect();
      
      expect(client.getTransportType()).toBe('sse');
    });
  });

  describe('Connection Management', () => {
    it('should connect the selected transport', () => {
      client = new TransportFallback(config);
      client.connect();
      
      const transport = client['currentTransport'] as any;
      expect(transport?.connected).toBe(true);
    });

    it('should not reconnect if already connected', () => {
      client = new TransportFallback(config);
      client.connect();
      
      const transport1 = client['currentTransport'];
      client.connect();
      const transport2 = client['currentTransport'];
      
      expect(transport1).toBe(transport2);
    });

    it('should disconnect the current transport', () => {
      client = new TransportFallback(config);
      client.connect();
      
      const transport = client['currentTransport'] as any;
      client.disconnect();
      
      expect(transport?.connected).toBe(false);
      expect(client['currentTransport']).toBe(null);
    });

    it('should destroy the client and cleanup', () => {
      client = new TransportFallback(config);
      client.connect();
      
      const transport = client['currentTransport'] as any;
      client.destroy();
      
      expect(transport?.destroyed).toBe(true);
      expect(() => client.connect()).toThrow('TransportFallback has been destroyed');
    });
  });

  describe('Event Handling', () => {
    it('should forward events from transport to handlers', () => {
      client = new TransportFallback(config);
      const messageHandler = vi.fn();
      
      client.on('message', messageHandler);
      client.connect();
      
      const transport = client['currentTransport'] as any;
      transport.emit('message', { data: 'test' });
      
      expect(messageHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'message',
          data: { data: 'test' }
        })
      );
    });

    it('should support multiple handlers for same event', () => {
      client = new TransportFallback(config);
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      
      client.on('test', handler1);
      client.on('test', handler2);
      client.connect();
      
      const transport = client['currentTransport'] as any;
      transport.emit('test', { data: 'test' });
      
      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });

    it('should support unsubscribe', () => {
      client = new TransportFallback(config);
      const handler = vi.fn();
      
      const unsubscribe = client.on('test', handler);
      client.connect();
      
      const transport = client['currentTransport'] as any;
      transport.emit('test', { data: 'test1' });
      expect(handler).toHaveBeenCalledOnce();
      
      unsubscribe();
      
      transport.emit('test', { data: 'test2' });
      expect(handler).toHaveBeenCalledOnce();
    });

    it('should resubscribe handlers when switching transports', () => {
      client = new TransportFallback(config);
      const handler = vi.fn();
      
      client.on('message', handler);
      client.connect();
      
      // Trigger fallback
      const sseTransport = client['currentTransport'] as any;
      sseTransport.simulateError(new Error('Network error'));
      
      // Handler should still work with new transport
      const pollingTransport = client['currentTransport'] as any;
      pollingTransport.emit('message', { data: 'test' });
      
      expect(handler).toHaveBeenCalled();
    });
  });

  describe('Automatic Fallback', () => {
    it('should fallback to polling on SSE network error', () => {
      (SseClient.isSupported as any).mockReturnValue(true);
      client = new TransportFallback(config);
      const fallbackHandler = vi.fn();
      
      client.on('fallback', fallbackHandler);
      client.connect();
      
      expect(client.getTransportType()).toBe('sse');
      
      const transport = client['currentTransport'] as any;
      transport.simulateError(new Error('Network error'));
      
      expect(client.getTransportType()).toBe('polling');
      expect(fallbackHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { from: 'sse', to: 'polling' }
        })
      );
    });

    it('should fallback on EventSource not supported error', () => {
      client = new TransportFallback(config);
      client.connect();
      
      const transport = client['currentTransport'] as any;
      transport.simulateError(new Error('EventSource is not supported'));
      
      expect(client.getTransportType()).toBe('polling');
    });

    it('should fallback on 404 error', () => {
      client = new TransportFallback(config);
      client.connect();
      
      const transport = client['currentTransport'] as any;
      transport.simulateError(new Error('404 Not Found'));
      
      expect(client.getTransportType()).toBe('polling');
    });

    it('should fallback on 405 Method Not Allowed', () => {
      client = new TransportFallback(config);
      client.connect();
      
      const transport = client['currentTransport'] as any;
      transport.simulateError(new Error('405 Method Not Allowed'));
      
      expect(client.getTransportType()).toBe('polling');
    });

    it('should fallback on 501 Not Implemented', () => {
      client = new TransportFallback(config);
      client.connect();
      
      const transport = client['currentTransport'] as any;
      transport.simulateError(new Error('501 Not Implemented'));
      
      expect(client.getTransportType()).toBe('polling');
    });

    it('should not fallback when autoFallback is disabled', () => {
      config.autoFallback = false;
      
      client = new TransportFallback(config);
      client.connect();
      
      const transport = client['currentTransport'] as any;
      transport.simulateError(new Error('Network error'));
      
      expect(client.getTransportType()).toBe('sse');
    });

    it('should not fallback on non-network errors', () => {
      client = new TransportFallback(config);
      client.connect();
      
      const transport = client['currentTransport'] as any;
      transport.simulateError(new Error('Some other error'));
      
      expect(client.getTransportType()).toBe('sse');
    });

    it('should only attempt fallback once', () => {
      client = new TransportFallback(config);
      const fallbackHandler = vi.fn();
      
      client.on('fallback', fallbackHandler);
      client.connect();
      
      const transport = client['currentTransport'] as any;
      
      // First fallback
      transport.simulateError(new Error('Network error'));
      expect(fallbackHandler).toHaveBeenCalledOnce();
      
      // Should not fallback again
      const pollingTransport = client['currentTransport'] as any;
      pollingTransport.emit('error', undefined, new Error('Another error'));
      
      expect(fallbackHandler).toHaveBeenCalledOnce();
      expect(client.getTransportType()).toBe('polling');
    });
  });

  describe('Message Sending', () => {
    it('should send messages through polling transport', () => {
      config.forceTransport = 'polling';
      
      client = new TransportFallback(config);
      client.connect();
      
      const transport = client['currentTransport'] as any;
      const sendSpy = vi.spyOn(transport, 'send');
      
      const message = { type: 'test', data: 'hello' };
      client.send(message);
      
      expect(sendSpy).toHaveBeenCalledWith(message);
    });

    it('should throw error when sending without connection', () => {
      client = new TransportFallback(config);
      
      expect(() => client.send({ type: 'test' })).toThrow('No transport connected');
    });

    it('should throw error when SSE does not support sending', () => {
      (SseClient.isSupported as any).mockReturnValue(true);
      client = new TransportFallback(config);
      client.connect();
      
      // SSE doesn't have send method in our mock - need to remove it
      const transport = client['currentTransport'] as any;
      transport.send = undefined;
      
      expect(() => client.send({ type: 'test' })).toThrow('Current transport does not support sending messages');
    });
  });

  describe('State Management', () => {
    it('should return disconnected state when not connected', () => {
      client = new TransportFallback(config);
      
      const state = client.getState();
      expect(state.status).toBe('disconnected');
      expect(state.transport).toBe(null);
    });

    it('should include transport type in state', () => {
      (SseClient.isSupported as any).mockReturnValue(true);
      client = new TransportFallback(config);
      client.connect();
      
      const state = client.getState();
      expect(state.transport).toBe('sse');
    });

    it('should forward transport state', () => {
      config.forceTransport = 'polling';
      
      client = new TransportFallback(config);
      client.connect();
      
      const state = client.getState();
      expect(state.status).toBe('polling');
      expect(state.transport).toBe('polling');
    });
  });

  describe('Feature Detection', () => {
    it('should detect SSE support', () => {
      (SseClient.isSupported as any).mockReturnValue(true);
      expect(TransportFallback.isSseSupported()).toBe(true);
    });

    it('should detect lack of SSE support', () => {
      (SseClient.isSupported as any).mockReturnValue(false);
      expect(TransportFallback.isSseSupported()).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle errors in event handlers', () => {
      client = new TransportFallback(config);
      
      const errorHandler = vi.fn(() => {
        throw new Error('Handler error');
      });
      const goodHandler = vi.fn();
      
      client.on('test', errorHandler);
      client.on('test', goodHandler);
      client.connect();
      
      // Use emitToHandlers directly since the mock emit doesn't handle errors
      expect(() => client['emitToHandlers']('test', { data: 'test' })).not.toThrow();
      
      // Good handler should still be called
      expect(goodHandler).toHaveBeenCalled();
    });

    it('should handle SSE initialization errors with fallback', () => {
      // Mock SSE constructor to throw
      vi.mocked(SseClient).mockImplementationOnce(() => {
        throw new Error('SSE initialization failed');
      });
      
      client = new TransportFallback(config);
      
      // Should not throw and should fallback to polling
      expect(() => client.connect()).not.toThrow();
      expect(client.getTransportType()).toBe('polling');
    });

    it('should not fallback when autoFallback is disabled and errors occur during runtime', () => {
      // This test verifies that runtime errors don't trigger fallback when autoFallback is disabled
      (SseClient.isSupported as any).mockReturnValue(true);
      config.autoFallback = false;
      client = new TransportFallback(config);
      client.connect();
      
      expect(client.getTransportType()).toBe('sse');
      
      const transport = client['currentTransport'] as any;
      transport.simulateError(new Error('Network error'));
      
      // Should still be using SSE transport (no fallback)
      expect(client.getTransportType()).toBe('sse');
    });
  });
});
