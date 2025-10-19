# Admin.SeveredRelationships

Monitor, diagnose, and recover from broken federation connections between instances.

## Overview

The `Admin.SeveredRelationships` module helps administrators manage federation health by tracking severed connections, diagnosing failure causes, and attempting automatic recovery. When federation breaks with an instance, affected followers and following relationships are logged for potential recovery once the connection is restored.

## Components

### Admin.SeveredRelationships.Root

Context provider for severed relationship data and adapter connection.

**Props:**
- `adapter: LesserGraphQLAdapter` - GraphQL adapter instance
- `children?: Snippet` - Child components

**Usage:**

```svelte
<script lang="ts">
  import * as SeveredRelationships from '@equaltoai/greater-components-fediverse/Admin/SeveredRelationships';
  import { adapter } from './config';
</script>

<SeveredRelationships.Root {adapter}>
  <SeveredRelationships.List />
  <SeveredRelationships.RecoveryPanel />
</SeveredRelationships.Root>
```

---

### Admin.SeveredRelationships.List

Table of severed federation connections with filtering and sorting.

**Props:**
- `onSelect?: (severance: SeveredRelationship) => void` - Callback when severance selected
- `showAcknowledged?: boolean` - Show acknowledged severances (default: `false`)
- `sortBy?: 'severedAt' | 'instance' | 'affectedCount'` - Sort column (default: `'severedAt'`)
- `sortDirection?: 'asc' | 'desc'` - Sort direction (default: `'desc'`)

**Usage:**

```svelte
<script lang="ts">
  let selectedSeverance = $state(null);
</script>

<SeveredRelationships.Root {adapter}>
  <SeveredRelationships.List 
    onSelect={(severance) => selectedSeverance = severance}
    showAcknowledged={false}
    sortBy="severedAt"
    sortDirection="desc"
  />
</SeveredRelationships.Root>
```

**Table Columns:**

- **Instance**: Domain name of severed instance
- **Type**: Severance type (TIMEOUT/BLOCKED/ERROR/RATE_LIMITED/SUSPENDED)
- **Reason**: Human-readable reason for severance
- **Severed At**: Timestamp when connection broke
- **Affected**: Count of affected followers + following
- **Actions**: Acknowledge, attempt recovery, view details

---

### Admin.SeveredRelationships.RecoveryPanel

Diagnostic and recovery tools for a specific severed relationship.

**Props:**
- `severanceId: string` - ID of the severance to manage
- `onAcknowledge?: () => Promise<void>` - Acknowledge callback
- `onAttemptReconnection?: () => Promise<void>` - Reconnection attempt callback
- `reconnecting?: boolean` - Show reconnection in progress state

**Usage:**

```svelte
<script lang="ts">
  let reconnecting = $state(false);
  
  async function attemptRecovery(severanceId: string) {
    reconnecting = true;
    try {
      const result = await adapter.attemptReconnection(severanceId);
      const { success, message, newStatus } = result.data.attemptReconnection;
      
      if (success) {
        console.log('Reconnection successful:', message);
      } else {
        console.warn('Reconnection failed:', message);
      }
    } finally {
      reconnecting = false;
    }
  }
</script>

<SeveredRelationships.Root {adapter}>
  {#if selectedSeverance}
    <SeveredRelationships.RecoveryPanel 
      severanceId={selectedSeverance.id}
      onAcknowledge={() => adapter.acknowledgeSeverance(selectedSeverance.id)}
      onAttemptReconnection={() => attemptRecovery(selectedSeverance.id)}
      {reconnecting}
    />
  {/if}
</SeveredRelationships.Root>
```

**Panel Sections:**

- **Severance Details**: Instance, type, reason, timestamp
- **Impact Summary**: Affected followers/following counts
- **Diagnostic Tools**: 
  - Check instance status
  - View federation health score
  - Test connectivity
- **Recovery Actions**:
  - Acknowledge severance
  - Attempt automatic reconnection
  - Pause federation temporarily
  - Resume federation
- **Activity Log**: History of connection attempts

---

## GraphQL Operations

### Queries

