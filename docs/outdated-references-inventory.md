# Outdated Package Reference Inventory

This file lists all occurrences of outdated package references (specifically `greater-components-fediverse` and `greater-components/fediverse`) found in the `packages` directory. These references should ideally be updated to `@equaltoai/greater-components/faces/social` or `@equaltoai/greater-components-social` (for internal workspace deps) in a future refactor.

## Summary

- **Target Term 1**: `greater-components-fediverse` (Old package name)
- **Target Term 2**: `greater-components/fediverse` (Old import path)
- **Status**: Documentation (`docs/`) has been updated, but internal source code and changelogs still contain references.

## Inventory

### Source Files (High Priority)

The following source files contain JSDoc examples or internal references using the old package name. These are excellent candidates for a "Replace All" refactor.

#### `packages/faces/social/src/index.ts`

- Contains JSDoc examples for `createLesserClient`, `Profile`, `Lists`, `Filters` etc. using `@equaltoai/greater-components-fediverse`.

#### `packages/faces/social/src/components/Status/index.ts`

- JSDoc examples for `Status` usage use `@equaltoai/greater-components-fediverse`.

#### `packages/faces/social/src/components/Timeline/index.ts`

- JSDoc examples for `Timeline` usage use `@equaltoai/greater-components-fediverse`.

#### `packages/faces/social/src/components/Status/README.md`

- Documentation within the component folder.

#### `packages/faces/social/src/components/Timeline/README.md`

- Documentation within the component folder.

#### `packages/faces/social/src/generics/README.md`

- Documentation for generic types.

#### `packages/faces/social/src/examples/realtime-usage.md`

- Usage examples for realtime features.

### Other Source Files

- `packages/shared/notifications/src/index.ts`
- `packages/shared/notifications/src/context.ts`
- `packages/shared/notifications/src/Filter.svelte`
- `packages/shared/admin/src/index.ts`
- `packages/shared/admin/src/Insights/context.ts`
- `packages/shared/admin/src/Cost/context.ts`
- `packages/shared/admin/src/TrustGraph/context.ts`
- `packages/shared/compose/src/index.ts`
- `packages/shared/compose/src/context.ts`
- `packages/shared/compose/src/ImageEditor.svelte`
- `packages/shared/compose/src/MediaUpload.svelte`
- `packages/shared/compose/src/ThreadComposer.svelte`
- `packages/shared/search/src/index.ts`
- `packages/shared/messaging/src/index.ts`
- `packages/faces/social/src/adapters/index.ts`
- `packages/faces/social/src/generics/adapters.ts`
- `packages/faces/social/src/adapters/graphql/index.ts`
- `packages/faces/social/src/generics/index.ts`
- `packages/faces/social/src/components/Lists/index.ts`
- `packages/faces/social/src/patterns/index.ts`
- `packages/faces/social/src/components/Status/context.ts`
- `packages/faces/social/src/components/Timeline/context.ts`
- `packages/faces/social/src/components/Filters/index.ts`
- `packages/faces/social/src/components/Profile/index.ts`
- `packages/faces/social/src/components/Profile/*.svelte` (Various profile components)

### Configuration & Build Files

- `packages/faces/social/package.json` (Likely correct in `name` field, but may have internal references or scripts)
- `packages/faces/social/vite.config.ts`
- `packages/faces/social/jsr.json`
- `packages/greater-components/scripts/build.js`

### Changelogs (Low Priority - Historical)

- `packages/icons/CHANGELOG.md`
- `packages/utils/CHANGELOG.md`
- `packages/headless/CHANGELOG.md`
- `packages/primitives/CHANGELOG.md`
- `packages/testing/CHANGELOG.md`
- `packages/content/CHANGELOG.md`
- `packages/faces/social/CHANGELOG.md`
- `packages/shared/*/CHANGELOG.md`
- `packages/cli/CHANGELOG.md`
- `packages/adapters/CHANGELOG.md`
- `packages/greater-components/CHANGELOG.md`
- `packages/headless/README.md`

## Recommendations

1.  **Mass Replace in JSDocs**: Perform a search and replace for `@equaltoai/greater-components-fediverse` -> `@equaltoai/greater-components/faces/social` in all `.ts`, `.svelte`, and `README.md` files within `packages/faces/social/src` and `packages/shared`.
2.  **Verify Imports**: Ensure that cross-package imports in the monorepo are using the workspace protocol or the correct package name if they are referencing `faces/social`.
3.  **Update Build Scripts**: Check `packages/greater-components/scripts/build.js` to ensure it's correctly bundling the `faces/social` package and not looking for a non-existent `fediverse` folder.
