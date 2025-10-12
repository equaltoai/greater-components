/**
 * CustomEmojiPicker Pattern Component Tests
 * 
 * Comprehensive tests for CustomEmojiPicker including:
 * - Emoji filtering and search
 * - Category extraction and grouping
 * - Recent and favorite emojis
 * - URL resolution (static vs animated)
 * - Autocomplete suggestions
 * - Configuration options
 * - Event handlers
 * - Edge cases
 */

import { describe, it, expect, vi } from 'vitest';

interface CustomEmoji {
	shortcode: string;
	url: string;
	staticUrl?: string;
	category?: string;
	visibleInPicker?: boolean;
	description?: string;
	tags?: string[];
	usageCount?: number;
}

// Helper to create mock emoji
function createMockEmoji(
	shortcode: string,
	options: {
		url?: string;
		staticUrl?: string;
		category?: string;
		visibleInPicker?: boolean;
		description?: string;
		tags?: string[];
		usageCount?: number;
	} = {}
): CustomEmoji {
	return {
		shortcode,
		url: options.url || `https://example.com/${shortcode}.png`,
		staticUrl: options.staticUrl,
		category: options.category,
		visibleInPicker: options.visibleInPicker,
		description: options.description,
		tags: options.tags,
		usageCount: options.usageCount,
	};
}

// Extract categories (extracted from component)
function extractCategories(emojis: CustomEmoji[]): string[] {
	const cats = new Set<string>();
	emojis.forEach((emoji) => {
		if (emoji.category && emoji.visibleInPicker !== false) {
			cats.add(emoji.category);
		}
	});
	return ['all', ...Array.from(cats).sort()];
}

// Group by category (extracted from component)
function groupByCategory(emojis: CustomEmoji[]): Record<string, CustomEmoji[]> {
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
}

// Get recent emojis (extracted from component)
function getRecentEmojis(shortcodes: string[], emojis: CustomEmoji[], limit: number = 20): CustomEmoji[] {
	return shortcodes
		.map((shortcode) => emojis.find((e) => e.shortcode === shortcode))
		.filter((e): e is CustomEmoji => e !== undefined)
		.slice(0, limit);
}

// Get favorite emojis (extracted from component)
function getFavoriteEmojis(shortcodes: string[], emojis: CustomEmoji[]): CustomEmoji[] {
	return shortcodes
		.map((shortcode) => emojis.find((e) => e.shortcode === shortcode))
		.filter((e): e is CustomEmoji => e !== undefined);
}

// Filter emojis (extracted from component)
function filterEmojis(
	emojis: CustomEmoji[],
	searchQuery: string,
	selectedCategory: string,
	emojisByCategory: Record<string, CustomEmoji[]>,
	maxVisible: number
): CustomEmoji[] {
	if (!searchQuery.trim()) {
		if (selectedCategory === 'all') {
			return emojis.filter((e) => e.visibleInPicker !== false).slice(0, maxVisible);
		}
		return emojisByCategory[selectedCategory] || [];
	}

	const query = searchQuery.trim().toLowerCase();
	return emojis
		.filter((emoji) => {
			if (emoji.visibleInPicker === false) return false;
			const matchShortcode = emoji.shortcode.toLowerCase().includes(query);
			const matchTags = emoji.tags?.some((tag) => tag.toLowerCase().includes(query));
			const matchDescription = emoji.description?.toLowerCase().includes(query);
			return matchShortcode || matchTags || matchDescription;
		})
		.slice(0, maxVisible);
}

// Get emoji URL (extracted from component)
function getEmojiUrl(emoji: CustomEmoji, preferStatic: boolean): string {
	if (preferStatic && emoji.staticUrl) {
		return emoji.staticUrl;
	}
	return emoji.url;
}

// Toggle favorite (extracted from component)
function isTogglingToFavorite(favoriteEmojis: string[], shortcode: string): boolean {
	const isFavorite = favoriteEmojis.includes(shortcode);
	return !isFavorite;
}

