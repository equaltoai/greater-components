/**
 * Admin.Analytics Component Tests
 * 
 * Tests for analytics dashboard logic including:
 * - Date formatting
 * - Chart calculations
 * - Data aggregation
 * - Period selection
 * - Statistics calculations
 */

import { describe, it, expect } from 'vitest';

// Interfaces
interface DataPoint {
	date: string;
	count: number;
}

type AnalyticsPeriod = 'day' | 'week' | 'month';

// Format date for display
function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// Get max value from data points
function getMaxValue(data: DataPoint[]): number {
	if (data.length === 0) return 1;
	return Math.max(...data.map((d) => d.count), 1);
}

// Calculate chart height as percentage
function getChartHeight(value: number, max: number): number {
	if (max === 0) return 0;
	return (value / max) * 100;
}

// Calculate total
function calculateTotal(data: DataPoint[]): number {
	return data.reduce((sum, d) => sum + d.count, 0);
}

// Calculate average
function calculateAverage(data: DataPoint[]): number {
	if (data.length === 0) return 0;
	return Math.round(calculateTotal(data) / data.length);
}

// Get period label
function getPeriodLabel(period: AnalyticsPeriod): string {
	const labels: Record<AnalyticsPeriod, string> = {
		day: '24 Hours',
		week: '7 Days',
		month: '30 Days',
	};
	return labels[period];
}

// Check if period is active
function isPeriodActive(currentPeriod: AnalyticsPeriod, checkPeriod: AnalyticsPeriod): boolean {
	return currentPeriod === checkPeriod;
}

// Find peak data point
function findPeak(data: DataPoint[]): DataPoint | null {
	if (data.length === 0) return null;
	return data.reduce((peak, current) => (current.count > peak.count ? current : peak));
}

// Find lowest data point
function findLowest(data: DataPoint[]): DataPoint | null {
	if (data.length === 0) return null;
	return data.reduce((lowest, current) => (current.count < lowest.count ? current : lowest));
}

// Calculate growth rate
function calculateGrowthRate(data: DataPoint[]): number {
	if (data.length < 2) return 0;

	const firstValue = data[0].count;
	const lastValue = data[data.length - 1].count;

	if (firstValue === 0) return lastValue > 0 ? 100 : 0;

	return Math.round(((lastValue - firstValue) / firstValue) * 100);
}

// Check if data is trending up
function isTrendingUp(data: DataPoint[]): boolean {
	if (data.length < 2) return false;
	return data[data.length - 1].count > data[0].count;
}

// Check if data is trending down
function isTrendingDown(data: DataPoint[]): boolean {
	if (data.length < 2) return false;
	return data[data.length - 1].count < data[0].count;
}

// Get data points above average
function getAboveAverage(data: DataPoint[]): DataPoint[] {
	const avg = calculateAverage(data);
	return data.filter((d) => d.count > avg);
}

// Get data points below average
function getBelowAverage(data: DataPoint[]): DataPoint[] {
	const avg = calculateAverage(data);
	return data.filter((d) => d.count < avg);
}

// Calculate median
function calculateMedian(data: DataPoint[]): number {
	if (data.length === 0) return 0;

	const sorted = [...data].sort((a, b) => a.count - b.count);
	const mid = Math.floor(sorted.length / 2);

	return sorted.length % 2 === 0
		? (sorted[mid - 1].count + sorted[mid].count) / 2
		: sorted[mid].count;
}

// Check if has data
function hasData(data: DataPoint[]): boolean {
	return data.length > 0;
}

// Check if all zeros
function isAllZeros(data: DataPoint[]): boolean {
	return data.every((d) => d.count === 0);
}

// Get period days
function getPeriodDays(period: AnalyticsPeriod): number {
	const days: Record<AnalyticsPeriod, number> = {
		day: 1,
		week: 7,
		month: 30,
	};
	return days[period];
}

// Normalize data for comparison
function normalizeData(data: DataPoint[]): number[] {
	const max = getMaxValue(data);
	if (max === 0) return data.map(() => 0);
	return data.map((d) => d.count / max);
}

describe('Admin.Analytics - Date Formatting', () => {
	it('formats dates', () => {
		const formatted = formatDate('2024-01-15T12:00:00Z');
		expect(formatted).toBeTruthy();
		expect(formatted).toContain('Jan');
		// Date may vary by timezone, just check it's a valid format
		expect(formatted.length).toBeGreaterThan(0);
	});

	it('handles different date formats', () => {
		expect(formatDate('2024-12-25T12:00:00Z')).toBeTruthy();
		expect(formatDate('2024-06-01T12:30:00Z')).toBeTruthy();
	});
});

