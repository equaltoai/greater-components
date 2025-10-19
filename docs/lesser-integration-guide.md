# Lesser Integration Guide

**Using Greater Components in the Lesser Native Client**

This guide covers how to use Greater Components in the Lesser native web client, with examples demonstrating real-world ActivityPub/Fediverse use cases.

## Overview

Greater Components is being developed hand-in-hand with Lesser, ensuring every component is battle-tested in a real production ActivityPub environment before external release. This "dogfooding" approach guarantees that all components handle federation edge cases, real-time updates, and complex social interactions.

## Installation

Since Greater Components and Lesser are in the same monorepo workspace, components are available via workspace dependencies:

```json
{
  "dependencies": {
    "@equaltoai/greater-components-headless": "workspace:*",
    "@equaltoai/greater-components-primitives": "workspace:*",
    "@equaltoai/greater-components-fediverse": "workspace:*",
    "@equaltoai/greater-components-adapters": "workspace:*",
    "@equaltoai/greater-components-tokens": "workspace:*",
    "@equaltoai/greater-components-icons": "workspace:*"
  }
}
```

## Headless Components in Lesser

### Example: Custom Post Action Button

Using the headless button for a "Boost" action with Lesser's styling:

```svelte
<script lang="ts">
  import { createButton } from '@equaltoai/greater-components-headless/button';
  import { BoostIcon } from '@equaltoai/greater-components-icons';
  import type { Status } from '@equaltoai/greater-components-fediverse';
  
  interface Props {
    status: Status;
    onBoost: (status: Status) => Promise<void>;
  }
  
  let { status, onBoost }: Props = $props();
  
  // Create headless button with Lesser-specific logic
  const boostButton = createButton({
    type: 'button',
    loading: false,
    pressed: status.reblogged, // Toggle state for boosted posts
    onClick: async () => {
      boostButton.helpers.setLoading(true);
      try {
        await onBoost(status);
        // Toggle pressed state on success
        boostButton.helpers.setPressed(!boostButton.state.pressed);
      } catch (error) {
        console.error('Boost failed:', error);
      } finally {
        boostButton.helpers.setLoading(false);
      }
    }
  });
</script>

<!-- Lesser's custom styling -->
<button 
  use:boostButton.actions.button
  class="action-button"
  class:boosted={boostButton.state.pressed}
  class:loading={boostButton.state.loading}
  aria-label="{boostButton.state.pressed ? 'Undo boost' : 'Boost this post'}"
>
  <BoostIcon 
    class="action-icon" 
    active={boostButton.state.pressed}
  />
  
  {#if boostButton.state.loading}
    <span class="loading-spinner"></span>
  {/if}
  
  <span class="action-count">
    {status.reblogsCount}
  </span>
</button>

<style>
  .action-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: transparent;
    border: none;
    border-radius: var(--lesser-radius-md);
    cursor: pointer;
    transition: all 150ms;
  }
  
  .action-button:hover {
    background: var(--lesser-color-boost-hover);
  }
  
  .action-button.boosted {
    color: var(--lesser-color-boost-active);
  }
  
  .action-button:disabled,
  .action-button.loading {
    opacity: 0.6;
    cursor: wait;
  }
  
  .action-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .loading-spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
```

### Example: Post Composer Submit Button

Using the headless button for the post composer with validation:

```svelte
<script lang="ts">
  import { createButton } from '@equaltoai/greater-components-headless/button';
  import type { ComposeBoxDraft } from '@equaltoai/greater-components-fediverse';
  
  interface Props {
    draft: ComposeBoxDraft;
    onSubmit: (draft: ComposeBoxDraft) => Promise<void>;
  }
  
  let { draft, onSubmit }: Props = $props();
  
  // Validation logic
  const canSubmit = $derived(
    draft.content.trim().length > 0 && 
    draft.content.length <= 500
  );
  
  const submitButton = createButton({
    type: 'submit',
    disabled: !canSubmit,
    onClick: async () => {
      if (!canSubmit) return;
      
      submitButton.helpers.setLoading(true);
      try {
        await onSubmit(draft);
        // Success - reset handled by parent
      } catch (error) {
        console.error('Post failed:', error);
        // Show error UI
      } finally {
        submitButton.helpers.setLoading(false);
      }
    }
  });
</script>

<button 
  use:submitButton.actions.button
  class="submit-button"
  class:disabled={!canSubmit}
>
  {#if submitButton.state.loading}
    Posting...
  {:else}
    Post to Federation
  {/if}
</button>

<style>
  .submit-button {
    padding: 0.75rem 1.5rem;
    background: var(--lesser-color-primary);
    color: white;
    border: none;
    border-radius: var(--lesser-radius-lg);
    font-weight: 600;
    cursor: pointer;
    transition: all 150ms;
  }
  
  .submit-button:hover:not(.disabled) {
    background: var(--lesser-color-primary-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .submit-button.disabled {
    background: var(--lesser-color-gray-300);
    color: var(--lesser-color-gray-600);
    cursor: not-allowed;
  }
</style>
```

## Using Fediverse Components

### Timeline Integration

Using Greater's virtualized timeline in Lesser:

```svelte
<script lang="ts">
  import { TimelineVirtualized } from '@equaltoai/greater-components-fediverse';
  import { createTimelineStore } from '@equaltoai/greater-components-adapters';
  import type { Status } from '@equaltoai/greater-components-fediverse';
  
  // Create timeline store with Lesser's API endpoint
  const timeline = createTimelineStore({
    endpoint: '/api/v1/timelines/home',
    transport: 'websocket', // Real-time updates
  });
  
  async function handleBoost(status: Status) {
    await fetch(`/api/v1/statuses/${status.id}/reblog`, {
      method: 'POST'
    });
  }
  
  async function handleFavorite(status: Status) {
    await fetch(`/api/v1/statuses/${status.id}/favourite`, {
      method: 'POST'
    });
  }
</script>

<TimelineVirtualized
  items={$timeline.items}
  loading={$timeline.loading}
  onLoadMore={() => timeline.loadMore()}
  onBoost={handleBoost}
  onFavorite={handleFavorite}
  density="comfortable"
  class="lesser-timeline"
/>

<style>
  :global(.lesser-timeline) {
    height: 100vh;
    background: var(--lesser-bg-primary);
  }
  
  :global(.lesser-timeline .status-card) {
    border-bottom: 1px solid var(--lesser-border-color);
  }
</style>
```

## Design Token Integration

Lesser uses Greater's design token system with custom values:

```css
/* lesser/src/styles/tokens.css */

/* Override Greater tokens with Lesser brand */
:root {
  /* Brand colors */
  --gr-color-primary-600: #8b5cf6;  /* Lesser purple */
  --gr-color-primary-700: #7c3aed;
  
  /* Lesser-specific tokens */
  --lesser-color-boost-hover: rgba(139, 92, 246, 0.1);
  --lesser-color-boost-active: #8b5cf6;
  --lesser-color-favorite-hover: rgba(239, 68, 68, 0.1);
  --lesser-color-favorite-active: #ef4444;
  
  /* Typography */
  --gr-typography-fontFamily-sans: 'Inter', system-ui, sans-serif;
  
  /* Spacing (more compact for social feed) */
  --lesser-feed-spacing: 1rem;
  --lesser-card-padding: 1.25rem;
  
  /* Radii */
  --lesser-radius-sm: 0.375rem;
  --lesser-radius-md: 0.5rem;
  --lesser-radius-lg: 0.75rem;
}

/* Dark theme (Lesser default) */
[data-theme="dark"] {
  --lesser-bg-primary: #1a1a2e;
  --lesser-bg-secondary: #16213e;
  --lesser-border-color: #2d3748;
  --lesser-text-primary: #f7fafc;
  --lesser-text-secondary: #a0aec0;
}
```

## Adapter Integration

Using Greater's adapters with Lesser's GraphQL API:

```typescript
// lesser/src/lib/api/client.ts

import { 
  createTimelineStore,
  createNotificationStore,
  TransportManager 
} from '@equaltoai/greater-components-adapters';

// Create transport manager for Lesser API
export const transport = new TransportManager({
  baseUrl: import.meta.env.VITE_API_URL,
  adapter: 'lesser', // Uses Lesser's GraphQL schema
  websocket: {
    url: import.meta.env.VITE_WS_URL,
    reconnect: true,
    heartbeat: 30000
  }
});

// Timeline store with Lesser types
export const homeTimeline = createTimelineStore({
  transport,
  timeline: 'home',
  limit: 40,
  realtime: true
});

// Notifications with Lesser-specific types
export const notifications = createNotificationStore({
  transport,
  grouped: true,
  realtime: true
});
```

## Testing in Lesser Context

### Unit Testing with Federation Scenarios

```typescript
// lesser/tests/components/BoostButton.test.ts

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@equaltoai/greater-components-testing';
import { createButton } from '@equaltoai/greater-components-headless/button';
import BoostButton from '$lib/components/BoostButton.svelte';

describe('BoostButton in Lesser', () => {
  it('handles boost action with optimistic update', async () => {
    const mockStatus = {
      id: '123',
      reblogged: false,
      reblogsCount: 5
    };
    
    const onBoost = vi.fn().mockResolvedValue(undefined);
    
    const { getByRole } = render(BoostButton, {
      props: { status: mockStatus, onBoost }
    });
    
    const button = getByRole('button', { name: /boost this post/i });
    
    // Click boost
    await fireEvent.click(button);
    
    // Should show loading state
    expect(button).toHaveAttribute('aria-busy', 'true');
    
    // Wait for async operation
    await vi.waitFor(() => {
      expect(onBoost).toHaveBeenCalledWith(mockStatus);
    });
    
    // Should update pressed state
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });
  
  it('handles federation errors gracefully', async () => {
    const mockStatus = {
      id: '123',
      reblogged: false,
      reblogsCount: 5
    };
    
    const onBoost = vi.fn().mockRejectedValue(
      new Error('Federation timeout')
    );
    
    const { getByRole } = render(BoostButton, {
      props: { status: mockStatus, onBoost }
    });
    
    const button = getByRole('button');
    await fireEvent.click(button);
    
    // Should not change pressed state on error
    await vi.waitFor(() => {
      expect(button).toHaveAttribute('aria-pressed', 'false');
      expect(button).not.toHaveAttribute('aria-busy');
    });
  });
});
```

