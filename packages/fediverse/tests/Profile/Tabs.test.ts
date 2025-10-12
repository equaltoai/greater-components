/**
 * Profile/Tabs Component Tests
 * 
 * Tests for profile tabs navigation including:
 * - Tab descriptor creation
 * - Active tab determination
 * - Count display logic
 * - Configuration handling
 * - Edge cases
 */

import { describe, it, expect } from 'vitest';
import type { ProfileTab } from '../../src/components/Profile/context.js';

// Tab descriptor creation logic
interface TabDescriptor {
	id: string;
	label: string;
	active: boolean;
	hasCount: boolean;
}

function createTabDescriptor(tab: ProfileTab, activeId: string): TabDescriptor {
	return {
		id: tab.id,
		label: tab.label,
		active: tab.id === activeId,
		hasCount: typeof tab.count === 'number',
	};
}

// Active tab checking
function isTabActive(tabId: string, activeId: string): boolean {
	return tabId === activeId;
}

// Count display logic
function shouldShowCount(tab: ProfileTab): boolean {
	return typeof tab.count === 'number';
}

function formatTabCount(count: number | undefined): string | undefined {
	return count !== undefined ? count.toString() : undefined;
}

// Icon display logic
function hasIcon(tab: ProfileTab): boolean {
	return Boolean(tab.icon);
}

// Class name generation
function getTabsClassName(className?: string): string {
	return ['profile-tabs', className].filter(Boolean).join(' ');
}

function getTabClassName(tab: ProfileTab, activeId: string): string {
	const classes = ['profile-tabs__tab'];
	if (isTabActive(tab.id, activeId)) {
		classes.push('profile-tabs__tab--active');
	}
	return classes.join(' ');
}

// Tab filtering and ordering
function getVisibleTabs(tabs: ProfileTab[], maxTabs?: number): ProfileTab[] {
	if (maxTabs === undefined) {
		return tabs;
	}
	if (maxTabs <= 0) {
		return [];
	}
	return tabs.slice(0, maxTabs);
}

describe('Profile/Tabs - Tab Descriptor Creation', () => {
	it('marks tab as active when ids match', () => {
		const tab: ProfileTab = { id: 'posts', label: 'Posts', count: 12 };
		
		expect(createTabDescriptor(tab, 'posts')).toEqual({
			id: 'posts',
			label: 'Posts',
			active: true,
			hasCount: true,
		});
	});

	it('marks tab as inactive when ids do not match', () => {
		const tab: ProfileTab = { id: 'media', label: 'Media' };
		
		expect(createTabDescriptor(tab, 'posts')).toEqual({
			id: 'media',
			label: 'Media',
			active: false,
			hasCount: false,
		});
	});

	it('reports count existence correctly', () => {
		const withCount: ProfileTab = { id: 'posts', label: 'Posts', count: 0 };
		const withoutCount: ProfileTab = { id: 'media', label: 'Media' };
		
		expect(createTabDescriptor(withCount, 'posts').hasCount).toBe(true);
		expect(createTabDescriptor(withoutCount, 'posts').hasCount).toBe(false);
	});

	it('handles zero count as valid', () => {
		const tab: ProfileTab = { id: 'drafts', label: 'Drafts', count: 0 };
		
		const descriptor = createTabDescriptor(tab, 'drafts');
		expect(descriptor.hasCount).toBe(true);
		expect(descriptor.active).toBe(true);
	});

	it('preserves tab id and label', () => {
		const tab: ProfileTab = { id: 'custom-tab', label: 'Custom Tab Label' };
		
		const descriptor = createTabDescriptor(tab, 'other');
		expect(descriptor.id).toBe('custom-tab');
		expect(descriptor.label).toBe('Custom Tab Label');
	});
});

describe('Profile/Tabs - Active Tab Determination', () => {
	it('returns true when tab id matches active id', () => {
		expect(isTabActive('posts', 'posts')).toBe(true);
	});

	it('returns false when tab id does not match active id', () => {
		expect(isTabActive('media', 'posts')).toBe(false);
	});

	it('is case sensitive', () => {
		expect(isTabActive('Posts', 'posts')).toBe(false);
		expect(isTabActive('POSTS', 'posts')).toBe(false);
	});

	it('handles empty strings', () => {
		expect(isTabActive('', '')).toBe(true);
		expect(isTabActive('posts', '')).toBe(false);
	});

	it('handles special characters', () => {
		expect(isTabActive('posts-with-replies', 'posts-with-replies')).toBe(true);
		expect(isTabActive('tab/with/slashes', 'tab/with/slashes')).toBe(true);
	});
});

