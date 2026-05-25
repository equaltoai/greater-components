# @equaltoai/greater-components-shell

App shell layout components for Greater Components.

This package provides the **shell surface** required by app-shaped Fediverse / Lesser-aware
consumers (e.g. `lesser-host` web). It is intentionally additive: existing primitives are
not overloaded, and consumers can adopt these components incrementally via the Greater CLI.

## Components

- **Shell** — root grid layout combining `Sidebar`, `Topbar`, and main content
- **Sidebar** — semantic `<nav>` sidebar with an accessible name
- **Topbar** — site/app `<header>` bar
- **Panel** — content container with header / body / footer
- **StatCard** — metric display card
- **SummaryStrip** — labeled region grouping summary items
- **PageFrame** — single-page wrapper with optional aside
- **PageTitle** — semantic page heading with eyebrow / subtitle / actions
- **Breadcrumb** — breadcrumb navigation with `aria-current="page"`
- **Callout** — informational call-out (status / alert / note)

## Stewardship guarantees

- **Strict CSP safe.** No inline event handlers, no `style` attributes set at runtime, no
  browser globals at module evaluation time. Only static class generation from preset props.
- **SSR-safe.** Components render correctly during SvelteKit SSR.
- **WCAG 2.1 AA from first commit.** Semantic landmarks, real `<a>` / `<button>` controls,
  `aria-current="page"` on the active nav item, accessible names on all navigation, visible
  focus states, and live-region semantics on Callout (`role="status" | "alert" | "note"`).
- **Theming via `--gr-*` tokens only.** Existing tokens are stable; this package adds only
  additive `--gr-shell-*` tokens with documented purposes.
- **Source-install via CLI.** Components are installed into consumer codebases through the
  Greater CLI (`greater add shell`). The CLI registry checksums every file.

## Usage

```svelte
<script lang="ts">
	import {
		Shell,
		Sidebar,
		Topbar,
		Panel,
		PageFrame,
		PageTitle,
	} from '@equaltoai/greater-components/shell';
</script>

<Shell>
	{#snippet topbar()}
		<Topbar>
			{#snippet start()}<strong>lesser-host</strong>{/snippet}
		</Topbar>
	{/snippet}

	{#snippet sidebar()}
		<Sidebar label="Primary navigation">
			<a href="/overview" aria-current="page">Overview</a>
			<a href="/instances">Instances</a>
		</Sidebar>
	{/snippet}

	<PageFrame>
		{#snippet header()}
			<PageTitle title="Overview" eyebrow="Project 39" />
		{/snippet}

		<Panel title="Fleet status">…</Panel>
	</PageFrame>
</Shell>
```

## License

AGPL-3.0-only