## Best Practices

### 1. Always Use Semantic HTML

The headless components provide behavior - you provide semantic markup:

```svelte
<!-- Good: Semantic, accessible -->
<button use:button.actions.button>
  <BoostIcon /> Boost
</button>

<!-- Bad: Non-semantic -->
<div use:button.actions.button>
  <BoostIcon /> Boost
</div>
```

### 2. Handle Loading States

Always show loading feedback during async operations:

```svelte
{#if button.state.loading}
  <LoadingSpinner />
{:else}
  <ActionIcon />
{/if}
```

### 3. Provide Meaningful ARIA Labels

Especially for icon-only buttons:

```svelte
<button 
  use:button.actions.button
  aria-label="Boost post by {status.account.displayName}"
>
  <BoostIcon />
</button>
```

### 4. Use TypeScript Generics for ActivityPub

```typescript
import type { Status, Account } from '@equaltoai/greater-components-fediverse';

interface ActionButtonProps<T extends Status> {
  item: T;
  onAction: (item: T) => Promise<void>;
}
```

### 5. Test with Real Federation Scenarios

```typescript
describe('Federation edge cases', () => {
  it('handles remote instance timeouts');
  it('shows pending state for delayed federation');
  it('handles duplicate boost attempts');
  it('gracefully degrades when websocket fails');
});
```

## Performance Optimization

### Tree-Shaking

Import only what you need:

```typescript
// Good: Tree-shakeable
import { createButton } from '@equaltoai/greater-components-headless/button';

// Less optimal: Imports everything
import { createButton } from '@equaltoai/greater-components-headless';
```

### Lazy Loading Heavy Components

```svelte
<script>
  // Lazy load timeline for route
  const TimelineVirtualized = lazy(() => 
    import('@equaltoai/greater-components-fediverse/TimelineVirtualized')
  );
</script>

{#await TimelineVirtualized then Component}
  <Component {...props} />
{/await}
```

## Feedback Loop

Since Lesser is the primary validation environment for Greater Components:

1. **Report issues immediately** - File in greater-components repo
2. **Suggest improvements** - Based on real usage patterns
3. **Contribute fixes** - Changes benefit the entire Fediverse ecosystem
4. **Share patterns** - Successful patterns become documented best practices

## Lesser-Specific Features

Greater Components provides full support for all Lesser-exclusive features through dedicated UI components, GraphQL operations, and real-time subscriptions. This section covers the complete feature set introduced in Phases 3-4 of the Lesser alignment project.

### Adapter Setup

All Lesser features require the `LesserGraphQLAdapter` configured with your GraphQL endpoint:

```typescript
import { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';

const adapter = new LesserGraphQLAdapter({
  endpoint: 'https://your-instance.social/graphql',
  token: 'your-auth-token',
  subscriptions: {
    enabled: true,
    transport: 'websocket' // or 'sse'
  }
});
```

### Quote Posts

**Description**: Create and display quote posts with full permission controls and activity tracking.

**GraphQL Operations**: 
- `CreateQuoteNote` mutation - Create a new quote
- `UpdateQuotePermissions` mutation - Change quote permissions
- `WithdrawFromQuotes` mutation - Remove quote ability
- `ObjectWithQuotes` query - Fetch quotes of an object

**UI Components**: 
- `ActionBar` - Quote button with count display
- `Compose.Root` - Quote composition with permission controls
- `Status.Actions` - Quote action integration

**Permission Levels**:
- `EVERYONE` - Anyone can quote
- `FOLLOWERS` - Only followers can quote
- `NONE` - Quotes disabled

**Quote Types**:
- `FULL` - Complete repost with commentary
- `PARTIAL` - Selected excerpt with commentary
- `COMMENTARY` - Pure commentary on the original
- `REACTION` - Quick reaction/response

**Complete Usage Example**:

```svelte
<script lang="ts">
  import { createGraphQLComposeHandlers } from '@equaltoai/greater-components-fediverse/Compose/GraphQLAdapter';
  import * as Compose from '@equaltoai/greater-components-fediverse/Compose';
  import * as Status from '@equaltoai/greater-components-fediverse/Status';
  import { ActionBar } from '@equaltoai/greater-components-fediverse';
  
  const handlers = createGraphQLComposeHandlers(adapter);
  
  let showQuoteComposer = false;
  let quoteTargetUrl = '';
  
  async function handleQuote(status: Status) {
    quoteTargetUrl = status.url;
    showQuoteComposer = true;
  }
  
  async function createQuote(composeState) {
    await handlers.handleSubmit({
      content: composeState.content,
      quoteUrl: quoteTargetUrl,
      quoteType: 'COMMENTARY',
      quotePermissions: 'EVERYONE',
      visibility: 'public'
    });
    showQuoteComposer = false;
  }
  
  async function updateQuotePermissions(statusId: string, permission: QuotePermission) {
    await adapter.updateQuotePermissions(statusId, true, permission);
  }
</script>

<!-- Status display with quote button -->
<Status.Root {status}>
  <Status.Header />
  <Status.Content />
  <Status.Actions 
    handlers={{ 
      onQuote: () => handleQuote(status)
    }} 
  />
</Status.Root>

<!-- Quote composer modal -->
{#if showQuoteComposer}
  <Compose.Root 
    initialState={{
      quoteUrl: quoteTargetUrl,
      quoteType: 'COMMENTARY',
      quotePermissions: 'EVERYONE'
    }}
    {handlers}
  >
    <Compose.Editor />
    <Compose.Submit />
  </Compose.Root>
{/if}
```

