# Phase 5 — Stable ID Generation (SSR/Hydration Safe) (Design Doc)

This document defines the “stable ID” contract for Greater Components: how we generate DOM IDs and internal keys in a way that is safe for SSR + hydration, consistent across the codebase, and easy to adopt in fully-vendored (CLI-first) apps.

This is focused on **correctness and consistency**, not backwards compatibility.

---

## 1) Why this matters

### The problem

Today, several components generate IDs using `Math.random()` (and in one case `crypto.randomUUID()` on the client but not the server). When those IDs participate in:

- DOM attributes (`id=…`, `aria-controls=…`, `aria-labelledby=…`, `aria-describedby=…`), or
- keyed `{#each ... (key)}` blocks, or
- initial component state that influences rendered markup,

…they can cause SSR markup to differ from what the client produces during hydration, which leads to:

- hydration warnings/errors
- broken ARIA relationships until hydration (or permanently)
- non-deterministic snapshots/tests
- inconsistent markup that is harder to debug

### Library usage model

Greater’s primary consumption model is “CLI-first, fully vendored” (apps vendor Greater source into `$lib/...` and should have no runtime imports from `@equaltoai/greater-components*`).

Because these apps frequently use SvelteKit and SSR/hydration, **stable IDs are part of the runtime correctness contract**, even when everything is vendored.

References:

- Install model: `planning/phase-4-ci-audits-design.md:18`
- Phase 5 plan summary: `planning/quality-completeness-consistency-plan.md:329`

---

## 2) Goals / Non-goals

### Goals

1. **SSR/hydration-safe IDs** for DOM attributes and keyed lists.
2. **Accessible defaults**: ARIA relationships work on first paint in SSR apps (not only after mount).
3. **Consistent patterns** across packages (primitives, faces, shared, patterns).
4. **Override support**: components that accept an `id` prop must treat it as primary.
5. **Regression prevention**: add tests + a fast grep/audit gate so `Math.random().toString(36)` doesn’t creep back into `.svelte` sources.

### Non-goals

- Stable IDs across sessions/navigation (we only need SSR/hydration stability per render).
- Replacing all uses of randomness across the repo (many are for optimistic IDs, mock data, etc. and are not SSR/hydration-sensitive).
- Guaranteeing uniqueness across multiple separate app roots on the same page (rare; can be handled with provider `prefix` if needed).

---

## 3) Current state (already implemented)

### 3.1 Shared primitives: `IdProvider` + `useStableId`

The core mechanism already exists in `@equaltoai/greater-components-utils`:

- `IdProvider` sets a counter in context:
  - `packages/utils/src/id-provider.svelte:1`
- `useStableId(localPrefix)` reads the provider context and returns `{ value }`:
  - With provider → stable counter-based ID during SSR + hydration.
  - Without provider → returns `''` on SSR/initial client render, then assigns an ID on `onMount` to avoid hydration mismatch.
  - `packages/utils/src/use-stable-id.svelte.ts:15`

Exports:

- `packages/utils/src/index.ts:75` (exports `IdProvider` + `useStableId`)

### 3.2 Components already migrated

These already use `useStableId`:

- `packages/primitives/src/components/TextField.svelte:4`
- `packages/primitives/src/components/Avatar.svelte:4`
- `packages/primitives/src/components/Menu/Item.svelte:4`
- `packages/faces/social/src/components/ContentRenderer.svelte:1`

---

## 4) Inventory: remaining unstable ID sources (SSR/hydration-impacting)

### 4.1 DOM IDs (`id=` / ARIA relationships)

These generate DOM IDs via `Math.random()` and are likely SSR/hydration-impacting:

- `packages/primitives/src/components/TextArea.svelte:38`
- `packages/primitives/src/components/Tooltip.svelte:299`
- `packages/primitives/src/components/Modal.svelte:148`
- `packages/faces/social/src/components/ComposeBox.svelte:121`
- `packages/faces/social/src/components/ProfileHeader.svelte:204`

### 4.2 Keyed list keys / state IDs

These generate list keys/IDs via random functions during component initialization and can break hydration:

- Poll option IDs used as `{#each ... (option.id)}` keys:
  - `packages/faces/social/src/patterns/PollComposer.svelte:209`
  - Key usage: `packages/faces/social/src/patterns/PollComposer.svelte:381`
- Key fallback uses `Math.random()` when no `alert.id` exists:
  - `packages/shared/admin/src/Cost/Alerts.svelte:28`

### 4.3 Known “random but client-only” IDs (generally OK)

Example (attachment IDs created in event handlers, not during SSR render):

- `packages/shared/chat/src/ChatInput.svelte:266`

We don’t need to eliminate these for Phase 5, but they should not become SSR/hydration-visible.

---

## 5) Design: stable ID patterns

### 5.1 Two categories of IDs

We treat IDs differently depending on where they’re used:

1. **DOM IDs** (must be unique in the document when rendered)
   - Use `useStableId()` so IDs are stable across SSR + hydration.
   - Strongly recommend/require a root `IdProvider` in SSR apps to keep IDs present on SSR output.

2. **Internal keys / in-memory identifiers** (only need to be stable inside a component instance)
   - Use deterministic, component-local counters (no `Math.random()`, no `crypto.randomUUID()` branching).
   - These must be stable between server and client initialization (same sequence of calls).

### 5.2 `IdProvider` requirements

For SSR apps, we want IDs present in the server HTML so ARIA relationships work before hydration.

Therefore:

- Treat “root `IdProvider` present” as a baseline contract for SvelteKit SSR apps created via `greater init`.
- Without provider, `useStableId` intentionally produces `''` on SSR and only assigns IDs on mount (SSR/hydration-safe but less accessible pre-hydration).

Provider reference:

- `packages/utils/src/id-provider.svelte:1`

### 5.3 Recommended DOM ID recipe (component-level)

For any component that accepts `id`, the standard pattern is:

1. Call `useStableId('component-prefix')` once during initialization.
2. Derive the final base id from the prop or generated id.
3. Derive all related ARIA IDs from the same base id.

Pattern (Svelte 5 runes style):

```ts
const generatedId = useStableId('textfield');
const baseId = $derived(id ?? generatedId.value);
const helpId = $derived(`${baseId}-help`);
```

Key rule:

- If `generatedId.value` can change (no provider), all downstream IDs must be `$derived(...)`, not plain `const`.

Example of correct usage:

- `packages/primitives/src/components/TextField.svelte:46`

### 5.4 Recommended internal-key recipe (dynamic lists)

For component-internal lists that need stable keys (e.g. poll options), use a deterministic counter:

- Initialize `let optionCounter = 0;` during component init.
- Generate IDs from the counter:
  - `poll-option-1`, `poll-option-2`, …
- Use those IDs as `{#each ... (id)}` keys and as lookup identifiers.

Important:

- Do not branch on `crypto` presence for initial IDs (server vs client differences).

Target:

- `packages/faces/social/src/patterns/PollComposer.svelte:209`

---

## 6) Implementation plan (step-by-step)

### 6.1 Ensure root `IdProvider` is installed by default (CLI + apps)

**Goal:** all SvelteKit apps initialized via CLI get stable SSR IDs automatically.

1. Add an “IdProvider injection” step to `greater init`:
   - Detect project entry point similarly to CSS injection:
     - Project detection: `packages/cli/src/utils/files.ts:171`
     - Existing injection pipeline: `packages/cli/src/commands/init.ts:1`
   - SvelteKit: update `src/routes/+layout.svelte` to wrap `<slot />`:
     - before: `<slot />`
     - after: `<IdProvider><slot /></IdProvider>`
   - Vite+Svelte: update `src/App.svelte` similarly.

2. Import path strategy (vendored-first):
   - Vendored mode: `import { IdProvider } from '${config.aliases.greater}/utils';`
     - Alias source: `packages/cli/src/utils/config.ts:102`
   - Hybrid (legacy): `import { IdProvider } from '@equaltoai/greater-components-utils';`

3. Add CLI tests mirroring existing css injection tests:
   - Fixture layout source: `packages/cli/tests/fixtures/index.ts:197`
   - Existing injector tests patterns: `packages/cli/tests/css-inject.test.ts:1`

Acceptance:

- `greater init` results in a root layout that includes `<IdProvider>` once (idempotent).

### 6.2 Migrate DOM ID generation away from `Math.random()`

Update each component to use `useStableId` and derived IDs.

1. `TextArea` (primitives)
   - Replace `Math.random` ID with stable base id:
     - Source: `packages/primitives/src/components/TextArea.svelte:38`
   - Preserve `id` prop override.

2. `Tooltip` (primitives)
   - Replace `tooltipId` random string:
     - Source: `packages/primitives/src/components/Tooltip.svelte:299`
   - Add optional `id` prop if not already present (to support deterministic overrides).
   - Ensure `aria-describedby` and tooltip element `id` share the same id.

3. `Modal` (primitives)
   - Replace `modalId` random string:
     - Source: `packages/primitives/src/components/Modal.svelte:148`
   - Ensure `titleId` derives from the same base id.
   - Add optional `id?: string` prop to the Modal API (if not already present).

4. `ComposeBox` (social face)
   - Replace base `composeId` random string:
     - Source: `packages/faces/social/src/components/ComposeBox.svelte:121`
   - Add `id?: string` to `ComposeBoxProps`:
     - `packages/faces/social/src/types.ts:457`
   - Convert all derived IDs (`textareaId`, `cwId`, etc.) into `$derived(...)` so they update when `composeId` updates (no-provider fallback).

5. `ProfileHeader` (social face)
   - Replace banner/bio/fields random IDs:
     - Source: `packages/faces/social/src/components/ProfileHeader.svelte:204`
   - Prefer base id (prop `id` if provided) + derived suffixes:
     - `profile-${base}-banner`, etc.

