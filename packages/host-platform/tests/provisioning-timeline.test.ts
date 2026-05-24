import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import ProvisioningTimeline from '../src/components/ProvisioningTimeline.svelte';
import type { ProvisioningStep } from '../src/types.js';

function snippetOf(html: string) {
	return createRawSnippet(() => ({ render: () => html }));
}

const baseSteps: ProvisioningStep[] = [
	{
		id: 'allocate',
		label: 'Allocate compute',
		status: 'success',
		timestamp: '2026-05-24T15:00:00Z',
	},
	{ id: 'install', label: 'Install Lesser', status: 'active' },
	{ id: 'migrate', label: 'Run migrations', status: 'pending' },
];

describe('ProvisioningTimeline', () => {
	it('renders as <section aria-labelledby> with the supplied accessible name', () => {
		const { container } = render(ProvisioningTimeline, {
			label: 'lesser.example provisioning',
			steps: baseSteps,
		});
		const section = container.querySelector('section.gr-host-platform-provisioning-timeline');
		expect(section).toBeTruthy();
		const labelledby = section?.getAttribute('aria-labelledby');
		expect(labelledby).toBeTruthy();
		expect(container.ownerDocument.getElementById(labelledby!)?.textContent).toBe(
			'lesser.example provisioning'
		);
	});

	it('renders steps as a semantic <ol>', () => {
		const { container } = render(ProvisioningTimeline, {
			label: 'p',
			steps: baseSteps,
		});
		const list = container.querySelector('ol.gr-host-platform-provisioning-timeline__list');
		expect(list).toBeTruthy();
		const items = list?.querySelectorAll('li');
		expect(items?.length).toBe(3);
	});

	it.each([
		['pending', 'Pending'],
		['active', 'In progress'],
		['success', 'Completed'],
		['failure', 'Failed'],
		['skipped', 'Skipped'],
	])('communicates status %s with text label (%s) — never color-only', (status, expectedLabel) => {
		const steps: ProvisioningStep[] = [{ id: 's', label: 'Step', status: status as never }];
		const { container } = render(ProvisioningTimeline, { label: 'p', steps });
		const stepEl = container.querySelector(
			`.gr-host-platform-provisioning-timeline__step--status-${status}`
		);
		expect(stepEl).toBeTruthy();
		const badge = stepEl?.querySelector('.gr-host-platform-provisioning-timeline__status');
		expect(badge?.getAttribute('aria-label')).toBe(`Status: ${expectedLabel}`);
		expect(
			badge?.querySelector('.gr-host-platform-provisioning-timeline__status-text')?.textContent
		).toBe(expectedLabel);
	});

	it('sets aria-current="step" on the active step only', () => {
		const { container } = render(ProvisioningTimeline, {
			label: 'p',
			steps: baseSteps,
		});
		const currentItems = container.querySelectorAll('[aria-current="step"]');
		expect(currentItems.length).toBe(1);
		expect(currentItems[0]?.textContent).toContain('Install Lesser');
	});

	it('renders the empty state with role="status" when no steps are supplied', () => {
		const { container } = render(ProvisioningTimeline, {
			label: 'p',
			steps: [],
			emptyMessage: 'Nothing scheduled.',
		});
		expect(container.querySelector('ol')).toBeNull();
		const empty = container.querySelector('.gr-host-platform-provisioning-timeline__empty');
		expect(empty?.getAttribute('role')).toBe('status');
		expect(empty?.textContent?.trim()).toBe('Nothing scheduled.');
	});

	it('wraps the liveLog snippet in a role="log" region with aria-live=polite by default', () => {
		const { container } = render(ProvisioningTimeline, {
			label: 'p',
			steps: baseSteps,
			liveLog: snippetOf('<pre data-test="log">15:01:02 [allocate] node provisioned…</pre>'),
		});
		const log = container.querySelector('section.gr-host-platform-provisioning-timeline__log');
		expect(log).toBeTruthy();
		expect(log?.getAttribute('role')).toBe('log');
		expect(log?.getAttribute('aria-live')).toBe('polite');
		expect(log?.getAttribute('aria-atomic')).toBe('false');
		expect(log?.getAttribute('aria-relevant')).toBe('additions');
		// Log content is rendered inside the region.
		expect(log?.querySelector('[data-test="log"]')).toBeTruthy();
		// Region has its own accessible name.
		const labelledby = log?.getAttribute('aria-labelledby');
		expect(labelledby).toBeTruthy();
		expect(container.ownerDocument.getElementById(labelledby!)?.textContent).toBe(
			'Live provisioning log'
		);
	});

	it('honors liveLogLabel + liveLogPoliteness="assertive"', () => {
		const { container } = render(ProvisioningTimeline, {
			label: 'p',
			steps: baseSteps,
			liveLog: snippetOf('<div data-test="log"></div>'),
			liveLogLabel: 'Build output',
			liveLogPoliteness: 'assertive',
		});
		const log = container.querySelector('section.gr-host-platform-provisioning-timeline__log');
		expect(log?.getAttribute('aria-live')).toBe('assertive');
		const labelledby = log?.getAttribute('aria-labelledby');
		expect(container.ownerDocument.getElementById(labelledby!)?.textContent).toBe('Build output');
	});

	it('drops role="log" entirely when liveLogPoliteness="off" (Arch PR #670 review regression)', () => {
		// `role="log"` has implicit polite live-region semantics in screen
		// readers — merely omitting `aria-live` does NOT disable announcements.
		// When the consumer opts into liveLogPoliteness="off", the log MUST
		// render without role="log" so AT users see no announcements at all.
		const { container } = render(ProvisioningTimeline, {
			label: 'p',
			steps: baseSteps,
			liveLog: snippetOf('<div data-test="log"></div>'),
			liveLogPoliteness: 'off',
		});
		// No role="log" anywhere in the rendered output.
		expect(container.querySelector('[role="log"]')).toBeNull();
		// The visible log region still renders (consumer's content is visible
		// to sighted users), but with no live semantics.
		const log = container.querySelector('section.gr-host-platform-provisioning-timeline__log');
		expect(log).toBeTruthy();
		expect(log?.hasAttribute('aria-live')).toBe(false);
		expect(log?.hasAttribute('aria-atomic')).toBe(false);
		expect(log?.hasAttribute('aria-relevant')).toBe(false);
		expect(log?.classList.contains('gr-host-platform-provisioning-timeline__log--quiet')).toBe(
			true
		);
		expect(log?.querySelector('[data-test="log"]')).toBeTruthy();
		// The section still has an accessible name pointing at the visible
		// log heading.
		const labelledby = log?.getAttribute('aria-labelledby');
		expect(labelledby).toBeTruthy();
		expect(container.ownerDocument.getElementById(labelledby!)?.textContent).toBe(
			'Live provisioning log'
		);
	});

	it('does not render the log region when liveLog snippet is omitted', () => {
		const { container } = render(ProvisioningTimeline, {
			label: 'p',
			steps: baseSteps,
		});
		expect(container.querySelector('[role="log"]')).toBeNull();
	});

	it('renders a <time datetime> for steps with a timestamp', () => {
		const { container } = render(ProvisioningTimeline, {
			label: 'p',
			steps: [
				{
					id: 's',
					label: 'Step',
					status: 'success',
					timestamp: '2026-05-24T15:00:00Z',
				},
			],
		});
		const time = container.querySelector('time.gr-host-platform-provisioning-timeline__time');
		expect(time?.getAttribute('datetime')).toBe('2026-05-24T15:00:00Z');
	});

	it('does not set inline style attribute on any rendered element', () => {
		const { container } = render(ProvisioningTimeline, {
			label: 'p',
			steps: baseSteps,
			liveLog: snippetOf('<div data-test="log"></div>'),
		});
		container.querySelectorAll('[style]').forEach((el) => {
			expect(el.tagName, `${el.tagName} should not have style attribute`).toBe('NEVER');
		});
		expect(container.querySelectorAll('[style]').length).toBe(0);
	});

	it('produces unique step ids across multiple timeline instances', () => {
		const a = render(ProvisioningTimeline, { label: 'a', steps: baseSteps });
		const b = render(ProvisioningTimeline, { label: 'b', steps: baseSteps });
		const aId = a.container.querySelector('li')?.getAttribute('id');
		const bId = b.container.querySelector('li')?.getAttribute('id');
		expect(aId).toBeTruthy();
		expect(bId).toBeTruthy();
		expect(aId).not.toBe(bId);
	});
});
