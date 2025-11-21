# @equaltoai/greater-components

## 2.0.2

### Patch Changes

- Re-establish unified CSS architecture and fix release system. All sub-packages are now properly marked as private and excluded from independent publishing. Only the main package should be published, with all components accessible through subpath imports.

## 2.0.1

### Patch Changes

- Fix GradientText component CSS compilation issue with :global syntax

  **Problem:** The GradientText component's `:global { .gr-gradient-text { ... } }` syntax was causing Svelte's compiler to incorrectly process the `background-clip: text` property during production builds, resulting in the gradient rendering as a full background box instead of being clipped to text.

  **Solution:** Changed from `:global { .gr-gradient-text { ... } }` to `:global(.gr-gradient-text) { ... }` which is the correct Svelte syntax for global class selectors. Also reordered vendor prefixes to place `-webkit-background-clip` before `background-clip` for better browser compatibility.

  **Impact:** The gradient text effect now correctly clips to text in production builds, eliminating the blue bar artifact above text.

## 2.0.0

### Major Changes

- Add Phases 1-3: Copy utilities, Core components, and Advanced interactions

  ## Phase 1: Copy and Export Utilities

  ### Utils Package
  - Added `copyToClipboard` utility with browser fallbacks
  - Added `copyElementText` and `copyCodeBlock` helpers
  - Added `exportToMarkdown`, `exportChatToMarkdown`, and `downloadMarkdown` utilities
  - Added `htmlToMarkdown` converter with Turndown and GitHub Flavored Markdown
  - Added dependencies: turndown, turndown-plugin-gfm, dompurify, isomorphic-dompurify

  ### Primitives Package
  - Added `CopyButton` component with visual feedback (copy icon → checkmark)
  - Supports icon, text, and icon-text variants
  - Accessible with aria-label updates

  ## Phase 2: Core Components
  - Added `Badge` component (pill, dot, outlined, filled variants)
  - Added `List` and `ListItem` components with icon support
  - Added `GradientText` component with preset and custom gradients
  - Added `StepIndicator` component for workflows (4 states, auto-icons)
  - Added `IconBadge` component (4 sizes, 3 shapes, 3 variants)

  ## Phase 3: Advanced Interactions
  - Added `CodeBlock` with Shiki syntax highlighting (lazy loaded)
  - Added `DropZone` for drag-and-drop file/text/URL uploads
  - Added `MarkdownRenderer` with safe HTML rendering (DOMPurify + marked)
  - Added `StreamingText` for real-time text animations
  - Added dependencies: shiki, marked

  ## Impact

  Enables complete ChatGPT-style chat interfaces, documentation sites with live code, and eliminates ~800 lines of custom CSS from typical sites.

  Total: 13 new components, 7 new utilities, 83 tests, full documentation.

## 1.1.1

### Patch Changes

- Fix broken package imports in the umbrella package by rewriting internal workspace references to relative paths.
  Fix TypeScript error in icons package registry lookup.
  Update documentation to correctly reflect the single-package installation strategy.
  Update focus-trap dependency in headless package.

## 1.1.0

### Minor Changes

- 7f0f47a: feat(primitives): Added new layout and typography components: Card, Container, Section, Heading, Text.

## 1.0.31

### Patch Changes

- c055122: Improve demos, documentation, and code cleanup.

## 1.0.30

### Patch Changes