```graphql
query SeveredRelationships($instance: String, $first: Int, $after: String) {
  severedRelationships(instance: $instance, first: $first, after: $after) {
    edges {
      node {
        id
        instance
        type
        reason
        severedAt
        acknowledged
        affectedFollowers
        affectedFollowing
        lastAttempt
        canRecover
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}

query FederationHealth($threshold: Float) {
  federationHealth(threshold: $threshold) {
    overallHealth
    healthyCount
    unhealthyCount
    instances {
      domain
      status
      healthScore
      lastSeen
    }
  }
}

query FederationStatus($domain: String!) {
  federationStatus(domain: $domain) {
    domain
    status
    lastSuccessfulConnection
    lastError
    consecutiveFailures
    isPaused
    pausedUntil
  }
}
```

### Mutations

```graphql
mutation AcknowledgeSeverance($id: ID!) {
  acknowledgeSeverance(id: $id) {
    id
    acknowledged
  }
}

mutation AttemptReconnection($id: ID!) {
  attemptReconnection(id: $id) {
    success
    message
    newStatus
  }
}

mutation PauseFederation($domain: String!, $reason: String!, $until: Time) {
  pauseFederation(domain: $domain, reason: $reason, until: $until) {
    domain
    isPaused
    pausedUntil
  }
}

mutation ResumeFederation($domain: String!) {
  resumeFederation(domain: $domain) {
    domain
    isPaused
  }
}
```

---

## Adapter Methods

```typescript
// Get severed relationships
const result = await adapter.getSeveredRelationships();
const severances = result.data.severedRelationships.edges.map(e => e.node);

// Acknowledge severance
await adapter.acknowledgeSeverance(severanceId);

// Attempt reconnection
const reconnection = await adapter.attemptReconnection(severanceId);
if (reconnection.data.attemptReconnection.success) {
  console.log('Reconnection successful');
}

// Check federation health
const health = await adapter.getFederationHealth(0.8);
console.log('Overall health:', health.data.federationHealth.overallHealth);

// Get specific instance status
const status = await adapter.getFederationStatus('example.social');

// Pause federation with instance
await adapter.pauseFederation(
  'problematic.instance', 
  'High error rate',
  new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
);

// Resume federation
await adapter.resumeFederation('example.social');
```

---

## Types

```typescript
interface SeveredRelationship {
  id: string;
  instance: string;
  type: SeveranceType;
  reason: string;
  severedAt: string;
  acknowledged: boolean;
  affectedFollowers: number;
  affectedFollowing: number;
  lastAttempt?: string;
  canRecover: boolean;
}

type SeveranceType = 
  | 'TIMEOUT'        // Instance not responding
  | 'BLOCKED'        // Explicitly blocked
  | 'ERROR'          // Technical failure
  | 'RATE_LIMITED'   // Too many requests
  | 'SUSPENDED';     // Instance suspended

interface FederationHealth {
  overallHealth: number;       // 0.0-1.0
  healthyCount: number;
  unhealthyCount: number;
  instances: FederationInstanceHealth[];
}

interface FederationInstanceHealth {
  domain: string;
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' | 'SEVERED';
  healthScore: number;          // 0.0-1.0
  lastSeen: string;
}

interface FederationStatus {
  domain: string;
  status: 'CONNECTED' | 'DEGRADED' | 'DISCONNECTED';
  lastSuccessfulConnection?: string;
  lastError?: string;
  consecutiveFailures: number;
  isPaused: boolean;
  pausedUntil?: string;
}

interface ReconnectionResult {
  success: boolean;
  message: string;
  newStatus: 'CONNECTED' | 'DEGRADED' | 'DISCONNECTED';
}
```

---

## Severance Types

### TIMEOUT
Instance is not responding to requests within timeout period.

**Common Causes:**
- Instance is down for maintenance
- Network connectivity issues
- Server overload

**Recovery Strategy:**
- Wait for instance to come back online
- Attempt automatic reconnection periodically
- Check instance status page

### BLOCKED
Federation explicitly blocked by admin action.

**Common Causes:**
- Policy violation
- Spam or abuse
- Manual admin decision

**Recovery Strategy:**
- Contact instance administrator
- Resolve policy issues
- Unblock and resume federation

### ERROR
Technical error during federation operations.

**Common Causes:**
- Protocol incompatibility
- Malformed ActivityPub objects
- Certificate issues

**Recovery Strategy:**
- Check error logs
- Update server software
- Fix technical issues
- Retry connection

### RATE_LIMITED
Too many requests sent to instance.

**Common Causes:**
- Exceeded rate limits
- Burst traffic
- Misconfigured retry logic

**Recovery Strategy:**
- Reduce request rate
- Implement backoff
- Wait for rate limit reset

