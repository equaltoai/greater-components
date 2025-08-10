# Real-time Integration Usage Examples

This document demonstrates how to use the new real-time integration features with the Fediverse components.

## Basic Usage

### Timeline with Real-time Updates

```typescript
import { TimelineVirtualizedReactive } from '@greater-components/fediverse';
import type { TimelineIntegrationConfig } from '@greater-components/fediverse';

// Configure the integration
const timelineConfig: TimelineIntegrationConfig = {
  baseUrl: 'https://mastodon.social',
  accessToken: 'your-access-token',
  transport: {
    baseUrl: 'https://mastodon.social',
    protocol: 'websocket', // or 'sse' or 'polling'
    reconnectInterval: 5000,
    maxReconnectAttempts: 10
  },
  timeline: {
    maxItems: 1000,
    preloadCount: 20,
    type: 'public',
    enableRealtime: true
  },
  autoConnect: true
};

// Use the reactive timeline component
<TimelineVirtualizedReactive
  integration={timelineConfig}
  density="comfortable"
  showRealtimeIndicator={true}
  onStatusClick={(status) => console.log('Clicked:', status)}
  class="my-timeline"
/>
```

### Notifications with Real-time Updates

```typescript
import { NotificationsFeedReactive } from '@greater-components/fediverse';
import type { NotificationIntegrationConfig } from '@greater-components/fediverse';

const notificationConfig: NotificationIntegrationConfig = {
  baseUrl: 'https://mastodon.social',
  accessToken: 'your-access-token',
  transport: {
    baseUrl: 'https://mastodon.social',
    protocol: 'websocket',
    reconnectInterval: 5000
  },
  notification: {
    maxItems: 500,
    preloadCount: 20,
    enableRealtime: true,
    groupSimilar: true
  },
  autoConnect: true
};

<NotificationsFeedReactive
  integration={notificationConfig}
  density="comfortable"
  showRealtimeIndicator={true}
  onNotificationClick={(notification) => console.log('Clicked:', notification)}
  className="my-notifications"
/>
```

## Backward Compatibility

### Using RealtimeWrapper with Existing Components

The `RealtimeWrapper` provides a migration path for existing components:

```typescript
import { RealtimeWrapper } from '@greater-components/fediverse';

// Wrap existing timeline
<RealtimeWrapper
  component="timeline"
  integration={timelineConfig}
  showConnectionStatus={true}
  props={{
    density: 'compact',
    class: 'my-timeline',
    onStatusClick: handleStatusClick
  }}
/>

// Wrap existing notifications
<RealtimeWrapper
  component="notifications"
  integration={notificationConfig}
  showConnectionStatus={true}
  props={{
    grouped: true,
    density: 'comfortable',
    onNotificationClick: handleNotificationClick
  }}
/>
```

### Gradual Migration

You can continue using the original components while selectively adding real-time features:

```typescript
import { 
  TimelineVirtualized,
  TimelineVirtualizedReactive,
  createTimelineIntegration
} from '@greater-components/fediverse';

// Use traditional component for some use cases
<TimelineVirtualized
  items={staticTimeline}
  onLoadMore={handleLoadMore}
  density="comfortable"
/>

// Use reactive component for real-time features
<TimelineVirtualizedReactive
  integration={timelineConfig}
  density="comfortable"
  showRealtimeIndicator={true}
/>
```

## Advanced Usage

### Manual Store Management

For more control, you can manage stores directly:

```typescript
import { 
  createTimelineIntegration,
  createNotificationIntegration,
  createSharedTransport
} from '@greater-components/fediverse';

// Create shared transport for multiple integrations
const transport = createSharedTransport({
  baseUrl: 'https://mastodon.social',
  accessToken: 'your-access-token',
  protocol: 'websocket'
});

// Create timeline integration
const timelineIntegration = createTimelineIntegration({
  baseUrl: 'https://mastodon.social',
  accessToken: 'your-access-token',
  transport: {
    baseUrl: 'https://mastodon.social',
    protocol: 'websocket'
  },
  timeline: {
    type: 'home',
    maxItems: 500
  }
});

// Create notification integration
const notificationIntegration = createNotificationIntegration({
  baseUrl: 'https://mastodon.social',
  accessToken: 'your-access-token',
  transport: {
    baseUrl: 'https://mastodon.social',
    protocol: 'websocket'
  },
  notification: {
    groupSimilar: true,
    maxItems: 200
  }
});

// Connect both
await Promise.all([
  timelineIntegration.connect(),
  notificationIntegration.connect()
]);

// Use with components
<TimelineVirtualizedReactive
  integration={timelineIntegration}
  showRealtimeIndicator={true}
/>

<NotificationsFeedReactive
  integration={notificationIntegration}
  showRealtimeIndicator={true}
/>

// Cleanup when done
timelineIntegration.destroy();
notificationIntegration.destroy();
```

### Custom Real-time Indicators

You can provide custom real-time indicator content:

```typescript
<TimelineVirtualizedReactive
  integration={timelineConfig}
  showRealtimeIndicator={true}
>
  {#snippet realtimeIndicator({ connected, error, unreadCount, onSync })}
    <div class="custom-indicator">
      {#if connected}
        <span class="status-badge connected">🟢 Live</span>
      {:else if error}
        <span class="status-badge error">🔴 Disconnected</span>
        <button onclick={onSync}>Reconnect</button>
      {:else}
        <span class="status-badge connecting">🟡 Connecting...</span>
      {/if}
      
      {#if unreadCount > 0}
        <button class="unread-btn" onclick={onSync}>
          {unreadCount} new items
        </button>
      {/if}
    </div>
  {/snippet}
</TimelineVirtualizedReactive>
```

### Error Handling

Handle errors and connection states:

```typescript
import { realtimeErrorBoundary } from '@greater-components/fediverse';

// Global error handling
realtimeErrorBoundary.onError((error) => {
  console.error('Real-time error:', error);
  // Show user notification, retry logic, etc.
});

// Component-level error handling
const timelineIntegration = createTimelineIntegration({
  baseUrl: 'https://mastodon.social',
  accessToken: 'your-access-token',
  transport: {
    baseUrl: 'https://mastodon.social',
    protocol: 'websocket'
  }
});

// Monitor connection state
$effect(() => {
  const state = timelineIntegration.state;
  if (state.error) {
    console.error('Timeline error:', state.error);
    // Handle error state
  }
  
  if (state.connected) {
    console.log('Timeline connected');
    // Handle connected state
  }
});
```

### Performance Optimization

Configure for optimal performance:

```typescript
const optimizedConfig: TimelineIntegrationConfig = {
  baseUrl: 'https://mastodon.social',
  accessToken: 'your-access-token',
  transport: {
    baseUrl: 'https://mastodon.social',
    protocol: 'websocket',
    reconnectInterval: 3000,
    maxReconnectAttempts: 5
  },
  timeline: {
    maxItems: 500, // Limit memory usage
    preloadCount: 15, // Smaller initial load
    type: 'home',
    enableRealtime: true
  },
  autoConnect: true
};

<TimelineVirtualizedReactive
  integration={optimizedConfig}
  estimateSize={180} // Optimize virtualization
  overscan={3} // Reduce overscan for performance
  density="compact" // More items visible
  showRealtimeIndicator={true}
/>
```

## Configuration Options

### Transport Configuration

```typescript
interface TransportConfig {
  baseUrl: string;
  accessToken?: string;
  protocol: 'websocket' | 'sse' | 'polling';
  reconnectInterval?: number; // Default: 5000ms
  maxReconnectAttempts?: number; // Default: 10
  pollInterval?: number; // Default: 30000ms (for polling)
}
```

### Timeline Configuration

```typescript
interface TimelineConfig {
  maxItems?: number; // Default: 1000
  preloadCount?: number; // Default: 20
  type?: 'public' | 'home' | 'local'; // Default: 'public'
  enableRealtime?: boolean; // Default: true
}
```

### Notification Configuration

```typescript
interface NotificationConfig {
  maxItems?: number; // Default: 500
  preloadCount?: number; // Default: 20
  enableRealtime?: boolean; // Default: true
  autoMarkAsRead?: boolean; // Default: false
  groupSimilar?: boolean; // Default: true
}
```

## Migration Guide

### From v1 to v2 (Real-time Support)

1. **Keep existing components**: All existing components remain unchanged and fully compatible.

2. **Add real-time features selectively**:
   ```typescript
   // Before (v1)
   <TimelineVirtualized
     items={timelineData}
     onLoadMore={handleLoadMore}
   />

   // After (v2 - with real-time)
   <TimelineVirtualizedReactive
     integration={timelineConfig}
     showRealtimeIndicator={true}
   />

   // Or use wrapper for gradual migration
   <RealtimeWrapper
     component="timeline"
     integration={timelineConfig}
     props={{ onLoadMore: handleLoadMore }}
   />
   ```

3. **Update dependencies**: Make sure to install required dependencies for real-time features.

4. **Handle connection states**: Add appropriate UI feedback for connection states.

### Best Practices

1. **Use shared transport** when possible to reduce connection overhead
2. **Configure appropriate limits** for `maxItems` based on your use case
3. **Handle offline scenarios** with proper error states
4. **Implement proper cleanup** in component lifecycle
5. **Test with different connection types** (WebSocket, SSE, polling)
6. **Monitor performance** with large datasets and frequent updates

## Troubleshooting

### Common Issues

1. **WebSocket connection fails**
   - Try SSE or polling fallback
   - Check CORS configuration
   - Verify WebSocket support

2. **High memory usage**
   - Reduce `maxItems` configuration
   - Implement proper cleanup
   - Monitor component lifecycle

3. **Updates not appearing**
   - Verify transport connection
   - Check access token permissions
   - Monitor browser developer tools

4. **Performance issues**
   - Reduce `preloadCount`
   - Optimize virtualization settings
   - Use compact density mode