- Fix Svelte 5 compatibility: rename $ prefixed temporary variables in compiled output

  **CRITICAL FIX:**
  - Fix Svelte 5 compatibility issue where compiled code contained `$` prefixed temporary variables (`$0`, `$1`, `$2`) that conflicted with Svelte 5's reserved `$` prefix for runes
  - Add comprehensive `vite-plugin-rename-dollar-vars` plugin that post-processes ALL compiled Svelte output (not just `.svelte.js` files)
  - Plugin detects Svelte chunks by filename, module IDs, and Svelte runtime function patterns
  - Apply plugin to all packages with Svelte components: `fediverse`, `primitives`, and `icons`
  - Fixes the error: "The $ prefix is reserved, and cannot be used for variables and imports" when consuming packages in Svelte 5 applications

  **Files Changed:**
  - `packages/fediverse/vite-plugin-rename-dollar-vars.ts` - Enhanced plugin to detect all Svelte chunks (not just .svelte.js files)
  - `packages/fediverse/vite.config.ts` - Added plugin to build pipeline
  - `packages/primitives/vite-plugin-rename-dollar-vars.ts` - Copied enhanced plugin
  - `packages/primitives/vite.config.ts` - Added plugin to build pipeline
  - `packages/icons/vite-plugin-rename-dollar-vars.ts` - Copied enhanced plugin
  - `packages/icons/vite.config.ts` - Added plugin to build pipeline
  - `scripts/verify-no-dollar-vars.js` - Added verification script to ensure no $ variables remain

  **Technical Details:**
  - Plugin now processes chunks that:
    1. Have `.svelte.js` in filename (explicit Svelte component output)
    2. Originated from a `.svelte` file (via `facadeModuleId` or `moduleIds`)
    3. Contain Svelte-specific compiled code patterns (`user_derived`, `prop`, `snippet`, etc.)
  - This ensures all compiled Svelte output is processed, including when using `preserveModules` with `.svelte` entry points that output `.js` files

  **Impact:**
  - Resolves compatibility issues when using `@equaltoai/greater-components` in Svelte 5 applications
  - Compiled output no longer contains `$` prefixed variables (`$0`, `$1`, `$2`) that conflict with Svelte 5 runes
  - All packages now build successfully with Svelte 5 compatibility
  - Verified: No `$0`, `$1`, `$2` patterns remain in compiled output across all packages

## 1.0.29

### Patch Changes

- Fix Svelte 5 compatibility: rename $ prefixed temporary variables in compiled output

  **CRITICAL FIX:**
  - Fix Svelte 5 compatibility issue where compiled code contained `$` prefixed temporary variables (`$0`, `$1`, `$2`) that conflicted with Svelte 5's reserved `$` prefix for runes
  - Add `vite-plugin-rename-dollar-vars` plugin that post-processes compiled Svelte output to rename temporary variables to `_tmp0`, `_tmp1`, `_tmp2`, etc.
  - Apply plugin to all packages with Svelte components: `fediverse`, `primitives`, and `icons`
  - Fixes the error: "The $ prefix is reserved, and cannot be used for variables and imports" when consuming packages in Svelte 5 applications

  **Files Changed:**
  - `packages/fediverse/vite-plugin-rename-dollar-vars.ts` - New plugin to rename $ prefixed variables
  - `packages/fediverse/vite.config.ts` - Added plugin to build pipeline
  - `packages/primitives/vite-plugin-rename-dollar-vars.ts` - Copied plugin
  - `packages/primitives/vite.config.ts` - Added plugin to build pipeline
  - `packages/icons/vite-plugin-rename-dollar-vars.ts` - Copied plugin
  - `packages/icons/vite.config.ts` - Added plugin to build pipeline

  **Impact:**
  - Resolves compatibility issues when using `@equaltoai/greater-components` in Svelte 5 applications
  - Compiled output no longer contains `$` prefixed variables that conflict with Svelte 5 runes
  - All packages now build successfully with Svelte 5 compatibility

## 1.0.28

### Patch Changes

- Disable Vite/esbuild minification for every Svelte 5 bundle so our compiled output never uses `$` as a variable name. This keeps all published artifacts rune-safe and fixes the “`$` name is reserved” crash reported in v1.0.27.
- Stop Vite/esbuild from mangling identifiers to `$` so the compiled Svelte output remains rune-safe under Svelte 5, and rebuild the affected packages. This fixes the `function $(...)` runtime error reported in v1.0.27.

## 1.0.27

### Patch Changes

- Switch every icon component to Svelte 5 runes-friendly `$props` destructuring so they work in runes-enabled apps and stop referencing `$props`.

## 1.0.26

### Patch Changes

