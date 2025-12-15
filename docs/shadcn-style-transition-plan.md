# Shadcn-Style Distribution Transition Plan (Greater Components)

> **Status**: Phase 1–3 Complete (Phase 4–5 Pending)  
> **Owner**: Greater Components Team  
> **Last Updated**: 2025-12-15  
> **Primary Reference**: `docs/lesser-faces-and-cli-model.md`

This document is a comprehensive, execution-oriented plan to transition Greater Components from “publish many npm packages” to a **shadcn-style** model:

- **CLI is the product**: consumers run a CLI to **copy source code** into their app.
- **Git tags are the release contract**: the CLI installs from a pinned `ref` (tag/commit).
- **Changesets remain**: we still use Changesets for **SemVer + changelogs**, even if we stop publishing component packages to npm.

## Context (Single Consumer)

You are currently the only consumer of Greater Components. The project has been published to npm, but it has not been publicly promoted. This changes priorities:

- Optimize for **security and operational simplicity** (avoid registry automation tokens and surprise installs).
- Prefer **reproducibility and rollback** for your own app over long-term public compatibility promises.
- Treat “public migration comms” and long deprecation windows as **optional**.

---

## Status Summary (as of 2025-12-15)

- ✅ Phase 1 complete: release contract is `tag → registry snapshot` (`registry/index.json` + `registry/latest.json`)
- ✅ Phase 2 complete: CLI resolves refs (supports `latest`) and fetches + verifies via `registry/index.json` checksums
- ✅ Phase 3 complete: CSS files copied locally by default, no runtime npm CSS imports needed

## 0) Desired End State (What “Done” Looks Like)

### Consumer workflow (your app)

- Initialize:
  - `greater init`
  - Creates `components.json` with a pinned `ref` (default: latest stable tag).
- Add components:
  - `greater add button modal`
  - Copies component source into the consumer repo (Svelte components, TS utilities, CSS as needed).
- Upgrade:
  - `greater upgrade --to greater-vX.Y.Z`
  - Updates installed components deterministically and reports local modifications.

### Release contract

- A release is a **git tag**: `greater-vX.Y.Z` (optionally signed).
- The tag includes a committed registry snapshot:
  - `registry/index.json` (and optional `registry/latest.json`)
- Consumers can reproduce installs forever:
  - `ref` in `components.json` pins exactly what was installed.

---

## 1) Key Decisions (Make These Explicit Up Front)

1. **How is the CLI distributed?**
   - **Homebrew** installs a CLI artifact from **GitHub Releases** (brew verifies checksums).
2. **What is the single source of truth for “registry version”?**
   - One SemVer for the entire registry snapshot, used for the tag (`greater-vX.Y.Z`).
3. **How does the CLI determine “latest stable”?**
   - publish `registry/latest.json` on `main` and have the CLI read it.

4. **CSS strategy (important if you stop publishing npm packages)**
   - the CLI copies token + base CSS into the consumer repo by default (no `@equaltoai/greater-components/*` CSS imports).

5. **Optional fallback: git dependencies instead of registry**
   - You can install directly from GitHub with `pnpm add <git+https://...>#<ref>`.
   - This avoids npm publishing/tokens for *your* packages, but does not eliminate npm registry usage for third-party deps.


---

## 2) Versioning & Changesets Policy (Shadcn-Compatible)

### 2.1 The rule: SemVer applies to the registry snapshot

- **MAJOR**: breaking changes to installed output (API, file locations, behavior), or required ecosystem changes.
- **MINOR**: new components/features, new optional capabilities, backwards-compatible expansions.
- **PATCH**: bug fixes and non-breaking behavior changes.

### 2.2 Keep Changesets; change what “release” means

- Continue author workflow:
  - Every user-visible change that affects installed output includes a changeset.
  - Changesets generate changelog entries and drive the next SemVer bump.
- Update release workflow:
  - Use `changeset version` to bump versions + changelogs.
  - Do **not** rely on `changeset publish` for component distribution.
  - Create a git tag `greater-vX.Y.Z` from the release commit.

### 2.3 Enforce “one coherent snapshot” (recommended)

To avoid tag/version drift, pick one of these approaches:

**Fixed version group**

- Configure Changesets “fixed” groups so all registry-impacting packages stay in lockstep.
- Result: one bump produces consistent versions across the repo and matches the release tag.


### 2.4 Tag naming & provenance

- Tag naming: `greater-vX.Y.Z`
- Strongly recommended:
  - Signed tags in CI-free, human-controlled release flow
  - The CLI supports `--verify-signature` and warns on unsigned tags (already supported conceptually)

### 2.5 Single-consumer simplifications (optional)

Because there is only one consumer app, you can relax process without losing safety:

- Use `main` (or a commit SHA) for day-to-day installs, and create tags only for “known good” rollback points.
- Write changesets when you intend to cut a tag (not necessarily for every small internal tweak).
- Keep SemVer/tagging anyway if you expect to open usage to more apps/teams later.

---

## 3) Registry Contract (What the CLI Installs From)

