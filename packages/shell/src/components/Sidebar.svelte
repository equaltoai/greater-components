<!--
@component
Sidebar — semantic `<nav>` sidebar with an accessible name.

Renders a `<nav aria-label="…">` landmark. Consumers populate the children
snippet with real `<a>` (and/or `<button>`) elements; use `aria-current="page"`
on the active link to expose the current location to assistive technology.

Sidebar does NOT render its own list/wrapper around children — consumers can
use plain HTML or compose other Greater components inside.

@example
```svelte
<Sidebar label="Primary navigation">
	<a href="/overview" aria-current="page">Overview</a>
	<a href="/instances">Instances</a>
</Sidebar>
```
-->
<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { SidebarVariant, SidebarWidth } from '../types.js';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'aria-label'> {
		/**
		 * Required accessible name for the `<nav>` landmark.
		 * Used as `aria-label`. Should describe the navigation
		 * region (e.g. "Primary navigation", "Settings").
		 * @public
		 */
		label: string;

		/**
		 * Visual variant. `compact` shrinks the sidebar to icon width.
		 * @defaultValue 'full'
		 * @public
		 */
		variant?: SidebarVariant;

		/**
		 * Width preset. Inherits Shell's default token when nested.
		 * @defaultValue 'md'
		 * @public
		 */
		width?: SidebarWidth;

		/** Additional CSS classes. @public */
		class?: string;

		/** Header content rendered above the children. @public */
		header?: Snippet;

		/** Footer content rendered below the children. @public */
		footer?: Snippet;

		/** Navigation links / items. @public */
		children: Snippet;
	}

	let {
		label,
		variant = 'full',
		width = 'md',
		class: className = '',
		header,
		footer,
		children,
		style: _style,
		...restProps
	}: Props = $props();

	const rootClass = $derived(() =>
		[
			'gr-shell-sidebar',
			`gr-shell-sidebar--variant-${variant}`,
			`gr-shell-sidebar--width-${width}`,
			className,
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<nav class={rootClass()} aria-label={label} {...restProps}>
	{#if header}
		<div class="gr-shell-sidebar__header">{@render header()}</div>
	{/if}
	<div class="gr-shell-sidebar__body">{@render children()}</div>
	{#if footer}
		<div class="gr-shell-sidebar__footer">{@render footer()}</div>
	{/if}
</nav>
