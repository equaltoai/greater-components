<script lang="ts">
	import CodeExample from '$lib/components/CodeExample.svelte';
</script>

<svelte:head>
	<title>Animation Tokens - Greater Components</title>
	<meta name="description" content="Animation and motion tokens used by Greater Components." />
</svelte:head>

<article class="guide-page">
	<header>
		<p class="eyebrow">Design Tokens</p>
		<h1>Animations</h1>
		<p class="lead">
			Animation tokens expose durations and easing curves under <code>--gr-motion-*</code>.
		</p>
	</header>

	<section>
		<h2>Using motion tokens</h2>
		<CodeExample
			language="css"
			code={`.my-element {
  transition: opacity var(--gr-motion-duration-fast) var(--gr-motion-easing-out);
}`}
		/>
	</section>
</article>
