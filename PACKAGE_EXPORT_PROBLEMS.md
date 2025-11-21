# Greater Components Package Export Problems

**Document Purpose:** Detail the specific gaps and issues with how `@equaltoai/greater-components` is currently packaged and exported, from the perspective of a developer trying to install and use it.

**Scope:** Problems only - no solutions proposed

---

## Problem Overview

When developers attempt to install and use `@equaltoai/greater-components` based on standard npm package conventions or based on the package's own documentation, they encounter multiple import failures, missing dependencies, and broken export paths.

---

## Problem 1: Package Name Mismatch with Documentation

### What the Documentation Shows

All examples in `knowledgebase/` use these import patterns:

```typescript
// From getting-started.md, api-reference.md, core-patterns.md, etc.
import { Button } from '@equaltoai/greater-components-primitives';
import { MenuIcon } from '@equaltoai/greater-components-icons';
import { ThemeProvider } from '@equaltoai/greater-components-primitives';
```

### What Actually Happens

```bash
npm install @equaltoai/greater-components-primitives
# Error: E404 - Package not found
```

**Gap:** Documentation references `@equaltoai/greater-components-primitives` as if it's a published package, but it doesn't exist on npm.

**What's published:** Only `@equaltoai/greater-components` exists

**Impact:** Every code example in the knowledge base uses import paths that don't work for external consumers.

---

## Problem 2: Broken Barrel Export from Root

### Expected Behavior (Standard npm Pattern)

```typescript
// Install umbrella package
npm install @equaltoai/greater-components

// Import from root
import { Button, Container, MenuIcon } from '@equaltoai/greater-components';
```

This is standard for umbrella packages (like `@mui/material`, `@chakra-ui/react`, etc.)

### Actual Behavior

```typescript
import { Button } from '@equaltoai/greater-components';
```

**Error:**

```
Error: Cannot find module '@equaltoai/greater-components-utils'
or one of its dependencies
```

**Gap:** The root barrel export (`dist/index.js`) exports from packages that reference `@equaltoai/greater-components-utils`, but `utils` isn't in the published package's dependencies.

**What triggers it:**

- Root index.js exports from `fediverse`
- Fediverse components import from `utils`
- Utils package doesn't exist in published package dependencies
- Import chain fails

---

## Problem 3: Missing Component-Specific Subpath Exports

### Expected Behavior (Tree-Shaking Pattern)

```typescript
// Import specific component for optimal bundle size
import { Button } from '@equaltoai/greater-components/Button';
import { Container } from '@equaltoai/greater-components/Container';
```

This pattern is documented in the package's own `api-reference.md` (line 994-1010) under "Tree Shaking"

### Actual Behavior

```typescript
import { Button } from '@equaltoai/greater-components/Button';
```

**Error:**

```
No known conditions for "./Button" entry in "@equaltoai/greater-components" package
```

**Gap:** Individual component subpath exports are not configured in `package.json` exports field.

**What's missing:**

```json
// package.json should have but doesn't:
{
	"exports": {
		"./Button": {
			"types": "./dist/primitives/components/Button.svelte.d.ts",
			"import": "./dist/primitives/components/Button.svelte.js"
		}
		// ... for every component
	}
}
```

---

## Problem 4: Subpackage Path Imports Inconsistency

### What Works

```typescript
import { Button } from '@equaltoai/greater-components/primitives';
import { MenuIcon } from '@equaltoai/greater-components/icons';
```

**These work** - documented in `package.json` exports:

- `"./primitives"` export exists
- `"./icons"` export exists

### What Doesn't Work But PAI Generates

```typescript
// PAI generated these in latest paicodes run:
import { Container } from '@equaltoai/greater-components-primitives/Container';
import { MenuIcon } from '@equaltoai/greater-components-icons/MenuIcon';
```

