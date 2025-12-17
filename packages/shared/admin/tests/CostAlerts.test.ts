import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import CostAlertsHarness from './CostAlertsHarness.svelte';
import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';

describe('Admin.Cost.Alerts Component', () => {
	const mockAdapter = {} as LesserGraphQLAdapter;

	it('renders empty state when no alerts', () => {
		render(CostAlertsHarness, { props: { adapter: mockAdapter } });

		expect(screen.getByText('Cost Alerts')).toBeTruthy();
		expect(screen.getByText('No active cost alerts.')).toBeTruthy();
	});

	it('renders alerts when provided', () => {
		const alerts = [
			{ id: '1', message: 'Budget exceeded 80%' },
			{ id: '2', message: 'Projected cost high' },
		];

		render(CostAlertsHarness, { props: { adapter: mockAdapter, alerts } });

		expect(screen.getByText('Cost Alerts')).toBeTruthy();
		expect(screen.getByText('Budget exceeded 80%')).toBeTruthy();
		expect(screen.getByText('Projected cost high')).toBeTruthy();
	});
});
