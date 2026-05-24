import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import ReleaseTimeline from '../src/components/ReleaseTimeline.svelte';
import type { ReleaseTimelineItem } from '../src/types.js';

const baseReleases: ReleaseTimelineItem[] = [
	{
		id: 'v1412',
		version: 'v1.4.12',
		channel: 'stable',
		date: '2026-05-22T00:00:00Z',
		status: 'shipped',
		adoption: 0.82,
	},
	{
		id: 'v1500rc1',
		version: 'v1.5.0-rc.1',
		channel: 'beta',
		date: '2026-05-23T00:00:00Z',
		status: 'in-progress',
		adoption: 0.05,
	},
];

describe('ReleaseTimeline', () => {
	it('renders as <section aria-labelledby> with the supplied accessible name', () => {
		const { container } = render(ReleaseTimeline, {
			label: 'Lesser release history',
			releases: baseReleases,
		});
		const section = container.querySelector('section.gr-host-platform-release-timeline');
		expect(section).toBeTruthy();
		const labelledby = section?.getAttribute('aria-labelledby');
		expect(labelledby).toBeTruthy();
		expect(container.ownerDocument.getElementById(labelledby!)?.textContent).toBe(
			'Lesser release history'
		);
	});

	it('renders releases as a semantic <ol>', () => {
		const { container } = render(ReleaseTimeline, {
			label: 'r',
			releases: baseReleases,
		});
		const list = container.querySelector('ol.gr-host-platform-release-timeline__list');
		expect(list).toBeTruthy();
		const items = list?.querySelectorAll('li');
		expect(items?.length).toBe(2);
	});

	it.each([
		['shipped', 'Shipped'],
		['in-progress', 'Rolling out'],
		['rolled-back', 'Rolled back'],
		['planned', 'Planned'],
	])('communicates status %s with text label (%s) — never color-only', (status, expectedLabel) => {
		const { container } = render(ReleaseTimeline, {
			label: 'r',
			releases: [
				{
					id: 's',
					version: 'v1.0.0',
					channel: 'stable',
					date: '2026-05-22',
					status: status as never,
				},
			],
		});
		const badge = container.querySelector('.gr-host-platform-release-timeline__status');
		expect(badge?.getAttribute('aria-label')).toBe(`Status: ${expectedLabel}`);
		expect(badge?.textContent?.trim()).toBe(expectedLabel);
	});

	it('exposes the channel via aria-label (non-color-only)', () => {
		const { container } = render(ReleaseTimeline, {
			label: 'r',
			releases: baseReleases,
		});
		const channels = container.querySelectorAll('.gr-host-platform-release-timeline__channel');
		expect(channels.length).toBe(2);
		expect(channels[0]?.getAttribute('aria-label')).toBe('Channel: stable');
		expect(channels[1]?.getAttribute('aria-label')).toBe('Channel: beta');
	});

	it('renders <time datetime> with ISO date and visible formatted date', () => {
		const { container } = render(ReleaseTimeline, {
			label: 'r',
			releases: [
				{
					id: 'r1',
					version: 'v1.0.0',
					channel: 'stable',
					date: '2026-05-22T00:00:00Z',
					status: 'shipped',
				},
			],
		});
		const time = container.querySelector('time.gr-host-platform-release-timeline__date');
		const dt = time?.getAttribute('datetime');
		expect(dt).toBeTruthy();
		expect(dt).toContain('2026-05-22');
		// Visible date renders something non-empty (Intl.DateTimeFormat may render
		// locale-specific output; we just assert it's there).
		expect(time?.textContent?.trim().length).toBeGreaterThan(0);
	});

	it('honors formatDate prop for custom date rendering', () => {
		const { container } = render(ReleaseTimeline, {
			label: 'r',
			releases: [
				{
					id: 'r1',
					version: 'v1.0.0',
					channel: 'stable',
					date: '2026-05-22T00:00:00Z',
					status: 'shipped',
				},
			],
			formatDate: (d) => (typeof d === 'string' ? `[${d}]` : `[${d.toISOString()}]`),
		});
		const time = container.querySelector('time');
		expect(time?.textContent?.trim()).toBe('[2026-05-22T00:00:00Z]');
	});

	it('renders numeric adoption as a role="meter" with valid range and aria-valuetext', () => {
		const { container } = render(ReleaseTimeline, {
			label: 'r',
			releases: [
				{
					id: 'r1',
					version: 'v1.0.0',
					channel: 'stable',
					date: '2026-05-22',
					status: 'shipped',
					adoption: 0.42,
				},
			],
		});
		const meter = container.querySelector('[role="meter"]');
		expect(meter).toBeTruthy();
		const min = Number(meter?.getAttribute('aria-valuemin'));
		const max = Number(meter?.getAttribute('aria-valuemax'));
		const now = Number(meter?.getAttribute('aria-valuenow'));
		expect(min).toBe(0);
		expect(max).toBe(1);
		expect(now).toBeCloseTo(0.42, 5);
		expect(meter?.getAttribute('aria-valuetext')).toBe('Adoption: 42%');
	});

	it('clamps numeric adoption above 1.0 into [0,1] for the meter', () => {
		const { container } = render(ReleaseTimeline, {
			label: 'r',
			releases: [
				{
					id: 'r1',
					version: 'v1.0.0',
					channel: 'stable',
					date: '2026-05-22',
					status: 'shipped',
					adoption: 2.5, // intentional overrun
				},
			],
		});
		const meter = container.querySelector('[role="meter"]');
		const now = Number(meter?.getAttribute('aria-valuenow'));
		expect(now).toBe(1);
		expect(meter?.getAttribute('aria-valuetext')).toBe('Adoption: 100%');
	});

	it('renders string adoption as text (no meter, no fake range)', () => {
		const { container } = render(ReleaseTimeline, {
			label: 'r',
			releases: [
				{
					id: 'r1',
					version: 'v1.0.0',
					channel: 'stable',
					date: '2026-05-22',
					status: 'shipped',
					adoption: '42 of 100 instances',
				},
			],
		});
		expect(container.querySelector('[role="meter"]')).toBeNull();
		const text = container.querySelector('.gr-host-platform-release-timeline__adoption-static');
		expect(text?.textContent).toContain('42 of 100 instances');
	});

	it('renders the release-notes link with accessible label when href is supplied', () => {
		const { container } = render(ReleaseTimeline, {
			label: 'r',
			releases: [
				{
					id: 'r1',
					version: 'v1.0.0',
					channel: 'stable',
					date: '2026-05-22',
					status: 'shipped',
					href: 'https://example.com/v1.0.0',
				},
			],
		});
		const link = container.querySelector('a.gr-host-platform-release-timeline__link');
		expect(link?.getAttribute('aria-label')).toBe('Release notes for v1.0.0');
	});

	it('renders the empty state with role="status" when no releases are supplied', () => {
		const { container } = render(ReleaseTimeline, {
			label: 'r',
			releases: [],
			emptyMessage: 'No releases yet.',
		});
		const empty = container.querySelector('.gr-host-platform-release-timeline__empty');
		expect(empty?.getAttribute('role')).toBe('status');
		expect(empty?.textContent?.trim()).toBe('No releases yet.');
	});

	it('does not set inline style attribute on any rendered element', () => {
		const { container } = render(ReleaseTimeline, {
			label: 'r',
			releases: baseReleases,
		});
		expect(container.querySelectorAll('[style]').length).toBe(0);
	});

	it('produces unique release item ids across multiple timeline instances', () => {
		const a = render(ReleaseTimeline, { label: 'a', releases: baseReleases });
		const b = render(ReleaseTimeline, { label: 'b', releases: baseReleases });
		const aId = a.container.querySelector('li')?.getAttribute('id');
		const bId = b.container.querySelector('li')?.getAttribute('id');
		expect(aId).toBeTruthy();
		expect(bId).toBeTruthy();
		expect(aId).not.toBe(bId);
	});
});
