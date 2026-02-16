import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import ReportsHarness from './ReportsHarness.svelte';
import type { AdminHandlers, AdminReport } from '../src/context.svelte.js';

describe('Admin.Reports Component', () => {
	const mockReports: AdminReport[] = [
		{
			id: '1',
			reporter: { id: 'r1', username: 'reporter1' },
			target: { id: 't1', username: 'target1', type: 'user' },
			reason: 'Harassment',
			status: 'pending',
			createdAt: '2024-01-01T10:00:00Z',
		},
		{
			id: '2',
			reporter: { id: 'r2', username: 'reporter2' },
			target: { id: 't2', username: 'target2', type: 'post' },
			reason: 'Spam',
			status: 'resolved',
			createdAt: '2024-01-01T11:00:00Z',
		},
	];

	let handlers: AdminHandlers;

	beforeEach(() => {
		handlers = {
			onFetchReports: vi.fn().mockResolvedValue(mockReports),
			onResolveReport: vi.fn().mockResolvedValue(undefined),
			onDismissReport: vi.fn().mockResolvedValue(undefined),
		};
	});

	it('renders reports with data', async () => {
		render(ReportsHarness, { handlers });

		await waitFor(() => {
			expect(screen.getByText('Reports')).toBeTruthy();
		});

		expect(screen.getByText('@reporter1')).toBeTruthy();
		expect(screen.getByText('@target1')).toBeTruthy();
		expect(screen.getByText('Harassment')).toBeTruthy();
		expect(screen.getByText('pending')).toBeTruthy();
	});

	it('resolves a report', async () => {
		render(ReportsHarness, { handlers });

		await waitFor(() => {
			expect(screen.getByText('Harassment')).toBeTruthy();
		});

		const reportCard = screen.getByRole('button', { name: /Harassment/i });
		await fireEvent.click(reportCard);

		const resolveButton = await screen.findByText('Resolve');
		await fireEvent.click(resolveButton);

		expect(handlers.onResolveReport).toHaveBeenCalledWith('1', 'suspend');
	});

	it('dismisses a report', async () => {
		render(ReportsHarness, { handlers });

		await waitFor(() => {
			expect(screen.getByText('Harassment')).toBeTruthy();
		});

		const reportCard = screen.getByRole('button', { name: /Harassment/i });
		await fireEvent.click(reportCard);

		const dismissButton = await screen.findByText('Dismiss');
		await fireEvent.click(dismissButton);

		expect(handlers.onDismissReport).toHaveBeenCalledWith('1');
	});
});
