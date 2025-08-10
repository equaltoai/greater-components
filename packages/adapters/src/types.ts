/**
 * Transport types and interfaces for WebSocket, SSE, and HTTP Polling
 */

// Base configuration shared across all transports
export interface BaseTransportConfig {
  /** URL to connect to */
  url: string;
  
  /** Authentication token for connection */
  authToken?: string;
  
  /** Initial reconnect delay in milliseconds (default: 500) */
  initialReconnectDelay?: number;
  
  /** Maximum reconnect delay in milliseconds (default: 30000) */
  maxReconnectDelay?: number;
  
  /** Jitter factor for reconnect delay (0-1, default: 0.3) */
  jitterFactor?: number;
  
  /** Maximum number of reconnect attempts (default: Infinity) */
  maxReconnectAttempts?: number;
  
  /** Storage key for persisting lastEventId */
  lastEventIdStorageKey?: string;
  
  /** Custom storage adapter for lastEventId persistence */
  storage?: Storage;
}

export interface WebSocketClientConfig extends BaseTransportConfig {
  /** Heartbeat interval in milliseconds (default: 30000) */
  heartbeatInterval?: number;
  
  /** Heartbeat timeout in milliseconds (default: 60000) */
  heartbeatTimeout?: number;
  
  /** Enable latency sampling (default: true) */
  enableLatencySampling?: boolean;
  
  /** Latency sampling interval in milliseconds (default: 10000) */
  latencySamplingInterval?: number;
}

export interface WebSocketMessage {
  /** Message type/event name */
  type: string;
  
  /** Message payload */
  data?: unknown;
  
  /** Event ID for resumption */
  id?: string;
  
  /** Timestamp of the message */
  timestamp?: number;
}

export interface WebSocketClientState {
  /** Current connection state */
  status: 'disconnected' | 'connecting' | 'connected' | 'reconnecting';
  
  /** Number of reconnection attempts */
  reconnectAttempts: number;
  
  /** Current latency in milliseconds */
  latency: number | null;
  
  /** Last error if any */
  error: Error | null;
  
  /** Last event ID for resumption */
  lastEventId: string | null;
}

export type WebSocketEventType = 
  | 'open'
  | 'close'
  | 'error'
  | 'message'
  | 'reconnecting'
  | 'reconnected'
  | 'latency';

export interface WebSocketEvent {
  type: WebSocketEventType;
  data?: unknown;
  error?: Error;
  latency?: number;
}

export type WebSocketEventHandler = (event: WebSocketEvent) => void;

export interface HeartbeatMessage {
  type: 'ping' | 'pong';
  timestamp: number;
}

export interface LatencySample {
  timestamp: number;
  latency: number;
}

// SSE-specific types
export interface SseClientConfig extends BaseTransportConfig {
  /** Heartbeat interval in milliseconds (default: 30000) */
  heartbeatInterval?: number;
  
  /** Heartbeat timeout in milliseconds (default: 60000) */
  heartbeatTimeout?: number;
  
  /** Enable latency sampling (default: true) */
  enableLatencySampling?: boolean;
  
  /** Latency sampling interval in milliseconds (default: 10000) */
  latencySamplingInterval?: number;

  /** Whether to include credentials in the request (default: false) */
  withCredentials?: boolean;
  
  /** Custom headers to send with the SSE request */
  headers?: Record<string, string>;
}

export interface SseMessage {
  /** Event type */
  event?: string;
  
  /** Event data */
  data: string;
  
  /** Event ID for resumption */
  id?: string;
  
  /** Retry duration in milliseconds */
  retry?: number;
}

export interface SseClientState {
  /** Current connection state */
  status: 'disconnected' | 'connecting' | 'connected' | 'reconnecting';
  
  /** Number of reconnection attempts */
  reconnectAttempts: number;
  
  /** Current latency in milliseconds */
  latency: number | null;
  
  /** Last error if any */
  error: Error | null;
  
  /** Last event ID for resumption */
  lastEventId: string | null;
}

