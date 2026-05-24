/**
 * @fileoverview Public type contracts for the Greater hosted-platform surface.
 *
 * @public
 */

/**
 * Fleet status — drives both the rendered icon/badge and the
 * `aria-label` text. Status communication is never color-only.
 */
export type FleetCardStatus =
	| 'healthy'
	| 'warning'
	| 'degraded'
	| 'offline'
	| 'provisioning'
	| 'unknown';

/** Visual variant for FleetCard. */
export type FleetCardVariant = 'default' | 'flat' | 'elevated';

/** A `{ key, value }` metadata row rendered inside FleetCard. */
export interface FleetCardMetadataItem {
	/** Visible label (e.g. "Region", "Version"). */
	key: string;
	/** Visible value (e.g. "us-east-1", "v1.4.12"). */
	value: string;
}

/** Cost-gauge status — drives icon + accessible name. */
export type CostGaugeStatus = 'ok' | 'warning' | 'danger';

/**
 * Threshold ratios in [0, 1] — when `current / limit` crosses these, the
 * gauge auto-elevates to warning / danger unless `status` is supplied.
 */
export interface CostGaugeThresholds {
	/** When the ratio reaches `warning`, status becomes `'warning'`. */
	warning?: number;
	/** When the ratio reaches `danger`, status becomes `'danger'`. */
	danger?: number;
}

/** Optional formatter for the displayed cost value. */
export type CostValueFormatter = (value: number, currency: string | undefined) => string;

/** Tone for the sparkline stroke. Non-color-only — accompany with `label`. */
export type ActivitySparklineTone = 'default' | 'success' | 'warning' | 'danger' | 'info';
