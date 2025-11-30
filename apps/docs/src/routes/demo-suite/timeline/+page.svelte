<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	import EventsTable from '$lib/components/EventsTable.svelte';
	import AccessibilityScorecard from '$lib/components/AccessibilityScorecard.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';

	const timelineProps = [
		{
			name: 'items',
			type: 'Status[]',
			required: true,
			description:
				'Ordered list of timeline items; supports composed drafts merged with hydrated results.',
		},
		{
			name: 'density',
			type: "'comfortable' | 'compact'",
			default: "'comfortable'",
			description: 'Controls card spacing + typography; wired to the preferences modal.',
		},
		{
			name: 'actionHandlers',
			type: 'StatusActionHandlers',
			description: 'Callback bag for reply/boost/favorite actions surfaced in StatusCard.',
		},
		{
			name: 'loadingBottom',
			type: 'boolean',
			default: 'false',
			description: 'Shows inline skeletons while `timeline.loadMore()` resolves.',
		},
	];

	const controllerOptions = [
		{
			name: 'seeds',
			type: 'TimelineSeed',
			required: true,
			description: 'Static dataset cloned per filter to guarantee deterministic hydration.',
		},
		{
			name: 'generator',
			type: '(filter: TimelineFilter, page: number, size: number) => Status[]',
			required: true,
			description:
				'Mock ActivityPub batch generator used for prefetch + infinite scroll simulations.',
		},
		{
			name: 'pageSize',
			type: 'number',
			default: '5',
			description: 'Controls both the hydrated chunk size and load-more increments.',
		},
		{
			name: 'prefetchTarget',
			type: 'number',
			default: 'pageSize * 2',
			description: 'Minimum queue depth maintained per filter to avoid scroll jank.',
		},
		{
			name: 'delayMs',
			type: 'number',
			default: '360',
			description: 'Adds artificial network latency for demo realism and skeleton coverage.',
		},
	];

	const actionEvents = [
		{
			name: 'onReply',
			payload: 'Status',
			description: 'Queues optimistic compose-to-thread behavior for the selected status.',
		},
		{
			name: 'onBoost',
			payload: 'Status',
			description: 'Logs boosts in the action rail and triggers moderation hints.',
		},
		{
			name: 'onFavorite',
			payload: 'Status',
			description: 'Updates the action log + `aria-live` region for assistive tech feedback.',
		},
	];

	const packages = [
		{
			name: '@equaltoai/greater-components-social',
			detail: 'TimelineVirtualized, StatusCard, Compose compound, notification mocks.',
		},
		{
			name: '@equaltoai/greater-components-primitives',
			detail: 'Button, Switch, Modal, Avatar, and density controls.',
		},
		{
			name: '@equaltoai/greater-components-icons',
			detail: 'Sidebar glyphs (Home/Globe/Hash/Settings) with semantic titles.',
		},
		{
			name: '@equaltoai/greater-components-testing',
			detail: 'Playwright coverage in packages/testing/tests/demo/timeline.spec.ts',
		},
	];

	const snippet = `<script lang="ts">
  import { TimelineVirtualized, StatusCard } from '@equaltoai/greater-components-social';
  import { createTimelineController } from '$lib/stores/timelineStore';
  import { createTimelineSeeds, generateTimelineBatch } from '$lib/data/fediverse';

  const timeline = createTimelineController({
    seeds: createTimelineSeeds(),
    generator: generateTimelineBatch,
    pageSize: 4,
    prefetchTarget: 8
  });

  const timelineItems = $derived([...drafts, ...$timeline.items]);
  const handlers = {
    onReply: (status) => log('Reply', status.account.acct),
    onBoost: (status) => log('Boost', status.account.acct),
    onFavorite: (status) => log('Favorite', status.account.acct)
  };
</${'script'}>

<section aria-label="Timeline demo">
  <header>
    <p class="section-eyebrow">Timeline</p>
    <h2>{($timeline.viewDescription)}</h2>
  </header>
  <TimelineVirtualized
    {timelineItems}
    density={preferences.density}
    actionHandlers={handlers}
    loadingBottom={$timeline.loading}
  />
</section>`;

	const accessibility = {
		wcagLevel: 'AA' as const,
		keyboardNav: true,
		screenReader: true,
		colorContrast: true,
		focusManagement: true,
		ariaSupport: true,
		reducedMotion: true,
		notes: [
			'Sidebar filter buttons use aria-pressed to announce selection.',
			'Compose dock + action log use aria-live="polite" so updates are narrated.',
			'Preferences modal traps focus and restores to the triggering control.',
			'Notifications + pinned rails expose aria-labels for quick navigation.',
		],
		axeScore: 100,
	};

	const performanceTips = [
		'Virtualization keeps DOM nodes under 30 even when the store prefetches 100+ statuses.',
		'Prefetch queues hydrate on idle and re-hydrate when filters repeat to showcase cache hits.',
		'Load-more button disables during fetch to avoid duplicate requests; streaming toggle pauses background work.',
		'Lighthouse 98/100/100/100 on the production playground build (see docs/planning/greater-alignment-log.md).',
	];

	const testingLinks = [
		{
			label: 'packages/testing/tests/demo/timeline.spec.ts',
			detail:
				'Playwright assertions for filter aria-pressed state, density controls, and streaming toggles.',
		},
		{
			label: 'apps/playground/src/lib/stores/timelineStore.test.ts',
			detail: 'Unit tests covering hydration, loadMore queuing, and error simulation.',
		},
		{
			label: 'packages/fediverse/tests/timelineStore.test.ts',
			detail: 'TimelineStore prepend/append coverage for transport + pagination APIs.',
		},
	];
