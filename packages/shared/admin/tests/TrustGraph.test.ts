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

import TrustGraphRelationshipListHarness from './TrustGraphRelationshipListHarness.svelte';

describe('Admin.TrustGraph.RelationshipList', () => {
	it('renders table with relationships', async () => {
		const edges = [
			{
				from: { id: 'actor-1', username: 'alice', displayName: 'Alice' },
				to: { id: 'actor-2', username: 'bob', displayName: 'Bob' },
				category: 'CONTENT',
				score: 0.85,
				updatedAt: '2023-01-01T12:00:00Z',
			},
			{
				from: { id: 'actor-2', username: 'bob', displayName: 'Bob' },
				to: { id: 'actor-3', username: 'charlie', displayName: 'Charlie' },
				category: 'BEHAVIOR',
				score: 0.45,
				updatedAt: '2023-01-02T12:00:00Z',
			},
		];

		const adapter = {
			getTrustGraph: vi.fn().mockResolvedValue(edges),
		} as unknown as LesserGraphQLAdapter;

		render(TrustGraphRelationshipListHarness, {
			props: {
				adapter,
				rootActorId: 'actor-1',
			},
		});

		expect(adapter.getTrustGraph).toHaveBeenCalledWith('actor-1', undefined);

		await waitFor(() => {
			expect(screen.getByText('Alice')).toBeTruthy();
			expect(screen.getAllByText('Bob').length).toBeGreaterThan(0);
			expect(screen.getByText('Charlie')).toBeTruthy();
		});

		expect(screen.getByText('85.0%')).toBeTruthy();
		expect(screen.getByText('45.0%')).toBeTruthy();
		expect(screen.getByText('CONTENT')).toBeTruthy();
		expect(screen.getByText('BEHAVIOR')).toBeTruthy();
	});

	it('shows empty state when no relationships found', async () => {
		const adapter = {
			getTrustGraph: vi.fn().mockResolvedValue([]),
		} as unknown as LesserGraphQLAdapter;

		render(TrustGraphRelationshipListHarness, {
			props: {
				adapter,
				rootActorId: 'actor-empty',
			},
		});

		await waitFor(() => {
			expect(screen.getByText('No trust relationships found.')).toBeTruthy();
		});
	});

	it('shows loading state initially', async () => {
		let resolvePromise: (value: any) => void;
		const promise = new Promise((resolve) => {
			resolvePromise = resolve;
		});
		
		const adapter = {
			getTrustGraph: vi.fn().mockReturnValue(promise),
		} as unknown as LesserGraphQLAdapter;

		render(TrustGraphRelationshipListHarness, {
			props: {
				adapter,
				rootActorId: 'actor-loading',
			},
		});

		expect(screen.getByText('Loading relationships...')).toBeTruthy();

		resolvePromise!([]);
		await waitFor(() => {
			expect(screen.queryByText('Loading relationships...')).toBeNull();
		});
	});

	it('shows error state and allows retry', async () => {
		const adapter = {
			getTrustGraph: vi.fn()
				.mockRejectedValueOnce(new Error('Network error'))
				.mockResolvedValueOnce([]),
		} as unknown as LesserGraphQLAdapter;

		render(TrustGraphRelationshipListHarness, {
			props: {
				adapter,
				rootActorId: 'actor-error',
			},
		});

		await waitFor(() => {
			expect(screen.getByText('Error: Network error')).toBeTruthy();
		});

		const retryButton = screen.getByText('Retry');
		retryButton.click();

		await waitFor(() => {
			expect(screen.getByText('No trust relationships found.')).toBeTruthy();
		});
		
		expect(adapter.getTrustGraph).toHaveBeenCalledTimes(2);
	});
	
	it('applies correct score classes', async () => {
		const edges = [
			{
				from: { id: 'a1', username: 'u1', displayName: 'U1' },
				to: { id: 'a2', username: 'u2', displayName: 'U2' },
				category: 'C1',
				score: 0.9,
				updatedAt: new Date().toISOString(),
			},
			{
				from: { id: 'a1', username: 'u1', displayName: 'U1' },
				to: { id: 'a3', username: 'u3', displayName: 'U3' },
				category: 'C1',
				score: 0.6,
				updatedAt: new Date().toISOString(),
			},
			{
				from: { id: 'a1', username: 'u1', displayName: 'U1' },
				to: { id: 'a4', username: 'u4', displayName: 'U4' },
				category: 'C1',
				score: 0.35,
				updatedAt: new Date().toISOString(),
			},
			{
				from: { id: 'a1', username: 'u1', displayName: 'U1' },
				to: { id: 'a5', username: 'u5', displayName: 'U5' },
				category: 'C1',
				score: 0.1,
				updatedAt: new Date().toISOString(),
			},
		];

		const adapter = {
			getTrustGraph: vi.fn().mockResolvedValue(edges),
		} as unknown as LesserGraphQLAdapter;

		render(TrustGraphRelationshipListHarness, {
			props: {
				adapter,
				rootActorId: 'actor-scores',
			},
		});

		await waitFor(() => {
			const high = screen.getByText('90.0%');
			expect(high.classList.contains('trust-relationship-list__score--high')).toBe(true);
			
			const medium = screen.getByText('60.0%');
			expect(medium.classList.contains('trust-relationship-list__score--medium')).toBe(true);

			const low = screen.getByText('35.0%');
			expect(low.classList.contains('trust-relationship-list__score--low')).toBe(true);

			const veryLow = screen.getByText('10.0%');
			expect(veryLow.classList.contains('trust-relationship-list__score--very-low')).toBe(true);
		});
	});
});
