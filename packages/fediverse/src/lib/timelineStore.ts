/**
 * Timeline store with real-time updates and caching
 * Provides reactive state management for timeline data
 */

import type { Status } from '../types';
import type { TransportManager } from './transport';

export interface TimelineState {
  items: Status[];
  loading: boolean;
  loadingTop: boolean;
  loadingBottom: boolean;
  endReached: boolean;
  error: string | null;
  lastUpdated: Date | null;
  unreadCount: number;
  connected: boolean;
}

export interface TimelineConfig {
  maxItems?: number;
  preloadCount?: number;
  type?: 'public' | 'home' | 'local';
  enableRealtime?: boolean;
}

export class TimelineStore {
  private state = $state<TimelineState>({
    items: [],
    loading: false,
    loadingTop: false,
    loadingBottom: false,
    endReached: false,
    error: null,
    lastUpdated: null,
    unreadCount: 0,
    connected: false
  });

  private config: Required<TimelineConfig>;
  private transport: TransportManager | null = null;
  private itemsMap = new Map<string, Status>();
  private abortController: AbortController | null = null;

  constructor(config: TimelineConfig = {}) {
    this.config = {
      maxItems: 1000,
      preloadCount: 20,
      type: 'public',
      enableRealtime: true,
      ...config
    };
  }

  /**
   * Connect to transport for real-time updates
   */
  connectTransport(transport: TransportManager): void {
    if (this.transport) {
      this.disconnectTransport();
    }

    this.transport = transport;

    // Listen for connection status
    this.transport.on('connection.open', () => {
      this.state.connected = true;
      this.state.error = null;
      
      if (this.config.enableRealtime) {
        transport.subscribeToTimeline(this.config.type);
      }
    });

    this.transport.on('connection.close', () => {
      this.state.connected = false;
    });

    this.transport.on('connection.error', (error) => {
      this.state.connected = false;
      this.state.error = error.message;
    });

    // Listen for real-time updates
    if (this.config.enableRealtime) {
      this.transport.on('status.update', (status) => {
        this.addStatus(status, 'prepend');
        this.state.unreadCount++;
        this.state.lastUpdated = new Date();
      });

      this.transport.on('status.delete', ({ id }) => {
        this.removeStatus(id);
      });
    }
  }

  /**
   * Disconnect from transport
   */
  disconnectTransport(): void {
    if (this.transport) {
      this.transport.off('connection.open', () => {});
      this.transport.off('connection.close', () => {});
      this.transport.off('connection.error', () => {});
      this.transport.off('status.update', () => {});
      this.transport.off('status.delete', () => {});
      this.transport = null;
      this.state.connected = false;
    }
  }

