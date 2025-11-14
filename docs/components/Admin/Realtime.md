# Admin Real-Time Subscriptions

This document describes the real-time subscription events available for administrators using Lesser's GraphQL API.

## Overview

Lesser provides comprehensive real-time subscription support for monitoring and managing federated social networks. These subscriptions enable administrators to receive live updates for metrics, alerts, moderation events, federation health, and infrastructure status.

## Available Subscriptions

### Timeline & Social Events

#### `timelineUpdates`

Receives real-time updates for timeline content.

**Variables:**

- `type`: Timeline type (`HOME`, `PUBLIC`, `LOCAL`, `HASHTAG`, `LIST`, `DIRECT`)
- `listId` (optional): List ID for `LIST` timelines

**Payload:** `Object` (Post/Status)

**Example:**

```typescript
const subscription = adapter.subscribeToTimelineUpdates({
	type: 'HOME',
});

subscription.subscribe({
	next: (result) => {
		console.log('New timeline update:', result.data?.timelineUpdates);
	},
});
```

#### `notificationStream`

Receives user notifications in real-time.

**Variables:**

- `types` (optional): Filter by notification types

**Payload:** `Notification`

#### `conversationUpdates`

Real-time updates for direct message conversations.

**Payload:** `Conversation`

#### `listUpdates`

Updates for list changes (members added/removed, list edited).

**Variables:**

- `listId`: ID of the list to monitor

**Payload:** `ListUpdate`

#### `relationshipUpdates`

Monitors follower/following relationship changes.

**Variables:**

- `actorId` (optional): Filter by specific actor

**Payload:** `RelationshipUpdate`

### Quote Posts & Hashtags

#### `quoteActivity`

Monitors quote posts activity for a specific note.

**Variables:**

- `noteId`: ID of the note to monitor

**Payload:** `QuoteActivityUpdate`

**Example:**

```typescript
const subscription = adapter.subscribeToQuoteActivity({
	noteId: 'note_abc123',
});
```

#### `hashtagActivity`

Receives posts with specific hashtags in real-time.

**Variables:**

- `hashtags`: Array of hashtag names (without `#`)

**Payload:** `HashtagActivityUpdate`

**Example:**

```typescript
const subscription = adapter.subscribeToHashtagActivity({
	hashtags: ['svelte', 'typescript', 'webdev'],
});
```

### Trust & Moderation

#### `trustUpdates`

Real-time trust score changes for actors.

**Variables:**

- `actorId`: Actor to monitor (required)

**Payload:** `TrustEdge`

#### `moderationEvents`

Moderation decisions and actions.

**Variables:**

- `actorId` (optional): Filter by affected actor

**Payload:** `ModerationDecision`

#### `moderationAlerts`

High-priority moderation alerts requiring admin attention.

**Variables:**

