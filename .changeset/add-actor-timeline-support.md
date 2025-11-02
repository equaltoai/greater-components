---
"@equaltoai/greater-components-adapters": minor
"@equaltoai/greater-components-fediverse": minor
---

Add actor timeline support

**New Feature:**
- Add `ACTOR` timeline type support for fetching posts from specific actors
- Add `fetchActorTimeline()` convenience method to `LesserGraphQLAdapter`
- Update GraphQL query to support `actorId` and `mediaOnly` parameters
- Regenerate TypeScript types from updated Lesser schema

**Files Changed:**
- `packages/adapters/src/graphql/LesserGraphQLAdapter.ts` - Add `fetchActorTimeline()` method
- `packages/fediverse/src/adapters/graphql/documents/timeline.graphql` - Add `actorId` and `mediaOnly` parameters
- `schemas/lesser/schema.graphql` - Update to latest Lesser schema with ACTOR timeline type
- `packages/adapters/tests/graphql/LesserGraphQLAdapter.test.ts` - Add test for new method

**Usage:**
```typescript
const timeline = await adapter.fetchActorTimeline('actor-id', {
  first: 20,
  mediaOnly: false
});
```

