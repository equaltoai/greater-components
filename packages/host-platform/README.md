# @equaltoai/greater-components-host-platform

Hosted-platform data-display components for Greater Components.

This package ships the **hosted-platform surface** — UI components for managed
Fediverse instance dashboards, where consumers like `lesser-host` web render
per-instance fleet cards, cost gauges, and activity sparklines. It is
intentionally separate from `shell` and the Fediverse `faces/*` packages: those
are protocol-aware, presentational surfaces; this is the operator / platform
console surface.

## Components

- **FleetCard** — composed instance / fleet card with identity, status,
  metadata, primary / secondary actions, and slots for cost / activity summaries
- **CostGauge** — `role="meter"` cost / usage indicator with thresholds,
  non-color-only status, and accessible value text
- **ActivitySparkline** — inline SVG trend visualization with explicit
  label / description semantics; decorative mode only when a textual equivalent
  exists nearby

## Stewardship guarantees

- **Strict CSP safe.** No inline event handlers, no `style` attributes set at
  runtime, no browser globals at module evaluation time.
- **SSR-safe.** All components render correctly during SvelteKit SSR.
- **WCAG 2.1 AA from first commit.** Non-color-only status communication
  (icon + text alongside color), `role="meter"` semantics on the gauge,
  `<svg role="img">` with accessible name when the sparkline is informative,
  full keyboard reachability on actionable elements.
- **Theming via `--gr-*` tokens only.** Existing tokens are stable; this
  package adds only additive `--gr-host-platform-*` tokens where needed.
- **Source-install via CLI.** Components install into consumer codebases
  through the Greater CLI (`greater add host-platform`). Per-file checksums
  in the registry verify every install.
- **No contract sync.** Consumers pass already-shaped data; no Lesser /
  Lesser Host adapter or pinned snapshot dependency.

## Usage

```svelte
<script lang="ts">
	import {
		FleetCard,
		CostGauge,
		ActivitySparkline,
	} from '@equaltoai/greater-components/host-platform';
</script>

<FleetCard
	name="lesser.example"
	slug="lesser-example"
	region="us-east-1"
	status="healthy"
	metadata={[
		{ key: 'Version', value: 'v1.4.12' },
		{ key: 'Users', value: '1,243' },
	]}
>
	{#snippet cost()}
		<CostGauge current={42.5} limit={100} currency="USD" />
	{/snippet}

	{#snippet activity()}
		<ActivitySparkline data={[3, 8, 5, 12, 9, 14, 10]} label="Posts per hour" />
	{/snippet}

	{#snippet actions()}
		<button type="button">Manage</button>
	{/snippet}
</FleetCard>
```

## License

AGPL-3.0-only
