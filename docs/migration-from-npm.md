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
import { Status, Timeline, Profile } from '@equaltoai/greater-components/fediverse';
```

### Step 4: Add Components via CLI

Add each component you're using:

```bash
# Add primitives
greater add button modal card tabs menu tooltip

# Add faces (includes all face components)
greater add faces/social

# Or add individual face components
greater add status timeline profile
```

### Step 5: Update Import Paths

**Before (npm):**

```typescript
import { Button } from '@equaltoai/greater-components/primitives';
import { Status } from '@equaltoai/greater-components/fediverse';
```

**After (CLI):**

```typescript
import Button from '$lib/components/ui/Button/Button.svelte';
import Status from '$lib/components/ui/Status/Status.svelte';
```

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
	import '$lib/styles/tokens/theme.css';
	import '$lib/styles/primitives/style.css';
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

### Primitives

| npm Import                                            | CLI Import                                |
| ----------------------------------------------------- | ----------------------------------------- |
| `@equaltoai/greater-components/primitives` → `Button` | `$lib/components/ui/Button/Button.svelte` |
| `@equaltoai/greater-components/primitives` → `Modal`  | `$lib/components/ui/Modal/Modal.svelte`   |
| `@equaltoai/greater-components/primitives` → `Card`   | `$lib/components/ui/Card/Card.svelte`     |
| `@equaltoai/greater-components/primitives` → `Tabs`   | `$lib/components/ui/Tabs/Tabs.svelte`     |
| `@equaltoai/greater-components/primitives` → `Menu`   | `$lib/components/ui/Menu/Menu.svelte`     |

### Fediverse Components

| npm Import                                             | CLI Import                                    |
| ------------------------------------------------------ | --------------------------------------------- |
| `@equaltoai/greater-components/fediverse` → `Status`   | `$lib/components/ui/Status/Status.svelte`     |
| `@equaltoai/greater-components/fediverse` → `Timeline` | `$lib/components/ui/Timeline/Timeline.svelte` |
| `@equaltoai/greater-components/fediverse` → `Profile`  | `$lib/components/ui/Profile/Profile.svelte`   |

### Shared Modules

| npm Import                                     | CLI Import                            |
| ---------------------------------------------- | ------------------------------------- |
| `@equaltoai/greater-components/shared/auth`    | `$lib/components/ui/Auth/index.ts`    |
| `@equaltoai/greater-components/shared/compose` | `$lib/components/ui/Compose/index.ts` |

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

**CLI:** Default exports from file paths

```typescript
import Button from '$lib/components/ui/Button/Button.svelte';
import Modal from '$lib/components/ui/Modal/Modal.svelte';
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

**CLI:** Types co-located with components

```typescript
// Before
import type { ButtonProps } from '@equaltoai/greater-components/primitives';

// After
import type { ButtonProps } from '$lib/components/ui/Button/types';
```

---

## Hybrid Approach

You can use both npm and CLI simultaneously:

1. **Keep npm for CSS**: Automatic style updates
2. **Use CLI for components**: Full customization control

```svelte
<script>
	// CSS from npm (auto-updates)
	import '@equaltoai/greater-components/tokens/theme.css';
	import '@equaltoai/greater-components/primitives/style.css';

	// Components from CLI (customizable)
	import Button from '$lib/components/ui/Button/Button.svelte';
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
  ["@equaltoai/greater-components/primitives"]="$lib/components/ui"
  ["@equaltoai/greater-components/fediverse"]="$lib/components/ui"
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
rm -rf src/lib/components/ui

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
