<!--
@component
BottomNav — mobile-first bottom navigation landmark.

Consumers provide real links or buttons and mark the current destination with
`aria-current="page"`. Direct children receive an equal-width 44px minimum
touch target from the shell stylesheet.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'aria-label'> {
		/** Accessible name for the navigation landmark. */
		label: string;
		/** Fix the navigation to the viewport bottom. @defaultValue true */
		fixed?: boolean;
		/** Additional CSS classes. */
		class?: string;
		/** Navigation links or buttons. */
		children: Snippet;
	}

	let {
		label,
		fixed = true,
		class: className = '',
		children,
		style: _style,
		...restProps
	}: Props = $props();

	const rootClass = $derived(
		['gr-shell-bottom-nav', fixed && 'gr-shell-bottom-nav--fixed', className]
			.filter(Boolean)
			.join(' ')
	);
</script>

<nav class={rootClass} aria-label={label} {...restProps}>
	{@render children()}
</nav>