### 3.1 Minimum viable registry artifacts

- `registry/index.json` committed in the repo at the release tag:
  - Includes: `version`, `ref`, `generatedAt`, `components`, and `checksums`
  - May include: `schemaVersion`, `faces`, `shared` (extra keys should remain backwards compatible)
- Optional but recommended:
  - `registry/latest.json` on `main`:
    - `{ "ref": "greater-vX.Y.Z", "version": "X.Y.Z" }`

### 3.2 Deterministic installs

- The CLI must be able to:
  - Resolve items (components/faces/shared/patterns) to a file list
  - Fetch files from the pinned `ref`
  - Verify checksums when available
  - Write files to consumer project paths + update `components.json`

### 3.3 Backwards compatibility rules for the registry schema

- Additive changes are allowed (new keys).
- Breaking schema changes require:
  - A new `schemaVersion`
  - CLI support for multiple schema versions (or a major bump with a clear cutoff).

---

## 4) Workstreams & Execution Plan

### Phase 1: Align the release contract (version -> tag -> registry) ✅

**Goal**: a release commit can always be tagged and installed from.

Tasks:

1. **Pick and document the version source of truth**
   - `package.json` at repo root is the registry version.
   - Ensure `registry/index.json` generation uses that same version.
2. **Make tagging first-class**
   - Define `greater-vX.Y.Z` as the only supported “stable ref” for consumers.
   - Document that `main` is “edge” and may break.
3. **Update scripts**
   - Add a `release:tag` script (local, human-run) that:
     - runs `changeset version`
     - regenerates `registry/index.json`
     - creates the git tag
4. **Add CI checks**
   - Validate `registry/index.json` is in sync when relevant files change.
   - Prevent merging changes that affect installable output without a changeset (policy dependent).

Definition of done:

- A dry-run release produces a commit with updated changelogs and a valid `registry/index.json`.
- Tagging that commit yields an installable release.

### Phase 2: Make the CLI “registry-first” (data-driven) ✅

**Goal**: the CLI installs exclusively from the tagged registry snapshot, with minimal hardcoded paths.

Tasks:

1. **Ref resolution**
   - Implement `ref` priority:
     1) CLI flag `--ref`
     2) `components.json.ref`
     3) `registry/latest.json` (recommended) or CLI default constant
2. **Registry index consumption**
   - Ensure the CLI’s registry index schema accepts the repository’s `registry/index.json` shape.
   - Prefer using the registry index for file lists + checksums, not hardcoded per-component lists.
3. **Remove hardcoded repo paths**
   - Ensure fetching uses file paths provided by the registry metadata (not a fixed `packages/...` prefix).
4. **Upgrade and diff**
   - Implement `greater diff` and `greater upgrade` using:
     - checksums (to detect local modifications)
     - registry snapshots at two refs (to compute changes)

Definition of done:

- `init` pins a ref and installs without relying on npm-published component packages.
- `add` works using registry data, and checksum verification works at tags.

### Phase 3: CSS and assets (remove runtime npm dependency) ✅

**Goal**: consumers do not need `@equaltoai/greater-components` installed to use installed components.

Tasks:

1. **Decide default CSS behavior**
   - Default to copying token + base styles into the consumer repo (recommended).
   - Keep `--css-source=npm|local` (or similar) for migration if needed.
2. **Update injection logic**
   - Update CLI to inject imports from local paths (e.g. `$lib/styles/greater/tokens.css`) instead of package imports.
3. **Ensure assets are in the registry**
   - Include any required CSS files in `registry/index.json` (so they’re pinned and checksummed).

Definition of done:

- A greenfield consumer app can use installed components with zero `@equaltoai/greater-components*` runtime deps.

### Phase 4: npm/JSR cleanup

**Goal**: remove or minimize npm/JSR as a dependency/distribution channel.

#### 4.1 GitHub Actions Workflows to Remove/Update

| File | Current State | Action |
|------|---------------|--------|
| `.github/workflows/release.yml` | Uses `changeset publish` to npm with `NPM_TOKEN` | Remove npm publishing, keep only Git tag creation |
| `.github/workflows/snapshot.yml` | Daily snapshot to npm `--tag next` | Remove entirely or convert to Git-based snapshots |

#### 4.2 Root Package.json Scripts to Remove

