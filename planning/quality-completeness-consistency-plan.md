# Greater Components — Plan to Reach 9/10 Quality, Completeness, Consistency

This plan focuses on making the **CLI-first, fully-vendored** workflow correct and consistent, while also hardening package exports/build outputs so docs/playground and internal builds stay reliable.

Primary improvements:

1. Make `greater` installs **fully self-contained** (no runtime imports from `@equaltoai/greater-components*`).
2. Standardize `package.json#exports` across all subpaths (no TS sources, no broken targets).
3. Eliminate `node_modules` (and pnpm paths) from published `dist/`.
4. Add automated **exports + dependency + CLI registry** audits to CI.
5. Centralize stable ID generation (no `Math.random()` for DOM ids/ARIA; SSR/hydration-safe).

Already completed (from this effort):

- `@equaltoai/greater-components` `svelte` export conditions no longer point at copied TS (`dist/**/index.js` instead).
- `@equaltoai/greater-components/style.css` is exported (`./style.css` → `./dist/style.css`).
- `ContentRenderer` now uses a single id for `aria-controls` and the controlled element (fixes broken ARIA linkage).

---

## Assumptions & Constraints

- Consumers are **only first-party applications** (we can make breaking changes and update apps in lockstep).
- Priority is correctness + consistency over backwards compatibility and third-party ergonomics.
- CI should be the enforcement mechanism: if an export map or runtime dependency is wrong, CI must fail.
- Primary installation workflow is via the `greater` CLI:
  - It **fetches source files from a Git ref** (tag/commit) and writes them into the app (`$lib/...`).
  - It installs **only third-party npm deps** (Svelte, TanStack, etc). All Greater code is vendored into the app.
  - CSS is sourced from Git and copied locally by default (`css.source = 'local'`).

---

## Success Criteria (Definition of Done)

### CLI install correctness (primary contract)

- `greater init` + `greater add` can install each face (`social`, `blog`, `community`, `artist`) into a fixture app non-interactively.
- The resulting app **builds and typechecks** after installation.
- The resulting app has **zero** runtime imports from `@equaltoai/greater-components` or `@equaltoai/greater-components-*` (enforced by a grep gate).
- The CLI registry metadata (files + dependencies) matches reality: every referenced file exists at the requested ref and every external bare import is accounted for.

### Umbrella package correctness (secondary contract, optional for apps)

- `@equaltoai/greater-components` `exports` contains **only real files**.
- `svelte` export conditions never point at `.ts` sources (only `.js` or `.svelte`).
- `./style.css` is exported and present in `dist/`.

### Dist hygiene

- No published package contains `dist/**/node_modules/**`.
- No built files contain pnpm path imports like `node_modules/.pnpm/...` (detectable by grep).
- Svelte runtime is referenced via bare specifiers (e.g. `svelte/internal/client`) rather than file paths.

### Dependency correctness

- Every **bare import** used by published `dist/**/*.js` is declared in
  `packages/greater-components/package.json` (`dependencies` or `peerDependencies`), or is a Node builtin (`node:*`).
- “Node-only” entrypoints (CLI/testing) are either:
  - moved out of `@equaltoai/greater-components`, or
  - properly conditioned (e.g. `node` condition) and have correct dependencies.

### Stable IDs

- No `Math.random()` usage for DOM ids/ARIA relationships in shipped components.
- SSR/hydration does not mismatch due to ID generation.
- Components that need IDs accept an `id` override prop and default to a stable generator.

---

## Phase 0 — Baseline & Instrumentation (½–1 day)

### 0.1 Snapshot today’s issues

- Capture current failure patterns:
  - `@equaltoai/greater-components` `svelte` exports pointing at copied TS sources that import private workspace packages.
  - Bundled pnpm paths: `dist/**/node_modules/.pnpm/**`.
  - Broken/incorrect subpath exports (example: `./headless/*` import targets don’t exist for primitives).
  - CLI-specific: registry path resolution mismatches (virtual paths that don’t map to real source files) and dependency metadata drift.

