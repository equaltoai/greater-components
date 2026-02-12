# Greater Components CLI Guide

<!-- AI Training: This is the comprehensive CLI guide for Greater Components -->

**The Greater CLI provides a source-first approach to adding ActivityPub components to your project. Instead of installing npm packages, components are copied as source code, giving you full control and customization freedom.**

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Commands Reference](#commands-reference)
4. [Configuration](#configuration)
5. [Security Model](#security-model)
6. [Troubleshooting](#troubleshooting)

---

## Installation

The Greater CLI is distributed via Git (not the npm registry). Install it from a GitHub Release, or build it from this
repo.

```bash
# Install from GitHub Releases (recommended)
# Replace `greater-vX.Y.Z` with a real tag from https://github.com/equaltoai/greater-components/releases
npm install -g https://github.com/equaltoai/greater-components/releases/download/greater-vX.Y.Z/greater-components-cli.tgz

# Verify
greater --version
```

If you prefer pnpm:

```bash
pnpm add -g https://github.com/equaltoai/greater-components/releases/download/greater-vX.Y.Z/greater-components-cli.tgz
```

Or build from source (Git):

```bash
git clone https://github.com/equaltoai/greater-components.git
cd greater-components
pnpm install

# Build just the CLI
pnpm --filter @equaltoai/greater-components-cli build

# Run without installing
node packages/cli/dist/index.js --version
node packages/cli/dist/index.js init
node packages/cli/dist/index.js add faces/social
```

Optional: install the built CLI globally from your clone:

```bash
cd packages/cli
pnpm pack --out ../../artifacts/greater-components-cli.tgz
npm install -g ../../artifacts/greater-components-cli.tgz
```

---

## Quick Start

### 1. Initialize Your Project

```bash
cd my-sveltekit-app
greater init
```

This creates a `components.json` configuration file and optionally injects CSS imports.

### 2. Add Components

```bash
# Add a single component
greater add button

# Add multiple components
greater add button modal menu tabs

# Add a complete face (component bundle)
greater add faces/social

# Interactive selection
greater add
```

### 3. Use Components

By default, the CLI installs source files under `src/lib`:

- Core packages (vendored): `$lib/greater/*` (primitives, headless, icons, tokens, utils, content, adapters)
- Face/compound components: `$lib/components/*`
- Shared modules: `$lib/components/<module>/*`
- Patterns: `$lib/patterns/*`
- Face generics (when applicable): `$lib/generics/*`

```svelte
<script lang="ts">
	import { createButton } from '$lib/greater/headless/button';

	const button = createButton({
		onClick: () => console.log('Clicked!'),
	});
</script>

<button use:button.actions.button>Click Me</button>
```

---

## Commands Reference

### `greater init`

Initialize Greater Components in your project.

```bash
greater init [options]
```

**Options:**

| Option          | Description                                         | Default           |
| --------------- | --------------------------------------------------- | ----------------- |
| `-y, --yes`     | Skip prompts, use defaults                          | `false`           |
| `--cwd <path>`  | Working directory                                   | Current directory |
| `--ref <tag>`   | Pin to specific Git ref/tag (or `latest`)           | `latest`          |
| `--skip-css`    | Skip automatic CSS injection                        | `false`           |
| `--face <name>` | Pre-select a face (social, blog, community, artist) | `null`            |

**What It Does:**

1. **Detects project type**: SvelteKit, Vite + Svelte, or bare Svelte
2. **Validates Svelte version**: Requires Svelte 5.0.0+
3. **Creates `components.json`**: Configuration file for component management
4. **Optionally injects CSS imports**: Adds required CSS to your layout file

**Example:**

```bash
# Interactive initialization
greater init

# Non-interactive with social face
greater init -y --face social

# Pin to specific version
greater init --ref greater-v0.1.0
```

---

### `greater add`

Add components, faces, shared modules, or patterns to your project.

```bash
greater add [items...] [options]
```

**Arguments:**

- `items`: Space-separated list of items to add

**Item Types:**

| Type          | Syntax            | Example                         |
| ------------- | ----------------- | ------------------------------- |
| Primitive     | `<name>`          | `button`, `modal`, `tabs`       |
| Shared Module | `shared/<name>`   | `shared/auth`, `shared/compose` |
| Pattern       | `patterns/<name>` | `patterns/thread-view`          |
| Face          | `faces/<name>`    | `faces/social`, `faces/blog`    |

**Options:**

| Option               | Description                        | Default           |
| -------------------- | ---------------------------------- | ----------------- |
| `-y, --yes`          | Skip confirmation prompts          | `false`           |
| `-a, --all`          | Include optional dependencies      | `false`           |
| `--cwd <path>`       | Working directory                  | Current directory |
| `--path <path>`      | Custom installation path           | From config       |
| `--ref <tag>`        | Git ref/tag to fetch from          | From config       |
| `-f, --force`        | Overwrite existing files           | `false`           |
| `--dry-run`          | Preview without writing files      | `false`           |
| `--css-only`         | Only install CSS files (for faces) | `false`           |
| `--skip-verify`      | Skip integrity verification        | `false`           |
| `--verify-signature` | Verify Git tag signature           | `false`           |

**Examples:**

```bash
# Add primitives
greater add button modal menu

# Add with all dependencies
greater add timeline --all

# Add a face
greater add faces/social

# Add shared modules
greater add shared/auth shared/compose

# Preview installation
greater add timeline --dry-run

# Force overwrite existing files
greater add button --force
```

**Dependency Resolution:**

When adding a component, the CLI automatically resolves and installs dependencies:

```
faces/social
├── primitives: button, modal, menu, tooltip, tabs
├── components: timeline, status, profile, lists, filters, hashtags
├── patterns: thread-view, moderation-tools, visibility-selector, federation-indicator, …
└── shared: auth, compose, notifications, search, admin, messaging
```

---

### `greater list`

List all available components with filtering and search.

```bash
greater list [query] [options]
```

**Arguments:**

- `query`: Optional search query to filter components

**Options:**

| Option              | Description                                                                |
| ------------------- | -------------------------------------------------------------------------- |
| `-t, --type <type>` | Filter by type: primitive, compound, pattern, adapter, shared, face        |
| `--domain <domain>` | Filter by domain: social, blog, community, artist, auth, admin, chat, core |
| `--installed`       | Show only installed components                                             |
| `--available`       | Show only not-installed components                                         |
| `--json`            | Output as JSON                                                             |
| `--details`         | Show detailed information for faces                                        |

**Examples:**

```bash
# List all components
greater list

# Search for components
greater list button

# Filter by type
greater list --type primitive
greater list --type face

# Show installed only
greater list --installed

# Get face details
greater list faces/social --details

# JSON output for scripting
greater list --json
```

---

### `greater diff`

Show changes between installed version and latest.

```bash
greater diff [item] [options]
```

**Options:**

| Option        | Description                        |
| ------------- | ---------------------------------- |
| `--ref <tag>` | Compare against a specific version |

**Example:**

```bash
# Show diff for a component
greater diff button

# Compare against specific version
greater diff button --ref greater-v0.1.0
```

---

### `greater update`

Update installed components to newer versions.

```bash
greater update [items...] [options]
```

**Options:**

| Option        | Description                     |
| ------------- | ------------------------------- |
| `--all`       | Update all installed components |
| `--ref <tag>` | Update to a specific version    |
| `--dry-run`   | Show what would be updated      |
| `-f, --force` | Overwrite local modifications   |

**Examples:**

```bash
# Update specific components
greater update button modal

# Update all components
greater update --all

# Preview updates
greater update --all --dry-run

# Force update (overwrites local changes)
greater update button --force
```

**Conflict Resolution:**

When local modifications are detected:

```
Button has local modifications. Options:
[1] Keep local version (skip update)
[2] Overwrite with upstream (--force)
[3] Show diff and decide
```

---

### `greater cache`

Manage the local cache for offline use.

```bash
greater cache <command> [options]
```

**Commands:**

- `greater cache ls` – List cached refs
- `greater cache clear --all` – Clear all cached files
- `greater cache clear <ref>` – Clear cache for a specific ref
- `greater cache prefetch <ref> [items...]` – Pre-populate cache for offline use

**Examples:**

```bash
# List cached refs
greater cache ls

# Prefetch everything for a ref
greater cache prefetch greater-v0.1.1 --all

# Prefetch a face + a few components
greater cache prefetch greater-v0.1.1 faces/social shared/auth button
```

---

### `greater doctor`

Diagnose common issues with your Greater Components setup.

```bash
greater doctor [options]
```

**Checks Performed:**

- ✅ Svelte version compatibility
- ✅ Node.js version
- ✅ Configuration file validity
- ✅ CSS imports present
- ✅ Component file integrity
- ✅ Missing dependencies

**Strict CSP Scan:**

- `greater doctor --csp` scans the installed vendored code for strict CSP issues:
  - runtime inline-style writes (`element.style.*`, `style.setProperty`, `setAttribute('style', ...)`)
  - runtime `<style>` injection (`document.createElement('style')`)
  - global element selectors in face/theme CSS (`body {}`, `html {}`, `h1 {}`, etc.)

**Examples:**

```bash
greater doctor

# Scan for strict CSP issues (CI-friendly exit code)
greater doctor --csp

# JSON output for CI parsing
greater doctor --csp --json
```

---

### `greater audit`

View and manage the security audit log.

```bash
greater audit [options]
```

**Options:**

| Option      | Description               |
| ----------- | ------------------------- |
| `--clear`   | Clear the audit log       |
| `--verbose` | Show detailed information |
| `--json`    | Output as JSON            |

**Example:**

```bash
# View audit log
greater audit

# Verbose output
greater audit --verbose

# Clear audit log
greater audit --clear
```

---

## Configuration

### `components.json` File

The configuration file created by `greater init`:

```json
{
	"$schema": "https://greater.components.dev/schema.json",
	"version": "1.0.0",
	"ref": "latest",
	"installMode": "vendored",
	"style": "default",
	"aliases": {
		"components": "$lib/components",
		"utils": "$lib/utils",
		"ui": "$lib/components/ui",
		"lib": "$lib",
		"hooks": "$lib/primitives",
		"greater": "$lib/greater"
	},
	"css": {
		"tokens": true,
		"primitives": true,
		"face": null,
		"source": "local",
		"localDir": "styles/greater"
	},
	"installed": []
}
```

Notes:

- Registry file paths starting with `greater/` install relative to `aliases.greater` (default: `$lib/greater`).
- Registry file paths starting with `lib/` install relative to `aliases.lib` (default: `$lib`) and keep their `components/`, `patterns/`, `primitives/`, and `adapters/` subfolders.
- Registry file paths starting with `shared/` install relative to `aliases.components` (default: `$lib/components`).

### Configuration Options

| Key                  | Type         | Description                                               |
| -------------------- | ------------ | --------------------------------------------------------- |
| `$schema`            | string       | JSON Schema URL for validation                            |
| `version`            | string       | Configuration schema version                              |
| `ref`                | string       | Git tag for fetching components                           |
| `installMode`        | string       | `vendored` (default) or `hybrid` (legacy)                 |
| `style`              | string       | Style preset: `default`, `new-york`, `minimal`, `custom`  |
| `aliases.components` | string       | Base components directory                                 |
| `aliases.utils`      | string       | Utilities directory                                       |
| `aliases.ui`         | string       | UI components directory                                   |
| `aliases.lib`        | string       | Library root                                              |
| `aliases.hooks`      | string       | Legacy headless primitives directory                      |
| `aliases.greater`    | string       | Vendored core packages root                               |
| `css.tokens`         | boolean      | Include design tokens CSS                                 |
| `css.primitives`     | boolean      | Include primitive styles CSS                              |
| `css.face`           | string\|null | Active face name                                          |
| `css.source`         | string       | CSS source mode: `local` (copied files) or `npm` (legacy) |
| `css.localDir`       | string       | Local CSS directory path (relative to `aliases.lib`)      |
| `installed`          | array        | List of installed components                              |

### Installed Component Entry

```json
{
	"name": "button",
	"version": "greater-vX.Y.Z",
	"installedAt": "2024-12-10T12:00:00Z",
	"modified": false,
	"checksums": [{ "path": "greater/headless/button.ts", "checksum": "sha256-abc123..." }]
}
```

---

## Security Model

### Source-First Distribution

Greater Components uses a **source-first** distribution model:

1. **No npm automation tokens**: Components are fetched from Git, not npm
2. **Git tags as versions**: Releases are Git tags, verifiable and auditable
3. **File integrity checking**: SHA-256 checksums verify file integrity
4. **Optional signature verification**: GPG/SSH signed tags can be verified

### Verification Options

```bash
# Standard installation (checksum verification)
greater add button

# Skip verification (development only)
greater add button --skip-verify

# Verify Git tag signature
greater add button --verify-signature
```

### Audit Logging

All operations are logged to `~/.greater-components/audit.log`:

```
📦 INSTALL 2024-12-10T12:00:00Z
   Component: button
   Ref: latest
   Integrity: ✓ Verified
```

### Security Warnings

The CLI warns about potentially risky operations:

- `--force` overwrites without confirmation
- `--skip-verify` bypasses integrity checks
- Unsigned tags when `--verify-signature` is used

---

## Troubleshooting

### Common Issues

#### "Greater Components is not initialized"

**Problem:** Running `greater add` before `greater init`.

**Solution:**

```bash
greater init
```

#### "Svelte version incompatible"

**Problem:** Project uses Svelte 4.x instead of 5.x.

**Solution:**

```bash
# Upgrade Svelte
pnpm add svelte@^5.0.0 @sveltejs/kit@^2.0.0
```

#### "Could not detect project type"

**Problem:** Missing `package.json` or Svelte configuration.

**Solution:**
Ensure you're in a valid Svelte project root with:

- `package.json`
- `svelte.config.js` (for SvelteKit)
- `svelte` dependency

#### Components render unstyled

**Problem:** Missing CSS imports.

**Solution:**
Add to your root layout:

```svelte
<script lang="ts">
	import '$lib/styles/greater/tokens.css';
	import '$lib/styles/greater/primitives.css';
</script>
```

#### "File already exists"

**Problem:** Component files already exist in target directory.

**Solution:**

```bash
# Use --force to overwrite
greater add button --force

# Or remove existing files first
rm -rf src/lib/components/ui/Button
greater add button
```

### Getting Help

```bash
# Show help for any command
greater --help
greater add --help

# Run diagnostics
greater doctor

# Check audit log for issues
greater audit --verbose
```

---

## Related Documentation

- [Getting Started](./getting-started.md) – Installation and first steps
- [Migration from npm](./migration-from-npm.md) – Migrating from npm packages
- [Face Development](./face-development.md) – Creating custom faces
- [Core Patterns](./core-patterns.md) – Component usage patterns

---

_Last Updated: December 2024_