**Real-time Updates**:

Subscribe to quote activity for a specific object:

```typescript
adapter.subscribeToActivityStream({
  objectId: statusId,
  types: ['QUOTE']
}).subscribe(update => {
  console.log('New quote created:', update.quote);
});
```

### Community Notes

**Description**: Collaborative fact-checking system allowing users to add context and vote on note helpfulness.

**GraphQL Operations**:
- `AddCommunityNote` mutation - Add a new community note
- `VoteCommunityNote` mutation - Vote on note helpfulness
- `CommunityNotesByObject` query - Fetch all notes for an object
- `FlagObject` mutation - Report content for moderation

**UI Components**:
- `Status.CommunityNotes` - Display and vote on notes
- `ModerationTools` - Create new community notes

**Note Structure**:
```typescript
interface CommunityNote {
  id: string;
  content: string;
  author: Actor;
  helpful: number;      // Count of helpful votes
  notHelpful: number;   // Count of not-helpful votes
  createdAt: string;
}
```

**Complete Usage Example**:

```svelte
<script lang="ts">
  import * as Status from '@equaltoai/greater-components-fediverse/Status';
  import { ModerationTools } from '@equaltoai/greater-components-fediverse/patterns';
  import { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
  
  const adapter = new LesserGraphQLAdapter(config);
  
  let showModerationTools = false;
  
  async function voteOnNote(noteId: string, helpful: boolean) {
    try {
      await adapter.voteCommunityNote(noteId, helpful);
      // Refresh status to show updated counts
      await refreshStatus();
    } catch (error) {
      console.error('Vote failed:', error);
    }
  }
  
  async function addNote(content: string) {
    await adapter.addCommunityNote({
      objectId: status.id,
      content,
      context: 'ADDITIONAL_CONTEXT'
    });
    showModerationTools = false;
  }
</script>

<!-- Display community notes with voting -->
<Status.Root {status}>
  <Status.Header />
  <Status.Content />
  <Status.CommunityNotes 
    onVote={voteOnNote} 
    enableVoting={true}
    maxVisible={3}
  />
  <Status.Actions />
</Status.Root>

<!-- Moderation tools for adding notes -->
{#if showModerationTools}
  <ModerationTools
    {status}
    onAddNote={addNote}
    onClose={() => showModerationTools = false}
  />
{/if}
```

**Best Practices**:
- Enable voting only for authenticated users
- Implement rate limiting on note creation
- Display notes sorted by helpfulness score
- Show note author reputation/trust scores

### AI Insights & Moderation Analytics

**Description**: AI-powered content analysis for toxicity, sentiment, spam, NSFW detection, and automated moderation actions.

**GraphQL Operations**:
- `RequestAIAnalysis` mutation - Trigger analysis for an object
- `AIAnalysis` query - Fetch analysis results
- `AIStats` query - Get moderation statistics
- `AICapabilities` query - Check available AI features

**UI Components**:
- `Admin.Insights.AIAnalysis` - Detailed analysis panel
- `Admin.Insights.ModerationAnalytics` - Statistics dashboard
- `Status.LesserMetadata` - Inline moderation warnings

**Analysis Types**:

**Text Analysis**:
- `sentiment` - POSITIVE, NEGATIVE, NEUTRAL, MIXED
- `toxicity` - Score 0.0-1.0
- `profanity` - Boolean flag
- `piiDetected` - Personal information detection

**Image Analysis**:
- `nsfw` - Adult content score
- `violence` - Violent content score
- `deepfake` - AI-generated image detection

**AI Detection**:
- `aiGeneratedProbability` - Likelihood content is AI-generated (0.0-1.0)
- `model` - Detected AI model (if applicable)

**Spam Analysis**:
- `isSpam` - Boolean classification
- `confidence` - Detection confidence

**Complete Usage Example**:

```svelte
<script lang="ts">
  import * as Insights from '@equaltoai/greater-components-fediverse/Admin/Insights';
  import * as Status from '@equaltoai/greater-components-fediverse/Status';
  import { adapter } from './config';
  
  let analysisResults = $state(null);
  
  async function requestAnalysis(objectId: string) {
    const result = await adapter.requestAIAnalysis(objectId, 'NOTE', false);
    analysisResults = result.data.requestAIAnalysis;
  }
  
  async function getModStats(period: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH') {
    const stats = await adapter.getAIStats(period);
    return stats.data.aiStats;
  }
</script>

<!-- Admin insights dashboard -->
<Insights.Root {adapter}>
  <!-- AI analysis for specific content -->
  <Insights.AIAnalysis 
    objectId={statusId} 
    autoRequest={true}
    showTextAnalysis={true}
    showImageAnalysis={true}
    showAIDetection={true}
    showSpamAnalysis={true}
  />
  
  <!-- Moderation statistics -->
  <Insights.ModerationAnalytics 
    period="DAY"
    showActionBreakdown={true}
  />
</Insights.Root>

<!-- Inline moderation warnings on status -->
<Status.Root {status}>
  <Status.LesserMetadata 
    showModeration={true}
    moderationThreshold={0.7}
  />
  <Status.Content />
</Status.Root>
```

