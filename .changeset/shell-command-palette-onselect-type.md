---
'@equaltoai/greater-components-shell': patch
---

Fix `CommandPalette` `Props.onselect` type collision with `HTMLAttributes<HTMLDivElement>.onselect`. The component re-uses the `onselect` prop name for its API callback `(item: CommandPaletteItem) => void`, but `HTMLAttributes<HTMLDivElement>` already includes a standard DOM text-selection event handler with signature `EventHandler<Event, HTMLDivElement>`. The two are incompatible and `svelte-check` strict mode rejected the `extends`. Fixed by adding `'onselect'` to the existing `Omit` list (mirroring how `'aria-label'` is already omitted at the same site for the same kind of conflict). Runtime behavior is unchanged — Svelte 5's `$props()` binds the prop name passed by the parent slot, never the underlying DOM element's event attribute. Closes #679.