</script>

<svelte:head>
	<title>Timeline Demo Documentation - Greater Components</title>
	<meta
		name="description"
		content="Props, handlers, accessibility, and performance notes for the Phase 4 timeline demo."
	/>
</svelte:head>

<DemoPage
	eyebrow="Demo Suite"
	title="Timeline application"
	description="Nav rail + Compose dock powering the Phase 4 timeline demo at /timeline. Combines @equaltoai/greater-components-social with playground-only stores for draft hydration."
>
	<section>
		<h2>Packages</h2>
		<ul>
			{#each packages as pkg (pkg.name)}
				<li>
					<strong><code>{pkg.name}</code></strong>
					<p>{pkg.detail}</p>
				</li>
			{/each}
		</ul>
		<p>
			The implementation lives in <code>apps/playground/src/routes/timeline/+page.svelte</code> and
			wires the shared timeline store (<code>$lib/stores/timelineStore.ts</code>) into
			`TimelineVirtualized`.
		</p>
	</section>

	<section>
		<h2>TimelineVirtualized props</h2>
		<PropsTable props={timelineProps} />
	</section>

	<section>
		<h2>Timeline controller options</h2>
		<PropsTable props={controllerOptions} />
	</section>

	<section>
		<h2>Status action handlers</h2>
		<EventsTable events={actionEvents} />
	</section>

	<section>
		<h2>Usage snippet</h2>
		<CodeExample language="svelte" code={snippet} />
	</section>

	<section>
		<h2>Accessibility</h2>
		<AccessibilityScorecard {...accessibility} />
	</section>

	<section>
		<h2>Performance &amp; deployment notes</h2>
		<ul>
			{#each performanceTips as tip, index (`${index}-${tip}`)}
				<li>{tip}</li>
			{/each}
		</ul>
		<p>
			Run <code>pnpm --filter @equaltoai/playground build</code> followed by
			<code>pnpm --filter @equaltoai/playground preview</code> before capturing Lighthouse metrics.
		</p>
	</section>

	<section>
		<h2>Testing &amp; monitoring</h2>
		<ul>
			{#each testingLinks as link (link.label)}
				<li>
					<code>{link.label}</code> — {link.detail}
				</li>
			{/each}
		</ul>
	</section>
</DemoPage>