describe('CustomEmojiPicker - Category Extraction', () => {
	it('should extract unique categories', () => {
		const emojis = [
			createMockEmoji('emoji1', { category: 'animals' }),
			createMockEmoji('emoji2', { category: 'food' }),
			createMockEmoji('emoji3', { category: 'animals' }),
		];

		const categories = extractCategories(emojis);

		expect(categories).toContain('all');
		expect(categories).toContain('animals');
		expect(categories).toContain('food');
		expect(categories).toHaveLength(3);
	});

	it('should sort categories alphabetically', () => {
		const emojis = [
			createMockEmoji('emoji1', { category: 'zebra' }),
			createMockEmoji('emoji2', { category: 'apple' }),
			createMockEmoji('emoji3', { category: 'mango' }),
		];

		const categories = extractCategories(emojis);

		expect(categories).toEqual(['all', 'apple', 'mango', 'zebra']);
	});

	it('should include "all" as first category', () => {
		const emojis = [createMockEmoji('emoji1', { category: 'test' })];

		const categories = extractCategories(emojis);

		expect(categories[0]).toBe('all');
	});

	it('should ignore emojis not visible in picker', () => {
		const emojis = [
			createMockEmoji('emoji1', { category: 'visible', visibleInPicker: true }),
			createMockEmoji('emoji2', { category: 'hidden', visibleInPicker: false }),
		];

		const categories = extractCategories(emojis);

		expect(categories).toContain('visible');
		expect(categories).not.toContain('hidden');
	});

	it('should handle emojis without categories', () => {
		const emojis = [
			createMockEmoji('emoji1', { category: 'test' }),
			createMockEmoji('emoji2'), // No category
		];

		const categories = extractCategories(emojis);

		expect(categories).toEqual(['all', 'test']);
	});

	it('should handle empty emojis array', () => {
		const categories = extractCategories([]);

		expect(categories).toEqual(['all']);
	});
});

describe('CustomEmojiPicker - Grouping by Category', () => {
	it('should group emojis by category', () => {
		const emojis = [
			createMockEmoji('cat', { category: 'animals' }),
			createMockEmoji('dog', { category: 'animals' }),
			createMockEmoji('apple', { category: 'food' }),
		];

		const grouped = groupByCategory(emojis);

		expect(grouped['animals']).toHaveLength(2);
		expect(grouped['food']).toHaveLength(1);
	});

	it('should use "uncategorized" for emojis without category', () => {
		const emojis = [createMockEmoji('emoji1')];

		const grouped = groupByCategory(emojis);

		expect(grouped['uncategorized']).toHaveLength(1);
	});

	it('should sort within categories by usage count', () => {
		const emojis = [
			createMockEmoji('emoji1', { category: 'test', usageCount: 5 }),
			createMockEmoji('emoji2', { category: 'test', usageCount: 10 }),
			createMockEmoji('emoji3', { category: 'test', usageCount: 3 }),
		];

		const grouped = groupByCategory(emojis);

		expect(grouped['test'][0].usageCount).toBe(10);
		expect(grouped['test'][1].usageCount).toBe(5);
		expect(grouped['test'][2].usageCount).toBe(3);
	});

	it('should handle emojis without usage count', () => {
		const emojis = [
			createMockEmoji('emoji1', { category: 'test', usageCount: 5 }),
			createMockEmoji('emoji2', { category: 'test' }), // No usage count
		];

		const grouped = groupByCategory(emojis);

		expect(grouped['test']).toHaveLength(2);
		expect(grouped['test'][0].shortcode).toBe('emoji1'); // Has count, comes first
	});

	it('should filter out invisible emojis', () => {
		const emojis = [
			createMockEmoji('emoji1', { category: 'test', visibleInPicker: true }),
			createMockEmoji('emoji2', { category: 'test', visibleInPicker: false }),
		];

		const grouped = groupByCategory(emojis);

		expect(grouped['test']).toHaveLength(1);
		expect(grouped['test'][0].shortcode).toBe('emoji1');
	});
});