### SUSPENDED
Instance account suspended or removed.

**Common Causes:**
- Terms of service violation
- Instance shutdown
- Domain change

**Recovery Strategy:**
- Verify instance status
- Contact administrator
- Update instance records

---

## Federation Health Monitoring

### Health Score Calculation

Health scores (0.0-1.0) are calculated based on:
- **Uptime**: Percentage of successful connections
- **Response Time**: Average response latency
- **Error Rate**: Frequency of errors
- **Data Quality**: Valid ActivityPub responses

### Health Status Levels

| Score | Status | Description |
|-------|--------|-------------|
| 0.8-1.0 | HEALTHY | Normal operation |
| 0.5-0.8 | DEGRADED | Some issues, monitoring |
| 0.0-0.5 | UNHEALTHY | Significant problems |
| N/A | SEVERED | Connection broken |

### Automatic Actions

Configure automatic responses to health degradation:

```typescript
// Example health monitoring
adapter.subscribeToFederationHealthUpdates({
  threshold: 0.5
}).subscribe(update => {
  if (update.healthScore < 0.3) {
    // Pause federation automatically
    adapter.pauseFederation(
      update.domain,
      'Health score below threshold',
      new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
    );
  }
});
```

---

## Recovery Strategies

### Automatic Recovery

The system attempts automatic recovery for TIMEOUT and RATE_LIMITED severances:

1. Wait for cooldown period (exponential backoff)
2. Test connectivity
3. Verify ActivityPub compatibility
4. Resume federation if successful

### Manual Recovery

For BLOCKED, ERROR, and SUSPENDED severances:

1. Investigate root cause
2. Resolve underlying issue
3. Contact remote instance admin if needed
4. Manually attempt reconnection
5. Monitor connection health

### Partial Recovery

If full recovery fails:

1. Recover critical relationships (mutuals)
2. Set rate limits for gradual recovery
3. Monitor impact on affected users
4. Document persistent issues

---

## Impact on Users

When federation severs:

- **Affected Followers**: Remote users following your instance accounts
- **Affected Following**: Your instance users following remote accounts
- **Content Visibility**: Posts from severed instance no longer appear
- **Interaction Loss**: Can't like, boost, or reply to severed instance posts

### User Communication

Inform users when major severances occur:

```svelte
<script lang="ts">
  import { notificationStore } from './stores';
  
  function notifyUsers(severance: SeveredRelationship) {
    if (severance.affectedFollowers + severance.affectedFollowing > 100) {
      notificationStore.add({
        type: 'federation_severance',
        title: `Federation issue with ${severance.instance}`,
        message: `Connection to ${severance.instance} is temporarily unavailable. Affected ${severance.affectedFollowers + severance.affectedFollowing} relationships.`,
        severity: 'warning'
      });
    }
  }
</script>
```

---

## Real-time Updates

Monitor federation health in real-time:

```typescript
adapter.subscribeToFederationHealthUpdates({
  threshold: 0.8
}).subscribe(update => {
  console.log('Instance:', update.domain);
  console.log('Health score:', update.healthScore);
  console.log('Status:', update.status);
  
  if (update.status === 'SEVERED') {
    handleNewSeverance(update.domain);
  }
});
```

---

## Best Practices

1. **Monitor Proactively**: Check federation health regularly
2. **Acknowledge Promptly**: Acknowledge severances to track investigation
3. **Document Issues**: Keep notes on recurring problems
4. **Communicate**: Inform users of significant federation issues
5. **Set Budgets**: Use cost controls to prevent runaway federation expenses
6. **Automate Recovery**: Enable automatic reconnection for transient failures
7. **Test Regularly**: Periodically test federation health
8. **Maintain Contacts**: Keep admin contact info for federated instances

---

## Accessibility

- All severance statuses have text labels and ARIA attributes
- Color coding supplemented with icons
- Keyboard navigation for all controls
- Screen reader announcements for status changes
- Loading states for async operations

---

## Related Components

- [Admin.Cost](./Cost.md) - Federation costs impact budgets
- [Admin.Federation](./Federation.md) - General federation management
- [Admin.Overview](./Overview.md) - Instance health dashboard

---

## See Also

- [Lesser Integration Guide](../../lesser-integration-guide.md#severed-relationships)
- [Federation Best Practices](../../federation-best-practices.md)
- [ActivityPub Specification](https://www.w3.org/TR/activitypub/)

