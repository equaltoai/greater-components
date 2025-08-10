/**
 * Integration utilities for connecting stores to components
 * Provides hooks and utilities for reactive store integration
 */

import type { Status } from '../types';
import { TimelineStore, type TimelineConfig } from './timelineStore';
import { NotificationStore, type NotificationConfig } from './notificationStore';
import { TransportManager, type TransportConfig } from './transport';

export interface ConnectionConfig {
  baseUrl: string;
  accessToken?: string;
  transport?: TransportConfig;
  autoConnect?: boolean;
}

export interface TimelineIntegrationConfig extends ConnectionConfig {
  timeline?: TimelineConfig;
}

export interface NotificationIntegrationConfig extends ConnectionConfig {
  notification?: NotificationConfig;
}

/**
 * Create an integrated timeline with transport connection
 */
export function createTimelineIntegration(config: TimelineIntegrationConfig) {
  const timeline = new TimelineStore(config.timeline);
  let transport: TransportManager | null = null;
  let connected = false;
  
  // Create transport if configured
  if (config.transport) {
    transport = new TransportManager({
      ...config.transport,
      baseUrl: config.baseUrl,
      accessToken: config.accessToken
    });
    
    timeline.connectTransport(transport);
  }

  return {
    store: timeline,
    transport,
    
    /**
     * Connect to the server and load initial data
     */
    async connect(): Promise<void> {
      if (connected) return;
      
      try {
        // Connect transport if available
        if (transport) {
          await transport.connect();
        }
        
        // Load initial timeline data
        await timeline.loadInitial(config.baseUrl, config.accessToken);
        connected = true;
      } catch (error) {
        console.error('Failed to connect timeline:', error);
        throw error;
      }
    },

    /**
     * Disconnect from the server
     */
    disconnect(): void {
      if (transport) {
        transport.disconnect();
      }
      timeline.disconnectTransport();
      connected = false;
    },

    /**
     * Load more recent items
     */
    async loadNewer(): Promise<void> {
      await timeline.loadNewer(config.baseUrl, config.accessToken);
      timeline.clearUnreadCount();
    },

    /**
     * Load older items
     */
    async loadOlder(): Promise<void> {
      await timeline.loadOlder(config.baseUrl, config.accessToken);
    },

    /**
     * Refresh the timeline
     */
    async refresh(): Promise<void> {
      await timeline.refresh(config.baseUrl, config.accessToken);
    },

    /**
     * Update a status
     */
    updateStatus(status: Status): void {
      timeline.updateStatus(status);
    },

    /**
     * Get reactive state
     */
    get state() {
      return timeline.currentState;
    },

    /**
     * Get items
     */
    get items() {
      return timeline.items;
    },

    /**
     * Cleanup
     */
    destroy(): void {
      this.disconnect();
      timeline.destroy();
    }
  };
}

/**
 * Create an integrated notification feed with transport connection
 */
