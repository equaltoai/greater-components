# Admin.TrustGraph

Visualize and manage trust relationships, reputation scores, and vouches between actors in the federated network.

## Overview

The `Admin.TrustGraph` module provides tools for understanding trust relationships in the Lesser network. It includes graph visualization, relationship browsing, and reputation score analysis. Trust scores help identify reliable actors and detect potential bad actors based on community signals.

## Components

### Admin.TrustGraph.Root

Context provider for trust graph data and adapter connection.

**Props:**
- `adapter: LesserGraphQLAdapter` - GraphQL adapter instance
- `rootActorId: string` - Root actor ID for the graph
- `children?: Snippet` - Child components

**Usage:**

```svelte
<script lang="ts">
  import * as TrustGraph from '@equaltoai/greater-components-fediverse/Admin/TrustGraph';
  import { adapter } from './config';
</script>

<TrustGraph.Root {adapter} rootActorId={currentUser.id}>
  <TrustGraph.Visualization />
  <TrustGraph.RelationshipList />
</TrustGraph.Root>
```

---

### Admin.TrustGraph.Visualization

Interactive graph visualization showing trust relationships.

**Props:**
- `category?: 'CONTENT' | 'BEHAVIOR' | 'TECHNICAL'` - Filter by trust category
- `onNodeSelect?: (node: TrustNode) => void` - Callback when node is selected
- `maxNodes?: number` - Maximum nodes to display (default: `50`)
- `minTrustScore?: number` - Minimum trust score to display (default: `0.0`)

**Usage:**

```svelte
<script lang="ts">
  let selectedNode = $state(null);
  let category = $state('CONTENT');
</script>

<TrustGraph.Root {adapter} rootActorId={userId}>
  <select bind:value={category}>
    <option value="CONTENT">Content Trust</option>
    <option value="BEHAVIOR">Behavior Trust</option>
    <option value="TECHNICAL">Technical Trust</option>
  </select>
  
  <TrustGraph.Visualization 
    {category}
    onNodeSelect={(node) => selectedNode = node}
    maxNodes={100}
    minTrustScore={0.3}
  />
</TrustGraph.Root>
```

**Visualization Features:**

- Nodes represent actors
- Edges represent trust relationships
- Node size indicates trust score
- Node color indicates trust level:
  - Green: High (0.8-1.0)
  - Yellow: Medium (0.5-0.8)
  - Orange: Low (0.3-0.5)
  - Red: Very Low (0.0-0.3)
- Click nodes to select and view details

---

### Admin.TrustGraph.RelationshipList

Tabular view of trust relationships.

**Props:**
- `selectedNode?: string` - Highlight relationships for specific node
- `sortBy?: 'trustScore' | 'activityScore' | 'displayName'` - Sort order (default: `'trustScore'`)
- `sortDirection?: 'asc' | 'desc'` - Sort direction (default: `'desc'`)

**Usage:**

```svelte
<TrustGraph.Root {adapter} rootActorId={userId}>
  <TrustGraph.RelationshipList 
    selectedNode={selectedNode?.id}
    sortBy="trustScore"
    sortDirection="desc"
  />
</TrustGraph.Root>
```

**Table Columns:**

- **Actor**: Display name and handle
- **Trust Score**: Overall trust (0.0-1.0) with color coding
- **Category**: CONTENT/BEHAVIOR/TECHNICAL
- **Evidence**: Post count, followers, account age
- **Vouches**: Number of vouches
- **Actions**: View details, manage relationship

---

## GraphQL Operations

### Queries

```graphql
query TrustGraph($actorId: ID!, $category: TrustCategory) {
  trustGraph(actorId: $actorId, category: $category) {
    edges {
      source
      target
      trustScore
      category
      evidence {
        postCount
        followerCount
        accountAge
        trustingActors
      }
    }
    nodes {
      id
      displayName
      handle
      trustScore
      reputation {
        trustScore
        activityScore
        moderationScore
        communityScore
        evidence { ... }
        signature
      }
      vouches {
        id
        voucherId
        category
        createdAt
      }
    }
  }
}
```

### Subscriptions

```graphql
subscription TrustUpdates($actorId: ID!) {
  trustUpdates(actorId: $actorId) {
    actorId
    newScore
    oldScore
    category
    reason
    evidence { ... }
  }
}
```

---

## Adapter Methods

```typescript
// Get trust graph
const result = await adapter.getTrustGraph(actorId, 'CONTENT');
const graph = result.data.trustGraph;

// Subscribe to trust updates
adapter.subscribeToTrustUpdates({ actorId }).subscribe(update => {
  console.log('Trust score changed:', update.oldScore, '→', update.newScore);
  console.log('Category:', update.category);
  console.log('Reason:', update.reason);
});
```

---

## Types

