<script lang="ts">
	import CodeExample from '$lib/components/CodeExample.svelte';
</script>

<svelte:head>
	<title>Spacing Tokens - Greater Components</title>
	<meta name="description" content="Spacing design tokens used by Greater Components." />
</svelte:head>

<article class="guide-page">
	<header>
		<p class="eyebrow">Design Tokens</p>
		<h1>Spacing</h1>
		<p class="lead">
			Spacing tokens define the scale used for margins, padding, gaps, and layout rhythms via CSS
			variables under <code>--gr-spacing-*</code>.
		</p>
	</header>

	<section>
		<h2>Override spacing</h2>
		<CodeExample
			language="css"
			code={`:global(:root) {
  --gr-spacing-scale-4: 1rem;
  --gr-spacing-scale-6: 1.5rem;
}`}
		/>
	</section>
</article>

