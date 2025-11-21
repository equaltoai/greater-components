# Documentation Import Path Update Specification

**Purpose:** Update ALL code examples in `docs/` folder to use CORRECT import paths that work with the published `@equaltoai/greater-components` package.

**Problem:** All examples currently use workspace package names that don't exist on npm.

**Solution:** Replace all incorrect import patterns with correct subpackage path imports.

---

## Correct Import Patterns (Reference)

### ✅ CORRECT - What Actually Works

```typescript
// Primitives
import {
	Button,
	Container,
	Section,
	Heading,
	Text,
	Card,
} from '@equaltoai/greater-components/primitives';

// Icons
import { MenuIcon, XIcon, CodeIcon, ArrowRightIcon } from '@equaltoai/greater-components/icons';

// Tokens
import '@equaltoai/greater-components/tokens/theme.css';

// Fediverse
import { Status, Timeline } from '@equaltoai/greater-components/fediverse';

// Headless
import { createButton } from '@equaltoai/greater-components/headless/button';

// Adapters
import { LesserGraphQLAdapter } from '@equaltoai/greater-components/adapters';

// Utils
import { formatRelativeTime } from '@equaltoai/greater-components/utils';
```

### ❌ INCORRECT - What Docs Currently Show

```typescript
// These package names DON'T EXIST on npm:
import { Button } from '@equaltoai/greater-components-primitives'; // ❌
import { MenuIcon } from '@equaltoai/greater-components-icons'; // ❌
import { ThemeProvider } from '@equaltoai/greater-components-primitives'; // ❌
import { formatRelativeTime } from '@equaltoai/greater-components-utils'; // ❌
```

---

## File-by-File Update Instructions

### FILE 1: getting-started.md

**Current Issues:**

- Uses `@equaltoai/greater-components-primitives`
- Uses `@equaltoai/greater-components-icons`
- Uses `@equaltoai/greater-components-tokens`
- Installation section implies separate packages exist

**Find and Replace:**

**Pattern 1:** Primitives imports

```
FIND:    from '@equaltoai/greater-components-primitives'
REPLACE: from '@equaltoai/greater-components/primitives'
```

**Pattern 2:** Icon imports

```
FIND:    from '@equaltoai/greater-components-icons'
REPLACE: from '@equaltoai/greater-components/icons'
```

**Pattern 3:** Token imports

```
FIND:    from '@equaltoai/greater-components-tokens'
REPLACE: from '@equaltoai/greater-components/tokens'
```

**Pattern 4:** Utils imports

```
FIND:    from '@equaltoai/greater-components-utils'
REPLACE: from '@equaltoai/greater-components/utils'
```

**Pattern 5:** Headless imports

```
FIND:    from '@equaltoai/greater-components-headless
REPLACE: from '@equaltoai/greater-components/headless
```

**Pattern 6:** Adapters imports

```
FIND:    from '@equaltoai/greater-components-adapters'
REPLACE: from '@equaltoai/greater-components/adapters'
```

**Pattern 7:** Fediverse imports

```
FIND:    from '@equaltoai/greater-components-fediverse'
REPLACE: from '@equaltoai/greater-components/fediverse'
```

**Installation Section Updates:**

**FIND:**

```bash
pnpm add @equaltoai/greater-components-primitives
pnpm add @equaltoai/greater-components-tokens
pnpm add @equaltoai/greater-components-icons
```

**REPLACE:**

```bash
# Install the single published package
pnpm add @equaltoai/greater-components

# That's it! All subpackages are included.
```

**Validation:** Search file for `-primitives`, `-icons`, `-tokens`, `-utils`, `-headless`, `-adapters` - should find ZERO matches

---

### FILE 2: api-reference.md

**Current Issues:**

- Package section headers use workspace names
- All code examples use workspace package names

**Updates Needed:**

**Pattern 1-7:** Apply same find/replace as getting-started.md (all 7 import patterns)

**Pattern 8:** Section headers

```
FIND:    ## Primitives Package\n\n`@equaltoai/greater-components-primitives`
REPLACE: ## Primitives Package\n\n`@equaltoai/greater-components/primitives`
```

```
FIND:    ## Icons Package\n\n`@equaltoai/greater-components-icons`
REPLACE: ## Icons Package\n\n`@equaltoai/greater-components/icons`
```

