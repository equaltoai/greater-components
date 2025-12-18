# Phase 4 — Automated Export + Dependency Audits in CI (Design Doc)

This document defines the CI “package integrity” gate for Greater Components.
The intent is to fail fast on correctness and consistency regressions in:

- `package.json#exports` maps
- built `dist/` output hygiene (no embedded pnpm paths / vendored `node_modules`)
- runtime dependency declarations (no missing deps for bare imports)
- CLI registry integrity (`registry/index.json` points at real files)
- tokens output correctness (no placeholder tokens leaked to CSS)

This is **not** about npm publishing. These audits are filesystem-based and are designed to run deterministically after a monorepo install/build.

---

## 1) Context & Constraints

### Installation model (why these checks exist)

The primary consumption model is “CLI-first, fully vendored”:

- Apps run `greater init` / `greater add` and **vendor Greater source** into the app (`$lib/...`).
- Apps should have **no runtime imports** from `@equaltoai/greater-components*`.
- The umbrella packages still need to be correct for internal tooling/docs, but they are not the runtime contract for apps.

Source plan reference: `planning/quality-completeness-consistency-plan.md:307`.

### Principles

- **Fail fast**: these checks should run _before_ long test suites.
- **Deterministic**: no network calls in audit scripts themselves.
- **Actionable output**: failures must point to exact files/packages and explain the remediation path.
- **Cheap to run**: avoid heavy parsing; use direct filesystem scans and regex extraction.

---

## 2) What “Phase 4 complete” means (Definition of Done)

1. A single command exists and is the primary contract:
   - `pnpm validate:package` (already present) runs all audits.
2. CI runs this contract after a build:
   - `pnpm build`
   - `pnpm validate:package`
3. CI fails when any of these regress:
   - broken exports targets
   - `.pnpm` / pnpm store paths appear in `dist/**`
   - bare imports in `dist/**` are not declared in deps/peerDeps
   - registry points at missing files
   - tokens dist contains `{token.placeholder}` patterns

Optional (recommended) DoD extensions:

- Add per-audit scripts (`validate:exports`, `validate:dist`, `validate:deps`, `validate:cli`, `validate:tokens`) for local iteration and clearer CI logs.
- Run the same validation step in additional workflows that build packages (coverage, e2e, a11y).

---

## 3) Current Implementation (as of now)

### 3.1 “Package integrity” command

Root script:

- `package.json:41`–`package.json:47`:
  - `validate:exports` → `node scripts/audit-exports.mjs`
  - `validate:dist` → `node scripts/audit-dist-hygiene.mjs`
  - `validate:deps` → `node scripts/audit-runtime-deps.mjs`
  - `validate:cli` → `node scripts/audit-cli-registry.mjs`
  - `validate:tokens` → `node scripts/audit-tokens-placeholders.mjs`
  - `validate:package` → composes the above (and runs them in a stable order)
  - `validate:registry` → `node scripts/validate-registry-index.js --strict` (checksum + schema gate; not part of `validate:package` by default)

This exceeds the plan’s original four checks by including tokens placeholder validation as part of the standard package gate.

### 3.2 CI wiring

Main CI job:

- `.github/workflows/test.yml:33` runs `pnpm build`
- `.github/workflows/test.yml:36` runs `pnpm validate:package`

Additional workflows that build packages also run the package gate:

- `.github/workflows/coverage.yml:40`
- `.github/workflows/e2e.yml:42`
- `.github/workflows/a11y.yml:49`

Registry strict validation is conditional on PR diffs (only when registry-related files change):

- `.github/workflows/test.yml:39`

---

## 4) Audit Contracts (behavioral specs)

Each audit below is “source of truth” documented by the implementation script itself.

### 4.1 Export map audit — `scripts/audit-exports.mjs`

Reference: `scripts/audit-exports.mjs:1`.

**Input**

- All `package.json` files under the repo (excluding `node_modules/`, `dist/`, `.git/`).

**Checks**

- For each non-root package that has `exports`:
  - resolve export targets recursively:
    - string targets
    - conditional targets (`{ import, types, svelte, default, ... }`)
    - arrays
    - globs (`*`)
  - fail if:
    - a direct file export target does not exist
    - a glob export matches zero files

**Prerequisite**

- If exports point to `dist/**`, the package must already be built.

