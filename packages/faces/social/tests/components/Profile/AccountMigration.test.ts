import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AccountMigrationTest from './AccountMigrationTest.svelte';

describe('AccountMigration', () => {
	const originalConfirm = global.confirm;

	beforeEach(() => {
		global.confirm = vi.fn(() => true);
	});

	afterEach(() => {
		global.confirm = originalConfirm;
		vi.restoreAllMocks();
	});

	const renderComponent = (props = {}) => {
		return render(AccountMigrationTest, {
			props: {
				handlers: {
					onInitiateMigration: vi.fn(),
					onCancelMigration: vi.fn(),
				},
				...props,
			},
		});
	};

	describe('Visitor view', () => {
		it('renders "This account has moved" notice when completed', () => {
			renderComponent({
				isOwnProfile: false,
				migration: {
					status: 'completed',
					targetAccount: {
						id: '2',
						username: 'newaccount',
						displayName: 'New Account',
						avatar: 'https://example.com/avatar.jpg',
					},
					movedAt: '2023-01-01',
				},
			});

			expect(screen.getByText('This account has moved')).toBeTruthy();
			expect(screen.getByText('The owner of this account has migrated to:')).toBeTruthy();
			expect(screen.getByText('New Account')).toBeTruthy();
			expect(screen.getByText('@newaccount')).toBeTruthy();
		});

		it('renders notice without target account if missing', () => {
			renderComponent({
				isOwnProfile: false,
				migration: {
					status: 'completed',
					movedAt: '2023-01-01',
				},
			});

			expect(screen.getByText('This account has moved')).toBeTruthy();
			expect(screen.queryByText('@newaccount')).toBeNull();
		});

		it('does not render anything if not completed', () => {
			const { container } = renderComponent({
				isOwnProfile: false,
				migration: {
					status: 'pending',
					targetAccount: { username: 'newaccount' },
				},
			});

			expect(container.querySelector('.account-migration__notice')).toBeNull();
		});
	});

	describe('Own profile', () => {
		it('toggles migration form when "Initiate Migration" is clicked', async () => {
			renderComponent({ isOwnProfile: true, migration: null });

			const initiateButton = screen.getByText('Initiate Migration');
			await fireEvent.click(initiateButton);

			expect(screen.getByPlaceholderText('@username@instance.com')).toBeTruthy();
			expect(screen.getByText('Cancel')).toBeTruthy();
			expect(screen.getByText('Start Migration')).toBeTruthy();
		});

		it('validates account handle and enables submit', async () => {
			renderComponent({ isOwnProfile: true, migration: null });

			await fireEvent.click(screen.getByText('Initiate Migration'));
			const input = screen.getByPlaceholderText('@username@instance.com');
			const submitButton = screen.getByText('Start Migration');

			expect(submitButton.disabled).toBe(true);

			// Invalid handle
			await fireEvent.input(input, { target: { value: 'invalid handle' } });
			expect(submitButton.disabled).toBe(true);

			// Valid handle
			await fireEvent.input(input, { target: { value: '@newaccount@instance.com' } });
			expect(submitButton.disabled).toBe(false);
		});

		it('initiates migration successfully', async () => {
			const onInitiateMigration = vi.fn().mockResolvedValue(undefined);
			renderComponent({
				isOwnProfile: true,
				migration: null,
				handlers: { onInitiateMigration },
			});

			await fireEvent.click(screen.getByText('Initiate Migration'));
			const input = screen.getByPlaceholderText('@username@instance.com');
			await fireEvent.input(input, { target: { value: '@newaccount@instance.com' } });
			await fireEvent.click(screen.getByText('Start Migration'));

			expect(onInitiateMigration).toHaveBeenCalledWith('@newaccount@instance.com');
			// Should close form or clear input - checking if input is cleared or form closed
			// The component closes the form on success
			await waitFor(() => {
				expect(screen.queryByPlaceholderText('@username@instance.com')).toBeNull();
			});
		});

		it('handles migration initiation failure', async () => {
			const onInitiateMigration = vi.fn().mockRejectedValue(new Error('Migration failed'));
			renderComponent({
				isOwnProfile: true,
				migration: null,
				handlers: { onInitiateMigration },
			});

			await fireEvent.click(screen.getByText('Initiate Migration'));
			const input = screen.getByPlaceholderText('@username@instance.com');
			await fireEvent.input(input, { target: { value: '@newaccount@instance.com' } });
			await fireEvent.click(screen.getByText('Start Migration'));

			await waitFor(() => {
				expect(screen.getByText('Migration failed')).toBeTruthy();
			});
		});

		it('shows pending migration status and allows cancellation', async () => {
			const onCancelMigration = vi.fn().mockResolvedValue(undefined);
			renderComponent({
				isOwnProfile: true,
				migration: {
					status: 'pending',
					targetAccount: {
						id: '2',
						username: 'newaccount',
						displayName: 'New Account',
					},
					followersCount: 100,
				},
				handlers: { onCancelMigration },
			});

			expect(screen.getByText('Pending')).toBeTruthy();
			expect(screen.getByText('100 followers will be notified')).toBeTruthy();

			const cancelButton = screen.getByText('Cancel Migration');
			await fireEvent.click(cancelButton);

			expect(global.confirm).toHaveBeenCalled();
			expect(onCancelMigration).toHaveBeenCalled();
		});

		it('does not cancel if confirm is rejected', async () => {
			global.confirm = vi.fn(() => false);
			const onCancelMigration = vi.fn();
			renderComponent({
				isOwnProfile: true,
				migration: { status: 'pending', targetAccount: { username: 'newaccount' } },
				handlers: { onCancelMigration },
			});

			await fireEvent.click(screen.getByText('Cancel Migration'));
			expect(onCancelMigration).not.toHaveBeenCalled();
		});

		it('handles cancellation failure', async () => {
			const onCancelMigration = vi.fn().mockRejectedValue(new Error('Cancel failed'));
			renderComponent({
				isOwnProfile: true,
				migration: { status: 'pending', targetAccount: { username: 'newaccount' } },
				handlers: { onCancelMigration },
			});

			await fireEvent.click(screen.getByText('Cancel Migration'));
			await waitFor(() => {
				expect(screen.getByText('Cancel failed')).toBeTruthy();
			});
		});

		it('shows completed status', () => {
			renderComponent({
				isOwnProfile: true,
				migration: {
					status: 'completed',
					targetAccount: { username: 'newaccount' },
					movedAt: '2023-01-01T00:00:00Z',
				},
			});

			expect(screen.getByText('Completed')).toBeTruthy();
			expect(screen.getByText(/Migrated on/)).toBeTruthy();
		});

		it('shows failed status', () => {
			renderComponent({
				isOwnProfile: true,
				migration: {
					status: 'failed',
					targetAccount: { username: 'newaccount' },
				},
			});

			expect(screen.getByText('Failed')).toBeTruthy();
			expect(
				screen.getByText('Migration failed. Please try again or contact support.')
			).toBeTruthy();
		});
	});

	describe('Date formatting', () => {
		it('falls back to original string if date is invalid', () => {
			renderComponent({
				isOwnProfile: true,
				migration: {
					status: 'completed',
					targetAccount: { username: 'newaccount' },
					movedAt: 'invalid-date',
				},
			});

			expect(screen.getByText(/Migrated on invalid-date/)).toBeTruthy();
		});
	});
});