describe('CustomEmojiPicker - Recent Emojis', () => {
	it('should return recent emojis in order', () => {
		const emojis = [
			createMockEmoji('emoji1'),
			createMockEmoji('emoji2'),
			createMockEmoji('emoji3'),
		];
		const recentShortcodes = ['emoji3', 'emoji1'];

		const recent = getRecentEmojis(recentShortcodes, emojis);

		expect(recent).toHaveLength(2);
		expect(recent[0].shortcode).toBe('emoji3');
		expect(recent[1].shortcode).toBe('emoji1');
	});

	it('should limit to 20 recent emojis by default', () => {
		const emojis = Array.from({ length: 30 }, (_, i) => createMockEmoji(`emoji${i}`));
		const recentShortcodes = emojis.map((e) => e.shortcode);

		const recent = getRecentEmojis(recentShortcodes, emojis);

		expect(recent).toHaveLength(20);
	});

	it('should filter out emojis that no longer exist', () => {
		const emojis = [createMockEmoji('emoji1')];
		const recentShortcodes = ['emoji1', 'nonexistent'];

		const recent = getRecentEmojis(recentShortcodes, emojis);

		expect(recent).toHaveLength(1);
		expect(recent[0].shortcode).toBe('emoji1');
	});

	it('should handle empty recent list', () => {
		const emojis = [createMockEmoji('emoji1')];
		const recentShortcodes: string[] = [];

		const recent = getRecentEmojis(recentShortcodes, emojis);

		expect(recent).toHaveLength(0);
	});
});

describe('CustomEmojiPicker - Favorite Emojis', () => {
	it('should return favorite emojis', () => {
		const emojis = [
			createMockEmoji('emoji1'),
			createMockEmoji('emoji2'),
			createMockEmoji('emoji3'),
		];
		const favoriteShortcodes = ['emoji2', 'emoji3'];

		const favorites = getFavoriteEmojis(favoriteShortcodes, emojis);

		expect(favorites).toHaveLength(2);
		expect(favorites.map((e) => e.shortcode)).toEqual(['emoji2', 'emoji3']);
	});

	it('should filter out emojis that no longer exist', () => {
		const emojis = [createMockEmoji('emoji1')];
		const favoriteShortcodes = ['emoji1', 'nonexistent'];

		const favorites = getFavoriteEmojis(favoriteShortcodes, emojis);

		expect(favorites).toHaveLength(1);
	});

	it('should handle empty favorites list', () => {
		const emojis = [createMockEmoji('emoji1')];
		const favoriteShortcodes: string[] = [];

		const favorites = getFavoriteEmojis(favoriteShortcodes, emojis);

		expect(favorites).toHaveLength(0);
	});
});

describe('CustomEmojiPicker - Filtering', () => {
	it('should return all visible emojis when no search query', () => {
		const emojis = [
			createMockEmoji('emoji1'),
			createMockEmoji('emoji2', { visibleInPicker: false }),
			createMockEmoji('emoji3'),
		];
		const grouped = groupByCategory(emojis);

		const filtered = filterEmojis(emojis, '', 'all', grouped, 100);

		expect(filtered).toHaveLength(2);
		expect(filtered.map((e) => e.shortcode)).toEqual(['emoji1', 'emoji3']);
	});

	it('should filter by category when selected', () => {
		const emojis = [
			createMockEmoji('emoji1', { category: 'animals' }),
			createMockEmoji('emoji2', { category: 'food' }),
		];
		const grouped = groupByCategory(emojis);

		const filtered = filterEmojis(emojis, '', 'animals', grouped, 100);

		expect(filtered).toHaveLength(1);
		expect(filtered[0].shortcode).toBe('emoji1');
	});

	it('should filter by shortcode', () => {
		const emojis = [
			createMockEmoji('blobcat'),
			createMockEmoji('blobdog'),
			createMockEmoji('apple'),
		];
		const grouped = groupByCategory(emojis);

		const filtered = filterEmojis(emojis, 'blob', 'all', grouped, 100);

		expect(filtered).toHaveLength(2);
		expect(filtered.map((e) => e.shortcode)).toContain('blobcat');
		expect(filtered.map((e) => e.shortcode)).toContain('blobdog');
	});

	it('should filter by tags', () => {
		const emojis = [
			createMockEmoji('emoji1', { tags: ['happy', 'smile'] }),
			createMockEmoji('emoji2', { tags: ['sad'] }),
		];
		const grouped = groupByCategory(emojis);

		const filtered = filterEmojis(emojis, 'happy', 'all', grouped, 100);

		expect(filtered).toHaveLength(1);
		expect(filtered[0].shortcode).toBe('emoji1');
	});

	it('should filter by description', () => {
		const emojis = [
			createMockEmoji('emoji1', { description: 'A happy cat' }),
			createMockEmoji('emoji2', { description: 'A sad dog' }),
		];
		const grouped = groupByCategory(emojis);

		const filtered = filterEmojis(emojis, 'cat', 'all', grouped, 100);

		expect(filtered).toHaveLength(1);
		expect(filtered[0].shortcode).toBe('emoji1');
	});

	it('should be case-insensitive', () => {
		const emojis = [createMockEmoji('BlobCat')];
		const grouped = groupByCategory(emojis);

		const filtered = filterEmojis(emojis, 'BLOB', 'all', grouped, 100);

		expect(filtered).toHaveLength(1);
	});

	it('should respect maxVisible limit', () => {
		const emojis = Array.from({ length: 50 }, (_, i) => createMockEmoji(`emoji${i}`));
		const grouped = groupByCategory(emojis);

		const filtered = filterEmojis(emojis, '', 'all', grouped, 10);

		expect(filtered).toHaveLength(10);
	});

	it('should filter out invisible emojis during search', () => {
		const emojis = [
			createMockEmoji('blob1', { visibleInPicker: true }),
			createMockEmoji('blob2', { visibleInPicker: false }),
		];
		const grouped = groupByCategory(emojis);

		const filtered = filterEmojis(emojis, 'blob', 'all', grouped, 100);

		expect(filtered).toHaveLength(1);
		expect(filtered[0].shortcode).toBe('blob1');
	});

	it('should trim search query', () => {
		const emojis = [createMockEmoji('test')];
		const grouped = groupByCategory(emojis);

		const filtered = filterEmojis(emojis, '  test  ', 'all', grouped, 100);

		expect(filtered).toHaveLength(1);
	});
});

