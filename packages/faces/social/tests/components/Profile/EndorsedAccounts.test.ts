import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import EndorsedAccountsTest from './EndorsedAccountsTest.svelte';

describe('EndorsedAccounts', () => {
	const originalConfirm = global.confirm;
	const mockProfileData = [
		{ id: '1', username: 'alice', displayName: 'Alice Wonder', avatar: 'alice.jpg' },
		{ id: '2', username: 'bob', displayName: 'Bob Builder', avatar: null },
		{ id: '3', username: 'charlie', displayName: 'Charlie', avatar: 'charlie.jpg' },
	];

	beforeEach(() => {
		global.confirm = vi.fn(() => true);
	});

	afterEach(() => {
		global.confirm = originalConfirm;
		vi.restoreAllMocks();
	});

	const renderComponent = (props = {}) => {
		return render(EndorsedAccountsTest, {
			props: {
				handlers: {
					onReorderEndorsements: vi.fn(),
					onUnendorseAccount: vi.fn(),
				},
				...props,
			},
		});
	};

	describe('Rendering', () => {
		it('renders empty state for own profile', () => {
			renderComponent({ isOwnProfile: true, endorsed: [] });
			expect(screen.getByText("You haven't featured any accounts yet")).toBeTruthy();
		});

		it('renders empty state for visitor', () => {
			renderComponent({ isOwnProfile: false, endorsed: [] });
			expect(screen.getByText('No featured accounts')).toBeTruthy();
		});

		it('renders list of endorsed accounts', () => {
			renderComponent({ endorsed: mockProfileData });
			expect(screen.getByText('Alice Wonder')).toBeTruthy();
			expect(screen.getByText('@alice')).toBeTruthy();
			expect(screen.getByText('Bob Builder')).toBeTruthy();
			expect(screen.getByText('@bob')).toBeTruthy();
			expect(screen.getByText('3')).toBeTruthy(); // Count
		});

		it('renders avatar placeholders when avatar is missing', () => {
			renderComponent({ endorsed: [mockProfileData[1]] });
			expect(screen.getByText('B')).toBeTruthy(); // B from Bob
		});

		it('limits accounts displayed when maxAccounts is set', () => {
			renderComponent({ endorsed: mockProfileData, maxAccounts: 2 });
			expect(screen.getByText('Alice Wonder')).toBeTruthy();
			expect(screen.getByText('Bob Builder')).toBeTruthy();
			expect(screen.queryByText('Charlie')).toBeNull();
			expect(screen.getByText('Show all 3 accounts')).toBeTruthy();
		});
	});

	describe('Removal', () => {
		it('removes endorsement when confirmed', async () => {
			const onUnendorseAccount = vi.fn().mockResolvedValue(undefined);
			renderComponent({
				isOwnProfile: true,
				endorsed: [mockProfileData[0]],
				handlers: { onUnendorseAccount },
			});

			const removeButton = screen.getByRole('button', { name: /Remove Alice Wonder/ });
			await fireEvent.click(removeButton);

			expect(global.confirm).toHaveBeenCalled();
			expect(onUnendorseAccount).toHaveBeenCalledWith('1');

			await waitFor(() => {
				expect(screen.queryByText('Alice Wonder')).toBeNull();
			});
		});

		it('does not remove if confirm rejected', async () => {
			global.confirm = vi.fn(() => false);
			const onUnendorseAccount = vi.fn();
			renderComponent({
				isOwnProfile: true,
				endorsed: [mockProfileData[0]],
				handlers: { onUnendorseAccount },
			});

			const removeButton = screen.getByRole('button', { name: /Remove Alice Wonder/ });
			await fireEvent.click(removeButton);

			expect(onUnendorseAccount).not.toHaveBeenCalled();
			expect(screen.getByText('Alice Wonder')).toBeTruthy();
		});

		it('logs error if removal fails', async () => {
			const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
			const onUnendorseAccount = vi.fn().mockRejectedValue(new Error('Failed'));

			renderComponent({
				isOwnProfile: true,
				endorsed: [mockProfileData[0]],
				handlers: { onUnendorseAccount },
			});

			const removeButton = screen.getByRole('button', { name: /Remove Alice Wonder/ });
			await fireEvent.click(removeButton);

			await waitFor(() => {
				expect(consoleError).toHaveBeenCalledWith(
					'Failed to remove endorsement:',
					expect.any(Error)
				);
			});

			// Should still be in the list if failed?
			// The code removes it from local state ONLY on success logic?
			// Wait:
			// try { await handler(); remove from local; } catch {}
			// So if handler fails, it is NOT removed.
			expect(screen.getByText('Alice Wonder')).toBeTruthy();
		});
	});

	describe('Reordering', () => {
		it('does not allow reordering if not own profile', async () => {
			const onReorderEndorsements = vi.fn();
			renderComponent({
				isOwnProfile: false,
				endorsed: mockProfileData,
				handlers: { onReorderEndorsements },
			});

			// Try to drag
			const item = screen.getByText('Alice Wonder').closest('.endorsed-accounts__item');
			if (item) {
				await fireEvent.dragStart(item);
				await fireEvent.drop(item);
			}
			// Logic says if !isOwnProfile, return.
			expect(onReorderEndorsements).not.toHaveBeenCalled();
		});

		it('reorders accounts', async () => {
			const onReorderEndorsements = vi.fn().mockResolvedValue(undefined);
			renderComponent({
				isOwnProfile: true,
				endorsed: mockProfileData,
				handlers: { onReorderEndorsements },
			});

			const _items = screen.getAllByRole('button');
			// Note: The items are role="button" when reorder enabled.
			// But remove buttons are also buttons.
			// Items have class endorsed-accounts__item

			const aliceItem = screen.getByText('Alice Wonder').closest('.endorsed-accounts__item');
			const charlieItem = screen.getByText('Charlie').closest('.endorsed-accounts__item');

			if (!aliceItem || !charlieItem) throw new Error('Items not found');

			// Drag Alice (index 0) to Charlie (index 2)
			await fireEvent.dragStart(aliceItem);
			await fireEvent.dragOver(charlieItem);
			await fireEvent.drop(charlieItem);

			// Alice should now be after Charlie (or at Charlie's position)
			// Splice logic: remove at draggingIndex (0), insert at targetIndex (2).
			// [Alice, Bob, Charlie] -> remove Alice -> [Bob, Charlie] -> insert at 2 -> [Bob, Charlie, Alice]

			expect(onReorderEndorsements).toHaveBeenCalledWith(['2', '3', '1']);
		});
	});
});