Repeat for: Headless, Fediverse, Adapters, Tokens, Utils, Testing

**Validation:** No workspace package names should remain in import statements or package identifiers

---

### FILE 3: core-patterns.md

**Current Issues:**

- All pattern examples use workspace package names

**Updates Needed:**

- Apply Patterns 1-7 (all import find/replace operations)

**Validation:** Every `import` statement should use `/primitives`, `/icons`, etc. subpaths

---

### FILE 4: component-inventory.md

**Current Issues:**

- Line 7: "Primitives Package (@equaltoai/greater-components-primitives)"
- All 40+ code examples use workspace package names

**Updates Needed:**

**Pattern 1-7:** Apply all import find/replace operations

**Pattern 8:** Package identifier headers

```
FIND:    (@equaltoai/greater-components-primitives)
REPLACE: (@equaltoai/greater-components/primitives)
```

Repeat for all packages.

**Validation:**

- Search for `@equaltoai/greater-components-primitives` - should be 0 matches
- Search for `@equaltoai/greater-components/primitives` - should be many matches

---

### FILE 5: patterns-landing-pages.md

**Current Issues:**

- All examples use workspace package names

**Updates Needed:**

- Apply Patterns 1-7 (all import find/replace operations)

**Validation:** Every code example should import from `/primitives`, `/icons`

---

### FILE 6: example-landing-page.md

**Current Issues:**

- The complete landing page example uses workspace package names

**Updates Needed:**

- Apply Patterns 1-7 (all import find/replace operations)

**Critical:** This is a complete runnable example - it MUST work after changes

**Validation:**

- Copy code example to fresh project
- Run with `@equaltoai/greater-components` installed
- Verify it compiles and runs

---

### FILE 7: development-guidelines.md

**Current Issues:**

- Component creation examples use workspace package names

**Updates Needed:**

- Apply Patterns 1-7 (all import find/replace operations)

**Note:** This file also documents internal development, but examples should still use correct consumer-facing imports

---

### FILE 8: testing-guide.md

**Current Issues:**

- Test examples import from workspace packages

**Updates Needed:**

- Apply Patterns 1-7 (all import find/replace operations)

**Validation:** Test examples should be runnable in external projects

---

### FILE 9: troubleshooting.md

**Current Issues:**

- Solutions show workspace package imports

**Updates Needed:**

- Apply Patterns 1-7 (all import find/replace operations)

**Critical:** Troubleshooting MUST show working solutions

---

### FILE 10: \_concepts.yaml

**Current Issues:**

- Line 47: `package_name: "@equaltoai/greater-components-primitives"`
- Similar for other packages

**Updates Needed:**

```yaml
FIND:
  primitives_package:
    package_name: '@equaltoai/greater-components-primitives'

REPLACE:
  primitives_package:
    package_name: '@equaltoai/greater-components'
    import_path: '@equaltoai/greater-components/primitives'
```

Add `import_path` field for each package showing the correct subpackage path.

**Repeat for:** icons, headless, fediverse, adapters, utils, tokens, testing

**Validation:** Each package concept should have both `package_name` (umbrella) and `import_path` (subpath)

---

### FILE 11: \_patterns.yaml

**Current Issues:**

- All `correct_example` blocks use workspace package names

**Updates Needed:**

- Apply Patterns 1-7 to all code examples in YAML strings

**IMPORTANT:** YAML multiline strings - be careful with indentation

**Validation:** Search for `-primitives"`, `-icons"`, `-tokens"` - should be 0 matches

---

### FILE 12: \_decisions.yaml

**Current Issues:**

- All decision tree examples use workspace package names

**Updates Needed:**

- Apply Patterns 1-7 to all code examples in YAML strings

**Validation:** All example blocks should show working import paths

---

### FILE 13: README.md

**Current Issues:**

- May reference workspace packages in quick start

**Updates Needed:**

- Verify installation instructions reference correct package
- Update quick start code examples

**Should Say:**

````markdown
## Quick Start

```bash
npm install @equaltoai/greater-components
```
````

```typescript
import { Button } from '@equaltoai/greater-components/primitives';
import { HomeIcon } from '@equaltoai/greater-components/icons';
```

````

---

### FILE 14: COMPLETENESS-CHECKLIST.md

**Likely OK** - Recently created, may already be correct

**Verify:** Check if any example code uses old import patterns

