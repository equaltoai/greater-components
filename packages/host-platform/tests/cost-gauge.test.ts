import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import CostGauge from '../src/components/CostGauge.svelte';

describe('CostGauge', () => {
	it('renders a role="meter" with the required ARIA value attributes', () => {
		const { container } = render(CostGauge, {
			current: 42.5,
			limit: 100,
			currency: 'USD',
			label: 'Monthly spend',
		});
		const meter = container.querySelector('[role="meter"]');
		expect(meter).toBeTruthy();
		expect(meter?.getAttribute('aria-valuemin')).toBe('0');
		expect(meter?.getAttribute('aria-valuemax')).toBe('100');
		expect(meter?.getAttribute('aria-valuenow')).toBe('42.5');
		expect(meter?.getAttribute('aria-valuetext')).toBe('$42.50 of $100.00');
		// aria-labelledby points at the visible label.
		const labelledby = meter?.getAttribute('aria-labelledby');
		expect(labelledby).toBeTruthy();
		const labelEl = container.ownerDocument.getElementById(labelledby!);
		expect(labelEl?.textContent).toBe('Monthly spend');
	});

	it('uses aria-label fallback when no `label` prop is supplied', () => {
		const { container } = render(CostGauge, { current: 5, limit: 100 });
		const meter = container.querySelector('[role="meter"]');
		expect(meter?.getAttribute('aria-label')).toBe('Cost gauge');
		expect(meter?.hasAttribute('aria-labelledby')).toBe(false);
	});

	it('drives the fill width via data-ratio (strict-CSP safe, no inline style)', () => {
		const { container } = render(CostGauge, {
			current: 42.5,
			limit: 100,
		});
		const meter = container.querySelector('[role="meter"]');
		expect(meter?.getAttribute('data-ratio')).toBe('43'); // rounded ratio*100
		// Strict-CSP: meter must NOT have a style attribute.
		expect(meter?.hasAttribute('style')).toBe(false);
		expect(container.querySelector('.gr-host-platform-cost-gauge')?.hasAttribute('style')).toBe(
			false
		);
	});

	it.each([
		[10, 'ok', '●', 'Within budget'],
		[80, 'warning', '▲', 'Approaching limit'],
		[95, 'danger', '■', 'Over budget'],
	])(
		'derives status %s%% → %s with icon %s and label %s (non-color-only)',
		(current, expectedStatus, expectedIcon, expectedLabel) => {
			const { container } = render(CostGauge, {
				current: current as number,
				limit: 100,
			});
			const statusEl = container.querySelector(
				`.gr-host-platform-cost-gauge__status--${expectedStatus}`
			);
			expect(statusEl).toBeTruthy();
			expect(statusEl?.getAttribute('aria-label')).toBe(`Status: ${expectedLabel}`);
			expect(
				statusEl?.querySelector('.gr-host-platform-cost-gauge__status-icon')?.textContent
			).toBe(expectedIcon);
			expect(
				statusEl?.querySelector('.gr-host-platform-cost-gauge__status-label')?.textContent
			).toBe(expectedLabel);
		}
	);

	it('respects explicit status override', () => {
		const { container } = render(CostGauge, {
			current: 5,
			limit: 100,
			status: 'danger',
		});
		expect(container.querySelector('.gr-host-platform-cost-gauge__status--danger')).toBeTruthy();
	});

	it('respects custom thresholds', () => {
		const { container } = render(CostGauge, {
			current: 50,
			limit: 100,
			thresholds: { warning: 0.4, danger: 0.6 },
		});
		expect(container.querySelector('.gr-host-platform-cost-gauge__status--warning')).toBeTruthy();
	});

	it('clamps ratios above 100% so data-ratio never exceeds 100', () => {
		const { container } = render(CostGauge, {
			current: 250,
			limit: 100,
		});
		const meter = container.querySelector('[role="meter"]');
		expect(meter?.getAttribute('data-ratio')).toBe('100');
	});

	it('handles zero / negative limits without producing invalid attributes', () => {
		const { container } = render(CostGauge, {
			current: 10,
			limit: 0,
		});
		const meter = container.querySelector('[role="meter"]');
		expect(meter?.getAttribute('data-ratio')).toBe('0');
		expect(meter?.getAttribute('aria-valuenow')).toBe('10');
		expect(meter?.getAttribute('aria-valuemax')).toBe('0');
	});

	it('renders description with linked aria-describedby', () => {
		const { container } = render(CostGauge, {
			current: 10,
			limit: 100,
			label: 'Monthly spend',
			description: 'Billed on the 1st of every month.',
		});
		const descId = container
			.querySelector('.gr-host-platform-cost-gauge__description')
			?.getAttribute('id');
		expect(descId).toBeTruthy();
		const meter = container.querySelector('[role="meter"]');
		expect(meter?.getAttribute('aria-describedby')).toBe(descId);
	});

	it('supports a custom formatter', () => {
		const { container } = render(CostGauge, {
			current: 1234,
			limit: 5000,
			formatValue: (value, currency) => `${currency} ${value.toFixed(0)}`,
			currency: 'USD',
			label: 'Monthly spend',
		});
		const meter = container.querySelector('[role="meter"]');
		expect(meter?.getAttribute('aria-valuetext')).toBe('USD 1234 of USD 5000');
	});

	it('produces unique meter / label ids across multiple gauges', () => {
		const a = render(CostGauge, { current: 1, limit: 100, label: 'A' });
		const b = render(CostGauge, { current: 1, limit: 100, label: 'B' });
		const ida = a.container
			.querySelector('.gr-host-platform-cost-gauge__label')
			?.getAttribute('id');
		const idb = b.container
			.querySelector('.gr-host-platform-cost-gauge__label')
			?.getAttribute('id');
		expect(ida).toBeTruthy();
		expect(idb).toBeTruthy();
		expect(ida).not.toBe(idb);
	});
});
