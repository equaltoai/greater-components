# Coverage Improvement Plan (Target: >80% Overall)

This plan is based on the latest `pnpm test:coverage:report` results (from
`coverage/combined-coverage.json`). Current overall coverage:

- Lines/Statements: **59.33%** (11,552 / 19,471)
- Functions: **55.50%** (1,876 / 3,380)
- Branches: **46.99%** (5,336 / 11,355)
- Gate: **≥80% overall** for all four metrics, and **≥60% per package** for all four metrics.

The gap to 80% lines is ~4,025 additional covered lines. The biggest drivers are:
`adapters`, `shared/auth`, `shared/compose`, `shared/admin`, `shared/messaging`,
`shared/search`, and `greater-components`.

---

## 0) Make Coverage Measurement Reliable (Week 0)

**Why:** Some packages currently report 0% because tests don’t execute source,
and `greater-components` double‑counts other packages’ dist code.

1. **Fix `shared/messaging` and `shared/search` tests to import real source**
   - Replace in‑test reimplementations with imports from:
     - `packages/shared/messaging/src/context.ts`
     - `packages/shared/search/src/context.ts`
   - Add focused unit tests for:
     - `createMessagesContext`, `fetchConversations`, `selectConversation`,
       `sendMessage`, `deleteMessage`, `markRead` (success + error branches)
     - `formatMessageTime`, `getConversationName`
     - `createInitialSearchState`, `createSearchContext.search/clear/setType`,
       `toggleSemantic`, `toggleFollowing`, `addRecentSearch`
     - `highlightQuery`, `formatResultCount`, `formatCount`
   - Use `vi.useFakeTimers()` for time formatting and `localStorage` mocks already in setup.

2. **Correct `greater-components` coverage scope**
   - Current config includes `dist/*` for every sub‑package, but tests only smoke import.
   - Preferred fix: narrow `packages/greater-components/vitest.config.ts` to include
     only the aggregator’s own wrapper entrypoints (likely `dist/index.js` and any
     `dist/**` files that are *unique* to this package).
   - Alternative: add a “surface smoke” test that imports every export path listed in
     `packages/greater-components/package.json` to execute each entry once.

3. **Re-run baseline**
   - `pnpm test:coverage && pnpm test:coverage:report`
   - Confirm no package is at 0% and per‑package minimums are achievable.

---

## 1) Raise Lowest, Largest Packages to ≥60% (Week 1)

### `packages/adapters` (2,627 lines, 28% lines / 23% branches)
**Testing needed:** pure TypeScript/unit + transport integration (mocked).

- Add unit tests for each transport class under `src/**`:
  - Success paths and **every error/fallback branch** (timeouts, retries, bad status, abort).
  - `TransportFallback` selection logic: primary fail → fallback, all fail → error.
  - `TransportManager` lifecycle: register/unregister, dispose, reconnection branches.
- Use fixtures/mocks from `packages/testing` and `packages/adapters/src/__tests__` patterns.
- Mock network with `undici`/fetch stubs (no real network).
- Goal: **≥60% branches**, **≥60% functions** (adds ~1.2k branches).

### `packages/shared/auth` (1,488 lines, 14% lines / 11% branches)
**Testing needed:** Svelte component tests + store/context unit tests.

- Expand beyond context helpers:
  - Render tests for `LoginForm`, `RegisterForm`, `TwoFactorSetup/Verify`,
    `WebAuthnSetup`, `BackupCodes`, `UserButton`, etc.
  - Validate all form branches: empty input, invalid email, password rules, 2FA required,
    server error, success redirect.
- Mock handlers passed through auth context (see existing `LoginForm.test.ts` harness).
- Add tests for context methods: login/register flows, handler rejection branches.
- Goal: bring all four metrics to **≥60%**.

### `packages/shared/compose` (936 lines, 27% lines / 27% branches)
**Testing needed:** Svelte component tests + helper/store unit tests.

