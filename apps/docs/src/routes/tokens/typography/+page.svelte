<script lang="ts">
	import CodeExample from '$lib/components/CodeExample.svelte';
</script>

<svelte:head>
	<title>Typography Tokens - Greater Components</title>
	<meta name="description" content="Typography design tokens used by Greater Components." />
</svelte:head>

<article class="guide-page">
	<header>
		<p class="eyebrow">Design Tokens</p>
		<h1>Typography</h1>
		<p class="lead">
			Typography tokens control font families, sizes, line heights, and weights via CSS variables
			under <code>--gr-typography-*</code>.
		</p>
	</header>

	<section>
		<h2>Override font family</h2>
		<CodeExample
			language="css"
			code={`:global(:root) {
  --gr-typography-fontFamily-sans: ui-sans-serif, system-ui, sans-serif;
}`}
		/>
	</section>
</article>

