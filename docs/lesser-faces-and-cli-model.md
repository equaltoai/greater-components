# Lesser Faces & CLI-Based Distribution

> **Status**: Design Document  
> **Last Updated**: 2024-12-10  
> **Authors**: EqualTo AI Team

A comprehensive design for how **Lesser** (headless ActivityPub) and **Greater Components** work together to power multiple "faces" (blog, social, community) without relying on npm registries or automation tokens.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Concept Overview](#3-concept-overview)
4. [Architectural Design](#4-architectural-design)
5. [Face Definitions](#5-face-definitions)
6. [CLI Design & Requirements](#6-cli-design--requirements)
7. [Registry Schema](#7-registry-schema)
8. [Versioning & Compatibility](#8-versioning--compatibility)
9. [Security Model](#9-security-model)
10. [Customization Patterns](#10-customization-patterns)
11. [Example Workflows](#11-example-workflows)
12. [Future Considerations](#12-future-considerations)
13. [Requirements Matrix](#13-requirements-matrix)

---

## 1. Executive Summary

This document defines the architecture for distributing **Greater Components** as source code via a CLI tool, enabling developers to build opinionated product surfaces ("faces") on top of **Lesser**—a headless ActivityPub system. This approach deliberately bypasses npm's publish mechanism to avoid supply chain vulnerabilities associated with long-lived automation tokens.

### Key Principles

| Principle             | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| **Source-First**      | Components are distributed as readable, modifiable source code  |
| **Git as Truth**      | Releases are Git tags, not npm versions                         |
| **No Tokens**         | Zero long-lived automation tokens in the publish flow           |
| **Face Kits**         | Opinionated component bundles for common product shapes         |
| **Lesser Decoupling** | Frontends can exist independently of a specific Lesser instance |

---

## 2. Problem Statement

### 2.1 Supply Chain Risks in npm

Modern npm publishing requires one of:

- **OTP/TOTP tokens**: Manual intervention for each publish
- **Long-lived automation tokens**: Security liability; a single compromised token can inject malicious code into downstream projects
- **Granular access tokens**: Still vulnerable if leaked in CI logs

**WebAuthn-only workflows do not map cleanly to npm's current automation model.**

### 2.2 Dependency Fragility

Traditional npm dependencies create:

- **Hidden upgrades**: Automatic minor/patch updates can introduce breaking changes
- **Transitive risk**: Dependencies of dependencies are not auditable
- **Lock-in**: Deeply nested `node_modules` trees that are difficult to audit or replace

### 2.3 Lack of Frontend Flexibility

Existing component libraries force consumers into:

- Fixed design systems with limited customization
- Opinionated routing that doesn't match their app structure
- CSS-in-JS or utility-first approaches that may conflict with existing styles

---

## 3. Concept Overview

### 3.1 Lesser: The Headless Backend

**Lesser** is a headless ActivityPub system providing:

| Capability         | API Surface                                      |
| ------------------ | ------------------------------------------------ |
| Content Management | GraphQL mutations for posts, replies, reactions  |
| Federation         | ActivityPub inbox/outbox, remote actor discovery |
| Authentication     | WebAuthn, OAuth 2.0, wallet-based auth           |
| Moderation         | Trust scores, community notes, content warnings  |
| Analytics          | Cost metrics, engagement tracking                |
| Real-time          | WebSocket subscriptions for live updates         |

Lesser does **not** prescribe any UI—it is purely an API layer.

### 3.2 Faces: Product-Specific Frontends

A **Face** is an opinionated frontend built on Lesser:

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Shell                       │
│                    (SvelteKit + Routing)                     │
├─────────────────────────────────────────────────────────────┤
│                         Face Kit                             │
│              (Social / Blog / Community / Admin)             │
├─────────────────────────────────────────────────────────────┤
│                     Shared Modules                           │
│    (Auth, Profile, Search, Compose, Notifications, Chat)    │
├─────────────────────────────────────────────────────────────┤
│                       Primitives                             │
│     (Button, Modal, Menu, Tabs, Tooltip, Card, Avatar)      │
├─────────────────────────────────────────────────────────────┤
│                   Headless Behaviors                         │
│   (Focus trap, Keyboard nav, ARIA, Popover positioning)     │
├─────────────────────────────────────────────────────────────┤
│                    Adapter Layer                             │
│    (GraphQL client, WebSocket, Unified types, Mappers)      │
├─────────────────────────────────────────────────────────────┤
│                        Lesser                                │
│             (Headless ActivityPub Backend)                   │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Greater Components: The Source Repository

Greater Components is:

- **The single source of truth** for all UI building blocks
- **Organized by capability**, not by npm package boundaries
- **Distributed via CLI**, not via `npm install`

---

## 4. Architectural Design

### 4.1 Layer Definitions

#### Layer 1: Headless Behaviors (`packages/headless`)

Pure TypeScript utilities with no visual output:

| Module            | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `focus-trap`      | Trap focus within modals, dialogs        |
| `roving-tabindex` | Arrow key navigation in lists            |
| `typeahead`       | Type-to-search in menus                  |
| `popover`         | Smart positioning for tooltips/dropdowns |
| `dismissable`     | Click-outside and ESC handling           |
| `live-region`     | ARIA live announcements                  |

**Requirements:**

- Zero Svelte dependencies (usable in any framework)
- Fully typed with strict TypeScript
- 100% unit test coverage

#### Layer 2: Design Tokens (`packages/tokens`)

Design system primitives in multiple formats:

```
tokens/
├── src/
│   ├── base.json          # Color palette, spacing scale
│   ├── semantic.json      # Intent-based tokens (action, success, danger)
│   └── themes.json        # Light, dark, high-contrast overrides
├── dist/
│   ├── css/               # CSS custom properties
│   ├── js/                # ESM exports
│   └── scss/              # Sass variables
```

**Requirements:**

- WCAG AA contrast compliance across all themes
- Token transformation pipeline (JSON → CSS/JS/SCSS)
- Theme-switching at runtime via CSS class

#### Layer 3: Primitives (`packages/primitives`)

Styled, accessible building blocks:

| Component                                          | Description                                           |
| -------------------------------------------------- | ----------------------------------------------------- |
| `Button`                                           | Primary, secondary, ghost, danger variants            |
| `Card`                                             | Container with header, body, footer slots             |
| `Avatar`                                           | Image with fallback, status indicator                 |
| `Modal`                                            | Dialog with portal, backdrop, focus trap              |
| `Menu`                                             | Dropdown with keyboard nav, typeahead                 |
| `Tabs`                                             | Tab list with arrow keys, automatic/manual activation |
| `Tooltip`                                          | Smart positioning, hover/focus triggers               |
| `Input`, `Textarea`, `Checkbox`, `Radio`, `Select` | Form controls                                         |
| `Skeleton`, `StreamingText`, `GradientText`        | Loading and effects                                   |

**Requirements:**

- Svelte 5 runes (`$state`, `$derived`, `$effect`)
- Compound component pattern (e.g., `Menu.Root`, `Menu.Trigger`, `Menu.Content`)
- All props typed and documented
- Accessibility tests with Axe-core

#### Layer 4: Shared Modules (`packages/shared/*`)

Cross-cutting product features:

| Module          | Components/Functions                                                        |
| --------------- | --------------------------------------------------------------------------- |
| `auth`          | LoginForm, RegisterForm, WebAuthnSetup, TwoFactorVerify, OAuthConsent       |
| `compose`       | ComposeBox, CharacterCount, VisibilitySelector, MediaAttach, ThreadControls |
| `notifications` | NotificationsFeed, NotificationItem, GroupedNotification, FilterBar         |
| `search`        | SearchBar, SearchResults, ActorResult, NoteResult, TagResult, Filters       |
| `chat`          | MessageThread, MessageBubble, ConversationList, Composer                    |
| `admin`         | Dashboard, ModerationQueue, ReportViewer, BanManager                        |
| `messaging`     | ThreadView, MessageCompose, ConversationPicker                              |

**Requirements:**

- Each module is self-contained with its own `index.ts` exports
- Shared modules may depend on primitives, never on faces
- Typed integration with adapters layer

#### Layer 5: Adapters (`packages/adapters`)

Backend integration layer:

```typescript
// Core abstractions
interface TransportManager {
	query<T>(document: TypedDocumentNode<T>): Promise<T>;
	mutate<T>(document: TypedDocumentNode<T>, variables: object): Promise<T>;
	subscribe<T>(document: TypedDocumentNode<T>): AsyncIterable<T>;
}

interface UnifiedStatus {
	id: string;
	content: string;
	account: UnifiedAccount;
	// Lesser-specific
	estimatedCost?: number;
	trustScore?: number;
	communityNotes?: CommunityNote[];
	quoteCount?: number;
}
```

**Requirements:**

- GraphQL fragments for Lesser schema
- Mappers: `mapLesserPost()`, `mapLesserAccount()`, `mapLesserNotification()`
- WebSocket client with reconnection, heartbeat, latency tracking
- Unified types that abstract over Lesser vs. generic ActivityPub

#### Layer 6: Faces (`packages/faces/*`)

Complete product experiences:

| Face        | Primary Use Case                  |
| ----------- | --------------------------------- |
| `social`    | Twitter/Mastodon-style timeline   |
| `blog`      | Medium/WordPress-style publishing |
| `community` | Reddit/forum-style discussions    |

Each face contains:

- Domain-specific components (e.g., `Timeline`, `Status`, `ComposeBox` for social)
- Patterns (e.g., `ThreadView`, `ModerationTools`)
- Theme overrides (`theme.css`)
- Type exports (`types.ts`)

**Requirements:**

- Faces may compose shared modules and primitives
- Faces must not directly depend on each other
- Each face exports a manifest of its components for CLI discovery

### 4.2 Dependency Graph

```
                    ┌──────────────┐
                    │    Faces     │
                    │ (social/blog │
                    │  /community) │
                    └──────┬───────┘
                           │ uses
              ┌────────────┼────────────┐
              ▼            ▼            ▼
      ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
      │   Shared     │ │   Patterns   │ │   Adapters   │
      │   Modules    │ │              │ │              │
      └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
              │               │               │
              └───────────────┼───────────────┘
                              │ uses
                              ▼
                    ┌──────────────────┐
                    │    Primitives    │
                    └────────┬─────────┘
                             │ uses
                ┌────────────┼────────────┐
                ▼            ▼            ▼
        ┌────────────┐ ┌────────────┐ ┌────────────┐
        │  Headless  │ │   Tokens   │ │   Utils    │
        └────────────┘ └────────────┘ └────────────┘
```

**Invariant**: No upward dependencies. Primitives never depend on faces.

---

## 5. Face Definitions

### 5.1 Social Face (Twitter/Mastodon Style)

**Focus**: Short-form posts, real-time feeds, social interactions.

#### Core Components

| Component           | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| `Timeline`          | Virtual-scrolling feed with gap handling           |
| `Status`            | Post display with media, actions, content warnings |
| `StatusCard`        | Compact status for embeds                          |
| `ComposeBox`        | Post composition with visibility, media, polls     |
| `NotificationsFeed` | Grouped notifications with filtering               |
| `Profile`           | User profile header, stats, tabs                   |
| `ThreadView`        | Conversation threading                             |
| `TrendingPanel`     | Trending hashtags and topics                       |
| `SuggestionsPanel`  | Follow suggestions                                 |

#### Patterns Included

- `ModerationTools`: Block, mute, report actions
- `VisibilitySelector`: Public, unlisted, followers-only, direct
- `ContentWarningHandler`: Expand/collapse sensitive content
- `CustomEmojiPicker`: Server-specific emoji
- `PollComposer`: Create and display polls
- `MediaComposer`: Multi-image, video, alt text, focal point

#### Recommended Shared Modules

- `auth`, `compose`, `notifications`, `search`, `chat`

### 5.2 Blog Face (Medium/WordPress Style)

**Focus**: Long-form content, editorial workflows, reading experience.

#### Core Components

| Component           | Purpose                             |
| ------------------- | ----------------------------------- |
| `ArticleView`       | Long-form post with rich formatting |
| `ArticleEditor`     | Markdown/WYSIWYG post editor        |
| `AuthorCard`        | Author bio and metadata             |
| `PublicationBanner` | Publication branding                |
| `TableOfContents`   | Auto-generated TOC                  |
| `ReadingProgress`   | Scroll progress indicator           |
| `RecommendedPosts`  | Related content suggestions         |
| `NewsletterSignup`  | Email subscription                  |
| `ArchiveView`       | Month/year browse                   |
| `TagCloud`          | Tag visualization                   |

#### Patterns Included

- `EditorToolbar`: Formatting controls
- `DraftManager`: Save and schedule drafts
- `RevisionHistory`: Version comparison
- `SEOMetadata`: Title, description, social cards
- `CanonicalUrl`: Cross-posting deduplication

#### Recommended Shared Modules

- `auth`, `search`, `admin`

### 5.3 Community Face (Reddit/Forum Style)

**Focus**: Topic-based discussions, voting, community moderation.

#### Core Components

| Component         | Purpose                            |
| ----------------- | ---------------------------------- |
| `CommunityIndex`  | List of communities with stats     |
| `CommunityHeader` | Community banner, rules sidebar    |
| `PostListing`     | Sortable post list (hot, new, top) |
| `ThreadView`      | Nested comment threading           |
| `CommentTree`     | Collapsible comment hierarchy      |
| `VoteButtons`     | Upvote/downvote with score         |
| `FlairSelector`   | Post and user flair                |
| `ModerationPanel` | Mod queue, actions, logs           |
| `RulesSidebar`    | Community rules display            |
| `WikiPage`        | Community wiki content             |

#### Patterns Included

- `SortingControls`: Hot, new, top, controversial
- `FlairFilter`: Filter by post flair
- `ModActions`: Remove, lock, sticky, distinguish
- `BanDialog`: Ban user with reason and duration
- `SpamFilter`: Auto-moderation rules

#### Recommended Shared Modules

- `auth`, `search`, `admin`, `notifications`

---

## 6. CLI Design & Requirements

### 6.1 Command Reference

#### `greater init`

Initialize Greater Components in a consumer project.

```bash
greater init [options]

Options:
  --cwd <path>       Working directory (default: current)
  --yes, -y          Use defaults without prompts
  --ref <tag>        Pin to a specific version tag
```

**Behavior:**

1. **Detect project type**:
   - SvelteKit (presence of `svelte.config.js` + `@sveltejs/kit`)
   - Vite + Svelte (presence of `vite.config.*` + `svelte`)
   - Bare Svelte (presence of `svelte` only)

2. **Validate Svelte version**:
   - Require `svelte@^5.0.0`
   - Error with upgrade instructions if < 5.0.0

3. **Create `components.json`**:

   ```json
   {
   	"$schema": "https://greater.components.dev/schema.json",
   	"version": "1.0.0",
   	"ref": "greater-v0.1.1",
   	"style": "default",
   	"aliases": {
   		"components": "$lib/components/ui",
   		"utils": "$lib/utils",
   		"lib": "$lib",
   		"hooks": "$lib/hooks"
   	},
   	"css": {
   		"tokens": true,
   		"primitives": true,
   		"face": null
   	},
   	"installed": []
   }
   ```

4. **Optionally inject CSS imports**:
   - Detect `+layout.svelte` or `main.ts` entry point
     - Insert:
       ```css
       @import '$lib/styles/greater/tokens.css';
       @import '$lib/styles/greater/primitives.css';
       ```

**Exit conditions:**

- ✅ `components.json` created successfully
- ❌ Svelte version incompatible
- ❌ Could not detect project type

#### `greater add`

Add components, modules, or faces to the project.

```bash
greater add [items...] [options]

Options:
  --cwd <path>       Working directory (default: current)
  --yes, -y          Skip confirmation prompts
  --all, -a          Include all optional dependencies
  --path <path>      Override target path for this install
  --ref <tag>        Use a different version than configured
  --force, -f        Overwrite existing files
```

**Behavior:**

1. **Parse item names**:
   - Primitives: `button`, `modal`, `menu`, `tabs`, etc.
   - Shared modules: `auth`, `profile`, `search`, `compose`, `notifications`, `chat`, `admin`
   - Patterns: `thread-view`, `moderation-tools`, `visibility-selector`, etc.
   - Face bundles: `faces/social`, `faces/blog`, `faces/community`

2. **Resolve dependency tree**:

   ```
   timeline
   ├── status (registry dependency)
   │   ├── avatar (primitive)
   │   └── button (primitive)
   ├── virtual-scroller (utility)
   └── button (primitive)
   ```

3. **Prompt for confirmation**:

   ```
   The following will be installed:

   Components (5):
     • timeline → $lib/components/ui/Timeline/
     • status → $lib/components/ui/Status/
     • avatar → $lib/components/ui/Avatar/
     • button → $lib/components/ui/Button/
     • virtual-scroller → $lib/utils/virtual-scroller.ts

   npm dependencies (0 new):
     (none)

   Continue? [Y/n]
   ```

4. **Fetch files from registry**:
   - Clone from configured `ref` (Git tag)
   - Read file contents from specific paths
   - Transform import paths to match consumer aliases

5. **Write to project**:
   - Create directories as needed
   - Write files with transformed imports
   - Skip files with `--force` check

6. **Update `components.json`**:

   ```json
   {
   	"installed": [
   		{ "name": "button", "version": "0.1.1", "installedAt": "2024-12-10T12:00:00Z" },
   		{ "name": "timeline", "version": "0.1.1", "installedAt": "2024-12-10T12:00:00Z" }
   	]
   }
   ```

7. **Install npm dependencies** (if any new ones):
   - Run `npm install` / `pnpm add` for required packages

**Exit conditions:**

- ✅ All items installed successfully
- ⚠️ Some files skipped (already exist, no `--force`)
- ❌ Unknown item name
- ❌ Dependency resolution failed

#### `greater list`

List all available components.

```bash
greater list [options]

Options:
  --type, -t <type>   Filter by type: primitive, compound, pattern, adapter, shared, face
  --domain <domain>   Filter by domain: social, blog, community, admin, common
  --installed         Show only installed components
  --json              Output as JSON
```

**Output example:**

```
Primitives
──────────────────────────────────
  button          Accessible button with variants
  modal           Dialog with focus trap
  menu            Dropdown with keyboard nav
  tabs            Tab interface with arrow keys
  tooltip         Smart positioning tooltip
  avatar          Image with fallback
  card            Container with slots

Shared Modules
──────────────────────────────────
  auth            Authentication (WebAuthn, 2FA, OAuth)
  compose         Post composition
  notifications   Notification feed
  search          Search with filters
  chat            Real-time messaging
  admin           Admin dashboard

Patterns
──────────────────────────────────
  thread-view           Conversation threading
  moderation-tools      Block, mute, report
  visibility-selector   Post visibility
  content-warning       Sensitive content handling
  custom-emoji-picker   Server emoji

Faces
──────────────────────────────────
  faces/social     Twitter/Mastodon style (23 components)
  faces/blog       Medium/WordPress style (18 components)
  faces/community  Reddit/Forum style (19 components)
```

#### `greater diff`

Show changes between installed version and latest.

```bash
greater diff [item] [options]

Options:
  --ref <tag>        Compare against a specific version
```

**Output example:**

```diff
diff --git $lib/components/ui/Button/Button.svelte
@@ -15,6 +15,8 @@
   let { variant = 'primary', size = 'md', ...rest } = $props();
+
+  // NEW: Loading state support
+  let { loading = false } = $props();
 </script>

-<button class="btn btn-{variant} btn-{size}" {...rest}>
+<button class="btn btn-{variant} btn-{size}" disabled={loading} {...rest}>
+  {#if loading}<Spinner size="sm" />{/if}
   <slot />
 </button>
```

#### `greater update`

Update installed components to a newer version.

```bash
greater update [items...] [options]

Options:
  --all               Update all installed components
  --ref <tag>         Update to a specific version
  --dry-run           Show what would be updated
  --force, -f         Overwrite local modifications
```

**Behavior:**

1. Fetch new versions
2. Compare with installed files
3. If local modifications detected, prompt:
   ```
   Button has local modifications. Options:
   [1] Keep local version (skip update)
   [2] Overwrite with upstream (--force)
   [3] Show diff and decide
   ```
4. Apply updates
5. Update `components.json`

### 6.2 CLI Internal Architecture

```
cli/
├── src/
│   ├── index.ts              # Entry point, commander setup
│   ├── commands/
│   │   ├── init.ts           # greater init
│   │   ├── add.ts            # greater add
│   │   ├── list.ts           # greater list
│   │   ├── diff.ts           # greater diff
│   │   └── update.ts         # greater update
│   ├── registry/
│   │   └── index.ts          # Component metadata registry
│   ├── utils/
│   │   ├── config.ts         # components.json handling
│   │   ├── detect-project.ts # Project type detection
│   │   ├── fetch-files.ts    # Git/HTTP file fetching
│   │   ├── transform.ts      # Import path transformation
│   │   ├── logger.ts         # Colored console output
│   │   └── hash.ts           # File integrity checking
│   └── types.ts              # TypeScript types
```

---

## 7. Registry Schema

### 7.1 Component Metadata

Each component in the registry has this structure:

```typescript
interface ComponentMetadata {
	// Identification
	name: string; // e.g., "button", "timeline"
	type: 'primitive' | 'compound' | 'pattern' | 'adapter' | 'shared' | 'face';
	description: string;

	// Files to install
	files: {
		path: string; // Relative path in Greater repo
		target: 'components' | 'utils' | 'types' | 'styles'; // Target alias
		transform: boolean; // Apply import transformation?
	}[];

	// Dependencies
	dependencies: {
		name: string; // npm package
		version: string; // SemVer range
	}[];
	devDependencies: {
		name: string;
		version: string;
	}[];
	registryDependencies: string[]; // Other Greater components

	// Metadata
	tags: string[]; // Search/filter tags
	version: string; // Component version
	lesserVersion?: string; // Compatible Lesser schema version
	breaking?: string[]; // Breaking change warnings
}
```

### 7.2 Face Manifest

Faces include additional metadata:

```typescript
interface FaceManifest extends ComponentMetadata {
	type: 'face';

	// Included components
	includes: {
		primitives: string[];
		shared: string[];
		patterns: string[];
		components: string[]; // Face-specific
	};

	// CSS entry points
	styles: {
		main: string; // Main face CSS
		tokens?: string; // Token overrides
	};

	// Documentation
	examples: string[]; // Example app paths
	docs: string; // Documentation URL
}
```

### 7.3 Registry Index

The CLI fetches a registry index on each operation:

```json
{
	"schemaVersion": "1.0.0",
	"generatedAt": "2024-12-10T12:00:00Z",
	"ref": "greater-v0.1.1",
	"checksums": {
		"button": "sha256-abc123...",
		"timeline": "sha256-def456..."
	},
	"components": {
		"button": {/* ComponentMetadata */},
		"timeline": {/* ComponentMetadata */}
	},
	"faces": {
		"social": {/* FaceManifest */}
	}
}
```

---

## 8. Versioning & Compatibility

### 8.1 Version Scheme

Greater Components uses a three-part version aligned with Lesser:

```
greater-v{MAJOR}.{MINOR}.{PATCH}
         │       │       │
         │       │       └─ Bug fixes, non-breaking changes
         │       └─────────── New components, new optional features
         └─────────────────── Breaking changes to existing components
                              OR Lesser schema incompatibility
```

### 8.2 Compatibility Matrix

| Greater Version | Lesser Version | Svelte Version | Node.js  |
| --------------- | -------------- | -------------- | -------- |
| greater-v0.1.x  | lesser-v\*     | ^5.0.0         | >=24.0.0 |

### 8.3 Schema Coupling

Each shared module documents its Lesser schema requirements:

```typescript
// In packages/shared/notifications/index.ts
/**
 * @lesserSchemaVersion 1.3.0
 * @lesserQueries NotificationsQuery, UnreadCountQuery
 * @lesserSubscriptions NotificationSubscription
 */
```

The CLI can verify schema compatibility:

```bash
greater add notifications

⚠️  This component requires Lesser v1.3.0+
    Your components.json specifies Lesser v1.2.0

    Options:
    [1] Install anyway (may have runtime errors)
    [2] Update components.json to specify Lesser v1.3.0
    [3] Cancel
```

### 8.4 Git Tag Strategy

Releases are tagged in the Greater Components repository:

```bash
# Release tags
git tag greater-v0.1.1 -m "Release 0.1.1"
git tag greater-v0.1.1-lesser-v1.3.0  # Explicit compatibility tag

# Push with signatures (WebAuthn/GPG)
git push origin greater-v0.1.1
```

The CLI fetches from these tags:

```typescript
// fetch-files.ts
async function fetchComponent(name: string, ref: string): Promise<ComponentFiles> {
	const registry = await fetchRegistry(ref);
	const metadata = registry.components[name];

	return Promise.all(
		metadata.files.map((file) =>
			fetchRawFile(`https://github.com/equaltoai/greater-components/raw/${ref}/${file.path}`)
		)
	);
}
```

---

## 9. Security Model

### 9.1 Threat Model

| Threat                               | Mitigation                            |
| ------------------------------------ | ------------------------------------- |
| Compromised npm automation token     | **Eliminated**: No npm publish occurs |
| Malicious code injection via CI      | Signed Git tags verify provenance     |
| Man-in-the-middle download tampering | Checksum verification of all files    |
| Typosquatting (fake packages)        | Single source of truth (this repo)    |
| Dependency confusion                 | No external registry lookups          |

### 9.2 Trust Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                    TRUSTED ZONE                             │
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │  Developer      │    │  Greater Repo   │                │
│  │  Machine        │◄───│  (GitHub)       │                │
│  │                 │    │                 │                │
│  │  - Local clone  │    │  - Signed tags  │                │
│  │  - CLI binary   │    │  - SHA checksums│                │
│  └─────────────────┘    └─────────────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    UNTRUSTED ZONE                           │
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │  npm Registry   │    │  CDNs           │                │
│  │  (not used)     │    │  (not used for  │                │
│  │                 │    │   components)   │                │
│  └─────────────────┘    └─────────────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 9.3 Integrity Verification

The CLI verifies downloads:

```typescript
// hash.ts
import { createHash } from 'crypto';

async function verifyFile(content: Buffer, expectedHash: string): Promise<boolean> {
	const hash = createHash('sha256').update(content).digest('hex');
	return `sha256-${hash}` === expectedHash;
}

// In add.ts
for (const file of files) {
	const content = await fetchRawFile(file.url);
	const metadata = registry.checksums[componentName];

	if (!(await verifyFile(content, metadata.files[file.path]))) {
		throw new Error(`Integrity check failed for ${file.path}`);
	}
}
```

### 9.4 CLI Distribution

The CLI itself is distributed via:

1. **GitHub Releases**: Install the packaged CLI tarball
2. **Local clone**: `node ./packages/cli/dist/index.js`

For maximum security, users can clone the repo and run the CLI directly:

```bash
git clone https://github.com/equaltoai/greater-components
cd greater-components
pnpm install && pnpm --filter @equaltoai/greater-components-cli build
node ./packages/cli/dist/index.js init
```

---

## 10. Customization Patterns

### 10.1 Component Customization Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│  1. INSTALL                                                  │
│     greater add button                                       │
│     → $lib/components/ui/Button/Button.svelte               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  2. CUSTOMIZE (Recommended Pattern)                          │
│                                                              │
│  Create wrapper:                                             │
│  $lib/components/AppButton.svelte                           │
│                                                              │
│  <script>                                                   │
│    import Button from './ui/Button/Button.svelte';          │
│    let { variant = 'primary', ...rest } = $props();         │
│    // App-specific defaults, analytics, etc.                │
│  </script>                                                  │
│  <Button {variant} class="app-button" {...rest}>            │
│    <slot />                                                 │
│  </Button>                                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  3. OVERRIDE STYLES                                          │
│                                                              │
│  In app.css:                                                │
│  .app-button.btn-primary {                                  │
│    --btn-bg: var(--color-brand);                            │
│    --btn-radius: var(--space-2);                            │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  4. UPDATE PATH                                              │
│                                                              │
│  greater update button                                       │
│  → Updates $lib/components/ui/Button/                       │
│  → AppButton.svelte unchanged                               │
│  → Custom styles preserved                                  │
└─────────────────────────────────────────────────────────────┘
```

### 10.2 Separation Strategy

Recommended project structure:

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/                    # ← Greater Components (upstream)
│   │   │   ├── Button/
│   │   │   ├── Modal/
│   │   │   └── Timeline/
│   │   │
│   │   ├── app/                   # ← App-specific wrappers
│   │   │   ├── AppButton.svelte
│   │   │   ├── AppModal.svelte
│   │   │   └── PostCard.svelte    # Composes Status + custom logic
│   │   │
│   │   └── domain/                # ← Business-specific components
│   │       ├── PricingCard.svelte
│   │       └── OnboardingWizard.svelte
│   │
│   └── utils/
│       ├── index.ts               # ← Greater utilities
│       └── app-utils.ts           # ← App utilities
```

### 10.3 Style Override Priority

CSS cascade order:

1. **Token defaults** (`tokens/theme.css`)
2. **Primitive styles** (`primitives/style.css`)
3. **Face styles** (`faces/social/style.css`)
4. **App overrides** (`app.css`)

```css
/* 1. Tokens define base values */
:root {
	--color-primary-500: #3b82f6;
}

/* 2. Primitives use tokens */
.btn-primary {
	background: var(--btn-primary-bg, var(--color-primary-500));
}

/* 3. Face may override */
.social-face .btn-primary {
	--btn-primary-bg: var(--color-primary-600);
}

/* 4. App overrides final */
.app-button.btn-primary {
	--btn-primary-bg: #7c3aed; /* Brand purple */
}
```

### 10.4 Composing Faces

Mix components from multiple faces:

```svelte
<!-- routes/+page.svelte -->
<script>
	// Social face for timeline
	import Timeline from '$lib/components/ui/Timeline/Root.svelte';
	import Status from '$lib/components/ui/Status/Root.svelte';

	// Blog face for article display
	import ArticleView from '$lib/components/ui/ArticleView/Root.svelte';

	// Shared for common features
	import SearchBar from '$lib/components/ui/Search/Bar.svelte';
</script>

<div class="hybrid-layout">
	<aside class="feed">
		<Timeline>
			{#each posts as post}
				<Status status={post} />
			{/each}
		</Timeline>
	</aside>

	<main class="content">
		{#if selectedArticle}
			<ArticleView article={selectedArticle} />
		{/if}
	</main>
</div>
```

---

## 11. Example Workflows

### 11.1 Build a Social Platform (Twitter Face)

**Goal**: Create a Mastodon-compatible social client on Lesser.

```bash
# 1. Create SvelteKit project
npx sv create my-social-app
cd my-social-app

# 2. Initialize Greater Components
greater init

# 3. Add the social face
greater add faces/social

# This installs:
# - All primitives (button, modal, menu, tabs, avatar, card, etc.)
# - Shared modules (auth, compose, notifications, search, chat)
# - Social components (Timeline, Status, Profile, etc.)
# - Social patterns (thread-view, moderation-tools, etc.)
# - Social theme CSS

# 4. Configure Lesser connection
# In src/lib/lesser.ts
	import { LesserGraphQLAdapter } from '$lib/greater/adapters';

	export const lesser = new LesserGraphQLAdapter({
	  httpEndpoint: 'https://api.myinstance.social/graphql',
	  wsEndpoint: 'wss://api.myinstance.social/graphql',
	  token: import.meta.env.VITE_LESSER_TOKEN,
	});

# 5. Build your routes
# src/routes/+page.svelte
<script>
  import Timeline from '$lib/components/ui/Timeline/Root.svelte';
  import { lesser } from '$lib/lesser';

  let timeline = $state(null);

  $effect(() => {
    lesser.query(HomeTimelineQuery).then(data => {
      timeline = data.homeTimeline;
    });
  });
</script>

<Timeline items={timeline} />
```

### 11.2 Build a Blog Platform (Blog Face)

**Goal**: Create a Medium-style publication on Lesser.

```bash
# 1. Create SvelteKit project
npx sv create my-blog
cd my-blog

# 2. Initialize
greater init

# 3. Add blog face
greater add faces/blog

# 4. Customize branding
# Edit $lib/components/ui/PublicationBanner/PublicationBanner.svelte
# Or create wrapper:

# src/lib/components/MyBanner.svelte
<script>
  import PublicationBanner from '$lib/components/ui/PublicationBanner/PublicationBanner.svelte';
</script>

<PublicationBanner
  title="My Tech Blog"
  tagline="Thoughts on software engineering"
  logo="/my-logo.svg"
>
  <slot />
</PublicationBanner>
```

### 11.3 Build a Community Platform (Reddit Face)

**Goal**: Create a topic-based forum on Lesser.

```bash
# 1. Create project
npx sv create my-forum
cd my-forum

# 2. Initialize
greater init

# 3. Add community face
greater add faces/community

# 4. Add admin module for moderation
greater add admin

# 5. Configure ranking
# In src/lib/ranking.ts
export function hotScore(upvotes: number, downvotes: number, createdAt: Date): number {
  const score = upvotes - downvotes;
  const order = Math.log10(Math.max(Math.abs(score), 1));
  const sign = score > 0 ? 1 : score < 0 ? -1 : 0;
  const seconds = (createdAt.getTime() - Date.UTC(2024, 0, 1)) / 1000;
  return sign * order + seconds / 45000;
}
```

### 11.4 Incremental Adoption

**Goal**: Add Greater Components to an existing app gradually.

```bash
# 1. Initialize in existing project
cd my-existing-app
greater init

# 2. Add just what you need
greater add button modal menu

# 3. Create wrappers that match your existing patterns
# src/lib/components/Button.svelte
<script>
  import GrButton from '$lib/components/ui/Button/Button.svelte';

  // Match your existing API
  let { type = 'primary', ...rest } = $props();

  const variantMap = {
    primary: 'solid',
    secondary: 'outline',
    link: 'ghost'
  };
</script>

<GrButton variant={variantMap[type]} {...rest}>
  <slot />
</GrButton>

# 4. Migrate page by page
greater add timeline status

# 5. Add face styles only when ready
greater add --css-only faces/social
```

---

## 12. Future Considerations

### 12.1 Potential Enhancements

| Feature          | Description                                               | Priority |
| ---------------- | --------------------------------------------------------- | -------- |
| `greater doctor` | Diagnose common issues (version mismatches, missing deps) | High     |
| `greater eject`  | Convert installed components to fully independent copies  | Medium   |
| `greater sync`   | Two-way sync with upstream (for contributors)             | Medium   |
| Visual diff tool | Browser-based component comparison                        | Low      |
| Monorepo support | Handle `apps/*` and `packages/*` targets                  | Medium   |
| Face composer    | Interactive tool to select components for a custom face   | Low      |

### 12.2 Possible Face Additions

- **Admin Face**: Full admin dashboard for Lesser instances
- **Docs Face**: Documentation site generator (like this doc!)
- **Commerce Face**: Federated marketplace components
- **Events Face**: Event listing and RSVP

### 12.3 CLI Plugin System

Allow community extensions:

```bash
# Install a community plugin
greater plugin add @community/greater-astro

# Use plugin commands
greater astro init  # Adds Astro-specific transformations
```

---

## 13. Requirements Matrix

### 13.1 Functional Requirements

| ID    | Requirement                                               | Priority | Status         |
| ----- | --------------------------------------------------------- | -------- | -------------- |
| FR-01 | CLI must detect Svelte 5+ projects                        | P0       | ✅ Implemented |
| FR-02 | CLI must resolve transitive registry dependencies         | P0       | ✅ Implemented |
| FR-03 | CLI must transform import paths to match consumer aliases | P0       | ✅ Implemented |
| FR-04 | CLI must verify file integrity via checksums              | P1       | 🔲 Planned     |
| FR-05 | CLI must support `--ref` for version pinning              | P1       | 🔲 Planned     |
| FR-06 | Components.json must track installed versions             | P0       | ✅ Implemented |
| FR-07 | Face kits must be installable as a bundle                 | P0       | ✅ Implemented |
| FR-08 | CLI must detect and warn about local modifications        | P1       | 🔲 Planned     |
| FR-09 | CLI must support offline mode with local cache            | P2       | 🔲 Future      |
| FR-10 | Shared modules must work independently of faces           | P0       | ✅ Implemented |

### 13.2 Non-Functional Requirements

| ID     | Requirement                                    | Priority | Status         |
| ------ | ---------------------------------------------- | -------- | -------------- |
| NFR-01 | Zero npm automation tokens in publish workflow | P0       | ✅ By Design   |
| NFR-02 | All primitives WCAG AA compliant               | P0       | ✅ Tested      |
| NFR-03 | CLI execution < 10s for typical operations     | P1       | ✅ Measured    |
| NFR-04 | Components must support tree-shaking           | P1       | ✅ ESM exports |
| NFR-05 | Full TypeScript strict mode compliance         | P0       | ✅ CI enforced |
| NFR-06 | All headless utilities framework-agnostic      | P1       | ✅ Implemented |
| NFR-07 | Documentation for every exported symbol        | P1       | 🔲 In Progress |
| NFR-08 | E2E tests for all CLI commands                 | P1       | 🔲 Planned     |

### 13.3 Security Requirements

| ID     | Requirement                                | Priority | Status       |
| ------ | ------------------------------------------ | -------- | ------------ |
| SEC-01 | No long-lived automation tokens            | P0       | ✅ By Design |
| SEC-02 | All releases signed with WebAuthn/GPG      | P0       | 🔲 Planned   |
| SEC-03 | File checksums published in registry index | P1       | 🔲 Planned   |
| SEC-04 | CLI verifies checksums on download         | P1       | 🔲 Planned   |
| SEC-05 | Audit logging for all write operations     | P2       | 🔲 Future    |

---

## Appendix A: components.json Schema

```json
{
	"$schema": "http://json-schema.org/draft-07/schema#",
	"title": "Greater Components Configuration",
	"type": "object",
	"properties": {
		"$schema": { "type": "string" },
		"version": {
			"type": "string",
			"description": "Configuration schema version"
		},
		"ref": {
			"type": "string",
			"description": "Git ref (tag/commit) to fetch from"
		},
		"style": {
			"type": "string",
			"enum": ["default", "minimal", "custom"],
			"default": "default"
		},
		"aliases": {
			"type": "object",
			"properties": {
				"components": { "type": "string" },
				"utils": { "type": "string" },
				"lib": { "type": "string" },
				"hooks": { "type": "string" }
			},
			"required": ["components", "utils"]
		},
		"css": {
			"type": "object",
			"properties": {
				"tokens": { "type": "boolean" },
				"primitives": { "type": "boolean" },
				"face": { "type": ["string", "null"] }
			}
		},
		"installed": {
			"type": "array",
			"items": {
				"type": "object",
				"properties": {
					"name": { "type": "string" },
					"version": { "type": "string" },
					"installedAt": { "type": "string", "format": "date-time" },
					"modified": { "type": "boolean" }
				},
				"required": ["name", "version", "installedAt"]
			}
		},
		"lesserVersion": {
			"type": "string",
			"description": "Target Lesser schema version"
		}
	},
	"required": ["version", "aliases"]
}
```

---

## Appendix B: Glossary

| Term                    | Definition                                                 |
| ----------------------- | ---------------------------------------------------------- |
| **Face**                | An opinionated frontend product experience built on Lesser |
| **Greater Components**  | The monorepo containing all UI building blocks             |
| **Headless**            | Behavior-only code with no visual output                   |
| **Lesser**              | The headless ActivityPub backend system                    |
| **Primitive**           | A single, styled, accessible UI component                  |
| **Registry**            | The component metadata index used by the CLI               |
| **Registry Dependency** | A dependency on another Greater component (not npm)        |
| **Shared Module**       | A cross-cutting feature used by multiple faces             |

---

_This document is maintained in `docs/lesser-faces-and-cli-model.md` within the Greater Components repository._
