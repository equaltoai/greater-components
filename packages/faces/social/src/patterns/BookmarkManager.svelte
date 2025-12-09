<!--
  BookmarkManager - Saved Posts Management
  
  Provides comprehensive bookmark management for ActivityPub posts.
  Supports folders, tags, search, sorting, bulk actions, and export.
  
  @component
  @example
  ```svelte
  <BookmarkManager
    bookmarks={savedPosts}
    {config}
    {handlers}
  />
  ```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createMenu } from '@equaltoai/greater-components-headless/menu';
	import { untrack } from 'svelte';
	import type { Status } from '../types.js';

	export interface Bookmark {
		/**
		 * Unique ID
		 */
		id: string;

		/**
		 * The bookmarked status
		 */
		status: Status;

		/**
		 * Bookmark creation date
		 */
		createdAt: Date | string;

		/**
		 * Folder/collection
		 */
		folder?: string;

		/**
		 * Tags
		 */
		tags?: string[];

		/**
		 * Private notes
		 */
		notes?: string;

		/**
		 * Whether bookmark is archived
		 */
		archived?: boolean;
	}

	interface BookmarkFolder {
		/**
		 * Folder name
		 */
		name: string;

		/**
		 * Folder description
		 */
		description?: string;

		/**
		 * Number of bookmarks in folder
		 */
		count: number;

		/**
		 * Folder color
		 */
		color?: string;
	}

	interface BookmarkManagerConfig {
		/**
		 * Enable folders/collections
		 */
		enableFolders?: boolean;

		/**
		 * Enable tags
		 */
		enableTags?: boolean;

		/**
		 * Enable notes
		 */
		enableNotes?: boolean;

		/**
		 * Enable archive
		 */
		enableArchive?: boolean;

		/**
		 * Enable bulk actions
		 */
		enableBulkActions?: boolean;

		/**
		 * Enable export
		 */
		enableExport?: boolean;

		/**
		 * Show search
		 */
		showSearch?: boolean;

		/**
		 * Sort options
		 */
		sortOptions?: Array<{ value: string; label: string }>;

		/**
		 * Default sort
		 */
		defaultSort?: string;

		/**
		 * View mode
		 */
		viewMode?: 'grid' | 'list' | 'compact';

		/**
		 * Items per page
		 */
		itemsPerPage?: number;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	interface BookmarkManagerHandlers {
		/**
		 * Called when bookmark is removed
		 */
		onRemove?: (bookmarkId: string) => Promise<void>;

		/**
		 * Called when bookmarks are bulk deleted
		 */
		onBulkRemove?: (bookmarkIds: string[]) => Promise<void>;

		/**
		 * Called when bookmark folder changes
		 */
		onFolderChange?: (bookmarkId: string, folder: string | null) => Promise<void>;

		/**
		 * Called when bookmark tags change
		 */
		onTagsChange?: (bookmarkId: string, tags: string[]) => Promise<void>;

		/**
		 * Called when bookmark notes change
		 */
		onNotesChange?: (bookmarkId: string, notes: string) => Promise<void>;

		/**
		 * Called when bookmark is archived/unarchived
		 */
		onArchiveToggle?: (bookmarkId: string, archived: boolean) => Promise<void>;

		/**
		 * Called when bookmarks are exported
		 */
		onExport?: (bookmarkIds: string[], format: 'json' | 'csv' | 'html') => void;

		/**
		 * Called when a status is clicked
		 */
		onStatusClick?: (status: Status) => void;
	}

	interface Props {
		/**
		 * Bookmarked statuses
		 */
		bookmarks: Bookmark[];

		/**
		 * Available folders
		 */
		folders?: BookmarkFolder[];

		/**
		 * Available tags
		 */
		availableTags?: string[];

		/**
		 * Configuration
		 */
		config?: BookmarkManagerConfig;

		/**
		 * Event handlers
		 */
		handlers?: BookmarkManagerHandlers;

		/**
		 * Custom bookmark renderer
		 */
		renderBookmark?: Snippet<[Bookmark, boolean]>;

		/**
		 * Custom empty state renderer
		 */
		renderEmpty?: Snippet;
	}

	let {
		bookmarks,
		folders = [],
		availableTags = [],
		config = {},
		handlers = {},
		renderBookmark,
		renderEmpty,
	}: Props = $props();

	const {
		enableFolders = true,
		enableTags = true,
		enableArchive = true,
		enableBulkActions = true,
		enableExport = true,
		showSearch = true,
		sortOptions = [
			{ value: 'newest', label: 'Newest first' },
			{ value: 'oldest', label: 'Oldest first' },
			{ value: 'author', label: 'By author' },
		],
		defaultSort = 'newest',
		viewMode = 'list',
		itemsPerPage = 20,
		class: className = '',
	} = untrack(() => config);

	let searchQuery = $state('');
	let selectedFolder = $state<string | null>(null);
	let selectedTags = $state<string[]>([]);
	let sortBy = $state(defaultSort);
	let showArchived = $state(false);
	let selectedBookmarks = $state<Set<string>>(new Set());
	let currentPage = $state(1);

	// Menu for bulk actions
	const bulkMenu = createMenu({
		closeOnSelect: true,
		onSelect: (value) => {
			if (value === 'delete') {
				handleBulkDelete();
			} else if (value === 'export') {
				handleExport('json');
			} else if (value === 'archive') {
				handleBulkArchive();
			}
		},
	});

	/**
	 * Filter bookmarks
	 */
	const filteredBookmarks = $derived(() => {
		let results = bookmarks;

		// Filter by archive status
		if (!showArchived) {
			results = results.filter((b) => !b.archived);
		}

		// Filter by folder
		if (selectedFolder) {
			results = results.filter((b) => b.folder === selectedFolder);
		}

		// Filter by tags
		if (selectedTags.length > 0) {
			results = results.filter((b) => selectedTags.every((tag) => b.tags?.includes(tag)));
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			results = results.filter(
				(b) =>
					b.status.content.toLowerCase().includes(query) ||
					b.status.account.displayName.toLowerCase().includes(query) ||
					b.status.account.acct.toLowerCase().includes(query) ||
					b.notes?.toLowerCase().includes(query)
			);
		}

		// Sort
		switch (sortBy) {
			case 'newest':
				results.sort((a, b) => {
					const aTime = typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt;
					const bTime = typeof b.createdAt === 'string' ? new Date(b.createdAt) : b.createdAt;
					return bTime.getTime() - aTime.getTime();
				});
				break;
			case 'oldest':
				results.sort((a, b) => {
					const aTime = typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt;
					const bTime = typeof b.createdAt === 'string' ? new Date(b.createdAt) : b.createdAt;
					return aTime.getTime() - bTime.getTime();
				});
				break;
			case 'author':
				results.sort((a, b) =>
					a.status.account.displayName.localeCompare(b.status.account.displayName)
				);
				break;
		}

		return results;
	});

	/**
	 * Paginate bookmarks
	 */
	const paginatedBookmarks = $derived(
		filteredBookmarks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	);

	/**
	 * Total pages
	 */
	const totalPages = $derived(Math.ceil(filteredBookmarks.length / itemsPerPage));

	/**
	 * Toggle bookmark selection
	 */
	function toggleBookmark(id: string) {
		const newSelection = new Set(selectedBookmarks);
		if (newSelection.has(id)) {
			newSelection.delete(id);
		} else {
			newSelection.add(id);
		}
		selectedBookmarks = newSelection;
	}

	/**
	 * Select all visible bookmarks
	 */
	function selectAll() {
		selectedBookmarks = new Set(paginatedBookmarks.map((b) => b.id));
	}

	/**
	 * Deselect all bookmarks
	 */
	function deselectAll() {
		selectedBookmarks = new Set();
	}

	/**
	 * Remove bookmark
	 */
	async function removeBookmark(id: string) {
		await handlers.onRemove?.(id);
	}

	/**
	 * Bulk delete
	 */
	async function handleBulkDelete() {
		if (selectedBookmarks.size === 0) return;
		await handlers.onBulkRemove?.(Array.from(selectedBookmarks));
		selectedBookmarks = new Set();
	}

	/**
	 * Bulk archive
	 */
	async function handleBulkArchive() {
		if (selectedBookmarks.size === 0) return;
		await Promise.all(
			Array.from(selectedBookmarks).map((id) => handlers.onArchiveToggle?.(id, true))
		);
		selectedBookmarks = new Set();
	}

	/**
	 * Toggle tag
	 */
	function toggleTag(tag: string) {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter((t) => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
	}

	/**
	 * Export bookmarks
	 */
	function handleExport(format: 'json' | 'csv' | 'html') {
		const idsToExport =
			selectedBookmarks.size > 0
				? Array.from(selectedBookmarks)
				: filteredBookmarks.map((b) => b.id);
		handlers.onExport?.(idsToExport, format);
	}

	/**
	 * Get folder color
	 */
	function getFolderColor(folderName: string): string {
		return folders.find((f) => f.name === folderName)?.color || '#1d9bf0';
	}
</script>

<div class={`bookmark-manager bookmark-manager--${viewMode} ${className}`}>
	<div class="bookmark-manager__header">
		<div class="bookmark-manager__title">
			<h2>Bookmarks</h2>
			{#if filteredBookmarks.length > 0}
				<span class="bookmark-manager__count">{filteredBookmarks.length}</span>
			{/if}
		</div>

		<div class="bookmark-manager__actions">
			{#if enableBulkActions && selectedBookmarks.size > 0}
				<button use:bulkMenu.actions.trigger class="bookmark-manager__bulk-btn">
					{selectedBookmarks.size} selected
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path d="M7 10l5 5 5-5z" />
					</svg>
				</button>

				{#if bulkMenu.state.open}
					<div use:bulkMenu.actions.menu class="bookmark-manager__bulk-menu">
						<button use:bulkMenu.actions.item={'delete'} class="bookmark-manager__menu-item">
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
								/>
							</svg>
							Delete
						</button>
						{#if enableArchive}
							<button use:bulkMenu.actions.item={'archive'} class="bookmark-manager__menu-item">
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"
									/>
								</svg>
								Archive
							</button>
						{/if}
						{#if enableExport}
							<button use:bulkMenu.actions.item={'export'} class="bookmark-manager__menu-item">
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"
									/>
								</svg>
								Export
							</button>
						{/if}
					</div>
				{/if}
			{/if}

			{#if enableExport && selectedBookmarks.size === 0}
				<button
					class="bookmark-manager__export-btn"
					onclick={() => handleExport('json')}
					title="Export all"
					aria-label="Export all bookmarks"
				>
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"
						/>
					</svg>
				</button>
			{/if}
		</div>
	</div>

	<div class="bookmark-manager__toolbar">
		{#if showSearch}
			<div class="bookmark-manager__search">
				<svg class="bookmark-manager__search-icon" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
					/>
				</svg>
				<input
					type="text"
					class="bookmark-manager__search-input"
					placeholder="Search bookmarks..."
					bind:value={searchQuery}
				/>
			</div>
		{/if}

		<select bind:value={sortBy} class="bookmark-manager__sort">
			{#each sortOptions as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>

		{#if enableArchive}
			<label class="bookmark-manager__checkbox">
				<input type="checkbox" bind:checked={showArchived} />
				<span>Show archived</span>
			</label>
		{/if}
	</div>

	<div class="bookmark-manager__sidebar">
		{#if enableFolders && folders.length > 0}
			<div class="bookmark-manager__folders">
				<h3>Folders</h3>
				<button
					class="bookmark-manager__folder"
					class:bookmark-manager__folder--active={selectedFolder === null}
					onclick={() => (selectedFolder = null)}
				>
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"
						/>
					</svg>
					All bookmarks
					<span class="bookmark-manager__folder-count">{bookmarks.length}</span>
				</button>

				{#each folders as folder (folder.name)}
					<button
						class="bookmark-manager__folder"
						class:bookmark-manager__folder--active={selectedFolder === folder.name}
						onclick={() => (selectedFolder = folder.name)}
					>
						<svg viewBox="0 0 24 24" fill={getFolderColor(folder.name)}>
							<path
								d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"
							/>
						</svg>
						{folder.name}
						<span class="bookmark-manager__folder-count">{folder.count}</span>
					</button>
				{/each}
			</div>
		{/if}

		{#if enableTags && availableTags.length > 0}
			<div class="bookmark-manager__tags">
				<h3>Tags</h3>
				<div class="bookmark-manager__tag-list">
					{#each availableTags as tag (tag)}
						<button
							class="bookmark-manager__tag"
							class:bookmark-manager__tag--active={selectedTags.includes(tag)}
							onclick={() => toggleTag(tag)}
						>
							#{tag}
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<div class="bookmark-manager__content">
		{#if paginatedBookmarks.length === 0}
			{#if renderEmpty}
				{@render renderEmpty()}
			{:else}
				<div class="bookmark-manager__empty">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"
						/>
					</svg>
					<h3>No bookmarks found</h3>
					<p>
						{#if searchQuery}
							Try a different search term
						{:else}
							Start bookmarking posts to save them here
						{/if}
					</p>
				</div>
			{/if}
		{:else}
			{#if enableBulkActions}
				<div class="bookmark-manager__bulk-controls">
					<button class="bookmark-manager__bulk-select" onclick={selectAll}> Select all </button>
					{#if selectedBookmarks.size > 0}
						<button class="bookmark-manager__bulk-select" onclick={deselectAll}>
							Deselect all
						</button>
					{/if}
				</div>
			{/if}

			<div class="bookmark-manager__list">
				{#each paginatedBookmarks as bookmark (bookmark.id)}
					{#if renderBookmark}
						{@render renderBookmark(bookmark, selectedBookmarks.has(bookmark.id))}
					{:else}
						<div
							class="bookmark-manager__item"
							class:bookmark-manager__item--selected={selectedBookmarks.has(bookmark.id)}
						>
							{#if enableBulkActions}
								<input
									type="checkbox"
									class="bookmark-manager__checkbox-input"
									checked={selectedBookmarks.has(bookmark.id)}
									onchange={() => toggleBookmark(bookmark.id)}
									aria-label="Select bookmark"
								/>
							{/if}

							<button
								class="bookmark-manager__status"
								onclick={() => handlers.onStatusClick?.(bookmark.status)}
							>
								<div class="bookmark-manager__status-content">
									<strong>{bookmark.status.account.displayName}</strong>
									<span>@{bookmark.status.account.acct}</span>
									<p>{bookmark.status.content}</p>
								</div>
							</button>

							<div class="bookmark-manager__item-actions">
								{#if bookmark.folder}
									<span
										class="bookmark-manager__folder-badge"
										style={`background-color: ${getFolderColor(bookmark.folder)}20; color: ${getFolderColor(bookmark.folder)}`}
									>
										{bookmark.folder}
									</span>
								{/if}

								{#if bookmark.tags}
									{#each bookmark.tags as tag (tag)}
										<span class="bookmark-manager__tag-badge">#{tag}</span>
									{/each}
								{/if}

								<button
									class="bookmark-manager__action-btn"
									onclick={() => removeBookmark(bookmark.id)}
									title="Remove bookmark"
									aria-label="Remove bookmark"
								>
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path
											d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
										/>
									</svg>
								</button>
							</div>
						</div>
					{/if}
				{/each}
			</div>

			{#if totalPages > 1}
				<div class="bookmark-manager__pagination">
					<button
						class="bookmark-manager__page-btn"
						onclick={() => (currentPage = Math.max(1, currentPage - 1))}
						disabled={currentPage === 1}
					>
						Previous
					</button>

					<span class="bookmark-manager__page-info">
						Page {currentPage} of {totalPages}
					</span>

					<button
						class="bookmark-manager__page-btn"
						onclick={() => (currentPage = Math.min(totalPages, currentPage + 1))}
						disabled={currentPage === totalPages}
					>
						Next
					</button>
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	.bookmark-manager {
		display: grid;
		grid-template-columns: 250px 1fr;
		grid-template-rows: auto auto 1fr;
		gap: 1rem;
		height: 100%;
		background: var(--bg-primary, #ffffff);
	}

	.bookmark-manager__header {
		grid-column: 1 / -1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid var(--border-color, #e1e8ed);
	}

	.bookmark-manager__title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.bookmark-manager__title h2 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.bookmark-manager__count {
		padding: 0.25rem 0.5rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary, #536471);
	}

	.bookmark-manager__actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		position: relative;
	}

	.bookmark-manager__bulk-btn,
	.bookmark-manager__export-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: var(--primary-color, #1d9bf0);
		border: none;
		border-radius: 9999px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 700;
		color: white;
		transition: background-color 0.2s;
	}

	.bookmark-manager__export-btn {
		padding: 0.5rem;
		border-radius: 50%;
	}

	.bookmark-manager__bulk-btn:hover,
	.bookmark-manager__export-btn:hover {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.bookmark-manager__bulk-btn svg,
	.bookmark-manager__export-btn svg {
		width: 1.25rem;
		height: 1.25rem;
	}

	.bookmark-manager__bulk-menu {
		position: absolute;
		top: 100%;
		right: 0;
		margin-top: 0.5rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		z-index: 1000;
		min-width: 10rem;
	}

	.bookmark-manager__menu-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.75rem 1rem;
		background: transparent;
		border: none;
		text-align: left;
		cursor: pointer;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
		transition: background-color 0.2s;
	}

	.bookmark-manager__menu-item:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.bookmark-manager__menu-item svg {
		width: 1.25rem;
		height: 1.25rem;
		color: var(--text-secondary, #536471);
	}

	.bookmark-manager__toolbar {
		grid-column: 1 / -1;
		display: flex;
		gap: 1rem;
		align-items: center;
		padding: 0 1rem;
		flex-wrap: wrap;
	}

	.bookmark-manager__search {
		position: relative;
		flex: 1;
		min-width: 200px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.bookmark-manager__search-icon {
		position: absolute;
		left: 0.75rem;
		width: 1.25rem;
		height: 1.25rem;
		color: var(--text-secondary, #536471);
		pointer-events: none;
	}

	.bookmark-manager__search-input {
		width: 100%;
		padding: 0.5rem 0.5rem 0.5rem 2.5rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 9999px;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
		background: var(--bg-secondary, #f7f9fa);
	}

	.bookmark-manager__search-input:focus {
		outline: 2px solid var(--primary-color, #1d9bf0);
		outline-offset: -2px;
		background: var(--bg-primary, #ffffff);
	}

	.bookmark-manager__sort {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.25rem;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
		background: var(--bg-primary, #ffffff);
		cursor: pointer;
	}

	.bookmark-manager__checkbox {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
		cursor: pointer;
	}

	.bookmark-manager__sidebar {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 0 1rem;
		overflow-y: auto;
	}

	.bookmark-manager__folders h3,
	.bookmark-manager__tags h3 {
		margin: 0 0 0.75rem 0;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-secondary, #536471);
		text-transform: uppercase;
	}

	.bookmark-manager__folder {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.5rem;
		background: transparent;
		border: none;
		border-radius: 0.25rem;
		text-align: left;
		cursor: pointer;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
		transition: background-color 0.2s;
	}

	.bookmark-manager__folder:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.bookmark-manager__folder--active {
		background: var(--bg-selected, #e8f5fe);
		font-weight: 600;
	}

	.bookmark-manager__folder svg {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	.bookmark-manager__folder-count {
		margin-left: auto;
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
	}

	.bookmark-manager__tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.bookmark-manager__tag {
		padding: 0.25rem 0.75rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 9999px;
		cursor: pointer;
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
		transition: all 0.2s;
	}

	.bookmark-manager__tag:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.bookmark-manager__tag--active {
		background: var(--primary-color, #1d9bf0);
		border-color: var(--primary-color, #1d9bf0);
		color: white;
	}

	.bookmark-manager__content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 0 1rem 1rem;
		overflow-y: auto;
	}

	.bookmark-manager__bulk-controls {
		display: flex;
		gap: 1rem;
	}

	.bookmark-manager__bulk-select {
		padding: 0.25rem 0.5rem;
		background: transparent;
		border: none;
		cursor: pointer;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--primary-color, #1d9bf0);
		text-decoration: underline;
	}

	.bookmark-manager__list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.bookmark-manager__item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		transition: all 0.2s;
	}

	.bookmark-manager__item:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.bookmark-manager__item--selected {
		background: var(--bg-selected, #e8f5fe);
		border-color: var(--primary-color, #1d9bf0);
	}

	.bookmark-manager__checkbox-input {
		cursor: pointer;
	}

	.bookmark-manager__status {
		flex: 1;
		padding: 0;
		background: transparent;
		border: none;
		text-align: left;
		cursor: pointer;
	}

	.bookmark-manager__status-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.bookmark-manager__status-content strong {
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
	}

	.bookmark-manager__status-content span {
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
	}

	.bookmark-manager__status-content p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.bookmark-manager__item-actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.bookmark-manager__folder-badge,
	.bookmark-manager__tag-badge {
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.625rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.bookmark-manager__tag-badge {
		background: var(--bg-secondary, #f7f9fa);
		color: var(--text-secondary, #536471);
	}

	.bookmark-manager__action-btn {
		padding: 0.5rem;
		background: transparent;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		color: var(--text-secondary, #536471);
		transition: all 0.2s;
	}

	.bookmark-manager__action-btn:hover {
		background: rgba(244, 33, 46, 0.1);
		color: #f4211e;
	}

	.bookmark-manager__action-btn svg {
		width: 1.25rem;
		height: 1.25rem;
		display: block;
	}

	.bookmark-manager__empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		text-align: center;
	}

	.bookmark-manager__empty svg {
		width: 4rem;
		height: 4rem;
		color: var(--text-tertiary, #8899a6);
		margin-bottom: 1rem;
	}

	.bookmark-manager__empty h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.bookmark-manager__empty p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.bookmark-manager__pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
	}

	.bookmark-manager__page-btn {
		padding: 0.5rem 1rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
		transition: all 0.2s;
	}

	.bookmark-manager__page-btn:hover:not(:disabled) {
		background: var(--bg-hover, #eff3f4);
	}

	.bookmark-manager__page-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.bookmark-manager__page-info {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}
</style>