**Failure output**

- Per package `package.json`, prints missing targets and exits `1`.

**Remediation**

- Fix the package’s `exports` map to point at actual outputs, or
- Update the build to emit the expected file(s), then rebuild and re-run the audit.

**Known limitations**

- The audit validates “export target exists”, not “export target is semantically correct”.

---

### 4.2 Dist hygiene audit — `scripts/audit-dist-hygiene.mjs`

Reference: `scripts/audit-dist-hygiene.mjs:1`.

**Input**

- Every `dist/` directory that is a sibling of a `package.json` (so it is a package output).

**Checks**

- Recursively scan dist files (excluding `.map`) for the substring `.pnpm`.

**Rationale**
`.pnpm` in output indicates build artifacts are leaking pnpm store paths or bundling dependency trees into dist, which makes outputs non-portable and inconsistent.

**Prerequisite**

- Requires `dist/` output → run `pnpm build` first.

**Failure output**

- Prints exact file(s) in `dist/**` that contain `.pnpm` and exits `1`.

**Remediation**

- Externalize runtime deps in Vite/Rollup (and/or remove `preserveModules` patterns that embed dependencies).

**Recommended hardening**
The plan also calls out `dist/**/node_modules/**` and `/node_modules/` strings as failures:

- `planning/quality-completeness-consistency-plan.md:89`

Suggested change (optional):

- Fail if a `dist/node_modules/` directory exists.
- Scan for `node_modules/` strings in JS output as well.

---

### 4.3 Runtime dependency audit — `scripts/audit-runtime-deps.mjs`

Reference: `scripts/audit-runtime-deps.mjs:1`.

**Input**

- Every package directory with both `package.json` and `dist/`.
- Every `dist/**/*.js|mjs|cjs` file in those packages.

**Checks**

- Extract import specifiers from:
  - static imports (`import … from 'x'`)
  - side-effect imports (`import 'x'`)
  - re-exports (`export … from 'x'`)
  - dynamic imports (`import('x')`)
  - `require('x')`
- For each **bare import**:
  - ignore relative (`./…`) and absolute (`/…`) imports
  - ignore Node builtins (`node:*` and builtinModules)
  - normalize subpaths to a package root (`@scope/pkg/x` → `@scope/pkg`, `pkg/x` → `pkg`)
  - require that normalized package name is present in:
    - `dependencies`, or
    - `peerDependencies`

**Prerequisite**

- Requires dist output → run `pnpm build`.

**Failure output**

- Per package, prints missing deps (import + file) and exits `1`.

**Remediation**

- Add the dependency to the importing package’s `dependencies`/`peerDependencies`, or
- Adjust build output to avoid that import (bundle/internalize), or
- Correct an unintended import path.

**Known limitations**

- Regex extraction won’t catch fully computed specifiers, but it covers the patterns that usually cause breakage.

---

### 4.4 CLI registry audit — `scripts/audit-cli-registry.mjs`

Reference: `scripts/audit-cli-registry.mjs:1`.

**Input**

- `registry/index.json` (tracked)

**Checks**

- Validates that every file path referenced by the registry exists on disk:
  - `registry.components[*].files[*].path` under `packages/<component>/...`
  - `registry.faces[*].files[*].path` under `packages/faces/<face>/...`
  - `registry.shared[*].files[*].path` under `packages/shared/<module>/...`
  - every key in `registry.checksums` as a repo-relative file path

**Prerequisite**

- `registry/index.json` must exist. It does not require a build.

**Failure output**

- Prints missing file paths with section identifiers and exits `1`.

**Remediation**

- Regenerate and commit the registry index:
  - generator: `scripts/generate-registry-index.js:1`
  - strict validator: `scripts/validate-registry-index.js:1`
- If generation is missing file types, update the generator’s extension lists:
  - `scripts/generate-registry-index.js:33`

**Related “strict correctness” tooling**

- Registry schema: `schemas/registry-index.schema.json:1`
- Registry checksum validator (recommended in tag workflow): `scripts/validate-registry-index.js:1`
- Tag workflow currently runs strict validation:
  - `.github/workflows/generate-registry.yml:47`

Policy choice:

- Run checksum validation in PR CI (stronger but forces frequent registry regen), or
- Keep checksum validation in the tag workflow only.

Current implementation:

