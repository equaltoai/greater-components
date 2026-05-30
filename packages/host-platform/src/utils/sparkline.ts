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

const MAX_SPARKLINE_POINTS = 1000;

interface NormalizedSparklineData {
	values: number[];
	min: number;
	max: number;
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

	const normalized = normalizeSparklineData(data, MAX_SPARKLINE_POINTS);
	if (normalized.values.length === 0) {
		return { path: '', last: { x: 0, y: height / 2 }, range: { min: 0, max: 0 } };
	}

	const inputMin = input.min;
	const inputMax = input.max;
	const dataMin =
		typeof inputMin === 'number' && Number.isFinite(inputMin) ? inputMin : normalized.min;
	const dataMaxRaw =
		typeof inputMax === 'number' && Number.isFinite(inputMax) ? inputMax : normalized.max;
	// Ensure max > min so the divisor isn't zero. For constant series we
	// extend the range by 1 unit so the line sits at the midpoint.
	const dataMax = dataMaxRaw > dataMin ? dataMaxRaw : dataMin + 1;

	const range = { min: dataMin, max: dataMax };

	const values = normalized.values;
	const stepX = values.length > 1 ? innerWidth / (values.length - 1) : 0;
	const verticalSpan = dataMax - dataMin;

	let path = '';
	let lastX = 0;
	let lastY = 0;
	for (let i = 0; i < values.length; i++) {
		const raw = values[i];
		if (raw === undefined) continue;
		const xRaw = padding + i * stepX;
		const yRatio = toSparklineYRatio(raw, dataMin, verticalSpan);
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

function normalizeSparklineData(data: number[], maxPoints: number): NormalizedSparklineData {
	let min = Number.POSITIVE_INFINITY;
	let max = Number.NEGATIVE_INFINITY;
	const values: number[] = [];

	const recordFiniteSample = (sample: number): boolean => {
		if (!Number.isFinite(sample)) return false;
		if (sample < min) min = sample;
		if (sample > max) max = sample;
		return true;
	};

	if (data.length <= maxPoints) {
		for (let i = 0; i < data.length; i++) {
			const sample = data[i];
			if (sample === undefined) continue;
			if (recordFiniteSample(sample)) values.push(sample);
		}

		return { values, min, max };
	}

	for (let bucket = 0; bucket < maxPoints; bucket++) {
		const start = Math.floor((bucket * data.length) / maxPoints);
		const end = Math.floor(((bucket + 1) * data.length) / maxPoints);

		let count = 0;
		let mean = 0;
		let fallback = 0;
		for (let i = start; i < end; i++) {
			const sample = data[i];
			if (sample === undefined) continue;
			if (!recordFiniteSample(sample)) continue;

			count += 1;
			fallback = sample;
			mean += (sample - mean) / count;
		}

		if (count > 0) values.push(Number.isFinite(mean) ? mean : fallback);
	}

	return { values, min, max };
}

function toSparklineYRatio(value: number, min: number, verticalSpan: number): number {
	if (!Number.isFinite(verticalSpan) || verticalSpan <= 0) return 0.5;

	const ratio = 1 - (value - min) / verticalSpan;
	if (!Number.isFinite(ratio)) return 0.5;

	return Math.min(1, Math.max(0, ratio));
}
