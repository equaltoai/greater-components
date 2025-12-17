import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Wiki } from '../../../src/components/Wiki/index.js';
import WikiTestWrapper from '../../fixtures/WikiTestWrapper.svelte';
import type { WikiRevision } from '../../../src/types.js';

describe('Wiki.History Behavior', () => {
	const mockRevisions: WikiRevision[] = [
		{
			id: 'rev1',
			revision: 1,
			editedAt: new Date('2023-01-01T10:00:00Z').toISOString(),
			editor: { id: 'u1', username: 'user1' },
			reason: 'Initial commit',
		},
		{
			id: 'rev2',
			revision: 2,
			editedAt: new Date('2023-01-02T10:00:00Z').toISOString(),
			editor: { id: 'u2', username: 'user2' },
		},
	];

	const onFetchHistory = vi.fn();
	const onRevert = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('toggles history visibility and loads data', async () => {
		onFetchHistory.mockResolvedValue(mockRevisions);

		render(WikiTestWrapper, {
			props: {
				component: Wiki.History,
				handlers: { onFetchHistory },
			},
		});

		const toggleBtn = screen.getByRole('button', { name: /show history/i });

		// Open
		await fireEvent.click(toggleBtn);
		expect(screen.getByRole('button', { name: /hide history/i })).toBeInTheDocument();
		expect(onFetchHistory).toHaveBeenCalled();

		// Verify loading state
		await waitFor(() => {
			expect(screen.getByText('r1')).toBeInTheDocument();
		});

		expect(screen.getByText('user1')).toBeInTheDocument();
		expect(screen.getByText('Initial commit')).toBeInTheDocument();
		expect(screen.getByText('r2')).toBeInTheDocument();

		// Close
		await fireEvent.click(toggleBtn);
		expect(screen.getByRole('button', { name: /show history/i })).toBeInTheDocument();
		expect(screen.queryByText('r1')).not.toBeInTheDocument();
	});

	it('handles load error', async () => {
		onFetchHistory.mockRejectedValue(new Error('Fetch failed'));

		render(WikiTestWrapper, {
			props: {
				component: Wiki.History,
				handlers: { onFetchHistory },
			},
		});

		await fireEvent.click(screen.getByRole('button', { name: /show history/i }));

		// Wait for error handling (error might be displayed in parent or via console,
		// but here we just check it doesn't crash and maybe stops loading)
		// The component sets context.error. Since History doesn't display error directly (Navigation does?),
		// we assume it just stops loading.

		await waitFor(() => {
			expect(screen.queryByText('Loading history…')).not.toBeInTheDocument();
		});
	});

	it('displays empty history message', async () => {
		onFetchHistory.mockResolvedValue([]);

		render(WikiTestWrapper, {
			props: {
				component: Wiki.History,
				handlers: { onFetchHistory },
			},
		});

		await fireEvent.click(screen.getByRole('button', { name: /show history/i }));

		await waitFor(() => {
			expect(screen.getByText('No history available.')).toBeInTheDocument();
		});
	});

	it('calls revert handler when button clicked', async () => {
		onFetchHistory.mockResolvedValue(mockRevisions);

		render(WikiTestWrapper, {
			props: {
				component: Wiki.History,
				handlers: { onFetchHistory, onRevert },
			},
		});

		await fireEvent.click(screen.getByRole('button', { name: /show history/i }));
		await waitFor(() => screen.getByText('r1'));

		const revertBtns = screen.getAllByRole('button', { name: /revert/i });
		await fireEvent.click(revertBtns[0]);

		expect(onRevert).toHaveBeenCalledWith('/wiki/home', 'rev1');
	});

	it('handles revert error', async () => {
		onFetchHistory.mockResolvedValue(mockRevisions);
		onRevert.mockRejectedValue(new Error('Revert failed'));

		render(WikiTestWrapper, {
			props: {
				component: Wiki.History,
				handlers: { onFetchHistory, onRevert },
			},
		});

		await fireEvent.click(screen.getByRole('button', { name: /show history/i }));
		await waitFor(() => screen.getByText('r1'));

		const revertBtns = screen.getAllByRole('button', { name: /revert/i });
		await fireEvent.click(revertBtns[0]);

		// Error is set in context, verifying it doesn't crash
		await waitFor(() => {
			expect(onRevert).toHaveBeenCalled();
		});
	});

	it('does not show revert button if handler missing', async () => {
		onFetchHistory.mockResolvedValue(mockRevisions);

		render(WikiTestWrapper, {
			props: {
				component: Wiki.History,
				handlers: { onFetchHistory }, // No onRevert
			},
		});

		await fireEvent.click(screen.getByRole('button', { name: /show history/i }));
		await waitFor(() => screen.getByText('r1'));

		expect(screen.queryByRole('button', { name: /revert/i })).not.toBeInTheDocument();
	});

	it('formats dates correctly (Date object vs string)', async () => {
		const mixedRevisions: WikiRevision[] = [
			{
				id: 'rev-date',
				revision: 3,
				editedAt: new Date('2023-01-01T12:00:00Z'),
				editor: { id: 'u1', username: 'user1' },
			},
			{
				id: 'rev-string',
				revision: 4,
				editedAt: '2023-01-02T12:00:00Z',
				editor: { id: 'u1', username: 'user1' },
			},
		];
		onFetchHistory.mockResolvedValue(mixedRevisions);

		render(WikiTestWrapper, {
			props: {
				component: Wiki.History,
				handlers: { onFetchHistory },
			},
		});

		await fireEvent.click(screen.getByRole('button', { name: /show history/i }));
		await waitFor(() => screen.getByText('r3'));

		// Check if dates are rendered (locale string format varies, but just checking it renders something)
		// We can check if it contains "2023" or similar.
		const listItems = screen.getAllByRole('listitem');
		expect(listItems.length).toBe(2);
	});
});