---

### FILE 15: PAI-VALIDATION-TESTS.md

**Recently created** - Likely needs updates

**Check:** Test scenarios should show correct imports

**Update Test 1 Expected Behavior:**
```markdown
**Expected Behavior:**
- ✅ Imports: Container, Section, Heading, Text, Card, Button
- ✅ Uses: from '@equaltoai/greater-components/primitives'
- ❌ Does NOT use: '@equaltoai/greater-components-primitives'
````

---

### FILE 16: importing-components.md (NEW FILE - Check This)

**This file is NEW (9.2KB, 326 lines)**

**Task:** Read this file and verify it documents CORRECT import patterns

If it's correct, it can serve as the reference for all other updates.

---

## Implementation Process

### Step 1: Read importing-components.md

Verify it shows the correct patterns. If correct, use it as the canonical reference.

### Step 2: Create Global Find/Replace List

For efficiency, apply these 7 replacements to ALL files at once:

```bash
# In docs/ folder:

# 1. Primitives
sed -i "s/@equaltoai\/greater-components-primitives'/@equaltoai\/greater-components\/primitives'/g" *.md *.yaml

# 2. Icons
sed -i "s/@equaltoai\/greater-components-icons'/@equaltoai\/greater-components\/icons'/g" *.md *.yaml

# 3. Tokens
sed -i "s/@equaltoai\/greater-components-tokens'/@equaltoai\/greater-components\/tokens'/g" *.md *.yaml

# 4. Utils
sed -i "s/@equaltoai\/greater-components-utils'/@equaltoai\/greater-components\/utils'/g" *.md *.yaml

# 5. Headless
sed -i "s/@equaltoai\/greater-components-headless'/@equaltoai\/greater-components\/headless'/g" *.md *.yaml

# 6. Adapters
sed -i "s/@equaltoai\/greater-components-adapters'/@equaltoai\/greater-components\/adapters'/g" *.md *.yaml

# 7. Fediverse
sed -i "s/@equaltoai\/greater-components-fediverse'/@equaltoai\/greater-components\/fediverse'/g" *.md *.yaml
```

**WARNING:** Don't use sed - DO MANUAL REPLACEMENTS to avoid errors

### Step 3: Update Package Identifiers

In \_concepts.yaml, add `import_path` fields:

```yaml
primitives_package:
  package_name: '@equaltoai/greater-components'
  import_path: '@equaltoai/greater-components/primitives'

icons_package:
  package_name: '@equaltoai/greater-components'
  import_path: '@equaltoai/greater-components/icons'
# etc.
```

### Step 4: Update Installation Instructions

Find all instances of:

```bash
pnpm add @equaltoai/greater-components-primitives
npm install @equaltoai/greater-components-icons
```

Replace with:

```bash
pnpm add @equaltoai/greater-components
npm install @equaltoai/greater-components
```

### Step 5: Validation

**Run these checks after updates:**

```bash
cd docs/

# Should return 0 matches:
grep -r "@equaltoai/greater-components-primitives" *.md *.yaml
grep -r "@equaltoai/greater-components-icons" *.md *.yaml
grep -r "@equaltoai/greater-components-tokens" *.md *.yaml
grep -r "@equaltoai/greater-components-utils" *.md *.yaml
grep -r "@equaltoai/greater-components-headless\"" *.md *.yaml
grep -r "@equaltoai/greater-components-adapters" *.md *.yaml
grep -r "@equaltoai/greater-components-fediverse\"" *.md *.yaml

