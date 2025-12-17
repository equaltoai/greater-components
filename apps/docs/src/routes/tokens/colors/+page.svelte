<script lang="ts">
	import CodeExample from '$lib/components/CodeExample.svelte';
</script>

<svelte:head>
	<title>Color Tokens - Greater Components</title>
	<meta name="description" content="Color design tokens used by Greater Components." />
</svelte:head>

<article class="guide-page">
	<header>
		<p class="eyebrow">Design Tokens</p>
		<h1>Colors</h1>
		<p class="lead">
			Color tokens are exposed as CSS custom properties under the <code>--gr-color-*</code> and
			<code>--gr-semantic-*</code> namespaces.
		</p>
	</header>

	<section>
		<h2>Using color tokens</h2>
		<CodeExample
			language="css"
			code={`:global(:root) {
  --gr-color-primary-600: #2563eb;
  --gr-semantic-background-primary: var(--gr-color-gray-0);
}`}
		/>
	</section>

	<section>
		<h2>Related guides</h2>
		<ul>
			<li><a href="/guides/theming">Theming</a></li>
			<li><a href="/guides/dark-mode">Dark mode</a></li>
		</ul>
	</section>
</article>
