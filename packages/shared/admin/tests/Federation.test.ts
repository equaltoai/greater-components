import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import FederationHarness from './FederationHarness.svelte';
import type { AdminHandlers, FederatedInstance } from '../src/context.svelte.js';

describe('Admin.Federation Component', () => {
	const mockInstances: FederatedInstance[] = [
		{
			domain: 'example.com',
			softwareName: 'Mastodon',
			softwareVersion: '4.2.0',
			usersCount: 1000,
			status: 'allowed',
			lastSeen: '2024-01-01T10:00:00Z',
		},
		{
			domain: 'spam.com',
			softwareName: 'Pleroma',
			status: 'blocked',
			lastSeen: '2024-01-01T09:00:00Z',
		},
		{
			domain: 'limited.com',
			status: 'limited',
		},
	];

	let handlers: AdminHandlers;

	beforeEach(() => {
		handlers = {
			onFetchInstances: vi.fn().mockResolvedValue(mockInstances),
			onBlockInstance: vi.fn().mockResolvedValue(undefined),
			onUnblockInstance: vi.fn().mockResolvedValue(undefined),
		};
	});

	it('renders instances table with data', async () => {
		render(FederationHarness, { handlers });

		await waitFor(() => {
			expect(screen.getByText('example.com')).toBeTruthy();
		});

		expect(screen.getByText('spam.com')).toBeTruthy();
		expect(screen.getByText('limited.com')).toBeTruthy();

		expect(screen.getByText('Mastodon')).toBeTruthy();
		expect(screen.getByText('v4.2.0')).toBeTruthy();

		expect(screen.getByText('allowed')).toBeTruthy();
		expect(screen.getByText('blocked')).toBeTruthy();
	});

	it('filters instances', async () => {
		render(FederationHarness, { handlers });

		await waitFor(() => {
			expect(screen.getByText('example.com')).toBeTruthy();
		});

		// Filter allowed
		const allowedFilter = screen.getByText('Allowed');
		await fireEvent.click(allowedFilter);

		expect(screen.getByText('example.com')).toBeTruthy();
		expect(screen.queryByText('spam.com')).toBeNull();

		// Filter blocked
		const blockedFilter = screen.getByText('Blocked');
		await fireEvent.click(blockedFilter);

		expect(screen.queryByText('example.com')).toBeNull();
		expect(screen.getByText('spam.com')).toBeTruthy();
	});

	it('opens block modal and blocks instance', async () => {
		render(FederationHarness, { handlers });

		await waitFor(() => {
			expect(screen.getByText('example.com')).toBeTruthy();
		});

		// Find block button for example.com (allowed)
		const blockButtons = screen.getAllByText('Block');
		await fireEvent.click(blockButtons[0]);

		// Check modal
		expect(screen.getByRole('heading', { name: 'Block Instance' })).toBeTruthy();
		expect(screen.getByText('Reason')).toBeTruthy();

		// Enter reason
		const reasonInput = screen.getByLabelText('Reason');
		await fireEvent.input(reasonInput, { target: { value: 'Spam' } });

		// Confirm
		const confirmButton = screen.getByRole('button', { name: 'Block Instance' });
		await fireEvent.click(confirmButton);

		await waitFor(() => {
			expect(handlers.onBlockInstance).toHaveBeenCalledWith('example.com', 'Spam');
		});
	});

	it('unblocks instance', async () => {
		render(FederationHarness, { handlers });

		await waitFor(() => {
			expect(screen.getByText('spam.com')).toBeTruthy();
		});

		// Find unblock button for spam.com (blocked)
		const unblockButton = screen.getByText('Unblock');
		await fireEvent.click(unblockButton);

		expect(handlers.onUnblockInstance).toHaveBeenCalledWith('spam.com');
	});
});