# Should return many matches (showing correct patterns):
grep -r "@equaltoai/greater-components/primitives" *.md *.yaml
grep -r "@equaltoai/greater-components/icons" *.md *.yaml
```

---

## Specific File Validation Checklist

After updates, verify each file:

- [ ] getting-started.md - No workspace package names, correct install command
- [ ] api-reference.md - All examples use subpackage paths
- [ ] core-patterns.md - All patterns use subpackage paths
- [ ] component-inventory.md - Package headers show correct paths, all examples updated
- [ ] patterns-landing-pages.md - All examples use correct imports
- [ ] example-landing-page.md - Complete example is runnable with correct imports
- [ ] development-guidelines.md - Examples show correct consumer-facing imports
- [ ] testing-guide.md - Test examples use correct imports
- [ ] troubleshooting.md - Solutions show working imports
- [ ] \_concepts.yaml - Each package has `import_path` field
- [ ] \_patterns.yaml - All code blocks use correct imports
- [ ] \_decisions.yaml - All examples use correct imports
- [ ] README.md - Quick start shows correct package + imports
- [ ] PAI-VALIDATION-TESTS.md - Test expectations show correct imports
- [ ] COMPLETENESS-CHECKLIST.md - Verify no code examples present
- [ ] importing-components.md - Should already be correct (verify)

---

## Critical Replacements (Exact Patterns)

### Pattern 1: Simple Primitives Import

```
FIND:    from '@equaltoai/greater-components-primitives';
REPLACE: from '@equaltoai/greater-components/primitives';
```

### Pattern 2: Simple Icons Import

```
FIND:    from '@equaltoai/greater-components-icons';
REPLACE: from '@equaltoai/greater-components/icons';
```

### Pattern 3: Headless Subpath Import

```
FIND:    from '@equaltoai/greater-components-headless/button';
REPLACE: from '@equaltoai/greater-components/headless/button';
```

(Similar for createModal, createMenu, etc.)

### Pattern 4: Package Name in Headers (Markdown)

```
FIND:    `@equaltoai/greater-components-primitives`
REPLACE: `@equaltoai/greater-components/primitives`
```

### Pattern 5: Package Name in Prose

```
FIND:    @equaltoai/greater-components-primitives package
REPLACE: @equaltoai/greater-components primitives subpackage
```

### Pattern 6: Installation Commands

```
FIND:    pnpm add @equaltoai/greater-components-primitives @equaltoai/greater-components-tokens
REPLACE: pnpm add @equaltoai/greater-components
```

```
FIND:    npm install @equaltoai/greater-components-primitives
REPLACE: npm install @equaltoai/greater-components
```

### Pattern 7: Multiple Package Install

```
FIND:    npm install @equaltoai/greater-components-fediverse @equaltoai/greater-components-adapters @equaltoai/greater-components-utils
REPLACE: npm install @equaltoai/greater-components
```

### Pattern 8: JSR Installation (if present)

```
FIND:    npx jsr add @equaltoai/greater-components-primitives
REPLACE: npx jsr add @equaltoai/greater-components
```

---

## Special Cases

### YAML Files (\_concepts.yaml, \_patterns.yaml, \_decisions.yaml)

**Challenge:** Code is in multiline strings

**Approach:** Apply same find/replace patterns but preserve YAML indentation

**Example Before:**

```yaml
correct_example: |
  <script>
    import { Button } from '@equaltoai/greater-components-primitives';
  </script>
```

**Example After:**

```yaml
correct_example: |
  <script>
    import { Button } from '@equaltoai/greater-components/primitives';
  </script>
```

**Validation:** YAML syntax must remain valid after changes

---

### getting-started.md Installation Section

**Current (Likely):**

````markdown
## Installation

### Step 1: Choose Your Packages

Greater Components is modular. Install only what you need:

```bash
pnpm add @equaltoai/greater-components-primitives
pnpm add @equaltoai/greater-components-tokens
pnpm add @equaltoai/greater-components-icons
pnpm add @equaltoai/greater-components-fediverse
```
````

````

**Should Become:**
```markdown
## Installation

### Step 1: Install the Package

```bash
# Install the complete library
pnpm add @equaltoai/greater-components

# Or using npm
npm install @equaltoai/greater-components

# Or using yarn
yarn add @equaltoai/greater-components
````

Greater Components is published as a single package that includes all subpackages: primitives, icons, tokens, fediverse, headless, adapters, utils, and testing.

### Step 2: Import Components

Import from subpackage paths:

```typescript
// Primitives (interactive components and layout)
import { Button, Container, Section } from '@equaltoai/greater-components/primitives';

// Icons
import { MenuIcon, HomeIcon } from '@equaltoai/greater-components/icons';

// Design tokens (CSS)
import '@equaltoai/greater-components/tokens/theme.css';

// Fediverse components (for social apps)
import { Timeline, Status } from '@equaltoai/greater-components/fediverse';
```

````

---

### README.md Quick Start Section

**Should Show:**
```markdown
## Quick Start

### Installation

