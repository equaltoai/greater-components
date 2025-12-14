import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import ModerationHarness from './ModerationHarness.svelte';
import type { AdminUser, AdminHandlers } from '../src/context.svelte.js';

describe('Admin.Moderation Component', () => {
	const mockUser: AdminUser = {
		id: '1',
		username: 'baduser',
		email: 'bad@example.com',
		displayName: 'Bad User',
		createdAt: '2024-01-01T00:00:00Z',
		role: 'user',
		status: 'active',
		postsCount: 10,
		followersCount: 5,
	};

	const mockSuspendedUser: AdminUser = {
		...mockUser,
		id: '2',
		username: 'suspendeduser',
		status: 'suspended',
	};

	let handlers: AdminHandlers;

	beforeEach(() => {
		handlers = {
			onSearchUsers: vi.fn().mockImplementation(async (query) => {
				if (query === 'bad') return [mockUser];
				if (query === 'suspended') return [mockSuspendedUser];
				return [];
			}),
			onSuspendUser: vi.fn().mockResolvedValue(undefined),
			onUnsuspendUser: vi.fn().mockResolvedValue(undefined),
		};
	});

	it('renders search interface initially', async () => {
		render(ModerationHarness, { handlers });

		expect(screen.getByText('Moderation Tools')).toBeTruthy();
		expect(screen.getByPlaceholderText('Search by username or email...')).toBeTruthy();
		expect(screen.getByText('Quick User Lookup')).toBeTruthy();
	});

	it('searches for users', async () => {
		render(ModerationHarness, { handlers });

		const input = screen.getByPlaceholderText('Search by username or email...');
		await fireEvent.input(input, { target: { value: 'bad' } });

		const searchButton = screen.getByText('Search');
		await fireEvent.click(searchButton);

		await waitFor(() => {
			expect(screen.getByText('@baduser')).toBeTruthy();
		});

		expect(handlers.onSearchUsers).toHaveBeenCalledWith('bad');
	});

	it('selects a user and shows actions', async () => {
		render(ModerationHarness, { handlers });

		// Search first
		const input = screen.getByPlaceholderText('Search by username or email...');
		await fireEvent.input(input, { target: { value: 'bad' } });
		const searchButton = screen.getByText('Search');
		await fireEvent.click(searchButton);

		await waitFor(() => {
			expect(screen.getByText('@baduser')).toBeTruthy();
		});

		// Click select
		const selectButton = screen.getByText('Select');
		await fireEvent.click(selectButton);

		// Check selected user view
		expect(screen.getByText('Moderation Action')).toBeTruthy();
		// It appears in both results and selected view
		expect(screen.getAllByText('@baduser').length).toBeGreaterThan(1);

		// Check available actions for active user
		expect(screen.getByText('Suspend User')).toBeTruthy();
		// Unsuspend should NOT be visible or disabled/hidden?
		// The code uses `{#if selectedUser.status === 'active'}`
		expect(screen.queryByText('Unsuspend User')).toBeNull();
	});

	it('suspends a user with reason', async () => {
		render(ModerationHarness, { handlers });

		// Search and select
		const input = screen.getByPlaceholderText('Search by username or email...');
		await fireEvent.input(input, { target: { value: 'bad' } });
		await fireEvent.click(screen.getByText('Search'));
		await waitFor(() => expect(screen.getByText('@baduser')).toBeTruthy());
		await fireEvent.click(screen.getByText('Select'));

		// Click suspend action
		const suspendAction = screen.getByText('Suspend User');
		await fireEvent.click(suspendAction);

		// Check form appears
		expect(screen.getByText('Reason (Required)')).toBeTruthy();

		// Try to submit without reason (should be disabled or alert)
		const submitButton = screen.getByRole('button', { name: 'Suspend' });
		expect(submitButton.hasAttribute('disabled')).toBe(true);

		// Enter reason
		const reasonInput = screen.getByPlaceholderText('Enter reason for suspension...');
		await fireEvent.input(reasonInput, { target: { value: 'Spamming' } });

		expect(submitButton.hasAttribute('disabled')).toBe(false);

		// Submit
		await fireEvent.click(submitButton);

		await waitFor(() => {
			expect(handlers.onSuspendUser).toHaveBeenCalledWith('1', 'Spamming');
		});

		// Should clear selection
		expect(screen.queryByText('Moderation Action')).toBeNull();
	});

	it('unsuspends a user', async () => {
		render(ModerationHarness, { handlers });

		// Search suspended user
		const input = screen.getByPlaceholderText('Search by username or email...');
		await fireEvent.input(input, { target: { value: 'suspended' } });
		await fireEvent.click(screen.getByText('Search'));
		await waitFor(() => expect(screen.getByText('@suspendeduser')).toBeTruthy());
		await fireEvent.click(screen.getByText('Select'));

		// Check actions
		expect(screen.queryByText('Suspend User')).toBeNull();
		const unsuspendAction = screen.getByText('Unsuspend User');
		await fireEvent.click(unsuspendAction);

		// Check form
		expect(screen.getByText(/This will restore access for/)).toBeTruthy();

		// Submit
		const submitButton = screen.getByRole('button', { name: 'Unsuspend' });
		await fireEvent.click(submitButton);

		await waitFor(() => {
			expect(handlers.onUnsuspendUser).toHaveBeenCalledWith('2');
		});
	});

	it('clears selection', async () => {
		render(ModerationHarness, { handlers });

		// Search and select
		const input = screen.getByPlaceholderText('Search by username or email...');
		await fireEvent.input(input, { target: { value: 'bad' } });
		await fireEvent.click(screen.getByText('Search'));
		await waitFor(() => expect(screen.getByText('@baduser')).toBeTruthy());
		await fireEvent.click(screen.getByText('Select'));

		// Click Clear
		const clearButton = screen.getByText('Clear');
		await fireEvent.click(clearButton);

		expect(screen.queryByText('Moderation Action')).toBeNull();
		expect(screen.getByText('Quick User Lookup')).toBeTruthy();
	});
});
