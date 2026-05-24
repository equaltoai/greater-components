<!--
Shell-package playground demo.

Exercises every component shipped by `@equaltoai/greater-components-shell`:
Shell, Sidebar, Topbar, Panel, StatCard, SummaryStrip, PageFrame, PageTitle,
Breadcrumb, Callout.

Renders inside SvelteKit SSR with strict-CSP. No inline event handlers, no
inline styles set by components, only stable `--gr-*` and additive
`--gr-shell-*` tokens for theming.
-->
<script lang="ts">
	import {
		Shell,
		Sidebar,
		Topbar,
		Panel,
		StatCard,
		SummaryStrip,
		PageFrame,
		PageTitle,
		Breadcrumb,
		Callout,
	} from '@equaltoai/greater-components-shell';
	import '@equaltoai/greater-components-shell/shell.css';

	let activeRoute = $state<'overview' | 'instances' | 'billing'>('overview');
	let calloutOpen = $state(true);

	function navigate(route: typeof activeRoute) {
		activeRoute = route;
	}

	const breadcrumbsByRoute = {
		overview: [{ label: 'Dashboard', href: '#' }, { label: 'Overview' }],
		instances: [
			{ label: 'Dashboard', href: '#' },
			{ label: 'Instances', href: '#' },
			{ label: 'lesser.example' },
		],
		billing: [{ label: 'Dashboard', href: '#' }, { label: 'Billing' }],
	} as const;
</script>

<svelte:head>
	<title>Shell components — Greater Components Playground</title>
</svelte:head>

<Shell mainLabel="Shell components demo">
	{#snippet topbar()}
		<Topbar variant="elevated" sticky>
			{#snippet start()}<strong>lesser-host</strong>{/snippet}
			{#snippet center()}<span class="topbar-status">Live</span>{/snippet}
			{#snippet end()}<button type="button">Sign out</button>{/snippet}
		</Topbar>
	{/snippet}

	{#snippet sidebar()}
		<Sidebar label="Primary navigation">
			{#snippet header()}<strong>Greater Demo</strong>{/snippet}
			<button
				type="button"
				aria-pressed={activeRoute === 'overview'}
				onclick={() => navigate('overview')}
			>
				Overview
			</button>
			<button
				type="button"
				aria-pressed={activeRoute === 'instances'}
				onclick={() => navigate('instances')}
			>
				Instances
			</button>
			<button
				type="button"
				aria-pressed={activeRoute === 'billing'}
				onclick={() => navigate('billing')}
			>
				Billing
			</button>
			{#snippet footer()}<small>v0.9.0</small>{/snippet}
		</Sidebar>
	{/snippet}

	<PageFrame width="wide">
		{#snippet header()}
			<Breadcrumb items={[...breadcrumbsByRoute[activeRoute]]} />
			<PageTitle
				title={activeRoute === 'overview'
					? 'Fleet overview'
					: activeRoute === 'instances'
						? 'lesser.example'
						: 'Billing'}
				eyebrow="Project 39"
				subtitle="lesser-host fleet"
				description="Live release readiness across all instances."
			>
				{#snippet actions()}<button type="button">Refresh</button>{/snippet}
			</PageTitle>
		{/snippet}

		<SummaryStrip label="Fleet summary" columns={4} gap="md">
			<StatCard label="Instances" value={42} description="Across all regions" />
			<StatCard
				label="Healthy"
				value={40}
				status="success"
				trend={{ direction: 'up', label: '+1 this week' }}
			/>
			<StatCard label="Warning" value={1} status="warning" />
			<StatCard
				label="Down"
				value={1}
				status="danger"
				trend={{ direction: 'down', label: '−1 since yesterday' }}
			/>
		</SummaryStrip>

		{#if calloutOpen}
			<Callout
				tone="warning"
				title="Provisioning incomplete"
				dismissible
				ondismiss={() => (calloutOpen = false)}
			>
				One instance has not finished provisioning yet.
				{#snippet actions()}<button type="button">Retry</button>{/snippet}
			</Callout>
		{/if}

		<Panel title="Recent activity" headerLevel={2}>
			{#snippet actions()}<button type="button">View all</button>{/snippet}
			<ul>
				<li>02:14 — instance <strong>lesser.example</strong> finished provisioning.</li>
				<li>02:09 — billing cycle closed for tenant <em>acme</em>.</li>
				<li>01:55 — soul alias <em>ops@lessersoul.ai</em> registered.</li>
			</ul>
			{#snippet footer()}<small>Updated 5 minutes ago</small>{/snippet}
		</Panel>

		<Panel title="Notes" variant="flat" padding="none">
			<p>
				Panels render as <code>&lt;section&gt;</code> landmarks with auto
				<code>aria-labelledby</code> when a title is set, so screen-reader users hear the panel name alongside
				its contents.
			</p>
		</Panel>
	</PageFrame>
</Shell>

<style>
	.topbar-status {
		font-size: 0.875rem;
		color: var(--gr-semantic-foreground-secondary, #374151);
	}
</style>