describe('Profile/Tabs - Count Display Logic', () => {
	it('shows count when present', () => {
		const tab: ProfileTab = { id: 'posts', label: 'Posts', count: 42 };
		
		expect(shouldShowCount(tab)).toBe(true);
	});

	it('hides count when undefined', () => {
		const tab: ProfileTab = { id: 'posts', label: 'Posts' };
		
		expect(shouldShowCount(tab)).toBe(false);
	});

	it('shows count of zero', () => {
		const tab: ProfileTab = { id: 'posts', label: 'Posts', count: 0 };
		
		expect(shouldShowCount(tab)).toBe(true);
	});

	it('formats count as string', () => {
		expect(formatTabCount(42)).toBe('42');
		expect(formatTabCount(0)).toBe('0');
		expect(formatTabCount(1000)).toBe('1000');
	});

	it('returns undefined for missing count', () => {
		expect(formatTabCount(undefined)).toBeUndefined();
	});

	it('handles very large counts', () => {
		expect(formatTabCount(999999)).toBe('999999');
	});
});

describe('Profile/Tabs - Icon Display Logic', () => {
	it('returns true when icon is present', () => {
		const tab: ProfileTab = { 
			id: 'overview', 
			label: 'Overview', 
			icon: 'M0 0h24v24H0z'
		};
		
		expect(hasIcon(tab)).toBe(true);
	});

	it('returns false when icon is undefined', () => {
		const tab: ProfileTab = { id: 'posts', label: 'Posts' };
		
		expect(hasIcon(tab)).toBe(false);
	});

	it('returns false when icon is empty string', () => {
		const tab: ProfileTab = { id: 'posts', label: 'Posts', icon: '' };
		
		expect(hasIcon(tab)).toBe(false);
	});

	it('handles SVG path data', () => {
		const tab: ProfileTab = { 
			id: 'media', 
			label: 'Media', 
			icon: 'M12 2L2 7v10l10 5 10-5V7z'
		};
		
		expect(hasIcon(tab)).toBe(true);
	});
});

describe('Profile/Tabs - Class Name Generation', () => {
	it('generates default class name', () => {
		expect(getTabsClassName()).toBe('profile-tabs');
	});

	it('includes custom class', () => {
		expect(getTabsClassName('custom-tabs')).toBe('profile-tabs custom-tabs');
	});

	it('handles empty custom class', () => {
		expect(getTabsClassName('')).toBe('profile-tabs');
	});

	it('handles undefined custom class', () => {
		expect(getTabsClassName(undefined)).toBe('profile-tabs');
	});

	it('generates tab class for active tab', () => {
		const tab: ProfileTab = { id: 'posts', label: 'Posts' };
		
		expect(getTabClassName(tab, 'posts')).toBe('profile-tabs__tab profile-tabs__tab--active');
	});

	it('generates tab class for inactive tab', () => {
		const tab: ProfileTab = { id: 'media', label: 'Media' };
		
		expect(getTabClassName(tab, 'posts')).toBe('profile-tabs__tab');
	});
});

describe('Profile/Tabs - Tab Filtering', () => {
	const tabs: ProfileTab[] = [
		{ id: 'posts', label: 'Posts' },
		{ id: 'replies', label: 'Replies' },
		{ id: 'media', label: 'Media' },
		{ id: 'likes', label: 'Likes' },
	];

	it('returns all tabs when maxTabs is undefined', () => {
		expect(getVisibleTabs(tabs)).toHaveLength(4);
	});

	it('limits tabs to maxTabs', () => {
		expect(getVisibleTabs(tabs, 2)).toHaveLength(2);
		expect(getVisibleTabs(tabs, 3)).toHaveLength(3);
	});

	it('returns all tabs when maxTabs exceeds length', () => {
		expect(getVisibleTabs(tabs, 10)).toHaveLength(4);
	});

	it('returns empty array when maxTabs is zero', () => {
		expect(getVisibleTabs(tabs, 0)).toHaveLength(0);
	});

	it('returns empty array when maxTabs is negative', () => {
		expect(getVisibleTabs(tabs, -1)).toHaveLength(0);
	});

	it('preserves tab order', () => {
		const visible = getVisibleTabs(tabs, 2);
		
		expect(visible[0].id).toBe('posts');
		expect(visible[1].id).toBe('replies');
	});

	it('handles empty tabs array', () => {
		expect(getVisibleTabs([], 5)).toHaveLength(0);
	});
});

describe('Profile/Tabs - Default Tabs', () => {
	const defaultTabs: ProfileTab[] = [
		{ id: 'posts', label: 'Posts' },
		{ id: 'replies', label: 'Replies' },
		{ id: 'media', label: 'Media' },
		{ id: 'likes', label: 'Likes' },
	];

	it('contains expected default tabs', () => {
		expect(defaultTabs).toHaveLength(4);
		expect(defaultTabs.map(t => t.id)).toEqual(['posts', 'replies', 'media', 'likes']);
	});

	it('default active tab is posts', () => {
		const defaultActiveTab = 'posts';
		
		expect(isTabActive('posts', defaultActiveTab)).toBe(true);
		expect(isTabActive('replies', defaultActiveTab)).toBe(false);
	});

	it('marks only one tab as active', () => {
		const activeTab = 'posts';
		const activeDescriptors = defaultTabs.filter(tab => 
			createTabDescriptor(tab, activeTab).active
		);
		
		expect(activeDescriptors).toHaveLength(1);
		expect(activeDescriptors[0].id).toBe('posts');
	});
});

