import type { HTMLAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';
/**
 * Heading component props interface.
 *
 * @public
 */
interface Props extends HTMLAttributes<HTMLHeadingElement> {
	/**
	 * Semantic heading level (required for accessibility).
	 * Maps to <h1> through <h6> elements.
	 *
	 * @required
	 * @public
	 */
	level: 1 | 2 | 3 | 4 | 5 | 6;
	/**
	 * Visual size (can differ from semantic level).
	 * - `xs`: 0.75rem
	 * - `sm`: 0.875rem
	 * - `base`: 1rem
	 * - `lg`: 1.125rem
	 * - `xl`: 1.25rem
	 * - `2xl`: 1.5rem
	 * - `3xl`: 1.875rem
	 * - `4xl`: 2.25rem
	 * - `5xl`: 3rem
	 *
	 * @defaultValue Maps to level (h1=5xl, h2=4xl, h3=3xl, h4=2xl, h5=xl, h6=lg)
	 * @public
	 */
	size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
	/**
	 * Font weight.
	 * - `normal`: 400
	 * - `medium`: 500
	 * - `semibold`: 600
	 * - `bold`: 700 (default for headings)
	 *
	 * @defaultValue 'bold'
	 * @public
	 */
	weight?: 'normal' | 'medium' | 'semibold' | 'bold';
	/**
	 * Text alignment.
	 *
	 * @defaultValue 'left'
	 * @public
	 */
	align?: 'left' | 'center' | 'right';
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
 * Heading component - Semantic heading with consistent typography.
 *
 *
 * @example
 * ```svelte
 * <Heading level={1} align="center">Page Title</Heading>
 * ```
 */
declare const Heading: import('svelte').Component<Props, {}, ''>;
type Heading = ReturnType<typeof Heading>;
export default Heading;
//# sourceMappingURL=Heading.svelte.d.ts.map