| Script | Command | Action |
|--------|---------|--------|
| `release` | `changeset publish` | Remove (replaced by `release:tag`) |
| `publish:jsr` | `node scripts/publish-jsr.js` | Remove (script doesn't exist) |
| `publish:jsr:dry` | `node scripts/publish-jsr.js --dry-run` | Remove |
| `publish:jsr:single` | `node scripts/publish-jsr.js --package` | Remove |

#### 4.3 Package-level `publishConfig` to Remove (21 packages)

Remove `publishConfig` from all package.json files:
- `packages/content/package.json`
- `packages/icons/package.json`
- `packages/utils/package.json`
- `packages/tokens/package.json`
- `packages/testing/package.json`
- `packages/headless/package.json`
- `packages/greater-components/package.json` (main bundle)
- `packages/cli/package.json`
- `packages/adapters/package.json`
- `packages/primitives/package.json`
- `packages/faces/blog/package.json`
- `packages/faces/community/package.json`
- `packages/faces/artist/package.json`
- `packages/faces/social/package.json`
- `packages/shared/notifications/package.json`
- `packages/shared/messaging/package.json`
- `packages/shared/search/package.json`
- `packages/shared/compose/package.json`
- `packages/shared/auth/package.json`
- `packages/shared/admin/package.json`
- `packages/shared/chat/package.json`

#### 4.4 Documentation to Update

Replace `npm install`/`pnpm add @equaltoai/*` instructions with CLI-based workflow:

| File | Current Content | Update To |
|------|-----------------|-----------|
| `README.md` | npm/pnpm/jsr install instructions + JSR badge | `greater init` + `greater add` |
| `docs/getting-started.md` | npm/pnpm install | CLI workflow |
| `docs/cli-guide.md` | `npm install -g @equaltoai/greater-components-cli` | `npx @equaltoai/greater-components-cli` or Homebrew |
| `docs/api-reference.md` | npm install examples | CLI examples |
| `docs/troubleshooting.md` | npm install fallback | CLI troubleshooting |
| `docs/migration-from-npm.md` | npm → CLI migration | May keep as historical reference |
| `docs/importing-components.md` | `pnpm add` | CLI `greater add` |
| `docs/quick-reference.md` | `pnpm add` | CLI reference |
| `docs/chat-suite.md` | `pnpm add` | CLI instructions |
| `packages/*/README.md` | Package-specific npm install | CLI instructions or mark as internal |

#### 4.5 JSR-Specific References to Remove

| File | Reference | Action |
|------|-----------|--------|
| `README.md` | JSR badge | Remove |
| `README.md` | `npx jsr add @equaltoai/greater-components` | Remove |

#### 4.6 CHANGELOG Files (Optional)

Historical npm install references in CHANGELOGs can remain as historical record or be left as-is:
- `packages/adapters/CHANGELOG.md`
- `packages/faces/social/CHANGELOG.md`
- `packages/testing/CHANGELOG.md`
- `packages/icons/CHANGELOG.md`

Definition of done:

- No active npm/JSR publishing workflows
- `publishConfig` removed from all packages
- Documentation points to CLI as primary installation method
- Your day-to-day workflow does not require npm publish tokens

### Phase 5: Hardening (security, reliability, tooling)

Tasks:

- Tag signing guidance + optional verification in CLI.
- Offline cache UX (already partially implemented) with clear commands:
  - `greater cache ls|clear|prefetch`
- Registry integrity enforcement:
  - `registry/index.json` validation in CI
  - deterministic generation (stable ordering)
- Add end-to-end tests for:
  - install, add, upgrade, and “modified file” detection

Definition of done:

- Releases are reproducible, verifiable, and robust to network hiccups.

---

## 5) Rollout Checklist (Per Release)

- [ ] Changesets merged (at least for changes you plan to tag)
- [ ] `changeset version` executed
- [ ] `registry/index.json` regenerated and committed
- [ ] Optional: `registry/latest.json` updated on `main`
- [ ] Tag created: `greater-vX.Y.Z` (signed strongly recommended)
- [ ] CLI shipped (brew formula bump / GitHub Release / optional npm) if CLI changed
- [ ] Docs updated if install instructions changed

---

## 6) Risks & Mitigations

- **Risk: “version drift” (tag doesn’t match what CLI installs)**
  - Mitigation: single version source of truth; CI validates registry artifacts at release commits.
- **Risk: breaking consumer edits on upgrade**
  - Mitigation: checksum-based “modified” detection; default to non-destructive upgrades with prompts.
- **Risk: schema/index changes break old CLIs**
  - Mitigation: additive schema evolution; versioned schema + backwards-compatible parsing.
- **Risk: repo ref hardcoding (repo rename, org move)**
  - Mitigation: make repo URL configurable in `components.json` (with a safe default).

---

## 7) User Impacts (What Changes for You)

- **Pros**
  - No npm publish tokens/MFA required for distributing components (Git tags + GitHub Releases are the contract).
  - Deterministic installs: `components.json.ref` pins exactly what was installed (easy rollback by changing ref).
  - Local ownership: you can patch installed files immediately without forking/publishing.
- **Cons**
  - Upgrades become an explicit workflow (diff/upgrade), not automatic semver dependency bumps.
  - You still depend on npm for third-party packages (Svelte/Vite/etc); this approach mainly removes *your* reliance on npm publishing.
  - Larger installs if you choose to copy big bundles (faces/shared) instead of per-component.

## 8) Immediate Next Steps (1–2 Weeks)

1. Confirm decisions in “Key Decisions” (Section 1).
2. Pick the version source of truth and implement Phase 1.
3. Implement “latest ref” resolution (recommended: `registry/latest.json`).
4. Update CLI CSS strategy so “no npm runtime deps” is the default for new projects.

See also: `docs/npm-footprint.md` for the current dependency footprint analysis.
