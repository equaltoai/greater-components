/**
 * Example demonstrating how to use the TransportManager for unified event handling
 * with automatic fallback across WebSocket → SSE → HTTP Polling
 */

import { TransportManager } from '../TransportManager';
import type { TransportManagerConfig, TransportSwitchEvent } from '../types';

// Example configuration for all three transport types
const config: TransportManagerConfig = {
  websocket: {
    url: 'ws://localhost:8080/ws',
    authToken: 'your-auth-token',
    heartbeatInterval: 30000,
    heartbeatTimeout: 60000
  },
  sse: {
    url: 'http://localhost:8080/events',
    authToken: 'your-auth-token',
    heartbeatInterval: 30000,
    heartbeatTimeout: 60000,
    withCredentials: false,
    headers: {
      'X-Client-Version': '1.0.0'
    }
  },
  polling: {
    url: 'http://localhost:8080/api',
    pollingInterval: 5000,
    authToken: 'your-auth-token',
    withCredentials: false,
    headers: {
      'X-Client-Version': '1.0.0'
    },
    requestTimeout: 30000
  },
  
  // Configuration options
  autoFallback: true, // Enable automatic fallback
  forceTransport: 'auto', // Let the manager choose optimal transport
  maxFailuresBeforeSwitch: 3, // Switch after 3 consecutive failures
  enableUpgradeAttempts: true, // Try to upgrade to better transports
  upgradeAttemptInterval: 300000 // Try upgrade every 5 minutes
};

export class ExampleApp {
  private transportManager: TransportManager;
  private isConnected = false;

  constructor() {
    this.transportManager = new TransportManager(config);
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    // Connection events
    this.transportManager.on('open', () => {
      this.isConnected = true;
      console.log('✅ Connected via', this.transportManager.getActiveTransport());
      console.log('📊 Connection state:', this.transportManager.getState());
    });

    this.transportManager.on('close', () => {
      this.isConnected = false;
      console.log('❌ Disconnected');
    });

    this.transportManager.on('error', (event) => {
      console.error('🚨 Transport error:', event.error?.message);
    });

    // Transport switching events
    this.transportManager.on('transport_switch', (event) => {
      const switchData = event.data as TransportSwitchEvent;
      console.log(`🔄 Transport switched: ${switchData.from} → ${switchData.to} (${switchData.reason})`);
      
      if (switchData.error) {
        console.log('   Reason:', switchData.error.message);
      }
    });

    // Reconnection events
    this.transportManager.on('reconnecting', (event) => {
      const attempt = event.data && typeof event.data === 'object' && 'attempt' in event.data ? (event.data as any).attempt : 0;
      console.log('🔄 Reconnecting... (attempt', attempt, ')');
    });

    this.transportManager.on('reconnected', () => {
      console.log('✅ Reconnected successfully');
    });

    // Application-specific message handlers
    this.transportManager.on('message', (event) => {
      console.log('📨 Received message:', event.data);
    });

    this.transportManager.on('user_joined', (event) => {
      console.log('👤 User joined:', event.data);
    });

    this.transportManager.on('user_left', (event) => {
      console.log('👤 User left:', event.data);
    });

    this.transportManager.on('chat_message', (event) => {
      console.log('💬 Chat message:', event.data);
    });

    // Latency monitoring
    this.transportManager.on('latency', (event) => {
      const latency = event.data && typeof event.data === 'object' && 'latency' in event.data ? (event.data as any).latency : 0;
      console.log(`📡 Latency: ${latency}ms (${this.transportManager.getActiveTransport()})`);
    });
  }

  /**
   * Connect to the server using optimal transport
   */
  async connect(): Promise<void> {
    try {
      console.log('🚀 Starting connection...');
      console.log('🔍 Feature support:', TransportManager.getFeatureSupport());
      
      this.transportManager.connect();
    } catch (error) {
      console.error('❌ Failed to connect:', error);
      throw error;
    }
  }

  /**
   * Disconnect from the server
   */
  disconnect(): void {
    console.log('🔌 Disconnecting...');
    this.transportManager.disconnect();
  }

  /**
   * Send a message (works with WebSocket and HTTP Polling)
   */
  sendMessage(type: string, data: any): void {
    if (!this.isConnected) {
      throw new Error('Not connected');
    }

    try {
      this.transportManager.send({
        type,
        data,
        timestamp: Date.now()
      });
      
      console.log(`📤 Sent ${type} message via ${this.transportManager.getActiveTransport()}`);
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      throw error;
    }
  }

  /**
   * Manually switch to a specific transport
   */
  switchTransport(transportType: 'websocket' | 'sse' | 'polling'): void {
    try {
      this.transportManager.switchTransport(transportType, 'Manual switch by user');
      console.log(`🔄 Manually switched to ${transportType}`);
    } catch (error) {
      console.error('❌ Failed to switch transport:', error);
      throw error;
    }
  }

  /**
   * Get current connection status and transport info
   */
  getStatus(): any {
    return {
      connected: this.isConnected,
      activeTransport: this.transportManager.getActiveTransport(),
      state: this.transportManager.getState(),
      featureSupport: TransportManager.getFeatureSupport()
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    console.log('🧹 Cleaning up...');
    this.transportManager.destroy();
  }
}

// Usage example
export async function runExample(): Promise<void> {
  const app = new ExampleApp();

  try {
    // Connect using optimal transport
    await app.connect();

    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Send some messages
    app.sendMessage('chat_message', { text: 'Hello World!', user: 'john' });
    app.sendMessage('user_status', { user: 'john', status: 'online' });

    // Check status
    console.log('📊 Current status:', app.getStatus());

    // Demonstrate manual transport switching
    if (app.getStatus().featureSupport.polling) {
      app.switchTransport('polling');
      
      // Wait for switch
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Send message via new transport
      app.sendMessage('test_message', { test: 'polling transport' });
    }

    // Let it run for a bit to see transport behavior
    await new Promise(resolve => setTimeout(resolve, 5000));

  } catch (error) {
    console.error('❌ Example error:', error);
  } finally {
    // Cleanup
    app.destroy();
  }
}


// Uncomment to run the example directly
// if (typeof window === 'undefined') {
//   runExample().catch(console.error);
// }