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
		ProvisioningTimeline,
		ReleaseTimeline,
		StackMatrix,
	} from '@equaltoai/greater-components-host-platform';
	import type {
		ProvisioningStep,
		ReleaseTimelineItem,
		StackMatrixColumn,
		StackMatrixRow,
		StackMatrixSortDirection,
	} from '@equaltoai/greater-components-host-platform';
	import '@equaltoai/greater-components-host-platform/host-platform.css';

	// G3 — operator components
	const provisioningSteps: ProvisioningStep[] = [
		{
			id: 'allocate',
			label: 'Allocate compute',
			status: 'success',
			timestamp: '2026-05-24T15:00:00Z',
			meta: '38s',
		},
		{
			id: 'install',
			label: 'Install Lesser',
			status: 'success',
			timestamp: '2026-05-24T15:00:38Z',
			meta: '1m12s',
		},
		{
			id: 'migrate',
			label: 'Run migrations',
			status: 'active',
			description: 'Applying schema CSR-035 + x402 grant indexes…',
		},
		{ id: 'seed', label: 'Seed default data', status: 'pending' },
		{ id: 'verify', label: 'Verify health checks', status: 'pending' },
	];

	const releases: ReleaseTimelineItem[] = [
		{
			id: 'lesser-v1412',
			version: 'v1.4.12',
			channel: 'stable',
			date: '2026-05-22T00:00:00Z',
			status: 'shipped',
			adoption: 0.82,
			description: 'Stable release — rate-limit headers + 429 responses.',
		},
		{
			id: 'lesser-v1500rc1',
			version: 'v1.5.0-rc.1',
			channel: 'beta',
			date: '2026-05-23T00:00:00Z',
			status: 'in-progress',
			adoption: 0.05,
			description: 'Early-access channel; metrics endpoints stabilizing.',
		},
		{
			id: 'lesser-v1411',
			version: 'v1.4.11',
			channel: 'stable',
			date: '2026-05-18T00:00:00Z',
			status: 'rolled-back',
			adoption: 0,
			description: 'Pulled after CSR-041 OpenAPI gap discovered.',
		},
	];

	const stackColumns: StackMatrixColumn[] = [
		{ id: 'lesser', label: 'Lesser', sortable: true },
		{ id: 'host', label: 'Lesser Host', sortable: true },
		{ id: 'body', label: 'Body', sortable: false },
	];

	let stackRows = $state<StackMatrixRow[]>([
		{
			id: 'r-lesser-example',
			label: 'lesser.example',
			subLabel: 'us-east-1',
			cells: {
				lesser: { value: 'v1.4.12', drift: 'in-sync' },
				host: { value: 'v0.4.5', drift: 'pending' },
				body: { value: 'v0.2.1', drift: 'in-sync' },
			},
		},
		{
			id: 'r-lesser-staging',
			label: 'lesser.staging',
			subLabel: 'us-west-2',
			cells: {
				lesser: { value: 'v1.4.10', drift: 'drifted' },
				host: { value: 'v0.4.5', drift: 'in-sync' },
				body: { value: 'v0.2.0', drift: 'drifted' },
			},
		},
		{
			id: 'r-lesser-scratch',
			label: 'lesser.scratch',
			subLabel: 'eu-central-1',
			cells: {
				lesser: { value: 'v1.4.12', drift: 'in-sync' },
				host: { value: 'v0.4.4', drift: 'drifted' },
				body: { value: 'unknown', drift: 'unknown' },
			},
		},
	]);

	let stackSortBy = $state<string | undefined>('lesser');
	let stackSortDirection = $state<StackMatrixSortDirection>('ascending');

	function handleStackSort(columnId: string) {
		if (stackSortBy === columnId) {
			stackSortDirection = stackSortDirection === 'ascending' ? 'descending' : 'ascending';
		} else {
			stackSortBy = columnId;
			stackSortDirection = 'ascending';
		}
		const direction = stackSortDirection === 'ascending' ? 1 : -1;
		stackRows = [...stackRows].sort((a, b) => {
			const av = a.cells[columnId]?.value ?? '';
			const bv = b.cells[columnId]?.value ?? '';
			return av.localeCompare(bv) * direction;
		});
	}
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

	<section>
		<h2>ProvisioningTimeline</h2>
		<ProvisioningTimeline
			label="lesser.example provisioning"
			steps={provisioningSteps}
			liveLogLabel="Live provisioning log"
		>
			{#snippet liveLog()}
				<pre>
15:00:00 [allocate] requesting compute node…
15:00:38 [allocate] node provisioned (1 × t3.medium)
15:00:38 [install] downloading Lesser v1.4.12 container…
15:01:50 [install] container started
15:01:51 [migrate] applying schema CSR-035…</pre>
			{/snippet}
		</ProvisioningTimeline>
	</section>

	<section>
		<h2>ReleaseTimeline</h2>
		<ReleaseTimeline label="Lesser release history" {releases} />
	</section>

	<section>
		<h2>StackMatrix</h2>
		<StackMatrix
			caption="Lesser fleet stack versions"
			columns={stackColumns}
			rows={stackRows}
			sortBy={stackSortBy}
			sortDirection={stackSortDirection}
			onsort={handleStackSort}
		>
			{#snippet rowActions(row)}
				<button type="button">Inspect {row.label}</button>
			{/snippet}
		</StackMatrix>
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