export function createNotificationIntegration(config: NotificationIntegrationConfig) {
  const notifications = new NotificationStore(config.notification);
  let transport: TransportManager | null = null;
  let connected = false;
  
  // Create transport if configured
  if (config.transport) {
    transport = new TransportManager({
      ...config.transport,
      baseUrl: config.baseUrl,
      accessToken: config.accessToken
    });
    
    notifications.connectTransport(transport);
  }

  return {
    store: notifications,
    transport,
    
    /**
     * Connect to the server and load initial data
     */
    async connect(): Promise<void> {
      if (connected) return;
      
      try {
        // Connect transport if available
        if (transport) {
          await transport.connect();
        }
        
        // Load initial notification data
        await notifications.loadInitial(config.baseUrl, config.accessToken);
        connected = true;
      } catch (error) {
        console.error('Failed to connect notifications:', error);
        throw error;
      }
    },

    /**
     * Disconnect from the server
     */
    disconnect(): void {
      if (transport) {
        transport.disconnect();
      }
      notifications.disconnectTransport();
      connected = false;
    },

    /**
     * Load more notifications
     */
    async loadMore(): Promise<void> {
      await notifications.loadMore(config.baseUrl, config.accessToken);
    },

    /**
     * Mark notification as read
     */
    async markAsRead(notificationId: string): Promise<void> {
      await notifications.markAsRead(notificationId, config.baseUrl, config.accessToken);
    },

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(): Promise<void> {
      await notifications.markAllAsRead(config.baseUrl, config.accessToken);
    },

    /**
     * Dismiss notification
     */
    async dismiss(notificationId: string): Promise<void> {
      await notifications.dismissNotification(notificationId, config.baseUrl, config.accessToken);
    },

    /**
     * Toggle grouping
     */
    toggleGrouping(): void {
      notifications.toggleGrouping();
    },

    /**
     * Refresh notifications
     */
    async refresh(): Promise<void> {
      await notifications.refresh(config.baseUrl, config.accessToken);
    },

    /**
     * Get reactive state
     */
    get state() {
      return notifications.currentState;
    },

    /**
     * Get notifications
     */
    get items() {
      return notifications.items;
    },

    /**
     * Get notification groups
     */
    get groups() {
      return notifications.groups;
    },

    /**
     * Cleanup
     */
    destroy(): void {
      this.disconnect();
      notifications.destroy();
    }
  };
}

/**
 * Utility to create a shared transport for multiple integrations
 */
export function createSharedTransport(config: TransportConfig): TransportManager {
  return new TransportManager(config);
}

/**
 * Real-time status indicator component props
 */
export interface RealtimeIndicatorProps {
  connected: boolean;
  error?: string | null;
  reconnecting?: boolean;
  className?: string;
}

/**
 * Higher-order function to add real-time capabilities to existing components
 */
export function withRealtime<T extends Record<string, any>>(
  Component: any,
  integration: ReturnType<typeof createTimelineIntegration> | ReturnType<typeof createNotificationIntegration>
) {
  return function RealtimeWrapper(props: T) {
    let mounted = false;

    // Connect on mount
    $effect(() => {
      if (!mounted) {
        mounted = true;
        integration.connect().catch(console.error);
      }
      
      return () => {
        if (mounted) {
          integration.disconnect();
        }
      };
    });

    return Component({
      ...props,
      // Merge store data with props
      ...integration.state,
      // Add real-time specific props
      connected: integration.state.connected,
      onLoadMore: (props as any).onLoadMore || (() => {
        if ('loadMore' in integration) {
          (integration as any).loadMore();
        } else if ('loadOlder' in integration) {
          (integration as any).loadOlder();
        }
      }),
      onLoadPrevious: (props as any).onLoadPrevious || (() => {
        if ('loadNewer' in integration) {
          (integration as any).loadNewer();
        }
      }),
      onMarkAsRead: (props as any).onMarkAsRead || ('markAsRead' in integration ? (integration as any).markAsRead : undefined),
      onMarkAllAsRead: (props as any).onMarkAllAsRead || ('markAllAsRead' in integration ? (integration as any).markAllAsRead : undefined),
      onDismiss: (props as any).onDismiss || ('dismiss' in integration ? (integration as any).dismiss : undefined)
    });
  };
}

/**
 * Error boundary for real-time components
 */
export class RealtimeErrorBoundary {
  private errorHandlers = new Set<(error: Error) => void>();
  
  onError(handler: (error: Error) => void): () => void {
    this.errorHandlers.add(handler);
    
    return () => {
      this.errorHandlers.delete(handler);
    };
  }
  
  handleError(error: Error): void {
    this.errorHandlers.forEach(handler => {
      try {
        handler(error);
      } catch (err) {
        console.error('Error in error handler:', err);
      }
    });
  }
}

/**
 * Create a global error boundary instance
 */
export const realtimeErrorBoundary = new RealtimeErrorBoundary();