<!--
@component
Panel — content container with semantic header / body / footer regions.

Renders a `<section>` landmark. When `title` is provided, an `<hN>` heading
is generated and linked via `aria-labelledby` for screen-reader users. When
no title is provided but `aria-label` is, the panel still has an accessible
name.

@example
```svelte
<Panel title="Fleet status" headerLevel={2}>
	<p>Status content…</p>
	{#snippet actions()}<button>Refresh</button>{/snippet}
	{#snippet footer()}<small>Updated 5m ago</small>{/snippet}
</Panel>
```
-->
<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { useStableId } from '@equaltoai/greater-components-utils';
	import type { PanelPadding, PanelVariant } from '../types.js';

	// SSR/hydration-safe stable id per component instance.
	// With IdProvider: deterministic counter-based id during SSR + hydration.
	// Without IdProvider: id is assigned onMount (avoids hydration mismatches).
	const stableId = useStableId('shell-panel');

	interface Props extends HTMLAttributes<HTMLElement> {
		/**
		 * Optional visible title. Rendered as `<hN>` inside the panel header
		 * and linked to the section via `aria-labelledby`.
		 * @public
		 */
		title?: string;

		/**
		 * Heading level for the generated title.
		 * @defaultValue 2
		 * @public
		 */
		headerLevel?: 1 | 2 | 3 | 4 | 5 | 6;

		/**
		 * Visual variant.
		 * @defaultValue 'default'
		 * @public
		 */
		variant?: PanelVariant;

		/**
		 * Body padding preset.
		 * @defaultValue 'md'
		 * @public
		 */
		padding?: PanelPadding;

		/** Additional CSS classes. @public */
		class?: string;

		/**
		 * Replaces the default header. When supplied along with `title`,
		 * the title is still rendered for accessibility and the snippet
		 * content is rendered alongside.
		 * @public
		 */
		header?: Snippet;

		/** Trailing actions slot, rendered to the right of the title. @public */
		actions?: Snippet;

		/** Footer slot, rendered below the body. @public */
		footer?: Snippet;

		/** Body content. @public */
		children?: Snippet;
	}

	let {
		title,
		headerLevel = 2,
		variant = 'default',
		padding = 'md',
		class: className = '',
		header,
		actions,
		footer,
		children,
		'aria-labelledby': ariaLabelledby,
		'aria-label': ariaLabel,
		style: _style,
		...restProps
	}: Props = $props();

	const generatedTitleId = $derived(
		title && stableId.value ? `${stableId.value}-title` : undefined
	);
	const resolvedLabelledby = $derived(ariaLabelledby ?? generatedTitleId);

	const rootClass = $derived(() =>
		[
			'gr-shell-panel',
			`gr-shell-panel--variant-${variant}`,
			`gr-shell-panel--padding-${padding}`,
			className,
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<section
	class={rootClass()}
	aria-labelledby={resolvedLabelledby}
	aria-label={!resolvedLabelledby ? ariaLabel : undefined}
	{...restProps}
>
	{#if title || header || actions}
		<div class="gr-shell-panel__header">
			<div class="gr-shell-panel__heading">
				{#if title}
					{#if headerLevel === 1}
						<h1 id={generatedTitleId} class="gr-shell-panel__title">{title}</h1>
					{:else if headerLevel === 2}
						<h2 id={generatedTitleId} class="gr-shell-panel__title">{title}</h2>
					{:else if headerLevel === 3}
						<h3 id={generatedTitleId} class="gr-shell-panel__title">{title}</h3>
					{:else if headerLevel === 4}
						<h4 id={generatedTitleId} class="gr-shell-panel__title">{title}</h4>
					{:else if headerLevel === 5}
						<h5 id={generatedTitleId} class="gr-shell-panel__title">{title}</h5>
					{:else}
						<h6 id={generatedTitleId} class="gr-shell-panel__title">{title}</h6>
					{/if}
				{/if}
				{@render header?.()}
			</div>
			{#if actions}
				<div class="gr-shell-panel__actions" role="group">{@render actions()}</div>
			{/if}
		</div>
	{/if}
	<div class="gr-shell-panel__body">{@render children?.()}</div>
	{#if footer}
		<div class="gr-shell-panel__footer">{@render footer()}</div>
	{/if}
</section>