```bash
npm install @equaltoai/greater-components
````

### Basic Usage

```typescript
import { Button, Container } from '@equaltoai/greater-components/primitives';
import { HomeIcon } from '@equaltoai/greater-components/icons';

// Your code here
```

````

---

## Verification Script

After all updates, run this verification:

```bash
#!/bin/bash
cd docs/

echo "Checking for incorrect workspace package names..."

# These should all return 0 matches:
echo -n "Checking -primitives: "
grep -r "@equaltoai/greater-components-primitives" *.md *.yaml | wc -l

echo -n "Checking -icons: "
grep -r "@equaltoai/greater-components-icons" *.md *.yaml | wc -l

echo -n "Checking -tokens: "
grep -r "@equaltoai/greater-components-tokens" *.md *.yaml | wc -l

echo -n "Checking -utils: "
grep -r "@equaltoai/greater-components-utils" *.md *.yaml | wc -l

echo -n "Checking -headless: "
grep -r "@equaltoai/greater-components-headless\"" *.md *.yaml | wc -l

echo -n "Checking -adapters: "
grep -r "@equaltoai/greater-components-adapters" *.md *.yaml | wc -l

echo -n "Checking -fediverse: "
grep -r "@equaltoai/greater-components-fediverse\"" *.md *.yaml | wc -l

echo ""
echo "Checking for correct subpackage paths..."

# These should return many matches:
echo -n "Checking /primitives: "
grep -r "@equaltoai/greater-components/primitives" *.md *.yaml | wc -l

echo -n "Checking /icons: "
grep -r "@equaltoai/greater-components/icons" *.md *.yaml | wc -l

echo ""
echo "If workspace package names show 0 and subpackage paths show >0, SUCCESS!"
````

---

## Success Criteria

### Must Achieve

- [ ] Zero references to `@equaltoai/greater-components-primitives` in any doc
- [ ] Zero references to `@equaltoai/greater-components-icons` in any doc
- [ ] Zero references to `@equaltoai/greater-components-tokens` in any doc
- [ ] Zero references to `@equaltoai/greater-components-utils` in any doc
- [ ] Zero references to separate package installation (unless noting they don't exist)
- [ ] All imports use `/primitives`, `/icons`, `/tokens` subpaths
- [ ] Installation sections show single package install
- [ ] All YAML files remain valid after changes
- [ ] example-landing-page.md code is copy-paste runnable

### Validation Tests

1. **Grep Test:** No workspace package names remain
2. **Syntax Test:** All YAML files parse correctly
3. **Example Test:** Copy example-landing-page.md code to fresh project, verify it works
4. **Consistency Test:** All files use same import pattern
5. **Build Test:** Documentation site builds without errors

---

## Important Notes for Agent

### DO:

- ✅ Replace workspace package names with subpackage paths
- ✅ Update installation instructions to show single package
- ✅ Preserve all code functionality - only imports change
- ✅ Maintain YAML syntax validity
- ✅ Keep all examples, just fix import paths
- ✅ Update package identifiers in headers/prose

### DON'T:

- ❌ Don't change import paths that are already correct
- ❌ Don't remove examples or code blocks
- ❌ Don't modify package.json files
- ❌ Don't change component code in packages/
- ❌ Don't modify build scripts
- ❌ Don't break YAML indentation

### Files to NOT Modify

- packages/\*/package.json - Leave package definitions alone
- packages/\*/src/ - Don't touch source code
- packages/greater-components/scripts/build.js - Build script already fixed
- Any file in packages/ - Only docs/ folder needs updates

---

## Expected Results

**Before:**

- ~150 code examples across KB
- ~140 use workspace package names (93%)
- External consumers can't use examples

**After:**

- ~150 code examples across KB
- ~150 use correct subpackage paths (100%)
- All examples work for external consumers
- One package to install: `@equaltoai/greater-components`
- Clear, consistent import patterns throughout

---

## Final Validation

After completing all updates, test with PAI:

**Query PAI:**

> "Show me how to install and use greater-components to build a button"

**Expected Response:**

```typescript
// Installation
npm install @equaltoai/greater-components

// Usage
import { Button } from '@equaltoai/greater-components/primitives';

<Button variant="solid">Click Me</Button>
```

**Should NOT show:**

- `@equaltoai/greater-components-primitives`
- Multiple packages to install
- Workspace package names

**If PAI shows correct pattern → Documentation update successful ✅**