- `severity` (optional): Minimum severity level (`INFO`, `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)

**Payload:** `ModerationAlert`

**Example:**

```typescript
const subscription = adapter.subscribeToModerationAlerts({
	severity: 'HIGH',
});

subscription.subscribe({
	next: (result) => {
		const alert = result.data?.moderationAlerts;
		if (alert && !alert.handled) {
			// Display alert to moderator
			notifyModerator(alert);
		}
	},
});
```

#### `moderationQueueUpdate`

Updates to the moderation queue.

**Variables:**

- `priority` (optional): Filter by priority level

**Payload:** `ModerationItem`

#### `threatIntelligence`

Security threat alerts across the federation.

**Payload:** `ThreatAlert`

### AI Analysis

#### `aiAnalysisUpdates`

AI content analysis results.

**Variables:**

- `objectId` (optional): Filter by specific object

**Payload:** `AIAnalysis`

Includes:

- Text analysis (sentiment, toxicity, PII detection)
- Image analysis (NSFW, violence, deepfake detection)
- AI-generated content detection
- Spam analysis

### Cost & Budget Management

#### `costUpdates`

Real-time operational cost tracking.

**Variables:**

- `threshold` (optional): Only notify when cost exceeds threshold (in microcents)

**Payload:** `CostUpdate`

Fields:

- `operationCost`: Cost of current operation
- `dailyTotal`: Total cost for current day
- `monthlyProjection`: Projected monthly cost

#### `costAlerts`

Cost threshold alerts.

**Variables:**

- `thresholdUSD`: Alert threshold in USD (required)

**Payload:** `CostAlert`

**Example:**

```typescript
const subscription = adapter.subscribeToCostAlerts({
	thresholdUSD: 100.0,
});
```

#### `budgetAlerts`

Budget overspending alerts by domain/instance.

**Variables:**

- `domain` (optional): Filter by specific domain

**Payload:** `BudgetAlert`

### Metrics & Performance

#### `metricsUpdates`

Real-time infrastructure metrics.

**Variables:**

- `categories` (optional): Filter by metric categories
- `services` (optional): Filter by service names
- `threshold` (optional): Minimum value threshold

**Payload:** `MetricsUpdate`

Includes:

- Service performance metrics (latency, throughput)
- Resource utilization (CPU, memory, storage)
- Cost metrics per service
- Custom dimensions/tags

**Example:**

```typescript
const subscription = adapter.subscribeToMetricsUpdates({
	categories: ['performance', 'cost'],
	services: ['GRAPHQL_API', 'FEDERATION_DELIVERY'],
});
```

#### `performanceAlert`

Performance degradation alerts.

**Variables:**

- `severity`: Minimum severity level (required)

**Payload:** `PerformanceAlert`

Services:

- `GRAPHQL_API`
- `FEDERATION_DELIVERY`
- `MEDIA_PROCESSOR`
- `MODERATION_ENGINE`
- `SEARCH_INDEXER`
- `STREAMING_SERVICE`

### Federation & Infrastructure

#### `federationHealthUpdates`

Federation health status changes.

**Variables:**

- `domain` (optional): Monitor specific remote instance

**Payload:** `FederationHealthUpdate`

Statuses:

- `HEALTHY`: Operating normally
- `WARNING`: Minor issues detected
- `CRITICAL`: Major issues affecting federation
- `OFFLINE`: Instance unreachable
- `UNKNOWN`: Status cannot be determined

**Example:**

```typescript
const subscription = adapter.subscribeToFederationHealthUpdates({
	domain: 'mastodon.social',
});

subscription.subscribe({
	next: (result) => {
		const update = result.data?.federationHealthUpdates;
		if (update?.currentStatus === 'CRITICAL') {
			alertAdmins(`${update.domain} is experiencing critical issues`);
		}
	},
});
```

#### `infrastructureEvent`

Infrastructure events (deployments, failures, scaling).

**Payload:** `InfrastructureEvent`

Event types:

- `DEPLOYMENT`
- `SCALING`
- `FAILURE`
- `RECOVERY`
- `MAINTENANCE`

## Integration with Admin Streaming Store

The `AdminStreamingStore` provides a unified interface for managing all admin subscription events:

```typescript
import { createAdminStreamingStore } from '@equaltoai/greater-components-adapters';

const adminStore = createAdminStreamingStore({
	maxHistorySize: 100,
	alertSeverityThreshold: 'MEDIUM',
	enableDeduplication: true,
});

// Subscribe to events
adminStore.on('metricsUpdate', (metric) => {
	updateDashboard(metric);
});

adminStore.on('moderationAlert', (alert) => {
	if (!alert.handled) {
		notifyModerator(alert);
	}
});

adminStore.on('costAlert', (alert) => {
	sendEmailAlert(alert);
});

// Process incoming subscription updates
subscription.subscribe({
	next: (result) => {
		adminStore.processStreamingUpdate({
			type: 'metricsUpdates',
			payload: result.data?.metricsUpdates,
			stream: 'admin',
			timestamp: Date.now(),
			metadata: { source: 'lesser', apiVersion: '1.0', lastUpdated: Date.now() },
		});
	},
});
```

## Configuration Examples

### Hashtag Timeline with Real-Time Updates

```typescript
import { LesserTimelineStore } from '@equaltoai/greater-components-fediverse/lib/lesserTimelineStore';

const hashtagTimeline = new LesserTimelineStore({
	adapter: lesserAdapter,
	type: 'HASHTAG',
	hashtag: 'svelte',
	enableRealtime: true,
	maxItems: 500,
	preloadCount: 20,
});

await hashtagTimeline.loadInitial();
```

### List Timeline Monitoring

```typescript
const listTimeline = new LesserTimelineStore({
	adapter: lesserAdapter,
	type: 'LIST',
	listId: 'list_xyz789',
	enableRealtime: true,
	listFilter: {
		includeReplies: true,
		includeBoosts: false,
	},
});
```

### Multi-Hashtag Subscription

```typescript
const hashtagSub = adapter.subscribeToHashtagActivity({
	hashtags: ['fediverse', 'activitypub', 'mastodon'],
});
```

## Transport Configuration

The subscription layer integrates with the existing transport infrastructure:

```typescript
import { TransportManager } from '@equaltoai/greater-components-fediverse/lib/transport';

const transport = new TransportManager({
	adapter: lesserAdapter,
	enableRealtime: true,
});

// Subscribe to hashtag stream
transport.subscribeToHashtag(['javascript', 'typescript']);

// Subscribe to list stream
transport.subscribeToList('list_abc123');

// Subscribe to admin events
transport.subscribeToAdminEvents(['moderationAlerts', 'costAlerts', 'performanceAlert']);

// Listen for events
transport.on('moderation.alert', (alert) => {
	console.log('Moderation alert:', alert);
});

transport.on('cost.alert', (alert) => {
	console.log('Cost alert:', alert);
});
```

## Error Handling

All subscriptions should implement proper error handling:

```typescript
const subscription = adapter.subscribeToModerationAlerts({
	severity: 'HIGH',
});

subscription.subscribe({
	next: (result) => {
		if (result.errors) {
			console.error('Subscription errors:', result.errors);
			return;
		}
		handleModerationAlert(result.data?.moderationAlerts);
	},
	error: (error) => {
		console.error('Subscription error:', error);
		// Implement reconnection logic
		setTimeout(() => {
			// Resubscribe
		}, 5000);
	},
	complete: () => {
		console.log('Subscription completed');
	},
});
```

## Best Practices

1. **Filter Subscriptions**: Use variables to filter subscription data and reduce bandwidth
2. **Handle Reconnection**: Implement automatic reconnection for dropped subscriptions
3. **Deduplicate Events**: Enable deduplication in stores to avoid processing duplicate events
4. **Monitor Performance**: Track subscription latency and adjust `maxHistorySize` accordingly
5. **Severity Thresholds**: Use severity filtering to avoid alert fatigue
6. **Clean Up**: Always unsubscribe when components unmount

## See Also

- [Admin Moderation Tools](./Moderation.md)
- [Cost Management](./CostManagement.md)
- [Federation Health Monitoring](./FederationHealth.md)
- [Metrics Dashboard](./Metrics.md)
