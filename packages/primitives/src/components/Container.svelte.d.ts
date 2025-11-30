import type { HTMLAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';
/**
 * Container component props interface.
 *
 * @public
 */
interface Props extends HTMLAttributes<HTMLDivElement> {
	/**
	 * Maximum width constraint.
	 * - `sm`: 640px
	 * - `md`: 768px
	 * - `lg`: 1024px (default)
	 * - `xl`: 1280px
	 * - `2xl`: 1536px
	 * - `full`: 100% (no constraint)
	 *
	 * @defaultValue 'lg'
	 * @public
	 */
	maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
	/**
	 * Horizontal padding.
	 * - `false`: No padding
	 * - `true`: Default padding (1rem)
	 * - `sm`: 0.75rem
	 * - `md`: 1rem
	 * - `lg`: 1.5rem
	 *
	 * @defaultValue true
	 * @public
	 */
	padding?: boolean | 'sm' | 'md' | 'lg';
	/**
	 * Center content horizontally.
	 *
	 * @defaultValue true
	 * @public
	 */
	centered?: boolean;
	/**
	 * Additional CSS classes.
	 *
	 * @public
	 */
	class?: string;
	/**
	 * Content snippet.
	 *
	 * @public
	 */
	children?: Snippet;
}
/**
 * Container component - Max-width wrapper for content centering.
 *
 *
 * @example
 * ```svelte
 * <Container maxWidth="lg" padding="md" centered>
 * <h1>Page Title</h1>
 * <p>Page content...</p>
 * </Container>
 * ```
 */
declare const Container: import('svelte').Component<Props, {}, ''>;
type Container = ReturnType<typeof Container>;
export default Container;
//# sourceMappingURL=Container.svelte.d.ts.map