```typescript
interface TrustGraph {
  nodes: TrustNode[];
  edges: TrustEdge[];
}

interface TrustNode {
  id: string;
  displayName: string;
  handle: string;
  trustScore: number;
  reputation: Reputation;
  vouches: Vouch[];
}

interface TrustEdge {
  source: string;
  target: string;
  trustScore: number;
  category: TrustCategory;
  evidence: TrustEvidence;
}

interface Reputation {
  trustScore: number;          // Overall trust (0.0-1.0)
  activityScore: number;       // Activity level
  moderationScore: number;     // Moderation history
  communityScore: number;      // Community standing
  evidence: {
    postCount: number;
    followerCount: number;
    accountAge: number;        // Days since creation
    trustingActors: number;    // Number of actors trusting this one
  };
  signature?: string;          // Cryptographic verification
}

interface Vouch {
  id: string;
  voucherId: string;           // Actor providing vouch
  category: TrustCategory;
  createdAt: string;
}

type TrustCategory = 'CONTENT' | 'BEHAVIOR' | 'TECHNICAL';
```

---

## Trust Categories

### CONTENT
Trust in content quality and accuracy. Based on:
- Fact-checking participation
- Community note contributions
- Content flagging accuracy
- Information quality

### BEHAVIOR
Trust in user behavior and conduct. Based on:
- Moderation history
- Community guideline adherence
- Interaction patterns
- Reported violations

### TECHNICAL
Trust in technical competence. Based on:
- Instance administration (if applicable)
- Bot reliability (if applicable)
- API usage patterns
- System interactions

---

## Trust Levels

| Score Range | Level | Color | Description |
|-------------|-------|-------|-------------|
| 0.8-1.0 | High | Green | Highly trusted, established reputation |
| 0.5-0.8 | Medium | Yellow | Moderately trusted, normal standing |
| 0.3-0.5 | Low | Orange | Lower trust, requires attention |
| 0.0-0.3 | Very Low | Red | Untrusted, potential bad actor |

---

## Evidence Metrics

### Post Count
Number of posts created. Higher counts generally indicate established accounts.

### Follower Count
Number of followers. Popular accounts may have higher trust by default.

### Account Age
Days since account creation. Older accounts generally more trusted.

### Trusting Actors
Number of other actors who trust this one. Web of trust indicator.

### Vouches
Explicit trust endorsements from other actors. Strong signal.

---

## Profile Integration

Display trust scores inline on profiles:

```svelte
<script lang="ts">
  import { Profile } from '@equaltoai/greater-components-fediverse';
</script>

<Profile.Root {profileData}>
  <Profile.Header />
  <Profile.TrustBadge expandable={true} />
  <Profile.Stats />
</Profile.Root>
```

The `TrustBadge` component shows:
- Overall trust score with color coding
- Vouch count
- Expandable reputation details panel

---

## Real-time Updates

Trust scores update in real-time via subscription:

```typescript
adapter.subscribeToTrustUpdates({
  actorId: currentUser.id
}).subscribe(update => {
  console.log('Trust score updated:', update.newScore);
  console.log('Category:', update.category);
  console.log('Evidence:', update.evidence);
  
  // Update UI
  refreshTrustGraph();
});
```

---

## Best Practices

1. **Privacy**: Trust scores are sensitive. Limit visibility to admin users or the account owner.

2. **Transparency**: Clearly explain how trust scores are calculated. Link to evidence.

3. **Appeals**: Provide a mechanism for users to contest low trust scores.

4. **Context**: Trust categories provide context. A low TECHNICAL score doesn't imply low CONTENT trust.

5. **Verification**: Use cryptographic signatures when available to verify reputation claims.

6. **Decay**: Implement trust score decay over time to account for changing behavior.

7. **Bootstrapping**: New users start with neutral scores. Don't penalize for being new.

8. **Thresholds**: Use trust scores as signals, not absolute gates. Manual review recommended.

---

## Accessibility

- Graph visualization includes text fallback
- All trust scores have `aria-label` with numerical values
- Color coding supplemented with text labels
- Keyboard navigation for interactive elements
- Screen reader announcements for score changes

---

## Performance Considerations

- Large graphs (>100 nodes) may impact rendering performance
- Use `maxNodes` prop to limit visualization complexity
- Use `minTrustScore` to filter low-trust relationships
- Pagination recommended for relationship lists with >50 items

---

## Related Components

- [Profile.TrustBadge](../Profile/README.md#trustbadge) - Inline trust display
- [Admin.Insights](./Insights.md) - AI-powered moderation
- [Status.LesserMetadata](../Status/README.md#lessermetadata) - Author trust indicators

---

## See Also

- [Lesser Integration Guide](../../lesser-integration-guide.md#trust-graph)
- [Trust Graph Specification](../../../schemas/lesser/trust-spec.md)
- [Reputation Protocol](https://github.com/lesserhq/lesser/blob/main/docs/reputation.md)

