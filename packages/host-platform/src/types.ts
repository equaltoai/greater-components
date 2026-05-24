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

/* ============================================================================
 * G3 — Operator timelines and stack matrix
 * ==========================================================================*/

/**
 * Status of a single step in a `ProvisioningTimeline`.
 *
 * Drives both the rendered icon glyph (●/◌/✓/⚠/—) and the accessible label;
 * status is never communicated by color alone.
 *
 * @public
 */
export type ProvisioningStepStatus = 'pending' | 'active' | 'success' | 'failure' | 'skipped';

/**
 * A single step in a `ProvisioningTimeline`.
 *
 * @public
 */
export interface ProvisioningStep {
	/** Stable id; used for the DOM list-item id and as the row key. */
	id: string;
	/** Visible primary label (e.g. "Allocate compute"). */
	label: string;
	/** Optional supporting description rendered below the label. */
	description?: string;
	/** Status — drives icon + text. Defaults to `'pending'` when omitted. */
	status?: ProvisioningStepStatus;
	/** Optional ISO timestamp string rendered as the step's time anchor. */
	timestamp?: string;
	/** Optional short metadata (e.g. job duration, region). */
	meta?: string;
}

/**
 * ARIA politeness for the constrained live-log region. `'off'` disables
 * announcements; the visible log still renders.
 *
 * @public
 */
export type ProvisioningLogPoliteness = 'off' | 'polite' | 'assertive';

/**
 * Two-channel release timeline release channel.
 *
 * Conventionally `'stable'` and `'beta'`, but consumers may use any strings
 * (e.g. `'stable'` vs `'rc'`). The `ReleaseTimeline` groups items by channel
 * and presents them as two visually-distinct streams.
 *
 * @public
 */
export type ReleaseChannel = string;

/**
 * Status of a release. Drives icon + accessible label.
 *
 * @public
 */
export type ReleaseStatus = 'shipped' | 'in-progress' | 'rolled-back' | 'planned';

/**
 * A single release entry rendered by `ReleaseTimeline`.
 *
 * @public
 */
export interface ReleaseTimelineItem {
	/** Stable id; used for the DOM list-item id and as the row key. */
	id: string;
	/** Version label (e.g. `'v1.4.12'`). */
	version: string;
	/** Channel this release belongs to (e.g. `'stable'`). */
	channel: ReleaseChannel;
	/** Date of the release. May be a `Date` or an ISO string. */
	date: Date | string;
	/** Status — drives icon + text. Defaults to `'shipped'` when omitted. */
	status?: ReleaseStatus;
	/**
	 * Adoption metric: a number in `[0, 1]` (a ratio) or a free-form string
	 * (e.g. `'42 of 100 instances'`). When numeric, the component formats
	 * it as a percentage and exposes an accessible value-text.
	 */
	adoption?: number | string;
	/** Optional secondary description. */
	description?: string;
	/** Optional changelog / release-notes URL. */
	href?: string;
}

/**
 * Formatter for a release's adoption metric. Receives the raw `adoption`
 * (number in [0,1] or string) and returns a visible string. When omitted,
 * numeric adoption is formatted as `XX%`.
 *
 * @public
 */
export type ReleaseAdoptionFormatter = (
	adoption: number | string | undefined
) => string | undefined;

/**
 * Drift state of a stack-matrix cell, paired with an icon glyph + text label
 * so the indicator is never color-only.
 *
 * @public
 */
export type StackMatrixDrift = 'in-sync' | 'pending' | 'drifted' | 'unknown';

/**
 * Column definition for `StackMatrix`.
 *
 * @public
 */
export interface StackMatrixColumn {
	/** Stable id used as the lookup key into each row's `cells` map. */
	id: string;
	/** Visible column header. */
	label: string;
	/** When true, the header renders as a sort-trigger `<button>` and
	 *  `aria-sort` reflects the current sort state. */
	sortable?: boolean;
}

/**
 * A single cell in a `StackMatrix` row. Either a string (rendered as text)
 * or a structured value with drift status.
 *
 * @public
 */
export interface StackMatrixCell {
	/** Visible cell value (e.g. `'v1.4.12'`). */
	value: string;
	/** Drift state — drives icon + accessible label. */
	drift?: StackMatrixDrift;
	/**
	 * Optional accessible description override. When omitted, the cell's
	 * accessible content is `value` + (` (drift state)` if drift !== `'in-sync'`).
	 */
	description?: string;
}

/**
 * A row in `StackMatrix`. The `cells` map keys MUST match column ids.
 *
 * @public
 */
export interface StackMatrixRow {
	/** Stable id used for the DOM row id and as the row key. */
	id: string;
	/** Row header label rendered in the first cell with `<th scope="row">`. */
	label: string;
	/** Optional secondary row header (e.g. region). */
	subLabel?: string;
	/** Map of column id → cell. */
	cells: Record<string, StackMatrixCell>;
}

/** Sort direction state used by `StackMatrix`. */
export type StackMatrixSortDirection = 'ascending' | 'descending' | 'none';