  /**
   * Load initial timeline data
   */
  async loadInitial(baseUrl: string, accessToken?: string): Promise<void> {
    if (this.state.loading) return;

    this.state.loading = true;
    this.state.error = null;
    this.abortController = new AbortController();

    try {
      const url = new URL(`/api/v1/timelines/${this.config.type}`, baseUrl);
      url.searchParams.set('limit', this.config.preloadCount.toString());

      const headers: Record<string, string> = {};
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(url.toString(), {
        headers,
        signal: this.abortController.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const statuses: Status[] = await response.json();
      
      this.state.items = statuses;
      this.itemsMap.clear();
      statuses.forEach(status => this.itemsMap.set(status.id, status));
      
      this.state.endReached = statuses.length < this.config.preloadCount;
      this.state.lastUpdated = new Date();
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        this.state.error = error.message;
      }
    } finally {
      this.state.loading = false;
      this.abortController = null;
    }
  }

  /**
   * Load more recent statuses
   */
  async loadNewer(baseUrl: string, accessToken?: string): Promise<void> {
    if (this.state.loadingTop || this.state.items.length === 0) return;

    this.state.loadingTop = true;
    this.state.error = null;

    try {
      const url = new URL(`/api/v1/timelines/${this.config.type}`, baseUrl);
      const firstItem = this.state.items[0];
      if (!firstItem) return;
      url.searchParams.set('since_id', firstItem.id);
      url.searchParams.set('limit', this.config.preloadCount.toString());

      const headers: Record<string, string> = {};
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(url.toString(), { headers });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const statuses: Status[] = await response.json();
      
      // Add new statuses to the beginning
      statuses.reverse().forEach(status => this.addStatus(status, 'prepend'));
      
      this.state.lastUpdated = new Date();
    } catch (error) {
      if (error instanceof Error) {
        this.state.error = error.message;
      }
    } finally {
      this.state.loadingTop = false;
    }
  }

  /**
   * Load older statuses
   */
  async loadOlder(baseUrl: string, accessToken?: string): Promise<void> {
    if (this.state.loadingBottom || this.state.endReached || this.state.items.length === 0) return;

    this.state.loadingBottom = true;
    this.state.error = null;

    try {
      const url = new URL(`/api/v1/timelines/${this.config.type}`, baseUrl);
      const lastItem = this.state.items[this.state.items.length - 1];
      if (!lastItem) return;
      url.searchParams.set('max_id', lastItem.id);
      url.searchParams.set('limit', this.config.preloadCount.toString());

      const headers: Record<string, string> = {};
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(url.toString(), { headers });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const statuses: Status[] = await response.json();
      
      // Add older statuses to the end
      statuses.forEach(status => this.addStatus(status, 'append'));
      
      this.state.endReached = statuses.length < this.config.preloadCount;
      this.state.lastUpdated = new Date();
    } catch (error) {
      if (error instanceof Error) {
        this.state.error = error.message;
      }
    } finally {
      this.state.loadingBottom = false;
    }
  }

  /**
   * Add a status to the timeline
   */
  private addStatus(status: Status, position: 'prepend' | 'append' = 'prepend'): void {
    // Avoid duplicates
    if (this.itemsMap.has(status.id)) {
      // Update existing status
      this.itemsMap.set(status.id, status);
      const index = this.state.items.findIndex(s => s.id === status.id);
      if (index >= 0) {
        this.state.items[index] = status;
      }
      return;
    }

    this.itemsMap.set(status.id, status);

    if (position === 'prepend') {
      this.state.items.unshift(status);
    } else {
      this.state.items.push(status);
    }

    // Trim to max items
    if (this.state.items.length > this.config.maxItems) {
      const removed = position === 'prepend' 
        ? this.state.items.splice(this.config.maxItems)
        : this.state.items.splice(0, this.state.items.length - this.config.maxItems);
      
      // Remove from map
      removed.forEach(s => this.itemsMap.delete(s.id));
    }
  }

  /**
   * Remove a status from the timeline
   */
  private removeStatus(statusId: string): void {
    this.itemsMap.delete(statusId);
    const index = this.state.items.findIndex(s => s.id === statusId);
    if (index >= 0) {
      this.state.items.splice(index, 1);
    }
  }

  /**
   * Update a status in the timeline
   */
  updateStatus(status: Status): void {
    const existingStatus = this.itemsMap.get(status.id);
    if (existingStatus) {
      this.itemsMap.set(status.id, status);
      const index = this.state.items.findIndex(s => s.id === status.id);
      if (index >= 0) {
        this.state.items[index] = status;
      }
    }
  }

  /**
   * Clear unread count
   */
  clearUnreadCount(): void {
    this.state.unreadCount = 0;
  }

  /**
   * Refresh the timeline
   */
  async refresh(baseUrl: string, accessToken?: string): Promise<void> {
    this.state.items = [];
    this.itemsMap.clear();
    this.state.endReached = false;
    this.state.unreadCount = 0;
    await this.loadInitial(baseUrl, accessToken);
  }

  /**
   * Abort current loading operation
   */
  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  /**
   * Get current state (reactive)
   */
  get currentState(): TimelineState {
    return this.state;
  }

  /**
   * Get items array (reactive)
   */
  get items(): Status[] {
    return this.state.items;
  }

  /**
   * Get loading state
   */
  get loading(): boolean {
    return this.state.loading;
  }

  /**
   * Get connection status
   */
  get connected(): boolean {
    return this.state.connected;
  }

  /**
   * Get error message
   */
  get error(): string | null {
    return this.state.error;
  }

  /**
   * Get unread count
   */
  get unreadCount(): number {
    return this.state.unreadCount;
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.abort();
    this.disconnectTransport();
    this.itemsMap.clear();
  }
}
