---
'greater-components': minor
'@equaltoai/greater-components': minor
'@equaltoai/greater-components-shell': minor
---

Add `CommandPalette` to the `@equaltoai/greater-components/shell` surface — an accessible, strict-CSP-safe command palette for app navigation, quick actions, and settings search (lesser-host web M0.7 / Project 39 Greater Signal D).

Highlights:

- **W3C ARIA combobox + listbox pattern with virtual focus.** Real focus stays on the search input; ArrowUp / ArrowDown / Home / End move `aria-activedescendant` through results, skipping disabled items. Enter activates the current item; Escape closes; outside-pointerdown closes; focus returns to the opener.
- **Composes existing headless behaviors.** Uses `createFocusTrap`, `createDismissable`, and `createLiveRegion` from `@equaltoai/greater-components-headless` rather than reimplementing focus management, ESC handling, or live-region announcements.
- **Grouped or flat results.** Pass `groups: CommandPaletteGroup[]` to render one `<ul role="listbox">` per group (each `<section role="group">` with linked `aria-labelledby` header) or `items: CommandPaletteItem[]` for a single flat listbox.
- **Dependency-free fuzzy filter.** Bundled at `@equaltoai/greater-components/shell/fuzzy-filter` (also exported as `filterAndRankCommandPaletteItems`, `scoreCommandPaletteItem`, `tokenizeCommandPaletteQuery` from the shell barrel). No cmdk, no runtime dependency, no `unsafe-eval`. Multi-token queries require every token to match; ranking prefers exact > prefix > word-boundary > substring across label / description / keywords. Override with a `filter` prop.
- **Customizable rendering.** `itemTemplate(item, isActive)`, `emptyState`, and `loadingState` snippets let consumers theme the palette without forking.
- **Strict CSP + SSR safe.** No inline event handlers; no `style` attributes set at runtime; no module-level browser globals. Stable per-instance ids via `useStableId` (same primitive Modal / TextArea / Panel / StatCard already use).
- **Theming via additive `--gr-shell-*` tokens.** The command-palette root class is included in the broad `:where(...)` defaults selector, so standalone usage outside a `Shell` ancestor still has working spacing.

API:

```ts
import { CommandPalette } from '@equaltoai/greater-components/shell';
import type {
	CommandPaletteItem,
	CommandPaletteGroup,
	CommandPaletteFilter,
} from '@equaltoai/greater-components/shell/types';
```

No existing exports are renamed or removed. No Lesser / Lesser Host adapter or contract changes.
