# Admin.Cost

Real-time cost tracking, budget management, and federation optimization for Lesser instances running on AWS.

## Overview

The `Admin.Cost` module provides comprehensive AWS cost analytics for Lesser instances. Track spending across DynamoDB, S3, Lambda, and Data Transfer services, set budget limits per federated instance, receive real-time alerts, and optimize federation costs automatically.

## Components

### Admin.Cost.Root

Context provider for cost data and adapter connection.

**Props:**
- `adapter: LesserGraphQLAdapter` - GraphQL adapter instance
- `children?: Snippet` - Child components

**Usage:**

```svelte
<script lang="ts">
  import * as Cost from '@greater/fediverse/Admin/Cost';
  import { adapter } from './config';
</script>

<Cost.Root {adapter}>
  <Cost.Dashboard />
  <Cost.BudgetControls />
  <Cost.Alerts />
</Cost.Root>
```

---

### Admin.Cost.Dashboard

Main cost visualization showing breakdowns by service, time period, and operation.

**Props:**
- `period?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'` - Time period (default: `'DAY'`)
- `showServiceBreakdown?: boolean` - Show costs by service (default: `true`)
- `showOperationBreakdown?: boolean` - Show costs by operation (default: `true`)
- `showTrends?: boolean` - Show trend chart (default: `true`)

**Usage:**

```svelte
<script lang="ts">
  let period = $state('MONTH');
</script>

<Cost.Root {adapter}>
  <select bind:value={period}>
    <option value="HOUR">Last Hour</option>
    <option value="DAY">Last 24 Hours</option>
    <option value="WEEK">Last 7 Days</option>
    <option value="MONTH">This Month</option>
    <option value="YEAR">This Year</option>
  </select>
  
  <Cost.Dashboard 
    {period}
    showServiceBreakdown={true}
    showOperationBreakdown={true}
    showTrends={true}
  />
</Cost.Root>
```

**Metrics Displayed:**

- **Total Cost**: Aggregate cost for selected period (in USD)
- **Service Breakdown**: Costs by AWS service
  - DynamoDB: Database operations
  - S3: Media storage
  - Lambda: Serverless compute
  - Data Transfer: Network egress
- **Operation Breakdown**: Costs by operation type
  - Read/Write operations
  - Storage costs
  - Compute time
  - Network transfer
- **Trend Chart**: Cost over time visualization

---

### Admin.Cost.BudgetControls

Budget management interface for setting limits and configuring automatic actions.

**Props:**
- `onSetBudget?: (domain: string, monthlyUSD: number) => Promise<void>` - Budget set callback
- `onOptimize?: () => Promise<void>` - Optimization trigger callback

**Usage:**

```svelte
<script lang="ts">
  async function setBudget(domain: string, monthlyUSD: number) {
    await adapter.setInstanceBudget(domain, monthlyUSD, true);
    console.log(`Budget set for ${domain}: $${monthlyUSD}/month`);
  }
  
  async function triggerOptimization() {
    const result = await adapter.optimizeFederationCosts(0.75);
    const suggestions = result.data.optimizeFederationCosts;
    console.log('Optimization suggestions:', suggestions);
  }
</script>

<Cost.Root {adapter}>
  <Cost.BudgetControls 
    onSetBudget={setBudget}
    onOptimize={triggerOptimization}
  />
</Cost.Root>
```

**Features:**

- **Instance Budget Table**: List of federated instances with budget limits
- **Budget Editor**: Set monthly budget per instance
- **Auto-Limit Toggle**: Enable automatic rate limiting at budget threshold
- **Optimize Button**: Trigger cost optimization analysis
- **Budget Alerts**: Configure alert thresholds (50%, 75%, 90%, 100%)

---

### Admin.Cost.Alerts

Real-time cost alert display and management.

**Props:**
- `threshold?: number` - Alert severity threshold 0.0-1.0 (default: `0.9`)
- `showAcknowledged?: boolean` - Show acknowledged alerts (default: `false`)

**Usage:**

