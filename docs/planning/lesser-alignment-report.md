# Lesser ⇄ Greater Components Alignment Report

> **Authority:** Lesser backend specification  
> **Objective:** Ensure `@equaltoai/greater-components-fediverse` and related packages deliver 100% feature parity and schema alignment with the current Lesser implementation.

---

## 1. GraphQL Contract Gaps

| Area | Current Behaviour | Lesser Requirement | Resolution |
| --- | --- | --- | --- |
| Timeline queries | `packages/fediverse/src/adapters/graphql/queries.ts:102` expects `timeline.items` (non-Relay), omits mandatory `TimelineType`. | Lesser exposes Relay-style `ObjectConnection` with `first/after` pagination (`lesser/graph/schema.graphql#L606`). | Regenerate queries against Lesser schema (use Relay pagination fields, require `type`). |
| Mutations | Client calls `createStatus`, `deleteStatus`, etc. (`packages/adapters/src/graphql/LesserGraphQLAdapter.ts:236`). | Backend only provides `createNote`, `deleteObject`, `shareObject`, etc. (`lesser/graph/schema.graphql#L682`). | Replace mutation documents & adapter methods with Lesser equivalents; update Compose handlers accordingly. |
| Search | Query returns `actors/notes/tags` fields (`packages/fediverse/src/adapters/graphql/queries.ts:171`). | Lesser’s `search` returns `accounts/statuses/hashtags` (`lesser/graph/schema.graphql#L607`). | Rename response mapping and DTOs to match `accounts/statuses/hashtags`. |
| Lists & conversations | Adapter expects bespoke fields (`packages/fediverse/src/components/Lists/context.ts:17`, `packages/fediverse/src/components/Messages/context.ts:27`). | Lesser returns `List` with `repliesPolicy/exclusive` and `Conversation` containing ActivityPub `Object` (`lesser/graph/schema.graphql#L316`). | Update type definitions, context models, and UI bindings to consume Lesser shapes or add translation layer in adapters. |
| Admin docs | Guides reference `adminStats`, `adminUsers`, `suspendUser` GraphQL (`docs/components/Admin/Root.md:864`). | Lesser currently serves admin operations via Lift routes (`lesser/cmd/api/lift/admin.go:167`); no GraphQL exposure. | Revise documentation and adapters to call REST/Lift endpoints until GraphQL is implemented. |

### Required Actions

- Run code generation (e.g., `graphql-code-generator`) against `lesser/graph/schema.graphql`.
- Replace bundled query strings with generated documents.
- Update TypeScript interfaces to mirror Lesser schema names.
- Adjust adapters (`packages/adapters/src/graphql`) and Compose/Search/List/Messages handlers to process the new shapes.
- Provide integration tests covering Relay pagination, note creation, and admin flows.

---

## 2. Data Model & Store Misalignments

| Component | Missing/Incorrect Fields | Lesser Source | Resolution |
| --- | --- | --- | --- |
| `GenericStatus` & `Status` | Lacks `estimatedCost`, `moderationScore`, `communityNotes`, quote metadata (`packages/fediverse/src/generics/index.ts:246`). | `lesser/graph/schema.graphql#L98`. | Extend `GenericStatus` & `Status` TS models; update adapters to populate new properties. |
| Notifications | Store only handles base Mastodon types (`packages/fediverse/src/types.ts:112`). | Lesser supports identical types plus additional metadata (community notes, cost events). | Add extra notification payload fields and grouping logic to accommodate new metadata. |
| List models | Use `visibility` string (`packages/fediverse/src/components/Lists/context.ts:17`). | Lesser uses `repliesPolicy` & `exclusive` boolean. | Map Lesser fields to UI (e.g., convert `repliesPolicy` into display options) or change component props to accept native fields. |
| Conversation models | Expect `DirectMessage` objects (`packages/fediverse/src/components/Messages/context.ts:27`). | Lesser provides ActivityPub `Object` references for `lastStatus` and conversation threads. | Build transformation utilities (e.g., convert `Object` → `GenericStatus`) or update Messages components to consume ActivityPub objects directly. |
| Admin metrics | Components expect aggregated stats / analytics. | Lesser exposes metrics via REST (`instanceMetrics` query, Lift endpoints). | Add mapper-wrappers converting REST/GraphQL responses to `AdminStats`, `AdminUser`, etc., or refactor components to fetch through new adapters. |

