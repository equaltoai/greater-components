<!--
@component
CostGauge — accessible cost / usage indicator using `role="meter"`.

The component renders a `<div role="meter" aria-valuenow aria-valuemin
aria-valuemax aria-valuetext aria-labelledby>` with a visible fill bar
inside. ARIA meter semantics expose the current value, range, and an
accessible value-text for screen readers; the visual fill width is
driven by a strict-CSP-safe CSS custom property (`--gr-host-platform-cost-gauge-ratio`).
Status (`ok` / `warning` / `danger`) is communicated by an icon glyph
+ text label, never by color alone.

Auto-status: if `status` is omitted, the gauge derives one from the
ratio crossing optional thresholds (default `warning: 0.75`, `danger: 0.9`).

@example
```svelte
<CostGauge current={42.5} limit={100} currency="USD" label="Monthly spend" />
```
-->
<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { useStableId } from '@equaltoai/greater-components-utils';
	import type { CostGaugeStatus, CostGaugeThresholds, CostValueFormatter } from '../types.js';
	import { computeRatio, formatCost, formatCostGaugeText } from '../utils/formatters.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Required current value (e.g. spend so far). @public */
		current: number;

		/** Required maximum (limit / budget cap). @public */
		limit: number;

		/** Optional currency code (e.g. `'USD'`). @public */
		currency?: string;

		/**
		 * Optional visible / accessible label for the gauge. Strongly recommended.
		 * When omitted, the gauge falls back to `aria-label="Cost gauge"`.
		 * @public
		 */
		label?: string;

		/**
		 * Optional locale for value formatting. Defaults to `'en-US'`.
		 * @public
		 */
		locale?: string;

		/**
		 * Threshold ratios in `[0, 1]` for auto-status. Defaults to
		 * `{ warning: 0.75, danger: 0.9 }`.
		 * @public
		 */
		thresholds?: CostGaugeThresholds;

		/**
		 * Override the auto-derived status. When omitted, the gauge computes
		 * `ok` / `warning` / `danger` from the ratio + thresholds.
		 * @public
		 */
		status?: CostGaugeStatus;

		/**
		 * Override the value formatter. When omitted, `formatCost` (a thin
		 * `Intl.NumberFormat` wrapper) is used.
		 * @public
		 */
		formatValue?: CostValueFormatter;

		/** Optional description rendered below the gauge. @public */
		description?: string;

		/**
		 * When true, the visible label is hidden via `.gr-sr-only` (still
		 * announced). Default is `false`. The gauge always retains an
		 * accessible name regardless.
		 * @public
		 */
		labelHidden?: boolean;

		/** Additional CSS classes. @public */
		class?: string;

		/** Optional trailing slot (e.g. inline help button). @public */
		extra?: Snippet;
	}

	let {
		current,
		limit,
		currency,
		label,
		locale,
		thresholds,
		status,
		formatValue,
		description,
		labelHidden = false,
		class: className = '',
		extra,
		'aria-label': ariaLabelProp,
		style: _style,
		...restProps
	}: Props = $props();

	const stableId = useStableId('host-cost-gauge');
	const labelId = $derived(stableId.value ? `${stableId.value}-label` : undefined);
	const descriptionId = $derived(
		description && stableId.value ? `${stableId.value}-description` : undefined
	);
	// A hidden span carries the composed value text for the no-meter
	// fallback. Aria-labelledby (multi-id) composes the visible label and
	// this hidden text into a single accessible name. See the role="img"
	// branch in the template below.
	const valueTextId = $derived(stableId.value ? `${stableId.value}-valuetext` : undefined);

	const ratio = $derived(computeRatio(current, limit));
	const ratioPercent = $derived(Math.round(ratio * 1000) / 10);
	// Integer percent (0..100) used as a data-ratio attribute. CSS selectors
	// `[data-ratio="N"]` set the fill width to N% — strict-CSP-safe because
	// we never write an inline `style="..."` attribute.
	const ratioStep = $derived(Math.round(ratio * 100));

	const resolvedThresholds = $derived<Required<CostGaugeThresholds>>({
		warning: thresholds?.warning ?? 0.75,
		danger: thresholds?.danger ?? 0.9,
	});

	// Svelte 5: `$derived(expr)` takes an EXPRESSION whose value is reactive;
	// `$derived.by(fn)` takes a function that is RUN to produce the value.
	// Passing a function literal to `$derived(...)` makes the derived value
	// itself a function reference rather than the function's return value.
	// Use `.by` here -- previous form was typing `resolvedStatus` as
	// `() => CostGaugeStatus` and forcing every consumer site to call
	// `resolvedStatus()`, which `svelte-check` correctly rejected.
	const resolvedStatus = $derived.by<CostGaugeStatus>(() => {
		if (status) return status;
		if (ratio >= resolvedThresholds.danger) return 'danger';
		if (ratio >= resolvedThresholds.warning) return 'warning';
		return 'ok';
	});

	const statusInfo = $derived.by<{ icon: string; label: string }>(() => {
		const map: Record<CostGaugeStatus, { icon: string; label: string }> = {
			ok: { icon: '●', label: 'Within budget' },
			warning: { icon: '▲', label: 'Approaching limit' },
			danger: { icon: '■', label: 'Over budget' },
		};
		return map[resolvedStatus];
	});

	const formattedCurrent = $derived(
		formatValue ? formatValue(current, currency) : formatCost(current, currency, locale)
	);
	const formattedLimit = $derived(
		formatValue ? formatValue(limit, currency) : formatCost(limit, currency, locale)
	);
	const valueText = $derived(
		formatValue
			? `${formattedCurrent} of ${formattedLimit}`
			: formatCostGaugeText(current, limit, currency, locale)
	);

	const accessibleName = $derived(label ?? ariaLabelProp ?? 'Cost gauge');

	/*
	 * ARIA-meter contract enforcement (Arch PR #669 review):
	 *
	 * The W3C ARIA spec requires that for `role="meter"`:
	 *   1. `aria-valuemin < aria-valuemax` — a meter must have a valid range.
	 *   2. `aria-valuemin <= aria-valuenow <= aria-valuemax` — the current
	 *      value must lie within the range.
	 *
	 * The previous revision exposed raw `aria-valuemax={limit}` and
	 * `aria-valuenow={current}`, which violated both rules when:
	 *   - `current > limit` (over-budget) — valuenow exceeds valuemax.
	 *   - `limit <= 0` — invalid range (min === max or min > max).
	 *
	 * Strategy:
	 *   - When the consumer supplies a valid positive `limit`, render
	 *     `role="meter"` but clamp `aria-valuenow` into `[0, limit]`.
	 *     The visible / announced `aria-valuetext` (e.g. "$250.00 of $100.00")
	 *     still carries the precise raw numbers so AT users hear the
	 *     overrun.
	 *   - When `limit <= 0` or non-finite, the gauge no longer represents a
	 *     valid meter — fall back to `role="img"` with an `aria-label` that
	 *     composes the visible readout, and drop the meter-specific ARIA
	 *     value attributes entirely. The visual bar is still rendered (at
	 *     0% fill) so the surface stays recognizable.
	 */
	const meterContract = $derived.by<
		{ hasMeter: true; ariaValueMax: number; ariaValueNow: number } | { hasMeter: false }
	>(() => {
		if (!Number.isFinite(limit) || limit <= 0) {
			return { hasMeter: false };
		}
		// limit > 0 → valid range. Clamp valuenow to [0, limit].
		const valueNow = Number.isFinite(current) ? Math.max(0, Math.min(current, limit)) : 0;
		return { hasMeter: true, ariaValueMax: limit, ariaValueNow: valueNow };
	});

	const rootClass = $derived.by(() =>
		[
			'gr-host-platform-cost-gauge',
			`gr-host-platform-cost-gauge--status-${resolvedStatus}`,
			!meterContract.hasMeter && 'gr-host-platform-cost-gauge--no-meter',
			className,
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<div class={rootClass} {...restProps}>
	{#if label}
		<div
			class={['gr-host-platform-cost-gauge__label', labelHidden && 'gr-sr-only']
				.filter(Boolean)
				.join(' ')}
			id={labelId}
		>
			{label}
		</div>
	{/if}

	<div class="gr-host-platform-cost-gauge__body">
		{#if meterContract.hasMeter}
			<div
				class="gr-host-platform-cost-gauge__meter"
				role="meter"
				aria-valuemin={0}
				aria-valuemax={meterContract.ariaValueMax}
				aria-valuenow={meterContract.ariaValueNow}
				aria-valuetext={valueText}
				aria-labelledby={label ? labelId : undefined}
				aria-label={!label ? accessibleName : undefined}
				aria-describedby={descriptionId}
				data-ratio={ratioStep}
			>
				<div class="gr-host-platform-cost-gauge__fill" aria-hidden="true"></div>
			</div>
		{:else}
			<!--
				No valid meter range (limit <= 0 or non-finite). Render the
				bar as a labelled graphic instead of a meter — `role="img"`
				with a composed accessible name that includes the value
				readout, so AT users still get the current / limit values
				without violating the ARIA meter contract.

				When the consumer supplies a visible `label`, the accessible
				name is composed by `aria-labelledby` referencing BOTH the
				visible label and a visually-hidden span carrying the
				`valueText`. (ARIA precedence: when both `aria-labelledby`
				and `aria-label` are present, labelledby wins — so a single
				labelledby pointing only at the visible label would silently
				drop the value text. Multi-id IDREFs join the strings with
				a space, exposing "Monthly spend $10.00 of $0.00" to AT.)

				When no `label` is supplied, the composed name is carried
				by `aria-label` alone.
			-->
			<span class="gr-sr-only" id={valueTextId}>{valueText}</span>
			<div
				class="gr-host-platform-cost-gauge__meter"
				role="img"
				aria-labelledby={label && labelId && valueTextId ? `${labelId} ${valueTextId}` : undefined}
				aria-label={!label ? `${accessibleName}: ${valueText}` : undefined}
				aria-describedby={descriptionId}
				data-ratio={ratioStep}
				data-no-meter="true"
			>
				<div class="gr-host-platform-cost-gauge__fill" aria-hidden="true"></div>
			</div>
		{/if}

		<div class="gr-host-platform-cost-gauge__readout">
			<span class="gr-host-platform-cost-gauge__value">{formattedCurrent}</span>
			<span class="gr-host-platform-cost-gauge__separator" aria-hidden="true">/</span>
			<span class="gr-host-platform-cost-gauge__limit">{formattedLimit}</span>
			<span
				class="gr-host-platform-cost-gauge__status gr-host-platform-cost-gauge__status--{resolvedStatus}"
				role="status"
				aria-label={`Status: ${statusInfo.label}`}
			>
				<span class="gr-host-platform-cost-gauge__status-icon" aria-hidden="true">
					{statusInfo.icon}
				</span>
				<span class="gr-host-platform-cost-gauge__status-label">{statusInfo.label}</span>
			</span>
			{#if extra}
				<span class="gr-host-platform-cost-gauge__extra">{@render extra()}</span>
			{/if}
		</div>
	</div>

	{#if description}
		<p class="gr-host-platform-cost-gauge__description" id={descriptionId}>{description}</p>
	{/if}

	<span class="gr-sr-only" data-test="cost-gauge-percent">{ratioPercent}% of limit</span>
</div>
