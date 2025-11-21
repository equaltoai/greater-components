# Unified CSS Architecture: "One Way, Every Time"

**Goal**: Create a deterministic, AI-friendly, and developer-friendly styling system for Greater Components.

## The Philosophy

Current frontend frameworks suffer from "Tree-Shaking Anxiety." If a component isn't imported in JavaScript, its styles often vanish from the production build. This creates brittle visual systems where utility classes (like `.gr-gradient-text`) work in development but break in production, or require importing unused JS components just to "wake up" the CSS.

**This framework prioritizes predictability over bandwidth.**

For an AI or a developer to work efficiently, the rules must be absolute:
1.  **Install the package.**
2.  **Import the CSS.**
3.  **It works.**

Every class, every utility, and every component style is available globally, immediately, and consistently. We decouple the **Visual Language** from the **JavaScript Logic**.

---

## The Architecture

Every UI package in the monorepo (`tokens`, `primitives`, `fediverse`, `icons`) must adhere to this contract:

### 1. The Single Source of Truth
Each package exposes a single entry point for its styles: `theme.css`.

```typescript
// Consumer Root Layout
import '@equaltoai/greater-components/tokens/theme.css';     // Foundation
import '@equaltoai/greater-components/primitives/theme.css'; // UI Elements
import '@equaltoai/greater-components/fediverse/theme.css';  // Domain Components
```

### 2. No Hidden Styles
*   **No `<style>` blocks in Svelte components** for global or utility classes.
*   All styles are extracted to `theme.css`.
*   Components render with stable class names (e.g., `.gr-button`, `.gr-card`).
*   Styles are **always** present, regardless of whether the JS component is mounted.

---

## Critical Warning

**DO NOT REVERT TO INDIVIDUAL PACKAGE CSS PUBLISHING.**

This architecture was previously implemented successfully and published. A subsequent agent, attempting to fix a CopyButton bug, incorrectly decided to undo the unified CSS approach and publish each package individually. This broke the entire release system and reverted successful, already-published changes.

**The unified CSS architecture is the correct approach.** Surface-level bugs (like CopyButton visibility) should be fixed within the `theme.css` structure, not by reverting the architectural decision.

---

## Implementation Plan

### 1. Primitives Package Refactor
**Status**: Needs Reconstruction (Was successfully implemented, then incorrectly reverted)

*   **Action**: Re-extract styles from all 30 components (Button, Badge, Modal, etc.) into `packages/primitives/src/theme.css`.
*   **Cleanup**: Remove `<style>` blocks containing `:global` rules from `.svelte` files.
*   **Build**: Ensure `scripts/build-css.js` copies `theme.css` to `dist/` and creates the `style.css` alias for backward compatibility.
*   **Exports**: Update `package.json` to export `./theme.css`.

### 2. Fediverse Package Alignment
**Status**: Needs Implementation

*   **Action**: Create `packages/fediverse/src/theme.css`.
*   **Action**: Ensure all new components follow the extracted style pattern.
*   **Build**: Update build scripts to export this file.

### 3. Visual Fixes & Polish
These fixes must be implemented directly into the `theme.css` structure, ensuring they are universally available.

**IMPORTANT**: These bugs were used as justification to revert the unified CSS architecture. That was incorrect. Fix the bugs in `theme.css`, not by breaking the architecture.

**CopyButton Visibility**
*   *Problem*: Invisible icon in dark mode contexts (ghost button on dark background). This bug triggered the incorrect architectural reversion.
*   *Fix*: Enforce `color: inherit` for `.gr-code-block__copy-btn` in `theme.css` so it adapts to the high-contrast text color of the code block.

**CodeBlock Scrollbars**
*   *Problem*: Unnecessary horizontal scrollbars on short snippets.
*   *Fix*: Reset `margin` and `padding` on `pre.shiki` elements within `.gr-code-block`. The container should handle layout; the pre tag should strictly handle content.

### 4. Icons Package
*   **Type Safety**: Ensure the `iconRegistry` is strictly typed to prevent `any` errors during strict builds.

---

## Release Strategy

**Target**: Version 2.1.1 (Patch Bump)

We must avoid the "V3.0.0 Incident" where dependency alignment triggered a major version bump.

1.  **Changesets**: Generate a changeset *only* for the packages with actual code changes (`primitives`, `icons`, `greater-components`).
2.  **Scope**: Define the release as a `minor` update. It is a breaking change (requires new import), but in the context of our roadmap, it is treated as a feature alignment (v2.1).
3.  **Verification**: dry-run the release to ensure it does not cascade into a major version update for unaffected packages.

---

## Migration path that HAS ALREADY BEEN IMPLEMENTED BY CONSUMERS AND MUST BE MAINTAINED for Consumers

Developers will need to update their root layout once:

```svelte
<script>
  // REQUIRED: The Foundation
  import '@equaltoai/greater-components/tokens/theme.css';
  
  // REQUIRED: The UI Elements (New Import)
  import '@equaltoai/greater-components/primitives/theme.css';
</script>
```

Once this is done, the entire framework is unlocked.
