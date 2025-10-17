# Greater ⇄ Lesser Alignment Plan

## Phase 1 – Schema & Query Synchronisation

- Regenerate GraphQL operations against `lesser/graph/schema.graphql` (queries, mutations, subscriptions) and commit generated documents into `packages/fediverse/src/adapters/graphql`.
- Replace legacy query strings in adapters (`packages/adapters/src/graphql`) and update Compose/Search/List/Messages handlers to accept Relay pagination and Lesser mutation names.
- Adjust codegen and lint configs to ensure future schema updates are reproducible.

## Phase 2 – Model & Store Extensions

- Extend shared TypeScript types (`packages/fediverse/src/generics/index.ts`, `packages/fediverse/src/types.ts`) with Lesser-specific fields (cost, trust, quotes, community notes) and update derived DTOs.
- Update timeline/notification/list/conversation stores to persist new metadata and expose selectors consumed by compound components.
- Adapt UI components (Status, Notifications, Lists, Messages) to render the enriched data or translate ActivityPub objects where required.

## Phase 3 – Real-time & Transport Coverage

- Expand `TransportEventMap`, `TransportManager`, and related stores to cover all Lesser subscriptions (quoteActivity, cost/trust/moderation updates, hashtag activity, metrics).
- Wire timeline, notification, and admin dashboards to consume the new streams; add configuration hooks for list/hashtag timelines.
- Document subscription usage patterns for integrators.

## Phase 4 – Feature Parity Enhancements

- Implement quote creation/display flows in Compose/Status components, including permissions and counters.
- Build community notes UI/Moderation tooling, AI insight panels, trust graph visualisations, cost dashboard overlays, thread sync controls, severed relationship recovery admin tools, and hashtag follow management.
- Ensure adapters expose necessary mutations/queries and reuse shared translations where possible.

## Phase 5 – Documentation & Storybook Refresh

- Update `docs/components/Admin/*.md`, `docs/lesser-integration-guide.md`, README snippets, and Storybook stories to reflect Lesser-native APIs and flows.
- Provide migration notes and configuration guidance for new features and subscription usage.

## Phase 6 – Validation & Release Readiness

- Add unit/integration tests for new schema shapes, adapters, UI flows, and subscription handling (Relay pagination, note creation, admin REST fallbacks).
- Prepare release notes, version bumps, and change logs summarising schema changes and new integration hooks.