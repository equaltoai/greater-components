<script lang="ts">
	import CodeExample from '$lib/components/CodeExample.svelte';
</script>

<svelte:head>
	<title>Accessibility Guide - Greater Components</title>
	<meta
		name="description"
		content="Accessibility best practices and built-in WCAG support in Greater Components."
	/>
</svelte:head>

<article class="guide-page">
	<header>
		<p class="eyebrow">Guide</p>
		<h1>Accessibility</h1>
		<p class="lead">
			Greater Components is designed to be accessible by default. Components ship with keyboard
			navigation, ARIA attributes, and sensible focus management.
		</p>
	</header>

	<section>
		<h2>Keyboard navigation</h2>
		<p>
			Interactive components (menus, modals, tabs) include keyboard behavior out of the box. Verify
			that your app wiring doesn’t break focus order and that clickable wrappers include appropriate
			labels.
		</p>
	</section>

	<section>
		<h2>Testing with axe</h2>
		<p>
			Use the testing helpers package to run accessibility checks in component tests.
		</p>
		<CodeExample
			language="typescript"
			code={`import { test, expect } from 'vitest';
import { render, axe } from '@equaltoai/greater-components/testing';
import { Button } from '@equaltoai/greater-components/primitives';

test('button has no a11y violations', async () => {
  const { container } = render(Button, { props: { variant: 'solid' } });
  await expect(await axe(container)).toHaveNoViolations();
});`}
		/>
	</section>
</article>