- Fix Tabs component $restProps handling and add comprehensive demo

  **Fixes:**
  - Fixed `Tabs` component to use `...restProps` destructuring pattern instead of `$derived(() => $restProps())`
  - Resolves `store_invalid_shape: restProps is not a store with a subscribe method` error during SSR
  - Component now correctly forwards additional HTML attributes to the root element

  **Demo:**
  - Added comprehensive Tabs demo at `apps/playground/src/routes/tabs/+page.svelte`
  - Demonstrates horizontal tabs with underline variant
  - Demonstrates vertical tabs with pills variant and manual activation
  - Shows keyboard navigation (arrow keys, Home/End, Enter/Space)
  - Includes disabled tab states and snippet-based content rendering
  - Fully functional under SSR using local workspace packages

- Updated dependencies
  - @equaltoai/greater-components-primitives@1.0.15

## 1.0.25

### Patch Changes

- Fix the Tabs component's `$restProps` handling so SSR/custom-element renders no longer crash.

## 1.0.24

### Patch Changes

- Add npm metadata and document how to update `@equaltoai/greater-components` from npm.

## 1.0.23

### Patch Changes

- Add npm metadata and document how to update `@equaltoai/greater-components` from npm.

## 1.0.22

### Patch Changes

- Align packages with the latest Lesser GraphQL schema (including `quoteId` support) and harden timeline data handling. Adapters now normalize missing timestamps/relationships, the fediverse docs and generated types stay in sync with the schema, and the TextField primitive correctly styles the `:read-only` state.

## 1.0.20

### Patch Changes

- Fix GraphQL WebSocket authentication - use custom WebSocket implementation to preserve query parameters

  **CRITICAL FIX:**
  - Use `webSocketImpl` option in `graphql-ws` to ensure query parameters are preserved
  - Custom WebSocket class extends native WebSocket to guarantee URL with query params is used
  - This prevents graphql-ws from stripping authentication tokens from the URL

  **Files Changed:**
  - `packages/adapters/src/graphql/client.ts` - Add webSocketImpl to preserve query parameters

## 1.0.19

### Patch Changes

- Add enhanced debug logging for WebSocket URL debugging

  **DEBUG IMPROVEMENT:**
  - Added console.log statements (always visible) to trace WebSocket URL construction
  - Logs show the exact URL being passed to createClient
  - Logs token availability and length
  - Logs URL when WebSocket connects

  **Files Changed:**
  - `packages/adapters/src/graphql/client.ts` - Enhanced debug logging

- Fix GraphQL WebSocket authentication - use custom WebSocket implementation to preserve query parameters

  **CRITICAL FIX:**
  - Use `webSocketImpl` option in `graphql-ws` to ensure query parameters are preserved
  - Custom WebSocket class extends native WebSocket to guarantee URL with query params is used
  - This prevents graphql-ws from stripping authentication tokens from the URL

  **Files Changed:**
  - `packages/adapters/src/graphql/client.ts` - Add webSocketImpl to preserve query parameters

## 1.0.18

### Patch Changes

- Add enhanced debug logging for WebSocket URL debugging

  **DEBUG IMPROVEMENT:**
  - Added console.log statements (always visible) to trace WebSocket URL construction
  - Logs show the exact URL being passed to createClient
  - Logs token availability and length
  - Logs URL when WebSocket connects

  **Files Changed:**
  - `packages/adapters/src/graphql/client.ts` - Enhanced debug logging

- Fix GraphQL WebSocket authentication - add token to query string

  **CRITICAL FIX:**
  - GraphQL WebSocket now appends authentication token to URL query string as `?access_token=<JWT>`
  - Server requires token in query string for WebSocket authentication
  - Token is automatically added when creating WebSocket connection and updated when token changes
  - Falls back to manual URL construction if URL parsing fails

  **Files Changed:**
  - `packages/adapters/src/graphql/client.ts` - Add token to WebSocket URL query string

## 1.0.17

### Patch Changes

