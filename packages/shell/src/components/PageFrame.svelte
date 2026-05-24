<!--
@component
PageFrame — single-page wrapper with optional aside / header / footer.

PageFrame is a content-region helper that sits INSIDE Shell's `<main>`
landmark. It is intentionally NOT a landmark itself; it only provides
visual layout (max-width centering, optional aside column, header/footer).

@example
```svelte
<PageFrame width="default">
	{#snippet header()}<PageTitle title="Overview" />{/snippet}
	<Panel title="Fleet status">…</Panel>
</PageFrame>
```
-->
<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { PageFrameAsidePlacement, PageFrameWidth } from '../types.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/**
		 * Max-width preset.
		 * - `narrow` — 48rem
		 * - `default` — 72rem
		 * - `wide` — 96rem
		 * - `full` — no max width
		 * @defaultValue 'default'
		 * @public
		 */
		width?: PageFrameWidth;

		/**
		 * Side of the aside slot relative to the main content.
		 * @defaultValue 'right'
		 * @public
		 */
		asidePlacement?: PageFrameAsidePlacement;

		/**
		 * Accessible label for the aside region (used as `aria-label` on
		 * the `<aside>` element when the aside snippet is rendered).
		 * Required when `aside` is provided.
		 * @public
		 */
		asideLabel?: string;

		/** Additional CSS classes. @public */
		class?: string;

		/** Header content rendered above the main content. @public */
		header?: Snippet;

		/** Footer content rendered below the main content. @public */
		footer?: Snippet;

		/** Aside content (e.g. contextual filters / metadata). @public */
		aside?: Snippet;

		/** Main page content. @public */
		children: Snippet;
	}

	let {
		width = 'default',
		asidePlacement = 'right',
		asideLabel,
		class: className = '',
		header,
		footer,
		aside,
		children,
		style: _style,
		...restProps
	}: Props = $props();

	const hasAside = $derived(!!aside);

	const rootClass = $derived(() =>
		[
			'gr-shell-page-frame',
			`gr-shell-page-frame--width-${width}`,
			hasAside && `gr-shell-page-frame--aside-${asidePlacement}`,
			className,
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<div class={rootClass()} {...restProps}>
	{#if header}
		<header class="gr-shell-page-frame__header">{@render header()}</header>
	{/if}

	<div class="gr-shell-page-frame__layout">
		<div class="gr-shell-page-frame__content">{@render children()}</div>
		{#if hasAside}
			<aside class="gr-shell-page-frame__aside" aria-label={asideLabel ?? undefined}>
				{@render aside?.()}
			</aside>
		{/if}
	</div>

	{#if footer}
		<footer class="gr-shell-page-frame__footer">{@render footer()}</footer>
	{/if}
</div>
