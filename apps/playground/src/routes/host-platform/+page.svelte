<!--
Host-platform playground demo.

Exercises the @equaltoai/greater-components-host-platform components:
- FleetCard (multiple instances showing every status)
- CostGauge (auto-status across thresholds + explicit override + custom formatter)
- ActivitySparkline (informative + decorative + empty / tone variants)

Strict-CSP safe: no inline handlers, no inline style attributes set by
components. Only static stylesheets and class-driven width steps.
-->
<script lang="ts">
	import {
		FleetCard,
		CostGauge,
		ActivitySparkline,
	} from '@equaltoai/greater-components-host-platform';
	import '@equaltoai/greater-components-host-platform/host-platform.css';
</script>

<svelte:head>
	<title>Host-platform components — Greater Components Playground</title>
</svelte:head>

<div class="page">
	<header>
		<h1>Host-platform data-display components</h1>
		<p>
			Hosted-platform surface for managed-instance dashboards: FleetCard, CostGauge,
			ActivitySparkline. Strict-CSP-safe, WCAG 2.1 AA, status communication is never color-only.
		</p>
	</header>

	<section class="fleet-grid">
		<FleetCard
			name="lesser.example"
			slug="lesser-example"
			region="us-east-1"
			version="v1.4.12"
			status="healthy"
			description="Primary production fleet."
			metadata={[
				{ key: 'Users', value: '1,243' },
				{ key: 'Posts / day', value: '8,901' },
			]}
		>
			{#snippet cost()}
				<CostGauge current={42.5} limit={100} currency="USD" label="Monthly spend" />
			{/snippet}
			{#snippet activity()}
				<ActivitySparkline data={[3, 8, 5, 12, 9, 14, 10]} label="Posts per hour" />
			{/snippet}
			{#snippet actions()}
				<button type="button">Manage</button>
				<button type="button">View logs</button>
			{/snippet}
		</FleetCard>

		<FleetCard
			name="lesser.staging"
			slug="lesser-staging"
			region="us-west-2"
			version="v1.4.12-rc.1"
			status="warning"
			metadata={[
				{ key: 'Users', value: '42' },
				{ key: 'Posts / day', value: '187' },
			]}
		>
			{#snippet cost()}
				<CostGauge current={78} limit={100} currency="USD" label="Monthly spend" />
			{/snippet}
			{#snippet activity()}
				<ActivitySparkline data={[5, 6, 4, 9, 7, 6, 8]} label="Posts per hour" tone="warning" />
			{/snippet}
		</FleetCard>

		<FleetCard
			name="lesser.scratch"
			region="eu-central-1"
			status="degraded"
			description="Scratch fleet — auto-restart in progress."
		>
			{#snippet cost()}
				<CostGauge current={95} limit={100} currency="USD" label="Monthly spend" />
			{/snippet}
			{#snippet activity()}
				<ActivitySparkline data={[12, 9, 7, 3, 1, 0, 0]} label="Posts per hour" tone="danger" />
			{/snippet}
		</FleetCard>

		<FleetCard
			name="lesser.boot"
			region="ap-south-1"
			status="provisioning"
			description="Spinning up — expect 2–3 minutes."
		>
			{#snippet activity()}
				<ActivitySparkline data={[]} label="Posts per hour" />
			{/snippet}
		</FleetCard>
	</section>

	<section>
		<h2>CostGauge variants</h2>
		<div class="gauge-grid">
			<CostGauge current={10} limit={100} currency="USD" label="Within budget (10%)" />
			<CostGauge current={80} limit={100} currency="USD" label="Approaching limit (80%)" />
			<CostGauge current={97} limit={100} currency="USD" label="Over budget (97%)" />
			<CostGauge
				current={1234}
				limit={5000}
				formatValue={(value, currency) => `${currency} ${value.toFixed(0)}`}
				currency="USD"
				label="Custom formatter"
			/>
			<CostGauge
				current={0}
				limit={0}
				label="Edge case: zero limit"
				description="Renders 0% safely without invalid ARIA attributes."
			/>
		</div>
	</section>

	<section>
		<h2>ActivitySparkline variants</h2>
		<div class="sparkline-grid">
			<div>
				<p><strong>Default (informative, label set)</strong></p>
				<ActivitySparkline data={[3, 8, 5, 12, 9, 14, 10]} label="Posts per hour" />
			</div>
			<div>
				<p><strong>Decorative (textual equivalent nearby)</strong> — Posts up 30% w/w</p>
				<ActivitySparkline data={[3, 8, 5, 12, 9, 14, 10]} decorative />
			</div>
			<div>
				<p><strong>Empty</strong></p>
				<ActivitySparkline data={[]} label="Posts per hour" />
			</div>
			<div>
				<p><strong>Constant series</strong></p>
				<ActivitySparkline data={[5, 5, 5, 5]} label="Posts per hour" />
			</div>
			<div>
				<p><strong>Tone: success</strong></p>
				<ActivitySparkline
					data={[1, 2, 3, 4, 5, 6, 7]}
					label="Steadily increasing"
					tone="success"
				/>
			</div>
			<div>
				<p><strong>Tone: danger</strong></p>
				<ActivitySparkline
					data={[10, 9, 7, 3, 1, 0, 0]}
					label="Falling off a cliff"
					tone="danger"
				/>
			</div>
		</div>
	</section>
</div>

<style>
	.page {
		max-width: 64rem;
		margin: 2rem auto;
		padding: 0 1.5rem;
		font-family:
			ui-sans-serif,
			system-ui,
			-apple-system,
			'Segoe UI',
			Roboto,
			sans-serif;
		color: var(--gr-semantic-foreground-primary, #111827);
	}
	header {
		margin-bottom: 1.5rem;
	}
	h1 {
		margin: 0 0 0.5rem;
		font-size: 1.5rem;
	}
	section {
		margin-top: 2rem;
	}
	.fleet-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
		gap: 1rem;
	}
	.gauge-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		max-width: 32rem;
	}
	.sparkline-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
		gap: 1.5rem;
	}
	.sparkline-grid p {
		margin: 0 0 0.5rem;
		font-size: 0.875rem;
	}
	button {
		font: inherit;
		padding: 0.375rem 0.75rem;
		border-radius: 0.375rem;
		border: 1px solid var(--gr-semantic-border-subtle, #e5e7eb);
		background: var(--gr-semantic-background-surface, #fff);
		cursor: pointer;
	}
	button:hover {
		background: var(--gr-semantic-background-secondary, #f3f4f6);
	}
</style>
