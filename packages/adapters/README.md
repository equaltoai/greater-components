# @equaltoai/greater-components-adapters

Transport adapters and state management for Greater Components.

## Installation

```bash
pnpm add @equaltoai/greater-components-adapters
```

## WebSocketClient

A robust WebSocket client with automatic reconnection, heartbeat, and latency monitoring.

### Features

- **Automatic Reconnection**: Exponential backoff with jitter (0.5s → 30s)
- **Heartbeat & Health Monitoring**: Configurable heartbeat with timeout detection
- **Latency Sampling**: Real-time latency monitoring and averaging
- **Event Resumption**: Persist and resume from last event ID
- **TypeScript Support**: Fully typed with strict mode

### Basic Usage

```typescript
import { WebSocketClient } from '@equaltoai/greater-components-adapters';

// Create a client with configuration
const client = new WebSocketClient({
  url: 'wss://example.com/socket',
  authToken: 'your-auth-token',
  heartbeatInterval: 30000,        // 30 seconds
  initialReconnectDelay: 500,      // 0.5 seconds
  maxReconnectDelay: 30000,        // 30 seconds
  jitterFactor: 0.3,                // 30% jitter
  enableLatencySampling: true
});

// Subscribe to events
client.on('open', () => {
  console.log('Connected!');
});

client.on('message', (event) => {
  console.log('Received:', event.data);
});

client.on('reconnecting', (event) => {
  console.log(`Reconnecting... Attempt ${event.data.attempt}`);
});

client.on('latency', (event) => {
  console.log(`Latency: ${event.latency}ms`);
});

// Connect to the server
client.connect();

// Send messages
client.send({
  type: 'chat',
  data: { message: 'Hello, World!' }
});

// Get current state
const state = client.getState();
console.log('Status:', state.status);
console.log('Latency:', state.latency);

// Get average latency
const avgLatency = client.getAverageLatency();
console.log('Average latency:', avgLatency);

// Disconnect gracefully
client.disconnect();

// Destroy and cleanup
client.destroy();
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `url` | string | required | WebSocket URL to connect to |
| `authToken` | string | undefined | Authentication token added as query parameter |
| `heartbeatInterval` | number | 30000 | Heartbeat interval in milliseconds |
| `heartbeatTimeout` | number | 60000 | Heartbeat timeout in milliseconds |
| `initialReconnectDelay` | number | 500 | Initial reconnect delay in milliseconds |
| `maxReconnectDelay` | number | 30000 | Maximum reconnect delay in milliseconds |
| `jitterFactor` | number | 0.3 | Jitter factor (0-1) for reconnect delay |
| `maxReconnectAttempts` | number | Infinity | Maximum number of reconnect attempts |
| `enableLatencySampling` | boolean | true | Enable periodic latency sampling |
| `latencySamplingInterval` | number | 10000 | Latency sampling interval in milliseconds |
| `lastEventIdStorageKey` | string | 'ws_last_event_id' | Storage key for persisting last event ID |
| `storage` | Storage | localStorage | Storage adapter for persistence |

### Events

| Event | Description | Data |
|-------|-------------|------|
| `open` | Connection established | - |
| `close` | Connection closed | `{ code, reason }` |
| `error` | Error occurred | Error object |
| `message` | Message received | Message data |
| `reconnecting` | Reconnection attempt started | `{ attempt, delay }` |
| `reconnected` | Successfully reconnected | - |
| `latency` | Latency measurement | `{ latency }` |

### State

The client maintains the following state:

```typescript
interface WebSocketClientState {
  status: 'disconnected' | 'connecting' | 'connected' | 'reconnecting';
  reconnectAttempts: number;
  latency: number | null;
  error: Error | null;
  lastEventId: string | null;
}
```

### Testing

The package includes comprehensive unit tests with timer control:

```bash
pnpm test
```

## License

AGPL-3.0-only