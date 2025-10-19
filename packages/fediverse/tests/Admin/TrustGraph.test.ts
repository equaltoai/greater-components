import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';
import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
import TrustGraphVisualizationHarness from './TrustGraphVisualizationHarness.svelte';

describe('Admin.TrustGraph.Visualization', () => {
  it('renders relationship and actor summaries from adapter data', async () => {
    const edges = [
      {
        from: { id: 'actor-1', username: 'alice', displayName: 'Alice' },
        to: { id: 'actor-2', username: 'bob', displayName: 'Bob' },
        category: 'CONTENT',
        score: 0.82,
        updatedAt: new Date().toISOString(),
      },
      {
        from: { id: 'actor-2', username: 'bob', displayName: 'Bob' },
        to: { id: 'actor-3', username: 'cara', displayName: 'Cara' },
        category: 'BEHAVIOR',
        score: 0.67,
        updatedAt: new Date().toISOString(),
      },
    ];

    const adapter = {
      getTrustGraph: vi.fn().mockResolvedValue(edges),
    } as unknown as LesserGraphQLAdapter;

    render(TrustGraphVisualizationHarness, {
      props: {
        adapter,
        rootActorId: 'actor-1',
      },
    });

    expect(adapter.getTrustGraph).toHaveBeenCalledWith('actor-1', undefined);

    const summary = await screen.findByTestId('trust-graph-summary');
    const nodeElements = screen.getAllByTestId('trust-graph-node');
    expect(nodeElements.length).toBeGreaterThanOrEqual(1);
    expect(summary.textContent).toContain('Relationships');
    expect(summary.textContent).toContain('Unique Actors');

    const canvas = screen.getByTestId('trust-graph-canvas');
    expect(canvas.tagName.toLowerCase()).toBe('svg');

    const renderedEdges = screen.getAllByTestId('trust-graph-edge');
    expect(renderedEdges).toHaveLength(2);
    expect(nodeElements.length).toBeGreaterThanOrEqual(3);

    // Ensure labels render within the SVG
    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('Bob')).toBeTruthy();
  });

  it('shows error state when adapter throws', async () => {
    const adapter = {
      getTrustGraph: vi.fn().mockRejectedValue(new Error('failed to load')),
    } as unknown as LesserGraphQLAdapter;

    render(TrustGraphVisualizationHarness, {
      props: {
        adapter,
        rootActorId: 'actor-err',
      },
    });

    await waitFor(() => {
      screen.getByText(/Error: failed to load/i);
    });
  });
});
