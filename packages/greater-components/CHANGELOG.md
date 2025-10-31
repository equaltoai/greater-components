# @equaltoai/greater-components

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
