<!--
@component
Topbar — site/app `<header>` bar.

Renders a `<header class="gr-shell-topbar">`. When used as the topmost
landmark, it provides the implicit `banner` role.

Provides three optional layout slots — `start`, `center`, `end` — for left/
center/right alignment. If only `children` is provided, content fills the bar.

@example
```svelte
<Topbar variant="elevated">
	{#snippet start()}<strong>lesser-host</strong>{/snippet}
	{#snippet end()}<button>Sign out</button>{/snippet}
</Topbar>
```
-->
<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { TopbarVariant } from '../types.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		/**
		 * Visual variant.
		 * - `default` — light surface with bottom border
		 * - `flat` — no border / shadow
		 * - `elevated` — drop shadow
		 * @defaultValue 'default'
		 * @public
		 */
		variant?: TopbarVariant;

		/**
		 * Whether the topbar sticks to the top of its scroll container.
		 * @defaultValue false
		 * @public
		 */
		sticky?: boolean;

		/** Additional CSS classes. @public */
		class?: string;

		/** Start (leading) slot — typically logo / brand. @public */
		start?: Snippet;
		/** Center slot — typically a search bar or page indicator. @public */
		center?: Snippet;
		/** End (trailing) slot — typically actions / user menu. @public */
		end?: Snippet;
		/** Fallback content when start/center/end are not used. @public */
		children?: Snippet;
	}

	let {
		variant = 'default',
		sticky = false,
		class: className = '',
		start,
		center,
		end,
		children,
		style: _style,
		...restProps
	}: Props = $props();

	const rootClass = $derived(() =>
		[
			'gr-shell-topbar',
			`gr-shell-topbar--variant-${variant}`,
			sticky && 'gr-shell-topbar--sticky',
			className,
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<header class={rootClass()} {...restProps}>
	{#if start || center || end}
		<div class="gr-shell-topbar__region gr-shell-topbar__region--start">{@render start?.()}</div>
		<div class="gr-shell-topbar__region gr-shell-topbar__region--center">{@render center?.()}</div>
		<div class="gr-shell-topbar__region gr-shell-topbar__region--end">{@render end?.()}</div>
	{:else if children}
		<div class="gr-shell-topbar__region gr-shell-topbar__region--full">{@render children()}</div>
	{/if}
</header>
