/**
 * Transport layer for real-time communication with fediverse servers
 * Supports WebSocket streaming, Server-Sent Events, and polling fallbacks
 */

import type { Status, Notification } from '../types';

export interface TransportConfig {
  baseUrl: string;
  accessToken?: string;
  protocol: 'websocket' | 'sse' | 'polling';
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  pollInterval?: number;
}

export interface StreamingMessage {
  event: string;
  payload: any;
  stream?: string;
}

export interface TransportEventMap {
  // Core events
  'status.update': Status;
  'status.delete': { id: string };
  'notification.new': Notification;
  'notification.update': Notification;
  'connection.open': void;
  'connection.close': void;
  'connection.error': Error;
  'connection.reconnecting': { attempt: number };
  
  // Lesser Timeline & Social events
  'timeline.update': any;
  'conversation.update': any;
  'list.update': any;
  'activity.stream': any;
  'relationship.update': any;
  
  // Lesser Quote Posts events
  'quote.activity': any;
  
  // Lesser Hashtag events
  'hashtag.activity': any;
  
  // Lesser Trust & Moderation events
  'trust.update': any;
  'moderation.event': any;
  'moderation.alert': any;
  'moderation.queue': any;
  'threat.intelligence': any;
  
  // Lesser AI Analysis events
  'ai.analysis': any;
  
  // Lesser Cost & Budget events
  'cost.update': any;
  'cost.alert': any;
  'budget.alert': any;
  
  // Lesser Metrics & Performance events
  'metrics.update': any;
  'performance.alert': any;
  
  // Lesser Federation & Infrastructure events
  'federation.health': any;
  'infrastructure.event': any;
}

export type TransportEventType = keyof TransportEventMap;

export class TransportManager {
  private config: TransportConfig;
  private connection: WebSocket | EventSource | null = null;
  private eventHandlers = new Map<TransportEventType, Set<Function>>();
  private reconnectTimer: number | null = null;
  private reconnectAttempts = 0;
  private isConnected = false;
  private pollTimer: number | null = null;
  private lastNotificationId?: string;
  private lastStatusId?: string;

