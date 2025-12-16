<script lang="ts">
	import CodeExample from '$lib/components/CodeExample.svelte';
</script>

<svelte:head>
	<title>TypeScript Guide - Greater Components</title>
	<meta
		name="description"
		content="TypeScript configuration and type-safe usage patterns for Greater Components."
	/>
</svelte:head>

<article class="guide-page">
	<header>
		<p class="eyebrow">Guide</p>
		<h1>TypeScript</h1>
		<p class="lead">
			Greater Components ships TypeScript types for components, utilities, and adapters. Use modern
			bundler module resolution and import types alongside values.
		</p>
	</header>

	<section>
		<h2>Recommended tsconfig</h2>
		<CodeExample
			language="json"
			title="tsconfig.json"
			code={`{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["svelte"]
  }
}`}
		/>
	</section>

	<section>
		<h2>Type imports</h2>
		<CodeExample
			language="typescript"
			code={`import { Button, type ButtonProps } from '@equaltoai/greater-components/primitives';
import type { ThemeConfig } from '@equaltoai/greater-components/tokens';`}
		/>
	</section>
</article>