### 0.2 Map the actual consumption model (so we optimize the right thing)

- Enumerate what is **vendored by CLI** vs what is imported from the umbrella package.
  - Source of truth: `packages/cli/src/utils/transform.ts` and `packages/cli/src/utils/install-path.ts`.
- Policy (chosen): **fully vendored mode**
  - CLI vendors all Greater runtime code into the app (faces, shared modules, patterns, headless, primitives, icons, tokens, utils, adapters, content).
  - CLI installs only third-party npm dependencies via the package manager.
  - The umbrella package is not required for app runtime; keep it correct for internal tooling/docs only.

### 0.3 Add lightweight audit scripts (local first)

Add scripts (initially as local tooling, then wired into CI in Phase 4):

- `scripts/audit-exports.mjs`
  - Reads `packages/*/package.json`.
  - Verifies that all non-pattern export targets exist on disk.
  - For pattern exports (with `*`), verifies the **base directory exists** and at least one match exists.

- `scripts/audit-dist-hygiene.mjs`
  - Fails if any built output contains:
    - `node_modules/.pnpm`
    - `/node_modules/` under a package’s `dist/`

- `scripts/audit-runtime-deps.mjs`
  - Parses `packages/greater-components/dist/**/*.js` for bare imports.
  - Reports any missing deps from `packages/greater-components/package.json`.

- `scripts/audit-cli-registry.mjs`
  - Validates that every CLI registry file path can be resolved to a real source file at a given ref (using the same logic as `fetchComponentFiles`).
  - Optionally checks that dependency metadata includes all external bare imports from the installed files.

Acceptance checks:

- `node scripts/audit-exports.mjs`
- `node scripts/audit-dist-hygiene.mjs`
- `node scripts/audit-runtime-deps.mjs`
- `node scripts/audit-cli-registry.mjs`

---

## Phase 1 — Export Map Standardization (1–2 days)

### 1.1 Decide the canonical export strategy

Recommend a clear rule set (apply to aggregator and internal packages):

- `import` condition points to compiled ESM (`dist/**/*.js`).
- `types` points to generated `.d.ts`.
- `svelte` points to **either**:
  - `.svelte` sources (preferred for component entrypoints), or
  - compiled `.js` (acceptable for “index barrel” entrypoints), but never `.ts`.

Optional (since apps are first-party): shrink and harden the public surface:

- Inventory actual imports from your apps, then remove unused/duplicate exports.
- Prefer a small set of stable subpaths (e.g. `./primitives`, `./headless`, `./faces/social`, `./shared/auth`) and avoid aliasing the same thing multiple ways.

### 1.2 Fix incorrect subpath exports (highest ROI)

In `packages/greater-components/package.json`:

- **Headless subpaths**: ensure `./headless/button`, `./headless/modal`, etc resolve to real JS files.
  - Option A (recommended): explicitly list each headless primitive export.
  - Option B: split patterns so `./headless/primitives/*` and `./headless/behaviors/*` map correctly.

- **Faces and shared modules**:
  - Avoid `svelte` pointing at copied `src/index.ts` (already fixed for many entrypoints).
  - If any remaining `svelte` export points to TS, switch to JS or `.svelte`.

### 1.3 Make asset exports complete

Ensure `@equaltoai/greater-components/style.css` (the aggregated stylesheet) is exported and documented:

- `exports["./style.css"] = "./dist/style.css"`
- Add a short usage snippet in `packages/greater-components/README.md`.

### 1.4 Add a build-time “exports exist” gate

Update `packages/greater-components/scripts/build.js` to run a small local validation at the end:

- Confirm `dist/index.js`, `dist/index.d.ts`, `dist/style.css` exist.
- Optionally: validate a curated list of important exports (faces/social, primitives, headless).

Acceptance checks:

- `pnpm --filter @equaltoai/greater-components build`
- `node scripts/audit-exports.mjs`

---