- Fix GraphQL WebSocket URL handling - WebSocket code is now ONLY executed when wsEndpoint is explicitly provided

  **CRITICAL FIX:**
  - Made `wsEndpoint` optional in `GraphQLClientConfig` - WebSocket code is NEVER executed without an explicit URL
  - If `wsEndpoint` is missing, invalid, or appears derived from `httpEndpoint`, WebSocket is skipped entirely
  - All operations route through HTTP if WebSocket is not available
  - Zero fallbacks - no WebSocket connection attempts without a valid, explicitly provided URL

  **Files Changed:**
  - `packages/adapters/src/graphql/client.ts` - Conditional WebSocket creation, strict validation

- Fix GraphQL WebSocket authentication - add token to query string

  **CRITICAL FIX:**
  - GraphQL WebSocket now appends authentication token to URL query string as `?access_token=<JWT>`
  - Server requires token in query string for WebSocket authentication
  - Token is automatically added when creating WebSocket connection and updated when token changes
  - Falls back to manual URL construction if URL parsing fails

  **Files Changed:**
  - `packages/adapters/src/graphql/client.ts` - Add token to WebSocket URL query string

## 1.0.16

### Patch Changes

- Fix GraphQL WebSocket URL handling - WebSocket code is now ONLY executed when wsEndpoint is explicitly provided

  **CRITICAL FIX:**
  - Made `wsEndpoint` optional in `GraphQLClientConfig` - WebSocket code is NEVER executed without an explicit URL
  - If `wsEndpoint` is missing, invalid, or appears derived from `httpEndpoint`, WebSocket is skipped entirely
  - All operations route through HTTP if WebSocket is not available
  - Zero fallbacks - no WebSocket connection attempts without a valid, explicitly provided URL

  **Files Changed:**
  - `packages/adapters/src/graphql/client.ts` - Conditional WebSocket creation, strict validation

- Fix critical restProps errors and improve GraphQL WebSocket URL handling

  **CRITICAL FIXES:**
  1. **restProps Initialization Errors**
     - Fixed `Avatar` and `Skeleton` components to use `...restProps` destructuring pattern instead of `$restProps()` call
     - This matches the pattern used in working components like `Button`
     - Resolves `ReferenceError: Cannot access 'restProps' before initialization` in SSR/SSG environments
     - Components now hydrate correctly in Astro/Cloudflare Workers
  2. **GraphQL WebSocket URL Handling**
     - Added defensive checks to ensure `wsEndpoint` is not derived from `httpEndpoint`
     - Added explicit URL validation and logging
     - Store `wsEndpoint` in const to prevent mutation
     - Added error logging if URL derivation is detected
     - Improved debug logging to trace WebSocket URL usage

  **Files Fixed:**
  - `packages/primitives/src/components/Avatar.svelte` - restProps pattern
  - `packages/primitives/src/components/Skeleton.svelte` - restProps pattern
  - `packages/adapters/src/graphql/client.ts` - WebSocket URL handling

  **Note:** If WebSocket still connects to wrong URL, check browser console for debug logs showing which URL is being used. The issue may be in `graphql-ws` library or Apollo Client's `GraphQLWsLink` if URL derivation persists.

## 1.0.15

### Patch Changes

- Fix critical restProps errors and improve GraphQL WebSocket URL handling

  **CRITICAL FIXES:**
  1. **restProps Initialization Errors**
     - Fixed `Avatar` and `Skeleton` components to use `...restProps` destructuring pattern instead of `$restProps()` call
     - This matches the pattern used in working components like `Button`
     - Resolves `ReferenceError: Cannot access 'restProps' before initialization` in SSR/SSG environments
     - Components now hydrate correctly in Astro/Cloudflare Workers
  2. **GraphQL WebSocket URL Handling**
     - Added defensive checks to ensure `wsEndpoint` is not derived from `httpEndpoint`
     - Added explicit URL validation and logging
     - Store `wsEndpoint` in const to prevent mutation
     - Added error logging if URL derivation is detected
     - Improved debug logging to trace WebSocket URL usage

  **Files Fixed:**
  - `packages/primitives/src/components/Avatar.svelte` - restProps pattern
  - `packages/primitives/src/components/Skeleton.svelte` - restProps pattern
  - `packages/adapters/src/graphql/client.ts` - WebSocket URL handling

  **Note:** If WebSocket still connects to wrong URL, check browser console for debug logs showing which URL is being used. The issue may be in `graphql-ws` library or Apollo Client's `GraphQLWsLink` if URL derivation persists.

