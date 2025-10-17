# Greater ⇄ Lesser Alignment Log

## Phase 1 – Schema & Query Synchronisation

- 2025-02-14: Installed `@graphql-codegen/cli`, vendored the Lesser schema at `schemas/lesser/schema.graphql`, and introduced a root `codegen.ts` for reproducible generation.
- 2025-02-14: Authored new Lesser-aligned GraphQL documents under `packages/fediverse/src/adapters/graphql/documents` and regenerated typed artifacts in both adapters and component packages.
- 2025-02-14: Rebuilt `packages/adapters/src/graphql/LesserGraphQLAdapter.ts` to use typed DocumentNodes, Relay pagination, and Lesser mutation names; removed legacy inline query definitions.
- 2025-02-14: Updated Compose handlers and tests to consume `createNote` payloads, map Lesser visibility enums, and operate on the regenerated schema shapes.
- 2025-02-14: Hardened `packages/adapters/src/stores/notificationStore.ts` with persistent transport subscriptions, limit enforcement, and streaming dedupe so Lesser queues stay bounded while tests use the new debounce helpers.
- 2025-02-14: Refactored `packages/adapters/src/stores/presenceStore.ts` around proxy-backed maps and priority-aware merging to keep stats reactive, preserve idle→active transitions, and satisfy the revised suite.
- 2025-02-14: Updated `packages/adapters/src/TransportFallback.ts` to retry SSE initialization once when auto-fallback is disabled, preventing manual mode regressions under the new schema mocks.
- 2025-02-14: Confirmed `pnpm --filter @greater/adapters test` passes after the store and transport fixes.
