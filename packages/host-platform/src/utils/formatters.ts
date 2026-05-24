/**
 * @fileoverview Strict-CSP-safe number / currency formatters for hosted-platform components.
 *
 * Uses the standard `Intl.NumberFormat` API which is available in every
 * supported runtime and does not require `unsafe-eval`. Formatter
 * instances are cached per (locale, currency) tuple to avoid re-creating
 * them on every render.
 *
 * @public
 */

const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(currency: string | undefined, locale?: string): Intl.NumberFormat {
	const resolvedLocale = locale ?? 'en-US';
	const key = `${resolvedLocale}|${currency ?? ''}`;
	const cached = formatterCache.get(key);
	if (cached) return cached;
	const options: Intl.NumberFormatOptions = currency
		? { style: 'currency', currency, maximumFractionDigits: 2 }
		: { style: 'decimal', maximumFractionDigits: 2 };
	const formatter = new Intl.NumberFormat(resolvedLocale, options);
	formatterCache.set(key, formatter);
	return formatter;
}

/**
 * Format a numeric value as a currency string (or a decimal when no
 * currency is supplied).
 *
 * - Numbers are rendered with at most 2 fractional digits.
 * - `NaN`, `±Infinity`, and `null`/`undefined` render as `'—'` (em dash)
 *   so consumer empty / loading states have a stable visible placeholder.
 *
 * @public
 */
export function formatCost(
	value: number | null | undefined,
	currency?: string,
	locale?: string
): string {
	if (value === null || value === undefined) return '—';
	if (!Number.isFinite(value)) return '—';
	return getFormatter(currency, locale).format(value);
}

/**
 * Format the textual equivalent for a cost gauge — typically used as
 * `aria-valuetext` and visible label.
 *
 * Example: `formatCostGaugeText(42.5, 100, 'USD') === '$42.50 of $100.00'`
 *
 * @public
 */
export function formatCostGaugeText(
	current: number,
	limit: number,
	currency?: string,
	locale?: string
): string {
	return `${formatCost(current, currency, locale)} of ${formatCost(limit, currency, locale)}`;
}

/**
 * Compute the percentage usage ratio in [0, 1], clamped.
 *
 * Returns `0` when `limit <= 0` or either input is non-finite, so
 * downstream rendering never produces invalid `aria-valuenow` /
 * width values.
 *
 * @public
 */
export function computeRatio(current: number, limit: number): number {
	if (!Number.isFinite(current) || !Number.isFinite(limit) || limit <= 0) return 0;
	if (current <= 0) return 0;
	const ratio = current / limit;
	if (ratio < 0) return 0;
	if (ratio > 1) return 1;
	return ratio;
}
