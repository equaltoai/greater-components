<!--
  CustomEmojiPicker - Server-Specific Emoji Support
  
  Provides an emoji picker with custom server emojis, categories, search, and favorites.
  Fully accessible with keyboard navigation and ARIA support.
  
  @component
  @example
  ```svelte
  <CustomEmojiPicker
    emojis={customEmojis}
    {config}
    {handlers}
  />
  ```
-->
<script lang="ts">
	import { type Snippet, untrack } from 'svelte';

	export interface CustomEmoji {
		/**
		 * Unique shortcode (e.g., "blobcat")
		 */
		shortcode: string;

		/**
		 * Display URL
		 */
		url: string;

		/**
		 * Static URL (for non-animated version)
		 */
		staticUrl?: string;

		/**
		 * Category
		 */
		category?: string;

		/**
		 * Visible in picker
		 */
		visibleInPicker?: boolean;

		/**
		 * Alt text / description
		 */
		description?: string;

		/**
		 * Tags for searching
		 */
		tags?: string[];

		/**
		 * Usage count (for sorting)
		 */
		usageCount?: number;
	}

	interface CustomEmojiPickerConfig {
		/**
		 * Display mode
		 */
		mode?: 'inline' | 'popover' | 'modal';

		/**
		 * Show search box
		 */
		showSearch?: boolean;

		/**
		 * Show categories
		 */
		showCategories?: boolean;

		/**
		 * Show favorites section
		 */
		showFavorites?: boolean;

		/**
		 * Show recently used section
		 */
		showRecent?: boolean;

		/**
		 * Max emojis to show initially (before scrolling)
		 */
		maxVisible?: number;

		/**
		 * Emoji size in pixels
		 */
		emojiSize?: number;

		/**
		 * Enable auto-complete suggestions
		 */
		enableAutocomplete?: boolean;

		/**
		 * Prefix for autocomplete (default ":")
		 */
		autocompletePrefix?: string;

		/**
		 * Custom CSS class
		 */
		class?: string;

		/**
		 * Prefer static (non-animated) emojis
		 */
		preferStatic?: boolean;
	}

	interface CustomEmojiPickerHandlers {
		/**
		 * Called when emoji is selected
		 */
		onSelect?: (emoji: CustomEmoji) => void;

		/**
		 * Called when emoji is favorited/unfavorited
		 */
		onToggleFavorite?: (shortcode: string, isFavorite: boolean) => void;

		/**
		 * Called when category changes
		 */
		onCategoryChange?: (category: string) => void;

		/**
		 * Called when search query changes
		 */
		onSearch?: (query: string) => void;
	}

	interface Props {
		/**
		 * Available custom emojis
		 */
		emojis: CustomEmoji[];

		/**
		 * Recently used emoji shortcodes
		 */
		recentEmojis?: string[];

		/**
		 * Favorited emoji shortcodes
		 */
		favoriteEmojis?: string[];

		/**
		 * Configuration
		 */
		config?: CustomEmojiPickerConfig;

		/**
		 * Event handlers
		 */
		handlers?: CustomEmojiPickerHandlers;

		/**
		 * Custom emoji renderer
		 */
		renderEmoji?: Snippet<[CustomEmoji]>;

		/**
		 * Custom category renderer
		 */
		renderCategory?: Snippet<[string, CustomEmoji[]]>;
	}

	let {
		emojis,
		recentEmojis = [],
		favoriteEmojis = [],
		config = {},
		handlers = {},
		renderEmoji,
		renderCategory,
	}: Props = $props();

	const {
		mode = 'popover',
		showSearch = true,
		showCategories = true,
		showFavorites = true,
		showRecent = true,
		maxVisible = 200,
		emojiSize = 32,
		enableAutocomplete = true,
		autocompletePrefix = ':',
		class: className = '',
		preferStatic = false,
	} = untrack(() => config);

	const emojiSizePreset = emojiSize <= 24 ? 'sm' : emojiSize <= 36 ? 'md' : 'lg';

	let searchQuery = $state('');
	let selectedCategory = $state<string>('all');
	let hoveredEmoji = $state<string | null>(null);

	/**
	 * Get categories from emojis
	 */
	const categories = $derived(() => {
		const cats = new Set<string>();
		emojis.forEach((emoji) => {
			if (emoji.category && emoji.visibleInPicker !== false) {
				cats.add(emoji.category);
			}
		});
		return ['all', ...Array.from(cats).sort()];
	});

	/**
	 * Group emojis by category
	 */
	const emojisByCategory = $derived(() => {
		const grouped: Record<string, CustomEmoji[]> = {};

		emojis
			.filter((emoji) => emoji.visibleInPicker !== false)
			.forEach((emoji) => {
				const cat = emoji.category || 'uncategorized';
				if (!grouped[cat]) grouped[cat] = [];
				grouped[cat].push(emoji);
			});

		// Sort each category by usage count
		Object.keys(grouped).forEach((cat) => {
			grouped[cat].sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
		});

		return grouped;
	});

	/**
	 * Get recent emojis
	 */
	const recentEmojisList = $derived(() => {
		return recentEmojis
			.map((shortcode) => emojis.find((e) => e.shortcode === shortcode))
			.filter((e): e is CustomEmoji => e !== undefined)
			.slice(0, 20);
	});

	/**
	 * Get favorite emojis
	 */
	const favoriteEmojisList = $derived(() => {
		return favoriteEmojis
			.map((shortcode) => emojis.find((e) => e.shortcode === shortcode))
			.filter((e): e is CustomEmoji => e !== undefined);
	});

	/**
	 * Filter emojis by search query
	 */
	const filteredEmojis = $derived(() => {
		if (!searchQuery.trim()) {
			if (selectedCategory === 'all') {
				return emojis.filter((e) => e.visibleInPicker !== false).slice(0, maxVisible);
			}
			return emojisByCategory[selectedCategory] || [];
		}

		const query = searchQuery.toLowerCase();
		return emojis
			.filter((emoji) => {
				if (emoji.visibleInPicker === false) return false;
				const matchShortcode = emoji.shortcode.toLowerCase().includes(query);
				const matchTags = emoji.tags?.some((tag) => tag.toLowerCase().includes(query));
				const matchDescription = emoji.description?.toLowerCase().includes(query);
				return matchShortcode || matchTags || matchDescription;
			})
			.slice(0, maxVisible);
	});

	/**
	 * Get emoji URL (static or animated)
	 */
	function getEmojiUrl(emoji: CustomEmoji): string {
		if (preferStatic && emoji.staticUrl) {
			return emoji.staticUrl;
		}
		return emoji.url;
	}

	/**
	 * Select emoji
	 */
	function selectEmoji(emoji: CustomEmoji) {
		handlers.onSelect?.(emoji);
	}

	/**
	 * Toggle favorite
	 */
	function toggleFavorite(shortcode: string, event: Event) {
		event.stopPropagation();
		const isFavorite = favoriteEmojis.includes(shortcode);
		handlers.onToggleFavorite?.(shortcode, !isFavorite);
	}

	function handleFavoriteKeyPress(event: KeyboardEvent, shortcode: string) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggleFavorite(shortcode, event);
		}
	}

	/**
	 * Handle search input
	 */
	function handleSearch(event: Event) {
		const target = event.target as HTMLInputElement;
		searchQuery = target.value;
		handlers.onSearch?.(searchQuery);
	}

	/**
	 * Handle category change
	 */
	function handleCategoryChange(category: string) {
		selectedCategory = category;
		handlers.onCategoryChange?.(category);
	}

	/**
	 * Get autocomplete suggestions
	 */
	export function getAutocompleteSuggestions(text: string, cursorPosition: number): CustomEmoji[] {
		if (!enableAutocomplete) return [];

		// Find the last occurrence of autocompletePrefix before cursor
		const textBeforeCursor = text.substring(0, cursorPosition);
		const lastPrefixIndex = textBeforeCursor.lastIndexOf(autocompletePrefix);

		if (lastPrefixIndex === -1) return [];

		// Extract the query after the prefix
		const query = textBeforeCursor.substring(lastPrefixIndex + autocompletePrefix.length);

		// Don't suggest if there's a space after prefix
		if (query.includes(' ')) return [];

		// Filter emojis by query
		return emojis
			.filter((emoji) => {
				if (emoji.visibleInPicker === false) return false;
				return emoji.shortcode.toLowerCase().startsWith(query.toLowerCase());
			})
			.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
			.slice(0, 10);
	}
