import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import ActivitySparkline from '../src/components/ActivitySparkline.svelte';

const MAX_EXPECTED_SPARKLINE_POINTS = 1000;

function countPathPoints(path: string): number {
	return (path.match(/[ML]/g) ?? []).length;
}

describe('ActivitySparkline', () => {
	it('renders an informative <svg role="img"> with <title> when label is supplied', () => {
		const { container } = render(ActivitySparkline, {
			data: [1, 2, 3, 4],
			label: 'Posts per hour',
		});
		const svg = container.querySelector('svg.gr-host-platform-activity-sparkline__svg');
		expect(svg).toBeTruthy();
		expect(svg?.getAttribute('role')).toBe('img');
		const titleId = svg?.getAttribute('aria-labelledby');
		expect(titleId).toBeTruthy();
		const titleEl = container.ownerDocument.getElementById(titleId!);
		expect(titleEl?.tagName.toLowerCase()).toBe('title');
		expect(titleEl?.textContent).toBe('Posts per hour');
	});

	it('falls back to "Activity trend" when no label is supplied (still has an accessible name)', () => {
		const { container } = render(ActivitySparkline, { data: [1, 2, 3] });
		const titleId = container
			.querySelector('svg.gr-host-platform-activity-sparkline__svg')
			?.getAttribute('aria-labelledby');
		expect(titleId).toBeTruthy();
		const titleEl = container.ownerDocument.getElementById(titleId!);
		expect(titleEl?.textContent).toBe('Activity trend');
	});

	it('renders a <desc> when description is supplied and links aria-describedby', () => {
		const { container } = render(ActivitySparkline, {
			data: [1, 2, 3],
			label: 'Trend',
			description: '24 hour rolling average',
		});
		const svg = container.querySelector('svg');
		const descId = svg?.getAttribute('aria-describedby');
		expect(descId).toBeTruthy();
		const descEl = container.ownerDocument.getElementById(descId!);
		expect(descEl?.tagName.toLowerCase()).toBe('desc');
		expect(descEl?.textContent).toBe('24 hour rolling average');
	});

	it('renders aria-hidden + no <title>/<desc> when decorative=true', () => {
		const { container } = render(ActivitySparkline, {
			data: [1, 2, 3],
			label: 'Trend',
			decorative: true,
		});
		const svg = container.querySelector('svg.gr-host-platform-activity-sparkline__svg');
		expect(svg?.getAttribute('aria-hidden')).toBe('true');
		expect(svg?.querySelector('title')).toBeNull();
		expect(svg?.getAttribute('role')).not.toBe('img');
	});

	it('renders the empty state when data is empty', () => {
		const { container } = render(ActivitySparkline, {
			data: [],
			label: 'Posts per hour',
			emptyMessage: 'No posts yet',
		});
		expect(container.querySelector('svg')).toBeNull();
		const empty = container.querySelector('.gr-host-platform-activity-sparkline__empty');
		expect(empty?.textContent).toContain('No posts yet');
		expect(empty?.getAttribute('aria-label')).toBe('Posts per hour');
	});

	it('emits a non-empty SVG path for a non-empty series', () => {
		const { container } = render(ActivitySparkline, {
			data: [1, 4, 2, 8],
			label: 'Trend',
		});
		const path = container.querySelector('path.gr-host-platform-activity-sparkline__path');
		expect(path).toBeTruthy();
		const d = path?.getAttribute('d') ?? '';
		expect(d.startsWith('M')).toBe(true);
		expect(d.includes('L')).toBe(true);
	});

	it('renders large untrusted data without emitting an unbounded path', () => {
		const data = Array.from({ length: 500_000 }, (_, i) => {
			if (i % 99_991 === 0) return Number.NaN;
			if (i % 131_071 === 0) return Number.POSITIVE_INFINITY;
			if (i % 262_147 === 0) return Number.NEGATIVE_INFINITY;
			return Math.cos(i / 75) * 12 + (i % 53);
		});

		const { container } = render(ActivitySparkline, {
			data,
			label: 'Untrusted activity',
		});

		const path = container.querySelector('path.gr-host-platform-activity-sparkline__path');
		const d = path?.getAttribute('d') ?? '';
		expect(d).toMatch(/^M/);
		expect(d).not.toMatch(/NaN|Infinity/);
		expect(countPathPoints(d)).toBeLessThanOrEqual(MAX_EXPECTED_SPARKLINE_POINTS);
	});

	it('applies the tone modifier class (paired with label text — never color-only)', () => {
		const { container } = render(ActivitySparkline, {
			data: [1, 2, 3],
			label: 'Trend',
			tone: 'warning',
		});
		expect(
			container.querySelector('.gr-host-platform-activity-sparkline--tone-warning')
		).toBeTruthy();
	});

	it('does not set inline style attribute on the wrapper or SVG', () => {
		const { container } = render(ActivitySparkline, {
			data: [1, 2, 3],
			label: 'Trend',
		});
		expect(
			container.querySelector('.gr-host-platform-activity-sparkline')?.hasAttribute('style')
		).toBe(false);
		expect(container.querySelector('svg')?.hasAttribute('style')).toBe(false);
		expect(container.querySelector('path')?.hasAttribute('style')).toBe(false);
	});

	it('produces unique title ids across multiple sparkline instances', () => {
		const a = render(ActivitySparkline, { data: [1, 2, 3], label: 'A' });
		const b = render(ActivitySparkline, { data: [1, 2, 3], label: 'B' });
		const ida = a.container.querySelector('svg')?.getAttribute('aria-labelledby');
		const idb = b.container.querySelector('svg')?.getAttribute('aria-labelledby');
		expect(ida).toBeTruthy();
		expect(idb).toBeTruthy();
		expect(ida).not.toBe(idb);
	});
});
