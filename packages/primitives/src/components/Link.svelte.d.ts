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
/**
 * Link component - Semantic anchor primitive for in-app navigation with SPA-router
 * integration and full browser link affordances.
 *
 *
 * @example In-app SPA navigation with modifier-key-gated callback
 * ```svelte
 * <Link
 * href={`/portal/instances/${slug}/budgets`}
 * variant="ghost"
 * onnavigate={(ev, href) => { ev.preventDefault(); navigate(href); }}
 * >
 * Budgets
 * </Link>
 * ```
 *
 * @example External link in a new tab (rel auto-injected)
 * ```svelte
 * <Link href="https://docs.example.com" target="_blank" variant="default">
 * Documentation
 * </Link>
 * ```
 *
 * @example Inline link inside body text
 * ```svelte
 * <Text size="sm">
 * See the <Link href={`/portal/instances/${slug}/usage`} variant="inline">Usage</Link> page.
 * </Text>
 * ```
 */
declare const Link: import('svelte').Component<Props, {}, ''>;
type Link = ReturnType<typeof Link>;
export default Link;
//# sourceMappingURL=Link.svelte.d.ts.map