- Tag-time validation always runs: `.github/workflows/generate-registry.yml:47`
- PR-time validation runs only when registry-related files change: `.github/workflows/test.yml:39`

---

### 4.5 Tokens placeholder audit — `scripts/audit-tokens-placeholders.mjs`

Reference: `scripts/audit-tokens-placeholders.mjs:1`.

**Input**

- `packages/tokens/dist/**/*.css|scss` (excluding `.map`)

**Checks**

- Fails if placeholders like `{color.base.white}` exist in emitted CSS/SCSS.

**Prerequisite**

- Requires tokens build output → satisfied by `pnpm build` in CI.

**Failure output**

- Prints file(s) and sample placeholder matches and exits `1`.

**Remediation**

- Fix token generation/build so placeholders are resolved, rebuild tokens.

---

## 5) CI Design Guidance

### 5.1 Ordering

The expected order (and why):

1. `pnpm install --frozen-lockfile` (ensures deterministic deps)
2. `pnpm build` (ensures exports/dist audits have targets)
3. `pnpm validate:package` (fast fail on packaging/correctness)
4. `pnpm test:unit` / E2E / coverage (slower checks)

Main workflow already follows this:

- `.github/workflows/test.yml:30`

### 5.2 Extend validation to other workflows (recommended)

Implemented:

- Coverage workflow: `.github/workflows/coverage.yml:40`
- Playwright E2E workflow: `.github/workflows/e2e.yml:42`
- A11y workflow: `.github/workflows/a11y.yml:49`

### 5.3 Standardize Node version

- CI uses `.nvmrc` (Node 20): `.nvmrc:1`
- Ensure all workflows prefer `.nvmrc` where possible (most already do).

---

## 6) Recommended Improvements (to make Phase 4 easier to operate)

### 6.1 Add per-audit scripts (ergonomics)

Implemented in `package.json:41`–`package.json:47`:

- `validate:exports`, `validate:dist`, `validate:deps`, `validate:cli`, `validate:tokens`
- `validate:package` composes them for a single CI contract.

This exactly matches the plan intent:

- `planning/quality-completeness-consistency-plan.md:309`

### 6.2 Consider adding `validate-registry-index` in CI (policy decision)

If you want stronger guarantees for vendored installs:

- Add `pnpm validate:registry` to PR CI (or to `validate:package`).

Trade-off:

- Strong correctness vs. more frequent need to regenerate/commit `registry/index.json`.

### 6.3 Improve failure UX

Optional but high value:

- Print “next command to run” in failures (e.g. `pnpm --filter <pkg> build`).
- Add a short doc section to the contributor docs describing the remediation flow.

---

## 7) Developer Runbook

### 7.1 Local commands (match CI)

Run exactly what CI runs:

```bash
pnpm build
pnpm validate:package
```

Run audits individually:

```bash
pnpm validate:exports
pnpm validate:dist
pnpm validate:deps
pnpm validate:cli
pnpm validate:tokens
pnpm validate:registry
```

### 7.2 Common failures and what to do

- **Export audit failure** → fix `exports` paths or build outputs; rebuild.
- **Dist hygiene failure** → externalize deps in build config; rebuild.
- **Runtime deps failure** → add missing dep/peerDep to the package; rebuild.
- **Registry audit failure** → regenerate `registry/index.json` and commit; or update generator.
- **Tokens placeholder failure** → fix token generator; rebuild tokens.

---

## 8) Reference Index (source of truth)

- Phase 4 plan: `planning/quality-completeness-consistency-plan.md:307`
- CI hook: `.github/workflows/test.yml:33`
- Package integrity script: `package.json:41`
- Export audit: `scripts/audit-exports.mjs:1`
- Dist hygiene audit: `scripts/audit-dist-hygiene.mjs:1`
- Runtime deps audit: `scripts/audit-runtime-deps.mjs:1`
- CLI registry audit: `scripts/audit-cli-registry.mjs:1`
- Tokens audit: `scripts/audit-tokens-placeholders.mjs:1`
- Registry generator: `scripts/generate-registry-index.js:1`
- Registry validator: `scripts/validate-registry-index.js:1`
- Registry schema: `schemas/registry-index.schema.json:1`
- Tag-time registry workflow: `.github/workflows/generate-registry.yml:44`
