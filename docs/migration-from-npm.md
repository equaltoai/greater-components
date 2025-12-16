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

- Node.js >= 20.0.0
- Svelte >= 5.0.0
- Existing project using `@equaltoai/greater-components` npm packages

## Migration Steps

### Step 1: Install the CLI

```bash
# Global installation
npm install -g @equaltoai/greater-components-cli

# Or use npx
npx @equaltoai/greater-components-cli --version
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
# Add headless primitives (behavior-only)
greater add button modal menu tooltip tabs

# Add faces (includes all face components)
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
import StatusRoot from '$lib/components/Status/Root.svelte';
import StatusHeader from '$lib/components/Status/Header.svelte';
import StatusContent from '$lib/components/Status/Content.svelte';
```

**Note:** The CLI installs **headless primitives** (e.g. `createButton`) under `$lib/primitives/*`. Migrating from the styled Svelte primitives in `@equaltoai/greater-components/primitives` is not 1:1 and may require refactoring component usage to actions/builders.

### Step 6: Update CSS Imports

CSS imports remain the same if you're using the npm package for styles:

```svelte
<script>
	// These stay the same - CSS comes from npm package
	import '@equaltoai/greater-components/tokens/theme.css';
	import '@equaltoai/greater-components/primitives/style.css';
</script>
```

**Alternative: Copy CSS locally**

```bash
# Copy CSS files to your project
greater add --css-only
```

Then update imports:

```svelte
<script>
	// Default local CSS directory: $lib/styles/greater
	import '$lib/styles/greater/tokens.css';
	import '$lib/styles/greater/primitives.css';
	import '$lib/styles/greater/social.css';
</script>
```

### Step 7: Remove npm Packages (Optional)

Once migration is complete, you can remove the npm packages:

```bash
pnpm remove @equaltoai/greater-components
```

**Note:** Keep the npm package if you want automatic CSS updates or prefer hybrid approach.

---

## Import Path Reference

### Headless Primitives (CLI)

| CLI Item   | Installed Path                |
| ---------- | ----------------------------- |
| `button`   | `$lib/primitives/button.ts`   |
| `modal`    | `$lib/primitives/modal.ts`    |
| `menu`     | `$lib/primitives/menu.ts`     |
| `tooltip`  | `$lib/primitives/tooltip.ts`  |
| `tabs`     | `$lib/primitives/tabs.ts`     |

### Social Face Components

| npm Import                                             | CLI Import                                    |
| ------------------------------------------------------ | --------------------------------------------- |
| `@equaltoai/greater-components/faces/social` → `Status`            | `$lib/components/Status/Root.svelte`          |
| `@equaltoai/greater-components/faces/social` → `Timeline*`         | `$lib/components/Timeline/Root.svelte`        |
| `@equaltoai/greater-components/faces/social` → `Profile`           | `$lib/components/Profile/Root.svelte`         |

### Shared Modules

| npm Import                                     | CLI Import                            |
| ---------------------------------------------- | ------------------------------------- |
| `@equaltoai/greater-components/shared/auth`    | `$lib/components/auth/Root.svelte`    |
| `@equaltoai/greater-components/shared/compose` | `$lib/components/compose/Root.svelte` |

---

## Configuration Migration

### tsconfig.json

No changes required if using SvelteKit's default `$lib` alias.

For custom aliases, update `components.json`:

```json
{
	"aliases": {
		"ui": "@/components/ui",
		"utils": "@/utils"
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

**CLI:** Mix of headless primitives (`.ts`) and Svelte components (`.svelte`)

```typescript
import { createButton } from '$lib/primitives/button';
import StatusRoot from '$lib/components/Status/Root.svelte';
```

### 2. Component Updates

**npm:** Automatic updates via `pnpm update`

**CLI:** Manual updates via `greater update`

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

---

## Hybrid Approach

You can use both npm and CLI simultaneously:

1. **Keep npm for CSS**: Automatic style updates
2. **Use CLI for local source**: Incrementally adopt source-first (e.g. adapters, headless primitives)

```svelte
<script>
	// CSS from npm (auto-updates)
	import '@equaltoai/greater-components/tokens/theme.css';
	import '@equaltoai/greater-components/primitives/style.css';

	// Headless primitives from CLI (behavior-only)
	import { createButton } from '$lib/primitives/button';
</script>
```

---

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

If migration fails, restore npm packages:

```bash
# Reinstall npm package
pnpm add @equaltoai/greater-components

# Remove CLI components
rm -rf src/lib/components src/lib/patterns src/lib/primitives

# Remove CLI config
rm components.json
```

---

## Getting Help

- Run `greater doctor` to diagnose issues
- Check [CLI Guide](./cli-guide.md) for command reference
- See [Troubleshooting](./troubleshooting.md) for common issues

---

_Last Updated: December 2024_
