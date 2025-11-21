# Package Expectations vs Reality

## The Problem

AI tools (like PAI) generate code that assumes `@equaltoai/greater-components` works like a standard, published npm package. The reality is different, creating a gap between what developers expect and what actually works.

## What PAI/AI Expects (Standard npm Package Pattern)

### Expected Install

```bash
npm install @equaltoai/greater-components
# Or separate subpackages:
npm install @equaltoai/greater-components-primitives
npm install @equaltoai/greater-components-icons
npm install @equaltoai/greater-components-tokens
```

### Expected Imports

```typescript
// Pattern 1: Direct component subpath imports
import { Button } from '@equaltoai/greater-components/Button';
import { Container } from '@equaltoai/greater-components/Container';

// Pattern 2: Separate published packages
import { Button } from '@equaltoai/greater-components-primitives';
import { MenuIcon } from '@equaltoai/greater-components-icons';

// Pattern 3: Barrel import from main package
import { Button, Container, MenuIcon } from '@equaltoai/greater-components';
```

### Expected CSS

```typescript
// Import component styles
import '@equaltoai/greater-components/styles.css';
// Or
import '@equaltoai/greater-components-primitives/styles.css';
```

## What Actually Exists (v1.1.0)

### Actual Published Package

```bash
# Only ONE package is published to npm:
npm install @equaltoai/greater-components

# These DO NOT exist on npm (they're private workspace packages):
# ❌ @equaltoai/greater-components-primitives
# ❌ @equaltoai/greater-components-icons
# ❌ @equaltoai/greater-components-tokens
# ❌ @equaltoai/greater-components-utils
```

### Actual Working Imports (v1.1.0)

```typescript
// ✅ ONLY THIS WORKS: Import from subpackage paths
import { Button, Container } from '@equaltoai/greater-components/primitives';
import { MenuIcon, XIcon } from '@equaltoai/greater-components/icons';

// ❌ BROKEN: Barrel import triggers fediverse loading
import { Button } from '@equaltoai/greater-components';
// Error: Cannot find module '@equaltoai/greater-components-utils'

// ❌ DON'T EXIST: Component subpath imports
import { Button } from '@equaltoai/greater-components/Button';
// Error: No export configured for '/Button'

// ❌ DON'T EXIST: Separate packages
import { Button } from '@equaltoai/greater-components-primitives';
// Error: Package not found
```

### Actual CSS Situation

```typescript
// ✅ Tokens CSS exists and works
import '@equaltoai/greater-components/tokens/theme.css';

// ⚠️ Primitives CSS is EMPTY (just a placeholder comment)
import '@equaltoai/greater-components/primitives/style.css';
// File exists but contains no actual styles
// Components have inlined styles but something's not working correctly
```

## Root Causes

### 1. Monorepo Architecture vs Published Package

**What exists locally:**

- `packages/primitives/` - Separate workspace package
- `packages/icons/` - Separate workspace package
- `packages/tokens/` - Separate workspace package
- `packages/utils/` - Separate workspace package
- `packages/greater-components/` - Aggregate/umbrella package

**What's published:**

- Only `@equaltoai/greater-components` (the umbrella package)
- It bundles dist outputs from all workspace packages
- But workspace package names (`-primitives`, `-icons`) are NOT published separately

### 2. Broken Barrel Export

**File:** `packages/greater-components/scripts/build.js` (lines 50-57)

The build script creates a root barrel export:

```javascript
function generateRootBarrels() {
	const entryTargets = packages.map(({ key }) => `export * from './${key}/index.js';`).join('\n');
	writeFileSync(join(distDir, 'index.js'), `${entryTargets}\n`, 'utf8');
}
```

This exports from ALL packages including `fediverse`:

```javascript
export * from './adapters/index.js';
export * from './fediverse/index.js'; // ← THIS BREAKS
export * from './headless/index.js';
export * from './icons/index.js';
export * from './primitives/index.js';
export * from './tokens/index.js';
export * from './utils/index.js'; // ← utils isn't in published deps
export * from './testing/index.js';
export * from './cli/index.js';
```

**Problem:** When you import from the root, it tries to load fediverse components, which import from `@equaltoai/greater-components-utils`, which doesn't exist in the published package dependencies.

### 3. Empty CSS Bundle

**File:** `packages/primitives/scripts/build-css.js` (lines 57-60)

```javascript
if (cssFiles.length === 0) {
	const placeholder = `/* ... placeholder comment ... */`;
	writeFileSync(styleCssPath, placeholder, 'utf8');
	console.log('ℹ️ No standalone component CSS detected; emitted placeholder style.css');
}
```

The script finds **no CSS files** in the dist because:

- Svelte 5 components with `<style>` tags compile their CSS inline
- The build process doesn't extract them into separate `.css` files
- So `style.css` gets a placeholder instead of actual styles

### 4. Missing Package Dependencies

**File:** `packages/greater-components/package.json`

```json
{
	"dependencies": {
		"@apollo/client": "^4.0.9"
		// ... other deps
		// ❌ Missing @equaltoai/greater-components-utils
		// ❌ Missing @equaltoai/greater-components-primitives
		// etc.
	},
	"devDependencies": {
		"@equaltoai/greater-components-utils": "workspace:*" // ← Only in devDeps
		// ...
	}
}
```

The workspace packages are `devDependencies`, not `dependencies`, so they're not bundled or published alongside the main package.

## What Needs to Happen

### For Proper npm Distribution (Choose One Approach):

#### Approach A: Fix the Umbrella Package

1. **Bundle all dependencies properly** - Include utils, primitives CSS, etc. in the published package
2. **Fix the barrel export** - Don't export fediverse (or bundle its dependencies correctly)
3. **Generate proper CSS bundles** - Extract and bundle component styles into `primitives/style.css`
4. **Add proper dependencies** - Move workspace deps to regular deps or bundle them

#### Approach B: Publish Subpackages Separately

1. **Remove "private": true** from subpackage `package.json` files
2. **Publish each package** to npm independently:
   - `@equaltoai/greater-components-primitives`
   - `@equaltoai/greater-components-icons`
   - `@equaltoai/greater-components-tokens`
   - `@equaltoai/greater-components-utils`
3. **Make umbrella package depend on them** via npm (not workspace:\*)
4. **Users can install** either the umbrella or individual packages

#### Approach C: JSR Publishing (Already Configured)

The packages have `jsr.json` files and appear ready for JSR. This might be a better distribution method than npm.

## Current Workaround (Unsatisfactory)

```typescript
// Must use these specific imports:
import { Button, Container } from '@equaltoai/greater-components/primitives';
import { MenuIcon } from '@equaltoai/greater-components/icons';
import '@equaltoai/greater-components/tokens/theme.css';

// Can't use the root export
// Can't import CSS for component styles (it's empty)
// Must understand the internal package structure
```

## Recommended Next Steps

1. **Decide on distribution strategy**: Umbrella only, subpackages, or JSR?
2. **Fix the build process** to properly bundle/export what consumers need
3. **Publish corrected v1.2.0** with working imports and CSS
4. **Update documentation** with actual working patterns
5. **Test with a fresh install** outside the monorepo to verify it works

## Questions to Answer

1. Should the umbrella package bundle everything, or should subpackages be published separately?
2. Should we support barrel imports from the root, or only from subpackages?
3. How should CSS be distributed - bundled, separate files, or inlined only?
4. Should we prioritize npm or JSR for distribution?
5. What's the minimal set of exports needed for 90% of use cases?
