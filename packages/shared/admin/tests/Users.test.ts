import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import UsersHarness from './UsersHarness.svelte';
import type { AdminUser, AdminHandlers } from '../src/context.svelte.js';

describe('Admin.Users Component', () => {
	const mockUsers: AdminUser[] = [
		{
			id: '1',
			username: 'admin',
			email: 'admin@example.com',
			displayName: 'Admin User',
			createdAt: '2024-01-01T00:00:00Z',
			role: 'admin',
			status: 'active',
			postsCount: 500,
			followersCount: 200,
		},
		{
			id: '2',
			username: 'moderator',
			email: 'mod@example.com',
			displayName: 'Mod User',
			createdAt: '2024-01-02T00:00:00Z',
			role: 'moderator',
			status: 'active',
			postsCount: 300,
			followersCount: 150,
		},
		{
			id: '3',
			username: 'user1',
			email: 'user1@example.com',
			displayName: 'Regular User',
			createdAt: '2024-01-03T00:00:00Z',
			role: 'user',
			status: 'suspended',
			postsCount: 100,
			followersCount: 50,
		},
	];

	let handlers: AdminHandlers;

	beforeEach(() => {
		handlers = {
			onFetchUsers: vi.fn().mockResolvedValue(mockUsers),
			onSuspendUser: vi.fn().mockResolvedValue(undefined),
			onUnsuspendUser: vi.fn().mockResolvedValue(undefined),
			onChangeUserRole: vi.fn().mockResolvedValue(undefined),
		};
	});

	it('renders users table with data', async () => {
		render(UsersHarness, { handlers });

		// Wait for users to be loaded
		await waitFor(() => {
			expect(screen.getByText('Admin User')).toBeTruthy();
		});

		expect(screen.getByText('Mod User')).toBeTruthy();
		expect(screen.getByText('Regular User')).toBeTruthy();
		expect(screen.getByText('admin@example.com')).toBeTruthy();

		// Check stats
		expect(screen.getByText('3 users')).toBeTruthy();
	});

	it('filters users by role', async () => {
		render(UsersHarness, { handlers });

		await waitFor(() => {
			expect(screen.getByText('Admin User')).toBeTruthy();
		});

		const roleSelect = screen.getByLabelText('Role');
		await fireEvent.change(roleSelect, { target: { value: 'admin' } });

		expect(handlers.onFetchUsers).toHaveBeenCalledWith(expect.objectContaining({ role: 'admin' }));
	});

	it('filters users by status', async () => {
		render(UsersHarness, { handlers });

		await waitFor(() => {
			expect(screen.getByText('Admin User')).toBeTruthy();
		});

		const statusSelect = screen.getByLabelText('Status');
		await fireEvent.change(statusSelect, { target: { value: 'suspended' } });

		expect(handlers.onFetchUsers).toHaveBeenCalledWith(
			expect.objectContaining({ status: 'suspended' })
		);
	});

	it('searches users', async () => {
		render(UsersHarness, { handlers });

		await waitFor(() => {
			expect(screen.getByText('Admin User')).toBeTruthy();
		});

		const searchInput = screen.getByPlaceholderText('Search by username or email...');
		await fireEvent.input(searchInput, { target: { value: 'mod' } });

		const searchButton = screen.getByLabelText('Search users');
		await fireEvent.click(searchButton);

		expect(handlers.onFetchUsers).toHaveBeenCalledWith(expect.objectContaining({ search: 'mod' }));
	});

	it('opens suspend modal and suspends user', async () => {
		render(UsersHarness, { handlers });

		await waitFor(() => {
			expect(screen.getByText('Admin User')).toBeTruthy();
		});

		// Find suspend button for the moderator (active)
		const suspendButtons = screen.getAllByTitle('Suspend user');
		await fireEvent.click(suspendButtons[0]);

		// Check modal is open
		expect(screen.getByRole('heading', { name: 'Suspend User' })).toBeTruthy();
		expect(screen.getByText(/You are about to suspend/)).toBeTruthy();

		// Fill reason
		const reasonInput = screen.getByLabelText('Reason');
		await fireEvent.input(reasonInput, { target: { value: 'Violation of rules' } });

		// Click suspend
		const confirmButton = screen.getByRole('button', { name: 'Suspend User' });
		await fireEvent.click(confirmButton);

		await waitFor(() => {
			expect(handlers.onSuspendUser).toHaveBeenCalledWith(expect.any(String), 'Violation of rules');
		});

		// Should reload users
		expect(handlers.onFetchUsers).toHaveBeenCalledTimes(2);
	});

	it('unsuspends user', async () => {
		render(UsersHarness, { handlers });

		await waitFor(() => {
			expect(screen.getByText('Regular User')).toBeTruthy();
		});

		// Find unsuspend button for user1 (suspended)
		const unsuspendButton = screen.getByTitle('Unsuspend user');
		await fireEvent.click(unsuspendButton);

		await waitFor(() => {
			expect(handlers.onUnsuspendUser).toHaveBeenCalledWith('3');
		});

		// Should reload users
		expect(handlers.onFetchUsers).toHaveBeenCalledTimes(2);
	});

	it('opens role modal and changes role', async () => {
		render(UsersHarness, { handlers });

		await waitFor(() => {
			expect(screen.getByText('Regular User')).toBeTruthy();
		});

		// Find change role button for user1
		const changeRoleButtons = screen.getAllByTitle('Change role');
		await fireEvent.click(changeRoleButtons[2]); // 3rd user

		// Check modal is open
		expect(screen.getByText('Change User Role')).toBeTruthy();

		// Select new role
		const roleSelect = screen.getByLabelText('New Role');
		await fireEvent.change(roleSelect, { target: { value: 'moderator' } });

		// Click change
		const confirmButton = screen.getByRole('button', { name: 'Change Role' });
		await fireEvent.click(confirmButton);

		await waitFor(() => {
			expect(handlers.onChangeUserRole).toHaveBeenCalledWith('3', 'moderator');
		});

		// Should reload users
		expect(handlers.onFetchUsers).toHaveBeenCalledTimes(2);
	});
});
