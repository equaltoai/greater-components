# Shadcn-Style Transition Implementation Status

> **Last Updated**: 2025-12-15
> **Implementation Phase**: Phase 1–3 Complete, Phase 4–5 Pending

This document tracks the implementation progress of the [Shadcn-Style Distribution Transition Plan](./shadcn-style-transition-plan.md).

---

## Phase 1: Align the Release Contract ✅

### Tasks Completed

1. **✅ Pick and document the version source of truth**
   - Root `package.json` version (currently `4.1.0`) is the registry version
   - `registry/index.json` generation uses the same version
   - Location: `scripts/generate-registry-index.js` line 141

2. **✅ Make tagging first-class**
   - Tag naming convention: `greater-vX.Y.Z`
   - Document that `main` is "edge" and may break

3. **✅ Create `registry/latest.json`**
   - File created at `registry/latest.json`
   - Contains `{ ref, version, updatedAt }`
   - Updated on each release

4. **✅ Add `release:tag` script**
   - Script: `scripts/release-tag.js`
   - npm scripts: `pnpm release:tag` and `pnpm release:tag:dry`
   - Orchestrates:
     - `changeset version`
     - Registry index regeneration
     - `latest.json` update
     - Git tag creation (with optional signing)
     - Push to remote (optional)

5. **✅ Configure Changesets for fixed version groups**
   - Updated `.changeset/config.json`
   - All registry-impacting packages bump together
   - Packages in fixed group:
     - `@equaltoai/greater-components-primitives`
     - `@equaltoai/greater-components-headless`
     - `@equaltoai/greater-components-icons`
     - `@equaltoai/greater-components-tokens`
     - `@equaltoai/greater-components-utils`
     - `@equaltoai/greater-components-adapters`
     - `@equaltoai/greater-components-content`
     - All shared modules (`@equaltoai/greater-components-auth`, `...-compose`, `...-notifications`, etc.)
     - All faces (`social`, `blog`, `community`, `artist`)

6. **✅ Update CI workflow**
   - Updated `.github/workflows/generate-registry.yml`
   - Now handles both `registry/index.json` and `registry/latest.json`
   - Uploads both as artifacts
   - Updates `latest.json` for `greater-v*` tags

---

## Phase 2: Make CLI "Registry-First" ✅

### Tasks Completed

1. **✅ Extended registry index schema**
   - Added `schemaVersion` field
   - Added `faces` collection with `RegistryFace` type
   - Added `shared` collection with `RegistryShared` type
   - Schema location: `packages/cli/src/utils/registry-index.ts`

2. **✅ Added `latest.json` schema and resolution**
   - Created `latestRefSchema` and `LatestRef` type
   - Implemented `fetchLatestRef()` function
   - Implemented `resolveRef()` with priority chain:
     1. Explicit `--ref` flag
     2. `components.json.ref`
     3. `registry/latest.json`
     4. Fallback constant
   - `latest` is supported as an alias and resolves via `registry/latest.json`

3. **✅ Added helper functions for faces and shared modules**
   - `getAllFaceNames()`, `getAllSharedNames()`
   - `hasFace()`, `hasShared()`
   - `getFace()`, `getShared()`
   - `getFaceChecksums()`, `getSharedChecksums()`

4. **✅ Generated initial registry index**
   - Includes: 7 packages, 4 faces, 7 shared modules
   - Total checksums: 1264 files
   - Artist face now included

5. **✅ CLI uses resolved refs + registry checksums during fetch**
   - `init`, `add`, `update`, and `diff` resolve refs (including `latest`)
   - Fetching no longer relies on the removed `packages/fediverse/src` path
   - Integrity verification uses `registry/index.json` `checksums` entries when available

---

## Phase 3: CSS and Assets ✅

### Tasks Completed

1. **✅ Add CSS source mode configuration**
   - Added `source: 'local' | 'npm'` to CSS config schema
   - Added `localDir` option (default: `styles/greater`)
   - Default mode is now `'local'` for shadcn-style distribution
   - Location: `packages/cli/src/utils/config.ts`

2. **✅ Update CSS injection to support local paths**
   - Updated `css-inject.ts` to generate local or npm import paths
   - Added `CSS_SOURCE_PATHS` for repo source file locations
   - Added `CSS_LOCAL_FILES` for local destination file names
   - Added `getCssFilesToCopy()` helper function
   - Added `artist` face to CSS path mappings
   - Location: `packages/cli/src/utils/css-inject.ts`