- Fix critical issues: GraphQL wsEndpoint, restProps errors, and ThemeSwitcher default

  **CRITICAL FIXES:**
  1. **GraphQL Adapter wsEndpoint Fix**
     - Fixed adapter to explicitly use `wsEndpoint` config parameter instead of constructing URL
     - Added validation and explicit capture of wsEndpoint to prevent closure issues
     - Added debug logging to trace WebSocket URL usage
     - Fixed WebSocket reconnection in `updateToken` to properly use wsEndpoint
  2. **restProps Initialization Errors**
     - Fixed `restProps` initialization errors in `Avatar` and `Skeleton` components
     - Added missing `Snippet` import in `Skeleton` component
     - Ensured `$restProps()` is called before any derived values to avoid hoisting issues
     - Resolves hydration errors in Astro/SSR environments
  3. **ThemeSwitcher Default Variant**
     - Changed default variant from `"full"` to `"compact"` for header usage
     - **BREAKING CHANGE**: Settings pages now need to explicitly use `variant="full"`
     - Compact variant shows dropdown with Light/Dark/Auto options suitable for navigation headers
     - Full variant remains available for comprehensive settings panels

  **Migration:**
  - ThemeSwitcher now defaults to compact variant (suitable for headers)
  - For settings pages, use: `<GCThemeSwitcher variant="full" />`
  - For headers, use: `<GCThemeSwitcher variant="compact" />` (or omit variant for default)

  **Files Fixed:**
  - `packages/adapters/src/graphql/client.ts` - wsEndpoint usage
  - `packages/primitives/src/components/Avatar.svelte` - restProps initialization
  - `packages/primitives/src/components/Skeleton.svelte` - restProps initialization and missing import
  - `packages/primitives/src/components/ThemeSwitcher.svelte` - default variant

## 1.0.14

### Patch Changes

- Fix critical issues: GraphQL wsEndpoint, restProps errors, and ThemeSwitcher default

  **CRITICAL FIXES:**
  1. **GraphQL Adapter wsEndpoint Fix**
     - Fixed adapter to explicitly use `wsEndpoint` config parameter instead of constructing URL
     - Added validation and explicit capture of wsEndpoint to prevent closure issues
     - Added debug logging to trace WebSocket URL usage
     - Fixed WebSocket reconnection in `updateToken` to properly use wsEndpoint
  2. **restProps Initialization Errors**
     - Fixed `restProps` initialization errors in `Avatar` and `Skeleton` components
     - Added missing `Snippet` import in `Skeleton` component
     - Ensured `$restProps()` is called before any derived values to avoid hoisting issues
     - Resolves hydration errors in Astro/SSR environments
  3. **ThemeSwitcher Default Variant**
     - Changed default variant from `"full"` to `"compact"` for header usage
     - **BREAKING CHANGE**: Settings pages now need to explicitly use `variant="full"`
     - Compact variant shows dropdown with Light/Dark/Auto options suitable for navigation headers
     - Full variant remains available for comprehensive settings panels

  **Migration:**
  - ThemeSwitcher now defaults to compact variant (suitable for headers)
  - For settings pages, use: `<GCThemeSwitcher variant="full" />`
  - For headers, use: `<GCThemeSwitcher variant="compact" />` (or omit variant for default)

  **Files Fixed:**
  - `packages/adapters/src/graphql/client.ts` - wsEndpoint usage
  - `packages/primitives/src/components/Avatar.svelte` - restProps initialization
  - `packages/primitives/src/components/Skeleton.svelte` - restProps initialization and missing import
  - `packages/primitives/src/components/ThemeSwitcher.svelte` - default variant