## Phase 2 — Dist Hygiene: Remove `node_modules` From Published Output (2–4 days)

### Root cause

Several `vite.config.ts` files use `preserveModules: true` but **do not mark runtime deps as external**.
Rollup then copies dependencies into output and rewrites imports to pnpm paths such as:
`../node_modules/.pnpm/svelte@.../node_modules/svelte/src/...`

### 2.1 Standardize Vite/Rollup externals across packages

For every library built with Vite + `preserveModules`, enforce:

- Always externalize Svelte runtime subpaths:
  - `'svelte'`
  - `/^svelte\\//`
- Externalize all package dependencies & peer dependencies (except internal source you explicitly want bundled).

Implementation approach:

1. Create a shared helper (e.g. `scripts/vite/external.ts`) that:
   - Reads the package’s `package.json`.
   - Builds a Rollup `external` list from:
     - `dependencies`
     - `peerDependencies`
     - plus `svelte` and `/^svelte\\//`
2. Update each `packages/*/vite.config.ts` to use it.

Example (pseudo):

```ts
import { defineConfig } from 'vite';
import { computeExternal } from '../../scripts/vite/external';

export default defineConfig({
	build: {
		rollupOptions: {
			external: computeExternal(__dirname),
		},
	},
});
```

Targets to update (at minimum):

- `packages/utils/vite.config.ts` (currently only externalizes `svelte`)
- `packages/faces/social/vite.config.ts` (externalize `/^svelte\\//` to prevent pnpm-path imports)
- Any other packages with `preserveModules` and incomplete externals.

### 2.2 Decide which third-party deps belong in the aggregator

Once internal package dist outputs stop embedding dependencies, the aggregator must declare the union of external runtime deps.

Policy recommendation:

- Keep `svelte` as a peer dependency.
- Treat other runtime deps as `dependencies` of `@equaltoai/greater-components`.
  - Examples likely needed: `unified`, `rehype-*`, `remark-*`, `hast-util-sanitize`, `shiki`,
    `@tanstack/svelte-virtual`, etc.
- Consider `optionalDependencies` for rarely-used heavy features (only if the code can handle absence).

### 2.3 Enforce “no node_modules in dist” gate

Add a repo-level check:

- `rg "node_modules/\\.pnpm" packages/*/dist -g'*.js'`
- `find packages -path '*/dist/node_modules/*' -print` should return nothing

Acceptance checks:

- `pnpm build`
- `node scripts/audit-dist-hygiene.mjs`
- Spot-check: imports in `packages/faces/social/dist/**/*.js` start with `svelte/...` not `../node_modules/...`.

---

## Phase 3 — CLI Registry & Install Pipeline Hardening (1–3 days)

This is the “make the CLI the source of truth” step so first-party apps can rely on it. In fully vendored mode, this phase also removes runtime coupling on the umbrella package.

### 3.1 Define vendored install layout (one-time decision)

Pick and document a single in-app directory convention for vendored Greater code. Recommended:

- `$lib/greater/headless/*` (headless primitives + headless utils/types)
- `$lib/greater/primitives/*` (Svelte primitives package source)
- `$lib/greater/icons/*`
- `$lib/greater/tokens/*`
- `$lib/greater/utils/*`
- `$lib/greater/content/*`
- `$lib/greater/adapters/*`

Then enforce it by:

- Adding `installMode` to `components.json` schema (`vendored` | `hybrid`, default `vendored`).
- Adding `aliases.greater` to `components.json` schema (default `$lib/greater`).
- Updating `packages/cli/src/utils/install-path.ts` to support a new virtual prefix:
  - `greater/<pkg>/...` → `aliases.greater/<pkg>/...`

### 3.2 Vendor “core packages” automatically in vendored mode

Implement a “core runtime” install that runs whenever a face/shared/pattern is installed:

- Define a fixed set of core packages: `headless`, `primitives`, `icons`, `tokens`, `utils`, `content`, `adapters`.
- Add a single registry item (e.g. `core`) whose files are the union of those packages’ source trees.
- Make every face depend on `core` via `registryDependencies` (or inject it in the resolver when `installMode = vendored`).

