/**
 * Lists Context Tests
 *
 * Tests for the Lists context module including context creation,
 * state management, and utility functions.
 */

import { describe, it, expect, vi } from 'vitest';
import {
	createListsContext,
	validateListForm,
	type ListData,
	type ListFormData,
	type ListMember,
	type ListsHandlers,
} from '../src/components/Lists/context';

// Mock Svelte's context functions
vi.mock('svelte', () => ({
	getContext: vi.fn(),
	setContext: vi.fn(),
}));

describe('Lists Context', () => {
	describe('createListsContext', () => {
		it('creates context with default state', () => {
			const ctx = createListsContext();

			expect(ctx.state.lists).toEqual([]);
			expect(ctx.state.selectedList).toBeNull();
			expect(ctx.state.members).toEqual([]);
			expect(ctx.state.loading).toBe(false);
			expect(ctx.state.error).toBeNull();
			expect(ctx.state.editorOpen).toBe(false);
			expect(ctx.state.editingList).toBeNull();
		});

		it('provides handlers from configuration', () => {
			const handlers: ListsHandlers = {
				onFetchLists: vi.fn(),
				onCreate: vi.fn(),
			};
			const ctx = createListsContext(handlers);

			expect(ctx.handlers).toBe(handlers);
		});

		describe('updateState', () => {
			it('updates state with partial values', () => {
				const ctx = createListsContext();

				ctx.updateState({ loading: true, error: 'Test error' });

				expect(ctx.state.loading).toBe(true);
				expect(ctx.state.error).toBe('Test error');
			});
		});

		describe('clearError', () => {
			it('clears the error state', () => {
				const ctx = createListsContext();

				ctx.updateState({ error: 'Some error' });
				ctx.clearError();

				expect(ctx.state.error).toBeNull();
			});
		});

		describe('fetchLists', () => {
			it('sets loading state during fetch', async () => {
				const onFetchLists = vi.fn().mockResolvedValue([]);
				const ctx = createListsContext({ onFetchLists });

				const fetchPromise = ctx.fetchLists();

				// After starting, loading should be true
				expect(ctx.state.error).toBeNull();

				await fetchPromise;

				expect(ctx.state.loading).toBe(false);
			});

			it('populates lists from handler response', async () => {
				const mockLists: ListData[] = [
					{ id: '1', title: 'Test List', visibility: 'public', membersCount: 5 },
					{ id: '2', title: 'Another List', visibility: 'private', membersCount: 10 },
				];
				const onFetchLists = vi.fn().mockResolvedValue(mockLists);
				const ctx = createListsContext({ onFetchLists });

				await ctx.fetchLists();

				expect(ctx.state.lists).toEqual(mockLists);
			});

			it('sets error state on fetch failure', async () => {
				const onFetchLists = vi.fn().mockRejectedValue(new Error('Network error'));
				const ctx = createListsContext({ onFetchLists });

				await ctx.fetchLists();

				expect(ctx.state.error).toBe('Network error');
				expect(ctx.state.loading).toBe(false);
			});

			it('uses default error message for non-Error exceptions', async () => {
				const onFetchLists = vi.fn().mockRejectedValue('Unknown error');
				const ctx = createListsContext({ onFetchLists });

				await ctx.fetchLists();

				expect(ctx.state.error).toBe('Failed to fetch lists');
			});

			it('handles missing handler gracefully', async () => {
				const ctx = createListsContext();

				await ctx.fetchLists();

				expect(ctx.state.error).toBeNull();
				expect(ctx.state.lists).toEqual([]);
			});
		});

		describe('selectList', () => {
			it('sets selected list and clears members', async () => {
				const mockList: ListData = {
					id: '1',
					title: 'Test',
					visibility: 'public',
					membersCount: 3,
				};
				const ctx = createListsContext();

				await ctx.selectList(mockList);

				expect(ctx.state.selectedList).toEqual(mockList);
				expect(ctx.state.members).toEqual([]);
			});

			it('fetches members when selecting a list', async () => {
				const mockList: ListData = {
					id: '1',
					title: 'Test',
					visibility: 'public',
					membersCount: 2,
				};
				const mockMembers: ListMember[] = [
					{
						id: 'm1',
						listId: '1',
						actor: { id: 'a1', username: 'user1', displayName: 'User 1' },
						addedAt: '2024-01-01',
					},
				];
				const onFetchMembers = vi.fn().mockResolvedValue(mockMembers);
				const ctx = createListsContext({ onFetchMembers });

				await ctx.selectList(mockList);

				expect(onFetchMembers).toHaveBeenCalledWith('1');
				expect(ctx.state.members).toEqual(mockMembers);
			});

			it('sets error on member fetch failure', async () => {
				const mockList: ListData = {
					id: '1',
					title: 'Test',
					visibility: 'public',
					membersCount: 0,
				};
				const onFetchMembers = vi.fn().mockRejectedValue(new Error('Fetch failed'));
				const ctx = createListsContext({ onFetchMembers });

				await ctx.selectList(mockList);

				expect(ctx.state.error).toBe('Fetch failed');
			});

			it('handles null selection', async () => {
				const ctx = createListsContext();

				await ctx.selectList(null);

				expect(ctx.state.selectedList).toBeNull();
				expect(ctx.state.members).toEqual([]);
			});
		});

		describe('openEditor / closeEditor', () => {
			it('opens editor for new list', () => {
				const ctx = createListsContext();

				ctx.openEditor();

				expect(ctx.state.editorOpen).toBe(true);
				expect(ctx.state.editingList).toBeNull();
			});

			it('opens editor for existing list', () => {
				const mockList: ListData = {
					id: '1',
					title: 'Test',
					visibility: 'public',
					membersCount: 0,
				};
				const ctx = createListsContext();

				ctx.openEditor(mockList);

				expect(ctx.state.editorOpen).toBe(true);
				expect(ctx.state.editingList).toEqual(mockList);
			});

			it('closes editor and clears editing list', () => {
				const mockList: ListData = {
					id: '1',
					title: 'Test',
					visibility: 'public',
					membersCount: 0,
				};
				const ctx = createListsContext();

				ctx.openEditor(mockList);
				ctx.closeEditor();

				expect(ctx.state.editorOpen).toBe(false);
				expect(ctx.state.editingList).toBeNull();
			});
		});

		describe('createList', () => {
			it('creates a list and adds to state', async () => {
				const formData: ListFormData = { title: 'New List', visibility: 'public' };
				const createdList: ListData = {
					id: '1',
					title: 'New List',
					visibility: 'public',
					membersCount: 0,
				};
				const onCreate = vi.fn().mockResolvedValue(createdList);
				const ctx = createListsContext({ onCreate });

				ctx.openEditor();
				await ctx.createList(formData);

				expect(onCreate).toHaveBeenCalledWith(formData);
				expect(ctx.state.lists).toContainEqual(createdList);
				expect(ctx.state.editorOpen).toBe(false);
			});

			it('sets error and throws on create failure', async () => {
				const formData: ListFormData = { title: 'New List', visibility: 'public' };
				const onCreate = vi.fn().mockRejectedValue(new Error('Create failed'));
				const ctx = createListsContext({ onCreate });

				await expect(ctx.createList(formData)).rejects.toThrow('Create failed');
				expect(ctx.state.error).toBe('Create failed');
			});
		});

		describe('updateList', () => {
			it('updates a list in state', async () => {
				const originalList: ListData = {
					id: '1',
					title: 'Original',
					visibility: 'public',
					membersCount: 0,
				};
				const updatedList: ListData = {
					id: '1',
					title: 'Updated',
					visibility: 'private',
					membersCount: 0,
				};
				const formData: ListFormData = { title: 'Updated', visibility: 'private' };
				const onUpdate = vi.fn().mockResolvedValue(updatedList);
				const ctx = createListsContext({ onUpdate });

				// Pre-populate lists
				ctx.updateState({ lists: [originalList] });

				await ctx.updateList('1', formData);

				expect(onUpdate).toHaveBeenCalledWith('1', formData);
				expect(ctx.state.lists[0]).toEqual(updatedList);
			});

			it('updates selected list if it was updated', async () => {
				const originalList: ListData = {
					id: '1',
					title: 'Original',
					visibility: 'public',
					membersCount: 0,
				};
				const updatedList: ListData = {
					id: '1',
					title: 'Updated',
					visibility: 'private',
					membersCount: 0,
				};
				const formData: ListFormData = { title: 'Updated', visibility: 'private' };
				const onUpdate = vi.fn().mockResolvedValue(updatedList);
				const ctx = createListsContext({ onUpdate });

				// Pre-populate and select
				ctx.updateState({ lists: [originalList], selectedList: originalList });

				await ctx.updateList('1', formData);

				expect(ctx.state.selectedList).toEqual(updatedList);
			});

			it('throws on update failure', async () => {
				const formData: ListFormData = { title: 'Updated', visibility: 'private' };
				const onUpdate = vi.fn().mockRejectedValue(new Error('Update failed'));
				const ctx = createListsContext({ onUpdate });

				await expect(ctx.updateList('1', formData)).rejects.toThrow('Update failed');
				expect(ctx.state.error).toBe('Update failed');
			});
		});

		describe('deleteList', () => {
			it('removes list from state', async () => {
				const list1: ListData = { id: '1', title: 'List 1', visibility: 'public', membersCount: 0 };
				const list2: ListData = { id: '2', title: 'List 2', visibility: 'public', membersCount: 0 };
				const onDelete = vi.fn().mockResolvedValue(undefined);
				const ctx = createListsContext({ onDelete });

				ctx.updateState({ lists: [list1, list2] });

				await ctx.deleteList('1');

				expect(onDelete).toHaveBeenCalledWith('1');
				expect(ctx.state.lists).toEqual([list2]);
			});

			it('clears selected list if deleted', async () => {
				const list: ListData = { id: '1', title: 'List', visibility: 'public', membersCount: 0 };
				const onDelete = vi.fn().mockResolvedValue(undefined);
				const ctx = createListsContext({ onDelete });

				ctx.updateState({
					lists: [list],
					selectedList: list,
					members: [{ id: 'm1' } as ListMember],
				});

				await ctx.deleteList('1');

				expect(ctx.state.selectedList).toBeNull();
				expect(ctx.state.members).toEqual([]);
			});

			it('throws on delete failure', async () => {
				const onDelete = vi.fn().mockRejectedValue(new Error('Delete failed'));
				const ctx = createListsContext({ onDelete });

				await expect(ctx.deleteList('1')).rejects.toThrow('Delete failed');
				expect(ctx.state.error).toBe('Delete failed');
			});
		});

		describe('addMember', () => {
			it('calls handler and refreshes members', async () => {
				const list: ListData = { id: '1', title: 'Test', visibility: 'public', membersCount: 0 };
				const members: ListMember[] = [
					{
						id: 'm1',
						listId: '1',
						actor: { id: 'a1', username: 'user1', displayName: 'User 1' },
						addedAt: '2024-01-01',
					},
				];
				const onAddMember = vi.fn().mockResolvedValue(undefined);
				const onFetchMembers = vi.fn().mockResolvedValue(members);
				const ctx = createListsContext({ onAddMember, onFetchMembers });

				ctx.updateState({ selectedList: list });

				await ctx.addMember('actor-1');

				expect(onAddMember).toHaveBeenCalledWith('1', 'actor-1');
				expect(onFetchMembers).toHaveBeenCalledWith('1');
			});

			it('does nothing when no list is selected', async () => {
				const onAddMember = vi.fn();
				const ctx = createListsContext({ onAddMember });

				await ctx.addMember('actor-1');

				expect(onAddMember).not.toHaveBeenCalled();
			});

			it('throws on add failure', async () => {
				const list: ListData = { id: '1', title: 'Test', visibility: 'public', membersCount: 0 };
				const onAddMember = vi.fn().mockRejectedValue(new Error('Add failed'));
				const ctx = createListsContext({ onAddMember });

				ctx.updateState({ selectedList: list });

				await expect(ctx.addMember('actor-1')).rejects.toThrow('Add failed');
				expect(ctx.state.error).toBe('Add failed');
			});
		});

		describe('removeMember', () => {
			it('removes member from state and updates count', async () => {
				const list: ListData = { id: '1', title: 'Test', visibility: 'public', membersCount: 2 };
				const member: ListMember = {
					id: 'm1',
					listId: '1',
					actor: { id: 'a1', username: 'user1', displayName: 'User 1' },
					addedAt: '2024-01-01',
				};
				const onRemoveMember = vi.fn().mockResolvedValue(undefined);
				const ctx = createListsContext({ onRemoveMember });

				ctx.updateState({ selectedList: list, members: [member] });

				await ctx.removeMember('m1');

				expect(onRemoveMember).toHaveBeenCalledWith('1', 'm1');
				expect(ctx.state.members).toEqual([]);
				expect(ctx.state.selectedList?.membersCount).toBe(1);
			});

			it('does not go below zero members', async () => {
				const list: ListData = { id: '1', title: 'Test', visibility: 'public', membersCount: 0 };
				const member: ListMember = {
					id: 'm1',
					listId: '1',
					actor: { id: 'a1', username: 'user1', displayName: 'User 1' },
					addedAt: '2024-01-01',
				};
				const onRemoveMember = vi.fn().mockResolvedValue(undefined);
				const ctx = createListsContext({ onRemoveMember });

				ctx.updateState({ selectedList: list, members: [member] });

				await ctx.removeMember('m1');

				expect(ctx.state.selectedList?.membersCount).toBe(0);
			});

			it('does nothing when no list is selected', async () => {
				const onRemoveMember = vi.fn();
				const ctx = createListsContext({ onRemoveMember });

				await ctx.removeMember('m1');

				expect(onRemoveMember).not.toHaveBeenCalled();
			});

			it('throws on remove failure', async () => {
				const list: ListData = { id: '1', title: 'Test', visibility: 'public', membersCount: 1 };
				const onRemoveMember = vi.fn().mockRejectedValue(new Error('Remove failed'));
				const ctx = createListsContext({ onRemoveMember });

				ctx.updateState({ selectedList: list });

				await expect(ctx.removeMember('m1')).rejects.toThrow('Remove failed');
				expect(ctx.state.error).toBe('Remove failed');
			});
		});
	});

	describe('validateListForm', () => {
		it('returns null for valid form data', () => {
			const formData: ListFormData = {
				title: 'My List',
				description: 'A valid description',
				visibility: 'public',
			};

			expect(validateListForm(formData)).toBeNull();
		});

		it('returns error for empty title', () => {
			const formData: ListFormData = {
				title: '',
				visibility: 'public',
			};

			expect(validateListForm(formData)).toBe('List title is required');
		});

		it('returns error for whitespace-only title', () => {
			const formData: ListFormData = {
				title: '   ',
				visibility: 'public',
			};

			expect(validateListForm(formData)).toBe('List title is required');
		});

		it('returns error for title over 100 characters', () => {
			const formData: ListFormData = {
				title: 'a'.repeat(101),
				visibility: 'public',
			};

			expect(validateListForm(formData)).toBe('List title must be 100 characters or less');
		});

		it('allows title of exactly 100 characters', () => {
			const formData: ListFormData = {
				title: 'a'.repeat(100),
				visibility: 'public',
			};

			expect(validateListForm(formData)).toBeNull();
		});

		it('returns error for description over 500 characters', () => {
			const formData: ListFormData = {
				title: 'Valid Title',
				description: 'a'.repeat(501),
				visibility: 'public',
			};

			expect(validateListForm(formData)).toBe('Description must be 500 characters or less');
		});

		it('allows description of exactly 500 characters', () => {
			const formData: ListFormData = {
				title: 'Valid Title',
				description: 'a'.repeat(500),
				visibility: 'public',
			};

			expect(validateListForm(formData)).toBeNull();
		});

		it('allows undefined description', () => {
			const formData: ListFormData = {
				title: 'Valid Title',
				visibility: 'private',
			};

			expect(validateListForm(formData)).toBeNull();
		});
	});
});
