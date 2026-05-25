---
'@equaltoai/greater-components-artist': minor
---

Resolve 21 svelte-check errors + 1 warning across 13 files in `faces/artist`. Most fixes are pure type-narrowing; two are additive public-API expansions that escalate this changeset to **minor**; one fixes a latent runtime bug that was previously sending the wrong payload type to consumer purchase handlers.

### Type-narrowing fixes (patch-impact; no behavior change)

- **`ArtistProfile/HeroBanner.svelte`** (1) — replace forbidden `!` assertion on `heroArtworks[currentIndex]` with optional-chaining guard.
- **`ArtistProfile/Timeline.svelte`** + **`ArtistTimeline.svelte`** (2) — `IntersectionObserver` callback's `entries[0]` narrowed via local guard.
- **`MediaViewer/Root.svelte`** + **`MediaViewer/ZoomControls.svelte`** (4 errors / 2 files) — `let closest = ZOOM_LEVELS[0]` inferred the literal `0.5` type; widened the accumulator to `number` so any zoom level can be assigned during the loop. `ZOOM_LEVELS.indexOf(normalized)` widened with element-type assertion.
- **`MediaViewer/Root.svelte`** (4) — `TouchEvent.touches[0]` / `changedTouches[0]` narrowed via local guards (no behavior change; AT-level contracts guarantee at least one entry but TS can't infer it).
- **`PortfolioSection.svelte`** (1) — guard `splice`-extracted item before reinserting.
- **`CritiqueMode/Annotations.svelte`** (2) — `noUncheckedIndexedAccess` on `categoryColors[...]` lookup + `noPropertyAccessFromIndexSignature` on `categoryColors.other` → bracket notation + `??` fallback chain.
- **`WorkInProgress/Comments.svelte`** (1) — guard `thread.updates[index]` before reading `.id`.
- **`Monetization/DirectPurchase.svelte`** (1 of 2) — guard `tabs[0]` before initial-tab assignment.
- **`Collaboration/Gallery.svelte`** (1) — explicit type annotation on the `.filter(...)` predicate parameter (was `implicit any`).
- **`Artwork/Stats.svelte`** (1 warning) — drop empty hover ruleset that was retained only for transition-reference; the relevant transition is declared on the parent rule directly.

### Additive minor API surface (escalates to minor)

- **`types/artist.ts`** — add optional `displayName?: string` to `ArtistData`. Two `Community/{CritiqueCircle/Members,Collaboration/Contributors}.svelte` files (which reach this type via `types/community.ts:CritiqueCircleMember` → `types/artist.ts:ArtistData`) read `member.artist.displayName` which was not declared on the type. Documented as "alternative display name; falls back to `name` when absent". Useful for consumers integrating Mastodon-shaped data (whose `display_name` field maps here).

- **`Community/CritiqueCircle/Members.svelte`** + **`Community/Collaboration/Contributors.svelte`** — render `{member.artist.displayName ?? member.artist.name}` so a type-valid artist with only `name` (the required field) renders correctly. Without this fallback, the new optional `displayName` field would render empty for consumers who don't supply it.

Note: the `ArtistProfile/*` and `ArtistTimeline.svelte` components use a **different** `ArtistData` (declared in `ArtistProfile/context.ts`) where `displayName` is **required** and there is no `name` field. Those sites already render correctly and are not modified.
- **`ArtworkCard.svelte`** — add `'featured'` to the `variant?` prop union. `PortfolioSection.svelte` was already passing `variant={layout === 'featured' ? 'featured' : 'grid'}` (matching its own layout union), but `ArtworkCard.variant` was missing `'featured'`. Adding it closes the contract gap; the rendered CSS uses `gr-artist-artwork-card--featured` class which falls through to default card styling (no new CSS shipped in this PR; follow-up can add explicit featured-variant styling).

### Latent runtime bug fix (matches declared type contract)

- **`Monetization/DirectPurchase.svelte`** (2 errors) — `TabType` (UI-tab identifier, `'original' | 'prints' | 'licenses'`) was assigned directly to `PurchaseOptions.type` (singular API payload form, `'original' | 'print' | 'license'`). Previous code silently sent `'prints'` / `'licenses'` to consumer `onPurchase` handlers, violating the documented `PurchaseOptions.type` contract. Mapping is now explicit: `activeTab === 'original' ? 'original' : activeTab === 'prints' ? 'print' : 'license'`. Consumers whose handlers were typed correctly (against `PurchaseOptions['type']`) were already expecting singular — this fix delivers what the type contract promised. No new consumer-facing capability; correcting the producer to match the declared shape.

Workspace `check:svelte` now reports 0 errors / 0 warnings across all 5 enumerated packages. `faces/artist` test suite: 1060 passed + 2 skipped (90 test files). Part of Project 41 (#680) workspace svelte-check parity restoration.
