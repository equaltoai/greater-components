<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';

	const routes = [
		{
			title: 'Timeline experience',
			href: '/demo-suite/timeline',
			description: 'Virtualized feed, Compose dock, notifications rail, and persistence notes.',
		},
		{
			title: 'Profile surface',
			href: '/demo-suite/profile',
			description: 'ProfileHeader composition, tabbed feeds, and editable metadata.',
		},
		{
			title: 'Settings control panel',
			href: '/demo-suite/settings',
			description: 'Theme + density preferences plus notification + privacy stores.',
		},
		{
			title: 'Search surface',
			href: '/demo-suite/search',
			description: 'Semantic query handlers, result hydration, and recovery workflows.',
		},
	];

	const checklist = [
		'Usage guidance for @equaltoai/greater-components-fediverse, -primitives, and shared stores.',
		'Props/events tables for primary surface APIs plus snippets sourced from apps/playground.',
		'Accessibility scorecards covering aria landmarks, keyboard flows, and live regions.',
		'Performance callouts (virtualization, caching, Lighthouse targets) for each view.',
	];
</script>

<svelte:head>
	<title>Demo Suite Documentation - Greater Components</title>
	<meta
		name="description"
		content="Phase 5 demo-suite documentation hub. Links to timeline, profile, settings, and search coverage."
	/>
</svelte:head>

<DemoPage
	eyebrow="Demo Suite"
	title="Phase 4 application demos"
	description="Reference documentation for the full demo surfaces introduced in Phase 4. Each page covers API wiring, accessibility, performance guardrails, and testing hooks."
>
	<section>
		<h2>Routes</h2>
		<p>Every Phase 4 surface now has a dedicated doc route:</p>
		<ul>
			{#each routes as route (route.href)}
				<li>
					<strong><a href={route.href}>{route.title}</a></strong>
					<p>{route.description}</p>
				</li>
			{/each}
		</ul>
	</section>

	<section>
		<h2>What&apos;s covered</h2>
		<ul>
			{#each checklist as item, index (`${index}-${item}`)}
				<li>{item}</li>
			{/each}
		</ul>
	</section>

	<section>
		<h2>Validation workflow</h2>
		<p>Use the following commands from the workspace root to validate docs + demos:</p>
		<CodeExample
			language="bash"
			code={`pnpm --filter @equaltoai/greater-components/docs dev
pnpm --filter @equaltoai/playground dev
pnpm --filter @equaltoai/greater-components-testing test:demo`}
		/>
		<p>
			Lighthouse performance scores for <code>@equaltoai/playground</code> builds are tracked in
			<code>docs/planning/greater-alignment-log.md</code> along with bundle-size checkpoints.
		</p>
	</section>
</DemoPage>