3. **✅ Implement CSS file copying in init command**
   - Added `copyCssFiles()` function to fetch and copy CSS files from Git tag
   - Added `CssCopyResult` and `CopyCssFilesOptions` types
   - Updated `init` command to copy CSS files when `source: 'local'`
   - CSS files are fetched from the pinned ref and written to `{libDir}/{localDir}/`
   - Import injection now uses local paths (e.g., `$lib/styles/greater/tokens.css`)
   - Location: `packages/cli/src/utils/css-inject.ts`, `packages/cli/src/commands/init.ts`

4. **✅ Implement CSS file copying in add command (face installation)**
   - Updated `injectFaceCss()` in `face-installer.ts` to support local mode
   - When `source: 'local'`, copies face CSS files before injecting imports
   - Manual instructions now show local paths when in local mode
   - Location: `packages/cli/src/utils/face-installer.ts`

5. **✅ Include CSS files in registry checksums**
   - Added `.css` extension to primitives package config in registry generation
   - All key CSS files now have checksums in `registry/index.json`:
     - `packages/tokens/src/animations.css`
     - `packages/primitives/src/theme.css` (newly added)
     - `packages/faces/{face}/src/theme.css` (all faces)
   - Registry now contains 1265 checksums (12 CSS files total)
   - Location: `scripts/generate-registry-index.js`

### Phase 3 Status: ✅ COMPLETE

All Phase 3 tasks have been completed. Consumers can now use `greater init` and `greater add` with local CSS mode - CSS files are fetched from the Git tag, copied locally, and import paths point to local files.

---

## Phase 4: npm/JSR Cleanup (Pending)

See [shadcn-style-transition-plan.md](./shadcn-style-transition-plan.md#phase-4-npmjsr-cleanup) for detailed inventory.

### Summary of Items to Remove

1. **⏳ GitHub Actions Workflows** (2 workflows)
   - `release.yml` - npm publishing via changesets
   - `snapshot.yml` - daily npm snapshots

2. **⏳ Root package.json scripts** (4 scripts)
   - `release`, `publish:jsr`, `publish:jsr:dry`, `publish:jsr:single`

3. **⏳ Package publishConfig** (21 packages)
   - Remove `publishConfig` from all packages under `packages/`

4. **⏳ Documentation updates** (~10 files)
   - Replace npm/pnpm install instructions with CLI workflow
   - Remove JSR badges and references

5. **⏳ CHANGELOG files** (optional, ~4 files)
   - Historical npm references can remain as historical record

---

## Phase 5: Hardening (Pending)

### Tasks Remaining

1. **⏳ Tag signing guidance**
2. **⏳ Offline cache CLI commands** (`greater cache ls|clear|prefetch`)
3. **⏳ End-to-end tests for install/upgrade flows

---

## Files Modified/Created

### Created
- `registry/latest.json` - Latest stable version pointer
- `scripts/release-tag.js` - Release orchestration script
- `docs/shadcn-style-implementation-status.md` - This file

### Modified
- `.changeset/config.json` - Added fixed version groups
- `package.json` - Added `release:tag` and `release:tag:dry` scripts
- `scripts/generate-registry-index.js` - Added artist face, added `.css` to primitives extensions (Phase 3)
- `.github/workflows/generate-registry.yml` - Updated for latest.json
- `packages/cli/src/utils/registry-index.ts` - Extended schema and added functions
- `packages/cli/src/utils/config.ts` - Added `source` and `localDir` to CSS config (Phase 3)
- `packages/cli/src/utils/css-inject.ts` - Local CSS path support, `getCssFilesToCopy()`, `copyCssFiles()` (Phase 3)
- `packages/cli/src/utils/face-installer.ts` - Local CSS support in `injectFaceCss()` (Phase 3)
- `packages/cli/src/commands/init.ts` - CSS file copying + local import injection (Phase 3)

### Generated
- `registry/index.json` - Full registry snapshot (auto-generated)

---

## Usage

### Creating a Release

```bash
# Dry run (preview)
pnpm release:tag:dry

# With changesets (normal flow)
pnpm release:tag

# Skip changeset step (if already versioned)
pnpm release:tag --skip-version

# Sign the tag
pnpm release:tag --sign

# Push immediately
pnpm release:tag --push
```

### Consumer Workflow

```bash
# Initialize with latest stable
greater init

# Initialize with specific version
greater init --ref greater-v4.1.0

# Add components
greater add button modal timeline

# Upgrade to new version
greater upgrade --to greater-v4.2.0
```

---

## Next Steps

1. **Test the release flow end-to-end**
   - Create a test tag and verify CLI can install from it

2. **Update CSS injection (Phase 3)**
   - Make local CSS the default instead of npm imports

3. **Add comprehensive e2e tests (Phase 5)**
   - Test install, add, upgrade with checksum verification
