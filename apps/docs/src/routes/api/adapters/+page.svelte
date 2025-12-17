<script lang="ts">
	import CodeExample from '$lib/components/CodeExample.svelte';
</script>

<svelte:head>
	<title>Adapters API - Greater Components</title>
	<meta
		name="description"
		content="Transport, GraphQL adapter, and mappers for Lesser integration."
	/>
</svelte:head>

<article class="guide-page">
	<header>
		<p class="eyebrow">API Reference</p>
		<h1>Adapters</h1>
		<p class="lead">
			The adapters package provides the Lesser GraphQL adapter plus transport primitives, reactive
			stores, and payload mappers.
		</p>
	</header>

	<section>
		<h2>LesserGraphQLAdapter</h2>
		<CodeExample
			language="typescript"
			code={`import { LesserGraphQLAdapter } from '@equaltoai/greater-components/adapters';

const adapter = new LesserGraphQLAdapter({
  httpEndpoint: 'https://your-instance.social/graphql',
  wsEndpoint: 'wss://your-instance.social/graphql',
  token: 'your-token',
});`}
		/>
	</section>
</article>