**Gap 1:** Package name is wrong (`-primitives` doesn't exist as standalone)  
**Gap 2:** Even if package existed, `/Container` subpath isn't exported

**Why PAI generates this:**

- KB examples show `@equaltoai/greater-components-primitives` (wrong)
- PAI sees individual package exports in monorepo and extrapolates subpaths
- Combines wrong package name + assumed subpath pattern

---

## Problem 5: CSS Import Path Unclear

### Expected Behavior

Component libraries typically provide:

```typescript
// Import all styles
import '@equaltoai/greater-components/styles.css';

// Or component-specific styles
import '@equaltoai/greater-components-primitives/styles.css';
```

### Actual Situation

**Tokens CSS exists:**

```typescript
import '@equaltoai/greater-components/tokens/theme.css'; // ✅ Works
```

**Primitives CSS exists but is empty:**

```typescript
import '@equaltoai/greater-components/primitives/style.css'; // File exists but no content
```

**Content:**

```css
/* No standalone component CSS detected; this is a placeholder */
```

**Gap 1:** Components have `<style>` tags but styles aren't extracted to CSS files  
**Gap 2:** No clear guidance on whether CSS import is needed  
**Gap 3:** Documentation doesn't explain that styles are inlined

**Impact:** Developers expect to import CSS, find a file, import it, but get no styles because the file is a placeholder.

---

## Problem 6: Dependency Chain Failures

### Scenario

Developer installs package and tries basic import:

```bash
npm install @equaltoai/greater-components
```

```typescript
import { Status } from '@equaltoai/greater-components/fediverse';
```

### Error Chain

```
Error: Cannot resolve '@equaltoai/greater-components-adapters'
  → Status imports from adapters
  → adapters isn't in package dependencies

Error: Cannot resolve '@equaltoai/greater-components-utils'
  → adapters imports from utils
  → utils isn't in package dependencies
```

**Gap:** Fediverse components are exported but their dependencies aren't bundled or declared.

**Why it happens:**

- Workspace packages use `workspace:*` dependencies
- These resolve during monorepo build
- But aren't included in published package
- External consumers can't resolve them

---

## Problem 7: Documentation Assumes Monorepo Context

### Examples Throughout Knowledge Base

```typescript
// From component-inventory.md, core-patterns.md, getting-started.md, etc.
import { Button, Modal } from '@equaltoai/greater-components-primitives';
import { SaveIcon } from '@equaltoai/greater-components-icons';
```

**These imports work:**

- ✅ Inside the monorepo (workspace packages resolve)
- ✅ In local development (`pnpm install` links workspaces)

**These imports fail:**

- ❌ After `npm install @equaltoai/greater-components` externally
- ❌ In fresh project outside monorepo
- ❌ For any external consumer

**Gap:** All 1,344 lines of `component-inventory.md`, 327 lines of `patterns-landing-pages.md`, 597 lines of `example-landing-page.md`, and hundreds of examples across the KB use import patterns that don't work for published package consumers.

---

## Problem 8: Package.json in paicodes Shows Confusion

### What Was Generated

```json
{
	"dependencies": {
		"@equaltoai/greater-components": "^1.1.0",
		"@equaltoai/greater-components-primitives": "^1.1.0", // ❌ Doesn't exist
		"@equaltoai/greater-components-icons": "^1.1.0", // ❌ Doesn't exist
		"@equaltoai/greater-components-tokens": "^1.1.0", // ❌ Doesn't exist
		"@equaltoai/greater-components-primitives": "^1.1.0", // ❌ Duplicate
		"@equaltoai/greater-components-icons": "^1.1.0", // ❌ Duplicate
		"@equaltoai/greater-components-tokens": "^1.1.0" // ❌ Duplicate
	}
}
```

**Gaps:**

1. Lists packages that don't exist on npm
2. Has duplicates (primitives, icons, tokens listed twice)
3. Shows confusion about which packages to install

**Why this happened:**

- KB documentation implies separate packages
- PAI tried to install what KB examples reference
- Can't distinguish development packages from published packages

---

## Problem 9: No Clear "How to Install" Guidance

### Missing from Knowledge Base

**Not documented:**

1. Which single package to install (`@equaltoai/greater-components`)
2. That subpackages are NOT separately available
3. Correct import paths after installation
4. Difference between monorepo development vs external consumption

**What developers need:**

````markdown
# Installation

```bash
# Install the ONLY published package:
npm install @equaltoai/greater-components
```
````

# Imports

```typescript
// Import from subpackage paths:
import { Button, Container } from '@equaltoai/greater-components/primitives';
import { MenuIcon } from '@equaltoai/greater-components/icons';
```

**Where this should be:** At the top of `getting-started.md`, `component-inventory.md`, and `README.md`

---

## Problem 10: Exports Configuration Incomplete

### From package.json Analysis

**What's exported:**

```json
{
  "exports": {
    "./primitives": { ... },     // ✅ Works
    "./icons": { ... },          // ✅ Works
    "./tokens": { ... },         // ✅ Works
    "./fediverse": { ... },      // ⚠️ Works but breaks on imports
    // Missing: individual component exports
    // Missing: utils (referenced but not exported)
  }
}
```

**What's missing:**

- No `/Button`, `/Container`, `/Card` individual exports
- No utils export (but fediverse tries to import it)
- No headless export
- No adapters export as separate path

**Gap:** Package exports don't cover all the ways documentation suggests importing.

---

## Problem 11: README vs Reality Mismatch

### Package README Shows

```typescript
import { ComposeBox, TimelineCompound } from '@equaltoai/greater-components';
import { Button } from '@equaltoai/greater-components/primitives';
import { createTimelineIntegration } from '@equaltoai/greater-components/adapters';
```

**Claims:** "Subpath exports mirror the previous workspace packages"

**Reality:**

- Root import breaks (utils dependency)
- Some subpaths work (primitives, icons)
- Some subpaths missing (adapters, utils, headless)
- Individual component paths don't exist

**Gap:** README promises functionality that doesn't work.

---

## Problem 12: Version Confusion

### In Monorepo

All packages show versions like:

- `@equaltoai/greater-components-primitives@1.0.17` (private)
- `@equaltoai/greater-components-icons@1.0.3` (private)
- `@equaltoai/greater-components@1.0.31` (published)

### After Install

Developer gets:

- `@equaltoai/greater-components@1.1.0`

But tries to follow docs that reference package names that never existed.

**Gap:** Documentation doesn't clarify that `-primitives`, `-icons` are monorepo development concepts, not published packages.

---

## Impact on PAI/AI Tools

### Why PAI Hallucinates Import Paths

1. **KB examples** use `@equaltoai/greater-components-primitives`
2. **PAI learns** this is the package name
3. **PAI sees** individual component files in examples
4. **PAI combines** wrong package name + component subpath
5. **PAI generates** `@equaltoai/greater-components-primitives/Container`

**This is doubly wrong:**

- Package name doesn't exist
- Component subpath doesn't exist

### What PAI Needs to Know

1. Only ONE package published: `@equaltoai/greater-components`
2. Import from subpackage paths: `/primitives`, `/icons`, `/tokens`
3. NO individual component subpaths
4. NO separate `-primitives` or `-icons` packages on npm

**Currently:** KB doesn't document any of this

---

## Summary of Gaps

| #   | Gap Type       | Description                                   | Impact                                 |
| --- | -------------- | --------------------------------------------- | -------------------------------------- |
| 1   | KB             | Docs use non-existent package names           | All examples broken for external users |
| 2   | Implementation | Root barrel export broken                     | Can't import from root                 |
| 3   | Implementation | Component subpaths not exported               | Tree-shaking pattern doesn't work      |
| 4   | KB             | No installation guide with correct package    | Developers don't know what to install  |
| 5   | Implementation | CSS files are empty placeholders              | Styles missing (but inlined, unclear)  |
| 6   | Implementation | Missing dependency declarations               | Import chains fail                     |
| 7   | KB             | No distinction between dev/published packages | Confusion about what exists            |
| 8   | Implementation | Exports don't match README claims             | Promises broken functionality          |
| 9   | KB             | No correct import pattern examples            | Every example uses wrong imports       |
| 10  | Implementation | Utils referenced but not exported             | Dependency resolution fails            |
| 11  | KB             | No troubleshooting for import errors          | Developers stuck with no guidance      |
| 12  | Implementation | Duplicate/missing package.json exports        | Incomplete export map                  |

---

## Observed Behavior: External Installation Test

**Scenario:** Fresh project, following documentation

```bash
# Step 1: Install (following KB docs implies)
npm install @equaltoai/greater-components-primitives
# ❌ Error: Package not found

# Step 2: Try umbrella package
npm install @equaltoai/greater-components
# ✅ Success

# Step 3: Import (following KB examples)
import { Button } from '@equaltoai/greater-components-primitives';
# ❌ Error: Cannot find module

# Step 4: Try root import (standard pattern)
import { Button } from '@equaltoai/greater-components';
# ❌ Error: Cannot find module '@equaltoai/greater-components-utils'

# Step 5: Discovery through trial and error
import { Button } from '@equaltoai/greater-components/primitives';
# ✅ Works! (but not documented anywhere)
```

**Gap:** The ONE working pattern isn't documented. All documented patterns are broken.

---

## PAI-Generated Code Analysis

### From paicodes Latest Run

**package.json dependencies:**

```json
{
	"dependencies": {
		"@equaltoai/greater-components": "^1.1.0", // ✅ Correct
		"@equaltoai/greater-components-primitives": "^1.1.0", // ❌ Doesn't exist
		"@equaltoai/greater-components-icons": "^1.1.0", // ❌ Doesn't exist
		"@equaltoai/greater-components-tokens": "^1.1.0", // ❌ Doesn't exist
		"@equaltoai/greater-components-primitives": "^1.1.0", // ❌ Duplicate
		"@equaltoai/greater-components-icons": "^1.1.0", // ❌ Duplicate
		"@equaltoai/greater-components-tokens": "^1.1.0" // ❌ Duplicate
	}
}
```

**Import statements:**

```typescript
import { Container } from '@equaltoai/greater-components-primitives/Container';
import { MenuIcon } from '@equaltoai/greater-components-icons/MenuIcon';
```

**What's wrong:**

1. Package names don't exist on npm
2. Even if they did, component subpaths aren't exported
3. Duplicates suggest PAI couldn't determine correct packages
4. Three non-existent packages + three duplicates = confusion

**Why PAI generated this:**

- Learned package names from KB examples
- Saw component-specific exports in workspace packages
- Combined wrong package name + subpath pattern
- No KB documentation showing actual working imports

---

## Problem 4: CSS Import Paths Undocumented

### What Developers Try

```typescript
// Assumption: Need to import styles
import '@equaltoai/greater-components/styles.css';
// ❌ File doesn't exist

import '@equaltoai/greater-components-primitives/styles.css';
// ❌ Package doesn't exist

import '@equaltoai/greater-components/primitives/styles.css';
// ⚠️ File exists but is empty placeholder
```

### What's Unclear

1. **Do you need to import CSS?** Not documented
2. **Are styles inlined?** Not explained
3. **What CSS files are available?** Only `tokens/theme.css` has content
4. **Is primitives/style.css needed?** Exists but empty, no guidance

**Gap:** No documentation about CSS distribution strategy.

---

## Problem 5: Monorepo Leakage into Public Documentation

### Internal vs External Package Names

**Monorepo structure (development):**

```
packages/
├── primitives/           → @equaltoai/greater-components-primitives (private)
├── icons/               → @equaltoai/greater-components-icons (private)
├── tokens/              → @equaltoai/greater-components-tokens (private)
├── utils/               → @equaltoai/greater-components-utils (private)
└── greater-components/  → @equaltoai/greater-components (public)
```

**Published to npm:**

```
Only: @equaltoai/greater-components
```

**Knowledge base uses:** The private workspace package names everywhere

**Gap:** Documentation written from monorepo perspective, not consumer perspective.

**Examples of leakage:**

- `component-inventory.md` line 7: "Primitives Package (@equaltoai/greater-components-primitives)"
- `getting-started.md`: All examples use `-primitives`, `-icons` package names
- `api-reference.md`: Package headers use workspace names
- All 597 lines of `example-landing-page.md`: Wrong import paths

---

## Problem 6: No Installation Verification Method

### Missing from Documentation

**Not documented:**

1. How to verify package installed correctly
2. How to test if imports will work
3. What files should exist in `node_modules/@equaltoai/greater-components/`
4. Expected directory structure after install

**Developers need:**

```markdown
# After installation, verify:

ls node_modules/@equaltoai/greater-components/dist/

# Should show: primitives/, icons/, tokens/, fediverse/, etc.

# Test import:

node -e "console.log(require('@equaltoai/greater-components/primitives'))"

# Should not error
```

**Gap:** No validation steps to confirm installation worked.

---

## Problem 7: Tree-Shaking Claims vs Reality

### Documentation Claims (api-reference.md line 994-1010)

```markdown
### Tree Shaking

Import specific components for optimal bundle size:

**GOOD: Specific imports**
import { Button } from '@equaltoai/greater-components-primitives/Button';

**AVOID: Barrel imports**
import { Button } from '@equaltoai/greater-components-primitives';
```

### Reality

**The "GOOD" pattern doesn't work:**

- `@equaltoai/greater-components-primitives` package doesn't exist
- `/Button` subpath not exported
- Both parts of the import path are broken

**The "AVOID" pattern also doesn't work:**

- Same package doesn't exist

**What actually works (not documented):**

```typescript
// This works but imports all primitives:
import { Button } from '@equaltoai/greater-components/primitives';
```

**Gap:** Documentation recommends patterns that are completely non-functional.

---

## Problem 8: No External Consumer Testing

### Evidence

1. All imports in KB use workspace package names
2. README claims functionality that doesn't work
3. Examples haven't been tested outside monorepo
4. No external installation guide

**Gap:** Package appears to have been documented and published without testing from external consumer perspective.

**Test that was never run:**

```bash
# Outside monorepo:
mkdir test-project
cd test-project
npm init -y
npm install @equaltoai/greater-components
# Then try ANY import from the documentation
```

If this test had been run, all these problems would have been discovered.

---

## Problem 9: JSR vs npm Publishing Confusion

### Observations

- Workspace packages have `jsr.json` files (JSR configuration)
- Package has npm `package.json`
- README mentions JSR alternative installation
- Unclear which is primary distribution method

**Questions without answers:**

1. Is JSR the intended distribution? Then why publish to npm?
2. If npm is primary, why have JSR configs?
3. Do the JSR imports work differently?
4. Should KB document both import patterns?

**Gap:** No clarity on intended distribution strategy.

---

## Problem 10: Icon Import Path Inconsistency

### PAI Generated

```typescript
import { MenuIcon } from '@equaltoai/greater-components-icons/MenuIcon';
```

**Two errors:**

1. Package `@equaltoai/greater-components-icons` doesn't exist
2. Even from correct package, `/MenuIcon` subpath doesn't exist

### What Works

```typescript
import { MenuIcon } from '@equaltoai/greater-components/icons';
```

### What's Unclear

Can you import individual icons for tree-shaking?

```typescript
// Does this work?
import MenuIcon from '@equaltoai/greater-components/icons/menu';
```

**Gap:** Icon import patterns not documented. Unknown if tree-shaking possible.

---

## Measurement of Impact

### Knowledge Base Statistics

**Total code examples in KB:** ~150+ code blocks  
**Examples using wrong imports:** ~140+ (93%)  
**Examples that would work externally:** ~10 (7%)

### Files with Broken Import Examples

- component-inventory.md - All 40+ examples
- getting-started.md - All examples
- core-patterns.md - All examples
- api-reference.md - All examples
- patterns-landing-pages.md - All examples
- example-landing-page.md - All imports
- testing-guide.md - All test examples
- development-guidelines.md - All examples

**Gap:** Essentially the entire knowledge base uses non-functional import patterns.

---

## What External Consumers Experience

1. **Find package:** Search finds `@equaltoai/greater-components` on npm ✅
2. **Read documentation:** Examples show `@equaltoai/greater-components-primitives` ❌
3. **Try to install:** `npm install @equaltoai/greater-components-primitives` ❌ Not found
4. **Install umbrella:** `npm install @equaltoai/greater-components` ✅
5. **Follow examples:** Imports fail ❌
6. **Try root import:** Dependency error ❌
7. **Google/search issues:** No results (problem not documented) ❌
8. **Trial and error:** Eventually discover `/primitives` path ⚠️
9. **But all docs wrong:** Can't trust any other examples ❌

**Result:** Package appears broken and unusable based on its own documentation.

---

## Summary

**Core Problem:** The published package structure doesn't match what the documentation describes.

**Specific Gaps:**

1. Documentation uses package names that don't exist (`-primitives`, `-icons`)
2. Documentation uses import patterns that don't work (component subpaths)
3. No working installation guide for external consumers
4. No explanation of monorepo vs published package differences
5. No troubleshooting for import failures
6. CSS import strategy unclear
7. Dependency chain incomplete (utils, adapters not bundled/exported)
8. Tree-shaking recommendations reference non-functional patterns
9. Root barrel export broken
10. No verification/testing steps
11. README makes claims that don't work in practice
12. Entire KB written from monorepo perspective, not consumer perspective

**Impact on AI Tools:**

- PAI learns wrong package names from KB
- PAI generates non-functional imports
- PAI can't distinguish monorepo packages from published packages
- Every AI-generated example will have broken imports

**This is separate from the original hallucination issues (missing components, icons, tokens) which have been resolved. This is a new category of issues: packaging and distribution gaps.**
