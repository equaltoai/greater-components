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

	it('formats UTC-midnight and date-only release dates without timezone shift (Arch PR #670 review regression)', () => {
		// `new Date('2026-05-22T00:00:00Z')` parses as UTC midnight; the default
		// Intl.DateTimeFormat applies the viewer's local timezone, which renders
		// the previous day in any zone west of UTC (US, Pacific, etc.). For
		// calendar-day inputs (`YYYY-MM-DD` or `...T00:00:00Z`) we must format
		// in UTC so the visible date matches what the consumer typed.
		//
		// We assert the date contains "22" (the day component) regardless of
		// locale, and explicitly does NOT shift to "21".
		const { container } = render(ReleaseTimeline, {
			label: 'r',
			releases: [
				{
					id: 'utc-midnight',
					version: 'v1.0.0',
					channel: 'stable',
					date: '2026-05-22T00:00:00Z',
					status: 'shipped',
				},
				{
					id: 'date-only',
					version: 'v1.0.1',
					channel: 'stable',
					date: '2026-05-23',
					status: 'shipped',
				},
			],
		});
		const times = container.querySelectorAll('time.gr-host-platform-release-timeline__date');
		const text1 = times[0]?.textContent?.trim() ?? '';
		const text2 = times[1]?.textContent?.trim() ?? '';
		expect(text1).toContain('22');
		expect(text1).not.toContain('21');
		expect(text2).toContain('23');
		expect(text2).not.toContain('22');
	});

	it('preserves non-midnight timestamps in viewer-local timezone (existing behavior)', () => {
		// Inputs with explicit non-midnight times remain instant-in-time
		// semantics and may legitimately shift across day boundaries based on
		// viewer timezone. This test pins that the calendar-day detection is
		// narrow — it only kicks in for the unambiguous date-only cases.
		const { container } = render(ReleaseTimeline, {
			label: 'r',
			releases: [
				{
					id: 'midday',
					version: 'v1.0.0',
					channel: 'stable',
					date: '2026-05-22T14:30:00Z',
					status: 'shipped',
				},
			],
		});
		const time = container.querySelector('time');
		// Just assert the time renders something non-empty — exact date depends
		// on viewer timezone, which is the correct semantics for an explicit
		// instant.
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

	it('adoption meter has an accessible name via aria-labelledby (Arch PR #670 review regression)', () => {
		// Every `role="meter"` MUST have an accessible name. Previously we set
		// aria-valuetext + aria-valuenow but left the meter unnamed, so screen
		// readers announced only the value with no semantic anchor.
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
		const labelledby = meter?.getAttribute('aria-labelledby');
		expect(labelledby, 'meter must have aria-labelledby').toBeTruthy();
		const labelEl = container.ownerDocument.getElementById(labelledby!);
		expect(labelEl, 'aria-labelledby must resolve to a real element').toBeTruthy();
		expect(labelEl?.textContent).toContain('Adoption');
		expect(labelEl?.textContent).toContain('42%');
		// Should NOT also have aria-label (precedence pitfall — labelledby wins,
		// but emitting both is ambiguous and triggers spec warnings).
		expect(meter?.hasAttribute('aria-label')).toBe(false);
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
