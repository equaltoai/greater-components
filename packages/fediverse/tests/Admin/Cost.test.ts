import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import type { LesserGraphQLAdapter } from '@greater/adapters';
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
