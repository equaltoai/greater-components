# @equaltoai/greater-components-notifications

## 4.0.1

### Patch Changes

- Updated dependencies [6f21801]
  - @equaltoai/greater-components-primitives@3.0.1

## 4.0.0

### Major Changes

- 5a9bb32: # Greater Components 3.0.0 - Faces Architecture

  ## Breaking Changes

  ### Package Structure Reorganization
  - **`fediverse` renamed to `faces/social`**: The fediverse package is now `@equaltoai/greater-components-social` and accessed via `@equaltoai/greater-components/faces/social`
  - **CodeBlock and MarkdownRenderer moved to `content`**: These components with heavy dependencies (shiki, marked, dompurify) are now in a separate `@equaltoai/greater-components/content` package
  - **Shared components extracted**: Auth, Admin, Compose, Messaging, Search, and Notifications are now in separate packages under `shared/`

  ### Import Path Changes

  ```typescript
  // OLD (v2.x)
  import { Timeline } from '@equaltoai/greater-components/fediverse';
  import { CodeBlock } from '@equaltoai/greater-components/primitives';

  // NEW (v3.0)
  import { Timeline } from '@equaltoai/greater-components/faces/social';
  import { CodeBlock } from '@equaltoai/greater-components/content';
  ```

  ### New Package Paths
  - `@equaltoai/greater-components/content` - CodeBlock, MarkdownRenderer
  - `@equaltoai/greater-components/faces/social` - Timeline, Status, etc.
  - `@equaltoai/greater-components/shared/auth` - Authentication components
  - `@equaltoai/greater-components/shared/admin` - Admin dashboard
  - `@equaltoai/greater-components/shared/compose` - Post composer
  - `@equaltoai/greater-components/shared/messaging` - Direct messages
  - `@equaltoai/greater-components/shared/search` - Search components
  - `@equaltoai/greater-components/shared/notifications` - Notification feed

  ## Why This Change?
  1. **Lighter core package**: Apps using only Button, Card, etc. no longer pull in shiki (~2MB) and other heavy dependencies
  2. **Face-based architecture**: Organized by use case (social, blog, forum, etc.) rather than technical grouping
  3. **Shared components**: Auth, Admin, etc. can be reused across different "faces"
  4. **Future extensibility**: Ready for new faces (visual, blog, forum, commerce, video, docs, chat)

  ## Migration Guide
  1. Update import paths for fediverse → faces/social
  2. Update import paths for CodeBlock/MarkdownRenderer → content
  3. Update CSS imports to include face-specific styles if needed

### Patch Changes

- Updated dependencies [5a9bb32]
  - @equaltoai/greater-components-primitives@3.0.0
  - @equaltoai/greater-components-icons@2.0.0
