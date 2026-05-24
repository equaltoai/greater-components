<!--
@component
SummaryStrip — labeled grouping region for related summary items (e.g. StatCards).

Renders a `<section aria-label="…">` containing children laid out in a
responsive CSS grid. The accessible name is required so screen-reader users
understand what set of stats the strip is summarizing.

@example
```svelte
<SummaryStrip label="Fleet summary" columns={4}>
	<StatCard label="Instances" value={42} />
	<StatCard label="Healthy" value={40} status="success" />
	<StatCard label="Warning" value={1} status="warning" />
	<StatCard label="Down" value={1} status="danger" />
</SummaryStrip>
```
-->
<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { SummaryStripColumns, SummaryStripGap } from '../types.js';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'aria-label'> {
		/** Required accessible name for the summary region. @public */
		label: string;

		/**
		 * Column count or `'auto'` (lets the grid wrap based on min width).
		 * @defaultValue 'auto'
		 * @public
		 */
		columns?: SummaryStripColumns;

		/**
		 * Spacing between items.
		 * @defaultValue 'md'
		 * @public
		 */
		gap?: SummaryStripGap;

		/** Additional CSS classes. @public */
		class?: string;

		/** Summary items. @public */
		children: Snippet;
	}

	let {
		label,
		columns = 'auto',
		gap = 'md',
		class: className = '',
		children,
		style: _style,
		...restProps
	}: Props = $props();

	const rootClass = $derived(() =>
		[
			'gr-shell-summary-strip',
			`gr-shell-summary-strip--gap-${gap}`,
			`gr-shell-summary-strip--columns-${columns}`,
			className,
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<section class={rootClass()} aria-label={label} {...restProps}>
	{@render children()}
</section>
