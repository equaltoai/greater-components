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
    "@greater/headless": "workspace:*",
    "@greater/primitives": "workspace:*",
    "@greater/fediverse": "workspace:*",
    "@greater/adapters": "workspace:*",
    "@greater/tokens": "workspace:*",
    "@greater/icons": "workspace:*"
  }
}
```

## Headless Components in Lesser

### Example: Custom Post Action Button

Using the headless button for a "Boost" action with Lesser's styling:

```svelte
<script lang="ts">
  import { createButton } from '@greater/headless/button';
  import { BoostIcon } from '@greater/icons';
  import type { Status } from '@greater/fediverse';
  
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
  import { createButton } from '@greater/headless/button';
  import type { ComposeBoxDraft } from '@greater/fediverse';
  
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
  import { TimelineVirtualized } from '@greater/fediverse';
  import { createTimelineStore } from '@greater/adapters';
  import type { Status } from '@greater/fediverse';
  
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
} from '@greater/adapters';

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
import { render, fireEvent } from '@greater/testing';
import { createButton } from '@greater/headless/button';
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
import type { Status, Account } from '@greater/fediverse';

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
import { createButton } from '@greater/headless/button';

// Less optimal: Imports everything
import { createButton } from '@greater/headless';
```

### Lazy Loading Heavy Components

```svelte
<script>
  // Lazy load timeline for route
  const TimelineVirtualized = lazy(() => 
    import('@greater/fediverse/TimelineVirtualized')
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

## Phase 4: Lesser-Specific Features

### Quote Posts

**GraphQL Support**: `CreateQuoteNote` mutation, `ObjectWithQuotes` query  
**UI Components**: ActionBar quote button, Compose quote mode  
**Usage**:

```svelte
<script lang="ts">
  import { createGraphQLComposeHandlers } from '@greater/fediverse/Compose/GraphQLAdapter';
  import * as Compose from '@greater/fediverse/Compose';
  
  const handlers = createGraphQLComposeHandlers(adapter);
  
  async function createQuote(originalStatusUrl: string) {
    await handlers.handleSubmit({
      content: "Great point! Adding context...",
      quoteUrl: originalStatusUrl,
      quoteType: 'COMMENTARY',
      visibility: 'public'
    });
  }
</script>
```

### Community Notes

**GraphQL Support**: `addCommunityNote`, `voteCommunityNote` mutations  
**UI Components**: `Status.CommunityNotes`, ModerationTools integration  
**Usage**:

```svelte
<script lang="ts">
  import * as Status from '@greater/fediverse/Status';
  import { LesserGraphQLAdapter } from '@greater/adapters';
  
  const adapter = new LesserGraphQLAdapter(config);
  
  async function voteOnNote(noteId: string, helpful: boolean) {
    await adapter.voteCommunityNote(noteId, helpful);
  }
</script>

<Status.Root {status} {handlers}>
  <Status.Content />
  <Status.CommunityNotes onVote={voteOnNote} enableVoting={true} />
</Status.Root>
```

### AI Insights & Moderation Analytics

**GraphQL Support**: `requestAIAnalysis`, `aiAnalysis`, `aiStats` queries  
**UI Components**: `Admin.Insights.AIAnalysis`, `Admin.Insights.ModerationAnalytics`  
**Usage**:

```svelte
<script lang="ts">
  import * as Insights from '@greater/fediverse/Admin/Insights';
  import { adapter } from './config';
</script>

<Insights.Root {adapter}>
  <Insights.AIAnalysis objectId={statusId} autoRequest={true} />
  <Insights.ModerationAnalytics period="DAY" />
</Insights.Root>
```

### Trust Graph

**GraphQL Support**: `trustGraph` query  
**UI Components**: `Admin.TrustGraph.Visualization`, `Admin.TrustGraph.RelationshipList`  
**Usage**:

```svelte
<script lang="ts">
  import * as TrustGraph from '@greater/fediverse/Admin/TrustGraph';
  import { adapter } from './config';
</script>

<TrustGraph.Root {adapter} rootActorId={actorId}>
  <TrustGraph.Visualization />
  <TrustGraph.RelationshipList />
</TrustGraph.Root>
```

### Cost Dashboards

**GraphQL Support**: `costBreakdown`, `setInstanceBudget`, `optimizeFederationCosts`  
**UI Components**: `Admin.Cost.Dashboard`, `Admin.Cost.BudgetControls`, `Admin.Cost.Alerts`  
**Usage**:

```svelte
<script lang="ts">
  import * as Cost from '@greater/fediverse/Admin/Cost';
  import { adapter } from './config';
</script>

<Cost.Root {adapter}>
  <Cost.Dashboard period="MONTH" />
  <Cost.BudgetControls />
  <Cost.Alerts />
</Cost.Root>
```

### Thread Synchronization

**GraphQL Support**: `syncThread`, `syncMissingReplies` mutations  
**UI Components**: Enhanced `ThreadView` with sync button  
**Usage**:

```svelte
<script lang="ts">
  import { ThreadView } from '@greater/fediverse/patterns';
  
  async function syncThread(statusId: string) {
    await adapter.syncThread(statusUrl, 3); // depth 3
  }
</script>

<ThreadView 
  {rootStatus} 
  {replies}
  handlers={{ 
    ...otherHandlers,
    onSyncThread: syncThread 
  }}
/>
```

### Severed Relationships

**GraphQL Support**: `severedRelationships`, `acknowledgeSeverance`, `attemptReconnection`  
**UI Components**: `Admin.SeveredRelationships.List`, `Admin.SeveredRelationships.RecoveryPanel`  
**Usage**:

```svelte
<script lang="ts">
  import * as SeveredRelationships from '@greater/fediverse/Admin/SeveredRelationships';
</script>

<SeveredRelationships.Root {adapter}>
  <SeveredRelationships.List />
  <SeveredRelationships.RecoveryPanel severanceId={id} />
</SeveredRelationships.Root>
```

### Hashtag Management

**GraphQL Support**: `followHashtag`, `unfollowHashtag`, `muteHashtag` mutations  
**UI Components**: `Hashtags.Controls`, `Hashtags.FollowedList`  
**Usage**:

```svelte
<script lang="ts">
  import * as Hashtags from '@greater/fediverse/Hashtags';
</script>

<Hashtags.Root {adapter}>
  <Hashtags.Controls hashtag="svelte" />
  <Hashtags.FollowedList />
</Hashtags.Root>
```

## Next Steps

- Explore compound component patterns (Timeline.Root, Timeline.Item, etc.)
- Implement custom ActivityPub components using headless primitives
- Contribute new headless primitives based on Lesser needs
- Help refine the Fediverse-specific component APIs

---

**Remember:** Every component in Greater is battle-tested in Lesser first. Your feedback directly shapes the future of Fediverse UI development!