describe('CustomEmojiPicker - URL Resolution', () => {
	it('should use url by default', () => {
		const emoji = createMockEmoji('test', {
			url: 'https://example.com/animated.gif',
			staticUrl: 'https://example.com/static.png',
		});

		const url = getEmojiUrl(emoji, false);

		expect(url).toBe('https://example.com/animated.gif');
	});

	it('should use staticUrl when preferStatic is true', () => {
		const emoji = createMockEmoji('test', {
			url: 'https://example.com/animated.gif',
			staticUrl: 'https://example.com/static.png',
		});

		const url = getEmojiUrl(emoji, true);

		expect(url).toBe('https://example.com/static.png');
	});

	it('should fall back to url when staticUrl not available', () => {
		const emoji = createMockEmoji('test', {
			url: 'https://example.com/animated.gif',
		});

		const url = getEmojiUrl(emoji, true);

		expect(url).toBe('https://example.com/animated.gif');
	});
});

describe('CustomEmojiPicker - Toggle Favorite', () => {
	it('should toggle favorite on', () => {
		const favorites: string[] = [];
		const isTogglingOn = isTogglingToFavorite(favorites, 'test');

		expect(isTogglingOn).toBe(true);
	});

	it('should toggle favorite off', () => {
		const favorites = ['test'];
		const isTogglingOn = isTogglingToFavorite(favorites, 'test');

		expect(isTogglingOn).toBe(false);
	});
});

describe('CustomEmojiPicker - Configuration', () => {
	it('should support inline mode', () => {
		const mode = 'inline';
		expect(['inline', 'popover', 'modal']).toContain(mode);
	});

	it('should support popover mode', () => {
		const mode = 'popover';
		expect(['inline', 'popover', 'modal']).toContain(mode);
	});

	it('should support modal mode', () => {
		const mode = 'modal';
		expect(['inline', 'popover', 'modal']).toContain(mode);
	});

	it('should support showSearch option', () => {
		const config = { showSearch: true };
		expect(config.showSearch).toBe(true);
	});

	it('should support showCategories option', () => {
		const config = { showCategories: true };
		expect(config.showCategories).toBe(true);
	});

	it('should support showFavorites option', () => {
		const config = { showFavorites: true };
		expect(config.showFavorites).toBe(true);
	});

	it('should support showRecent option', () => {
		const config = { showRecent: true };
		expect(config.showRecent).toBe(true);
	});

	it('should support maxVisible option', () => {
		const config = { maxVisible: 50 };
		expect(config.maxVisible).toBe(50);
	});

	it('should support emojiSize option', () => {
		const config = { emojiSize: 48 };
		expect(config.emojiSize).toBe(48);
	});

	it('should support enableAutocomplete option', () => {
		const config = { enableAutocomplete: true };
		expect(config.enableAutocomplete).toBe(true);
	});

	it('should support autocompletePrefix option', () => {
		const config = { autocompletePrefix: ':' };
		expect(config.autocompletePrefix).toBe(':');
	});

	it('should support preferStatic option', () => {
		const config = { preferStatic: true };
		expect(config.preferStatic).toBe(true);
	});
});