  constructor(config: TransportConfig) {
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      pollInterval: 30000,
      ...config
    };
  }

  /**
   * Connect to the streaming endpoint
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      switch (this.config.protocol) {
        case 'websocket':
          await this.connectWebSocket();
          break;
        case 'sse':
          await this.connectServerSentEvents();
          break;
        case 'polling':
          await this.connectPolling();
          break;
        default:
          throw new Error(`Unsupported protocol: ${this.config.protocol}`);
      }
    } catch (error) {
      this.emit('connection.error', error as Error);
      this.scheduleReconnect();
    }
  }

  /**
   * Disconnect from the streaming endpoint
   */
  disconnect(): void {
    this.isConnected = false;
    this.reconnectAttempts = 0;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }

    if (this.connection) {
      if (this.connection instanceof WebSocket) {
        this.connection.close();
      } else if (this.connection instanceof EventSource) {
        this.connection.close();
      }
      this.connection = null;
    }

    this.emit('connection.close', undefined);
  }

  /**
   * Subscribe to timeline streaming
   */
  subscribeToTimeline(type: 'public' | 'home' | 'local' = 'public'): void {
    if (!this.isConnected) {
      throw new Error('Transport not connected');
    }

    // For WebSocket, send subscription message
    if (this.connection instanceof WebSocket && this.connection.readyState === WebSocket.OPEN) {
      this.connection.send(JSON.stringify({
        type: 'subscribe',
        stream: type
      }));
    }
  }

  /**
   * Subscribe to notification streaming
   */
  subscribeToNotifications(): void {
    if (!this.isConnected) {
      throw new Error('Transport not connected');
    }

    // For WebSocket, send subscription message
    if (this.connection instanceof WebSocket && this.connection.readyState === WebSocket.OPEN) {
      this.connection.send(JSON.stringify({
        type: 'subscribe',
        stream: 'user'
      }));
    }
  }

  /**
   * Subscribe to hashtag timeline
   */
  subscribeToHashtag(hashtags: string[]): void {
    if (!this.isConnected) {
      throw new Error('Transport not connected');
    }

    if (this.connection instanceof WebSocket && this.connection.readyState === WebSocket.OPEN) {
      this.connection.send(JSON.stringify({
        type: 'subscribe',
        stream: 'hashtag',
        hashtags
      }));
    }
  }

  /**
   * Subscribe to list timeline
   */
  subscribeToList(listId: string): void {
    if (!this.isConnected) {
      throw new Error('Transport not connected');
    }

    if (this.connection instanceof WebSocket && this.connection.readyState === WebSocket.OPEN) {
      this.connection.send(JSON.stringify({
        type: 'subscribe',
        stream: 'list',
        listId
      }));
    }
  }

  /**
   * Subscribe to admin events
   */
  subscribeToAdminEvents(eventTypes?: string[]): void {
    if (!this.isConnected) {
      throw new Error('Transport not connected');
    }

    if (this.connection instanceof WebSocket && this.connection.readyState === WebSocket.OPEN) {
      this.connection.send(JSON.stringify({
        type: 'subscribe',
        stream: 'admin',
        eventTypes
      }));
    }
  }

  /**
   * Add event listener
   */
  on<T extends TransportEventType>(event: T, handler: (data: TransportEventMap[T]) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  /**
   * Remove event listener
   */
  off<T extends TransportEventType>(event: T, handler: (data: TransportEventMap[T]) => void): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  /**
   * Emit event to all listeners
   */
  private emit<T extends TransportEventType>(event: T, data: TransportEventMap[T]): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in ${event} handler:`, error);
        }
      });
    }
  }

  /**
   * Connect via WebSocket
   */
  private async connectWebSocket(): Promise<void> {
    const wsUrl = new URL('/api/v1/streaming', this.config.baseUrl);
    wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    
    if (this.config.accessToken) {
      wsUrl.searchParams.set('access_token', this.config.accessToken);
    }

    const ws = new WebSocket(wsUrl.toString());
    
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        ws.close();
        reject(new Error('WebSocket connection timeout'));
      }, 10000);

      ws.onopen = () => {
        clearTimeout(timeoutId);
        this.connection = ws;
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connection.open', undefined);
        resolve();
      };

      ws.onmessage = (event) => {
        try {
          const message: StreamingMessage = JSON.parse(event.data);
          this.handleStreamingMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        clearTimeout(timeoutId);
        this.isConnected = false;
        this.connection = null;
        
        if (event.code !== 1000) { // Not normal closure
          this.scheduleReconnect();
        } else {
          this.emit('connection.close', undefined);
        }
      };

      ws.onerror = (error) => {
        clearTimeout(timeoutId);
        this.emit('connection.error', new Error('WebSocket error'));
        reject(error);
      };
    });
  }

  /**
   * Connect via Server-Sent Events
   */
  private async connectServerSentEvents(): Promise<void> {
    const sseUrl = new URL('/api/v1/streaming/public', this.config.baseUrl);
    
    if (this.config.accessToken) {
      sseUrl.searchParams.set('access_token', this.config.accessToken);
    }

    const eventSource = new EventSource(sseUrl.toString());
    
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        eventSource.close();
        reject(new Error('SSE connection timeout'));
      }, 10000);

      eventSource.onopen = () => {
        clearTimeout(timeoutId);
        this.connection = eventSource;
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connection.open', undefined);
        resolve();
      };

      eventSource.onmessage = (event) => {
        try {
          const message: StreamingMessage = JSON.parse(event.data);
          this.handleStreamingMessage(message);
        } catch (error) {
          console.error('Failed to parse SSE message:', error);
        }
      };

      eventSource.onerror = (error) => {
        clearTimeout(timeoutId);
        this.isConnected = false;
        this.connection = null;
        this.emit('connection.error', new Error('SSE error'));
        this.scheduleReconnect();
        reject(error);
      };
    });
  }

  /**
   * Connect via polling
   */
  private async connectPolling(): Promise<void> {
    this.isConnected = true;
    this.reconnectAttempts = 0;
    this.emit('connection.open', undefined);
    
    this.pollTimer = setInterval(() => {
      this.pollForUpdates();
    }, this.config.pollInterval) as any;
  }

  /**
   * Poll for updates (fallback method)
   */
  private async pollForUpdates(): Promise<void> {
    try {
      // Poll for new statuses
      await this.pollTimeline();
      
      // Poll for new notifications
      await this.pollNotifications();
    } catch (error) {
      console.error('Polling error:', error);
      this.emit('connection.error', error as Error);
    }
  }

  /**
   * Poll timeline for new statuses
   */
  private async pollTimeline(): Promise<void> {
    const url = new URL('/api/v1/timelines/public', this.config.baseUrl);
    
    if (this.lastStatusId) {
      url.searchParams.set('since_id', this.lastStatusId);
    }
    
    const headers: Record<string, string> = {};
    if (this.config.accessToken) {
      headers['Authorization'] = `Bearer ${this.config.accessToken}`;
    }

    const response = await fetch(url.toString(), { headers });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const statuses: Status[] = await response.json();
    
    // Process new statuses in reverse order (oldest first)
    statuses.reverse().forEach(status => {
      this.emit('status.update', status);
      this.lastStatusId = status.id;
    });
  }

  /**
   * Poll notifications for updates
   */
  private async pollNotifications(): Promise<void> {
    const url = new URL('/api/v1/notifications', this.config.baseUrl);
    
    if (this.lastNotificationId) {
      url.searchParams.set('since_id', this.lastNotificationId);
    }
    
    const headers: Record<string, string> = {};
    if (this.config.accessToken) {
      headers['Authorization'] = `Bearer ${this.config.accessToken}`;
    }

    const response = await fetch(url.toString(), { headers });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const notifications: Notification[] = await response.json();
    
    // Process new notifications in reverse order (oldest first)
    notifications.reverse().forEach(notification => {
      this.emit('notification.new', notification);
      this.lastNotificationId = notification.id;
    });
  }

  /**
   * Handle incoming streaming messages
   */
  private handleStreamingMessage(message: StreamingMessage): void {
    switch (message.event) {
      case 'update':
        if (message.payload) {
          this.emit('status.update', message.payload as Status);
        }
        break;
      
      case 'delete':
        if (message.payload) {
          this.emit('status.delete', { id: message.payload });
        }
        break;
      
      case 'notification':
        if (message.payload) {
          this.emit('notification.new', message.payload as Notification);
        }
        break;
      
      default:
        console.debug('Unknown streaming event:', message.event);
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts!) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    this.emit('connection.reconnecting', { attempt: this.reconnectAttempts });

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.config.reconnectInterval!) as any;
  }

  /**
   * Get connection status
   */
  get connected(): boolean {
    return this.isConnected;
  }

  /**
   * Get current configuration
   */
  get configuration(): TransportConfig {
    return { ...this.config };
  }
}