<!--
@component
ActivitySparkline — inline SVG trend visualization.

Renders an `<svg>` with one `<path>` describing the data series. The
component never sets inline `style` attributes on any element; all
sizing happens via CSS and the inherited `width` / `height` attributes
on the `<svg>` (which are HTML attributes, not CSS, and therefore not
flagged by strict CSP scans).

Accessibility:
- When `decorative === false` (the default), the SVG is informative —
  it MUST have an accessible name. The component renders it as
  `<svg role="img" aria-labelledby aria-describedby>` with a real
  `<title>` (and optional `<desc>`) child. If no `label` is provided,
  the component falls back to `'Activity trend'` so the SVG always has
  a name.
- When `decorative === true`, the SVG is aria-hidden and the consumer
  is expected to provide a textual equivalent nearby (e.g. inside a
  FleetCard metadata row).

Empty state:
- `data` length zero renders the empty-state DIV with the supplied
  `emptyMessage` and `aria-label` on the wrapper (no zero-length
  `<path>` is emitted).

@example
```svelte
<ActivitySparkline data={[3, 8, 5, 12, 9, 14, 10]} label="Posts per hour" />
```
-->
<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { useStableId } from '@equaltoai/greater-components-utils';
	import type { ActivitySparklineTone } from '../types.js';
	import { buildSparklinePath } from '../utils/sparkline.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'aria-label'> {
		/** Required data series. Empty array renders the empty state. @public */
		data: number[];

		/**
		 * Accessible name for the SVG. Required when `decorative === false`
		 * (the default). When omitted, falls back to `'Activity trend'`.
		 * @public
		 */
		label?: string;

		/**
		 * Optional accessible description rendered as `<desc>` inside the SVG.
		 * @public
		 */
		description?: string;

		/**
		 * When true, the SVG is rendered with `aria-hidden="true"` and no
		 * `<title>` / `<desc>`. Use this only when a textual equivalent
		 * exists immediately adjacent (e.g. a metadata row stating the value
		 * trend). Default `false`.
		 * @public
		 */
		decorative?: boolean;

		/** Visual tone for the stroke (paired with `label` text — never color-only). @public */
		tone?: ActivitySparklineTone;

		/**
		 * SVG viewBox width. Defaults to 100. Consumers size the rendered
		 * sparkline via CSS (e.g. `width: 100%` on the wrapper).
		 * @public
		 */
		width?: number;

		/** SVG viewBox height. Defaults to 28. @public */
		height?: number;

		/**
		 * Optional explicit value-range bounds. When omitted, the data min/max
		 * is used (with a 1-unit floor so a constant series renders centered).
		 * @public
		 */
		min?: number;
		max?: number;

		/** Message rendered when `data.length === 0`. @public */
		emptyMessage?: string;

		/** Additional CSS classes on the wrapper. @public */
		class?: string;
	}

	let {
		data,
		label,
		description,
		decorative = false,
		tone = 'default',
		width = 100,
		height = 28,
		min,
		max,
		emptyMessage = 'No activity yet',
		class: className = '',
		style: _style,
		...restProps
	}: Props = $props();

	const stableId = useStableId('host-activity-sparkline');
	const titleId = $derived(stableId.value ? `${stableId.value}-title` : undefined);
	const descriptionId = $derived(
		description && stableId.value ? `${stableId.value}-desc` : undefined
	);

	const accessibleName = $derived(label ?? 'Activity trend');

	const hasData = $derived(data.length > 0);

	const path = $derived.by(() => {
		if (!hasData) return null;
		return buildSparklinePath({ data, width, height, padding: 2, min, max });
	});

	const rootClass = $derived(() =>
		[
			'gr-host-platform-activity-sparkline',
			`gr-host-platform-activity-sparkline--tone-${tone}`,
			!hasData && 'gr-host-platform-activity-sparkline--empty',
			className,
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<div class={rootClass()} {...restProps}>
	{#if !hasData}
		<div
			class="gr-host-platform-activity-sparkline__empty"
			role="status"
			aria-label={decorative ? undefined : accessibleName}
		>
			{emptyMessage}
		</div>
	{:else if decorative}
		<svg
			class="gr-host-platform-activity-sparkline__svg"
			viewBox={`0 0 ${width} ${height}`}
			{width}
			{height}
			aria-hidden="true"
			focusable="false"
		>
			<path
				class="gr-host-platform-activity-sparkline__path"
				d={path!.path}
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else}
		<svg
			class="gr-host-platform-activity-sparkline__svg"
			viewBox={`0 0 ${width} ${height}`}
			{width}
			{height}
			role="img"
			aria-labelledby={titleId}
			aria-describedby={descriptionId}
			focusable="false"
		>
			<title id={titleId}>{accessibleName}</title>
			{#if description}
				<desc id={descriptionId}>{description}</desc>
			{/if}
			<path
				class="gr-host-platform-activity-sparkline__path"
				d={path!.path}
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{/if}
</div>
