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
	];

	const verticalTabs = [
		{ id: 'posts', label: 'Posts', content: PostsTab },
		{ id: 'replies', label: 'Replies', content: RepliesTab },
		{ id: 'likes', label: 'Likes', disabled: true, content: LikesTab },
	];

	const examplesMeta = [
		{
			title: 'Horizontal tabs',
			description: 'Automatic activation + underline variant (used on profile and docs pages).',
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
		wcagLevel: 'AA' as const,
		keyboardNav: true,
		screenReader: true,
		colorContrast: true,
		focusManagement: true,
		ariaSupport: true,
		reducedMotion: true,
		notes: [
			'Tab navigation follows WAI-ARIA Tabs pattern.',
			'Arrow keys move focus between tabs.',
			'Home/End jump to first/last tab.',
		],
		axeScore: 100,
	};
</script>

<svelte:head>
	<title>Tabs Component - Greater Components</title>
	<meta
		name="description"
		content="Fully accessible tabs primitive built on Svelte 5 runes. Supports horizontal/vertical orientation and automatic/manual activation."
	/>
</svelte:head>

<ComponentDoc
	name="Tabs"
	description="Fully accessible tabs primitive built on Svelte 5 runes."
	status="beta"
	version="0.4.0"
	importPath="@equaltoai/greater-components/primitives"
	{props}
	{examplesMeta}
	{accessibility}
>
	{#snippet examples(index)}
		{#if index === 0}
			<Tabs tabs={horizontalTabs} variant="underline" />
		{:else if index === 1}
			<Tabs tabs={verticalTabs} orientation="vertical" activation="manual" />
		{/if}
	{/snippet}

	{#snippet doGuidelines()}
		<li>Keep tab labels concise (two words or fewer).</li>
		<li>Use manual activation when panels contain heavy renders.</li>
		<li>Provide snippet content so panels mount lazily.</li>
	{/snippet}

	{#snippet dontGuidelines()}
		<li>Don&apos;t mix vertical orientation with underline variant (pills work better).</li>
		<li>Avoid disabling a tab without providing alternative navigation.</li>
		<li>Don&apos;t render multiple tablists on the page without unique headings.</li>
	{/snippet}
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
