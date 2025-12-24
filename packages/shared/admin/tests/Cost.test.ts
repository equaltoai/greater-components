import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
import CostDashboardHarness from './CostDashboardHarness.svelte';

describe('Admin.Cost.Dashboard', () => {
	it('loads cost breakdown from adapter and renders summary', async () => {
		const data = {
			totalCost: 2_500_000,
			breakdown: [
				{ operation: 'timelineDelivery', cost: 1_250_000, count: 42 },
				{ operation: 'mediaProcessing', cost: 750_000, count: 18 },
				{ operation: 'aiAnalysis', cost: 500_000, count: 7 },
			],
		};

		const adapter = {
			getCostBreakdown: vi.fn().mockResolvedValue(data),
		} as unknown as LesserGraphQLAdapter;

		render(CostDashboardHarness, {
			props: {
				adapter,
				period: 'DAY',
			},
		});

		await screen.findByText('Cost Dashboard');
		expect(adapter.getCostBreakdown).toHaveBeenCalledWith('DAY');
		expect(screen.getByText('Total: $2.5000')).toBeTruthy();
		expect(screen.getByText(/timelineDelivery/)).toBeTruthy();
		expect(screen.getByText(/mediaProcessing/)).toBeTruthy();
		expect(screen.getByText(/aiAnalysis/)).toBeTruthy();
	});
});

import CostBudgetControlsHarness from './CostBudgetControlsHarness.svelte';
import { fireEvent, waitFor } from '@testing-library/svelte';

describe('Admin.Cost.BudgetControls', () => {
	it('loads budgets and allows saving new budget', async () => {
		const budgets = [
			{ domain: 'example.com', monthlyBudgetUSD: 50, currentSpendUSD: 12 },
			{ domain: 'test.org', monthlyBudgetUSD: 100, currentSpendUSD: 95 },
		];

		const adapter = {
			getInstanceBudgets: vi.fn().mockResolvedValue(budgets),
			setInstanceBudget: vi.fn().mockResolvedValue(undefined),
		} as unknown as LesserGraphQLAdapter;

		render(CostBudgetControlsHarness, {
			props: { adapter },
		});

		expect(screen.getByText('Loading...')).toBeTruthy();

		await waitFor(() => {
			expect(screen.getByText('example.com: $50 (Current: $12)')).toBeTruthy();
			expect(screen.getByText('test.org: $100 (Current: $95)')).toBeTruthy();
		});

		const domainInput = screen.getByPlaceholderText('Instance domain');
		const amountInput = screen.getByPlaceholderText('Monthly budget (USD)');
		const saveButton = screen.getByText('Save Budget');

		await fireEvent.input(domainInput, { target: { value: 'new.com' } });
		await fireEvent.input(amountInput, { target: { value: '200' } });

		await fireEvent.click(saveButton);

		expect(adapter.setInstanceBudget).toHaveBeenCalledWith('new.com', 200, false);
		expect(adapter.getInstanceBudgets).toHaveBeenCalledTimes(2); // Initial + after save
	});
});
