# Admin.Insights

AI-powered content analysis and moderation analytics for Lesser instances.

## Overview

The `Admin.Insights` module provides comprehensive AI analysis capabilities including toxicity detection, sentiment analysis, spam classification, NSFW content detection, and AI-generated content identification. It also includes moderation analytics dashboards for tracking moderation actions over time.

## Components

### Admin.Insights.Root

Context provider that manages adapter connection and shared state.

**Props:**
- `adapter: LesserGraphQLAdapter` - GraphQL adapter instance
- `children?: Snippet` - Child components

**Usage:**

```svelte
<script lang="ts">
  import * as Insights from '@equaltoai/greater-components-fediverse/Admin/Insights';
  import { adapter } from './config';
</script>

<Insights.Root {adapter}>
  <Insights.AIAnalysis objectId={statusId} />
  <Insights.ModerationAnalytics />
</Insights.Root>
```

---

### Admin.Insights.AIAnalysis

Displays detailed AI analysis results for a specific object (status, account, etc.).

**Props:**
- `objectId: string` - ID of object to analyze
- `autoRequest?: boolean` - Automatically request analysis on mount (default: `false`)
- `showTextAnalysis?: boolean` - Show text analysis section (default: `true`)
- `showImageAnalysis?: boolean` - Show image analysis section (default: `true`)
- `showAIDetection?: boolean` - Show AI detection section (default: `true`)
- `showSpamAnalysis?: boolean` - Show spam analysis section (default: `true`)

**Usage:**

```svelte
<Insights.Root {adapter}>
  <Insights.AIAnalysis 
    objectId="status_abc123"
    autoRequest={true}
    showTextAnalysis={true}
    showImageAnalysis={true}
    showAIDetection={true}
    showSpamAnalysis={true}
  />
</Insights.Root>
```

**Analysis Output:**

The component displays:

- **Overall Risk Meter**: Color-coded risk level (green/yellow/orange/red)
- **Text Analysis**: Sentiment, toxicity score, profanity flag, PII detection
- **Image Analysis**: NSFW score, violence score, deepfake detection
- **AI Detection**: Probability content is AI-generated, detected model
- **Spam Analysis**: Spam classification and confidence level
- **Moderation Action**: Recommended action (NONE/FLAG/HIDE/REMOVE)
- **Confidence**: Analysis confidence score
- **Analyzed At**: Timestamp of analysis

---

### Admin.Insights.ModerationAnalytics

Dashboard showing moderation statistics over a selected time period.

**Props:**
- `period?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'` - Time period (default: `'DAY'`)
- `showActionBreakdown?: boolean` - Show breakdown by action type (default: `true`)

**Usage:**

```svelte
<script lang="ts">
  let selectedPeriod = $state('WEEK');
</script>

<Insights.Root {adapter}>
  <select bind:value={selectedPeriod}>
    <option value="HOUR">Last Hour</option>
    <option value="DAY">Last 24 Hours</option>
    <option value="WEEK">Last 7 Days</option>
    <option value="MONTH">This Month</option>
    <option value="YEAR">This Year</option>
  </select>
  
  <Insights.ModerationAnalytics 
    period={selectedPeriod}
    showActionBreakdown={true}
  />
</Insights.Root>
```

**Metrics Displayed:**

- **Total Actions**: Count of all moderation actions
- **Action Breakdown**: Counts by type (FLAG/HIDE/REMOVE/APPROVE)
- **Top Moderators**: Most active moderators
- **Moderation Trends**: Time-series chart of actions

---

## GraphQL Operations

### Queries

```graphql
query AIAnalysis($objectId: ID!) {
  aiAnalysis(objectId: $objectId) {
    textAnalysis { sentiment, toxicity, profanity, piiDetected }
    imageAnalysis { nsfw, violence, deepfake }
    aiDetection { aiGeneratedProbability, model }
    spamAnalysis { isSpam, confidence }
    overallRisk
    moderationAction
    confidence
    analyzedAt
  }
}

query AIStats($period: Period!) {
  aiStats(period: $period) {
    totalAnalyses
    actionBreakdown { action, count }
    averageConfidence
    topModerators { actorId, displayName, actionCount }
  }
}

query AICapabilities {
  aiCapabilities {
    textAnalysis
    imageAnalysis
    aiDetection
    spamDetection
    supportedModels
  }
}
```

### Mutations

```graphql
mutation RequestAIAnalysis($objectId: ID!, $objectType: String, $force: Boolean) {
  requestAIAnalysis(objectId: $objectId, objectType: $objectType, force: $force) {
    id
    status
  }
}
```