### Required Actions

- Introduce canonical TypeScript types for Lesser-only fields.
- Update stores (`timelineStore`, `notificationStore`) to persist new metadata; adjust rendering to expose cost/trust/quote indicators.
- Add adapters that translate Lesser responses into the compound component context state.
- Expand unit tests to cover new properties and error paths.

---

## 3. Real-time & Streaming Coverage

| Stream | Support Status | Lesser Support | Resolution |
| --- | --- | --- | --- |
| Status & notification updates | Handled (`packages/fediverse/src/lib/timelineStore.ts:87`, `lib/transport.ts:24`). | Supported in Lesser subscriptions. | Ensure new timeline types (`LIST`, `HASHTAG`) are selectable via config. |
| Quote activity | Not handled anywhere. | `quoteActivity` subscription (`lesser/graph/schema.graphql#L794`). | Extend `TransportManager` events (`'quote.activity'`) and UI (Status components) to react to quote updates. |
| Cost/trust/moderation metrics | Missing event listeners (`transport.ts:23`). | Subscriptions `costUpdates`, `trustUpdates`, `moderationEvents` (`lesser/graph/schema.graphql#L786`). | Add events to transport, create stores/indicators (e.g., badge overlays, dashboards). |
| Hashtag activity | Not supported. | `hashtagActivity` subscription (`lesser/graph/schema.graphql#L797`). | Update Notification/Timeline integrations to subscribe when hashtags followed; expose UI surfaces. |
| Metrics dashboards | Absent. | `metricsUpdates` subscription and `instanceMetrics` query. | Build admin/observability components or integrate with Settings/Admin panels. |

### Required Actions

- Expand `TransportEventMap` & `TransportManager` to cover all Lesser subscription payloads.
- Create specialized stores (cost, trust, hashtag) feeding new UI components.
- Wire timeline/notification integrations to subscribe to hashtag/list-specific channels.
- Document new real-time capabilities for integrators.

---

## 4. Feature Coverage Beyond Mastodon Parity

| Feature | Backend Availability | Frontend Status | Resolution |
| --- | --- | --- | --- |
| Quote posts | GraphQL fields & mutations in Lesser (`lesser/graph/schema.graphql#L741`). | No UI controls for quote toggles, counts, or quote lists. | Extend Status compound component with quote indicators, compose support (`createQuoteNote`, permissions). |
| Community Notes | `Object.communityNotes` and mutations (`lesser/graph/schema.graphql#L122`, `#L734`). | Missing from Status/Moderation components. | Add UI modules for displaying, voting, and creating community notes; expose handlers via ModerationTools. |
| AI analysis & capabilities | Queries & subscriptions (`lesser/graph/schema.graphql#L648`). | No frontend integration. | Create AI insights panel/widgets; update Admin or Status components to display detection results and request analyses. |
| Trust graph | `trustGraph` query & `trustUpdates` subscription (`lesser/graph/schema.graphql#L641`, `#L788`). | Unused. | Develop trust score badges, trust relationship visualisations, and handler hooks. |
| Cost dashboard | `CostBreakdown` query & `costUpdates` subscription (`lesser/graph/schema.graphql#L640`, `#L786`). | Absent. | Provide admin cost dashboard component; integrate with timeline to display per-post cost overlays using `estimatedCost`. |
| Thread synchronization | `threadContext`, `syncThread` mutations (`lesser/graph/schema.graphql#L665`, `#L759`). | ThreadView only renders provided replies. | Add controls to trigger sync operations and display fetching status. |
| Severed relationships recovery | Queries/mutations (`lesser/graph/schema.graphql#L668`, `#L762`). | No UI. | Implement admin/moderation panels (possibly within Admin suite) to surface severed relationships and recovery actions. |
| Hashtag follow controls | Mutations (`lesser/graph/schema.graphql#L749`). | No components to manage notifications/muted hashtags. | Extend Filters or Timeline settings to manage hashtag follow state and notification levels. |

