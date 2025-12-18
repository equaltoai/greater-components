Goal: implement **Phase 3 — CLI Registry & Install Pipeline Hardening** from `planning/quality-completeness-consistency-plan.md` (section “Phase 3 — CLI Registry & Install Pipeline
Hardening (1–3 days)”).

Context / constraints

- Only first-party apps consume this library. Backwards compatibility is not a priority; correctness + consistency is.
- Primary install workflow is **CLI-first, fully-vendored**: apps install Greater code by fetching from a Git ref and writing into the app. NPM is only for third-party deps.
- Phase 1 work is already done (svelte exports no longer point at TS, `./style.css` exported, ContentRenderer id fix, token placeholder audits). Focus only on Phase 3.

Success criteria (must satisfy)

- `greater init` + `greater add faces/<face>` works non-interactively for each face: `social`, `blog`, `community`, `artist`.
- The resulting fixture app **typechecks and builds** after install.
- In **vendored** mode, the installed app has **zero runtime imports** of:
  - `@equaltoai/greater-components`
  - `@equaltoai/greater-components-*`
    (enforce via a grep gate after install)
- CLI registry metadata does not drift: every installed file path must exist at the chosen ref, and external deps must be installed reliably.

Key files to read first

- Plan: `planning/quality-completeness-consistency-plan.md` (Phase 3)
- CLI config + schema:
  - `packages/cli/src/utils/config.ts`
  - `packages/cli/src/schemas/components.schema.json` (currently out of sync with config.ts)
- Install layout + transforms:
  - `packages/cli/src/utils/install-path.ts`
  - `packages/cli/src/utils/transform.ts`
- Fetch pipeline + registry index:
  - `packages/cli/src/utils/fetch.ts`
  - `packages/cli/src/utils/registry-index.ts`
  - `packages/cli/src/utils/git-fetch.ts`
- CLI “add” / “init”:
  - `packages/cli/src/commands/add.ts`
  - `packages/cli/src/commands/init.ts`
- Hand-written registries (to reduce/eliminate drift):
  - `packages/cli/src/registry/index.ts`
  - `packages/cli/src/registry/faces.ts`
  - `packages/cli/src/registry/shared.ts`
  - `packages/cli/src/registry/patterns.ts`
- Registry generator and current index:
  - `scripts/generate-registry-index.js`
  - `registry/index.json`
- Existing audits/tests:
  - `scripts/audit-cli-registry.mjs`
  - `packages/cli/tests/**` (note: current “e2e” tests are mostly mocked FS)

Known current gaps (verify quickly)

- `packages/cli/src/schemas/components.schema.json` is missing fields present in `config.ts` (`installMode`, `aliases.greater`, `css.source`, `css.localDir`, checksums, etc).
- Vendored “core packages” auto-install exists in `packages/cli/src/commands/add.ts`, but the set is incomplete (`headless` is not included).
- Many face components/patterns import `../generics/...` (e.g. `packages/faces/social/src/**`) but the CLI registries don’t vendor `lib/generics/**` today → face installs can be broken.
- File lists for shared/modules/patterns/components are hand-maintained in TS registries → drift risk. `registry/index.json` already has authoritative file lists for `components`, `faces`,
  `shared`.

Implementation tasks (Phase 3)

1. **Finalize vendored install layout + schema**
   - Update `packages/cli/src/schemas/components.schema.json` to match `packages/cli/src/utils/config.ts`:
     - `installMode: 'vendored' | 'hybrid'` default `'vendored'`
     - `aliases.greater` default `$lib/greater`
     - `css.source: 'local' | 'npm'` default `'local'`
     - `css.localDir` default `'styles/greater'`
     - `installed[].checksums` entries if used (keep schema aligned with zod)
   - Ensure docs/examples configs remain valid (adjust if needed).

2. **Vendor core packages automatically in vendored mode**
   - Core set must be: `headless`, `primitives`, `icons`, `tokens`, `utils`, `content`, `adapters` (per plan).
   - Implement a robust “core runtime” install:
     - Prefer deriving core file lists from `registry/index.json` for the selected ref.
     - Install paths should be `greater/<pkg>/<path-without-src-prefix>`, using `aliases.greater` via `install-path.ts`.
   - Update `packages/cli/src/utils/fetch.ts` so `headless` is treated like other core packages (currently excluded).
   - Decide whether `aliases.hooks` is still needed; if keeping it, ensure it’s consistent with the chosen layout (plan prefers `$lib/greater/headless/*`).

