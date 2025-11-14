<script lang="ts">
	import ComponentDoc from '$lib/components/ComponentDoc.svelte';
	import Tabs from '@equaltoai/greater-components-primitives/components/Tabs.svelte';

	const props = [
		{
			name: 'tabs',
			type: 'Array<{ id: string; label: string; disabled?: boolean; content?: Snippet }>',
			required: true,
			description: 'Tab metadata + optional snippet for the associated panel content.',
		},
		{
			name: 'activeTab',
			type: 'string',
			description: 'Controlled active tab id; defaults to the first tab when omitted.',
		},
		{
			name: 'orientation',
			type: "'horizontal' | 'vertical'",
			default: "'horizontal'",
			description: 'Controls keyboard navigation (ArrowRight/Left vs ArrowUp/Down).',
		},
		{
			name: 'activation',
			type: "'automatic' | 'manual'",
			default: "'automatic'",
			description: 'Automatic selects tabs on focus; manual waits until Enter/Space is pressed.',
		},
		{
			name: 'variant',
			type: "'default' | 'pills' | 'underline'",
			default: "'default'",
			description: 'Styling treatment used across docs + playground demos.',
		},
		{
			name: 'onTabChange',
			type: '(tabId: string) => void',
			description: 'Callback invoked whenever a new tab becomes active.',
		},
	];

	const horizontalTabs = [
		{ id: 'overview', label: 'Overview', content: OverviewTab },
		{ id: 'details', label: 'Details', content: DetailsTab },
		{ id: 'accessibility', label: 'Accessibility', content: AccessibilityTab },
	] as const;

	const verticalTabs = [
		{ id: 'posts', label: 'Posts', content: PostsTab },
		{ id: 'replies', label: 'Replies', content: RepliesTab },
		{ id: 'likes', label: 'Likes', disabled: true, content: LikesTab },
	] as const;

	const examples = [
		{
			title: 'Horizontal tabs',
			description: 'Automatic activation + underline variant (used on profile and docs pages).',
			component: Tabs,
			props: { tabs: horizontalTabs, variant: 'underline' },
			code: `<Tabs
  tabs={[
    { id: 'overview', label: 'Overview', content: OverviewTab },
    { id: 'details', label: 'Details', content: DetailsTab }
  ]}
  variant="underline"
/>`,
		},
		{
			title: 'Manual vertical tabs',
			description: 'Manual activation keeps content static until Enter/Space is pressed.',
			component: Tabs,
			props: { tabs: verticalTabs, orientation: 'vertical', activation: 'manual' },
			code: `<Tabs
  tabs={[
    { id: 'posts', label: 'Posts', content: PostsTab },
    { id: 'replies', label: 'Replies', content: RepliesTab },
    { id: 'likes', label: 'Likes', disabled: true, content: LikesTab }
  ]}
  orientation="vertical"
  activation="manual"
/>`,
		},
	];

	const accessibility = {
		wcagLevel: 'AA',
		keyboardNav: true,
		screenReader: true,
		colorContrast: true,
		focusManagement: true,
		ariaSupport: true,
		reducedMotion: true,
		notes: [
			'Renders role="tablist" + role="tab" with aria-controls/aria-selected attributes.',
			'Roving tabindex ensures a single focusable tab at a time for predictable keyboard flows.',
			'Disabled tabs are removed from the tab stop order and include aria-disabled="true".',
		],
		axeScore: 100,
	};
</script>

<svelte:head>
	<title>Tabs Component - Greater Components</title>
	<meta
		name="description"
		content="ARIA-compliant tabs with automatic or manual activation, orientation support, and slot-based panel content."
	/>
</svelte:head>

<ComponentDoc
	name="Tabs"
	description="Fully accessible tabs primitive built on Svelte 5 runes."
	status="beta"
	version="0.4.0"
	importPath="@equaltoai/greater-components-primitives"
	{props}
	{examples}
	{accessibility}
>
	<svelte:fragment slot="do">
		<li>Keep tab labels concise (two words or fewer).</li>
		<li>Use manual activation when panels contain heavy renders.</li>
		<li>Provide snippet content so panels mount lazily.</li>
	</svelte:fragment>

	<svelte:fragment slot="dont">
		<li>Don&apos;t mix vertical orientation with underline variant (pills work better).</li>
		<li>Avoid disabling a tab without providing alternative navigation.</li>
		<li>Don&apos;t render multiple tablists on the page without unique headings.</li>
	</svelte:fragment>
</ComponentDoc>

{#snippet OverviewTab()}
	<div class="tab-panel">
		<p><strong>Overview</strong></p>
		<p>High-level description of the component state.</p>
	</div>
{/snippet}

{#snippet DetailsTab()}
	<div class="tab-panel">
		<p><strong>Details</strong></p>
		<p>Mention density, handlers, or API usage.</p>
	</div>
{/snippet}

{#snippet AccessibilityTab()}
	<div class="tab-panel">
		<p><strong>Accessibility</strong></p>
		<p>Tabs ship with roving tabindex + aria attributes by default.</p>
	</div>
{/snippet}

{#snippet PostsTab()}
	<div class="tab-panel">
		<p>Latest posts with comfortable density.</p>
	</div>
{/snippet}

{#snippet RepliesTab()}
	<div class="tab-panel">
		<p>Reply timeline showing conversation depth.</p>
	</div>
{/snippet}

{#snippet LikesTab()}
	<div class="tab-panel">
		<p>Favorites appear here when enabled.</p>
	</div>
{/snippet}

<style>
	.tab-panel {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
