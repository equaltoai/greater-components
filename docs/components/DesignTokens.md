# Greater Components Design Tokens

The `@equaltoai/greater-components-tokens` package centralizes every color, spacing, typography, and motion value used across the demo suite. Phase 1 standardizes the build so every consuming app relies on the generated CSS variables instead of ad‑hoc styles.

## Package Outputs

| Artifact               | Description                                                                     |
| ---------------------- | ------------------------------------------------------------------------------- | ---- | -------------------------- |
| `theme.css`            | Bundled CSS variables that include `:root` assignments plus `[data-theme="light | dark | highContrast"]` overrides. |
| `themes/*`             | Individual theme files for targeted imports or debugging.                       |
| `high-contrast.css`    | Additional WCAG-friendly overrides shipped alongside the bundle.                |
| `dist/index.{js,d.ts}` | Tree-shakeable helpers such as `getSemanticColor('action.primary.default')`.    |

Running `pnpm --filter @equaltoai/greater-components-tokens build` executes `scripts/build.js`, which:

1. Flattens `tokens.json` into CSS custom properties (`--gr-color-primary-500`, etc.).
2. Resolves references in `themes.json` so semantic tokens automatically inherit base values.
3. Emits theme-specific CSS + media queries for `prefers-color-scheme` and `prefers-contrast`.
4. Generates strict TypeScript definitions for every token accessor.

## Consuming Tokens

Import the CSS bundle once in your app layout:

```svelte
<script>
	import '@equaltoai/greater-components-tokens/theme.css';
</script>
```

Then reference semantic values in components:

```css
.card {
	background: var(--gr-semantic-background-primary);
	border-radius: var(--gr-radii-xl);
	box-shadow: var(--gr-shadows-md);
}
```

Switch themes with the `data-theme` attribute:

```ts
const themes = ['light', 'dark', 'highContrast'] as const;
document.documentElement.dataset.theme = themes[nextIndex];
```

Because every primitive and demo page now imports the published package (not local source), the tokens you see in the playground match what downstream consumers receive.