// HTTP Polling-specific types
export interface HttpPollingClientConfig extends BaseTransportConfig {
  /** Polling interval in milliseconds (default: 5000) */
  pollingInterval?: number;
  
  /** Whether to include credentials in the request (default: false) */
  withCredentials?: boolean;
  
  /** Custom headers to send with requests */
  headers?: Record<string, string>;
  
  /** Request timeout in milliseconds (default: 30000) */
  requestTimeout?: number;
  
  /** Enable latency sampling (default: true) */
  enableLatencySampling?: boolean;
}

export interface HttpPollingClientState {
  /** Current connection state */
  status: 'disconnected' | 'polling' | 'waiting' | 'reconnecting';
  
  /** Number of reconnection attempts */
  reconnectAttempts: number;
  
  /** Current latency in milliseconds */
  latency: number | null;
  
  /** Last error if any */
  error: Error | null;
  
  /** Last event ID for resumption */
  lastEventId: string | null;
}

export interface HttpPollingMessage {
  /** Message type/event name */
  type: string;
  
  /** Message payload */
  data?: unknown;
  
  /** Event ID for resumption */
  id?: string;
  
  /** Timestamp of the message */
  timestamp?: number;
}

// Transport fallback types
export interface TransportAdapter {
  connect(): void;
  disconnect(): void;
  destroy(): void;
  send?(message: unknown): void;
  on(event: string, handler: (event: any) => void): () => void;
  getState(): any;
}

export interface TransportFallbackConfig {
  /** Primary transport config (SSE) */
  primary: SseClientConfig;
  
  /** Fallback transport config (HTTP Polling) */
  fallback: HttpPollingClientConfig;
  
  /** Whether to auto-detect and fallback (default: true) */
  autoFallback?: boolean;
  
  /** Force a specific transport ('sse' | 'polling' | 'auto') */
  forceTransport?: 'sse' | 'polling' | 'auto';
}

// Transport Manager types for unified multi-transport support
export type TransportType = 'websocket' | 'sse' | 'polling';

export interface TransportManagerConfig {
  /** WebSocket transport configuration */
  websocket: WebSocketClientConfig;
  
  /** SSE transport configuration */
  sse: SseClientConfig;
  
  /** HTTP Polling transport configuration */
  polling: HttpPollingClientConfig;
  
  /** Whether to auto-detect and fallback through transport hierarchy (default: true) */
  autoFallback?: boolean;
  
  /** Force a specific transport ('websocket' | 'sse' | 'polling' | 'auto') */
  forceTransport?: TransportType | 'auto';
  
  /** Maximum number of persistent failures before switching transports (default: 3) */
  maxFailuresBeforeSwitch?: number;
  
  /** Whether to attempt to retry with higher-priority transports after successful connection (default: false) */
  enableUpgradeAttempts?: boolean;
  
  /** Interval in milliseconds for attempting transport upgrades (default: 300000 - 5 minutes) */
  upgradeAttemptInterval?: number;
}

export interface TransportManagerState {
  /** Current connection state */
  status: 'disconnected' | 'connecting' | 'connected' | 'reconnecting';
  
  /** Currently active transport type */
  activeTransport: TransportType | null;
  
  /** Number of consecutive failures for current transport */
  failureCount: number;
  
  /** Whether transport switching is available */
  canFallback: boolean;
  
  /** Number of reconnection attempts */
  reconnectAttempts: number;
  
  /** Current latency in milliseconds */
  latency: number | null;
  
  /** Last error if any */
  error: Error | null;
  
  /** Last event ID for resumption */
  lastEventId: string | null;
  
  /** Transport priority order based on feature detection */
  transportPriority: TransportType[];
}

export interface TransportSwitchEvent {
  /** Previous transport type */
  from: TransportType | null;
  
  /** New transport type */
  to: TransportType;
  
  /** Reason for the switch */
  reason: 'fallback' | 'upgrade' | 'forced' | 'feature_detection';
  
  /** Error that triggered the switch (if applicable) */
  error?: Error;
}