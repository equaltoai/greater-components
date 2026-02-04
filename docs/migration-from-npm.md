# Migration from npm to CLI Distribution

<!-- AI Training: This guide helps migrate from npm packages to CLI-based source distribution -->

**This guide walks you through migrating an existing Greater Components project from npm package installation to the CLI-based source distribution model.**

## Why Migrate?

The CLI distribution model offers several advantages:

| Aspect            | npm (Install)     | CLI (Copy)            |
| ----------------- | ----------------- | --------------------- |
| **Control**       | Limited           | Full source ownership |
| **Customization** | Fork required     | Direct modification   |
| **Updates**       | Automatic (risky) | Manual (controlled)   |
| **Bundle Size**   | All included      | Only what you use     |
| **Lock-in**       | Dependency        | None                  |
| **Security**      | npm tokens        | Git verification      |

## Prerequisites

- Node.js >= 24.0.0
- Svelte >= 5.0.0
- Greater CLI installed (see [CLI Guide](./cli-guide.md#installation))
- Existing project using `@equaltoai/greater-components` npm packages

## Migration Steps

### Step 1: Run the CLI

```bash
greater --version
```

### Step 2: Initialize CLI Configuration

```bash
cd your-project
greater init
```

This creates `components.json` with your project configuration.

### Step 3: Identify Used Components

List all Greater Components imports in your project:

```bash
# Find all imports
grep -r "@equaltoai/greater-components" src/ --include="*.svelte" --include="*.ts"
```

Common imports to look for:

```typescript
// Primitives
import { Button, Modal, Card } from '@equaltoai/greater-components/primitives';

// Icons
import { HomeIcon, SettingsIcon } from '@equaltoai/greater-components/icons';

// Social face
import { Profile, Status, TimelineCompound } from '@equaltoai/greater-components/faces/social';
```

### Step 4: Add Components via CLI

Add each component you're using:

```bash
# Add a face bundle (includes core packages + face components)
greater add faces/social

# Or add individual face components
greater add status timeline profile
```

### Step 5: Update Import Paths

**Before (npm):**

```typescript
import { Button } from '@equaltoai/greater-components/primitives';
import { Status } from '@equaltoai/greater-components/faces/social';
```

**After (CLI):**

```typescript
import { Button } from '$lib/greater/primitives';
import { Status } from '$lib/components/Status';
```

Headless builders live under `$lib/greater/headless/*`:

```ts
import { createButton } from '$lib/greater/headless/button';
```

### Step 6: Update CSS Imports

Use the vendored CSS files (usually injected by `greater init`):

```svelte
<script>
	// Default local CSS directory: $lib/styles/greater
	import '$lib/styles/greater/tokens.css';
	import '$lib/styles/greater/primitives.css';
	import '$lib/styles/greater/social.css';
</script>
```

### Step 7: Remove npm Packages

Once migration is complete, you can remove the npm packages:

```bash
pnpm remove @equaltoai/greater-components
```

---

## Import Path Reference

### Headless Primitives (Vendored)

| CLI Item  | Installed Path                     |
| --------- | ---------------------------------- |
| `button`  | `$lib/greater/headless/button.ts`  |
| `modal`   | `$lib/greater/headless/modal.ts`   |
| `menu`    | `$lib/greater/headless/menu.ts`    |
| `tooltip` | `$lib/greater/headless/tooltip.ts` |
| `tabs`    | `$lib/greater/headless/tabs.ts`    |

### Social Face Components

| npm Import                                                 | CLI Import                 |
| ---------------------------------------------------------- | -------------------------- |
| `@equaltoai/greater-components/faces/social` → `Status`    | `$lib/components/Status`   |
| `@equaltoai/greater-components/faces/social` → `Timeline*` | `$lib/components/Timeline` |
| `@equaltoai/greater-components/faces/social` → `Profile`   | `$lib/components/Profile`  |

### Shared Modules

| npm Import                                     | CLI Import                |
| ---------------------------------------------- | ------------------------- |
| `@equaltoai/greater-components/shared/auth`    | `$lib/components/auth`    |
| `@equaltoai/greater-components/shared/compose` | `$lib/components/compose` |

---

## Configuration Migration

### tsconfig.json

No changes required if using SvelteKit's default `$lib` alias.

For custom aliases, update `components.json`:

```json
{
	"aliases": {
		"ui": "@/components/ui",
		"utils": "@/utils",
		"greater": "@/greater"
	}
}
```

### svelte.config.js

No changes required for standard SvelteKit projects.

---

## Breaking Changes

### 1. Import Syntax

**npm:** Named exports from package paths

```typescript
import { Button, Modal } from '@equaltoai/greater-components/primitives';
```

**CLI:** Vendored core packages + face components

```typescript
import { Button, Modal } from '$lib/greater/primitives';
import { createButton } from '$lib/greater/headless/button';
import { Status } from '$lib/components/Status';
```

### 2. Component Updates

**npm:** Automatic updates via `pnpm update`

**CLI:** Manual updates via the CLI

```bash
# Check for updates
greater diff button

# Update specific component
greater update button

# Update all
greater update --all
```

### 3. TypeScript Types

**npm:** Types from `@equaltoai/greater-components/types`

**CLI:** Types are co-located with installed source files

```typescript
import type { StatusConfig } from '$lib/components/Status/context.js';
```

## Automated Migration Script

For large projects, use this script to update imports:

```bash
#!/bin/bash
# migrate-imports.sh

	# Map of old imports to new imports
	declare -A IMPORT_MAP=(
	  ["@equaltoai/greater-components/faces/social"]="$lib/components"
	)

# Find and replace imports
for old_import in "${!IMPORT_MAP[@]}"; do
  new_import="${IMPORT_MAP[$old_import]}"
  find src -name "*.svelte" -o -name "*.ts" | xargs sed -i "s|$old_import|$new_import|g"
done

echo "Migration complete. Review changes and update individual component imports."
```

---

## Verification Checklist

After migration, verify:

- [ ] All components render correctly
- [ ] Styles are applied (no unstyled components)
- [ ] TypeScript types resolve
- [ ] Build completes without errors
- [ ] Tests pass
- [ ] Accessibility features work (keyboard nav, screen readers)

---

## Rollback

If migration fails, roll back the vendored install using version control (recommended):

```bash
# Revert local changes (if you haven't committed)
git restore .

# Or revert a migration commit
# git revert <commit>

# Manual cleanup (only if needed)
rm -rf src/lib/greater src/lib/components src/lib/patterns src/lib/generics src/lib/styles/greater
rm -f components.json
```

---

## Getting Help

- Run `greater doctor` to diagnose issues
- Check [CLI Guide](./cli-guide.md) for command reference
- See [Troubleshooting](./troubleshooting.md) for common issues

---

_Last Updated: December 2024_
