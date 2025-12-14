# Artist Face Coverage Gap Plan (Post Phases 1–3)

## Snapshot (from latest `pnpm test:coverage:report`)

- Aggregated report (`coverage/combined-coverage.json`): **faces/artist** Lines/Statements `54.66%`, Functions `52.62%`, Branches `42.04%`.
- Package report (`packages/faces/artist/coverage/index.html`): Lines `59.02%`, Statements `54.66%`, Functions `52.61%`, Branches `42.04%`.

Where we’re still behind is overwhelmingly **`src/components`**.

Directory rollup (from `packages/faces/artist/coverage/lcov.info`):

- `src/components`: `48.80%` (1927/3949)
- `src/stores`: `82.69%` (449/543)
- `src/patterns`: `74.06%` (588/794)
- `src/utils`: `73.91%` (595/805)
- `src/subscriptions`: `71.83%` (51/71)
- `src/adapters`: `100.00%` (66/66)

Component group rollup (from `lcov.info`, worst → best):

- `Community`: `34.53%`
- `CreativeTools`: `36.12%`
- `Monetization`: `37.50%`
- `Exhibition`: `37.59%`
- `Transparency`: `47.00%`
- `ArtistProfile`: `56.10%`
- `Gallery`: `62.21%`
- `Artwork`: `64.89%`
- `Discovery`: `70.62%`

## Social’s Coverage Playbook (What Worked)

Social’s “coverage lift” is primarily driven by a **scenario-based component coverage harness**, plus a few focused behavior tests for the branchy components.

Key patterns to copy:

1. **Scenario Harness for Components**
	- `packages/faces/social/tests/components/coverage-harness.ts` defines a `componentsToCover` map: component → scenarios.
	- Each scenario is a “mini-story”: props + optional wrapper (Root/context provider) + optional `action()` to click/type and hit branches.
	- `packages/faces/social/tests/components/coverage.test.ts` iterates every scenario and renders them all.
	- `packages/faces/social/tests/components/Wrapper.svelte` is a tiny generic wrapper that optionally mounts the component under a Root/context component.

2. **Small Svelte “Harness Components” for Complex Context**
	- Example: `packages/faces/social/tests/components/Filters/EditorTest.svelte` and `packages/faces/social/tests/components/Lists/EditorTest.svelte`.
	- These wire up Root + initialState + handlers once, so tests can focus on interaction branches (create/edit/validation/loading/error).

3. **Realistic Fixtures + Minimal Fakes**
	- Social uses consistent mock shapes (`src/mockData`) + test fakes/helpers so components don’t short-circuit early.
	- “Valid minimal data” is the difference between “renders without error” vs. actually executing the conditional branches.

4. **Actions to Hit Branches**
	- Many components have branches gated behind a click (menus/modals), role (own profile), or state (loading/empty/error).
	- Social bakes these into `action()` per scenario so branch coverage moves quickly.

## Artist Gap Diagnosis (Why components are lagging)

The current Artist smoke tests are a good baseline, but several scenarios are “too empty” (or pass invalid prop shapes), so branches never execute.

Examples of high-impact misses:

- `src/components/Monetization/DirectPurchase.svelte` is rendered with a `pricing` object that doesn’t match the component’s expected structure, so tabs/content never show.
- `src/components/Exhibition/Gallery.svelte` is rendered with `artworks: []`, so most branches inside `#each` never run (and other layouts aren’t exercised).
- `src/components/CreativeTools/WorkInProgress/Compare.svelte` is gated behind `comparison.isActive`, which defaults `false`.

### 0%-covered files to eliminate immediately

From `lcov.info` (0/lines):

- `src/components/ArtistProfile/Sections.svelte`
- `src/components/Community/Collaboration/Project.svelte`
- `src/components/CreativeTools/WorkInProgress/VersionCard.svelte`
- `src/components/CreativeTools/WorkInProgress/VersionList.svelte`

## Plan: Close the Gap Using the Social Playbook

### Phase A — Add an Artist “Coverage Harness” (1 day)

**Goal:** Ensure every component has at least one “valid minimal scenario” and the harness becomes the default place to add coverage for new components.

- Add an Artist harness modeled after Social:
	- `packages/faces/artist/tests/components/coverage/coverage-harness.ts`
	- `packages/faces/artist/tests/components/coverage/coverage.test.ts`
	- `packages/faces/artist/tests/components/coverage/Wrapper.svelte`
- Start by migrating the existing smoke component lists into the harness (so one place owns “component exists and renders with realistic props”).
- Require each scenario to use **valid props** (no “wrong shape” placeholders) so the component actually renders meaningful UI.
- Include `action()` per scenario for at least:
	- opening modals/panels,
	- toggling tabs,
	- changing a select/radio,
	- pressing Enter/Space for keyboard branches.

**Definition of done:** harness renders all scenarios in one test file without flakes, and covers the 4 remaining 0%-files.

