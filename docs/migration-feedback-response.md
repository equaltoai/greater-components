# Greater Components Migration Feedback – Response Plan

_Last updated: 2025-11-11 • Contact: @equaltoai/greater-components maintainer team_

This document summarizes how we are addressing the feedback collected during the current migration effort. Each section links to the relevant docs, examples, or upcoming work so the entire team can track progress at a glance.

---

## 1. Timeline Integration (High Priority)

| Need                                                                          | Response                                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| “How do we bridge existing timeline stores to `TimelineVirtualizedReactive`?” | We now have a dedicated integration overview in `docs/components/Timeline/README.md` plus a runnable cookbook in `packages/fediverse/src/examples/realtime-usage.md`. These docs walk through configuring `TimelineIntegrationConfig`, wiring transports, and mapping store actions. |
| Lack of `TimelineIntegrationConfig` explanation                               | Added inline reference tables (props, defaults, event flow) to the Timeline docs and linked directly to `createTimelineIntegration` in `packages/fediverse/src/lib/integration.ts`.                                                                                                  |
| Migration path from custom stores                                             | `RealtimeWrapper` + integration examples now show how to wrap an existing store while gradually adopting GC stores. We’ll add a “Custom Store Adapter” example next sprint (see §7.2).                                                                                               |

**Action Items**

1. ✅ Update Timeline docs/example cookbook (complete).
2. 🔜 Publish “custom store bridge” snippet once adapter helper is finalized.

---

## 2. ComposeBox & Auth Tokens (Medium Priority)

| Question                              | Guidance                                                                                                                                                                                                              |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| How should ComposeBox receive tokens? | Compose handlers accept any async function. Recommended pattern: inject a `tokenProvider` that returns a fresh token per submission. Example added to `docs/components/Compose/Root.md` (“Auth Integration” section). |
| Is there an Auth context provider?    | Not yet. Compose works with either GC Auth or your own auth flow. We documented both paths: (a) wrap GC Auth stores, or (b) continue using `secureAuthClient.getToken` and pass handlers explicitly.                  |
| Should we migrate to GC Auth?         | Optional. Docs now outline pros/cons and how to keep existing auth while adopting ComposeBox.                                                                                                                         |

**Action Items**

1. ✅ Added “Auth Integration & Token Handling” to Compose docs.
2. 🔜 Evaluate helper for shared token context (tracked separately).

---

## 3. StatusCard Prop Reference (Medium Priority)

| Need                                 | Response                                                                                                                                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| “Complete prop docs for StatusCard.” | Added `docs/components/Status/README.md` appendix that enumerates every prop/event/slot for `StatusCard`, `Status.*` compounds, and action handlers, including quote/thread support notes. |
| Custom action bar guidance           | Provided examples showing how to slot in `Status.Actions` or replace the action row entirely.                                                                                              |

---

## 4. Migration Guide & Real-time Examples (High Priority)

- ✅ `docs/migration/using-fediverse-components.md` (new) steps through:
  - Aligning existing stores with GC integrations
  - Auth/token strategies
  - Styling/theming hooks
  - CSR vs SSR considerations
- ✅ Real-time integrations: `packages/fediverse/src/examples/realtime-usage.md` now covers GraphQL subscriptions, WebSocket lifecycle, optimistic updates, and failure handling.

---

## 5. Component API Reference (Medium Priority)

- For each Fediverse compound (`Timeline`, `Status`, `Compose`, `Notifications`), we now maintain:
  - Prop tables (type, default, description)
  - Event callback signatures
  - Slot names + payloads
  - Related helper utilities
- References live under `docs/components/<Component>/README.md` for easy linking from product docs.

---

## 6. API Improvements & Roadmap

### 6.1 Adapter Token Getter (Medium Priority)

- **Plan:** extend `GraphQLConfig` so `token` may be `string | (() => MaybePromise<string>)`.
- **Status:** spec drafted; implementation scheduled for next release cycle. Until then, wrap `createLesserClient` and call `client.setToken(await getToken())` before requests.

### 6.2 Timeline Store Adapter Pattern (High Priority)

- **Plan:** introduce `createTimelineAdapter` helper that accepts `getItems`, `loadMore`, `refresh`, etc., returning a `TimelineIntegrationConfig` compatible object.
- **Status:** design in progress; doc placeholders ready. For now, follow the “Manual Store Management” example in `realtime-usage.md` and connect your store to `createTimelineIntegration`.

### 6.3 Component Composition Guidance (Low Priority)

- Added a comparison table in `docs/components/Status/README.md` describing when to use legacy single components (`StatusCard`, `ComposeBox`) vs. the compound APIs (`Status.*`, `Compose.*`). Includes future deprecation timeline and perf considerations.

---

## 7. Documentation Backlog

| Topic                                                   | Priority | Status                                                  |
| ------------------------------------------------------- | -------- | ------------------------------------------------------- |
| GraphQL client setup (shared instance vs per component) | Medium   | Added to migration guide & Compose docs                 |
| Token/auth integration FAQ                              | Medium   | Added to Compose + Auth docs                            |
| Store integration FAQ                                   | High     | Added to Timeline docs, more coming with adapter helper |
| Optimistic updates & WS reconnection                    | High     | Covered in realtime example doc                         |

---

## 8. Open Questions / Next Steps

1. **Token Getter API** – finalize implementation & update adapter docs.
2. **Timeline Adapter Helper** – deliver helper + cookbook for existing stores.
3. **Auth Context Helper** – evaluate whether a lightweight provider would simplify Compose/Timeline usage.
4. **StatusCard-to-Status Migration Examples** – add a specific comparison doc for teams still on `StatusCard`.

Please continue filing feedback in `docs/issues/` or GitHub. We’ll keep this response doc in sync as items ship.
