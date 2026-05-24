<!--
@component
StatCard — metric display card with label, value, optional trend, description, icon.

The root element has `role="group"` and is labelled by its label/value so
screen readers announce the stat coherently. Use `valueLabel` to override
the default announcement (e.g. for unit text).

@example
```svelte
<StatCard
	label="Active instances"
	value={42}
	trend={{ direction: 'up', label: '+8 this week' }}
	status="success"
/>
```
-->
<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { StatCardStatus, StatCardTrend } from '../types.js';

	let nextStatId = 0;
	function statId() {
		nextStatId += 1;
		return `gr-shell-statcard-${nextStatId}`;
	}

	// Single stable base ID per component instance; derived IDs build off it.
	const baseId = statId();

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Required visible label describing the metric. @public */
		label: string;

		/** Required metric value. @public */
		value: string | number;

		/**
		 * Optional accessible override for the value announcement, e.g.
		 * `"42 active instances"`. When omitted, the visible value is
		 * used directly.
		 * @public
		 */
		valueLabel?: string;

		/** Optional trend indicator. @public */
		trend?: StatCardTrend;

		/** Optional supporting description, rendered below the value. @public */
		description?: string;

		/**
		 * Status / tone. Drives both visual variant and the implicit
		 * connotation (e.g. `'danger'` cards are styled with a red accent).
		 * @defaultValue 'default'
		 * @public
		 */
		status?: StatCardStatus;

		/** Additional CSS classes. @public */
		class?: string;

		/** Optional leading icon snippet (rendered with `aria-hidden`). @public */
		icon?: Snippet;
	}

	let {
		label,
		value,
		valueLabel,
		trend,
		description,
		status = 'default',
		class: className = '',
		icon,
		'aria-label': ariaLabel,
		style: _style,
		...restProps
	}: Props = $props();

	const labelId = `${baseId}-label`;
	const valueId = `${baseId}-value`;
	const descriptionId = $derived(description ? `${baseId}-description` : undefined);
	const trendId = $derived(trend ? `${baseId}-trend` : undefined);

	const rootClass = $derived(() =>
		['gr-shell-statcard', `gr-shell-statcard--status-${status}`, className]
			.filter(Boolean)
			.join(' ')
	);

	const trendClass = $derived.by(() => {
		const t = trend;
		return t ? `gr-shell-statcard__trend gr-shell-statcard__trend--${t.direction}` : undefined;
	});

	const labelledby = $derived.by(() => {
		const parts = [labelId, valueId];
		if (trendId) parts.push(trendId);
		if (descriptionId) parts.push(descriptionId);
		return parts.join(' ');
	});
</script>

<div
	class={rootClass()}
	role="group"
	aria-labelledby={ariaLabel ? undefined : labelledby}
	aria-label={ariaLabel}
	{...restProps}
>
	{#if icon}
		<div class="gr-shell-statcard__icon" aria-hidden="true">{@render icon()}</div>
	{/if}
	<div class="gr-shell-statcard__body">
		<p class="gr-shell-statcard__label" id={labelId}>{label}</p>
		<p class="gr-shell-statcard__value" id={valueId} aria-label={valueLabel ?? undefined}>
			{value}
		</p>
		{#if trend}
			<p class={trendClass} id={trendId}>
				<span class="gr-shell-statcard__trend-icon" aria-hidden="true">
					{#if trend.direction === 'up'}
						↑
					{:else if trend.direction === 'down'}
						↓
					{:else}
						→
					{/if}
				</span>
				<span class="gr-shell-statcard__trend-label">{trend.label}</span>
			</p>
		{/if}
		{#if description}
			<p class="gr-shell-statcard__description" id={descriptionId}>{description}</p>
		{/if}
	</div>
</div>
