# @equaltoai/greater-components

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