Acceptance:

- No `Math.random().toString(36)` remains in SSR-rendered DOM id generation paths in `.svelte` sources.

### 6.3 Fix SSR/hydration-unsafe keyed list IDs

1. `PollComposer`
   - Replace `generateOptionId` randomness with deterministic counter-based IDs:
     - Source: `packages/faces/social/src/patterns/PollComposer.svelte:209`
   - Keep using `option.id` for keyed each:
     - `packages/faces/social/src/patterns/PollComposer.svelte:381`

2. `Admin/Cost/Alerts`
   - Remove `Math.random()` from keyed each fallback:
     - `packages/shared/admin/src/Cost/Alerts.svelte:28`
   - Prefer:
     - `alert.id`, else
     - deterministic fallback (e.g. index-based) if truly necessary.

Acceptance:

- No keyed `{#each ... (Math.random())}` patterns remain in `.svelte` sources.

---

## 7) Regression coverage (tests + CI gate)

### 7.1 Unit tests for `useStableId`

Add tests under `packages/utils/tests/` using `@testing-library/svelte`:

Test cases:

1. With provider:
   - Two sibling components calling `useStableId('x')` produce deterministic sequential IDs.
2. Without provider:
   - SSR render contains no unstable IDs (id is `''` until mount).
   - After mount, ID becomes non-empty and remains stable for the component lifetime.

Relevant tooling:

- Vitest config: `packages/utils/vitest.config.ts:1`
- Existing tests location: `packages/utils/tests/`

### 7.2 Fast grep/audit gate

Add a repo-level script that fails if the known SSR/hydration-risk pattern appears in `.svelte` sources:

- `Math.random().toString(36)` in `packages/**/src/**/*.svelte`
- `crypto.randomUUID()` guarded by `typeof crypto !== 'undefined'` used for _initial_ IDs (allowlist exceptions only if proven client-only)

Integrate it into Phase 4’s package gate after migration:

- Add `validate:ids` and include in `validate:package`:
  - Root scripts: `package.json:41`
  - CI gate: `.github/workflows/test.yml:36`

Baseline acceptance command:

```bash
rg "Math\\.random\\(\\)\\.toString\\(36\\)" packages -g'*.svelte'
```

---

## 8) Definition of Done (Phase 5 complete)

1. Root `IdProvider` is installed by default for CLI-initialized apps (SvelteKit + Vite).
2. No SSR/hydration-impacting DOM IDs are generated from randomness.
3. No SSR/hydration-impacting keyed list IDs/keys are generated from randomness.
4. Unit tests for stable ID behavior exist and run in CI.
5. A fast audit prevents regressions in `.svelte` sources.

---

## 9) Risks & mitigations

### Risk: provider-less SSR apps have weaker pre-hydration accessibility

Mitigation:

- Make provider injection part of `greater init` so the default is correct.
- Keep the provider-less fallback for safety, but treat it as “best effort”.

### Risk: ID derivation not reactive when no provider

Mitigation:

- Require `$derived(...)` for any ID composed from `useStableId(...).value`.
- Add tests that cover provider-less mode to catch “IDs stuck as empty string”.

### Risk: large migration touches many files

Mitigation:

- Follow a package-by-package order (primitives → faces → shared/patterns).
- Use Phase 4 CI gates (`pnpm validate:package`) to prevent unrelated regressions.

---

## 10) Reference index

- Phase 5 plan: `planning/quality-completeness-consistency-plan.md:329`
- Existing stable ID utilities:
  - `packages/utils/src/id-provider.svelte:1`
  - `packages/utils/src/use-stable-id.svelte.ts:15`
  - `packages/utils/src/index.ts:75`
- Already migrated examples:
  - `packages/primitives/src/components/TextField.svelte:4`
  - `packages/primitives/src/components/Avatar.svelte:4`
  - `packages/primitives/src/components/Menu/Item.svelte:4`
  - `packages/faces/social/src/components/ContentRenderer.svelte:58`
- Remaining known unstable sources:
  - `packages/primitives/src/components/TextArea.svelte:38`
  - `packages/primitives/src/components/Tooltip.svelte:299`
  - `packages/primitives/src/components/Modal.svelte:148`
  - `packages/faces/social/src/components/ComposeBox.svelte:121`
  - `packages/faces/social/src/components/ProfileHeader.svelte:204`
  - `packages/faces/social/src/patterns/PollComposer.svelte:209`
  - `packages/shared/admin/src/Cost/Alerts.svelte:28`
- CLI entry points for provider injection:
  - Project detection: `packages/cli/src/utils/files.ts:171`
  - Init command: `packages/cli/src/commands/init.ts:1`
  - Aliases (vendored import path): `packages/cli/src/utils/config.ts:102`
  - Fixture layout used in tests: `packages/cli/tests/fixtures/index.ts:197`
