/**
 * Lists Context
 *
 * Provides lists state and handlers for all lists components.
 * Supports creating, editing, and viewing user-curated lists of actors.
 *
 * @module Lists/context
 */

import { getContext, setContext } from 'svelte';
import type { GenericTimelineItem } from '../../generics/index.js';

const LISTS_CONTEXT_KEY = 'lists-context-debug'; // Symbol('lists-context');

/**
 * List data structure
 */
export interface ListData {
	id: string;
	title: string;
	description?: string;
	visibility: 'public' | 'private';
	membersCount: number;
	createdAt?: string;
	updatedAt?: string;
}

/**
 * List member data
 */
export interface ListMember {
	id: string;
	listId: string;
	actor: {
		id: string;
		username: string;
		displayName: string;
		avatar?: string;
	};
	addedAt: string;
}

/**
 * List create/edit data
 */
export interface ListFormData {
	title: string;
	description?: string;
	visibility: 'public' | 'private';
}

/**
 * Lists event handlers
 */
export interface ListsHandlers {
	/**
	 * Fetch all lists
	 */
	onFetchLists?: () => Promise<ListData[]>;

	/**
	 * Create a new list
	 */
	onCreate?: (data: ListFormData) => Promise<ListData>;

	/**
	 * Update an existing list
	 */
	onUpdate?: (id: string, data: ListFormData) => Promise<ListData>;

	/**
	 * Delete a list
	 */
	onDelete?: (id: string) => Promise<void>;

	/**
	 * Fetch list members
	 */
	onFetchMembers?: (listId: string) => Promise<ListMember[]>;

	/**
	 * Add a member to a list
	 */
	onAddMember?: (listId: string, actorId: string) => Promise<void>;

	/**
	 * Remove a member from a list
	 */
	onRemoveMember?: (listId: string, memberId: string) => Promise<void>;

	/**
	 * Fetch timeline for a list
	 */
	onFetchTimeline?: (
		listId: string,
		options?: { limit?: number; cursor?: string }
	) => Promise<GenericTimelineItem[]>;

	/**
	 * Handle list click
	 */
	onListClick?: (list: ListData) => void;

	/**
	 * Search accounts to add to lists
	 */
	onSearchAccounts?: (query: string) => Promise<ListMember[]>;

	/**
	 * Fetch a single list with its members
	 */
	onFetchList?: (listId: string) => Promise<ListData>;

	/**
	 * Alias for onAddMember
	 */
	onAddListMember?: (listId: string, actorId: string) => Promise<void>;

	/**
	 * Alias for onRemoveMember
	 */
	onRemoveListMember?: (listId: string, memberId: string) => Promise<void>;
}

/**
 * Lists state
 */
export interface ListsState {
	/**
	 * All lists
	 */
	lists: ListData[];

	/**
	 * Currently selected list
	 */
	selectedList: ListData | null;

	/**
	 * Members of the selected list
	 */
	members: ListMember[];

	/**
	 * Whether a list operation is in progress
	 */
	loading: boolean;

	/**
	 * Current error message
	 */
	error: string | null;

	/**
	 * Whether editor is open
	 */
	editorOpen: boolean;

	/**
	 * List being edited (null for new list)
	 */
	editingList: ListData | null;
}

/**
 * Lists context
 */
export interface ListsContext {
	/**
	 * Current lists state
	 */
	state: ListsState;

	/**
	 * Lists event handlers
	 */
	handlers: ListsHandlers;

	/**
	 * Update lists state
	 */
	updateState: (partial: Partial<ListsState>) => void;

	/**
	 * Clear lists error
	 */
	clearError: () => void;

	/**
	 * Fetch all lists
	 */
	fetchLists: () => Promise<void>;

	/**
	 * Select a list
	 */
	selectList: (list: ListData | null) => Promise<void>;

	/**
	 * Open editor for new list
	 */
	openEditor: (list?: ListData) => void;

	/**
	 * Close editor
	 */
	closeEditor: () => void;

	/**
	 * Create a new list
	 */
	createList: (data: ListFormData) => Promise<void>;

	/**
	 * Update a list
	 */
	updateList: (id: string, data: ListFormData) => Promise<void>;

	/**
	 * Delete a list
	 */
	deleteList: (id: string) => Promise<void>;

	/**
	 * Add member to selected list
	 */
	addMember: (actorId: string) => Promise<void>;

	/**
	 * Remove member from selected list
	 */
	removeMember: (memberId: string) => Promise<void>;
}

/**
 * Create lists context
 *
 * @param handlers - Lists event handlers
 * @param initialState - Optional initial state
 * @returns Lists context
 */
