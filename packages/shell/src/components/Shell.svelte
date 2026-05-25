<!--
@component
Shell — root grid layout combining sidebar, topbar, and main content area.

The Shell component renders structural landmarks for an app layout:
- The `topbar` snippet is wrapped in a `<header>`-equivalent area (consumer
  should slot in `<Topbar>`, which itself renders `<header>` to provide the
  banner landmark).
- The `sidebar` snippet sits beside the main content (consumer should slot
  in `<Sidebar>`, which renders a `<nav>` landmark with an accessible name).
- The main content is wrapped in a single `<main>` landmark.

Strict-CSP safe: no inline styles, no event handlers set at module evaluation,
no browser globals at module evaluation time.

@example
```svelte
<Shell mainLabel="Dashboard">
	{#snippet topbar()}<Topbar>…</Topbar>{/snippet}
	{#snippet sidebar()}<Sidebar label="Primary">…</Sidebar>{/snippet}
	<PageFrame>…</PageFrame>
</Shell>
```
-->
<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { ShellSidebarPlacement, SidebarWidth } from '../types.js';

	/**
	 * Shell component props.
	 * @public
	 */
	interface Props extends HTMLAttributes<HTMLDivElement> {
		/**
		 * Accessible name for the `<main>` landmark. Strongly recommended
		 * for screen-reader users when multiple Shell instances or main
		 * landmarks exist in the page.
		 * @public
		 */
		mainLabel?: string;

		/**
		 * Placement of the sidebar relative to the main content.
		 * @defaultValue 'left'
		 * @public
		 */
		sidebarPlacement?: ShellSidebarPlacement;

		/**
		 * Width preset for the sidebar slot.
		 * Maps to `--gr-shell-sidebar-width-*` tokens.
		 * @defaultValue 'md'
		 * @public
		 */
		sidebarWidth?: SidebarWidth;

		/**
		 * Whether the sidebar slot is rendered. When false, the slot
		 * content is omitted and the grid collapses to a single column.
		 * @defaultValue true
		 * @public
		 */
		showSidebar?: boolean;

		/**
		 * Whether the topbar slot is rendered.
		 * @defaultValue true
		 * @public
		 */
		showTopbar?: boolean;

		/**
		 * Whether the shell occupies the full viewport height.
		 * @defaultValue true
		 * @public
		 */
		fullHeight?: boolean;

		/** Additional CSS classes. @public */
		class?: string;

		/** Topbar slot (typically a `<Topbar>` component). @public */
		topbar?: Snippet;

		/** Sidebar slot (typically a `<Sidebar>` component). @public */
		sidebar?: Snippet;

		/** Main content. @public */
		children?: Snippet;
	}

	let {
		mainLabel,
		sidebarPlacement = 'left',
		sidebarWidth = 'md',
		showSidebar = true,
		showTopbar = true,
		fullHeight = true,
		class: className = '',
		topbar,
		sidebar,
		children,
		style: _style,
		...restProps
	}: Props = $props();

	const hasSidebar = $derived(showSidebar && !!sidebar);
	const hasTopbar = $derived(showTopbar && !!topbar);

	const rootClass = $derived(() =>
		[
			'gr-shell',
			`gr-shell--sidebar-${sidebarPlacement}`,
			`gr-shell--sidebar-width-${sidebarWidth}`,
			hasSidebar && 'gr-shell--has-sidebar',
			hasTopbar && 'gr-shell--has-topbar',
			fullHeight && 'gr-shell--full-height',
			className,
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<div class={rootClass()} {...restProps}>
	{#if hasTopbar}
		<div class="gr-shell__topbar">{@render topbar?.()}</div>
	{/if}
	{#if hasSidebar}
		<div class="gr-shell__sidebar">{@render sidebar?.()}</div>
	{/if}
	<main class="gr-shell__main" aria-label={mainLabel ?? undefined}>
		{@render children?.()}
	</main>
</div>