- Component tests for:
  - `Autocomplete`, `UnicodeCounter`, media picker/upload flows, draft save/restore.
  - Branches for empty state, loading, disabled, upload failure, max length exceeded.
- Unit tests for `DraftManager`, `MediaUploadHandler`, GraphQL adapter helpers.
- Mock file uploads and GraphQL calls (fixtures from `packages/testing`).
- Goal: **≥60% across metrics**.

### `packages/shared/admin` (1,039 lines, 46% lines / 35% branches)
**Testing needed:** Svelte component tests for admin flows.

- Add render + interaction tests for top‑level admin views/components:
  - Table/list views: empty, loading, pagination, error, selection branches.
  - Action dialogs/forms: confirm/cancel, validation failures.
- Cover any store/helpers used by admin pages.
- Goal: **≥60% branches/functions/lines**.

### Small packages below minimum
Bring to ≥60 quickly with smoke + edge‑case tests:

- `packages/shared/notifications` (43% lines): cover grouping/empty/error branches.
- `packages/tokens` (49% lines / 32% branches): add tests for token generation, theme variants,
  and high‑contrast exports.
- `packages/faces/blog` (14% lines): add render tests for main exports and conditional states.

Re‑run report and verify all packages are now **≥60%** for every metric.

---

## 2) Push Key Drivers to ~80%+ (Weeks 2–3)

After step 1, focus on packages with the highest “coverage deficit × size”.

### `packages/adapters`
**Aim:** ~80% lines/functions/branches.

- Add tests for rarer branches:
  - exponential backoff math, optional parameters, header/URL building,
  - abort/cleanup on unmount,
  - multi‑transport concurrency.

### `packages/shared/auth`
**Aim:** ~75–80% lines/functions/branches.

- Add flow‑level tests that mount higher‑level components and simulate:
  - OAuth consent success/failure,
  - 2FA recovery paths,
  - WebAuthn unsupported browser branches.

### `packages/shared/compose`
**Aim:** ~75–80%.

- Cover long‑tail states:
  - multi‑attachment ordering/removal,
  - alt‑text/spoiler toggles,
  - draft hydration with invalid persisted data.

### `packages/primitives` (71% lines / 52% branches)
**Testing needed:** Svelte component interaction + variant/prop matrix.

- Parameterized tests for components with many variants (size, tone, disabled, error, icon‑only).
- Add branch coverage for:
  - conditional slot rendering,
  - ARIA fallbacks,
  - keyboard navigation edge cases.
- Aim for **≥80% branches**.

### `packages/icons` (functions 0% / branches 49%)
**Testing needed:** runtime unit tests for icon registry and SSR helpers.

- Ensure tests import and execute the main exported function(s) from `src/index.ts`.
- Add cases for invalid icon names, SSR vs browser paths, and optional props to raise branches.

### `packages/faces/social` and `packages/shared/chat`
**Testing needed:** component + store tests for key UI states.

- Add interaction tests for filter/sort branches, empty/loading/error, and
  state transitions (thread open/close, streaming complete, etc.).
- Target **≥75–80% branches**.

---

## 3) Sustain >80% (Ongoing)

- **Add coverage checks to PR workflow**
  - Require `pnpm test:coverage` and `pnpm test:coverage:report` in CI.
  - Keep per‑package minimum at 60 and overall at 80.
- **When adding features**
  - Add unit tests for new helpers/stores.
  - Add component tests for new UI flows including error + empty states.
  - Prefer fixtures from `packages/testing` and adapters from `packages/adapters`.
- **Quarterly cleanup**
  - Review packages hovering near thresholds and add missing branch tests.

---

## Suggested Order of Execution

1. Measurement fixes (`shared/messaging`, `shared/search`, `greater-components`).
2. Bring `adapters`, `shared/auth`, `shared/compose`, `shared/admin` to ≥60%.
3. Raise `primitives` branches, `icons` functions/branches, then push major drivers to ~80%.
4. Tidy remaining small packages and keep CI gates.

If we execute steps 0–2, overall coverage should cross 80% while satisfying all per‑package minimums. 
