# Coverage Improvement Plan v2 (Target: ≥80% Overall)

Baseline from the latest `pnpm test:coverage:report` (`coverage/combined-coverage.json`):

- Lines/Statements: **72.88%** (16,989 / 23,311) → need ~1,660 more covered lines.
- Functions: **70.42%** (2,892 / 4,107) → need ~394 more covered functions.
- Branches: **54.88%** (7,270 / 13,246) → need ~3,327 more covered branches.

Per‑package minimums are still 60% for all four metrics, but to guarantee the overall goal,
we should drive **every package to ≥80% branches** and the two biggest laggards to ≥80% across
all metrics.

Current packages below target (branches / lines):

- `faces/social`: **35.78% branches**, 49.16% lines (2,585 branches total).
- `adapters`: **38.19% branches**, 49.33% lines (2,184 branches total).
- `primitives`: 58.67% branches (1,459 branches total).
- `cli`: 66.93% branches (1,675 branches total).
- `icons`: 50.33% branches (612 branches total).
- `shared/messaging`: 16.85% branches, 20.16% lines (all Svelte components at 0%).
- `shared/search`: 21.71% branches, 22.81% lines (all Svelte components at 0%).
- `faces/community`: 41.18% lines (tiny, but below minimum).

---

## 1) Fix the Two Biggest Drivers (Weeks 1–2)

### 1A. `packages/faces/social` → ≥80% lines/functions/branches

**What’s happening:** 45 Svelte components under `src/components/**` are still at 0% coverage
and account for most of the missing branches/lines.

**Priority list (0% + highest branch counts):**

1. `src/components/NotificationsFeedReactive.svelte` (104 branches)
2. `src/components/TimelineVirtualizedReactive.svelte` (71)
3. Profile components: `FeaturedHashtags`, `Edit`, `FollowersList`, `EndorsedAccounts`,
   `FollowRequests`, `PrivacySettings`, `FollowingList`, `AccountMigration`, `Header`, `Root`, etc.
4. Timeline/Status/List/Filter components in the 0% set (`Timeline/Root`, `Timeline/Item`,
   `Status/Actions`, `Status/Media`, `Lists/*`, `Filters/Editor`, …).

**Testing approach:**

- Use @testing‑library/svelte or `mount` to render each uncovered component with a minimal harness.
- Reuse existing fixtures in `packages/faces/social/tests/fixtures` and `src/mockData.ts`.
- For each component, cover at least:
  - empty vs populated state,
  - loading vs loaded,
  - error/fallback UI paths,
  - one interactive branch (click/keyboard) if events exist.
- Add 1–2 parameterized variant tests for components with prop‑driven conditionals (visibility,
  media types, moderation state, etc.).

**Why this works:** Bringing these components from 0% to even ~60–70% will add hundreds of
branches quickly; pushing the whole package to ≥80% removes ~1,143 branch deficit and
~1,217 line deficit by itself.

### 1B. `packages/adapters` → ≥80% lines/functions/branches

**What’s happening:** A few core logic files remain mostly untested and dominate branch counts.

**Must‑cover files (by uncovered branches/lines):**

1. `src/mappers/lesser/mappers.ts` (0% lines, **434 branches**)  
   - Add unit tests for every mapper entry point (all entity types) plus “unknown/partial data”
     fallbacks and optional‑field branches.
2. `src/stores/unifiedToTimeline.ts` (0% lines/branches)  
   - Tests for conversion of each unified type, ordering, and null/empty input.
3. `src/graphql/LesserGraphQLAdapter.ts` (~9% lines / 15% branches)  
   - Test query/mutation builders, pagination cursors, semantic flags, and all error paths.
4. `src/stores/timelineStore.ts` (~21% lines / 16% branches, **467 branches total**)  
   - Cover: initial load, pagination, optimistic insert/delete, merge conflicts, and handler rejection.
5. `src/stores/fetchHelpers.ts` (~3% lines / 0% branches)  
   - Cover success, non‑2xx, timeout, abort, and retry branches.

**Testing approach:**