Implementation detail (recommended): drive file lists from `registry/index.json`

- Extend the registry-index generator to store package file lists as repo-relative paths (it already does).
- In the CLI, when installing `core`, read the fetched `registry/index.json` for the ref and derive:
  - `sourcePath`: `packages/<pkg>/<path>` (from the index)
  - `installPath`: `greater/<pkg>/<path-without-src-prefix>`
- This removes the need to hand-maintain file enumerations in `packages/cli/src/registry/*`.

### 3.3 Rewrite all Greater imports to local vendored paths

Update `packages/cli/src/utils/transform.ts` so that **both** legacy hyphenated packages and umbrella subpaths resolve locally in vendored mode:

- `@equaltoai/greater-components-primitives` → `${aliases.greater}/primitives`
- `@equaltoai/greater-components-icons` → `${aliases.greater}/icons`
- `@equaltoai/greater-components-tokens` → `${aliases.greater}/tokens`
- `@equaltoai/greater-components-utils` → `${aliases.greater}/utils`
- `@equaltoai/greater-components-content` → `${aliases.greater}/content`
- `@equaltoai/greater-components-adapters` → `${aliases.greater}/adapters`
- `@equaltoai/greater-components-headless/*` → `${aliases.greater}/headless/*`
- Also handle umbrella form:
  - `@equaltoai/greater-components/<pkg>` → `${aliases.greater}/<pkg>`
  - `@equaltoai/greater-components/headless/*` → `${aliases.greater}/headless/*`

Add a fast post-install validation:

- After file writes, `rg \"@equaltoai/greater-components\" src/lib` must return empty.

### 3.4 Stop installing the umbrella package for app runtime

Update `packages/cli/src/commands/add.ts`:

- Gate the “ensure `@equaltoai/greater-components` is installed” behavior behind an explicit opt-in (e.g. `installMode = hybrid`).
- Default new projects to vendored mode (no umbrella dependency).

### 3.5 Make registries single-source-of-truth

Right now, the CLI has two sources of data:

- `registry/index.json` (checksums + file lists) used for fetching/verification.
- In-code registries under `packages/cli/src/registry/*` used for dependency resolution and install metadata.

Pick one:

- Option A (recommended): **generate the in-code registries from `registry/index.json`** at build time.
  - Implement `scripts/generate-cli-registry.js` that produces `packages/cli/src/registry/generated.ts`.
  - The CLI imports the generated file instead of maintaining hand-written registries.
- Option B: make the CLI read `registry/index.json` directly at runtime for registry metadata (still keep types and helpers).

### 3.6 Add CLI e2e smoke tests

Add a deterministic fixture app in-repo (no network scaffolding) under `examples/cli-fixture/`:

- Minimal SvelteKit/Vite+Svelte project committed to the repo.
- A test script that runs (non-interactive):
  - `pnpm --filter @equaltoai/greater-components-cli build`
  - `node packages/cli/dist/index.js init --yes ...`
  - `node packages/cli/dist/index.js add --yes faces/social` (repeat for each face)
  - Run the fixture’s `pnpm typecheck`/`pnpm build`

### 3.7 Close the dependency metadata gap

For correctness, the CLI should not rely on manually maintained dependency lists.
Implement one of:

- **Static analysis**: parse installed files for bare imports and auto-install missing deps.
- **Registry-driven deps**: extend `registry/index.json` generation to include full external dependencies per component and consume that in the CLI.

Acceptance checks:

- CLI e2e fixture passes for each face.
- `node scripts/audit-cli-registry.mjs` passes.

---

## Phase 4 — Automated Export + Dependency Audits in CI (½–1 day)

### 4.1 Add a single “package integrity” command

In root `package.json`, add:

- `validate:exports`: runs `audit-exports.mjs`
- `validate:dist`: runs `audit-dist-hygiene.mjs`
- `validate:deps`: runs `audit-runtime-deps.mjs`
- `validate:cli`: runs `audit-cli-registry.mjs`
- `validate:package`: runs all four

### 4.2 Wire into GitHub Actions

Update `.github/workflows/test.yml` after `pnpm build`:

- `pnpm validate:package`

Acceptance checks:

- CI fails when exports point to missing files.
- CI fails when `node_modules/.pnpm` appears in dist.
- CI fails when aggregator is missing runtime deps.
- CI fails when CLI registry/install audit fails.

---

## Phase 5 — Stable ID Generation (SSR/Hydration Safe) (2–5 days)

### 5.1 Introduce a shared ID API

Add a small utility in a shared package (recommend `packages/headless` or `packages/utils`):

Core requirements:

- Supports deterministic IDs during SSR + hydration when an `IdProvider` is present.
- Supports an `id` prop override everywhere.
- Avoids `Math.random()` in render path.

Recommended design:

- `IdProvider` sets a context with `nextId()` (counter-based).
  - On SSR: new provider per render → counter resets per request.
  - On client hydration: provider initializes the same way → IDs match.

- `useStableId({ id, prefix })`:
  - If `id` provided, use it.
  - Else if provider exists, call `nextId(prefix)` once during component init.
  - Else (no provider): do **client-only** id assignment (`onMount`) to avoid hydration mismatch.

### 5.2 Migrate components away from `Math.random()` IDs

Systematically replace occurrences (non-exhaustive list from `rg`):

- `packages/primitives/src/components/TextField.svelte`
- `packages/primitives/src/components/Modal.svelte`
- `packages/primitives/src/components/Tooltip.svelte`
- `packages/primitives/src/components/Avatar.svelte`
- `packages/faces/social/src/components/ComposeBox.svelte`
- `packages/faces/social/src/components/ProfileHeader.svelte`
- `packages/faces/social/src/components/ContentRenderer.svelte`
- `packages/faces/artist/src/utils/accessibility.ts` (verify if SSR-impacting)

Implementation notes:

- Components that already accept `id` should keep it as the primary source.
- For ARIA pairs (e.g., label/input, toggle/content), both sides must derive from the same base id.

### 5.3 Add regression coverage

Add minimal tests that protect the contract:

- Unit test: `useStableId` returns stable sequential IDs under `IdProvider`.
- Unit test: without provider, SSR output does not include unstable ids (or matches client initial render).
- Grep-based test (fast): fail build if `Math.random().toString(36)` exists in `packages/**/src/**/*.svelte` (configurable allowlist for non-DOM usage).

Acceptance checks:

- `pnpm test:unit`
- `rg \"Math\\.random\\(\\)\\.toString\\(36\\)\" packages -g'*.svelte'` returns empty (or allowlisted).

---

## Recommended Implementation Order (to minimize churn)

1. Fix export map correctness first (Phase 1), because it defines the public API surface.
2. Fix dist hygiene (Phase 2), because it influences how exports and deps should be defined.
3. Harden the CLI pipeline (Phase 3), because it’s the primary installation path for apps.
4. Add CI gates (Phase 4), to prevent regressions while doing ID refactors.
5. Perform ID refactor (Phase 5), because it touches many components and benefits from strong guardrails.

---

## Risks & Mitigations

- **Coordinating breaking changes**: export map cleanups will break app imports.
  - Mitigation: update apps in the same PR; use `pnpm -r build` + app builds/tests as the gate.

- **Dependency surface growth**: aggregator dependencies may increase when externals are fixed.
  - Mitigation: make a deliberate decision on what is required vs optional; if CLI/testing aren’t needed by apps, remove them from the aggregator to keep runtime deps tight.

- **SSR/hydration subtlety**: stable id behavior must be deterministic.
  - Mitigation: require/encourage `IdProvider` for SSR apps and keep a “no provider” fallback that
    avoids mismatches by deferring id assignment to `onMount`.