describe('Admin.Analytics - Max Value Calculation', () => {
	const data: DataPoint[] = [
		{ date: '2024-01-01', count: 10 },
		{ date: '2024-01-02', count: 50 },
		{ date: '2024-01-03', count: 30 },
	];

	it('finds max value', () => {
		expect(getMaxValue(data)).toBe(50);
	});

	it('returns 1 for empty data', () => {
		expect(getMaxValue([])).toBe(1);
	});

	it('returns 1 for all zeros', () => {
		const zeros = [
			{ date: '2024-01-01', count: 0 },
			{ date: '2024-01-02', count: 0 },
		];
		expect(getMaxValue(zeros)).toBe(1);
	});
});

describe('Admin.Analytics - Chart Height Calculation', () => {
	it('calculates percentage height', () => {
		expect(getChartHeight(50, 100)).toBe(50);
		expect(getChartHeight(25, 100)).toBe(25);
		expect(getChartHeight(100, 100)).toBe(100);
	});

	it('handles zero max', () => {
		expect(getChartHeight(10, 0)).toBe(0);
	});

	it('handles zero value', () => {
		expect(getChartHeight(0, 100)).toBe(0);
	});

	it('handles decimal results', () => {
		expect(getChartHeight(33, 100)).toBe(33);
		expect(getChartHeight(1, 3)).toBeCloseTo(33.33, 1);
	});
});

describe('Admin.Analytics - Aggregation', () => {
	const data: DataPoint[] = [
		{ date: '2024-01-01', count: 10 },
		{ date: '2024-01-02', count: 20 },
		{ date: '2024-01-03', count: 30 },
	];

	it('calculates total', () => {
		expect(calculateTotal(data)).toBe(60);
	});

	it('calculates average', () => {
		expect(calculateAverage(data)).toBe(20);
	});

	it('rounds average', () => {
		const data2 = [
			{ date: '2024-01-01', count: 10 },
			{ date: '2024-01-02', count: 11 },
		];
		expect(calculateAverage(data2)).toBe(11); // Rounds 10.5 to 11
	});

	it('handles empty data', () => {
		expect(calculateTotal([])).toBe(0);
		expect(calculateAverage([])).toBe(0);
	});
});

describe('Admin.Analytics - Period Selection', () => {
	it('gets period labels', () => {
		expect(getPeriodLabel('day')).toBe('24 Hours');
		expect(getPeriodLabel('week')).toBe('7 Days');
		expect(getPeriodLabel('month')).toBe('30 Days');
	});

	it('checks if period is active', () => {
		expect(isPeriodActive('week', 'week')).toBe(true);
		expect(isPeriodActive('week', 'day')).toBe(false);
	});

	it('gets period days', () => {
		expect(getPeriodDays('day')).toBe(1);
		expect(getPeriodDays('week')).toBe(7);
		expect(getPeriodDays('month')).toBe(30);
	});
});

describe('Admin.Analytics - Peak and Lowest', () => {
	const data: DataPoint[] = [
		{ date: '2024-01-01', count: 10 },
		{ date: '2024-01-02', count: 50 },
		{ date: '2024-01-03', count: 30 },
		{ date: '2024-01-04', count: 5 },
	];

	it('finds peak', () => {
		const peak = findPeak(data);
		expect(peak).toBeTruthy();
		expect(peak?.count).toBe(50);
		expect(peak?.date).toBe('2024-01-02');
	});

	it('finds lowest', () => {
		const lowest = findLowest(data);
		expect(lowest).toBeTruthy();
		expect(lowest?.count).toBe(5);
		expect(lowest?.date).toBe('2024-01-04');
	});

	it('handles empty data', () => {
		expect(findPeak([])).toBeNull();
		expect(findLowest([])).toBeNull();
	});

	it('handles single data point', () => {
		const single = [{ date: '2024-01-01', count: 10 }];
		expect(findPeak(single)?.count).toBe(10);
		expect(findLowest(single)?.count).toBe(10);
	});
});