### Required Actions

- Prioritize feature parity worklist; allocate component owners.
- Design UI/UX for each Lesser-specific capability; leverage existing compound patterns.
- Update documentation & Storybook with Lesser scenarios once components ship.

---

## 5. Documentation & Integration Guidance

| Document | Issue | Required Update |
| --- | --- | --- |
| `docs/components/Admin/*.md` | Promises GraphQL endpoints that do not exist. | Rewrite to point at Lift admin REST endpoints and outline current GraphQL roadmap. |
| `docs/lesser-integration-guide.md` | Lacks coverage of new Lesser-exclusive features (AI, cost, trust, quotes). | Expand guide with configuration, handler expectations, and UI hooks for each feature. |
| Storybook examples | Demonstrate Mastodon data only. | Add stories fed by Lesser mock data covering cost, quotes, community notes, etc. |
| README snippets | Reference outdated adapter APIs (e.g., `createTimelineStore({ server, timeline })`). | Update to show new config fields (TimelineType enum, hashtag/list parameters). |

### Required Actions

- Audit documentation for Lesser-specific instructions.
- Provide migration notes for consumers upgrading to the aligned release.
- Ensure API reference tables match backend naming and enums verbatim.

---

## Implementation Roadmap

1. **Schema Sync**
   - Regenerate GraphQL queries/mutations/subscriptions.
   - Update adapters, Compose/Search handlers, unit tests.
2. **Model Extensions**
   - Expand status, notification, list, and conversation types.
   - Update stores and compound components to accept new fields.
3. **Real-time Enhancements**
   - Support all subscription event types.
   - Build auxiliary stores & UI indicators.
4. **Feature Parity**
   - Implement UI workflows for quotes, community notes, AI, trust, cost, thread sync, severed relationships, hashtag controls.
5. **Docs & Examples**
   - Refresh integration guides, Storybook stories, README usage.
6. **Validation & Release**
   - Add regression tests (unit + integration).
   - Coordinate release notes and version bumps across packages.

---

## Traceability Matrix

| Gap ID | Files Impacted | Owners / Next Steps |
| --- | --- | --- |
| GQL-01 Timeline schema mismatch | `packages/fediverse/src/adapters/graphql/*.ts`, `packages/adapters/src/graphql/*.ts` | Re-run codegen; update timeline components. |
| GQL-02 Mutations mismatch | Same as above, plus Compose handlers | Replace `createStatus` with `createNote`; adjust Compose GraphQL adapter. |
| DATA-01 Status metadata missing | `generics/index.ts`, `types.ts`, `Status/*` | Extend models; surface UI elements (cost, quotes, notes). |
| RT-01 Missing subscription coverage | `lib/transport.ts`, new stores/components | Add event types; create components for trust/cost/quote streams. |
| FEAT-01 Quote post UI absent | `components/Status`, `components/Compose` | Implement quote actions and composer support. |
| FEAT-02 Community notes UI absent | `patterns/ModerationTools`, new note components | Build community notes views and handlers. |
| DOC-01 Admin docs outdated | `docs/components/Admin`, `docs/lesser-integration-guide.md` | Rewrite sections; supply REST integration examples. |

---

## Deliverable Expectations

- All components must operate correctly against a live Lesser deployment without ad-hoc adapters.
- Storybook and docs must present Lesser-native scenarios by default.
- Automated tests should validate Lesser-specific behaviours (quotes, cost, trust, AI, hashtag following, thread sync, severed relationships).
- Release notes must highlight schema changes and new integration hooks for consumers.

---

*Prepared for the Lesser platform team to guide alignment workstreams between the backend authority and Greater Components frontend toolkit.*