- Pure TS unit tests with `vi.mock` for fetch/websocket; no real network.
- Pull realistic payload fixtures from `packages/testing` (GraphQL + transport patterns).
- Use table‑driven tests to enumerate option permutations (this is where most branches live).

**Target:** Raise these five files to ≥80%; the rest of the package is already near/above target.
This closes ~914 branches and ~853 lines deficit.

After 1A+1B, re‑run `pnpm test:coverage:report`. Overall lines/functions should be close to or above 80,
but branches will still need a final push from the remaining packages.

---

## 2) Push Remaining Branch Laggers to ≥80% (Weeks 2–3)

### 2A. `packages/primitives` (58.67% branches)

**Gaps:** Small but numerous 0% utilities + a few conditional‑heavy components.

- Add tests for 0% files:
  - `src/components/Alert.svelte`
  - `src/utils/smoothThemeTransition.ts`
  - `src/transitions/{slideIn,scaleIn,fadeDown,fadeUp}.ts`
  - `src/components/SimpleMenu.svelte`
  - `src/components/Menu/Header.svelte`
- Expand prop‑matrix tests for:
  - `Menu/Content.svelte`, `Menu/Item.svelte`, `Menu/positioning.ts`
  - `Heading.svelte`, `ListItem.svelte`
  - Theme tools (`ColorHarmonyPicker`, `ThemeProvider`) to hit conditional branches.

Target gain: **+312 branches**.

### 2B. `packages/icons` (50.33% branches)

**Gaps:** Every icon component has a two‑branch pattern (likely `title`/`aria` conditional),
and tests only exercise one side.

- Add a single parameterized test that:
  - Imports all icon components from `src/icons/*`,
  - Renders each twice: once with the optional prop present, once absent.
- This should push most icons to ~100% branches with minimal code.

Target gain: **+182 branches**.

### 2C. `packages/cli` (66.93% branches)

**Gaps:** option/error permutations for core commands.

Focus tests on low‑branch files:

- `src/commands/{init,add,update,doctor,list}.ts`
- `src/utils/{face-installer,security,fetch}.ts`

Add cases for:

- missing/invalid args,
- invalid config,
- registry/network failures (mocked),
- interactive prompts aborted or defaulted,
- “already installed / no‑op” branches.

Target gain: **+219 branches**.

### 2D. `shared/messaging` + `shared/search` (all components 0%)

**Gaps:** Context is covered; UI components are not.

- Messaging components to mount + branch‑test:
  - `MediaUpload.svelte` (success/failure, sensitive toggle, no‑file guard)
  - `NewConversation.svelte` (empty results, selection, create failure)
  - `ConversationPicker.svelte`, `Composer.svelte`, `UnreadIndicator.svelte`,
    plus lightweight smokes for the rest.
- Search components:
  - `FederatedSearch.svelte`, `Bar.svelte`, `Results.svelte`,
    `ActorResult/NoteResult/TagResult.svelte`, `Filters.svelte`, `Root.svelte`.
  - Cover empty/loading/error/results branches and follow‑toggle if present.

Target gains: **+117 branches (messaging)** and **+76 branches (search)**.

### 2E. Small cleanups

- `faces/community`: add 1–2 render tests to bring lines ≥60 (only 34 total lines).
- Bring already‑close packages over 80 branches:
  - `shared/{auth,admin,compose,notifications}`, `headless`, `chat`, `utils`, `faces/blog`, `tokens`.
  - These each need ~5–70 branches and are straightforward “edge‑case + error‑path” additions.

---

## 3) Verification Loop (Every Stage)

1. Run package‑scoped coverage while iterating:
   - `pnpm --filter <pkg> test:coverage`
2. After each stage, run the aggregate:
   - `pnpm test:coverage && pnpm test:coverage:report`
3. Track remaining deficits using:
   - `coverage/combined-coverage.json` (overall + per package)
   - `packages/<pkg>/coverage/index.html` (file‑level branch hotspots)

Stop when:

- Overall lines/functions/branches/statements ≥80%, and
- Every package ≥80% branches (and ≥60% other metrics).

This v2 plan is designed so that completing sections 1–2 guarantees the aggregate gates without
needing any coverage‑scope changes. 
