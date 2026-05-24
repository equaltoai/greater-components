/**
 * @fileoverview Greater Host-Platform — hosted-platform data-display components.
 *
 * Strict-CSP safe, Svelte 5 runes, WCAG 2.1 AA. All styling consumes
 * stable `--gr-*` design tokens; additive `--gr-host-platform-*` token
 * defaults are scoped to component root classes. Status communication
 * is never color-only — icons + text are always paired with any color tint.
 *
 * Components:
 * - FleetCard         — composed instance / fleet card (status, metadata,
 *                       cost / activity slots, actions)
 * - CostGauge         — `role="meter"` cost / usage indicator with
 *                       thresholds + non-color-only status icon
 * - ActivitySparkline — inline SVG trend with explicit label / description
 *                       (or `decorative` mode when a textual equivalent
 *                       exists nearby)
 *
 * @version 0.1.0
 * @author Greater Contributors
 * @license AGPL-3.0-only
 * @public
 */

export type { ComponentProps } from 'svelte';

// Components
export { default as FleetCard } from './components/FleetCard.svelte';
export { default as CostGauge } from './components/CostGauge.svelte';
export { default as ActivitySparkline } from './components/ActivitySparkline.svelte';

// Utilities (dependency-free, strict-CSP-safe)
export { formatCost, formatCostGaugeText, computeRatio } from './utils/formatters.js';
export { buildSparklinePath } from './utils/sparkline.js';
export type { SparklinePathInput, SparklinePathOutput } from './utils/sparkline.js';

// Public type contracts
export type {
	FleetCardStatus,
	FleetCardVariant,
	FleetCardMetadataItem,
	CostGaugeStatus,
	CostGaugeThresholds,
	CostValueFormatter,
	ActivitySparklineTone,
} from './types.js';
