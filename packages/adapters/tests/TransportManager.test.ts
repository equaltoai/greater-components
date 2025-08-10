import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TransportManager } from '../src/TransportManager';
import { WebSocketClient } from '../src/WebSocketClient';
import { SseClient } from '../src/SseClient';
import { HttpPollingClient } from '../src/HttpPollingClient';
import type { TransportManagerConfig, TransportType } from '../src/types';

// Mock WebSocketClient
vi.mock('../src/WebSocketClient', () => {
  const MockWebSocketClient = vi.fn().mockImplementation(function(this: any) {
    this.handlers = new Map();
    this.connected = false;
    this.destroyed = false;
    
    this.connect = vi.fn(() => {
      this.connected = true;
      setTimeout(() => this.emit('open', {}), 10);
    });
    
    this.disconnect = vi.fn(() => {
      this.connected = false;
    });
    
    this.destroy = vi.fn(() => {
      this.destroyed = true;
      this.connected = false;
    });
    
    this.send = vi.fn((message: any) => {
      // Mock send
    });
    
    this.on = vi.fn((event: string, handler: any) => {
      if (!this.handlers.has(event)) {
        this.handlers.set(event, new Set());
      }
      this.handlers.get(event)!.add(handler);
      
      return () => {
        this.handlers.get(event)?.delete(handler);
      };
    });
    
    this.getState = vi.fn(() => {
      return {
        status: this.connected ? 'connected' : 'disconnected',
        latency: 50,
        lastEventId: 'ws-event-123',
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
  
  return { WebSocketClient: MockWebSocketClient };
});

// Mock SseClient
vi.mock('../src/SseClient', () => {
  const MockSseClient = vi.fn().mockImplementation(function(this: any) {
    this.handlers = new Map();
    this.connected = false;
    this.destroyed = false;
    
    this.connect = vi.fn(() => {
      this.connected = true;
      setTimeout(() => this.emit('open', {}), 10);
    });
    
    this.disconnect = vi.fn(() => {
      this.connected = false;
    });
    
    this.destroy = vi.fn(() => {
      this.destroyed = true;
      this.connected = false;
    });
    
    this.on = vi.fn((event: string, handler: any) => {
      if (!this.handlers.has(event)) {
        this.handlers.set(event, new Set());
      }
      this.handlers.get(event)!.add(handler);
      
      return () => {
        this.handlers.get(event)?.delete(handler);
      };
    });
    
    this.getState = vi.fn(() => {
      return {
        status: this.connected ? 'connected' : 'disconnected',
        latency: 100,
        lastEventId: 'sse-event-456',
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
      setTimeout(() => this.emit('open', {}), 10);
    });
    
    this.disconnect = vi.fn(() => {
      this.connected = false;
    });
    
    this.destroy = vi.fn(() => {
      this.destroyed = true;
      this.connected = false;
    });
    
    this.send = vi.fn((message: any) => {
      // Mock send
    });
    
    this.on = vi.fn((event: string, handler: any) => {
      if (!this.handlers.has(event)) {
        this.handlers.set(event, new Set());
      }
      this.handlers.get(event)!.add(handler);
      
      return () => {
        this.handlers.get(event)?.delete(handler);
      };
    });
    
    this.getState = vi.fn(() => {
      return {
        status: this.connected ? 'polling' : 'disconnected',
        latency: 200,
        lastEventId: 'poll-event-789',
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

// Mock global WebSocket and EventSource for feature detection
const mockWebSocket = vi.fn();
const mockEventSource = vi.fn();
const mockFetch = vi.fn();

Object.defineProperty(global, 'WebSocket', { value: mockWebSocket, writable: true });
Object.defineProperty(global, 'EventSource', { value: mockEventSource, writable: true });
Object.defineProperty(global, 'fetch', { value: mockFetch, writable: true });

describe('TransportManager', () => {
  let manager: TransportManager;
  let config: TransportManagerConfig;

  beforeEach(() => {
    vi.clearAllMocks();
    
    config = {
      websocket: {
        url: 'ws://localhost:8080/ws',
        authToken: 'test-token'
      },
      sse: {
        url: 'http://localhost:8080/sse',
        authToken: 'test-token'
      },
      polling: {
        url: 'http://localhost:8080',
        pollingInterval: 5000
      }
    };

    // Reset global feature detection mocks
    global.WebSocket = mockWebSocket;
    global.EventSource = mockEventSource;
    global.fetch = mockFetch;
  });

  afterEach(() => {
    manager?.destroy();
  });

  describe('Feature Detection', () => {
    it('should detect all features when available', () => {
      const features = TransportManager.getFeatureSupport();
      
      expect(features.websocket).toBe(true);
      expect(features.sse).toBe(true);
      expect(features.polling).toBe(true);
    });

    it('should detect missing features', () => {
      // @ts-ignore - Testing feature detection
      global.WebSocket = undefined;
      // @ts-ignore - Testing feature detection  
      global.EventSource = undefined;
      // @ts-ignore - Testing feature detection
      global.fetch = undefined;

      const features = TransportManager.getFeatureSupport();
      
      expect(features.websocket).toBe(false);
      expect(features.sse).toBe(false);
      expect(features.polling).toBe(false);
    });

    it('should set transport priority based on feature detection', () => {
      manager = new TransportManager(config);
      const state = manager.getState();
      
      expect(state.transportPriority).toEqual(['websocket', 'sse', 'polling']);
    });

    it('should handle partial feature support', () => {
      // @ts-ignore - Testing partial support
      global.WebSocket = undefined;
      
      manager = new TransportManager(config);
      const state = manager.getState();
      
      expect(state.transportPriority).toEqual(['sse', 'polling']);
    });
  });

  describe('Transport Selection', () => {
    it('should use WebSocket by default when all features are supported', async () => {
      manager = new TransportManager(config);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      expect(manager.getActiveTransport()).toBe('websocket');
      expect(WebSocketClient).toHaveBeenCalled();
    });

    it('should use SSE when WebSocket is not supported', async () => {
      // @ts-ignore - Testing fallback
      global.WebSocket = undefined;
      
      manager = new TransportManager(config);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      expect(manager.getActiveTransport()).toBe('sse');
      expect(SseClient).toHaveBeenCalled();
    });

    it('should use polling when WebSocket and SSE are not supported', async () => {
      // @ts-ignore - Testing fallback
      global.WebSocket = undefined;
      // @ts-ignore - Testing fallback
      global.EventSource = undefined;
      
      manager = new TransportManager(config);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      expect(manager.getActiveTransport()).toBe('polling');
      expect(HttpPollingClient).toHaveBeenCalled();
    });

    it('should respect forced transport type', async () => {
      config.forceTransport = 'polling';
      
      manager = new TransportManager(config);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      expect(manager.getActiveTransport()).toBe('polling');
      expect(HttpPollingClient).toHaveBeenCalled();
    });

    it('should throw error when forced transport is not supported', () => {
      // @ts-ignore - Testing error condition
      global.WebSocket = undefined;
      config.forceTransport = 'websocket';
      
      manager = new TransportManager(config);
      
      expect(() => manager.connect()).toThrow('Forced transport websocket is not supported');
    });

    it('should throw error when no transports are supported', () => {
      // @ts-ignore - Testing error condition
      global.WebSocket = undefined;
      // @ts-ignore - Testing error condition
      global.EventSource = undefined;
      // @ts-ignore - Testing error condition
      global.fetch = undefined;
      
      manager = new TransportManager(config);
      
      expect(() => manager.connect()).toThrow('No supported transports available');
    });
  });

  describe('Connection Management', () => {
    it('should connect the selected transport', async () => {
      manager = new TransportManager(config);
      const connectHandler = vi.fn();
      
      manager.on('open', connectHandler);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      const transport = manager['currentTransport'] as any;
      expect(transport?.connected).toBe(true);
      expect(manager.getState().status).toBe('connected');
      expect(connectHandler).toHaveBeenCalled();
    });

    it('should not reconnect if already connected', async () => {
      manager = new TransportManager(config);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      const transport1 = manager['currentTransport'];
      manager.connect(); // Second connect call
      const transport2 = manager['currentTransport'];
      
      expect(transport1).toBe(transport2);
      expect(WebSocketClient).toHaveBeenCalledOnce();
    });

    it('should disconnect the current transport', async () => {
      manager = new TransportManager(config);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      const transport = manager['currentTransport'] as any;
      manager.disconnect();
      
      expect(transport?.connected).toBe(false);
      expect(manager.getActiveTransport()).toBe(null);
      expect(manager.getState().status).toBe('disconnected');
    });

    it('should destroy the manager and cleanup all resources', async () => {
      manager = new TransportManager(config);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      const transport = manager['currentTransport'] as any;
      manager.destroy();
      
      expect(transport?.destroyed).toBe(true);
      expect(() => manager.connect()).toThrow('TransportManager has been destroyed');
    });
  });

  describe('Event Handling', () => {
    it('should forward events from transport to handlers', async () => {
      manager = new TransportManager(config);
      const messageHandler = vi.fn();
      
      manager.on('message', messageHandler);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      const transport = manager['currentTransport'] as any;
      transport.emit('message', { data: 'test' });
      
      expect(messageHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'message',
          data: { data: 'test' }
        })
      );
    });

    it('should support multiple handlers for same event', async () => {
      manager = new TransportManager(config);
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      
      manager.on('test', handler1);
      manager.on('test', handler2);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      const transport = manager['currentTransport'] as any;
      transport.emit('test', { data: 'test' });
      
      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });

    it('should support unsubscribe functionality', async () => {
      manager = new TransportManager(config);
      const handler = vi.fn();
      
      const unsubscribe = manager.on('test', handler);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      const transport = manager['currentTransport'] as any;
      transport.emit('test', { data: 'test1' });
      expect(handler).toHaveBeenCalledOnce();
      
      unsubscribe();
      
      transport.emit('test', { data: 'test2' });
      expect(handler).toHaveBeenCalledOnce();
    });

    it('should emit transport_switch events', async () => {
      manager = new TransportManager(config);
      const switchHandler = vi.fn();
      
      manager.on('transport_switch', switchHandler);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      expect(switchHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            from: null,
            to: 'websocket',
            reason: 'feature_detection'
          })
        })
      );
    });

    it('should resubscribe handlers when switching transports', async () => {
      config.maxFailuresBeforeSwitch = 1; // Fail fast for testing
      
      manager = new TransportManager(config);
      const messageHandler = vi.fn();
      
      manager.on('message', messageHandler);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      // Simulate multiple failures to trigger fallback
      const wsTransport = manager['currentTransport'] as any;
      wsTransport.simulateError(new Error('Network error'));
      wsTransport.simulateError(new Error('Network error'));
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      // Should have fallen back to SSE
      expect(manager.getActiveTransport()).toBe('sse');
      
      // Handler should still work with new transport
      const sseTransport = manager['currentTransport'] as any;
      sseTransport.emit('message', { data: 'test' });
      
      expect(messageHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'message',
          data: { data: 'test' }
        })
      );
    });
  });

  describe('Transport Fallback', () => {
    it('should fallback from WebSocket to SSE on persistent failures', async () => {
      config.maxFailuresBeforeSwitch = 2;
      
      manager = new TransportManager(config);
      const fallbackHandler = vi.fn();
      
      manager.on('transport_switch', fallbackHandler);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      expect(manager.getActiveTransport()).toBe('websocket');
      
      const transport = manager['currentTransport'] as any;
      
      // First failure - should not fallback yet
      transport.simulateError(new Error('Network error'));
      expect(manager.getActiveTransport()).toBe('websocket');
      
      // Second failure - should trigger fallback
      transport.simulateError(new Error('Network error'));
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      expect(manager.getActiveTransport()).toBe('sse');
      expect(fallbackHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            from: 'websocket',
            to: 'sse',
            reason: 'fallback'
          })
        })
      );
    });

    it('should fallback from SSE to polling on errors', async () => {
      // @ts-ignore - Testing fallback scenario
      global.WebSocket = undefined;
      config.maxFailuresBeforeSwitch = 1;
      
      manager = new TransportManager(config);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      expect(manager.getActiveTransport()).toBe('sse');
      
      const transport = manager['currentTransport'] as any;
      transport.simulateError(new Error('EventSource not supported'));
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      expect(manager.getActiveTransport()).toBe('polling');
    });

    it('should fallback on specific error types', async () => {
      config.maxFailuresBeforeSwitch = 1;
      
      const errorTypes = [
        'Network error',
        'Failed to fetch',
        'Connection timeout', 
        'WebSocket not supported',
        '404 Not Found',
        '502 Bad Gateway'
      ];

      for (const errorMessage of errorTypes) {
        manager = new TransportManager(config);
        manager.connect();
        
        await new Promise(resolve => setTimeout(resolve, 20));
        
        const transport = manager['currentTransport'] as any;
        transport.simulateError(new Error(errorMessage));
        
        await new Promise(resolve => setTimeout(resolve, 20));
        
        expect(manager.getActiveTransport()).toBe('sse');
        
        manager.destroy();
      }
    });

    it('should not fallback when autoFallback is disabled', async () => {
      config.autoFallback = false;
      config.maxFailuresBeforeSwitch = 1;
      
      manager = new TransportManager(config);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      const transport = manager['currentTransport'] as any;
      transport.simulateError(new Error('Network error'));
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      expect(manager.getActiveTransport()).toBe('websocket');
    });

    it('should not fallback on non-network errors', async () => {
      config.maxFailuresBeforeSwitch = 1;
      
      manager = new TransportManager(config);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      const transport = manager['currentTransport'] as any;
      transport.simulateError(new Error('Authentication error'));
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      expect(manager.getActiveTransport()).toBe('websocket');
    });

    it('should handle case when no fallback transport is available', async () => {
      // @ts-ignore - Testing edge case
      global.EventSource = undefined;
      // @ts-ignore - Testing edge case
      global.fetch = undefined;
      config.maxFailuresBeforeSwitch = 1;
      
      manager = new TransportManager(config);
      const closeHandler = vi.fn();
      
      manager.on('close', closeHandler);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      expect(manager.getActiveTransport()).toBe('websocket');
      
      const transport = manager['currentTransport'] as any;
      transport.simulateError(new Error('Network error'));
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      expect(manager.getState().status).toBe('disconnected');
      expect(closeHandler).toHaveBeenCalled();
    });
  });

  describe('Manual Transport Switching', () => {
    it('should allow manual switching to supported transport', async () => {
      manager = new TransportManager(config);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      expect(manager.getActiveTransport()).toBe('websocket');
      
      manager.switchTransport('polling', 'Manual test');
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      expect(manager.getActiveTransport()).toBe('polling');
      expect(HttpPollingClient).toHaveBeenCalled();
    });

    it('should throw error when switching to unsupported transport', async () => {
      // @ts-ignore - Testing error condition
      global.EventSource = undefined;
      
      manager = new TransportManager(config);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      expect(() => manager.switchTransport('sse', 'Manual test')).toThrow('Transport sse is not supported');
    });

    it('should not switch if already using requested transport', async () => {
      manager = new TransportManager(config);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      const originalTransport = manager['currentTransport'];
      manager.switchTransport('websocket', 'Manual test');
      
      expect(manager['currentTransport']).toBe(originalTransport);
    });
  });

  describe('Message Sending', () => {
    it('should send messages through WebSocket transport', async () => {
      manager = new TransportManager(config);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      const transport = manager['currentTransport'] as any;
      const sendSpy = vi.spyOn(transport, 'send');
      
      const message = { type: 'test', data: 'hello' };
      manager.send(message);
      
      expect(sendSpy).toHaveBeenCalledWith(message);
    });

    it('should send messages through polling transport', async () => {
      config.forceTransport = 'polling';
      
      manager = new TransportManager(config);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      const transport = manager['currentTransport'] as any;
      const sendSpy = vi.spyOn(transport, 'send');
      
      const message = { type: 'test', data: 'hello' };
      manager.send(message);
      
      expect(sendSpy).toHaveBeenCalledWith(message);
    });

    it('should throw error when sending without connection', () => {
      manager = new TransportManager(config);
      
      expect(() => manager.send({ type: 'test' })).toThrow('No transport connected');
    });

    it('should throw error when transport does not support sending', async () => {
      config.forceTransport = 'sse';
      
      manager = new TransportManager(config);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      // SSE doesn't support sending in our implementation
      const transport = manager['currentTransport'] as any;
      transport.send = undefined;
      
      expect(() => manager.send({ type: 'test' })).toThrow('sse transport does not support sending messages');
    });
  });

  describe('State Management', () => {
    it('should return initial state when disconnected', () => {
      manager = new TransportManager(config);
      
      const state = manager.getState();
      expect(state.status).toBe('disconnected');
      expect(state.activeTransport).toBe(null);
      expect(state.canFallback).toBe(true);
    });

    it('should merge transport state with manager state', async () => {
      manager = new TransportManager(config);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      const state = manager.getState();
      expect(state.activeTransport).toBe('websocket');
      expect(state.latency).toBe(50); // From WebSocket mock
      expect(state.lastEventId).toBe('ws-event-123'); // From WebSocket mock
    });

    it('should track failure counts', async () => {
      config.maxFailuresBeforeSwitch = 5; // High threshold for testing
      
      manager = new TransportManager(config);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      const transport = manager['currentTransport'] as any;
      transport.simulateError(new Error('Some error'));
      
      const state = manager.getState();
      expect(state.failureCount).toBe(1);
    });

    it('should indicate when fallback is not available', () => {
      // @ts-ignore - Testing no fallback scenario
      global.EventSource = undefined;
      // @ts-ignore - Testing no fallback scenario
      global.fetch = undefined;
      
      manager = new TransportManager(config);
      
      const state = manager.getState();
      expect(state.canFallback).toBe(false);
      expect(state.transportPriority).toEqual(['websocket']);
    });
  });

  describe('Transport Support Checking', () => {
    it('should correctly identify supported transports', () => {
      manager = new TransportManager(config);
      
      expect(manager.isTransportSupported('websocket')).toBe(true);
      expect(manager.isTransportSupported('sse')).toBe(true);
      expect(manager.isTransportSupported('polling')).toBe(true);
    });

    it('should correctly identify unsupported transports', () => {
      // @ts-ignore - Testing unsupported transport
      global.WebSocket = undefined;
      
      manager = new TransportManager(config);
      
      expect(manager.isTransportSupported('websocket')).toBe(false);
      expect(manager.isTransportSupported('sse')).toBe(true);
      expect(manager.isTransportSupported('polling')).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle errors in event handlers without crashing', async () => {
      manager = new TransportManager(config);
      
      const errorHandler = vi.fn(() => {
        throw new Error('Handler error');
      });
      const goodHandler = vi.fn();
      
      manager.on('test', errorHandler);
      manager.on('test', goodHandler);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      // Emit directly to test error handling
      expect(() => manager['emit']('test', { data: 'test' })).not.toThrow();
      
      // Good handler should still be called
      expect(goodHandler).toHaveBeenCalled();
    });

    it('should handle transport initialization errors gracefully', async () => {
      // Mock WebSocket constructor to throw
      vi.mocked(WebSocketClient).mockImplementationOnce(() => {
        throw new Error('WebSocket initialization failed');
      });
      
      manager = new TransportManager(config);
      manager.connect();
      
      await new Promise(resolve => setTimeout(resolve, 20));
      
      // Should fallback to SSE
      expect(manager.getActiveTransport()).toBe('sse');
      expect(SseClient).toHaveBeenCalled();
    });
  });

  describe('Transport Upgrade Feature', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should attempt transport upgrade when enabled', async () => {
      config.enableUpgradeAttempts = true;
      config.upgradeAttemptInterval = 1000;
      config.forceTransport = 'polling'; // Start with lowest priority
      
      manager = new TransportManager(config);
      manager.connect();
      
      await vi.advanceTimersByTimeAsync(20);
      
      expect(manager.getActiveTransport()).toBe('polling');
      
      // Fast-forward to upgrade attempt
      vi.advanceTimersByTime(1000);
      
      await vi.advanceTimersByTimeAsync(20);
      
      // Should have upgraded to WebSocket (highest priority)
      expect(manager.getActiveTransport()).toBe('websocket');
    });

    it('should not attempt upgrade when disabled', async () => {
      config.enableUpgradeAttempts = false;
      config.forceTransport = 'polling';
      
      manager = new TransportManager(config);
      manager.connect();
      
      await vi.advanceTimersByTimeAsync(20);
      
      expect(manager.getActiveTransport()).toBe('polling');
      
      // Fast-forward beyond upgrade interval
      vi.advanceTimersByTime(10000);
      
      // Should still be using polling
      expect(manager.getActiveTransport()).toBe('polling');
    });
  });
});