<!--
Link component - Semantic anchor primitive for in-app navigation with SPA-router
integration and full browser link affordances.

@component
@example In-app SPA navigation with modifier-key-gated callback
```svelte
<Link
  href={`/portal/instances/${slug}/budgets`}
  variant="ghost"
  onnavigate={(ev, href) => { ev.preventDefault(); navigate(href); }}
>
  Budgets
</Link>
```

@example External link in a new tab (rel auto-injected)
```svelte
<Link href="https://docs.example.com" target="_blank" variant="default">
  Documentation
</Link>
```

@example Inline link inside body text
```svelte
<Text size="sm">
  See the <Link href={`/portal/instances/${slug}/usage`} variant="inline">Usage</Link> page.
</Text>
```
-->

<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	/**
	 * Link component props interface.
	 *
	 * @public
	 */
	interface Props extends Omit<HTMLAnchorAttributes, 'href'> {
		/**
		 * Target URL. Required — this is what makes it a Link and not a Button.
		 *
		 * @public
		 */
		href: string;

		/**
		 * Visual variant of the link.
		 * - `default`: Primary nav-link affordance (outline-Button visual weight, no
		 *   literal border). Use for top-level navigation surfaces where the user
		 *   needs a clear "this navigates" cue.
		 * - `ghost`: Subdued nav link with no background. Use inside cards, tables,
		 *   or other surfaces that already provide their own visual frame.
		 * - `subtle`: Muted secondary link. Use for breadcrumbs, footer-level nav,
		 *   or other low-emphasis destinations.
		 * - `inline`: Underlined link for use inside body text. Inherits font size
		 *   and family from the surrounding text.
		 *
		 * @defaultValue 'default'
		 * @public
		 */
		variant?: 'default' | 'ghost' | 'subtle' | 'inline';

		/**
		 * Size affecting padding and font size. Ignored when `variant="inline"`
		 * (inline links inherit from surrounding text).
		 *
		 * @defaultValue 'md'
		 * @public
		 */
		size?: 'sm' | 'md' | 'lg';

		/**
		 * Called on unmodified left-click only:
		 * - `button === 0` (left-click; excludes middle and right-click)
		 * - No `metaKey` / `ctrlKey` / `shiftKey` / `altKey` modifier
		 * - `ev.defaultPrevented === false`
		 *
		 * Consumers use this callback to intercept the navigation for SPA routing
		 * while letting modifier-key clicks fall through to native browser behavior
		 * (open in new tab / window, copy link address). The same gating predicate
		 * applies to keyboard Enter activation (browser-native click on `<a href>`).
		 *
		 * To intercept and route via your SPA router:
		 * ```ts
		 * onnavigate={(ev, href) => {
		 *   ev.preventDefault();
		 *   router.navigate(href);
		 * }}
		 * ```
		 *
		 * @public
		 */
		onnavigate?: (ev: MouseEvent, href: string) => void;

		/**
		 * Link content. Required.
		 *
		 * @public
		 */
		children: Snippet;

		/**
		 * Additional CSS classes.
		 *
		 * @public
		 */
		class?: string;
	}

	let {
		href,
		variant = 'default',
		size = 'md',
		onnavigate,
		children,
		class: className = '',
		target,
		rel,
		onclick,
		style: _style,
		...restProps
	}: Props = $props();

	// Compute rel attribute. Auto-inject 'noopener noreferrer' when target='_blank'
	// and no consumer-supplied rel. Mirrors Card.svelte:155-160 precedent.
	const computedRel = $derived.by(() => {
		if (rel) return rel;
		if (target === '_blank') return 'noopener noreferrer';
		return undefined;
	});

	// Compose CSS classes. Size is ignored for inline (inherits surrounding text).
	const linkClass = $derived.by(() => {
		const classes = ['gr-link', `gr-link--${variant}`];
		if (variant !== 'inline') {
			classes.push(`gr-link--size-${size}`);
		}
		if (className) {
			classes.push(className);
		}
		return classes.join(' ');
	});

	// Click handler with modifier-key gating. Fires onnavigate only on plain
	// unmodified left-click; all other inputs (Cmd/Ctrl/Shift/Alt, middle-click,
	// right-click, defaultPrevented) fall through to native browser behavior.
	function handleClick(event: MouseEvent) {
		// Forward consumer-supplied onclick first so they can preventDefault
		// or perform their own work before our gating logic runs.
		onclick?.(event as MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement });

		if (event.defaultPrevented) return;
		if (event.button !== 0) return; // middle (1) or right (2) click
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

		onnavigate?.(event, href);
	}
</script>

<a class={linkClass} {href} {target} rel={computedRel} onclick={handleClick} {...restProps}>
	{@render children()}
</a>