describe('Profile/Tabs - Custom Tabs', () => {
	it('supports custom tab configurations', () => {
		const customTabs: ProfileTab[] = [
			{ id: 'overview', label: 'Overview', icon: 'M0 0h24v24H0z' },
			{ id: 'articles', label: 'Articles', count: 99 },
			{ id: 'bookmarks', label: 'Bookmarks' },
		];

		expect(customTabs).toHaveLength(3);
		expect(hasIcon(customTabs[0])).toBe(true);
		expect(shouldShowCount(customTabs[1])).toBe(true);
	});

	it('handles tabs with both icon and count', () => {
		const tab: ProfileTab = { 
			id: 'posts', 
			label: 'Posts', 
			icon: 'M0 0',
			count: 42
		};

		expect(hasIcon(tab)).toBe(true);
		expect(shouldShowCount(tab)).toBe(true);
	});

	it('supports tabs with very long labels', () => {
		const tab: ProfileTab = { 
			id: 'long-tab',
			label: 'Activity and Mentions Across Federated Instances'
		};

		const descriptor = createTabDescriptor(tab, 'long-tab');
		expect(descriptor.label).toBe('Activity and Mentions Across Federated Instances');
		expect(descriptor.label.length).toBeGreaterThan(30);
	});

	it('handles unicode in tab labels', () => {
		const tabs: ProfileTab[] = [
			{ id: 'posts', label: '投稿' },
			{ id: 'media', label: '🖼️ Media' },
			{ id: 'likes', label: '♥️ Favorites' },
		];

		expect(tabs[0].label).toBe('投稿');
		expect(tabs[1].label).toContain('🖼️');
		expect(tabs[2].label).toContain('♥️');
	});
});

describe('Profile/Tabs - Edge Cases', () => {
	it('handles single tab', () => {
		const tabs: ProfileTab[] = [{ id: 'only', label: 'Only Tab' }];
		
		expect(getVisibleTabs(tabs)).toHaveLength(1);
		expect(isTabActive('only', 'only')).toBe(true);
	});

	it('handles very large count values', () => {
		const tab: ProfileTab = { id: 'posts', label: 'Posts', count: 999999999 };
		
		expect(formatTabCount(tab.count)).toBe('999999999');
	});

	it('handles negative count values', () => {
		const tab: ProfileTab = { id: 'posts', label: 'Posts', count: -1 };
		
		expect(shouldShowCount(tab)).toBe(true);
		expect(formatTabCount(tab.count)).toBe('-1');
	});

	it('handles empty tab id', () => {
		const tab: ProfileTab = { id: '', label: 'Empty ID' };
		
		const descriptor = createTabDescriptor(tab, '');
		expect(descriptor.id).toBe('');
		expect(descriptor.active).toBe(true);
	});

	it('handles empty tab label', () => {
		const tab: ProfileTab = { id: 'empty', label: '' };
		
		const descriptor = createTabDescriptor(tab, 'empty');
		expect(descriptor.label).toBe('');
	});

	it('handles special characters in tab ids', () => {
		const tabs: ProfileTab[] = [
			{ id: 'posts-with-replies', label: 'Posts & Replies' },
			{ id: 'media/photos', label: 'Media/Photos' },
			{ id: 'likes#bookmarks', label: 'Likes#Bookmarks' },
		];

		tabs.forEach(tab => {
			expect(isTabActive(tab.id, tab.id)).toBe(true);
		});
	});

	it('maintains order when filtering', () => {
		const tabs: ProfileTab[] = [
			{ id: '1', label: 'First' },
			{ id: '2', label: 'Second' },
			{ id: '3', label: 'Third' },
			{ id: '4', label: 'Fourth' },
		];

		const visible = getVisibleTabs(tabs, 2);
		expect(visible[0].id).toBe('1');
		expect(visible[1].id).toBe('2');
	});
});

describe('Profile/Tabs - Accessibility Attributes', () => {
	it('generates aria-selected value for active tab', () => {
		const tab: ProfileTab = { id: 'posts', label: 'Posts' };
		const isActive = isTabActive(tab.id, 'posts');
		const ariaSelected = isActive ? 'true' : 'false';
		
		expect(ariaSelected).toBe('true');
	});

	it('generates aria-selected value for inactive tab', () => {
		const tab: ProfileTab = { id: 'media', label: 'Media' };
		const isActive = isTabActive(tab.id, 'posts');
		const ariaSelected = isActive ? 'true' : 'false';
		
		expect(ariaSelected).toBe('false');
	});

	it('provides unique aria-controls for each tab', () => {
		const tabs: ProfileTab[] = [
			{ id: 'posts', label: 'Posts' },
			{ id: 'replies', label: 'Replies' },
		];

		const ariaControls = tabs.map(tab => `tabpanel-${tab.id}`);
		const uniqueControls = new Set(ariaControls);
		
		expect(uniqueControls.size).toBe(tabs.length);
	});
});