- Fix ThemeSwitcher component and CSS backward compatibility

  **ThemeSwitcher Improvements:**
  - Added `variant` prop: `"compact"` (for headers) or `"full"` (default, settings panel)
  - Added `value` prop for controlled usage
  - Compact variant shows a dropdown button with Light/Dark/Auto options suitable for navigation headers
  - Full variant remains the comprehensive settings panel for settings pages

  **CSS Backward Compatibility:**
  - Both `style.css` and `styles.css` are now exported for backward compatibility
  - Build script automatically creates `styles.css` symlink/copy to maintain compatibility with v1.0.4 imports
  - No breaking changes - existing imports continue to work

  **Usage:**

  ```svelte
  <!-- Compact variant for headers -->
  <GCThemeSwitcher variant="compact" value={theme} onchange={handleChange} />

  <!-- Full variant for settings pages -->
  <GCThemeSwitcher variant="full" showPreview={true} showAdvanced={true} />
  ```

## 1.0.13

### Patch Changes

- Add branding icons: less-than, greater-than, and equals

  Added three new icons for the "lesser, greater and equal to" branding:
  - `LessThanIcon` (`<`) - available as `less-than`, `less`, `lt`, or `<`
  - `GreaterThanIcon` (`>`) - available as `greater-than`, `greater`, `gt`, or `>`
  - `EqualsIcon` (`=`) - available as `equals`, `equal`, `eq`, or `=`

  These icons are now available in the icons package and can be used throughout the application for branding purposes.

- Fix ThemeSwitcher component and CSS backward compatibility

  **ThemeSwitcher Improvements:**
  - Added `variant` prop: `"compact"` (for headers) or `"full"` (default, settings panel)
  - Added `value` prop for controlled usage
  - Compact variant shows a dropdown button with Light/Dark/Auto options suitable for navigation headers
  - Full variant remains the comprehensive settings panel for settings pages

  **CSS Backward Compatibility:**
  - Both `style.css` and `styles.css` are now exported for backward compatibility
  - Build script automatically creates `styles.css` symlink/copy to maintain compatibility with v1.0.4 imports
  - No breaking changes - existing imports continue to work

  **Usage:**

  ```svelte
  <!-- Compact variant for headers -->
  <GCThemeSwitcher variant="compact" value={theme} onchange={handleChange} />

  <!-- Full variant for settings pages -->
  <GCThemeSwitcher variant="full" showPreview={true} showAdvanced={true} />
  ```

## 1.0.12

### Patch Changes

- Fix Apollo Client ESM Directory Import Issue

  **CRITICAL FIX**: Resolves directory import errors blocking OAuth login flow in ES module environments.
  - Changed `@apollo/client/link/subscriptions` to `@apollo/client/link/subscriptions/index.js`
  - Changed `@apollo/client/utilities` to `@apollo/client/utilities/index.js`
  - Changed `@apollo/client/link/error` to `@apollo/client/link/error/index.js`
  - Changed `@apollo/client/link/retry` to `@apollo/client/link/retry/index.js`

  This resolves the "Directory import '/home/.../node_modules/@apollo/client/link/subscriptions' is not supported resolving ES modules" error that was blocking authentication flows in Vite/Astro environments.

- Add branding icons: less-than, greater-than, and equals

  Added three new icons for the "lesser, greater and equal to" branding:
  - `LessThanIcon` (`<`) - available as `less-than`, `less`, `lt`, or `<`
  - `GreaterThanIcon` (`>`) - available as `greater-than`, `greater`, `gt`, or `>`
  - `EqualsIcon` (`=`) - available as `equals`, `equal`, `eq`, or `=`

  These icons are now available in the icons package and can be used throughout the application for branding purposes.

## 1.0.11

### Patch Changes

- Fix Apollo Client ESM Directory Import Issue

  **CRITICAL FIX**: Resolves directory import errors blocking OAuth login flow in ES module environments.
  - Changed `@apollo/client/link/subscriptions` to `@apollo/client/link/subscriptions/index.js`
  - Changed `@apollo/client/utilities` to `@apollo/client/utilities/index.js`
  - Changed `@apollo/client/link/error` to `@apollo/client/link/error/index.js`
  - Changed `@apollo/client/link/retry` to `@apollo/client/link/retry/index.js`

  This resolves the "Directory import '/home/.../node_modules/@apollo/client/link/subscriptions' is not supported resolving ES modules" error that was blocking authentication flows in Vite/Astro environments.