**Real-time Moderation Events**:

```typescript
adapter.subscribeToModerationEvents().subscribe(event => {
  console.log('Moderation action:', event.action);
  console.log('Target:', event.targetId);
  console.log('Reason:', event.reason);
});
```

**Configuration**:

Set thresholds for automatic actions:

```typescript
await adapter.createModerationPattern({
  name: 'High Toxicity Auto-Flag',
  conditions: {
    toxicity: { min: 0.8 }
  },
  action: 'FLAG',
  severity: 'HIGH'
});
```

### Trust Graph

**Description**: Visualize and manage trust relationships, reputation scores, and vouches between actors in the network.

**GraphQL Operations**:
- `TrustGraph` query - Fetch trust relationships for an actor
- Real-time `trustUpdates` subscription

**UI Components**:
- `Admin.TrustGraph.Visualization` - Graph visualization
- `Admin.TrustGraph.RelationshipList` - Tabular relationship view
- `Profile.TrustBadge` - Trust score display with expandable details

**Trust Categories**:
- `CONTENT` - Trust in content quality/accuracy
- `BEHAVIOR` - Trust in user behavior/conduct
- `TECHNICAL` - Trust in technical competence

**Trust Levels**:
- `0.0-0.3` - Very Low (red)
- `0.3-0.5` - Low (orange)
- `0.5-0.8` - Medium (yellow)
- `0.8-1.0` - High (green)

**Complete Usage Example**:

```svelte
<script lang="ts">
  import * as TrustGraph from '@equaltoai/greater-components-fediverse/Admin/TrustGraph';
  import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
  import { adapter } from './config';
  
  let selectedNode = $state(null);
  let trustCategory = $state('CONTENT');
  
  async function loadTrustGraph(actorId: string, category?: TrustCategory) {
    const result = await adapter.getTrustGraph(actorId, category);
    return result.data.trustGraph;
  }
  
  function handleNodeSelect(node) {
    selectedNode = node;
  }
</script>

<!-- Trust graph admin view -->
<TrustGraph.Root {adapter} rootActorId={currentUser.id}>
  <!-- Category filter -->
  <select bind:value={trustCategory}>
    <option value="CONTENT">Content Trust</option>
    <option value="BEHAVIOR">Behavior Trust</option>
    <option value="TECHNICAL">Technical Trust</option>
  </select>
  
  <!-- Visualization -->
  <TrustGraph.Visualization 
    category={trustCategory}
    onNodeSelect={handleNodeSelect}
  />
  
  <!-- Relationship table -->
  <TrustGraph.RelationshipList 
    selectedNode={selectedNode?.id}
  />
</TrustGraph.Root>

<!-- Profile trust badge (inline display) -->
<Profile.Root {profileData}>
  <Profile.Header />
  <Profile.TrustBadge expandable={true} />
  <Profile.Stats />
</Profile.Root>
```

**Real-time Trust Updates**:

```typescript
adapter.subscribeToTrustUpdates({
  actorId: currentUser.id
}).subscribe(update => {
  console.log('Trust score updated:', update.newScore);
  console.log('Category:', update.category);
  console.log('Evidence:', update.evidence);
});
```

**Reputation Structure**:

```typescript
interface Reputation {
  trustScore: number;          // Overall trust (0.0-1.0)
  activityScore: number;       // Activity level
  moderationScore: number;     // Moderation history
  communityScore: number;      // Community standing
  evidence: {
    postCount: number;
    followerCount: number;
    accountAge: number;
    trustingActors: number;
  };
  signature?: string;          // Cryptographic verification
}
```

### Cost Dashboards

**Description**: Real-time cost tracking, budget management, and federation optimization for AWS services.

**GraphQL Operations**:
- `CostBreakdown` query - Get costs by period and service
- `InstanceBudgets` query - Fetch budget configurations
- `SetInstanceBudget` mutation - Configure instance budgets
- `OptimizeFederationCosts` mutation - Trigger cost optimization
- `FederationLimits` query - Get rate limits per instance
- `SetFederationLimit` mutation - Configure rate limits

**UI Components**:
- `Admin.Cost.Dashboard` - Main cost visualization
- `Admin.Cost.BudgetControls` - Budget configuration
- `Admin.Cost.Alerts` - Real-time cost alerts
- `Status.LesserMetadata` - Per-post cost display

**Cost Categories**:
- **DynamoDB** - Database operations
- **S3** - Media storage
- **Lambda** - Serverless compute
- **Data Transfer** - Network egress

**Time Periods**:
- `HOUR` - Hourly breakdown
- `DAY` - Daily costs
- `WEEK` - Weekly summary
- `MONTH` - Monthly totals
- `YEAR` - Annual overview

**Complete Usage Example**:

```svelte
<script lang="ts">
  import * as Cost from '@equaltoai/greater-components-fediverse/Admin/Cost';
  import * as Status from '@equaltoai/greater-components-fediverse/Status';
  import { adapter, adminStreamingStore } from './config';
  
  let selectedPeriod = $state('MONTH');
  
  async function setCostBudget(domain: string, monthlyUSD: number) {
    await adapter.setInstanceBudget(domain, monthlyUSD, true);
  }
  
  async function optimizeCosts(threshold: number) {
    const result = await adapter.optimizeFederationCosts(threshold);
    console.log('Optimization suggestions:', result.data.optimizeFederationCosts);
  }
  
  // Subscribe to real-time cost alerts
  $effect(() => {
    const alerts = adminStreamingStore.getUnhandledCostAlerts();
    if (alerts.length > 0) {
      notifyUser('Cost Alert', alerts[0].message);
    }
  });
</script>

<!-- Cost admin dashboard -->
<Cost.Root {adapter}>
  <!-- Period selector -->
  <select bind:value={selectedPeriod}>
    <option value="DAY">Last 24 Hours</option>
    <option value="WEEK">Last 7 Days</option>
    <option value="MONTH">This Month</option>
    <option value="YEAR">This Year</option>
  </select>
  
  <!-- Cost breakdown -->
  <Cost.Dashboard 
    period={selectedPeriod}
    showServiceBreakdown={true}
    showOperationBreakdown={true}
  />
  
  <!-- Budget controls -->
  <Cost.BudgetControls 
    onSetBudget={setCostBudget}
    onOptimize={() => optimizeCosts(0.8)}
  />
  
  <!-- Real-time alerts -->
  <Cost.Alerts 
    threshold={0.9}
    showAcknowledged={false}
  />
</Cost.Root>

<!-- Display per-post cost estimates -->
<Status.Root {status}>
  <Status.LesserMetadata 
    showCost={true}
    costFormat="USD"
  />
  <Status.Content />
</Status.Root>
```

**Real-time Cost Subscriptions**:

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
  console.log('Budget alert:', alert.domain);
  console.log('Current:', alert.currentSpend);
  console.log('Limit:', alert.limit);
});
```

**Cost Optimization**:

```typescript
// Get optimization suggestions
const result = await adapter.optimizeFederationCosts(0.75);
const suggestions = result.data.optimizeFederationCosts;

// Apply rate limiting to high-cost instances
for (const suggestion of suggestions.rateLimitChanges) {
  await adapter.setFederationLimit(suggestion.domain, {
    maxRequestsPerHour: suggestion.newLimit,
    priority: 'NORMAL'
  });
}
```

### Thread Synchronization

**Description**: Fetch missing replies and synchronize incomplete conversation threads across federated instances.

**GraphQL Operations**:
- `SyncThread` mutation - Synchronize entire thread by URL
- `SyncMissingReplies` mutation - Fetch missing replies for specific status
- `ThreadContext` query - Get thread metadata and completion status

**UI Components**:
- `ThreadView` - Enhanced with sync button
- `ThreadNodeView` - Individual thread node display

**Sync Depth Levels**:
- `1` - Direct replies only
- `2` - Replies and their direct replies
- `3` - Three levels deep (recommended)
- `5` - Maximum depth (use sparingly)

**Complete Usage Example**:

```svelte
<script lang="ts">
  import { ThreadView } from '@equaltoai/greater-components-fediverse/patterns';
  import { adapter } from './config';
  
  let syncing = $state(false);
  let syncProgress = $state(null);
  
  async function syncThread(statusId: string) {
    syncing = true;
    try {
      const result = await adapter.syncThread(status.url, 3);
      const { fetched, added, errors } = result.data.syncThread;
      
      console.log(`Fetched ${fetched} replies, added ${added} new ones`);
      
      if (errors.length > 0) {
        console.warn('Sync errors:', errors);
      }
      
      // Reload thread to show new replies
      await reloadThread();
    } catch (error) {
      console.error('Thread sync failed:', error);
    } finally {
      syncing = false;
    }
  }
  
  async function syncSpecificStatus(statusId: string) {
    await adapter.syncMissingReplies(statusId);
  }
  
  async function checkThreadContext(statusId: string) {
    const result = await adapter.getThreadContext(statusId);
    const context = result.data.threadContext;
    
    console.log('Total replies:', context.replyCount);
    console.log('Fetched:', context.fetchedCount);
    console.log('Missing:', context.missingCount);
    console.log('Complete:', context.isComplete);
    
    return context;
  }
</script>

<!-- Thread view with sync capability -->
<ThreadView 
  {rootStatus} 
  {replies}
  handlers={{ 
    ...otherHandlers,
    onSyncThread: syncThread 
  }}
  {syncing}
  syncDepth={3}
/>