describe('Admin.Analytics - Growth Rate', () => {
	it('calculates positive growth', () => {
		const data = [
			{ date: '2024-01-01', count: 100 },
			{ date: '2024-01-02', count: 150 },
		];
		expect(calculateGrowthRate(data)).toBe(50); // 50% growth
	});

	it('calculates negative growth', () => {
		const data = [
			{ date: '2024-01-01', count: 100 },
			{ date: '2024-01-02', count: 50 },
		];
		expect(calculateGrowthRate(data)).toBe(-50); // -50% growth
	});

	it('handles zero start value', () => {
		const data = [
			{ date: '2024-01-01', count: 0 },
			{ date: '2024-01-02', count: 50 },
		];
		expect(calculateGrowthRate(data)).toBe(100);
	});

	it('handles insufficient data', () => {
		expect(calculateGrowthRate([])).toBe(0);
		expect(calculateGrowthRate([{ date: '2024-01-01', count: 10 }])).toBe(0);
	});
});

describe('Admin.Analytics - Trend Detection', () => {
	const upData: DataPoint[] = [
		{ date: '2024-01-01', count: 10 },
		{ date: '2024-01-02', count: 20 },
	];

	const downData: DataPoint[] = [
		{ date: '2024-01-01', count: 20 },
		{ date: '2024-01-02', count: 10 },
	];

	const flatData: DataPoint[] = [
		{ date: '2024-01-01', count: 10 },
		{ date: '2024-01-02', count: 10 },
	];

	it('detects upward trend', () => {
		expect(isTrendingUp(upData)).toBe(true);
		expect(isTrendingUp(downData)).toBe(false);
	});

	it('detects downward trend', () => {
		expect(isTrendingDown(downData)).toBe(true);
		expect(isTrendingDown(upData)).toBe(false);
	});

	it('handles flat data', () => {
		expect(isTrendingUp(flatData)).toBe(false);
		expect(isTrendingDown(flatData)).toBe(false);
	});

	it('handles insufficient data', () => {
		expect(isTrendingUp([])).toBe(false);
		expect(isTrendingDown([{ date: '2024-01-01', count: 10 }])).toBe(false);
	});
});

describe('Admin.Analytics - Above/Below Average', () => {
	const data: DataPoint[] = [
		{ date: '2024-01-01', count: 10 },
		{ date: '2024-01-02', count: 20 },
		{ date: '2024-01-03', count: 30 },
	]; // Average: 20

	it('gets above average', () => {
		const above = getAboveAverage(data);
		expect(above).toHaveLength(1);
		expect(above[0].count).toBe(30);
	});

	it('gets below average', () => {
		const below = getBelowAverage(data);
		expect(below).toHaveLength(1);
		expect(below[0].count).toBe(10);
	});

	it('excludes average value', () => {
		const above = getAboveAverage(data);
		const below = getBelowAverage(data);
		expect(above.some((d) => d.count === 20)).toBe(false);
		expect(below.some((d) => d.count === 20)).toBe(false);
	});
});

describe('Admin.Analytics - Median Calculation', () => {
	it('calculates median for odd count', () => {
		const data = [
			{ date: '2024-01-01', count: 10 },
			{ date: '2024-01-02', count: 20 },
			{ date: '2024-01-03', count: 30 },
		];
		expect(calculateMedian(data)).toBe(20);
	});

	it('calculates median for even count', () => {
		const data = [
			{ date: '2024-01-01', count: 10 },
			{ date: '2024-01-02', count: 20 },
			{ date: '2024-01-03', count: 30 },
			{ date: '2024-01-04', count: 40 },
		];
		expect(calculateMedian(data)).toBe(25);
	});

	it('handles empty data', () => {
		expect(calculateMedian([])).toBe(0);
	});

	it('handles unsorted data', () => {
		const data = [
			{ date: '2024-01-01', count: 30 },
			{ date: '2024-01-02', count: 10 },
			{ date: '2024-01-03', count: 20 },
		];
		expect(calculateMedian(data)).toBe(20);
	});
});

describe('Admin.Analytics - Data Validation', () => {
	it('checks if has data', () => {
		expect(hasData([{ date: '2024-01-01', count: 10 }])).toBe(true);
		expect(hasData([])).toBe(false);
	});

	it('checks if all zeros', () => {
		const zeros = [
			{ date: '2024-01-01', count: 0 },
			{ date: '2024-01-02', count: 0 },
		];
		const mixed = [
			{ date: '2024-01-01', count: 0 },
			{ date: '2024-01-02', count: 10 },
		];

		expect(isAllZeros(zeros)).toBe(true);
		expect(isAllZeros(mixed)).toBe(false);
	});
});