### Phase B — Fix the 4 Zeroes + Top Uncovered Components (1–2 days)

Use the harness to add targeted scenarios (these are quick wins that move both lines and branches):

- **ArtistProfile.Sections**
	- Scenario 1: non-editing mode with mixed visible/hidden sections.
	- Scenario 2: editing mode (show controls), toggle visibility branch.
	- Scenario 3: drag-and-drop reorder triggers `onSectionReorder` (use a minimal `DataTransfer` mock).
- **Collaboration.Project**
	- Scenario 1: viewer role (no status select).
	- Scenario 2: owner role (status select visible) + trigger `onStatusChange`.
	- Include `deadline` and `updates` to hit timeline + recent activity branches.
- **WorkInProgress.VersionList**
	- Provide updates with and without image media to hit thumbnail vs placeholder branches.
	- Trigger both click and keyboard (Enter/Space) navigation.
- **WorkInProgress.VersionCard**
	- Scenario 1: showReactions `true` + handler to cover `onLikeUpdate`.
	- Scenario 2: showReactions `false` branch.
	- Provide `progress`, `likeCount`, `commentCount` to hit all sub-branches.

Then tackle the largest uncovered component files (by uncovered lines):

- `src/components/Monetization/DirectPurchase.svelte`
	- Scenarios: original (available/sold/inquiryOnly), prints selection + quantity bounds, licenses selection, inquiry modal open/close + submit success/error, purchase success/error.
- `src/components/Monetization/ProtectionTools.svelte`
	- Scenarios: open each panel (report/watermark/search/dmca), submit with handlers, validate “disabled submit” branch (empty description), reverse search results rendered.
- `src/components/CreativeTools/WorkInProgress/Compare.svelte`
	- Scenario: set `comparison.isActive = true`, switch modes (side-by-side/slider/overlay), move slider, adjust opacity, change versions.
- `src/components/Exhibition/Gallery.svelte`
	- Scenarios: `layout = gallery` with artworks, `layout = narrative` with description/metadata branches, `layout = timeline` with multiple years.
- `src/components/ArtistTimeline.svelte`
	- Provide entries to hit empty vs populated, date formatting, and any optional sections.

### Phase C — Raise Branch Coverage with a Scenario Matrix (2–4 days)

**Goal:** push branches from ~42% → **≥60%** (Social is ~64%).

Add scenario matrices for the low groups:

- **Community**
	- CritiqueCircle: queue empty vs populated, active session vs none, members list variants.
	- Collaboration: uploads empty vs populated, split valid vs invalid, contributor vs owner role.
	- MentorMatch: empty mentors, populated mentors, different userRole.
- **CreativeTools**
	- WorkInProgress: owner vs viewer, thread with 0 updates vs multiple updates, completed vs abandoned status.
	- CritiqueMode: annotations on/off, keyboard interactions.
- **Transparency**
	- `Transparency/AIDisclosure.svelte`: variants `badge`/`inline`/`detailed`, expandable true/false, tools list with/without version/description, provider/model branches, keyboard toggle.
	- `AIOptOutControls.svelte`, `EthicalSourcingBadge.svelte`, `ProcessDocumentation.svelte`: exercise each prop-driven branch and interactive control.

### Phase D — Add 3–5 Focused “Behavior Tests” (1–2 days)

Use Social’s approach for complex stateful components: create tiny Svelte harness apps that wire context/handlers once, then test interaction branches.

Recommended additions:

- `tests/components/behavior/CreativeTools.behavior.test.ts`
- `tests/components/behavior/Community.behavior.test.ts`
- `tests/components/behavior/Exhibition.behavior.test.ts`
- `tests/components/behavior/Transparency.behavior.test.ts`

These should assert more than “no errors”: confirm visible UI state changes and handler calls.

### Phase E — Enforce + Prevent Regression (0.5–1 day)

- Add a per-package “ratchet” goal for Artist:
	- Short term: Lines/Statements ≥ **70%**, Branches ≥ **55%**
	- Next: Lines/Statements ≥ **75%**, Branches ≥ **60%** (match repo threshold)
	- Target: Lines/Statements ≥ **85%**, Branches ≥ **70%**
- Consider enabling per-package minimums in `scripts/aggregate-coverage.js` once Artist reaches a stable baseline (it currently warns but does not fail).
- Optional: add a test that enumerates `src/components/**/*.svelte` and ensures each is referenced by the harness (keeps new components from landing uncovered).

## Workflow (Repeatable Loop)

1. Run `pnpm --filter @equaltoai/greater-components-artist test:coverage`.
2. Use `packages/faces/artist/coverage/index.html` to locate the worst files.
3. Add 1–3 harness scenarios (with actions) for those files.
4. Repeat until the group rollups (Community/CreativeTools/Monetization/Exhibition/Transparency) converge toward Social’s profile.