## 1.0.11

### Patch Changes

- Fix Apollo Client ESM Directory Import Issue

  **CRITICAL FIX**: Resolves directory import errors blocking OAuth login flow in ES module environments.

  **Fixed:**
  - Changed `@apollo/client/link/subscriptions` to `@apollo/client/link/subscriptions/index.js`
  - Changed `@apollo/client/utilities` to `@apollo/client/utilities/index.js`
  - Changed `@apollo/client/link/error` to `@apollo/client/link/error/index.js`
  - Changed `@apollo/client/link/retry` to `@apollo/client/link/retry/index.js`

  **Files Fixed:**
  - packages/adapters/src/graphql/client.ts

  This resolves the "Directory import '/home/.../node_modules/@apollo/client/link/subscriptions' is not supported resolving ES modules" error that was blocking authentication flows in Vite/Astro environments.

  **Previous attempts:**
  - v1.0.2: Used `@apollo/client/core` (directory import error)
  - v1.0.3: Used `@apollo/client/core/index.js` (Vite path doubling error)
  - v1.0.4: Attempted to use `@apollo/client` main export (not available for link utilities)

  No breaking changes.

## 1.0.4

### Patch Changes

- Fix Apollo Client Imports - Use Main Package Export

  Correctly fixes Apollo Client ESM import issues by using the main package export.

  **Fixed:**
  - Changed all `@apollo/client/core` imports to `@apollo/client`
  - Changed all `@apollo/client/link/*` imports to main export
  - Changed all `@apollo/client/utilities` imports to main export

  **Previous attempts:**
  - v1.0.2: Used `@apollo/client/core` (directory import error)
  - v1.0.3: Used `@apollo/client/core/index.js` (Vite path doubling error)
  - v1.0.4: Uses `@apollo/client` main export ✅

  **Files Fixed:**
  - packages/adapters/src/graphql/client.ts
  - packages/adapters/src/graphql/cache.ts
  - packages/adapters/src/graphql/LesserGraphQLAdapter.ts
  - packages/adapters/src/graphql/optimistic.ts

  This resolves ESM import errors in all environments (Vite, Node.js, bundlers).

  No breaking changes.

## 1.0.3

### Patch Changes

- Fix Apollo Client ESM Imports

  Fixes directory import errors with Apollo Client in ESM environments.

  **Fixed:**
  - Changed all `@apollo/client/core` imports to `@apollo/client/core/index.js`
  - Changed `@apollo/client/link/*` imports to explicit file paths with `.js` extension
  - Changed `@apollo/client/utilities` imports to explicit file path

  **Files Updated:**
  - packages/adapters/src/graphql/client.ts
  - packages/adapters/src/graphql/cache.ts
  - packages/adapters/src/graphql/LesserGraphQLAdapter.ts
  - packages/adapters/src/graphql/optimistic.ts

  This resolves "Directory import not allowed in ESM" errors when using the package.

  No breaking changes - fully backward compatible with v1.0.2.

## 1.0.2

### Patch Changes

- Fix Primitives Package - Add Missing Components and TypeScript Declarations

  This patch fixes critical issues in the primitives package reported in v1.0.1:

  **Fixed:**
  - ✅ Added TypeScript declarations (.d.ts) for all 15 components
  - ✅ Added missing TextArea component
  - ✅ Added missing Select component
  - ✅ Added missing Checkbox component
  - ✅ Added missing Switch component
  - ✅ Added missing FileUpload component

  **Components Now Available (15 total):**
  - Button, TextField, TextArea, Select, Checkbox, Switch, FileUpload
  - Modal, Menu, Tooltip, Tabs
  - Avatar, Skeleton, ThemeSwitcher, ThemeProvider

  **TypeScript Support:**
  - All components now have proper .d.ts declarations
  - Exported prop types: ButtonProps, TextFieldProps, TextAreaProps, etc.
  - SelectOption interface exported for type safety

  No breaking changes - fully backward compatible with v1.0.1.