describe('Admin.Analytics - Data Normalization', () => {
	const data: DataPoint[] = [
		{ date: '2024-01-01', count: 50 },
		{ date: '2024-01-02', count: 100 },
		{ date: '2024-01-03', count: 25 },
	];

	it('normalizes data', () => {
		const normalized = normalizeData(data);
		expect(normalized).toEqual([0.5, 1, 0.25]);
	});

	it('handles all zeros', () => {
		const zeros = [
			{ date: '2024-01-01', count: 0 },
			{ date: '2024-01-02', count: 0 },
		];
		const normalized = normalizeData(zeros);
		expect(normalized).toEqual([0, 0]);
	});
});

describe('Admin.Analytics - Edge Cases', () => {
	it('handles negative counts gracefully', () => {
		const data = [
			{ date: '2024-01-01', count: -10 },
			{ date: '2024-01-02', count: 20 },
		];
		// Max value should still work
		expect(getMaxValue(data)).toBe(20);
		// Chart height should handle negatives
		expect(getChartHeight(-10, 20)).toBe(-50);
	});

	it('handles very large counts', () => {
		const data = [
			{ date: '2024-01-01', count: 1000000 },
			{ date: '2024-01-02', count: 2000000 },
		];
		expect(getMaxValue(data)).toBe(2000000);
		expect(calculateTotal(data)).toBe(3000000);
	});

	it('handles decimal counts', () => {
		const data = [
			{ date: '2024-01-01', count: 10.5 },
			{ date: '2024-01-02', count: 20.7 },
		];
		expect(calculateTotal(data)).toBeCloseTo(31.2, 1);
	});
});

describe('Admin.Analytics - Integration', () => {
	const userGrowth: DataPoint[] = [
		{ date: '2024-01-01', count: 100 },
		{ date: '2024-01-02', count: 120 },
		{ date: '2024-01-03', count: 150 },
		{ date: '2024-01-04', count: 140 },
		{ date: '2024-01-05', count: 180 },
	];

	const postActivity: DataPoint[] = [
		{ date: '2024-01-01', count: 50 },
		{ date: '2024-01-02', count: 60 },
		{ date: '2024-01-03', count: 55 },
		{ date: '2024-01-04', count: 70 },
		{ date: '2024-01-05', count: 65 },
	];

	it('analyzes user growth', () => {
		// Get max for chart scaling
		const max = getMaxValue(userGrowth);
		expect(max).toBe(180);

		// Calculate stats
		const total = calculateTotal(userGrowth);
		const average = calculateAverage(userGrowth);
		expect(total).toBe(690);
		expect(average).toBe(138);

		// Check trend
		expect(isTrendingUp(userGrowth)).toBe(true);

		// Find peak
		const peak = findPeak(userGrowth);
		expect(peak?.count).toBe(180);
		expect(peak?.date).toBe('2024-01-05');
	});

	it('compares metrics', () => {
		// Get growth rates
		const userGrowthRate = calculateGrowthRate(userGrowth);
		const postGrowthRate = calculateGrowthRate(postActivity);

		expect(userGrowthRate).toBe(80); // 100 to 180
		expect(postGrowthRate).toBe(30); // 50 to 65

		// Users growing faster than posts
		expect(userGrowthRate).toBeGreaterThan(postGrowthRate);
	});

	it('handles complete visualization flow', () => {
		// Select period
		const period: AnalyticsPeriod = 'week';
		expect(getPeriodLabel(period)).toBe('7 Days');

		// Calculate for chart
		const max = getMaxValue(userGrowth);
		userGrowth.forEach((dataPoint) => {
			const height = getChartHeight(dataPoint.count, max);
			expect(height).toBeGreaterThanOrEqual(0);
			expect(height).toBeLessThanOrEqual(100);

			// Format date
			const formatted = formatDate(dataPoint.date);
			expect(formatted).toBeTruthy();
		});

		// Calculate summary
		const total = calculateTotal(userGrowth);
		const average = calculateAverage(userGrowth);
		const median = calculateMedian(userGrowth);

		expect(total).toBe(690);
		expect(average).toBe(138);
		expect(median).toBe(140);

		// Check data quality
		expect(hasData(userGrowth)).toBe(true);
		expect(isAllZeros(userGrowth)).toBe(false);
	});

	it('handles period switching', () => {
		const periods: AnalyticsPeriod[] = ['day', 'week', 'month'];

		periods.forEach((period) => {
			// Check active state
			expect(isPeriodActive(period, period)).toBe(true);

			// Get label
			const label = getPeriodLabel(period);
			expect(label).toBeTruthy();

			// Get days
			const days = getPeriodDays(period);
			expect(days).toBeGreaterThan(0);
		});
	});
});