<!-- Manual sync button -->
{#if !threadComplete}
  <button 
    onclick={() => syncThread(rootStatus.id)}
    disabled={syncing}
  >
    {syncing ? 'Syncing...' : 'Fetch Missing Replies'}
  </button>
{/if}
```

**Thread Context API**:

```typescript
interface ThreadContext {
  statusId: string;
  replyCount: number;       // Total known replies
  fetchedCount: number;     // Currently fetched
  missingCount: number;     // Still missing
  isComplete: boolean;      // All replies fetched
  lastSync: string;         // Last sync timestamp
  errors: string[];         // Any federation errors
}
```

**Auto-sync Configuration**:

```typescript
// Auto-sync incomplete threads
function setupAutoSync(threshold: number = 0.8) {
  $effect(() => {
    const context = getThreadContext(rootStatus.id);
    const completeness = context.fetchedCount / context.replyCount;
    
    if (completeness < threshold && !context.isComplete) {
      syncThread(rootStatus.id);
    }
  });
}
```

### Severed Relationships

**Description**: Monitor, diagnose, and recover from broken federation connections between instances.

**GraphQL Operations**:
- `SeveredRelationships` query - List all severed connections
- `AcknowledgeSeverance` mutation - Mark severance as acknowledged
- `AttemptReconnection` mutation - Try to restore connection
- `FederationHealth` query - Check overall federation health
- `FederationStatus` query - Status of specific instance
- `PauseFederation` mutation - Temporarily pause federation
- `ResumeFederation` mutation - Resume paused federation

**UI Components**:
- `Admin.SeveredRelationships.List` - Table of severed connections
- `Admin.SeveredRelationships.RecoveryPanel` - Diagnostic and recovery tools

**Severance Types**:
- `TIMEOUT` - Instance not responding
- `BLOCKED` - Explicitly blocked
- `ERROR` - Technical failure
- `RATE_LIMITED` - Too many requests
- `SUSPENDED` - Instance suspended

**Complete Usage Example**:

```svelte
<script lang="ts">
  import * as SeveredRelationships from '@equaltoai/greater-components-fediverse/Admin/SeveredRelationships';
  import { adapter } from './config';
  
  let selectedSeverance = $state(null);
  let reconnecting = $state(false);
  
  async function acknowledgeSeverance(id: string) {
    await adapter.acknowledgeSeverance(id);
    // Refresh list
    await loadSeverances();
  }
  
  async function attemptRecovery(id: string) {
    reconnecting = true;
    try {
      const result = await adapter.attemptReconnection(id);
      const { success, message, newStatus } = result.data.attemptReconnection;
      
      if (success) {
        console.log('Reconnection successful:', message);
      } else {
        console.warn('Reconnection failed:', message);
      }
      
      return { success, message, newStatus };
    } finally {
      reconnecting = false;
    }
  }
  
  async function pauseFederation(domain: string, reason: string, hours: number) {
    const until = new Date(Date.now() + hours * 60 * 60 * 1000);
    await adapter.pauseFederation(domain, reason, until.toISOString());
  }
  
  async function resumeFederation(domain: string) {
    await adapter.resumeFederation(domain);
  }
  
  async function checkFederationHealth(threshold: number = 0.8) {
    const result = await adapter.getFederationHealth(threshold);
    const health = result.data.federationHealth;
    
    console.log('Healthy instances:', health.healthyCount);
    console.log('Unhealthy instances:', health.unhealthyCount);
    console.log('Overall score:', health.overallHealth);
    
    return health;
  }
</script>

<!-- Severed relationships admin panel -->
<SeveredRelationships.Root {adapter}>
  <!-- List of severed connections -->
  <SeveredRelationships.List 
    onSelect={(severance) => selectedSeverance = severance}
    showAcknowledged={false}
  />
  
  <!-- Recovery panel for selected severance -->
  {#if selectedSeverance}
    <SeveredRelationships.RecoveryPanel 
      severanceId={selectedSeverance.id}
      onAcknowledge={() => acknowledgeSeverance(selectedSeverance.id)}
      onAttemptReconnection={() => attemptRecovery(selectedSeverance.id)}
      {reconnecting}
    />
  {/if}
</SeveredRelationships.Root>

<!-- Federation health monitoring -->
<section class="federation-health">
  <h3>Federation Health</h3>
  <button onclick={() => checkFederationHealth()}>
    Check Health
  </button>
</section>
```

**Real-time Federation Updates**:

```typescript
adapter.subscribeToFederationHealthUpdates({
  threshold: 0.8
}).subscribe(update => {
  console.log('Instance:', update.domain);
  console.log('Status:', update.status);
  console.log('Health score:', update.healthScore);
  
  if (update.healthScore < 0.5) {
    notifyAdmin('Federation health degraded: ' + update.domain);
  }
});
```

**Severance Structure**:

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
```

### Hashtag Management

**Description**: Follow hashtags with granular notification preferences and mute controls for hashtag-based filtering.

**GraphQL Operations**:
- `FollowHashtag` mutation - Follow hashtag with notification level
- `UnfollowHashtag` mutation - Unfollow hashtag
- `MuteHashtag` mutation - Mute hashtag temporarily or permanently
- `UnmuteHashtag` mutation - Remove mute while preserving follow state
- `UpdateHashtagNotifications` mutation - Adjust notification settings
- `FollowedHashtags` query - List followed hashtags with pagination

**UI Components**:
- `Hashtags.Controls` - Follow/mute toggle for specific hashtag
- `Hashtags.FollowedList` - List of followed hashtags with settings
- `Hashtags.MutedList` - List of muted hashtags with unmute actions

**Notification Levels**:
- `ALL` - Notify for all posts (default)
- `MUTUALS` - Only mutuals' posts
- `FOLLOWING` - Only from followed accounts
- `NONE` - Follow without notifications (effectively muted)

**Complete Usage Example**:

```svelte
<script lang="ts">
  import * as Hashtags from '@equaltoai/greater-components-fediverse/Hashtags';
  import { createLesserTimelineStore } from '@equaltoai/greater-components-fediverse';
  import { adapter } from './config';
  
  let selectedHashtag = $state('svelte');
  let notifyLevel = $state('ALL');
  
  async function followHashtag(tag: string, level: NotificationLevel = 'ALL') {
    await adapter.followHashtag(tag, level);
    // Refresh followed list
    await refreshFollowedHashtags();
  }
  
  async function unfollowHashtag(tag: string) {
    await adapter.unfollowHashtag(tag);
    await refreshFollowedHashtags();
  }
  
  async function muteHashtag(tag: string, duration?: number) {
    const until = duration 
      ? new Date(Date.now() + duration * 60 * 60 * 1000).toISOString()
      : undefined;
    
    await adapter.muteHashtag(tag, until);
  }
  
  async function unmuteHashtag(tag: string) {
    await adapter.unmuteHashtag(tag, { preserveFollow: true });
  }
  
  async function updateNotifications(tag: string, settings) {
    await adapter.updateHashtagNotifications(tag, {
      notifyLevel: settings.level,
      muted: settings.muted
    });
  }
  
  // Create timeline for followed hashtags
  const hashtagTimeline = createLesserTimelineStore({
    adapter,
    type: 'HASHTAG',
    hashtags: ['svelte', 'fediverse'],
    hashtagMode: 'ANY'  // or 'ALL' for intersection
  });
</script>

<!-- Hashtag management UI -->
<Hashtags.Root {adapter}>
  <!-- Controls for specific hashtag -->
  <section class="hashtag-controls">
    <h3>#{selectedHashtag}</h3>
    <Hashtags.Controls 
      hashtag={selectedHashtag}
      onFollow={() => followHashtag(selectedHashtag, notifyLevel)}
      onUnfollow={() => unfollowHashtag(selectedHashtag)}
      onMute={() => muteHashtag(selectedHashtag)}
    />
    
    <!-- Notification level selector -->
    <select bind:value={notifyLevel}>
      <option value="ALL">All Posts</option>
      <option value="MUTUALS">Mutuals Only</option>
      <option value="FOLLOWING">Following Only</option>
      <option value="NONE">No Notifications</option>
    </select>
  </section>
  
  <!-- Followed hashtags list -->
  <section class="followed-hashtags">
    <h3>Followed Hashtags</h3>
    <Hashtags.FollowedList 
      onUnfollow={unfollowHashtag}
      onUpdateNotifications={updateNotifications}
    />
  </section>
  
  <!-- Muted hashtags list -->
  <section class="muted-hashtags">
    <h3>Muted Hashtags</h3>
    <Hashtags.MutedList 
      onUnmute={unmuteHashtag}
    />
  </section>
</Hashtags.Root>

<!-- Timeline filtered by followed hashtags -->
<div class="hashtag-timeline">
  <h2>Followed Hashtags Feed</h2>
  <TimelineVirtualized
    items={$hashtagTimeline.items}
    onLoadMore={hashtagTimeline.loadMore}
  />
</div>
```

**Hashtag Timeline Configuration**:

```typescript
// Single hashtag timeline
const timeline = createLesserTimelineStore({
  adapter,
  type: 'HASHTAG',
  hashtag: 'svelte'
});

// Multiple hashtags (ANY mode - union)
const anyTimeline = createLesserTimelineStore({
  adapter,
  type: 'HASHTAG',
  hashtags: ['svelte', 'webdev', 'javascript'],
  hashtagMode: 'ANY'  // Posts with any of these hashtags
});

// Multiple hashtags (ALL mode - intersection)
const allTimeline = createLesserTimelineStore({
  adapter,
  type: 'HASHTAG',
  hashtags: ['svelte', 'tutorial'],
  hashtagMode: 'ALL'  // Posts with all these hashtags
});
```

**Real-time Hashtag Activity**:

```typescript
adapter.subscribeToHashtagActivity({
  hashtags: ['svelte', 'fediverse']
}).subscribe(activity => {
  console.log('New post in hashtag:', activity.hashtag);
  console.log('Author:', activity.author);
  console.log('Content:', activity.object);
});
```

**Followed Hashtag Structure**:

```typescript
interface FollowedHashtag {
  hashtag: string;
  notifyLevel: NotificationLevel;
  muted: boolean;
  muteUntil?: string;
  followedAt: string;
  postCount?: number;      // Recent post count
  lastActivity?: string;   // Last seen post
}
```

## Next Steps

- Explore compound component patterns (Timeline.Root, Timeline.Item, etc.)
- Implement custom ActivityPub components using headless primitives
- Contribute new headless primitives based on Lesser needs
- Help refine the Fediverse-specific component APIs

---

**Remember:** Every component in Greater is battle-tested in Lesser first. Your feedback directly shapes the future of Fediverse UI development!
