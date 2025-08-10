import { SseClient } from './SseClient';
import { HttpPollingClient } from './HttpPollingClient';
import type {
  TransportFallbackConfig,
  TransportAdapter,
  WebSocketEventHandler
} from './types';

/**
 * Transport client with automatic fallback from SSE to HTTP Polling
 */
export class TransportFallback implements TransportAdapter {
  private config: TransportFallbackConfig;
  private currentTransport: TransportAdapter | null = null;
  private transportType: 'sse' | 'polling' | null = null;
  private eventHandlers: Map<string, Set<WebSocketEventHandler>> = new Map();
  private unsubscribers: Map<string, (() => void)[]> = new Map();
  private isDestroyed = false;
  private fallbackAttempted = false;

  constructor(config: TransportFallbackConfig) {
    this.config = {
      ...config,
      autoFallback: config.autoFallback !== false,
      forceTransport: config.forceTransport || 'auto'
    };
  }

  /**
   * Connect using the appropriate transport
   */
  connect(): void {
    if (this.isDestroyed) {
      throw new Error('TransportFallback has been destroyed');
    }

    if (this.currentTransport) {
      return; // Already connected
    }

    // Determine which transport to use
    const transport = this.selectTransport();
    
    if (transport === 'sse') {
      this.connectSse();
    } else {
      this.connectPolling();
    }
  }

  /**
   * Disconnect the current transport
   */
  disconnect(): void {
    if (this.currentTransport) {
      this.currentTransport.disconnect();
      this.cleanupTransport();
    }
  }

  /**
   * Destroy the client and cleanup all resources
   */
  destroy(): void {
    this.isDestroyed = true;
    if (this.currentTransport) {
      this.currentTransport.destroy();
      this.cleanupTransport();
    }
    this.eventHandlers.clear();
  }

  /**
   * Send a message through the current transport
   */
  send(message: unknown): void {
    if (!this.currentTransport) {
      throw new Error('No transport connected');
    }

    if (this.currentTransport.send) {
      this.currentTransport.send(message);
    } else {
      throw new Error('Current transport does not support sending messages');
    }
  }

  /**
   * Subscribe to events
   */
  on(event: string, handler: WebSocketEventHandler): () => void {
    // Store handler in our map
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);

    // Subscribe to current transport if connected
    if (this.currentTransport) {
      const unsubscribe = this.currentTransport.on(event, handler);
      
      if (!this.unsubscribers.has(event)) {
        this.unsubscribers.set(event, []);
      }
      this.unsubscribers.get(event)!.push(unsubscribe);
    }

    // Return unsubscribe function
    return () => {
      const handlers = this.eventHandlers.get(event);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.eventHandlers.delete(event);
        }
      }

      // Unsubscribe from transport
      const unsubs = this.unsubscribers.get(event);
      if (unsubs) {
        unsubs.forEach(unsub => unsub());
        this.unsubscribers.delete(event);
      }
    };
  }

  /**
   * Get the current state
   */
  getState(): any {
    if (!this.currentTransport) {
      return {
        status: 'disconnected',
        transport: null,
        error: null
      };
    }

    return {
      ...this.currentTransport.getState(),
      transport: this.transportType
    };
  }

  /**
   * Get the current transport type
   */
  getTransportType(): 'sse' | 'polling' | null {
    return this.transportType;
  }

  /**
   * Check if SSE is supported
   */
  static isSseSupported(): boolean {
    return SseClient.isSupported();
  }

  private selectTransport(): 'sse' | 'polling' {
    // Check if transport is forced
    if (this.config.forceTransport && this.config.forceTransport !== 'auto') {
      return this.config.forceTransport;
    }

    // Auto-detect: Use SSE if supported, otherwise polling
    if (SseClient.isSupported() && !this.fallbackAttempted) {
      return 'sse';
    }

    return 'polling';
  }

  private connectSse(): void {
    try {
      this.transportType = 'sse';
      this.currentTransport = new SseClient(this.config.primary);

      // Subscribe existing handlers
      this.subscribeHandlers();

      // Add error handler for fallback
      if (this.config.autoFallback) {
        const errorUnsubscribe = this.currentTransport.on('error', (event) => {
          // Check if we should fallback
          if (this.shouldFallback(event.error)) {
            errorUnsubscribe();
            this.fallbackToPolling();
          }
        });

        // Store unsubscriber
        if (!this.unsubscribers.has('_fallback_error')) {
          this.unsubscribers.set('_fallback_error', []);
        }
        this.unsubscribers.get('_fallback_error')!.push(errorUnsubscribe);
      }

      this.currentTransport.connect();
    } catch (error) {
      // SSE failed to initialize, fallback to polling
      if (this.config.autoFallback) {
        this.fallbackToPolling();
      } else {
        throw error;
      }
    }
  }

  private connectPolling(): void {
    this.transportType = 'polling';
    this.currentTransport = new HttpPollingClient(this.config.fallback);

    // Subscribe existing handlers
    this.subscribeHandlers();

    this.currentTransport.connect();
  }

  private fallbackToPolling(): void {
    if (this.fallbackAttempted || this.transportType === 'polling') {
      return; // Already using polling or fallback already attempted
    }

    this.fallbackAttempted = true;
    console.warn('SSE connection failed, falling back to HTTP polling');

    // Disconnect current transport
    if (this.currentTransport) {
      this.currentTransport.disconnect();
      this.cleanupTransport();
    }

    // Connect with polling
    this.connectPolling();

    // Emit fallback event
    this.emitToHandlers('fallback', { from: 'sse', to: 'polling' });
  }

  private shouldFallback(error?: Error): boolean {
    if (!error) return false;

    // Fallback on specific error conditions
    const errorMessage = error.message.toLowerCase();
    
    // Network errors
    if (errorMessage.includes('network') || 
        errorMessage.includes('failed to fetch') ||
        errorMessage.includes('connection')) {
      return true;
    }

    // SSE not supported errors
    if (errorMessage.includes('eventsource') ||
        errorMessage.includes('not supported')) {
      return true;
    }

    // Server errors that indicate SSE endpoint issues
    if (errorMessage.includes('404') ||
        errorMessage.includes('405') ||
        errorMessage.includes('501')) {
      return true;
    }

    return false;
  }

  private subscribeHandlers(): void {
    if (!this.currentTransport) return;

    // Subscribe all existing handlers to the new transport
    this.eventHandlers.forEach((handlers, event) => {
      handlers.forEach(handler => {
        const unsubscribe = this.currentTransport!.on(event, handler);
        
        if (!this.unsubscribers.has(event)) {
          this.unsubscribers.set(event, []);
        }
        this.unsubscribers.get(event)!.push(unsubscribe);
      });
    });
  }

  private cleanupTransport(): void {
    // Unsubscribe all handlers
    this.unsubscribers.forEach(unsubs => {
      unsubs.forEach(unsub => unsub());
    });
    this.unsubscribers.clear();

    this.currentTransport = null;
    this.transportType = null;
  }

  private emitToHandlers(event: string, data?: unknown): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler({ type: event as any, data });
        } catch (err) {
          console.error(`Error in event handler for ${event}:`, err);
        }
      });
    }
  }
}