---

## Adapter Methods

```typescript
// Request AI analysis
await adapter.requestAIAnalysis(objectId, 'NOTE', false);

// Get analysis results
const result = await adapter.getAIAnalysis(objectId);
const analysis = result.data.aiAnalysis;

// Get moderation statistics
const stats = await adapter.getAIStats('WEEK');

// Get AI capabilities
const capabilities = await adapter.getAICapabilities();
```

---

## Real-time Updates

Subscribe to moderation events in real-time:

```typescript
adapter.subscribeToModerationEvents().subscribe(event => {
  console.log('Moderation action:', event.action);
  console.log('Target:', event.targetId);
  console.log('Reason:', event.reason);
  console.log('Actor:', event.actorId);
});

adapter.subscribeToAiAnalysisUpdates({
  objectIds: [statusId]
}).subscribe(update => {
  console.log('Analysis updated:', update.objectId);
  console.log('New risk level:', update.overallRisk);
});
```

---

## Types

```typescript
interface AIAnalysis {
  textAnalysis?: {
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';
    toxicity: number;           // 0.0-1.0
    profanity: boolean;
    piiDetected: boolean;
  };
  imageAnalysis?: {
    nsfw: number;               // 0.0-1.0
    violence: number;           // 0.0-1.0
    deepfake: number;           // 0.0-1.0
  };
  aiDetection?: {
    aiGeneratedProbability: number;  // 0.0-1.0
    model?: string;
  };
  spamAnalysis?: {
    isSpam: boolean;
    confidence: number;         // 0.0-1.0
  };
  overallRisk: number;          // 0.0-1.0
  moderationAction: 'NONE' | 'FLAG' | 'HIDE' | 'REMOVE';
  confidence: number;           // 0.0-1.0
  analyzedAt: string;
}

interface AIStats {
  period: Period;
  totalAnalyses: number;
  actionBreakdown: Array<{ action: string; count: number }>;
  averageConfidence: number;
  topModerators: Array<{
    actorId: string;
    displayName: string;
    actionCount: number;
  }>;
}
```

---

## Configuration

### Analysis Thresholds

Configure automatic moderation based on analysis scores:

```typescript
await adapter.createModerationPattern({
  name: 'High Toxicity Auto-Flag',
  conditions: {
    toxicity: { min: 0.8 }
  },
  action: 'FLAG',
  severity: 'HIGH'
});

await adapter.createModerationPattern({
  name: 'NSFW Content Auto-Hide',
  conditions: {
    nsfw: { min: 0.9 }
  },
  action: 'HIDE',
  severity: 'MEDIUM'
});
```

### Rate Limiting

Implement rate limiting to control AI analysis costs:

```typescript
const rateLimiter = {
  maxRequestsPerHour: 1000,
  maxRequestsPerUser: 10,
  cooldownMinutes: 5
};

// Check before requesting
if (canRequestAnalysis(objectId, rateLimiter)) {
  await adapter.requestAIAnalysis(objectId);
}
```

---

## Best Practices

1. **Cost Control**: AI analysis can be expensive. Use `autoRequest={false}` and require manual trigger for non-critical content.

2. **Caching**: Analysis results are cached on the server. Use `force: false` (default) to avoid redundant analyses.

3. **Selective Analysis**: Only request analysis for content that requires it (flagged posts, new users, high-risk patterns).

4. **Threshold Tuning**: Start with conservative thresholds (0.8+) and adjust based on false positive rates.

5. **Manual Review**: Always provide manual review options for auto-moderated content. AI is not perfect.

6. **Privacy**: Ensure users are aware that content may be analyzed. Include in terms of service.

7. **Appeals**: Implement an appeals process for content moderated based on AI analysis.

---

## Accessibility

- All risk meters include `aria-label` with numerical values
- Color coding supplemented with text labels
- Keyboard navigation for interactive elements
- Screen reader announcements for analysis status changes

---

## Related Components

- [Admin.Moderation](./Moderation.md) - Manual moderation tools
- [Status.LesserMetadata](../Status/README.md#lessermetadata) - Inline moderation warnings
- [ModerationTools](../../patterns/ModerationTools.md) - Pattern-based moderation

---

## See Also

- [Lesser Integration Guide](../../lesser-integration-guide.md#ai-insights--moderation-analytics)
- [Admin.Cost](./Cost.md) - Cost tracking for AI analysis requests
- [GraphQL Schema Reference](../../../schemas/lesser/schema.graphql)

