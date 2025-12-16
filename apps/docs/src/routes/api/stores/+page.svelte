<script lang="ts">
	import CodeExample from '$lib/components/CodeExample.svelte';
</script>

<svelte:head>
	<title>Stores API - Greater Components</title>
	<meta name="description" content="Reactive stores and state helpers exported by Greater Components." />
</svelte:head>

<article class="guide-page">
	<header>
		<p class="eyebrow">API Reference</p>
		<h1>Stores</h1>
		<p class="lead">
			For GraphQL-backed timelines and notifications, the adapters package exports reactive stores
			designed to work with Svelte reactivity.
		</p>
	</header>

	<section>
		<h2>Example</h2>
		<CodeExample
			language="typescript"
			code={`import { createTimelineStore } from '@equaltoai/greater-components/adapters';

const timeline = createTimelineStore({ adapter, timeline: { type: 'home' } });
timeline.subscribe((state) => console.log(state.items.length));
await timeline.refresh();`}
		/>
	</section>
</article>