</script>

<div
	class={`emoji-picker emoji-picker--${mode} emoji-picker--size-${emojiSizePreset} ${className}`}
>
	{#if showSearch}
		<div class="emoji-picker__search">
			<svg class="emoji-picker__search-icon" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
				/>
			</svg>
			<input
				type="text"
				class="emoji-picker__search-input"
				placeholder="Search emojis..."
				value={searchQuery}
				oninput={handleSearch}
				aria-label="Search emojis"
			/>
			{#if searchQuery}
				<button
					class="emoji-picker__search-clear"
					onclick={() => {
						searchQuery = '';
						handlers.onSearch?.('');
					}}
					aria-label="Clear search"
				>
					×
				</button>
			{/if}
		</div>
	{/if}

	{#if showCategories && !searchQuery}
		<div class="emoji-picker__categories" role="tablist">
			{#each categories as category (category)}
				<button
					class="emoji-picker__category-tab"
					class:emoji-picker__category-tab--active={selectedCategory === category}
					onclick={() => handleCategoryChange(category)}
					role="tab"
					aria-selected={selectedCategory === category}
					aria-controls={`emoji-panel-${category}`}
				>
					{category}
				</button>
			{/each}
		</div>
	{/if}

	<div class="emoji-picker__content" role="tabpanel">
		{#if searchQuery}
			<!-- Search results -->
			{#if filteredEmojis.length > 0}
				<div class="emoji-picker__grid">
					{#each filteredEmojis as emoji (emoji.shortcode)}
						<button
							class="emoji-picker__emoji"
							class:emoji-picker__emoji--favorite={favoriteEmojis.includes(emoji.shortcode)}
							onclick={() => selectEmoji(emoji)}
							onmouseenter={() => (hoveredEmoji = emoji.shortcode)}
							onmouseleave={() => (hoveredEmoji = null)}
							title={`:${emoji.shortcode}:`}
							aria-label={emoji.description || `Emoji ${emoji.shortcode}`}
						>
							{#if renderEmoji}
								{@render renderEmoji(emoji)}
							{:else}
								<img src={getEmojiUrl(emoji)} alt={`:${emoji.shortcode}:`} loading="lazy" />
							{/if}

							{#if showFavorites}
								<span
									class="emoji-picker__favorite-btn"
									role="button"
									tabindex="0"
									onclick={(e) => toggleFavorite(emoji.shortcode, e)}
									onkeydown={(event) => handleFavoriteKeyPress(event, emoji.shortcode)}
									aria-label={favoriteEmojis.includes(emoji.shortcode)
										? 'Remove from favorites'
										: 'Add to favorites'}
								>
									{#if favoriteEmojis.includes(emoji.shortcode)}
										★
									{:else}
										☆
									{/if}
								</span>
							{/if}
						</button>
					{/each}
				</div>
			{:else}
				<div class="emoji-picker__empty">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
						/>
					</svg>
					<p>No emojis found</p>
					<p class="emoji-picker__empty-hint">Try a different search term</p>
				</div>
			{/if}
		{:else}
			<!-- Category view -->
			{#if showFavorites && favoriteEmojisList.length > 0}
				<section class="emoji-picker__section">
					<h3 class="emoji-picker__section-title">Favorites</h3>
					<div class="emoji-picker__grid">
						{#each favoriteEmojisList as emoji (emoji.shortcode)}
							<button
								class="emoji-picker__emoji emoji-picker__emoji--favorite"
								onclick={() => selectEmoji(emoji)}
								onmouseenter={() => (hoveredEmoji = emoji.shortcode)}
								onmouseleave={() => (hoveredEmoji = null)}
								title={`:${emoji.shortcode}:`}
								aria-label={emoji.description || `Emoji ${emoji.shortcode}`}
							>
								<img src={getEmojiUrl(emoji)} alt={`:${emoji.shortcode}:`} loading="lazy" />
								<span
									class="emoji-picker__favorite-btn"
									role="button"
									tabindex="0"
									onclick={(e) => toggleFavorite(emoji.shortcode, e)}
									onkeydown={(event) => handleFavoriteKeyPress(event, emoji.shortcode)}
									aria-label="Remove from favorites"
								>
									★
								</span>
							</button>
						{/each}
					</div>
				</section>
			{/if}

			{#if showRecent && recentEmojisList.length > 0}
				<section class="emoji-picker__section">
					<h3 class="emoji-picker__section-title">Recently Used</h3>
					<div class="emoji-picker__grid">
						{#each recentEmojisList as emoji (emoji.shortcode)}
							<button
								class="emoji-picker__emoji"
								class:emoji-picker__emoji--favorite={favoriteEmojis.includes(emoji.shortcode)}
								onclick={() => selectEmoji(emoji)}
								onmouseenter={() => (hoveredEmoji = emoji.shortcode)}
								onmouseleave={() => (hoveredEmoji = null)}
								title={`:${emoji.shortcode}:`}
								aria-label={emoji.description || `Emoji ${emoji.shortcode}`}
							>
								<img src={getEmojiUrl(emoji)} alt={`:${emoji.shortcode}:`} loading="lazy" />
								{#if showFavorites}
									<span
										class="emoji-picker__favorite-btn"
										role="button"
										tabindex="0"
										onclick={(e) => toggleFavorite(emoji.shortcode, e)}
										onkeydown={(event) => handleFavoriteKeyPress(event, emoji.shortcode)}
										aria-label={favoriteEmojis.includes(emoji.shortcode)
											? 'Remove from favorites'
											: 'Add to favorites'}
									>
										{#if favoriteEmojis.includes(emoji.shortcode)}
											★
										{:else}
											☆
										{/if}
									</span>
								{/if}
							</button>
						{/each}
					</div>
				</section>
			{/if}

			{#if selectedCategory === 'all'}
				<!-- Show all categories -->
				{#each Object.entries(emojisByCategory) as [category, categoryEmojis] (category)}
					{#if categoryEmojis.length > 0}
						<section class="emoji-picker__section">
							{#if renderCategory}
								{@render renderCategory(category, categoryEmojis)}
							{:else}
								<h3 class="emoji-picker__section-title">{category}</h3>
								<div class="emoji-picker__grid">
									{#each categoryEmojis.slice(0, maxVisible) as emoji (emoji.shortcode)}
										<button
											class="emoji-picker__emoji"
											class:emoji-picker__emoji--favorite={favoriteEmojis.includes(emoji.shortcode)}
											onclick={() => selectEmoji(emoji)}
											onmouseenter={() => (hoveredEmoji = emoji.shortcode)}
											onmouseleave={() => (hoveredEmoji = null)}
											title={`:${emoji.shortcode}:`}
											aria-label={emoji.description || `Emoji ${emoji.shortcode}`}
										>
											<img src={getEmojiUrl(emoji)} alt={`:${emoji.shortcode}:`} loading="lazy" />
											{#if showFavorites}
												<span
													class="emoji-picker__favorite-btn"
													role="button"
													tabindex="0"
													onclick={(e) => toggleFavorite(emoji.shortcode, e)}
													onkeydown={(event) => handleFavoriteKeyPress(event, emoji.shortcode)}
													aria-label={favoriteEmojis.includes(emoji.shortcode)
														? 'Remove from favorites'
														: 'Add to favorites'}
												>
													{#if favoriteEmojis.includes(emoji.shortcode)}
														★
													{:else}
														☆
													{/if}
												</span>
											{/if}
										</button>
									{/each}
								</div>
							{/if}
						</section>
					{/if}
				{/each}
			{:else}
				<!-- Show selected category -->
				{#if emojisByCategory[selectedCategory]?.length > 0}
					<div class="emoji-picker__grid">
						{#each emojisByCategory[selectedCategory] as emoji (emoji.shortcode)}
							<button
								class="emoji-picker__emoji"
								class:emoji-picker__emoji--favorite={favoriteEmojis.includes(emoji.shortcode)}
								onclick={() => selectEmoji(emoji)}
								onmouseenter={() => (hoveredEmoji = emoji.shortcode)}
								onmouseleave={() => (hoveredEmoji = null)}
								title={`:${emoji.shortcode}:`}
								aria-label={emoji.description || `Emoji ${emoji.shortcode}`}
							>
								<img src={getEmojiUrl(emoji)} alt={`:${emoji.shortcode}:`} loading="lazy" />
								{#if showFavorites}
									<span
										class="emoji-picker__favorite-btn"
										role="button"
										tabindex="0"
										onclick={(e) => toggleFavorite(emoji.shortcode, e)}
										onkeydown={(event) => handleFavoriteKeyPress(event, emoji.shortcode)}
										aria-label={favoriteEmojis.includes(emoji.shortcode)
											? 'Remove from favorites'
											: 'Add to favorites'}
									>
										{#if favoriteEmojis.includes(emoji.shortcode)}
											★
										{:else}
											☆
										{/if}
									</span>
								{/if}
							</button>
						{/each}
					</div>
				{/if}
			{/if}
		{/if}
	</div>

	{#if hoveredEmoji}
		{@const emoji = emojis.find((e) => e.shortcode === hoveredEmoji)}
		{#if emoji}
			<div class="emoji-picker__preview">
				<img
					src={getEmojiUrl(emoji)}
					alt={`:${emoji.shortcode}:`}
					class="emoji-picker__preview-img"
				/>
				<div class="emoji-picker__preview-info">
					<strong>:{emoji.shortcode}:</strong>
					{#if emoji.description}
						<span>{emoji.description}</span>
					{/if}
				</div>
			</div>
		{/if}
	{/if}
</div>

<style>
	.emoji-picker {
		display: flex;
		flex-direction: column;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		overflow: hidden;
		--emoji-size: 2rem;
	}

	.emoji-picker--size-sm {
		--emoji-size: 1.5rem;
	}

	.emoji-picker--size-md {
		--emoji-size: 2rem;
	}

	.emoji-picker--size-lg {
		--emoji-size: 2.5rem;
	}

	.emoji-picker--popover {
		width: 22rem;
		max-height: 26rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.emoji-picker--inline {
		width: 100%;
		height: 100%;
	}

	.emoji-picker--modal {
		width: 32rem;
		max-height: 36rem;
	}

	/* Search */
	.emoji-picker__search {
		position: relative;
		display: flex;
		align-items: center;
		padding: 0.75rem;
		border-bottom: 1px solid var(--border-color, #e1e8ed);
		gap: 0.5rem;
	}

	.emoji-picker__search-icon {
		width: 1.25rem;
		height: 1.25rem;
		color: var(--text-secondary, #536471);
		flex-shrink: 0;
	}

	.emoji-picker__search-input {
		flex: 1;
		padding: 0.5rem;
		border: none;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 0.25rem;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
	}

	.emoji-picker__search-input:focus {
		outline: 2px solid var(--primary-color, #1d9bf0);
		outline-offset: -2px;
	}

	.emoji-picker__search-clear {
		padding: 0.25rem 0.5rem;
		background: transparent;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 1.5rem;
		line-height: 1;
		color: var(--text-secondary, #536471);
		transition: all 0.2s;
	}

	.emoji-picker__search-clear:hover {
		background: var(--bg-hover, #eff3f4);
		color: var(--text-primary, #0f1419);
	}

	/* Categories */
	.emoji-picker__categories {
		display: flex;
		gap: 0.25rem;
		padding: 0.5rem;
		border-bottom: 1px solid var(--border-color, #e1e8ed);
		overflow-x: auto;
		scrollbar-width: thin;
	}

	.emoji-picker__category-tab {
		padding: 0.5rem 0.75rem;
		background: transparent;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary, #536471);
		text-transform: capitalize;
		white-space: nowrap;
		transition: all 0.2s;
	}

	.emoji-picker__category-tab:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.emoji-picker__category-tab--active {
		background: var(--primary-color, #1d9bf0);
		color: white;
	}

	/* Content */
	.emoji-picker__content {
		flex: 1;
		overflow-y: auto;
		padding: 0.75rem;
	}

	.emoji-picker__section {
		margin-bottom: 1.5rem;
	}

	.emoji-picker__section:last-child {
		margin-bottom: 0;
	}

	.emoji-picker__section-title {
		margin: 0 0 0.5rem 0;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
		text-transform: capitalize;
	}

	.emoji-picker__grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(var(--emoji-size), 1fr));
		gap: 0.25rem;
	}

	.emoji-picker__emoji {
		position: relative;
		box-sizing: border-box;
		width: var(--emoji-size);
		height: var(--emoji-size);
		padding: 0.25rem;
		background: transparent;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.emoji-picker__emoji:hover {
		background: var(--bg-hover, #eff3f4);
		transform: scale(1.1);
	}

	.emoji-picker__emoji img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.emoji-picker__emoji--favorite {
		outline: 2px solid var(--primary-color, #1d9bf0);
		outline-offset: -2px;
	}

	.emoji-picker__favorite-btn {
		position: absolute;
		top: 0;
		right: 0;
		padding: 0.125rem;
		background: rgba(0, 0, 0, 0.6);
		border: none;
		border-radius: 0 0.25rem 0 0.25rem;
		cursor: pointer;
		color: #ffd700;
		font-size: 0.75rem;
		line-height: 1;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.emoji-picker__emoji:hover .emoji-picker__favorite-btn {
		opacity: 1;
	}

	.emoji-picker__emoji--favorite .emoji-picker__favorite-btn {
		opacity: 1;
	}

	/* Empty state */
	.emoji-picker__empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		text-align: center;
	}

	.emoji-picker__empty svg {
		width: 3rem;
		height: 3rem;
		color: var(--text-tertiary, #8899a6);
		margin-bottom: 1rem;
	}

	.emoji-picker__empty p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.emoji-picker__empty-hint {
		font-size: 0.75rem;
		color: var(--text-tertiary, #8899a6);
		margin-top: 0.25rem;
	}

	/* Preview */
	.emoji-picker__preview {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		border-top: 1px solid var(--border-color, #e1e8ed);
		background: var(--bg-secondary, #f7f9fa);
	}

	.emoji-picker__preview-img {
		width: 2rem;
		height: 2rem;
		flex-shrink: 0;
	}

	.emoji-picker__preview-info {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		min-width: 0;
	}

	.emoji-picker__preview-info strong {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.emoji-picker__preview-info span {
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
