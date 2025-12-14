import { render, fireEvent, screen, waitFor, act } from '@testing-library/svelte';
import { describe, it, expect, vi, afterEach } from 'vitest';
import MemberPickerTest from './MemberPickerTest.svelte';

describe('MemberPicker', () => {
	const mockList = {
		id: '1',
		title: 'Test List',
		visibility: 'public' as const,
		membersCount: 1,
		members: [
			// MemberPicker expects flattened members with actor fields
			{ id: 'u1', username: 'user1', displayName: 'User One', avatar: 'u1.jpg' },
		],
	};

	const mockSearchResults = [
		{ id: 'u2', username: 'user2', displayName: 'User Two', avatar: null }, // Not member
		{ id: 'u1', username: 'user1', displayName: 'User One', avatar: 'u1.jpg' }, // Is member
	];

	// Remove global beforeEach/afterEach for timers
	afterEach(() => {
		vi.restoreAllMocks();
	});

	const renderComponent = (props = {}) => {
		return render(MemberPickerTest, {
			props: {
				handlers: {
					onSearchAccounts: vi.fn(),
					onAddListMember: vi.fn(),
					onRemoveListMember: vi.fn(),
					onFetchList: vi.fn(),
				},
				...props,
			},
		});
	};

	it('shows "Select a list" when no list is selected', () => {
		renderComponent({ selectedList: null });
		expect(screen.getByText('Select a list to manage members')).toBeTruthy();
	});

	it('shows members of selected list', async () => {
		renderComponent({ selectedList: mockList });
		// Use act to flush effects if needed, but render should be sync enough for initial render check after effect runs?
		// The effect in Inner component runs after mount.
		// We might need to wait for the UI to update.
		await waitFor(() => {
			expect(screen.getByText('User One')).toBeTruthy();
		});
		expect(screen.getByText('Manage Members')).toBeTruthy();
		expect(screen.getByText('1 member')).toBeTruthy();
	});

	it('searches for accounts with debounce', async () => {
		vi.useFakeTimers();
		const onSearchAccounts = vi.fn().mockResolvedValue(mockSearchResults);
		renderComponent({
			selectedList: mockList,
			handlers: { onSearchAccounts },
		});

		const input = screen.getByPlaceholderText('Search people to add...');
		await fireEvent.input(input, { target: { value: 'user' } });

		// Should not have called yet
		expect(onSearchAccounts).not.toHaveBeenCalled();

		// Advance timer
		await act(async () => {
			vi.advanceTimersByTime(300);
		});

		expect(onSearchAccounts).toHaveBeenCalledWith('user');

		// Wait for results
		await waitFor(() => {
			expect(screen.getByText('Search Results')).toBeTruthy();
		});

		expect(screen.getByText('User Two')).toBeTruthy();

		// User One appears in search results AND current members.
		const userOnes = screen.getAllByText('User One');
		expect(userOnes.length).toBeGreaterThanOrEqual(2);

		vi.useRealTimers();
	});

	it('clears results when query is cleared', async () => {
		vi.useFakeTimers();
		const onSearchAccounts = vi.fn().mockResolvedValue(mockSearchResults);
		renderComponent({
			selectedList: mockList,
			handlers: { onSearchAccounts },
		});

		const input = screen.getByPlaceholderText('Search people to add...');
		await fireEvent.input(input, { target: { value: 'user' } });
		await act(async () => {
			vi.advanceTimersByTime(300);
		});
		await waitFor(() => expect(screen.getByText('User Two')).toBeTruthy());

		// Clear input
		await fireEvent.input(input, { target: { value: '' } });
		// It clears results immediately (or via effect).
		// The effect says: else { searchResults = [] }
		await waitFor(() => {
			expect(screen.queryByText('User Two')).toBeNull();
		});
		vi.useRealTimers();
	});

	it('handles adding a member', async () => {
		vi.useFakeTimers();
		const onSearchAccounts = vi.fn().mockResolvedValue(mockSearchResults);
		const onAddListMember = vi.fn().mockResolvedValue(undefined);
		const onFetchList = vi.fn().mockResolvedValue(mockList);

		renderComponent({
			selectedList: mockList,
			handlers: { onSearchAccounts, onAddListMember, onFetchList },
		});

		// Search
		const input = screen.getByPlaceholderText('Search people to add...');
		await fireEvent.input(input, { target: { value: 'user' } });
		await act(async () => {
			vi.advanceTimersByTime(300);
		});
		await waitFor(() => expect(screen.getByText('User Two')).toBeTruthy());

		// Click Add on User Two (index 0 in mockSearchResults)
		const addButtons = screen.getAllByText('Add');
		await fireEvent.click(addButtons[0]);

		expect(onAddListMember).toHaveBeenCalledWith('1', 'u2');
		expect(onFetchList).toHaveBeenCalledWith('1');
		vi.useRealTimers();
	});

	it('handles removing a member (from search results)', async () => {
		vi.useFakeTimers();
		const onSearchAccounts = vi.fn().mockResolvedValue(mockSearchResults);
		const onRemoveListMember = vi.fn().mockResolvedValue(undefined);
		const onFetchList = vi.fn().mockResolvedValue(mockList);

		renderComponent({
			selectedList: mockList,
			handlers: { onSearchAccounts, onRemoveListMember, onFetchList },
		});

		// Search
		const input = screen.getByPlaceholderText('Search people to add...');
		await fireEvent.input(input, { target: { value: 'user' } });
		await act(async () => {
			vi.advanceTimersByTime(300);
		});
		// Use getAll because User One is in search results AND list
		await waitFor(() => {
			const items = screen.getAllByText('User One');
			expect(items.length).toBeGreaterThan(0);
		});

		// User One is already member, should show Remove button
		// Note: The Remove button in search results has text "Remove".
		// The Remove button in member list has title "Remove from list" and no text.

		const removeButtons = screen.getAllByText('Remove');
		await fireEvent.click(removeButtons[0]);

		expect(onRemoveListMember).toHaveBeenCalledWith('1', 'u1');
		expect(onFetchList).toHaveBeenCalledWith('1');
		vi.useRealTimers();
	});

	it('handles removing a member (from list)', async () => {
		const onRemoveListMember = vi.fn().mockResolvedValue(undefined);
		const onFetchList = vi.fn().mockResolvedValue(mockList);

		renderComponent({
			selectedList: mockList,
			handlers: { onRemoveListMember, onFetchList },
		});

		await waitFor(() => expect(screen.getByText('User One')).toBeTruthy());

		// Find remove button in list. It has aria-label="Remove User One from list"
		const removeButton = screen.getByLabelText('Remove User One from list');
		await fireEvent.click(removeButton);

		expect(onRemoveListMember).toHaveBeenCalledWith('1', 'u1'); // memberId is u1 (Actor ID)
		expect(onFetchList).toHaveBeenCalledWith('1');
	});

	it('shows no results found', async () => {
		vi.useFakeTimers();
		const onSearchAccounts = vi.fn().mockResolvedValue([]);
		renderComponent({
			selectedList: mockList,
			handlers: { onSearchAccounts },
		});

		const input = screen.getByPlaceholderText('Search people to add...');
		await fireEvent.input(input, { target: { value: 'nobody' } });
		await act(async () => {
			vi.advanceTimersByTime(300);
		});

		await waitFor(() => {
			expect(screen.getByText('No users found matching "nobody"')).toBeTruthy();
		});
		vi.useRealTimers();
	});
});
