# TypeScript Build Issues Inventory

Comprehensive checklist of the declaration-build failures currently blocking `pnpm build` / publishing.

## Transport Fallback Layer

- [x] `packages/adapters/src/TransportFallback.ts:223` — `instantiateClient()` inferred as `TransportAdapter<Record<string, unknown>>`; tighten `TransportAdapter` generics or add an explicit type assertion so `currentTransport` exposes `SseClientState | HttpPollingClientState`.
- [x] `packages/adapters/src/TransportFallback.ts:239` — `this.currentTransport` may be `null` when calling `connect()`; guard or assert before use.

## Transport Manager

- [x] `packages/adapters/src/TransportManager.ts:197-198` — `event.data` is typed as `Record<string, unknown>`; narrow before assigning to `latency`/`lastEventId` and use bracket access (`data['latency']`).
- [x] `packages/adapters/src/examples/TransportManagerExample.ts:38-40` — same index-signature issue when reading `event.data`; switch to bracket access (`event.data['from']`, etc.).

## GraphQL Adapter / Fixtures

- [x] `packages/adapters/src/graphql/LesserGraphQLAdapter.ts:10` — missing dependency `@graphql-typed-document-node/core`; add to `package.json` and install.
- [x] `packages/adapters/src/graphql/LesserGraphQLAdapter.ts:296,309` — `TVariables` needs to satisfy `OperationVariables`; tighten the generic constraints or add appropriate extends clauses.
- [x] `packages/adapters/src/graphql/LesserGraphQLAdapter.ts:323` — `data` comes back as `unknown`; narrow or cast before use.
- [x] `packages/adapters/src/fixtures/lesser.ts:499,507,515,530` — fixture objects still include `targetPost`, which no longer exists on `LesserNotificationFragment`; update fixtures to current schema.

## Stores

- [x] `packages/adapters/src/stores/presenceStore.ts:445-459` — streaming payload typed as `unknown`/`Record<string, unknown>`; narrow and access via brackets before assigning to strongly typed `latency`, `users`, `userId`, `sessionId`, etc.
- [x] `packages/adapters/src/stores/timelineStore.ts:107` — casting `TimelineObjectLike` directly to `LesserObjectFragment` fails; adjust conversion logic or introduce an intermediate mapping.
- [x] `packages/adapters/src/stores/timelineStore.ts:359-372` — optimistic timeline updates treat `event.data` as `{}`; refine typing so `type`, `content`, `metadata`, `version` are available (or guard before use).

## Streaming Operations

- [x] `packages/adapters/src/streaming/operations.ts:20-32,206-211` — payload values (e.g., `id`, `username`, `account`, `timestamp`) come from index signatures; switch to bracket access and add type guards to avoid `never`.
