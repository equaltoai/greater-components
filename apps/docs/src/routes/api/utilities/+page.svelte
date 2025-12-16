<script lang="ts">
	import CodeExample from '$lib/components/CodeExample.svelte';
</script>

<svelte:head>
	<title>Utilities API - Greater Components</title>
	<meta name="description" content="Utility functions exported by Greater Components." />
</svelte:head>

<article class="guide-page">
	<header>
		<p class="eyebrow">API Reference</p>
		<h1>Utilities</h1>
		<p class="lead">
			The <code>utils</code> package exports common helpers for formatting, sanitization, and general
			app utilities.
		</p>
	</header>

	<section>
		<h2 id="theme">Theme utilities</h2>
		<p>Use theme helpers to persist preferences and smooth transitions.</p>
	</section>

	<section>
		<h2>Example</h2>
		<CodeExample
			language="typescript"
			code={`import { formatRelativeTime, sanitizeHtml } from '@equaltoai/greater-components/utils';

formatRelativeTime(new Date());
sanitizeHtml('<b>hello</b>');`}
		/>
	</section>
</article>

