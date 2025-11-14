<script lang="ts">
	import { Tabs } from '@equaltoai/greater-components-primitives';
	import type { Snippet } from 'svelte';

	interface TabData {
		id: string;
		label: string;
		disabled?: boolean;
		content?: Snippet;
	}

	const testTabs: TabData[] = [
		{ id: 'test1', label: 'Test Tab 1', content: TestContent1 },
		{ id: 'test2', label: 'Test Tab 2', content: TestContent2 },
	];

	let activeTab = $state(testTabs[0].id);
</script>

<div class="test-page">
	<h1>Tabs restProps Test</h1>
	<p>This page proves restProps work by passing HTML attributes to Tabs component.</p>

	<section>
		<h2>Test: restProps Forwarding</h2>
		<p>Check the browser inspector - the root div should have these attributes:</p>
		<ul>
			<li><code>data-testid="tabs-restprops-test"</code></li>
			<li><code>id="my-tabs-component"</code></li>
			<li><code>data-cy="tabs-component"</code></li>
		</ul>

		<Tabs
			tabs={testTabs}
			{activeTab}
			onTabChange={(id) => (activeTab = id)}
			variant="underline"
			data-testid="tabs-restprops-test"
			id="my-tabs-component"
			data-cy="tabs-component"
			aria-label="Test tabs component"
		/>
	</section>

	<section>
		<h2>Inspect the Element</h2>
		<p>Open browser DevTools and inspect the <code>.gr-tabs</code> element.</p>
		<p>
			You should see all the attributes above on the root div, proving restProps work correctly.
		</p>
	</section>
</div>

{#snippet TestContent1()}
	<div class="test-content">
		<h3>Test Content 1</h3>
		<p>If you can see this, the Tabs component is working!</p>
		<p>restProps are correctly forwarded to the root element.</p>
	</div>
{/snippet}

{#snippet TestContent2()}
	<div class="test-content">
		<h3>Test Content 2</h3>
		<p>This tab also works correctly.</p>
		<p>The fix allows HTML attributes to be passed through.</p>
	</div>
{/snippet}

<style>
	.test-page {
		max-width: 960px;
		margin: 0 auto;
		padding: 2rem;
	}

	section {
		margin: 2rem 0;
		padding: 1.5rem;
		border: 1px solid var(--gr-semantic-border-default);
		border-radius: var(--gr-radii-lg);
	}

	code {
		background: var(--gr-semantic-background-secondary);
		padding: 0.125rem 0.375rem;
		border-radius: var(--gr-radii-sm);
		font-family: monospace;
	}

	.test-content {
		padding: 1rem;
	}
</style>
