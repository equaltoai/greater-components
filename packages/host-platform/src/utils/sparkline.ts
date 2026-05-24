/**
 * @fileoverview Pure data → SVG-path utility for ActivitySparkline.
 *
 * No DOM access, no module-level browser globals, deterministic output
 * for a given input. Used both inside ActivitySparkline and exported so
 * consumers can unit-test sparkline shapes independent of the component.
 *
 * @public
 */

/**
 * Inputs:
 * - `data`: array of numeric samples (length >= 1). Empty / undefined
 *   input is the caller's responsibility (component renders the empty
 *   state).
 * - `width` / `height`: viewBox dimensions for the SVG. Sparklines never
 *   set explicit pixel sizes via inline styles — the consumer sizes via
 *   CSS / class.
 * - `padding`: optional padding (in viewBox units) so the stroke doesn't
 *   clip at the edges. Defaults to half a stroke width on each side.
 * - `min` / `max`: override the auto-computed value range. When omitted,
 *   the function uses the data min/max with a 1-unit floor on the range
 *   so a constant series still renders a horizontal line at the y
 *   midpoint.
 */
export interface SparklinePathInput {
	data: number[];
	width: number;
	height: number;
	padding?: number;
	min?: number;
	max?: number;
}

export interface SparklinePathOutput {
	/** Full SVG `d` attribute for `<path>`. */
	path: string;
	/** Last (x, y) point in viewBox coordinates — useful for an end-dot. */
	last: { x: number; y: number };
	/** Computed value range that was used. */
	range: { min: number; max: number };
}

/**
 * Build the SVG path for a sparkline from a numeric series.
 *
 * Deterministic: same input → same output. No floating-point drift
 * caused by Date / Math.random / locale; pure arithmetic.
 *
 * @public
 */
export function buildSparklinePath(input: SparklinePathInput): SparklinePathOutput {
	const { data, width, height } = input;
	if (data.length === 0) {
		// Defensive — callers should not invoke with an empty series, but
		// returning a no-op path is safer than throwing inside a render.
		return { path: '', last: { x: 0, y: height / 2 }, range: { min: 0, max: 0 } };
	}

	const padding = input.padding ?? 1;
	const innerWidth = Math.max(0, width - 2 * padding);
	const innerHeight = Math.max(0, height - 2 * padding);

	const dataMin = input.min ?? Math.min(...data);
	const dataMaxRaw = input.max ?? Math.max(...data);
	// Ensure max > min so the divisor isn't zero. For constant series we
	// extend the range by 1 unit so the line sits at the midpoint.
	const dataMax = dataMaxRaw > dataMin ? dataMaxRaw : dataMin + 1;

	const range = { min: dataMin, max: dataMax };

	const stepX = data.length > 1 ? innerWidth / (data.length - 1) : 0;
	const verticalSpan = dataMax - dataMin;

	let path = '';
	let lastX = 0;
	let lastY = 0;
	for (let i = 0; i < data.length; i++) {
		const raw = data[i]!;
		const xRaw = padding + i * stepX;
		const yRatio = verticalSpan === 0 ? 0.5 : 1 - (raw - dataMin) / verticalSpan;
		const yRaw = padding + yRatio * innerHeight;
		const x = roundFixed(xRaw);
		const y = roundFixed(yRaw);
		path += i === 0 ? `M${x} ${y}` : ` L${x} ${y}`;
		lastX = x;
		lastY = y;
	}

	return { path, last: { x: lastX, y: lastY }, range };
}

/**
 * Round to 3 decimal places so the path attribute stays stable across
 * runs and tests can match on the exact string. Avoids depending on
 * `toFixed`'s locale-aware behavior for `Intl` non-en locales.
 */
function roundFixed(n: number): number {
	return Math.round(n * 1000) / 1000;
}