```svelte
<script lang="ts">
  import { adminStreamingStore } from './config';
  
  // Get unhandled alerts from streaming store
  const costAlerts = $derived(adminStreamingStore.getUnhandledCostAlerts());
</script>

<Cost.Root {adapter}>
  <Cost.Alerts 
    threshold={0.9}
    showAcknowledged={false}
  />
</Cost.Root>
```

**Alert Types:**

- **Budget Threshold**: Budget usage reached X%
- **Cost Spike**: Unusual cost increase detected
- **Service Anomaly**: Specific service costs elevated
- **Daily Limit**: Daily cost cap reached

---

## GraphQL Operations

### Queries

```graphql
query CostBreakdown($period: Period) {
  costBreakdown(period: $period) {
    period
    totalCost
    services {
      service
      cost
      operations {
        operation
        cost
        count
      }
    }
    trends {
      timestamp
      cost
    }
  }
}

query InstanceBudgets {
  instanceBudgets {
    domain
    monthlyLimit
    currentSpend
    autoLimit
    lastReset
  }
}

query FederationLimits {
  federationLimits {
    domain
    maxRequestsPerHour
    currentRequests
    priority
  }
}
```

### Mutations

```graphql
mutation SetInstanceBudget($domain: String!, $monthlyUSD: Float!, $autoLimit: Boolean) {
  setInstanceBudget(domain: $domain, monthlyUSD: $monthlyUSD, autoLimit: $autoLimit) {
    domain
    monthlyLimit
    autoLimit
  }
}

mutation OptimizeFederationCosts($threshold: Float!) {
  optimizeFederationCosts(threshold: $threshold) {
    estimatedSavings
    rateLimitChanges {
      domain
      currentLimit
      newLimit
      estimatedImpact
    }
    storageOptimizations {
      suggestion
      estimatedSavings
    }
  }
}

mutation SetFederationLimit($domain: String!, $limit: FederationLimitInput!) {
  setFederationLimit(domain: $domain, limit: $limit) {
    domain
    maxRequestsPerHour
    priority
  }
}
```

---

## Adapter Methods

```typescript
// Get cost breakdown
const result = await adapter.getCostBreakdown('MONTH');
const breakdown = result.data.costBreakdown;

// Get instance budgets
const budgets = await adapter.getInstanceBudgets();

// Set budget for instance
await adapter.setInstanceBudget('example.social', 50.00, true);

// Optimize costs
const optimization = await adapter.optimizeFederationCosts(0.75);

// Get federation limits
const limits = await adapter.getFederationLimits();

// Set rate limit
await adapter.setFederationLimit('example.social', {
  maxRequestsPerHour: 1000,
  priority: 'NORMAL'
});
```

---

## Types

```typescript
interface CostBreakdown {
  period: Period;
  totalCost: number;              // USD
  services: ServiceCost[];
  trends: CostTrend[];
}

interface ServiceCost {
  service: 'DynamoDB' | 'S3' | 'Lambda' | 'DataTransfer';
  cost: number;                   // USD
  operations: OperationCost[];
}

interface OperationCost {
  operation: string;
  cost: number;                   // USD
  count: number;
}

interface CostTrend {
  timestamp: string;
  cost: number;                   // USD
}

interface InstanceBudget {
  domain: string;
  monthlyLimit: number;           // USD
  currentSpend: number;           // USD
  autoLimit: boolean;             // Auto rate-limit at threshold
  lastReset: string;
}

interface FederationLimit {
  domain: string;
  maxRequestsPerHour: number;
  currentRequests: number;
  priority: 'LOW' | 'NORMAL' | 'HIGH';
}
```

---

## Real-time Updates

Subscribe to cost updates and alerts:

```typescript
// Cost updates subscription
adapter.subscribeToCostUpdates().subscribe(update => {
  console.log('Service:', update.service);
  console.log('Amount (microcents):', update.amount);
  console.log('Period:', update.period);
});

// Budget alerts subscription
adapter.subscribeToBudgetAlerts({
  threshold: 0.9  // Alert at 90% budget
}).subscribe(alert => {
  console.log('Budget alert for:', alert.domain);
  console.log('Current spend:', alert.currentSpend);
  console.log('Limit:', alert.limit);
  console.log('Percentage:', alert.percentage);
  
  // Show notification
  showNotification(`Budget alert: ${alert.domain} at ${alert.percentage}%`);
});
```

---

## Cost Optimization

### Automatic Optimization

The `OptimizeFederationCosts` mutation analyzes spending patterns and suggests optimizations:

```typescript
const result = await adapter.optimizeFederationCosts(0.75); // 75% efficiency target
const suggestions = result.data.optimizeFederationCosts;

console.log('Estimated monthly savings:', suggestions.estimatedSavings);

// Apply rate limit suggestions
for (const change of suggestions.rateLimitChanges) {
  console.log(`${change.domain}: ${change.currentLimit} → ${change.newLimit} req/hr`);
  console.log(`Impact: $${change.estimatedImpact}/month saved`);
  
  // Apply if acceptable
  if (change.estimatedImpact > 10) {
    await adapter.setFederationLimit(change.domain, {
      maxRequestsPerHour: change.newLimit,
      priority: 'NORMAL'
    });
  }
}

// Review storage suggestions
for (const optimization of suggestions.storageOptimizations) {
  console.log(optimization.suggestion);
  console.log(`Potential savings: $${optimization.estimatedSavings}/month`);
}
```

### Manual Optimization Strategies

1. **Rate Limiting**: Reduce request rates to high-cost instances
2. **Media Caching**: Cache media locally to reduce S3 reads
3. **Batch Operations**: Combine DynamoDB operations where possible
4. **Archive Old Media**: Move old media to cheaper storage tiers
5. **Selective Federation**: Pause federation with inactive instances

---

## Per-Post Cost Display

Show estimated cost for individual posts:

```svelte
<script lang="ts">
  import * as Status from '@greater/fediverse/Status';
</script>

<Status.Root {status}>
  <Status.Header />
  <Status.Content />
  <Status.LesserMetadata 
    showCost={true}
    costFormat="USD"
    costDecimals={4}
  />
</Status.Root>
```

The `LesserMetadata` component displays post costs in microcents (μ¢), formatted as USD:
- Storage: Media attachment costs
- Processing: AI analysis, moderation
- Federation: Delivery to remote instances
- Total: Sum of all costs

---

## Best Practices

1. **Set Budgets Early**: Configure budgets before costs become problematic
2. **Enable Auto-Limit**: Automatic rate limiting prevents budget overruns
3. **Monitor Trends**: Watch for cost spikes and investigate causes
4. **Regular Optimization**: Run optimization analysis monthly
5. **Document Changes**: Track rate limit changes and their impact
6. **Balance Cost vs. UX**: Don't over-optimize at the expense of user experience
7. **Plan for Growth**: Budget should account for user/content growth

---

## Accessibility

- All cost amounts include currency symbols and `aria-label` with full amounts
- Budget alerts have appropriate ARIA roles and live regions
- Color coding supplemented with text labels
- Keyboard navigation for all interactive controls
- Screen reader announcements for alert updates

---

## Performance Considerations

- Cost data refreshes every 5 minutes (configurable)
- Trend charts limited to 100 data points for rendering performance
- Streaming updates batched to prevent UI thrashing
- Budget calculations cached on server side

---

## Related Components

- [Admin.SeveredRelationships](./SeveredRelationships.md) - Federation health impacts costs
- [Admin.Insights](./Insights.md) - AI analysis cost tracking
- [Status.LesserMetadata](../Status/README.md#lessermetadata) - Per-post cost display

---

## See Also

- [Lesser Integration Guide](../../lesser-integration-guide.md#cost-dashboards)
- [AWS Cost Optimization](https://aws.amazon.com/aws-cost-management/)
- [Federation Rate Limiting](../../federation-rate-limiting.md)