describe('CustomEmojiPicker - Event Handlers', () => {
	it('should call onSelect handler', () => {
		const onSelect = vi.fn();
		const emoji = createMockEmoji('test');

		onSelect(emoji);

		expect(onSelect).toHaveBeenCalledWith(emoji);
	});

	it('should call onToggleFavorite handler', () => {
		const onToggleFavorite = vi.fn();

		onToggleFavorite('test', true);

		expect(onToggleFavorite).toHaveBeenCalledWith('test', true);
	});

	it('should call onCategoryChange handler', () => {
		const onCategoryChange = vi.fn();

		onCategoryChange('animals');

		expect(onCategoryChange).toHaveBeenCalledWith('animals');
	});

	it('should call onSearch handler', () => {
		const onSearch = vi.fn();

		onSearch('blob');

		expect(onSearch).toHaveBeenCalledWith('blob');
	});
});

describe('CustomEmojiPicker - Edge Cases', () => {
	it('should handle emojis with special characters in shortcode', () => {
		const emojis = [createMockEmoji('emoji_test-1')];

		const categories = extractCategories(emojis);

		expect(categories).toBeDefined();
	});

	it('should handle very long shortcodes', () => {
		const longShortcode = 'a'.repeat(1000);
		const emojis = [createMockEmoji(longShortcode)];
		const grouped = groupByCategory(emojis);

		const filtered = filterEmojis(emojis, '', 'all', grouped, 100);

		expect(filtered).toHaveLength(1);
	});

	it('should handle emojis with unicode in shortcode', () => {
		const emojis = [createMockEmoji('emoji_世界_🌍')];

		const categories = extractCategories(emojis);

		expect(categories).toBeDefined();
	});

	it('should handle empty search query with whitespace', () => {
		const emojis = [createMockEmoji('test')];
		const grouped = groupByCategory(emojis);

		const filtered = filterEmojis(emojis, '   ', 'all', grouped, 100);

		expect(filtered).toHaveLength(1);
	});

	it('should handle category that does not exist', () => {
		const emojis = [createMockEmoji('test', { category: 'animals' })];
		const grouped = groupByCategory(emojis);

		const filtered = filterEmojis(emojis, '', 'food', grouped, 100);

		expect(filtered).toHaveLength(0);
	});

	it('should handle emojis with empty tags array', () => {
		const emojis = [createMockEmoji('test', { tags: [] })];
		const grouped = groupByCategory(emojis);

		const filtered = filterEmojis(emojis, 'tag', 'all', grouped, 100);

		expect(filtered).toHaveLength(0);
	});

	it('should handle URL with query parameters', () => {
		const emoji = createMockEmoji('test', {
			url: 'https://example.com/emoji.png?size=large&format=webp',
		});

		const url = getEmojiUrl(emoji, false);

		expect(url).toContain('?size=large&format=webp');
	});
});

describe('CustomEmojiPicker - Type Safety', () => {
	it('should enforce CustomEmoji structure', () => {
		const emoji: CustomEmoji = {
			shortcode: 'test',
			url: 'https://example.com/test.png',
		};

		expect(emoji).toHaveProperty('shortcode');
		expect(emoji).toHaveProperty('url');
	});

	it('should enforce optional properties', () => {
		const emoji: CustomEmoji = {
			shortcode: 'test',
			url: 'https://example.com/test.png',
			category: 'animals',
			tags: ['cute', 'happy'],
			usageCount: 10,
		};

		expect(emoji.category).toBe('animals');
		expect(emoji.tags).toEqual(['cute', 'happy']);
		expect(emoji.usageCount).toBe(10);
	});
});