export function createListsContext(
	handlers: ListsHandlers = {},
	initialState: Partial<ListsState> = {}
): ListsContext {
	const state = $state<ListsState>({
		lists: [],
		selectedList: null,
		members: [],
		loading: false,
		error: null,
		editorOpen: false,
		editingList: null,
		...initialState,
	});

	const context: ListsContext = {
		state,
		handlers,
		updateState: (partial: Partial<ListsState>) => {
			Object.assign(state, partial);
		},
		clearError: () => {
			state.error = null;
		},
		fetchLists: async () => {
			state.loading = true;
			state.error = null;

			try {
				const lists = await handlers.onFetchLists?.();
				if (lists) {
					state.lists = lists;
				}
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to fetch lists';
			} finally {
				state.loading = false;
			}
		},
		selectList: async (list: ListData | null) => {
			state.selectedList = list;
			state.members = [];

			if (list) {
				state.loading = true;
				try {
					const members = await handlers.onFetchMembers?.(list.id);
					if (members) {
						state.members = members;
					}
				} catch (error) {
					state.error = error instanceof Error ? error.message : 'Failed to fetch members';
				} finally {
					state.loading = false;
				}
			}
		},
		openEditor: (list?: ListData) => {
			state.editingList = list || null;
			state.editorOpen = true;
		},
		closeEditor: () => {
			state.editorOpen = false;
			state.editingList = null;
		},
		createList: async (data: ListFormData) => {
			state.loading = true;
			state.error = null;

			try {
				const newList = await handlers.onCreate?.(data);
				if (newList) {
					state.lists = [...state.lists, newList];
					context.closeEditor();
				}
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to create list';
				throw error;
			} finally {
				state.loading = false;
			}
		},
		updateList: async (id: string, data: ListFormData) => {
			state.loading = true;
			state.error = null;

			try {
				const updatedList = await handlers.onUpdate?.(id, data);
				if (updatedList) {
					state.lists = state.lists.map((l) => (l.id === id ? updatedList : l));
					if (state.selectedList?.id === id) {
						state.selectedList = updatedList;
					}
					context.closeEditor();
				}
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to update list';
				throw error;
			} finally {
				state.loading = false;
			}
		},
		deleteList: async (id: string) => {
			state.loading = true;
			state.error = null;

			try {
				await handlers.onDelete?.(id);
				state.lists = state.lists.filter((l) => l.id !== id);
				if (state.selectedList?.id === id) {
					state.selectedList = null;
					state.members = [];
				}
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to delete list';
				throw error;
			} finally {
				state.loading = false;
			}
		},
		addMember: async (actorId: string) => {
			if (!state.selectedList) return;

			state.loading = true;
			state.error = null;

			try {
				await handlers.onAddMember?.(state.selectedList.id, actorId);
				// Refresh members
				await context.selectList(state.selectedList);
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to add member';
				throw error;
			} finally {
				state.loading = false;
			}
		},
		removeMember: async (memberId: string) => {
			if (!state.selectedList) return;

			state.loading = true;
			state.error = null;

			try {
				await handlers.onRemoveMember?.(state.selectedList.id, memberId);
				state.members = state.members.filter((m) => m.id !== memberId);
				// Update member count
				if (state.selectedList) {
					state.selectedList = {
						...state.selectedList,
						membersCount: Math.max(0, state.selectedList.membersCount - 1),
					};
				}
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to remove member';
				throw error;
			} finally {
				state.loading = false;
			}
		},
	};

	setContext(LISTS_CONTEXT_KEY, context);
	return context;
}

/**
 * Get lists context
 *
 * Must be called within a Lists component tree.
 *
 * @throws Error if called outside Lists component tree
 * @returns Lists context
 */
export function getListsContext(): ListsContext {
	const context = getContext<ListsContext>(LISTS_CONTEXT_KEY);
	if (!context) {
		throw new Error('Lists components must be used within a Lists.Root component');
	}
	return context;
}

/**
 * Try to get lists context
 *
 * Returns undefined if called outside Lists component tree.
 *
 * @returns Lists context or undefined
 */
export function tryGetListsContext(): ListsContext | undefined {
	return getContext<ListsContext>(LISTS_CONTEXT_KEY);
}

/**
 * Validate list form data
 */
export function validateListForm(data: ListFormData): string | null {
	if (!data.title.trim()) {
		return 'List title is required';
	}
	if (data.title.length > 100) {
		return 'List title must be 100 characters or less';
	}
	if (data.description && data.description.length > 500) {
		return 'Description must be 500 characters or less';
	}
	return null;
}
