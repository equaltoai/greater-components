import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import FleetCard from '../src/components/FleetCard.svelte';
import type { FleetCardStatus } from '../src/types.js';

function snippetOf(html: string) {
	return createRawSnippet(() => ({ render: () => html }));
}

describe('FleetCard', () => {
	it('renders as a <section> with auto aria-labelledby pointing at the title', () => {
		const { container } = render(FleetCard, { name: 'lesser.example' });
		const section = container.querySelector('section.gr-host-platform-fleet-card');
		expect(section).toBeTruthy();
		const labelledby = section?.getAttribute('aria-labelledby');
		expect(labelledby).toBeTruthy();
		const titleEl = container.ownerDocument.getElementById(labelledby!);
		expect(titleEl?.textContent?.trim()).toBe('lesser.example');
	});

	it('renders title at the requested heading level', () => {
		const { container } = render(FleetCard, { name: 'lesser.example', headerLevel: 2 });
		expect(container.querySelector('h2.gr-host-platform-fleet-card__title')).toBeTruthy();
		expect(container.querySelector('h3')).toBeNull();
	});

	it('renders subtitle bits when slug / region / version are supplied', () => {
		const { container, getByText } = render(FleetCard, {
			name: 'lesser.example',
			slug: 'lesser-example',
			region: 'us-east-1',
			version: 'v1.4.12',
		});
		expect(getByText('lesser-example')).toBeTruthy();
		expect(getByText('us-east-1')).toBeTruthy();
		expect(getByText('v1.4.12')).toBeTruthy();
		// Region / version are labelled for assistive tech.
		expect(container.querySelector('[aria-label="Region"]')).toBeTruthy();
		expect(container.querySelector('[aria-label="Version"]')).toBeTruthy();
	});

	it('omits the subtitle paragraph when slug / region / version are all absent', () => {
		const { container } = render(FleetCard, { name: 'lesser.example' });
		expect(container.querySelector('.gr-host-platform-fleet-card__subtitle')).toBeNull();
	});

	it.each([
		['healthy', 'Healthy', '●'],
		['provisioning', 'Provisioning', '◌'],
		['warning', 'Warning', '▲'],
		['degraded', 'Degraded', '▼'],
		['offline', 'Offline', '■'],
		['unknown', 'Unknown', '?'],
	] satisfies Array<[FleetCardStatus, string, string]>)(
		'communicates status %s with icon glyph (%s) and text — never color-only',
		(status, expectedLabel, expectedIcon) => {
			const { container } = render(FleetCard, { name: 'x', status });
			const badge = container.querySelector(`.gr-host-platform-fleet-card__status--${status}`);
			expect(badge).toBeTruthy();
			expect(badge?.getAttribute('aria-label')).toBe(`Status: ${expectedLabel}`);
			// The badge has both an icon span (aria-hidden) AND a visible label span.
			expect(badge?.querySelector('.gr-host-platform-fleet-card__status-icon')?.textContent).toBe(
				expectedIcon
			);
			expect(badge?.querySelector('.gr-host-platform-fleet-card__status-label')?.textContent).toBe(
				expectedLabel
			);
		}
	);

	it('honors statusLabel override for accessible name + visible text', () => {
		const { container } = render(FleetCard, {
			name: 'x',
			status: 'healthy',
			statusLabel: 'All clear',
		});
		const badge = container.querySelector('.gr-host-platform-fleet-card__status');
		expect(badge?.getAttribute('aria-label')).toBe('Status: All clear');
		expect(badge?.querySelector('.gr-host-platform-fleet-card__status-label')?.textContent).toBe(
			'All clear'
		);
	});

	it('renders metadata rows as <dl> / <dt> / <dd>', () => {
		const { container } = render(FleetCard, {
			name: 'x',
			metadata: [
				{ key: 'Version', value: 'v1.4.12' },
				{ key: 'Users', value: '1,243' },
			],
		});
		const dl = container.querySelector('dl.gr-host-platform-fleet-card__metadata');
		expect(dl).toBeTruthy();
		const dts = dl?.querySelectorAll('dt');
		const dds = dl?.querySelectorAll('dd');
		expect(dts?.length).toBe(2);
		expect(dds?.length).toBe(2);
		expect(dts?.[0]?.textContent).toBe('Version');
		expect(dds?.[0]?.textContent).toBe('v1.4.12');
	});

	it('renders cost + activity slots inside the signals row', () => {
		const { container } = render(FleetCard, {
			name: 'x',
			cost: snippetOf('<div data-test="cost"></div>'),
			activity: snippetOf('<div data-test="activity"></div>'),
		});
		expect(container.querySelector('[data-test="cost"]')).toBeTruthy();
		expect(container.querySelector('[data-test="activity"]')).toBeTruthy();
		expect(container.querySelector('.gr-host-platform-fleet-card__signals')).toBeTruthy();
	});

	it('wraps the actions slot in a role=group with an aria-label', () => {
		const { container } = render(FleetCard, {
			name: 'x',
			actions: snippetOf('<button type="button">Manage</button>'),
		});
		const actions = container.querySelector('.gr-host-platform-fleet-card__actions');
		expect(actions?.getAttribute('role')).toBe('group');
		expect(actions?.getAttribute('aria-label')).toBe('Fleet actions');
		expect(actions?.querySelector('button')).toBeTruthy();
	});

	it('applies variant + custom class names', () => {
		const { container } = render(FleetCard, {
			name: 'x',
			variant: 'elevated',
			class: 'host-card',
		});
		const root = container.querySelector('.gr-host-platform-fleet-card');
		expect(root?.classList.contains('gr-host-platform-fleet-card--variant-elevated')).toBe(true);
		expect(root?.classList.contains('host-card')).toBe(true);
	});

	it('does not set inline style attribute on the root', () => {
		const { container } = render(FleetCard, { name: 'x' });
		expect(container.querySelector('.gr-host-platform-fleet-card')?.hasAttribute('style')).toBe(
			false
		);
	});

	it('produces unique title ids across multiple FleetCards', () => {
		const a = render(FleetCard, { name: 'alpha' });
		const b = render(FleetCard, { name: 'beta' });
		const ida = a.container
			.querySelector('.gr-host-platform-fleet-card__title')
			?.getAttribute('id');
		const idb = b.container
			.querySelector('.gr-host-platform-fleet-card__title')
			?.getAttribute('id');
		expect(ida).toBeTruthy();
		expect(idb).toBeTruthy();
		expect(ida).not.toBe(idb);
	});
});