3. **Rewrite all Greater imports to local vendored paths**
   - In `packages/cli/src/utils/transform.ts`, in vendored mode rewrite:
     - Legacy hyphenated packages → local:
       - `@equaltoai/greater-components-primitives` → `${aliases.greater}/primitives`
       - `...-icons` → `${aliases.greater}/icons`, etc
       - `...-headless/*` → `${aliases.greater}/headless/*`
     - Umbrella subpaths → local:
       - `@equaltoai/greater-components/<pkg>` → `${aliases.greater}/<pkg>`
       - `@equaltoai/greater-components/headless/*` → `${aliases.greater}/headless/*`
     - Shared modules:
       - `@equaltoai/greater-components/shared/<mod>` and `@equaltoai/greater-components-<mod>` → `${aliases.components}/<mod>`
   - Add a fast post-install “grep gate” (Node-side, don’t rely on shell availability):
     - After writing files, scan installed output (at least `src/lib/**`) and fail if any `@equaltoai/greater-components` string remains.

4. **Stop installing the umbrella package for app runtime**
   - Ensure `packages/cli/src/commands/add.ts` only adds `@equaltoai/greater-components` as an npm dep in `installMode = hybrid`.
   - Ensure `packages/cli/src/commands/init.ts` defaults new projects to `vendored`.

5. **Make registry file lists single-source-of-truth**
   - Primary objective: eliminate hand-maintained file enumerations in `packages/cli/src/registry/*` for anything that is already in `registry/index.json`.
   - Recommended approach (pragmatic, ref-correct):
     - At runtime, fetch `registry/index.json` for the target ref via `fetchRegistryIndex`.
     - Build install file lists from `index.components`, `index.shared`, and `index.faces` (authoritative).
     - Keep TS registries only for UX metadata (descriptions, tags, “includes” lists) if needed.
   - Fix the **generics** gap by design: - Face installs must include everything needed for face code to compile (e.g. `src/generics/**`, `src/lib/**`). - The simplest reliable route: when installing `faces/<name>` in vendored mode, install **the full face file set** from `registry/index.json.faces[name].files` to the app (mapping
     `src/<x>` → `lib/<x>` or another consistent layout you choose), so relative imports remain valid. - Ensure patterns that are installed standalone also bring the required supporting files (either by making patterns depend on a “generics” registry item, or by deriving pattern
     installs from face index data).

6. **Add true CLI e2e smoke tests**
   - Create a deterministic fixture app inside the repo (prefer `test-apps/cli-fixture/` because `pnpm-workspace.yaml` already includes `test-apps/*`).
   - Add a Vitest e2e test under `packages/cli/tests/e2e/` that:
     - Builds the CLI (`pnpm --filter @equaltoai/greater-components-cli build`)
     - Runs `node packages/cli/dist/index.js init --yes` and `add --yes faces/<face>` for each face in the fixture cwd
     - Runs the fixture’s `pnpm typecheck` and `pnpm build`
     - Verifies the “no @equaltoai/greater-components imports” gate.
   - Avoid flaky network in tests:
     - Implement a test-only local fetch mode for `fetchFromGitTag` / `fetchRegistryIndex` (e.g. env var like `GREATER_CLI_LOCAL_REPO_ROOT`).
     - In local mode, read files from the current repo (either directly from FS for `main`, or via `git show <ref>:<path>`), so e2e tests don’t depend on GitHub raw.

7. **Close the dependency metadata gap**
   - Choose one:
     - Install-time static analysis: scan installed files for bare imports and auto-add missing npm deps to the app’s `package.json` (then run package-manager install).
     - Registry-driven deps: extend `scripts/generate-registry-index.js` to include external deps per face/shared/core and consume that.
   - Must ensure face deps like `@tanstack/svelte-virtual` are installed when needed.

Validation checklist (run before finishing)

- `pnpm --filter @equaltoai/greater-components-cli test`
- `pnpm validate:package` (especially `scripts/audit-cli-registry.mjs`)
- New e2e test passes locally and in CI-like mode (no network required if local-fetch mode is done).

Deliverables

- All code changes needed to fully implement Phase 3 above.
- Updated/added tests proving vendored face installs build/typecheck and contain no `@equaltoai/greater-components*` runtime imports.
- Keep changes focused to Phase 3; do not refactor unrelated areas.
