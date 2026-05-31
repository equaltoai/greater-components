import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ReleaseTimeline from '../src/components/ReleaseTimeline.svelte';
import type { ReleaseTimelineItem } from '../src/types.js';

const createRelease = (href: string): ReleaseTimelineItem => ({
	id: 'release-1',
	version: 'v1.0.0',
	channel: 'stable',
	date: '2026-05-22',
	status: 'shipped',
	href,
});

describe('ReleaseTimeline link safety', () => {
	it.each([
		['javascript:alert(1)', 'javascript:'],
		['data:text/html,<script>alert(1)</script>', 'data:'],
		['vbscript:msgbox(1)', 'vbscript:'],
	])('omits release-notes links with unsafe URL scheme %s', (href, scheme) => {
		const { container } = render(ReleaseTimeline, {
			label: 'Release history',
			releases: [createRelease(href)],
		});

		expect(container.querySelector('a.gr-host-platform-release-timeline__link')).toBeNull();
		expect(container.innerHTML.toLowerCase()).not.toContain(scheme);
		expect(container.textContent).toContain('v1.0.0');
	});

	it.each([
		['http://example.com/releases/v1.0.0', 'http://example.com/releases/v1.0.0'],
		['https://example.com/releases/v1.0.0', 'https://example.com/releases/v1.0.0'],
		['mailto:releases@example.com', 'mailto:releases@example.com'],
		['/releases/v1.0.0', '/releases/v1.0.0'],
	])('keeps release-notes links with allowed href %s', (href, expectedHref) => {
		const { container } = render(ReleaseTimeline, {
			label: 'Release history',
			releases: [createRelease(href)],
		});

		const link = container.querySelector('a.gr-host-platform-release-timeline__link');
		expect(link).not.toBeNull();
		expect(link?.getAttribute('href')).toBe(expectedHref);
		expect(link?.textContent).toContain('Release notes');
		expect(link?.getAttribute('aria-label')).toBe('Release notes for v1.0.0');
	});
});
