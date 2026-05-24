<!--
@component
PageTitle — semantic page heading with optional eyebrow / subtitle / description / actions.

Renders an `<hN>` for the title (level 1 by default). When inside a Shell's
`<main>` landmark with no surrounding `<header>` in `<main>`, this is the
top-of-page heading.

@example
```svelte
<PageTitle
	title="Overview"
	eyebrow="Project 39"
	subtitle="Lesser-host fleet"
	description="Live release readiness across all instances."
>
	{#snippet actions()}<button>Refresh</button>{/snippet}
</PageTitle>
```
-->
<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { PageTitleLevel } from '../types.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** Required title text. @public */
		title: string;

		/** Optional eyebrow text (small label above the title). @public */
		eyebrow?: string;

		/** Optional subtitle text below the title. @public */
		subtitle?: string;

		/** Optional description paragraph below subtitle. @public */
		description?: string;

		/**
		 * Heading level for the title element.
		 * @defaultValue 1
		 * @public
		 */
		level?: PageTitleLevel;

		/** Additional CSS classes. @public */
		class?: string;

		/** Trailing action group, rendered to the right of the title. @public */
		actions?: Snippet;
	}

	let {
		title,
		eyebrow,
		subtitle,
		description,
		level = 1,
		class: className = '',
		actions,
		style: _style,
		...restProps
	}: Props = $props();

	const rootClass = $derived(() => ['gr-shell-page-title', className].filter(Boolean).join(' '));
</script>

<header class={rootClass()} {...restProps}>
	<div class="gr-shell-page-title__text">
		{#if eyebrow}
			<p class="gr-shell-page-title__eyebrow">{eyebrow}</p>
		{/if}
		{#if level === 1}
			<h1 class="gr-shell-page-title__heading">{title}</h1>
		{:else}
			<h2 class="gr-shell-page-title__heading">{title}</h2>
		{/if}
		{#if subtitle}
			<p class="gr-shell-page-title__subtitle">{subtitle}</p>
		{/if}
		{#if description}
			<p class="gr-shell-page-title__description">{description}</p>
		{/if}
	</div>
	{#if actions}
		<div class="gr-shell-page-title__actions" role="group">{@render actions()}</div>
	{/if}
</header>
